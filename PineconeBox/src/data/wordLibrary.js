// 词库文件 - 包含美国、英国、新加坡、加拿大主流小学教材的核心词汇

// 级别定义：
// Level 1: 小学1-2年级
// Level 2: 小学3-4年级
// Level 3: 小学5-6年级
// Level 4: 初中1年级

const wordLibrary = [
  // Level 1 - 基础词汇
  { id: 1, word: 'apple', meaning: '苹果', phonetic: '/ˈæpl/', relatedWords: ['fruit', 'red', 'juice'], sentence: 'I eat an apple every day.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 2, word: 'banana', meaning: '香蕉', phonetic: '/bəˈnɑːnə/', relatedWords: ['fruit', 'yellow', 'peel'], sentence: 'Bananas are my favorite fruit.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 3, word: 'cat', meaning: '猫', phonetic: '/kæt/', relatedWords: ['pet', 'animal', 'meow'], sentence: 'The cat is sleeping on the couch.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 4, word: 'dog', meaning: '狗', phonetic: '/dɒɡ/', relatedWords: ['pet', 'animal', 'bark'], sentence: 'My dog is very friendly.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 5, word: 'elephant', meaning: '大象', phonetic: '/ˈelɪfənt/', relatedWords: ['animal', 'big', 'trunk'], sentence: 'Elephants have long trunks.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 6, word: 'fish', meaning: '鱼', phonetic: '/fɪʃ/', relatedWords: ['animal', 'water', 'swim'], sentence: 'Fish live in the water.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 7, word: 'goat', meaning: '山羊', phonetic: '/ɡəʊt/', relatedWords: ['animal', 'farm', 'milk'], sentence: 'The goat is eating grass.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 8, word: 'horse', meaning: '马', phonetic: '/hɔːs/', relatedWords: ['animal', 'farm', 'ride'], sentence: 'I want to ride a horse.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 9, word: 'ice cream', meaning: '冰淇淋', phonetic: '/aɪs kriːm/', relatedWords: ['food', 'cold', 'sweet'], sentence: 'Ice cream is delicious on hot days.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 10, word: 'juice', meaning: '果汁', phonetic: '/dʒuːs/', relatedWords: ['drink', 'fruit', 'healthy'], sentence: 'I drink orange juice for breakfast.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 11, word: 'kite', meaning: '风筝', phonetic: '/kaɪt/', relatedWords: ['toy', 'fly', 'wind'], sentence: 'I fly a kite in the park.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 12, word: 'lion', meaning: '狮子', phonetic: '/ˈlaɪən/', relatedWords: ['animal', 'zoo', 'king'], sentence: 'The lion is the king of the jungle.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 13, word: 'monkey', meaning: '猴子', phonetic: '/ˈmʌŋki/', relatedWords: ['animal', 'zoo', 'tree'], sentence: 'Monkeys like to climb trees.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 14, word: 'nest', meaning: '鸟巢', phonetic: '/nest/', relatedWords: ['bird', 'home', 'eggs'], sentence: 'The bird built a nest in the tree.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 15, word: 'orange', meaning: '橙子', phonetic: '/ˈɒrɪndʒ/', relatedWords: ['fruit', 'color', 'juice'], sentence: 'Oranges are rich in vitamin C.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 16, word: 'pencil', meaning: '铅笔', phonetic: '/ˈpensl/', relatedWords: ['stationery', 'write', 'school'], sentence: 'I use a pencil to write.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 17, word: 'queen', meaning: '女王', phonetic: '/kwiːn/', relatedWords: ['royal', 'king', 'palace'], sentence: 'The queen lives in a palace.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 18, word: 'rabbit', meaning: '兔子', phonetic: '/ˈræbɪt/', relatedWords: ['animal', 'carrot', 'hop'], sentence: 'The rabbit eats carrots.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 19, word: 'sun', meaning: '太阳', phonetic: '/sʌn/', relatedWords: ['sky', 'hot', 'day'], sentence: 'The sun is shining brightly.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 20, word: 'tree', meaning: '树', phonetic: '/triː/', relatedWords: ['plant', 'leaf', 'wood'], sentence: 'The tree has green leaves.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 21, word: 'umbrella', meaning: '雨伞', phonetic: '/ʌmˈbrelə/', relatedWords: ['rain', 'wet', 'protect'], sentence: 'I use an umbrella when it rains.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 22, word: 'van', meaning: '货车', phonetic: '/væn/', relatedWords: ['vehicle', 'transport', 'cargo'], sentence: 'The van carries goods.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 23, word: 'water', meaning: '水', phonetic: '/ˈwɔːtə/', relatedWords: ['drink', 'wet', 'clear'], sentence: 'I drink water every day.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 24, word: 'xylophone', meaning: '木琴', phonetic: '/ˈzaɪləfəʊn/', relatedWords: ['musical', 'instrument', 'sound'], sentence: 'I play the xylophone.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 25, word: 'yacht', meaning: '游艇', phonetic: '/jɒt/', relatedWords: ['boat', 'water', 'luxury'], sentence: 'The yacht sails on the sea.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 26, word: 'zebra', meaning: '斑马', phonetic: '/ˈzebrə/', relatedWords: ['animal', 'stripes', 'zoo'], sentence: 'The zebra has black and white stripes.', level: 1, countries: ['US', 'UK', 'SG', 'CA'] },
  
  // Level 2 - 中级词汇
  { id: 27, word: 'abacus', meaning: '算盘', phonetic: '/ˈæbəkəs/', relatedWords: ['math', 'count', 'tool'], sentence: 'I use an abacus to count.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 28, word: 'balloon', meaning: '气球', phonetic: '/bəˈluːn/', relatedWords: ['float', 'air', 'party'], sentence: 'The balloon floats in the air.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 29, word: 'camel', meaning: '骆驼', phonetic: '/ˈkæml/', relatedWords: ['desert', 'hump', 'animal'], sentence: 'The camel lives in the desert.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 30, word: 'dolphin', meaning: '海豚', phonetic: '/ˈdɒlfɪn/', relatedWords: ['ocean', 'swim', 'intelligent'], sentence: 'The dolphin is very intelligent.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 31, word: 'eagle', meaning: '鹰', phonetic: '/ˈiːɡl/', relatedWords: ['bird', 'fly', 'predator'], sentence: 'The eagle flies high in the sky.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 32, word: 'flamingo', meaning: '火烈鸟', phonetic: '/fləˈmɪŋɡəʊ/', relatedWords: ['bird', 'pink', 'water'], sentence: 'The flamingo has pink feathers.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 33, word: 'giraffe', meaning: '长颈鹿', phonetic: '/dʒəˈrɑːf/', relatedWords: ['animal', 'tall', 'neck'], sentence: 'The giraffe has a long neck.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 34, word: 'harmony', meaning: '和谐', phonetic: '/ˈhɑːməni/', relatedWords: ['peace', 'balance', 'unity'], sentence: 'We live in harmony with nature.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 35, word: 'island', meaning: '岛屿', phonetic: '/ˈaɪlənd/', relatedWords: ['land', 'water', 'beach'], sentence: 'The island is surrounded by water.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 36, word: 'jungle', meaning: '丛林', phonetic: '/ˈdʒʌŋɡl/', relatedWords: ['forest', 'wild', 'animals'], sentence: 'Many animals live in the jungle.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 37, word: 'kangaroo', meaning: '袋鼠', phonetic: '/ˌkæŋɡəˈruː/', relatedWords: ['animal', 'pouch', 'Australia'], sentence: 'The kangaroo carries its baby in a pouch.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 38, word: 'library', meaning: '图书馆', phonetic: '/ˈlaɪbrəri/', relatedWords: ['books', 'read', 'quiet'], sentence: 'I go to the library to read books.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 39, word: 'mountain', meaning: '山', phonetic: '/ˈmaʊntən/', relatedWords: ['hill', 'climb', 'high'], sentence: 'The mountain is very high.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 40, word: 'notebook', meaning: '笔记本', phonetic: '/ˈnəʊtbʊk/', relatedWords: ['stationery', 'write', 'notes'], sentence: 'I write notes in my notebook.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 41, word: 'ocean', meaning: '海洋', phonetic: '/ˈəʊʃn/', relatedWords: ['water', 'sea', 'deep'], sentence: 'The ocean is very deep.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 42, word: 'pyramid', meaning: '金字塔', phonetic: '/ˈpɪrəmɪd/', relatedWords: ['ancient', 'Egypt', 'structure'], sentence: 'The pyramid was built by ancient Egyptians.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 43, word: 'quicksand', meaning: '流沙', phonetic: '/ˈkwɪksænd/', relatedWords: ['sand', 'danger', 'sink'], sentence: 'Be careful of quicksand in the desert.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 44, word: 'rainbow', meaning: '彩虹', phonetic: '/ˈreɪnbəʊ/', relatedWords: ['colors', 'rain', 'sky'], sentence: 'I see a rainbow after the rain.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 45, word: 'satellite', meaning: '卫星', phonetic: '/ˈsætəlaɪt/', relatedWords: ['space', 'orbit', 'communication'], sentence: 'The satellite orbits the Earth.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 46, word: 'telescope', meaning: '望远镜', phonetic: '/ˈtelɪskəʊp/', relatedWords: ['see', 'far', 'astronomy'], sentence: 'I use a telescope to look at stars.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 47, word: 'universe', meaning: '宇宙', phonetic: '/ˈjuːnɪvɜːs/', relatedWords: ['space', 'galaxies', 'stars'], sentence: 'The universe is very big.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 48, word: 'volcano', meaning: '火山', phonetic: '/vɒlˈkeɪnəʊ/', relatedWords: ['mountain', 'lava', 'erupt'], sentence: 'The volcano erupts lava.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 49, word: 'waterfall', meaning: '瀑布', phonetic: '/ˈwɔːtəfɔːl/', relatedWords: ['water', 'flow', 'nature'], sentence: 'The waterfall is beautiful.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 50, word: 'x-ray', meaning: 'X光', phonetic: '/ˈeks reɪ/', relatedWords: ['medical', 'see', 'bones'], sentence: 'The doctor uses an x-ray to see bones.', level: 2, countries: ['US', 'UK', 'SG', 'CA'] },
  
  // Level 3 - 高级词汇
  { id: 51, word: 'accomplish', meaning: '完成', phonetic: '/əˈkʌmplɪʃ/', relatedWords: ['achieve', 'success', 'goal'], sentence: 'I can accomplish anything I set my mind to.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 52, word: 'biodiversity', meaning: '生物多样性', phonetic: '/ˌbaɪəʊdaɪˈvɜːsəti/', relatedWords: ['nature', 'species', 'ecosystem'], sentence: 'Biodiversity is important for our planet.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 53, word: 'communication', meaning: '交流', phonetic: '/kəˌmjuːnɪˈkeɪʃn/', relatedWords: ['talk', 'share', 'message'], sentence: 'Good communication is important.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 54, word: 'dictionary', meaning: '字典', phonetic: '/ˈdɪkʃəneri/', relatedWords: ['words', 'meanings', 'reference'], sentence: 'I use a dictionary to find word meanings.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 55, word: 'environment', meaning: '环境', phonetic: '/ɪnˈvaɪrənmənt/', relatedWords: ['nature', 'protect', 'surroundings'], sentence: 'We need to protect the environment.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 56, word: 'fascinating', meaning: '迷人的', phonetic: '/ˈfæsɪneɪtɪŋ/', relatedWords: ['interesting', 'captivating', 'engaging'], sentence: 'The book is fascinating.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 57, word: 'globalization', meaning: '全球化', phonetic: '/ˌɡləʊbəlaɪˈzeɪʃn/', relatedWords: ['world', 'international', 'connect'], sentence: 'Globalization connects people around the world.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 58, word: 'harmonious', meaning: '和谐的', phonetic: '/hɑːˈməʊniəs/', relatedWords: ['peaceful', 'balanced', 'united'], sentence: 'We live in a harmonious community.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 59, word: 'innovation', meaning: '创新', phonetic: '/ˌɪnəˈveɪʃn/', relatedWords: ['new', 'create', 'invent'], sentence: 'Innovation leads to new discoveries.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 60, word: 'journey', meaning: '旅程', phonetic: '/ˈdʒɜːni/', relatedWords: ['trip', 'travel', 'experience'], sentence: 'Life is a journey.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 61, word: 'knowledge', meaning: '知识', phonetic: '/ˈnɒlɪdʒ/', relatedWords: ['learn', 'education', 'wisdom'], sentence: 'Knowledge is power.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 62, word: 'leadership', meaning: '领导力', phonetic: '/ˈliːdəʃɪp/', relatedWords: ['lead', 'guide', 'inspire'], sentence: 'Good leadership is important for a team.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 63, word: 'motivation', meaning: '动力', phonetic: '/ˌməʊtɪˈveɪʃn/', relatedWords: ['inspire', 'drive', 'goal'], sentence: 'Motivation helps us achieve our goals.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 64, word: 'network', meaning: '网络', phonetic: '/ˈnetwɜːk/', relatedWords: ['connect', 'system', 'relationship'], sentence: 'We have a network of friends.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 65, word: 'opportunity', meaning: '机会', phonetic: '/ˌɒpəˈtjuːnəti/', relatedWords: ['chance', 'possibility', 'advantage'], sentence: 'I have an opportunity to learn.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 66, word: 'perseverance', meaning: '毅力', phonetic: '/ˌpɜːsɪˈvɪərəns/', relatedWords: ['persist', 'determination', 'effort'], sentence: 'Perseverance leads to success.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 67, word: 'quality', meaning: '质量', phonetic: '/ˈkwɒləti/', relatedWords: ['excellence', 'standard', 'value'], sentence: 'Quality is more important than quantity.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 68, word: 'responsibility', meaning: '责任', phonetic: '/rɪˌspɒnsəˈbɪləti/', relatedWords: ['duty', 'accountable', 'obligation'], sentence: 'With great power comes great responsibility.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 69, word: 'sustainability', meaning: '可持续性', phonetic: '/səˌsteɪnəˈbɪləti/', relatedWords: ['environment', 'protect', 'future'], sentence: 'Sustainability is important for our future.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 70, word: 'teamwork', meaning: '团队合作', phonetic: '/ˈtiːmwɜːk/', relatedWords: ['cooperate', 'collaborate', 'team'], sentence: 'Teamwork makes the dream work.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 71, word: 'understanding', meaning: '理解', phonetic: '/ˌʌndəˈstændɪŋ/', relatedWords: ['comprehend', 'empathy', 'knowledge'], sentence: 'Understanding others is important.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 72, word: 'values', meaning: '价值观', phonetic: '/ˈvæljuːz/', relatedWords: ['beliefs', 'principles', 'morals'], sentence: 'We should live by good values.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 73, word: 'wisdom', meaning: '智慧', phonetic: '/ˈwɪzdəm/', relatedWords: ['knowledge', 'experience', 'insight'], sentence: 'Wisdom comes with experience.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 74, word: 'xenophobia', meaning: '仇外心理', phonetic: '/ˌzenəˈfəʊbiə/', relatedWords: ['fear', 'foreigners', 'prejudice'], sentence: 'Xenophobia is a harmful attitude.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 75, word: 'youth', meaning: '青年', phonetic: '/juːθ/', relatedWords: ['young', 'future', 'energy'], sentence: 'The youth are our future.', level: 3, countries: ['US', 'UK', 'SG', 'CA'] },
  
  // Level 4 - 初中词汇
  { id: 76, word: 'analyze', meaning: '分析', phonetic: '/ˈænəlaɪz/', relatedWords: ['examine', 'study', 'evaluate'], sentence: 'I need to analyze the problem carefully.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 77, word: 'beneficial', meaning: '有益的', phonetic: '/ˌbenɪˈfɪʃl/', relatedWords: ['helpful', 'good', 'advantageous'], sentence: 'Exercise is beneficial for health.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 78, word: 'complicated', meaning: '复杂的', phonetic: '/ˈkɒmplɪkeɪtɪd/', relatedWords: ['complex', 'difficult', 'intricate'], sentence: 'The problem is very complicated.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 79, word: 'diverse', meaning: '多样的', phonetic: '/daɪˈvɜːs/', relatedWords: ['different', 'varied', 'multicultural'], sentence: 'Our world is diverse and beautiful.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 80, word: 'efficient', meaning: '高效的', phonetic: '/ɪˈfɪʃnt/', relatedWords: ['effective', 'productive', 'quick'], sentence: 'We need to be more efficient.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 81, word: 'flexible', meaning: '灵活的', phonetic: '/ˈfleksəbl/', relatedWords: ['adaptable', 'bendable', 'versatile'], sentence: 'I need to be flexible with my plans.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 82, word: 'global', meaning: '全球的', phonetic: '/ˈɡləʊbl/', relatedWords: ['worldwide', 'international', 'universal'], sentence: 'We live in a global community.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 83, word: 'hypothesis', meaning: '假设', phonetic: '/haɪˈpɒθəsɪs/', relatedWords: ['theory', 'guess', 'science'], sentence: 'The scientist tested his hypothesis.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 84, word: 'innovative', meaning: '创新的', phonetic: '/ˈɪnəveɪtɪv/', relatedWords: ['creative', 'original', 'new'], sentence: 'The company has innovative ideas.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 85, word: 'justice', meaning: '正义', phonetic: '/ˈdʒʌstɪs/', relatedWords: ['fairness', 'equality', 'law'], sentence: 'We need to fight for justice.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 86, word: 'knowledgeable', meaning: '知识渊博的', phonetic: '/ˈnɒlɪdʒəbl/', relatedWords: ['smart', 'educated', 'informed'], sentence: 'The teacher is very knowledgeable.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 87, word: 'logic', meaning: '逻辑', phonetic: '/ˈlɒdʒɪk/', relatedWords: ['reason', 'sense', 'rational'], sentence: 'His argument has no logic.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 88, word: 'methodology', meaning: '方法论', phonetic: '/ˌmeθəˈdɒlədʒi/', relatedWords: ['method', 'approach', 'system'], sentence: 'The research uses a scientific methodology.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 89, word: 'neutral', meaning: '中立的', phonetic: '/ˈnjuːtrəl/', relatedWords: ['impartial', 'unbiased', 'objective'], sentence: 'The judge must remain neutral.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 90, word: 'objective', meaning: '客观的', phonetic: '/əbˈdʒektɪv/', relatedWords: ['factual', 'unbiased', 'neutral'], sentence: 'We need to be objective in our analysis.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 91, word: 'perspective', meaning: '视角', phonetic: '/pəˈspektɪv/', relatedWords: ['view', 'opinion', 'angle'], sentence: 'Everyone has a different perspective.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 92, word: 'quantitative', meaning: '定量的', phonetic: '/ˈkwɒntɪtətɪv/', relatedWords: ['numbers', 'measure', 'statistics'], sentence: 'The study uses quantitative data.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 93, word: 'reliable', meaning: '可靠的', phonetic: '/rɪˈlaɪəbl/', relatedWords: ['trustworthy', 'dependable', 'consistent'], sentence: 'He is a reliable friend.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 94, word: 'sophisticated', meaning: '复杂的', phonetic: '/səˈfɪstɪkeɪtɪd/', relatedWords: ['advanced', 'refined', 'complex'], sentence: 'The technology is very sophisticated.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 95, word: 'theoretical', meaning: '理论的', phonetic: '/ˌθɪəˈretɪkl/', relatedWords: ['abstract', 'conceptual', 'academic'], sentence: 'The idea is still theoretical.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 96, word: 'unique', meaning: '独特的', phonetic: '/juːˈniːk/', relatedWords: ['special', 'one-of-a-kind', 'distinctive'], sentence: 'Everyone is unique in their own way.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 97, word: 'valid', meaning: '有效的', phonetic: '/ˈvælɪd/', relatedWords: ['sound', 'logical', 'acceptable'], sentence: 'His argument is valid.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 98, word: 'wholesome', meaning: '健康的', phonetic: '/ˈhəʊlsəm/', relatedWords: ['healthy', 'good', 'beneficial'], sentence: 'Eating wholesome food is important.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 99, word: 'xenial', meaning: '好客的', phonetic: '/ˈziːniəl/', relatedWords: ['hospitable', 'friendly', 'welcoming'], sentence: 'The host was very xenial.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] },
  { id: 100, word: 'zealous', meaning: '热情的', phonetic: '/ˈzeləs/', relatedWords: ['enthusiastic', 'passionate', 'eager'], sentence: 'She is zealous about her work.', level: 4, countries: ['US', 'UK', 'SG', 'CA'] }
];

// 根据级别获取单词
export const getWordsByLevel = (level, count = 10) => {
  const levelWords = wordLibrary.filter(word => word.level === level);
  // 随机选择指定数量的单词
  const shuffled = [...levelWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 获取所有单词
export const getAllWords = () => {
  return wordLibrary;
};

// 根据国家获取单词
export const getWordsByCountry = (country, level, count = 10) => {
  const countryWords = wordLibrary.filter(word => 
    word.countries.includes(country) && word.level === level
  );
  const shuffled = [...countryWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default wordLibrary;