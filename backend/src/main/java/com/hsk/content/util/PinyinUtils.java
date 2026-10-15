package com.hsk.content.util;

import java.text.Normalizer;

public final class PinyinUtils {

	private PinyinUtils() {
	}

	/**
	 * Normalizes pinyin text into an accent-free, lowercase, whitespace-free string
	 * for fast, reliable search matching (e.g. "nǐ hǎo" -> "nihao", "Nǐ Hǎo" -> "nihao").
	 */
	public static String normalizeForSearch(String pinyin) {
		if (pinyin == null || pinyin.isBlank()) {
			return "";
		}
		// 1. Decompose accented characters into base letters + combining diacritical marks
		String decomposed = Normalizer.normalize(pinyin, Normalizer.Form.NFD);
		// 2. Remove all diacritical marks
		String withoutAccents = decomposed.replaceAll("\\p{M}", "");
		// 3. Normalize special pinyin characters like ü, v, ê
		withoutAccents = withoutAccents.replace("ü", "u").replace("Ü", "u")
				.replace("v", "u").replace("V", "u")
				.replace("ê", "e").replace("Ê", "e");
		// 4. Remove all whitespace, punctuation, and lowercase
		return withoutAccents.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
	}
}
