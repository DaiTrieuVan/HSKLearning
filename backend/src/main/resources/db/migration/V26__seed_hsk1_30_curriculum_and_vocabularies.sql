-- ============================================================================
-- V26__seed_hsk1_30_curriculum_and_vocabularies.sql
-- Chuẩn HSK 3.0: Cập nhật mục tiêu HSK 1 lên 500 từ và nạp 20 bài học chuẩn.
-- ============================================================================

-- 1. Cập nhật mục tiêu HSK 1 lên 500 từ
UPDATE hsk_levels SET target_vocab_count = 500 WHERE code = 'HSK_1';

-- 2. Nạp danh mục 20 bài học theo chủ đề đời sống cho HSK 1
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 1: 你好！Chào bạn!', 'Học cách chào hỏi cơ bản, làm quen và đại từ nhân xưng', 1
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 2: 谢谢你！Cảm ơn bạn!', 'Học cách cảm ơn, xin lỗi, các phép lịch sự xã giao', 2
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 3: 你叫什么名字？Bạn tên gì?', 'Hỏi tên, họ, cách xưng hô và làm quen bạn mới', 3
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 4: 你是哪国人？Bạn là người nước nào?', 'Quốc tịch, các quốc gia, ngôn ngữ và quê hương', 4
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 5: 一二三四五！Học đếm số', 'Số đếm từ 0 đến 100, số phòng, số điện thoại', 5
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 6: 今天几月几号？Hôm nay ngày mấy?', 'Ngày, tháng, năm, thứ trong tuần và sinh nhật', 6
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 7: 现在几点？Bây giờ là mấy giờ?', 'Giờ giấc, các buổi trong ngày và thời gian biểu', 7
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 8: 我家有五口人。Nhà tôi có 5 người', 'Gia đình, người thân, nghề nghiệp và tuổi tác', 8
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 9: 你想吃什么？Bạn muốn ăn gì?', 'Món ăn, đồ uống, bữa ăn trong ngày và khẩu vị', 9
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 10: 这个多少钱？Cái này bao nhiêu tiền?', 'Mua sắm đồ đạc, hỏi giá, tiền tệ và thanh toán', 10
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 11: 我在学校。Tôi ở trường học', 'Địa điểm, phòng ốc, đồ dùng học tập và vị trí', 11
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 12: 往前走。Đi về phía trước', 'Phương hướng, chỉ đường, phương tiện giao thông', 12
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 13: 今天天气怎么样？Thời tiết thế nào?', 'Thời tiết, nhiệt độ, các mùa trong năm', 13
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 14: 你在做什么？Bạn đang làm gì thế?', 'Các hoạt động thường ngày, thói quen và kỹ năng', 14
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 15: 他身体很好。Sức khỏe anh ấy rất tốt', 'Sức khỏe, bộ phận cơ thể và cảm giác thể chất', 15
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 16: 你的爱好是什么？Sở thích của bạn là gì?', 'Thể thao, âm nhạc, phim ảnh và giải trí', 16
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 17: 买衣服。Mua sắm quần áo', 'Trang phục, màu sắc, kích cỡ và thử đồ', 17
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 18: 我去过北京。Tôi từng đi Bắc Kinh', 'Trải nghiệm du lịch, địa danh và phong cảnh', 18
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 19: 请帮我一下。Xin hãy giúp tôi một chút', 'Nhờ vả, thỉnh cầu lịch sự và giao tiếp công việc', 19
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 20: 考试与总结。Ôn tập & Tổng kết HSK 1', 'Tổng kết kiến thức ngữ pháp, từ vựng và tự tin thi đạt HSK 1', 20
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);

-- 3. Nạp 500 từ vựng cốt lõi chuẩn HSK 3.0 và liên kết vào bài học

-- --- BÀI 1 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '你', 'nǐ', 'ni', 'bạn, anh, chị (ngôi thứ 2)', 'pronoun', '你好！', 'Nǐ hǎo!', 'Chào bạn!', id, NULL, 'SHARED_你_nǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_你_nǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好', 'hǎo', 'hao', 'tốt, khỏe, hay', 'adjective', '今天天气很好。', 'Jīntiān tiānqì hěn hǎo.', 'Hôm nay thời tiết rất đẹp.', id, NULL, 'SHARED_好_hǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_好_hǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '你好', 'nǐ hǎo', 'nihao', 'xin chào', 'phrase', '你好！很高兴认识你。', 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', 'Xin chào! Rất vui được quen biết bạn.', id, NULL, 'SHARED_你好_nǐ hǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_你好_nǐ hǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '您', 'nín', 'nin', 'ngài, ông, bà (kính ngữ)', 'pronoun', '老师，您好！', 'Lǎoshī, nín hǎo!', 'Thưa thầy, chào thầy ạ!', id, NULL, 'SHARED_您_nín'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_您_nín';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '我', 'wǒ', 'wo', 'tôi, mình (ngôi thứ 1)', 'pronoun', '我是学生。', 'Wǒ shì xuésheng.', 'Tôi là học sinh.', id, NULL, 'SHARED_我_wǒ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_我_wǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '他', 'tā', 'ta', 'anh ấy, ông ấy', 'pronoun', '他是我的好朋友。', 'Tā shì wǒ de hǎo péngyou.', 'Anh ấy là bạn thân của tôi.', id, NULL, 'SHARED_他_tā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_他_tā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '她', 'tā', 'ta', 'cô ấy, chị ấy', 'pronoun', '她是汉语老师。', 'Tā shì Hànyǔ lǎoshī.', 'Cô ấy là giáo viên tiếng Trung.', id, NULL, 'SHARED_她_tā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_她_tā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '它', 'tā', 'ta', 'nó (chỉ con vật, đồ vật)', 'pronoun', '它是一只可爱的小猫。', 'Tā shì yì zhī kě''ài de xiǎomāo.', 'Nó là một chú mèo con đáng yêu.', id, NULL, 'SHARED_它_tā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_它_tā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '们', 'men', 'men', 'các, chúng (hậu tố số nhiều)', 'suffix', '我们都是好朋友。', 'Wǒmen dōu shì hǎo péngyou.', 'Chúng tôi đều là bạn tốt.', id, NULL, 'SHARED_们_men'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_们_men';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '我们', 'wǒmen', 'women', 'chúng tôi, chúng ta', 'pronoun', '我们一起去学习吧。', 'Wǒmen yìqǐ qù xuéxí ba.', 'Chúng ta cùng đi học nhé.', id, NULL, 'SHARED_我们_wǒmen'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_我们_wǒmen';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '你们', 'nǐmen', 'nimen', 'các bạn, các anh, các chị', 'pronoun', '你们好！', 'Nǐmen hǎo!', 'Chào các bạn!', id, NULL, 'SHARED_你们_nǐmen'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_你们_nǐmen';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '他们', 'tāmen', 'tamen', 'họ, các anh ấy', 'pronoun', '他们都在看书。', 'Tāmen dōu zài kànshū.', 'Họ đều đang đọc sách.', id, NULL, 'SHARED_他们_tāmen'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_他们_tāmen';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '她们', 'tāmen', 'tamen', 'họ, các cô ấy', 'pronoun', '她们喜欢听音乐。', 'Tāmen xǐhuan tīng yīnyuè.', 'Các cô ấy thích nghe nhạc.', id, NULL, 'SHARED_她们_tāmen'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_她们_tāmen';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '大家', 'dàjiā', 'dajia', 'mọi người, cả nhà', 'pronoun', '大家好！', 'Dàjiā hǎo!', 'Chào mọi người!', id, NULL, 'SHARED_大家_dàjiā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_大家_dàjiā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '人', 'rén', 'ren', 'người, nhân loại', 'noun', '他是好人。', 'Tā shì hǎo rén.', 'Anh ấy là người tốt.', id, NULL, 'SHARED_人_rén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_人_rén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '大人', 'dàren', 'daren', 'người lớn', 'noun', '大人都在这里。', 'Dàren dōu zài zhèlǐ.', 'Người lớn đều ở đây.', id, NULL, 'SHARED_大人_dàren'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_大人_dàren';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '朋友', 'péngyou', 'pengyou', 'bạn bè, bạn', 'noun', '我们是好朋友。', 'Wǒmen shì hǎo péngyou.', 'Chúng tôi là bạn tốt.', id, NULL, 'SHARED_朋友_péngyou'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_朋友_péngyou';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '见', 'jiàn', 'jian', 'gặp, thấy', 'verb', '很高兴见到你。', 'Hěn gāoxìng jiàndào nǐ.', 'Rất vui được gặp bạn.', id, NULL, 'SHARED_见_jiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_见_jiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '再见', 'zàijiàn', 'zaijian', 'tạm biệt, hẹn gặp lại', 'phrase', '明天见，再见！', 'Míngtiān jiàn, zàijiàn!', 'Mai gặp, tạm biệt!', id, NULL, 'SHARED_再见_zàijiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_再见_zàijiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '在', 'zài', 'zai', 'ở, tại, đang', 'preposition', '我在这里。', 'Wǒ zài zhèlǐ.', 'Tôi ở đây.', id, NULL, 'SHARED_在_zài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_在_zài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '这', 'zhè', 'zhe', 'đây, này', 'pronoun', '这是我的书。', 'Zhè shì wǒ de shū.', 'Đây là sách của tôi.', id, NULL, 'SHARED_这_zhè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_这_zhè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '那', 'nà', 'na', 'kia, đó', 'pronoun', '那是学校。', 'Nà shì xuéxiào.', 'Kia là trường học.', id, NULL, 'SHARED_那_nà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_那_nà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '这儿', 'zhèr', 'zher', 'ở đây, chỗ này', 'pronoun', '请坐这儿。', 'Qǐng zuò zhèr.', 'Xin mời ngồi ở đây.', id, NULL, 'SHARED_这儿_zhèr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_这儿_zhèr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '那儿', 'nàr', 'nar', 'ở kia, chỗ kia', 'pronoun', '他在那儿。', 'Tā zài nàr.', 'Anh ấy ở đằng kia.', id, NULL, 'SHARED_那儿_nàr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_那儿_nàr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '是', 'shì', 'shi', 'là, đúng, phải', 'verb', '他是老师。', 'Tā shì lǎoshī.', 'Ông ấy là giáo viên.', id, NULL, 'SHARED_是_shì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_是_shì';

-- --- BÀI 2 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '谢', 'xiè', 'xie', 'cảm ơn', 'verb', '十分感谢！', 'Shífēn gǎnxiè!', 'Vô cùng cảm ơn!', id, NULL, 'SHARED_谢_xiè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_谢_xiè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '谢谢', 'xièxie', 'xiexie', 'cảm ơn', 'verb', '谢谢你的帮助！', 'Xièxie nǐ de bāngzhù!', 'Cảm ơn sự giúp đỡ của bạn!', id, NULL, 'SHARED_谢谢_xièxie'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_谢谢_xièxie';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '不', 'bù', 'bu', 'không, chẳng (phủ định)', 'adverb', '我不是老师。', 'Wǒ bú shì lǎoshī.', 'Tôi không phải là giáo viên.', id, NULL, 'SHARED_不_bù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_不_bù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '客气', 'kèqi', 'keqi', 'khách khí, lịch sự', 'adjective', '请别客气。', 'Qǐng bié kèqi.', 'Xin đừng khách sáo.', id, NULL, 'SHARED_客气_kèqi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_客气_kèqi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '不客气', 'bú kèqi', 'bu keqi', 'không có chi, đừng khách sáo', 'phrase', '不用谢，不客气！', 'Búyòng xiè, bú kèqi!', 'Không cần cảm ơn, đừng khách sáo!', id, NULL, 'SHARED_不客气_bú kèqi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_不客气_bú kèqi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '对', 'duì', 'dui', 'đúng, đối với', 'adjective', '你说得很对。', 'Nǐ shuō de hěn duì.', 'Bạn nói rất đúng.', id, NULL, 'SHARED_对_duì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_对_duì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '起', 'qǐ', 'qi', 'dậy, bắt đầu', 'verb', '请起来。', 'Qǐng qǐlai.', 'Xin mời đứng dậy.', id, NULL, 'SHARED_起_qǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_起_qǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '对不起', 'duìbuqǐ', 'duibuqi', 'xin lỗi', 'phrase', '对不起，我来晚了。', 'Duìbuqǐ, wǒ lái wǎn le.', 'Xin lỗi, tôi đến muộn.', id, NULL, 'SHARED_对不起_duìbuqǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_对不起_duìbuqǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '关', 'guān', 'guan', 'đóng, liên quan', 'verb', '请关门。', 'Qǐng guān mén.', 'Xin hãy đóng cửa.', id, NULL, 'SHARED_关_guān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_关_guān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '系', 'xì', 'xi', 'hệ, mối quan hệ', 'noun', '中文系', 'Zhōngwén xì', 'Khoa tiếng Trung', id, NULL, 'SHARED_系_xì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_系_xì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '没关系', 'méi guānxi', 'mei guanxi', 'không sao cả, không hề gì', 'phrase', '没关系，慢慢来。', 'Méi guānxi, mànmàn lái.', 'Không sao đâu, cứ từ từ.', id, NULL, 'SHARED_没关系_méi guānxi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_没关系_méi guānxi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '请', 'qǐng', 'qing', 'xin, mời, làm ơn', 'verb', '请进，请坐！', 'Qǐng jìn, qǐng zuò!', 'Mời vào, mời ngồi!', id, NULL, 'SHARED_请_qǐng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_请_qǐng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '请问', 'qǐngwèn', 'qingwen', 'xin hỏi', 'phrase', '请问，图书馆在哪里？', 'Qǐngwèn, túshūguǎn zài nǎlǐ?', 'Xin hỏi, thư viện ở đâu?', id, NULL, 'SHARED_请问_qǐngwèn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_请问_qǐngwèn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '问', 'wèn', 'wen', 'hỏi', 'verb', '我想问一个问题。', 'Wǒ xiǎng wèn yí gè wèntí.', 'Tôi muốn hỏi một câu hỏi.', id, NULL, 'SHARED_问_wèn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_问_wèn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好听', 'hǎotīng', 'haoting', 'êm tai, nghe hay', 'adjective', '这首歌很好听。', 'Zhè shǒu gē hěn hǎotīng.', 'Bài hát này rất hay.', id, NULL, 'SHARED_好听_hǎotīng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_好听_hǎotīng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好看', 'hǎokàn', 'haokan', 'đẹp, ưa nhìn, hay', 'adjective', '这件衣服真好看。', 'Zhè jiàn yīfu zhēn hǎokàn.', 'Chiếc áo này thật đẹp.', id, NULL, 'SHARED_好看_hǎokàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_好看_hǎokàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好玩儿', 'hǎowánr', 'haowanr', 'vui, thú vị', 'adjective', '北京很好玩儿。', 'Běijīng hěn hǎowánr.', 'Bắc Kinh rất vui.', id, NULL, 'SHARED_好玩儿_hǎowánr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_好玩儿_hǎowánr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '走', 'zǒu', 'zou', 'đi, bước đi', 'verb', '我们走吧。', 'Wǒmen zǒu ba.', 'Chúng ta đi thôi.', id, NULL, 'SHARED_走_zǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_走_zǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '来', 'lái', 'lai', 'đến, tới', 'verb', '欢迎你来我家。', 'Huānyíng nǐ lái wǒ jiā.', 'Hoan nghênh bạn đến nhà tôi.', id, NULL, 'SHARED_来_lái'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_来_lái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '去', 'qù', 'qu', 'đi (rời khỏi vị trí)', 'verb', '我去学校。', 'Wǒ qù xuéxiào.', 'Tôi đi đến trường.', id, NULL, 'SHARED_去_qù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_去_qù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '回', 'huí', 'hui', 'về, quay lại', 'verb', '我想回家。', 'Wǒ xiǎng huí jiā.', 'Tôi muốn về nhà.', id, NULL, 'SHARED_回_huí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_回_huí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '进', 'jìn', 'jin', 'vào, tiến vào', 'verb', '请进！', 'Qǐng jìn!', 'Mời vào!', id, NULL, 'SHARED_进_jìn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_进_jìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出', 'chū', 'chu', 'ra, xuất hiện', 'verb', '请出来。', 'Qǐng chūlai.', 'Xin mời ra ngoài.', id, NULL, 'SHARED_出_chū'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_出_chū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吧', 'ba', 'ba', 'nhé, đi, nha (trợ từ ngữ khí)', 'particle', '我们一起吃饭吧！', 'Wǒmen yìqǐ chīfàn ba!', 'Chúng ta cùng ăn cơm nhé!', id, NULL, 'SHARED_吧_ba'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_吧_ba';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '呢', 'ne', 'ne', 'thế còn, đang (trợ từ ngữ khí)', 'particle', '我很好，你呢？', 'Wǒ hěn hǎo, nǐ ne?', 'Tôi rất khỏe, còn bạn thì sao?', id, NULL, 'SHARED_呢_ne'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_呢_ne';

