-- ============================================================================
-- V27__seed_hsk2_30_curriculum_and_vocabularies.sql
-- Chuan HSK 3.0: Cap nhat muc tieu HSK 2 len 772 tu va nap 20 bai hoc chuan.
-- ============================================================================

-- 1. Cap nhat muc tieu HSK 2 len 772 tu
UPDATE hsk_levels SET target_vocab_count = 772 WHERE code = 'HSK_2';

-- 2. Nap danh muc 20 bai hoc theo chu de doi song cho HSK 2
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 1: 新学期开始了！Năm học mới bắt đầu rồi!', 'Trường lớp, khai giảng, giới thiệu bản thân sâu hơn và làm quen bạn học', 1
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 2: 找房子与租房。Tìm và thuê phòng trọ', 'Thuê nhà, phòng ốc, đồ gia dụng, hợp đồng thuê và các khoản phí sinh hoạt', 2
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 3: 一日三餐与美食。Bữa ăn và ẩm thực', 'Gọi món nhà hàng, ẩm thực Trung Hoa, khẩu vị mặn ngọt chua cay', 3
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 4: 生病去看医生。Bị ốm đi khám bác sĩ', 'Bệnh tật, triệu chứng, bệnh viện, khám bệnh và dặn dò uống thuốc', 4
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 5: 去超市买东西。Đi siêu thị mua sắm', 'Hàng hóa, giá cả, siêu thị, giảm giá và phương thức thanh toán', 5
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 6: 周末去哪儿玩？Cuối tuần đi đâu chơi?', 'Kế hoạch cuối tuần, công viên, sở thú, dã ngoại và hoạt động giải trí', 6
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 7: 打电话与发信息。Gọi điện và gửi tin nhắn', 'Liên lạc viễn thông, mạng internet, tin nhắn thoại, video và email', 7
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 8: 交通出行与乘车。Giao thông và đi lại', 'Giao thông công cộng, xe buýt, tàu điện ngầm, vé tàu và chỉ dẫn đường sá', 8
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 9: 运动与健身。Thể thao và rèn luyện thân thể', 'Các môn thể thao, tập gym, chạy bộ, giữ gìn vóc dáng và nâng cao sức đề kháng', 9
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 10: 聊聊工作与职业。Trò chuyện về công việc', 'Nghề nghiệp, môi trường văn phòng, phỏng vấn, báo cáo và quan hệ đồng nghiệp', 10
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 11: 四季的变化。Sự thay đổi của bốn mùa', 'Thời tiết các vùng miền, đặc điểm bốn mùa xuân hạ thu đông và hiện tượng khí hậu', 11
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 12: 参观博物馆与名胜。Tham quan bảo tàng & danh lam', 'Lịch sử, văn hóa truyền thống, bảo tàng, danh lam thắng cảnh và hướng dẫn viên', 12
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 13: 参加朋友的生日会。Dự tiệc sinh nhật bạn bè', 'Tiệc mừng sinh nhật, quà tặng, lời chúc tụng, mời mọc và tình bạn thân thiết', 13
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 14: 穿衣打扮与时尚。Trang phục và phong cách', 'Quần áo, phụ kiện giày dép, kích cỡ màu sắc, thời trang và phối đồ', 14
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 15: 银行与邮局业务。Giao dịch ngân hàng & bưu điện', 'Đổi tiền ngoại tệ, chuyển khoản, gửi bưu kiện, dịch vụ bưu chính và thủ tục', 15
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 16: 聊聊家庭与邻居。Gia đình và hàng xóm láng giềng', 'Quan hệ họ hàng, người thân trong gia đình, hàng xóm láng giềng và tình làng nghĩa xóm', 16
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 17: 计划一次长途旅行。Lên kế hoạch du lịch xa', 'Đặt vé máy bay, phòng khách sạn, thủ tục visa hộ chiếu, chuẩn bị hành lý và bay đường dài', 17
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 18: 保护环境与大自然。Bảo vệ môi trường & thiên nhiên', 'Cây xanh, muông thú, phân loại rác thải, tiết kiệm tài nguyên năng lượng và bảo vệ hệ sinh thái', 18
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 19: 节日与民俗文化。Lễ hội và phong tục tập quán', 'Tết Nguyên Đán, Tết Trung Thu, Tết Đoan Ngọ, phong tục truyền thống và chúc tết', 19
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 20: HSK 2 综合冲刺。Tổng kết & Chinh phục HSK 2', 'Tổng duyệt toàn bộ 772 từ và ngữ pháp chuẩn, liên từ, phó từ và tự tin đạt chuẩn HSK 2', 20
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);

-- 3. Nap 772 tu vung cot loi chuan HSK 3.0 va lien ket vao bai hoc

-- --- BAI 1 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开学', 'kāixué', 'kaixue', 'khai giảng, bắt đầu học kỳ', 'verb', '我们学校明天开学。', 'Wǒmen xuéxiào míngtiān kāixué.', 'Trường chúng tôi ngày mai khai giảng.', id, NULL, 'SHARED_开学_kāixué'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_开学_kāixué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '学期', 'xuéqī', 'xueqi', 'học kỳ', 'noun', '这个学期我有五门课。', 'Zhège xuéqī wǒ yǒu wǔ mén kè.', 'Học kỳ này tôi có năm môn học.', id, NULL, 'SHARED_学期_xuéqī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_学期_xuéqī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '班级', 'bānjí', 'banji', 'lớp học, tập thể lớp', 'noun', '我们班级有二十个学生。', 'Wǒmen bānjí yǒu èrshí gè xuésheng.', 'Lớp chúng tôi có hai mươi học sinh.', id, NULL, 'SHARED_班级_bānjí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_班级_bānjí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '教室', 'jiàoshì', 'jiaoshi', 'phòng học', 'noun', '请大家进教室坐好。', 'Qǐng dàjiā jìn jiàoshì zuò hǎo.', 'Mời mọi người vào phòng học ngồi ngay ngắn.', id, NULL, 'SHARED_教室_jiàoshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_教室_jiàoshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '课桌', 'kèzhuō', 'kezhuo', 'bàn học', 'noun', '课桌上放着很多书。', 'Kèzhuō shang fàng zhe hěn duō shū.', 'Trên bàn học để rất nhiều sách.', id, NULL, 'SHARED_课桌_kèzhuō'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_课桌_kèzhuō';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黑板', 'hēibǎn', 'heiban', 'bảng đen', 'noun', '老师在黑板上写字。', 'Lǎoshī zài hēibǎn shang xiězì.', 'Thầy giáo đang viết chữ lên bảng đen.', id, NULL, 'SHARED_黑板_hēibǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_黑板_hēibǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '词典', 'cídiǎn', 'cidian', 'từ điển', 'noun', '我买了一本汉越词典。', 'Wǒ mǎi le yì běn hàn yuè cídiǎn.', 'Tôi đã mua một cuốn từ điển Hán - Việt.', id, NULL, 'SHARED_词典_cídiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_词典_cídiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '字典', 'zìdiǎn', 'zidian', 'tự điển, từ điển chữ Hán', 'noun', '查字典可以学很多汉字。', 'Chá zìdiǎn kěyǐ xué hěn duō hànzì.', 'Tra từ điển có thể học được rất nhiều chữ Hán.', id, NULL, 'SHARED_字典_zìdiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_字典_zìdiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '课本', 'kèběn', 'keben', 'sách giáo khoa', 'noun', '请大家翻开课本第十页。', 'Qǐng dàjiā fānkāi kèběn dì shí yè.', 'Mời các bạn mở sách giáo khoa trang số 10.', id, NULL, 'SHARED_课本_kèběn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_课本_kèběn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '练习', 'liànxí', 'lianxi', 'luyện tập, bài tập rèn luyện', 'verb', '我们要多练习听力和口语。', 'Wǒmen yào duō liànxí tīnglì hé kǒuyǔ.', 'Chúng ta cần luyện tập nhiều nghe và nói.', id, NULL, 'SHARED_练习_liànxí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_练习_liànxí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '作业', 'zuòyè', 'zuoye', 'bài tập về nhà', 'noun', '今天的作业你写完了吗？', 'Jīntiān de zuòyè nǐ xiě wán le ma?', 'Bài tập hôm nay bạn đã làm xong chưa?', id, NULL, 'SHARED_作业_zuòyè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_作业_zuòyè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '成绩', 'chéngjì', 'chengji', 'thành tích, điểm số', 'noun', '他在这次考试中成绩很好。', 'Tā zài zhè cì kǎoshì zhōng chéngjì hěn hǎo.', 'Anh ấy đạt điểm số rất tốt trong kỳ thi lần này.', id, NULL, 'SHARED_成绩_chéngjì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_成绩_chéngjì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '迟到', 'chídào', 'chidao', 'đến muộn, đi trễ', 'verb', '今天路上堵车，所以我迟到了。', 'Jīntiān lùshang dǔchē, suǒyǐ wǒ chídào le.', 'Hôm nay trên đường kẹt xe nên tôi đến muộn.', id, NULL, 'SHARED_迟到_chídào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_迟到_chídào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '请假', 'qǐngjià', 'qingjia', 'xin nghỉ phép', 'verb', '我身体不舒服，想请假一天。', 'Wǒ shēntǐ bù shūfu, xiǎng qǐngjià yì tiān.', 'Người tôi không khỏe, muốn xin nghỉ phép một ngày.', id, NULL, 'SHARED_请假_qǐngjià'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_请假_qǐngjià';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '努力', 'nǔlì', 'nuli', 'chăm chỉ, nỗ lực', 'adjective', '只要努力，就一定能学好。', 'Zhǐyào nǔlì, jiù yídìng néng xué hǎo.', 'Chỉ cần chăm chỉ thì nhất định sẽ học tốt.', id, NULL, 'SHARED_努力_nǔlì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_努力_nǔlì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '认真', 'rènzhēn', 'renzhen', 'nghiêm túc, cẩn thận', 'adjective', '他听课非常认真。', 'Tā tīngkè fēicháng rènzhēn.', 'Cậu ấy nghe giảng vô cùng nghiêm túc.', id, NULL, 'SHARED_认真_rènzhēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_认真_rènzhēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '进步', 'jìnbù', 'jinbu', 'tiến bộ', 'verb', '这段时间他的汉语进步很大。', 'Zhè duàn shíjiān tā de hànyǔ jìnbù hěn dà.', 'Thời gian này tiếng Trung của cậu ấy tiến bộ rất nhiều.', id, NULL, 'SHARED_进步_jìnbù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_进步_jìnbù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '聪明', 'cōngmíng', 'congming', 'thông minh, lanh lợi', 'adjective', '那个小男孩非常聪明。', 'Nàge xiǎo nánhái fēicháng cōngmíng.', 'Cậu bé đó rất đỗi thông minh.', id, NULL, 'SHARED_聪明_cōngmíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_聪明_cōngmíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '容易', 'róngyì', 'rongyi', 'dễ dàng', 'adjective', '这道题很容易做。', 'Zhè dào tí hěn róngyì zuò.', 'Câu hỏi này rất dễ làm.', id, NULL, 'SHARED_容易_róngyì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_容易_róngyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '困难', 'kùnnán', 'kunnan', 'khó khăn, trắc trở', 'noun', '遇到困难不要放弃。', 'Yù dào kùnnán bú yào fàngqì.', 'Gặp khó khăn thì chớ vội bỏ cuộc.', id, NULL, 'SHARED_困难_kùnnán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_困难_kùnnán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '简单', 'jiǎndān', 'jiandan', 'đơn giản', 'adjective', '这个问题其实很简单。', 'Zhè ge wèntí qíshí hěn jiǎndān.', 'Vấn đề này thực ra rất đơn giản.', id, NULL, 'SHARED_简单_jiǎndān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_简单_jiǎndān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '复杂', 'fùzá', 'fuza', 'phức tạp', 'adjective', '事情没有你想的那么复杂。', 'Shìqing méiyǒu nǐ xiǎng de nàme fùzá.', 'Mọi chuyện không phức tạp như bạn nghĩ đâu.', id, NULL, 'SHARED_复杂_fùzá'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_复杂_fùzá';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '互相', 'hùxiāng', 'huxiang', 'lẫn nhau, qua lại', 'adverb', '同学之间应该互相帮助。', 'Tóngxué zhījiān yīnggāi hùxiāng bāngzhù.', 'Bạn học với nhau nên giúp đỡ lẫn nhau.', id, NULL, 'SHARED_互相_hùxiāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_互相_hùxiāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '提问', 'tíwèn', 'tiwen', 'đặt câu hỏi, nêu câu hỏi', 'verb', '老师向大家提问了一个问题。', 'Lǎoshī xiàng dàjiā tíwèn le yí ge wèntí.', 'Thầy giáo đã đặt một câu hỏi cho cả lớp.', id, NULL, 'SHARED_提问_tíwèn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_提问_tíwèn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '回答', 'huídá', 'huida', 'trả lời, giải đáp', 'verb', '谁能回答这个问题？', 'Shéi néng huídá zhège wèntí?', 'Ai có thể trả lời câu hỏi này?', id, NULL, 'SHARED_回答_huídá'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_回答_huídá';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '举手', 'jǔshǒu', 'jushou', 'giơ tay', 'verb', '懂的同学请举手。', 'Dǒng de tóngxué qǐng jǔshǒu.', 'Bạn nào hiểu bài xin hãy giơ tay.', id, NULL, 'SHARED_举手_jǔshǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_举手_jǔshǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '讨论', 'tǎolùn', 'taolun', 'thảo luận, bàn bạc', 'verb', '大家分组讨论一下吧。', 'Dàjiā fēnzǔ tǎolùn yíxià ba.', 'Mọi người chia nhóm thảo luận một chút nhé.', id, NULL, 'SHARED_讨论_tǎolùn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_讨论_tǎolùn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '记住', 'jìzhù', 'jizhu', 'ghi nhớ, nhớ kỹ', 'verb', '生词一定要天天复习才能记住。', 'Shēngcí yídìng yào tiāntiān fùxí cái néng jìzhù.', 'Từ mới nhất định phải ôn mỗi ngày mới nhớ kỹ được.', id, NULL, 'SHARED_记住_jìzhù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_记住_jìzhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '忘记', 'wàngjì', 'wangji', 'quên lãng, quên mất', 'verb', '我忘记带铅笔盒了。', 'Wǒ wàngjì dài qiānbǐ hé le.', 'Tôi quên mang theo hộp bút chì rồi.', id, NULL, 'SHARED_忘记_wàngjì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_忘记_wàngjì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '明白', 'míngbai', 'mingbai', 'hiểu rõ, sáng tỏ', 'verb', '你现在明白这句话的意思了吗？', 'Nǐ xiànzài míngbai zhè jù huà de yìsi le ma?', 'Bây giờ bạn đã hiểu rõ ý nghĩa câu nói này chưa?', id, NULL, 'SHARED_明白_míngbai'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_明白_míngbai';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '清楚', 'qīngchu', 'qingchu', 'rõ ràng, rành mạch', 'adjective', '他讲得很清楚。', 'Tā jiǎng de hěn qīngchu.', 'Anh ấy giảng rất rõ ràng.', id, NULL, 'SHARED_清楚_qīngchu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_清楚_qīngchu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '懂', 'dǒng', 'dong', 'hiểu, ngộ ra', 'verb', '老师讲的话我都听懂了。', 'Lǎoshī jiǎng de huà wǒ dōu tīng dǒng le.', 'Lời cô giáo giảng tôi đều đã nghe hiểu.', id, NULL, 'SHARED_懂_dǒng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_懂_dǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '水平', 'shuǐpíng', 'shuiping', 'trình độ, đẳng cấp', 'noun', '我想提高自己的汉语水平。', 'Wǒ xiǎng tígāo zìjǐ de hànyǔ shuǐpíng.', 'Tôi muốn nâng cao trình độ tiếng Trung của mình.', id, NULL, 'SHARED_水平_shuǐpíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_水平_shuǐpíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '提高', 'tígāo', 'tigao', 'nâng cao, cải thiện', 'verb', '多读文章可以提高阅读能力。', 'Duō dú wénzhāng kěyǐ tígāo yuèdú nénglì.', 'Đọc nhiều bài viết có thể nâng cao năng lực đọc hiểu.', id, NULL, 'SHARED_提高_tígāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_提高_tígāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '课外', 'kèwài', 'kewai', 'ngoại khóa, ngoài giờ học', 'noun', '课外活动丰富多彩。', 'Kèwài huódòng fēngfù duōcǎi.', 'Hoạt động ngoại khóa phong phú đa dạng.', id, NULL, 'SHARED_课外_kèwài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_课外_kèwài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '活动', 'huódòng', 'huodong', 'hoạt động, sự kiện', 'noun', '周末学校有很多有趣的活动。', 'Zhōumò xuéxiào yǒu hěn duō yǒuqù de huódòng.', 'Cuối tuần trường học có rất nhiều hoạt động thú vị.', id, NULL, 'SHARED_活动_huódòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_活动_huódòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '参加', 'cānjiā', 'canjia', 'tham gia, gia nhập', 'verb', '你想参加汉语角吗？', 'Nǐ xiǎng cānjiā hànyǔ jiǎo ma?', 'Bạn có muốn tham gia câu lạc bộ tiếng Trung không?', id, NULL, 'SHARED_参加_cānjiā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_参加_cānjiā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '借', 'jiè', 'jie', 'mượn, vay', 'verb', '我可以借你的橡皮用一下吗？', 'Wǒ kěyǐ jiè nǐ de xiàngpí yòng yíxià ma?', 'Tôi có thể mượn cục tẩy của bạn dùng một chút không?', id, NULL, 'SHARED_借_jiè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_借_jiè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '还', 'huán', 'huan', 'trả lại, hoàn trả', 'verb', '看完了记得按时还书。', 'Kàn wán le jìde ànshí huán shū.', 'Đọc xong nhớ trả sách đúng hạn nhé.', id, NULL, 'SHARED_还_huán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 1
  AND v.owner_key = 'SHARED_还_huán';

-- --- BAI 2 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '租房', 'zūfáng', 'zufang', 'thuê nhà, thuê phòng', 'verb', '我打算在学校附近租房。', 'Wǒ dǎsuàn zài xuéxiào fùjìn zūfáng.', 'Tôi định thuê phòng ở gần trường học.', id, NULL, 'SHARED_租房_zūfáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_租房_zūfáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '房东', 'fángdōng', 'fangdong', 'chủ nhà, chủ trọ', 'noun', '房东阿姨非常热情。', 'Fángdōng āyí fēicháng rèqíng.', 'Dì chủ nhà rất mực nhiệt tình.', id, NULL, 'SHARED_房东_fángdōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_房东_fángdōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '房租', 'fángzū', 'fangzu', 'tiền thuê nhà', 'noun', '这里的房租每个月两千块。', 'Zhèlǐ de fángzū měi gè yuè liǎng qiān kuài.', 'Tiền thuê nhà ở đây mỗi tháng hai nghìn tệ.', id, NULL, 'SHARED_房租_fángzū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_房租_fángzū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '合同', 'hétong', 'hetong', 'hợp đồng', 'noun', '签合同前请看清楚各项条款。', 'Qiān hétong qián qǐng kàn qīngchu gè xiàng tiáokuǎn.', 'Trước khi ký hợp đồng xin hãy xem rõ từng điều khoản.', id, NULL, 'SHARED_合同_hétong'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_合同_hétong';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '搬家', 'bānjiā', 'banjia', 'chuyển nhà', 'verb', '我下周六准备搬家。', 'Wǒ xià zhōuliù zhǔnbèi bānjiā.', 'Thứ Bảy tuần sau tôi chuẩn bị chuyển nhà.', id, NULL, 'SHARED_搬家_bānjiā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_搬家_bānjiā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邻居', 'línjū', 'linju', 'hàng xóm', 'noun', '新搬来的邻居人很好。', 'Xīn bān lái de línjū rén hěn hǎo.', 'Người hàng xóm mới chuyển đến rất tốt bụng.', id, NULL, 'SHARED_邻居_línjū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_邻居_línjū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '客厅', 'kètīng', 'keting', 'phòng khách', 'noun', '客厅里有一张大沙发。', 'Kètīng lǐ yǒu yì zhāng dà shāfā.', 'Trong phòng khách có một chiếc ghế sofa lớn.', id, NULL, 'SHARED_客厅_kètīng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_客厅_kètīng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '卧室', 'wòshì', 'woshi', 'phòng ngủ', 'noun', '卧室的采光很不错。', 'Wòshì de cǎiguāng hěn búcuò.', 'Ánh sáng trong phòng ngủ rất tốt.', id, NULL, 'SHARED_卧室_wòshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_卧室_wòshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '厨房', 'chúfáng', 'chufang', 'nhà bếp', 'noun', '我喜欢在厨房做饭。', 'Wǒ xǐhuan zài chúfáng zuòfàn.', 'Tôi thích nấu ăn trong nhà bếp.', id, NULL, 'SHARED_厨房_chúfáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_厨房_chúfáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '卫生间', 'wèishēngjiān', 'weishengjian', 'nhà vệ sinh, phòng tắm', 'noun', '卫生间非常干净整洁。', 'Wèishēngjiān fēicháng gānjìng zhěngjié.', 'Nhà vệ sinh vô cùng sạch sẽ ngăn nắp.', id, NULL, 'SHARED_卫生间_wèishēngjiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_卫生间_wèishēngjiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阳台', 'yángtái', 'yangtai', 'ban công', 'noun', '阳台上摆满了我种的花。', 'Yángtái shang bǎi mǎn le wǒ zhòng de huā.', 'Ban công bày đầy những chậu hoa do tôi trồng.', id, NULL, 'SHARED_阳台_yángtái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_阳台_yángtái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '钥匙', 'yàoshi', 'yaoshi', 'chìa khóa', 'noun', '出门别忘了带钥匙。', 'Chūmén bié wàng le dài yàoshi.', 'Ra khỏi cửa đừng quên mang theo chìa khóa.', id, NULL, 'SHARED_钥匙_yàoshi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_钥匙_yàoshi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '门', 'mén', 'men', 'cửa, cánh cửa', 'noun', '请进，门没有锁。', 'Qǐng jìn, mén méiyǒu suǒ.', 'Mời vào, cửa không khóa đâu.', id, NULL, 'SHARED_门_mén'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_门_mén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '窗户', 'chuānghu', 'chuanghu', 'cửa sổ', 'noun', '打开窗户透透气吧。', 'Dǎkāi chuānghu tòutòuqì ba.', 'Mở cửa sổ cho thoáng khí chút đi.', id, NULL, 'SHARED_窗户_chuānghu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_窗户_chuānghu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '空调', 'kōngtiáo', 'kongtiao', 'máy điều hòa không khí', 'noun', '夏天开空调很凉快。', 'Xiàtiān kāi kōngtiáo hěn liángkuai.', 'Mùa hè bật điều hòa rất mát mẻ.', id, NULL, 'SHARED_空调_kōngtiáo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_空调_kōngtiáo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冰箱', 'bīngxiāng', 'bingxiang', 'tủ lạnh', 'noun', '冰箱里放着新鲜水果。', 'Bīngxiāng lǐ fàng zhe xīnxiān shuǐguǒ.', 'Trong tủ lạnh để đầy hoa quả tươi ngon.', id, NULL, 'SHARED_冰箱_bīngxiāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_冰箱_bīngxiāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '洗衣机', 'xǐyījī', 'xiyiji', 'máy giặt', 'noun', '这台洗衣机是全新的。', 'Zhè tái xǐyījī shì quánxīn de.', 'Chiếc máy giặt này là đồ hoàn toàn mới.', id, NULL, 'SHARED_洗衣机_xǐyījī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_洗衣机_xǐyījī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电视机', 'diànshìjī', 'dianshiji', 'ti vi, máy truyền hình', 'noun', '晚上我们一起看电视机。', 'Wǎnshang wǒmen yìqǐ kàn diànshìjī.', 'Buổi tối chúng tôi cùng nhau xem tivi.', id, NULL, 'SHARED_电视机_diànshìjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_电视机_diànshìjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '沙发', 'shāfā', 'shafa', 'ghế sô pha', 'noun', '坐在沙发上休息很舒服。', 'Zuò zài shāfā shang xiūxi hěn shūfu.', 'Ngồi trên ghế sô pha nghỉ ngơi rất dễ chịu.', id, NULL, 'SHARED_沙发_shāfā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_沙发_shāfā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '床', 'chuáng', 'chuang', 'giường nằm', 'noun', '这张床又大又软。', 'Zhè zhāng chuáng yòu dà yòu ruǎn.', 'Chiếc giường này vừa to lại vừa êm.', id, NULL, 'SHARED_床_chuáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_床_chuáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '衣柜', 'yīguì', 'yigui', 'tủ quần áo', 'noun', '把衣服挂进衣柜里吧。', 'Bǎ yīfu guà jìn yīguì lǐ ba.', 'Đem quần áo treo vào trong tủ nhé.', id, NULL, 'SHARED_衣柜_yīguì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_衣柜_yīguì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '干净', 'gānjìng', 'ganjing', 'sạch sẽ', 'adjective', '房间打扫得很干净。', 'Fángjiān dǎsǎo de hěn gānjìng.', 'Căn phòng được dọn dẹp rất sạch sẽ.', id, NULL, 'SHARED_干净_gānjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_干净_gānjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '脏', 'zāng', 'zang', 'bẩn, dơ', 'adjective', '这件衣服弄脏了，得洗洗。', 'Zhè jiàn yīfu nòng zāng le, děi xǐxi.', 'Chiếc áo này bị lấm bẩn rồi, phải giặt thôi.', id, NULL, 'SHARED_脏_zāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_脏_zāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '安静', 'ānjìng', 'anjing', 'yên tĩnh, thanh tịnh', 'adjective', '图书馆里非常安静。', 'Túshūguǎn lǐ fēicháng ānjìng.', 'Trong thư viện vô cùng yên tĩnh.', id, NULL, 'SHARED_安静_ānjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_安静_ānjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吵', 'chǎo', 'chao', 'ồn ào, làm ồn', 'adjective', '外面太吵了，影响学习。', 'Wàimiàn tài chǎo le, yǐngxiǎng xuéxí.', 'Bên ngoài ồn ào quá, ảnh hưởng tới việc học.', id, NULL, 'SHARED_吵_chǎo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_吵_chǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '舒服', 'shūfu', 'shufu', 'thoải mái, dễ chịu', 'adjective', '住在这里感觉很舒服。', 'Zhù zài zhèlǐ gǎnjué hěn shūfu.', 'Sống ở đây cảm thấy rất thoải mái.', id, NULL, 'SHARED_舒服_shūfu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_舒服_shūfu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '方便', 'fāngbiàn', 'fangbian', 'thuận tiện, tiện lợi', 'adjective', '楼下有超市，买东西很方便。', 'Lóuxià yǒu chāoshì, mǎi dōngxi hěn fāngbiàn.', 'Dưới tầng có siêu thị, mua đồ rất tiện lợi.', id, NULL, 'SHARED_方便_fāngbiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_方便_fāngbiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '附近', 'fùjìn', 'fujin', 'gần đây, lân cận', 'noun', '学校附近有很多好吃的餐馆。', 'Xuéxiào fùjìn yǒu hěn duō hǎochī de cānguǎn.', 'Gần trường có rất nhiều quán ăn ngon.', id, NULL, 'SHARED_附近_fùjìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_附近_fùjìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '楼上', 'lóushang', 'loushang', 'trên tầng, trên gác', 'noun', '楼上的邻居正在弹钢琴。', 'Lóushang de línjū zhèngzài tán gāngqín.', 'Người hàng xóm trên tầng đang chơi đàn piano.', id, NULL, 'SHARED_楼上_lóushang'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_楼上_lóushang';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '楼下', 'lóuxià', 'louxia', 'dưới lầu, dưới tầng', 'noun', '我在楼下等你，你快下来吧。', 'Wǒ zài lóuxià děng nǐ, nǐ kuài xiàlai ba.', 'Tôi đợi bạn dưới lầu, bạn nhanh xuống nhé.', id, NULL, 'SHARED_楼下_lóuxià'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_楼下_lóuxià';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电梯', 'diàntī', 'dianti', 'thang máy', 'noun', '请乘电梯上八楼。', 'Qǐng chéng diàntī shàng bā lóu.', 'Xin mời đi thang máy lên tầng 8.', id, NULL, 'SHARED_电梯_diàntī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_电梯_diàntī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '走廊', 'zǒuláng', 'zoulang', 'hành lang', 'noun', '请不要在走廊里大声喧哗。', 'Qǐng bú yào zài zǒuláng lǐ dàshēng xuānhuá.', 'Xin đừng lớn tiếng làm ồn ở hành lang.', id, NULL, 'SHARED_走廊_zǒuláng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_走廊_zǒuláng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '押金', 'yājīn', 'yajin', 'tiền đặt cọc', 'noun', '租房需要交一个月的押金。', 'Zūfáng xūyào jiāo yí gè yuè de yājīn.', 'Thuê phòng cần phải nộp một tháng tiền cọc.', id, NULL, 'SHARED_押金_yājīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_押金_yājīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '水费', 'shuǐfèi', 'shuifei', 'tiền nước', 'noun', '每个月底要按时交水费。', 'Měi gè yuèdǐ yào ànshí jiāo shuǐfèi.', 'Cuối mỗi tháng cần nộp tiền nước đúng hạn.', id, NULL, 'SHARED_水费_shuǐfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_水费_shuǐfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电费', 'diànfèi', 'dianfei', 'tiền điện', 'noun', '夏天开空调多，电费比较贵。', 'Xiàtiān kāi kōngtiáo duō, diànfèi bǐjiào guì.', 'Mùa hè bật điều hòa nhiều nên tiền điện khá đắt.', id, NULL, 'SHARED_电费_diànfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_电费_diànfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '网费', 'wǎngfèi', 'wangfei', 'tiền mạng, cước internet', 'noun', '宿舍的网费已经包含在房租里了。', 'Sùshè de wǎngfèi yǐjīng bāohán zài fángzū lǐ le.', 'Cước mạng của ký túc xá đã tính gộp trong tiền phòng rồi.', id, NULL, 'SHARED_网费_wǎngfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_网费_wǎngfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '满意', 'mǎnyì', 'manyi', 'hài lòng, ưng ý', 'adjective', '我对这套新房子非常满意。', 'Wǒ duì zhè tào xīn fángzi fēicháng mǎnyì.', 'Tôi vô cùng hài lòng với căn nhà mới này.', id, NULL, 'SHARED_满意_mǎnyì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_满意_mǎnyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '修', 'xiū', 'xiu', 'sửa chữa', 'verb', '水龙头坏了，需要叫人来修。', 'Shuǐlóngtóu huài le, xūyào jiào rén lái xiū.', 'Vòi nước bị hỏng rồi, cần gọi người đến sửa.', id, NULL, 'SHARED_修_xiū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_修_xiū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '坏', 'huài', 'huai', 'hỏng hóc, tệ', 'adjective', '门锁坏了，打不开了。', 'Ménsuǒ huài le, dǎ bù kāi le.', 'Khóa cửa hỏng rồi, không mở ra được nữa.', id, NULL, 'SHARED_坏_huài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 2
  AND v.owner_key = 'SHARED_坏_huài';

-- --- BAI 3 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '早餐', 'zǎocān', 'zaocan', 'bữa sáng, điểm tâm', 'noun', '不吃早餐对身体不好。', 'Bù chī zǎocān duì shēntǐ bù hǎo.', 'Không ăn sáng thì không tốt cho sức khỏe.', id, NULL, 'SHARED_早餐_zǎocān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_早餐_zǎocān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '午餐', 'wǔcān', 'wucan', 'bữa trưa', 'noun', '中午我们在公司食堂吃午餐。', 'Zhōngwǔ wǒmen zài gōngsī shítáng chī wǔcān.', 'Buổi trưa chúng tôi ăn cơm trưa ở nhà ăn công ty.', id, NULL, 'SHARED_午餐_wǔcān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_午餐_wǔcān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晚餐', 'wǎncān', 'wancan', 'bữa tối', 'noun', '今天的晚餐做得很丰盛。', 'Jīntiān de wǎncān zuò de hěn fēngshèng.', 'Bữa tối hôm nay nấu rất thịnh soạn.', id, NULL, 'SHARED_晚餐_wǎncān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_晚餐_wǎncān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '菜单', 'càidān', 'caidan', 'thực đơn', 'noun', '服务员，请给我拿一份菜单。', 'Fúwùyuán, qǐng gěi wǒ ná yí fèn càidān.', 'Phục vụ ơi, vui lòng lấy cho tôi một quyển thực đơn.', id, NULL, 'SHARED_菜单_càidān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_菜单_càidān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '点菜', 'diǎncài', 'diancai', 'gọi món, đặt món', 'verb', '大家看看想吃什么，开始点菜吧。', 'Dàjiā kànkan xiǎng chī shénme, kāishǐ diǎncài ba.', 'Mọi người xem muốn ăn gì nào, bắt đầu gọi món đi.', id, NULL, 'SHARED_点菜_diǎncài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_点菜_diǎncài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '服务员', 'fúwùyuán', 'fuwuyuan', 'nhân viên phục vụ', 'noun', '这里的服务员态度非常好。', 'Zhèlǐ de fúwùyuán tàidu fēicháng hǎo.', 'Nhân viên phục vụ ở đây thái độ rất tốt.', id, NULL, 'SHARED_服务员_fúwùyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_服务员_fúwùyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '买单', 'mǎidān', 'maidan', 'thanh toán, tính tiền', 'verb', '服务员，买单！', 'Fúwùyuán, mǎidān!', 'Phục vụ ơi, tính tiền!', id, NULL, 'SHARED_买单_mǎidān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_买单_mǎidān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '结账', 'jiézhàng', 'jiezhang', 'thanh toán sổ sách', 'verb', '请问去哪里结账？', 'Qǐngwèn qù nǎlǐ jiézhàng?', 'Xin hỏi đến chỗ nào để kết toán vậy?', id, NULL, 'SHARED_结账_jiézhàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_结账_jiézhàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '筷子', 'kuàizi', 'kuaizi', 'đôi đũa', 'noun', '中国人习惯用筷子吃饭。', 'Zhōngguórén xíguàn yòng kuàizi chīfàn.', 'Người Trung Quốc quen dùng đũa khi ăn cơm.', id, NULL, 'SHARED_筷子_kuàizi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_筷子_kuàizi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '碗', 'wǎn', 'wan', 'bát, chén', 'noun', '请给我拿一个空碗。', 'Qǐng gěi wǒ ná yí gè kōng wǎn.', 'Làm ơn lấy cho tôi một chiếc bát không.', id, NULL, 'SHARED_碗_wǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_碗_wǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '盘子', 'pánzi', 'panzi', 'đĩa, dĩa', 'noun', '桌子上有几个干净的盘子。', 'Zhuōzi shang yǒu jǐ gè gānjìng de pánzi.', 'Trên bàn có mấy chiếc đĩa sạch.', id, NULL, 'SHARED_盘子_pánzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_盘子_pánzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汤匙', 'tāngchí', 'tangchi', 'thìa canh, muỗng', 'noun', '喝汤要用汤匙。', 'Hē tāng yào yòng tāngchí.', 'Húp canh thì phải dùng thìa canh.', id, NULL, 'SHARED_汤匙_tāngchí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_汤匙_tāngchí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '味道', 'wèidao', 'weidao', 'mùi vị, hương vị', 'noun', '这道菜的味道好极了。', 'Zhè dào cài de wèidao hǎo jí le.', 'Mùi vị món ăn này ngon tuyệt cú mèo.', id, NULL, 'SHARED_味道_wèidao'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_味道_wèidao';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好吃', 'hǎochī', 'haochi', 'ngon miệng', 'adjective', '妈妈做的饺子特别好吃。', 'Māma zuò de jiǎozi tèbié hǎochī.', 'Sủi cảo mẹ làm ngon đặc biệt.', id, NULL, 'SHARED_好吃_hǎochī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_好吃_hǎochī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '难吃', 'nánchī', 'nanchi', 'dở, khó ăn', 'adjective', '这个菜太咸了，真难吃。', 'Zhège cài tài xián le, zhēn nánchī.', 'Món này mặn quá, khó ăn thật đấy.', id, NULL, 'SHARED_难吃_nánchī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_难吃_nánchī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '甜', 'tián', 'tian', 'ngọt', 'adjective', '西瓜真甜，水分很足。', 'Xīguā zhēn tián, shuǐfèn hěn zú.', 'Dưa hấu ngọt thật, lại nhiều nước nữa.', id, NULL, 'SHARED_甜_tián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_甜_tián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '辣', 'là', 'la', 'cay', 'adjective', '四川菜一般都比较辣。', 'Sìchuān cài yìbān dōu bǐjiào là.', 'Món Tứ Xuyên nhìn chung đều khá cay.', id, NULL, 'SHARED_辣_là'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_辣_là';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '酸', 'suān', 'suan', 'chua', 'adjective', '这个柠檬好酸啊！', 'Zhège níngméng hǎo suān a!', 'Quả chanh này chua quá chừng!', id, NULL, 'SHARED_酸_suān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_酸_suān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '苦', 'kǔ', 'ku', 'đắng, cực khổ', 'adjective', '良药苦口利于病。', 'Liángyào kǔkǒu lì yú bìng.', 'Thuốc đắng dã tật.', id, NULL, 'SHARED_苦_kǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_苦_kǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '咸', 'xián', 'xian', 'mặn', 'adjective', '盐放多了，汤有点咸。', 'Yán fàng duō le, tāng yǒudiǎn xián.', 'Cho nhiều muối quá, canh hơi mặn rồi.', id, NULL, 'SHARED_咸_xián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_咸_xián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '油腻', 'yóunì', 'youni', 'béo ngậy, nhiều dầu mỡ', 'adjective', '炸鸡吃多了会觉得油腻。', 'Zhájī chī duō le huì juéde yóunì.', 'Gà rán ăn nhiều sẽ thấy ngấy dầu mỡ.', id, NULL, 'SHARED_油腻_yóunì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_油腻_yóunì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '清淡', 'qīngdàn', 'qingdan', 'thanh đạm, nhẹ nhàng', 'adjective', '生病时饮食应该清淡一些。', 'Shēngbìng shí yǐnshí yīnggāi qīngdàn yìxiē.', 'Khi ốm khẩu phần ăn nên thanh đạm một chút.', id, NULL, 'SHARED_清淡_qīngdàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_清淡_qīngdàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '米饭', 'mǐfàn', 'mifan', 'cơm trắng', 'noun', '服务员，再来两碗米饭。', 'Fúwùyuán, zài lái liǎng wǎn mǐfàn.', 'Phục vụ ơi, cho thêm hai bát cơm nữa.', id, NULL, 'SHARED_米饭_mǐfàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_米饭_mǐfàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '面条', 'miàntiáo', 'miantiao', 'mì sợi', 'noun', '生日那天一定要吃长寿面条。', 'Shēngrì nà tiān yídìng yào chī chángshòu miàntiáo.', 'Vào ngày sinh nhật nhất định phải ăn mì trường thọ.', id, NULL, 'SHARED_面条_miàntiáo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_面条_miàntiáo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '包子', 'bāozi', 'baozi', 'bánh bao', 'noun', '我早餐经常吃两个热包子。', 'Wǒ zǎocān jīngcháng chī liǎng gè rè bāozi.', 'Bữa sáng tôi thường ăn hai chiếc bánh bao nóng.', id, NULL, 'SHARED_包子_bāozi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_包子_bāozi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饺子', 'jiǎozi', 'jiaozi', 'sủi cảo, bánh chẻo', 'noun', '过年家家户户都要包饺子。', 'Guònián jiājiāhùhù dōu yào bāo jiǎozi.', 'Tết đến nhà nhà đều gói sủi cảo.', id, NULL, 'SHARED_饺子_jiǎozi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_饺子_jiǎozi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '烤鸭', 'kǎoyā', 'kaoya', 'vịt quay', 'noun', '北京烤鸭世界闻名。', 'Běijīng kǎoyā shìjiè wénmíng.', 'Vịt quay Bắc Kinh nổi tiếng khắp thế giới.', id, NULL, 'SHARED_烤鸭_kǎoyā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_烤鸭_kǎoyā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '牛肉', 'niúròu', 'niurou', 'thịt bò', 'noun', '这盘红烧牛肉做得真嫩。', 'Zhè pán hóngshāo niúròu zuò de zhēn nèn.', 'Đĩa thịt bò kho này làm mềm thật sự.', id, NULL, 'SHARED_牛肉_niúròu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_牛肉_niúròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '羊肉', 'yángròu', 'yangrou', 'thịt cừu', 'noun', '冬天吃涮羊肉火锅最暖和。', 'Dōngtiān chī shuàn yángròu huǒguō zuì nuǎnhuo.', 'Mùa đông ăn lẩu nhúng thịt cừu là ấm áp nhất.', id, NULL, 'SHARED_羊肉_yángròu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_羊肉_yángròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '猪肉', 'zhūròu', 'zhurou', 'thịt lợn, thịt heo', 'noun', '炒青菜里加一点猪肉更香。', 'Chǎo qīngcài lǐ jiā yìdiǎn zhūròu gèng xiāng.', 'Xào rau xanh cho thêm chút thịt lợn sẽ thơm hơn.', id, NULL, 'SHARED_猪肉_zhūròu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_猪肉_zhūròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鸡肉', 'jīròu', 'jirou', 'thịt gà', 'noun', '健身的人喜欢吃煮鸡肉。', 'Jiànshēn de rén xǐhuan chī zhǔ jīròu.', 'Người tập thể hình thích ăn thịt gà luộc.', id, NULL, 'SHARED_鸡肉_jīròu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_鸡肉_jīròu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蔬菜', 'shūcài', 'shucai', 'rau củ', 'noun', '多吃蔬菜和水果有益健康。', 'Duō chī shūcài hé shuǐguǒ yǒuyì jiànkāng.', 'Ăn nhiều rau củ và hoa quả có lợi cho sức khỏe.', id, NULL, 'SHARED_蔬菜_shūcài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_蔬菜_shūcài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汤', 'tāng', 'tang', 'canh, súp', 'noun', '先喝一口热汤暖暖胃。', 'Xiān hē yì kǒu rè tāng nuǎnnuǎn wèi.', 'Uống trước một ngụm canh nóng cho ấm bụng.', id, NULL, 'SHARED_汤_tāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_汤_tāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饮料', 'yǐnliào', 'yinliao', 'đồ uống, thức uống', 'noun', '冰箱里准备了冰镇饮料。', 'Bīngxiāng lǐ zhǔnbèi le bīngzhèn yǐnliào.', 'Trong tủ lạnh đã chuẩn bị sẵn đồ uống ướp lạnh.', id, NULL, 'SHARED_饮料_yǐnliào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_饮料_yǐnliào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '啤酒', 'píjiǔ', 'pijiu', 'bia', 'noun', '夏天喝一杯凉啤酒真痛快。', 'Xiàtiān hē yì bēi liáng píjiǔ zhēn tòngkuai.', 'Mùa hè uống một cốc bia lạnh thật sảng khoái.', id, NULL, 'SHARED_啤酒_píjiǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_啤酒_píjiǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '果汁', 'guǒzhī', 'guozhi', 'nước ép hoa quả', 'noun', '我点了一杯鲜榨橙汁。', 'Wǒ diǎn le yì bēi xiānzhà chéngzhī.', 'Tôi đã gọi một cốc nước cam tươi ép.', id, NULL, 'SHARED_果汁_guǒzhī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_果汁_guǒzhī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饱', 'bǎo', 'bao', 'no bụng', 'adjective', '我吃得太饱了，走不动了。', 'Wǒ chī de tài bǎo le, zǒu bú dòng le.', 'Tôi ăn no quá rồi, không đi nổi nữa.', id, NULL, 'SHARED_饱_bǎo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_饱_bǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饿', 'è', 'e', 'đói bụng', 'adjective', '忙了一整天，肚子好饿啊。', 'Máng le yì zhěng tiān, dùzi hǎo è a.', 'Bận rộn cả ngày, bụng đói meo rồi.', id, NULL, 'SHARED_饿_è'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_饿_è';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '渴', 'kě', 'ke', 'khát nước', 'adjective', '打完篮球大家都渴了。', 'Dǎ wán lánqiú dàjiā dōu kě le.', 'Chơi bóng rổ xong ai nấy đều khát nước.', id, NULL, 'SHARED_渴_kě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 3
  AND v.owner_key = 'SHARED_渴_kě';

-- --- BAI 4 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生病', 'shēngbìng', 'shengbing', 'bị ốm, bị bệnh', 'verb', '他着凉生病了，在宿舍休息。', 'Tā zháoliáng shēngbìng le, zài sùshè xiūxi.', 'Anh ấy bị nhiễm lạnh ốm rồi, đang nghỉ ở ký túc xá.', id, NULL, 'SHARED_生病_shēngbìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_生病_shēngbìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '感冒', 'gǎnmào', 'ganmao', 'cảm cúm', 'verb', '最近天气变化大，容易感冒。', 'Zuìjìn tiānqì biànhuà dà, róngyì gǎnmào.', 'Dạo này thời tiết thay đổi nhiều, rất dễ bị cảm cúm.', id, NULL, 'SHARED_感冒_gǎnmào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_感冒_gǎnmào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发烧', 'fāshāo', 'fashao', 'phát sốt, sốt', 'verb', '他额头很烫，好像发烧了。', 'Tā étóu hěn tàng, hǎoxiàng fāshāo le.', 'Trán cậu ấy nóng ran, hình như sốt rồi.', id, NULL, 'SHARED_发烧_fāshāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_发烧_fāshāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '头痛', 'tóutòng', 'toutong', 'đau đầu', 'verb', '昨天没睡好，今天头痛得很。', 'Zuótiān méi shuì hǎo, jīntiān tóutòng de hěn.', 'Hôm qua ngủ không ngon, hôm nay đau đầu vô cùng.', id, NULL, 'SHARED_头痛_tóutòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_头痛_tóutòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '肚子痛', 'dùzitòng', 'duzitong', 'đau bụng', 'verb', '吃了不干净的东西容易肚子痛。', 'Chī le bù gānjìng de dōngxi róngyì dùzitòng.', 'Ăn đồ không sạch sẽ rất dễ bị đau bụng.', id, NULL, 'SHARED_肚子痛_dùzitòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_肚子痛_dùzitòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '咳嗽', 'késou', 'kesou', 'ho', 'verb', '他一直咳嗽，该去看看医生了。', 'Tā yìzhí késou, gāi qù kànkan yīshēng le.', 'Anh ấy cứ ho mãi, nên đi khám bác sĩ rồi.', id, NULL, 'SHARED_咳嗽_késou'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_咳嗽_késou';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '流鼻涕', 'liú bítì', 'liubiti', 'chảy nước mũi', 'verb', '感冒了会打喷嚏和流鼻涕。', 'Gǎnmào le huì dǎ pēntì hé liú bítì.', 'Bị cảm sẽ hay hắt hơi và chảy nước mũi.', id, NULL, 'SHARED_流鼻涕_liú bítì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_流鼻涕_liú bítì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '难受', 'nánshòu', 'nanshou', 'khó chịu, trong người bức bối', 'adjective', '全身没力气，心里很难受。', 'Quánshēn méi lìqi, xīnlǐ hěn nánshòu.', 'Toàn thân không còn chút sức lực, trong người rất khó chịu.', id, NULL, 'SHARED_难受_nánshòu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_难受_nánshòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '检查', 'jiǎnchá', 'jiancha', 'kiểm tra, khám', 'verb', '医生给他做了全面检查。', 'Yīshēng gěi tā zuò le quánmiàn jiǎnchá.', 'Bác sĩ đã khám tổng quát cho anh ấy.', id, NULL, 'SHARED_检查_jiǎnchá'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_检查_jiǎnchá';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '医生', 'yīshēng', 'yisheng', 'bác sĩ', 'noun', '医生建议他多喝温水多休息。', 'Yīshēng jiànyì tā duō hē wēnshuǐ duō xiūxi.', 'Bác sĩ khuyên anh ấy uống nhiều nước ấm và nghỉ ngơi nhiều.', id, NULL, 'SHARED_医生_yīshēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_医生_yīshēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '护士', 'hùshi', 'hushi', 'y tá', 'noun', '护士正在耐心地为病人量体温。', 'Hùshi zhèngzài nàixīn de wèi bìngrén liáng tǐwēn.', 'Cô y tá đang kiên nhẫn đo nhiệt độ cho bệnh nhân.', id, NULL, 'SHARED_护士_hùshi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_护士_hùshi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '医院', 'yīyuàn', 'yiyuan', 'bệnh viện', 'noun', '市中心有一家大型综合医院。', 'Shì zhōngxīn yǒu yì jiā dàxíng zōnghé yīyuàn.', 'Ở trung tâm thành phố có một bệnh viện đa khoa lớn.', id, NULL, 'SHARED_医院_yīyuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_医院_yīyuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '诊所', 'zhěnsuǒ', 'zhensuo', 'phòng khám', 'noun', '小区门口就有一家牙科诊所。', 'Xiǎoqū ménkǒu jiù yǒu yì jiā yákē zhěnsuǒ.', 'Cổng khu dân cư có ngay một phòng khám nha khoa.', id, NULL, 'SHARED_诊所_zhěnsuǒ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_诊所_zhěnsuǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '挂号', 'guàhào', 'guahao', 'đăng ký khám bệnh, lấy số', 'verb', '看病前需要先在前台挂号。', 'Kànbìng qián xūyào xiān zài qiántái guàhào.', 'Trước khi khám bệnh cần lấy số đăng ký ở quầy lễ tân.', id, NULL, 'SHARED_挂号_guàhào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_挂号_guàhào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '排队', 'páiduì', 'paidui', 'xếp hàng', 'verb', '大家都在安静地排队等候。', 'Dàjiā dōu zài ānjìng de páiduì děnghòu.', 'Mọi người đều đang trật tự xếp hàng chờ đợi.', id, NULL, 'SHARED_排队_páiduì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_排队_páiduì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打针', 'dǎzhēn', 'dazhen', 'tiêm thuốc', 'verb', '小时候我最害怕打针了。', 'Xiǎoshíhou wǒ zuì hàipà dǎzhēn le.', 'Hồi bé tôi sợ nhất là bị tiêm thuốc.', id, NULL, 'SHARED_打针_dǎzhēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_打针_dǎzhēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吃药', 'chīyào', 'chiyao', 'uống thuốc', 'verb', '记得按时吃药，饭后半小时服用。', 'Jìde ànshí chīyào, fànhòu bàn xiǎoshí fúyòng.', 'Nhớ uống thuốc đúng giờ, uống sau bữa ăn nửa tiếng nhé.', id, NULL, 'SHARED_吃药_chīyào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_吃药_chīyào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开药', 'kāiyào', 'kaiyao', 'kê đơn thuốc', 'verb', '医生给我开了三天的消炎药。', 'Yīshēng gěi wǒ kāi le sān tiān de xiāoyán yào.', 'Bác sĩ đã kê cho tôi thuốc kháng viêm ba ngày.', id, NULL, 'SHARED_开药_kāiyào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_开药_kāiyào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '药店', 'yàodiàn', 'yaodian', 'hiệu thuốc, tiệm thuốc', 'noun', '拿上处方去药店买药。', 'Ná shàng chùfāng qù yàodiàn mǎi yào.', 'Cầm theo đơn thuốc đến tiệm thuốc mua thuốc.', id, NULL, 'SHARED_药店_yàodiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_药店_yàodiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '药片', 'yàopiàn', 'yaopian', 'viên thuốc', 'noun', '一次吃两片药片。', 'Yí cì chī liǎng piàn yàopiàn.', 'Mỗi lần uống hai viên thuốc.', id, NULL, 'SHARED_药片_yàopiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_药片_yàopiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '胶囊', 'jiāonáng', 'jiaonang', 'viên nang, thuốc con nhộng', 'noun', '这种感冒胶囊见效很快。', 'Zhè zhǒng gǎnmào jiāonáng jiànxiào hěn kuài.', 'Loại thuốc cảm viên nang này tác dụng rất nhanh.', id, NULL, 'SHARED_胶囊_jiāonáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_胶囊_jiāonáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '休息', 'xiūxi', 'xiuxi', 'nghỉ ngơi', 'verb', '工作太累了，停下来休息一下吧。', 'Gōngzuò tài lèi le, tíng xiàlai xiūxi yíxià ba.', 'Làm việc mệt quá rồi, dừng lại nghỉ ngơi một chút đi.', id, NULL, 'SHARED_休息_xiūxi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_休息_xiūxi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '严重', 'yánzhòng', 'yanzhong', 'nghiêm trọng, trầm trọng', 'adjective', '幸好病情不算太严重。', 'Xìnghǎo bìngqíng bú suàn tài yánzhòng.', 'May mắn là bệnh tình không quá nghiêm trọng.', id, NULL, 'SHARED_严重_yánzhòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_严重_yánzhòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '康复', 'kāngfù', 'kangfu', 'hồi phục sức khỏe, bình phục', 'verb', '祝你早日康复！', 'Zhù nǐ zǎorì kāngfù!', 'Chúc bạn sớm ngày bình phục!', id, NULL, 'SHARED_康复_kāngfù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_康复_kāngfù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '恢复', 'huìfù', 'huifu', 'khôi phục, hồi phục', 'verb', '经过调养，他已经恢复了健康。', 'Jīngguò tiáoyǎng, tā yǐjīng huìfù le jiànkāng.', 'Qua bồi dưỡng, anh ấy đã hồi phục sức khỏe.', id, NULL, 'SHARED_恢复_huìfù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_恢复_huìfù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '健康', 'jiànkāng', 'jiankang', 'khỏe mạnh, sức khỏe', 'noun', '健康是人生最大的财富。', 'Jiànkāng shì rénshēng zuì dà de cáifù.', 'Sức khỏe là tài sản lớn nhất của đời người.', id, NULL, 'SHARED_健康_jiànkāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_健康_jiànkāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '身体', 'shēntǐ', 'shenti', 'thân thể, sức khỏe', 'noun', '祝您身体健康，万事如意！', 'Zhù nín shēntǐ jiànkāng, wànshì rúyì!', 'Kính chúc ngài dồi dào sức khỏe, vạn sự như ý!', id, NULL, 'SHARED_身体_shēntǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_身体_shēntǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '体温', 'tǐwēn', 'tiwen', 'thân nhiệt, nhiệt độ cơ thể', 'noun', '你的体温正常，没有发烧。', 'Nǐ de tǐwēn zhèngcháng, méiyǒu fāshāo.', 'Thân nhiệt của bạn bình thường, không hề phát sốt.', id, NULL, 'SHARED_体温_tǐwēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_体温_tǐwēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '体温计', 'tǐwēnjì', 'tiwenji', 'nhiệt kế', 'noun', '用体温计测一下额温。', 'Yòng tǐwēnjì cè yíxià éwēn.', 'Dùng nhiệt kế đo nhiệt độ trán một chút.', id, NULL, 'SHARED_体温计_tǐwēnjì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_体温计_tǐwēnjì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '血压', 'xuèyā', 'xueya', 'huyết áp', 'noun', '老人要每天量一下血压。', 'Lǎorén yào měi tiān liáng yíxià xuèyā.', 'Người già nên đo huyết áp mỗi ngày.', id, NULL, 'SHARED_血压_xuèyā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_血压_xuèyā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '牙痛', 'yátòng', 'yatong', 'đau răng', 'verb', '俗话说牙痛不是病，痛起来真要命。', 'Súhuà shuō yátòng bú shì bìng, tòng qǐlai zhēn yàomìng.', 'Tục ngữ nói đau răng không phải bệnh, mà đau lên thì khổ sở vô cùng.', id, NULL, 'SHARED_牙痛_yátòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_牙痛_yátòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '嗓子', 'sǎngzi', 'sangzi', 'cổ họng, giọng', 'noun', '多喝蜂蜜水可以保护嗓子。', 'Duō hē fēngmì shuǐ kěyǐ bǎohù sǎngzi.', 'Uống nhiều nước mật ong có thể bảo vệ cổ họng.', id, NULL, 'SHARED_嗓子_sǎngzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_嗓子_sǎngzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '眼睛', 'yǎnjing', 'yanjing', 'mắt, đôi mắt', 'noun', '看电脑时间长了眼睛会酸。', 'Kàn diànnǎo shíjiān cháng le yǎnjing huì suān.', 'Nhìn máy tính lâu đôi mắt sẽ bị mỏi mỏi.', id, NULL, 'SHARED_眼睛_yǎnjing'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_眼睛_yǎnjing';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '耳朵', 'ěrduo', 'erduo', 'tai, lỗ tai', 'noun', '戴耳机音量不要太大，保护耳朵。', 'Dài ěrjī yīnliàng bú yào tài dà, bǎohù ěrduo.', 'Đeo tai nghe âm lượng đừng để quá lớn, bảo vệ tai.', id, NULL, 'SHARED_耳朵_ěrduo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_耳朵_ěrduo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '放心', 'fàngxīn', 'fangxin', 'yên tâm', 'verb', '你放心吧，我会照顾好自己的。', 'Nǐ fàngxīn ba, wǒ huì zhàogù hǎo zìjǐ de.', 'Bạn yên tâm đi, tôi sẽ chăm sóc bản thân thật tốt.', id, NULL, 'SHARED_放心_fàngxīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_放心_fàngxīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '照顾', 'zhàogù', 'zhaogu', 'chăm sóc, săn sóc', 'verb', '生病时妈妈一直在床边照顾我。', 'Shēngbìng shí māma yìzhí zài chuángbiān zhàogù wǒ.', 'Khi ốm mẹ luôn túc trực bên giường chăm sóc tôi.', id, NULL, 'SHARED_照顾_zhàogù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_照顾_zhàogù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打呼噜', 'dǎ hūlu', 'dahulu', 'ngáy ngủ', 'verb', '他睡得很沉，开始打呼噜了。', 'Tā shuì de hěn chén, kāishǐ dǎ hūlu le.', 'Anh ấy ngủ rất say, đã bắt đầu ngáy khò khò.', id, NULL, 'SHARED_打呼噜_dǎ hūlu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_打呼噜_dǎ hūlu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出汗', 'chūhàn', 'chuhan', 'toát mồ hôi, đổ mồ hôi', 'verb', '发烧出汗后体温慢慢降下来了。', 'Fāshāo chūhàn hòu tǐwēn mànmàn jiàng xiàlai le.', 'Sốt toát mồ hôi xong thân nhiệt từ từ hạ xuống.', id, NULL, 'SHARED_出汗_chūhàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_出汗_chūhàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '感觉', 'gǎnjué', 'ganjue', 'cảm giác, cảm thấy', 'verb', '吃了药之后你感觉好点了吗？', 'Chī le yào zhīhòu nǐ gǎnjué hǎodiǎn le ma?', 'Sau khi uống thuốc bạn đã cảm thấy đỡ hơn chút nào chưa?', id, NULL, 'SHARED_感觉_gǎnjué'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 4
  AND v.owner_key = 'SHARED_感觉_gǎnjué';

-- --- BAI 5 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '超市', 'chāoshì', 'chaoshi', 'siêu thị', 'noun', '我们周末一起去超市采购吧。', 'Wǒmen zhōumò yìqǐ qù chāoshì cǎigòu ba.', 'Cuối tuần chúng mình cùng đi siêu thị mua sắm nhé.', id, NULL, 'SHARED_超市_chāoshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_超市_chāoshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '购物', 'gòuwù', 'gouwu', 'mua sắm', 'verb', '线上购物非常方便快捷。', 'Xiànshàng gòuwù fēicháng fāngbiàn kuàijié.', 'Mua sắm trực tuyến vô cùng thuận tiện nhanh chóng.', id, NULL, 'SHARED_购物_gòuwù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_购物_gòuwù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '商场', 'shāngchǎng', 'shangchang', 'trung tâm thương mại', 'noun', '市中心新建了一家大型商场。', 'Shì zhōngxīn xīn jiàn le yì jiā dàxíng shāngchǎng.', 'Ở trung tâm thành phố mới xây một trung tâm thương mại lớn.', id, NULL, 'SHARED_商场_shāngchǎng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_商场_shāngchǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '售货员', 'shòuhuòyuán', 'shouhuoyuan', 'nhân viên bán hàng', 'noun', '售货员热情地为顾客介绍商品。', 'Shòuhuòyuán rèqíng de wèi gùkè jièshào shāngpǐn.', 'Nhân viên bán hàng nhiệt tình giới thiệu sản phẩm cho khách.', id, NULL, 'SHARED_售货员_shòuhuòyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_售货员_shòuhuòyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '顾客', 'gùkè', 'guke', 'khách hàng, khách mua', 'noun', '周末商场里的顾客特别多。', 'Zhōumò shāngchǎng lǐ de gùkè tèbié duō.', 'Cuối tuần khách hàng trong trung tâm mua sắm rất đông.', id, NULL, 'SHARED_顾客_gùkè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_顾客_gùkè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '价格', 'jiàgé', 'jiage', 'giá cả, mức giá', 'noun', '这款手机的性价比和价格都很合适。', 'Zhè kuǎn shǒujī de xìngjiàbǐ hé jiàgé dōu hěn héshì.', 'Hiệu năng và giá cả của chiếc điện thoại này đều rất hợp lý.', id, NULL, 'SHARED_价格_jiàgé'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_价格_jiàgé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '便宜', 'piányi', 'pianyi', 'rẻ, giá rẻ', 'adjective', '超市里的青菜比菜市场还便宜。', 'Chāoshì lǐ de qīngcài bǐ càishìchǎng hái piányi.', 'Rau xanh trong siêu thị còn rẻ hơn ngoài chợ.', id, NULL, 'SHARED_便宜_piányi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_便宜_piányi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '贵', 'guì', 'gui', 'đắt, đắt đỏ', 'adjective', '这件名牌大衣太贵了。', 'Zhè jiàn míngpái dàyī tài guì le.', 'Chiếc áo khoác hàng hiệu này đắt quá.', id, NULL, 'SHARED_贵_guì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_贵_guì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打折', 'dǎzhé', 'dazhe', 'giảm giá, chiết khấu', 'verb', '换季的时候很多衣服都在打折。', 'Huànjì de shíhou hěn duō yīfu dōu zài dǎzhé.', 'Khi chuyển mùa rất nhiều quần áo được giảm giá.', id, NULL, 'SHARED_打折_dǎzhé'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_打折_dǎzhé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '优惠', 'yōuhuì', 'youhui', 'ưu đãi, khuyến mãi', 'noun', '会员今天可以享受九折优惠。', 'Huìyuán jīntiān kěyǐ xiǎngshòu jiǔ zhé yōuhuì.', 'Hội viên hôm nay được hưởng ưu đãi giảm giá 10%.', id, NULL, 'SHARED_优惠_yōuhuì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_优惠_yōuhuì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '免费', 'miǎnfèi', 'mianfei', 'miễn phí', 'adjective', '店里提供免费的茶水和无线网。', 'Diàn lǐ tígōng miǎnfèi de cháshuǐ hé wúxiànwǎng.', 'Cửa hàng cung cấp nước trà và wifi miễn phí.', id, NULL, 'SHARED_免费_miǎnfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_免费_miǎnfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '塑料袋', 'sùliàodài', 'suliaodai', 'túi ni-lông', 'noun', '为了环保，请尽量少用塑料袋。', 'Wèile huánbǎo, qǐng jǐnliàng shǎo yòng sùliàodài.', 'Vì bảo vệ môi trường, xin hãy hạn chế dùng túi nilon.', id, NULL, 'SHARED_塑料袋_sùliàodài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_塑料袋_sùliàodài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '购物车', 'gòuwùchē', 'gouwuche', 'xe đẩy mua hàng', 'noun', '推着购物车挑选商品更省力。', 'Tuī zhe gòuwùchē tiāoxuǎn shāngpǐn gèng shěnglì.', 'Đẩy xe mua hàng chọn đồ sẽ đỡ tốn sức hơn.', id, NULL, 'SHARED_购物车_gòuwùchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_购物车_gòuwùchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '收银台', 'shōuyíntái', 'shouyintai', 'quầy thu ngân', 'noun', '请大家到三号收银台结账。', 'Qǐng dàjiā dào sān hào shōuyíntái jiézhàng.', 'Mời mọi người đến quầy thu ngân số 3 thanh toán.', id, NULL, 'SHARED_收银台_shōuyíntái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_收银台_shōuyíntái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '现金', 'xiànjīn', 'xianjin', 'tiền mặt', 'noun', '请问可以付现金吗？', 'Qǐngwèn kěyǐ fù xiànjīn ma?', 'Xin hỏi có thể trả bằng tiền mặt không?', id, NULL, 'SHARED_现金_xiànjīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_现金_xiànjīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '刷卡', 'shuākǎ', 'shuaka', 'quẹt thẻ', 'verb', '现在大家都习惯手机支付或者刷卡。', 'Xiànzài dàjiā dōu xíguàn shǒujī zhīfù huòzhě shuākǎ.', 'Bây giờ ai cũng quen thanh toán điện thoại hoặc quẹt thẻ.', id, NULL, 'SHARED_刷卡_shuākǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_刷卡_shuākǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '扫码', 'sǎomǎ', 'saoma', 'quét mã QR', 'verb', '请扫码完成付款。', 'Qǐng sǎomǎ wánchéng fùkuǎn.', 'Vui lòng quét mã để hoàn tất thanh toán.', id, NULL, 'SHARED_扫码_sǎomǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_扫码_sǎomǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '找钱', 'zhǎoqián', 'zhaoqian', 'thối lại tiền, trả lại tiền thừa', 'verb', '收您一百，找钱二十五元。', 'Shōu nín yì bǎi, zhǎoqián èrshíwǔ yuán.', 'Nhận của quý khách 100 tệ, thối lại 25 tệ.', id, NULL, 'SHARED_找钱_zhǎoqián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_找钱_zhǎoqián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发票', 'fāpiào', 'fapiao', 'hóa đơn đỏ, hóa đơn VAT', 'noun', '如果您需要报销，请开一张发票。', 'Rúguǒ nín xūyào bàoxiāo, qǐng kāi yì zhāng fāpiào.', 'Nếu bạn cần thanh toán công tác phí, vui lòng xuất hóa đơn.', id, NULL, 'SHARED_发票_fāpiào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_发票_fāpiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '牙膏', 'yágāo', 'yagao', 'kem đánh răng', 'noun', '这盒薄荷牙膏味道很清爽。', 'Zhè hé bòhé yágāo wèidao hěn qīngshuǎng.', 'Hộp kem đánh răng bạc hà này hương vị rất thanh mát.', id, NULL, 'SHARED_牙膏_yágāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_牙膏_yágāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '牙刷', 'yáshuā', 'yashua', 'bàn chải đánh răng', 'noun', '牙刷最好三个月更换一次。', 'Yáshuā zuì hǎo sān gè yuè gēnghuàn yí cì.', 'Bàn chải đánh răng tốt nhất ba tháng nên thay một lần.', id, NULL, 'SHARED_牙刷_yáshuā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_牙刷_yáshuā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '毛巾', 'máojīn', 'maojin', 'khăn mặt, khăn bông', 'noun', '洗完脸后用柔软的毛巾擦干。', 'Xǐ wán liǎn hòu yòng róuruǎn de máojīn cā gān.', 'Rửa mặt xong dùng khăn mềm lau khô.', id, NULL, 'SHARED_毛巾_máojīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_毛巾_máojīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '香皂', 'xiāngzào', 'xiangzao', 'xà phòng thơm', 'noun', '饭前便后用香皂洗手是个好习惯。', 'Fàn qián biàn hòu yòng xiāngzào xǐshǒu shì gè hǎo xíguàn.', 'Rửa tay bằng xà phòng trước khi ăn là thói quen tốt.', id, NULL, 'SHARED_香皂_xiāngzào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_香皂_xiāngzào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '洗发水', 'xǐfàshuǐ', 'xifashui', 'dầu gội đầu', 'noun', '这种洗发水去屑效果特别好。', 'Zhè zhǒng xǐfàshuǐ qùxiè xiàoguǒ tèbié hǎo.', 'Loại dầu gội này trị gàu cực kỳ tốt.', id, NULL, 'SHARED_洗发水_xǐfàshuǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_洗发水_xǐfàshuǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '纸巾', 'zhǐjīn', 'zhijin', 'khăn giấy', 'noun', '桌上放着一包抽纸巾。', 'Zhuō shang fàng zhe yì bāo chōu zhǐjīn.', 'Trên bàn để một gói khăn giấy rút.', id, NULL, 'SHARED_纸巾_zhǐjīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_纸巾_zhǐjīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '垃圾桶', 'lājītǒng', 'lajitong', 'thùng rác', 'noun', '请把废纸扔进旁边的垃圾桶。', 'Qǐng bǎ fèizhǐ rēng jìn pángbiān de lājītǒng.', 'Xin hãy vứt giấy vụn vào thùng rác bên cạnh.', id, NULL, 'SHARED_垃圾桶_lājītǒng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_垃圾桶_lājītǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电池', 'diànchí', 'dianchi', 'pin, cục pin', 'noun', '遥控器没电了，需要换两节电池。', 'Yáokòngqì méi diàn le, xūyào huàn liǎng jié diànchí.', 'Điều khiển hết pin rồi, cần thay hai cục pin.', id, NULL, 'SHARED_电池_diànchí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_电池_diànchí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '新鲜', 'xīnxiān', 'xinxian', 'tươi mới, tươi ngon', 'adjective', '清晨买到的海鲜特别新鲜。', 'Qīngchén mǎi dào de hǎixiān tèbié xīnxiān.', 'Hải sản mua vào sáng sớm đặc biệt tươi ngon.', id, NULL, 'SHARED_新鲜_xīnxiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_新鲜_xīnxiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '质量', 'zhìliàng', 'zhiliang', 'chất lượng', 'noun', '这家店的商品质量很有保障。', 'Zhè jiā diàn de shāngpǐn zhìliàng hěn yǒu bǎozhàng.', 'Chất lượng hàng hóa của quán này rất đảm bảo.', id, NULL, 'SHARED_质量_zhìliàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_质量_zhìliàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '挑选', 'tiāoxuǎn', 'tiaoxuan', 'lựa chọn, tuyển chọn', 'verb', '大家都在认真挑选心仪的礼物。', 'Dàjiā dōu zài rènzhēn tiāoxuǎn xīnyí de lǐwù.', 'Mọi người đều đang chăm chú lựa chọn món quà ưng ý.', id, NULL, 'SHARED_挑选_tiāoxuǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_挑选_tiāoxuǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '合适', 'héshì', 'heshi', 'vừa vặn, thích hợp', 'adjective', '这件衣服穿在你身上非常合适。', 'Zhè jiàn yīfu chuān zài nǐ shēnshang fēicháng héshì.', 'Chiếc áo này mặc trên người bạn rất vừa vặn.', id, NULL, 'SHARED_合适_héshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_合适_héshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '换', 'huàn', 'huan', 'đổi, thay đổi', 'verb', '尺码有点小，我想换一件大号的。', 'Chǐmǎ yǒudiǎn xiǎo, wǒ xiǎng huàn yí jiàn dà hào de.', 'Kích cỡ hơi nhỏ, tôi muốn đổi sang một chiếc size lớn hơn.', id, NULL, 'SHARED_换_huàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_换_huàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '退货', 'tuìhuò', 'tuihuo', 'trả lại hàng', 'verb', '只要有小票，七天内都可以退货。', 'Zhǐyào yǒu xiǎopiào, qī tiān nèi dōu kěyǐ tuìhuò.', 'Chỉ cần có hóa đơn, trong 7 ngày đều có thể trả hàng.', id, NULL, 'SHARED_退货_tuìhuò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_退货_tuìhuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '特价', 'tèjià', 'tejia', 'giá đặc biệt, giá ưu đãi lớn', 'noun', '今天苹果特价，两块钱一斤。', 'Jīntiān píngguǒ tèjià, liǎng kuài qián yì jīn.', 'Hôm nay táo có giá đặc biệt, hai tệ một cân.', id, NULL, 'SHARED_特价_tèjià'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_特价_tèjià';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '日用品', 'rìyòngpǐn', 'riyongpin', 'vật dụng hàng ngày', 'noun', '日用品专区在商场二楼。', 'Rìyòngpǐn zhuānqū zài shāngchǎng èr lóu.', 'Khu vật dụng hàng ngày ở tầng hai trung tâm mua sắm.', id, NULL, 'SHARED_日用品_rìyòngpǐn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_日用品_rìyòngpǐn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '食品', 'shípǐn', 'shipin', 'thực phẩm', 'noun', '注意查看食品包装上的保质期。', 'Zhùyì chákàn shípǐn bāozhuāng shang de bǎozhìqī.', 'Chú ý kiểm tra hạn sử dụng trên bao bì thực phẩm.', id, NULL, 'SHARED_食品_shípǐn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_食品_shípǐn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '零食', 'língshí', 'lingshi', 'đồ ăn vặt', 'noun', '看电影的时候少不了小零食。', 'Kàn diànyǐng de shíhou shǎo bù liǎo xiǎo língshí.', 'Lúc xem phim không thể thiếu đồ ăn vặt.', id, NULL, 'SHARED_零食_língshí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_零食_língshí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '糖果', 'tángguǒ', 'tangguo', 'kẹo, kẹo ngọt', 'noun', '小朋友们最喜欢吃甜甜的糖果。', 'Xiǎopéngyoumen zuì xǐhuan chī tiántián de tángguǒ.', 'Các em nhỏ thích ăn những viên kẹo ngọt lịm nhất.', id, NULL, 'SHARED_糖果_tángguǒ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_糖果_tángguǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '饼干', 'bǐnggān', 'binggan', 'bánh quy', 'noun', '下午茶配一块巧克力饼干很惬意。', 'Xiàwǔchá pèi yí kuài qiǎokèlì bǐnggān hěn qièyì.', 'Trà chiều kèm một miếng bánh quy sô cô la rất thú vị.', id, NULL, 'SHARED_饼干_bǐnggān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 5
  AND v.owner_key = 'SHARED_饼干_bǐnggān';

-- --- BAI 6 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '周末', 'zhōumò', 'zhoumo', 'cuối tuần', 'noun', '你周末一般都有什么安排？', 'Nǐ zhōumò yìbān dōu yǒu shénme ānpái?', 'Cuối tuần bạn thường có kế hoạch gì?', id, NULL, 'SHARED_周末_zhōumò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_周末_zhōumò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打算', 'dǎsuàn', 'dasuan', 'dự định, tính toán', 'verb', '我打算去图书馆看书。', 'Wǒ dǎsuàn qù túshūguǎn kàn shū.', 'Tôi dự định đến thư viện đọc sách.', id, NULL, 'SHARED_打算_dǎsuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_打算_dǎsuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '计划', 'jìhuà', 'jihua', 'kế hoạch', 'noun', '我们制订了一个周密的旅行计划。', 'Wǒmen zhìdìng le yí gè zhōumì de lǚxíng jìhuà.', 'Chúng tôi đã lập một kế hoạch du lịch chu đáo.', id, NULL, 'SHARED_计划_jìhuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_计划_jìhuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '决定', 'juédìng', 'jueding', 'quyết định', 'verb', '最后大家决定去爬山。', 'Zuìhòu dàjiā juédìng qù páshān.', 'Cuối cùng mọi người quyết định đi leo núi.', id, NULL, 'SHARED_决定_juédìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_决定_juédìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '安排', 'ānpái', 'anpai', 'sắp xếp, thu xếp', 'verb', '时间安排得非常紧凑。', 'Shíjiān ānpái de fēicháng jǐncòu.', 'Thời gian được sắp xếp vô cùng chặt chẽ.', id, NULL, 'SHARED_安排_ānpái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_安排_ānpái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '公园', 'gōngyuán', 'gongyuan', 'công viên', 'noun', '早上很多人在公园里打太极拳。', 'Zǎoshang hěn duō rén zài gōngyuán lǐ dǎ tàijíquán.', 'Buổi sáng nhiều người đánh thái cực quyền trong công viên.', id, NULL, 'SHARED_公园_gōngyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_公园_gōngyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '动物园', 'dòngwùyuán', 'dongwuyuan', 'sở thú, vườn bách thú', 'noun', '孩子们在动物园里看到了可爱的大熊猫。', 'Háizimen zài dòngwùyuán lǐ kàndào le kě''ài de dàxióngmāo.', 'Lũ trẻ nhìn thấy gấu trúc đáng yêu trong sở thú.', id, NULL, 'SHARED_动物园_dòngwùyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_动物园_dòngwùyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '植物园', 'zhíwùyuán', 'zhiwuyuan', 'vườn thực vật', 'noun', '春天植物园里的花全开了。', 'Chūntiān zhíwùyuán lǐ de huā quán kāi le.', 'Mùa xuân hoa trong vườn thực vật đã nở rộ.', id, NULL, 'SHARED_植物园_zhíwùyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_植物园_zhíwùyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游乐园', 'yóulèyuán', 'youleyuan', 'công viên giải trí', 'noun', '过山车是游乐园最刺激的项目。', 'Guòshānchē shì yóulèyuán zuì cìjī de xiàngmù.', 'Tàu lượn siêu tốc là trò chơi kích thích nhất ở công viên giải trí.', id, NULL, 'SHARED_游乐园_yóulèyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_游乐园_yóulèyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '电影院', 'diànyǐngyuàn', 'dianyingyuan', 'rạp chiếu phim', 'noun', '今天晚上我们一起去电影院吧。', 'Jīntiān wǎnshang wǒmen yìqǐ qù diànyǐngyuàn ba.', 'Tối nay chúng mình cùng đến rạp chiếu phim nhé.', id, NULL, 'SHARED_电影院_diànyǐngyuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_电影院_diànyǐngyuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '散步', 'sànbù', 'sanbu', 'đi dạo', 'verb', '晚饭后散步有助于消化。', 'Wǎnfàn hòu sànbù yǒuzhù yú xiāohuà.', 'Đi dạo sau bữa tối giúp ích cho tiêu hóa.', id, NULL, 'SHARED_散步_sànbù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_散步_sànbù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拍照', 'pāizhào', 'paizhao', 'chụp ảnh', 'verb', '这里的风景太美了，我们拍张照吧。', 'Zhèlǐ de fēngjǐng tài měi le, wǒmen pāi zhāng zhào ba.', 'Phong cảnh ở đây đẹp quá, chúng mình chụp bức ảnh đi.', id, NULL, 'SHARED_拍照_pāizhào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_拍照_pāizhào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '照相机', 'zhàoxiàngjī', 'zhaoxiangji', 'máy ảnh', 'noun', '出门旅游记得带上照相机。', 'Chūmén lǚyóu jìde dài shàng zhàoxiàngjī.', 'Đi du lịch nhớ mang theo máy ảnh.', id, NULL, 'SHARED_照相机_zhàoxiàngjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_照相机_zhàoxiàngjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '风景', 'fēngjǐng', 'fengjing', 'phong cảnh', 'noun', '山顶上的自然风景美不胜收。', 'Shāndǐng shang de zìrán fēngjǐng měi bú shèng shōu.', 'Phong cảnh thiên nhiên trên đỉnh núi đẹp không xuể.', id, NULL, 'SHARED_风景_fēngjǐng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_风景_fēngjǐng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '美丽', 'měilì', 'meili', 'xinh đẹp, tươi đẹp', 'adjective', '她穿着一件美丽的白裙子。', 'Tā chuān zhe yí jiàn měilì de bái qúnzi.', 'Cô ấy mặc một chiếc váy trắng xinh đẹp.', id, NULL, 'SHARED_美丽_měilì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_美丽_měilì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好玩', 'hǎowán', 'haowan', 'vui, thú vị', 'adjective', '这个游戏规则简单又好玩。', 'Zhè ge yóuxì guīzé jiǎndān yòu hǎowán.', 'Trò chơi này luật đơn giản lại rất vui.', id, NULL, 'SHARED_好玩_hǎowán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_好玩_hǎowán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '无聊', 'wúliáo', 'wuliao', 'nhàm chán, buồn tẻ', 'adjective', '一个人呆在家里感觉有点无聊。', 'Yí gè rén dāi zài jiālǐ gǎnjué yǒudiǎn wúliáo.', 'Một mình ở nhà cảm thấy có chút buồn tẻ.', id, NULL, 'SHARED_无聊_wúliáo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_无聊_wúliáo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '散心', 'sànxīn', 'sanxin', 'giải khuây, thư giãn đầu óc', 'verb', '心情不好的时候可以出去散散心。', 'Xīnqíng bù hǎo de shíhou kěyǐ chūqù sànsanxīn.', 'Khi tâm trạng không tốt có thể ra ngoài thư giãn đầu óc.', id, NULL, 'SHARED_散心_sànxīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_散心_sànxīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '放松', 'fàngsōng', 'fangsong', 'thư giãn, thả lỏng', 'verb', '听听轻音乐能让人心情放松。', 'Tīngting qīngyīnyuè néng ràng rén xīnqíng fàngsōng.', 'Nghe nhạc nhẹ có thể giúp tâm trạng thả lỏng.', id, NULL, 'SHARED_放松_fàngsōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_放松_fàngsōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '集合', 'jíhé', 'jihe', 'tập trung, tập hợp', 'verb', '明天早上七点在校门口集合。', 'Míngtiān zǎoshang qī diǎn zài xiàomén kǒu jíhé.', '7 giờ sáng mai tập hợp ở cổng trường.', id, NULL, 'SHARED_集合_jíhé'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_集合_jíhé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出发', 'chūfā', 'chufa', 'xuất phát, khởi hành', 'verb', '大家带好东西，准备出发！', 'Dàjiā dài hǎo dōngxi, zhǔnbèi chūfā!', 'Mọi người mang đủ đồ đạc, chuẩn bị xuất phát!', id, NULL, 'SHARED_出发_chūfā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_出发_chūfā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '准时', 'zhǔnshí', 'zhunshi', 'đúng giờ', 'adjective', '开会请大家务必准时到达。', 'Kāihuì qǐng dàjiā wùbì zhǔnshí dàodá.', 'Họp hành xin mọi người nhất định phải đến đúng giờ.', id, NULL, 'SHARED_准时_zhǔnshí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_准时_zhǔnshí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '集合地点', 'jíhé dìdiǎn', 'jihedidian', 'địa điểm tập trung', 'noun', '我们约定的集合地点在地铁口。', 'Wǒmen yuēdìng de jíhé dìdiǎn zài dìtiěkǒu.', 'Địa điểm tập trung chúng ta hẹn nhau ở cửa ga tàu điện.', id, NULL, 'SHARED_集合地点_jíhé dìdiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_集合地点_jíhé dìdiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '门票', 'ménpiào', 'menpiao', 'vé vào cửa', 'noun', '景区的门票可以在网上提前购买。', 'Jǐngqū de ménpiào kěyǐ zài wǎngshang tíqián gòumǎi.', 'Vé vào cửa khu thắng cảnh có thể mua trước trên mạng.', id, NULL, 'SHARED_门票_ménpiào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_门票_ménpiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '参观', 'cānguān', 'canguan', 'tham quan', 'verb', '今天下午我们参观了美术馆。', 'Jīntiān xiàwǔ wǒmen cānguān le měishùguǎn.', 'Chiều nay chúng tôi đã tham quan bảo tàng mỹ thuật.', id, NULL, 'SHARED_参观_cānguān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_参观_cānguān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '精彩', 'jīngcǎi', 'jingcai', 'đặc sắc, xuất sắc', 'adjective', '这场足球比赛踢得真精彩。', 'Zhè chǎng zúqiú bǐsài tī de zhēn jīngcǎi.', 'Trận bóng đá này đá thật là đặc sắc.', id, NULL, 'SHARED_精彩_jīngcǎi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_精彩_jīngcǎi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '表演', 'biǎoyǎn', 'biaoyan', 'biểu diễn, trình diễn', 'noun', '杂技演员的表演赢得了热烈掌声。', 'Zájì yǎnyuán de biǎoyǎn yíngdé le rèliè zhǎngshēng.', 'Tiết mục biểu diễn xiếc nhận được tràng pháo tay nồng nhiệt.', id, NULL, 'SHARED_表演_biǎoyǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_表演_biǎoyǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '愉快', 'yúkuài', 'yukuai', 'vui vẻ, sảng khoái', 'adjective', '祝你们度过一个愉快的周末！', 'Zhù nǐmen dùguò yí gè yúkuài de zhōumò!', 'Chúc các bạn có một kỳ nghỉ cuối tuần vui vẻ!', id, NULL, 'SHARED_愉快_yúkuài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_愉快_yúkuài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '快乐', 'kuàilè', 'kuaile', 'hạnh phúc, hân hoan', 'adjective', '祝大家天天快乐！', 'Zhù dàjiā tiāntiān kuàilè!', 'Chúc mọi người ngày nào cũng vui vẻ!', id, NULL, 'SHARED_快乐_kuàilè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_快乐_kuàilè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '玩耍', 'wánshuǎ', 'wanshua', 'vui chơi, nô đùa', 'verb', '小狗在草地上欢快地玩耍。', 'Xiǎogǒu zài cǎodì shang huānkuài de wánshuǎ.', 'Chú cún con đang tung tăng nô đùa trên bãi cỏ.', id, NULL, 'SHARED_玩耍_wánshuǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_玩耍_wánshuǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '聊天', 'liáotiān', 'liaotian', 'tán gẫu, trò chuyện', 'verb', '几个好朋友坐在一起喝茶聊天。', 'Jǐ gè hǎo péngyou zuò zài yìqǐ hē chá liáotiān.', 'Mấy người bạn thân ngồi bên nhau uống trà tán gẫu.', id, NULL, 'SHARED_聊天_liáotiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_聊天_liáotiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吹风', 'chuīfēng', 'chuifeng', 'hóng gió, gió thổi', 'verb', '站在海边吹风特别凉爽。', 'Zhàn zài hǎibiān chuīfēng tèbié liángshuǎng.', 'Đứng bên bờ biển hóng gió thật mát mẻ.', id, NULL, 'SHARED_吹风_chuīfēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_吹风_chuīfēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '划船', 'huáchuán', 'huachuan', 'chèo thuyền', 'verb', '湖面上有很多划船的游人。', 'Húmiàn shang yǒu hěn duō huáchuán de yóurén.', 'Trên mặt hồ có rất nhiều du khách đang chèo thuyền.', id, NULL, 'SHARED_划船_huáchuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_划船_huáchuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爬山', 'páshān', 'pashan', 'leo núi', 'verb', '经常爬山有助于锻炼心肺功能。', 'Jīngcháng páshān yǒuzhù yú duànliàn xīnfèi gōngnéng.', 'Thường xuyên leo núi giúp rèn luyện chức năng tim phổi.', id, NULL, 'SHARED_爬山_páshān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_爬山_páshān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '野餐', 'yěcān', 'yecan', 'dã ngoại, ăn ngoài trời', 'noun', '春天是去草地上野餐的好时节。', 'Chūntiān shì qù cǎodì shang yěcān de hǎo shíjié.', 'Mùa xuân là thời điểm lý tưởng để đi dã ngoại trên cỏ.', id, NULL, 'SHARED_野餐_yěcān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_野餐_yěcān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帐篷', 'zhàngpeng', 'zhangpeng', 'lều trại', 'noun', '他们在湖边搭起了漂亮的帐篷。', 'Tāmen zài húbiān dā qǐ le piàoliang de zhàngpeng.', 'Họ đã dựng chiếc lều xinh xắn ven hồ.', id, NULL, 'SHARED_帐篷_zhàngpeng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_帐篷_zhàngpeng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '准备', 'zhǔnbèi', 'zhunbei', 'chuẩn bị', 'verb', '我们已经为这次活动做好了准备。', 'Wǒmen yǐjīng wèi zhè cì huódòng zuò hǎo le zhǔnbèi.', 'Chúng tôi đã chuẩn bị chu đáo cho sự kiện lần này.', id, NULL, 'SHARED_准备_zhǔnbèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_准备_zhǔnbèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '期待', 'qīdài', 'qidai', 'mong đợi, ngóng chờ', 'verb', '大家都很期待下周的旅行。', 'Dàjiā dōu hěn qīdài xià zhōu de lǚxíng.', 'Ai nấy đều vô cùng mong chờ chuyến du lịch tuần tới.', id, NULL, 'SHARED_期待_qīdài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_期待_qīdài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '收拾', 'shōushi', 'shoushi', 'thu dọn, dọn dẹp', 'verb', '出发前记得把行李收拾好。', 'Chūfā qián jìde bǎ xíngli shōushi hǎo.', 'Trước khi khởi hành nhớ thu dọn hành lý gọn gàng nhé.', id, NULL, 'SHARED_收拾_shōushi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 6
  AND v.owner_key = 'SHARED_收拾_shōushi';

-- --- BAI 7 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打电话', 'dǎ diànhuà', 'dadianhua', 'gọi điện thoại', 'verb', '请给李老师打电话确认一下时间。', 'Qǐng gěi Lǐ lǎoshī dǎ diànhuà quèrèn yíxià shíjiān.', 'Xin hãy gọi điện cho thầy Lý xác nhận lại thời gian.', id, NULL, 'SHARED_打电话_dǎ diànhuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_打电话_dǎ diànhuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '接电话', 'jiē diànhuà', 'jiedianhua', 'nghe điện thoại', 'verb', '他在开会，现在不方便接电话。', 'Tā zài kāihuì, xiànzài bù fāngbiàn jiē diànhuà.', 'Anh ấy đang họp, bây giờ không tiện nghe máy.', id, NULL, 'SHARED_接电话_jiē diànhuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_接电话_jiē diànhuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '挂断', 'guàduàn', 'guaduan', 'cúp máy, dập máy', 'verb', '说完正事后他就把电话挂断了。', 'Shuō wán zhèngshì hòu tā jiù bǎ diànhuà guàduàn le.', 'Nói xong việc chính anh ấy liền cúp máy.', id, NULL, 'SHARED_挂断_guàduàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_挂断_guàduàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '留言', 'liúyán', 'liuyan', 'để lại lời nhắn', 'verb', '如果对方没接，可以给他发语音留言。', 'Rúguǒ duìfāng méi jiē, kěyǐ gěi tā fā yǔyīn liúyán.', 'Nếu đối phương không nghe máy, bạn có thể để lại lời nhắn thoại.', id, NULL, 'SHARED_留言_liúyán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_留言_liúyán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发信息', 'fā xìnxī', 'faxinxi', 'gửi tin nhắn', 'verb', '到了目的地记得给我发信息报平安。', 'Dào le mùdìdì jìde gěi wǒ fā xìnxī bào píng''ān.', 'Đến nơi nhớ nhắn tin báo bình an cho tôi nhé.', id, NULL, 'SHARED_发信息_fā xìnxī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_发信息_fā xìnxī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发短信', 'fā duǎnxìn', 'faduanxin', 'gửi tin nhắn SMS', 'verb', '银行给我发短信提醒账户余额。', 'Yínháng gěi wǒ fā duǎnxìn tíxǐng zhànghù yú''é.', 'Ngân hàng gửi SMS nhắc nhở số dư tài khoản của tôi.', id, NULL, 'SHARED_发短信_fā duǎnxìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_发短信_fā duǎnxìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发微信', 'fā wēixìn', 'faweixin', 'gửi tin nhắn WeChat', 'verb', '我们加个好友，以后发微信联系。', 'Wǒmen jiā gè hǎoyǒu, yǐhòu fā wēixìn liánxì.', 'Chúng ta kết bạn nhé, sau này nhắn tin WeChat liên lạc.', id, NULL, 'SHARED_发微信_fā wēixìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_发微信_fā wēixìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '语音', 'yǔyīn', 'yuyin', 'âm thanh, tin nhắn thoại', 'noun', '打字太慢了，直接发语音吧。', 'Dǎzì tài màn le, zhíjiē fā yǔyīn ba.', 'Gõ chữ chậm quá, gửi luôn tin nhắn thoại đi.', id, NULL, 'SHARED_语音_yǔyīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_语音_yǔyīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '视频通话', 'shìpín tōnghuà', 'shipintonghua', 'cuộc gọi video', 'noun', '周末我和远在国外的父母打视频通话。', 'Zhōumò wǒ hé yuǎn zài guówài de fùmǔ dǎ shìpín tōnghuà.', 'Cuối tuần tôi gọi video cho bố mẹ đang ở nước ngoài.', id, NULL, 'SHARED_视频通话_shìpín tōnghuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_视频通话_shìpín tōnghuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '手机', 'shǒujī', 'shouji', 'điện thoại di động', 'noun', '我的手机电量只剩下百分之十了。', 'Wǒ de shǒujī diànliàng zhǐ shèng xià bǎifēnzhīshí le.', 'Pin điện thoại của tôi chỉ còn có 10% thôi.', id, NULL, 'SHARED_手机_shǒujī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_手机_shǒujī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '信号', 'xìnhào', 'xinhao', 'tín hiệu sóng', 'noun', '电梯里手机没有信号。', 'Diàntī lǐ shǒujī méiyǒu xìnhào.', 'Trong thang máy điện thoại không có sóng.', id, NULL, 'SHARED_信号_xìnhào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_信号_xìnhào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '充值', 'chōngzhí', 'chongzhi', 'nạp tiền vào tài khoản', 'verb', '手机欠费了，需要网上充值。', 'Shǒujī qiànfèi le, xūyào wǎngshang chōngzhí.', 'Điện thoại hết tiền rồi, cần nạp trực tuyến.', id, NULL, 'SHARED_充值_chōngzhí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_充值_chōngzhí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '话费', 'huàfèi', 'huafei', 'cước điện thoại', 'noun', '我刚充了一百块钱话费。', 'Wǒ gāng chōng le yì bǎi kuài qián huàfèi.', 'Tôi vừa nạp 100 tệ cước điện thoại.', id, NULL, 'SHARED_话费_huàfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_话费_huàfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '流量', 'liúliàng', 'liuliang', 'dung lượng data internet', 'noun', '看高清视频会消耗很多手机流量。', 'Kàn gāoqīng shìpín huì xiāohào hěn duō shǒujī liúliàng.', 'Xem video độ phân giải cao sẽ tiêu hao rất nhiều dung lượng.', id, NULL, 'SHARED_流量_liúliàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_流量_liúliàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '密码', 'mìmǎ', 'mima', 'mật khẩu, mật mã', 'noun', '请不要把银行卡密码告诉别人。', 'Qǐng bú yào bǎ yínhángkǎ mìmǎ gàosu biérén.', 'Xin đừng tiết lộ mật khẩu thẻ ngân hàng cho người khác.', id, NULL, 'SHARED_密码_mìmǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_密码_mìmǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '账号', 'zhànghào', 'zhanghao', 'tài khoản', 'noun', '请输入您的用户名和账号。', 'Qǐng shūrù nín de yònghùmíng hé zhànghào.', 'Vui lòng nhập tên người dùng và số tài khoản.', id, NULL, 'SHARED_账号_zhànghào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_账号_zhànghào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邮箱', 'yóuxiāng', 'youxiang', 'hòm thư điện tử, email box', 'noun', '有新邮件会发送到您的邮箱。', 'Yǒu xīn yóujiàn huì fāsòng dào nín de yóuxiāng.', 'Thư mới sẽ được chuyển tới hòm thư của bạn.', id, NULL, 'SHARED_邮箱_yóuxiāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_邮箱_yóuxiāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邮件', 'yóujiàn', 'youjian', 'thư điện tử, bưu phẩm', 'noun', '我刚给客户发了一封商务邮件。', 'Wǒ gāng gěi kèhù fā le yì fēng shāngwù yóujiàn.', 'Tôi vừa gửi một bức email thương mại cho khách hàng.', id, NULL, 'SHARED_邮件_yóujiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_邮件_yóujiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发送', 'fāsòng', 'fasong', 'gửi đi, phát gửi', 'verb', '点击按钮即可发送文件。', 'Diǎnjī ànniǔ jíkě fāsòng wénjiàn.', 'Nhấp vào nút bấm là có thể gửi tệp đi.', id, NULL, 'SHARED_发送_fāsòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_发送_fāsòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '接收', 'jiēshōu', 'jieshou', 'nhận về, thu nhận', 'verb', '手机正在接收新文件。', 'Shǒujī zhèngzài jiēshōu xīn wénjiàn.', 'Điện thoại đang tiếp nhận tệp tin mới.', id, NULL, 'SHARED_接收_jiēshōu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_接收_jiēshōu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下载', 'xiàzài', 'xiazai', 'tải xuống, download', 'verb', '可以在应用商店下载这个学习软件。', 'Kěyǐ zài yìngyòng shāngdiàn xiàzài zhège xuéxí ruǎnjiàn.', 'Có thể tải phần mềm học tập này trên kho ứng dụng.', id, NULL, 'SHARED_下载_xiàzài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_下载_xiàzài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上传', 'shàngchuán', 'shangchuan', 'tải lên, upload', 'verb', '请把作业上传到教学平台。', 'Qǐng bǎ zuòyè shàngchuán dào jiàoxué píngtái.', 'Vui lòng tải bài tập lên nền tảng dạy học.', id, NULL, 'SHARED_上传_shàngchuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_上传_shàngchuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '网页', 'wǎngyè', 'wangye', 'trang web', 'noun', '刷新网页就可以看到最新结果。', 'Shuāxīn wǎngyè jiù kěyǐ kàndào zuìxīn jiéguǒ.', 'Tải lại trang web là có thể xem kết quả mới nhất.', id, NULL, 'SHARED_网页_wǎngyè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_网页_wǎngyè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '网站', 'wǎngzhàn', 'wangzhan', 'trang mạng, website', 'noun', '这个网站上有丰富的汉语学习资料。', 'Zhè ge wǎngzhàn shang yǒu fēngfù de hànyǔ xuéxí zīliào.', 'Trên website này có tài liệu học tiếng Trung rất phong phú.', id, NULL, 'SHARED_网站_wǎngzhàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_网站_wǎngzhàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '链接', 'liànjiē', 'lianjie', 'đường dẫn, link', 'noun', '我把课程链接发到微信群里了。', 'Wǒ bǎ kèchéng liànjiē fā dào wēixìn qún lǐ le.', 'Tôi đã gửi đường link bài học vào nhóm WeChat rồi.', id, NULL, 'SHARED_链接_liànjiē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_链接_liànjiē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '网络', 'wǎngluò', 'wangluo', 'mạng lưới, mạng internet', 'noun', '现在的网络速度非常快。', 'Xiànzài de wǎngluò sùdù fēicháng kuài.', 'Tốc độ mạng internet bây giờ rất nhanh.', id, NULL, 'SHARED_网络_wǎngluò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_网络_wǎngluò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '互联网', 'hùliánwǎng', 'hulianwang', 'mạng toàn cầu, internet', 'noun', '互联网改变了人们的生活方式。', 'Hùliánwǎng gǎibiàn le rénmen de shēnghuó fāngshì.', 'Internet đã thay đổi phương thức sinh hoạt của con người.', id, NULL, 'SHARED_互联网_hùliánwǎng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_互联网_hùliánwǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '查资料', 'chá zīliào', 'chaziliao', 'tra cứu tư liệu', 'verb', '写论文需要上网查大量资料。', 'Xiě lùnwén xūyào shàngwǎng chá dàliàng zīliào.', 'Viết luận văn cần lên mạng tra cứu lượng lớn tư liệu.', id, NULL, 'SHARED_查资料_chá zīliào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_查资料_chá zīliào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '快捷', 'kuàijié', 'kuaijie', 'nhanh gọn, tiện lợi', 'adjective', '移动支付给生活带来了快捷。', 'Yídòng zhīfù gěi shēnghuó dàilái le kuàijié.', 'Thanh toán di động mang lại sự nhanh chóng cho đời sống.', id, NULL, 'SHARED_快捷_kuàijié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_快捷_kuàijié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '关机', 'guānjī', 'guanji', 'tắt máy điện thoại/máy tính', 'verb', '飞机起飞前请将手机关机。', 'Fēijī qǐfēi qián qǐng jiāng shǒujī guānjī.', 'Trước khi máy bay cất cánh xin hãy tắt máy.', id, NULL, 'SHARED_关机_guānjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_关机_guānjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开机', 'kāijī', 'kaiji', 'mở máy, bật nguồn', 'verb', '电脑开机速度很快。', 'Diànnǎo kāijī sùdù hěn kuài.', 'Tốc độ khởi động máy tính rất nhanh.', id, NULL, 'SHARED_开机_kāijī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_开机_kāijī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '响', 'xiǎng', 'xiang', 'vang lên, reng reng', 'verb', '闹钟响了，该起床了。', 'Nàozhōng xiǎng le, gāi qǐchuáng le.', 'Chuông báo thức reo rồi, đến giờ dậy rồi.', id, NULL, 'SHARED_响_xiǎng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_响_xiǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '铃声', 'língshēng', 'lingsheng', 'tiếng chuông', 'noun', '这首歌曲的手机铃声真好听。', 'Zhè shǒu gēqǔ de shǒujī língshēng zhēn hǎotīng.', 'Nhạc chuông bài hát này nghe hay thật.', id, NULL, 'SHARED_铃声_língshēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_铃声_língshēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '稍等', 'shāoděng', 'shaodeng', 'chờ một chút, lát nữa', 'verb', '请您稍等，我马上过来。', 'Qǐng nín shāoděng, wǒ mǎshàng guòlai.', 'Xin quý khách chờ một lát, tôi qua ngay.', id, NULL, 'SHARED_稍等_shāoděng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_稍等_shāoděng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '占线', 'zhànxiàn', 'zhanxian', 'máy bận, đường dây bận', 'verb', '他的电话一直占线，可能在跟别人通话。', 'Tā de diànhuà yìzhí zhànxiàn, kěnéng zài gēn biérén tōnghuà.', 'Điện thoại của cậu ấy luôn báo bận, có lẽ đang gọi cho ai.', id, NULL, 'SHARED_占线_zhànxiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_占线_zhànxiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拨打', 'bōdǎ', 'boda', 'bấm số gọi, quay số', 'verb', '紧急情况下请拨打求助热线。', 'Jǐnjí qíngkuàng xià qǐng bōdǎ qiúzhù rèxiàn.', 'Trong tình huống khẩn cấp vui lòng bấm số đường dây nóng trợ giúp.', id, NULL, 'SHARED_拨打_bōdǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_拨打_bōdǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '转发', 'zhuǎnfā', 'zhuanfa', 'chuyển tiếp tin nhắn', 'verb', '请把通知转发到班级群。', 'Qǐng bǎ tōngzhī zhuǎnfā dào bānjí qún.', 'Làm ơn chuyển tiếp thông báo vào nhóm lớp.', id, NULL, 'SHARED_转发_zhuǎnfā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_转发_zhuǎnfā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '联系', 'liánxì', 'lianxi', 'liên hệ, liên lạc', 'verb', '保持联系，有空常聚聚。', 'Bǎochí liánxì, yǒukòng cháng jùju.', 'Giữ liên lạc nhé, rảnh rỗi nhớ thường xuyên gặp nhau.', id, NULL, 'SHARED_联系_liánxì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_联系_liánxì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '通知', 'tōngzhī', 'tongzhi', 'thông báo', 'noun', '学校发布了放假通知。', 'Xuéxiào fābù le fàngjià tōngzhī.', 'Nhà trường đã ban hành thông báo nghỉ học.', id, NULL, 'SHARED_通知_tōngzhī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 7
  AND v.owner_key = 'SHARED_通知_tōngzhī';

-- --- BAI 8 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '交通', 'jiāotōng', 'jiaotong', 'giao thông', 'noun', '市中心的交通十分繁忙。', 'Shì zhōngxīn de jiāotōng shífēn fánmáng.', 'Giao thông ở trung tâm thành phố rất tấp nập.', id, NULL, 'SHARED_交通_jiāotōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_交通_jiāotōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出行', 'chūxíng', 'chuxing', 'đi lại, di chuyển', 'verb', '绿色出行有利于保护空气环境。', 'Lǜsè chūxíng yǒulì yú bǎohù kōngqì huánjìng.', 'Di chuyển xanh rất có lợi cho việc bảo vệ môi trường không khí.', id, NULL, 'SHARED_出行_chūxíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_出行_chūxíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '公共汽车', 'gōnggòng qìchē', 'gonggongqiche', 'xe buýt', 'noun', '乘坐公共汽车经济又实惠。', 'Chéngzuò gōnggòng qìchē jīngjì yòu shíhuì.', 'Đi xe buýt vừa tiết kiệm lại vừa tiện dụng.', id, NULL, 'SHARED_公共汽车_gōnggòng qìchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_公共汽车_gōnggòng qìchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地铁', 'dìtiě', 'ditie', 'tàu điện ngầm', 'noun', '坐地铁不用担心堵车。', 'Zuò dìtiě bú yòng dānxīn dǔchē.', 'Đi tàu điện ngầm không cần lo kẹt xe.', id, NULL, 'SHARED_地铁_dìtiě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_地铁_dìtiě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出租车', 'chūzūchē', 'chuzuche', 'xe tắc-xi', 'noun', '在路边招手就能打到出租车。', 'Zài lùbiān zhāoshǒu jiù néng dǎ dào chūzūchē.', 'Đứng bên đường vẫy tay là bắt được xe taxi.', id, NULL, 'SHARED_出租车_chūzūchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_出租车_chūzūchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '自行车', 'zìxíngchē', 'zixingche', 'xe đạp', 'noun', '骑自行车既锻炼身体又环保。', 'Qí zìxíngchē jì duànliàn shēntǐ yòu huánbǎo.', 'Đạp xe đạp vừa rèn luyện sức khỏe lại thân thiện với môi trường.', id, NULL, 'SHARED_自行车_zìxíngchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_自行车_zìxíngchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '共享单车', 'gòngxiǎng dānchē', 'gongxiangdanche', 'xe đạp công cộng chia sẻ', 'noun', '街头到处都是绿色的共享单车。', 'Jiētóu dàochù dōu shì lǜsè de gòngxiǎng dānchē.', 'Khắp đường phố đều là xe đạp công cộng màu xanh.', id, NULL, 'SHARED_共享单车_gòngxiǎng dānchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_共享单车_gòngxiǎng dānchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '车站', 'chēzhàn', 'chezhan', 'trạm xe, bến xe', 'noun', '我们在公共汽车站碰面吧。', 'Wǒmen zài gōnggòng qìchē zhàn pèngmiàn ba.', 'Chúng mình gặp nhau ở trạm xe buýt nhé.', id, NULL, 'SHARED_车站_chēzhàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_车站_chēzhàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地铁站', 'dìtiězhàn', 'ditiezhan', 'ga tàu điện ngầm', 'noun', '出地铁站往前走两百米就到了。', 'Chū dìtiězhàn wǎng qián zǒu liǎng bǎi mǐ jiù dào le.', 'Ra khỏi ga tàu điện đi thẳng 200 mét là tới nơi.', id, NULL, 'SHARED_地铁站_dìtiězhàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_地铁站_dìtiězhàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '站台', 'zhàntái', 'zhantai', 'sân ga, thềm ga', 'noun', '请在站台安全线以内候车。', 'Qǐng zài zhàntái ānquánxiàn yǐnèi hòuchē.', 'Xin chờ tàu phía trong vạch an toàn của sân ga.', id, NULL, 'SHARED_站台_zhàntái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_站台_zhàntái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '路线', 'lùxiàn', 'luxian', 'tuyến đường, lộ trình', 'noun', '手机地图为我们规划了最佳路线。', 'Shǒujī dìtú wèi wǒmen guīhuà le zuì jiā lùxiàn.', 'Bản đồ điện thoại đã lập tuyến đường tối ưu cho chúng ta.', id, NULL, 'SHARED_路线_lùxiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_路线_lùxiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '换乘', 'huànchéng', 'huancheng', 'chuyển tuyến xe/tàu', 'verb', '在人民广场站换乘地铁二号线。', 'Zài Rénmín Guǎngchǎng zhàn huànchéng dìtiě èr hào xiàn.', 'Tại ga Quảng trường Nhân dân chuyển sang tuyến tàu điện số 2.', id, NULL, 'SHARED_换乘_huànchéng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_换乘_huànchéng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '售票处', 'shòupiàochù', 'shoupiaochu', 'quầy bán vé', 'noun', '售票处前排起了长队。', 'Shòupiàochù qián pái qǐ le cháng duì.', 'Trước quầy bán vé xếp một hàng dài người.', id, NULL, 'SHARED_售票处_shòupiàochù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_售票处_shòupiàochù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '买票', 'mǎi piào', 'maipiao', 'mua vé', 'verb', '进站乘车前要先买票。', 'Jìnzhàn chéngchē qián yào xiān mǎi piào.', 'Trước khi vào ga lên xe phải mua vé trước.', id, NULL, 'SHARED_买票_mǎi piào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_买票_mǎi piào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '车票', 'chēpiào', 'chepiao', 'vé xe, vé tàu', 'noun', '请保管好您的车票以备查验。', 'Qǐng bǎoguǎn hǎo nín de chēpiào yǐ bèi chá yàn.', 'Vui lòng giữ vé tàu cẩn thận để xuất trình kiểm tra.', id, NULL, 'SHARED_车票_chēpiào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_车票_chēpiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '卡', 'kǎ', 'ka', 'thẻ, card', 'noun', '乘车刷公交卡可以享受打折。', 'Chéngchē shuā gōngjiāokǎ kěyǐ xiǎngshòu dǎzhé.', 'Đi xe quẹt thẻ giao thông sẽ được giảm giá.', id, NULL, 'SHARED_卡_kǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_卡_kǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上车', 'shàngchē', 'shangche', 'lên xe', 'verb', '先下后上，请排队上车。', 'Xiān xià hòu shàng, qǐng páiduì shàngchē.', 'Người xuống trước người lên sau, xin xếp hàng lên xe.', id, NULL, 'SHARED_上车_shàngchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_上车_shàngchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下车', 'xiàchē', 'xiache', 'xuống xe', 'verb', '前方到站是终点站，请全部下车。', 'Qiánfāng dào zhàn shì zhōngdiǎnzhàn, qǐng quánbù xiàchē.', 'Trạm phía trước là bến cuối, xin toàn bộ hành khách xuống xe.', id, NULL, 'SHARED_下车_xiàchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_下车_xiàchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '师傅', 'shīfu', 'shifu', 'bác tài, sư phụ, thợ', 'noun', '师傅，麻烦您在前面的路口停一下。', 'Shīfu, máfan nín zài qiánmiàn de lùkǒu tíng yíxià.', 'Bác tài ơi, phiền bác dừng lại ở ngã rẽ phía trước một chút.', id, NULL, 'SHARED_师傅_shīfu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_师傅_shīfu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '司机', 'sījī', 'siji', 'tài xế, người lái xe', 'noun', '出租车司机对本市道路非常熟悉。', 'Chūzūchē sījī duì běn shì dàolù fēicháng shúxī.', 'Tài xế taxi cực kỳ quen thuộc đường sá thành phố này.', id, NULL, 'SHARED_司机_sījī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_司机_sījī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '堵车', 'dǔchē', 'duche', 'tắc đường, kẹt xe', 'verb', '下班高峰期经常严重堵车。', 'Xiàbān gāofēngqī jīngcháng yánzhòng dǔchē.', 'Giờ cao điểm tan tầm thường xuyên bị kẹt xe nghiêm trọng.', id, NULL, 'SHARED_堵车_dǔchē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_堵车_dǔchē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '挤', 'jǐ', 'ji', 'chen chúc, đông đúc', 'adjective', '早上的地铁特别挤。', 'Zǎoshang de dìtiě tèbié jǐ.', 'Tàu điện ngầm sáng sớm vô cùng chen chúc.', id, NULL, 'SHARED_挤_jǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_挤_jǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '准点', 'zhǔndiǎn', 'zhundian', 'đúng giờ, chuẩn giờ', 'adjective', '高铁列车运行非常准点。', 'Gāotiě lièchē yùnxíng fēicháng zhǔndiǎn.', 'Đoàn tàu cao tốc vận hành rất đúng giờ.', id, NULL, 'SHARED_准点_zhǔndiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_准点_zhǔndiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晚点', 'wǎndiǎn', 'wandian', 'chậm giờ, trễ chuyến', 'verb', '因为大雾，今天部分航班晚点了。', 'Yīnwèi dà wù, jīntiān bùfen hángbān wǎndiǎn le.', 'Vì sương mù dày đặc nên một số chuyến bay hôm nay đã bị trễ.', id, NULL, 'SHARED_晚点_wǎndiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_晚点_wǎndiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '迷路', 'mílù', 'milu', 'lạc đường', 'verb', '第一次来这座大城市很容易迷路。', 'Dì yí cì lái zhè zuò dà chéngshì hěn róngyì mílù.', 'Lần đầu tiên đến thành phố lớn này rất dễ lạc đường.', id, NULL, 'SHARED_迷路_mílù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_迷路_mílù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '问路', 'wènlù', 'wenlu', 'hỏi thăm đường', 'verb', '迷路了可以向路边的交警问路。', 'Mílù le kěyǐ xiàng lùbiān de jiāojǐng wènlù.', 'Bị lạc đường có thể hỏi thăm cảnh sát giao thông bên đường.', id, NULL, 'SHARED_问路_wènlù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_问路_wènlù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拐弯', 'guǎiwān', 'guaiwan', 'rẽ, quẹo', 'verb', '在下一个路口向右拐弯。', 'Zài xià yí gè lùkǒu xiàng yòu guǎiwān.', 'Ở ngã rẽ tiếp theo hãy rẽ sang bên phải.', id, NULL, 'SHARED_拐弯_guǎiwān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_拐弯_guǎiwān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '直走', 'zhízǒu', 'zhizou', 'đi thẳng', 'verb', '沿着这条街一直往前直走。', 'Yánzhe zhè tiáo jiē yìzhí wǎng qián zhízǒu.', 'Cứ đi men theo con phố này thẳng về phía trước.', id, NULL, 'SHARED_直走_zhízǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_直走_zhízǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '十字路口', 'shízì lùkǒu', 'shizilukou', 'ngã tư đường', 'noun', '十字路口车流量非常大。', 'Shízì lùkǒu chēliúliàng fēicháng dà.', 'Lưu lượng xe ở ngã tư đường vô cùng lớn.', id, NULL, 'SHARED_十字路口_shízì lùkǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_十字路口_shízì lùkǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '红绿灯', 'hónglǜdēng', 'honglvdeng', 'đèn giao thông', 'noun', '过马路要注意看红绿灯。', 'Guò mǎlù yào zhùyì kàn hónglǜdēng.', 'Sang đường cần chú ý quan sát đèn giao thông.', id, NULL, 'SHARED_红绿灯_hónglǜdēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_红绿灯_hónglǜdēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '人行横道', 'rénxíng héngdào', 'renxinghengdao', 'vạch qua đường dành cho người đi bộ', 'noun', '过街请走人行横道。', 'Guò jiē qǐng zǒu rénxíng héngdào.', 'Sang bên kia đường xin hãy đi qua vạch dành cho người đi bộ.', id, NULL, 'SHARED_人行横道_rénxíng héngdào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_人行横道_rénxíng héngdào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '斑马线', 'bānmǎxiàn', 'banmaxian', 'vạch vằn ngựa sang đường', 'noun', '车辆在斑马线前应当减速礼让行人。', 'Chēliàng zài bānmǎxiàn qián yīngdāng jiǎnsù lǐràng xíngrén.', 'Phương tiện tới vạch vằn ngựa phải giảm tốc nhường người đi bộ.', id, NULL, 'SHARED_斑马线_bānmǎxiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_斑马线_bānmǎxiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '危险', 'wēixiǎn', 'weixian', 'nguy hiểm', 'adjective', '横穿马路是一件很危险的行为。', 'Héngchuān mǎlù shì yí jiàn hěn wēixiǎn de xíngwéi.', 'Băng qua giữa đường lớn là một hành vi rất nguy hiểm.', id, NULL, 'SHARED_危险_wēixiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_危险_wēixiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '安全', 'ānquán', 'anquan', 'an toàn', 'adjective', '系好安全带保障行车安全。', 'Jì hǎo ānquándài bǎozhàng xíngchē ānquán.', 'Cài thắt lưng an toàn để đảm bảo an toàn chuyến đi.', id, NULL, 'SHARED_安全_ānquán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_安全_ānquán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '遵守', 'zūnshǒu', 'zunshou', 'tuân thủ, chấp hành', 'verb', '每个人都应当严格遵守交通规则。', 'Měi gè rén dōu yīngdāng yángé zūnshǒu jiāotōng guīzé.', 'Mỗi người đều nên nghiêm túc tuân thủ luật giao thông.', id, NULL, 'SHARED_遵守_zūnshǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_遵守_zūnshǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '规则', 'guīzé', 'guize', 'quy tắc, luật lệ', 'noun', '遵守规则是社会文明的体现。', 'Zūnshǒu guīzé shì shèhuì wénmíng de tǐxiàn.', 'Tuân thủ quy tắc là biểu hiện của văn minh xã hội.', id, NULL, 'SHARED_规则_guīzé'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_规则_guīzé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '距离', 'jùlí', 'juli', 'khoảng cách, cự ly', 'noun', '学校和家里的距离大约有五公里。', 'Xuéxiào hé jiālǐ de jùlí dàyuē yǒu wǔ gōnglǐ.', 'Khoảng cách từ trường về nhà khoảng năm ki-lô-mét.', id, NULL, 'SHARED_距离_jùlí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_距离_jùlí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '公里', 'gōnglǐ', 'gongli', 'ki-lô-mét', 'measure_word', '汽车以每小时八十公里的速度行驶。', 'Qìchē yǐ měi xiǎoshí bāshí gōnglǐ de sùdù xíngshǐ.', 'Ô tô chạy với vận tốc 80 km/h.', id, NULL, 'SHARED_公里_gōnglǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_公里_gōnglǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '方便', 'fāngbiàn', 'fangbian', 'tiện lợi, thuận tiện', 'adjective', '住在地铁附近出行非常方便。', 'Zhù zài dìtiě fùjìn chūxíng fēicháng fāngbiàn.', 'Sống gần tàu điện ngầm đi lại vô cùng thuận tiện.', id, NULL, 'SHARED_方便_fāngbiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 8
  AND v.owner_key = 'SHARED_方便_fāngbiàn';

-- --- BAI 9 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '运动', 'yùndòng', 'yundong', 'vận động, thể thao', 'verb', '每天运动半小时对心脏好。', 'Měi tiān yùndòng bàn xiǎoshí duì xīnzàng hǎo.', 'Mỗi ngày vận động nửa tiếng tốt cho tim mạch.', id, NULL, 'SHARED_运动_yùndòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_运动_yùndòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '锻炼', 'duànliàn', 'duanlian', 'rèn luyện thân thể', 'verb', '坚持锻炼身体能增强免疫力。', 'Jiānchí duànliàn shēntǐ néng zēngqiáng miǎnyìlì.', 'Kiên trì rèn luyện thân thể giúp tăng cường sức đề kháng.', id, NULL, 'SHARED_锻炼_duànliàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_锻炼_duànliàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '健身', 'jiànshēn', 'jianshen', 'tập thể hình, giữ dáng', 'verb', '年轻人越来越喜欢去健身。', 'Niánqīngrén yuè lái yuè xǐhuan qù jiànshēn.', 'Giới trẻ ngày càng thích đi tập thể hình.', id, NULL, 'SHARED_健身_jiànshēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_健身_jiànshēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '健身房', 'jiànshēnfáng', 'jianshenfang', 'phòng tập gym', 'noun', '我办了一张健身房的年卡。', 'Wǒ bàn le yì zhāng jiànshēnfáng de niánkǎ.', 'Tôi đã làm một tấm thẻ năm ở phòng tập gym.', id, NULL, 'SHARED_健身房_jiànshēnfáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_健身房_jiànshēnfáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跑步', 'pǎobù', 'paobu', 'chạy bộ', 'verb', '清晨在湖边跑步感觉神清气爽。', 'Qīngchén zài húbiān pǎobù gǎnjué shénqīng qìshuǎng.', 'Sáng sớm chạy bộ ven hồ thấy vô cùng sảng khoái.', id, NULL, 'SHARED_跑步_pǎobù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_跑步_pǎobù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游泳', 'yóuyǒng', 'youyong', 'bơi lội', 'verb', '夏天游泳是一项很好的消暑活动。', 'Xiàtiān yóuyǒng shì yì xiàng hěn hǎo de xiāoshǔ huódòng.', 'Mùa hè bơi lội là một hoạt động giải nhiệt rất tuyệt.', id, NULL, 'SHARED_游泳_yóuyǒng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_游泳_yóuyǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打篮球', 'dǎ lánqiú', 'dalanqiu', 'chơi bóng rổ', 'verb', '放学后男孩子们喜欢在操场打篮球。', 'Fàngxué hòu nánháizimen xǐhuan zài cāochǎng dǎ lánqiú.', 'Tan học các bạn trai thích chơi bóng rổ trên sân trường.', id, NULL, 'SHARED_打篮球_dǎ lánqiú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_打篮球_dǎ lánqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '踢足球', 'tī zúqiú', 'tizuqiu', 'đá bóng', 'verb', '世界杯期间大家通宵看踢足球。', 'Shìjièbēi qījiān dàjiā tōngxiāo kàn tī zúqiú.', 'Dịp World Cup mọi người thức thâu đêm xem đá bóng.', id, NULL, 'SHARED_踢足球_tī zúqiú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_踢足球_tī zúqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打羽毛球', 'dǎ yǔmáoqiú', 'dayumaoqiu', 'đánh cầu lông', 'verb', '我和朋友周末常去体育馆打羽毛球。', 'Wǒ hé péngyou zhōumò cháng qù tǐyùguǎn dǎ yǔmáoqiú.', 'Tôi và bạn bè cuối tuần hay đến nhà thi đấu đánh cầu lông.', id, NULL, 'SHARED_打羽毛球_dǎ yǔmáoqiú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_打羽毛球_dǎ yǔmáoqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打网球', 'dǎ wǎngqiú', 'dawangqiu', 'chơi quần vợt, tennis', 'verb', '打网球需要很强的体力和反应速度。', 'Dǎ wǎngqiú xūyào hěn qiáng de tǐlì hé fǎnyìng sùdù.', 'Chơi quần vợt đòi hỏi thể lực khỏe và phản xạ nhanh.', id, NULL, 'SHARED_打网球_dǎ wǎngqiú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_打网球_dǎ wǎngqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '乒乓球', 'pīngpāngqiú', 'pingpangqiu', 'bóng bàn', 'noun', '乒乓球是中国的国球。', 'Pīngpāngqiú shì Zhōngguó de guóqiú.', 'Bóng bàn là môn thể thao quốc bảo của Trung Quốc.', id, NULL, 'SHARED_乒乓球_pīngpāngqiú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_乒乓球_pīngpāngqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '瑜伽', 'yújiā', 'yujia', 'môn yoga', 'noun', '练瑜伽能让人心境平和，体态优雅。', 'Liàn yújiā néng ràng rén xīnjìng pínghé, tǐtài yōuyǎ.', 'Tập yoga giúp tâm trí an yên, dáng vóc thanh thoát.', id, NULL, 'SHARED_瑜伽_yújiā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_瑜伽_yújiā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '动作', 'dòngzuò', 'dongzuo', 'động tác', 'noun', '教练耐心地纠正每一个标准动作。', 'Jiàoliàn nàixīn de jiūzhèng měi yí gè biāozhǔn dòngzuò.', 'Huấn luyện viên kiên nhẫn sửa từng động tác chuẩn.', id, NULL, 'SHARED_动作_dòngzuò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_动作_dòngzuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '坚持', 'jiānchí', 'jianchi', 'kiên trì, bền bỉ', 'verb', '贵在坚持，不能半途而废。', 'Guì zài jiānchí, bù néng bàntú''érfèi.', 'Đáng quý là sự kiên trì, không được bỏ dở giữa chừng.', id, NULL, 'SHARED_坚持_jiānchí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_坚持_jiānchí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '习惯', 'xíguàn', 'xiguan', 'thói quen', 'noun', '早睡早起是一个有益健康的好习惯。', 'Zǎoshuì zǎoqǐ shì yí gè yǒuyì jiànkāng de hǎo xíguàn.', 'Ngủ sớm dậy sớm là thói quen tốt có lợi cho sức khỏe.', id, NULL, 'SHARED_习惯_xíguàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_习惯_xíguàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汗', 'hàn', 'han', 'mồ hôi', 'noun', '跑完五公里后他满头大汗。', 'Pǎo wán wǔ gōnglǐ hòu tā mǎntóu dàhàn.', 'Chạy xong 5km cậu ấy mồ hôi đầm đìa khắp đầu.', id, NULL, 'SHARED_汗_hàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_汗_hàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '减肥', 'jiǎnféi', 'jianfei', 'giảm cân', 'verb', '健康饮食加上适量运动是最好的减肥方法。', 'Jiànkāng yǐnshí jiā shàng shìliàng yùndòng shì zuì hǎo de jiǎnféi fāngfǎ.', 'Ăn uống lành mạnh kèm vận động vừa sức là cách giảm cân tốt nhất.', id, NULL, 'SHARED_减肥_jiǎnféi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_减肥_jiǎnféi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '增肌', 'zēngjī', 'zengji', 'tăng cơ bắp', 'verb', '想要增肌需要补充充足的蛋白质。', 'Xiǎng yào zēngjī xūyào bǔchōng chōngzú de dànbáizhì.', 'Muốn tăng cơ cần bổ sung đầy đủ chất đạm.', id, NULL, 'SHARED_增肌_zēngjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_增肌_zēngjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '力量', 'lìliang', 'liliang', 'sức mạnh, thể lực', 'noun', '举重训练能有效提高手臂的力量。', 'Jǔzhòng xùnliàn néng yǒuxiào tígāo shǒubì de lìliang.', 'Luyện nâng tạ có thể tăng sức mạnh cánh tay hiệu quả.', id, NULL, 'SHARED_力量_lìliang'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_力量_lìliang';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '速度', 'sùdù', 'sudu', 'tốc độ', 'noun', '短跑运动员的速度非常惊人。', 'Duǎnpǎo yùndòngyuán de sùdù fēicháng jīngrén.', 'Tốc độ của vận động viên chạy cự ly ngắn rất đáng nể.', id, NULL, 'SHARED_速度_sùdù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_速度_sùdù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '比赛', 'bǐsài', 'bisai', 'thi đấu, cuộc thi', 'noun', '今晚有一场备受关注的篮球决赛。', 'Jīnwǎn yǒu yì chǎng bèishòu guānzhù de lánqiú juésài.', 'Tối nay có một trận chung kết bóng rổ rất được chú ý.', id, NULL, 'SHARED_比赛_bǐsài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_比赛_bǐsài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '输', 'shū', 'shu', 'thua cuộc', 'verb', '虽然输了比赛，但他们收获了宝贵的经验。', 'Suīrán shū le bǐsài, dàn tāmen shōuhuò le bǎoguì de jīngyàn.', 'Dù thua trận nhưng họ đã gặt hái được kinh nghiệm quý.', id, NULL, 'SHARED_输_shū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_输_shū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '赢', 'yíng', 'ying', 'chiến thắng, thắng lợi', 'verb', '经过努力拼搏，我们队终于赢了！', 'Jīngguò nǔlì pīnbó, wǒmen duì zhōngyú yíng le!', 'Qua bao nỗ lực tranh đấu, đội chúng tôi cuối cùng đã thắng!', id, NULL, 'SHARED_赢_yíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_赢_yíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冠军', 'guànjūn', 'guanjun', 'quán quân, nhà vô địch', 'noun', '他通过不懈奋斗获得了全省冠军。', 'Tā tōngguò búxiè fèndòu huòdé le quán shěng guànjūn.', 'Anh ấy nỗ lực không ngừng và đã giành ngôi quán quân toàn tỉnh.', id, NULL, 'SHARED_冠军_guànjūn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_冠军_guànjūn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '裁判', 'cáipàn', 'caipan', 'trọng tài', 'noun', '裁判在场上的判决非常公正。', 'Cáipàn zài chǎng shang de pànjué fēicháng gōngzhèng.', 'Phán quyết của trọng tài trên sân rất công tâm.', id, NULL, 'SHARED_裁判_cáipàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_裁判_cáipàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '队友', 'duìyǒu', 'duiyou', 'đồng đội', 'noun', '在队友的默契配合下，我们攻入一球。', 'Zài duìyǒu de mòqì pèihé xià, wǒmen gōngrù yì qiú.', 'Dưới sự phối hợp ăn ý của đồng đội, chúng tôi ghi được một bàn.', id, NULL, 'SHARED_队友_duìyǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_队友_duìyǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '加油', 'jiāyóu', 'jiayou', 'cố lên, tiếp thêm năng lượng', 'verb', '观众们在场边大声为运动员加油。', 'Guānzhòngmen zài chǎngbiān dàshēng wèi yùndòngyuán jiāyóu.', 'Khán giả bên sân lớn tiếng cổ vũ cố lên cho các vận động viên.', id, NULL, 'SHARED_加油_jiāyóu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_加油_jiāyóu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '紧张', 'jǐnzhāng', 'jinzhang', 'căng thẳng, hồi hộp', 'adjective', '决赛时刻场上的气氛非常紧张。', 'Juésài shíkè chǎng shang de qìfēn fēicháng jǐnzhāng.', 'Thời khắc chung kết bầu không khí trên sân rất căng thẳng.', id, NULL, 'SHARED_紧张_jǐnzhāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_紧张_jǐnzhāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '轻松', 'qīngsōng', 'qingsong', 'thư thái, nhẹ nhàng', 'adjective', '考完试之后大家感到无比轻松。', 'Kǎo wán shì zhīhòu dàjiā gǎndào wúbǐ qīngsōng.', 'Sau khi thi xong ai nấy đều cảm thấy vô cùng nhẹ nhõm.', id, NULL, 'SHARED_轻松_qīngsōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_轻松_qīngsōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '精神', 'jīngshen', 'jingshen', 'tinh thần, đầy sức sống', 'adjective', '睡了个好觉，今天精神饱满。', 'Shuì le gè hǎo jiào, jīntiān jīngshen bǎomǎn.', 'Ngủ một giấc ngon, hôm nay tinh thần sảng khoái tràn trề.', id, NULL, 'SHARED_精神_jīngshen'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_精神_jīngshen';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '累', 'lèi', 'lei', 'mệt mỏi', 'adjective', '跑完长跑后浑身很累。', 'Pǎo wán chángpǎo hòu húnshēn hěn lèi.', 'Chạy bền xong cả người mệt lử.', id, NULL, 'SHARED_累_lèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_累_lèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '疲劳', 'píláo', 'pilao', 'mệt mỏi, uể oải', 'adjective', '泡个热水澡能消除一整天的疲劳。', 'Pào gè rèshuǐzǎo néng xiāochú yì zhěng tiān de píláo.', 'Ngâm bồn nước nóng có thể xua tan mệt mỏi cả ngày.', id, NULL, 'SHARED_疲劳_píláo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_疲劳_píláo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '健美', 'jiànměi', 'jianmei', 'thể hình đẹp, nở nang', 'adjective', '长期的器械训练让他拥有了健美的身材。', 'Chángqī de qìxiè xùnliàn ràng tā yōngyǒu le jiànměi de shēncái.', 'Luyện dụng cụ lâu năm giúp anh ấy sở hữu thân hình nở nang săn chắc.', id, NULL, 'SHARED_健美_jiànměi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_健美_jiànměi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '活力', 'huólì', 'huoli', 'sức sống, sinh lực tràn trề', 'noun', '年轻人身上总是充满了青春活力。', 'Niánqīngrén shēnshang zǒngshì chōngmǎn le qīngchūn huólì.', 'Ở những người trẻ tuổi luôn tràn đầy sức sống thanh xuân.', id, NULL, 'SHARED_活力_huólì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_活力_huólì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '散步', 'sànbù', 'sanbu', 'tản bộ, đi dạo', 'verb', '晚饭后散步三十分钟对消化很有好处。', 'Wǎnfàn hòu sànbù sānshí fēnzhōng duì xiāohuà hěn yǒu hǎochu.', 'Sau bữa tối tản bộ 30 phút rất có lợi cho tiêu hóa.', id, NULL, 'SHARED_散步_sànbù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_散步_sànbù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '操场', 'cāochǎng', 'caochang', 'sân tập, sân thể dục', 'noun', '同学们在宽阔的操场上奔跑。', 'Tóngxuémen zài kuānkuò de cāochǎng shang bēnpǎo.', 'Các bạn học sinh đang chạy đua trên sân trường rộng lớn.', id, NULL, 'SHARED_操场_cāochǎng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_操场_cāochǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '体育馆', 'tǐyùguǎn', 'tiyuguan', 'nhà thi đấu, phòng thể thao', 'noun', '学校的新体育馆设施非常现代化。', 'Xuéxiào de xīn tǐyùguǎn shèshī fēicháng xiàndàihuà.', 'Khu thể thao mới của trường cơ sở vật chất rất hiện đại.', id, NULL, 'SHARED_体育馆_tǐyùguǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_体育馆_tǐyùguǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '强壮', 'qiángzhuàng', 'qiangzhuang', 'cường tráng, khỏe khoắn', 'adjective', '经常运动能让人的身体更加强壮。', 'Jīngcháng yùndòng néng ràng rén de shēntǐ gèngjiā qiángzhuàng.', 'Thường xuyên vận động giúp thân thể thêm phần cường tráng.', id, NULL, 'SHARED_强壮_qiángzhuàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_强壮_qiángzhuàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拉伸', 'lāshēn', 'lashen', 'giãn cơ, ép dẻo', 'verb', '运动前后的充分拉伸可以预防肌肉损伤。', 'Yùndòng qiánhòu de chōngfèn lāshēn kěyǐ yùfáng jīròu sǔnshāng.', 'Giãn cơ đầy đủ trước và sau vận động giúp ngừa chấn thương cơ bắp.', id, NULL, 'SHARED_拉伸_lāshēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 9
  AND v.owner_key = 'SHARED_拉伸_lāshēn';

-- --- BAI 10 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '上班', 'shàngbān', 'shangban', 'đi làm', 'verb', '我每天早上八点半准时上班。', 'Wǒ měi tiān zǎoshang bā diǎn bàn zhǔnshí shàngbān.', 'Mỗi sáng đúng 8 giờ rưỡi tôi đi làm.', id, NULL, 'SHARED_上班_shàngbān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_上班_shàngbān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下班', 'xiàbān', 'xiaban', 'tan làm, hết giờ làm', 'verb', '今天不加班，五点半就可以下班了。', 'Jīntiān bù jiābān, wǔ diǎn bàn jiù kěyǐ xiàbān le.', 'Hôm nay không tăng ca, 5 giờ rưỡi là được tan làm rồi.', id, NULL, 'SHARED_下班_xiàbān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_下班_xiàbān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '加班', 'jiābān', 'jiaban', 'tăng ca, làm thêm giờ', 'verb', '为了赶这个项目进度，大家都在加班。', 'Wèile gǎn zhège xiàngmù jìndù, dàjiā dōu zài jiābān.', 'Để kịp tiến độ dự án này, mọi người đều đang tăng ca.', id, NULL, 'SHARED_加班_jiābān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_加班_jiābān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出差', 'chūchāi', 'chuchai', 'đi công tác', 'verb', '经理下周要出差去上海参加行业论坛。', 'Jīnglǐ xià zhōu yào chūchāi qù Shànghǎi cānjiā hángyè lùntán.', 'Tuần sau giám đốc phải đi công tác Thượng Hải dự diễn đàn.', id, NULL, 'SHARED_出差_chūchāi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_出差_chūchāi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '会议', 'huìyì', 'huiyi', 'cuộc họp, hội nghị', 'noun', '下午两点在三号会议室举行部门会议。', 'Xiàwǔ liǎng diǎn zài sān hào huìyìshì jǔxíng bùmén huìyì.', '2 giờ chiều tại phòng họp số 3 tổ chức họp bộ phận.', id, NULL, 'SHARED_会议_huìyì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_会议_huìyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开会', 'kāihuì', 'kaihui', 'họp, mở hội nghị', 'verb', '大家正在认真开会讨论新的营销方案。', 'Dàjiā zhèngzài rènzhēn kāihuì tǎolùn xīn de yíngxiāo fāng''àn.', 'Mọi người đang chăm chú họp bàn phương án tiếp thị mới.', id, NULL, 'SHARED_开会_kāihuì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_开会_kāihuì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '办公室', 'bàngōngshì', 'bangongshi', 'văn phòng làm việc', 'noun', '请把这份文件送到总经理办公室。', 'Qǐng bǎ zhè fèn wénjiàn sòng dào zǒngjīnglǐ bàngōngshì.', 'Xin gửi tập hồ sơ này tới văn phòng tổng giám đốc.', id, NULL, 'SHARED_办公室_bàngōngshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_办公室_bàngōngshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '经理', 'jīnglǐ', 'jingli', 'giám đốc, người quản lý', 'noun', '王经理在管理团队方面非常有经验。', 'Wáng jīnglǐ zài guǎnlǐ tuánduì fāngmiàn fēicháng yǒu jīngyàn.', 'Giám đốc Vương rất có kinh nghiệm trong việc quản lý đội ngũ.', id, NULL, 'SHARED_经理_jīnglǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_经理_jīnglǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '老板', 'lǎobǎn', 'laoban', 'ông chủ, sếp', 'noun', '老板对团队本季度的突出业绩表示满意。', 'Lǎobǎn duì tuánduì běn jìdù de tūchū yèjì biǎoshì mǎnyì.', 'Ông chủ bày tỏ hài lòng với kết quả quý này của cả đội.', id, NULL, 'SHARED_老板_lǎobǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_老板_lǎobǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '同事', 'tóngshì', 'tongshi', 'đồng nghiệp', 'noun', '我和同事们相处得非常融洽。', 'Wǒ hé tóngshìmen xiāngchǔ de fēicháng róngqià.', 'Tôi và các đồng nghiệp chung sống với nhau rất hòa thuận.', id, NULL, 'SHARED_同事_tóngshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_同事_tóngshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '职员', 'zhíyuán', 'zhiyuan', 'nhân viên', 'noun', '作为公司的一名职员，我们要爱岗敬业。', 'Zuòwéi gōngsī de yì míng zhíyuán, wǒmen yào àigǎngjìngyè.', 'Là một nhân viên công ty, chúng ta phải tận tụy với công việc.', id, NULL, 'SHARED_职员_zhíyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_职员_zhíyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '秘书', 'mìshū', 'mishu', 'thư ký', 'noun', '秘书细心地为领导安排好了每日行程。', 'Mìshū xìxīn de wèi lǐngdǎo ānpái hǎo le měi rì xíngchéng.', 'Cô thư ký cẩn thận sắp xếp chu đáo lịch trình mỗi ngày cho sếp.', id, NULL, 'SHARED_秘书_mìshū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_秘书_mìshū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '客户', 'kèhù', 'kehu', 'khách hàng, đối tác', 'noun', '维护良好的客户关系是销售成功的关键。', 'Wéihù liánghǎo de kèhù guānxi shì xiàoshòu chénggōng de guānjiàn.', 'Duy trì quan hệ khách hàng tốt là then chốt của thành công.', id, NULL, 'SHARED_客户_kèhù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_客户_kèhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '合作', 'hézuò', 'hezuo', 'hợp tác', 'verb', '期待未来我们双方能有更多深入的合作。', 'Qīdài wèilái wǒmen shuāngfāng néng yǒu gèng duō shēnrù de hézuò.', 'Kỳ vọng tương lai hai bên chúng ta sẽ có nhiều hợp tác sâu rộng hơn.', id, NULL, 'SHARED_合作_hézuò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_合作_hézuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '任务', 'rènwu', 'renwu', 'nhiệm vụ', 'noun', '大家齐心协力，提前完成了上级交办的任务。', 'Dàjiā qíxīn xiélì, tíqián wánchéng le shàngjí jiāobàn de rènwu.', 'Mọi người chung sức đồng lòng, hoàn thành sớm nhiệm vụ cấp trên giao.', id, NULL, 'SHARED_任务_rènwu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_任务_rènwu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '报告', 'bàogào', 'baogao', 'báo cáo', 'noun', '下班前请提交本周的工作总结报告。', 'Xiàbān qián qǐng tíjiāo běn zhōu de gōngzuò zǒngjié bàogào.', 'Trước khi tan làm vui lòng nộp báo cáo tổng kết tuần này.', id, NULL, 'SHARED_报告_bàogào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_报告_bàogào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '总结', 'zǒngjié', 'zongjie', 'tổng kết', 'verb', '善于总结经验才能少走弯路。', 'Shànyú zǒngjié jīngyàn cái néng shǎo zǒu wānlù.', 'Khéo tổng kết kinh nghiệm thì mới tránh được những đường vòng.', id, NULL, 'SHARED_总结_zǒngjié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_总结_zǒngjié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '项目', 'xiàngmù', 'xiangmu', 'dự án, hạng mục', 'noun', '这个大项目已经顺利进入了第二阶段。', 'Zhè ge dà xiàngmù yǐjīng shùnlì jìnrù le dì èr jiēduàn.', 'Dự án lớn này đã thuận lợi bước vào giai đoạn thứ hai.', id, NULL, 'SHARED_项目_xiàngmù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_项目_xiàngmù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '负责', 'fùzé', 'fuze', 'chịu trách nhiệm, phụ trách', 'verb', '小张主要负责软件前端页面的开发与测试。', 'Xiǎo Zhāng zhǔyào fùzé ruǎnjiàn qiánduān yèmiàn de kāifā yǔ cèshì.', 'Tiểu Trương chủ yếu phụ trách phát triển và kiểm thử giao diện frontend.', id, NULL, 'SHARED_负责_fùzé'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_负责_fùzé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '解决', 'jiějué', 'jiejue', 'giải quyết, xử lý', 'verb', '团队迅速开会商量并妥善解决了这个技术难题。', 'Tuánduì xùnsù kāihuì shāngliang bìng tuǒshàn jiějué le zhège jìshù nántí.', 'Nhóm lập tức họp bàn và xử lý thỏa đáng bài toán kỹ thuật này.', id, NULL, 'SHARED_解决_jiějué'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_解决_jiějué';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '问题', 'wèntí', 'wenti', 'vấn đề, câu hỏi', 'noun', '遇到不懂的问题要及时请教前辈。', 'Yù dào bù dǒng de wèntí yào jíshí qǐngjiào qiánbèi.', 'Gặp vấn đề không hiểu cần kịp thời thỉnh giáo tiền bối.', id, NULL, 'SHARED_问题_wèntí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_问题_wèntí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '压力', 'yālì', 'yali', 'áp lực', 'noun', '适度的压力可以转化为前进的动力。', 'Shìdù de yālì kěyǐ zhuǎnhuà wéi qiánjìn de dònglì.', 'Áp lực vừa phải có thể chuyển hóa thành động lực tiến lên.', id, NULL, 'SHARED_压力_yālì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_压力_yālì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '薪水', 'xīnshui', 'xinshui', 'tiền lương, thù lao', 'noun', '这份工作的薪水待遇相当不错。', 'Zhè fèn gōngzuò de xīnshui dàiyù xiāngdāng búcuò.', 'Mức lương và đãi ngộ của công việc này khá tốt.', id, NULL, 'SHARED_薪水_xīnshui'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_薪水_xīnshui';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '工资', 'gōngzī', 'gongzi', 'tiền lương hàng tháng', 'noun', '每个月的十号公司会按时发放工资。', 'Měi gè yuè de shí hào gōngsī huì ànshí fāfàng gōngzī.', 'Ngày mồng mười hàng tháng công ty sẽ chuyển lương đúng hạn.', id, NULL, 'SHARED_工资_gōngzī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_工资_gōngzī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '奖金', 'jiǎngjīn', 'jiangjin', 'tiền thưởng, hoa hồng', 'noun', '年终奖金是对大家一年辛勤付出的丰厚肯定。', 'Niánzhōng jiǎngjīn shì duì dàjiā yì nián xīnqín fùchū de fēnghòu kěndìng.', 'Tiền thưởng cuối năm là sự ghi nhận xứng đáng cho một năm cống hiến.', id, NULL, 'SHARED_奖金_jiǎngjīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_奖金_jiǎngjīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '升职', 'shēngzhí', 'shengzhi', 'thăng chức', 'verb', '凭借出色的工作表现，他被顺利升职为部门主管。', 'Píngjiè chūsè de gōngzuò biǎoxiàn, tā bèi shùnlì shēngzhí wéi bùmén zhǔguǎn.', 'Nhờ biểu hiện xuất sắc, anh ấy được thăng chức lên trưởng phòng.', id, NULL, 'SHARED_升职_shēngzhí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_升职_shēngzhí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '辞职', 'cízhí', 'cizhi', 'từ chức, xin nghỉ việc', 'verb', '他决定辞职去继续攻读硕士学位。', 'Tā juédìng cízhí qù jìxù gōngdú shuòshì xuéwèi.', 'Anh ấy quyết định xin nghỉ việc để tiếp tục học lên thạc sĩ.', id, NULL, 'SHARED_辞职_cízhí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_辞职_cízhí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '面试', 'miànshì', 'mianshi', 'phỏng vấn xin việc', 'verb', '明天上午九点他要参加第二轮专业面试。', 'Míngtiān zǎoshang jiǔ diǎn tā yào cānjiā dì èr lún zhuānyè miànshì.', '9 giờ sáng mai anh ấy sẽ tham gia vòng phỏng vấn thứ hai.', id, NULL, 'SHARED_面试_miànshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_面试_miànshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '简历', 'jiǎnlì', 'jianli', 'sơ yếu lý lịch, CV', 'noun', '一份简洁专业的简历能给面试官留下好印象。', 'Yí fèn jiǎnjié zhuānyè de jiǎnlì néng gěi miànshìguān liú xià hǎo yìnxiàng.', 'Một bản CV ngắn gọn chuyên nghiệp sẽ gây ấn tượng tốt với nhà tuyển dụng.', id, NULL, 'SHARED_简历_jiǎnlì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_简历_jiǎnlì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '招聘', 'zhāopìn', 'zhaopin', 'tuyển dụng', 'verb', '公司计划在春季招聘三十名优秀应届毕业生。', 'Gōngsī jìhuà zài chūnjì zhāopìn sānshí míng yōuxiù yìngjiè bìyèshēng.', 'Công ty dự kiến tuyển dụng 30 sinh viên tốt nghiệp xuất sắc vào mùa xuân.', id, NULL, 'SHARED_招聘_zhāopìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_招聘_zhāopìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '经验', 'jīngyàn', 'jingyan', 'kinh nghiệm', 'noun', '他在软件开发领域积累了极其丰富的工作经验。', 'Tā zài ruǎnjiàn kāifā lǐngyù jīlěi le jíqí fēngfù de gōngzuò jīngyàn.', 'Anh ấy đã tích lũy kinh nghiệm dồi dào trong lĩnh vực phần mềm.', id, NULL, 'SHARED_经验_jīngyàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_经验_jīngyàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '能力', 'nénglì', 'nengli', 'năng lực, khả năng', 'noun', '实践证明他的组织和协调能力非常出众。', 'Shíjiàn zhèngmíng tā de zǔzhī hé xiétiáo nénglì fēicháng chūzhòng.', 'Thực tiễn chứng minh năng lực tổ chức và điều phối của anh ấy rất vượt trội.', id, NULL, 'SHARED_能力_nénglì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_能力_nénglì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '专业', 'zhuānyè', 'zhuanye', 'chuyên môn, chuyên ngành', 'noun', '你在大学里读的是什么专业？', 'Nǐ zài dàxué lǐ dú de shì shénme zhuānyè?', 'Ở trường đại học bạn theo học chuyên ngành gì?', id, NULL, 'SHARED_专业_zhuānyè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_专业_zhuānyè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '效率', 'xiàolǜ', 'xiaolv', 'hiệu suất, năng suất làm việc', 'noun', '掌握科学的方法能大幅提高工作效率。', 'Zhǎngwò kēxué de fāngfǎ néng dàfú tígāo gōngzuò xiàolǜ.', 'Nắm vững phương pháp khoa học có thể nâng cao hiệu suất làm việc.', id, NULL, 'SHARED_效率_xiàolǜ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_效率_xiàolǜ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '成功', 'chénggōng', 'chenggong', 'thành công', 'adjective', '经过多次不懈尝试，新产品发布会取得了圆满成功。', 'Jīngguò duō cì búxiè chángshì, xīn chǎnpǐn fābùhuì qǔdé le yuánmǎn chénggōng.', 'Buổi ra mắt sản phẩm mới đã gặt hái thành công trọn vẹn.', id, NULL, 'SHARED_成功_chénggōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_成功_chénggōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '条件', 'tiáojiàn', 'tiaojian', 'điều kiện, tiêu chí', 'noun', '他完全符合招聘岗位所要求的各项条件。', 'Tā wánquán fúhé zhāopìn gǎngwèi suǒ yāoqiú de gè xiàng tiáojiàn.', 'Anh ấy hoàn toàn phù hợp với các tiêu chí của vị trí tuyển dụng.', id, NULL, 'SHARED_条件_tiáojiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_条件_tiáojiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '公司', 'gōngsī', 'gongsi', 'công ty', 'noun', '这家科技公司充满朝气和创新活力。', 'Zhè jiā kējì gōngsī chōngmǎn zhāoqì hé chuàngxīn huólì.', 'Công ty công nghệ này tràn đầy sức trẻ và sức sáng tạo.', id, NULL, 'SHARED_公司_gōngsī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_公司_gōngsī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '同事', 'tóngshì', 'tongshi', 'đồng nghiệp, cộng sự', 'noun', '新来的同事待人谦逊有礼貌。', 'Xīn lái de tóngshì dài rén qiānxùn yǒu lǐmào.', 'Đồng nghiệp mới đến cư xử rất khiêm tốn và lịch sự.', id, NULL, 'SHARED_同事_tóngshì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_同事_tóngshì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '完成', 'wánchéng', 'wancheng', 'hoàn thành', 'verb', '我们要确保按时保质完成目标。', 'Wǒmen yào quèbǎo ànshí bǎozhì wánchéng mùbiāo.', 'Chúng ta cần đảm bảo hoàn thành mục tiêu đúng hạn và đúng chất lượng.', id, NULL, 'SHARED_完成_wánchéng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 10
  AND v.owner_key = 'SHARED_完成_wánchéng';

-- --- BAI 11 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '季节', 'jìjié', 'jijie', 'mùa màng, mùa trong năm', 'noun', '一年有四个季节，每个季节都有独特的美。', 'Yì nián yǒu sì gè jìjié, měi gè jìjié dōu yǒu dútè de měi.', 'Một năm có bốn mùa, mỗi mùa đều mang vẻ đẹp độc đáo.', id, NULL, 'SHARED_季节_jìjié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_季节_jìjié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '春天', 'chūntiān', 'chuntian', 'mùa xuân', 'noun', '春天来了，小草发芽，万物复苏。', 'Chūntiān lái le, xiǎocǎo fāyá, wànwù fùsū.', 'Mùa xuân đến rồi, cỏ non đâm chồi, vạn vật hồi sinh.', id, NULL, 'SHARED_春天_chūntiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_春天_chūntiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '夏天', 'xiàtiān', 'xiatian', 'mùa hè, mùa hạ', 'noun', '夏天天气炎热，很多人喜欢去海边游泳。', 'Xiàtiān tiānqì yánrè, hěn duō rén xǐhuan qù hǎibiān yóuyǒng.', 'Mùa hè thời tiết oi bức, nhiều người thích đi tắm biển.', id, NULL, 'SHARED_夏天_xiàtiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_夏天_xiàtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '秋天', 'qiūtiān', 'qiutian', 'mùa thu', 'noun', '秋天是硕果累累的收获季节。', 'Qiūtiān shì shuòguǒ lěilěi de shōuhuò jìjié.', 'Mùa thu là mùa thu hoạch hoa thơm trái ngọt.', id, NULL, 'SHARED_秋天_qiūtiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_秋天_qiūtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冬天', 'dōngtiān', 'dongtian', 'mùa đông', 'noun', '冬天北方的气温往往会降到零下十几度。', 'Dōngtiān běifāng de qìwēn wǎngwǎng huì jiàng dào língxià shí jǐ dù.', 'Mùa đông nhiệt độ ở miền Bắc thường giảm xuống âm mười mấy độ.', id, NULL, 'SHARED_冬天_dōngtiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_冬天_dōngtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '暖和', 'nuǎnhuo', 'nuanhuo', 'ấm áp', 'adjective', '春风吹拂，天气逐渐变得暖和起来了。', 'Chūnfēng chuīfú, tiānqì zhújiàn biàn de nuǎnhuo qǐlai le.', 'Gió xuân mơn man, thời tiết dần dần ấm áp lên rồi.', id, NULL, 'SHARED_暖和_nuǎnhuo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_暖和_nuǎnhuo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '炎热', 'yánrè', 'yanre', 'nóng nực, oi bức', 'adjective', '炎热的午后街道上几乎没有什么行人。', 'Yánrè de wǔhòu jiēdào shang jīhū méiyǒu shénme xíngrén.', 'Buổi trưa oi bức trên đường phố hầu như chẳng có bóng người.', id, NULL, 'SHARED_炎热_yánrè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_炎热_yánrè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '凉快', 'liángkuai', 'liangkuai', 'mát mẻ, dễ chịu', 'adjective', '下了一场雷阵雨，空气立刻凉快了许多。', 'Xià le yì chǎng léizhènyǔ, kōngqì lìkè liángkuai le xǔduō.', 'Sau cơn mưa rào, không khí mát mẻ hẳn lên.', id, NULL, 'SHARED_凉快_liángkuai'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_凉快_liángkuai';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '寒冷', 'hánlěng', 'hanleng', 'lạnh giá, rét buốt', 'adjective', '寒冷的冬夜大家围坐在火炉旁喝热茶。', 'Hánlěng de dōngyè dàjiā wéizuò zài huǒlú páng hē rèchá.', 'Đêm đông lạnh giá mọi người quây quần bên bếp lò uống trà nóng.', id, NULL, 'SHARED_寒冷_hánlěng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_寒冷_hánlěng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '刮风', 'guāfēng', 'guafeng', 'gió thổi, nổi gió', 'verb', '外面正在刮大风，出门要记得添件厚外套。', 'Wàimiàn zhèngzài guā dàfēng, chūmén yào jìde tiān jiàn hòu wàitào.', 'Bên ngoài đang nổi gió lớn, ra ngoài nhớ mặc thêm áo khoác dày.', id, NULL, 'SHARED_刮风_guāfēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_刮风_guāfēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下雨', 'xiàyǔ', 'xiayu', 'trời mưa', 'verb', '出门记得带伞，天气预报说下午会下雨。', 'Chūmén jìde dài sǎn, tiānqì yùbào shuō xiàwǔ huì xiàyǔ.', 'Ra ngoài nhớ mang theo ô, dự báo thời tiết nói buổi chiều có mưa.', id, NULL, 'SHARED_下雨_xiàyǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_下雨_xiàyǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '下雪', 'xiàxuě', 'xiaxue', 'tuyết rơi', 'verb', '窗外下起了鹅毛大雪，大地白茫茫一片。', 'Chuāngwài xià qǐ le émáo dàxuě, dàdì bái mángmáng yí piàn.', 'Ngoài cửa sổ tuyết bắt đầu rơi như lông ngỗng, đất trời một màu trắng xóa.', id, NULL, 'SHARED_下雪_xiàxuě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_下雪_xiàxuě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阴天', 'yīntiān', 'yintian', 'trời nhiều mây, trời râm', 'noun', '今天是阴天，没有耀眼的太阳，适合出门跑步。', 'Jīntiān shì yīntiān, méiyǒu yàoyǎn de tàiyáng, shìhé chūmén pǎobù.', 'Hôm nay trời râm mát, không có nắng chói chang, rất hợp chạy bộ.', id, NULL, 'SHARED_阴天_yīntiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_阴天_yīntiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晴天', 'qíngtiān', 'qingtian', 'trời nắng đẹp, ngày nắng ráo', 'noun', '连续下了几天雨，今天终于迎来了大晴天。', 'Liánxù xià le jǐ tiān yǔ, jīntiān zhōngyú yínglái le dà qíngtiān.', 'Mưa liên tiếp mấy ngày, hôm nay cuối cùng cũng đón ngày nắng đẹp.', id, NULL, 'SHARED_晴天_qíngtiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_晴天_qíngtiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '多云', 'duōyún', 'duoyun', 'nhiều mây, mây rải rác', 'adjective', '今天局部地区多云间晴，气温适宜。', 'Jīntiān júbù dìqū duōyún jiān qíng, qìwēn shìyí.', 'Hôm nay vài nơi nhiều mây xen kẽ trời nắng, nhiệt độ dễ chịu.', id, NULL, 'SHARED_多云_duōyún'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_多云_duōyún';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '雾', 'wù', 'wu', 'sương mù', 'noun', '清晨江面上笼罩着一层薄薄的白雾。', 'Qīngchén jiāngmiàn shang lǒngzhào zhe yì céng báobáo de bái wù.', 'Sáng sớm trên mặt sông bao phủ một làn sương mỏng.', id, NULL, 'SHARED_雾_wù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_雾_wù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '雷', 'léi', 'lei', 'sấm sét, tiếng sấm', 'noun', '天边传来了阵阵低沉的雷声。', 'Tiānbiān chuánlái le zhènzhèn dīchén de léishēng.', 'Chân trời vọng lại những tiếng sấm rền trầm đục.', id, NULL, 'SHARED_雷_léi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_雷_léi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '闪电', 'shǎndiàn', 'shandian', 'tia chớp, sấm chớp', 'noun', '暴风雨前一道耀眼的闪电划破了漆黑的夜空。', 'Bàofēngyǔ qián yí dào yàoyǎn de shǎndiàn huàpò le qīhēi de yèkōng.', 'Trước cơn bão một vệt chớp sáng rực rạch ngang bầu trời đêm.', id, NULL, 'SHARED_闪电_shǎndiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_闪电_shǎndiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '温度', 'wēndù', 'wendu', 'nhiệt độ', 'noun', '空调把房间的温度控制在舒适的二十六度。', 'Kōngtiáo bǎ fángjiān de wēndù kòngzhì zài shūshì de èrshíliù dù.', 'Điều hòa giữ nhiệt độ phòng ở mức 26 độ dễ chịu.', id, NULL, 'SHARED_温度_wēndù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_温度_wēndù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '气温', 'qìwēn', 'qiwen', 'nhiệt độ không khí ngoài trời', 'noun', '受冷空气影响，明天气温会大幅下降。', 'Shòu lěng kōngqì yǐngxiǎng, míngtiān qìwēn huì dàfú xiàjiàng.', 'Do ảnh hưởng của không khí lạnh, ngày mai nhiệt độ sẽ giảm mạnh.', id, NULL, 'SHARED_气温_qìwēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_气温_qìwēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '摄氏度', 'shèshìdù', 'sheshidu', 'độ C (Celsius)', 'noun', '今天的最高气温预计达到三十五摄氏度。', 'Jīntiān de zuì gāo qìwēn yùjì dádào sānshíwǔ shèshìdù.', 'Nhiệt độ cao nhất hôm nay dự kiến đạt 35 độ C.', id, NULL, 'SHARED_摄氏度_shèshìdù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_摄氏度_shèshìdù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '天气预报', 'tiānqì yùbào', 'tianqiyubao', 'dự báo thời tiết', 'noun', '每天晚上七点爸爸习惯看电视上的天气预报。', 'Měi tiān wǎnshang qī diǎn bàba xíguàn kàn diànshì shang de tiānqì yùbào.', '7 giờ tối mỗi ngày bố quen xem dự báo thời tiết trên tivi.', id, NULL, 'SHARED_天气预报_tiānqì yùbào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_天气预报_tiānqì yùbào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '气候', 'qìhòu', 'qihou', 'khí hậu', 'noun', '南方城市的气候温暖潮湿，适合花草生长。', 'Nánfāng chéngshì de qìhòu wēnnuǎn cháoshī, shìhé huācǎo shēngzhǎng.', 'Khí hậu các thành phố miền Nam ấm áp ẩm ướt, hợp hoa cỏ phát triển.', id, NULL, 'SHARED_气候_qìhòu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_气候_qìhòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '干燥', 'gānzào', 'ganzao', 'khô hanh, ráo', 'adjective', '秋冬季节空气干燥，要多补充水分。', 'Qiūdōng jìjié kōngqì gānzào, yào duō bǔchōng shuǐfèn.', 'Mùa thu đông không khí khô hanh, phải uống nhiều nước.', id, NULL, 'SHARED_干燥_gānzào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_干燥_gānzào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '潮湿', 'cháoshī', 'chaoshi', 'ẩm ướt, nồm ẩm', 'adjective', '回南天室内地板非常潮湿，走路要当心滑倒。', 'Huínántiān shìnèi dìbǎn fēicháng cháoshī, zǒulù yào dāngxīn huádǎo.', 'Những ngày nồm sàn nhà rất ẩm ướt, đi đứng cẩn thận trơn ngã.', id, NULL, 'SHARED_潮湿_cháoshī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_潮湿_cháoshī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '伞', 'sǎn', 'san', 'cái ô, cây dù', 'noun', '包里放一把折叠伞，晴天遮阳雨天挡雨。', 'Bāo lǐ fàng yì bǎ zhédié sǎn, qíngtiān zhēyáng yǔtiān dǎng yǔ.', 'Để chiếc ô gấp trong túi xách, nắng che mưa chắn.', id, NULL, 'SHARED_伞_sǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_伞_sǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '雨衣', 'yǔyī', 'yuyi', 'áo mưa', 'noun', '下大雨骑自行车最好穿一件轻便的雨衣。', 'Xià dàyǔ qí zìxíngchē zuì hǎo chuān yí jiàn qīngbiàn de yǔyī.', 'Trời mưa to đạp xe tốt nhất nên mặc áo mưa gọn nhẹ.', id, NULL, 'SHARED_雨衣_yǔyī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_雨衣_yǔyī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '太阳', 'tàiyáng', 'taiyang', 'mặt trời', 'noun', '清晨一轮红红的太阳从东方冉冉升起。', 'Qīngchén yì lún hónghóng de tàiyáng cóng dōngfāng rǎnrǎn shēngqǐ.', 'Sáng sớm vầng mặt trời đỏ rực từ từ mọc lên ở hướng đông.', id, NULL, 'SHARED_太阳_tàiyáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_太阳_tàiyáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '月亮', 'yuèliang', 'yueliang', 'mặt trăng', 'noun', '八月十五中秋节的月亮又圆又大又亮。', 'Bā yuè shíwǔ zhōngqiūjié de yuèliang yòu yuán yòu dà yòu liàng.', 'Mặt trăng rằm tháng Tám vừa tròn, vừa to lại vừa sáng tỏ.', id, NULL, 'SHARED_月亮_yuèliang'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_月亮_yuèliang';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '星星', 'xīngxing', 'xingxing', 'ngôi sao trên trời', 'noun', '晴朗宁静的夏夜，满天的星星眨着眼睛。', 'Qínglǎng níngjìng de xiàyè, mǎntiān de xīngxing zhǎ zhe yǎnjing.', 'Đêm hè thanh bình đầy sao lấp lánh như đang chớp mắt.', id, NULL, 'SHARED_星星_xīngxing'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_星星_xīngxing';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '云', 'yún', 'yun', 'đám mây', 'noun', '天空中飘着几朵洁白如棉花的白云。', 'Tiānkōng zhōng piāo zhe jǐ duǒ jiébái rú miánhua de bái yún.', 'Trên bầu trời lững lờ trôi mấy đám mây trắng tinh như kẹo bông.', id, NULL, 'SHARED_云_yún'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_云_yún';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '结冰', 'jiébīng', 'jiebing', 'đóng băng', 'verb', '冬天湖面结了厚厚一层冰，大家在上面滑冰。', 'Dōngtiān húmiàn jié le hòuhòu yì céng bīng, dàjiā zài shàngmiàn huábīng.', 'Mùa đông mặt hồ đóng lớp băng dày, mọi người cùng trượt băng trên đó.', id, NULL, 'SHARED_结冰_jiébīng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_结冰_jiébīng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '融化', 'rónghuà', 'ronghua', 'tan chảy, tan băng', 'verb', '春天到了，山顶上的积雪开始慢慢融化了。', 'Chūntiān dào le, shāndǐng shang de jīxuě kāishǐ mànmàn rónghuà le.', 'Mùa xuân đến rồi, tuyết đọng trên đỉnh núi dần dần tan chảy.', id, NULL, 'SHARED_融化_rónghuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_融化_rónghuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '适应', 'shìyìng', 'shiying', 'thích nghi, làm quen', 'verb', '来到一个新地方生活需要一段时间去适应当地气候。', 'Lái dào yí gè xīn dìfang shēnghuó xūyào yí duàn shíjiān qù shìyìng dāngdì qìhòu.', 'Đến một nơi mới cần một khoảng thời gian để thích nghi với khí hậu.', id, NULL, 'SHARED_适应_shìyìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_适应_shìyìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '空气', 'kōngqì', 'kongqi', 'không khí', 'noun', '大雨过后，山林里的空气格外清新宜人。', 'Dàyǔ guòhòu, shānlín lǐ de kōngqì géwài qīngxīn yírén.', 'Sau cơn mưa lớn, không khí trong rừng núi thanh tân dễ chịu khác thường.', id, NULL, 'SHARED_空气_kōngqì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_空气_kōngqì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '优良', 'yōuliáng', 'youliang', 'tuyệt hảo, chất lượng tốt', 'adjective', '今天全天空气质量等级为优良。', 'Jīntiān quántiān kōngqì zhìliàng děngjí wéi yōuliáng.', 'Hôm nay chỉ số chất lượng không khí đạt mức rất tốt.', id, NULL, 'SHARED_优良_yōuliáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_优良_yōuliáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蓝天', 'lántiān', 'lantian', 'bầu trời xanh', 'noun', '微风吹拂，蓝天白云让人心情愉悦。', 'Wēifēng chuīfú, lántiān báiyún ràng rén xīnqíng yúyuè.', 'Gió nhẹ mơn man, trời xanh mây trắng khiến lòng người ngập tràn niềm vui.', id, NULL, 'SHARED_蓝天_lántiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_蓝天_lántiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阵雨', 'zhènyǔ', 'zhenyu', 'mưa rào', 'noun', '午后突如其来的一场阵雨洗净了街道尘土。', 'Wǔhòu tūrúqílái de yì chǎng zhènyǔ xǐ jìng le jiēdào chéntǔ.', 'Cơn mưa rào bất chợt lúc xế chiều rửa sạch bụi bặm đường phố.', id, NULL, 'SHARED_阵雨_zhènyǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_阵雨_zhènyǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '微风', 'wēifēng', 'weifeng', 'ngọn gió thoảng, gió nhẹ', 'noun', '湖边吹来阵阵柔和舒适的微风。', 'Húbiān chuī lái zhènzhèn róuhé shūshì de wēifēng.', 'Bờ hồ thổi đến từng làn gió hiu hiu dễ chịu.', id, NULL, 'SHARED_微风_wēifēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 11
  AND v.owner_key = 'SHARED_微风_wēifēng';

-- --- BAI 12 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游览', 'yóulǎn', 'youlan', 'du ngoạn, ngắm cảnh', 'verb', '乘船游览漓江，两岸秀丽的山水宛如画卷。', 'Chéng chuán yóulǎn Líjiāng, liǎng''àn xiùlì de shānshuǐ wǎnrú huàjuàn.', 'Đi thuyền ngắm cảnh sông Ly, non nước hai bờ đẹp như tranh họa.', id, NULL, 'SHARED_游览_yóulǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_游览_yóulǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '名胜', 'míngshèng', 'mingsheng', 'danh lam, cảnh đẹp nổi tiếng', 'noun', '北京拥有众多享誉海内外的名胜古迹。', 'Běijīng yōngyǒu zhòngduō xiǎngyù hǎinèiwài de míngshèng gǔjì.', 'Bắc Kinh sở hữu nhiều danh lam thắng cảnh nức tiếng gần xa.', id, NULL, 'SHARED_名胜_míngshèng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_名胜_míngshèng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '古迹', 'gǔjì', 'guji', 'di tích cổ', 'noun', '我们要自觉珍惜并用心保护身边的历史古迹。', 'Wǒmen yào zìjué zhēnxī bìng yòngxīn bǎohù shēnbiān de lìshǐ gǔjì.', 'Chúng ta cần tự giác trân trọng và bảo tồn các di tích lịch sử.', id, NULL, 'SHARED_古迹_gǔjì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_古迹_gǔjì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '博物馆', 'bówùguǎn', 'bowuguan', 'bảo tàng', 'noun', '周末带孩子们去自然博物馆开阔眼界。', 'Zhōumò dài háizimen qù zìrán bówùguǎn kāikuò yǎnjiè.', 'Cuối tuần dắt con trẻ đến bảo tàng tự nhiên để mở mang tầm mắt.', id, NULL, 'SHARED_博物馆_bówùguǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_博物馆_bówùguǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '历史', 'lìshǐ', 'lishi', 'lịch sử', 'noun', '学习历史能够让我们更好地明辨现在与未来。', 'Xuéxí lìshǐ nénggòu ràng wǒmen gèng hǎo de míngbiàn xiànzài yǔ wèilái.', 'Học lịch sử giúp chúng ta nhìn nhận rõ hơn hiện tại và tương lai.', id, NULL, 'SHARED_历史_lìshǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_历史_lìshǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '文化', 'wénhuà', 'wenhua', 'văn hóa', 'noun', '中华传统文化源远流长，博大精深。', 'Zhōnghuá chuántǒng wénhuà yuányuǎanliúcháng, bódàjīngshēn.', 'Văn hóa truyền thống Trung Hoa lâu đời và sâu sắc vô cùng.', id, NULL, 'SHARED_文化_wénhuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_文化_wénhuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '传统', 'chuántǒng', 'chuantong', 'truyền thống', 'noun', '穿汉服已经成为当代青年展示传统文化的新风尚。', 'Chuān hànfú yǐjīng chéngwéi dāngdài qīngnián zhǎnshì chuántǒng wénhuà de xīn fēngshàng.', 'Mặc Hán phục đã thành nét đẹp mới của giới trẻ để tôn vinh truyền thống.', id, NULL, 'SHARED_传统_chuántǒng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_传统_chuántǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '导游', 'dǎoyóu', 'daoyou', 'hướng dẫn viên du lịch', 'noun', '导游生动风趣的讲解让大家听得十分入迷。', 'Dǎoyóu shēngdòng fēngqù de jiǎngjiě ràng dàjiā tīng de shífēn rùmí.', 'Lời thuyết minh sinh động dí dỏm của hướng dẫn viên lôi cuốn mọi người.', id, NULL, 'SHARED_导游_dǎoyóu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_导游_dǎoyóu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游客', 'yóukè', 'youke', 'du khách, khách tham quan', 'noun', '假期景区迎来了成千上万慕名而来的海内外游客。', 'Jiàqī jǐngqū yínglái le chéngqiānshàngwàn mùmíng''érlái de hǎinèiwài yóukè.', 'Kỳ nghỉ danh thắng đón hàng vạn du khách muôn phương đổ về.', id, NULL, 'SHARED_游客_yóukè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_游客_yóukè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '介绍', 'jièshào', 'jieshao', 'giới thiệu', 'verb', '让我来向大家详细介绍一下这座展厅的镇馆之宝。', 'Ràng wǒ lái xiàng dàjiā xiángxì jièshào yíxià zhè zuò zhǎntīng de zhènguǎnzhībǎo.', 'Hãy để tôi giới thiệu chi tiết báu vật trấn quán của phòng triển lãm.', id, NULL, 'SHARED_介绍_jièshào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_介绍_jièshào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '讲解', 'jiǎngjiě', 'jiangjie', 'thuyết minh, giảng giải', 'verb', '志愿者正在为外国友人做细致入微的文物讲解。', 'Zhìyuànzhě zhèngzài wèi wàiguó yǒurén zuò xìzhìrùwēi de wénwù jiǎngjiě.', 'Tình nguyện viên đang thuyết minh hiện vật tỉ mỉ cho khách ngoại quốc.', id, NULL, 'SHARED_讲解_jiǎngjiě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_讲解_jiǎngjiě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '展览', 'zhǎnlǎn', 'zhanlan', 'triển lãm, trưng bày', 'noun', '美术馆本月举办现代雕塑与书法艺术展览。', 'Měishùguǎn běn yuè jǔbàn xiàndài diāosù yǔ shūfǎ yìshù zhǎnlǎn.', 'Bảo tàng mỹ thuật tháng này tổ chức triển lãm nghệ thuật điêu khắc và thư pháp.', id, NULL, 'SHARED_展览_zhǎnlǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_展览_zhǎnlǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '展品', 'zhǎnpǐn', 'zhanpin', 'vật phẩm trưng bày, hiện vật', 'noun', '参观时请文明观赏，切勿用手触摸珍贵展品。', 'Cānguān shí qǐng wénmíng guānshǎng, qièwù yòng shǒu chùmō zhēnguì zhǎnpǐn.', 'Khi tham quan xin thưởng thức văn minh, tuyệt đối không chạm tay vào hiện vật.', id, NULL, 'SHARED_展品_zhǎnpǐn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_展品_zhǎnpǐn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '艺术', 'yìshù', 'yishu', 'nghệ thuật', 'noun', '民间剪纸是一门深受群众喜爱的传统民间艺术。', 'Mínjiān jiǎnzhǐ shì yì mén shēnshòu qúnzhòng xǐ''ài de chuántǒng mínjiān yìshù.', 'Cắt giấy dân gian là môn nghệ thuật truyền thống được đông đảo quần chúng mến mộ.', id, NULL, 'SHARED_艺术_yìshù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_艺术_yìshù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '画展', 'huàzhǎn', 'huazhan', 'triển lãm tranh vẽ', 'noun', '画展上展出了许多青年画家色彩明快的优秀新作。', 'Huàzhǎn shang zhǎnchū le xǔduō qīngnián huàjiā sècǎi míngkuài de yōuxiù xīnzuò.', 'Buổi triển lãm tranh giới thiệu nhiều tác phẩm rực rỡ của các họa sĩ trẻ.', id, NULL, 'SHARED_画展_huàzhǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_画展_huàzhǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '雕塑', 'diāosù', 'diaosu', 'tượng điêu khắc', 'noun', '广场中央伫立着一座气势雄伟的历史英雄雕塑。', 'Guǎngchǎng zhōngyāng zhùlì zhe yí zuò qìshì xióngwěi de lìshǐ yīngxióng diāosù.', 'Giữa quảng trường sừng sững bức tượng điêu khắc anh hùng lịch sử uy nghi.', id, NULL, 'SHARED_雕塑_diāosù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_雕塑_diāosù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开放时间', 'kāifàng shíjiān', 'kaifangshijian', 'thời gian mở cửa đón khách', 'noun', '博物馆的对外开放时间为每天早九点至晚五点。', 'Bówùguǎn de duìwài kāifàng shíjiān wéi měi tiān zǎo jiǔ diǎn zhì wǎn wǔ diǎn.', 'Giờ mở cửa đón khách của viện bảo tàng là từ 9h sáng đến 5h chiều.', id, NULL, 'SHARED_开放时间_kāifàng shíjiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_开放时间_kāifàng shíjiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '闭馆', 'bìguǎn', 'biguan', 'đóng cửa (bảo tàng/thư viện)', 'verb', '每周一由于进行日常维护，展馆全天闭馆。', 'Měi zhōuyī yóuyú jìnxíng rìcháng wéihù, zhǎnguǎn quántiān bìguǎn.', 'Thứ Hai hàng tuần do bảo dưỡng định kỳ nên bảo tàng đóng cửa cả ngày.', id, NULL, 'SHARED_闭馆_bìguǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_闭馆_bìguǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '禁止', 'jìnzhǐ', 'jinzhi', 'nghiêm cấm', 'verb', '展厅内严禁吸烟和使用大功率闪光灯拍照。', 'Zhǎntīng nèi yánjìn xīyān hé shǐyòng dà gōnglǜ shǎnguāngdēng pāizhào.', 'Trong phòng triển lãm nghiêm cấm hút thuốc và bật đèn flash công suất lớn.', id, NULL, 'SHARED_禁止_jìnzhǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_禁止_jìnzhǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '规定', 'guīdìng', 'guiding', 'quy định, nội quy', 'noun', '入馆前请自觉了解并严格遵守各项参观规定。', 'Rù guǎn qián qǐng zìjué liǎojiě bìng yángé zūnshǒu gè xiàng cānguān guīdìng.', 'Trước khi vào tham quan xin hãy đọc kỹ và tuân thủ các quy định.', id, NULL, 'SHARED_规定_guīdìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_规定_guīdìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '著名', 'zhùmíng', 'zhuming', 'nổi tiếng, lừng danh', 'adjective', '万里长城是举世著名的伟大古代防御工程。', 'Wànlǐ chángchéng shì jǔshì zhùmíng de wěidà gǔdài fángyù gōngchéng.', 'Vạn Lý Trường Thành là công trình phòng ngự thời cổ đại lừng danh thế giới.', id, NULL, 'SHARED_著名_zhùmíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_著名_zhùmíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '古老', 'gǔlǎo', 'gulao', 'cổ xưa, cổ kính', 'adjective', '漫步在青石板铺就的古老小巷中，倍感宁静。', 'Mànbù zài qīngshíbǎn pū jiù de gǔlǎo xiǎoxiàng zhōng, bèigǎn níngjìng.', 'Rảo bước trên ngõ hẻm cổ kính lát đá xanh, cảm thấy tĩnh lặng vô cùng.', id, NULL, 'SHARED_古老_gǔlǎo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_古老_gǔlǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '现代', 'xiàndài', 'xiandai', 'hiện đại', 'adjective', '这座城市既有古老深厚的文脉，又具现代都会气息。', 'Zhè zuò chéngshì jì yǒu gǔlǎo shēnhòu de wénmài, yòu jù xiàndài dūhuì qìxī.', 'Thành phố này vừa có bề dày cổ kính, lại mang hơi thở đô thị hiện đại.', id, NULL, 'SHARED_现代_xiàndài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_现代_xiàndài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '建筑', 'jiànzhù', 'jianzhu', 'công trình kiến trúc', 'noun', '故宫宏伟壮丽的古代宫殿建筑令人叹为观止。', 'Gùgōng hóngwěi zhuànglì de gǔdài gōngdiàn jiànzhù lìngrén tànwéiguānzhǐ.', 'Kiến trúc cung điện cổ tráng lệ ở Cố Cung làm lòng người trầm trồ.', id, NULL, 'SHARED_建筑_jiànzhù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_建筑_jiànzhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '故宫', 'gùgōng', 'gugong', 'Cố Cung (Tử Cấm Thành)', 'noun', '故宫珍藏着百万件巧夺天工的中华传世珍宝。', 'Gùgōng zhēncáng zhe bǎiwàn jiàn qiǎoduótiāngōng de Zhōnghuá chuánshì zhēnbǎo.', 'Cố Cung lưu giữ hàng triệu báu vật lưu truyền tinh xảo qua các triều đại.', id, NULL, 'SHARED_故宫_gùgōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_故宫_gùgōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '长城', 'chángchéng', 'changcheng', 'Trường Thành, Vạn Lý Trường Thành', 'noun', '不到长城非好汉，登高远眺群山连绵起伏。', 'Bú dào chángchéng fēi hǎohàn, dēng gāo yuǎntiào qúnshān liánmián qǐfú.', 'Bất đáo Trường Thành phi hảo hán, lên cao phóng tầm mắt non nước điệp trùng.', id, NULL, 'SHARED_长城_chángchéng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_长城_chángchéng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '印象', 'yìnxiàng', 'yinxiang', 'ấn tượng', 'noun', '这里的风土人情给我留下了深刻而美好的印象。', 'Zhèlǐ de fēngtǔ rénqíng gěi wǒ liú xià le shēnkè ér měihǎo de yìnxiàng.', 'Phong thổ tình người nơi đây để lại cho tôi ấn tượng sâu sắc tuyệt vời.', id, NULL, 'SHARED_印象_yìnxiàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_印象_yìnxiàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '难忘', 'nánwàng', 'nanwang', 'khó quên, đáng nhớ', 'adjective', '在云南度过的那段静谧时光真是令人终生难忘。', 'Zài Yúnnán dùguò de nà duàn jìngmì shíguāng zhēn shì lìngrén zhōngshēng nánwàng.', 'Khoảng thời gian thanh bình ở Vân Nam quả thật khiến người ta cả đời khó quên.', id, NULL, 'SHARED_难忘_nánwàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_难忘_nánwàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '了解', 'liǎojiě', 'liaojie', 'tìm hiểu, thấu hiểu', 'verb', '想要学好一门外语，就必须深入了解它的历史文化。', 'Xiǎng yào xué hǎo yì mén wàiyǔ, jiù bìxū shēnrù liǎojiě tā de lìshǐ wénhuà.', 'Muốn học tốt một ngoại ngữ thì bắt buộc phải tìm hiểu sâu văn hóa lịch sử.', id, NULL, 'SHARED_了解_liǎojiě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_了解_liǎojiě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '感受', 'gǎnshòu', 'ganshou', 'cảm nhận, trải nghiệm sâu sắc', 'verb', '亲临现场能让人切身感受到中华文明的博大精深。', 'Qīnlín xiànchǎng néng ràng rén qièshēn gǎnshòu dào Zhōnghuá wénmíng de bódàjīngshēn.', 'Có mặt tận mắt giúp ta cảm nhận sâu sắc sự vĩ đại của nền văn minh.', id, NULL, 'SHARED_感受_gǎnshòu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_感受_gǎnshòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '知识', 'zhīshi', 'zhishi', 'kiến thức, tri thức', 'noun', '参观博物馆能让我们在实践中增长很多历史知识。', 'Cānguān bówùguǎn néng ràng wǒmen zài shíjiàn zhōng zēngzhǎng hěn duō lìshǐ zhīshi.', 'Đi thăm bảo tàng giúp chúng ta bồi dưỡng thêm nhiều kiến thức lịch sử.', id, NULL, 'SHARED_知识_zhīshi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_知识_zhīshi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '丰富', 'fēngfù', 'fengfu', 'phong phú, dồi dào', 'adjective', '展馆内的藏品种类极其丰富，涵盖各个朝代。', 'Zhǎnguǎn nèi de cángpǐn zhǒnglèi jíqí fēngfù, hángài gè gè cháodài.', 'Hiện vật trưng bày trong bảo tàng vô cùng phong phú, trải khắp các triều đại.', id, NULL, 'SHARED_丰富_fēngfù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_丰富_fēngfù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '遗产', 'yíchǎn', 'yichan', 'di sản văn hóa', 'noun', '这项古老的造纸手艺已经被列入了世界非物质文化遗产。', 'Zhè xiàng gǔlǎo de zàozhǐ shǒuyì yǐjīng bèi liè rù le shìjiè fēiwùzhì wénhuà yíchǎn.', 'Nghề làm giấy cổ này đã được ghi danh vào Di sản Văn hóa phi vật thể.', id, NULL, 'SHARED_遗产_yíchǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_遗产_yíchǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '保护', 'bǎohù', 'baohu', 'bảo vệ, gìn giữ', 'verb', '全社会都应当共同行动起来保护珍贵的历史文物。', 'Quán shèhuì dōu yīngdāng gòngtóng xíngdòng qǐlai bǎohù zhēnguì de lìshǐ wénwù.', 'Toàn xã hội đều nên chung tay gìn giữ các hiện vật di tích quý giá.', id, NULL, 'SHARED_保护_bǎohù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_保护_bǎohù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '珍贵', 'zhēnguì', 'zhengui', 'quý báu, vô giá', 'adjective', '这件出土的青铜器具有极高的历史研究与珍贵艺术价值。', 'Zhè jiàn chūtǔ de qīngtóngqì jùyǒu jí gāo de lìshǐ yánjiū yǔ zhēnguì yìshù jiàzhí.', 'Cổ vật đồ đồng này mang giá trị lịch sử và nghệ thuật vô cùng quý báu.', id, NULL, 'SHARED_珍贵_zhēnguì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_珍贵_zhēnguì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '欣赏', 'xīnshǎng', 'xinshang', 'thưởng thức, chiêm ngưỡng', 'verb', '我们静静地伫立在名画前欣赏大师细腻生动的笔触。', 'Wǒmen jìngjìng de zhùlì zài mínghuà qián xīnshǎng dàshī xìnì shēngdòng de bǐchù.', 'Chúng tôi lặng lẽ ngắm nhìn nét cọ tinh tế của bậc thầy trên bức danh họa.', id, NULL, 'SHARED_欣赏_xīnshǎng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_欣赏_xīnshǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '名胜古迹', 'míngshèng gǔjì', 'mingshengguji', 'danh lam thắng cảnh di tích', 'noun', '来到古都西安，一定要游览这里的名胜古迹。', 'Lái dào gǔdū Xī''ān, yídìng yào yóulǎn zhèlǐ de míngshèng gǔjì.', 'Đến với cố đô Tây An, nhất định phải thăm thú danh lam di tích nơi đây.', id, NULL, 'SHARED_名胜古迹_míngshèng gǔjì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_名胜古迹_míngshèng gǔjì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '留念', 'liúniàn', 'liunian', 'làm kỷ niệm, lưu niệm', 'verb', '大家在宏伟的校门前合影留念。', 'Dàjiā zài hóngwěi de xiàomén qián héyǐng liúniàn.', 'Mọi người cùng chụp chung tấm ảnh trước cổng trường để làm kỷ niệm.', id, NULL, 'SHARED_留念_liúniàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_留念_liúniàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '流连忘返', 'liúlián wàngfǎn', 'liulianwangfan', 'say mê quên lối về', 'phrase', '迷人的湖光山色令人心旷神怡，流连忘返。', 'Mírén de húguāng shānsè lìngrén xīnxuàngshényí, liúlián wàngfǎn.', 'Sông núi nước non hữu tình khiến lòng người say đắm quên cả lối về.', id, NULL, 'SHARED_流连忘返_liúlián wàngfǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 12
  AND v.owner_key = 'SHARED_流连忘返_liúlián wàngfǎn';

-- --- BAI 13 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生日', 'shēngrì', 'shengri', 'ngày sinh nhật', 'noun', '祝你生日快乐，心想事成！', 'Zhù nǐ shēngrì kuàilè, xīnxiǎngshìchéng!', 'Chúc bạn sinh nhật vui vẻ, vạn sự như ý nguyện!', id, NULL, 'SHARED_生日_shēngrì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_生日_shēngrì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '聚会', 'jùhuì', 'juhui', 'tụ họp, buổi họp mặt', 'noun', '今晚高中老同学将在市中心举行一场温馨聚会。', 'Jīnwǎn gāozhōng lǎo tóngxué jiāng zài shì zhōngxīn jǔxíng yì chǎng wēnxīn jùhuì.', 'Tối nay các bạn cấp ba sẽ tổ chức một buổi gặp mặt ấm cúng.', id, NULL, 'SHARED_聚会_jùhuì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_聚会_jùhuì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '庆祝', 'qìngzhù', 'qingzhu', 'chúc mừng, kỷ niệm', 'verb', '大家举杯热烈庆祝项目顺利圆满交付。', 'Dàjiā jǔbēi rèliè qìngzhù xiàngmù shùnlì yuánmǎn jiāofù.', 'Mọi người nâng ly nồng nhiệt chúc mừng dự án bàn giao viên mãn.', id, NULL, 'SHARED_庆祝_qìngzhù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_庆祝_qìngzhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '祝贺', 'zhùhè', 'zhuhe', 'chúc mừng', 'verb', '衷心祝贺你在全校演讲比赛中斩获特等奖！', 'Zhōngxīn zhùhè nǐ zài quán xiào yǎnjiǎng bǐsài zhōng zhǎnhuò tèděngjiǎng!', 'Nhiệt liệt chúc mừng bạn giành giải đặc biệt trong cuộc thi hùng biện!', id, NULL, 'SHARED_祝贺_zhùhè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_祝贺_zhùhè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '祝福', 'zhùfú', 'zhufu', 'lời chúc phúc, cầu chúc', 'noun', '收到了来自天南地北好朋友们的真挚祝福。', 'Shōudào le láizì tiānnándìběi hǎopéngyoumen de zhēnzhì zhùfú.', 'Nhận được những lời chúc chân thành từ bạn bè khắp bốn phương.', id, NULL, 'SHARED_祝福_zhùfú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_祝福_zhùfú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '礼物', 'lǐwù', 'liwu', 'món quà, phần quà', 'noun', '这本精装字帖是我专门为你挑选的生日礼物。', 'Zhè běn jīngzhuāng zìtiè shì wǒ zhuānmén wèi nǐ tiāoxuǎn de shēngrì lǐwù.', 'Cuốn tập viết bìa cứng này là món quà sinh nhật tôi chọn riêng cho bạn.', id, NULL, 'SHARED_礼物_lǐwù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_礼物_lǐwù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蛋糕', 'dàngāo', 'dangao', 'bánh gato, bánh kem', 'noun', '插满蜡烛的双层草莓奶油蛋糕看起来十分诱人。', 'Chā mǎn làzhú de shuāng céng cǎoméi nǎiyóu dàngāo kàn qǐlai shífēn yòurén.', 'Chiếc bánh gato dâu tây hai tầng cắm đầy nến trông thật hấp dẫn.', id, NULL, 'SHARED_蛋糕_dàngāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_蛋糕_dàngāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蜡烛', 'làzhú', 'lazhu', 'cây nến', 'noun', '许完美好的心愿后，他一口气吹灭了所有蜡烛。', 'Xǔ wán měihǎo de xīnyuàn hòu, tā yì kǒuqì chuī miè le suǒyǒu làzhú.', 'Sau khi ước xong điều ước, cậu ấy thổi tắt tất cả nến trong một hơi.', id, NULL, 'SHARED_蜡烛_làzhú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_蜡烛_làzhú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '许愿', 'xǔyuàn', 'xuyuan', 'cầu nguyện, ước điều ước', 'verb', '闭上双眼，在心底默默许愿。', 'Bì shàng shuāngyǎn, zài xīndǐ mòmò xǔyuàn.', 'Nhắm hai mắt lại và thầm ước trong lòng.', id, NULL, 'SHARED_许愿_xǔyuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_许愿_xǔyuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '唱生日歌', 'chàng shēngrìgē', 'changshengrige', 'hát bài ca sinh nhật', 'verb', '伴随着温馨欢快的旋律，大家一起拍手唱生日歌。', 'Bànsuí zhe wēnxīn huānkuài de xuánlǜ, dàjiā yìqǐ pāishǒu chàng shēngrìgē.', 'Theo giai điệu ấm áp rộn rã, mọi người vỗ tay hát khúc ca mừng sinh nhật.', id, NULL, 'SHARED_唱生日歌_chàng shēngrìgē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_唱生日歌_chàng shēngrìgē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邀请', 'yāoqǐng', 'yaoqing', 'mời, lời mời', 'verb', '我非常高兴能收到你发来的聚会邀请。', 'Wǒ fēicháng gāoxìng néng shōudào nǐ fā lái de jùhuì yāoqǐng.', 'Tôi rất vui mừng khi nhận được lời mời dự tiệc từ bạn.', id, NULL, 'SHARED_邀请_yāoqǐng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_邀请_yāoqǐng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '客人', 'kèrén', 'keren', 'khách khứa, tân khách', 'noun', '主人站在大门口满面笑容地迎接每一位远道而来的客人。', 'Zhǔrén zhàn zài dàmén kǒu mǎnmiàn xiàoróng de yíngjiē měi yí wèi yuǎndào''érlái de kèrén.', 'Chủ nhà tươi cười đứng đón từng vị khách quý phương xa.', id, NULL, 'SHARED_客人_kèrén'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_客人_kèrén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '主人', 'zhǔrén', 'zhuren', 'chủ nhà, gia chủ', 'noun', '主人热情端上刚沏好的上等龙井茶。', 'Zhǔrén rèqíng duān shàng gāng qī hǎo de shàngděng lóngjǐngchá.', 'Chủ nhà đon đả bưng ra tách trà Long Tỉnh thượng hạng vừa pha.', id, NULL, 'SHARED_主人_zhǔrén'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_主人_zhǔrén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '热情', 'rèqíng', 'reqing', 'nhiệt tình, niềm nở', 'adjective', '当地居民热情好客，让异乡游子倍感亲切温暖。', 'Dāngdì jūmín rèqíng hàokè, ràng yìxiāng yóuzǐ bèigǎn qīnqiè wēnnuǎn.', 'Người dân địa phương hiếu khách làm người xa xứ thấy gần gũi ấm lòng.', id, NULL, 'SHARED_热情_rèqíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_热情_rèqíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '招待', 'zhāodài', 'zhaodai', 'chiêu đãi, tiếp đón', 'verb', '感谢您今晚准备的丰盛晚餐与细致周到的招待！', 'Gǎnxiè nín jīnwǎn zhǔnbèi de fēngshèng wǎncān yǔ xìzhì zhōudào de zhāodài!', 'Cảm ơn bữa tối thịnh soạn và sự tiếp đón chu đáo tối nay của bác!', id, NULL, 'SHARED_招待_zhāodài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_招待_zhāodài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '惊喜', 'jīngxǐ', 'jingxi', 'bất ngờ thú vị, ngạc nhiên vui sướng', 'noun', '朋友们悄悄准备的派对给了他一个大大的惊喜。', 'Péngyoumen qiāoqiāo zhǔnbèi de pàiduì gěi le tā yí gè dàdà de jīngxǐ.', 'Bữa tiệc bạn bè âm thầm tổ chức đã mang đến cho anh bất ngờ lớn.', id, NULL, 'SHARED_惊喜_jīngxǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_惊喜_jīngxǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '开心', 'kāixīn', 'kaixin', 'vui vẻ, tươi vui', 'adjective', '大家聚在一起说说笑笑，过得非常开心。', 'Dàjiā jù zài yìqǐ shuōshuōxiàoxiào, guò de fēicháng kāixīn.', 'Mọi người tụ họp cười nói huyên náo, trải qua ngày rất vui.', id, NULL, 'SHARED_开心_kāixīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_开心_kāixīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拥抱', 'yōngbào', 'yongbao', 'ôm ấp, cái ôm', 'verb', '老友重逢，两人激动地紧紧拥抱在一起。', 'Lǎoyǒu chóngféng, liǎng rén jīdòng de jǐnjǐn yōngbào zài yìqǐ.', 'Bạn cũ tương phùng, cả hai xúc động ôm chầm lấy nhau.', id, NULL, 'SHARED_拥抱_yōngbào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_拥抱_yōngbào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '握手', 'wòshǒu', 'woshou', 'bắt tay chào hỏi', 'verb', '初次见面，大家礼貌地握手问好。', 'Chūcì jiànmiàn, dàjiā lǐmào de wòshǒu wènhǎo.', 'Lần đầu gặp mặt, mọi người lịch thiệp bắt tay chào hỏi.', id, NULL, 'SHARED_握手_wòshǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_握手_wòshǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '礼貌', 'lǐmào', 'limao', 'lễ phép, lịch sự', 'noun', '对长辈说话要讲究礼貌与分寸。', 'Duì zhǎngbèi shuōhuà yào jiǎngjiu lǐmào yǔ fēncun.', 'Nói chuyện với bậc tiền bối cần giữ sự lễ phép và chừng mực.', id, NULL, 'SHARED_礼貌_lǐmào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_礼貌_lǐmào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '聚餐', 'jùcān', 'jucan', 'ăn uống liên hoan cùng nhau', 'verb', '考完试之后，全班同学组织了一次欢乐的聚餐。', 'Kǎo wán shì zhīhòu, quán bān tóngxué zǔzhī le yí cì huānlè de jùcān.', 'Thi xong xuôi, cả lớp rủ nhau liên hoan ăn uống rộn ràng.', id, NULL, 'SHARED_聚餐_jùcān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_聚餐_jùcān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '干杯', 'gānbēi', 'ganbei', 'cạn ly, trăm phần trăm', 'verb', '为了我们的深厚友谊，大家一起干杯！', 'Wèile wǒmen de shēnhòu yǒuyì, dàjiā yìqǐ gānbēi!', 'Vì tình bạn thắm thiết của chúng ta, mọi người cùng cạn ly!', id, NULL, 'SHARED_干杯_gānbēi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_干杯_gānbēi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '唱歌', 'chànggē', 'changge', 'ca hát', 'verb', '吃完晚饭大家兴高采烈地去歌厅唱歌。', 'Chī wán wǎnfàn dàjiā xìnggāocǎiliè de qù gētīng chànggē.', 'Ăn tối xong xuôi mọi người hớn hở rủ nhau đi hát karaoke.', id, NULL, 'SHARED_唱歌_chànggē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_唱歌_chànggē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '跳舞', 'tiàowǔ', 'tiaowu', 'khiêu vũ, nhảy múa', 'verb', '随着欢快的节拍，年轻人在舞池中翩翩起舞。', 'Suízhe huānkuài de jiépāi, niánqīngrén zài wǔchí zhōng piānpiān qǐwǔ.', 'Theo nhịp điệu rộn ràng, giới trẻ hòa mình vào điệu khiêu vũ.', id, NULL, 'SHARED_跳舞_tiàowǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_跳舞_tiàowǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '游戏', 'yóuxì', 'youxi', 'trò chơi', 'noun', '互动游戏让现场的欢乐气氛达到了最高潮。', 'Hùdòng yóuxì ràng xiànchǎng de huānlè qìfēn dádào le zuì gāocháo.', 'Trò chơi tương tác đã đẩy bầu không khí lên đỉnh điểm vui nhộn.', id, NULL, 'SHARED_游戏_yóuxì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_游戏_yóuxì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拍照留念', 'pāizhào liúniàn', 'paizhaoliunian', 'chụp ảnh lưu niệm', 'verb', '聚会结束前，全体成员围在蛋糕旁拍照留念。', 'Jùhuì jiéshù qián, quántǐ chéngyuán wéi zài dàngāo páng pāizhào liúniàn.', 'Trước khi tàn tiệc, toàn bộ thành viên quây bên bánh kem chụp ảnh lưu niệm.', id, NULL, 'SHARED_拍照留念_pāizhào liúniàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_拍照留念_pāizhào liúniàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '告别', 'gàobié', 'gaobie', 'từ biệt, chia tay ra về', 'verb', '天色已晚，大家依依不舍地向主人挥手告别。', 'Tiānsè yǐ wǎn, dàjiā yīyībùshě de xiàng zhǔrén huīshǒu gàobié.', 'Trời đã khuya, mọi người lưu luyến vẫy tay từ biệt gia chủ.', id, NULL, 'SHARED_告别_gàobié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_告别_gàobié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '感谢', 'gǎnxiè', 'ganxie', 'cảm ơn chân thành', 'verb', '非常感谢大家在百忙之中抽空来参加我的生日宴会。', 'Fēicháng gǎnxiè dàjiā zài bǎimáng zhīzhōng chōukòng lái cānjiā wǒ de shēngrì yànhuì.', 'Rất cảm ơn mọi người bận rộn vẫn bớt chút thì giờ đến chung vui.', id, NULL, 'SHARED_感谢_gǎnxiè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_感谢_gǎnxiè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '盛大', 'shèngdà', 'shengda', 'long trọng, hoành tráng', 'adjective', '学校举办了一场隆重盛大的迎新文艺晚会。', 'Xuéxiào jǔbàn le yì chǎng lóngzhòng shèngdà de yíngxīn wényì wǎnhuì.', 'Nhà trường tổ chức đêm hội chào tân sinh viên vô cùng long trọng.', id, NULL, 'SHARED_盛大_shèngdà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_盛大_shèngdà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '气氛', 'qìfēn', 'qifen', 'bầu không khí, không khí buổi lễ', 'noun', '包厢里充满了欢声笑语，气氛十分融洽热烈。', 'Bāoxiāng lǐ chōngmǎn le huānshēngxiàoyǔ, qìfēn shífēn róngqià rèliè.', 'Trong phòng tràn ngập tiếng cười, không khí hòa thuận tưng bừng.', id, NULL, 'SHARED_气氛_qìfēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_气氛_qìfēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '热闹', 'rènao', 'renao', 'nhộn nhịp, náo nhiệt', 'adjective', '节日期间的商业步行街张灯结彩，十分热闹。', 'Jiérì qījiān de shāngyè bùxíngjiē zhāngdēngjiécǎi, shífēn rènao.', 'Phố đi bộ mua sắm dịp lễ giăng đèn kết hoa, náo nhiệt vô cùng.', id, NULL, 'SHARED_热闹_rènao'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_热闹_rènao';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '友好', 'yǒuhǎo', 'youhao', 'thân thiện, hữu hảo', 'adjective', '大家彼此尊重，建立起真诚友好的同伴关系。', 'Dàjiā bǐcǐ zūnzhòng, jiànlì qǐ zhēnchéng yǒuhǎo de tóngbàn guānxi.', 'Mọi người tôn trọng lẫn nhau, xây dựng mối quan hệ bạn hữu chân thành.', id, NULL, 'SHARED_友好_yǒuhǎo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_友好_yǒuhǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '友谊', 'yǒuyì', 'youyi', 'tình bạn bè', 'noun', '愿我们的深厚友谊地久天长，历久弥坚！', 'Yuàn wǒmen de shēnhòu yǒuyì dìjiǔtiāncháng, lìjiǔmíjiān!', 'Nguyện cho tình bạn sắt son của chúng ta mãi trường tồn theo năm tháng!', id, NULL, 'SHARED_友谊_yǒuyì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_友谊_yǒuyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '记忆', 'jìyì', 'jiyi', 'ký ức, kỷ niệm', 'noun', '大学时代那些美好的瞬间永远留存在我的记忆深处。', 'Dàxué shídài nàxiē měihǎo de shùnjiān yǒngyuǎn liúcún zài wǒ de jìyì shēnchù.', 'Những khoảnh khắc đẹp thời sinh viên mãi nằm sâu trong ký ức tôi.', id, NULL, 'SHARED_记忆_jìyì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_记忆_jìyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '愉快', 'yúkuài', 'yukuai', 'vui vẻ, mãn nguyện', 'adjective', '今晚跟大家在一起度过了一段无比愉快的时光。', 'Jīnwǎn gēn dàjiā zài yìqǐ dùguò le yí duàn wúbǐ yúkuài de shíguāng.', 'Tối nay cùng mọi người trải qua một quãng thời gian vô cùng vui sướng.', id, NULL, 'SHARED_愉快_yúkuài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_愉快_yúkuài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '祝酒', 'zhùjiǔ', 'zhujiu', 'nâng ly chúc rượu', 'verb', '大家共同举杯向老寿星祝酒祈福。', 'Dàjiā gòngtóng jǔbēi xiàng lǎo shòuxīng zhùjiǔ qífú.', 'Mọi người cùng nâng ly chúc rượu mừng thọ cụ ông.', id, NULL, 'SHARED_祝酒_zhùjiǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_祝酒_zhùjiǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '心愿', 'xīnyuàn', 'xinyuan', 'nguyện vọng, tâm nguyện', 'noun', '愿你所有的美好心愿都能在这个明媚的新岁如期实现。', 'Yuàn nǐ suǒyǒu de měihǎo xīnyuàn dōu néng zài zhège míngmèi de xīn suì rúqī shíxiàn.', 'Nguyện cho mọi ước vọng đẹp đẽ của bạn đều thành hiện thực.', id, NULL, 'SHARED_心愿_xīnyuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_心愿_xīnyuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '回味', 'huíwèi', 'huiwei', 'dư vị, nhớ lại hồi tưởng', 'verb', '每一次重温昔日旧照，都令人久久回味无穷。', 'Měi yí cì chóngwēn xīrì jiùzhào, dōu lìngrén jiǔjiǔ huíwèi wúqióng.', 'Mỗi lần xem lại ảnh cũ đều gợi lên bao niềm bồi hồi khôn nguôi.', id, NULL, 'SHARED_回味_huíwèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_回味_huíwèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '团圆', 'tuányuán', 'tuanyuan', 'đoàn viên, sum họp một nhà', 'verb', '亲友齐聚一堂，共享阖家团圆的莫大天伦之乐。', 'Qīnyǒu qíjù yì táng, gòngxiǎng héjiā tuányuán de mòdà tiānlún zhī lè.', 'Thân quyến tề tựu, sẻ chia niềm hạnh phúc sum họp gia đình trọn vẹn.', id, NULL, 'SHARED_团圆_tuányuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 13
  AND v.owner_key = 'SHARED_团圆_tuányuán';

-- --- BAI 14 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '穿', 'chuān', 'chuan', 'mặc (quần áo, giày tất)', 'verb', '天气转凉了，多穿一件保暖毛衣吧。', 'Tiānqì zhuǎn liáng le, duō chuān yí jiàn bǎonuǎn máoyī ba.', 'Trời trở lạnh rồi, mặc thêm một chiếc áo len giữ ấm nhé.', id, NULL, 'SHARED_穿_chuān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_穿_chuān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '戴', 'dài', 'dai', 'đeo, đội (mũ, kính, găng tay)', 'verb', '出门记得戴上保暖帽子和防风手套。', 'Chūmén jìde dài shàng bǎonuǎn màozi hé fángfēng shǒutào.', 'Ra ngoài nhớ đội mũ ấm và đeo găng tay chắn gió.', id, NULL, 'SHARED_戴_dài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_戴_dài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '衣服', 'yīfu', 'yifu', 'quần áo, trang phục', 'noun', '这套中式传统风格衣服做工非常考究。', 'Zhè tào zhōngshì chuántǒng fēnggé yīfu zuògōng fēicháng kǎojiu.', 'Bộ trang phục mang phong cách truyền thống này may đo rất tinh xảo.', id, NULL, 'SHARED_衣服_yīfu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_衣服_yīfu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '裤子', 'kùzi', 'kuzi', 'quần', 'noun', '这条深蓝色牛仔裤版型修身又百搭。', 'Zhè tiáo shēnlánsè niúzǎikù bǎnxíng xiūshēn yòu bǎidā.', 'Chiếc quần bò màu xanh thẫm này phom vừa vặn lại dễ phối đồ.', id, NULL, 'SHARED_裤子_kùzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_裤子_kùzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '裙子', 'qúnzi', 'qunzi', 'váy, chân váy', 'noun', '夏天很多年轻女孩子喜欢穿飘逸的碎花裙子。', 'Xiàtiān hěn duō niánqīng nǚháizi xǐhuan chuān piāoyì de suìhuā qúnzi.', 'Mùa hè nhiều cô gái trẻ thích mặc váy hoa nhí thướt tha.', id, NULL, 'SHARED_裙子_qúnzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_裙子_qúnzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '衬衫', 'chènshān', 'chenshan', 'áo sơ mi', 'noun', '正式商务场合应当穿整洁熨帖的白衬衫。', 'Zhèngshì shāngwù chǎnghé yīngdāng chuān zhěngjié yùntiē de bái chènshān.', 'Nơi công sở trang trọng nên mặc áo sơ mi trắng thẳng thớm.', id, NULL, 'SHARED_衬衫_chènshān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_衬衫_chènshān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT 'T恤', 'T-xù', 'txu', 'áo phông, áo thun T-shirt', 'noun', '纯棉白色T恤穿着清爽透气又舒服。', 'Chúnmián báisè T-xù chuān zhe qīngshuǎng tòuqì yòu shūfu.', 'Áo phông trắng chất cotton mặc thoáng mát và dễ chịu.', id, NULL, 'SHARED_T恤_T-xù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_T恤_T-xù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外套', 'wàitào', 'waitao', 'áo khoác ngoài', 'noun', '早晚温差较大，建议随身带一件轻便外套。', 'Zǎowǎn wēnchā jiàodà, jiànyì suíshēn dài yí jiàn qīngbiàn wàitào.', 'Chênh lệch nhiệt độ ngày đêm khá lớn, nên mang theo áo khoác nhẹ.', id, NULL, 'SHARED_外套_wàitào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_外套_wàitào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '大衣', 'dàyī', 'dayi', 'áo măng tô, áo choàng lớn', 'noun', '这件羊毛羊绒混纺大衣保暖性能极佳。', 'Zhè jiàn yángmáo yángróng hùnfǎng dàyī bǎonuǎn xìngnéng jíjiā.', 'Chiếc áo dạ pha len lông cừu này giữ ấm cực tốt.', id, NULL, 'SHARED_大衣_dàyī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_大衣_dàyī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '毛衣', 'máoyī', 'maoyi', 'áo len', 'noun', '身上这件花纹毛衣是外婆一针一线织出来的。', 'Shēnshang zhè jiàn huāwén máoyī shì wàipó yì zhēn yí xiàn zhī chūlai de.', 'Chiếc áo len dệt họa tiết trên người là do bà ngoại tỉ mẩn đan.', id, NULL, 'SHARED_毛衣_máoyī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_毛衣_máoyī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '羽绒服', 'yǔróngfú', 'yurongfu', 'áo khoác lông vũ, áo phao ấm', 'noun', '去北方看冰雕一定要备一件厚实的长款羽绒服。', 'Qù běifāng kàn bīngdiāo yídìng yào bèi yí jiàn hòushi de cháng kuǎn yǔróngfú.', 'Đi miền Bắc ngắm băng đăng nhất định phải có chiếc áo phao lông vũ dài.', id, NULL, 'SHARED_羽绒服_yǔróngfú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_羽绒服_yǔróngfú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鞋子', 'xiézi', 'xiezi', 'giày', 'noun', '挑选鞋子最重要的标准就是穿着舒适跟脚。', 'Tiāoxuǎn xiézi zuì zhòngyào de biāozhǔn jiùshì chuān zhe shūshì gēnjiǎo.', 'Tiêu chí chọn giày quan trọng nhất là đi êm chân và thoải mái.', id, NULL, 'SHARED_鞋子_xiézi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_鞋子_xiézi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '运动鞋', 'yùndòngxié', 'yundongxie', 'giày thể thao', 'noun', '慢跑时穿专业的减震运动鞋能保护脚踝和膝盖。', 'Mànpǎo shí chuān zhuānyè de jiǎnzhèn yùndòngxié néng bǎohù jiǎohuái hé xīgài.', 'Khi chạy chậm đi giày thể thao giảm chấn sẽ bảo vệ cổ chân và đầu gối.', id, NULL, 'SHARED_运动鞋_yùndòngxié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_运动鞋_yùndòngxié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '皮鞋', 'píxié', 'pixie', 'giày da', 'noun', '参加正式隆重的宴会需要穿擦拭干净的黑皮鞋。', 'Cānjiā zhèngshì lóngzhòng de yànhuì xūyào chuān cāshì gānjìng de hēi píxié.', 'Dự tiệc trang trọng cần đi giày da đen đánh bóng sạch sẽ.', id, NULL, 'SHARED_皮鞋_píxié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_皮鞋_píxié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '袜子', 'wàzi', 'wazi', 'tất, vớ', 'noun', '冬天穿厚实保暖的纯羊毛袜子能有效御寒。', 'Dōngtiān chuān hòushi bǎonuǎn de chún yángmáo wàzi néng yǒuxiào yùhán.', 'Mùa đông mang tất len cừu dày giữ ấm chống rét rất tốt.', id, NULL, 'SHARED_袜子_wàzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_袜子_wàzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帽子', 'màozi', 'maozi', 'mũ, nón', 'noun', '夏日海滩漫步，一顶宽檐遮阳草编帽子必不可少。', 'Xiàrì hǎitān mànbù, yì dǐng kuān yán zhēyáng cǎobiān màozi bìbùkěshǎo.', 'Dạo bãi biển ngày hè không thể thiếu chiếc mũ rơm rộng vành che nắng.', id, NULL, 'SHARED_帽子_màozi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_帽子_màozi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '手套', 'shǒutào', 'shoutao', 'găng tay, bao tay', 'noun', '骑电瓶车时戴上防风皮质手套就不会冻手了。', 'Qí diànpíngchē shí dài shàng fángfēng pízhì shǒutào jiù bú huì dòng shǒu le.', 'Đi xe điện đeo găng tay da chắn gió sẽ không bị buốt cóng.', id, NULL, 'SHARED_手套_shǒutào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_手套_shǒutào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '围巾', 'wéijīn', 'weijin', 'khăn quàng cổ', 'noun', '红色羊绒围巾为冬日沉闷的装扮增添了一抹亮色。', 'Hóngsè yángróng wéijīn wèi dōngrì chénmèn de zhuāngbàn zēngtiān le yì mǒ liàngsè.', 'Chiếc khăn len đỏ tạo điểm nhấn rực rỡ cho trang phục ngày đông.', id, NULL, 'SHARED_围巾_wéijīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_围巾_wéijīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '眼镜', 'yǎnjìng', 'yanjing', 'kính mắt', 'noun', '他摘下近视眼镜，揉了揉略显疲惫的双眼。', 'Tā zhāi xià jìnshì yǎnjìng, róu le róu lüè xiǎn píbèi de shuāngyǎn.', 'Anh tháo cặp kính cận, xoa xoa đôi mắt có phần mỏi mệt.', id, NULL, 'SHARED_眼镜_yǎnjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_眼镜_yǎnjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '墨镜', 'mòjìng', 'mojing', 'kính râm, kính râm chống nắng', 'noun', '在阳光强烈的户外，佩戴专业墨镜能阻挡紫外线。', 'Zài yángguāng qiángliè de hùwài, pèidài zhuānyè mòjìng néng zǔdǎng zǐwàixiàn.', 'Ở ngoài trời nắng gắt, đeo kính râm có thể cản tia cực tím.', id, NULL, 'SHARED_墨镜_mòjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_墨镜_mòjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '尺码', 'chǐmǎ', 'chima', 'kích cỡ, size số', 'noun', '请问这款修身衬衫还有没有加大尺码的现货？', 'Qǐngwèn zhè kuǎn xiūshēn chènshān hái yǒuméiyǒu jiàdà chǐmǎ de xiànhuò?', 'Cho hỏi kiểu sơ mi này còn hàng sẵn kích cỡ ngoại cỡ không?', id, NULL, 'SHARED_尺码_chǐmǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_尺码_chǐmǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '肥', 'féi', 'fei', 'rộng thùng thình (quần áo)', 'adjective', '这条裤子裤腿太肥了，我想找一条修身的。', 'Zhè tiáo kùzi kùtuǐ tài féi le, wǒ xiǎng zhǎo yì tiáo xiūshēn de.', 'Ống quần này rộng thùng thình quá, tôi muốn tìm chiếc ôm gọn hơn.', id, NULL, 'SHARED_肥_féi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_肥_féi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '瘦', 'shòu', 'shou', 'chật bó, gầy', 'adjective', '这件外套腰部剪裁有点偏瘦，扣不上扣子。', 'Zhè jiàn wàitào yāobù jiǎncái yǒudiǎn piān shòu, kòu bú shàng kòuzi.', 'Eo chiếc áo khoác này may hơi ôm sát quá, không cài nổi cúc.', id, NULL, 'SHARED_瘦_shòu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_瘦_shòu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '长', 'cháng', 'chang', 'dài', 'adjective', '这件长款风衣长度正好到小腿部位。', 'Zhè jiàn cháng kuǎn fēngyī chángdù zhènghǎo dào xiǎotuǐ bùwèi.', 'Độ dài của chiếc áo choàng này vừa vặn tới ngang bắp chân.', id, NULL, 'SHARED_长_cháng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_长_cháng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '短', 'duǎn', 'duan', 'ngắn', 'adjective', '裙摆有点短，活动起来感觉不太自如。', 'Qúnbǎi yǒudiǎn duǎn, huódòng qǐlai gǎnjué bú tài zìrú.', 'Tà váy hơi ngắn một chút, đi lại vận động thấy chưa thoải mái lắm.', id, NULL, 'SHARED_短_duǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_短_duǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '颜色', 'yánsè', 'yanse', 'màu sắc', 'noun', '暖色调明亮的颜色会让人看起来格外富有精气神。', 'Nuǎnsèdiào míngliàng de yánsè huì ràng rén kàn qǐlai géwài fùyǒu jīngqìshén.', 'Gam màu ấm sáng sẽ khiến diện mạo thêm tươi tắn và rạng ngời.', id, NULL, 'SHARED_颜色_yánsè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_颜色_yánsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '红色', 'hóngsè', 'hongse', 'màu đỏ', 'noun', '在中国传统文化中，红色代表着吉祥如意与红火。', 'Zài Zhōngguó chuántǒng wénhuà zhōng, hóngsè dàibiǎo zhe jíxiáng rúyì yǔ hónghuo.', 'Trong văn hóa truyền thống Trung Hoa, màu đỏ tượng trưng cho may mắn.', id, NULL, 'SHARED_红色_hóngsè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_红色_hóngsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '蓝色', 'lánsè', 'lanse', 'màu xanh da trời, xanh lam', 'noun', '沉稳静谧的深蓝色非常适合商务正式着装。', 'Chénwěn jìngmì de shēnlánsè fēicháng shìhé shāngwù zhèngshì zhuózhuāng.', 'Màu xanh lam sẫm tĩnh lặng rất thích hợp với âu phục công sở.', id, NULL, 'SHARED_蓝色_lánsè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_蓝色_lánsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黑色', 'hēisè', 'heise', 'màu đen', 'noun', '黑色修身长裤不仅非常显瘦，而且十分耐脏百搭。', 'Hēisè xiūshēn chángkù bùjǐn fēicháng xiǎn shòu, érqiě shífēn nàizāng bǎidā.', 'Quần tây đen vừa tạo cảm giác thon thả lại vừa sạch sẽ dễ mặc.', id, NULL, 'SHARED_黑色_hēisè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_黑色_hēisè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '白色', 'báisè', 'baise', 'màu trắng', 'noun', '纯洁无瑕的白色衬衫永远是经典永不过时的时尚单品。', 'Chúnjié wúxiá de báisè chènshān yǒngyuǎn shì jīngdiǎn yǒng bú guòshí de shíshàng dānpǐn.', 'Sơ mi trắng thanh lịch mãi là món đồ kinh điển không bao giờ lỗi mốt.', id, NULL, 'SHARED_白色_báisè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_白色_báisè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '黄色', 'huángsè', 'huangse', 'màu vàng', 'noun', '鲜艳醒目的黄色在阳光照耀下显得分外亮丽夺目。', 'Xiānyàn xǐngmù de huángsè zài yángguāng zhàoyào xià xiǎnde fènwài liànglì duómù.', 'Màu vàng tươi tắn dưới ánh nắng trông rực rỡ và bắt mắt khác thường.', id, NULL, 'SHARED_黄色_huángsè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_黄色_huángsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '绿色', 'lǜsè', 'lvse', 'màu xanh lá cây', 'noun', '生机盎然的浅绿色让人联想到春风拂面的生机自然。', 'Shēngjī''àngrán de qiǎnlǜsè ràng rén liánxiǎng dào chūnfēng fúmiàn de shēngjī zìrán.', 'Màu xanh non mơn mởn gợi liên tưởng tới sức sống thiên nhiên mùa xuân.', id, NULL, 'SHARED_绿色_lǜsè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_绿色_lǜsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '时尚', 'shíshàng', 'shishang', 'thời thượng, sành điệu, thời trang', 'adjective', '她的日常私服穿搭总是走在潮流前沿，既优雅又时尚。', 'Tā de rìcháng sīfú chuāndā zǒngshì zǒu zài cháoliú qiányán, jì yōuyǎ yòu shíshàng.', 'Cách phối đồ đời thường của cô ấy luôn bắt kịp xu hướng, vừa thanh lịch lại vừa thời thượng.', id, NULL, 'SHARED_时尚_shíshàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_时尚_shíshàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '流行', 'liúxíng', 'liuxing', 'thịnh hành, mốt lưu hành', 'adjective', '今年秋冬复古格纹大衣在各大秀场十分流行。', 'Jīnnián qiūdōng fùgǔ géwén dàyī zài gè dà xiùchǎng shífēn liúxíng.', 'Thu đông năm nay áo măng tô kẻ ca-rô cổ điển rất thịnh hành.', id, NULL, 'SHARED_流行_liúxíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_流行_liúxíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '试穿', 'shìchuān', 'shichuan', 'mặc thử đồ', 'verb', '小姐，您可以先进去试穿一下，看看版型和效果。', 'Xiǎojiě, nín kěyǐ xiān jìnqù shìchuān yíxià, kànkan bǎnxíng hé xiàoguǒ.', 'Thưa chị, chị có thể vào trong mặc thử xem phom dáng và hiệu ứng.', id, NULL, 'SHARED_试穿_shìchuān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_试穿_shìchuān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '试衣间', 'shìyījiān', 'shiyijian', 'phòng thử đồ', 'noun', '试衣间位于服装专区最里侧的拐角处。', 'Shìyījiān wèiyú fúzhuāng zhuānqū zuì lǐcè de guǎijiǎo chù.', 'Phòng thử đồ nằm ở góc trong cùng của khu thời trang.', id, NULL, 'SHARED_试衣间_shìyījiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_试衣间_shìyījiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '搭配', 'dāpèi', 'dapei', 'phối hợp, phối đồ', 'verb', '黑色皮质短靴搭配毛呢阔腿裤，视觉比例拉长很多。', 'Hēisè pízhì duǎnxuē dāpèi máoní kuòtuǐkù, shìjué bǐlì lā cháng hěn duō.', 'Bốt da đen phối với quần dạ ống rộng kéo dài tỷ lệ vóc dáng.', id, NULL, 'SHARED_搭配_dāpèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_搭配_dāpèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '合身', 'héshēn', 'heshen', 'vừa vặn với dáng người', 'adjective', '这套量身定做的正装西服穿起来极其合身挺拔。', 'Zhè tào liángshēn dìngzuò de zhèngzhuāng xīfú chuān qǐlai jíqí héshēn tǐngbá.', 'Bộ comple may đo này mặc lên người vừa khít và tôn dáng.', id, NULL, 'SHARED_合身_héshēn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_合身_héshēn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好看', 'hǎokàn', 'haokan', 'đẹp mắt, ưa nhìn', 'adjective', '这顶复古贝雷帽戴在你头上显得特别好看俏皮。', 'Zhè dǐng fùgǔ bèilèimào dài zài nǐ tóu shang xiǎnde tèbié hǎokàn qiàopí.', 'Chiếc mũ nồi cổ điển đội trên đầu bạn trông rất đẹp mắt và tinh nghịch.', id, NULL, 'SHARED_好看_hǎokàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 14
  AND v.owner_key = 'SHARED_好看_hǎokàn';

-- --- BAI 15 (39 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '银行', 'yínháng', 'yinhang', 'ngân hàng', 'noun', '学校正门对面就有一家大型国有商业银行。', 'Xuéxiào zhèngmén duìmiàn jiù yǒu yì jiā dàxíng guóyǒu shāngyè yínháng.', 'Đối diện cổng chính của trường có một ngân hàng thương mại lớn.', id, NULL, 'SHARED_银行_yínháng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_银行_yínháng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邮局', 'yóujú', 'youju', 'bưu điện', 'noun', '在街角的邮局可以邮寄国际明信片与航空特快专递。', 'Zài jiējiǎo de yóujú kěyǐ yóujì guójì míngxìnpiàn yǔ hángkōng tèkuài zhuāndì.', 'Ở bưu điện góc phố có thể gửi bưu thiếp quốc tế và chuyển phát nhanh.', id, NULL, 'SHARED_邮局_yóujú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_邮局_yóujú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '业务', 'yèwù', 'yewu', 'nghiệp vụ, dịch vụ giao dịch', 'noun', '请在智能叫号机上取号办理个人储蓄综合业务。', 'Qǐng zài zhìnéng jiàohàojī shang qǔ hào bànlǐ gèrén chǔxù zōnghé yèwù.', 'Vui lòng lấy số trên máy tự động để làm nghiệp vụ tiết kiệm cá nhân.', id, NULL, 'SHARED_业务_yèwù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_业务_yèwù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '存钱', 'cúnqián', 'cunqian', 'gửi tiền tiết kiệm', 'verb', '工作后的年轻人应当养成每月定期存钱的好习惯。', 'Gōngzuò hòu de niánqīngrén yīngdāng yǎngchéng měi yuè dìngqī cúnqián de hǎo xíguàn.', 'Người trẻ sau khi đi làm nên duy trì thói quen gửi tiết kiệm mỗi tháng.', id, NULL, 'SHARED_存钱_cúnqián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_存钱_cúnqián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '取钱', 'qǔqián', 'quqian', 'rút tiền mặt', 'verb', '去街边自动柜员机凭银行卡和密码取钱十分便捷。', 'Qù jiēbiān zìdòng guìyuánjī píng yínhángkǎ hé mìmǎ qǔqián shífēn biànjié.', 'Đến cây ATM rút tiền bằng thẻ và mật mã rất thuận tiện.', id, NULL, 'SHARED_取钱_qǔqián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_取钱_qǔqián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '转账', 'zhuǎnzhàng', 'zhuanzhang', 'chuyển khoản ngân hàng', 'verb', '利用手机银行App进行跨行转账既快捷又免收手续费。', 'Lìyòng shǒujī yínháng App jìnxíng kuàháng zhuǎnzhàng jì kuàijié yòu miǎn shōu shǒuxùfèi.', 'Chuyển khoản liên ngân hàng qua App vừa nhanh lại miễn phí.', id, NULL, 'SHARED_转账_zhuǎnzhàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_转账_zhuǎnzhàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汇款', 'huìkuǎn', 'huikuan', 'chuyển tiền, gửi kiều hối', 'verb', '海外留学生定期去银行办理跨境汇款支付学费。', 'Hǎiwài liúxuéshēng dìngqī qù yínháng bànlǐ kuàjìng huìkuǎn zhīfù xuéfèi.', 'Du học sinh định kỳ ra ngân hàng chuyển kiều hối đóng học phí.', id, NULL, 'SHARED_汇款_huìkuǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_汇款_huìkuǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '汇率', 'huìlǜ', 'huilv', 'tỷ giá hối đoái', 'noun', '外币兑换的实时汇率会随着全球金融市场波动调整。', 'Wàibì duìhuàn de shíshí huìlǜ huì suízhe quánqiú jīnróng shìchǎng bōdòng tiáozhěng.', 'Tỷ giá quy đổi ngoại tệ biến động theo thị trường tài chính thế giới.', id, NULL, 'SHARED_汇率_huìlǜ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_汇率_huìlǜ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '兑换', 'duìhuàn', 'duihuan', 'quy đổi tiền, đổi ngoại tệ', 'verb', '出国旅游前通常需要在银行兑换适量当地流通货币。', 'Chūguó lǚyóu qián tōngcháng xūyào zài yínháng duìhuàn shìliàng dāngdì liútōng huòbì.', 'Trước khi ra nước ngoài thường phải đổi một lượng ngoại tệ vừa đủ.', id, NULL, 'SHARED_兑换_duìhuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_兑换_duìhuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外币', 'wàibì', 'waibi', 'ngoại tệ', 'noun', '柜台提供美元、欧元以及日元等多种主要外币兑换。', 'Guìtái tígōng měiyuán, ōuyuán yǐjí rìyuán děng duō zhǒng zhǔyào wàibì duìhuàn.', 'Quầy giao dịch cung cấp đổi nhiều đồng ngoại tệ như USD, EUR, JPY.', id, NULL, 'SHARED_外币_wàibì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_外币_wàibì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '银行卡', 'yínhángkǎ', 'yinhangka', 'thẻ ngân hàng, thẻ ATM', 'noun', '请随身妥善保管好您的银行卡与有效身份证件。', 'Qǐng suíshēn tuǒshàn bǎoguǎn hǎo nín de yínhángkǎ yǔ yǒuxiào shēnfèn zhèngjiàn.', 'Xin giữ gìn cẩn thận thẻ ngân hàng và giấy tờ tùy thân.', id, NULL, 'SHARED_银行卡_yínhángkǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_银行卡_yínhángkǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '信用卡', 'xìnyòngkǎ', 'xinyongka', 'thẻ tín dụng', 'noun', '刷信用卡消费后一定要记得在还款日前按时全额还清。', 'Shuā xìnyòngkǎ xiāofèi hòu yídìng yào jìde zài huánkuǎnrì qián ànshí quán''é huánqīng.', 'Sau khi quẹt thẻ tín dụng nhớ thanh toán đủ trước hạn trả.', id, NULL, 'SHARED_信用卡_xìnyòngkǎ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_信用卡_xìnyòngkǎ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '身份证', 'shēnfènzhèng', 'shenfenzheng', 'căn cước công dân, CMND', 'noun', '办理开立银行账户手续必须出示本人的有效身份证。', 'Bànlǐ kāilì yínháng zhànghù shǒuxù bìxū chūshì běnrén de yǒuxiào shēnfènzhèng.', 'Thủ tục mở tài khoản ngân hàng bắt buộc phải xuất trình thẻ căn cước.', id, NULL, 'SHARED_身份证_shēnfènzhèng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_身份证_shēnfènzhèng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '签字', 'qiānzì', 'qianzi', 'ký tên', 'verb', '核对无误后请在业务确认凭单右下角空白处签字。', 'Héduì wúwù hòu qǐng zài yèwù quèrèn píngdān yòuxiàjiǎo kòngbái chù qiānzì.', 'Sau khi kiểm tra không sai sót, xin ký tên vào góc dưới bên phải biên lai.', id, NULL, 'SHARED_签字_qiānzì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_签字_qiānzì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '填写', 'tiánxiě', 'tianxie', 'điền thông tin vào mẫu đơn', 'verb', '请用黑色签字笔清晰工整地填写这份个人开户申请表格。', 'Qǐng yòng hēisè qiānzìbǐ qīngxī gōngzhěng de tiánxiě zhè fèn gèrén kāihù shēnqǐng biǎogé.', 'Xin dùng bút dạ đen điền nắn nót bản đơn xin mở tài khoản này.', id, NULL, 'SHARED_填写_tiánxiě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_填写_tiánxiě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '表格', 'biǎogé', 'biaoge', 'biểu mẫu, tờ khai', 'noun', '请按照上面的具体提示逐项完整填写各项表格内容。', 'Qǐng ànzhào shàngmiàn de jùtǐ tíshì zhú xiàng wánzhěng tiánxiě gè xiàng biǎogé nèiróng.', 'Xin theo hướng dẫn điền đầy đủ từng mục trong tờ khai.', id, NULL, 'SHARED_表格_biǎogé'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_表格_biǎogé';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '柜台', 'guìtái', 'guitai', 'quầy giao dịch', 'noun', '请听到广播叫号后前往四号综合业务柜台办理业务。', 'Qǐng tīngdào guǎngbō jiàohào hòu qiánwǎng sì hào zōnghé yèwù guìtái bànlǐ yèwù.', 'Sau khi nghe loa gọi số xin mời tới quầy giao dịch số 4.', id, NULL, 'SHARED_柜台_guìtái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_柜台_guìtái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '自动取款机', 'zìdòng qǔkuǎnjī', 'zidongqukuanji', 'máy ATM tự động', 'noun', '银行大厅设有二十四小时全天候服务的自动取款机。', 'Yínháng dàtīng shèyǒu èrshísì xiǎoshí quántiānhòu fúwù de zìdòng qǔkuǎnjī.', 'Tại sảnh ngân hàng có cây ATM tự động phục vụ 24/24.', id, NULL, 'SHARED_自动取款机_zìdòng qǔkuǎnjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_自动取款机_zìdòng qǔkuǎnjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '寄信', 'jìxìn', 'jixin', 'gửi thư từ', 'verb', '很久没有亲手给远方的老朋友写信并去邮局寄信了。', 'Hěn jiǔ méiyǒu qīnshǒu gěi yuǎnfāng de lǎo péngyou xiěxìn bìng qù yóujú jìxìn le.', 'Lâu lắm rồi không tự tay viết và ra bưu điện gửi thư cho người bạn phương xa.', id, NULL, 'SHARED_寄信_jìxìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_寄信_jìxìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '信封', 'xìnfēng', 'xinfeng', 'phong bì thư', 'noun', '在牛皮纸信封的左上角认真写好收件人与寄件人地址。', 'Zài niúpízhǐ xìnfēng de zuǒshàngjiǎo rènzhēn xiě hǎo shōujiànrén yǔ jìjiànrén dìzhǐ.', 'Ghi rõ địa chỉ người nhận và người gửi ở góc trên phong bì thư.', id, NULL, 'SHARED_信封_xìnfēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_信封_xìnfēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邮票', 'yóupiào', 'youpiao', 'tem thư', 'noun', '他在信封右上角端端正正地贴上了一枚纪念邮票。', 'Tā zài xìnfēng yòushàngjiǎo duānduānzhèngzhèng de tiē shàng le yì méi jìniàn yóupiào.', 'Cậu ấy dán ngay ngắn chiếc tem kỷ niệm lên góc phải phong bì.', id, NULL, 'SHARED_邮票_yóupiào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_邮票_yóupiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '包裹', 'bāoguǒ', 'baoguo', 'kiện hàng bưu phẩm', 'noun', '母亲从老家寄来了一个装满家乡特产的沉甸甸包裹。', 'Mǔqīn cóng lǎojiā jì lái le yí gè zhuāng mǎn jiāxiāng tèchǎn de chéndiāndiān bāoguǒ.', 'Mẹ gửi từ quê lên một bưu kiện nặng trĩu đầy đặc sản quê hương.', id, NULL, 'SHARED_包裹_bāoguǒ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_包裹_bāoguǒ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '快递', 'kuàidì', 'kuaidi', 'chuyển phát nhanh, hàng ship', 'noun', '现代物流让快递包裹隔天就能送达全国各地客户手中。', 'Xiàndài wùliú ràng kuàidì bāoguǒ gétiān jiù néng sòngdá quánguó gè dì kèhù shǒuzhōng.', 'Logistics hiện đại giúp bưu kiện ship nhanh đến tay khách chỉ sau 1 ngày.', id, NULL, 'SHARED_快递_kuàidì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_快递_kuàidì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '单号', 'dānhào', 'danhao', 'mã vận đơn, số đơn bưu gửi', 'noun', '在快递官网输入快递单号就能实时追踪包裹物流进度。', 'Zài kuàidì guānwǎng shūrù kuàidì dānhào jiù néng shíshí zhuīzōng bāoguǒ wùliú jìndù.', 'Nhập mã vận đơn lên trang web là theo dõi được đường đi của gói hàng.', id, NULL, 'SHARED_单号_dānhào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_单号_dānhào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '称重', 'chēngzhòng', 'chengzhong', 'cân trọng lượng', 'verb', '柜台工作人员先对需要邮寄的大件包裹进行了称重。', 'Guìtái gōngzuò rényuán xiān duì xūyào yóujì de dà jiàn bāoguǒ jìnxíng le chēngzhòng.', 'Nhân viên tại quầy tiến hành cân trọng lượng bưu phẩm cần gửi.', id, NULL, 'SHARED_称重_chēngzhòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_称重_chēngzhòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '运费', 'yùnfèi', 'yunfei', 'cước phí vận chuyển', 'noun', '根据包裹重量和送达目的地的远近来综合计算运费。', 'Gēnjù bāoguǒ zhòngliàng hé sòngdá mùdìdì de yuǎnjìn lái zōnghé jìsuàn yùnfèi.', 'Cước vận chuyển được tính dựa trên cân nặng và khoảng cách quãng đường.', id, NULL, 'SHARED_运费_yùnfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_运费_yùnfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地址', 'dìzhǐ', 'dizhi', 'địa chỉ', 'noun', '请务必仔细核对收件人姓名、联系电话以及详细地址。', 'Qǐng wùbì zǐxì héduì shōujiànrén xìngmíng, liánxì diànhuà yǐjí xiángxì dìzhǐ.', 'Xin kiểm tra kỹ tên, số điện thoại và địa chỉ cụ thể của người nhận.', id, NULL, 'SHARED_地址_dìzhǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_地址_dìzhǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邮编', 'yóubiān', 'youbian', 'mã bưu điện, mã zip bưu chính', 'noun', '填写信封时在方格内工整准确地写上当地六位邮编。', 'Tiánxiě xìnfēng shí zài fānggé nèi gōngzhěng zhǔnquè de xiě shàng dāngdì liù wèi yóubiān.', 'Điền chính xác 6 chữ số mã bưu chính vào ô vuông trên phong bì.', id, NULL, 'SHARED_邮编_yóubiān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_邮编_yóubiān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '收件人', 'shōujiànrén', 'shoujianren', 'người nhận bưu phẩm', 'noun', '快递员打电话通知收件人下楼取件。', 'Kuàidìyuán dǎ diànhuà tōngzhī shōujiànrén xiàlóu qǔ jiàn.', 'Anh shipper gọi điện thoại báo người nhận xuống lầu lấy đồ.', id, NULL, 'SHARED_收件人_shōujiànrén'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_收件人_shōujiànrén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '寄件人', 'jìjiànrén', 'jijianren', 'người gửi bưu phẩm', 'noun', '请在运单左侧寄件人信息栏准确签署您的真实全名。', 'Qǐng zài yùndān zuǒcè jìjiànrén xìnxī lán zhǔnquè qiānshǔ nín de zhēnshí quánmíng.', 'Xin ký tên thật vào cột thông tin người gửi ở bên trái phiếu gửi.', id, NULL, 'SHARED_寄件人_jìjiànrén'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_寄件人_jìjiànrén';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '签收', 'qiānshōu', 'qianshou', 'ký nhận hàng', 'verb', '当面拆封验货无误后在快递面单上满意签收。', 'Dāngmiàn chāifēng yànhuò wúwù hòu zài kuàidì miàndān shang mǎnyì qiānshōu.', 'Bóc hàng kiểm tra tại chỗ không vấn đề rồi ký nhận vào phiếu biên nhận.', id, NULL, 'SHARED_签收_qiānshōu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_签收_qiānshōu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '手续', 'shǒuxù', 'shouxu', 'thủ tục giấy tờ', 'verb', '工作人员热心周到地指导新客户办理各项开户手续。', 'Gōngzuò rényuán rèxīn zhōudào de zhǐdǎo xīn kèhù bànlǐ gè xiàng kāihù shǒuxù.', 'Nhân viên nhiệt tình chỉ dẫn khách hàng mới làm thủ tục mở tài khoản.', id, NULL, 'SHARED_手续_shǒuxù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_手续_shǒuxù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '顺利', 'shùnlì', 'shunli', 'thuận lợi, suôn sẻ', 'adjective', '祝愿你在外地的工作和各项业务办理一切平安顺利。', 'Zhùyuàn nǐ zài wàidì de gōngzuò hé gè xiàng yèwù bànlǐ yíqiè píng''ān shùnlì.', 'Chúc công việc và các thủ tục giấy tờ nơi xa của bạn đều suôn sẻ.', id, NULL, 'SHARED_顺利_shùnlì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_顺利_shùnlì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '证件', 'zhèngjiàn', 'zhengjian', 'giấy tờ chứng nhận, thẻ căn cước', 'noun', '出门办理政务金融业务随身携带齐全必要的证件。', 'Chūmén bànlǐ zhèngwù jīnróng yèwù suíshēn xiédài qíquán bìyào de zhèngjiàn.', 'Ra ngoài làm thủ tục hành chính ngân hàng nhớ mang đủ giấy tờ.', id, NULL, 'SHARED_证件_zhèngjiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_证件_zhèngjiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '零钱', 'língqián', 'lingqian', 'tiền lẻ', 'noun', '钱包里常备几张零钱，乘坐公交车时投币格外便利。', 'Qiánbāo lǐ chángbèi jǐ zhāng língqián, chéngzuò gōngjiāochē shí tóubì géwài biànlì.', 'Trong ví luôn để vài đồng tiền lẻ, đi xe buýt bỏ tiền vào hòm rất tiện.', id, NULL, 'SHARED_零钱_língqián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_零钱_língqián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '钞票', 'chāopiào', 'chaopiao', 'tiền giấy', 'noun', '工作人员在验钞机上清点一叠整齐崭新的钞票。', 'Gōngzuò rényuán zài yànchāojī shang qīngdiǎn yì dié zhěngqí zhǎnxīn de chāopiào.', 'Nhân viên kiểm đếm tập tiền giấy mới cóng trên máy đếm tiền.', id, NULL, 'SHARED_钞票_chāopiào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_钞票_chāopiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '保险', 'bǎoxiǎn', 'baoxian', 'bảo hiểm', 'noun', '给贵重易碎物品购买一份运输保险能有效分担风险。', 'Gěi guìzhòng yìsuì wùpǐn gòumǎi yí fèn yùnshū bǎoxiǎn néng yǒuxiào fēndān fēngxiǎn.', 'Mua bảo hiểm hàng vận chuyển cho đồ dễ vỡ giúp giảm bớt rủi ro.', id, NULL, 'SHARED_保险_bǎoxiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_保险_bǎoxiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '保密', 'bǎomì', 'baomi', 'giữ bí mật, bảo mật', 'verb', '银行依法对所有储户的账户余额及交易隐私严格保密。', 'Yínháng yīfǎ duì suǒyǒu chǔhù de zhànghù yú''é jí jiāoyì yǐnsī yángé bǎomì.', 'Ngân hàng bảo mật nghiêm ngặt số dư và giao dịch của khách theo luật.', id, NULL, 'SHARED_保密_bǎomì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_保密_bǎomì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '安全', 'ānquán', 'anquan', 'an ninh, an toàn', 'adjective', '输入密码时要注意遮挡，确保个人财产安全。', 'Shūrù mìmǎ shí yào zhùyì zhēdǎng, quèbǎo gèrén cáichǎn ānquán.', 'Khi nhập mật khẩu nhớ dùng tay che lại để bảo đảm an toàn tài sản.', id, NULL, 'SHARED_安全_ānquán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 39
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 15
  AND v.owner_key = 'SHARED_安全_ānquán';

-- --- BAI 16 (38 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '亲戚', 'qīnqi', 'qinqi', 'bà con, họ hàng thân thích', 'noun', '每逢新春佳节，家里的亲戚都会欢聚一堂。', 'Měi féng xīnchūn jiājié, jiālǐ de qīnqi dōu huì huānjù yì táng.', 'Mỗi dịp Tết đến xuân về, bà con họ hàng lại quây quần bên nhau.', id, NULL, 'SHARED_亲戚_qīnqi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_亲戚_qīnqi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '爷爷', 'yéye', 'yeye', 'ông nội', 'noun', '爷爷退休之后喜欢在自家小院里摆弄花草盆景。', 'Yéye tuìxiū zhīhòu xǐhuan zài zìjiā xiǎoyuàn lǐ bǎinòng huācǎo pénjǐng.', 'Sau khi nghỉ hưu ông nội thích chăm sóc cây cảnh ở khoảnh sân nhỏ.', id, NULL, 'SHARED_爷爷_yéye'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_爷爷_yéye';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '奶奶', 'nǎinai', 'nainai', 'bà nội', 'noun', '奶奶总是戴着花镜笑眯眯地为全家人织毛衣。', 'Nǎinai zǒngshì dài zhe huājìng xiàomīmī de wèi quán jiā rén zhī máoyī.', 'Bà nội luôn đeo kính lão cười hiền hậu đan áo len cho cả nhà.', id, NULL, 'SHARED_奶奶_nǎinai'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_奶奶_nǎinai';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外公', 'wàigōng', 'waigong', 'ông ngoại', 'noun', '外公年轻的时候曾经是一名受人爱戴的乡村教师。', 'Wàigōng niánqīng de shíhou céngjīng shì yì míng shòurén àidài de xiāngcūn jiàoshī.', 'Thời trẻ ông ngoại từng là một giáo viên làng được mọi người kính trọng.', id, NULL, 'SHARED_外公_wàigōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_外公_wàigōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '外婆', 'wàipó', 'waipo', 'bà ngoại', 'noun', '外婆做的那一手香甜软糯的江南糕点堪称一绝。', 'Wàipó zuò de nà yì shǒu xiāngtián ruǎnnuò de Jiāngnán gāodiǎn kānchēng yìjué.', 'Món bánh ngọt mềm Giang Nam bà ngoại làm ngon nức tiếng.', id, NULL, 'SHARED_外婆_wàipó'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_外婆_wàipó';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '叔叔', 'shūshu', 'shushu', 'chú, bác trai', 'noun', '叔叔出差回来看望我们，带来了许多好吃的特色零食。', 'Shūshu chūchāi huílái kànwàng wǒmen, dàilái le xǔduō hǎochī de tèsè língshí.', 'Chú đi công tác về ghé thăm nhà, mang tới bao nhiêu đồ ăn vặt ngon.', id, NULL, 'SHARED_叔叔_shūshu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_叔叔_shūshu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阿姨', 'āyí', 'ayi', 'dì, cô, bác gái', 'noun', '隔壁住着的李阿姨平日里对待大家特别亲切友善。', 'Gébì zhù zhe de Lǐ āyí píngrì lǐ duìdài dàjiā tèbié qīnqiè yǒushàn.', 'Dì Lý ở nhà bên ngày thường đối xử với mọi người rất niềm nở thân thiện.', id, NULL, 'SHARED_阿姨_āyí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_阿姨_āyí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '舅舅', 'jiùjiu', 'jiujiu', 'cậu (em/anh trai của mẹ)', 'noun', '舅舅在北京一家知名高科技互联网公司担任资深架构师。', 'Jiùjiu zài Běijīng yì jiā zhīmíng gāokējì hùliánwǎng gōngsī dānrèn zīshēn jiàgòushī.', 'Cậu làm kiến trúc sư phần mềm cấp cao tại một công ty công nghệ ở Bắc Kinh.', id, NULL, 'SHARED_舅舅_jiùjiu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_舅舅_jiùjiu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '姑姑', 'gūgu', 'gugu', 'cô (chị/em gái của bố)', 'noun', '姑姑经常利用周末假期开车带小表弟到公园露营。', 'Gūgu jīngcháng lìyòng zhōumò jiàqī kāichē dài xiǎo biǎodì dào gōngyuán lùyíng.', 'Cô hay tranh thủ kỳ nghỉ cuối tuần lái xe đưa em họ đi cắm trại.', id, NULL, 'SHARED_姑姑_gūgu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_姑姑_gūgu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '堂兄', 'tángxiōng', 'tangxiong', 'anh họ (bên nội)', 'noun', '堂兄今年以全校第一名的优异成绩考上了重点大学。', 'Tángxiōng jīnnián yǐ quán xiào dì yī míng de yōuyì chéngjì kǎo shàng le zhòngdiǎn dàxué.', 'Anh họ năm nay đỗ đại học trọng điểm với thủ khoa toàn trường.', id, NULL, 'SHARED_堂兄_tángxiōng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_堂兄_tángxiōng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '表妹', 'biǎomèi', 'biaomei', 'em gái họ', 'noun', '聪明伶俐的表妹在少儿小提琴比赛中荣获一等奖。', 'Cōngmíng línglì de biǎomèi zài shào''ér xiǎotíqín bǐsài zhōng rónghuò yìděngjiǎng.', 'Cô em họ thông minh nhanh nhẹn giành giải nhất cuộc thi vĩ cầm nhí.', id, NULL, 'SHARED_表妹_biǎomèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_表妹_biǎomèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '父母', 'fùmǔ', 'fumu', 'cha mẹ, bố mẹ', 'noun', '为人子女应当经常关心体贴渐渐年迈的父母。', 'Wéirén zǐnǚ yīngdāng jīngcháng guānxīn tǐtiē jiànjiàn niánmài de fùmǔ.', 'Phận làm con nên thường xuyên ân cần chăm sóc bố mẹ khi đã về già.', id, NULL, 'SHARED_父母_fùmǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_父母_fùmǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '儿子', 'érzi', 'erzi', 'con trai', 'noun', '张老师的儿子在大学攻读计算机科学与人工智能专业。', 'Zhāng lǎoshī de érzi zài dàxué gōngdú jìsuànjī kēxué yǔ réngōng zhìnéng zhuānyè.', 'Con trai thầy Trương đang học ngành khoa học máy tính và AI tại trường đại học.', id, NULL, 'SHARED_儿子_érzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_儿子_érzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '女儿', 'nǚ''ér', 'nver', 'con gái', 'noun', '小女儿长得非常可爱，两只大眼睛笑起来像弯弯的月亮。', 'Xiǎo nǚ''ér zhǎng de fēicháng kě''ài, liǎng zhī dà yǎnjing xiào qǐlai xiàng wānwān de yuèliang.', 'Bé gái út rất đáng yêu, đôi mắt to khi cười cong cong như vầng trăng khuyết.', id, NULL, 'SHARED_女儿_nǚ''ér'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_女儿_nǚ''ér';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '孙子', 'sūnzi', 'sunzi', 'cháu nội trai', 'noun', '看着怀里牙牙学语的小孙子，老两口脸上乐开了花。', 'Kàn zhe huái lǐ yáyáxuéyǔ de xiǎo sūnzi, lǎo liǎng kǒu liǎn shang lè kāi le huā.', 'Nhìn cháu nội bi bô tập nói trong lòng, ông bà mừng rỡ khôn xiết.', id, NULL, 'SHARED_孙子_sūnzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_孙子_sūnzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '孙女', 'sūnnü', 'sunnv', 'cháu nội gái', 'noun', '小孙女弹得一手优美动听的钢琴曲，深受老师赞扬。', 'Xiǎo sūnnü tán de yì shǒu yōuměi dòngtīng de gāngqínqǔ, shēnshòu lǎoshī zànyáng.', 'Cháu gái đánh đàn piano rất hay và được thầy cô tấm tắc khen ngợi.', id, NULL, 'SHARED_孙女_sūnnü'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_孙女_sūnnü';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '关爱', 'guān''ài', 'guanai', 'yêu thương, quan tâm chăm sóc', 'verb', '尊老爱幼是每个家庭和全社会都应当传承的美好风尚。', 'Zūnlǎo àiyòu shì měi gè jiātíng hé quán shèhuì dōu yīngdāng chuánchéng de měihǎo fēngshàng.', 'Kính già yêu trẻ là nét đẹp truyền thống mà mỗi gia đình cần tiếp nối.', id, NULL, 'SHARED_关爱_guān''ài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_关爱_guān''ài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '孝顺', 'xiàoshùn', 'xiaoshun', 'hiếu thảo', 'adjective', '他为人踏实沉稳，在邻里间是出了名的孝顺儿子。', 'Tā wéirén tāshi chénwěn, zài línlǐ jiān shì chū le míng de xiàoshùn érzi.', 'Anh sống điềm đạm thật thà, nổi tiếng là người con có hiếu trong xóm.', id, NULL, 'SHARED_孝顺_xiàoshùn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_孝顺_xiàoshùn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '尊重', 'zūnzhòng', 'zunzhong', 'tôn trọng, kính trọng', 'verb', '家庭成员之间相互尊重与理解是幸福生活的重要基石。', 'Jiātíng chéngyuán zhījiān xiānghù zūnzhòng yǔ lǐjiě shì xìngfú shēnghuó de zhòngyào jīshí.', 'Các thành viên trong nhà tôn trọng và thấu hiểu nhau là nền tảng hạnh phúc.', id, NULL, 'SHARED_尊重_zūnzhòng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_尊重_zūnzhòng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '理解', 'lǐjiě', 'lijie', 'thấu hiểu, cảm thông', 'verb', '父母和孩子之间要经常耐心沟通，加深相互理解。', 'Fùmǔ hé háizi zhījiān yào jīngcháng nàixīn gōutōng, jiāshēn xiānghù lǐjiě.', 'Bố mẹ và con cái cần kiên nhẫn trao đổi để thấu hiểu nhau hơn.', id, NULL, 'SHARED_理解_lǐjiě'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_理解_lǐjiě';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '和睦', 'hémù', 'hemu', 'hòa thuận, êm ấm', 'adjective', '一家人互敬互爱，日子过得其乐融融，十分和睦。', 'Yì jiā rén hùjìng hù''ài, rìzi guò de qílèróngróng, shífēn hémù.', 'Cả nhà yêu thương tôn trọng nhau, cuộc sống êm ấm thuận hòa.', id, NULL, 'SHARED_和睦_hémù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_和睦_hémù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '互相', 'hùxiāng', 'huxiang', 'lẫn nhau, cùng nhau', 'adverb', '同住一个屋檐下，邻里之间遇到难处理应互相搭把手。', 'Tóng zhù yí gè wūyán xià, línlǐ zhījiān yù dào nánchu lǐyīng hùxiāng dābǎshǒu.', 'Cùng sống dưới một mái nhà, hàng xóm có việc khó nên giúp đỡ nhau.', id, NULL, 'SHARED_互相_hùxiāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_互相_hùxiāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '帮忙', 'bāngmáng', 'bangmang', 'giúp đỡ một tay', 'verb', '出门旅行期间，热心的对门邻居主动帮忙照顾阳台花草。', 'Chūmén lǚxíng qījiān, rèxīn de duìmén línjū zhǔdòng bāngmáng zhàogù yángtái huācǎo.', 'Khi đi du lịch xa, hàng xóm đối diện nhiệt tình tưới hoa giúp.', id, NULL, 'SHARED_帮忙_bāngmáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_帮忙_bāngmáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拜访', 'bàifǎng', 'baifang', 'đến thăm, ghé thăm', 'verb', '逢年过节，晚辈们都会专程登门拜访德高望重的老前辈。', 'Féngnián guòjié, wǎnbèimen dōu huì zhuānchéng dēngmén bàifǎng dégāowàngzhòng de lǎo qiánbèi.', 'Dịp lễ Tết, con cháu đều đến tận nhà thăm hỏi các bậc tiền bối.', id, NULL, 'SHARED_拜访_bàifǎng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_拜访_bàifǎng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '做客', 'zuòkè', 'zuoke', 'làm khách, tới chơi nhà', 'verb', '周六晚上欢迎大家到我的新家做客，一起品尝特色火锅。', 'Zhōuliù wǎnshang huānyíng dàjiā dào wǒ de xīn jiā zuòkè, yìqǐ pǐncháng tèsè huǒguō.', 'Tối thứ Bảy mời mọi người đến nhà mới tôi chơi ăn lẩu nhé.', id, NULL, 'SHARED_做客_zuòkè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_做客_zuòkè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打招呼', 'dǎ zhāohu', 'dazhaohu', 'chào hỏi, chào đón', 'verb', '清晨在小区楼道相遇，邻居们都会亲切微笑着打招呼。', 'Qīngchén zài xiǎoqū lóudào xiāngyù, línjūmen dōu huì qīnqiè wēixiào de dǎ zhāohu.', 'Sáng sớm gặp nhau ở cầu thang khu dân cư, hàng xóm đều niềm nở chào nhau.', id, NULL, 'SHARED_打招呼_dǎ zhāohu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_打招呼_dǎ zhāohu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '关心', 'guānxīn', 'guanxin', 'quan tâm', 'verb', '哪怕相隔千里，朋友之间真挚的问候与关心也从未间断。', 'Nǎpà xiānggé qiānlǐ, péngyou zhījiān zhēnzhì de wènhòu yǔ guānxīn yě cóngwèi jiànduàn.', 'Dù cách ngàn dặm, sự quan tâm của bạn bè vẫn luôn đong đầy.', id, NULL, 'SHARED_关心_guānxīn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_关心_guānxīn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '温暖', 'wēnnuǎn', 'wennuan', 'ấm áp, sưởi ấm', 'adjective', '在他人生失落孤立的时刻，大家伸出的援手让他感到格外温暖。', 'Zài tā rénshēng shīluò gūlì de shíkè, dàjiā shēn chū de yuánshǒu ràng tā gǎndào géwài wēnnuǎn.', 'Những bàn tay giúp đỡ lúc khó khăn khiến anh thấy ấm áp vô cùng.', id, NULL, 'SHARED_温暖_wēnnuǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_温暖_wēnnuǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '幸福', 'xìngfú', 'xingfu', 'hạnh phúc', 'noun', '家人围坐在一起吃热气腾腾的年夜饭就是世间最大的幸福。', 'Jiārén wéizuò zài yìqǐ chī rèqìténgténg de niányèfàn jiùshì shìjiān zuì dà de xìngfú.', 'Cả nhà quây quần bên mâm cơm tất niên nóng hổi là hạnh phúc lớn nhất trần gian.', id, NULL, 'SHARED_幸福_xìngfú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_幸福_xìngfú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '邻里', 'línlǐ', 'linli', 'xóm giềng, khu dân cư', 'noun', '俗话说远亲不如近邻，和谐的邻里关系让人住得舒心。', 'Súhuà shuō yuǎnqīn bùrú jìnlín, héxié de línlǐ guānxi ràng rén zhù de shūxīn.', 'Bán anh em xa mua láng giềng gần, tình làng nghĩa xóm làm cuộc sống dễ chịu.', id, NULL, 'SHARED_邻里_línlǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_邻里_línlǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '和睦相处', 'hémù xiāngchǔ', 'hemuxiangchu', 'chung sống hòa thuận', 'phrase', '几十年来大家在这座大院里和睦相处，亲如一家人。', 'Jǐshí nián lái dàjiā zài zhè zuò dàyuàn lǐ hémù xiāngchǔ, qīn rú yì jiā rén.', 'Mấy chục năm qua mọi người sống trong khu tập thể này hòa thuận như một gia đình.', id, NULL, 'SHARED_和睦相处_hémù xiāngchǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_和睦相处_hémù xiāngchǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '体谅', 'tǐliàng', 'tiliang', 'thấu hiểu thông cảm', 'verb', '平时多一份宽容体谅，邻里之间就不会产生无谓的摩擦。', 'Píngshí duō yí fèn kuānróng tǐliàng, línlǐ zhījiān jiù bú huì chǎnshēng wúwèi de mócā.', 'Ngày thường thêm một chút cảm thông, hàng xóm sẽ không nảy sinh xích mích.', id, NULL, 'SHARED_体谅_tǐliàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_体谅_tǐliàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '宽容', 'kuānróng', 'kuanrong', 'bao dung, rộng lượng', 'adjective', '做人要有宽容开阔的心胸，善待生活中的每一个人。', 'Zuòrén yào yǒu kuānróng kāikuò de xīnxiōng, shàndài shēnghuó zhōng de měi yí gè rén.', 'Làm người cần có tấm lòng bao dung, đối xử tốt với mọi người xung quanh.', id, NULL, 'SHARED_宽容_kuānróng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_宽容_kuānróng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '照顾', 'zhàogù', 'zhaogu', 'chăm nom săn sóc', 'verb', '邻居王奶奶生病期间，志愿者轮流前去家里悉心照顾。', 'Línjū Wáng nǎinai shēngbìng qījiān, zhìyuànzhě lúnliú qiánqù jiālǐ xīxīn zhàogù.', 'Lúc bà cụ Vương ốm, các tình nguyện viên thay nhau đến tận nhà chăm sóc.', id, NULL, 'SHARED_照顾_zhàogù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_照顾_zhàogù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '挂念', 'guàniàn', 'guanian', 'nhớ mong, bận lòng lo lắng', 'verb', '儿行千里母担忧，母亲在电话里时刻挂念着孩子的起居。', 'Ér xíng qiānlǐ mǔ dānyōu, mǔqīn zài diànhuà lǐ shíkè guàniàn zhe háizi de qǐjū.', 'Con đi ngàn dặm mẹ lo lắng, mẹ qua điện thoại luôn canh cánh chuyện ăn ở của con.', id, NULL, 'SHARED_挂念_guàniàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_挂念_guàniàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '长辈', 'zhǎngbèi', 'zhangbei', 'bậc trưởng bối, người lớn tuổi', 'noun', '在餐桌上要等长辈动筷后晚辈才可以开始用餐。', 'Zài cānzhuō shang yào děng zhǎngbèi dòng kuài hòu wǎnbèi cái kěyǐ kāishǐ yòngcān.', 'Trên bàn ăn cần đợi người lớn tuổi gắp đũa trước con cháu mới được ăn.', id, NULL, 'SHARED_长辈_zhǎngbèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_长辈_zhǎngbèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '晚辈', 'wǎnbèi', 'wanbei', 'hậu bối, con cháu bậc dưới', 'noun', '老爷爷喜欢在树荫下给围拢过来的晚辈们讲述当年的抗战故事。', 'Lǎo yéye xǐhuan zài shùyīn xià gěi wéilǒng guòlai de wǎnbèimen jiǎngshù dāngnián de kàngzhàn gùshì.', 'Ông lão thích ngồi dưới bóng râm kể cho con cháu nghe chuyện đánh giặc ngày xưa.', id, NULL, 'SHARED_晚辈_wǎnbèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_晚辈_wǎnbèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '亲情', 'qīnqíng', 'qinqing', 'tình thân ruột thịt', 'noun', '无论走得多远，血浓于水的深厚亲情始终是心灵最温暖的港湾。', 'Wúlùn zǒu de duō yuǎn, xuè nóng yú shuǐ de shēnhòu qīnqíng shǐzhōng shì xīnlíng zuì wēnnuǎn de gǎngwān.', 'Dù đi bao xa, tình cảm gia đình ruột thịt vẫn là bến đỗ bình yên nhất của tâm hồn.', id, NULL, 'SHARED_亲情_qīnqíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 16
  AND v.owner_key = 'SHARED_亲情_qīnqíng';

-- --- BAI 17 (38 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '旅行', 'lǚxíng', 'lvxing', 'du lịch, chuyến đi', 'noun', '读万卷书不如行万里路，旅行能极大地开阔视野。', 'Dú wàn juǎn shū bùrú xíng wàn lǐ lù, lǚxíng néng jídà de kāikuò shìyě.', 'Đi một ngày đàng học một sàng khôn, đi du lịch giúp mở mang tầm mắt.', id, NULL, 'SHARED_旅行_lǚxíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_旅行_lǚxíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '目的地', 'mùdìdì', 'mudidi', 'điểm đến, nơi đến', 'noun', '经过全家投票商量，我们最终确定了这次云南之旅的目的地。', 'Jīngguò quán jiā tóupiào shāngliang, wǒmen zuìzhōng quèdìng le zhè cì Yúnnán zhī lǚ de mùdìdì.', 'Qua bàn bạc, cả nhà đã chốt được điểm đến cho chuyến đi Vân Nam.', id, NULL, 'SHARED_目的地_mùdìdì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_目的地_mùdìdì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '签证', 'qiānzhèng', 'qianzheng', 'thị thực, visa', 'noun', '去使馆办理签证前请务必按照清单备齐全部所需证明材料。', 'Qù shǐguǎn bànlǐ qiānzhèng qián qǐng wùbì ànzhào qīngdān bèi qí quánbù suǒ xū zhèngmíng cáiliào.', 'Trước khi xin visa nhớ chuẩn bị đủ giấy tờ chứng minh theo danh mục.', id, NULL, 'SHARED_签证_qiānzhèng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_签证_qiānzhèng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '护照', 'hùzhào', 'huzhao', 'hộ chiếu passport', 'noun', '出国旅行在机场出入境查验柜台必须出示本人的有效护照。', 'Chūguó lǚxíng zài jīchǎng chūrùjìng cháyàn guìtái bìxū chūshì běnrén de yǒuxiào hùzhào.', 'Khi xuất cảnh bắt buộc phải xuất trình hộ chiếu còn hạn tại cửa an ninh.', id, NULL, 'SHARED_护照_hùzhào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_护照_hùzhào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '机票', 'jīpiào', 'jipiao', 'vé máy bay', 'noun', '旅游淡季提前在航空公司官方网站抢购往返特价机票非常划算。', 'Lǚyóu dànjì tíqián zài hángkōng gōngsī guānfāng wǎngzhàn qiǎnggòu wǎngfǎn tèjià jīpiào fēicháng huásuàn.', 'Mùa thấp điểm săn vé máy bay khứ hồi trên trang chủ rất hời.', id, NULL, 'SHARED_机票_jīpiào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_机票_jīpiào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '预订', 'yùdìng', 'yuding', 'đặt trước (phòng, vé)', 'verb', '出行高峰期建议至少提前半个月预订好沿途的景区酒店。', 'Chūxíng gāofēngqī jiànyì zhìshǎo tíqián bàn gè yuè yùdìng hǎo yántú de jǐngqū jiǔdiàn.', 'Mùa cao điểm nên đặt trước phòng khách sạn ít nhất nửa tháng.', id, NULL, 'SHARED_预订_yùdìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_预订_yùdìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '酒店', 'jiǔdiàn', 'jiudian', 'khách sạn', 'noun', '这家四星级度假精品酒店坐落在风景如画的半山腰上。', 'Zhè jiā sì xīngjí dùjià jīngpǐn jiǔdiàn zuòluò zài fēngjǐngrúhuà de bànshānyāo shang.', 'Khách sạn 4 sao này tọa lạc ở lưng chừng núi non đẹp như tranh vẽ.', id, NULL, 'SHARED_酒店_jiǔdiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_酒店_jiǔdiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '宾馆', 'bīnguǎn', 'binguan', 'nhà khách, khách sạn nhỏ', 'noun', '车站旁有很多干净经济实惠的快捷商务宾馆可供选择。', 'Chēzhàn páng yǒu hěn duō gānjìng jīngjì shíhuì de kuàijié shāngwù bīnguǎn kě gōng xuǎnzé.', 'Cạnh ga có nhiều nhà nghỉ khách sạn mini sạch sẽ giá phải chăng.', id, NULL, 'SHARED_宾馆_bīnguǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_宾馆_bīnguǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '入住', 'rùzhù', 'ruzhu', 'nhận phòng, check-in', 'verb', '前台出示身份证件后即可快速顺利办理酒店入住手续。', 'Qiántái chūshì shēnfèn zhèngjiàn hòu jíkě kuàisù shùnlì bànlǐ jiǔdiàn rùzhù shǒuxù.', 'Xuất trình CCCD ở lễ tân là có thể làm thủ tục nhận phòng nhanh chóng.', id, NULL, 'SHARED_入住_rùzhù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_入住_rùzhù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '退房', 'tuìfáng', 'tuifang', 'trả phòng, check-out', 'verb', '酒店规定每日中午十二点前需要将房卡交还前台办理退房。', 'Jiǔdiàn guīdìng měi rì zhōngwǔ shí''èr diǎn qián xūyào jiāng fángkǎ jiāohuán qiántái bànlǐ tuìfáng.', 'Quy định khách sạn là trước 12h trưa phải trả thẻ làm thủ tục check-out.', id, NULL, 'SHARED_退房_tuìfáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_退房_tuìfáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '行李', 'xíngli', 'xingli', 'hành lý đồ đạc', 'noun', '乘机前随身携带的行李物品需要通过民航安检仪检查。', 'Chéngjī qián suíshēn xiédài de xíngli wùpǐn xūyào tōngguò mínháng ānjiǎnyí jiǎnchá.', 'Đồ đạc hành lý xách tay phải đi qua máy quét an ninh hàng không.', id, NULL, 'SHARED_行李_xíngli'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_行李_xíngli';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '行李箱', 'xínglixiāng', 'xinglixiang', 'va li hành lý', 'noun', '买一个结实耐磨且万向轮顺滑的大容量万向轮行李箱。', 'Mǎi yí gè jiēshi nàimó qiě wànxiànglún shùnhuá de dà róngliàng wànxiànglún xínglixiāng.', 'Mua một chiếc va li cỡ lớn bền chắc và bánh xe xoay trơn tru.', id, NULL, 'SHARED_行李箱_xínglixiāng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_行李箱_xínglixiāng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '打包', 'dǎbāo', 'dabao', 'đóng gói đồ đạc', 'verb', '出门前把换洗衣物和日常应急常备药品仔细分类打包好。', 'Chūmén qián bǎ huànxǐ yīwù hé rìcháng yīngjí chángbèi yàopǐn zǐxì fēnlèi dǎbāo hǎo.', 'Trước khi xuất phát đóng gói riêng quần áo và thuốc men khẩn cấp.', id, NULL, 'SHARED_打包_dǎbāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_打包_dǎbāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '整理', 'zhěnglǐ', 'zhengli', 'sắp xếp, thu dọn gọn gàng', 'verb', '晚上在宾馆把当天收集的票据和随身小件物品细心整理归类。', 'Wǎnshang zài bīnguǎn bǎ dàngtiān shōují de piàojù hé suíshēn xiǎo jiàn wùpǐn xìxīn zhěnglǐ guīlèi.', 'Buổi tối ở khách sạn thu dọn ngăn nắp hóa đơn vé xe trong ngày.', id, NULL, 'SHARED_整理_zhěnglǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_整理_zhěnglǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '随身物品', 'suíshēn wùpǐn', 'suishenwupin', 'tư trang mang theo bên mình', 'noun', '下车下飞机时请一定要细心清点并带齐好自己的随身物品。', 'Xiàchē xià fēijī shí qǐng yídìng yào xìxīn qīngdiǎn bìng dài qí hǎo zìjǐ de suíshēn wùpǐn.', 'Khi xuống xe xuống máy bay nhớ kiểm tra và mang đủ đồ tư trang.', id, NULL, 'SHARED_随身物品_suíshēn wùpǐn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_随身物品_suíshēn wùpǐn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '登机牌', 'dēngjīpái', 'dengjipai', 'thẻ lên máy bay, boarding pass', 'noun', '持有效证件在自助值机终端上打印航班登机牌并办理行李托运。', 'Chí yǒuxiào zhèngjiàn zài zìzhù zhíjī zhōngduān shang dǎyìn hángbān dēngjīpái bìng bànlǐ xíngli tuōyùn.', 'Cầm giấy tờ in thẻ lên tàu bay tại cây kiosk và gửi hành lý.', id, NULL, 'SHARED_登机牌_dēngjīpái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_登机牌_dēngjīpái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '安检', 'ānjiǎn', 'anjian', 'kiểm tra an ninh', 'noun', '请大家有序排队配合民航工作人员完成人身防爆与随身安检。', 'Qǐng dàjiā yǒuxù páiduì pèihé mínháng gōngzuò rényuán wánchéng rénshēn fángbào yǔ suíshēn ānjiǎn.', 'Mọi người xếp hàng thứ tự phối hợp làm thủ tục soi chiếu an ninh.', id, NULL, 'SHARED_安检_ānjiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_安检_ānjiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '登机口', 'dēngjīkǒu', 'dengjikou', 'cửa khởi hành, cửa lên máy bay', 'noun', '本次航班将在四十五号登机口准时登机，请注意广播提示。', 'Běn cì hángbān jiāng zài sìshíwǔ hào dēngjīkǒu zhǔnshí dēngjī, qǐng zhùyì guǎngbō tíshì.', 'Chuyến bay này sẽ lên tàu tại cửa số 45, xin chú ý nghe loa.', id, NULL, 'SHARED_登机口_dēngjīkǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_登机口_dēngjīkǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '航班', 'hángbān', 'hangban', 'chuyến bay', 'noun', '国际直飞航班飞行大约五个小时即可顺利降落在目的地机场。', 'Guójì zhífēi hángbān fēixíng dàyuē wǔ gè xiǎoshí jíkě shùnlì jiàngluò zài mùdìdì jīchǎng.', 'Chuyến bay thẳng quốc tế bay khoảng 5 tiếng là hạ cánh sân bay.', id, NULL, 'SHARED_航班_hángbān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_航班_hángbān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '起飞', 'qǐfēi', 'qifei', 'cất cánh', 'verb', '随着巨大的引擎轰鸣声，大型客机平稳地从跑道冲向蓝天起飞。', 'Suízhe jùdà de yǐnqíng hōngmíngshēng, dàxíng kèjī píngwěn de cóng pǎodào chōng xiàng lántiān qǐfēi.', 'Theo tiếng gầm rú của động cơ, chiếc máy bay lướt trên đường băng cất cánh.', id, NULL, 'SHARED_起飞_qǐfēi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_起飞_qǐfēi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '降落', 'jiàngluò', 'jiangluo', 'hạ cánh', 'verb', '飞机平稳减速并准时降落在首都国际机场三号航站楼跑道。', 'Fēijī píngwěn jiǎnsù bìng zhǔnshí jiàngluò zài shǒudū guójì jīchǎng sān hào hángzhànlóu pǎodào.', 'Máy bay hạ cánh êm ái đúng giờ xuống đường băng nhà ga số 3.', id, NULL, 'SHARED_降落_jiàngluò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_降落_jiàngluò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '转机', 'zhuǎnjī', 'zhuanji', 'nối chuyến, chuyển tiếp chuyến bay', 'verb', '由于没有直达航线，我们需要在香港国际机场中途转机停留两小时。', 'Yóuyú méiyǒu zhídá hángxiàn, wǒmen xūyào zài Xiānggǎng guójì jīchǎng zhōngtú zhuǎnjī tíngliú liǎng xiǎoshí.', 'Vì không có bay thẳng nên chúng tôi phải quá cảnh ở sân bay Hồng Kông 2 tiếng.', id, NULL, 'SHARED_转机_zhuǎnjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_转机_zhuǎnjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '延误', 'yánwù', 'yanwu', 'hoãn chuyến, chậm trễ do thời tiết', 'verb', '由于突发强对流雷雨恶劣天气，今晚飞往广州的多个航班延误。', 'Yóuyú tūfā qiáng duìliú léiyǔ èliè tiānqì, jīnwǎn fēi wǎng Guǎngzhōu de duō gè hángbān yánwù.', 'Do thời tiết mưa dông xấu nên nhiều chuyến bay đi Quảng Châu bị hoãn.', id, NULL, 'SHARED_延误_yánwù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_延误_yánwù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '取消', 'qǔxiāo', 'quxiao', 'hủy chuyến, bãi bỏ', 'verb', '台风来袭，为了确保旅客人身安全，明日进出港航班已全部取消。', 'Táifēng láixí, wèile quèbǎo lǚkè rénshēn ānquán, míngrì jìnchūgǎng hángbān yǐ quánbù qǔxiāo.', 'Bão đổ bộ, để an toàn cho hành khách mọi chuyến bay ngày mai đều bị hủy.', id, NULL, 'SHARED_取消_qǔxiāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_取消_qǔxiāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地图', 'dìtú', 'ditu', 'bản đồ chỉ đường', 'noun', '出发前下载一份高清离线地图，即使手机没有网络信号也不会迷失。', 'Chūfā qián xiàzài yí fèn gāoqīng líxiàn dìtú, jíshǐ shǒujī méiyǒu wǎngluò xìnhào yě bú huì míshī.', 'Tải trước bản đồ ngoại tuyến, dù điện thoại mất sóng cũng không sợ lạc.', id, NULL, 'SHARED_地图_dìtú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_地图_dìtú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '攻略', 'gōnglüè', 'gonglve', 'cẩm nang, bí kíp du lịch', 'noun', '在社交旅游平台上认真查阅资深驴友精心撰写的自由行自驾攻略。', 'Zài shèjiāo lǚyóu píngtái shang rènzhēn cháyuè zīshēn lǘyǒu jīngxīn zhuànxiě de zìyóuxíng zìjià gōnglüè.', 'Lên mạng xem kỹ cẩm nang du lịch tự túc của các phượt thủ kỳ cựu.', id, NULL, 'SHARED_攻略_gōnglüè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_攻略_gōnglüè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '特产', 'tèchǎn', 'techan', 'đặc sản địa phương', 'noun', '回家的时候给亲朋好友们多捎带两盒具有浓郁民族风味的地方特产。', 'Huíjiā de shíhou gěi qīnpéng hǎoyǒumen duō shāodài liǎng hé jùyǒu nóngyù mínzú fēngwèi de dìfang tèchǎn.', 'Khi về mua cho người thân bạn bè đôi hộp đặc sản mang đậm phong vị quê.', id, NULL, 'SHARED_特产_tèchǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_特产_tèchǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '纪念品', 'jìniànpǐn', 'jinianpin', 'đồ lưu niệm', 'noun', '景区手工艺品特色集市上琳琅满目的精美竹编纪念品让人爱不释手。', 'Jǐngqū shǒugōngyìpǐn tèsè jíshì shang línlángmǎnmù de jīngměi zhúbiān jìniànpǐn ràng rén àibùshìshǒu.', 'Chợ thủ công bày la liệt đồ lưu niệm mây tre đan tinh xảo thích mê.', id, NULL, 'SHARED_纪念品_jìniànpǐn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_纪念品_jìniànpǐn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '体验', 'tǐyàn', 'tiyan', 'trải nghiệm thực tế', 'verb', '亲手体验当地古法印染手工艺制作流程，感受传统文化的魅力。', 'Qīnshǒu tǐyàn dāngdì gǔfǎ yìnrǎn shǒugōngyì zhìzuò liúchéng, gǎnshòu chuántǒng wénhuà de mèilì.', 'Tự tay trải nghiệm nghề nhuộm vải cổ truyền, cảm nhận sức hút văn hóa.', id, NULL, 'SHARED_体验_tǐyàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_体验_tǐyàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '风俗', 'fēngsú', 'fengsu', 'phong tục tập quán', 'noun', '入乡随俗，出门在外应当充分尊重当地各少数民族的历史风俗习惯。', 'Rùxiāngsuísú, chūmén zàiwài yīngdāng chōngfèn zūnzhòng dāngdì gè shàoshùmínzú de lìshǐ fēngsú xíguàn.', 'Nhập gia tùy tục, đi xa nên tôn trọng phong tục của các dân tộc bản xứ.', id, NULL, 'SHARED_风俗_fēngsú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_风俗_fēngsú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '平安', 'píng''ān', 'pingan', 'bình an, yên lành', 'adjective', '祝愿远行在外的游子旅途一帆风顺，平平安安，满载而归！', 'Zhùyuàn yuǎnxíng zàiwài de yóuzǐ lǚtú yìfānfēngshùn, píngpíng''ān''ān, mǎnzǎi''érguī!', 'Chúc chuyến đi của bạn thuận buồm xuôi gió, bình an và gặt hái nhiều điều hay!', id, NULL, 'SHARED_平安_píng''ān'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_平安_píng''ān';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '旅途', 'lǚtú', 'lvtu', 'hành trình, chặng đường du lịch', 'noun', '沿途壮丽辽阔的山川湖泊风光彻底治愈了大家在旅途中的一身疲惫。', 'Yántú zhuànglì liáokuò de shānchuān húpò fēngguāng chèdǐ zhìyù le dàjiā zài lǚtú zhōng de yì shēn píbèi.', 'Cảnh sắc sông núi hùng vĩ đã xua tan mọi mỏi mệt trong chuyến đi.', id, NULL, 'SHARED_旅途_lǚtú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_旅途_lǚtú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '风景名胜', 'fēngjǐng míngshèng', 'fengjingmingsheng', 'thắng cảnh danh tiếng', 'noun', '祖国大好河山处处分布着令人流连忘返的自然与人文风景名胜。', 'Zǔguó dàhǎo héshān chùchù fēnbù zhe lìngrén liúliánwàngfǎn de zìrán yǔ rénwén fēngjǐng míngshèng.', 'Khắp non sông gấm vóc nơi đâu cũng có danh lam thắng cảnh hữu tình.', id, NULL, 'SHARED_风景名胜_fēngjǐng míngshèng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_风景名胜_fēngjǐng míngshèng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '出境', 'chūjìng', 'chujing', 'xuất cảnh', 'verb', '请持有有效护照和签证的旅客前往出境通道候检。', 'Qǐng chíyǒu yǒuxiào hùzhào hé qiānzhèng de lǚkè qiánwǎng chūjìng tōngdào hòujiǎn.', 'Xin mời hành khách có hộ chiếu và visa qua cửa xuất cảnh chờ kiểm tra.', id, NULL, 'SHARED_出境_chūjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_出境_chūjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '入境', 'rùjìng', 'rujing', 'nhập cảnh', 'verb', '外国游客落地后在海关入境柜台填写并提交外国人入境登记卡。', 'Wàiguó yóukè luòdì hòu zài hǎiguān rùjìng guìtái tiánxiě bìng tíjiāo wàiguórén rùjìng dēngjìkǎ.', 'Du khách nước ngoài tới nơi điền phiếu nhập cảnh nộp tại hải quan.', id, NULL, 'SHARED_入境_rùjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_入境_rùjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '登机', 'dēngjī', 'dengji', 'lên máy bay', 'verb', '航班现在开始组织带小孩和老人的旅客优先排队登机。', 'Hángbān xiànzài kāishǐ zǔzhī dài xiǎohái hé lǎorén de lǚkè yōuxiān páiduì dēngjī.', 'Chuyến bay bắt đầu ưu tiên cho hành khách có con nhỏ và người già lên tàu.', id, NULL, 'SHARED_登机_dēngjī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_登机_dēngjī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '托运', 'tuōyùn', 'tuoyun', 'ký gửi hành lý', 'verb', '超过规定尺寸的大件硬壳行李箱必须在前台办理随机托运。', 'Chāoguò guīdìng chǐcùn de dà jiàn yìngké xínglixiāng bìxū zài qiántái bànlǐ suíjī tuōyùn.', 'Va li cỡ to vượt quá kích thước quy định bắt buộc phải ký gửi.', id, NULL, 'SHARED_托运_tuōyùn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_托运_tuōyùn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '直飞', 'zhífēi', 'zhifei', 'bay thẳng, không quá cảnh', 'verb', '新开通的直飞国际洲际航线大大缩短了旅途在路上的漫长时间。', 'Xīn kāitōng de zhífēi guójì zhōujì hángxiàn dàdà suōduǎn le lǚtú zài lùshang de màncháng shíjiān.', 'Đường bay thẳng liên lục địa mới mở đã rút ngắn đáng kể thời gian bay.', id, NULL, 'SHARED_直飞_zhífēi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 38
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 17
  AND v.owner_key = 'SHARED_直飞_zhífēi';

-- --- BAI 18 (37 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '环境', 'huánjìng', 'huanjing', 'môi trường sống', 'noun', '良好的生态环境是最普惠的民生福祉，人人共享。', 'Liánghǎo de shēngtài huánjìng shì zuì pǔhuì de mínshēng fúzhǐ, rénrén gòngxiǎng.', 'Môi trường sinh thái trong lành là phúc lợi tốt nhất cho mọi người.', id, NULL, 'SHARED_环境_huánjìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_环境_huánjìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生态', 'shēngtài', 'shengtai', 'sinh thái học, tự nhiên', 'noun', '保护生物多样性是维持全球生态平衡不可或缺的重要一环。', 'Bǎohù shēngwù duōyàngxìng shì wéichí quánqiú shēngtài pínghéng bùkěhuòquē de zhòngyào yì huán.', 'Bảo tồn đa dạng sinh học là khâu then chốt duy trì cân bằng sinh thái.', id, NULL, 'SHARED_生态_shēngtài'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_生态_shēngtài';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '自然', 'zìrán', 'ziran', 'thiên nhiên, tự nhiên', 'noun', '人与自然应当和谐共生，切莫过度索取破坏生态平衡。', 'Rén yǔ zìrán yīngdāng héxié gòngshēng, qièmò guòdù suǒqǔ pòhuài shēngtài pínghéng.', 'Con người và tự nhiên cần sống hài hòa, chớ nên tàn phá khai thác quá đà.', id, NULL, 'SHARED_自然_zìrán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_自然_zìrán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '污染', 'wūrǎn', 'wuran', 'ô nhiễm', 'noun', '工业废水必须经过科学降解净化处理，杜绝直接排入江河造成污染。', 'Gōngyè fèishuǐ bìxū jīngguò kēxué jiàngjiě jìnghuà chǔlǐ, dùjué zhíjiē páirù jiānghé zàochéng wūrǎn.', 'Nước thải công nghiệp phải qua xử lý lọc sạch, cấm xả thẳng gây ô nhiễm sông.', id, NULL, 'SHARED_污染_wūrǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_污染_wūrǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '垃圾', 'lājī', 'laji', 'rác rưởi', 'noun', '不乱扔垃圾，随手捡起地上的废塑料袋投入分类箱。', 'Bú luàn rēng lājī, suíshǒu jiǎn qǐ dì shang de fèi sùliàodài tóurù fēnlèixiāng.', 'Không xả rác bừa bãi, nhặt bao rác dưới đất bỏ vào thùng phân loại.', id, NULL, 'SHARED_垃圾_lājī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_垃圾_lājī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '垃圾分类', 'lājī fēnlèi', 'lajifenlei', 'phân loại rác thải', 'noun', '从我做起积极践行垃圾分类，助力资源回收与生态循环。', 'Cóng wǒ zuò qǐ jījí jiànxíng lājī fēnlèi, zhùlì zīyuán huíshōu yǔ shēngtài xúnhuán.', 'Bắt đầu từ chính mình phân loại rác, hỗ trợ tái chế tài nguyên tuần hoàn.', id, NULL, 'SHARED_垃圾分类_lājī fēnlèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_垃圾分类_lājī fēnlèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '可回收', 'kěhuíshōu', 'kehuishou', 'có thể tái chế', 'adjective', '废旧报纸、硬纸板、塑料瓶和易拉罐都属于可回收物。', 'Fèijiù bàozhǐ, yìngzhǐbǎn, sùliàopíng hé yìlāguàn dōu shǔyú kěhuíshōuwù.', 'Báo cũ, bìa các tông, chai nhựa và lon nước đều là rác tái chế.', id, NULL, 'SHARED_可回收_kěhuíshōu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_可回收_kěhuíshōu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '塑料', 'sùliào', 'suliao', 'nhựa plastic', 'noun', '外出自带环保布袋，减少一次性塑料制品的使用频率。', 'Wàichū zìdài huánbǎo bùdài, jiǎnshǎo yícìxìng sùliào zhìpǐn de shǐyòng pínlǜ.', 'Ra ngoài tự mang túi vải, giảm thiểu sử dụng đồ nhựa dùng một lần.', id, NULL, 'SHARED_塑料_sùliào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_塑料_sùliào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '节约', 'jiéyuē', 'jieyue', 'tiết kiệm', 'verb', '厉行勤俭节约，杜绝铺张浪费，树立绿色低碳消费新风尚。', 'Lìxíng qínjiǎn jiéyuē, dùjué pūzhāng làngfèi, shùlì lǜsè dītàn xiāofèi xīn fēngshàng.', 'Thực hành tiết kiệm, xóa bỏ lãng phí, xây dựng nếp sống xanh ít carbon.', id, NULL, 'SHARED_节约_jiéyuē'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_节约_jiéyuē';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '浪费', 'làngfèi', 'langfei', 'lãng phí', 'verb', '食堂就餐自觉践行光盘行动，不要随便倒掉剩菜浪费粮食。', 'Shítáng jiùcān zìjué jiànxíng guāngpán xíngdòng, bú yào suíbiàn dào diào shèngcài làngfèi liángshi.', 'Ăn uống ở căng tin tự giác vét sạch đĩa, không đổ thừa lãng phí thức ăn.', id, NULL, 'SHARED_浪费_làngfèi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_浪费_làngfèi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '水资源', 'shuǐ zīyuán', 'shuiziyuan', 'tài nguyên nước', 'noun', '水是生命之源，珍惜并保护水资源就是拯救我们赖以生存的家园。', 'Shuǐ shì shēngmìng zhī yuán, zhēnxī bìng bǎohù shuǐ zīyuán jiùshì zhěngjiù wǒmen làiyǐ shēngcún de jiāyuán.', 'Nước là nguồn sống, giữ gìn nguồn nước là cứu mái nhà sinh tồn của chúng ta.', id, NULL, 'SHARED_水资源_shuǐ zīyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_水资源_shuǐ zīyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '节约用水', 'jiéyuē yòngshuǐ', 'jieyueyongshui', 'tiết kiệm nước', 'verb', '洗完手随手拧紧水龙头，在点滴中养成节约用水的良好习惯。', 'Xǐ wán shǒu suíshǒu nǐngjǐn shuǐlóngtóu, zài diǎndī zhōng yǎngchéng jiéyuē yòngshuǐ de liánghǎo xíguàn.', 'Rửa tay xong khóa vòi nước cẩn thận, rèn thói quen tiết kiệm nước từ việc nhỏ.', id, NULL, 'SHARED_节约用水_jiéyuē yòngshuǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_节约用水_jiéyuē yòngshuǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '节约用电', 'jiéyuē yòngdiàn', 'jieyueyongdian', 'tiết kiệm điện', 'verb', '随手关灯，科学设定空调温控，全员积极投身节约用电行动。', 'Suíshǒu guān dēng, kēxué shèdìng kōngtiáo wēnkòng, quányuán jījí tóushēn jiéyuē yòngdiàn xíngdòng.', 'Tắt điện khi rời đi, chỉnh nhiệt độ điều hòa hợp lý để tiết kiệm điện.', id, NULL, 'SHARED_节约用电_jiéyuē yòngdiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_节约用电_jiéyuē yòngdiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '关灯', 'guān dēng', 'guandeng', 'tắt đèn điện', 'verb', '最后一个离开宽敞明亮的会议室，请一定不要忘记随手关灯。', 'Zuìhòu yí gè líkāi kuānchǎng míngliàng de huìyìshì, qǐng yídìng bú yào wàngjì suíshǒu guān dēng.', 'Người cuối cùng rời phòng họp xin đừng quên tắt đèn.', id, NULL, 'SHARED_关灯_guān dēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_关灯_guān dēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '植树', 'zhíshù', 'zhishu', 'trồng cây gây rừng', 'verb', '每年三月十二日植树节，少先队员们都会去荒坡上亲手植树造林。', 'Měi nián sān yuè shí''èr rì zhíshùjié, shàoxiānduìyuánmen dōu huì qù huāngpō shang qīnshǒu zhíshù zàolín.', 'Ngày Tết trồng cây 12/3 hàng năm thiếu nhi đều lên đồi trồng cây.', id, NULL, 'SHARED_植树_zhíshù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_植树_zhíshù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '绿化', 'lǜhuà', 'lvhua', 'phủ xanh đất trống, trồng cây làm đẹp', 'verb', '小区通过科学规划绿化，草木葱茏，推窗即可尽览满眼绿意。', 'Xiǎoqū tōngguò kēxué guīhuà lǜhuà, cǎomù cōnglóng, tuī chuāng jíkě jǐn lǎn mǎnyǎn lǜyì.', 'Khu dân cư được quy hoạch phủ xanh, cây cối xanh tốt, mở cửa là thấy màu xanh.', id, NULL, 'SHARED_绿化_lǜhuà'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_绿化_lǜhuà';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '森林', 'sēnlín', 'senlin', 'rừng rậm, đại ngàn', 'noun', '茂密的原始热带森林宛如一块巨大的天然绿色氧吧与地球之肺。', 'Màomì de yuánshǐ rèdài sēnlín wǎnrú yí kuài jùdà de tiānrán lǜsè yǎngbā yǔ dìqiú zhī fèi.', 'Rừng nhiệt đới rậm rạp như một lá phổi xanh khổng lồ của trái đất.', id, NULL, 'SHARED_森林_sēnlín'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_森林_sēnlín';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '草地', 'cǎodì', 'caodi', 'bãi cỏ, thảm cỏ', 'noun', '暖阳下，活泼可爱的小朋友们在柔软平整的绿茵草地上奔跑嬉戏。', 'Nuǎnyáng xià, huópō kě''ài de xiǎopéngyoumen zài róuruǎn píngzhěng de lǜyīn cǎodì shang bēnpǎo xīxì.', 'Dưới nắng ấm lũ trẻ vui vẻ nô đùa trên thảm cỏ xanh mướt.', id, NULL, 'SHARED_草地_cǎodì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_草地_cǎodì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '花草', 'huācǎo', 'huacao', 'hoa cỏ cây xanh', 'noun', '爱护公共绿化设施，请自觉做到不随意踩踏和折损花草树木。', 'Àihù gōnggòng lǜhuà shèshī, qǐng zìjué zuòdào bù suíyì cǎità hé zhésǔn huācǎo shùmù.', 'Giữ gìn mảng xanh công cộng, xin đừng giẫm đạp ngắt bẻ hoa cỏ.', id, NULL, 'SHARED_花草_huācǎo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_花草_huācǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '动物', 'dòngwù', 'dongwu', 'động vật muôn loài', 'noun', '动物是人类最亲密的朋友，关爱野生动物就是善待人类自己。', 'Dòngwù shì rénlèi zuì qīnmì de péngyou, guān''ài yěshēng dòngwù jiùshì shàndài rénlèi zìjǐ.', 'Động vật là bạn của con người, yêu thương thú hoang là yêu thương chính mình.', id, NULL, 'SHARED_动物_dòngwù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_动物_dòngwù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '宠物', 'chǒngwù', 'chongwu', 'thú cưng vật nuôi', 'noun', '外出文明遛宠物犬请务必主动系紧牵引绳并随手清理粪便。', 'Wàichū wénmíng liù chǒngwùquǎn qǐng wùbì zhǔdòng jì jǐn qiānyǐnshéng bìng suíshǒu qīnglǐ fènbiàn.', 'Dắt thú cưng đi dạo văn minh nhớ đeo xích và dọn dẹp vệ sinh.', id, NULL, 'SHARED_宠物_chǒngwù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_宠物_chǒngwù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '狗', 'gǒu', 'gou', 'chú chó', 'noun', '小狗在门口摇着尾巴欢天喜地迎接忙碌一天下班回家的小主人。', 'Xiǎogǒu zài ménkǒu yáo zhe wěiba huāntiānxǐdì yíngjiē mánglù yì tiān xiàbān huíjiā de xiǎo zhǔrén.', 'Cún con ở cửa vẫy đuôi mừng rỡ đón cô chủ đi làm về nhà.', id, NULL, 'SHARED_狗_gǒu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_狗_gǒu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '猫', 'māo', 'mao', 'chú mèo', 'noun', '一只温顺可爱的白猫正趴在洒满阳光的窗台上舒舒服服地睡懒觉。', 'Yì zhī wēnshùn kě''ài de bái māo zhèng pā zài sǎ mǎn yángguāng de chuāngtái shang shūshūfufu de shuì lǎnjiào.', 'Chú mèo trắng ngoan ngoãn nằm sưởi nắng ngủ say trên bậu cửa sổ.', id, NULL, 'SHARED_猫_māo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_猫_māo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鸟', 'niǎo', 'niao', 'loài chim', 'noun', '清晨推开阳台窗户，枝头传来阵阵清脆婉转悦耳的鸟叫声。', 'Qīngchén tuīkāi yángtái chuānghu, zhītóu chuánlái zhènzhèn qīngcuì wǎnzhuǎn yuè''ěr de niǎojiàoshēng.', 'Sáng sớm đẩy cửa sổ, đầu cành vọng lại tiếng chim hót líu lo.', id, NULL, 'SHARED_鸟_niǎo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_鸟_niǎo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '鱼', 'yú', 'yu', 'loài cá', 'noun', '清澈见底的溪流中，五彩斑斓的小鱼在卵石间自由自在地穿梭。', 'Qīngchè jiàndǐ de xīliú zhōng, wǔcǎibānlán de xiǎoyú zài luǎnshí jiān zìyóuzìzài de chuānsuō.', 'Dưới dòng suối trong vắt, đàn cá sặc sỡ bơi lượn tung tăng quanh khe đá.', id, NULL, 'SHARED_鱼_yú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_鱼_yú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '熊猫', 'xióngmāo', 'xiongmao', 'gấu trúc lớn', 'noun', '大熊猫憨态可掬的吃竹子模样吸引了来自全世界各地游客的目光。', 'Dàxióngmāo hāntàikějū de chī zhúzi múyàng xīyǐn le láizì quán shìjiè gè dì yóukè de mùguāng.', 'Dáng vẻ gặm trúc ngộ nghĩnh của gấu trúc thu hút ánh nhìn du khách muôn nơi.', id, NULL, 'SHARED_熊猫_xióngmāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_熊猫_xióngmāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '老虎', 'lǎohǔ', 'laohu', 'con hổ, chúa sơn lâm', 'noun', '东北虎是森林食物链顶端的王者，国家一级保护重点动物。', 'Dōngběihǔ shì sēnlín shíwùliàn dǐngduān de wángzhě, guójiā yìjí bǎohù zhòngdiǎn dòngwù.', 'Hổ Đông Bắc là chúa tể muôn loài, động vật bảo tồn cấp 1 quốc gia.', id, NULL, 'SHARED_老虎_lǎohǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_老虎_lǎohǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '狮子', 'shīzi', 'shizi', 'con sư tử', 'noun', '非洲大草原上威风凛凛的狮群在辽阔落日余晖下巡视领地。', 'Fēizhōu dà cǎoyuán shang wēifēnglǐnlǐn de shīqún zài liáokuò luòrì yúhuī xià xúnshì lǐngdì.', 'Bầy sư tử oai vệ rảo bước tuần tra lãnh thổ dưới ánh hoàng hôn châu Phi.', id, NULL, 'SHARED_狮子_shīzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_狮子_shīzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '保护区', 'bǎohùqū', 'baohuqu', 'khu bảo tồn thiên nhiên', 'noun', '设立国家级自然保护区能够为野生珍稀动植物提供安全的庇护所。', 'Shèlì guójiājí zìrán bǎohùqū nénggòu wèi yěshēng zhēnxī dòngzhíwù tígōng ānquán de bìhùsuǒ.', 'Thành lập khu bảo tồn thiên nhiên cung cấp nơi trú ẩn an toàn cho sinh vật quý.', id, NULL, 'SHARED_保护区_bǎohùqū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_保护区_bǎohùqū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '濒危', 'bīnwēi', 'binwei', 'bên bờ tuyệt chủng, nguy cấp', 'adjective', '国际社会齐心协力采取抢救性繁育措施挽救濒危野生特有物种。', 'Guójì shèhuì qíxīnxiélì cǎiqǔ qiǎngjiùxìng fányù cuòshī wǎnjiù bīnwēi yěshēng tèyǒu wùzhǒng.', 'Cộng đồng quốc tế hợp sức nhân giống để cứu các loài hoang dã nguy cấp.', id, NULL, 'SHARED_濒危_bīnwēi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_濒危_bīnwēi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '生命', 'shēngmìng', 'shengming', 'sinh mệnh sự sống', 'noun', '尊重每一个顽强生长的鲜活生命，共同守护我们赖以栖息的蓝色星球。', 'Zūnzhòng měi yí gè wánqiáng shēngzhǎng de xiānhuó shēngmìng, gòngtóng shǒuhù wǒmen làiyǐ qīxī de lánsè xīngqiú.', 'Tôn trọng từng sinh linh bé nhỏ, chung tay gìn giữ hành tinh xanh của chúng ta.', id, NULL, 'SHARED_生命_shēngmìng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_生命_shēngmìng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '和谐', 'héxié', 'hexie', 'hài hòa chan hòa', 'adjective', '构建人与大自然高度和谐相处的美丽生态文明体系。', 'Gòujiàn rén yǔ dàzìrán gāodù héxié xiāngchǔ de měilì shēngtài wénmíng tǐxì.', 'Xây dựng hệ sinh thái văn minh tươi đẹp, con người sống hòa hợp cùng thiên nhiên.', id, NULL, 'SHARED_和谐_héxié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_和谐_héxié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '地球', 'dìqiú', 'diqiu', 'trái đất, quả địa cầu', 'noun', '地球是全人类共同唯一的温馨家园，保护好它是我们神圣的使命。', 'Dìqiú shì quán rénlèi gòngtóng wéiyī de wēnxīn jiāyuán, bǎohù hǎo tā shì wǒmen shénshèng de shǐmìng.', 'Trái đất là ngôi nhà chung duy nhất của nhân loại, bảo vệ nó là sứ mệnh thiêng liêng.', id, NULL, 'SHARED_地球_dìqiú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_地球_dìqiú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '责任', 'zérèn', 'zeren', 'trách nhiệm', 'noun', '保护青山绿水和生态环境是每一位现代公民义不容辞的法定义务与社会责任。', 'Bǎohù qīngshānlǜshuǐ hé shēngtài huánjìng shì měi yí wèi xiàndài gōngmín yìbùróngcí de fǎdìng yìwù yǔ shèhuì zérèn.', 'Bảo vệ non sông môi trường là trách nhiệm và nghĩa vụ của mỗi công dân.', id, NULL, 'SHARED_责任_zérèn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_责任_zérèn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '共同', 'gòngtóng', 'gongtong', 'chung, cùng nhau', 'adverb', '守护碧水蓝天需要千千万万普通群众的共同持续努力与默默付出。', 'Shǒuhù bìshuǐ lántiān xūyào qiānqiānwànwàn pǔtōng qúnzhòng de gòngtóng chíxù nǔlì yǔ mòmò fùchū.', 'Giữ gìn trời xanh mây trắng cần nỗ lực bền bỉ chung lòng của triệu người.', id, NULL, 'SHARED_共同_gòngtóng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_共同_gòngtóng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '绿色', 'lǜsè', 'lvse', 'màu xanh, thân thiện môi trường', 'noun', '倡导绿色低碳的生产生活方式，让节能减排融入点滴日常。', 'Chàngdǎo lǜsè dītàn de shēngchǎn shēnghuó fāngshì, ràng jiénéng jiǎnpái róngrù diǎndī rìcháng.', 'Cổ vũ lối sống xanh ít carbon, đưa tiết kiệm năng lượng vào từng ngày.', id, NULL, 'SHARED_绿色_lǜsè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_绿色_lǜsè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '低碳', 'dītàn', 'ditan', 'ít carbon, thân thiện khí hậu', 'adjective', '搭乘公共交通和骑行自行车是践行健康低碳生活的最优选择。', 'Dāchéng gōnggòng jiāotōng hé qíxíng zìxíngchē shì jiànxíng jiànkāng dītàn shēnghuó de zuì yōu xuǎnzé.', 'Đi xe công cộng và xe đạp là lựa chọn tối ưu cho lối sống ít khí thải.', id, NULL, 'SHARED_低碳_dītàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 18
  AND v.owner_key = 'SHARED_低碳_dītàn';

-- --- BAI 19 (37 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '传统', 'chuántǒng', 'chuantong', 'truyền thống phong tục', 'noun', '源远流长的民俗传统凝聚着中华民族深沉博大的文化认同感。', 'Yuányuǎanliúcháng de mínsú chuántǒng níngjù zhe Zhōnghuá mínzú shēnchén bódà de wénhuà rèntónggǎn.', 'Phong tục truyền thống lâu đời kết tinh bản sắc văn hóa sâu thẳm của dân tộc.', id, NULL, 'SHARED_传统_chuántǒng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_传统_chuántǒng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '春节', 'chūnjié', 'chunjie', 'Tết Nguyên Đán', 'noun', '春节是中国民间最隆重、最热闹也最受期盼的传统盛大节日。', 'Chūnjié shì Zhōngguó mínjiān zuì lóngzhòng, zuì rènao yě zuì shòu qīpàn de chuántǒng shèngdà jiérì.', 'Tết Nguyên Đán là ngày lễ truyền thống long trọng và náo nhiệt nhất.', id, NULL, 'SHARED_春节_chūnjié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_春节_chūnjié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '除夕', 'chúxī', 'chuxi', 'đêm giao thừa, đêm 30 Tết', 'noun', '除夕之夜全家老少相聚围坐在温暖的电视机前一起守岁迎接新年。', 'Chúxī zhī yè quán jiā lǎoshào xiāngjù wéizuò zài wēnnuǎn de diànshìjī qián yìqǐ shǒusuì yíngjiē xīnnián.', 'Đêm giao thừa cả nhà sum họp quây quần bên tivi cùng đón giao thừa mừng năm mới.', id, NULL, 'SHARED_除夕_chúxī'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_除夕_chúxī';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '年夜饭', 'niányèfàn', 'nianyefan', 'bữa cơm tất niên đêm giao thừa', 'noun', '年夜饭的餐桌上必定会摆上一整条烹制美味的鲜鱼，寓意年年有余。', 'Niányèfàn de cānzhuō shang bìdìng huì bǎi shàng yì zhěng tiáo pēngzhì měiwèi de xiān yú, yùyì niánnián yǒuyú.', 'Mâm cơm tất niên nhất định phải có đĩa cá tươi, mang ý nghĩa dư dả quanh năm.', id, NULL, 'SHARED_年夜饭_niányèfàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_年夜饭_niányèfàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '拜年', 'bàinián', 'bainian', 'chúc tết, đi chúc tết', 'verb', '大年初一清晨穿上崭新的新衣裳，高兴地向长辈们鞠躬拜年问好。', 'Dà nián chūyī qīngchén chuān shàng zhǎnxīn de xīn yīshang, gāoxìng de xiàng zhǎngbèimen jūgōng bàinián wènhǎo.', 'Sáng mồng một Tết mặc quần áo mới, hớn hở cúi đầu chúc tết ông bà cha mẹ.', id, NULL, 'SHARED_拜年_bàinián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_拜年_bàinián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '红包', 'hóngbāo', 'hongbao', 'bao lì xì đỏ', 'noun', '孩子们收到长辈们亲手递过来装着压岁钱的红彤彤红包，开心得合不拢嘴。', 'Háizimen shōudào zhǎngbèimen qīnshǒu dì guòlai zhuāng zhe yāsuìqián de hóngtōngtōng hóngbāo, kāixīn de hé bù lǒng zuǐ.', 'Lũ trẻ nhận được bao lì xì đỏ đựng tiền mừng tuổi từ tay người lớn, cười tít mắt.', id, NULL, 'SHARED_红包_hóngbāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_红包_hóngbāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '压岁钱', 'yāsuìqián', 'yasuiqian', 'tiền mừng tuổi, tiền lì xì', 'noun', '长辈给晚辈压岁钱，寄托着期盼孩子平平安安健康成长的美好寓意。', 'Zhǎngbèi gěi wǎnbèi yāsuìqián, jìtuō zhe qīpàn háizi píngpíng''ān''ān jiànkāng chéngzhǎng de měihǎo yùyì.', 'Tiền mừng tuổi người lớn tặng gửi gắm lời cầu chúc trẻ thơ bình an lớn khôn.', id, NULL, 'SHARED_压岁钱_yāsuìqián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_压岁钱_yāsuìqián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '贴春联', 'tiē chūnlián', 'tiechunlian', 'dán câu đối đỏ ngày Tết', 'verb', '腊月三十下午，父子俩一起在朱红的大门两旁端端正正地贴春联。', 'Làyuè sānshí xiàwǔ, fùzǐ liǎ yìqǐ zài zhūhóng de dàmén liǎngpáng duānduānzhèngzhèng de tiē chūnlián.', 'Chiều 30 Tết, hai bố con cùng nhau dán câu đối đỏ ngay ngắn hai bên cửa lớn.', id, NULL, 'SHARED_贴春联_tiē chūnlián'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_贴春联_tiē chūnlián';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '放鞭炮', 'fàng biānpào', 'fangbianpao', 'đốt pháo đón mừng', 'verb', '辞旧迎新的隆重时刻，屋外响起了阵阵响亮欢快的放鞭炮声音。', 'Cíjiùyíngxīn de lóngzhòng shíkè, wūwài xiǎngqǐ le zhènzhèn xiǎngliàng huānkuài de fàng biānpào shēngyīn.', 'Giờ phút tống cựu nghênh tân, ngoài sân rộn ràng tiếng pháo giòn tan đón mừng.', id, NULL, 'SHARED_放鞭炮_fàng biānpào'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_放鞭炮_fàng biānpào';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '烟花', 'yānhuā', 'yanhua', 'pháo hoa', 'noun', '绚烂缤纷的彩色烟花在漆黑宁静的夜空中竞相绽放，美不胜收。', 'Xuànlàn bīnfēn de cǎisè yānhuā zài qīhēi níngjìng de yèkōng zhōng jìngxiāng zhànfàng, měi bú shèng shōu.', 'Những chùm pháo hoa rực rỡ đua nhau bung nở trên bầu trời đêm tuyệt đẹp.', id, NULL, 'SHARED_烟花_yānhuā'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_烟花_yānhuā';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '元宵节', 'yuánxiāojié', 'yuanxiaojie', 'Tết Nguyên Tiêu (Rằm tháng Giêng)', 'noun', '正月十五元宵节是农历新春庆祝活动的圆满压轴与高潮。', 'Zhēngyuè shíwǔ yuánxiāojié shì nónglì xīnchūn qìngzhù huódòng de yuánmǎn yāzhóu yǔ gāocháo.', 'Rằm tháng Giêng Tết Nguyên Tiêu là nốt nhạc kết hoàn hảo của chuỗi hội xuân.', id, NULL, 'SHARED_元宵节_yuánxiāojié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_元宵节_yuánxiāojié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吃元宵', 'chī yuánxiāo', 'chiyuanxiao', 'ăn bánh trôi tàu Nguyên Tiêu', 'verb', '元宵佳节全家围坐吃元宵，象征着家庭团团圆圆与美美满满。', 'Yuánxiāo jiājié quán jiā wéizuò chī yuánxiāo, xiàngzhēng zhe jiātíng tuántuányuányuán yǔ měiměimǎnmǎn.', 'Tết Nguyên Tiêu cả nhà ăn bánh trôi, biểu trưng cho sự sum vầy đoàn viên mỹ mãn.', id, NULL, 'SHARED_吃元宵_chī yuánxiāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_吃元宵_chī yuánxiāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '看花灯', 'kàn huādēng', 'kanhuadeng', 'ngắm đèn hoa lồng đèn', 'verb', '元宵节夜市上张灯结彩，男女老少三五成群相约上街看花灯猜灯谜。', 'Yuánxiāojié yèshì shang zhāngdēngjiécǎi, nánnǚ lǎoshào sānwǔchéngqún xiāngyuē shàngjiē kàn huādēng cāi dēngmí.', 'Đêm Nguyên Tiêu phố phường rực rỡ, mọi người rủ nhau đi ngắm đèn lồng và đoán câu đố.', id, NULL, 'SHARED_看花灯_kàn huādēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_看花灯_kàn huādēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '清明节', 'qīngmíngjié', 'qingmingjie', 'Tết Thanh Minh', 'noun', '清明节期间人们踏青扫墓，深切缅怀并祭奠逝去的先人。', 'Qīngmíngjié qījiān rénmen tàqīng sǎomù, shēnqiè miǎnhuái bìng jìdiàn shìqù de xiānrén.', 'Dịp Tết Thanh Minh mọi người đi tảo mộ và tưởng nhớ tổ tiên đã khuất.', id, NULL, 'SHARED_清明节_qīngmíngjié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_清明节_qīngmíngjié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '扫墓', 'sǎomù', 'saomu', 'tảo mộ, viếng mộ', 'verb', '春雨绵绵的清明时节，全家手捧鲜花肃穆地前往祖先墓地扫墓。', 'Chūnyǔ miánmián de qīngmíng shíjié, quán jiā shǒu pěng xiānhuā sùmù de qiánwǎng zǔxiān mùdì sǎomù.', 'Tiết Thanh Minh mưa phùn, cả nhà mang hoa tươi trang nghiêm đi viếng mộ tổ tiên.', id, NULL, 'SHARED_扫墓_sǎomù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_扫墓_sǎomù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '端午节', 'duānwǔjié', 'duanwujie', 'Tết Đoan Ngọ (mùng 5 tháng 5)', 'noun', '五月初五端午节是纪念爱国伟大先驱屈原的中华传统历史节日。', 'Wǔ yuè chū wǔ duānwǔjié shì jìniàn àiguó wěidà xiānqū Qū Yuán de Zhōnghuá chuántǒng lìshǐ jiérì.', 'Mùng 5 tháng 5 Tết Đoan Ngọ là ngày lễ tưởng nhớ nhà thơ yêu nước Khuất Nguyên.', id, NULL, 'SHARED_端午节_duānwǔjié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_端午节_duānwǔjié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '赛龙舟', 'sài lóngzhōu', 'sailongzhou', 'đua thuyền rồng', 'verb', '江面上鼓声震天动地，几十条装饰威风的龙舟正在展开激烈赛龙舟角逐。', 'Jiāngmiàn shang gǔshēng zhèntiāndòngdì, jǐshí tiáo zhuāngshì wēifēng de lóngzhōu zhèngzài zhǎnkāi jīliè sài lóngzhōu jiézhú.', 'Trên sông tiếng trống vang trời, hàng chục chiếc thuyền rồng tranh đua quyết liệt.', id, NULL, 'SHARED_赛龙舟_sài lóngzhōu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_赛龙舟_sài lóngzhōu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吃粽子', 'chī zòngzi', 'chizongzi', 'ăn bánh ú, bánh lá nếp', 'verb', '端午节飘着清幽的箬竹叶香，亲手包粽子和吃粽子成了温馨记忆。', 'Duānwǔjié piāo zhe qīngyōu de ruòzhúyè xiāng, qīnshǒu bāo zòngzi hé chī zòngzi chéng le wēnxīn jìyì.', 'Tết Đoan Ngọ thoảng hương lá tre bọc, cùng gói và ăn bánh ú là kỷ niệm khó quên.', id, NULL, 'SHARED_吃粽子_chī zòngzi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_吃粽子_chī zòngzi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '中秋节', 'zhōngqiūjié', 'zhongqiujie', 'Tết Trung Thu (Rằm tháng Tám)', 'noun', '八月十五中秋节，明月当空，是寄托游子思乡情思的美好节日。', 'Bā yuè shíwǔ zhōngqiūjié, míngyuè dāngkōng, shì jìtuō yóuzǐ sīxiāng qíngsī de měihǎo jiérì.', 'Rằm tháng Tám Tết Trung Thu, trăng sáng trên cao, gửi gắm bao nỗi nhớ quê.', id, NULL, 'SHARED_中秋节_zhōngqiūjié'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_中秋节_zhōngqiūjié';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '赏月', 'shǎngyuè', 'shangyue', 'thưởng nguyệt, ngắm trăng rằm', 'verb', '庭院微风拂面，大家坐在桂花树下沏一壶香茗惬意赏月。', 'Tíngyuàn wēifēng fúmiàn, dàjiā zuò zài guìhuāshù xià qī yì hú xiāngmíng qièyì shǎngyuè.', 'Sân vườn gió mát hiu hiu, ngồi dưới bóng quế pha ấm trà thưởng nguyệt.', id, NULL, 'SHARED_赏月_shǎngyuè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_赏月_shǎngyuè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吃月饼', 'chī yuèbǐng', 'chiyuebing', 'ăn bánh nướng bánh dẻo Trung thu', 'verb', '中秋佳节切开一个豆沙蛋黄馅的双黄月饼，全家人分着吃月饼。', 'Zhōngqiū jiājié qiēkāi yí gè dòushā dànhuáng xiàn de shuānghuáng yuèbǐng, quán jiā rén fēn zhe chī yuèbǐng.', 'Trung thu cắt chiếc bánh nướng hai trứng nhân đậu đỏ chia cho cả nhà cùng ăn.', id, NULL, 'SHARED_吃月饼_chī yuèbǐng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_吃月饼_chī yuèbǐng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '习俗', 'xísú', 'xisu', 'tập tục đời sống', 'noun', '不同地域有着千姿百态、风采各异但同样意蕴悠长的节庆民俗。', 'Bùtóng dìyù yǒu zhe qiānzībǎitài, fēngcǎi gèyì dàn tóngyàng yìyùn yōucháng de jiéqìng mínsú.', 'Mỗi vùng miền mang những phong tục lễ tết phong phú và lắng đọng riêng.', id, NULL, 'SHARED_习俗_xísú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_习俗_xísú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '象征', 'xiàngzhēng', 'xiangzheng', 'tượng trưng biểu trưng', 'verb', '红彤彤的大灯笼高高挂起，象征着日子过得红红火火蒸蒸日上。', 'Hóngtōngtōng de dà dēnglong gāogāo guà qǐ, xiàngzhēng zhe rìzi guò de hónghónghuǒhuǒ zhēngzhēngrìshàng.', 'Chiếc đèn lồng đỏ treo cao tượng trưng cho cuộc sống ngày càng thịnh vượng.', id, NULL, 'SHARED_象征_xiàngzhēng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_象征_xiàngzhēng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '吉祥', 'jíxiáng', 'jixiang', 'cát tường điều lành', 'adjective', '金龙飞舞祥云环绕，处处洋溢着喜庆祥和的吉祥瑞气。', 'Jīnlóng fēiwǔ xiángyún huánrào, chùchù yángyì zhe xǐqìng xiánghé de jíxiáng ruìqì.', 'Rồng vàng uốn lượn mây lành bao quanh, ngập tràn sắc khí cát tường may mắn.', id, NULL, 'SHARED_吉祥_jíxiáng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_吉祥_jíxiáng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '如意', 'rúyì', 'ruyi', 'như ý toại nguyện', 'adjective', '在新春到来之际，祝愿大家工作顺心顺遂，阖家万事如意！', 'Zài xīnchūn dàolái zhījì, zhùyuàn dàjiā gōngzuò shùnxīn shùnsuì, héjiā wànshì rúyì!', 'Nhân dịp xuân mới, chúc mọi người công việc thuận buồm xuôi gió, vạn sự như ý!', id, NULL, 'SHARED_如意_rúyì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_如意_rúyì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '恭喜', 'gōngxǐ', 'gongxi', 'cung hỉ, chúc mừng', 'verb', '见面互道一声恭喜发财，脸上洋溢着发自肺腑的喜悦笑容。', 'Jiànmiàn hù dào yì shēng gōngxǐ fācái, liǎn shang yángyì zhe fā zì fèifǔ de xǐyuè xiàoróng.', 'Gặp gỡ trao nhau câu cung hỉ phát tài, nụ cười rạng rỡ từ tận đáy lòng.', id, NULL, 'SHARED_恭喜_gōngxǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_恭喜_gōngxǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '发财', 'fācái', 'facai', 'phát tài phát lộc', 'verb', '勤劳智慧是立身之本，祝大家在新的一年开拓进取，大展宏图发大财。', 'Qínláo zhìhuì shì lìshēn zhī běn, zhù dàjiā zài xīn de yì nián kāituò jìnqǔ, dàzhǎn hóngtú fā dàcái.', 'Chăm chỉ và sáng tạo là gốc rễ, chúc mọi người năm mới phát tài phát lộc.', id, NULL, 'SHARED_发财_fācái'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_发财_fācái';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '丰富多彩', 'fēngfù duōcǎi', 'fengfuduocai', 'phong phú đa dạng sắc màu', 'phrase', '民间传统节庆所衍生出的各项民俗活动形式多样，丰富多彩。', 'Mínjiān chuántǒng jiéqìng suǒ yǎnshēng chū de gè xiàng mínsú huódòng xíngshì duōyàng, fēngfù duōcǎi.', 'Các hoạt động phong tục dịp lễ tết truyền thống muôn màu muôn vẻ.', id, NULL, 'SHARED_丰富多彩_fēngfù duōcǎi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_丰富多彩_fēngfù duōcǎi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '传承', 'chuánchéng', 'chuancheng', 'kế thừa và phát huy', 'verb', '青年一代有责任主动学习并薪火相传这些宝贵的中华民俗文化遗产。', 'Qīngnián yídài yǒu zérèn zhǔdòng xuéxí bìng xīnhuǒxiāngchuán zhèxiē bǎoguì de Zhōnghuá mínsú wénhuà yíchǎn.', 'Giới trẻ có trách nhiệm kế thừa ngọn lửa di sản văn hóa dân gian quý giá này.', id, NULL, 'SHARED_传承_chuánchéng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_传承_chuánchéng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '守岁', 'shǒusuì', 'shousui', 'thức canh giao thừa, đón năm mới', 'verb', '全家人守岁直到子夜钟声敲响，互相拥抱互致新年最真挚美好的问候。', 'Quán jiā rén shǒusuì zhídào zǐyè zhōngshēng qiāoxiǎng, hùxiāng yōngbào hù zhì xīnnián zuì zhēnzhì měihǎo de wènhòu.', 'Cả nhà đón giao thừa tới lúc chuông điểm nửa đêm, ôm nhau chúc mừng năm mới.', id, NULL, 'SHARED_守岁_shǒusuì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_守岁_shǒusuì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '庙会', 'miàohuì', 'miaohui', 'hội chùa, chợ phiên đầu xuân', 'noun', '过年逛热闹非凡的传统地坛庙会，品尝老北京特色传统风味小吃。', 'Guònián guàng rènao fēifán de chuántǒng Dìtán miàohuì, pǐncháng lǎo Běijīng tèsè chuántǒng fēngwèi xiǎochī.', 'Dịp Tết đi hội chùa náo nhiệt, thưởng thức các món ăn vặt dân dã Bắc Kinh xưa.', id, NULL, 'SHARED_庙会_miàohuì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_庙会_miàohuì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '灯谜', 'dēngmí', 'dengmi', 'câu đố đèn lồng', 'noun', '猜灯谜既考验大家的文学功底与智慧，又增添了无穷的游园乐趣。', 'Cāi dēngmí jì kǎoyàn dàjiā de wénxué gōngdǐ yǔ zhìhuì, yòu zēngtiān le wúqióng de yóuyuán lèqù.', 'Đố đèn vừa thử thách tài trí vừa tăng thêm muôn phần hứng khởi hội hè.', id, NULL, 'SHARED_灯谜_dēngmí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_灯谜_dēngmí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '划龙舟', 'huá lóngzhōu', 'hualongzhou', 'chèo thuyền rồng', 'verb', '健儿们齐心协力挥桨划龙舟，江面上浪花飞溅，呐喊声震天动地。', 'Jiàn''érmen qíxīnxiélì huījiǎng huá lóngzhōu, jiāngmiàn shang lànghuā fēijiàn, nàhǎnshēng zhèntiāndòngdì.', 'Các tay chèo dốc sức lướt sóng, bọt nước tung bay, tiếng hò reo vang dội.', id, NULL, 'SHARED_划龙舟_huá lóngzhōu'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_划龙舟_huá lóngzhōu';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '月圆', 'yuèyuán', 'yueyuan', 'trăng tròn ngày rằm', 'noun', '每逢月圆之夜，皓月当空，总会勾起游子心底对家乡亲人深沉的思念。', 'Měi féng yuèyuán zhī yè, hàoyuè dāngkōng, zǒng huì gōuqǐ yóuzǐ xīndǐ duì jiāxiāng qīnrén shēnchén de sīniàn.', 'Mỗi đêm trăng rằm trăng sáng vằng vặc lại khơi gợi nỗi nhớ quê cồn cào.', id, NULL, 'SHARED_月圆_yuèyuán'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_月圆_yuèyuán';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阖家幸福', 'héjiā xìngfú', 'hejiaxingfu', 'cả nhà hạnh phúc ấm êm', 'phrase', '在新的一年里，衷心祝福大家身体健健康康，事业顺顺利利，阖家幸福！', 'Zài xīn de yì nián lǐ, zhōngxīn zhùfú dàjiā shēntǐ jiànjiànkāngkāng, shìyè shùnshùnlìlì, héjiā xìngfú!', 'Năm mới xin chân thành chúc mọi người dồi dào sức khỏe, sự nghiệp hanh thông, cả nhà hạnh phúc!', id, NULL, 'SHARED_阖家幸福_héjiā xìngfú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_阖家幸福_héjiā xìngfú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '大扫除', 'dàsǎochú', 'dasaochu', 'tổng vệ sinh đón tết', 'noun', '腊月二十四掸尘扫房子，家家户户进行全方位无死角的大扫除迎新年。', 'Làyuè èrshísì dǎnchén sǎo fángzi, jiājiāhùhù jìnxíng quánfāngwèi wúsǐjiǎo de dàsǎochú yíng xīnnián.', 'Ngày 24 tháng Chạp quét dọn nhà cửa, nhà nhà tổng vệ sinh đón mừng năm mới.', id, NULL, 'SHARED_大扫除_dàsǎochú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_大扫除_dàsǎochú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '年货', 'niánhuò', 'nianhuo', 'hàng Tết, đồ sắm Tết', 'noun', '各大农贸超市里挤满了前来采购干果糖果与各色丰盛年货的市民。', 'Gè dà nóngmào chāoshì lǐ jǐ mǎn le qiánlái cǎigòu gānguǒ tángguǒ yǔ gèsè fēngshèng niánhuò de shìmín.', 'Các siêu thị đông nghịt người dân đến mua bánh kẹo sắm đồ Tết.', id, NULL, 'SHARED_年货_niánhuò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 19
  AND v.owner_key = 'SHARED_年货_niánhuò';

-- --- BAI 20 (37 tu) ---
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '复习', 'fùxí', 'fuxi', 'ôn tập ôn luyện', 'verb', '考前坚持系统认真地复习，把学过的重要词汇和核心语法巩固牢固。', 'Kǎo qián jiānchí xìtǒng rènzhēn de fùxí, bǎ xué guò de zhòngyào cíhuì hé héxīn yǔfǎ gǒnggù láogù.', 'Trước khi thi kiên trì ôn tập bài bản, củng cố vững chắc từ vựng và ngữ pháp đã học.', id, NULL, 'SHARED_复习_fùxí'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_复习_fùxí';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '巩固', 'gǒnggù', 'gonggu', 'củng cố kiến thức', 'verb', '通过每天做真题练习可以有效巩固记忆，发现自己的薄弱环节。', 'Tōngguò měi tiān zuò zhēntí liànxí kěyǐ yǒuxiào gǒnggù jìyì, fāxiàn zìjǐ de bóruò huánjié.', 'Làm đề thi mỗi ngày giúp củng cố trí nhớ và tìm ra lỗ hổng kiến thức.', id, NULL, 'SHARED_巩固_gǒnggù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_巩固_gǒnggù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '掌握', 'zhǎngwò', 'zhangwo', 'nắm vững thông thạo', 'verb', '只要牢固掌握这七百多个高频核心词汇，通过HSK2级考试就会胸有成竹。', 'Zhǐyào láogù zhǎngwò zhè qībǎi duō gè gāopín héxīn cíhuì, tōngguò HSK èr jí kǎoshì jiù huì xiōngyǒuchéngzhú.', 'Chỉ cần nắm vững hơn 700 từ vựng cốt lõi này là hoàn toàn tự tin qua HSK 2.', id, NULL, 'SHARED_掌握_zhǎngwò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 3
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_掌握_zhǎngwò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '基础', 'jīchǔ', 'jichu', 'nền tảng căn bản', 'noun', '打下扎实深厚的发音与汉字书写基础，对后续高级阶段的进阶至关重要。', 'Dǎ xià zhāshi shēnhòu de fāyīn yǔ hànzì shūxiě jīchǔ, duì hòuxù gāojí jiēduàn de jìnjiē zhìguān zhòngyào.', 'Xây nền phát âm và chữ viết vững chắc rất quan trọng cho các cấp độ sau.', id, NULL, 'SHARED_基础_jīchǔ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 4
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_基础_jīchǔ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '表达', 'biǎodá', 'biaoda', 'diễn đạt bày tỏ', 'verb', '大胆开口与同学交流，用学过的句型清晰准确地表达自己的真实想法。', 'Dàdǎn kāikǒu yǔ tóngxué jiāoliú, yòng xué guò de jùxíng qīngxī zhǔnquè de biǎodá zìjǐ de zhēnshí xiǎngfǎ.', 'Mạnh dạn mở lời giao tiếp, dùng mẫu câu đã học để diễn đạt rõ suy nghĩ.', id, NULL, 'SHARED_表达_biǎodá'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 5
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_表达_biǎodá';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '交流', 'jiāoliú', 'jiaoliu', 'giao lưu trao đổi', 'verb', '语言是沟通心灵与文化交流的重要桥梁，多听多说才能熟能生巧。', 'Yǔyán shì gōutōng xīnlíng yǔ wénhuà jiāoliú de zhòngyào qiáoliáng, duō tīng duō shuō cái néng shúnéngshēngqiǎo.', 'Ngôn ngữ là cầu nối giao lưu văn hóa, nghe nói nhiều tay quen việc giỏi.', id, NULL, 'SHARED_交流_jiāoliú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 6
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_交流_jiāoliú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '意见', 'yìjiàn', 'yijian', 'ý kiến quan điểm', 'noun', '讨论问题时鼓励大家各抒己见，尊重并吸纳同伴提出的不同建设性意见。', 'Tǎolùn wèntí shí gǔlì dàjiā gèshūjǐjiàn, zūnzhòng bìng xīnà tóngbàn tíchū de bùtóng jiànshèxìng yìjiàn.', 'Thảo luận bài học nên khuyến khích mỗi người nêu ý kiến đóng góp riêng.', id, NULL, 'SHARED_意见_yìjiàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 7
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_意见_yìjiàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '观点', 'guāndiǎn', 'guandian', 'luận điểm quan điểm', 'noun', '在阐述自己的学术观点时，要列举出翔实充分的事实依据与数据支撑。', 'Zài chánshù zìjǐ de xuéshù guāndiǎn shí, yào lièjǔ chū xiángshí chōngfèn de shìshí yījù yǔ shùjù zhīchēng.', 'Khi trình bày quan điểm cần đưa ra dẫn chứng và số liệu xác thực.', id, NULL, 'SHARED_观点_guāndiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 8
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_观点_guāndiǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '赞同', 'zàntóng', 'zantong', 'đồng tình nhất trí', 'verb', '大家一致赞同由班长代表全班起草这次赴外校学术交流的总体方案。', 'Dàjiā yízhì zàntóng yóu bānzhǎng dàibiǎo quán bān qǐcǎo zhè cì fù wàixiào xuéshù jiāoliú de zǒngtǐ fāng''àn.', 'Mọi người nhất trí để lớp trưởng đại diện soạn phương án giao lưu.', id, NULL, 'SHARED_赞同_zàntóng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 9
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_赞同_zàntóng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '反对', 'fǎnduì', 'fandui', 'phản đối không đồng ý', 'verb', '如果有人对当前方案有不同看法，可以在提问环节礼貌地提出反对理由。', 'Rúguǒ yǒurén duì dāngqián fāng''àn yǒu bùtóng kànfǎ, kěyǐ zài tíwèn huánjié lǐmào de tíchū fǎnduì lǐyóu.', 'Nếu có ý kiến khác có thể lịch sự nêu lý do phản biện trong phần hỏi đáp.', id, NULL, 'SHARED_反对_fǎnduì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 10
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_反对_fǎnduì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '认为', 'rènwéi', 'renwei', 'cho rằng nhận định', 'verb', '许多资深教学专家认为，情境浸润式互动是掌握第二外语最高效的途径。', 'Xǔduō zīshēn jiàoxué zhuānjiā rènwéi, qíngjìng jìnrùnshì hùdòng shì zhǎngwò dì''èr wàiyǔ zuì gāoxiào de tújìng.', 'Nhiều chuyên gia cho rằng môi trường tương tác thực tế là cách học hiệu quả nhất.', id, NULL, 'SHARED_认为_rènwéi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 11
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_认为_rènwéi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '觉得', 'juéde', 'juede', 'cảm thấy nghĩ rằng', 'verb', '我觉得只要每天保持半小时的高质量听读输入，语感就会迅速建立起来。', 'Wǒ juéde zhǐyào měi tiān bǎochí bàn xiǎoshí de gāo zhìliàng tīngdú shūrù, yǔgǎn jiù huì xùnsù jiànlì qǐlai.', 'Tôi cảm thấy mỗi ngày nghe đọc nửa tiếng thì cảm giác ngôn ngữ sẽ tăng nhanh.', id, NULL, 'SHARED_觉得_juéde'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 12
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_觉得_juéde';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '相信', 'xiāngxìn', 'xiangxin', 'tin tưởng vững tin', 'verb', '相信自己平日里滴水穿石的辛勤付出，在考场上一定能够收获优异的成绩。', 'Xiāngxìn zìjǐ píngrì lǐ dīshuǐchuānshí de xīnqín fùchū, zài kǎochǎng shang yídìng nénggòu shōuhuò yōuyì de chéngjì.', 'Hãy tin vào nỗ lực bền bỉ của mình, khi vào phòng thi nhất định sẽ đạt điểm cao.', id, NULL, 'SHARED_相信_xiāngxìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 13
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_相信_xiāngxìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '希望', 'xīwàng', 'xiwang', 'hy vọng mong mỏi', 'noun', '心怀希望，脚踏实地，向着更高等级的汉语水平目标不断勇毅前行。', 'Xīnhuái xīwàng, jiǎotàshídì, xiàng zhe gèng gāo děngjí de hànyǔ shuǐpíng mùbiāo búduàn yǒngyì qiánxíng.', 'Ấp ủ hy vọng, vững bước tiến lên những nấc thang tiếng Trung cao hơn.', id, NULL, 'SHARED_希望_xīwàng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 14
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_希望_xīwàng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '祝愿', 'zhùyuàn', 'zhuyuan', 'chúc nguyện cầu chúc', 'verb', '老师衷心祝愿每一位刻苦勤勉的莘莘学子都能顺利考取心仪的证书。', 'Lǎoshī zhōngxīn zhùyuàn měi yí wèi kèkǔ qínmiǎn de shēnshēnxuézǐ dōu néng shùnlì kǎoqǔ xīnyí de zhèngshū.', 'Thầy cô chúc các bạn học viên chăm chỉ đều giành được chứng chỉ mong ước.', id, NULL, 'SHARED_祝愿_zhùyuàn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 15
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_祝愿_zhùyuàn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '克服', 'kèfú', 'kefu', 'khắc phục vượt qua', 'verb', '学外语难免会遇到平台期瓶颈，只要勇敢克服畏难情绪就一定能取得突破。', 'Xué wàiyǔ nánmiǎn huì yù dào píngtáiqī píngjǐng, zhǐyào yǒnggǎn kèfú wèinán qíngxù jiù yídìng néng qǔdé tūpò.', 'Học ngoại ngữ khó tránh lúc chững lại, chỉ cần vượt qua tâm lý e sợ là sẽ bứt phá.', id, NULL, 'SHARED_克服_kèfú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 16
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_克服_kèfú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '勇敢', 'yǒnggǎn', 'yonggan', 'dũng cảm gan dạ', 'adjective', '勇敢地走出心理舒适区，多和母语人士对话交流才能彻底摆脱哑巴外语。', 'Yǒnggǎn de zǒu chū xīnlǐ shūshìqū, duō hé mǔyǔ rénshì duìhuà jiāoliú cái néng chèdǐ bǎituō yǎba wàiyǔ.', 'Dũng cảm bước ra vùng an toàn trò chuyện cùng người bản xứ mới giỏi ngoại ngữ.', id, NULL, 'SHARED_勇敢_yǒnggǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 17
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_勇敢_yǒnggǎn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '积累', 'jīlěi', 'jilei', 'tích lũy tích tụ', 'verb', '学问在于日积月累，循序渐进，千万不可指望一朝一夕就能一步登天。', 'Xuéwèn zàiyú rìjīyuèlěi, xúnxùjiànjìn, qiānwàn bù kě zhǐwàng yìzhāoyīxī jiù néng yíbùdēngtiān.', 'Học vấn nhờ tích lũy từng ngày, tuyệt đối không nên trông chờ một sớm một chiều.', id, NULL, 'SHARED_积累_jīlěi'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 18
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_积累_jīlěi';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '听力', 'tīnglì', 'tingli', 'kỹ năng nghe hiểu', 'noun', '听力考试部分语速适中，审题时要提前快速浏览各个选项抓取关键词。', 'Tīnglì kǎoshì bùfen yǔsù shìzhōng, shěntí shí yào tíqián kuàisù liúlǎn gè gè xuǎnxiàng zhuāqǔ guānjiàncí.', 'Phần thi nghe hiểu tốc độ vừa phải, cần tranh thủ đọc trước các phương án.', id, NULL, 'SHARED_听力_tīnglì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 19
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_听力_tīnglì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '阅读', 'yuèdú', 'yuedu', 'kỹ năng đọc hiểu', 'noun', '平时多做有针对性的短文精读与泛读练习，大幅提升阅读理解的反应速度。', 'Píngshí duō zuò yǒu zhēnduìxìng de duǎnwén jīngdú yǔ fàndú liànxí, dàfú tíshēng yuèdú lǐjiě de fǎnyìng sùdù.', 'Ngày thường nên đọc kỹ và đọc lướt các bài văn ngắn để tăng tốc độ hiểu.', id, NULL, 'SHARED_阅读_yuèdú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 20
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_阅读_yuèdú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '写作', 'xiězuò', 'xiezuo', 'kỹ năng viết luận', 'noun', '规范端正地书写每一个汉字，注意汉语句子基本的词序结构与标点符号。', 'Guīfàn duānzhèng de shūxiě měi yí gè hànzì, zhùyì hànyǔ jùzi jīběn de cíxù jiégòu yǔ biāodiǎnfúhào.', 'Viết nắn nót từng chữ Hán, chú ý cấu trúc trật tự từ và dấu câu.', id, NULL, 'SHARED_写作_xiězuò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 21
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_写作_xiězuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '模拟', 'mónǐ', 'moni', 'mô phỏng, thi thử', 'verb', '考前严格按照真实考试时长与规则要求独立完成三套高质量全真模拟试卷。', 'Kǎo qián yángé ànzhào zhēnshí kǎoshì shízháng yǔ guīzé yāoqiú dúlì wánchéng sān tào gāo zhìliàng quánzhēn mónǐ shìjuàn.', 'Trước ngày thi bấm giờ làm trọn vẹn 3 bộ đề thi thử chất lượng cao.', id, NULL, 'SHARED_模拟_mónǐ'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 22
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_模拟_mónǐ';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '冲刺', 'chōngcì', 'chongci', 'chạy nước rút, bứt phá về đích', 'verb', '在考前最后两周的关键冲刺阶段，要把错题本里的薄弱题目全部重温一遍。', 'Zài kǎo qián zuìhòu liǎng zhōu de guānjiàn chōngcì jiēduàn, yào bǎ cuòtíběn lǐ de bóruò tímù quánbù chóngwēn yí biàn.', 'Hai tuần nước rút cuối cùng nên ôn lại toàn bộ các câu từng làm sai.', id, NULL, 'SHARED_冲刺_chōngcì'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 23
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_冲刺_chōngcì';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '优秀', 'yōuxiù', 'youxiu', 'ưu tú xuất sắc', 'adjective', '只要平时踏踏实实下一番真功夫，每一个人都能成为脱颖而出的优秀学员。', 'Zhǐyào píngshí tātashíshí xià yì fān zhēn gōngfu, měi yí gè rén dōu néng chéngwéi tuōyǐng''érchū de yōuxiù xuéyuán.', 'Chỉ cần chịu khó bỏ công sức học tập, ai cũng có thể trở thành học viên xuất sắc.', id, NULL, 'SHARED_优秀_yōuxiù'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 24
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_优秀_yōuxiù';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '证书', 'zhèngshū', 'zhengshu', 'chứng chỉ bằng cấp', 'noun', '这张沉甸甸的国家级HSK2级优秀能力证书是对你辛勤付出的最好回报。', 'Zhè zhāng chéndiāndiān de guójiājí HSK èr jí yōuxiù nénglì zhèngshū shì duì nǐ xīnqín fùchū de zuì hǎo huíbào.', 'Chứng chỉ HSK 2 này là sự đền đáp xứng đáng cho bao công sức bạn bỏ ra.', id, NULL, 'SHARED_证书_zhèngshū'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 25
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_证书_zhèngshū';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '目标', 'mùbiāo', 'mubiao', 'mục tiêu phương hướng', 'noun', '设立清晰具体的学习阶段目标，然后心无旁骛、步履不停地去实现它。', 'Shèlì qīngxī jùtǐ de xuéxí jiēduàn mùbiāo, ránhòu xīnwúpángwù, bùlǚ bù tíng de qù shíxiàn tā.', 'Đề ra mục tiêu học tập rõ ràng và tập trung từng bước thực hiện.', id, NULL, 'SHARED_目标_mùbiāo'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 26
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_目标_mùbiāo';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '迈进', 'màijìn', 'maijin', 'tiến bước, bước tới', 'verb', '顺利圆满拿下HSK2级之后，自信满满地向着更高级别HSK3级大步迈进！', 'Shùnlì yuánmǎn ná xià HSK èr jí zhīhòu, zìxìn mǎnmǎn de xiàng zhe gèng gāo jíbié HSK sān jí dàbù màijìn!', 'Sau khi chinh phục xong HSK 2, hãy tự tin sải bước tiến lên cấp độ HSK 3!', id, NULL, 'SHARED_迈进_màijìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 27
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_迈进_màijìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '坚持不懈', 'jiānchíbúxiè', 'jianchibuxie', 'kiên trì không ngừng nghỉ', 'phrase', '成功属于每一个在求学道路上咬定青山、坚持不懈的勇敢追梦人。', 'Chénggōng shǔyú měi yí gè zài qiúxué dàolù shang yǎodìngqīngshān, jiānchíbúxiè de yǒnggǎn zhuīmèngrén.', 'Thành công luôn mỉm cười với những người kiên trì bền bỉ theo đuổi ước mơ.', id, NULL, 'SHARED_坚持不懈_jiānchíbúxiè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 28
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_坚持不懈_jiānchíbúxiè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '勤奋', 'qínfèn', 'qinfen', 'cần cù chăm chỉ', 'adjective', '天道酬勤，勤奋好学永远是通往知识殿堂最朴素也是最有效的捷径。', 'Tiāndàochóuqín, qínfèn hàoxué yǒngyuǎn shì tōngwǎng zhīshi diàntáng zuì pǔsù yě shì zuì yǒuxiào de jiéjìng.', 'Trời không phụ lòng người, cần cù chăm chỉ mãi là con đường ngắn nhất đến tri thức.', id, NULL, 'SHARED_勤奋_qínfèn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 29
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_勤奋_qínfèn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '突破', 'tūpò', 'tupo', 'bứt phá đột phá', 'verb', '每一次勇敢战胜自我的过程，都是人生综合能力与心智的一大飞跃突破。', 'Měi yí cì yǒnggǎn zhànshèng zìwǒ de guòchéng, dōu shì rénshēng zōnghé nénglì yǔ xīnji de yí dà fēiyuè tūpò.', 'Mỗi lần vượt qua giới hạn của bản thân là một bước đột phá vượt bậc.', id, NULL, 'SHARED_突破_tūpò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 30
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_突破_tūpò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '自信', 'zìxìn', 'zixin', 'tự tin', 'adjective', '带着充分的考前准备与从容自信的心态步入考场，发挥出自己的最佳水平。', 'Dài zhe chōngfèn de kǎo qián zhǔnbèi yǔ cóngróng zìxìn de xīntài bùrù kǎochǎng, fāhuī chū zìjǐ de zuì jiā shuǐpíng.', 'Mang tâm thế tự tin vào phòng thi, phát huy phong độ tốt nhất của bạn.', id, NULL, 'SHARED_自信_zìxìn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 31
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_自信_zìxìn';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '从容', 'cóngróng', 'congrong', 'ung dung thong thả', 'adjective', '面对复杂的考题不慌不乱，沉着冷静，从容应对每一个难点。', 'Miànduì fùzá de kǎotí bù huāng bú luàn, chénzhuó lěngjìng, cóngróng yìngduì měi yí gè nándiǎn.', 'Trước đề thi khó bình tĩnh không hoảng hốt, ung dung xử lý từng điểm khó.', id, NULL, 'SHARED_从容_cóngróng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 32
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_从容_cóngróng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '收获', 'shōuhuò', 'shouhuo', 'thu hoạch, thành quả gặt hái', 'noun', '一份耕耘，一份收获，流过的每一滴汗水都在此刻绽放为灿烂的鲜花。', 'Yí fèn gēngyún, yí fèn shōuhuò, liú guò de měi yì dī hànshuǐ dōu zài cǐkè zhànfàng wéi cànlàn de xiānhuā.', 'Có công mài sắt có ngày nên kim, bao giọt mồ hôi đều đơm hoa kết trái ngọt lành.', id, NULL, 'SHARED_收获_shōuhuò'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 33
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_收获_shōuhuò';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '喜悦', 'xǐyuè', 'xiyue', 'niềm vui khôn xiết', 'noun', '查到高分通过考试那一刻，全家老少沉浸在无比自豪与欢畅的喜悦之中。', 'Chá dào gāo fēn tōngguò kǎoshì nà yí kè, quán jiā lǎoshào chénjìn zài wúbǐ zìháo yǔ huānchàng de xǐyuè zhīzhōng.', 'Lúc tra được điểm thi đỗ điểm cao, cả nhà chìm trong niềm vui sướng và tự hào.', id, NULL, 'SHARED_喜悦_xǐyuè'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 34
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_喜悦_xǐyuè';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '前途', 'qiántú', 'qiantu', 'tiền đồ tương lai', 'noun', '掌握一门流利的外语能为你未来的国际升学与职业竞争开拓宽广的前途。', 'Zhǎngwò yì mén liúlì de wàiyǔ néng wèi nǐ wèilái de guójì shēngxué yǔ zhíyè jìngzhēng kāituò kuānguǎng de qiántú.', 'Thành thạo một ngoại ngữ mở ra tương lai và tiền đồ rộng mở cho bạn.', id, NULL, 'SHARED_前途_qiántú'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 35
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_前途_qiántú';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '光明', 'guāngmíng', 'guangming', 'tươi sáng rạng ngời', 'adjective', '向着光明灿烂的未来，满怀激情与信心继续扬帆远航！', 'Xiàng zhe guāngmíng cànlàn de wèilái, mǎnhuái jīqíng yǔ xìnxīn jìxù yángfān yuǎnháng!', 'Hướng về tương lai tươi sáng rạng ngời, tràn đầy tự tin tiếp tục giương buồm ra khơi!', id, NULL, 'SHARED_光明_guāngmíng'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 36
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_光明_guāngmíng';
INSERT INTO vocabularies (hanzi, pinyin, pinyin_search, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '共勉', 'gòngmiǎn', 'gongmian', 'cùng nhau cố gắng, khích lệ lẫn nhau', 'verb', '书山有路勤为径，学海无涯苦作舟，让我们在求学路上携手共进，彼此共勉！', 'Shūshān yǒulù qín wéi jìng, xuéhǎi wúyá kǔ zuò zhōu, ràng wǒmen zài qiúxué lùshang xiéshǒu gòngjìn, bǐcǐ gòngmiǎn!', 'Đường lên núi sách chăm là lối, biển học mênh mông khổ làm thuyền, chúc chúng ta cùng nhau phấn đấu!', id, NULL, 'SHARED_共勉_gòngmiǎn'
FROM hsk_levels WHERE code = 'HSK_2'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning), pinyin_search = VALUES(pinyin_search), example_sentence = VALUES(example_sentence), example_pinyin = VALUES(example_pinyin), example_meaning = VALUES(example_meaning);
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 37
FROM lessons l, vocabularies v, hsk_levels h
WHERE l.hsk_level_id = h.id AND h.code = 'HSK_2' AND l.sort_order = 20
  AND v.owner_key = 'SHARED_共勉_gòngmiǎn';
