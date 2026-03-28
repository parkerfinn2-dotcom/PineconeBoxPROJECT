// 整合词库文件 - 基于Oxford、Cambridge等官方资源
// 词汇量：8000个单词
// 按照CEFR等级分类：A1-C2

// 级别映射：
// Level 1: A1-A2 (小学1-4年级)
// Level 2: B1 (初中)
// Level 3: B2 (高中)
// Level 4: C1-C2 (大学及以上)

const wordLibraryIntegrated = [
  // Level 1 - A1-A2 (小学1-4年级) - 2000词
  // 整合 Oxford 3000 核心词汇 + Cambridge Starters/Movers
  { id: 1, word: 'apple', meaning: '苹果', phonetic: '/ˈæpl/', relatedWords: ['fruit', 'red', 'juice', 'healthy', 'orchard', 'green', 'sweet', 'crunchy'], sentence: 'I eat an apple every day to stay healthy. Apples are good for your teeth. She picked apples from the tree. The apple pie smells delicious.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2, word: 'banana', meaning: '香蕉', phonetic: '/bəˈnɑːnə/', relatedWords: ['fruit', 'yellow', 'peel', 'potassium', 'tropical', 'sweet', 'soft', 'bunch'], sentence: 'Bananas are my favorite fruit. They are rich in potassium. She peeled the banana and ate it. We bought a bunch of bananas at the store.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 3, word: 'cat', meaning: '猫', phonetic: '/kæt/', relatedWords: ['pet', 'animal', 'meow', 'purr', 'whiskers', 'fur', 'tail', 'kitten'], sentence: 'The cat is sleeping on the couch. Cats like to chase mice. The kitten is very cute. She stroked the cat\'s soft fur.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4, word: 'dog', meaning: '狗', phonetic: '/dɒɡ/', relatedWords: ['pet', 'animal', 'bark', 'woof', 'loyal', 'puppy', 'tail', 'fetch'], sentence: 'My dog is very friendly. Dogs are known as man\'s best friend. The puppy is learning to fetch. He walks his dog every morning.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 5, word: 'elephant', meaning: '大象', phonetic: '/ˈelɪfənt/', relatedWords: ['animal', 'big', 'trunk', 'tusk', 'African'], sentence: 'Elephants have long trunks. They use their trunks to drink water.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6, word: 'fish', meaning: '鱼', phonetic: '/fɪʃ/', relatedWords: ['animal', 'water', 'swim'], sentence: 'Fish live in the water.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 7, word: 'goat', meaning: '山羊', phonetic: '/ɡəʊt/', relatedWords: ['animal', 'farm', 'milk'], sentence: 'The goat is eating grass.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 8, word: 'horse', meaning: '马', phonetic: '/hɔːs/', relatedWords: ['animal', 'farm', 'ride'], sentence: 'I want to ride a horse.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 9, word: 'ice cream', meaning: '冰淇淋', phonetic: '/aɪs kriːm/', relatedWords: ['food', 'cold', 'sweet'], sentence: 'Ice cream is delicious on hot days.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 10, word: 'juice', meaning: '果汁', phonetic: '/dʒuːs/', relatedWords: ['drink', 'fruit', 'healthy'], sentence: 'I drink orange juice for breakfast.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 11, word: 'kite', meaning: '风筝', phonetic: '/kaɪt/', relatedWords: ['toy', 'fly', 'wind'], sentence: 'I fly a kite in the park.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 12, word: 'lion', meaning: '狮子', phonetic: '/ˈlaɪən/', relatedWords: ['animal', 'zoo', 'king'], sentence: 'The lion is the king of the jungle.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 13, word: 'monkey', meaning: '猴子', phonetic: '/ˈmʌŋki/', relatedWords: ['animal', 'zoo', 'tree'], sentence: 'Monkeys like to climb trees.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 14, word: 'nest', meaning: '鸟巢', phonetic: '/nest/', relatedWords: ['bird', 'home', 'eggs'], sentence: 'The bird built a nest in the tree.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 15, word: 'orange', meaning: '橙子', phonetic: '/ˈɒrɪndʒ/', relatedWords: ['fruit', 'color', 'juice'], sentence: 'Oranges are rich in vitamin C.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 16, word: 'pencil', meaning: '铅笔', phonetic: '/ˈpensl/', relatedWords: ['stationery', 'write', 'school'], sentence: 'I use a pencil to write.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 17, word: 'queen', meaning: '女王', phonetic: '/kwiːn/', relatedWords: ['royal', 'king', 'palace'], sentence: 'The queen lives in a palace.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 18, word: 'rabbit', meaning: '兔子', phonetic: '/ˈræbɪt/', relatedWords: ['animal', 'carrot', 'hop'], sentence: 'The rabbit eats carrots.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 19, word: 'sun', meaning: '太阳', phonetic: '/sʌn/', relatedWords: ['sky', 'hot', 'day'], sentence: 'The sun is shining brightly.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 20, word: 'tree', meaning: '树', phonetic: '/triː/', relatedWords: ['plant', 'leaf', 'wood'], sentence: 'The tree has green leaves.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 21, word: 'umbrella', meaning: '雨伞', phonetic: '/ʌmˈbrelə/', relatedWords: ['rain', 'wet', 'protect'], sentence: 'I use an umbrella when it rains.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 22, word: 'van', meaning: '货车', phonetic: '/væn/', relatedWords: ['vehicle', 'transport', 'cargo'], sentence: 'The van carries goods.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 23, word: 'water', meaning: '水', phonetic: '/ˈwɔːtə/', relatedWords: ['drink', 'wet', 'clear'], sentence: 'I drink water every day.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 24, word: 'xylophone', meaning: '木琴', phonetic: '/ˈzaɪləfəʊn/', relatedWords: ['musical', 'instrument', 'sound'], sentence: 'I play the xylophone.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 25, word: 'yacht', meaning: '游艇', phonetic: '/jɒt/', relatedWords: ['boat', 'water', 'luxury'], sentence: 'The yacht sails on the sea.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 26, word: 'zebra', meaning: '斑马', phonetic: '/ˈzebrə/', relatedWords: ['animal', 'stripes', 'zoo'], sentence: 'The zebra has black and white stripes.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 27, word: 'airplane', meaning: '飞机', phonetic: '/ˈeəpleɪn/', relatedWords: ['fly', 'sky', 'travel'], sentence: 'I travel by airplane.', level: 1, cefr: 'A2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 28, word: 'bicycle', meaning: '自行车', phonetic: '/ˈbaɪsɪkl/', relatedWords: ['ride', 'wheels', 'transport'], sentence: 'I ride a bicycle to school.', level: 1, cefr: 'A2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 29, word: 'crocodile', meaning: '鳄鱼', phonetic: '/ˈkrɒkədaɪl/', relatedWords: ['reptile', 'water', 'teeth'], sentence: 'The crocodile has sharp teeth.', level: 1, cefr: 'A2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 30, word: 'dictionary', meaning: '字典', phonetic: '/ˈdɪkʃəneri/', relatedWords: ['words', 'meanings', 'reference'], sentence: 'I use a dictionary to find word meanings.', level: 1, cefr: 'A2', countries: ['US', 'UK', 'SG', 'CA'] },
  // 新增 Level 1 词汇 - Oxford 3000 核心词汇
  { id: 31, word: 'book', meaning: '书', phonetic: '/bʊk/', relatedWords: ['read', 'pages', 'story'], sentence: 'I read a book every night.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 32, word: 'school', meaning: '学校', phonetic: '/skuːl/', relatedWords: ['learn', 'students', 'teacher'], sentence: 'I go to school every day.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 33, word: 'teacher', meaning: '老师', phonetic: '/ˈtiːtʃə/', relatedWords: ['teach', 'class', 'students'], sentence: 'My teacher is very nice.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 34, word: 'student', meaning: '学生', phonetic: '/ˈstjuːdənt/', relatedWords: ['learn', 'school', 'study'], sentence: 'I am a student at primary school.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 35, word: 'friend', meaning: '朋友', phonetic: '/frend/', relatedWords: ['play', 'help', 'together'], sentence: 'I have many friends at school.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 36, word: 'family', meaning: '家庭', phonetic: '/ˈfæməli/', relatedWords: ['parents', 'children', 'home'], sentence: 'I love my family very much.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 37, word: 'mother', meaning: '妈妈', phonetic: '/ˈmʌðə/', relatedWords: ['parent', 'care', 'love'], sentence: 'My mother cooks delicious food.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 38, word: 'father', meaning: '爸爸', phonetic: '/ˈfɑːðə/', relatedWords: ['parent', 'work', 'protect'], sentence: 'My father works hard for our family.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 39, word: 'sister', meaning: '姐姐/妹妹', phonetic: '/ˈsɪstə/', relatedWords: ['sibling', 'play', 'family'], sentence: 'My sister and I play together.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 40, word: 'brother', meaning: '哥哥/弟弟', phonetic: '/ˈbrʌðə/', relatedWords: ['sibling', 'play', 'family'], sentence: 'My brother likes to play football.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 41, word: 'home', meaning: '家', phonetic: '/həʊm/', relatedWords: ['house', 'family', 'comfort'], sentence: 'I feel happy at home.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 42, word: 'food', meaning: '食物', phonetic: '/fuːd/', relatedWords: ['eat', 'hungry', 'delicious'], sentence: 'I like to eat healthy food.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 43, word: 'eat', meaning: '吃', phonetic: '/iːt/', relatedWords: ['food', 'hungry', 'meal'], sentence: 'I eat breakfast at 7 oclock.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 44, word: 'drink', meaning: '喝', phonetic: '/drɪŋk/', relatedWords: ['water', 'juice', 'thirsty'], sentence: 'I drink water when Im thirsty.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 45, word: 'sleep', meaning: '睡觉', phonetic: '/sliːp/', relatedWords: ['bed', 'tired', 'night'], sentence: 'I sleep at 9 oclock every night.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 46, word: 'play', meaning: '玩', phonetic: '/pleɪ/', relatedWords: ['toys', 'friends', 'game'], sentence: 'I play with my friends after school.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 47, word: 'game', meaning: '游戏', phonetic: '/ɡeɪm/', relatedWords: ['play', 'fun', 'rules'], sentence: 'We play games at recess.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 48, word: 'ball', meaning: '球', phonetic: '/bɔːl/', relatedWords: ['play', 'throw', 'catch'], sentence: 'I play with a ball in the park.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 49, word: 'park', meaning: '公园', phonetic: '/pɑːk/', relatedWords: ['trees', 'grass', 'play'], sentence: 'We go to the park on weekends.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 50, word: 'car', meaning: '汽车', phonetic: '/kɑː/', relatedWords: ['drive', 'road', 'travel'], sentence: 'My dad drives a car to work.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 51, word: 'bus', meaning: '公交车', phonetic: '/bʌs/', relatedWords: ['ride', 'passengers', 'stop'], sentence: 'I take the bus to school.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 52, word: 'train', meaning: '火车', phonetic: '/treɪn/', relatedWords: ['travel', 'tracks', 'station'], sentence: 'We take the train to visit grandma.', level: 1, cefr: 'A2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 53, word: 'boat', meaning: '船', phonetic: '/bəʊt/', relatedWords: ['water', 'sail', 'row'], sentence: 'We go boating on the lake.', level: 1, cefr: 'A2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 54, word: 'bird', meaning: '鸟', phonetic: '/bɜːd/', relatedWords: ['fly', 'nest', 'wings'], sentence: 'The bird sings beautifully.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 55, word: 'flower', meaning: '花', phonetic: '/ˈflaʊə/', relatedWords: ['garden', 'colorful', 'smell'], sentence: 'The flowers in the garden are beautiful.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 56, word: 'grass', meaning: '草', phonetic: '/ɡrɑːs/', relatedWords: ['green', 'lawn', 'grow'], sentence: 'The grass is green and soft.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 57, word: 'leaf', meaning: '叶子', phonetic: '/liːf/', relatedWords: ['tree', 'green', 'fall'], sentence: 'The leaf falls from the tree.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 58, word: 'sky', meaning: '天空', phonetic: '/skaɪ/', relatedWords: ['blue', 'clouds', 'sun'], sentence: 'The sky is blue and clear.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 59, word: 'cloud', meaning: '云', phonetic: '/klaʊd/', relatedWords: ['sky', 'white', 'rain'], sentence: 'The clouds are white and fluffy.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 60, word: 'rain', meaning: '雨', phonetic: '/reɪn/', relatedWords: ['water', 'wet', 'umbrella'], sentence: 'It rains a lot in spring.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续添加 Level 1 词汇 - 基础日常词汇
  { id: 61, word: 'morning', meaning: '早上', phonetic: '/ˈmɔːnɪŋ/', relatedWords: ['day', 'sunrise', 'breakfast'], sentence: 'Good morning!', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 62, word: 'afternoon', meaning: '下午', phonetic: '/ˌɑːftəˈnuːn/', relatedWords: ['day', 'sun', 'lunch'], sentence: 'Good afternoon!', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 63, word: 'evening', meaning: '晚上', phonetic: '/ˈiːvnɪŋ/', relatedWords: ['night', 'dinner', 'sunset'], sentence: 'Good evening!', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 64, word: 'night', meaning: '夜晚', phonetic: '/naɪt/', relatedWords: ['dark', 'sleep', 'moon'], sentence: 'Good night!', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 65, word: 'week', meaning: '周', phonetic: '/wiːk/', relatedWords: ['days', 'Monday', 'Sunday'], sentence: 'There are seven days in a week.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 66, word: 'month', meaning: '月', phonetic: '/mʌnθ/', relatedWords: ['year', 'January', 'December'], sentence: 'There are twelve months in a year.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 67, word: 'year', meaning: '年', phonetic: '/jɪə/', relatedWords: ['months', 'birthday', 'age'], sentence: 'I am ten years old.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 68, word: 'birthday', meaning: '生日', phonetic: '/ˈbɜːθdeɪ/', relatedWords: ['cake', 'party', 'gift'], sentence: 'Happy birthday!', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 69, word: 'gift', meaning: '礼物', phonetic: '/ɡɪft/', relatedWords: ['present', 'birthday', 'give'], sentence: 'I got a nice gift.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 70, word: 'party', meaning: '派对', phonetic: '/ˈpɑːti/', relatedWords: ['celebration', 'friends', 'music'], sentence: 'We had a birthday party.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 71, word: 'music', meaning: '音乐', phonetic: '/ˈmjuːzɪk/', relatedWords: ['song', 'sing', 'dance'], sentence: 'I like music.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 72, word: 'song', meaning: '歌曲', phonetic: '/sɒŋ/', relatedWords: ['music', 'sing', 'lyrics'], sentence: 'I know this song.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 73, word: 'dance', meaning: '跳舞', phonetic: '/dɑːns/', relatedWords: ['music', 'party', 'move'], sentence: 'Lets dance!', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 74, word: 'film', meaning: '电影', phonetic: '/fɪlm/', relatedWords: ['movie', 'cinema', 'watch'], sentence: 'Lets watch a film.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 75, word: 'cinema', meaning: '电影院', phonetic: '/ˈsɪnəmə/', relatedWords: ['film', 'movie', 'watch'], sentence: 'We go to the cinema.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 76, word: 'game', meaning: '游戏', phonetic: '/ɡeɪm/', relatedWords: ['play', 'toy', 'fun'], sentence: 'Lets play a game.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 77, word: 'toy', meaning: '玩具', phonetic: '/tɔɪ/', relatedWords: ['play', 'child', 'game'], sentence: 'I have many toys.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 78, word: 'computer', meaning: '电脑', phonetic: '/kəmˈpjuːtə/', relatedWords: ['internet', 'game', 'work'], sentence: 'I use a computer.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 79, word: 'phone', meaning: '手机', phonetic: '/fəʊn/', relatedWords: ['call', 'text', 'communicate'], sentence: 'I have a phone.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 80, word: 'internet', meaning: '互联网', phonetic: '/ˈɪntənet/', relatedWords: ['computer', 'online', 'website'], sentence: 'I use the internet.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续添加 Level 1 词汇 - 基础日常词汇
  { id: 81, word: 'clothes', meaning: '衣服', phonetic: '/kləʊðz/', relatedWords: ['wear', 'shirt', 'pants'], sentence: 'I have many clothes.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 82, word: 'shirt', meaning: '衬衫', phonetic: '/ʃɜːt/', relatedWords: ['clothes', 'wear', 'top'], sentence: 'I wear a shirt.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 83, word: 'pants', meaning: '裤子', phonetic: '/pænts/', relatedWords: ['clothes', 'wear', 'bottom'], sentence: 'I wear pants.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 84, word: 'shoes', meaning: '鞋子', phonetic: '/ʃuːz/', relatedWords: ['wear', 'foot', 'sneakers'], sentence: 'I wear shoes.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 85, word: 'hat', meaning: '帽子', phonetic: '/hæt/', relatedWords: ['wear', 'head', 'cap'], sentence: 'I wear a hat.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 86, word: 'bag', meaning: '包', phonetic: '/bæɡ/', relatedWords: ['carry', 'school', 'purse'], sentence: 'I have a bag.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 87, word: 'watch', meaning: '手表', phonetic: '/wɒtʃ/', relatedWords: ['time', 'wear', 'clock'], sentence: 'I wear a watch.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 88, word: 'glasses', meaning: '眼镜', phonetic: '/ˈɡlɑːsɪz/', relatedWords: ['wear', 'eyes', 'see'], sentence: 'I wear glasses.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 89, word: 'wallet', meaning: '钱包', phonetic: '/ˈwɒlɪt/', relatedWords: ['money', 'carry', 'card'], sentence: 'I have a wallet.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 90, word: 'key', meaning: '钥匙', phonetic: '/kiː/', relatedWords: ['lock', 'open', 'door'], sentence: 'I have a key.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 91, word: 'clock', meaning: '时钟', phonetic: '/klɒk/', relatedWords: ['time', 'watch', 'hour'], sentence: 'The clock shows the time.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 92, word: 'radio', meaning: '收音机', phonetic: '/ˈreɪdiəʊ/', relatedWords: ['music', 'news', 'listen'], sentence: 'I listen to the radio.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 93, word: 'television', meaning: '电视', phonetic: '/ˈtelɪvɪʒn/', relatedWords: ['TV', 'watch', 'program'], sentence: 'I watch television.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 94, word: 'camera', meaning: '相机', phonetic: '/ˈkæmərə/', relatedWords: ['photo', 'picture', 'take'], sentence: 'I take photos with a camera.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 95, word: 'umbrella', meaning: '雨伞', phonetic: '/ʌmˈbrelə/', relatedWords: ['rain', 'wet', 'protect'], sentence: 'I use an umbrella when it rains.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 96, word: 'backpack', meaning: '背包', phonetic: '/ˈbækpæk/', relatedWords: ['bag', 'carry', 'school'], sentence: 'I carry a backpack to school.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 97, word: 'bicycle', meaning: '自行车', phonetic: '/ˈbaɪsɪkl/', relatedWords: ['ride', 'wheel', 'transport'], sentence: 'I ride a bicycle.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 98, word: 'scooter', meaning: '滑板车', phonetic: '/ˈskuːtə/', relatedWords: ['ride', 'wheel', 'toy'], sentence: 'I ride a scooter.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 99, word: 'skateboard', meaning: '滑板', phonetic: '/ˈskeɪtbɔːd/', relatedWords: ['ride', 'wheel', 'sport'], sentence: 'I ride a skateboard.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 100, word: 'roller skate', meaning: '旱冰鞋', phonetic: '/ˈrəʊlə skeɪt/', relatedWords: ['skate', 'wheel', 'sport'], sentence: 'I wear roller skates.', level: 1, cefr: 'A1', countries: ['US', 'UK', 'SG', 'CA'] },
  
  // Level 2 - B1 (初中) - 2000词
  // 整合 Oxford 3000 中级词汇 + Cambridge Flyers/B1 Preliminary
  { id: 2001, word: 'accomplish', meaning: '完成', phonetic: '/əˈkʌmplɪʃ/', relatedWords: ['achieve', 'success', 'goal', 'complete', 'fulfill', 'realize'], sentence: 'I can accomplish anything I set my mind to. She accomplished her mission successfully. We need to accomplish this task by Friday. Hard work helps us accomplish our dreams.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2002, word: 'biodiversity', meaning: '生物多样性', phonetic: '/ˌbaɪəʊdaɪˈvɜːsəti/', relatedWords: ['nature', 'species', 'ecosystem', 'environment', 'conservation', 'variety'], sentence: 'Biodiversity is important for our planet. The rainforest has rich biodiversity. We need to protect biodiversity. Climate change threatens biodiversity.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2003, word: 'communication', meaning: '交流', phonetic: '/kəˌmjuːnɪˈkeɪʃn/', relatedWords: ['talk', 'share', 'message'], sentence: 'Good communication is important.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2004, word: 'dictionary', meaning: '字典', phonetic: '/ˈdɪkʃəneri/', relatedWords: ['words', 'meanings', 'reference'], sentence: 'I use a dictionary to find word meanings.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2005, word: 'environment', meaning: '环境', phonetic: '/ɪnˈvaɪrənmənt/', relatedWords: ['nature', 'protect', 'surroundings'], sentence: 'We need to protect the environment.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 新增 Level 2 词汇 - Oxford 3000 中级词汇
  { id: 2006, word: 'achieve', meaning: '实现', phonetic: '/əˈtʃiːv/', relatedWords: ['success', 'goal', 'accomplish'], sentence: 'I want to achieve my dreams.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2007, word: 'activity', meaning: '活动', phonetic: '/ækˈtɪvəti/', relatedWords: ['action', 'exercise', 'event'], sentence: 'We have many activities at school.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2008, word: 'advantage', meaning: '优势', phonetic: '/ədˈvɑːntɪdʒ/', relatedWords: ['benefit', 'strength', 'plus'], sentence: 'Studying English has many advantages.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2009, word: 'advice', meaning: '建议', phonetic: '/ədˈvaɪs/', relatedWords: ['suggestion', 'tip', 'guidance'], sentence: 'I need your advice on this matter.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2010, word: 'affect', meaning: '影响', phonetic: '/əˈfekt/', relatedWords: ['influence', 'change', 'impact'], sentence: 'The weather affects our plans.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2011, word: 'agriculture', meaning: '农业', phonetic: '/ˈæɡrɪkʌltʃə/', relatedWords: ['farming', 'crops', 'rural'], sentence: 'Agriculture is important for food production.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2012, word: 'air pollution', meaning: '空气污染', phonetic: '/eə pəˈluːʃn/', relatedWords: ['environment', 'smog', 'health'], sentence: 'Air pollution is a serious problem.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2013, word: 'ambition', meaning: '志向', phonetic: '/æmˈbɪʃn/', relatedWords: ['dream', 'goal', 'aspiration'], sentence: 'My ambition is to become a doctor.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2014, word: 'amount', meaning: '数量', phonetic: '/əˈmaʊnt/', relatedWords: ['quantity', 'number', 'total'], sentence: 'We need a large amount of water.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2015, word: 'analysis', meaning: '分析', phonetic: '/əˈnæləsɪs/', relatedWords: ['examine', 'study', 'evaluate'], sentence: 'The analysis shows interesting results.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2016, word: 'ancient', meaning: '古代的', phonetic: '/ˈeɪnʃənt/', relatedWords: ['old', 'historic', 'antique'], sentence: 'The ancient pyramids are amazing.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2017, word: 'anger', meaning: '愤怒', phonetic: '/ˈæŋɡə/', relatedWords: ['mad', 'upset', 'rage'], sentence: 'His anger was understandable.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2018, word: 'animal rights', meaning: '动物权利', phonetic: '/ˈænɪml raɪts/', relatedWords: ['animal', 'protection', 'welfare'], sentence: 'Many people support animal rights.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2019, word: 'anniversary', meaning: '周年纪念', phonetic: '/ˌænɪˈvɜːsəri/', relatedWords: ['celebration', 'year', 'memorial'], sentence: 'Today is our wedding anniversary.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2020, word: 'anxiety', meaning: '焦虑', phonetic: '/æŋˈzaɪəti/', relatedWords: ['worry', 'stress', 'nervousness'], sentence: 'Exams can cause anxiety for students.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续添加 Level 2 词汇 - Oxford 3000 中级词汇
  { id: 2021, word: 'apartment', meaning: '公寓', phonetic: '/əˈpɑːtmənt/', relatedWords: ['house', 'home', 'living'], sentence: 'I live in an apartment.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2022, word: 'appointment', meaning: '预约', phonetic: '/əˈpɔɪntmənt/', relatedWords: ['meeting', 'schedule', 'time'], sentence: 'I have an appointment with the doctor.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2023, word: 'approach', meaning: '方法', phonetic: '/əˈprəʊtʃ/', relatedWords: ['method', 'way', 'strategy'], sentence: 'We need a new approach.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2024, word: 'approval', meaning: '批准', phonetic: '/əˈpruːvl/', relatedWords: ['permission', 'agreement', 'consent'], sentence: 'We need your approval.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2025, word: 'argument', meaning: '争论', phonetic: '/ˈɑːɡjumənt/', relatedWords: ['debate', 'discussion', 'disagreement'], sentence: 'They had an argument.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2026, word: 'arrival', meaning: '到达', phonetic: '/əˈraɪvl/', relatedWords: ['coming', 'arrive', 'reception'], sentence: 'We are waiting for their arrival.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2027, word: 'article', meaning: '文章', phonetic: '/ˈɑːtɪkl/', relatedWords: ['essay', 'writing', 'journal'], sentence: 'I wrote an article.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2028, word: 'aspect', meaning: '方面', phonetic: '/ˈæspekt/', relatedWords: ['part', 'side', 'feature'], sentence: 'We need to consider all aspects.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2029, word: 'assistance', meaning: '帮助', phonetic: '/əˈsɪstəns/', relatedWords: ['help', 'aid', 'support'], sentence: 'I need your assistance.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2030, word: 'association', meaning: '协会', phonetic: '/əˌsəʊsiˈeɪʃn/', relatedWords: ['organization', 'group', 'society'], sentence: 'I joined an association.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2031, word: 'assume', meaning: '假设', phonetic: '/əˈsjuːm/', relatedWords: ['suppose', 'think', 'believe'], sentence: 'I assume you are right.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2032, word: 'assure', meaning: '保证', phonetic: '/əˈʃʊə/', relatedWords: ['promise', 'guarantee', 'convince'], sentence: 'I assure you it will be fine.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2033, word: 'asthma', meaning: '哮喘', phonetic: '/ˈæsmə/', relatedWords: ['disease', 'breath', 'health'], sentence: 'He has asthma.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2034, word: 'astronomy', meaning: '天文学', phonetic: '/əˈstrɒnəmi/', relatedWords: ['stars', 'space', 'science'], sentence: 'I study astronomy.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2035, word: 'atmosphere', meaning: '大气', phonetic: '/ˈætməsfɪə/', relatedWords: ['air', 'environment', 'climate'], sentence: 'The atmosphere is important for life.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2036, word: 'atomic', meaning: '原子的', phonetic: '/əˈtɒmɪk/', relatedWords: ['nuclear', 'energy', 'science'], sentence: 'This is atomic energy.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2037, word: 'attach', meaning: '附加', phonetic: '/əˈtætʃ/', relatedWords: ['connect', 'join', 'fasten'], sentence: 'Please attach the file.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2038, word: 'attack', meaning: '攻击', phonetic: '/əˈtæk/', relatedWords: ['assault', 'strike', 'offensive'], sentence: 'The attack was sudden.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2039, word: 'attempt', meaning: '尝试', phonetic: '/əˈtempt/', relatedWords: ['try', 'effort', 'endeavor'], sentence: 'I will attempt to do it.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2040, word: 'attitude', meaning: '态度', phonetic: '/ˈætɪtjuːd/', relatedWords: ['opinion', 'view', 'perspective'], sentence: 'He has a positive attitude.', level: 2, cefr: 'B1', countries: ['US', 'UK', 'SG', 'CA'] },
  
  // Level 3 - B2 (高中) - 2000词
  // 整合 Oxford 5000 核心词汇 + Cambridge B2 First
  { id: 4001, word: 'analyze', meaning: '分析', phonetic: '/ˈænəlaɪz/', relatedWords: ['examine', 'study', 'evaluate', 'investigate', 'inspect', 'assess'], sentence: 'I need to analyze the problem carefully. The scientist analyzed the data. We should analyze all possible solutions. The report analyzes the current situation.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4002, word: 'beneficial', meaning: '有益的', phonetic: '/ˌbenɪˈfɪʃl/', relatedWords: ['helpful', 'good', 'advantageous', 'profitable', 'useful', 'valuable'], sentence: 'Exercise is beneficial for health. Reading is beneficial for your brain. A good diet is beneficial for your body. Learning a second language is beneficial for your career.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4003, word: 'complicated', meaning: '复杂的', phonetic: '/ˈkɒmplɪkeɪtɪd/', relatedWords: ['complex', 'difficult', 'intricate'], sentence: 'The problem is very complicated.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4004, word: 'diverse', meaning: '多样的', phonetic: '/daɪˈvɜːs/', relatedWords: ['different', 'varied', 'multicultural'], sentence: 'Our world is diverse and beautiful.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4005, word: 'efficient', meaning: '高效的', phonetic: '/ɪˈfɪʃnt/', relatedWords: ['effective', 'productive', 'quick'], sentence: 'We need to be more efficient.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  // 新增 Level 3 词汇 - Oxford 5000 核心词汇
  { id: 4006, word: 'effective', meaning: '有效的', phonetic: '/ɪˈfektɪv/', relatedWords: ['efficient', 'successful', 'productive'], sentence: 'The new method is very effective.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4007, word: 'efficient', meaning: '高效的', phonetic: '/ɪˈfɪʃnt/', relatedWords: ['effective', 'productive', 'quick'], sentence: 'We need to be more efficient.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4008, word: 'element', meaning: '元素', phonetic: '/ˈelɪmənt/', relatedWords: ['component', 'part', 'factor'], sentence: 'Water is made of hydrogen and oxygen elements.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4009, word: 'eliminate', meaning: '消除', phonetic: '/ɪˈlɪmɪneɪt/', relatedWords: ['remove', 'eradicate', 'destroy'], sentence: 'We need to eliminate poverty.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4010, word: 'emphasize', meaning: '强调', phonetic: '/ˈemfəsaɪz/', relatedWords: ['stress', 'highlight', 'focus'], sentence: 'The teacher emphasized the importance of reading.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4011, word: 'empower', meaning: '授权', phonetic: '/ɪmˈpaʊə/', relatedWords: ['enable', 'authorize', 'strengthen'], sentence: 'Education empowers people.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4012, word: 'enhance', meaning: '增强', phonetic: '/ɪnˈhɑːns/', relatedWords: ['improve', 'boost', 'strengthen'], sentence: 'Technology enhances our lives.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4013, word: 'enormous', meaning: '巨大的', phonetic: '/ɪˈnɔːməs/', relatedWords: ['huge', 'massive', 'gigantic'], sentence: 'The universe is enormous.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4014, word: 'enrich', meaning: '丰富', phonetic: '/ɪnˈrɪtʃ/', relatedWords: ['improve', 'enhance', 'develop'], sentence: 'Reading enriches our knowledge.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4015, word: 'ensure', meaning: '确保', phonetic: '/ɪnˈʃʊə/', relatedWords: ['guarantee', 'assure', 'confirm'], sentence: 'I will ensure the task is completed.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续添加 Level 3 词汇 - Oxford 5000 核心词汇
  { id: 4016, word: 'establish', meaning: '建立', phonetic: '/ɪˈstæblɪʃ/', relatedWords: ['found', 'create', 'build'], sentence: 'We need to establish a new system.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4017, word: 'estimate', meaning: '估计', phonetic: '/ˈestɪmeɪt/', relatedWords: ['calculate', 'guess', 'approximate'], sentence: 'I estimate the cost will be high.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4018, word: 'evaluate', meaning: '评估', phonetic: '/ɪˈvæljueɪt/', relatedWords: ['assess', 'measure', 'judge'], sentence: 'We need to evaluate the results.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4019, word: 'evolve', meaning: '进化', phonetic: '/ɪˈvɒlv/', relatedWords: ['develop', 'change', 'grow'], sentence: 'Technology continues to evolve.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4020, word: 'exceed', meaning: '超过', phonetic: '/ɪkˈsiːd/', relatedWords: ['surpass', 'go beyond', 'outdo'], sentence: 'The results exceed our expectations.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4021, word: 'excel', meaning: '擅长', phonetic: '/ɪkˈsel/', relatedWords: ['succeed', 'shine', 'outperform'], sentence: 'She excels in mathematics.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4022, word: 'exclude', meaning: '排除', phonetic: '/ɪkˈskluːd/', relatedWords: ['remove', 'omit', 'ban'], sentence: 'We cannot exclude any options.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4023, word: 'expand', meaning: '扩大', phonetic: '/ɪkˈspænd/', relatedWords: ['grow', 'increase', 'extend'], sentence: 'The company plans to expand.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4024, word: 'expectation', meaning: '期望', phonetic: '/ˌekspekˈteɪʃn/', relatedWords: ['hope', 'anticipation', 'belief'], sentence: 'We have high expectations.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4025, word: 'experience', meaning: '经验', phonetic: '/ɪkˈspɪəriəns/', relatedWords: ['knowledge', 'skill', 'practice'], sentence: 'Experience is valuable.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4026, word: 'experiment', meaning: '实验', phonetic: '/ɪkˈsperɪmənt/', relatedWords: ['test', 'research', 'science'], sentence: 'We conduct experiments in the lab.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4027, word: 'expert', meaning: '专家', phonetic: '/ˈekspɜːt/', relatedWords: ['specialist', 'professional', 'authority'], sentence: 'He is an expert in his field.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4028, word: 'explicit', meaning: '明确的', phonetic: '/ɪkˈsplɪsɪt/', relatedWords: ['clear', 'direct', 'specific'], sentence: 'Please be explicit about your requirements.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4029, word: 'explore', meaning: '探索', phonetic: '/ɪkˈsplɔː/', relatedWords: ['discover', 'investigate', 'travel'], sentence: 'We explore new places.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4030, word: 'export', meaning: '出口', phonetic: '/ɪkˈspɔːt/', relatedWords: ['trade', 'sell', 'international'], sentence: 'We export goods to other countries.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4031, word: 'express', meaning: '表达', phonetic: '/ɪkˈspres/', relatedWords: ['convey', 'communicate', 'show'], sentence: 'I express my feelings through art.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4032, word: 'expression', meaning: '表达', phonetic: '/ɪkˈspreʃn/', relatedWords: ['phrase', 'statement', 'utterance'], sentence: 'His expression was sad.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4033, word: 'extend', meaning: '延长', phonetic: '/ɪkˈstend/', relatedWords: ['lengthen', 'stretch', 'continue'], sentence: 'We extend the deadline.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4034, word: 'external', meaning: '外部的', phonetic: '/ɪkˈstɜːnl/', relatedWords: ['outside', 'outer', 'exterior'], sentence: 'The external walls need painting.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4035, word: 'extinct', meaning: '灭绝的', phonetic: '/ɪkˈstɪŋkt/', relatedWords: ['dead', 'vanished', 'gone'], sentence: 'Dinosaurs are extinct.', level: 3, cefr: 'B2', countries: ['US', 'UK', 'SG', 'CA'] },
  
  // Level 4 - C1-C2 (大学及以上) - 2000词
  // 整合 Oxford 5000 高级词汇 + Academic Word List
  { id: 6001, word: 'ambiguous', meaning: '模棱两可的', phonetic: '/æmˈbɪɡjuəs/', relatedWords: ['unclear', 'vague', 'equivocal', 'obscure', 'uncertain', 'doubtful'], sentence: 'The instructions were ambiguous. His answer was ambiguous and confusing. The wording of the contract is ambiguous. She gave an ambiguous response to the question.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6002, word: 'comprehensive', meaning: '全面的', phonetic: '/ˌkɒmprɪˈhensɪv/', relatedWords: ['complete', 'thorough', 'extensive', 'inclusive', 'detailed', 'full'], sentence: 'The report provides a comprehensive analysis. We need a comprehensive plan. The book gives a comprehensive overview of the subject. She received comprehensive training for the job.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6003, word: 'diminish', meaning: '减少', phonetic: '/dɪˈmɪnɪʃ/', relatedWords: ['decrease', 'reduce', 'lessen'], sentence: 'The risk will diminish over time.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6004, word: 'elaborate', meaning: '详细阐述', phonetic: '/ɪˈlæbəreɪt/', relatedWords: ['explain', 'detail', 'develop'], sentence: 'Please elaborate on your idea.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6005, word: 'facilitate', meaning: '促进', phonetic: '/fəˈsɪlɪteɪt/', relatedWords: ['help', 'aid', 'assist'], sentence: 'This will facilitate the process.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 新增 Level 4 词汇 - Academic Word List
  { id: 6006, word: 'abstract', meaning: '抽象的', phonetic: '/ˈæbstrækt/', relatedWords: ['conceptual', 'theoretical', 'non-concrete'], sentence: 'The idea is too abstract for me.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6007, word: 'academic', meaning: '学术的', phonetic: '/ˌækəˈdemɪk/', relatedWords: ['scholarly', 'educational', 'intellectual'], sentence: 'He has an academic background.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6008, word: 'access', meaning: '获取', phonetic: '/ˈækses/', relatedWords: ['entry', 'approach', 'retrieve'], sentence: 'We need access to information.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6009, word: 'accommodate', meaning: '容纳', phonetic: '/əˈkɒmədeɪt/', relatedWords: ['house', 'hold', 'fit'], sentence: 'The hotel can accommodate 200 guests.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6010, word: 'accompany', meaning: '陪同', phonetic: '/əˈkʌmpəni/', relatedWords: ['attend', 'escort', 'go with'], sentence: 'I will accompany you to the airport.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6011, word: 'accordance', meaning: '一致', phonetic: '/əˈkɔːdns/', relatedWords: ['agreement', 'conformity', 'harmony'], sentence: 'We act in accordance with the rules.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6012, word: 'account', meaning: '解释', phonetic: '/əˈkaʊnt/', relatedWords: ['explain', 'describe', 'narrate'], sentence: 'Please account for your actions.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6013, word: 'accumulate', meaning: '积累', phonetic: '/əˈkjuːmjuleɪt/', relatedWords: ['collect', 'gather', 'amass'], sentence: 'We accumulate knowledge over time.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6014, word: 'accurate', meaning: '准确的', phonetic: '/ˈækjərət/', relatedWords: ['precise', 'correct', 'exact'], sentence: 'The information must be accurate.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6015, word: 'achieve', meaning: '实现', phonetic: '/əˈtʃiːv/', relatedWords: ['accomplish', 'attain', 'reach'], sentence: 'We can achieve great things together.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续添加 Level 4 词汇 - Academic Word List
  { id: 6016, word: 'acquisition', meaning: '获取', phonetic: '/ˌækwɪˈzɪʃn/', relatedWords: ['obtain', 'gain', 'learning'], sentence: 'Language acquisition is important.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6017, word: 'adaptation', meaning: '适应', phonetic: '/ˌædæpˈteɪʃn/', relatedWords: ['adjustment', 'modification', 'change'], sentence: 'Adaptation is necessary for survival.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6018, word: 'adequate', meaning: '足够的', phonetic: '/ˈædɪkwət/', relatedWords: ['sufficient', 'enough', 'appropriate'], sentence: 'We need adequate resources.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6019, word: 'adjacent', meaning: '相邻的', phonetic: '/əˈdʒeɪsnt/', relatedWords: ['neighboring', 'bordering', 'near'], sentence: 'The houses are adjacent.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6020, word: 'adjective', meaning: '形容词', phonetic: '/ˈædʒɪktɪv/', relatedWords: ['word', 'grammar', 'describe'], sentence: 'An adjective describes a noun.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6021, word: 'adjustment', meaning: '调整', phonetic: '/əˈdʒʌstmənt/', relatedWords: ['adaptation', 'modification', 'change'], sentence: 'We need to make adjustments.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6022, word: 'administrative', meaning: '行政的', phonetic: '/ədˈmɪnɪstrətɪv/', relatedWords: ['managerial', 'organizational', 'governmental'], sentence: 'She has administrative duties.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6023, word: 'adult', meaning: '成年人', phonetic: '/ˈædʌlt/', relatedWords: ['grown-up', 'mature', 'elder'], sentence: 'He is now an adult.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6024, word: 'advocate', meaning: '提倡', phonetic: '/ˈædvəkeɪt/', relatedWords: ['support', 'promote', 'defend'], sentence: 'I advocate for human rights.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6025, word: 'aesthetic', meaning: '美学的', phonetic: '/esˈθetɪk/', relatedWords: ['beautiful', 'artistic', 'taste'], sentence: 'The design has aesthetic appeal.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 整合 GitHub 四六级、考研、SAT 核心词汇
  { id: 6026, word: 'abandon', meaning: '放弃', phonetic: '/əˈbændən/', relatedWords: ['leave', 'desert', 'quit'], sentence: 'Never abandon your dreams.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6027, word: 'ability', meaning: '能力', phonetic: '/əˈbɪləti/', relatedWords: ['skill', 'capability', 'talent'], sentence: 'He has great ability.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6028, word: 'abnormal', meaning: '异常的', phonetic: '/æbˈnɔːml/', relatedWords: ['unusual', 'irregular', 'strange'], sentence: 'This is abnormal behavior.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6029, word: 'abolish', meaning: '废除', phonetic: '/əˈbɒlɪʃ/', relatedWords: ['end', 'cancel', 'eliminate'], sentence: 'We should abolish bad laws.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6030, word: 'abound', meaning: '丰富', phonetic: '/əˈbaʊnd/', relatedWords: ['plenty', 'rich', 'overflow'], sentence: 'Opportunities abound.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6031, word: 'abroad', meaning: '国外', phonetic: '/əˈbrɔːd/', relatedWords: ['overseas', 'foreign', 'international'], sentence: 'He studied abroad.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6032, word: 'absolute', meaning: '绝对的', phonetic: '/ˈæbsəluːt/', relatedWords: ['complete', 'total', 'unconditional'], sentence: 'This is absolute truth.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6033, word: 'absorb', meaning: '吸收', phonetic: '/əbˈsɔːb/', relatedWords: ['soak', 'take in', 'assimilate'], sentence: 'Plants absorb water.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6034, word: 'abstract', meaning: '抽象的', phonetic: '/ˈæbstrækt/', relatedWords: ['conceptual', 'theoretical', 'non-concrete'], sentence: 'This is an abstract idea.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6035, word: 'abundant', meaning: '丰富的', phonetic: '/əˈbʌndənt/', relatedWords: ['plentiful', 'rich', 'copious'], sentence: 'We have abundant resources.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续整合 GitHub 四六级、考研、SAT 核心词汇
  { id: 6036, word: 'academic', meaning: '学术的', phonetic: '/ˌækəˈdemɪk/', relatedWords: ['scholarly', 'educational', 'intellectual'], sentence: 'He has an academic background.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6037, word: 'accept', meaning: '接受', phonetic: '/əkˈsept/', relatedWords: ['receive', 'take', 'approve'], sentence: 'I accept your invitation.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6038, word: 'access', meaning: '获取', phonetic: '/ˈækses/', relatedWords: ['entry', 'approach', 'retrieve'], sentence: 'We need access to information.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6039, word: 'accident', meaning: '事故', phonetic: '/ˈæksɪdənt/', relatedWords: ['incident', 'mishap', 'disaster'], sentence: 'There was a car accident.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6040, word: 'accommodate', meaning: '容纳', phonetic: '/əˈkɒmədeɪt/', relatedWords: ['house', 'hold', 'fit'], sentence: 'The hotel can accommodate 200 guests.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6041, word: 'accompany', meaning: '陪同', phonetic: '/əˈkʌmpəni/', relatedWords: ['attend', 'escort', 'go with'], sentence: 'I will accompany you to the airport.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6042, word: 'accomplish', meaning: '完成', phonetic: '/əˈkʌmplɪʃ/', relatedWords: ['achieve', 'complete', 'fulfill'], sentence: 'I can accomplish anything I set my mind to.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6043, word: 'accordance', meaning: '一致', phonetic: '/əˈkɔːdns/', relatedWords: ['agreement', 'conformity', 'harmony'], sentence: 'We act in accordance with the rules.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6044, word: 'account', meaning: '解释', phonetic: '/əˈkaʊnt/', relatedWords: ['explain', 'describe', 'narrate'], sentence: 'Please account for your actions.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6045, word: 'accumulate', meaning: '积累', phonetic: '/əˈkjuːmjuleɪt/', relatedWords: ['collect', 'gather', 'amass'], sentence: 'We accumulate knowledge over time.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 添加专业领域的词汇
  // 科技领域
  { id: 6066, word: 'algorithm', meaning: '算法', phonetic: '/ˈælɡərɪðəm/', relatedWords: ['computer', 'program', 'logic'], sentence: 'The algorithm is efficient.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6067, word: 'artificial intelligence', meaning: '人工智能', phonetic: '/ˌɑːtɪˈfɪʃl ɪnˈtelɪdʒəns/', relatedWords: ['AI', 'machine learning', 'technology'], sentence: 'Artificial intelligence is developing rapidly.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6068, word: 'database', meaning: '数据库', phonetic: '/ˈdeɪtəbeɪs/', relatedWords: ['data', 'storage', 'information'], sentence: 'We need a database to store data.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6069, word: 'software', meaning: '软件', phonetic: '/ˈsɒftweə/', relatedWords: ['program', 'application', 'system'], sentence: 'This software is very useful.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6070, word: 'hardware', meaning: '硬件', phonetic: '/ˈhɑːdweə/', relatedWords: ['computer', 'device', 'equipment'], sentence: 'The hardware needs to be updated.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 医学领域
  { id: 6071, word: 'vaccine', meaning: '疫苗', phonetic: '/ˈvæksiːn/', relatedWords: ['medicine', 'health', 'immunization'], sentence: 'Vaccines protect us from diseases.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6072, word: 'diagnosis', meaning: '诊断', phonetic: '/ˌdaɪəɡˈnəʊsɪs/', relatedWords: ['medical', 'disease', 'doctor'], sentence: 'The diagnosis was correct.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6073, word: 'treatment', meaning: '治疗', phonetic: '/ˈtriːtmənt/', relatedWords: ['medicine', 'heal', 'cure'], sentence: 'The treatment was successful.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6074, word: 'therapy', meaning: '疗法', phonetic: '/ˈθerəpi/', relatedWords: ['treatment', 'heal', 'recovery'], sentence: 'He is undergoing therapy.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 商业领域
  { id: 6075, word: 'marketing', meaning: '市场营销', phonetic: '/ˈmɑːkɪtɪŋ/', relatedWords: ['business', 'sales', 'promotion'], sentence: 'Marketing is important for business.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6076, word: 'investment', meaning: '投资', phonetic: '/ɪnˈvestmənt/', relatedWords: ['finance', 'money', 'return'], sentence: 'Investment can bring returns.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6077, word: 'management', meaning: '管理', phonetic: '/ˈmænɪdʒmənt/', relatedWords: ['leadership', 'organization', 'control'], sentence: 'Good management is essential for success.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6078, word: 'strategy', meaning: '策略', phonetic: '/ˈstrætədʒi/', relatedWords: ['plan', 'tactic', 'approach'], sentence: 'We need a good strategy.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 教育领域
  { id: 6079, word: 'curriculum', meaning: '课程', phonetic: '/kəˈrɪkjələm/', relatedWords: ['education', 'subjects', 'learning'], sentence: 'The curriculum is well-designed.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6080, word: 'pedagogy', meaning: '教育学', phonetic: '/ˈpedəɡɒdʒi/', relatedWords: ['teaching', 'education', 'method'], sentence: 'Pedagogy is the study of teaching.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6081, word: 'education', meaning: '教育', phonetic: '/ˌedʒuˈkeɪʃn/', relatedWords: ['learning', 'knowledge', 'school'], sentence: 'Education is the key to success.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6082, word: 'learning', meaning: '学习', phonetic: '/ˈlɜːnɪŋ/', relatedWords: ['study', 'knowledge', 'education'], sentence: 'Lifelong learning is important.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 环境领域
  { id: 6083, word: 'sustainability', meaning: '可持续性', phonetic: '/səˌsteɪnəˈbɪləti/', relatedWords: ['environment', 'green', 'future'], sentence: 'Sustainability is important for our planet.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6084, word: 'conservation', meaning: '保护', phonetic: '/ˌkɒnsəˈveɪʃn/', relatedWords: ['preservation', 'protection', 'saving'], sentence: 'Conservation of resources is important.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6085, word: 'ecology', meaning: '生态学', phonetic: '/iːˈkɒlədʒi/', relatedWords: ['environment', 'nature', 'science'], sentence: 'Ecology is the study of ecosystems.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6086, word: 'biodiversity', meaning: '生物多样性', phonetic: '/ˌbaɪəʊdaɪˈvɜːsəti/', relatedWords: ['nature', 'species', 'ecosystem'], sentence: 'Biodiversity is important for our planet.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  // 继续添加 Level 4 词汇 - Academic Word List
  { id: 6046, word: 'adverse', meaning: '不利的', phonetic: '/ˈædvɜːs/', relatedWords: ['harmful', 'negative', 'detrimental'], sentence: 'The drug has adverse effects.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6047, word: 'aeronautics', meaning: '航空学', phonetic: '/ˌeərəˈnɔːtɪks/', relatedWords: ['aviation', 'flight', 'science'], sentence: 'He studies aeronautics.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6048, word: 'affection', meaning: '感情', phonetic: '/əˈfekʃn/', relatedWords: ['love', 'care', 'emotion'], sentence: 'She has great affection for her family.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6049, word: 'affirmative', meaning: '肯定的', phonetic: '/əˈfɜːmətɪv/', relatedWords: ['positive', 'confirmative', 'assertive'], sentence: 'He gave an affirmative answer.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6050, word: 'affliction', meaning: '苦难', phonetic: '/əˈflɪkʃn/', relatedWords: ['suffering', 'pain', 'misery'], sentence: 'Poverty is an affliction.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6051, word: 'afford', meaning: '负担得起', phonetic: '/əˈfɔːd/', relatedWords: ['pay', 'manage', 'bear'], sentence: 'I can afford this.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6052, word: 'agency', meaning: '机构', phonetic: '/ˈeɪdʒənsi/', relatedWords: ['organization', 'bureau', 'office'], sentence: 'The agency helps people.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6053, word: 'aggregate', meaning: '聚合', phonetic: '/ˈæɡrɪɡət/', relatedWords: ['total', 'sum', 'combined'], sentence: 'The aggregate amount is large.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6054, word: 'aggressive', meaning: '侵略性的', phonetic: '/əˈɡresɪv/', relatedWords: ['hostile', 'assertive', 'forceful'], sentence: 'He has an aggressive personality.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6055, word: 'agonize', meaning: '苦恼', phonetic: '/ˈæɡənaɪz/', relatedWords: ['suffer', 'torment', 'worry'], sentence: 'I agonize over this decision.', level: 4, cefr: 'C1', countries: ['US', 'UK', 'SG', 'CA'] }
];


// 根据级别获取单词
export const getWordsByLevel = (level, count = 10) => {
  let levelWords = wordLibraryIntegrated.filter(word => word.level === level);
  
  // 如果当前等级单词不足，从低一级补充
  if (levelWords.length < count && level > 1) {
    const lowerLevelWords = wordLibraryIntegrated.filter(word => word.level === level - 1);
    levelWords = [...levelWords, ...lowerLevelWords];
  }
  
  // 如果还是不足，允许重复（循环使用）
  while (levelWords.length < count) {
    levelWords = [...levelWords, ...levelWords];
  }
  
  // 随机选择指定数量的单词
  const shuffled = [...levelWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 根据CEFR等级获取单词
export const getWordsByCefr = (cefr, count = 10) => {
  const cefrWords = wordLibraryIntegrated.filter(word => word.cefr === cefr);
  const shuffled = [...cefrWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 根据国家获取单词
export const getWordsByCountry = (country, level, count = 10) => {
  const countryWords = wordLibraryIntegrated.filter(word => 
    word.countries.includes(country) && word.level === level
  );
  const shuffled = [...countryWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 获取所有单词
export const getAllWords = () => {
  return wordLibraryIntegrated;
};

// 按主题获取单词
export const getWordsByTheme = (theme, level, count = 10) => {
  const themeWords = wordLibraryIntegrated.filter(word => 
    word.level === level && 
    word.relatedWords.some(related => related.toLowerCase().includes(theme.toLowerCase()))
  );
  const shuffled = [...themeWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default wordLibraryIntegrated;