-- --- BÀI 3 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '叫', 'jiào', 'jiao', 'kêu, gọi, tên là', 'verb', '我叫王明。', 'Wǒ jiào Wáng Míng.', 'Tôi tên là Vương Minh.', id, NULL, 'SHARED_叫_jiào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_叫_jiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '名', 'míng', 'ming', 'tên, danh tiếng', 'noun', '有名', 'yǒumíng', 'nổi tiếng', id, NULL, 'SHARED_名_míng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_名_míng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '字', 'zì', 'zi', 'chữ, chữ Hán', 'noun', '这个字怎么读？', 'Zhè gè zì zěnme dú?', 'Chữ này đọc thế nào?', id, NULL, 'SHARED_字_zì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_字_zì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '名字', 'míngzi', 'mingzi', 'tên gọi', 'noun', '你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'Bạn tên là gì?', id, NULL, 'SHARED_名字_míngzi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_名字_míngzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '姓', 'xìng', 'xing', 'họ (danh từ), mang họ (động từ)', 'noun', '我姓李。', 'Wǒ xìng Lǐ.', 'Tôi họ Lý.', id, NULL, 'SHARED_姓_xìng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_姓_xìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '什么', 'shénme', 'shenme', 'cái gì, gì', 'pronoun', '这是什么？', 'Zhè shì shénme?', 'Đây là cái gì?', id, NULL, 'SHARED_什么_shénme'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_什么_shénme';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '谁', 'shéi', 'shei', 'ai (đại từ nghi vấn)', 'pronoun', '他是谁？', 'Tā shì shéi?', 'Anh ấy là ai?', id, NULL, 'SHARED_谁_shéi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_谁_shéi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '谁的', 'shéide', 'sheide', 'của ai', 'pronoun', '这是谁的书？', 'Zhè shì shéide shū?', 'Đây là sách của ai?', id, NULL, 'SHARED_谁的_shéide'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_谁的_shéide';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '同学', 'tóngxué', 'tongxue', 'bạn học, bạn cùng lớp', 'noun', '他们是我的同学。', 'Tāmen shì wǒ de tóngxué.', 'Họ là bạn học của tôi.', id, NULL, 'SHARED_同学_tóngxué'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_同学_tóngxué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '老师', 'lǎoshī', 'laoshi', 'thầy giáo, cô giáo', 'noun', '李老师教我们汉语。', 'Lǐ lǎoshī jiāo wǒmen Hànyǔ.', 'Thầy Lý dạy chúng tôi tiếng Trung.', id, NULL, 'SHARED_老师_lǎoshī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_老师_lǎoshī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '老', 'lǎo', 'lao', 'già, cũ, lâu năm', 'adjective', '老朋友', 'lǎo péngyou', 'bạn cũ', id, NULL, 'SHARED_老_lǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_老_lǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '少', 'shào', 'shao', 'trẻ, thiếu niên', 'noun', '少年', 'shàonián', 'thiếu niên', id, NULL, 'SHARED_少_shào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_少_shào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '学生', 'xuésheng', 'xuesheng', 'học sinh, sinh viên', 'noun', '我是大学生。', 'Wǒ shì dàxuésheng.', 'Tôi là sinh viên đại học.', id, NULL, 'SHARED_学生_xuésheng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_学生_xuésheng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '学', 'xué', 'xue', 'học, học tập', 'verb', '我喜欢学中文。', 'Wǒ xǐhuan xué Zhōngwén.', 'Tôi thích học tiếng Trung.', id, NULL, 'SHARED_学_xué'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_学_xué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '学习', 'xuéxí', 'xuexi', 'học tập, nghiên cứu', 'verb', '我们要好好学习。', 'Wǒmen yào hǎohǎo xuéxí.', 'Chúng ta phải học tập chăm chỉ.', id, NULL, 'SHARED_学习_xuéxí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_学习_xuéxí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '同', 'tóng', 'tong', 'cùng nhau, giống nhau', 'adjective', '我们同岁。', 'Wǒmen tóng suì.', 'Chúng tôi cùng tuổi.', id, NULL, 'SHARED_同_tóng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_同_tóng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '也', 'yě', 'ye', 'cũng (phó từ)', 'adverb', '我也是学生。', 'Wǒ yě shì xuésheng.', 'Tôi cũng là học sinh.', id, NULL, 'SHARED_也_yě'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_也_yě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '都', 'dōu', 'dou', 'đều, tất cả', 'adverb', '我们都是好朋友。', 'Wǒmen dōu shì hǎo péngyou.', 'Chúng tôi đều là bạn tốt.', id, NULL, 'SHARED_都_dōu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_都_dōu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '很', 'hěn', 'hen', 'rất, lắm', 'adverb', '今天天气很好。', 'Jīntiān tiānqì hěn hǎo.', 'Hôm nay thời tiết rất đẹp.', id, NULL, 'SHARED_很_hěn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_很_hěn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '真', 'zhēn', 'zhen', 'thật, thật sự', 'adverb', '这朵花真漂亮！', 'Zhè duǒ huā zhēn piàoliang!', 'Bông hoa này thật đẹp!', id, NULL, 'SHARED_真_zhēn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_真_zhēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '太', 'tài', 'tai', 'quá, lắm', 'adverb', '太好了！', 'Tài hǎo le!', 'Tốt quá rồi!', id, NULL, 'SHARED_太_tài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_太_tài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '认识', 'rènshi', 'renshi', 'quen biết, nhận biết', 'verb', '认识你很高兴。', 'Rènshi nǐ hěn gāoxìng.', 'Rất vui được quen biết bạn.', id, NULL, 'SHARED_认识_rènshi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_认识_rènshi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '高', 'gāo', 'gao', 'cao', 'adjective', '他很高。', 'Tā hěn gāo.', 'Anh ấy rất cao.', id, NULL, 'SHARED_高_gāo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_高_gāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '高兴', 'gāoxìng', 'gaoxing', 'vui vẻ, phấn khởi', 'adjective', '今天我很高兴。', 'Jīntiān wǒ hěn gāoxìng.', 'Hôm nay tôi rất vui.', id, NULL, 'SHARED_高兴_gāoxìng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_高兴_gāoxìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '说话', 'shuōhuà', 'shuohua', 'nói chuyện, trò chuyện', 'verb', '请别说话。', 'Qǐng bié shuōhuà.', 'Xin đừng nói chuyện.', id, NULL, 'SHARED_说话_shuōhuà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_说话_shuōhuà';

-- --- BÀI 4 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '国', 'guó', 'guo', 'nước, quốc gia', 'noun', '中国', 'Zhōngguó', 'Trung Quốc', id, NULL, 'SHARED_国_guó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_国_guó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '中国', 'Zhōngguó', 'zhongguo', 'Trung Quốc', 'noun', '我是中国人。', 'Wǒ shì Zhōngguó rén.', 'Tôi là người Trung Quốc.', id, NULL, 'SHARED_中国_Zhōngguó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_中国_Zhōngguó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '美国', 'Měiguó', 'meiguo', 'Nước Mỹ, Hoa Kỳ', 'noun', '他是美国人。', 'Tā shì Měiguó rén.', 'Anh ấy là người Mỹ.', id, NULL, 'SHARED_美国_Měiguó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_美国_Měiguó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '英国', 'Yīngguó', 'yingguo', 'Nước Anh', 'noun', '英国很大。', 'Yīngguó hěn dà.', 'Nước Anh rất lớn.', id, NULL, 'SHARED_英国_Yīngguó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_英国_Yīngguó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '法国', 'Fǎguó', 'faguo', 'Nước Pháp', 'noun', '法国巴黎', 'Fǎguó Bālí', 'Paris nước Pháp', id, NULL, 'SHARED_法国_Fǎguó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_法国_Fǎguó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '日本', 'Rìběn', 'riben', 'Nhật Bản', 'noun', '我去过日本。', 'Wǒ qùguo Rìběn.', 'Tôi từng đi Nhật Bản.', id, NULL, 'SHARED_日本_Rìběn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_日本_Rìběn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '韩国', 'Hánguó', 'hanguo', 'Hàn Quốc', 'noun', '首尔在韩国。', 'Shǒu''ěr zài Hánguó.', 'Seoul ở Hàn Quốc.', id, NULL, 'SHARED_韩国_Hánguó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_韩国_Hánguó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '越南', 'Yuènán', 'yuenan', 'Việt Nam', 'noun', '河内是越南的首都。', 'Hénèi shì Yuènán de shǒudū.', 'Hà Nội là thủ đô của Việt Nam.', id, NULL, 'SHARED_越南_Yuènán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_越南_Yuènán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '语', 'yǔ', 'yu', 'ngôn ngữ, tiếng', 'noun', '英语', 'Yīngyǔ', 'tiếng Anh', id, NULL, 'SHARED_语_yǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_语_yǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汉语', 'Hànyǔ', 'hanyu', 'tiếng Hán, tiếng Trung', 'noun', '汉语不太难。', 'Hànyǔ bú tài nán.', 'Tiếng Hán không khó lắm.', id, NULL, 'SHARED_汉语_Hànyǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_汉语_Hànyǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '中文', 'Zhōngwén', 'zhongwen', 'tiếng Trung, Trung văn', 'noun', '我学习中文。', 'Wǒ xuéxí Zhōngwén.', 'Tôi học tiếng Trung.', id, NULL, 'SHARED_中文_Zhōngwén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_中文_Zhōngwén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '英语', 'Yīngyǔ', 'yingyu', 'tiếng Anh', 'noun', '他会说英语。', 'Tā huì shuō Yīngyǔ.', 'Anh ấy biết nói tiếng Anh.', id, NULL, 'SHARED_英语_Yīngyǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_英语_Yīngyǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '文', 'wén', 'wen', 'văn, văn tự', 'noun', '法文', 'Fǎwén', 'tiếng Pháp', id, NULL, 'SHARED_文_wén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_文_wén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '话', 'huà', 'hua', 'lời nói, câu nói', 'noun', '他说得很有道理。', 'Tā shuō de hěn yǒu dàolǐ.', 'Lời anh ấy nói rất có lý.', id, NULL, 'SHARED_话_huà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_话_huà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '说', 'shuō', 'shuo', 'nói', 'verb', '你会说汉语吗？', 'Nǐ huì shuō Hànyǔ ma?', 'Bạn biết nói tiếng Hán không?', id, NULL, 'SHARED_说_shuō'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_说_shuō';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '会', 'huì', 'hui', 'biết (qua học hỏi), sẽ', 'verb', '我会写汉字。', 'Wǒ huì xiě hànzì.', 'Tôi biết viết chữ Hán.', id, NULL, 'SHARED_会_huì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_会_huì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '哪', 'nǎ', 'na', 'nào (đại từ nghi vấn)', 'pronoun', '哪个是你的？', 'Nǎ ge shì nǐ de?', 'Cái nào là của bạn?', id, NULL, 'SHARED_哪_nǎ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_哪_nǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '哪儿', 'nǎr', 'nar', 'ở đâu, chỗ nào', 'pronoun', '你去哪儿？', 'Nǐ qù nǎr?', 'Bạn đi đâu đấy?', id, NULL, 'SHARED_哪儿_nǎr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_哪儿_nǎr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '哪里', 'nǎlǐ', 'nali', 'ở đâu, đâu có (khiêm tốn)', 'pronoun', '你在哪里工作？', 'Nǐ zài nǎlǐ gōngzuò?', 'Bạn làm việc ở đâu?', id, NULL, 'SHARED_哪里_nǎlǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_哪里_nǎlǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地', 'dì', 'di', 'đất, mặt đất, địa điểm', 'noun', '地方', 'dìfang', 'nơi chốn', id, NULL, 'SHARED_地_dì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_地_dì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地方', 'dìfang', 'difang', 'nơi, địa điểm, chỗ', 'noun', '这个地方真漂亮。', 'Zhè gè dìfang zhēn piàoliang.', 'Nơi này thật đẹp.', id, NULL, 'SHARED_地方_dìfang'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_地方_dìfang';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '北', 'běi', 'bei', 'phía bắc', 'noun', '北京在北方。', 'Běijīng zài běifāng.', 'Bắc Kinh ở phương bắc.', id, NULL, 'SHARED_北_běi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_北_běi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '北京', 'Běijīng', 'beijing', 'Bắc Kinh', 'noun', '北京是中国的首都。', 'Běijīng shì Zhōngguó de shǒudū.', 'Bắc Kinh là thủ đô Trung Quốc.', id, NULL, 'SHARED_北京_Běijīng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_北京_Běijīng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上海', 'Shànghǎi', 'shanghai', 'Thượng Hải', 'noun', '上海很繁华。', 'Shànghǎi hěn fánhuá.', 'Thượng Hải rất phồn hoa.', id, NULL, 'SHARED_上海_Shànghǎi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_上海_Shànghǎi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '的', 'de', 'de', 'của (trợ từ kết cấu)', 'particle', '这是我的书。', 'Zhè shì wǒ de shū.', 'Đây là sách của tôi.', id, NULL, 'SHARED_的_de'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_的_de';

-- --- BÀI 5 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '零', 'líng', 'ling', 'số 0', 'numeral', '零点五', 'líng diǎn wǔ', 'không phẩy năm', id, NULL, 'SHARED_零_líng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_零_líng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '一', 'yī', 'yi', 'số 1', 'numeral', '一个人', 'yí gè rén', 'một người', id, NULL, 'SHARED_一_yī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_一_yī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '二', 'èr', 'er', 'số 2', 'numeral', '星期二', 'Xīngqī''èr', 'thứ Ba', id, NULL, 'SHARED_二_èr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_二_èr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '两', 'liǎng', 'liang', 'hai (dùng trước lượng từ)', 'numeral', '两本书', 'liǎng běn shū', 'hai quyển sách', id, NULL, 'SHARED_两_liǎng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_两_liǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '三', 'sān', 'san', 'số 3', 'numeral', '三天', 'sān tiān', 'ba ngày', id, NULL, 'SHARED_三_sān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_三_sān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '四', 'sì', 'si', 'số 4', 'numeral', '四个月', 'sì gè yuè', 'bốn tháng', id, NULL, 'SHARED_四_sì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_四_sì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '五', 'wǔ', 'wu', 'số 5', 'numeral', '五块钱', 'wǔ kuài qián', 'năm tệ', id, NULL, 'SHARED_五_wǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_五_wǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '六', 'liù', 'liu', 'số 6', 'numeral', '六点钟', 'liù diǎn zhōng', 'sáu giờ', id, NULL, 'SHARED_六_liù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_六_liù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '七', 'qī', 'qi', 'số 7', 'numeral', '七个苹果', 'qī gè píngguǒ', 'bảy quả táo', id, NULL, 'SHARED_七_qī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_七_qī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '八', 'bā', 'ba', 'số 8', 'numeral', '八月', 'bā yuè', 'tháng Tám', id, NULL, 'SHARED_八_bā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_八_bā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '九', 'jiǔ', 'jiu', 'số 9', 'numeral', '九岁', 'jiǔ suì', 'chín tuổi', id, NULL, 'SHARED_九_jiǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_九_jiǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '十', 'shí', 'shi', 'số 10', 'numeral', '十分钟', 'shí fēnzhōng', 'mười phút', id, NULL, 'SHARED_十_shí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_十_shí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '百', 'bǎi', 'bai', 'trăm, một trăm', 'numeral', '一百', 'yìbǎi', 'một trăm', id, NULL, 'SHARED_百_bǎi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_百_bǎi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '千', 'qiān', 'qian', 'nghìn, một nghìn', 'numeral', '一千', 'yìqiān', 'một nghìn', id, NULL, 'SHARED_千_qiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_千_qiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '万', 'wàn', 'wan', 'vạn, mười nghìn', 'numeral', '一万', 'yíwàn', 'mười nghìn', id, NULL, 'SHARED_万_wàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_万_wàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '第一', 'dì-yī', 'diyi', 'thứ nhất, đầu tiên', 'ordinal', '第一课', 'dì-yī kè', 'bài số một', id, NULL, 'SHARED_第一_dì-yī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_第一_dì-yī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '第', 'dì', 'di', 'thứ (tiền tố thứ tự)', 'prefix', '第二', 'dì-èr', 'thứ hai', id, NULL, 'SHARED_第_dì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_第_dì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '几', 'jǐ', 'ji', 'mấy (số lượng dưới 10)', 'pronoun', '你几岁？', 'Nǐ jǐ suì?', 'Bạn mấy tuổi?', id, NULL, 'SHARED_几_jǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_几_jǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '多', 'duō', 'duo', 'nhiều, bao nhiêu', 'adjective', '很多人', 'hěn duō rén', 'rất nhiều người', id, NULL, 'SHARED_多_duō'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_多_duō';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '少', 'shǎo', 'shao', 'ít', 'adjective', '这里的书很少。', 'Zhèlǐ de shū hěn shǎo.', 'Sách ở đây rất ít.', id, NULL, 'SHARED_少_shǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_少_shǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '多少', 'duōshao', 'duoshao', 'bao nhiêu', 'pronoun', '这个多少钱？', 'Zhè gè duōshao qián?', 'Cái này bao nhiêu tiền?', id, NULL, 'SHARED_多少_duōshao'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_多少_duōshao';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '个', 'gè', 'ge', 'cái, con, người (lượng từ chung)', 'measure', '一个人', 'yí gè rén', 'một người', id, NULL, 'SHARED_个_gè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_个_gè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '号', 'hào', 'hao', 'số, ngày mùng', 'noun', '你的电话号是多少？', 'Nǐ de diànhuà hào shì duōshao?', 'Số điện thoại của bạn là bao nhiêu?', id, NULL, 'SHARED_号_hào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_号_hào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '号码', 'hàomǎ', 'haoma', 'con số, số hiệu', 'noun', '电话号码', 'diànhuà hàomǎ', 'số điện thoại', id, NULL, 'SHARED_号码_hàomǎ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_号码_hàomǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '数字', 'shùzì', 'shuzi', 'chữ số, con số', 'noun', '阿拉伯数字', 'Ālābó shùzì', 'chữ số Ả Rập', id, NULL, 'SHARED_数字_shùzì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_数字_shùzì';

