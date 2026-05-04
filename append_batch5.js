const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('batch3_chars.json', 'utf8'));
const nextBatch = [
  {
    "hanzi": "界",
    "pinyin": "jiè",
    "pinyin_numbered": "jie4",
    "definition": "boundary; limit; world; circles",
    "traditional": "界",
    "simplified": "界",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 9,
    "radicals": ["田"],
    "category": "abstract",
    "frequency_rank": 400,
    "example_words": [
      { "word": "世界", "pinyin": "shì jiè", "def": "world" },
      { "word": "邊界", "pinyin": "biān jiè", "def": "boundary; border" }
    ],
    "example_sentence": {
      "sentence": "我想到世界各地去旅遊。",
      "pinyin": "Wǒ xiǎng dào shìjiè gèdì qù lǚyóu.",
      "english": "I want to travel all over the world."
    },
    "mnemonic": "Fields (田) with boundaries or limits (介) between them."
  },
  {
    "hanzi": "拼",
    "pinyin": "pīn",
    "pinyin_numbered": "pin1",
    "definition": "piece together; spell; risk one's life",
    "traditional": "拼",
    "simplified": "拼",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 9,
    "radicals": ["手"],
    "category": "action",
    "frequency_rank": 1000,
    "example_words": [
      { "word": "拼圖", "pinyin": "pīn tú", "def": "jigsaw puzzle" },
      { "word": "拼音", "pinyin": "pīn yīn", "def": "pinyin; phonetic spelling" }
    ],
    "example_sentence": {
      "sentence": "他在玩拼圖。",
      "pinyin": "Tā zài wán pīntú.",
      "english": "He is playing with a jigsaw puzzle."
    },
    "mnemonic": "Using hands (手) to join or merge (并) different pieces together."
  },
  {
    "hanzi": "固",
    "pinyin": "gù",
    "pinyin_numbered": "gu4",
    "definition": "solid; firm; stubborn; originally",
    "traditional": "固",
    "simplified": "固",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["囗"],
    "category": "quality",
    "frequency_rank": 800,
    "example_words": [
      { "word": "固定", "pinyin": "gù dìng", "def": "fixed; regular" },
      { "word": "固執", "pinyin": "gù zhí", "def": "stubborn" }
    ],
    "example_sentence": {
      "sentence": "他的工作時間很固定。",
      "pinyin": "Tā de gōngzuò shíjiān hěn gùdìng.",
      "english": "His working hours are very regular."
    },
    "mnemonic": "An old (古) thing inside an enclosure (囗), representing something that has become solid or fixed over time."
  },
  {
    "hanzi": "肯",
    "pinyin": "kěn",
    "pinyin_numbered": "ken3",
    "definition": "be willing to; agree; consent",
    "traditional": "肯",
    "simplified": "肯",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["肉"],
    "category": "abstract",
    "frequency_rank": 700,
    "example_words": [
      { "word": "肯定", "pinyin": "kěn dìng", "def": "definitely; to confirm" },
      { "word": "寧肯", "pinyin": "nìng kěn", "def": "would rather" }
    ],
    "example_sentence": {
      "sentence": "我肯定他會來的。",
      "pinyin": "Wǒ kěndìng tā huì lái de.",
      "english": "I'm sure he will come."
    },
    "mnemonic": "Agreement that comes from the heart or flesh (肉/月) beneath a stop (止) sign."
  },
  {
    "hanzi": "楚",
    "pinyin": "chǔ",
    "pinyin_numbered": "chu3",
    "definition": "clear; neat; suffering; ancient Chinese state",
    "traditional": "楚",
    "simplified": "楚",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["木"],
    "category": "quality",
    "frequency_rank": 700,
    "example_words": [
      { "word": "清楚", "pinyin": "qīng chǔ", "def": "clear; distinct" },
      { "word": "苦楚", "pinyin": "kǔ chǔ", "def": "suffering; misery" }
    ],
    "example_sentence": {
      "sentence": "我不清楚這件事。",
      "pinyin": "Wǒ bù qīngchǔ zhè jiàn shì.",
      "english": "I'm not clear about this matter."
    },
    "mnemonic": "Trees (木) and a brush or foot (疋) representing clearing a path or clarity."
  },
  {
    "hanzi": "享",
    "pinyin": "xiǎng",
    "pinyin_numbered": "xiang3",
    "definition": "enjoy; receive; benefit",
    "traditional": "享",
    "simplified": "享",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["亠"],
    "category": "action",
    "frequency_rank": 950,
    "example_words": [
      { "word": "享受", "pinyin": "xiǎng shòu", "def": "to enjoy" },
      { "word": "分享", "pinyin": "fēn xiǎng", "def": "to share (joy/rights)" }
    ],
    "example_sentence": {
      "sentence": "謝謝你和我分享這個好消息。",
      "pinyin": "Xièxiè nǐ hé wǒ fēnxiǎng zhège hǎo xiāoxi.",
      "english": "Thank you for sharing this good news with me."
    },
    "mnemonic": "A person receiving or offering (子) food at a high (亠/口) altar or building."
  },
  {
    "hanzi": "戶",
    "pinyin": "hù",
    "pinyin_numbered": "hu4",
    "definition": "door; household; account; family",
    "traditional": "戶",
    "simplified": "户",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 4,
    "radicals": ["戶"],
    "category": "abstract",
    "frequency_rank": 900,
    "example_words": [
      { "word": "戶口", "pinyin": "hù kǒu", "def": "registered residence" },
      { "word": "帳戶", "pinyin": "zhàng hù", "def": "account (bank/online)" }
    ],
    "example_sentence": {
      "sentence": "我想開一個新的銀行帳戶。",
      "pinyin": "Wǒ xiǎng kāi yīgè xīn de yínháng zhànghù.",
      "english": "I want to open a new bank account."
    },
    "mnemonic": "A single-leaf door representing a home or household."
  },
  {
    "hanzi": "匯",
    "pinyin": "huì",
    "pinyin_numbered": "hui4",
    "definition": "collect; converge; remit; flow; exchange",
    "traditional": "匯",
    "simplified": "汇",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["匚"],
    "category": "action",
    "frequency_rank": 1200,
    "example_words": [
      { "word": "匯款", "pinyin": "huì kuǎn", "def": "to remit money; remittance" },
      { "word": "外匯", "pinyin": "wài huì", "def": "foreign exchange" }
    ],
    "example_sentence": {
      "sentence": "我昨天匯款給我的父母。",
      "pinyin": "Wǒ zuótiān huìkuǎn gěi wǒ de fùmǔ.",
      "english": "I remitted money to my parents yesterday."
    },
    "mnemonic": "Water (氵-like flow) converging into a box or container (匚)."
  },
  {
    "hanzi": "款",
    "pinyin": "kuǎn",
    "pinyin_numbered": "kuan3",
    "definition": "section; item; money; fund; style",
    "traditional": "款",
    "simplified": "款",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 12,
    "radicals": ["欠"],
    "category": "money",
    "frequency_rank": 1100,
    "example_words": [
      { "word": "存款", "pinyin": "cún kuǎn", "def": "deposit; bank savings" },
      { "word": "付款", "pinyin": "fù kuǎn", "def": "to pay; payment" }
    ],
    "example_sentence": {
      "sentence": "請選擇付款方式。",
      "pinyin": "Qǐng xuǎnzé fùkuǎn fāngshì.",
      "english": "Please choose a payment method."
    },
    "mnemonic": "A person lacking (欠) money or items, or a formal document/item (奈-like ancient form)."
  },
  {
    "hanzi": "續",
    "pinyin": "xù",
    "pinyin_numbered": "xu4",
    "definition": "continue; carry on; extend; succeed",
    "traditional": "續",
    "simplified": "续",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 21,
    "radicals": ["糸"],
    "category": "action",
    "frequency_rank": 600,
    "example_words": [
      { "word": "繼續", "pinyin": "jì xù", "def": "to continue; to proceed" },
      { "word": "手續", "pinyin": "shǒu xù", "def": "procedure; formalities" }
    ],
    "example_sentence": {
      "sentence": "請繼續努力。",
      "pinyin": "Qǐng jìxù nǔlì.",
      "english": "Please continue to work hard."
    },
    "mnemonic": "Silk threads (糸) being joined or sold/traded (賣) to extend their length."
  },
  {
    "hanzi": "歐",
    "pinyin": "ōu",
    "pinyin_numbered": "ou1",
    "definition": "Europe; to shout; (transliteration)",
    "traditional": "歐",
    "simplified": "欧",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["欠"],
    "category": "place",
    "frequency_rank": 900,
    "example_words": [
      { "word": "歐洲", "pinyin": "ōu zhōu", "def": "Europe" },
      { "word": "歐元", "pinyin": "ōu yuán", "def": "Euro" }
    ],
    "example_sentence": {
      "sentence": "他下個月要去歐洲旅遊。",
      "pinyin": "Tā xià gè yuè yào qù Ōuzhōu lǚyóu.",
      "english": "He is going to travel to Europe next month."
    },
    "mnemonic": "A person opening their mouth (欠) to shout or transliterate sounds (區)."
  },
  {
    "hanzi": "幣",
    "pinyin": "bì",
    "pinyin_numbered": "bi4",
    "definition": "money; currency; coins; tokens",
    "traditional": "幣",
    "simplified": "币",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["巾"],
    "category": "money",
    "frequency_rank": 1100,
    "example_words": [
      { "word": "貨幣", "pinyin": "huò bì", "def": "currency; money" },
      { "word": "台幣", "pinyin": "tái bì", "def": "New Taiwan Dollar (TWD)" }
    ],
    "example_sentence": {
      "sentence": "比特幣是一種虛擬貨幣。",
      "pinyin": "Bǐtèbì shì yīzhǒng xūnǐ huòbì.",
      "english": "Bitcoin is a virtual currency."
    },
    "mnemonic": "Cloth (巾) or silk used as an ancient medium of exchange (蔽-like value)."
  },
  {
    "hanzi": "密",
    "pinyin": "mì",
    "pinyin_numbered": "mi4",
    "definition": "secret; dense; close; thick",
    "traditional": "密",
    "simplified": "密",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 11,
    "radicals": ["宀"],
    "category": "quality",
    "frequency_rank": 800,
    "example_words": [
      { "word": "秘密", "pinyin": "mì mì", "def": "secret" },
      { "word": "密碼", "pinyin": "mì mǎ", "def": "password" }
    ],
    "example_sentence": {
      "sentence": "請不要告訴別人我的秘密。",
      "pinyin": "Qǐng bùyào gàosù biérén wǒ de mìmì.",
      "english": "Please don't tell others my secret."
    },
    "mnemonic": "Something hidden in a house (宀) or mountain (山) that is thick/dense (必)."
  },
  {
    "hanzi": "證",
    "pinyin": "zhèng",
    "pinyin_numbered": "zheng4",
    "definition": "prove; evidence; certificate; card",
    "traditional": "證",
    "simplified": "证",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 19,
    "radicals": ["言"],
    "category": "abstract",
    "frequency_rank": 800,
    "example_words": [
      { "word": "證明", "pinyin": "zhèng míng", "def": "to prove; proof" },
      { "word": "簽證", "pinyin": "qiān zhèng", "def": "visa" }
    ],
    "example_sentence": {
      "sentence": "這張證件已經過期了。",
      "pinyin": "Zhè zhāng zhèngjiàn yǐjīng guòqīle.",
      "english": "This certificate has already expired."
    },
    "mnemonic": "Speaking (言) correctly (正) or using a登 (as in climbing/showing) to provide evidence."
  },
  {
    "hanzi": "貸",
    "pinyin": "dài",
    "pinyin_numbered": "dai4",
    "definition": "lend; borrow; loan; pardon",
    "traditional": "貸",
    "simplified": "贷",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 12,
    "radicals": ["貝"],
    "category": "money",
    "frequency_rank": 1400,
    "example_words": [
      { "word": "貸款", "pinyin": "dài kuǎn", "def": "loan; to lend money" },
      { "word": "借貸", "pinyin": "jiè dài", "def": "to borrow or lend" }
    ],
    "example_sentence": {
      "sentence": "他向銀行申請了房貸。",
      "pinyin": "Tā xiàng yínháng shēnqǐngle fángdài.",
      "english": "He applied for a mortgage from the bank."
    },
    "mnemonic": "Substituting (代) money or shells (貝) for a period of time."
  },
  {
    "hanzi": "額",
    "pinyin": "é",
    "pinyin_numbered": "e2",
    "definition": "forehead; quota; amount; tablet",
    "traditional": "額",
    "simplified": "额",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 18,
    "radicals": ["頁"],
    "category": "money",
    "frequency_rank": 1200,
    "example_words": [
      { "word": "金額", "pinyin": "jīn é", "def": "sum of money; amount" },
      { "word": "名額", "pinyin": "míng é", "def": "quota (of people)" }
    ],
    "example_sentence": {
      "sentence": "這筆交易的金額很大。",
      "pinyin": "Zhè bǐ jiāoyì de jīné hěn dà.",
      "english": "The amount of this transaction is very large."
    },
    "mnemonic": "A visitor's (客) head (頁) representing the forehead or a specific count/quota."
  },
  {
    "hanzi": "隊",
    "pinyin": "duì",
    "pinyin_numbered": "dui4",
    "definition": "team; squad; row; line",
    "traditional": "隊",
    "simplified": "队",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 12,
    "radicals": ["阜"],
    "category": "abstract",
    "frequency_rank": 650,
    "example_words": [
      { "word": "隊伍", "pinyin": "duì wǔ", "def": "ranks; troops; team" },
      { "word": "隊長", "pinyin": "duì zhǎng", "def": "team leader; captain" }
    ],
    "example_sentence": {
      "sentence": "他在排隊買票。",
      "pinyin": "Tā zài páiduì mǎi piào.",
      "english": "He is lining up to buy a ticket."
    },
    "mnemonic": "A mound (阜) where people fall (墜-like ancient form) into rank or team."
  },
  {
    "hanzi": "填",
    "pinyin": "tián",
    "pinyin_numbered": "tian2",
    "definition": "fill in; stuff; write (information)",
    "traditional": "填",
    "simplified": "填",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["土"],
    "category": "action",
    "frequency_rank": 1400,
    "example_words": [
      { "word": "填寫", "pinyin": "tián xiě", "def": "to fill in (a form)" },
      { "word": "填充", "pinyin": "tián chōng", "def": "to fill up; stuffing" }
    ],
    "example_sentence": {
      "sentence": "請填寫這份表格。",
      "pinyin": "Qǐng tiánxiě zhè fèn biǎogé.",
      "english": "Please fill in this form."
    },
    "mnemonic": "Using earth (土) or truth (真) to fill a hole or information gap."
  },
  {
    "hanzi": "凍",
    "pinyin": "dòng",
    "pinyin_numbered": "dong4",
    "definition": "freeze; cold; jelly; feel cold",
    "traditional": "凍",
    "simplified": "冻",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 10,
    "radicals": ["冫"],
    "category": "quality",
    "frequency_rank": 1500,
    "example_words": [
      { "word": "冰凍", "pinyin": "bīng dòng", "def": "frozen" },
      { "word": "冷凍", "pinyin": "lěng dòng", "def": "to freeze; refrigeration" }
    ],
    "example_sentence": {
      "sentence": "外面太冷，水都凍住了。",
      "pinyin": "Wàimiàn tài lěng, shuǐ dōu dòngzhùle.",
      "english": "It's too cold outside, the water has frozen."
    },
    "mnemonic": "Ice (冫) coming from the east (東) in winter."
  },
  {
    "hanzi": "輪",
    "pinyin": "lún",
    "pinyin_numbered": "lun2",
    "definition": "wheel; revolve; take turns; MW for rounds/sun",
    "traditional": "輪",
    "simplified": "轮",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["車"],
    "category": "items",
    "frequency_rank": 1000,
    "example_words": [
      { "word": "輪流", "pinyin": "lún liú", "def": "to take turns" },
      { "word": "輪子", "pinyin": "lún zi", "def": "wheel" }
    ],
    "example_sentence": {
      "sentence": "我們輪流打掃房間。",
      "pinyin": "Wǒmen lúnliú dǎsǎo fángjiān.",
      "english": "We take turns cleaning the room."
    },
    "mnemonic": "The wheel of a vehicle (車) that revolves or brings things into order (侖)."
  }
];
existing.push(...nextBatch);
fs.writeFileSync('batch3_chars.json', JSON.stringify(existing, null, 2));
