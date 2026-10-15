package com.hsk.question.domain;

/**
 * Định dạng câu hỏi trắc nghiệm sinh tự động từ bộ từ vựng (HTT-05-CN-004).
 */
public enum QuestionFormat {
	/** Hỏi nghĩa tiếng Việt của chữ Hán: Từ "你好" (nǐ hǎo) có nghĩa là gì? */
	HANZI_TO_MEANING,

	/** Hỏi chữ Hán theo nghĩa tiếng Việt: Từ nào dưới đây có nghĩa là "Xin chào"? */
	MEANING_TO_HANZI,

	/** Hỏi pinyin của chữ Hán: Phiên âm pinyin của từ "你好" là gì? */
	HANZI_TO_PINYIN
}
