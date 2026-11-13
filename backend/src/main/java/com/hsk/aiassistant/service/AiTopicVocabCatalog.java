package com.hsk.aiassistant.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.hsk.aiassistant.dto.AiVocabAutofillItemDto;

/**
 * Kho từ vựng tiếng Trung phong phú theo chủ đề với đầy đủ Chữ Hán, Pinyin thanh điệu,
 * Nghĩa tiếng Việt, Loại từ và Câu ví dụ song ngữ.
 * Dùng làm nguồn sinh dữ liệu chất lượng cao khi trợ lý AI chưa cấu hình khóa truy cập hoặc ngoại tuyến.
 */
public final class AiTopicVocabCatalog {

	private AiTopicVocabCatalog() {
	}

	private static final Map<String, List<AiVocabAutofillItemDto>> TOPIC_MAP = new LinkedHashMap<>();
	private static final Map<String, AiVocabAutofillItemDto> HANZI_LOOKUP_MAP = new HashMap<>();

	static {
		// 1. GIAO TIẾP TẠI NHÀ HÀNG / ẨM THỰC
		List<AiVocabAutofillItemDto> restaurantList = List.of(
				new AiVocabAutofillItemDto("服务员", "fúwùyuán", "nhân viên phục vụ", "noun", "服务员，请给我一份菜单。", "Fúwùyuán, qǐng gěi wǒ yí fèn càidān.", "Phục vụ ơi, cho tôi xin một cuốn thực đơn."),
				new AiVocabAutofillItemDto("菜单", "càidān", "thực đơn / menu", "noun", "这家餐厅的菜单有很多特色菜。", "Zhè jiā cāntīng de càidān yǒu hěn duō tèsè cài.", "Thực đơn của nhà hàng này có rất nhiều món đặc sản."),
				new AiVocabAutofillItemDto("点菜", "diǎncài", "gọi món / đặt món", "verb", "我们准备好点菜了，请过来一下。", "Wǒmen zhǔnbèi hǎo diǎncài le, qǐng guòlai yíxià.", "Chúng tôi đã sẵn sàng gọi món rồi, xin qua đây một lát."),
				new AiVocabAutofillItemDto("买单", "mǎidān", "thanh toán / tính tiền", "verb", "服务员，买单，可以微信支付吗？", "Fúwùyuán, mǎidān, kěyǐ Wēixìn zhīfù ma?", "Phục vụ ơi tính tiền, có thể trả bằng WeChat không?"),
				new AiVocabAutofillItemDto("招牌菜", "zhāopáicài", "món đặc trưng / món tủ", "noun", "请问你们店里的招牌菜是什么？", "Qǐngwèn nǐmen diàn lǐ de zhāopáicài shì shénme?", "Xin hỏi món đặc trưng của quán mình là gì?"),
				new AiVocabAutofillItemDto("好吃", "hǎochī", "ngon miệng", "adjective", "这个北京烤鸭外脆里嫩，非常美味。", "Zhège Běijīng kǎoyā wài cuì lǐ nèn, fēicháng měiwèi.", "Món vịt quay Bắc Kinh này ngoài giòn trong mềm, rất ngon miệng."),
				new AiVocabAutofillItemDto("辣", "là", "cay", "adjective", "我不太能吃辣，请少放辣椒。", "Wǒ bú tài néng chī là, qǐng shǎo fàng làjiāo.", "Tôi không ăn cay giỏi lắm, xin cho ít ớt thôi."),
				new AiVocabAutofillItemDto("筷子", "kuàizi", "đũa", "noun", "请问有筷子和勺子吗？", "Qǐngwèn yǒu kuàizi hé sháozi ma?", "Xin hỏi có đũa và thìa không?"),
				new AiVocabAutofillItemDto("米饭", "mǐfàn", "cơm trắng", "noun", "请再给我们来两碗米饭。", "Qǐng zài gěi wǒmen lái liǎng wǎn mǐfàn. ", "Xin cho chúng tôi thêm hai bát cơm trắng nữa."),
				new AiVocabAutofillItemDto("饮料", "yǐnliào", "đồ uống / nước giải khát", "noun", "您想喝点什么冷饮或热饮？", "Nín xiǎng hē diǎn shénme lěngyǐn huò rèyǐn?", "Quý khách muốn uống đồ uống lạnh hay nóng?"),
				new AiVocabAutofillItemDto("预订", "yùdìng", "đặt trước (bàn/chỗ)", "verb", "我们昨天已经预订了一个包间。", "Wǒmen zuótiān yǐjīng yùdìng le yí gè bāojiān.", "Chúng tôi hôm qua đã đặt trước một phòng riêng rồi."),
				new AiVocabAutofillItemDto("打包", "dǎbāo", "gói mang về", "verb", "吃不完的菜可以帮我们打包吗？", "Chī bù wán de cài kěyǐ bāng wǒmen dǎbāo ma?", "Thức ăn chưa ăn hết có thể giúp chúng tôi gói mang về không?"),
				new AiVocabAutofillItemDto("忌口", "jìkǒu", "kiêng ăn / dị ứng", "verb", "请问各位客人有什么忌口的食物吗？", "Qǐngwèn gèwèi kèrén yǒu shénme jìkǒu de shíwù ma?", "Xin hỏi quý khách có kiêng loại thức ăn nào không?"),
				new AiVocabAutofillItemDto("甜点", "tiándiǎn", "món tráng miệng", "noun", "饭后我们点两份特色甜点吧。", "Fànhòu wǒmen diǎn liǎng fèn tèsè tiándiǎn ba.", "Sau bữa ăn chúng ta gọi hai phần tráng miệng đặc sản nhé."),
				new AiVocabAutofillItemDto("热水", "rèshuǐ", "nước nóng / nước ấm", "noun", "天气有点冷，请先上一壶热水。", "Tiānqì yǒudiǎn lěng, qǐng xiān shàng yì hú rèshuǐ.", "Thời tiết hơi lạnh, xin mang lên một ấm nước nóng trước."),
				new AiVocabAutofillItemDto("尝", "cháng", "nếm thử", "verb", "你快尝尝这道刚出锅的热菜。", "Nǐ kuài chángchang zhè dào gāng chūguō de rècài.", "Cậu mau nếm thử món nóng vừa mới ra lò này đi."),
				new AiVocabAutofillItemDto("味道", "wèidao", "hương vị", "noun", "这道红烧牛肉的味道非常地道正宗。", "Zhè dào hóngshāo niúròu de wèidao fēicháng dìdao zhèngzōng.", "Hương vị của món thịt bò kho này rất chuẩn vị."),
				new AiVocabAutofillItemDto("推荐", "tuījiàn", "giới thiệu / gợi ý", "verb", "您能为我们推荐两道清淡爽口的小菜吗？", "Nín néng wèi wǒmen tuījiàn liǎng dào qīngdàn shuǎngkǒu de xiǎocài ma?", "Bạn có thể giới thiệu cho chúng tôi hai món thanh đạm giải ngấy không?"),
				new AiVocabAutofillItemDto("纸巾", "zhǐjīn", "khăn giấy", "noun", "桌上没有纸巾了，麻烦拿一包纸巾。", "Zhuō shang méiyǒu zhǐjīn le, máfan ná yì bāo zhǐjīn.", "Trên bàn hết khăn giấy rồi, phiền bạn lấy một gói khăn giấy."),
				new AiVocabAutofillItemDto("账单", "zhàngdān", "hóa đơn", "noun", "请帮我核对一下今天的消费账单。", "Qǐng bāng wǒ héduì yíxià jīntiān de xiāofèi zhàngdān.", "Xin giúp tôi đối chiếu lại hóa đơn tiêu dùng hôm nay.")
		);
		registerTopic("RESTAURANT", restaurantList);

		// 2. KHÁCH SẠN & DU LỊCH
		List<AiVocabAutofillItemDto> hotelList = List.of(
				new AiVocabAutofillItemDto("酒店", "jiǔdiàn", "khách sạn", "noun", "我们预订了市中心的一家四星级酒店。", "Wǒmen yùdìng le shìzhōngxīn de yì jiā sìxīngjí jiǔdiàn.", "Chúng tôi đã đặt một khách sạn 4 sao ở trung tâm thành phố."),
				new AiVocabAutofillItemDto("入住", "rùzhù", "nhận phòng (check-in)", "verb", "请问下午两点可以办理入住手续吗？", "Qǐngwèn xiàwǔ liǎng diǎn kěyǐ bànlǐ rùzhù shǒuxù ma?", "Xin hỏi 2 giờ chiều có thể làm thủ tục nhận phòng không?"),
				new AiVocabAutofillItemDto("退房", "tuìfáng", "trả phòng (check-out)", "verb", "明天中午十二点之前需要办理退房。", "Míngtiān zhōngwǔ shí'èr diǎn zhīqián xūyào bànlǐ tuìfáng.", "Trước 12 giờ trưa mai cần làm thủ tục trả phòng."),
				new AiVocabAutofillItemDto("房卡", "fángkǎ", "thẻ phòng", "noun", "这是您的房卡，房间在八楼808号。", "Zhè shì nín de fángkǎ, fángjiān zài bālóu bābālíng hào.", "Đây là thẻ phòng của quý khách, phòng ở tầng 8 số 808."),
				new AiVocabAutofillItemDto("护照", "hùzhào", "hộ chiếu", "noun", "办理入住登记必须出示您的护照原件。", "Bànlǐ rùzhù dēngjì bìxū chūshì nín de hùzhào yuánjiàn.", "Làm thủ tục nhận phòng bắt buộc phải xuất trình hộ chiếu gốc."),
				new AiVocabAutofillItemDto("押金", "yājīn", "tiền đặt cọc", "noun", "请问入住需要预交多少押金？", "Qǐngwèn rùzhù xūyào yùjiāo duōshao yājīn?", "Xin hỏi nhận phòng cần nộp trước bao nhiêu tiền cọc?"),
				new AiVocabAutofillItemDto("前台", "qiántái", "quầy lễ tân", "noun", "如果房间有任何问题，随时拨打前台电话。", "Rúguǒ fángjiān yǒu rènhé wèntí, suíshí bōdǎ qiántái diànhuà.", "Nếu phòng có bất kỳ vấn đề gì, hãy gọi ngay cho quầy lễ tân."),
				new AiVocabAutofillItemDto("行李", "xíngli", "hành lý", "noun", "退房后可以把大件行李寄存在酒店前台吗？", "Tuìfáng hòu kěyǐ bǎ dàjiàn xíngli jìcún zài jiǔdiàn qiántái ma?", "Sau khi trả phòng có thể gửi hành lý cồng kềnh ở quầy lễ tân không?"),
				new AiVocabAutofillItemDto("景点", "jǐngdiǎn", "điểm tham quan / danh lam", "noun", "北京有很多著名的历史文化名胜景点。", "Běijīng yǒu hěn duō zhùmíng de lìshǐ wénhuà míngshèng jǐngdiǎn.", "Bắc Kinh có rất nhiều điểm tham quan danh thắng lịch sử văn hóa nổi tiếng."),
				new AiVocabAutofillItemDto("门票", "ménpiào", "vé vào cửa", "noun", "故宫博物院的门票需要提前网上实名预约。", "Gùgōng Bówùyuàn de ménpiào xūyào tíqián wǎngshang shímíng yùyuē.", "Vé Bảo tàng Cố Cung cần đặt trước bằng tên thật trên mạng."),
				new AiVocabAutofillItemDto("导游", "dǎoyóu", "hướng dẫn viên du lịch", "noun", "导游用流利的中文为我们讲解长城的历史。", "Dǎoyóu yòng liúlì de Zhōngwén wèi wǒmen jiǎngjiě Chángchéng de lìshǐ.", "Hướng dẫn viên dùng tiếng Trung lưu loát để thuyết minh lịch sử Vạn Lý Trường Thành."),
				new AiVocabAutofillItemDto("拍照", "pāizhào", "chụp ảnh", "verb", "这里的自然风景太美了，我们合影拍照吧。", "Zhèlǐ de zìrán fēngjǐng tài měi le, wǒmen héyǐng pāizhào ba.", "Phong cảnh thiên nhiên ở đây đẹp quá, chúng ta cùng chụp ảnh kỷ niệm đi."),
				new AiVocabAutofillItemDto("纪念品", "jìniànpǐn", "đồ lưu niệm", "noun", "我在景区商店买了很多传统手工艺纪念品。", "Wǒ zài jǐngqū shāngdiàn mǎi le hěn duō chuántǒng shǒugōngyì jìniànpǐn.", "Tôi đã mua rất nhiều đồ lưu niệm thủ công truyền thống ở cửa hàng khu du lịch."),
				new AiVocabAutofillItemDto("早餐", "zǎocān", "bữa sáng", "noun", "房费里包含了每天的双人自助早餐。", "Fángfèi lǐ bāohán le měitiān de shuāngrén zìzhù zǎocān.", "Tiền phòng đã bao gồm bữa sáng buffet cho 2 người mỗi ngày."),
				new AiVocabAutofillItemDto("单人房", "dānrénfáng", "phòng đơn", "noun", "我想预订一间采光好的大床单人房。", "Wǒ xiǎng yùdìng yì jiān cǎiguāng hǎo de dàchuáng dānrénfáng.", "Tôi muốn đặt một phòng đơn giường lớn có ánh sáng tốt."),
				new AiVocabAutofillItemDto("旅游", "lǚyóu", "đi du lịch", "verb", "今年暑假我想和全家人一起去云南旅游。", "Jīnnián shǔjià wǒ xiǎng hé quánjiārén yìqǐ qù Yúnnán lǚyóu.", "Nghỉ hè năm nay tôi muốn cùng cả gia đình đi du lịch Vân Nam."),
				new AiVocabAutofillItemDto("无线网", "wúxiànwǎng", "mạng Wi-Fi", "noun", "请问客房里的免费无线网密码是什么？", "Qǐngwèn kèfáng lǐ de miǎnfèi wúxiànwǎng mìmǎ shì shénme?", "Xin hỏi mật khẩu Wi-Fi miễn phí trong phòng khách là gì?"),
				new AiVocabAutofillItemDto("叫醒服务", "jiàoxǐng fúwù", "dịch vụ báo thức", "noun", "请帮我安排明天早上六点半的叫醒服务。", "Qǐng bāng wǒ ānpái míngtiān zǎoshang liù diǎn bàn de jiàoxǐng fúwù.", "Xin giúp tôi sắp xếp dịch vụ báo thức lúc 6 rưỡi sáng mai."),
				new AiVocabAutofillItemDto("空调", "kōngtiáo", "điều hòa", "noun", "房间里的中央空调可以自由调节温度。", "Fángjiān lǐ de zhōngyāng kōngtiáo kěyǐ zìyóu tiáojié wēndù.", "Điều hòa trung tâm trong phòng có thể tự do điều chỉnh nhiệt độ."),
				new AiVocabAutofillItemDto("吹风机", "chuīfēngjī", "máy sấy tóc", "noun", "卫生间抽屉里配有大功率吹风机。", "Wèishēngjiān chōuti lǐ pèiyǒu dà gōnglǜ chuīfēngjī.", "Trong ngăn kéo nhà vệ sinh có trang bị máy sấy tóc công suất lớn.")
		);
		registerTopic("HOTEL_TRAVEL", hotelList);

		// 3. SÂN BAY & DI CHUYỂN
		List<AiVocabAutofillItemDto> airportList = List.of(
				new AiVocabAutofillItemDto("机场", "jīchǎng", "sân bay", "noun", "我们必须提前两个小时到达国际机场。", "Wǒmen bìxū tíqián liǎng gè xiǎoshí dàodá guójì jīchǎng.", "Chúng tôi phải đến sân bay quốc tế trước hai tiếng đồng hồ."),
				new AiVocabAutofillItemDto("登机牌", "dēngjīpái", "thẻ lên máy bay", "noun", "请准备好您的护照和电子登机牌。", "Qǐng zhǔnbèi hǎo nín de hùzhào hé diànzǐ dēngjīpái.", "Xin chuẩn bị sẵn hộ chiếu và thẻ lên máy bay điện tử của quý khách."),
				new AiVocabAutofillItemDto("登机口", "dēngjīkǒu", "cửa lên máy bay (gate)", "noun", "本次航班的登机口变更为B24号。", "Běncì hángbān de dēngjīkǒu biàngēng wèi B24 hào.", "Cửa lên máy bay của chuyến bay này đổi sang cổng B24."),
				new AiVocabAutofillItemDto("安检", "ānjiǎn", "kiểm tra an ninh", "noun", "随身携带的笔记本电脑需要拿出来过安检。", "Suíshēn xiédài de bǐjìběn diànnǎo xūyào ná chūlái guò ānjiǎn.", "Máy tính xách tay mang theo người cần bỏ ra ngoài để qua cửa an ninh."),
				new AiVocabAutofillItemDto("托运", "tuōyùn", "ký gửi (hành lý)", "verb", "您的超重行李需要办理托运手续。", "Nín de chāozhòng xíngli xūyào bànlǐ tuōyùn shǒuxù.", "Hành lý quá cân của quý khách cần làm thủ tục ký gửi."),
				new AiVocabAutofillItemDto("延误", "yánwù", "trễ / hoãn chuyến", "verb", "因为雷雨天气，今晚的航班延误了一小时。", "Yīnwèi léiyǔ tiānqì, jīnwǎn de hángbān yánwù le yì xiǎoshí.", "Vì thời tiết mưa giông, chuyến bay tối nay bị hoãn một tiếng."),
				new AiVocabAutofillItemDto("起飞", "qǐfēi", "cất cánh", "verb", "飞机将在二十分钟后准时起飞。", "Fēijī jiāng zài èrshí fēnzhōng hòu zhǔnshí qǐfēi.", "Máy bay sẽ cất cánh đúng giờ sau 20 phút nữa."),
				new AiVocabAutofillItemDto("降落", "jiàngluò", "hạ cánh", "verb", "飞机已平安降落在上海浦东国际机场。", "Fēijī yǐ píng'ān jiàngluò zài Shànghǎi Pǔdōng Guójì Jīchǎng.", "Máy bay đã hạ cánh an toàn xuống sân bay quốc tế Phố Đông Thượng Hải."),
				new AiVocabAutofillItemDto("航站楼", "hángzhànlóu", "nhà ga sân bay (terminal)", "noun", "国际航线请前往二号航站楼三层出发大厅。", "Guójì hángxiàn qǐng qiánwǎng èrhào hángzhànlóu sān céng chūfā dàtīng.", "Các tuyến bay quốc tế xin đến sảnh khởi hành tầng 3 Nhà ga T2."),
				new AiVocabAutofillItemDto("海关", "hǎiguān", "hải quan", "noun", "入境时需要向海关出示申报单。", "Rùjìng shí xūyào xiàng hǎiguān chūshì shēnbàodān.", "Khi nhập cảnh cần xuất trình tờ khai báo cho hải quan."),
				new AiVocabAutofillItemDto("靠窗", "kàochuāng", "sát cửa sổ", "adjective", "请问您想要靠窗还是靠走道的座位？", "Qǐngwèn nín xiǎng yào kàochuāng háishi kào zǒudào de zuòwèi?", "Xin hỏi quý khách muốn ghế sát cửa sổ hay sát lối đi?"),
				new AiVocabAutofillItemDto("转机", "zhuǎnjī", "quá cảnh / chuyển máy bay", "verb", "我们要在广州白云机场中转机停留三小时。", "Wǒmen yào zài Guǎngzhōu Báiyún Jīchǎng zhōngzhuǎnjī tíngliú sān xiǎoshí.", "Chúng tôi cần quá cảnh ở sân bay Bạch Vân Quảng Châu trong 3 tiếng."),
				new AiVocabAutofillItemDto("航班", "hángbān", "chuyến bay", "noun", "请问飞往北京的下一个航班几点起飞？", "Qǐngwèn fēi wǎng Běijīng de xià yí gè hángbān jǐ diǎn qǐfēi?", "Xin hỏi chuyến bay tiếp theo đi Bắc Kinh mấy giờ cất cánh?"),
				new AiVocabAutofillItemDto("高铁", "gāotiě", "tàu cao tốc", "noun", "乘坐高铁从北京到上海只需四个多小时。", "Chéngzuò gāotiě cóng Běijīng dào Shànghǎi zhǐ xū sì gè duō xiǎoshí.", "Đi tàu cao tốc từ Bắc Kinh đến Thượng Hải chỉ mất hơn 4 tiếng."),
				new AiVocabAutofillItemDto("地铁", "dìtiě", "tàu điện ngầm", "noun", "机场快轨地铁直达市中心商业区。", "Jīchǎng kuàiguǐ dìtiě zhídá shìzhōngxīn shāngyèqū.", "Tuyến tàu điện ngầm tốc hành sân bay đi thẳng tới khu thương mại trung tâm."),
				new AiVocabAutofillItemDto("出租车", "chūzūchē", "xe taxi", "noun", "航站楼一楼出口有专门的出租车站台。", "Hángzhànlóu yīlóu chūkǒu yǒu zhuānmén de chūzūchē zhàntái.", "Cửa ra tầng 1 nhà ga có điểm đón xe taxi riêng."),
				new AiVocabAutofillItemDto("免税店", "miǎnshuìdiàn", "cửa hàng miễn thuế", "noun", "候机大厅内有很多知名品牌的免税店。", "Hòujī dàtīng nèi yǒu hěn duō zhīmíng pǐnpái de miǎnshuìdiàn.", "Trong sảnh chờ máy bay có rất nhiều cửa hàng miễn thuế thương hiệu lớn."),
				new AiVocabAutofillItemDto("行李转盘", "xíngli zhuànpán", "băng chuyền hành lý", "noun", "请在八号行李转盘耐心等待领取行李。", "Qǐng zài bāhào xíngli zhuànpán nàixīn děngdài lǐngqǔ xíngli.", "Xin kiên nhẫn chờ lấy hành lý tại băng chuyền số 8."),
				new AiVocabAutofillItemDto("票价", "piàojià", "giá vé", "noun", "非旅游旺季的往返机票价格相当优惠。", "Fēi lǚyóu wàngjì de wǎngfǎn jīpiào jiàgé xiāngdāng yōuhuì.", "Giá vé máy bay khứ hồi vào mùa thấp điểm du lịch khá ưu đãi."),
				new AiVocabAutofillItemDto("顺利", "shùnlì", "thuận lợi / suôn sẻ", "adjective", "祝您本次旅行一路平安，万事顺利！", "Zhù nín běncì lǚxíng yílù píng'ān, wànshì shùnlì!", "Chúc quý khách chuyến đi lần này thượng lộ bình an, mọi điều suôn sẻ!")
		);
		registerTopic("AIRPORT_TRANSPORT", airportList);

		// 4. MUA SẮM & TRẢ GIÁ
		List<AiVocabAutofillItemDto> shoppingList = List.of(
				new AiVocabAutofillItemDto("多少钱", "duōshao qián", "bao nhiêu tiền", "phrase", "老板，请问这件纯棉外套多少钱？", "Lǎobǎn, qǐngwèn zhè jiàn chúnmián wàitào duōshao qián?", "Ông chủ ơi, xin hỏi chiếc áo khoác cotton này bao nhiêu tiền?"),
				new AiVocabAutofillItemDto("便宜", "piányi", "rẻ", "adjective", "太贵了，能不能再给我们算便宜一点？", "Tài guì le, néng bù néng zài gěi wǒmen suàn piányi yìdiǎn?", "Đắt quá, có thể tính rẻ hơn cho chúng tôi một chút được không?"),
				new AiVocabAutofillItemDto("打折", "dǎzhé", "giảm giá / khuyến mãi", "verb", "这家商场正在搞店庆，全场服装打七折。", "Zhè jiā shāngchǎng zhèngzài gǎo diànqìng, quánchǎng fúzhuāng dǎ qīzhé.", "Trung tâm thương mại này đang kỷ niệm ngày mở cửa, giảm giá 30% toàn bộ quần áo."),
				new AiVocabAutofillItemDto("试穿", "shìchuān", "thử đồ / mặc thử", "verb", "请问试衣间在哪里？我可以试穿一下吗？", "Qǐngwèn shìyījiān zài nǎlǐ? Wǒ kěyǐ shìchuān yíxià ma?", "Xin hỏi phòng thử đồ ở đâu? Tôi có thể mặc thử một chút được không?"),
				new AiVocabAutofillItemDto("尺码", "chǐmǎ", "kích cỡ / size", "noun", "这双鞋穿起来有点紧，有大一号的尺码吗？", "Zhè shuāng xié chuān qǐlái yǒudiǎn jǐn, yǒu dà yí hào de chǐmǎ ma?", "Đôi giày này đi hơi chật, có size lớn hơn một số không?"),
				new AiVocabAutofillItemDto("刷卡", "shuākǎ", "quẹt thẻ", "verb", "请问结账时可以刷国际信用卡吗？", "Qǐngwèn jiézhàng shí kěyǐ shuā guójì xìnyòngkǎ ma?", "Xin hỏi khi thanh toán có thể quẹt thẻ tín dụng quốc tế không?"),
				new AiVocabAutofillItemDto("现金", "xiànjīn", "tiền mặt", "noun", "您如果使用现金支付，请准备好零钱。", "Nín rúguǒ shǐyòng xiànjīn zhīfù, qǐng zhǔnbèi hǎo língqián.", "Nếu quý khách thanh toán bằng tiền mặt, xin chuẩn bị sẵn tiền lẻ."),
				new AiVocabAutofillItemDto("质量", "zhìliàng", "chất lượng", "noun", "这款真皮背包做工精细，质量很有保障。", "Zhè kuǎn zhēnpí bèibāo zuògōng jīngxì, zhìliàng hěn yǒu bǎozhàng.", "Chiếc balo da thật này gia công tỉ mỉ, chất lượng rất đảm bảo."),
				new AiVocabAutofillItemDto("发票", "fāpiào", "hóa đơn đỏ", "noun", "付款完成后请在前台为您开具电子发票。", "Fùkuǎn wánchéng hòu qǐng zài qiántái wèi nín kāijù diànzǐ fāpiào.", "Sau khi hoàn tất thanh toán, xin liên hệ quầy xuất hóa đơn điện tử cho bạn."),
				new AiVocabAutofillItemDto("退换", "tuìhuàn", "đổi trả hàng", "verb", "商品未拆封的情况下，七天内支持免费退换。", "Shāngpǐn wèi chāifēng de qíngkuàng xià, qī tiān nèi zhīchí miǎnfèi tuìhuàn.", "Trong trường hợp hàng chưa bóc tem, trong vòng 7 ngày được hỗ trợ đổi trả miễn phí."),
				new AiVocabAutofillItemDto("零钱", "língqián", "tiền lẻ", "noun", "收您一百元，找您二十五元零钱。", "Shōu nín yìbǎi yuán, zhǎo nín èrshíwǔ yuán língqián.", "Nhận của bạn 100 tệ, thối lại bạn 25 tệ tiền lẻ."),
				new AiVocabAutofillItemDto("颜色", "yánsè", "màu sắc", "noun", "这种款式除了白色，还有深蓝色和粉色。", "Zhè zhǒng kuǎnshì chúle báisè, hái yǒu shēnlánsè hé fěnsè.", "Kiểu dáng này ngoài màu trắng ra, còn có màu xanh đậm và màu hồng."),
				new AiVocabAutofillItemDto("结账", "jiézhàng", "thanh toán", "verb", "请排队在收银台有序结账。", "Qǐng páiduì zài shōuyíntái yǒuxù jiézhàng.", "Xin vui lòng xếp hàng trật tự tại quầy thu ngân để thanh toán."),
				new AiVocabAutofillItemDto("优惠券", "yōuhuìquàn", "phiếu giảm giá / coupon", "noun", "手机扫描二维码即可领取满两百减五十优惠券。", "Shǒujī sǎomiáo èrwèimǎ jíkě lǐngqǔ mǎn liǎngbǎi jiǎn wǔshí yōuhuìquàn.", "Dùng điện thoại quét mã QR là có thể nhận phiếu giảm giá 50 tệ cho đơn từ 200 tệ."),
				new AiVocabAutofillItemDto("赠品", "zèngpǐn", "quà tặng kèm", "noun", "今天购买两盒茶叶即可获赠一套精美茶具。", "Jīntiān gòumǎi liǎng hé cháyè jíkě huòzèng yí tào jīngměi chájù.", "Hôm nay mua 2 hộp trà sẽ được tặng kèm một bộ dụng cụ pha trà đẹp mắt."),
				new AiVocabAutofillItemDto("逛街", "guàngjiē", "dạo phố mua sắm", "verb", "周末很多人喜欢去步行街逛街休闲。", "Zhōumò hěn duō rén xǐhuan qù bùxíngjiē guàngjiē xiūxián.", "Cuối tuần rất nhiều người thích đi dạo phố đi bộ mua sắm thư giãn."),
				new AiVocabAutofillItemDto("物美价廉", "wùměi jiàlián", "hàng tốt giá rẻ", "idiom", "夜市上的小商品种类繁多且物美价廉。", "Yèshì shang de xiǎoshāngpǐn zhǒnglèi fánduō qiě wùměi jiàlián.", "Hàng hóa nhỏ ở chợ đêm chủng loại phong phú mà lại chất lượng tốt giá rẻ."),
				new AiVocabAutofillItemDto("专柜", "zhuānguì", "quầy hàng chính hãng", "noun", "商场一楼设有许多国际知名护肤品专柜。", "Shāngchǎng yīlóu shèyǒu xǔduō guójì zhīmíng hùfūpǐn zhuānguì.", "Tầng 1 trung tâm thương mại có nhiều quầy mỹ phẩm dưỡng da nổi tiếng quốc tế."),
				new AiVocabAutofillItemDto("购物袋", "gòuwùdài", "túi đựng đồ", "noun", "为了保护环境，请尽量自备环保购物袋。", "Wèile bǎohù huánjìng, qǐng jǐnliàng zìbèi huánbǎo gòuwùdài.", "Để bảo vệ môi trường, xin vui lòng tự mang theo túi mua sắm thân thiện."),
				new AiVocabAutofillItemDto("售货员", "shòuhuòyuán", "nhân viên bán hàng", "noun", "售货员热情地向我们介绍了最新款式的智能手表。", "Shòuhuòyuán rèqíng de xiàng wǒmen jièshào le zuìxīn kuǎnshì de zhìnéng shǒubiǎo.", "Nhân viên bán hàng nhiệt tình giới thiệu cho chúng tôi mẫu đồng hồ thông minh mới nhất.")
		);
		registerTopic("SHOPPING", shoppingList);

		// 5. CÔNG SỞ & PHỎNG VẤN
		List<AiVocabAutofillItemDto> workplaceList = List.of(
				new AiVocabAutofillItemDto("面试", "miànshì", "phỏng vấn", "noun", "我明天上午九点要去一家大型外企参加正式面试。", "Wǒ míngtiān shàngwǔ jiǔ diǎn yào qù yì jiā dàxíng wàiqǐ cānjiā zhèngshì miànshì.", "9 giờ sáng mai tôi phải đến một doanh nghiệp nước ngoài lớn để tham gia phỏng vấn chính thức."),
				new AiVocabAutofillItemDto("简历", "jiǎnlì", "sơ yếu lý lịch / CV", "noun", "请在求职邮件中附上最新的中文简历。", "Qǐng zài qiúzhí yóujiàn zhōng fùshàng zuìxīn de Zhōngwén jiǎnlì.", "Xin đính kèm sơ yếu lý lịch tiếng Trung mới nhất trong thư ứng tuyển."),
				new AiVocabAutofillItemDto("同事", "tóngshì", "đồng nghiệp", "noun", "新团队里的同事们都很友好，工作氛围很棒。", "Xīn tuánduì lǐ de tóngshìmen dōu hěn yǒuhǎo, gōngzuò fēnwéi hěn bàng.", "Các đồng nghiệp trong nhóm mới đều rất thân thiện, bầu không khí làm việc rất tuyệt."),
				new AiVocabAutofillItemDto("开会", "kāihuì", "họp hành", "verb", "部门经理通知大家下午两点半在二号会议室开会。", "Bùmén jīnglǐ tōngzhī dàjiā xiàwǔ liǎng diǎn bàn zài èrhào huìyìshì kāihuì.", "Trưởng phòng thông báo mọi người 2 rưỡi chiều họp tại phòng hội nghị số 2."),
				new AiVocabAutofillItemDto("薪水", "xīnshui", "tiền lương / thu nhập", "noun", "这份工作提供的基本薪水和年终奖金都很合理。", "Zhè fèn gōngzuò tígōng de jīběn xīnshui hé niánzhōng jiǎngjīn dōu hěn hélǐ.", "Công việc này cung cấp mức lương cơ bản và thưởng cuối năm rất hợp lý."),
				new AiVocabAutofillItemDto("加班", "jiābān", "làm thêm giờ / tăng ca", "verb", "为了赶在月底前上线新系统，研发部本周需要加班。", "Wèile gǎn zài yuèdǐ qián shàngxiàn xīn xìtǒng, yánfābù běn zhōu xūyào jiābān.", "Để kịp đưa hệ thống mới lên trước cuối tháng, phòng R&D tuần này cần tăng ca."),
				new AiVocabAutofillItemDto("职责", "zhízé", "trách nhiệm / nhiệm vụ", "noun", "请详细说明一下您在这个岗位上的核心工作职责。", "Qǐng xiángxì shuōmíng yíxià nín zài zhège gǎngwèi shang de héxīn gōngzuò zhízé.", "Xin giải thích chi tiết về các trách nhiệm công việc cốt lõi của bạn ở vị trí này."),
				new AiVocabAutofillItemDto("报告", "bàogào", "báo cáo", "noun", "财务部已经完成了第三季度的公司财务收支报告。", "Cáiwùbù yǐjīng wánchéng le dì-sān jìdù de gōngsī cáiwù shōuzhī bàogào.", "Phòng tài chính đã hoàn thành báo cáo thu chi tài chính quý 3 của công ty."),
				new AiVocabAutofillItemDto("经验", "jīngyàn", "kinh nghiệm", "noun", "他在跨国贸易领域积累了超过八年的宝贵管理经验。", "Tā zài kuàguó màoyì lǐngyù jīlěi le chāoguò bā nián de bǎoguì guǎnlǐ jīngyàn.", "Anh ấy đã tích lũy hơn 8 năm kinh nghiệm quản lý quý báu trong lĩnh vực thương mại đa quốc gia."),
				new AiVocabAutofillItemDto("合同", "hétong", "hợp đồng", "noun", "法务部门已经审核完毕本次战略合作协议合同。", "Fǎwù bùmén yǐjīng shěnhé wánbì běncì zhànlüè hézuò xiéyì hétong.", "Phòng pháp chế đã thẩm định xong hợp đồng thỏa thuận hợp tác chiến lược lần này."),
				new AiVocabAutofillItemDto("出差", "chūchāi", "đi công tác", "verb", "下周业务总监将带领两名商务代表出差前往北京。", "Xiàzhōu yèwù zǒngjiān jiāng dàilǐng liǎng míng shāngwù dàibiǎo chūchāi qiánwǎng Běijīng.", "Tuần tới Giám đốc kinh doanh sẽ dẫn 2 đại diện thương mại đi công tác Bắc Kinh."),
				new AiVocabAutofillItemDto("请假", "qǐngjià", "xin nghỉ phép", "verb", "如果身体不适，请提前在人事系统提交请假申请。", "Rúguǒ shēntǐ búlshì, qǐng tíqián zài rénshì xìtǒng tíjiāo qǐngjià shēnqǐng.", "Nếu cơ thể không khỏe, xin vui lòng nộp đơn xin nghỉ phép trước trên hệ thống nhân sự."),
				new AiVocabAutofillItemDto("培训", "péixùn", "đào tạo / tập huấn", "noun", "公司每周五下午都会举办专业技能进阶培训。", "Gōngsī měi zhōuwǔ xiàwǔ dōu huì jǔbàn zhuānyè jìnéng jìnjiē péixùn.", "Công ty tổ chức tập huấn nâng cao kỹ năng chuyên môn vào chiều thứ Sáu hàng tuần."),
				new AiVocabAutofillItemDto("客户", "kèhù", "khách hàng", "noun", "及时跟进客户的反馈是提高服务满意度的关键。", "Jíshí gēnjìn kèhù de fǎnkuì shì tígāo fúwù mǎnyìdù de guānjiàn.", "Theo sát kịp thời phản hồi của khách hàng là mấu chốt nâng cao sự hài lòng dịch vụ."),
				new AiVocabAutofillItemDto("方案", "fāng'àn", "phương án / kế hoạch", "noun", "策划团队提出的新营销方案得到了管理层的一致好评。", "Cèhuà tuánduì tíchū de xīn yíngxiāo fāng'àn dédào le guǎnlǐcéng de yízhì hǎopíng.", "Phương án tiếp thị mới do đội ngũ kế hoạch đề xuất đã nhận được đánh giá cao từ ban quản lý."),
				new AiVocabAutofillItemDto("效率", "xiàolǜ", "hiệu suất / hiệu quả", "noun", "合理优化工作流程能够成倍提高整个团队的办公效率。", "Hélǐ yōuhuà gōngzuò liúchéng nénggòu chéngbèi tígāo zhěnggè tuánduì de bàngōng xiàolǜ.", "Tối ưu hóa quy trình làm việc hợp lý có thể tăng gấp bội hiệu suất làm việc của toàn nhóm."),
				new AiVocabAutofillItemDto("目标", "mùbiāo", "mục tiêu", "noun", "我们要紧密协作，确保顺利达成今年的年度销售目标。", "Wǒmen yào jǐnmì xiézuò, quèbǎo shùnlì dáchéng jīnnián de niándù xiāoshòu mùbiāo.", "Chúng ta cần hợp tác chặt chẽ để đảm bảo hoàn thành mục tiêu doanh số cả năm."),
				new AiVocabAutofillItemDto("升职", "shēngzhí", "thăng chức", "verb", "由于他在重点项目中的卓越表现，上个月获得了升职加薪。", "Yóuyú tā zài zhòngdiǎn xiàngmù zhōng de zhuóyuè biǎoxiàn, shàng gè yuè huòdé le shēngzhí jiāxīn.", "Nhờ biểu hiện xuất sắc trong dự án trọng điểm, tháng trước anh ấy đã được thăng chức tăng lương."),
				new AiVocabAutofillItemDto("离职", "lízhí", "nghỉ việc", "verb", "员工在正式离职前需要向交接人做好交接工作。", "Yuángōng zài zhèngshì lízhí qián xūyào xiàng jiāojiērén zuò hǎo jiāojiē gōngzuò.", "Nhân viên trước khi chính thức nghỉ việc cần làm tốt công tác bàn giao cho người tiếp nhận."),
				new AiVocabAutofillItemDto("合作", "hézuò", "hợp tác", "verb", "我们非常珍惜与贵公司长达五年的友好合作关系。", "Wǒmen fēicháng zhēnxī yǔ guì gōngsī cháng dá wǔ nián de yǒuhǎo hézuò guānxì.", "Chúng tôi rất trân trọng mối quan hệ hợp tác hữu nghị kéo dài suốt 5 năm qua với quý công ty.")
		);
		registerTopic("WORKPLACE_INTERVIEW", workplaceList);

		// 6. HỎI ĐƯỜNG & GIAO THÔNG
		List<AiVocabAutofillItemDto> trafficList = List.of(
				new AiVocabAutofillItemDto("怎么走", "zěnme zǒu", "đi như thế nào", "phrase", "请问去最近的地铁站应该怎么走？", "Qǐngwèn qù zuì jìn de dìtiězhàn yīnggāi zěnme zǒu?", "Xin hỏi đến ga tàu điện ngầm gần nhất thì nên đi như thế nào?"),
				new AiVocabAutofillItemDto("往左拐", "wǎng zuǒ guǎi", "rẽ trái", "phrase", "走到前面的十字路口然后往左拐就到了。", "Zǒu dào qiánmiàn de shízì lùkǒu ránhòu wǎng zuǒ guǎi jiù dào le.", "Đi tới ngã tư phía trước rồi rẽ trái là tới nơi."),
				new AiVocabAutofillItemDto("往右拐", "wǎng yòu guǎi", "rẽ phải", "phrase", "经过那个大药房后向右拐，目的地就在右手边。", "Jīngguò nà gè dàyàofáng hòu xiàng yòu guǎi, mùdìdì jiù zài yòushǒubiān.", "Đi qua hiệu thuốc lớn đó rồi rẽ phải, điểm đến ở ngay bên tay phải."),
				new AiVocabAutofillItemDto("直走", "zhí zǒu", "đi thẳng", "verb", "沿着这条步行街一直往前走大约两百米。", "Yánzhe zhè tiáo bùxíngjiē yìzhí wǎng qián zǒu dàyuē liǎngbǎi mǐ.", "Dọc theo con phố đi bộ này đi thẳng về phía trước khoảng 200 mét."),
				new AiVocabAutofillItemDto("红绿灯", "hónglǜdēng", "đèn giao thông", "noun", "在第二个红绿灯路口向右转入主干道。", "Zài dì-èr gè hónglǜdēng lùkǒu xiàng yòu zhuǎnrù zhǔgàndào.", "Tại ngã rẽ đèn giao thông thứ hai rẽ phải vào đường chính."),
				new AiVocabAutofillItemDto("公共汽车", "gōnggòng qìchē", "xe buýt công cộng", "noun", "您可以在马路对面乘坐108路公共汽车直达博物馆。", "Nín kěyǐ zài mǎlù duìmiàn chéngzuò yāolíngbā lù gōnggòng qìchē zhídá bówùguǎn.", "Bạn có thể bắt tuyến xe buýt 108 ở bên kia đường đi thẳng đến bảo tàng."),
				new AiVocabAutofillItemDto("换乘", "huànchéng", "đổi tuyến / chuyển tàu xe", "verb", "在人民广场站下车换乘地铁二号线。", "Zài Rénmín Guǎngchǎng zhàn xiàchē huànchéng dìtiě èrhào xiàn.", "Xuống ga Quảng trường Nhân dân để đổi sang tuyến tàu điện ngầm số 2."),
				new AiVocabAutofillItemDto("堵车", "dǔchē", "kẹt xe / tắc đường", "verb", "现在正赶上下班交通晚高峰，路上有点堵车。", "Xiànzài zhèng gǎnshang xiàbān jiāotōng wǎn gāofēng, lùshang yǒudiǎn dǔchē.", "Bây giờ đang đúng lúc cao điểm tan tầm buổi chiều, trên đường hơi tắc xe."),
				new AiVocabAutofillItemDto("远", "yuǎn", "xa", "adjective", "请问这里离高铁东站远不远？", "Qǐngwèn zhèlǐ lí gāotiě dōngzhàn yuǎn bù yuǎn?", "Xin hỏi ở đây cách ga tàu cao tốc phía Đông xa không?"),
				new AiVocabAutofillItemDto("近", "jìn", "gần", "adjective", "很近，穿过这条地下通道步行两分钟就到。", "Hěn jìn, chuānguò zhè tiáo dìxià tōngdào bùxíng liǎng fēnzhōng jiù dào.", "Rất gần, đi qua đường hầm dành cho người đi bộ này mất 2 phút là tới."),
				new AiVocabAutofillItemDto("迷路", "mílù", "lạc đường", "verb", "不好意思，我第一次来这片区域，有点迷路了。", "Bù hǎoyìsi, wǒ dì-yī cì lái zhè piàn qūyù, yǒudiǎn mílù le.", "Ngại quá, tôi lần đầu tiên tới khu vực này nên hơi bị lạc đường."),
				new AiVocabAutofillItemDto("斑马线", "bānmǎxiàn", "vạch kẻ qua đường", "noun", "行人横穿马路时请务必走斑马线。", "Xíngrén héngchuān mǎlù shí qǐng wùbì zǒu bānmǎxiàn.", "Người đi bộ khi sang đường xin nhất định phải đi trên vạch sang đường."),
				new AiVocabAutofillItemDto("出租车站", "chūzūchēzhàn", "điểm đón taxi", "noun", "火车站广场西侧设有正规的出租车乘车点。", "Huǒchēzhàn guǎngchǎng xīcè shèyǒu zhèngguī de chūzūchē chéngchēdiǎn.", "Phía tây quảng trường ga tàu có điểm đón taxi chính thống."),
				new AiVocabAutofillItemDto("附近", "fùjìn", "gần đây / lân cận", "noun", "请问这附近有没有二十四小时营业的便利店？", "Qǐngwèn zhè fùjìn yǒu méiyǒu èrshísì xiǎoshí yíngyè de biànlìdiàn?", "Xin hỏi gần đây có cửa hàng tiện lợi mở cửa 24/24 không?"),
				new AiVocabAutofillItemDto("导航", "dǎoháng", "định vị / dẫn đường", "noun", "按照手机地图导航的路线指引走，不会走错。", "Ànzhào shǒujī dìtú dǎoháng de lùxiàn zhǐyǐn zǒu, bú huì zǒu cuò.", "Đi theo chỉ dẫn lộ trình định vị của bản đồ trên điện thoại sẽ không bị đi nhầm."),
				new AiVocabAutofillItemDto("末班车", "mòbānchē", "chuyến xe cuối", "noun", "末班地铁将在晚上十一点半停止运营。", "Mòbān dìtiě jiāng zài wǎnshang shíyī diǎn bàn tíngzhǐ yùnyíng.", "Chuyến tàu điện ngầm cuối cùng sẽ dừng hoạt động lúc 11 rưỡi tối."),
				new AiVocabAutofillItemDto("人行天桥", "rénxíng tiānqiáo", "cầu vượt bộ hành", "noun", "你可以走前方的绿色人行天桥穿过立交桥。", "Nǐ kěyǐ zǒu qiánfāng de lǜsè rénxíng tiānqiáo chuānguò lìjiāoqiáo.", "Bạn có thể đi qua chiếc cầu vượt bộ hành màu xanh phía trước để qua cầu vượt."),
				new AiVocabAutofillItemDto("路口", "lùkǒu", "ngã rẽ / giao lộ", "noun", "在下一个路口往北走，就能看到标志性建筑。", "Zài xià yí gè lùkǒu wǎng běi zǒu, jiù néng kàndào biāozhìxìng jiànzhù.", "Tại ngã rẽ tiếp theo đi về hướng bắc là có thể nhìn thấy tòa nhà biểu tượng."),
				new AiVocabAutofillItemDto("交通卡", "jiāotōngkǎ", "thẻ giao thông công cộng", "noun", "在各大地铁站服务窗口都可以办理充值交通卡。", "Zài gè dà dìtiězhàn fúwù chuāngkǒu dōu kěyǐ bànlǐ chōngzhí jiāotōngkǎ.", "Tại quầy phục vụ của các ga tàu lớn đều có thể làm thủ tục nạp tiền thẻ giao thông."),
				new AiVocabAutofillItemDto("安全", "ānquán", "an toàn", "adjective", "出门在外遵守交通规则，时刻注意人身安全。", "Chūmén zàiwài zūnshǒu jiāotōng guīzé, shíkè zhùyì rénshēn ānquán.", "Đi ra ngoài hãy tuân thủ luật giao thông, luôn luôn chú ý an toàn bản thân.")
		);
		registerTopic("DIRECTIONS_TRAFFIC", trafficList);

		// 7. Y TẾ & SỨC KHỎE
		List<AiVocabAutofillItemDto> healthList = List.of(
				new AiVocabAutofillItemDto("医院", "yīyuàn", "bệnh viện", "noun", "如果不舒服，我们应该尽快去综合医院检查。", "Rúguǒ bù shūfu, wǒmen yīnggāi jǐnkuài qù zōnghé yīyuàn jiǎnchá.", "Nếu không khỏe, chúng ta nên nhanh chóng đến bệnh viện đa khoa khám."),
				new AiVocabAutofillItemDto("医生", "yīshēng", "bác sĩ", "noun", "医生耐心地询问了病人的症状和病史。", "Yīshēng nàixīn de xúnwèn le bìngrén de zhèngzhuàng hé bìngshǐ.", "Bác sĩ kiên nhẫn hỏi han các triệu chứng và tiền sử bệnh của bệnh nhân."),
				new AiVocabAutofillItemDto("感冒", "gǎnmào", "cảm cúm", "noun/verb", "换季时气温变化大，容易着凉感冒。", "Huànjì shí qìwēn biànhuà dà, róngyì zháoliáng gǎnmào.", "Lúc giao mùa nhiệt độ thay đổi lớn, rất dễ bị nhiễm lạnh cảm cúm."),
				new AiVocabAutofillItemDto("发烧", "fāshāo", "phát sốt / bị sốt", "verb", "孩子昨天晚上突然发烧到了三十八度五。", "Háizi zuótiān wǎnshang tūrán fāshāo dào le sānshíbā dù wǔ.", "Đứa bé tối qua đột nhiên phát sốt lên tới 38 độ rưỡi."),
				new AiVocabAutofillItemDto("头疼", "tóuténg", "đau đầu", "adjective", "吹了冷风之后，他感觉有点头疼恶心。", "Chuī le lěngfēng zhīhòu, tā gǎnjué yǒudiǎn tóuténg ěxīn.", "Sau khi trúng gió lạnh, anh ấy cảm thấy hơi đau đầu buồn nôn."),
				new AiVocabAutofillItemDto("吃药", "chīyào", "uống thuốc", "verb", "按医嘱每天饭后按时吃药，多喝温开水。", "Àn yīzhǔ měitiān fànhòu ànshí chīyào, duō hē wēn kāishuǐ.", "Theo chỉ định bác sĩ, mỗi ngày sau bữa ăn uống thuốc đúng giờ, uống nhiều nước ấm."),
				new AiVocabAutofillItemDto("药店", "yàodiàn", "hiệu thuốc", "noun", "街角那家二十四小时药店有退烧药卖。", "Jiējiǎo nà jiā èrshísì xiǎoshí yàodiàn yǒu tuìshāoyào mài.", "Hiệu thuốc mở 24/24 ở góc phố có bán thuốc hạ sốt."),
				new AiVocabAutofillItemDto("检查", "jiǎnchá", "thăm khám / xét nghiệm", "verb", "做完血常规和CT检查后再找主治医生看报告。", "Zuò wán xuè chángguī hé CT jiǎnchá hòu zài zhǎo zhǔzhì yīshēng kàn bàogào.", "Sau khi xét nghiệm máu và chụp CT xong hãy quay lại tìm bác sĩ điều trị xem kết quả."),
				new AiVocabAutofillItemDto("打针", "dǎzhēn", "tiêm thuốc", "verb", "护士的打针技术很熟练，一点都不疼。", "Hùshi de dǎzhēn jìshù hěn shúliàn, yìdiǎn dōu bù téng.", "Kỹ thuật tiêm của y tá rất điêu luyện, không đau chút nào."),
				new AiVocabAutofillItemDto("休息", "xiūxi", "nghỉ ngơi", "verb", "生病期间要保证充足睡眠，多卧床休息。", "Shēngbìng qījiān yào bǎozhèng chōngzú shuìmián, duō wòchuáng xiūxi.", "Trong thời gian bị ốm cần đảm bảo ngủ đủ giấc, nằm nghỉ ngơi nhiều."),
				new AiVocabAutofillItemDto("挂号", "guàhào", "lấy số khám bệnh", "verb", "现在可以在医院官方手机小程序上预约挂号。", "Xiànzài kěyǐ zài yīyuàn guānfāng shǒujī xiǎochéngxù shang yùyuē guàhào.", "Hiện nay có thể đăng ký lấy số khám bệnh trên mini app chính thức của bệnh viện."),
				new AiVocabAutofillItemDto("咳嗽", "késou", "ho", "verb", "他连着咳嗽了好几天，声音都有点沙哑。", "Tā liánzhe késou le hǎo jǐ tiān, shēngyīn dōu yǒudiǎn shāyǎ.", "Anh ấy ho liền mấy ngày nay, giọng nói đều hơi khản đặc."),
				new AiVocabAutofillItemDto("肚子疼", "dùzi téng", "đau bụng", "phrase", "可能是吃坏了海鲜，他半夜开始肚子疼。", "Kěnéng shì chī huài le hǎixiān, tā bànyè kāishǐ dùzi téng.", "Có thể do ăn phải đồ hải sản ôi thiu, nửa đêm anh ấy bắt đầu bị đau bụng."),
				new AiVocabAutofillItemDto("健康", "jiànkāng", "sức khỏe / lành mạnh", "noun/adj", "保持健康的生活习惯比生病后吃药更重要。", "Bǎochí jiànkāng de shēnghuó xíguàn bǐ shēngbìng hòu chīyào gèng zhòngyào.", "Duy trì thói quen sinh hoạt lành mạnh quan trọng hơn nhiều việc ốm đau mới uống thuốc."),
				new AiVocabAutofillItemDto("护士", "hùshi", "y tá / điều dưỡng", "noun", "值班护士每隔两小时会来病房量一次体温。", "Zhíbān hùshi měi gé liǎng gè xiǎoshí huì lái bìngfáng liáng yí cì tǐwēn.", "Y tá trực cứ cách 2 tiếng sẽ đến phòng bệnh đo thân nhiệt một lần."),
				new AiVocabAutofillItemDto("处方", "chǔfāng", "đơn thuốc", "noun", "凭借医生的处方才能在药房调配处方药。", "Píngjiè yīshēng de chǔfāng cái néng zài yàofáng tiáopèi chǔfāngyào.", "Phải dựa vào đơn của bác sĩ mới có thể mua thuốc kê đơn tại quầy thuốc."),
				new AiVocabAutofillItemDto("过敏", "guòmǐn", "dị ứng", "verb/noun", "你对青霉素或者花粉过敏吗？", "Nǐ duì qīngméisù huòzhě huāfěn guòmǐn ma?", "Bạn có bị dị ứng với penicillin hoặc phấn hoa không?"),
				new AiVocabAutofillItemDto("体温", "tǐwēn", "thân nhiệt", "noun", "量一下体温，看看热度有没有退下来。", "Liáng yíxià tǐwēn, kànkan rèdù yǒu méiyǒu tuì xiàlai.", "Đo thử thân nhiệt xem nhiệt độ sốt đã hạ xuống chưa."),
				new AiVocabAutofillItemDto("锻炼", "duànliàn", "rèn luyện / tập thể dục", "verb", "每天坚持慢跑锻炼身体能有效增强免疫力。", "Měitiān jiānchí mànpǎo duànliàn shēntǐ néng yǒuxiào zēngqiáng miǎnyìlì.", "Mỗi ngày kiên trì chạy bộ rèn luyện thân thể có thể tăng cường miễn dịch hiệu quả."),
				new AiVocabAutofillItemDto("早日康复", "zǎorì kāngfù", "chóng bình phục", "phrase", "听闻你生病住院，衷心祝愿你早日康复！", "Tīngwén nǐ shēngbìng zhùyuàn, zhōngxīn zhùyuàn nǐ zǎorì kāngfù!", "Nghe tin bạn bị ốm nằm viện, xin chúc bạn từ đáy lòng chóng bình phục!")
		);
		registerTopic("HOSPITAL_HEALTH", healthList);

		// 8. TRƯỜNG HỌC & HỌC TẬP
		List<AiVocabAutofillItemDto> schoolList = List.of(
				new AiVocabAutofillItemDto("学校", "xuéxiào", "trường học", "noun", "我们学校图书馆拥有上百万册中外文藏书。", "Wǒmen xuéxiào túshūguǎn yōngyǒu shàng bǎiwàn cè zhōngwàiwén cángshū.", "Thư viện trường chúng tôi có hàng triệu đầu sách tiếng Trung và ngoại văn."),
				new AiVocabAutofillItemDto("老师", "lǎoshī", "thầy giáo / cô giáo", "noun", "王老师讲授语法课时非常生动有趣。", "Wáng lǎoshī jiǎngshòu yǔfǎ kè shí fēicháng shēngdòng yǒuqù.", "Thầy Vương khi giảng tiết ngữ pháp rất sinh động và thú vị."),
				new AiVocabAutofillItemDto("考试", "kǎoshì", "kỳ thi / thi cử", "noun/verb", "下周我们要参加HSK四级汉语水平考试。", "Xiàzhōu wǒmen yào cānjiā HSK sìjí Hànyǔ shuǐpíng kǎoshì.", "Tuần sau chúng tôi sẽ tham gia kỳ thi kiểm tra năng lực Hán ngữ HSK 4."),
				new AiVocabAutofillItemDto("作业", "zuòyè", "bài tập về nhà", "noun", "今天的课后作业是背诵第二课的生词和课文。", "Jīntiān de kèhòu zuòyè shì bèisòng dì-èr kè de shēngcí hé kèwén.", "Bài tập về nhà hôm nay là học thuộc từ mới và bài đọc bài số 2."),
				new AiVocabAutofillItemDto("同学", "tóngxué", "bạn cùng lớp / bạn học", "noun", "课后我和同学们经常聚在自习室一起复习。", "Kèhòu wǒ hé tóngxuémen jīngcháng jù zài zìxíshì yìqǐ fùxí.", "Sau giờ học tôi và các bạn thường tụ tập ở phòng tự học để cùng ôn bài."),
				new AiVocabAutofillItemDto("复习", "fùxí", "ôn tập", "verb", "考试前认真复习错题本上的题目非常有帮助。", "Kǎoshì qián rènzhēn fùxí cuòtíběn shang de tímù fēicháng yǒu bāngzhù.", "Trước kỳ thi, chăm chỉ ôn tập các câu trên sổ ghi lỗi sai rất có ích."),
				new AiVocabAutofillItemDto("词汇", "cíhuì", "từ vựng", "noun", "要想提高阅读理解速度，必须持续扩大词汇量。", "Yào xiǎng tígāo yuèdú lǐjiě sùdù, bìxū chíxù kuòdà cíhuìliàng.", "Muốn nâng cao tốc độ đọc hiểu thì bắt buộc phải liên tục mở rộng vốn từ vựng."),
				new AiVocabAutofillItemDto("语法", "yǔfǎ", "ngữ pháp", "noun", "汉语的语序和词类活用是初学者必须掌握的语法点。", "Hànyǔ de yǔxù hé cílèi huóyòng shì chūxuézhě bìxū zhǎngwò de yǔfǎ diǎn.", "Trật tự từ và công dụng từ loại trong tiếng Hán là điểm ngữ pháp người mới bắt buộc phải nắm vững."),
				new AiVocabAutofillItemDto("听力", "tīnglì", "nghe hiểu", "noun", "每天坚持听半小时中文广播能显著提升听力水平。", "Měitiān jiānchí tīng bàn xiǎoshí Zhōngwén guǎngbō néng xiǎnzhù tíshēng tīnglì shuǐpíng.", "Mỗi ngày kiên trì nghe nửa tiếng đài phát thanh tiếng Trung có thể nâng cao trình độ nghe hiểu rõ rệt."),
				new AiVocabAutofillItemDto("口语", "kǒuyǔ", "khẩu ngữ / giao tiếp", "noun", "多与中国朋友面对面交流是练习口语最好的途径。", "Duō yǔ Zhōngguó péngyou miànduìmiàn jiāoliú shì liànxí kǒuyǔ zuì hǎo de tújìng.", "Giao lưu mặt đối mặt nhiều với bạn bè Trung Quốc là con đường tốt nhất để luyện khẩu ngữ."),
				new AiVocabAutofillItemDto("发音", "fāyīn", "phát âm", "noun", "注意声调的变化，正确的发音有助于准确表达意思。", "Zhùyì shēngdiào de biànhuà, zhèngquè de fāyīn yǒuzhù yú zhǔnquè biǎodá yìsi.", "Chú ý sự thay đổi thanh điệu, phát âm chuẩn xác giúp truyền đạt đúng ý nghĩa."),
				new AiVocabAutofillItemDto("汉字", "hànzì", "chữ Hán", "noun", "掌握常用汉字的笔顺规则能让字写得更规范美观。", "Zhǎngwò chángyòng hànzì de bǐshùn guīzé néng ràng zì xiě de gèng guīfàn měiguān.", "Nắm vững quy tắc nét thuận của chữ Hán thông dụng sẽ giúp viết chữ chuẩn mực và đẹp mắt hơn."),
				new AiVocabAutofillItemDto("成绩", "chéngjì", "thành tích / điểm số", "noun", "只要平时踏实努力，期末考试一定会取得好成绩。", "Zhǐyào píngshí tàshi nǔlì, qīmò kǎoshì yídìng huì qǔdé hǎo chéngjì.", "Chỉ cần ngày thường nỗ lực vững vàng, kỳ thi cuối kỳ nhất định sẽ đạt điểm số cao."),
				new AiVocabAutofillItemDto("图书馆", "túshūguǎn", "thư viện", "noun", "周末图书馆环境安静，非常适合专注自习。", "Zhōumò túshūguǎn huánjìng ānjìng, fēicháng shìhé zhuānzhù zìxí.", "Cuối tuần môi trường thư viện yên tĩnh, rất thích hợp để tập trung tự học."),
				new AiVocabAutofillItemDto("奖学金", "jiǎngxuéjīn", "học bổng", "noun", "他凭借全系第一名的优异综合成绩获得了国家奖学金。", "Tā píngjiè quán xì dì-yī míng de yōuyì zōnghé chéngjì huòdé le guójiā jiǎngxuéjīn.", "Anh ấy nhờ thành tích tổng hợp xuất sắc đứng đầu toàn khoa đã giành được học bổng quốc gia."),
				new AiVocabAutofillItemDto("毕业", "bìyè", "tốt nghiệp", "verb", "明年六月我们即将从北京语言大学本科毕业。", "Míngnián liù yuè wǒmen jíjiāng cóng Běijīng Yǔyán Dàxué běnkē bìyè.", "Tháng 6 năm sau chúng tôi sắp tốt nghiệp đại học chính quy tại Đại học Ngôn ngữ Bắc Kinh."),
				new AiVocabAutofillItemDto("专业", "zhuānyè", "chuyên ngành", "noun", "我所读的专业是国际中文教育与跨文化交流。", "Wǒ suǒ dú de zhuānyè shì guójì Zhōngwén jiàoyù yǔ kuà wénhuà jiāoliú.", "Chuyên ngành tôi theo học là Giáo dục tiếng Trung Quốc tế và Giao lưu đa văn hóa."),
				new AiVocabAutofillItemDto("请教", "qǐngjiào", "thỉnh giáo / xin chỉ bảo", "verb", "遇到不懂的语法难点，可以随时向授课老师请教。", "Yù dào bù dǒng de yǔfǎ nándiǎn, kěyǐ suíshí xiàng shòukè lǎoshī qǐngjiào.", "Gặp điểm ngữ pháp khó chưa hiểu, có thể thỉnh giáo giáo viên bất kỳ lúc nào."),
				new AiVocabAutofillItemDto("练习", "liànxí", "luyện tập / rèn luyện", "verb/noun", "熟能生巧，多做练习题是学好外语的不二法门。", "Shúnéngshēngqiǎo, duō zuò liànxítí shì xué hǎo wàiyǔ de bú'èr fǎmén.", "Trăm hay không bằng tay quen, làm nhiều bài luyện tập là con đường độc nhất để học tốt ngoại ngữ."),
				new AiVocabAutofillItemDto("进步", "jìnbù", "tiến bộ", "verb/noun", "坚持学了三个月，我的中文口语表达有了很大的进步。", "Jiānchí xué le sān gè yuè, wǒ de Zhōngwén kǒuyǔ biǎodá yǒu le hěn dà de jìnbù.", "Kiên trì học 3 tháng, khả năng biểu đạt khẩu ngữ tiếng Trung của tôi đã có sự tiến bộ rất lớn.")
		);
		registerTopic("SCHOOL_STUDY", schoolList);
	}

