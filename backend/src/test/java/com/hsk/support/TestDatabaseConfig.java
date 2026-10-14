package com.hsk.support;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.flyway.autoconfigure.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Makes the test schema deterministic.
 *
 * <p>Agreed approach A: tests run against the local MySQL instance (no Docker), using the
 * dedicated {@code hsk_learning_test} schema. Cleaning the whole schema on every run is safe here
 * because Flyway owns that schema exclusively and nothing else writes to it.
 */
@Configuration(proxyBeanMethods = false)
@Profile("test")
public class TestDatabaseConfig {

	private static final Logger log = LoggerFactory.getLogger(TestDatabaseConfig.class);

	@Bean
	public FlywayMigrationStrategy cleanMigrateStrategy() {
		return flyway -> {
			log.info("Test profile: dropping and re-creating all test schema objects");
			flyway.clean();
			flyway.migrate();
		};
	}
}
