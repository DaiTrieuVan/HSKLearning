package com.hsk.aiassistant.config;

import java.time.Clock;
import java.time.ZoneId;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình Spring Beans cho module Trợ lý AI (HTT-10-CN-004).
 */
@Configuration(proxyBeanMethods = false)
public class AiAssistantConfig {

    public static final ZoneId ZONE_VN = ZoneId.of("Asia/Ho_Chi_Minh");

    @Bean
    @ConditionalOnMissingBean(Clock.class)
    public Clock clock() {
        return Clock.system(ZONE_VN);
    }
}
