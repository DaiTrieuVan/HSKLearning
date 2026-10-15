-- V8__create_vocab_learning_tables.sql
-- Epic HTT-04: HTT-04-CN-005 Học từ vựng bằng flashcard

CREATE TABLE IF NOT EXISTS vocab_learning (
    user_id BIGINT NOT NULL,
    vocabulary_id BIGINT NOT NULL,
    last_result VARCHAR(20) NOT NULL,
    repetition_level INT NOT NULL DEFAULT 1,
    interval_days INT NOT NULL DEFAULT 1,
    ease_factor DOUBLE NOT NULL DEFAULT 2.5,
    next_review_at TIMESTAMP NULL,
    review_count INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vocabulary_id),
    CONSTRAINT fk_vl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vl_vocab FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE,
    INDEX idx_vl_user (user_id),
    INDEX idx_vl_vocab (vocabulary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Seed additional 8 vocabularies for HSK 1 to reach 10 words for Lesson 1 (TC-01, TC-03: Bài 1 có 10 từ)
INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '我', 'wǒ', 'Tôi, tao, mình (đại từ ngôi thứ 1)', 'pronoun', '我是学生。', 'Wǒ shì xuésheng.', 'Tôi là học sinh.', id, NULL, 'SHARED_我_wǒ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '他', 'tā', 'Anh ấy, ông ấy, cậu ấy', 'pronoun', '他是老师。', 'Tā shì lǎoshī.', 'Anh ấy là giáo viên.', id, NULL, 'SHARED_他_tā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '她', 'tā', 'Cô ấy, bà ấy, chị ấy', 'pronoun', '她很好。', 'Tā hěn hǎo.', 'Cô ấy rất tốt.', id, NULL, 'SHARED_她_tā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '们', 'men', 'Các, chúng (hậu tố số nhiều)', 'affix', '我们都是学生。', 'Wǒmen dōu shì xuésheng.', 'Chúng tôi đều là học sinh.', id, NULL, 'SHARED_们_men'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '不', 'bù', 'Không, chẳng (phủ định)', 'adverb', '我不去。', 'Wǒ bù qù.', 'Tôi không đi.', id, NULL, 'SHARED_不_bù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '很', 'hěn', 'Rất, lắm, quá', 'adverb', '汉语很好。', 'Hànyǔ hěn hǎo.', 'Tiếng Hán rất hay.', id, NULL, 'SHARED_很_hěn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '是', 'shì', 'Là, phải, đúng', 'verb', '这是书。', 'Zhè shì shū.', 'Đây là sách.', id, NULL, 'SHARED_是_shì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吗', 'ma', 'Không, à, ư (trợ từ nghi vấn)', 'particle', '你好吗？', 'Nǐ hǎo ma?', 'Bạn khỏe không?', id, NULL, 'SHARED_吗_ma'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

-- Attach vocabularies to Lesson 1 (sort_order 1..10)
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '你';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '好';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '我';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '他';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '她';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '们';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '不';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '很';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '是';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10 FROM lessons l, vocabularies v WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '吗';