-- --- BÀI 6 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '年', 'nián', 'nian', 'năm', 'noun', '今年是2026年。', 'Jīnnián shì èr líng èr liù nián.', 'Năm nay là năm 2026.', id, NULL, 'SHARED_年_nián'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_年_nián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '月', 'yuè', 'yue', 'tháng, mặt trăng', 'noun', '一月有三十一天。', 'Yīyuè yǒu sānshíyī tiān.', 'Tháng một có 31 ngày.', id, NULL, 'SHARED_月_yuè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_月_yuè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '日', 'rì', 'ri', 'ngày, mặt trời', 'noun', '十月一日', 'Shíyuè yī rì', 'ngày 1 tháng 10', id, NULL, 'SHARED_日_rì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_日_rì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '天', 'tiān', 'tian', 'ngày, trời', 'noun', '今天是个好天。', 'Jīntiān shì gè hǎo tiān.', 'Hôm nay là một ngày đẹp trời.', id, NULL, 'SHARED_天_tiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_天_tiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '今天', 'jīntiān', 'jintian', 'hôm nay', 'noun', '今天天气很好。', 'Jīntiān tiānqì hěn hǎo.', 'Hôm nay thời tiết rất tốt.', id, NULL, 'SHARED_今天_jīntiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_今天_jīntiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '明天', 'míngtiān', 'mingtian', 'ngày mai', 'noun', '明天见！', 'Míngtiān jiàn!', 'Ngày mai gặp nhé!', id, NULL, 'SHARED_明天_míngtiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_明天_míngtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '昨天', 'zuótiān', 'zuotian', 'hôm qua', 'noun', '昨天你去哪儿了？', 'Zuótiān nǐ qù nǎr le?', 'Hôm qua bạn đi đâu thế?', id, NULL, 'SHARED_昨天_zuótiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_昨天_zuótiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '后天', 'hòutiān', 'houtian', 'ngày kia', 'noun', '后天星期六。', 'Hòutiān Xīngqīliù.', 'Ngày kia là thứ Bảy.', id, NULL, 'SHARED_后天_hòutiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_后天_hòutiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '前天', 'qiántiān', 'qiantian', 'hôm kia', 'noun', '前天我买了一本书。', 'Qiántiān wǒ mǎi le yì běn shū.', 'Hôm kia tôi đã mua một cuốn sách.', id, NULL, 'SHARED_前天_qiántiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_前天_qiántiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '今年', 'jīnnián', 'jinnian', 'năm nay', 'noun', '今年我二十岁。', 'Jīnnián wǒ èrshí suì.', 'Năm nay tôi hai mươi tuổi.', id, NULL, 'SHARED_今年_jīnnián'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_今年_jīnnián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '明年', 'míngnián', 'mingnian', 'năm sau, năm tới', 'noun', '明年我去中国。', 'Míngnián wǒ qù Zhōngguó.', 'Năm sau tôi đi Trung Quốc.', id, NULL, 'SHARED_明年_míngnián'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_明年_míngnián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '去年', 'qùnián', 'qunian', 'năm ngoái', 'noun', '去年我在北京。', 'Qùnián wǒ zài Běijīng.', 'Năm ngoái tôi ở Bắc Kinh.', id, NULL, 'SHARED_去年_qùnián'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_去年_qùnián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期', 'xīngqī', 'xingqi', 'tuần, thứ', 'noun', '一个星期有七天。', 'Yí gè xīngqī yǒu qī tiān.', 'Một tuần có bảy ngày.', id, NULL, 'SHARED_星期_xīngqī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期_xīngqī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期一', 'Xīngqīyī', 'xingqiyi', 'thứ Hai', 'noun', '星期一我们要上课。', 'Xīngqīyī wǒmen yào shàngkè.', 'Thứ Hai chúng tôi phải đi học.', id, NULL, 'SHARED_星期一_Xīngqīyī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期一_Xīngqīyī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期二', 'Xīngqī''èr', 'xingqi''er', 'thứ Ba', 'noun', '星期二下午有考试。', 'Xīngqī''èr xiàwǔ yǒu kǎoshì.', 'Chiều thứ Ba có bài thi.', id, NULL, 'SHARED_星期二_Xīngqī''èr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期二_Xīngqī''èr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期三', 'Xīngqīsān', 'xingqisan', 'thứ Tư', 'noun', '星期三我去图书馆。', 'Xīngqīsān wǒ qù túshūguǎn.', 'Thứ Tư tôi đi thư viện.', id, NULL, 'SHARED_星期三_Xīngqīsān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期三_Xīngqīsān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期四', 'Xīngqīsì', 'xingqisi', 'thứ Năm', 'noun', '星期四见！', 'Xīngqīsì jiàn!', 'Hẹn gặp vào thứ Năm nhé!', id, NULL, 'SHARED_星期四_Xīngqīsì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期四_Xīngqīsì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期五', 'Xīngqīwǔ', 'xingqiwu', 'thứ Sáu', 'noun', '星期五晚上看电影。', 'Xīngqīwǔ wǎnshang kàn diànyǐng.', 'Tối thứ Sáu xem phim.', id, NULL, 'SHARED_星期五_Xīngqīwǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期五_Xīngqīwǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期六', 'Xīngqīliù', 'xingqiliu', 'thứ Bảy', 'noun', '星期六不工作。', 'Xīngqīliù bù gōngzuò.', 'Thứ Bảy không làm việc.', id, NULL, 'SHARED_星期六_Xīngqīliù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期六_Xīngqīliù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期日', 'Xīngqīrì', 'xingqiri', 'Chủ nhật', 'noun', '星期日我在家休息。', 'Xīngqīrì wǒ zài jiā xiūxi.', 'Chủ nhật tôi ở nhà nghỉ ngơi.', id, NULL, 'SHARED_星期日_Xīngqīrì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期日_Xīngqīrì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星期天', 'Xīngqītiān', 'xingqitian', 'Chủ nhật', 'noun', '星期天去买东西。', 'Xīngqītiān qù mǎi dōngxi.', 'Chủ nhật đi mua sắm.', id, NULL, 'SHARED_星期天_Xīngqītiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_星期天_Xīngqītiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '周末', 'zhōumò', 'zhoumo', 'cuối tuần', 'noun', '周末愉快！', 'Zhōumò yúkuài!', 'Chúc cuối tuần vui vẻ!', id, NULL, 'SHARED_周末_zhōumò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_周末_zhōumò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生', 'shēng', 'sheng', 'sinh ra, sống', 'verb', '出生', 'chūshēng', 'sinh ra', id, NULL, 'SHARED_生_shēng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_生_shēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生日', 'shēngrì', 'shengri', 'sinh nhật', 'noun', '祝你生日快乐！', 'Zhù nǐ shēngrì kuàilè!', 'Chúc bạn sinh nhật vui vẻ!', id, NULL, 'SHARED_生日_shēngrì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_生日_shēngrì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '快乐', 'kuàilè', 'kuaile', 'vui vẻ, hạnh phúc', 'adjective', '新年快乐！', 'Xīnnián kuàilè!', 'Chúc mừng năm mới!', id, NULL, 'SHARED_快乐_kuàilè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_快乐_kuàilè';

-- --- BÀI 7 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '点', 'diǎn', 'dian', 'giờ, điểm, chút ít', 'noun', '现在八点半。', 'Xiànzài bā diǎn bàn.', 'Bây giờ là tám giờ rưỡi.', id, NULL, 'SHARED_点_diǎn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_点_diǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '分', 'fēn', 'fen', 'phút, điểm số', 'noun', '八点十分', 'bā diǎn shí fēn', 'tám giờ mười phút', id, NULL, 'SHARED_分_fēn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_分_fēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '半', 'bàn', 'ban', 'rưỡi, nửa', 'numeral', '半个小时', 'bàn gè xiǎoshí', 'nửa tiếng đồng hồ', id, NULL, 'SHARED_半_bàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_半_bàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '刻', 'kè', 'ke', 'khắc (15 phút)', 'noun', '差一刻九点', 'chà yí kè jiǔ diǎn', 'chín giờ kém mười lăm', id, NULL, 'SHARED_刻_kè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_刻_kè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '差', 'chà', 'cha', 'kém, thiếu', 'verb', '差五分七点', 'chà wǔ fēn qī diǎn', 'bảy giờ kém năm', id, NULL, 'SHARED_差_chà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_差_chà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '小时', 'xiǎoshí', 'xiaoshi', 'tiếng đồng hồ, giờ', 'noun', '我学了两个小时。', 'Wǒ xué le liǎng gè xiǎoshí.', 'Tôi đã học suốt hai tiếng.', id, NULL, 'SHARED_小时_xiǎoshí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_小时_xiǎoshí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '分钟', 'fēnzhōng', 'fenzhong', 'phút', 'noun', '等我五分钟。', 'Děng wǒ wǔ fēnzhōng.', 'Đợi tôi năm phút.', id, NULL, 'SHARED_分钟_fēnzhōng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_分钟_fēnzhōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '现在', 'xiànzài', 'xianzai', 'bây giờ, hiện tại', 'noun', '现在几点了？', 'Xiànzài jǐ diǎn le?', 'Bây giờ mấy giờ rồi?', id, NULL, 'SHARED_现在_xiànzài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_现在_xiànzài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '时间', 'shíjiān', 'shijian', 'thời gian', 'noun', '你有什么时间吗？', 'Nǐ yǒu shénme shíjiān ma?', 'Bạn có thời gian không?', id, NULL, 'SHARED_时间_shíjiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_时间_shíjiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '时候', 'shíhou', 'shihou', 'lúc, khi', 'noun', '你什么时候来？', 'Nǐ shénme shíhou lái?', 'Khi nào bạn đến?', id, NULL, 'SHARED_时候_shíhou'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_时候_shíhou';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '早上', 'zǎoshang', 'zaoshang', 'buổi sáng sớm (6-8h)', 'noun', '早上好！', 'Zǎoshang hǎo!', 'Chào buổi sáng!', id, NULL, 'SHARED_早上_zǎoshang'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_早上_zǎoshang';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '早', 'zǎo', 'zao', 'sớm, chào buổi sáng', 'adjective', '早安！', 'Zǎo''ān!', 'Chào buổi sáng!', id, NULL, 'SHARED_早_zǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_早_zǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上午', 'shàngwǔ', 'shangwu', 'buổi sáng (8-11h)', 'noun', '上午九点上课。', 'Shàngwǔ jiǔ diǎn shàngkè.', 'Chín giờ sáng vào lớp.', id, NULL, 'SHARED_上午_shàngwǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_上午_shàngwǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '中午', 'zhōngwǔ', 'zhongwu', 'buổi trưa (11-13h)', 'noun', '中午我们在学校吃饭。', 'Zhōngwǔ wǒmen zài xuéxiào chīfàn.', 'Buổi trưa chúng tôi ăn cơm ở trường.', id, NULL, 'SHARED_中午_zhōngwǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_中午_zhōngwǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下午', 'xiàwǔ', 'xiawu', 'buổi chiều (13-18h)', 'noun', '下午三点开会。', 'Xiàwǔ sān diǎn kāihuì.', 'Ba giờ chiều họp.', id, NULL, 'SHARED_下午_xiàwǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_下午_xiàwǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晚上', 'wǎnshang', 'wanshang', 'buổi tối (sau 18h)', 'noun', '晚上好！', 'Wǎnshang hǎo!', 'Chào buổi tối!', id, NULL, 'SHARED_晚上_wǎnshang'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_晚上_wǎnshang';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晚', 'wǎn', 'wan', 'muộn, muộn màng', 'adjective', '对不起，我来晚了。', 'Duìbuqǐ, wǒ lái wǎn le.', 'Xin lỗi, tôi đến muộn.', id, NULL, 'SHARED_晚_wǎn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_晚_wǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '夜', 'yè', 'ye', 'đêm, ban đêm', 'noun', '半夜', 'bànyè', 'nửa đêm', id, NULL, 'SHARED_夜_yè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_夜_yè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '前', 'qián', 'qian', 'trước, phía trước', 'noun', '三天前', 'sān tiān qián', 'ba ngày trước', id, NULL, 'SHARED_前_qián'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_前_qián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '后', 'hòu', 'hou', 'sau, phía sau', 'noun', '下课后', 'xiàkè hòu', 'sau khi tan học', id, NULL, 'SHARED_后_hòu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_后_hòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '先', 'xiān', 'xian', 'trước tiên, trước hết', 'adverb', '你先走吧。', 'Nǐ xiān zǒu ba.', 'Bạn đi trước đi.', id, NULL, 'SHARED_先_xiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_先_xiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '常', 'cháng', 'chang', 'thường, hay', 'adverb', '我常去跑步。', 'Wǒ cháng qù pǎobù.', 'Tôi thường đi chạy bộ.', id, NULL, 'SHARED_常_cháng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_常_cháng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '常常', 'chángcháng', 'changchang', 'thường xuyên', 'adverb', '他常常来看我。', 'Tā chángcháng lái kàn wǒ.', 'Anh ấy thường xuyên đến thăm tôi.', id, NULL, 'SHARED_常常_chángcháng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_常常_chángcháng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '有时候', 'yǒushíhou', 'youshihou', 'có lúc, đôi khi', 'phrase', '有时候我听音乐。', 'Yǒushíhou wǒ tīng yīnyuè.', 'Đôi khi tôi nghe nhạc.', id, NULL, 'SHARED_有时候_yǒushíhou'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_有时候_yǒushíhou';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '起', 'qǐ', 'qi', 'thức dậy, nổi dậy', 'verb', '起床', 'qǐchuáng', 'thức dậy', id, NULL, 'SHARED_起_qǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_起_qǐ';

