-- V9__add_pinyin_search_to_vocabularies.sql
-- Epic HTT-04: HTT-04-CN-006 Tra cứu từ vựng

ALTER TABLE vocabularies ADD COLUMN pinyin_search VARCHAR(150) NULL AFTER pinyin;
CREATE INDEX idx_vocab_pinyin_search ON vocabularies (pinyin_search);

-- Seed composite vocabulary "你好" (nǐ hǎo - Xin chào) into Lesson 1 for TC-01, TC-02, TC-03
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '你好', 'nǐ hǎo', 'nihao', 'Xin chào', 'phrase', '你好！很高兴认识你。', 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', 'Xin chào! Rất vui được làm quen với bạn.', id, NULL, 'SHARED_你好_nǐ hǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = 'nihao';

-- Attach '你好' to Lesson 1 if not exists
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v
WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '你好';

-- Đồng bộ pinyin_search cho toàn bộ từ vựng hiện có
UPDATE vocabularies SET pinyin_search = 'ni' WHERE hanzi = '你';
UPDATE vocabularies SET pinyin_search = 'hao' WHERE hanzi = '好';
UPDATE vocabularies SET pinyin_search = 'nihao' WHERE hanzi = '你好';
UPDATE vocabularies SET pinyin_search = 'xiexie' WHERE hanzi = '谢谢';
UPDATE vocabularies SET pinyin_search = 'zaijian' WHERE hanzi = '再见';
UPDATE vocabularies SET pinyin_search = 'wo' WHERE hanzi = '我';
UPDATE vocabularies SET pinyin_search = 'ta' WHERE hanzi IN ('他', '她');
UPDATE vocabularies SET pinyin_search = 'men' WHERE hanzi = '们';
UPDATE vocabularies SET pinyin_search = 'bu' WHERE hanzi = '不';
UPDATE vocabularies SET pinyin_search = 'hen' WHERE hanzi = '很';
UPDATE vocabularies SET pinyin_search = 'shi' WHERE hanzi = '是';
UPDATE vocabularies SET pinyin_search = 'ma' WHERE hanzi = '吗';
