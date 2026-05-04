const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('batch3_chars.json', 'utf8'));
const nextBatch = [
  {
    'hanzi': '絡',
    'pinyin': 'luò',
    'pinyin_numbered': 'luo4',
    'definition': 'net; lace; connection',
    'traditional': '絡',
    'simplified': '络',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 12,
    'radicals': ['糸'],
    'category': 'abstract',
    'frequency_rank': 1200,
    'example_words': [
      { 'word': '聯絡', 'pinyin': 'lián luò', 'def': 'to contact; communication' },
      { 'word': '網路', 'pinyin': 'wǎng lù', 'def': 'network; internet' }
    ],
    'example_sentence': {
      'sentence': '請留下一種聯絡方式。',
      'pinyin': 'Qǐng liúxià yīzhǒng liánluò fāngshì.',
      'english': 'Please leave a way to contact you.'
    },
    'mnemonic': 'Silk threads (糸) forming a network (各).'
  },
  {
    'hanzi': '切',
    'pinyin': 'qiē',
    'pinyin_numbered': 'qie1',
    'definition': 'cut; urgent; close to',
    'traditional': '切',
    'simplified': '切',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 4,
    'radicals': ['刀'],
    'category': 'action',
    'frequency_rank': 450,
    'example_words': [
      { 'word': '切菜', 'pinyin': 'qiē cài', 'def': 'to cut vegetables' },
      { 'word': '一切', 'pinyin': 'yī qiè', 'def': 'all; everything (pronounced qiè here)' }
    ],
    'example_sentence': {
      'sentence': '請把蛋糕切成八塊。',
      'pinyin': 'Qǐng bǎ dàngāo qiēchéng bā kuài.',
      'english': 'Please cut the cake into eight pieces.'
    },
    'mnemonic': 'A knife (刀) cutting through an object (七).'
  },
  {
    'hanzi': '拜',
    'pinyin': 'bài',
    'pinyin_numbered': 'bai4',
    'definition': 'worship; visit; pay respects; salute',
    'traditional': '拜',
    'simplified': '拜',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 9,
    'radicals': ['手'],
    'category': 'action',
    'frequency_rank': 1400,
    'example_words': [
      { 'word': '拜託', 'pinyin': 'bài tuō', 'def': 'to request; please' },
      { 'word': '拜訪', 'pinyin': 'bài fǎng', 'def': 'to visit' }
    ],
    'example_sentence': {
      'sentence': '我明天要去拜訪一位老朋友。',
      'pinyin': 'Wǒ míngtiān yào qù bàifǎng yīwèi lǎo péngyǒu.',
      'english': 'I am going to visit an old friend tomorrow.'
    },
    'mnemonic': 'Two hands (手) coming together in a gesture of respect or prayer.'
  },
  {
    'hanzi': '堵',
    'pinyin': 'dǔ',
    'pinyin_numbered': 'du3',
    'definition': 'block; stop up; wall; MW for walls',
    'traditional': '堵',
    'simplified': '堵',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 12,
    'radicals': ['土'],
    'category': 'action',
    'frequency_rank': 1500,
    'example_words': [
      { 'word': '堵車', 'pinyin': 'dǔ chē', 'def': 'traffic jam' },
      { 'word': '堵塞', 'pinyin': 'dǔ sè', 'def': 'to block up; congestion' }
    ],
    'example_sentence': {
      'sentence': '路上堵車，所以我遲到了。',
      'pinyin': 'Lùshàng dǔchē, suǒyǐ wǒ chídàole.',
      'english': 'There was a traffic jam on the road, so I was late.'
    },
    'mnemonic': 'Using earth (土) to build a wall or block (者) a path.'
  },
  {
    'hanzi': '科',
    'pinyin': 'kē',
    'pinyin_numbered': 'ke1',
    'definition': 'branch of study; department; division',
    'traditional': '科',
    'simplified': '科',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 9,
    'radicals': ['禾'],
    'category': 'abstract',
    'frequency_rank': 800,
    'example_words': [
      { 'word': '科學', 'pinyin': 'kē xué', 'def': 'science' },
      { 'word': '科技', 'pinyin': 'kē jì', 'def': 'science and technology' }
    ],
    'example_sentence': {
      'sentence': '他對電腦科學感興趣。',
      'pinyin': 'Tā duì diànnǎo kēxué gǎn xìngqù.',
      'english': 'He is interested in computer science.'
    },
    'mnemonic': 'Measuring (斗) grain (禾) to classify it into categories or branches.'
  },
  {
    'hanzi': '各',
    'pinyin': 'gè',
    'pinyin_numbered': 'ge4',
    'definition': 'each; every; various; different',
    'traditional': '各',
    'simplified': '各',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 6,
    'radicals': ['口'],
    'category': 'abstract',
    'frequency_rank': 200,
    'example_words': [
      { 'word': '各位', 'pinyin': 'gè wèi', 'def': 'everyone (polite)' },
      { 'word': '各種', 'pinyin': 'gè zhǒng', 'def': 'various; all kinds of' }
    ],
    'example_sentence': {
      'sentence': '各位先生、各位女士，大家好。',
      'pinyin': 'Gèwèi xiānshēng, gèwèi nǚshì, dàjiā hǎo.',
      'english': 'Hello, ladies and gentlemen.'
    },
    'mnemonic': 'People walking (夂) in different directions to their own entries (口).'
  },
  {
    'hanzi': '向',
    'pinyin': 'xiàng',
    'pinyin_numbered': 'xiang4',
    'definition': 'towards; direction; to face',
    'traditional': '向',
    'simplified': '向',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 6,
    'radicals': ['口'],
    'category': 'direction',
    'frequency_rank': 150,
    'example_words': [
      { 'word': '方向', 'pinyin': 'fāng xiàng', 'def': 'direction' },
      { 'word': '面向', 'pinyin': 'miàn xiàng', 'def': 'to face towards' }
    ],
    'example_sentence': {
      'sentence': '請向右轉。',
      'pinyin': 'Qǐng xiàng yòu zhuǎn.',
      'english': 'Please turn right.'
    },
    'mnemonic': 'A window in a house representing direction or facing a certain way.'
  },
  {
    'hanzi': '氛',
    'pinyin': 'fēn',
    'pinyin_numbered': 'fen1',
    'definition': 'atmosphere; vapor; air',
    'traditional': '氛',
    'simplified': '氛',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 8,
    'radicals': ['气'],
    'category': 'abstract',
    'frequency_rank': 1800,
    'example_words': [
      { 'word': '氣氛', 'pinyin': 'qì fēn', 'def': 'atmosphere; mood' }
    ],
    'example_sentence': {
      'sentence': '這間餐廳的氣氛很好。',
      'pinyin': 'Zhè jiān cāntǐng de qìfēn hěn hǎo.',
      'english': 'The atmosphere of this restaurant is very good.'
    },
    'mnemonic': 'Gas/Air (气) distributed (分) in a space, creating an atmosphere.'
  },
  {
    'hanzi': '搬',
    'pinyin': 'bān',
    'pinyin_numbered': 'ban1',
    'definition': 'move; shift; remove; transport',
    'traditional': '搬',
    'simplified': '搬',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 13,
    'radicals': ['手'],
    'category': 'action',
    'frequency_rank': 1300,
    'example_words': [
      { 'word': '搬家', 'pinyin': 'bān jiā', 'def': 'to move house' },
      { 'word': '搬運', 'pinyin': 'bān yùn', 'def': 'to transport; to carry' }
    ],
    'example_sentence': {
      'sentence': '我們下個月要搬家。',
      'pinyin': 'Wǒmen xià gè yuè yào bānjiā.',
      'english': 'We are moving house next month.'
    },
    'mnemonic': 'Using hands (手) to move things onto a boat (舟) and take them away (殳).'
  },
  {
    'hanzi': '座',
    'pinyin': 'zuò',
    'pinyin_numbered': 'zuo4',
    'definition': 'seat; base; MW for large objects (buildings, mountains)',
    'traditional': '座',
    'simplified': '座',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 10,
    'radicals': ['广'],
    'category': 'items',
    'frequency_rank': 1100,
    'example_words': [
      { 'word': '座位', 'pinyin': 'zuò wèi', 'def': 'seat' },
      { 'word': '星座', 'pinyin': 'xīng zuò', 'def': 'constellation' }
    ],
    'example_sentence': {
      'sentence': '這座山很高。',
      'pinyin': 'Zhè zuò shān hěn gāo.',
      'english': 'This mountain is very high.'
    },
    'mnemonic': 'People (坐) under a roof (广), representing a formal seat or base.'
  },
  {
    'hanzi': '城',
    'pinyin': 'chéng',
    'pinyin_numbered': 'cheng2',
    'definition': 'city; town; city wall',
    'traditional': '城',
    'simplified': '城',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 9,
    'radicals': ['土'],
    'category': 'place',
    'frequency_rank': 350,
    'example_words': [
      { 'word': '城市', 'pinyin': 'chéng shì', 'def': 'city' },
      { 'word': '城牆', 'pinyin': 'chéng qiáng', 'def': 'city wall' }
    ],
    'example_sentence': {
      'sentence': '台北是一個繁華的城市。',
      'pinyin': 'Táiběi shì yīgè fánhuá de chéngshì.',
      'english': 'Taipei is a bustling city.'
    },
    'mnemonic': 'Walls made of earth (土) to complete (成) a city.'
  },
  {
    'hanzi': '慣',
    'pinyin': 'guàn',
    'pinyin_numbered': 'guan4',
    'definition': 'accustomed; habit; to spoil (a child)',
    'traditional': '慣',
    'simplified': '惯',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 14,
    'radicals': ['心'],
    'category': 'abstract',
    'frequency_rank': 1000,
    'example_words': [
      { 'word': '習慣', 'pinyin': 'xí guàn', 'def': 'habit; to be used to' },
      { 'word': '慣性', 'pinyin': 'guàn xìng', 'def': 'inertia' }
    ],
    'example_sentence': {
      'sentence': '我不習慣早起。',
      'pinyin': 'Wǒ bù xíguàn zǎoqǐ.',
      'english': 'I am not used to getting up early.'
    },
    'mnemonic': 'Heart (心) becoming accustomed to something through repeated practice (貫).'
  },
  {
    'hanzi': '投',
    'pinyin': 'tóu',
    'pinyin_numbered': 'tou2',
    'definition': 'throw; cast; invest; send',
    'traditional': '投',
    'simplified': '投',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 7,
    'radicals': ['手'],
    'category': 'action',
    'frequency_rank': 700,
    'example_words': [
      { 'word': '投資', 'pinyin': 'tóu zī', 'def': 'to invest; investment' },
      { 'word': '投票', 'pinyin': 'tóu piào', 'def': 'to vote' }
    ],
    'example_sentence': {
      'sentence': '他把球投進了籃框。',
      'pinyin': 'Tā bǎ qiú tóujìnle lánkuāng.',
      'english': 'He threw the ball into the basket.'
    },
    'mnemonic': 'Using hands (手) to throw a weapon or object (殳).'
  },
  {
    'hanzi': '簡',
    'pinyin': 'jiǎn',
    'pinyin_numbered': 'jian3',
    'definition': 'simple; brief; bamboo slips (for writing)',
    'traditional': '簡',
    'simplified': '简',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 18,
    'radicals': ['竹'],
    'category': 'abstract',
    'frequency_rank': 900,
    'example_words': [
      { 'word': '簡單', 'pinyin': 'jiǎn dān', 'def': 'simple' },
      { 'word': '簡介', 'pinyin': 'jiǎn jiè', 'def': 'brief introduction' }
    ],
    'example_sentence': {
      'sentence': '這個問題很簡單。',
      'pinyin': 'Zhège wèntí hěn jiǎndān.',
      'english': 'This question is very simple.'
    },
    'mnemonic': 'Bamboo (竹) slips used for writing brief or simple notes (間).'
  },
  {
    'hanzi': '支',
    'pinyin': 'zhī',
    'pinyin_numbered': 'zhi1',
    'definition': 'support; branch; to pay; MW for pens/songs/teams',
    'traditional': '支',
    'simplified': '支',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 4,
    'radicals': ['支'],
    'category': 'abstract',
    'frequency_rank': 800,
    'example_words': [
      { 'word': '支持', 'pinyin': 'zhī chí', 'def': 'to support' },
      { 'word': '支票', 'pinyin': 'zhī piào', 'def': 'check (money)' }
    ],
    'example_sentence': {
      'sentence': '謝謝你的支持。',
      'pinyin': 'Xièxiè nǐ de zhīchí.',
      'english': 'Thank you for your support.'
    },
    'mnemonic': 'A hand holding a branch, representing support or a division.'
  },
  {
    'hanzi': '味',
    'pinyin': 'wèi',
    'pinyin_numbered': 'wei4',
    'definition': 'taste; flavor; smell; interest',
    'traditional': '味',
    'simplified': '味',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 8,
    'radicals': ['口'],
    'category': 'sense',
    'frequency_rank': 900,
    'example_words': [
      { 'word': '味道', 'pinyin': 'wèi dào', 'def': 'taste; flavor' },
      { 'word': '美味', 'pinyin': 'měi wèi', 'def': 'delicious' }
    ],
    'example_sentence': {
      'sentence': '這道菜的味道非常好。',
      'pinyin': 'Zhè dào cài de wèidào fēicháng hǎo.',
      'english': 'The taste of this dish is very good.'
    },
    'mnemonic': 'Using the mouth (口) to experience the future (未) flavor.'
  },
  {
    'hanzi': '清',
    'pinyin': 'qīng',
    'pinyin_numbered': 'qing1',
    'definition': 'clear; pure; clean; peaceful',
    'traditional': '清',
    'simplified': '清',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 11,
    'radicals': ['水'],
    'category': 'quality',
    'frequency_rank': 400,
    'example_words': [
      { 'word': '清楚', 'pinyin': 'qīng chǔ', 'def': 'clear; distinct' },
      { 'word': '清潔', 'pinyin': 'qīng jié', 'def': 'to clean; clean' }
    ],
    'example_sentence': {
      'sentence': '湖水非常清澈。',
      'pinyin': 'Húshuǐ fēicháng qīngchè.',
      'english': 'The lake water is very clear.'
    },
    'mnemonic': 'Water (水) that is as pure and green (青) as nature.'
  },
  {
    'hanzi': '忌',
    'pinyin': 'jì',
    'pinyin_numbered': 'ji4',
    'definition': 'avoid; taboo; jealousy; to fear',
    'traditional': '忌',
    'simplified': '忌',
    'level': 'b1',
    'tocfl_band': null,
    'stroke_count': 7,
    'radicals': ['心'],
    'category': 'abstract',
    'frequency_rank': 1700,
    'example_words': [
      { 'word': '禁忌', 'pinyin': 'jìn jì', 'def': 'taboo' },
      { 'word': '忌妒', 'pinyin': 'jì dù', 'def': 'jealous; envy' }
    ],
    'example_sentence': {
      'sentence': '他在飲食上有很多禁忌。',
      'pinyin': 'Tā zài yǐnshí shàng yǒu hěnduō jìnjì.',
      'english': 'He has many dietary taboos.'
    },
    'mnemonic': 'One heart (心) being restricted or feeling self-conscious (己).'
  },
  {
    'hanzi': '滿',
    'pinyin': 'mǎn',
    'pinyin_numbered': 'man3',
    'definition': 'full; filled; satisfied; packed',
    'traditional': '滿',
    'simplified': '满',
    'level': 'a1',
    'tocfl_band': null,
    'stroke_count': 13,
    'radicals': ['水'],
    'category': 'quality',
    'frequency_rank': 500,
    'example_words': [
      { 'word': '滿意', 'pinyin': 'mǎn yì', 'def': 'satisfied; pleased' },
      { 'word': '充滿', 'pinyin': 'chōng mǎn', 'def': 'to be full of; brimming with' }
    ],
    'example_sentence': {
      'sentence': '這杯水已經滿了。',
      'pinyin': 'Zhè bēi shuǐ yǐjīng mǎnle.',
      'english': 'This cup of water is already full.'
    },
    'mnemonic': 'Water (水) filling a container to the brim (廿/兩/市).'
  },
  {
    'hanzi': '訂',
    'pinyin': 'dìng',
    'pinyin_numbered': 'ding4',
    'definition': 'order; subscribe; agree; book (a room)',
    'traditional': '訂',
    'simplified': '订',
    'level': 'a2',
    'tocfl_band': null,
    'stroke_count': 9,
    'radicals': ['言'],
    'category': 'action',
    'frequency_rank': 1200,
    'example_words': [
      { 'word': '訂購', 'pinyin': 'dìng gòu', 'def': 'to order (goods)' },
      { 'word': '預訂', 'pinyin': 'yù dìng', 'def': 'to book; to reserve' }
    ],
    'example_sentence': {
      'sentence': '我想訂一個雙人房。',
      'pinyin': 'Wǒ xiǎng dìng yīgè shuāngrén fáng.',
      'english': 'I would like to book a double room.'
    },
    'mnemonic': 'Speaking (言) to nail down (丁) an agreement or order.'
  }
];
existing.push(...nextBatch);
fs.writeFileSync('batch3_chars.json', JSON.stringify(existing, null, 2));