-- --- BÀI 8 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '家', 'jiā', 'jia', 'nhà, gia đình', 'noun', '我家在北京。', 'Wǒ jiā zài Běijīng.', 'Nhà tôi ở Bắc Kinh.', id, NULL, 'SHARED_家_jiā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_家_jiā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '家人', 'jiārén', 'jiaren', 'người nhà, người thân', 'noun', '我的家人都很健康。', 'Wǒ de jiārén dōu hěn jiànkāng.', 'Gia đình tôi đều rất khỏe mạnh.', id, NULL, 'SHARED_家人_jiārén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_家人_jiārén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爸爸', 'bàba', 'baba', 'bố, ba, cha', 'noun', '我爸爸是医生。', 'Wǒ bàba shì yīshēng.', 'Bố tôi là bác sĩ.', id, NULL, 'SHARED_爸爸_bàba'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_爸爸_bàba';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '妈妈', 'māma', 'mama', 'mẹ, má', 'noun', '我妈妈做饭很好吃。', 'Wǒ māma zuòfàn hěn hǎochī.', 'Mẹ tôi nấu ăn rất ngon.', id, NULL, 'SHARED_妈妈_māma'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_妈妈_māma';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '哥哥', 'gēge', 'gege', 'anh trai', 'noun', '我哥哥在读大学。', 'Wǒ gēge zài dú dàxué.', 'Anh trai tôi đang học đại học.', id, NULL, 'SHARED_哥哥_gēge'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_哥哥_gēge';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '弟弟', 'dìdi', 'didi', 'em trai', 'noun', '我弟弟今年十岁。', 'Wǒ dìdi jīnnián shí suì.', 'Em trai tôi năm nay mười tuổi.', id, NULL, 'SHARED_弟弟_dìdi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_弟弟_dìdi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '姐姐', 'jiějie', 'jiejie', 'chị gái', 'noun', '姐姐很漂亮。', 'Jiějie hěn piàoliang.', 'Chị gái rất xinh đẹp.', id, NULL, 'SHARED_姐姐_jiějie'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_姐姐_jiějie';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '妹妹', 'mèimei', 'meimei', 'em gái', 'noun', '我妹妹喜欢画画。', 'Wǒ mèimei xǐhuan huàhuà.', 'Em gái tôi thích vẽ tranh.', id, NULL, 'SHARED_妹妹_mèimei'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_妹妹_mèimei';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爷', 'yé', 'ye', 'ông', 'noun', '爷爷', 'yéye', 'ông nội', id, NULL, 'SHARED_爷_yé'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_爷_yé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爷爷', 'yéye', 'yeye', 'ông nội', 'noun', '爷爷每天去散步。', 'Yéye měitiān qù sànbù.', 'Ông nội mỗi ngày đều đi dạo.', id, NULL, 'SHARED_爷爷_yéye'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_爷爷_yéye';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '奶奶', 'nǎinai', 'nainai', 'bà nội', 'noun', '奶奶今年七十岁。', 'Nǎinai jīnnián qīshí suì.', 'Bà nội năm nay bảy mươi tuổi.', id, NULL, 'SHARED_奶奶_nǎinai'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_奶奶_nǎinai';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外公', 'wàigōng', 'waigong', 'ông ngoại', 'noun', '外公住在农村。', 'Wàigōng zhù zài nóngcūn.', 'Ông ngoại sống ở nông thôn.', id, NULL, 'SHARED_外公_wàigōng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_外公_wàigōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外婆', 'wàipó', 'waipo', 'bà ngoại', 'noun', '我爱我的外婆。', 'Wǒ ài wǒ de wàipó.', 'Tôi yêu bà ngoại của tôi.', id, NULL, 'SHARED_外婆_wàipó'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_外婆_wàipó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爱', 'ài', 'ai', 'yêu, thích', 'verb', '我爱我的家。', 'Wǒ ài wǒ de jiā.', 'Tôi yêu gia đình tôi.', id, NULL, 'SHARED_爱_ài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_爱_ài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '喜欢', 'xǐhuan', 'xihuan', 'thích, yêu thích', 'verb', '我喜欢中国菜。', 'Wǒ xǐhuan Zhōngguó cài.', 'Tôi thích món ăn Trung Quốc.', id, NULL, 'SHARED_喜欢_xǐhuan'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_喜欢_xǐhuan';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '男', 'nán', 'nan', 'nam, đàn ông', 'noun', '男生', 'nánshēng', 'học sinh nam', id, NULL, 'SHARED_男_nán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_男_nán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '女', 'nǚ', 'nv', 'nữ, phụ nữ', 'noun', '女生', 'nǚshēng', 'học sinh nữ', id, NULL, 'SHARED_女_nǚ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_女_nǚ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '孩子', 'háizi', 'haizi', 'con cái, đứa trẻ', 'noun', '他们有两个孩子。', 'Tāmen yǒu liǎng gè háizi.', 'Họ có hai đứa con.', id, NULL, 'SHARED_孩子_háizi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_孩子_háizi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '儿子', 'érzi', 'erzi', 'con trai', 'noun', '他儿子很聪明。', 'Tā érzi hěn cōngming.', 'Con trai anh ấy rất thông minh.', id, NULL, 'SHARED_儿子_érzi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_儿子_érzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '女儿', 'nǚ''ér', 'nv''er', 'con gái', 'noun', '我女儿在上学。', 'Wǒ nǚ''ér zài shàngxué.', 'Con gái tôi đang đi học.', id, NULL, 'SHARED_女儿_nǚ''ér'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_女儿_nǚ''ér';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '有', 'yǒu', 'you', 'có', 'verb', '我家有三口人。', 'Wǒ jiā yǒu sān kǒu rén.', 'Nhà tôi có ba người.', id, NULL, 'SHARED_有_yǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_有_yǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '没', 'méi', 'mei', 'không có, chưa (phủ định)', 'adverb', '我没有书。', 'Wǒ méiyǒu shū.', 'Tôi không có sách.', id, NULL, 'SHARED_没_méi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_没_méi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '没有', 'méiyǒu', 'meiyou', 'không có', 'verb', '这里没有人。', 'Zhèlǐ méiyǒu rén.', 'Ở đây không có người.', id, NULL, 'SHARED_没有_méiyǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_没有_méiyǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '口', 'kǒu', 'kou', 'miệng, lượng từ gia đình', 'measure', '一家三口', 'yī jiā sān kǒu', 'gia đình ba người', id, NULL, 'SHARED_口_kǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_口_kǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '岁', 'suì', 'sui', 'tuổi', 'measure', '我今年二十岁。', 'Wǒ jīnnián èrshí suì.', 'Năm nay tôi hai mươi tuổi.', id, NULL, 'SHARED_岁_suì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_岁_suì';

-- --- BÀI 9 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吃', 'chī', 'chi', 'ăn', 'verb', '你想吃什么？', 'Nǐ xiǎng chī shénme?', 'Bạn muốn ăn gì?', id, NULL, 'SHARED_吃_chī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_吃_chī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '喝', 'hē', 'he', 'uống', 'verb', '我想喝茶。', 'Wǒ xiǎng hē chá.', 'Tôi muốn uống trà.', id, NULL, 'SHARED_喝_hē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_喝_hē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饭', 'fàn', 'fan', 'cơm, bữa ăn', 'noun', '吃早饭', 'chī zǎofàn', 'ăn bữa sáng', id, NULL, 'SHARED_饭_fàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_饭_fàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '早饭', 'zǎofàn', 'zaofan', 'bữa sáng', 'noun', '你吃早饭了吗？', 'Nǐ chī zǎofàn le ma?', 'Bạn ăn sáng chưa?', id, NULL, 'SHARED_早饭_zǎofàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_早饭_zǎofàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '午饭', 'wǔfàn', 'wufan', 'bữa trưa', 'noun', '午饭吃米饭。', 'Wǔfàn chī mǐfàn.', 'Bữa trưa ăn cơm trắng.', id, NULL, 'SHARED_午饭_wǔfàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_午饭_wǔfàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晚饭', 'wǎnfàn', 'wanfan', 'bữa tối', 'noun', '我们一起吃晚饭吧。', 'Wǒmen yìqǐ chī wǎnfàn ba.', 'Chúng ta cùng ăn tối nhé.', id, NULL, 'SHARED_晚饭_wǎnfàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_晚饭_wǎnfàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '米饭', 'mǐfàn', 'mifan', 'cơm trắng', 'noun', '一碗米饭', 'yì wǎn mǐfàn', 'một bát cơm', id, NULL, 'SHARED_米饭_mǐfàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_米饭_mǐfàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '面条', 'miàntiáo', 'miantiao', 'mì sợi, mì', 'noun', '我喜欢吃牛肉面条。', 'Wǒ xǐhuan chī niúròu miàntiáo.', 'Tôi thích ăn mì bò.', id, NULL, 'SHARED_面条_miàntiáo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_面条_miàntiáo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '包子', 'bāozi', 'baozi', 'bánh bao', 'noun', '热腾腾的包子', 'rèténgténg de bāozi', 'bánh bao nóng hổi', id, NULL, 'SHARED_包子_bāozi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_包子_bāozi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饺子', 'jiǎozi', 'jiaozi', 'sủi cảo, bánh chẻo', 'noun', '过年吃饺子。', 'Guònián chī jiǎozi.', 'Tết ăn sủi cảo.', id, NULL, 'SHARED_饺子_jiǎozi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_饺子_jiǎozi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '菜', 'cài', 'cai', 'món ăn, rau cỏ', 'noun', '中国菜很好吃。', 'Zhōngguó cài hěn hǎochī.', 'Món ăn Trung Quốc rất ngon.', id, NULL, 'SHARED_菜_cài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_菜_cài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '水', 'shuǐ', 'shui', 'nước, nước uống', 'noun', '我想喝水。', 'Wǒ xiǎng hē shuǐ.', 'Tôi muốn uống nước.', id, NULL, 'SHARED_水_shuǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_水_shuǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '茶', 'chá', 'cha', 'trà, chè', 'noun', '喝绿茶', 'hē lǜchá', 'uống trà xanh', id, NULL, 'SHARED_茶_chá'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_茶_chá';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '果汁', 'guǒzhī', 'guozhi', 'nước ép hoa quả', 'noun', '苹果汁', 'píngguǒzhī', 'nước táo', id, NULL, 'SHARED_果汁_guǒzhī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_果汁_guǒzhī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '牛奶', 'niúnǎi', 'niunai', 'sữa bò, sữa tươi', 'noun', '喝一杯牛奶', 'hē yì bēi niúnǎi', 'uống một ly sữa', id, NULL, 'SHARED_牛奶_niúnǎi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_牛奶_niúnǎi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '咖啡', 'kāfēi', 'kafei', 'cà phê', 'noun', '我想喝热咖啡。', 'Wǒ xiǎng hē rè kāfēi.', 'Tôi muốn uống cà phê nóng.', id, NULL, 'SHARED_咖啡_kāfēi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_咖啡_kāfēi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '苹果', 'píngguǒ', 'pingguo', 'quả táo', 'noun', '吃一个大苹果', 'chī yí gè dà píngguǒ', 'ăn một quả táo to', id, NULL, 'SHARED_苹果_píngguǒ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_苹果_píngguǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '西瓜', 'xīguā', 'xigua', 'dưa hấu', 'noun', '夏天吃西瓜很舒服。', 'Xiàtiān chī xīguā hěn shūfu.', 'Mùa hè ăn dưa hấu rất dễ chịu.', id, NULL, 'SHARED_西瓜_xīguā'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_西瓜_xīguā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '水果', 'shuǐguǒ', 'shuiguo', 'hoa quả, trái cây', 'noun', '多吃水果对身体好。', 'Duō chī shuǐguǒ duì shēntǐ hǎo.', 'Ăn nhiều hoa quả tốt cho sức khỏe.', id, NULL, 'SHARED_水果_shuǐguǒ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_水果_shuǐguǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '肉', 'ròu', 'rou', 'thịt', 'noun', '牛肉', 'niúròu', 'thịt bò', id, NULL, 'SHARED_肉_ròu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_肉_ròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '牛肉', 'niúròu', 'niurou', 'thịt bò', 'noun', '牛肉面', 'niúròu miàn', 'mì thịt bò', id, NULL, 'SHARED_牛肉_niúròu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_牛肉_niúròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鸡肉', 'jīròu', 'jirou', 'thịt gà', 'noun', '炒鸡肉', 'chǎo jīròu', 'thịt gà xào', id, NULL, 'SHARED_鸡肉_jīròu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_鸡肉_jīròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鱼', 'yú', 'yu', 'cá', 'noun', '清蒸鱼', 'qīngzhēng yú', 'cá hấp', id, NULL, 'SHARED_鱼_yú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_鱼_yú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蛋', 'dàn', 'dan', 'trứng', 'noun', '鸡蛋', 'jīdàn', 'trứng gà', id, NULL, 'SHARED_蛋_dàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_蛋_dàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好吃', 'hǎochī', 'haochi', 'ngon, ngon miệng', 'adjective', '这个菜真好吃！', 'Zhè gè cài zhēn hǎochī!', 'Món ăn này thật là ngon!', id, NULL, 'SHARED_好吃_hǎochī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_好吃_hǎochī';

-- --- BÀI 10 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '买', 'mǎi', 'mai', 'mua', 'verb', '你想买什么？', 'Nǐ xiǎng mǎi shénme?', 'Bạn muốn mua cái gì?', id, NULL, 'SHARED_买_mǎi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_买_mǎi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '卖', 'mài', 'mai', 'bán', 'verb', '这家店卖水果。', 'Zhè jiā diàn mài shuǐguǒ.', 'Cửa hàng này bán hoa quả.', id, NULL, 'SHARED_卖_mài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_卖_mài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '钱', 'qián', 'qian', 'tiền, tiền bạc', 'noun', '我没有带钱。', 'Wǒ méiyǒu dài qián.', 'Tôi không mang theo tiền.', id, NULL, 'SHARED_钱_qián'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_钱_qián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '块', 'kuài', 'kuai', 'đồng, tệ (khẩu ngữ)', 'measure', '五块钱', 'wǔ kuài qián', 'năm đồng', id, NULL, 'SHARED_块_kuài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_块_kuài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '元', 'yuán', 'yuan', 'đồng, tệ (văn viết)', 'measure', '一百元', 'yìbǎi yuán', 'một trăm tệ', id, NULL, 'SHARED_元_yuán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_元_yuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '角', 'jiǎo', 'jiao', 'hào (1/10 tệ)', 'measure', '五角', 'wǔ jiǎo', 'năm hào', id, NULL, 'SHARED_角_jiǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_角_jiǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '毛', 'máo', 'mao', 'hào (khẩu ngữ)', 'measure', '两毛钱', 'liǎng máo qián', 'hai hào', id, NULL, 'SHARED_毛_máo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_毛_máo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '商店', 'shāngdiàn', 'shangdian', 'cửa hàng, tiệm buôn', 'noun', '去商店买东西', 'qù shāngdiàn mǎi dōngxi', 'đến cửa hàng mua đồ', id, NULL, 'SHARED_商店_shāngdiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_商店_shāngdiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '店', 'diàn', 'dian', 'quán, tiệm, cửa hàng', 'noun', '书店', 'shūdiàn', 'hiệu sách', id, NULL, 'SHARED_店_diàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_店_diàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '东', 'dōng', 'dong', 'phía đông', 'noun', '东方', 'dōngfāng', 'phương đông', id, NULL, 'SHARED_东_dōng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_东_dōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '西', 'xī', 'xi', 'phía tây', 'noun', '西方', 'xīfāng', 'phương tây', id, NULL, 'SHARED_西_xī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_西_xī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '东西', 'dōngxi', 'dongxi', 'đồ đạc, vật phẩm', 'noun', '买东西', 'mǎi dōngxi', 'mua sắm đồ', id, NULL, 'SHARED_东西_dōngxi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_东西_dōngxi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '贵', 'guì', 'gui', 'đắt, quý giá', 'adjective', '太贵了，便宜一点吧。', 'Tài guì le, piányi yìdiǎn ba.', 'Đắt quá, rẻ một chút đi.', id, NULL, 'SHARED_贵_guì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_贵_guì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '便宜', 'piányi', 'pianyi', 'rẻ, giá rẻ', 'adjective', '这件衣服很便宜。', 'Zhè jiàn yīfu hěn piányi.', 'Chiếc áo này rất rẻ.', id, NULL, 'SHARED_便宜_piányi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_便宜_piányi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '件', 'jiàn', 'jian', 'chiếc, cái, vụ (lượng từ áo, việc)', 'measure', '一件大衣', 'yí jiàn dàyī', 'một chiếc áo khoác', id, NULL, 'SHARED_件_jiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_件_jiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '斤', 'jīn', 'jin', 'cân (0.5 kg)', 'measure', '一斤苹果', 'yì jīn píngguǒ', 'nửa cân táo', id, NULL, 'SHARED_斤_jīn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_斤_jīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '公斤', 'gōngjīn', 'gongjin', 'ki-lô-gam (1 kg)', 'measure', '两公斤香蕉', 'liǎng gōngjīn xiāngjiāo', 'hai kg chuối', id, NULL, 'SHARED_公斤_gōngjīn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_公斤_gōngjīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '给', 'gěi', 'gei', 'cho, đưa cho', 'verb', '给你钱。', 'Gěi nǐ qián.', 'Gửi bạn tiền này.', id, NULL, 'SHARED_给_gěi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_给_gěi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '找', 'zhǎo', 'zhao', 'tìm kiếm, trả lại tiền thừa', 'verb', '找你十块钱。', 'Zhǎo nǐ shí kuài qián.', 'Thối lại bạn mười đồng.', id, NULL, 'SHARED_找_zhǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_找_zhǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '看', 'kàn', 'kan', 'nhìn, xem, ngắm', 'verb', '让我看一看。', 'Ràng wǒ kàn yí kàn.', 'Để tôi xem thử nào.', id, NULL, 'SHARED_看_kàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_看_kàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '要', 'yào', 'yao', 'cần, muốn, phải', 'verb', '我要买这本书。', 'Wǒ yào mǎi zhè běn shū.', 'Tôi muốn mua quyển sách này.', id, NULL, 'SHARED_要_yào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_要_yào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '还', 'hái', 'hai', 'còn, vẫn còn', 'adverb', '你还要别的吗？', 'Nǐ hái yào biéde ma?', 'Bạn còn cần cái khác không?', id, NULL, 'SHARED_还_hái'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_还_hái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '别的', 'biéde', 'biede', 'cái khác, người khác', 'pronoun', '别的同学都来了。', 'Biéde tóngxué dōu lái le.', 'Các bạn học khác đều đến rồi.', id, NULL, 'SHARED_别的_biéde'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_别的_biéde';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '一共', 'yígòng', 'yigong', 'tổng cộng, tất cả', 'adverb', '一共多少钱？', 'Yígòng duōshao qián?', 'Tổng cộng bao nhiêu tiền?', id, NULL, 'SHARED_一共_yígòng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_一共_yígòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '点儿', 'diǎnr', 'dianr', 'chút ít, một ít', 'measure', '便宜点儿吧。', 'Piányi diǎnr ba.', 'Rẻ hơn một chút nhé.', id, NULL, 'SHARED_点儿_diǎnr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_点儿_diǎnr';

