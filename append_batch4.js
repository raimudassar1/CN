const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('batch3_chars.json', 'utf8'));
const nextBatch = [
  {
    "hanzi": "郵",
    "pinyin": "yóu",
    "pinyin_numbered": "you2",
    "definition": "mail; post; post office",
    "traditional": "郵",
    "simplified": "邮",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 11,
    "radicals": ["邑"],
    "category": "items",
    "frequency_rank": 1100,
    "example_words": [
      { "word": "郵局", "pinyin": "yóu jú", "def": "post office" },
      { "word": "郵件", "pinyin": "yóu jiàn", "def": "mail; post" }
    ],
    "example_sentence": {
      "sentence": "我得去郵局寄信。",
      "pinyin": "Wǒ děi qù yóujú jì xìn.",
      "english": "I have to go to the post office to mail a letter."
    },
    "mnemonic": "A town (邑) where messengers (垂) stop to deliver mail."
  },
  {
    "hanzi": "驗",
    "pinyin": "yàn",
    "pinyin_numbered": "yan4",
    "definition": "test; examine; verify; experience",
    "traditional": "驗",
    "simplified": "验",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 23,
    "radicals": ["馬"],
    "category": "action",
    "frequency_rank": 900,
    "example_words": [
      { "word": "經驗", "pinyin": "jīng yàn", "def": "experience" },
      { "word": "試驗", "pinyin": "shì yàn", "def": "test; trial" }
    ],
    "example_sentence": {
      "sentence": "他是一位很有經驗的老師。",
      "pinyin": "Tā shì yī wèi hěn yǒu jīngyàn de lǎoshī.",
      "english": "He is a very experienced teacher."
    },
    "mnemonic": "Testing or verifying the quality of a horse (馬) or general items (僉)."
  },
  {
    "hanzi": "實",
    "pinyin": "shí",
    "pinyin_numbered": "shi2",
    "definition": "real; true; honest; fruit; solid",
    "traditional": "實",
    "simplified": "实",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 14,
    "radicals": ["宀"],
    "category": "quality",
    "frequency_rank": 450,
    "example_words": [
      { "word": "其實", "pinyin": "qí shí", "def": "actually; in fact" },
      { "word": "實在", "pinyin": "shí zài", "def": "indeed; really" }
    ],
    "example_sentence": {
      "sentence": "其實我不太喜歡吃肉。",
      "pinyin": "Qíshí wǒ bù tài xǐhuān chī ròu.",
      "english": "Actually, I don't really like eating meat."
    },
    "mnemonic": "A house (宀) full of wealth/shells (貫/貝), representing substance and reality."
  },
  {
    "hanzi": "專",
    "pinyin": "zhuān",
    "pinyin_numbered": "zhuan1",
    "definition": "special; expert; solely; focused",
    "traditional": "專",
    "simplified": "专",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 11,
    "radicals": ["寸"],
    "category": "abstract",
    "frequency_rank": 750,
    "example_words": [
      { "word": "專業", "pinyin": "zhuān yè", "def": "profession; major; professional" },
      { "word": "專家", "pinyin": "zhuān jiā", "def": "expert" }
    ],
    "example_sentence": {
      "sentence": "他在大學的主修專業是法律。",
      "pinyin": "Tā zài dàxué de zhǔxiū zhuānyè shì fǎlǜ.",
      "english": "His major in university is law."
    },
    "mnemonic": "Using a tool or measurement (寸) to focus on a single spinning wheel (ancient form)."
  },
  {
    "hanzi": "於",
    "pinyin": "yú",
    "pinyin_numbered": "yu2",
    "definition": "in; at; on; than; (grammar particle)",
    "traditional": "於",
    "simplified": "于",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["方"],
    "category": "abstract",
    "frequency_rank": 100,
    "example_words": [
      { "word": "對於", "pinyin": "duì yú", "def": "regarding; with respect to" },
      { "word": "關於", "pinyin": "guān yú", "def": "about; concerning" }
    ],
    "example_sentence": {
      "sentence": "這本書是關於中國歷史的。",
      "pinyin": "Zhè běn shū shì guānyú Zhōngguó lìshǐ de.",
      "english": "This book is about Chinese history."
    },
    "mnemonic": "A flag (方/㫃) waving at a certain place or position."
  },
  {
    "hanzi": "貿",
    "pinyin": "mào",
    "pinyin_numbered": "mao4",
    "definition": "trade; commerce; barter",
    "traditional": "貿",
    "simplified": "贸",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 12,
    "radicals": ["貝"],
    "category": "money",
    "frequency_rank": 1100,
    "example_words": [
      { "word": "貿易", "pinyin": "mào yì", "def": "trade" },
      { "word": "外貿", "pinyin": "wài mào", "def": "foreign trade" }
    ],
    "example_sentence": {
      "sentence": "這兩個國家之間的貿易往來很頻繁。",
      "pinyin": "Zhè liǎng gè guójiā zhī jiān de màoyì wǎnglái hěn pínfán.",
      "english": "Trade between these two countries is very frequent."
    },
    "mnemonic": "Exchanging (卯/卯) money or shells (貝) for goods."
  },
  {
    "hanzi": "銷",
    "pinyin": "xiāo",
    "pinyin_numbered": "xiao1",
    "definition": "melt; sell; expend; cancel; pin",
    "traditional": "銷",
    "simplified": "销",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["金"],
    "category": "action",
    "frequency_rank": 1000,
    "example_words": [
      { "word": "銷售", "pinyin": "xiāo shòu", "def": "to sell; sales" },
      { "word": "行銷", "pinyin": "xíng xiāo", "def": "marketing" }
    ],
    "example_sentence": {
      "sentence": "這款手機的銷售情況很好。",
      "pinyin": "Zhè kuǎn shǒujī de xiāoshòu qíngkuàng hěn hǎo.",
      "english": "The sales of this phone are very good."
    },
    "mnemonic": "Metal (金) that is being consumed or distributed (肖) through sales or melting."
  },
  {
    "hanzi": "售",
    "pinyin": "shòu",
    "pinyin_numbered": "shou4",
    "definition": "sell; vend",
    "traditional": "售",
    "simplified": "售",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 11,
    "radicals": ["口"],
    "category": "action",
    "frequency_rank": 1200,
    "example_words": [
      { "word": "售票", "pinyin": "shòu piào", "def": "to sell tickets" },
      { "word": "零售", "pinyin": "líng shòu", "def": "retail" }
    ],
    "example_sentence": {
      "sentence": "這張門票在網上發售。",
      "pinyin": "Zhè zhāng ménpiào zài wǎngshàng fāshòu.",
      "english": "This ticket is on sale online."
    },
    "mnemonic": "Birds (隹) being brought to market to be sold (using the mouth/voice 口)."
  },
  {
    "hanzi": "療",
    "pinyin": "liáo",
    "pinyin_numbered": "liao2",
    "definition": "heal; cure; therapy; medical treatment",
    "traditional": "療",
    "simplified": "疗",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 17,
    "radicals": ["疒"],
    "category": "health",
    "frequency_rank": 1300,
    "example_words": [
      { "word": "治療", "pinyin": "zhì liáo", "def": "to treat; therapy" },
      { "word": "醫療", "pinyin": "yī liáo", "def": "medical treatment" }
    ],
    "example_sentence": {
      "sentence": "他正在接受心理治療。",
      "pinyin": "Tā zhèngzài jiēshòu xīnlǐ zhìliáo.",
      "english": "He is currently receiving psychological therapy."
    },
    "mnemonic": "Illness radical (疒) with a component for healing (療/尞) or fire-cleansing."
  },
  {
    "hanzi": "供",
    "pinyin": "gōng",
    "pinyin_numbered": "gong1",
    "definition": "supply; provide; offer; (as gòng) confession",
    "traditional": "供",
    "simplified": "供",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["人"],
    "category": "action",
    "frequency_rank": 900,
    "example_words": [
      { "word": "提供", "pinyin": "tí gōng", "def": "to provide; to supply" },
      { "word": "供應", "pinyin": "gōng yìng", "def": "supply; to furnish" }
    ],
    "example_sentence": {
      "sentence": "這家酒店提供免費早餐。",
      "pinyin": "Zhè jiā jiǔdiàn tígōng miǎnfèi zǎocān.",
      "english": "This hotel provides free breakfast."
    },
    "mnemonic": "A person (人) holding something together (共) to offer or provide it."
  },
  {
    "hanzi": "確",
    "pinyin": "què",
    "pinyin_numbered": "que4",
    "definition": "true; real; certain; firm; precise",
    "traditional": "確",
    "simplified": "确",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["石"],
    "category": "quality",
    "frequency_rank": 700,
    "example_words": [
      { "word": "確定", "pinyin": "què dìng", "def": "to determine; sure" },
      { "word": "正確", "pinyin": "zhèng què", "def": "correct; right" }
    ],
    "example_sentence": {
      "sentence": "你能確定這件事嗎？",
      "pinyin": "Nǐ néng quèdìng zhè jiàn shì ma?",
      "english": "Can you be sure about this?"
    },
    "mnemonic": "As solid as a stone (石) and as clear as a bird's (隹/寉) vision."
  },
  {
    "hanzi": "內",
    "pinyin": "nèi",
    "pinyin_numbered": "nei4",
    "definition": "inside; inner; within",
    "traditional": "內",
    "simplified": "内",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 4,
    "radicals": ["入"],
    "category": "direction",
    "frequency_rank": 200,
    "example_words": [
      { "word": "內容", "pinyin": "nèi róng", "def": "content" },
      { "word": "內地", "pinyin": "nèi dì", "def": "inland; mainland" }
    ],
    "example_sentence": {
      "sentence": "這本書的內容非常豐富。",
      "pinyin": "Zhè běn shū de nèiróng fēicháng fēngfù.",
      "english": "The content of this book is very rich."
    },
    "mnemonic": "Entering (入) a borders or a room (冂)."
  },
  {
    "hanzi": "否",
    "pinyin": "fǒu",
    "pinyin_numbered": "fou3",
    "definition": "no; not; deny; negative",
    "traditional": "否",
    "simplified": "否",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 7,
    "radicals": ["口"],
    "category": "abstract",
    "frequency_rank": 650,
    "example_words": [
      { "word": "否定", "pinyin": "fǒu dìng", "def": "to negate; negative" },
      { "word": "是否", "pinyin": "shì fǒu", "def": "whether or not" }
    ],
    "example_sentence": {
      "sentence": "我不知道他是否會來。",
      "pinyin": "Wǒ bù zhīdào tā shìfǒu huì lái.",
      "english": "I don't know whether he will come."
    },
    "mnemonic": "Using the mouth (口) to say 'no' (不)."
  },
  {
    "hanzi": "辛",
    "pinyin": "xīn",
    "pinyin_numbered": "xin1",
    "definition": "spicy; pungent; hard; bitter; suffering",
    "traditional": "辛",
    "simplified": "辛",
    "level": "b1",
    "tocfl_band": null,
    "stroke_count": 7,
    "radicals": ["辛"],
    "category": "sense",
    "frequency_rank": 1800,
    "example_words": [
      { "word": "辛苦", "pinyin": "xīn kǔ", "def": "hardship; laborious" },
      { "word": "辛辣", "pinyin": "xīn là", "def": "spicy; pungent" }
    ],
    "example_sentence": {
      "sentence": "這份工作非常辛苦。",
      "pinyin": "Zhè fèn gōngzuò fēicháng xīnkǔ.",
      "english": "This job is very laborious."
    },
    "mnemonic": "A tool used for punishment (ancient form), representing pain and hardship."
  },
  {
    "hanzi": "負",
    "pinyin": "fù",
    "pinyin_numbered": "fu4",
    "definition": "carry; bear; lose; negative; owe",
    "traditional": "負",
    "simplified": "负",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 9,
    "radicals": ["貝"],
    "category": "action",
    "frequency_rank": 850,
    "example_words": [
      { "word": "負責", "pinyin": "fù zé", "def": "to be responsible for" },
      { "word": "負面", "pinyin": "fù miàn", "def": "negative; downside" }
    ],
    "example_sentence": {
      "sentence": "誰負責這個項目？",
      "pinyin": "Shéi fùzé zhège xiàngmù?",
      "english": "Who is responsible for this project?"
    },
    "mnemonic": "A person (人) carrying money or shells (貝) on their back."
  },
  {
    "hanzi": "責",
    "pinyin": "zé",
    "pinyin_numbered": "ze2",
    "definition": "duty; responsibility; blame; punish",
    "traditional": "責",
    "simplified": "责",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 11,
    "radicals": ["貝"],
    "category": "abstract",
    "frequency_rank": 800,
    "example_words": [
      { "word": "責任", "pinyin": "zé rèn", "def": "responsibility; duty" },
      { "word": "負責", "pinyin": "fù zé", "def": "to be in charge of" }
    ],
    "example_sentence": {
      "sentence": "每個人都應該對自己的行為負責。",
      "pinyin": "Měi gè rén dōu yīnggāi duì zìjǐ de xíngwéi fùzé.",
      "english": "Everyone should be responsible for their own actions."
    },
    "mnemonic": "Accumulating (朿/刺-like growth) debts or duties involving money (貝)."
  },
  {
    "hanzi": "部",
    "pinyin": "bù",
    "pinyin_numbered": "bu4",
    "definition": "part; section; unit; ministry; MW for movies",
    "traditional": "部",
    "simplified": "部",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 11,
    "radicals": ["邑"],
    "category": "abstract",
    "frequency_rank": 250,
    "example_words": [
      { "word": "部門", "pinyin": "bù mén", "def": "department; branch" },
      { "word": "部分", "pinyin": "bù fèn", "def": "part; portion" }
    ],
    "example_sentence": {
      "sentence": "我在市場部工作。",
      "pinyin": "Wǒ zài shìchǎng bù gōngzuò.",
      "english": "I work in the marketing department."
    },
    "mnemonic": "A town (邑) divided into sections or standing (立) as a unit."
  },
  {
    "hanzi": "圍",
    "pinyin": "wéi",
    "pinyin_numbered": "wei2",
    "definition": "surround; encircle; girth; circuit",
    "traditional": "圍",
    "simplified": "围",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 12,
    "radicals": ["囗"],
    "category": "action",
    "frequency_rank": 1000,
    "example_words": [
      { "word": "周圍", "pinyin": "zhōu wéi", "def": "surroundings; around" },
      { "word": "範圍", "pinyin": "fàn wéi", "def": "scope; range" }
    ],
    "example_sentence": {
      "sentence": "學校周圍有很多小吃店。",
      "pinyin": "Xuéxiào zhōuwéi yǒu hěnduō xiǎochī diàn.",
      "english": "There are many snack shops around the school."
    },
    "mnemonic": "An enclosure (囗) with feet (韋) walking around it to encircle it."
  },
  {
    "hanzi": "簽",
    "pinyin": "qiān",
    "pinyin_numbered": "qian1",
    "definition": "sign; autograph; note; bamboo slip",
    "traditional": "簽",
    "simplified": "签",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 19,
    "radicals": ["竹"],
    "category": "action",
    "frequency_rank": 1100,
    "example_words": [
      { "word": "簽名", "pinyin": "qiān míng", "def": "to sign one's name; signature" },
      { "word": "簽證", "pinyin": "qiān zhèng", "def": "visa" }
    ],
    "example_sentence": {
      "sentence": "請在這裡簽名。",
      "pinyin": "Qǐng zài zhèlǐ qiānmíng.",
      "english": "Please sign your name here."
    },
    "mnemonic": "Using bamboo (竹) slips to gather/record (僉) signatures or notes."
  },
  {
    "hanzi": "世",
    "pinyin": "shì",
    "pinyin_numbered": "shi4",
    "definition": "world; generation; life; era",
    "traditional": "世",
    "simplified": "世",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 5,
    "radicals": ["一"],
    "category": "abstract",
    "frequency_rank": 300,
    "example_words": [
      { "word": "世界", "pinyin": "shì jiè", "def": "world" },
      { "word": "世紀", "pinyin": "shì jì", "def": "century" }
    ],
    "example_sentence": {
      "sentence": "世界地圖很大。",
      "pinyin": "Shìjiè dìtú hěn dà.",
      "english": "The world map is very large."
    },
    "mnemonic": "Three tens (十) joined together, representing a generation of thirty years."
  }
];
existing.push(...nextBatch);
fs.writeFileSync('batch3_chars.json', JSON.stringify(existing, null, 2));
