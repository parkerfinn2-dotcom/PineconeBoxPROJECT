// 单词数据，按难度分级
// 难度1：简单词汇
// 难度2：基础词汇
// 难度3：进阶词汇
// 难度4：拓展词汇

const wordsData = {
  level1: [
    {
      id: 1,
      word: 'apple',
      phonetic: '/ˈæpl/',
      meaning: '苹果',
      relatedWords: ['fruit', 'red'],
      sentence: 'I eat an apple every day.',
      level: 1
    },
    {
      id: 2,
      word: 'banana',
      phonetic: '/bəˈnɑːnə/',
      meaning: '香蕉',
      relatedWords: ['yellow', 'sweet'],
      sentence: 'Bananas are my favorite fruit.',
      level: 1
    },
    {
      id: 3,
      word: 'cat',
      phonetic: '/kæt/',
      meaning: '猫',
      relatedWords: ['pet', 'meow'],
      sentence: 'The cat is sleeping on the sofa.',
      level: 1
    },
    {
      id: 4,
      word: 'dog',
      phonetic: '/dɔːɡ/',
      meaning: '狗',
      relatedWords: ['loyal', 'bark'],
      sentence: 'My dog likes to play fetch.',
      level: 1
    },
    {
      id: 5,
      word: 'fish',
      phonetic: '/fɪʃ/',
      meaning: '鱼',
      relatedWords: ['water', 'swim'],
      sentence: 'Fish live in the river.',
      level: 1
    }
  ],
  level2: [
    {
      id: 6,
      word: 'elephant',
      phonetic: '/ˈelɪfənt/',
      meaning: '大象',
      relatedWords: ['big', 'trunk'],
      sentence: 'The elephant has a long trunk.',
      level: 2
    },
    {
      id: 7,
      word: 'grape',
      phonetic: '/ɡreɪp/',
      meaning: '葡萄',
      relatedWords: ['purple', 'vine'],
      sentence: 'Grapes grow on vines.',
      level: 2
    },
    {
      id: 8,
      word: 'house',
      phonetic: '/haʊs/',
      meaning: '房子',
      relatedWords: ['home', 'family'],
      sentence: 'We live in a big house.',
      level: 2
    },
    {
      id: 9,
      word: 'juice',
      phonetic: '/dʒuːs/',
      meaning: '果汁',
      relatedWords: ['drink', 'fresh'],
      sentence: 'I like orange juice for breakfast.',
      level: 2
    },
    {
      id: 10,
      word: 'kite',
      phonetic: '/kaɪt/',
      meaning: '风筝',
      relatedWords: ['fly', 'wind'],
      sentence: 'We fly kites in the park.',
      level: 2
    }
  ],
  level3: [
    {
      id: 11,
      word: 'library',
      phonetic: '/ˈlaɪbreri/',
      meaning: '图书馆',
      relatedWords: ['book', 'read'],
      sentence: 'I borrow books from the library.',
      level: 3
    },
    {
      id: 12,
      word: 'mountain',
      phonetic: '/ˈmaʊntən/',
      meaning: '山',
      relatedWords: ['high', 'climb'],
      sentence: 'We climb the mountain every summer.',
      level: 3
    },
    {
      id: 13,
      word: 'ocean',
      phonetic: '/ˈoʊʃn/',
      meaning: '海洋',
      relatedWords: ['blue', 'wave'],
      sentence: 'The ocean is very deep.',
      level: 3
    },
    {
      id: 14,
      word: 'piano',
      phonetic: '/piˈænoʊ/',
      meaning: '钢琴',
      relatedWords: ['music', 'play'],
      sentence: 'She plays the piano beautifully.',
      level: 3
    },
    {
      id: 15,
      word: 'rainbow',
      phonetic: '/ˈreɪnboʊ/',
      meaning: '彩虹',
      relatedWords: ['color', 'rain'],
      sentence: 'We see a rainbow after the rain.',
      level: 3
    }
  ],
  level4: [
    {
      id: 16,
      word: 'butterfly',
      phonetic: '/ˈbʌtərflaɪ/',
      meaning: '蝴蝶',
      relatedWords: ['beautiful', 'fly'],
      sentence: 'The butterfly flutters its wings.',
      level: 4
    },
    {
      id: 17,
      word: 'chocolate',
      phonetic: '/ˈtʃɔːklət/',
      meaning: '巧克力',
      relatedWords: ['sweet', 'delicious'],
      sentence: 'I love eating chocolate cake.',
      level: 4
    },
    {
      id: 18,
      word: 'dinosaur',
      phonetic: '/ˈdaɪnəsɔːr/',
      meaning: '恐龙',
      relatedWords: ['big', 'extinct'],
      sentence: 'Dinosaurs lived millions of years ago.',
      level: 4
    },
    {
      id: 19,
      word: 'elevation',
      phonetic: '/ˌelɪˈveɪʃn/',
      meaning: '海拔',
      relatedWords: ['height', 'mountain'],
      sentence: 'The elevation of this mountain is 5000 meters.',
      level: 4
    },
    {
      id: 20,
      word: 'firefly',
      phonetic: '/ˈfaɪərflaɪ/',
      meaning: '萤火虫',
      relatedWords: ['light', 'night'],
      sentence: 'Fireflies glow in the dark.',
      level: 4
    }
  ]
}

export default wordsData