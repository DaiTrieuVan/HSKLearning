package com.hsk.material.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Giới hạn luồng đồng thời khi kết xuất PDF/PPTX sang ảnh PNG để bảo vệ RAM JVM.
 */
@Configuration
@EnableAsync
public class MaterialAsyncConfig {

	@Bean(name = "materialRenderExecutor")
	public Executor materialRenderExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(2);
		executor.setMaxPoolSize(2);
		executor.setQueueCapacity(50);
		executor.setThreadNamePrefix("material-render-");
		executor.initialize();
		return executor;
	}
}
