package com.hsk.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables {@code @CreatedDate} / {@code @LastModifiedDate} support, used by {@code UserEntity}
 * and {@code UserRoleEntity} so audit columns are filled by JPA instead of by application code.
 */
@Configuration(proxyBeanMethods = false)
@EnableJpaAuditing
public class JpaConfig {
}
