package com.hsk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the HSK learning platform backend.
 *
 * <p>Package layout follows the bounded areas of the logical ERD
 * ({@code docs/Thuyet_Minh_Logical_ERD_Hoc_Tieng_Trung.docx}):
 * {@code common} for cross-cutting REST contracts, {@code account} for users and roles,
 * {@code classroom} for classes, {@code content} for HSK learning material,
 * and later {@code assessment} for questions, assignments and grading.
 */
@SpringBootApplication
public class HskApplication {

	public static void main(String[] args) {
		SpringApplication.run(HskApplication.class, args);
	}

}