-- --- BÀI 11 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '校', 'xiào', 'xiao', 'trường học', 'noun', '母校', 'mǔxiào', 'trường cũ', id, NULL, 'SHARED_校_xiào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_校_xiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '学校', 'xuéxiào', 'xuexiao', 'trường học', 'noun', '我们在学校上课。', 'Wǒmen zài xuéxiào shàngkè.', 'Chúng tôi học ở trường.', id, NULL, 'SHARED_学校_xuéxiào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_学校_xuéxiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '大学', 'dàxué', 'daxue', 'trường đại học', 'noun', '北京大学', 'Běijīng Dàxué', 'Đại học Bắc Kinh', id, NULL, 'SHARED_大学_dàxué'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_大学_dàxué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '中学', 'zhōngxué', 'zhongxue', 'trường trung học', 'noun', '中学老师', 'zhōngxué lǎoshī', 'giáo viên cấp hai', id, NULL, 'SHARED_中学_zhōngxué'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_中学_zhōngxué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '小学', 'xiǎoxué', 'xiaoxue', 'trường tiểu học', 'noun', '小学生', 'xiǎoxuéshēng', 'học sinh tiểu học', id, NULL, 'SHARED_小学_xiǎoxué'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_小学_xiǎoxué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '教室', 'jiàoshì', 'jiaoshi', 'phòng học, lớp học', 'noun', '在教室里学习', 'zài jiàoshì lǐ xuéxí', 'học tập trong lớp học', id, NULL, 'SHARED_教室_jiàoshì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_教室_jiàoshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '课', 'kè', 'ke', 'bài học, tiết học, môn học', 'noun', '今天有三节课。', 'Jīntiān yǒu sān jié kè.', 'Hôm nay có ba tiết học.', id, NULL, 'SHARED_课_kè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_课_kè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上课', 'shàngkè', 'shangke', 'lên lớp, vào học', 'verb', '早上八点上课。', 'Zǎoshang bā diǎn shàngkè.', 'Tám giờ sáng vào học.', id, NULL, 'SHARED_上课_shàngkè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_上课_shàngkè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下课', 'xiàkè', 'xiake', 'tan học, hết giờ học', 'verb', '现在下课了。', 'Xiànzài xiàkè le.', 'Bây giờ tan học rồi.', id, NULL, 'SHARED_下课_xiàkè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_下课_xiàkè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '书', 'shū', 'shu', 'sách, cuốn sách', 'noun', '我看书。', 'Wǒ kàn shū.', 'Tôi đọc sách.', id, NULL, 'SHARED_书_shū'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_书_shū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '本', 'běn', 'ben', 'quyển, cuốn (lượng từ sách)', 'measure', '一本书', 'yì běn shū', 'một cuốn sách', id, NULL, 'SHARED_本_běn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_本_běn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '本子', 'běnzi', 'benzi', 'vở, cuốn tập', 'noun', '练习本子', 'liànxí běnzi', 'vở bài tập', id, NULL, 'SHARED_本子_běnzi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_本子_běnzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '笔', 'bǐ', 'bi', 'bút, cây bút', 'noun', '我有一支铅笔。', 'Wǒ yǒu yì zhī qiānbǐ.', 'Tôi có một cây bút chì.', id, NULL, 'SHARED_笔_bǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_笔_bǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '桌子', 'zhuōzi', 'zhuozi', 'cái bàn', 'noun', '桌子上有一本书。', 'Zhuōzi shang yǒu yì běn shū.', 'Trên bàn có một cuốn sách.', id, NULL, 'SHARED_桌子_zhuōzi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_桌子_zhuōzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '椅子', 'yǐzi', 'yizi', 'cái ghế', 'noun', '请坐椅子上。', 'Qǐng zuò yǐzi shang.', 'Xin hãy ngồi lên ghế.', id, NULL, 'SHARED_椅子_yǐzi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_椅子_yǐzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '里', 'lǐ', 'li', 'trong, bên trong', 'noun', '书包里', 'shūbāo lǐ', 'trong cặp sách', id, NULL, 'SHARED_里_lǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_里_lǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外', 'wài', 'wai', 'ngoài, bên ngoài', 'noun', '窗外', 'chuāng wài', 'ngoài cửa sổ', id, NULL, 'SHARED_外_wài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_外_wài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上', 'shàng', 'shang', 'trên, lên, đi lên', 'verb', '上楼', 'shàng lóu', 'lên lầu', id, NULL, 'SHARED_上_shàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_上_shàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下', 'xià', 'xia', 'dưới, xuống, đi xuống', 'verb', '下雨', 'xià yǔ', 'trời mưa', id, NULL, 'SHARED_下_xià'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_下_xià';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '图书馆', 'túshūguǎn', 'tushuguan', 'thư viện', 'noun', '在图书馆看书', 'zài túshūguǎn kànshū', 'đọc sách ở thư viện', id, NULL, 'SHARED_图书馆_túshūguǎn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_图书馆_túshūguǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '医院', 'yīyuàn', 'yiyuan', 'bệnh viện', 'noun', '他在医院工作。', 'Tā zài yīyuàn gōngzuò.', 'Anh ấy làm việc ở bệnh viện.', id, NULL, 'SHARED_医院_yīyuàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_医院_yīyuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '医生', 'yīshēng', 'yisheng', 'bác sĩ', 'noun', '医生很耐心。', 'Yīshēng hěn nàixīn.', 'Bác sĩ rất kiên nhẫn.', id, NULL, 'SHARED_医生_yīshēng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_医生_yīshēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '药', 'yào', 'yao', 'thuốc', 'noun', '吃药', 'chī yào', 'uống thuốc', id, NULL, 'SHARED_药_yào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_药_yào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '机场', 'jīchǎng', 'jichang', 'sân bay, phi trường', 'noun', '去机场接朋友', 'qù jīchǎng jiē péngyou', 'ra sân bay đón bạn', id, NULL, 'SHARED_机场_jīchǎng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_机场_jīchǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '站', 'zhàn', 'zhan', 'trạm, ga, đứng', 'noun', '火车站', 'huǒchēzhàn', 'ga xe lửa', id, NULL, 'SHARED_站_zhàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_站_zhàn';

-- --- BÀI 12 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '前边', 'qiánbian', 'qianbian', 'phía trước', 'noun', '往前边走。', 'Wǎng qiánbian zǒu.', 'Hãy đi về phía trước.', id, NULL, 'SHARED_前边_qiánbian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_前边_qiánbian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '后边', 'hòubian', 'houbian', 'phía sau', 'noun', '他坐在我后边。', 'Tā zuò zài wǒ hòubian.', 'Anh ấy ngồi phía sau tôi.', id, NULL, 'SHARED_后边_hòubian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_后边_hòubian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '左边', 'zuǒbian', 'zuobian', 'bên trái', 'noun', '学校在左边。', 'Xuéxiào zài zuǒbian.', 'Trường học ở phía bên trái.', id, NULL, 'SHARED_左边_zuǒbian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_左边_zuǒbian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '右边', 'yòubian', 'youbian', 'bên phải', 'noun', '他在我右边。', 'Tā zài wǒ yòubian.', 'Anh ấy ở bên phải tôi.', id, NULL, 'SHARED_右边_yòubian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_右边_yòubian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '左', 'zuǒ', 'zuo', 'trái', 'noun', '向左转', 'xiàng zuǒ zhuǎn', 'rẽ trái', id, NULL, 'SHARED_左_zuǒ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_左_zuǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '右', 'yòu', 'you', 'phải', 'noun', '向右拐', 'xiàng yòu guǎi', 'rẽ phải', id, NULL, 'SHARED_右_yòu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_右_yòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '东边', 'dōngbian', 'dongbian', 'phía đông', 'noun', '太阳从东边升起。', 'Tàiyáng cóng dōngbian shēngqǐ.', 'Mặt trời mọc từ hướng đông.', id, NULL, 'SHARED_东边_dōngbian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_东边_dōngbian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '西边', 'xībian', 'xibian', 'phía tây', 'noun', '太阳在西边落下。', 'Tàiyáng zài xībian luòxià.', 'Mặt trời lặn ở hướng tây.', id, NULL, 'SHARED_西边_xībian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_西边_xībian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '南边', 'nánbian', 'nanbian', 'phía nam', 'noun', '南边很温暖。', 'Nánbian hěn wēnnuǎn.', 'Phía nam rất ấm áp.', id, NULL, 'SHARED_南边_nánbian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_南边_nánbian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '北边', 'běibian', 'beibian', 'phía bắc', 'noun', '北边经常下雪。', 'Běibian jīngcháng xiàxuě.', 'Phía bắc thường có tuyết rơi.', id, NULL, 'SHARED_北边_běibian'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_北边_běibian';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '往', 'wǎng', 'wang', 'hướng về, đi về phía', 'preposition', '往前走一百米。', 'Wǎng qián zǒu yìbǎi mǐ.', 'Đi về phía trước 100 mét.', id, NULL, 'SHARED_往_wǎng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_往_wǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '向', 'xiàng', 'xiang', 'hướng tới, về phía', 'preposition', '向前看', 'xiàng qián kàn', 'nhìn về phía trước', id, NULL, 'SHARED_向_xiàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_向_xiàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '离', 'lí', 'li', 'cách, rời khỏi', 'preposition', '我家离学校很近。', 'Wǒ jiā lí xuéxiào hěn jìn.', 'Nhà tôi cách trường rất gần.', id, NULL, 'SHARED_离_lí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_离_lí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '近', 'jìn', 'jin', 'gần', 'adjective', '离这里不远，很近。', 'Lí zhèlǐ bù yuǎn, hěn jìn.', 'Cách đây không xa, rất gần.', id, NULL, 'SHARED_近_jìn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_近_jìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '远', 'yuǎn', 'yuan', 'xa', 'adjective', '北京离这里很远。', 'Běijīng lí zhèlǐ hěn yuǎn.', 'Bắc Kinh cách đây rất xa.', id, NULL, 'SHARED_远_yuǎn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_远_yuǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '坐', 'zuò', 'zuo', 'ngồi, đi (bằng xe/máy bay)', 'verb', '坐公共汽车', 'zuò gōnggòng qìchē', 'đi xe buýt', id, NULL, 'SHARED_坐_zuò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_坐_zuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '车', 'chē', 'che', 'xe, xe cộ', 'noun', '开车', 'kāi chē', 'lái xe', id, NULL, 'SHARED_车_chē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_车_chē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汽车', 'qìchē', 'qiche', 'xe ô tô', 'noun', '他买了一辆汽车。', 'Tā mǎi le yí liàng qìchē.', 'Anh ấy đã mua một chiếc ô tô.', id, NULL, 'SHARED_汽车_qìchē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_汽车_qìchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出租车', 'chūzūchē', 'chuzuche', 'xe taxi', 'noun', '我们打出租车去吧。', 'Wǒmen dǎ chūzūchē qù ba.', 'Chúng ta bắt taxi đi nhé.', id, NULL, 'SHARED_出租车_chūzūchē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_出租车_chūzūchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '公共汽车', 'gōnggòng qìchē', 'gonggong qiche', 'xe buýt', 'noun', '坐公共汽车很方便。', 'Zuò gōnggòng qìchē hěn fāngbiàn.', 'Đi xe buýt rất tiện lợi.', id, NULL, 'SHARED_公共汽车_gōnggòng qìchē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_公共汽车_gōnggòng qìchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '火车', 'huǒchē', 'huoche', 'tàu hỏa, xe lửa', 'noun', '坐火车去旅行', 'zuò huǒchē qù lǚxíng', 'đi tàu hỏa du lịch', id, NULL, 'SHARED_火车_huǒchē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_火车_huǒchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '飞机', 'fēijī', 'feiji', 'máy bay', 'noun', '坐飞机两个小时就到了。', 'Zuò fēijī liǎng gè xiǎoshí jiù dào le.', 'Đi máy bay hai tiếng là đến nơi.', id, NULL, 'SHARED_飞机_fēijī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_飞机_fēijī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开', 'kāi', 'kai', 'mở, lái (xe), bắt đầu', 'verb', '开车要小心。', 'Kāi chē yào xiǎoxīn.', 'Lái xe cần cẩn thận.', id, NULL, 'SHARED_开_kāi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_开_kāi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '路', 'lù', 'lu', 'đường, tuyến đường', 'noun', '这条路很宽。', 'Zhè tiáo lù hěn kuān.', 'Con đường này rất rộng.', id, NULL, 'SHARED_路_lù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_路_lù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '路口', 'lùkǒu', 'lukou', 'ngã tư, giao lộ', 'noun', '在下一个路口向右转。', 'Zài xià yí gè lùkǒu xiàng yòu zhuǎn.', 'Tại ngã tư tiếp theo rẽ phải.', id, NULL, 'SHARED_路口_lùkǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_路口_lùkǒu';

