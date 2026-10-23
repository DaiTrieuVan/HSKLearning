package com.hsk.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.flyway.autoconfigure.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Ensures Flyway automatically repairs failed migrations or checksum mismatches before migrating.
 * This prevents deployment halts when previous migration attempts failed on non-transactional DDL databases like MySQL.
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(prefix = "spring.flyway", name = "enabled", matchIfMissing = true)
public class FlywayConfig {

	private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

	@Bean
	public FlywayMigrationStrategy repairAndMigrateStrategy() {
		return flyway -> {
			log.info("==> [Flyway] Executing repair() to clean up failed migrations and re-align checksums...");
			flyway.repair();
			log.info("==> [Flyway] Executing migrate()...");
			flyway.migrate();
			log.info("==> [Flyway] Migration completed successfully.");
		};
	}
}
