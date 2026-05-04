const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('batch3_chars.json', 'utf8'));
const nextBatch = [
  {
    "hanzi": "氏",
    "pinyin": "shì",
    "pinyin_numbered": "shi4",
    "definition": "clan; family name; surname",
    "traditional": "氏",
    "simplified": "氏",
    "level": "b1",
    "tocfl_band": null,
    "stroke_count": 4,
    "radicals": ["氏"],
    "category": "abstract",
    "frequency_rank": 1200,
    "example_words": [
      { "word": "攝氏", "pinyin": "shè shì", "def": "Celsius" },
      { "word": "姓氏", "pinyin": "xìng shì", "def": "family name; surname" }
    ],
    "example_sentence": {
      "sentence": "今天的氣溫是攝氏三十度。",
      "pinyin": "Jīntiān de qìwēn shì shèshì sānshí dù.",
      "english": "Today's temperature is thirty degrees Celsius."
    },
    "mnemonic": "A symbol representing a family branch or clan root."
  },
  {
    "hanzi": "林",
    "pinyin": "lín",
    "pinyin_numbered": "lin2",
    "definition": "forest; woods; grove; collection",
    "traditional": "林",
    "simplified": "林",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["木"],
    "category": "nature",
    "frequency_rank": 400,
    "example_words": [
      { "word": "森林", "pinyin": "sēn lín", "def": "forest" },
      { "word": "林業", "pinyin": "lín yè", "def": "forestry" }
    ],
    "example_sentence": {
      "sentence": "我們去森林裡散步吧。",
      "pinyin": "Wǒmen qù sēnlín lǐ sànbù ba.",
      "english": "Let's go for a walk in the forest."
    },
    "mnemonic": "Two trees (木) standing together make a woods or forest."
  },
  {
    "hanzi": "求",
    "pinyin": "qiú",
    "pinyin_numbered": "qiu2",
    "definition": "seek; request; beg; demand",
    "traditional": "求",
    "simplified": "求",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 7,
    "radicals": ["水"],
    "category": "action",
    "frequency_rank": 550,
    "example_words": [
      { "word": "請求", "pinyin": "qǐng qiú", "def": "to request; entreat" },
      { "word": "要求", "pinyin": "yāo qiú", "def": "requirement; to demand" }
    ],
    "example_sentence": {
      "sentence": "他請求我的幫助。",
      "pinyin": "Tā qǐngqiú wǒ de bāngzhù.",
      "english": "He requested my help."
    },
    "mnemonic": "A hand reaching out for water, or a simplified representation of fur/hide (ancient form) that people sought."
  },
  {
    "hanzi": "蝦",
    "pinyin": "xiā",
    "pinyin_numbered": "xia1",
    "definition": "shrimp; prawn",
    "traditional": "蝦",
    "simplified": "虾",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["虫"],
    "category": "nature",
    "frequency_rank": 1800,
    "example_words": [
      { "word": "龍蝦", "pinyin": "lóng xiā", "def": "lobster" },
      { "word": "蝦米", "pinyin": "xiā mǐ", "def": "dried small shrimp" }
    ],
    "example_sentence": {
      "sentence": "這家餐廳的蝦料理很有名。",
      "pinyin": "Zhè jiā cāntǐng de xiā liàolǐ hěn yǒumíng.",
      "english": "The shrimp dishes at this restaurant are very famous."
    },
    "mnemonic": "An insect/creature (虫) that is small or stays in the lower (叚) waters."
  },
  {
    "hanzi": "宮",
    "pinyin": "gōng",
    "pinyin_numbered": "gong1",
    "definition": "palace; temple; womb; first note in pentatonic scale",
    "traditional": "宮",
    "simplified": "宫",
    "level": "b1",
    "tocfl_band": null,
    "stroke_count": 10,
    "radicals": ["宀"],
    "category": "place",
    "frequency_rank": 1100,
    "example_words": [
      { "word": "皇宮", "pinyin": "huáng gōng", "def": "imperial palace" },
      { "word": "迷宮", "pinyin": "mí gōng", "def": "maze; labyrinth" }
    ],
    "example_sentence": {
      "sentence": "故宮是北京著名的景點。",
      "pinyin": "Gùgōng shì Běijīng zhùmíng de jǐngdiǎn.",
      "english": "The Forbidden City is a famous scenic spot in Beijing."
    },
    "mnemonic": "A large building (宀) with many rooms (呂) connected together."
  },
  {
    "hanzi": "丁",
    "pinyin": "dīng",
    "pinyin_numbered": "ding1",
    "definition": "man; small cube (food); nail; 4th heavenly stem",
    "traditional": "丁",
    "simplified": "丁",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 2,
    "radicals": ["一"],
    "category": "abstract",
    "frequency_rank": 1400,
    "example_words": [
      { "word": "布丁", "pinyin": "bù dīng", "def": "pudding" },
      { "word": "肉丁", "pinyin": "ròu dīng", "def": "diced meat" }
    ],
    "example_sentence": {
      "sentence": "我最喜歡吃巧克力布丁。",
      "pinyin": "Wǒ zuì xǐhuān chī qiǎokèlì bùdīng.",
      "english": "I like eating chocolate pudding the most."
    },
    "mnemonic": "The shape of a nail or a person standing firmly."
  },
  {
    "hanzi": "微",
    "pinyin": "wēi",
    "pinyin_numbered": "wei1",
    "definition": "tiny; small; micro; slight",
    "traditional": "微",
    "simplified": "微",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["彳"],
    "category": "quality",
    "frequency_rank": 600,
    "example_words": [
      { "word": "微笑", "pinyin": "wēi xiào", "def": "to smile" },
      { "word": "稍微", "pinyin": "shāo wēi", "def": "a little bit; slightly" }
    ],
    "example_sentence": {
      "sentence": "他對我露出了微笑。",
      "pinyin": "Tā duì wǒ lùchūle wēixiào.",
      "english": "He gave me a smile."
    },
    "mnemonic": "A small step (彳) taken by a tiny person (微) or hidden movement."
  },
  {
    "hanzi": "蔥",
    "pinyin": "cōng",
    "pinyin_numbered": "cong1",
    "definition": "onion; scallion; green",
    "traditional": "蔥",
    "simplified": "葱",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["艸"],
    "category": "nature",
    "frequency_rank": 1900,
    "example_words": [
      { "word": "洋蔥", "pinyin": "yáng cōng", "def": "onion" },
      { "word": "蔥花", "pinyin": "cōng huā", "def": "chopped green onions" }
    ],
    "example_sentence": {
      "sentence": "我不喜歡吃洋蔥。",
      "pinyin": "Wǒ bù xǐhuān chī yángcōng.",
      "english": "I don't like eating onions."
    },
    "mnemonic": "A plant (艸) that is hollow or has a specific sharp (悤) taste."
  },
  {
    "hanzi": "爆",
    "pinyin": "bào",
    "pinyin_numbered": "bao4",
    "definition": "explode; burst; pop; quick-fry",
    "traditional": "爆",
    "simplified": "爆",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 19,
    "radicals": ["火"],
    "category": "action",
    "frequency_rank": 1200,
    "example_words": [
      { "word": "爆炸", "pinyin": "bào zhà", "def": "explosion; to explode" },
      { "word": "爆米花", "pinyin": "bào mǐ huā", "def": "popcorn" }
    ],
    "example_sentence": {
      "sentence": "看電影時，我喜歡吃爆米花。",
      "pinyin": "Kàn diànyǐng shí, wǒ xǐhuān chī bàomǐhuā.",
      "english": "I like eating popcorn while watching a movie."
    },
    "mnemonic": "Fire (火) causing something to burst or explode (暴)."
  },
  {
    "hanzi": "芒",
    "pinyin": "máng",
    "pinyin_numbered": "mang2",
    "definition": "miscanthus; mango; sharp point; awn",
    "traditional": "芒",
    "simplified": "芒",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 9,
    "radicals": ["艸"],
    "category": "nature",
    "frequency_rank": 2000,
    "example_words": [
      { "word": "芒果", "pinyin": "máng guǒ", "def": "mango" },
      { "word": "光芒", "pinyin": "guāng máng", "def": "rays of light; radiance" }
    ],
    "example_sentence": {
      "sentence": "夏天的芒果很好吃。",
      "pinyin": "Xiàtiān de mángguǒ hěn hǎochī.",
      "english": "The mangoes in summer are delicious."
    },
    "mnemonic": "A plant (艸) that has sharp points (亡/perish-like edge) or used for the fruit mango."
  },
  {
    "hanzi": "布",
    "pinyin": "bù",
    "pinyin_numbered": "bu4",
    "definition": "cloth; spread; announce; distribute",
    "traditional": "布",
    "simplified": "布",
    "level": "a1",
    "tocfl_band": null,
    "stroke_count": 5,
    "radicals": ["巾"],
    "category": "items",
    "frequency_rank": 650,
    "example_words": [
      { "word": "宣布", "pinyin": "xuān bù", "def": "to announce" },
      { "word": "帆布", "pinyin": "fān bù", "def": "canvas" }
    ],
    "example_sentence": {
      "sentence": "校長宣布了放假的訊息。",
      "pinyin": "Xiàozhǎng xuānbùle fàngjià de xùnxī.",
      "english": "The principal announced the holiday news."
    },
    "mnemonic": "Using a towel or cloth (巾) to spread or cover (父-like action) an area."
  },
  {
    "hanzi": "統",
    "pinyin": "tǒng",
    "pinyin_numbered": "tong3",
    "definition": "unite; govern; system; interconnected",
    "traditional": "統",
    "simplified": "统",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 12,
    "radicals": ["糸"],
    "category": "abstract",
    "frequency_rank": 500,
    "example_words": [
      { "word": "總統", "pinyin": "zǒng tǒng", "def": "president" },
      { "word": "統計", "pinyin": "tǒng jì", "def": "statistics" }
    ],
    "example_sentence": {
      "sentence": "這位總統很受人民歡迎。",
      "pinyin": "Zhè wèi zǒngtǒng hěn shòu rénmín huānyíng.",
      "english": "This president is very popular with the people."
    },
    "mnemonic": "Silk threads (糸) being gathered together to form a system or unified (充) whole."
  },
  {
    "hanzi": "編",
    "pinyin": "biān",
    "pinyin_numbered": "bian1",
    "definition": "weave; edit; compile; organize",
    "traditional": "編",
    "simplified": "编",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["糸"],
    "category": "action",
    "frequency_rank": 1000,
    "example_words": [
      { "word": "編輯", "pinyin": "biān jí", "def": "to edit; editor" },
      { "word": "編號", "pinyin": "biān hào", "def": "serial number" }
    ],
    "example_sentence": {
      "sentence": "他在一家出版社當編輯。",
      "pinyin": "Tā zài yījiā chūbǎnshè dāng biānjí.",
      "english": "He works as an editor at a publishing house."
    },
    "mnemonic": "Silk threads (糸) being woven together into a book or flat (扁) structure."
  },
  {
    "hanzi": "載",
    "pinyin": "zài",
    "pinyin_numbered": "zai4",
    "definition": "load; carry; hold; record; year (as zǎi)",
    "traditional": "載",
    "simplified": "载",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["車"],
    "category": "action",
    "frequency_rank": 800,
    "example_words": [
      { "word": "下載", "pinyin": "xià zài", "def": "to download" },
      { "word": "載客", "pinyin": "zài kè", "def": "to carry passengers" }
    ],
    "example_sentence": {
      "sentence": "我正在下載這個檔案。",
      "pinyin": "Wǒ zhèngzài xiàzài zhège dàng'àn.",
      "english": "I am downloading this file."
    },
    "mnemonic": "A vehicle (車) carrying items or recording (𢦏) info."
  },
  {
    "hanzi": "具",
    "pinyin": "jù",
    "pinyin_numbered": "ju4",
    "definition": "tool; device; possess; provide",
    "traditional": "具",
    "simplified": "具",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["八"],
    "category": "items",
    "frequency_rank": 750,
    "example_words": [
      { "word": "工具", "pinyin": "gōng jù", "def": "tool; instrument" },
      { "word": "具體", "pinyin": "jù tǐ", "def": "concrete; specific" }
    ],
    "example_sentence": {
      "sentence": "請給出具體的建議。",
      "pinyin": "Qǐng gěichū jùtǐ de jiànyì.",
      "english": "Please provide specific suggestions."
    },
    "mnemonic": "Using hands (八) to hold a shell/cauldron (目-like ancient form), representing tools or preparations."
  },
  {
    "hanzi": "誇",
    "pinyin": "kuā",
    "pinyin_numbered": "kua1",
    "definition": "boast; exaggerate; praise",
    "traditional": "誇",
    "simplified": "夸",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["言"],
    "category": "action",
    "frequency_rank": 1600,
    "example_words": [
      { "word": "誇張", "pinyin": "kuā zhāng", "def": "exaggerated" },
      { "word": "誇獎", "pinyin": "kuā jiǎng", "def": "to praise" }
    ],
    "example_sentence": {
      "sentence": "媽媽誇獎他是個好孩子。",
      "pinyin": "Māma kuājiǎng tā shìgè hǎo háizi.",
      "english": "Mother praised him for being a good child."
    },
    "mnemonic": "Words (言) that are large or exaggerated (夸)."
  },
  {
    "hanzi": "獎",
    "pinyin": "jiǎng",
    "pinyin_numbered": "jiang3",
    "definition": "prize; award; reward; encourage",
    "traditional": "獎",
    "simplified": "奖",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 15,
    "radicals": ["大"],
    "category": "items",
    "frequency_rank": 900,
    "example_words": [
      { "word": "獎金", "pinyin": "jiǎng jīn", "def": "bonus; prize money" },
      { "word": "獎勵", "pinyin": "jiǎng lì", "def": "reward; incentive" }
    ],
    "example_sentence": {
      "sentence": "他在比賽中得到了一等獎。",
      "pinyin": "Tā zài bǐsài zhōng dédàole yīděngjiǎng.",
      "english": "He won the first prize in the competition."
    },
    "mnemonic": "A dog (犬) or general (將) being rewarded by a large (大) prize."
  },
  {
    "hanzi": "招",
    "pinyin": "zhāo",
    "pinyin_numbered": "zhao1",
    "definition": "beckon; recruit; attract; trick/move",
    "traditional": "招",
    "simplified": "招",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 8,
    "radicals": ["手"],
    "category": "action",
    "frequency_rank": 850,
    "example_words": [
      { "word": "招聘", "pinyin": "zhāo pìn", "def": "to recruit; job recruitment" },
      { "word": "招手", "pinyin": "zhāo shǒu", "def": "to wave one's hand" }
    ],
    "example_sentence": {
      "sentence": "這家公司正在招聘新員工。",
      "pinyin": "Zhè jiā gōngsī zhèngzài zhāopìn xīn yuángōng.",
      "english": "This company is recruiting new employees."
    },
    "mnemonic": "Using a hand (手) to call out or invite (召) someone."
  },
  {
    "hanzi": "聘",
    "pinyin": "pìn",
    "pinyin_numbered": "pin4",
    "definition": "hire; employ; engage; betroth",
    "traditional": "聘",
    "simplified": "聘",
    "level": "b1",
    "tocfl_band": null,
    "stroke_count": 13,
    "radicals": ["耳"],
    "category": "action",
    "frequency_rank": 1500,
    "example_words": [
      { "word": "招聘", "pinyin": "zhāo pìn", "def": "recruitment" },
      { "word": "聘請", "pinyin": "pìn qǐng", "def": "to hire; to engage" }
    ],
    "example_sentence": {
      "sentence": "學校聘請他當教授。",
      "pinyin": "Xuéxiào pìnqǐng tā dāng jiàoshòu.",
      "english": "The school hired him as a professor."
    },
    "mnemonic": "Listening (耳) to someone's reputation to hire or engage (甹) them."
  },
  {
    "hanzi": "錄",
    "pinyin": "lù",
    "pinyin_numbered": "lu4",
    "definition": "record; write down; hire; collection",
    "traditional": "錄",
    "simplified": "录",
    "level": "a2",
    "tocfl_band": null,
    "stroke_count": 16,
    "radicals": ["金"],
    "category": "action",
    "frequency_rank": 800,
    "example_words": [
      { "word": "錄音", "pinyin": "lù yīn", "def": "to record sound; sound recording" },
      { "word": "錄取", "pinyin": "lù qǔ", "def": "to admit; to accept (candidate)" }
    ],
    "example_sentence": {
      "sentence": "請把這段話錄下來。",
      "pinyin": "Qǐng bǎ zhè duàn huà lù xiàlái.",
      "english": "Please record this passage."
    },
    "mnemonic": "A metal (金) plate or tool used to carve/record flowing (彔) information."
  }
];
existing.push(...nextBatch);
fs.writeFileSync('batch3_chars.json', JSON.stringify(existing, null, 2));