-- --- BÀI 13 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '气', 'qì', 'qi', 'khí, hơi, không khí', 'noun', '生气', 'shēngqì', 'tức giận', id, NULL, 'SHARED_气_qì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_气_qì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '天气', 'tiānqì', 'tianqi', 'thời tiết', 'noun', '今天天气真好！', 'Jīntiān tiānqì zhēn hǎo!', 'Thời tiết hôm nay thật đẹp!', id, NULL, 'SHARED_天气_tiānqì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_天气_tiānqì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冷', 'lěng', 'leng', 'lạnh, rét', 'adjective', '今天太冷了。', 'Jīntiān tài lěng le.', 'Hôm nay lạnh quá.', id, NULL, 'SHARED_冷_lěng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_冷_lěng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '热', 'rè', 're', 'nóng, ấm áp', 'adjective', '夏天天气很热。', 'Xiàtiān tiānqì hěn rè.', 'Mùa hè thời tiết rất nóng.', id, NULL, 'SHARED_热_rè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_热_rè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '雨', 'yǔ', 'yu', 'mưa', 'noun', '下大雨', 'xià dàyǔ', 'mưa to', id, NULL, 'SHARED_雨_yǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_雨_yǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下雨', 'xiàyǔ', 'xiayu', 'trời mưa, đổ mưa', 'verb', '外面下雨了，带伞吧。', 'Wàimiàn xiàyǔ le, dài sǎn ba.', 'Bên ngoài mưa rồi, mang ô theo nhé.', id, NULL, 'SHARED_下雨_xiàyǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_下雨_xiàyǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '雪', 'xuě', 'xue', 'tuyết', 'noun', '白雪', 'báixuě', 'tuyết trắng', id, NULL, 'SHARED_雪_xuě'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_雪_xuě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下雪', 'xiàxuě', 'xiaxue', 'tuyết rơi', 'verb', '冬天这里常常下雪。', 'Dōngtiān zhèlǐ chángcháng xiàxuě.', 'Mùa đông ở đây thường có tuyết rơi.', id, NULL, 'SHARED_下雪_xiàxuě'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_下雪_xiàxuě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '风', 'fēng', 'feng', 'gió', 'noun', '刮大风', 'guā dàfēng', 'gió thổi to', id, NULL, 'SHARED_风_fēng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_风_fēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阴', 'yīn', 'yin', 'u ám, nhiều mây', 'adjective', '今天是阴天。', 'Jīntiān shì yīntiān.', 'Hôm nay trời râm mát.', id, NULL, 'SHARED_阴_yīn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_阴_yīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晴', 'qíng', 'qing', 'nắng, trời quang đãng', 'adjective', '晴空万里', 'qíngkōng wànlǐ', 'trời quang mây tạnh', id, NULL, 'SHARED_晴_qíng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_晴_qíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阴天', 'yīntiān', 'yintian', 'ngày u ám, trời râm', 'noun', '阴天适合散步。', 'Yīntiān shìhé sànbù.', 'Trời râm thích hợp đi dạo.', id, NULL, 'SHARED_阴天_yīntiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_阴天_yīntiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晴天', 'qíngtiān', 'qingtian', 'ngày nắng, trời đẹp', 'noun', '明天是个大晴天。', 'Míngtiān shì gè dà qíngtiān.', 'Ngày mai là một ngày nắng ráo.', id, NULL, 'SHARED_晴天_qíngtiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_晴天_qíngtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '春', 'chūn', 'chun', 'mùa xuân', 'noun', '春天来了。', 'Chūntiān lái le.', 'Mùa xuân đến rồi.', id, NULL, 'SHARED_春_chūn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_春_chūn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '春天', 'chūntiān', 'chuntian', 'mùa xuân', 'noun', '春天百花盛开。', 'Chūntiān bǎihuā shèngkāi.', 'Mùa xuân trăm hoa đua nở.', id, NULL, 'SHARED_春天_chūntiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_春天_chūntiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '夏', 'xià', 'xia', 'mùa hè', 'noun', '夏季', 'xiàjì', 'mùa hè', id, NULL, 'SHARED_夏_xià'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_夏_xià';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '夏天', 'xiàtiān', 'xiatian', 'mùa hè', 'noun', '夏天很热。', 'Xiàtiān hěn rè.', 'Mùa hè rất nóng.', id, NULL, 'SHARED_夏天_xiàtiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_夏天_xiàtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '秋', 'qiū', 'qiu', 'mùa thu', 'noun', '中秋节', 'Zhōngqiū Jié', 'Tết Trung Thu', id, NULL, 'SHARED_秋_qiū'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_秋_qiū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '秋天', 'qiūtiān', 'qiutian', 'mùa thu', 'noun', '秋天的天气很舒服。', 'Qiūtiān de tiānqì hěn shūfu.', 'Thời tiết mùa thu rất dễ chịu.', id, NULL, 'SHARED_秋天_qiūtiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_秋天_qiūtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冬', 'dōng', 'dong', 'mùa đông', 'noun', '冬季', 'dōngjì', 'mùa đông', id, NULL, 'SHARED_冬_dōng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_冬_dōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冬天', 'dōngtiān', 'dongtian', 'mùa đông', 'noun', '冬天很冷。', 'Dōngtiān hěn lěng.', 'Mùa đông rất lạnh.', id, NULL, 'SHARED_冬天_dōngtiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_冬天_dōngtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '怎么样', 'zěnmeyàng', 'zenmeyang', 'thế nào, ra sao', 'pronoun', '这件衣服怎么样？', 'Zhè jiàn yīfu zěnmeyàng?', 'Chiếc áo này thế nào?', id, NULL, 'SHARED_怎么样_zěnmeyàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_怎么样_zěnmeyàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '度', 'dù', 'du', 'độ (nhiệt độ, góc)', 'measure', '今天最高气温25度。', 'Jīntiān zuìgāo qìwēn èrshíwǔ dù.', 'Hôm nay nhiệt độ cao nhất 25 độ.', id, NULL, 'SHARED_度_dù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_度_dù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '舒服', 'shūfu', 'shufu', 'dễ chịu, thoải mái', 'adjective', '这里的空气很舒服。', 'Zhèlǐ de kōngqì hěn shūfu.', 'Không khí ở đây rất dễ chịu.', id, NULL, 'SHARED_舒服_shūfu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_舒服_shūfu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '太阳', 'tàiyáng', 'taiyang', 'mặt trời', 'noun', '太阳出来了。', 'Tàiyáng chūlai le.', 'Mặt trời đã ló dạng rồi.', id, NULL, 'SHARED_太阳_tàiyáng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_太阳_tàiyáng';

-- --- BÀI 14 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '做', 'zuò', 'zuo', 'làm, chế tạo', 'verb', '你在做什么？', 'Nǐ zài zuò shénme?', 'Bạn đang làm gì thế?', id, NULL, 'SHARED_做_zuò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_做_zuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '工作', 'gōngzuò', 'gongzuo', 'công việc, làm việc', 'verb', '我爸爸在银行工作。', 'Wǒ bàba zài yínháng gōngzuò.', 'Bố tôi làm việc ở ngân hàng.', id, NULL, 'SHARED_工作_gōngzuò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_工作_gōngzuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '事', 'shì', 'shi', 'việc, sự việc', 'noun', '今天我有很多事。', 'Jīntiān wǒ yǒu hěn duō shì.', 'Hôm nay tôi có rất nhiều việc.', id, NULL, 'SHARED_事_shì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_事_shì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '事情', 'shìqing', 'shiqing', 'sự việc, công việc', 'noun', '这是一件重要的事。', 'Zhè shì yí jiàn zhòngyào de shì.', 'Đây là một việc quan trọng.', id, NULL, 'SHARED_事情_shìqing'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_事情_shìqing';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '听', 'tīng', 'ting', 'nghe', 'verb', '听音乐', 'tīng yīnyuè', 'nghe nhạc', id, NULL, 'SHARED_听_tīng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_听_tīng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '写', 'xiě', 'xie', 'viết', 'verb', '写汉字', 'xiě hànzì', 'viết chữ Hán', id, NULL, 'SHARED_写_xiě'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_写_xiě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '读', 'dú', 'du', 'đọc', 'verb', '读课文', 'dú kèwén', 'đọc bài khóa', id, NULL, 'SHARED_读_dú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_读_dú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '看书', 'kànshū', 'kanshu', 'đọc sách', 'verb', '我喜欢看书。', 'Wǒ xǐhuan kànshū.', 'Tôi thích đọc sách.', id, NULL, 'SHARED_看书_kànshū'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_看书_kànshū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '画', 'huà', 'hua', 'vẽ, bức tranh', 'verb', '画画儿', 'huà huàr', 'vẽ tranh', id, NULL, 'SHARED_画_huà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_画_huà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '唱', 'chàng', 'chang', 'hát', 'verb', '唱歌', 'chàng gē', 'hát một bài', id, NULL, 'SHARED_唱_chàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_唱_chàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '歌', 'gē', 'ge', 'bài hát, ca khúc', 'noun', '这首歌很好听。', 'Zhè shǒu gē hěn hǎotīng.', 'Bài hát này rất hay.', id, NULL, 'SHARED_歌_gē'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_歌_gē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跳', 'tiào', 'tiao', 'nhảy, khiêu vũ', 'verb', '跳高', 'tiàogāo', 'nhảy cao', id, NULL, 'SHARED_跳_tiào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_跳_tiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跳舞', 'tiàowǔ', 'tiaowu', 'khiêu vũ, nhảy múa', 'verb', '她跳舞跳得很好。', 'Tā tiàowǔ tiào de hěn hǎo.', 'Cô ấy nhảy múa rất đẹp.', id, NULL, 'SHARED_跳舞_tiàowǔ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_跳舞_tiàowǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跑', 'pǎo', 'pao', 'chạy', 'verb', '快跑！', 'Kuài pǎo!', 'Mau chạy đi!', id, NULL, 'SHARED_跑_pǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_跑_pǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跑步', 'pǎobù', 'paobu', 'chạy bộ', 'verb', '每天早晨跑步', 'měitiān zǎochén pǎobù', 'chạy bộ mỗi sáng sớm', id, NULL, 'SHARED_跑步_pǎobù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_跑步_pǎobù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打', 'dǎ', 'da', 'đánh, chơi (bóng), gọi (điện thoại)', 'verb', '打电话', 'dǎ diànhuà', 'gọi điện thoại', id, NULL, 'SHARED_打_dǎ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_打_dǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电话', 'diànhuà', 'dianhua', 'điện thoại', 'noun', '给你打电话', 'gěi nǐ dǎ diànhuà', 'gọi điện thoại cho bạn', id, NULL, 'SHARED_电话_diànhuà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_电话_diànhuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电脑', 'diànnǎo', 'diannao', 'máy vi tính', 'noun', '用电脑工作', 'yòng diànnǎo gōngzuò', 'dùng máy tính làm việc', id, NULL, 'SHARED_电脑_diànnǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_电脑_diànnǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电视', 'diànshì', 'dianshi', 'truyền hình, ti vi', 'noun', '看电视', 'kàn diànshì', 'xem ti vi', id, NULL, 'SHARED_电视_diànshì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_电视_diànshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电影', 'diànyǐng', 'dianying', 'phim, điện ảnh', 'noun', '去电影院看电影', 'qù diànyǐngyuàn kàn diànyǐng', 'đi rạp chiếu phim xem phim', id, NULL, 'SHARED_电影_diànyǐng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_电影_diànyǐng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '用', 'yòng', 'yong', 'dùng, sử dụng', 'verb', '可以用铅笔写吗？', 'Kěyǐ yòng qiānbǐ xiě ma?', 'Có thể dùng bút chì viết không?', id, NULL, 'SHARED_用_yòng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_用_yòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帮助', 'bāngzhù', 'bangzhu', 'giúp đỡ, sự trợ giúp', 'verb', '谢谢你的帮助！', 'Xièxie nǐ de bāngzhù!', 'Cảm ơn sự giúp đỡ của bạn!', id, NULL, 'SHARED_帮助_bāngzhù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_帮助_bāngzhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帮', 'bāng', 'bang', 'giúp, hỗ trợ', 'verb', '请帮我拿一下。', 'Qǐng bāng wǒ ná yíxià.', 'Xin giúp tôi cầm một chút.', id, NULL, 'SHARED_帮_bāng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_帮_bāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '找', 'zhǎo', 'zhao', 'tìm kiếm', 'verb', '你在找什么？', 'Nǐ zài zhǎo shénme?', 'Bạn đang tìm gì thế?', id, NULL, 'SHARED_找_zhǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_找_zhǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '给', 'gěi', 'gei', 'cho, gửi cho', 'verb', '我给他发邮件。', 'Wǒ gěi tā fā yóujiàn.', 'Tôi gửi thư điện tử cho anh ấy.', id, NULL, 'SHARED_给_gěi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_给_gěi';

-- --- BÀI 15 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '身体', 'shēntǐ', 'shenti', 'thân thể, sức khỏe', 'noun', '祝你身体健康！', 'Zhù nǐ shēntǐ jiànkāng!', 'Chúc bạn sức khỏe dồi dào!', id, NULL, 'SHARED_身体_shēntǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_身体_shēntǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '体', 'tǐ', 'ti', 'thể, thân thể', 'noun', '体育', 'tǐyù', 'thể dục', id, NULL, 'SHARED_体_tǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_体_tǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '病', 'bìng', 'bing', 'bệnh tật, bị ốm', 'noun', '他生病了，没来上学。', 'Tā shēngbìng le, méi lái shàngxué.', 'Cậu ấy ốm rồi, không đi học.', id, NULL, 'SHARED_病_bìng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_病_bìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生病', 'shēngbìng', 'shengbing', 'bị ốm, ngã bệnh', 'verb', '天气变冷容易生病。', 'Tiānqì biàn lěng róngyì shēngbìng.', 'Thời tiết trở lạnh dễ bị ốm.', id, NULL, 'SHARED_生病_shēngbìng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_生病_shēngbìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '疼', 'téng', 'teng', 'đau, đau đớn', 'adjective', '我头疼。', 'Wǒ tóuténg.', 'Tôi bị đau đầu.', id, NULL, 'SHARED_疼_téng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_疼_téng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '头', 'tóu', 'tou', 'đầu, phần đầu', 'noun', '洗头', 'xǐ tóu', 'gội đầu', id, NULL, 'SHARED_头_tóu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_头_tóu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '头发', 'tóufa', 'toufa', 'tóc, mái tóc', 'noun', '她的头发很长。', 'Tā de tóufa hěn cháng.', 'Tóc cô ấy rất dài.', id, NULL, 'SHARED_头发_tóufa'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_头发_tóufa';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '眼睛', 'yǎnjing', 'yanjing', 'mắt, đôi mắt', 'noun', '大大的眼睛', 'dàdà de yǎnjing', 'đôi mắt to tròn', id, NULL, 'SHARED_眼睛_yǎnjing'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_眼睛_yǎnjing';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '嘴', 'zuǐ', 'zui', 'miệng, mồm', 'noun', '张开嘴', 'zhāngkāi zuǐ', 'há miệng ra', id, NULL, 'SHARED_嘴_zuǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_嘴_zuǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '耳朵', 'ěrduo', 'erduo', 'tai, vành tai', 'noun', '他的耳朵很灵。', 'Tā de ěrduo hěn líng.', 'Tai anh ấy rất thính.', id, NULL, 'SHARED_耳朵_ěrduo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_耳朵_ěrduo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '手', 'shǒu', 'shou', 'tay, bàn tay', 'noun', '洗手', 'xǐ shǒu', 'rửa tay', id, NULL, 'SHARED_手_shǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_手_shǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '脚', 'jiǎo', 'jiao', 'chân, bàn chân', 'noun', '脚疼', 'jiǎo téng', 'đau chân', id, NULL, 'SHARED_脚_jiǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_脚_jiǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '感冒', 'gǎnmào', 'ganmao', 'cảm cúm', 'verb', '多喝热水，别感冒了。', 'Duō hē rèshuǐ, bié gǎnmào le.', 'Uống nhiều nước ấm, đừng để bị cảm cúm.', id, NULL, 'SHARED_感冒_gǎnmào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_感冒_gǎnmào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发烧', 'fāshāo', 'fashao', 'phát sốt, sốt', 'verb', '他发烧到三十九度。', 'Tā fāshāo dào sānshíjiǔ dù.', 'Cậu ấy bị sốt đến 39 độ.', id, NULL, 'SHARED_发烧_fāshāo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_发烧_fāshāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '休', 'xiū', 'xiu', 'nghỉ ngơi', 'verb', '休假', 'xiūjià', 'nghỉ phép', id, NULL, 'SHARED_休_xiū'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_休_xiū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '息', 'xī', 'xi', 'hơi thở, tin tức', 'noun', '消息', 'xiāoxi', 'tin tức', id, NULL, 'SHARED_息_xī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_息_xī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '休息', 'xiūxi', 'xiuxi', 'nghỉ ngơi', 'verb', '累了就休息一会儿吧。', 'Lèi le jiù xiūxi yíhuìr ba.', 'Mệt thì nghỉ ngơi một chút đi.', id, NULL, 'SHARED_休息_xiūxi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_休息_xiūxi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '累', 'lèi', 'lei', 'mệt mỏi', 'adjective', '今天工作真累。', 'Jīntiān gōngzuò zhēn lèi.', 'Hôm nay làm việc mệt thật.', id, NULL, 'SHARED_累_lèi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_累_lèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饿', 'è', 'e', 'đói', 'adjective', '我肚子饿了。', 'Wǒ dùzi è le.', 'Bụng tôi đói rồi.', id, NULL, 'SHARED_饿_è'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_饿_è';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '渴', 'kě', 'ke', 'khát (nước)', 'adjective', '我很渴，想喝水。', 'Wǒ hěn kě, xiǎng hē shuǐ.', 'Tôi rất khát, muốn uống nước.', id, NULL, 'SHARED_渴_kě'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_渴_kě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好点儿', 'hǎodiǎnr', 'haodianr', 'đỡ hơn một chút', 'phrase', '你身体好点儿了吗？', 'Nǐ shēntǐ hǎodiǎnr le ma?', 'Sức khỏe của bạn đã đỡ hơn chưa?', id, NULL, 'SHARED_好点儿_hǎodiǎnr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_好点儿_hǎodiǎnr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '药店', 'yàodiàn', 'yaodian', 'tiệm thuốc, nhà thuốc', 'noun', '去药店买感冒药', 'qù yàodiàn mǎi gǎnmàoyào', 'ra tiệm thuốc mua thuốc cảm', id, NULL, 'SHARED_药店_yàodiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_药店_yàodiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '快', 'kuài', 'kuai', 'nhanh, sắp sửa', 'adjective', '他跑得真快！', 'Tā pǎo de zhēn kuài!', 'Anh ấy chạy nhanh thật!', id, NULL, 'SHARED_快_kuài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_快_kuài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '慢', 'màn', 'man', 'chậm, từ từ', 'adjective', '请说慢一点。', 'Qǐng shuō màn yìdiǎn.', 'Xin hãy nói chậm một chút.', id, NULL, 'SHARED_慢_màn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_慢_màn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '洗', 'xǐ', 'xi', 'rửa, giặt, gội', 'verb', '饭前要洗手。', 'Fàn qián yào xǐ shǒu.', 'Trước khi ăn cơm phải rửa tay.', id, NULL, 'SHARED_洗_xǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_洗_xǐ';