	private static void registerTopic(String key, List<AiVocabAutofillItemDto> items) {
		TOPIC_MAP.put(key, items);
		for (AiVocabAutofillItemDto item : items) {
			HANZI_LOOKUP_MAP.putIfAbsent(item.hanzi(), item);
		}
	}

	/**
	 * Tra cứu nhanh từ vựng theo chữ Hán từ kho từ vựng phong phú.
	 */
	public static AiVocabAutofillItemDto lookupByHanzi(String hanzi) {
		if (hanzi == null || hanzi.isBlank()) {
			return null;
		}
		return HANZI_LOOKUP_MAP.get(hanzi.trim());
	}

	/**
	 * Sinh danh sách từ vựng chuẩn ngữ nghĩa, pinyin và câu ví dụ theo chủ đề và số lượng yêu cầu.
	 */
	public static List<AiVocabAutofillItemDto> getWordsForTopic(String topic, int count) {
		int safeCount = Math.max(1, Math.min(count, 30));
		String normalized = topic != null ? topic.toLowerCase(Locale.ROOT).trim() : "";

		List<AiVocabAutofillItemDto> sourceList = matchTopicList(normalized);
		List<AiVocabAutofillItemDto> result = new ArrayList<>(sourceList);

		// Nếu danh sách chủ đề ít hơn safeCount, bổ sung thêm từ vựng liên quan
		if (result.size() < safeCount) {
			for (List<AiVocabAutofillItemDto> otherList : TOPIC_MAP.values()) {
				for (AiVocabAutofillItemDto item : otherList) {
					if (!result.contains(item)) {
						result.add(item);
						if (result.size() >= safeCount) {
							break;
						}
					}
				}
				if (result.size() >= safeCount) {
					break;
				}
			}
		}

		if (result.size() > safeCount) {
			return result.subList(0, safeCount);
		}
		return result;
	}

