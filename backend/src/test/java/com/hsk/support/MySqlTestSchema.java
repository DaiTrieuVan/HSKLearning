package com.hsk.support;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Tells JUnit whether the local MySQL test schema is actually reachable.
 *
 * <p>Development machines are not uniform: some have no MySQL provisioned yet. These API tests are
 * the ones that verify the real migration, so they should run when the database exists, and be
 * skipped with a clear message when it does not, rather than breaking the build.
 */
public final class MySqlTestSchema {

	private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/hsk_learning_test"
			+ "?sslMode=DISABLED&allowPublicKeyRetrieval=true&connectionTimeZone=UTC";

	private MySqlTestSchema() {
	}

	/** Referenced by {@code @EnabledIf}; evaluated before the Spring context is created. */
	public static boolean isReachable() {
		Properties env = dotenv();
		String url = env.getProperty("TEST_DB_URL", env.getProperty("DB_URL", DEFAULT_URL));
		String username = env.getProperty("TEST_DB_USERNAME", env.getProperty("DB_USERNAME", "hsk_app"));
		String password = env.getProperty("TEST_DB_PASSWORD", env.getProperty("DB_PASSWORD", ""));
		try (Connection connection = DriverManager.getConnection(url, username, password)) {
			return connection.isValid(2);
		}
		catch (SQLException ex) {
			System.out.println("[SKIPPED] MySQL API tests: cannot reach the test schema (" + url + ") - "
					+ ex.getMessage());
			System.out.println("[SKIPPED] Run database/setup-local.sql once and fill backend/.env, "
					+ "then re-run: cd backend && .\\mvnw.cmd test");
			return false;
		}
	}

	/** Minimal parser for backend/.env, kept out of the production code path. */
	private static Properties dotenv() {
		Properties properties = new Properties();
		for (Path candidate : new Path[] { Path.of(".env"), Path.of("backend", ".env") }) {
			if (!Files.isRegularFile(candidate)) {
				continue;
			}
			try (InputStream in = Files.newInputStream(candidate)) {
				properties.load(in);
			}
			catch (IOException ex) {
				System.out.println("[WARN] Could not read " + candidate + ": " + ex.getMessage());
			}
		}
		return properties;
	}
}