-- --- BÀI 16 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爱', 'ài', 'ai', 'yêu thích, tình yêu', 'verb', '热爱生活', 'rè''ài shēnghuó', 'yêu cuộc sống', id, NULL, 'SHARED_爱_ài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_爱_ài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爱好', 'àihào', 'aihao', 'sở thích', 'noun', '你的爱好是什么？', 'Nǐ de àihào shì shénme?', 'Sở thích của bạn là gì?', id, NULL, 'SHARED_爱好_àihào'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_爱好_àihào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '球', 'qiú', 'qiu', 'quả bóng, môn bóng', 'noun', '买一个足球', 'mǎi yí gè zúqiú', 'mua một quả bóng đá', id, NULL, 'SHARED_球_qiú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_球_qiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '足球', 'zúqiú', 'zuqiu', 'bóng đá', 'noun', '踢足球', 'tī zúqiú', 'đá bóng', id, NULL, 'SHARED_足球_zúqiú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_足球_zúqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '篮球', 'lánqiú', 'lanqiu', 'bóng rổ', 'noun', '打篮球', 'dǎ lánqiú', 'chơi bóng rổ', id, NULL, 'SHARED_篮球_lánqiú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_篮球_lánqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '网球', 'wǎngqiú', 'wangqiu', 'quần vợt, tennis', 'noun', '打网球', 'dǎ wǎngqiú', 'chơi tennis', id, NULL, 'SHARED_网球_wǎngqiú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_网球_wǎngqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '乒乓球', 'pīngpāngqiú', 'pingpangqiu', 'bóng bàn', 'noun', '中国人很喜欢打乒乓球。', 'Zhōngguó rén hěn xǐhuan dǎ pīngpāngqiú.', 'Người Trung Quốc rất thích chơi bóng bàn.', id, NULL, 'SHARED_乒乓球_pīngpāngqiú'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_乒乓球_pīngpāngqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游泳', 'yóuyǒng', 'youyong', 'bơi lội', 'verb', '夏天去游泳', 'xiàtiān qù yóuyǒng', 'mùa hè đi bơi', id, NULL, 'SHARED_游泳_yóuyǒng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_游泳_yóuyǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游', 'yóu', 'you', 'bơi, du ngoạn', 'verb', '鱼在水里游。', 'Yú zài shuǐ lǐ yóu.', 'Cá bơi trong nước.', id, NULL, 'SHARED_游_yóu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_游_yóu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '泳', 'yǒng', 'yong', 'bơi lội', 'noun', '游泳池', 'yóuyǒngchí', 'hồ bơi', id, NULL, 'SHARED_泳_yǒng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_泳_yǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '音乐', 'yīnyuè', 'yinyue', 'âm nhạc', 'noun', '听轻音乐', 'tīng qīngyīnyuè', 'nghe nhạc nhẹ', id, NULL, 'SHARED_音乐_yīnyuè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_音乐_yīnyuè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '音', 'yīn', 'yin', 'âm thanh, tiếng', 'noun', '声音', 'shēngyīn', 'âm thanh', id, NULL, 'SHARED_音_yīn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_音_yīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '乐', 'yuè', 'yue', 'nhạc, âm nhạc', 'noun', '乐器', 'yuèqì', 'nhạc cụ', id, NULL, 'SHARED_乐_yuè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_乐_yuè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '歌儿', 'gēr', 'ger', 'bài hát', 'noun', '唱一首歌儿', 'chàng yì shǒu gēr', 'hát một bài hát', id, NULL, 'SHARED_歌儿_gēr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_歌儿_gēr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '玩儿', 'wánr', 'wanr', 'chơi, vui đùa', 'verb', '周末去公园玩儿。', 'Zhōumò qù gōngyuán wánr.', 'Cuối tuần đi công viên chơi.', id, NULL, 'SHARED_玩儿_wánr'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_玩儿_wánr';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '玩', 'wán', 'wan', 'chơi', 'verb', '玩电脑游戏', 'wán diànnǎo yóuxì', 'chơi game máy tính', id, NULL, 'SHARED_玩_wán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_玩_wán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游戏', 'yóuxì', 'youxi', 'trò chơi, game', 'noun', '好玩的游戏', 'hǎowán de yóuxì', 'trò chơi thú vị', id, NULL, 'SHARED_游戏_yóuxì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_游戏_yóuxì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上网', 'shàngwǎng', 'shangwang', 'lên mạng, truy cập internet', 'verb', '在网上查资料', 'zài wǎngshang chá zīliào', 'tra tài liệu trên mạng', id, NULL, 'SHARED_上网_shàngwǎng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_上网_shàngwǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '网', 'wǎng', 'wang', 'mạng, lưới', 'noun', '互联网', 'hùliánwǎng', 'mạng internet', id, NULL, 'SHARED_网_wǎng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_网_wǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '照片', 'zhàopiàn', 'zhaopian', 'bức ảnh, tấm ảnh', 'noun', '这是一张全家福照片。', 'Zhè shì yì zhāng quánjiāfú zhàopiàn.', 'Đây là một bức ảnh chụp cả gia đình.', id, NULL, 'SHARED_照片_zhàopiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_照片_zhàopiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '照相', 'zhàoxiàng', 'zhaoxiang', 'chụp ảnh', 'verb', '我们在这里照张相吧。', 'Wǒmen zài zhèlǐ zhào zhāng xiàng ba.', 'Chúng ta chụp một bức ảnh ở đây nhé.', id, NULL, 'SHARED_照相_zhàoxiàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_照相_zhàoxiàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '张', 'zhāng', 'zhang', 'tờ, bức (lượng từ ảnh, bàn)', 'measure', '一张纸', 'yì zhāng zhǐ', 'một tờ giấy', id, NULL, 'SHARED_张_zhāng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_张_zhāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '看电影', 'kàndiànyǐng', 'kandianying', 'xem phim', 'verb', '今晚一起去看电影吧。', 'Jīnwǎn yìqǐ qù kàndiànyǐng ba.', 'Tối nay cùng đi xem phim nhé.', id, NULL, 'SHARED_看电影_kàndiànyǐng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_看电影_kàndiànyǐng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电视机', 'diànshìjī', 'dianshiji', 'máy thu hình, ti vi', 'noun', '买一台新电视机', 'mǎi yì tái xīn diànshìjī', 'mua một chiếc ti vi mới', id, NULL, 'SHARED_电视机_diànshìjī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_电视机_diànshìjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '乐意', 'lèyì', 'leyi', 'bằng lòng, vui lòng', 'verb', '我很乐意帮助你。', 'Wǒ hěn lèyì bāngzhù nǐ.', 'Tôi rất vui lòng được giúp bạn.', id, NULL, 'SHARED_乐意_lèyì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_乐意_lèyì';

-- --- BÀI 17 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '衣服', 'yīfu', 'yifu', 'quần áo, trang phục', 'noun', '穿新衣服', 'chuān xīn yīfu', 'mặc quần áo mới', id, NULL, 'SHARED_衣服_yīfu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_衣服_yīfu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '衣', 'yī', 'yi', 'áo, y phục', 'noun', '雨衣', 'yǔyī', 'áo mưa', id, NULL, 'SHARED_衣_yī'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_衣_yī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '穿', 'chuān', 'chuan', 'mặc (áo/quần), đi (giày)', 'verb', '穿上外套', 'chuān shang wàitào', 'mặc áo khoác vào', id, NULL, 'SHARED_穿_chuān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_穿_chuān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '戴', 'dài', 'dai', 'đeo, đội (mũ, kính)', 'verb', '戴眼镜', 'dài yǎnjìng', 'đeo kính mắt', id, NULL, 'SHARED_戴_dài'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_戴_dài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帽子', 'màozi', 'maozi', 'mũ, nón', 'noun', '一顶红帽子', 'yì dǐng hóng màozi', 'một chiếc mũ đỏ', id, NULL, 'SHARED_帽子_màozi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_帽子_màozi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '裤子', 'kùzi', 'kuzi', 'quần', 'noun', '一条牛仔裤', 'yì tiáo niúzǎikù', 'một chiếc quần bò', id, NULL, 'SHARED_裤子_kùzi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_裤子_kùzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鞋', 'xié', 'xie', 'giày, dép', 'noun', '一双皮鞋', 'yì shuāng píxié', 'một đôi giày da', id, NULL, 'SHARED_鞋_xié'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_鞋_xié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鞋子', 'xiézi', 'xiezi', 'đôi giày', 'noun', '这双鞋子很舒服。', 'Zhè shuāng xiézi hěn shūfu.', 'Đôi giày này rất êm chân.', id, NULL, 'SHARED_鞋子_xiézi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_鞋子_xiézi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '双', 'shuāng', 'shuang', 'đôi (lượng từ giày, đũa)', 'measure', '一双手', 'yì shuāng shǒu', 'một đôi bàn tay', id, NULL, 'SHARED_双_shuāng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_双_shuāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '条', 'tiáo', 'tiao', 'chiếc, con (lượng từ dài: quần, cá)', 'measure', '一条鱼', 'yì tiáo yú', 'một con cá', id, NULL, 'SHARED_条_tiáo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_条_tiáo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '色', 'sè', 'se', 'màu sắc', 'noun', '颜色', 'yánsè', 'màu sắc', id, NULL, 'SHARED_色_sè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_色_sè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '颜色', 'yánsè', 'yanse', 'màu sắc', 'noun', '你喜欢什么颜色？', 'Nǐ xǐhuan shénme yánsè?', 'Bạn thích màu sắc gì?', id, NULL, 'SHARED_颜色_yánsè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_颜色_yánsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '红', 'hóng', 'hong', 'đỏ, màu đỏ', 'adjective', '红色的苹果', 'hóngsè de píngguǒ', 'quả táo màu đỏ', id, NULL, 'SHARED_红_hóng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_红_hóng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '红色', 'hóngsè', 'hongse', 'màu đỏ', 'noun', '中国红', 'Zhōngguó hóng', 'màu đỏ Trung Hoa', id, NULL, 'SHARED_红色_hóngsè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_红色_hóngsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '白', 'bái', 'bai', 'trắng, màu trắng', 'adjective', '白云', 'báiyún', 'mây trắng', id, NULL, 'SHARED_白_bái'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_白_bái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '白色', 'báisè', 'baise', 'màu trắng', 'noun', '白色的T恤', 'báisè de T-xù', 'áo phông trắng', id, NULL, 'SHARED_白色_báisè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_白色_báisè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黑', 'hēi', 'hei', 'đen, màu đen', 'adjective', '天黑了。', 'Tiān hēi le.', 'Trời tối rồi.', id, NULL, 'SHARED_黑_hēi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_黑_hēi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黑色', 'hēisè', 'heise', 'màu đen', 'noun', '黑色的汽车', 'hēisè de qìchē', 'xe ô tô màu đen', id, NULL, 'SHARED_黑色_hēisè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_黑色_hēisè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黄', 'huáng', 'huang', 'vàng, màu vàng', 'adjective', '黄叶', 'huáng yè', 'lá vàng', id, NULL, 'SHARED_黄_huáng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_黄_huáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黄色', 'huángsè', 'huangse', 'màu vàng', 'noun', '黄色的花', 'huángsè de huā', 'bông hoa màu vàng', id, NULL, 'SHARED_黄色_huángsè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_黄色_huángsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蓝', 'lán', 'lan', 'xanh lam, xanh da trời', 'adjective', '蓝天', 'lántiān', 'bầu trời xanh', id, NULL, 'SHARED_蓝_lán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_蓝_lán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蓝色', 'lánsè', 'lanse', 'màu xanh da trời', 'noun', '蓝色的海洋', 'lánsè de hǎiyáng', 'biển xanh', id, NULL, 'SHARED_蓝色_lánsè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_蓝色_lánsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '绿', 'lǜ', 'lv', 'xanh lá cây', 'adjective', '绿草', 'lǜ cǎo', 'cỏ xanh', id, NULL, 'SHARED_绿_lǜ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_绿_lǜ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '绿色', 'lǜsè', 'lvse', 'màu xanh lục', 'noun', '绿色植物', 'lǜsè zhíwù', 'thực vật xanh', id, NULL, 'SHARED_绿色_lǜsè'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_绿色_lǜsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '新', 'xīn', 'xin', 'mới', 'adjective', '新年新气象', 'xīnnián xīn qìxiàng', 'năm mới khí thế mới', id, NULL, 'SHARED_新_xīn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_新_xīn';

-- --- BÀI 18 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '旧', 'jiù', 'jiu', 'cũ, đã qua sử dụng', 'adjective', '旧书', 'jiù shū', 'sách cũ', id, NULL, 'SHARED_旧_jiù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_旧_jiù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '长', 'cháng', 'chang', 'dài', 'adjective', '长城很长。', 'Chángchéng hěn cháng.', 'Vạn Lý Trường Thành rất dài.', id, NULL, 'SHARED_长_cháng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_长_cháng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '短', 'duǎn', 'duan', 'ngắn', 'adjective', '时间太短了。', 'Shíjiān tài duǎn le.', 'Thời gian ngắn quá.', id, NULL, 'SHARED_短_duǎn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_短_duǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '大', 'dà', 'da', 'to, lớn', 'adjective', '西瓜很大。', 'Xīguā hěn dà.', 'Quả dưa hấu rất to.', id, NULL, 'SHARED_大_dà'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_大_dà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '小', 'xiǎo', 'xiao', 'nhỏ, bé', 'adjective', '小猫真可爱。', 'Xiǎomāo zhēn kě''ài.', 'Mèo con thật đáng yêu.', id, NULL, 'SHARED_小_xiǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_小_xiǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '重', 'zhòng', 'zhong', 'nặng', 'adjective', '箱子太重了。', 'Xiāngzi tài zhòng le.', 'Chiếc vali nặng quá.', id, NULL, 'SHARED_重_zhòng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_重_zhòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '轻', 'qīng', 'qing', 'nhẹ', 'adjective', '羽毛很轻。', 'Yǔmáo hěn qīng.', 'Lông vũ rất nhẹ.', id, NULL, 'SHARED_轻_qīng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_轻_qīng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '胖', 'pàng', 'pang', 'béo, mập', 'adjective', '他最近长胖了。', 'Tā zuìjìn zhǎng pàng le.', 'Dạo này anh ấy béo ra rồi.', id, NULL, 'SHARED_胖_pàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_胖_pàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '瘦', 'shòu', 'shou', 'gầy, ốm', 'adjective', '多吃点儿，太瘦了。', 'Duō chī diǎnr, tài shòu le.', 'Ăn nhiều chút, gầy quá rồi.', id, NULL, 'SHARED_瘦_shòu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_瘦_shòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '去过', 'qùguo', 'quguo', 'từng đi qua', 'verb', '我去过中国两次。', 'Wǒ qùguo Zhōngguó liǎng cì.', 'Tôi từng đi Trung Quốc hai lần.', id, NULL, 'SHARED_去过_qùguo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_去过_qùguo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '看过', 'kànguo', 'kanguo', 'từng xem qua', 'verb', '我看过这部电影。', 'Wǒ kànguo zhè bù diànyǐng.', 'Tôi từng xem bộ phim này rồi.', id, NULL, 'SHARED_看过_kànguo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_看过_kànguo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '次', 'cì', 'ci', 'lần, lượt', 'measure', '这是我第一次来。', 'Zhè表达 là wǒ dì-yī cì lái.', 'Đây là lần đầu tiên tôi đến.', id, NULL, 'SHARED_次_cì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_次_cì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '长城', 'Chángchéng', 'changcheng', 'Vạn Lý Trường Thành', 'noun', '不到长城非好汉。', 'Bú dào Chángchéng fēi hǎohàn.', 'Chưa đến Vạn Lý Trường Thành chưa phải hảo hán.', id, NULL, 'SHARED_长城_Chángchéng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_长城_Chángchéng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '故宫', 'Gùgōng', 'gugong', 'Cố Cung, Tử Cấm Thành', 'noun', '故宫在北京。', 'Gùgōng zài Běijīng.', 'Cố Cung ở Bắc Kinh.', id, NULL, 'SHARED_故宫_Gùgōng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_故宫_Gùgōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '旅游', 'lǚyóu', 'lvyou', 'du lịch', 'verb', '去云南旅游', 'qù Yúnnán lǚyóu', 'đi du lịch Vân Nam', id, NULL, 'SHARED_旅游_lǚyóu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_旅游_lǚyóu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '旅行', 'lǚxíng', 'lvxing', 'chuyến đi, lữ hành', 'verb', '祝你旅行愉快！', 'Zhù nǐ lǚxíng yúkuài!', 'Chúc bạn chuyến đi vui vẻ!', id, NULL, 'SHARED_旅行_lǚxíng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_旅行_lǚxíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '宾馆', 'bīnguǎn', 'binguan', 'khách sạn', 'noun', '住在市中心的宾馆', 'zhù zài shìzhōngxīn de bīnguǎn', 'sống tại khách sạn trung tâm', id, NULL, 'SHARED_宾馆_bīnguǎn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_宾馆_bīnguǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饭店', 'fàndiàn', 'fandian', 'nhà hàng, khách sạn lớn', 'noun', '北京饭店', 'Běijīng Fàndiàn', 'Khách sạn Bắc Kinh', id, NULL, 'SHARED_饭店_fàndiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_饭店_fàndiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '门', 'mén', 'men', 'cửa, cổng, môn học', 'noun', '开门', 'kāi mén', 'mở cửa', id, NULL, 'SHARED_门_mén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_门_mén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开门', 'kāimén', 'kaimen', 'mở cửa', 'verb', '商店早上八点开门。', 'Shāngdiàn zǎoshang bā diǎn kāimén.', 'Cửa hàng tám giờ sáng mở cửa.', id, NULL, 'SHARED_开门_kāimén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_开门_kāimén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '关门', 'guānmén', 'guanmen', 'đóng cửa', 'verb', '晚上十点关门。', 'Wǎnshang shí diǎn guānmén.', 'Mười giờ tối đóng cửa.', id, NULL, 'SHARED_关门_guānmén'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_关门_guānmén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '房间', 'fángjiān', 'fangjian', 'căn phòng', 'noun', '打扫房间', 'dǎsǎo fángjiān', 'dọn dẹp phòng', id, NULL, 'SHARED_房间_fángjiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_房间_fángjiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '房', 'fáng', 'fang', 'nhà, phòng', 'noun', '房子', 'fángzi', 'ngôi nhà', id, NULL, 'SHARED_房_fáng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_房_fáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '间', 'jiān', 'jian', 'gian, phòng (lượng từ)', 'measure', '一间房', 'yì jiān fáng', 'một gian phòng', id, NULL, 'SHARED_间_jiān'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_间_jiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '住', 'zhù', 'zhu', 'ở, cư trú', 'verb', '你住在哪里？', 'Nǐ zhù zài nǎlǐ?', 'Bạn đang sống ở đâu?', id, NULL, 'SHARED_住_zhù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_住_zhù';