	private static List<AiVocabAutofillItemDto> matchTopicList(String normalized) {
		if (normalized.contains("nhà hàng") || normalized.contains("ăn") || normalized.contains("quán")
				|| normalized.contains("ẩm thực") || normalized.contains("gọi món") || normalized.contains("món")
				|| normalized.contains("thực đơn") || normalized.contains("cà phê") || normalized.contains("uống")
				|| normalized.contains("cơm") || normalized.contains("restaurant") || normalized.contains("food")) {
			return TOPIC_MAP.get("RESTAURANT");
		}

		if (normalized.contains("khách sạn") || normalized.contains("du lịch") || normalized.contains("hotel")
				|| normalized.contains("travel") || normalized.contains("nghỉ dưỡng") || normalized.contains("đặt phòng")
				|| normalized.contains("check-in") || normalized.contains("check in") || normalized.contains("phòng")
				|| normalized.contains("danh lam") || normalized.contains("thắng cảnh") || normalized.contains("hộ chiếu")) {
			return TOPIC_MAP.get("HOTEL_TRAVEL");
		}

		if (normalized.contains("sân bay") || normalized.contains("máy bay") || normalized.contains("di chuyển")
				|| normalized.contains("chuyến bay") || normalized.contains("airport") || normalized.contains("flight")
				|| normalized.contains("hàng không") || normalized.contains("vé máy bay") || normalized.contains("ga tàu")
				|| normalized.contains("cất cánh") || normalized.contains("hạ cánh") || normalized.contains("hành lý")) {
			return TOPIC_MAP.get("AIRPORT_TRANSPORT");
		}

		if (normalized.contains("mua sắm") || normalized.contains("trả giá") || normalized.contains("mặc cả")
				|| normalized.contains("giảm giá") || normalized.contains("shopping") || normalized.contains("tiền")
				|| normalized.contains("quần áo") || normalized.contains("siêu thị") || normalized.contains("chợ")
				|| normalized.contains("đắt") || normalized.contains("rẻ") || normalized.contains("cửa hàng")) {
			return TOPIC_MAP.get("SHOPPING");
		}

		if (normalized.contains("công sở") || normalized.contains("phỏng vấn") || normalized.contains("đi làm")
				|| normalized.contains("văn phòng") || normalized.contains("công việc") || normalized.contains("công ty")
				|| normalized.contains("đồng nghiệp") || normalized.contains("lương") || normalized.contains("họp")
				|| normalized.contains("tăng ca") || normalized.contains("cv") || normalized.contains("sơ yếu")) {
			return TOPIC_MAP.get("WORKPLACE_INTERVIEW");
		}

		if (normalized.contains("hỏi đường") || normalized.contains("giao thông") || normalized.contains("đường")
				|| normalized.contains("rẽ") || normalized.contains("ngã tư") || normalized.contains("xe buýt")
				|| normalized.contains("tàu điện") || normalized.contains("taxi") || normalized.contains("bản đồ")
				|| normalized.contains("đèn đỏ") || normalized.contains("traffic")) {
			return TOPIC_MAP.get("DIRECTIONS_TRAFFIC");
		}

		if (normalized.contains("bệnh viện") || normalized.contains("sức khỏe") || normalized.contains("y tế")
				|| normalized.contains("khám") || normalized.contains("bác sĩ") || normalized.contains("thuốc")
				|| normalized.contains("y tá") || normalized.contains("đau") || normalized.contains("sốt")
				|| normalized.contains("bệnh") || normalized.contains("cảm cúm")) {
			return TOPIC_MAP.get("HOSPITAL_HEALTH");
		}

		if (normalized.contains("trường") || normalized.contains("học") || normalized.contains("thi")
				|| normalized.contains("đại học") || normalized.contains("lớp") || normalized.contains("giáo viên")
				|| normalized.contains("thầy cô") || normalized.contains("bài tập") || normalized.contains("hsk")
				|| normalized.contains("ngữ pháp") || normalized.contains("từ vựng")) {
			return TOPIC_MAP.get("SCHOOL_STUDY");
		}

		// Mặc định trả về tập từ vựng giao tiếp nhà hàng & đời sống nếu không khớp chủ đề cụ thể
		return TOPIC_MAP.get("RESTAURANT");
	}
}

