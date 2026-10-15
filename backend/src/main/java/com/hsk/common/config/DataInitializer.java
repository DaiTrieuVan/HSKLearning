package com.hsk.common.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.LessonVocabularyId;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;

/**
 * Initializes default development accounts (Admin, Teachers, Students) and sample data
 * on application startup if they do not exist yet. Only active on non-test profiles.
 */
@Component
@Profile("!test & !test-h2")
public class DataInitializer implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
	public static final String DEFAULT_PASSWORD = "Password123";

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserRoleRepository userRoleRepository;
	private final PasswordEncoder passwordEncoder;
	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;
	private final VocabSetRepository vocabSetRepository;
	private final VocabSetItemRepository vocabSetItemRepository;
	private final VocabularyRepository vocabularyRepository;
	private final LessonRepository lessonRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;
	private final HskLevelRepository hskLevelRepository;

	public DataInitializer(
			UserRepository userRepository,
			RoleRepository roleRepository,
			UserRoleRepository userRoleRepository,
			PasswordEncoder passwordEncoder,
			ClassRepository classRepository,
			ClassMemberRepository classMemberRepository,
			VocabSetRepository vocabSetRepository,
			VocabSetItemRepository vocabSetItemRepository,
			VocabularyRepository vocabularyRepository,
			LessonRepository lessonRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			HskLevelRepository hskLevelRepository) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userRoleRepository = userRoleRepository;
		this.passwordEncoder = passwordEncoder;
		this.classRepository = classRepository;
		this.classMemberRepository = classMemberRepository;
		this.vocabSetRepository = vocabSetRepository;
		this.vocabSetItemRepository = vocabSetItemRepository;
		this.vocabularyRepository = vocabularyRepository;
		this.lessonRepository = lessonRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.hskLevelRepository = hskLevelRepository;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		log.info("==> [DataInitializer] Checking and seeding default development accounts & data...");

		RoleEntity adminRole = roleRepository.findByCode(RoleCode.ADMIN).orElse(null);
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElse(null);
		RoleEntity studentRole = roleRepository.findByCode(RoleCode.STUDENT).orElse(null);

		// 1. Quản trị viên (ADMIN) - admin@hsk.com
		createOrUpdateAccount("admin@hsk.com", "Quản trị viên Hệ thống", List.of(adminRole, teacherRole, studentRole), UiMode.TEACHER);

		// 2. Giáo viên 1 & 2 (TEACHER)
		UserEntity teacher1 = createOrUpdateAccount("teacher1@hsk.com", "Cô Vương Lệ (Giáo viên)", List.of(teacherRole, studentRole), UiMode.TEACHER);
		createOrUpdateAccount("teacher2@hsk.com", "Thầy Trương Vĩ (Giáo viên)", List.of(teacherRole, studentRole), UiMode.TEACHER);

		// 3. Học sinh 1 & 2 (STUDENT)
		UserEntity student1 = createOrUpdateAccount("student1@hsk.com", "Nguyễn Văn Học (Học sinh)", List.of(studentRole), UiMode.STUDENT);
		createOrUpdateAccount("student2@hsk.com", "Trần Thị Sinh (Học sinh)", List.of(studentRole), UiMode.STUDENT);

		// Giữ thêm alias .edu cũ để tương thích ngược nếu cần
		createOrUpdateAccount("admin@hsk.edu", "Quản trị viên Hệ thống (edu)", List.of(adminRole, teacherRole, studentRole), UiMode.TEACHER);
		createOrUpdateAccount("teacher@hsk.edu", "Cô Trương (Giáo viên edu)", List.of(teacherRole, studentRole), UiMode.TEACHER);
		createOrUpdateAccount("student@hsk.edu", "Lý Tiểu Long (Học sinh edu)", List.of(studentRole), UiMode.STUDENT);

		// 4. Đồng bộ từ vựng chuẩn HSK 1 với UTF-8 và pinyin_search
		seedOrFixStandardVocabularies();

		// 5. Khởi tạo Lớp học mẫu & Bộ từ vựng mẫu
		if (teacher1 != null && student1 != null) {
			initSampleClassroom(teacher1, student1);
			initSampleVocabSet(teacher1);
		}

		// 6. Tự động gán từ vựng mẫu vào Bài 1 & Bài 2 của HSK 1
		initLessonVocabularies();

		log.info("==> [DataInitializer] Completed. All seed accounts & vocabularies are ready!");
	}

	private UserEntity createOrUpdateAccount(String email, String fullName, List<RoleEntity> roles, UiMode defaultMode) {
		UserEntity user = userRepository.findByEmailIgnoreCase(email).orElse(null);
		if (user == null) {
			log.info("==> [DataInitializer] Seeding account: {}", email);
			user = UserEntity.register(email, passwordEncoder.encode(DEFAULT_PASSWORD), fullName);
			if (defaultMode != null) {
				user.switchMode(defaultMode);
			}
			user = userRepository.save(user);

			for (RoleEntity role : roles) {
				if (role != null) {
					userRoleRepository.save(UserRoleEntity.of(user, role, null));
				}
			}
		} else {
			// Dev mode: Tự động mở khóa và đồng bộ mật khẩu chuẩn cho các tài khoản seed
			user.unlock();
			user.changePassword(passwordEncoder.encode(DEFAULT_PASSWORD));
			user = userRepository.save(user);
		}
		return user;
	}

	private void initSampleClassroom(UserEntity teacher, UserEntity student) {
		String joinCode = "HSK101";
		ClassEntity classroom = classRepository.findByJoinCode(joinCode).orElse(null);
		if (classroom == null) {
			log.info("==> [DataInitializer] Seeding sample classroom with join code '{}'", joinCode);
			classroom = ClassEntity.create(
					teacher,
					"Lớp HSK 1 Cơ bản - Khóa K01",
					"Lớp học từ vựng và ngữ pháp nền tảng HSK 1 cho người mới bắt đầu.",
					joinCode
			);
			classroom = classRepository.save(classroom);
		}

		if (classroom != null && classMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), student.getId()).isEmpty()) {
			log.info("==> [DataInitializer] Enrolling '{}' into sample classroom '{}'", student.getEmail(), joinCode);
			classMemberRepository.save(ClassMemberEntity.create(classroom, student));
		}
	}

	private void initSampleVocabSet(UserEntity teacher) {
		if (vocabSetRepository.findAllByTeacherIdOrderByCreatedAtDesc(teacher.getId()).isEmpty()) {
			log.info("==> [DataInitializer] Seeding sample vocabulary set for teacher '{}'", teacher.getEmail());
			VocabSetEntity set = new VocabSetEntity(
					teacher.getId(),
					"Bộ 20 từ vựng HSK 1 thông dụng",
					"Tổng hợp các từ vựng giao tiếp cơ bản nhất cho người mới bắt đầu học tiếng Trung."
			);
			VocabSetEntity savedSet = vocabSetRepository.save(set);

			List<VocabularyEntity> vocabs = vocabularyRepository.findAll();
			int order = 1;
			for (VocabularyEntity v : vocabs) {
				if (order > 10) break;
				vocabSetItemRepository.save(new VocabSetItemEntity(savedSet, v, order++));
			}
		}
	}

	private void seedOrFixStandardVocabularies() {
		HskLevelEntity hsk1 = hskLevelRepository.findByCode("HSK_1").orElse(null);
		if (hsk1 == null) return;

		List<StandardVocabDef> standardDefs = List.of(
				new StandardVocabDef("你好", "nǐ hǎo", "nihao", "Xin chào", "phrase", "你好！很高兴认识你。", "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.", "Xin chào! Rất vui được làm quen với bạn."),
				new StandardVocabDef("你", "nǐ", "ni", "bạn, anh, chị (ngôi thứ 2)", "pronoun", "你是学生吗？", "Nǐ shì xuésheng ma?", "Bạn là học sinh phải không?"),
				new StandardVocabDef("好", "hǎo", "hao", "tốt, khỏe, hay, đẹp", "adjective", "今天天气很好。", "Jīntiān tiānqì hěn hǎo.", "Thời tiết hôm nay rất đẹp."),
				new StandardVocabDef("谢谢", "xièxie", "xiexie", "cảm ơn", "verb", "谢谢你的帮助！", "Xièxie nǐ de bāngzhù!", "Cảm ơn sự giúp đỡ của bạn!"),
				new StandardVocabDef("再见", "zàijiàn", "zaijian", "tạm biệt", "phrase", "明天见，再见！", "Míngtiān jiàn, zàijiàn!", "Hẹn mai gặp, tạm biệt!"),
				new StandardVocabDef("水", "shuǐ", "shui", "nước, nước uống", "noun", "我想喝水。", "Wǒ xiǎng hē shuǐ.", "Tôi muốn uống nước."),
				new StandardVocabDef("我", "wǒ", "wo", "tôi, mình (ngôi thứ 1)", "pronoun", "我是中国人。", "Wǒ shì Zhōngguó rén.", "Tôi là người Trung Quốc."),
				new StandardVocabDef("他", "tā", "ta", "anh ấy, cậu ấy, ông ấy", "pronoun", "他是我的老师。", "Tā shì wǒ de lǎoshī.", "Thầy ấy là giáo viên của tôi."),
				new StandardVocabDef("她", "tā", "ta", "cô ấy, chị ấy, bà ấy", "pronoun", "她是我的朋友。", "Tā shì wǒ de péngyou.", "Cô ấy là bạn của tôi."),
				new StandardVocabDef("们", "men", "men", "các, chúng (hậu tố số nhiều)", "suffix", "我们都是好朋友。", "Wǒmen dōu shì hǎo péngyou.", "Chúng tôi đều là bạn tốt."),
				new StandardVocabDef("不", "bù", "bu", "không, chẳng (phủ định)", "adverb", "我不是老师。", "Wǒ bú shì lǎoshī.", "Tôi không phải là giáo viên."),
				new StandardVocabDef("很", "hěn", "hen", "rất, lắm, quá", "adverb", "我很好，谢谢！", "Wǒ hěn hǎo, xièxie!", "Tôi rất khỏe, cảm ơn!"),
				new StandardVocabDef("是", "shì", "shi", "là, phải, đúng", "verb", "这是我的书。", "Zhè shì wǒ de shū.", "Đây là sách của tôi."),
				new StandardVocabDef("吗", "ma", "ma", "không, à, ư (trợ từ nghi vấn)", "particle", "你好吗？", "Nǐ hǎo ma?", "Bạn có khỏe không?")
		);

		for (StandardVocabDef def : standardDefs) {
			String ownerKey = VocabularyEntity.buildOwnerKey(null, def.hanzi, def.pinyin);
			VocabularyEntity vocab = vocabularyRepository.findByOwnerKey(ownerKey).orElse(null);
			if (vocab == null) {
				// Thử tìm theo pinyinSearch để cập nhật từ cũ bị lỗi mã hóa
				List<VocabularyEntity> matched = vocabularyRepository.searchVocabularies(null, def.hanzi, def.pinyinSearch);
				if (!matched.isEmpty()) {
					vocab = matched.get(0);
				}
			}

			if (vocab == null) {
				vocab = new VocabularyEntity(
						def.hanzi, def.pinyin, def.meaning, def.partOfSpeech,
						null, def.exampleSentence, def.examplePinyin, def.exampleMeaning,
						hsk1, null
				);
				vocab.setPinyinSearch(def.pinyinSearch);
				vocabularyRepository.save(vocab);
			} else {
				vocab.setHanzi(def.hanzi);
				vocab.setPinyin(def.pinyin);
				vocab.setPinyinSearch(def.pinyinSearch);
				vocab.setMeaning(def.meaning);
				vocab.setPartOfSpeech(def.partOfSpeech);
				vocab.setExampleSentence(def.exampleSentence);
				vocab.setExamplePinyin(def.examplePinyin);
				vocab.setExampleMeaning(def.exampleMeaning);
				vocab.setHskLevel(hsk1);
				vocabularyRepository.save(vocab);
			}
		}
	}

	private void initLessonVocabularies() {
		List<LessonEntity> lessons = lessonRepository.findAll();
		if (lessons.isEmpty()) return;

		LessonEntity lesson1 = lessons.stream()
				.filter(l -> l.getTitle() != null && l.getTitle().contains("Bài 1"))
				.findFirst().orElse(null);
		LessonEntity lesson2 = lessons.stream()
				.filter(l -> l.getTitle() != null && l.getTitle().contains("Bài 2"))
				.findFirst().orElse(null);

		List<VocabularyEntity> vocabs = vocabularyRepository.findAll();
		if (vocabs.isEmpty()) return;

		if (lesson1 != null) {
			int order = 1;
			// Gán các từ chào hỏi và cơ bản vào Bài 1
			List<String> lesson1Words = List.of("你好", "你", "好", "我", "他", "她", "们", "不", "很", "是", "吗");
			for (String targetHanzi : lesson1Words) {
				VocabularyEntity v = vocabs.stream().filter(x -> targetHanzi.equals(x.getHanzi())).findFirst().orElse(null);
				if (v != null) {
					LessonVocabularyId id = new LessonVocabularyId(lesson1.getId(), v.getId());
					if (!lessonVocabularyRepository.existsById(id)) {
						lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson1, v, order++));
					}
				}
			}
		}

		if (lesson2 != null) {
			int order = 1;
			List<String> lesson2Words = List.of("谢谢", "再见", "水");
			for (String targetHanzi : lesson2Words) {
				VocabularyEntity v = vocabs.stream().filter(x -> targetHanzi.equals(x.getHanzi())).findFirst().orElse(null);
				if (v != null) {
					LessonVocabularyId id = new LessonVocabularyId(lesson2.getId(), v.getId());
					if (!lessonVocabularyRepository.existsById(id)) {
						lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson2, v, order++));
					}
				}
			}
		}
	}

	private record StandardVocabDef(
			String hanzi, String pinyin, String pinyinSearch, String meaning,
			String partOfSpeech, String exampleSentence, String examplePinyin, String exampleMeaning
	) {}
}