-- --- BÀI 19 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帮', 'bāng', 'bang', 'giúp đỡ', 'verb', '互相帮助', 'hùxiāng bāngzhù', 'tương trợ giúp đỡ lẫn nhau', id, NULL, 'SHARED_帮_bāng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_帮_bāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '一下', 'yíxià', 'yixia', 'một chút, một lát', 'phrase', '请等一下。', 'Qǐng děng yíxià.', 'Xin hãy đợi một lát.', id, NULL, 'SHARED_一下_yíxià'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_一下_yíxià';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '等', 'děng', 'deng', 'đợi, chờ', 'verb', '等我一下。', 'Děng wǒ yíxià.', 'Đợi tôi một chút nhé.', id, NULL, 'SHARED_等_děng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_等_děng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拿', 'ná', 'na', 'cầm, lấy', 'verb', '请拿好你的东西。', 'Qǐng ná hǎo nǐ de dōngxi.', 'Xin cầm chắc đồ của bạn.', id, NULL, 'SHARED_拿_ná'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_拿_ná';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '放', 'fàng', 'fang', 'đặt, để', 'verb', '把书放在桌子上。', 'Bǎ shū fàng zài zhuōzi shang.', 'Đặt sách lên mặt bàn.', id, NULL, 'SHARED_放_fàng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_放_fàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '可以', 'kěyǐ', 'keyi', 'có thể, được phép', 'verb', '我可以坐这里吗？', 'Wǒ kěyǐ zuò zhèlǐ ma?', 'Tôi có thể ngồi ở đây không?', id, NULL, 'SHARED_可以_kěyǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_可以_kěyǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '能', 'néng', 'neng', 'có thể, có khả năng', 'verb', '你能帮我一个忙吗？', 'Nǐ néng bāng wǒ yí gè máng ma?', 'Bạn có thể giúp tôi một việc được không?', id, NULL, 'SHARED_能_néng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_能_néng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '行', 'xíng', 'xing', 'được, ổn', 'adjective', '这样行吗？——行！', 'Zhèyàng xíng ma? —— Xíng!', 'Thế này được không? — Được!', id, NULL, 'SHARED_行_xíng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_行_xíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '真', 'zhēn', 'zhen', 'thật, đích thực', 'adverb', '真棒！', 'Zhēn bàng!', 'Tuyệt thật!', id, NULL, 'SHARED_真_zhēn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_真_zhēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '错', 'cuò', 'cuo', 'sai, lỗi lầm', 'adjective', '你说错了。', 'Nǐ shuō cuò le.', 'Bạn nói sai rồi.', id, NULL, 'SHARED_错_cuò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_错_cuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '不错', 'búcuò', 'bucuo', 'không tồi, rất tốt', 'adjective', '这本小说真不错！', 'Zhè běn xiǎoshuō zhēn búcuò!', 'Cuốn tiểu thuyết này thật không tồi!', id, NULL, 'SHARED_不错_búcuò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_不错_búcuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '对', 'duì', 'dui', 'đúng', 'adjective', '你的答案完全正确。', 'Nǐ de dá''àn wánquán zhèngquè.', 'Đáp án của bạn hoàn toàn chính xác.', id, NULL, 'SHARED_对_duì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_对_duì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '问', 'wèn', 'wen', 'hỏi han', 'verb', '请问洗手间在哪里？', 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', 'Xin hỏi nhà vệ sinh ở đâu?', id, NULL, 'SHARED_问_wèn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_问_wèn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '回答', 'huídá', 'huida', 'trả lời', 'verb', '请回答我的问题。', 'Qǐng huídá wǒ de wèntí.', 'Xin hãy trả lời câu hỏi của tôi.', id, NULL, 'SHARED_回答_huídá'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_回答_huídá';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '问题', 'wèntí', 'wenti', 'câu hỏi, vấn đề', 'noun', '没有问题！', 'Méiyǒu wèntí!', 'Không vấn đề gì!', id, NULL, 'SHARED_问题_wèntí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_问题_wèntí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '题', 'tí', 'ti', 'đề bài, câu hỏi', 'noun', '这道题很难。', 'Zhè dào tí hěn nán.', 'Câu hỏi này rất khó.', id, NULL, 'SHARED_题_tí'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_题_tí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '难', 'nán', 'nan', 'khó', 'adjective', '汉语发音不太难。', 'Hànyǔ fāyīn bú tài nán.', 'Phát âm tiếng Hán không khó lắm.', id, NULL, 'SHARED_难_nán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_难_nán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '容易', 'róngyì', 'rongyi', 'dễ, dễ dàng', 'adjective', '这道题很容易。', 'Zhè dào tí hěn róngyì.', 'Bài này rất dễ.', id, NULL, 'SHARED_容易_róngyì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_容易_róngyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '懂', 'dǒng', 'dong', 'hiểu', 'verb', '我听懂了。', 'Wǒ tīng dǒng le.', 'Tôi nghe hiểu rồi.', id, NULL, 'SHARED_懂_dǒng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_懂_dǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '明白', 'míngbai', 'mingbai', 'rõ ràng, hiểu ra', 'verb', '我明白了。', 'Wǒ míngbai le.', 'Tôi hiểu rõ rồi.', id, NULL, 'SHARED_明白_míngbai'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_明白_míngbai';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '清楚', 'qīngchu', 'qingchu', 'rõ ràng, minh bạch', 'adjective', '他说得很清楚。', 'Tā shuō de hěn qīngchu.', 'Anh ấy nói rất rõ ràng.', id, NULL, 'SHARED_清楚_qīngchu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_清楚_qīngchu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '慢走', 'mànzǒu', 'manzou', 'đi thong thả, bảo trọng', 'phrase', '客人慢走！', 'Kèrén mànzǒu!', 'Khách quý đi thong thả!', id, NULL, 'SHARED_慢走_mànzǒu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_慢走_mànzǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '欢迎', 'huānyíng', 'huanying', 'hoan nghênh, chào đón', 'verb', '欢迎光临！', 'Huānyíng guānglín!', 'Nhiệt liệt hoan nghênh quý khách!', id, NULL, 'SHARED_欢迎_huānyíng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_欢迎_huānyíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '送', 'sòng', 'song', 'tiễn, tặng', 'verb', '送你一件礼物。', 'Sòng nǐ yí jiàn lǐwù.', 'Tặng bạn một món quà.', id, NULL, 'SHARED_送_sòng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_送_sòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '礼物', 'lǐwù', 'liwu', 'món quà, quà tặng', 'noun', '一份珍贵的礼物', 'yí fèn zhēnguì de lǐwù', 'một món quà quý giá', id, NULL, 'SHARED_礼物_lǐwù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_礼物_lǐwù';

-- --- BÀI 20 (25 từ) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '试', 'shì', 'shi', 'thử, làm thử', 'verb', '试试看', 'shìshi kàn', 'thử xem sao', id, NULL, 'SHARED_试_shì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_试_shì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '考试', 'kǎoshì', 'kaoshi', 'kỳ thi, thi cử', 'noun', '明天有汉语考试。', 'Míngtiān yǒu Hànyǔ kǎoshì.', 'Ngày mai có bài thi tiếng Trung.', id, NULL, 'SHARED_考试_kǎoshì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_考试_kǎoshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '考', 'kǎo', 'kao', 'thi, kiểm tra', 'verb', '考得很好', 'kǎo de hěn hǎo', 'thi rất tốt', id, NULL, 'SHARED_考_kǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_考_kǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '分', 'fēn', 'fen', 'điểm số', 'noun', '考了一百分', 'kǎo le yìbǎi fēn', 'thi được một trăm điểm', id, NULL, 'SHARED_分_fēn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_分_fēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '完', 'wán', 'wan', 'xong, hoàn thành', 'verb', '做完了。', 'Zuò wán le.', 'Làm xong rồi.', id, NULL, 'SHARED_完_wán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_完_wán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '得', 'de', 'de', 'được (trợ từ kết cấu trình độ)', 'particle', '跑得很快', 'pǎo de hěn kuài', 'chạy rất nhanh', id, NULL, 'SHARED_得_de'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_得_de';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '比', 'bǐ', 'bi', 'so với (cấu trúc so sánh)', 'preposition', '他比我大一岁。', 'Tā bǐ wǒ dà yí suì.', 'Anh ấy hơn tôi một tuổi.', id, NULL, 'SHARED_比_bǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_比_bǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跟', 'gēn', 'gen', 'cùng với, theo', 'preposition', '我跟他一起学汉语。', 'Wǒ gēn tā yìqǐ xué Hànyǔ.', 'Tôi cùng anh ấy học tiếng Hán.', id, NULL, 'SHARED_跟_gēn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_跟_gēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '和', 'hé', 'he', 'và, với (liên từ)', 'conjunction', '老师和学生', 'lǎoshī hé xuésheng', 'thầy giáo và học sinh', id, NULL, 'SHARED_和_hé'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_和_hé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '因为', 'yīnwèi', 'yinwei', 'bởi vì, do', 'conjunction', '因为下雨，所以我没去。', 'Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù.', 'Bởi vì trời mưa, cho nên tôi không đi.', id, NULL, 'SHARED_因为_yīnwèi'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_因为_yīnwèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '所以', 'suǒyǐ', 'suoyi', 'cho nên, vì vậy', 'conjunction', '所以我们要努力。', 'Suǒyǐ wǒmen yào nǔlì.', 'Cho nên chúng ta phải cố gắng.', id, NULL, 'SHARED_所以_suǒyǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_所以_suǒyǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '虽然', 'suīrán', 'suiran', 'tuy rằng, mặc dù', 'conjunction', '虽然难，但是很有趣。', 'Suīrán nán, dànshì hěn yǒuqù.', 'Tuy khó nhưng rất thú vị.', id, NULL, 'SHARED_虽然_suīrán'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_虽然_suīrán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '但是', 'dànshì', 'danshi', 'nhưng, nhưng mà', 'conjunction', '但是我想试一试。', 'Dànshì wǒ xiǎng shì yí shì.', 'Nhưng tôi muốn thử sức một lần.', id, NULL, 'SHARED_但是_dànshì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_但是_dànshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '最', 'zuì', 'zui', 'nhất, cực kỳ', 'adverb', '我最好的朋友', 'wǒ zuì hǎo de péngyou', 'người bạn tốt nhất của tôi', id, NULL, 'SHARED_最_zuì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_最_zuì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '更', 'gèng', 'geng', 'càng, hơn nữa', 'adverb', '明天会更好。', 'Míngtiān huì gèng hǎo.', 'Ngày mai sẽ càng tốt đẹp hơn.', id, NULL, 'SHARED_更_gèng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_更_gèng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '特别', 'tèbié', 'tebie', 'đặc biệt', 'adverb', '今天特别热。', 'Jīntiān tèbié rè.', 'Hôm nay đặc biệt nóng.', id, NULL, 'SHARED_特别_tèbié'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_特别_tèbié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '非常', 'fēicháng', 'feichang', 'vô cùng, hết sức', 'adverb', '非常感谢你！', 'Fēicháng gǎnxiè nǐ!', 'Vô cùng cảm ơn bạn!', id, NULL, 'SHARED_非常_fēicháng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_非常_fēicháng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '祝', 'zhù', 'zhu', 'chúc, cầu chúc', 'verb', '祝你成功！', 'Zhù nǐ chénggōng!', 'Chúc bạn thành công!', id, NULL, 'SHARED_祝_zhù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_祝_zhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '成功', 'chénggōng', 'chenggong', 'thành công', 'noun', '取得成功', 'qǔdé chénggōng', 'đạt được thành công', id, NULL, 'SHARED_成功_chénggōng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_成功_chénggōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '努力', 'nǔlì', 'nuli', 'chăm chỉ, cố gắng', 'adjective', '好好学习，天天努力！', 'Hǎohǎo xuéxí, tiāntiān nǔlì!', 'Học tập tốt, ngày ngày nỗ lực!', id, NULL, 'SHARED_努力_nǔlì'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_努力_nǔlì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '进步', 'jìnbù', 'jinbu', 'tiến bộ', 'verb', '他的汉语进步很大。', 'Tā de Hànyǔ jìnbù hěn dà.', 'Tiếng Trung của anh ấy tiến bộ rất lớn.', id, NULL, 'SHARED_进步_jìnbù'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_进步_jìnbù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '加油', 'jiāyóu', 'jiayou', 'cố lên, nỗ lực lên', 'verb', '加油！你一定行！', 'Jiāyóu! Nǐ yídìng xíng!', 'Cố lên! Bạn nhất định làm được!', id, NULL, 'SHARED_加油_jiāyóu'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_加油_jiāyóu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '过', 'guò', 'guo', 'qua, trải qua, qua bài thi', 'verb', '通过考试', 'tōngguò kǎoshì', 'vượt qua kỳ thi', id, NULL, 'SHARED_过_guò'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_过_guò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '得奖', 'déjiǎng', 'dejiang', 'được thưởng, nhận giải', 'verb', '他在比赛中得奖了。', 'Tā zài bǐsài zhōng déjiǎng le.', 'Cậu ấy đã nhận giải trong cuộc thi.', id, NULL, 'SHARED_得奖_déjiǎng'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_得奖_déjiǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '满分', 'mǎnfēn', 'manfen', 'điểm tối đa, điểm 10', 'noun', '获得满分', 'huòdé mǎnfēn', 'đạt điểm tuyệt đối', id, NULL, 'SHARED_满分_mǎnfēn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_1' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_满分_mǎnfēn';
