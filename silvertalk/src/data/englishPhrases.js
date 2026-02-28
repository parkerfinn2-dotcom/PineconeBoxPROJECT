// 日常英语用语500句
// 按场景分类

const englishPhrases = {
  // 日常问候
  greeting: [
    [
      { role: 'User', text: 'Hello!', translation: '你好！' },
      { role: 'AI', text: 'Hello! How are you today?', translation: '你好！你今天怎么样？' },
      { role: 'User', text: 'I am fine, thank you. And you?', translation: '我很好，谢谢。你呢？' },
      { role: 'AI', text: 'I am doing well, thank you for asking!', translation: '我很好，谢谢你的关心！' },
    ],
    [
      { role: 'User', text: 'Good morning!', translation: '早上好！' },
      { role: 'AI', text: 'Good morning! Did you sleep well?', translation: '早上好！你睡得好吗？' },
      { role: 'User', text: 'Yes, I slept very well. Thank you!', translation: '是的，我睡得很好。谢谢！' },
      { role: 'AI', text: 'That\'s great! Have a nice day!', translation: '太好了！祝你有愉快的一天！' },
    ],
    [
      { role: 'User', text: 'Hi there!', translation: '嗨！' },
      { role: 'AI', text: 'Hi! Long time no see!', translation: '嗨！好久不见！' },
      { role: 'User', text: 'Yes, it\'s been a while. How have you been?', translation: '是的，有一段时间了。你最近怎么样？' },
      { role: 'AI', text: 'I\'ve been good, thanks for asking!', translation: '我很好，谢谢关心！' },
    ],
    [
      { role: 'User', text: 'Good afternoon!', translation: '下午好！' },
      { role: 'AI', text: 'Good afternoon! How\'s your day going?', translation: '下午好！你今天过得怎么样？' },
      { role: 'User', text: 'It\'s going well, thank you.', translation: '很好，谢谢。' },
      { role: 'AI', text: 'That\'s good to hear!', translation: '很高兴听到！' },
    ],
    [
      { role: 'User', text: 'Good evening!', translation: '晚上好！' },
      { role: 'AI', text: 'Good evening! How was your day?', translation: '晚上好！你今天过得怎么样？' },
      { role: 'User', text: 'It was busy, but good.', translation: '很忙，但很好。' },
      { role: 'AI', text: 'I hope you can relax now!', translation: '希望你现在可以放松！' },
    ],
  ],
  
  // 餐厅用餐
  restaurant: [
    [
      { role: 'Waiter', text: 'Welcome to our restaurant! May I take your order?', translation: '欢迎来到我们的餐厅！我可以为您点餐吗？' },
      { role: 'Customer', text: 'Yes, I would like a hamburger and a coke, please.', translation: '是的，我想要一个汉堡和一杯可乐，谢谢。' },
      { role: 'Waiter', text: 'Sure! Would you like anything else?', translation: '好的！您还需要其他东西吗？' },
      { role: 'Customer', text: 'No, that\'s all. Thank you.', translation: '不用了，就这些。谢谢。' },
    ],
    [
      { role: 'Waiter', text: 'Good evening! Welcome to our restaurant. Here\'s the menu.', translation: '晚上好！欢迎来到我们的餐厅。这是菜单。' },
      { role: 'Customer', text: 'Thank you. I would like the chicken salad, please.', translation: '谢谢。我想要鸡肉沙拉，谢谢。' },
      { role: 'Waiter', text: 'Excellent choice! Would you like a drink with that?', translation: '好选择！您想要配什么饮料吗？' },
      { role: 'Customer', text: 'Yes, a glass of water, please.', translation: '是的，请给我一杯水。' },
    ],
    [
      { role: 'Waiter', text: 'Hello! How many people are in your party?', translation: '你好！你们有几个人？' },
      { role: 'Customer', text: 'Table for two, please.', translation: '请给我们安排一张两人桌。' },
      { role: 'Waiter', text: 'Right this way, please. Here\'s your table.', translation: '请这边走。这是您的桌子。' },
      { role: 'Customer', text: 'Thank you very much.', translation: '非常感谢。' },
    ],
    [
      { role: 'Customer', text: 'Excuse me, can I see the menu again?', translation: '打扰一下，我能再看一下菜单吗？' },
      { role: 'Waiter', text: 'Of course! Here you are.', translation: '当然！给您。' },
      { role: 'Customer', text: 'What do you recommend?', translation: '你推荐什么？' },
      { role: 'Waiter', text: 'Our steak is very popular.', translation: '我们的牛排很受欢迎。' },
    ],
    [
      { role: 'Customer', text: 'Can we have the bill, please?', translation: '请给我们账单，谢谢。' },
      { role: 'Waiter', text: 'Sure! Let me get that for you.', translation: '好的！我去给您拿。' },
      { role: 'Customer', text: 'Keep the change.', translation: '不用找零了。' },
      { role: 'Waiter', text: 'Thank you very much! Have a nice day!', translation: '非常感谢！祝您有愉快的一天！' },
    ],
  ],
  
  // 旅行交通
  travel: [
    [
      { role: 'Tourist', text: 'Excuse me, can you tell me how to get to the museum?', translation: '打扰一下，您能告诉我怎么去博物馆吗？' },
      { role: 'Local', text: 'Sure! Go straight for two blocks, then turn left. You will see it on your right.', translation: '当然！直走两个街区，然后左转。你会在右边看到它。' },
      { role: 'Tourist', text: 'Thank you very much!', translation: '非常感谢！' },
      { role: 'Local', text: 'You\'re welcome! Enjoy your visit.', translation: '不客气！祝您参观愉快。' },
    ],
    [
      { role: 'Tourist', text: 'Excuse me, where is the nearest subway station?', translation: '打扰一下，最近的地铁站在哪里？' },
      { role: 'Local', text: 'It\'s about 10 minutes walk from here. Go down this street and turn right.', translation: '从这里步行约10分钟。沿着这条街走，然后右转。' },
      { role: 'Tourist', text: 'Is it well signposted?', translation: '有明显的标志吗？' },
      { role: 'Local', text: 'Yes, you won\'t miss it. There\'s a big sign at the entrance.', translation: '是的，你不会错过的。入口处有一个大标志。' },
    ],
    [
      { role: 'Tourist', text: 'Hello, do you know how to get to the train station?', translation: '你好，你知道怎么去火车站吗？' },
      { role: 'Local', text: 'Yes, you can take bus number 12 from that stop over there.', translation: '是的，你可以从那边的车站乘坐12路公交车。' },
      { role: 'Tourist', text: 'How long does it take?', translation: '需要多长时间？' },
      { role: 'Local', text: 'It should take about 20 minutes. The bus comes every 10 minutes.', translation: '大约需要20分钟。公交车每10分钟一班。' },
    ],
    [
      { role: 'Tourist', text: 'Excuse me, how much is a ticket to the city center?', translation: '打扰一下，去市中心的车票多少钱？' },
      { role: 'Ticket Seller', text: 'It\'s $5 for a single ticket.', translation: '单程票5美元。' },
      { role: 'Tourist', text: 'I\'d like two tickets, please.', translation: '请给我两张票。' },
      { role: 'Ticket Seller', text: 'Here you are. Have a nice trip!', translation: '给您。旅途愉快！' },
    ],
    [
      { role: 'Tourist', text: 'Hello, where can I rent a bike?', translation: '你好，我在哪里可以租自行车？' },
      { role: 'Local', text: 'There\'s a bike rental shop just around the corner.', translation: '拐角处有一家自行车租赁店。' },
      { role: 'Tourist', text: 'How much does it cost per hour?', translation: '每小时多少钱？' },
      { role: 'Local', text: 'It\'s $3 per hour or $15 for the whole day.', translation: '每小时3美元或全天15美元。' },
    ],
  ],
  
  // 医院健康
  hospital: [
    [
      { role: 'Doctor', text: 'How are you feeling today?', translation: '您今天感觉怎么样？' },
      { role: 'Patient', text: 'I have a headache and a fever.', translation: '我头痛，还发烧。' },
      { role: 'Doctor', text: 'Let me check your temperature.', translation: '让我给您量一下体温。' },
      { role: 'Patient', text: 'Okay.', translation: '好的。' },
    ],
    [
      { role: 'Doctor', text: 'What seems to be the problem today?', translation: '今天哪里不舒服？' },
      { role: 'Patient', text: 'I have a sore throat and I can\'t stop coughing.', translation: '我喉咙痛，而且一直咳嗽。' },
      { role: 'Doctor', text: 'Let me examine your throat. Open your mouth wide, please.', translation: '让我检查一下您的喉咙。请张大嘴巴。' },
      { role: 'Patient', text: 'Ah...', translation: '啊...' },
    ],
    [
      { role: 'Nurse', text: 'Good morning! I\'m here to take your blood pressure.', translation: '早上好！我来给您量血压。' },
      { role: 'Patient', text: 'Okay, thank you.', translation: '好的，谢谢。' },
      { role: 'Nurse', text: 'Please sit down and relax. I\'ll wrap the cuff around your arm.', translation: '请坐下放松。我会把袖带缠在您的手臂上。' },
      { role: 'Patient', text: 'Alright.', translation: '好的。' },
    ],
    [
      { role: 'Patient', text: 'Doctor, how long will it take to recover?', translation: '医生，需要多长时间才能恢复？' },
      { role: 'Doctor', text: 'You should feel better in about a week.', translation: '大约一周后你会感觉好一些。' },
      { role: 'Patient', text: 'Do I need to take any medicine?', translation: '我需要吃药吗？' },
      { role: 'Doctor', text: 'Yes, I\'ll prescribe some medicine for you.', translation: '是的，我会给你开一些药。' },
    ],
    [
      { role: 'Patient', text: 'Excuse me, where is the pharmacy?', translation: '打扰一下，药房在哪里？' },
      { role: 'Staff', text: 'It\'s on the first floor, near the main entrance.', translation: '在一楼，靠近主入口。' },
      { role: 'Patient', text: 'Thank you very much.', translation: '非常感谢。' },
      { role: 'Staff', text: 'You\'re welcome. Take care!', translation: '不客气。保重！' },
    ],
  ],
  
  // 紧急求助
  emergency: [
    [
      { role: 'Caller', text: 'Hello, I need emergency help!', translation: '你好，我需要紧急帮助！' },
      { role: 'Operator', text: 'Please stay calm. What\'s the emergency?', translation: '请保持冷静。发生了什么紧急情况？' },
      { role: 'Caller', text: 'There\'s a fire in my building!', translation: '我的大楼着火了！' },
      { role: 'Operator', text: 'Please tell me your location.', translation: '请告诉我您的位置。' },
    ],
    [
      { role: 'Caller', text: 'Emergency! Someone has fainted!', translation: '紧急情况！有人晕倒了！' },
      { role: 'Operator', text: 'Please stay calm. Where are you located?', translation: '请保持冷静。您在哪里？' },
      { role: 'Caller', text: 'We\'re at 123 Main Street, in the park.', translation: '我们在主街123号，公园里。' },
      { role: 'Operator', text: 'An ambulance is on its way. Stay with the person and keep them warm.', translation: '救护车正在赶来。请留在患者身边，保持他们温暖。' },
    ],
    [
      { role: 'Caller', text: 'Hello! I think I\'ve been in a car accident.', translation: '你好！我想我出车祸了。' },
      { role: 'Operator', text: 'Oh no! Are you injured?', translation: '哦不！你受伤了吗？' },
      { role: 'Caller', text: 'My arm hurts, but I think I\'m okay. The other driver seems hurt too.', translation: '我的胳膊疼，但我想我没事。另一个司机看起来也受伤了。' },
      { role: 'Operator', text: 'Please stay where you are. Help is on the way.', translation: '请留在原地。救援正在路上。' },
    ],
    [
      { role: 'Caller', text: 'Emergency! My child is choking!', translation: '紧急情况！我的孩子被噎住了！' },
      { role: 'Operator', text: 'Please stay calm. I need you to follow my instructions.', translation: '请保持冷静。我需要你按照我的指示做。' },
      { role: 'Caller', text: 'Okay, what should I do?', translation: '好的，我该怎么做？' },
      { role: 'Operator', text: 'First, place the child face down on your forearm...', translation: '首先，将孩子面朝下放在你的前臂上...' },
    ],
    [
      { role: 'Caller', text: 'Hello, I need police assistance!', translation: '你好，我需要警察帮助！' },
      { role: 'Operator', text: 'Please explain the situation.', translation: '请解释情况。' },
      { role: 'Caller', text: 'There\'s someone breaking into my neighbor\'s house!', translation: '有人闯入我邻居的房子！' },
      { role: 'Operator', text: 'Please tell me your location. Officers are on their way.', translation: '请告诉我您的位置。警察正在赶来。' },
    ],
  ],
  
  // 社交聊天
  social: [
    [
      { role: 'Friend 1', text: 'How was your weekend?', translation: '你周末过得怎么样？' },
      { role: 'Friend 2', text: 'It was great! I went to the park.', translation: '很棒！我去了公园。' },
      { role: 'Friend 1', text: 'That sounds nice!', translation: '听起来不错！' },
      { role: 'Friend 2', text: 'Yes, the weather was perfect.', translation: '是的，天气非常好。' },
    ],
    [
      { role: 'Friend 1', text: 'What did you do last night?', translation: '你昨晚做什么了？' },
      { role: 'Friend 2', text: 'I stayed home and watched a movie.', translation: '我待在家里看电影。' },
      { role: 'Friend 1', text: 'What movie did you watch?', translation: '你看了什么电影？' },
      { role: 'Friend 2', text: 'It was a comedy. It made me laugh a lot!', translation: '是一部喜剧。让我笑了很多！' },
    ],
    [
      { role: 'Friend 1', text: 'Have you tried the new coffee shop downtown?', translation: '你去过市中心的新咖啡店吗？' },
      { role: 'Friend 2', text: 'Yes, I went there last week. The coffee is amazing!', translation: '是的，我上周去了。咖啡很棒！' },
      { role: 'Friend 1', text: 'I\'ll have to check it out soon.', translation: '我很快就去看看。' },
      { role: 'Friend 2', text: 'You should! They also have great pastries.', translation: '你应该去！他们还有很棒的糕点。' },
    ],
    [
      { role: 'Friend 1', text: 'What are your plans for the holidays?', translation: '你假期有什么计划？' },
      { role: 'Friend 2', text: 'I\'m going to visit my family in the countryside.', translation: '我要去乡下看望我的家人。' },
      { role: 'Friend 1', text: 'That sounds wonderful!', translation: '听起来很棒！' },
      { role: 'Friend 2', text: 'I can\'t wait to see them!', translation: '我等不及要见到他们了！' },
    ],
    [
      { role: 'Friend 1', text: 'Do you have any hobbies?', translation: '你有什么爱好吗？' },
      { role: 'Friend 2', text: 'I like reading and hiking.', translation: '我喜欢阅读和徒步旅行。' },
      { role: 'Friend 1', text: 'That\'s interesting! I enjoy hiking too.', translation: '很有趣！我也喜欢徒步旅行。' },
      { role: 'Friend 2', text: 'Maybe we can go hiking together sometime!', translation: '也许我们可以一起去徒步旅行！' },
    ],
  ],
  
  // 职场用语
  workplace: [
    [
      { role: 'Colleague', text: 'How\'s the project going?', translation: '项目进展如何？' },
      { role: 'You', text: 'It\'s going well. I expect to finish it by Friday.', translation: '进展顺利。我预计周五前完成。' },
      { role: 'Colleague', text: 'Great! Do you need any help?', translation: '太好了！你需要帮助吗？' },
      { role: 'You', text: 'No, thank you. I\'m good.', translation: '不用了，谢谢。我没问题。' },
    ],
    [
      { role: 'Boss', text: 'Good morning! I wanted to check in on your progress.', translation: '早上好！我想检查一下你的进展。' },
      { role: 'You', text: 'Good morning! I\'ve completed the first phase of the project.', translation: '早上好！我已经完成了项目的第一阶段。' },
      { role: 'Boss', text: 'Excellent! Keep up the good work.', translation: '太好了！继续保持。' },
      { role: 'You', text: 'Thank you! I\'ll have the next phase done by Wednesday.', translation: '谢谢！我会在周三前完成下一阶段。' },
    ],
    [
      { role: 'Colleague', text: 'Hey, do you have a minute?', translation: '嘿，你有时间吗？' },
      { role: 'You', text: 'Sure, what\'s up?', translation: '当然，怎么了？' },
      { role: 'Colleague', text: 'I need help with this report. Can you explain this section to me?', translation: '我需要帮助完成这份报告。你能给我解释一下这部分吗？' },
      { role: 'You', text: 'Of course! Let me take a look.', translation: '当然！让我看看。' },
    ],
    [
      { role: 'Boss', text: 'We need to schedule a meeting for next week. When are you available?', translation: '我们需要安排下周的会议。你什么时候有空？' },
      { role: 'You', text: 'I\'m available on Tuesday and Thursday.', translation: '我周二和周四有空。' },
      { role: 'Boss', text: 'Great, let\'s set it for Tuesday at 10 AM.', translation: '好的，我们定在周二上午10点。' },
      { role: 'You', text: 'Perfect, I\'ll put it in my calendar.', translation: '太好了，我会把它放在我的日历里。' },
    ],
    [
      { role: 'Colleague', text: 'Did you hear about the new project?', translation: '你听说新项目了吗？' },
      { role: 'You', text: 'No, what\'s it about?', translation: '没有，是关于什么的？' },
      { role: 'Colleague', text: 'We\'re going to work with a new client from overseas.', translation: '我们将与一位来自海外的新客户合作。' },
      { role: 'You', text: 'That sounds exciting!', translation: '听起来很兴奋！' },
    ],
  ],
  
  // 购物
  shopping: [
    [
      { role: 'Customer', text: 'Excuse me, where can I find the clothing section?', translation: '打扰一下，我在哪里可以找到服装区？' },
      { role: 'Staff', text: 'It\'s on the second floor, near the escalator.', translation: '在二楼，靠近自动扶梯。' },
      { role: 'Customer', text: 'Thank you very much.', translation: '非常感谢。' },
      { role: 'Staff', text: 'You\'re welcome!', translation: '不客气！' },
    ],
    [
      { role: 'Customer', text: 'How much is this shirt?', translation: '这件衬衫多少钱？' },
      { role: 'Staff', text: 'It\'s $25. There\'s a 20% discount today.', translation: '25美元。今天有20%的折扣。' },
      { role: 'Customer', text: 'Great! I\'ll take it.', translation: '太好了！我买了。' },
      { role: 'Staff', text: 'Would you like to pay by cash or card?', translation: '您想用现金还是信用卡支付？' },
    ],
    [
      { role: 'Customer', text: 'Do you have this in a larger size?', translation: '这个有更大的尺寸吗？' },
      { role: 'Staff', text: 'Let me check for you. What size do you need?', translation: '让我为您检查。您需要什么尺寸？' },
      { role: 'Customer', text: 'I need a large.', translation: '我需要大号。' },
      { role: 'Staff', text: 'Yes, we have it in large. Let me get it for you.', translation: '是的，我们有大号。我去给您拿。' },
    ],
    [
      { role: 'Customer', text: 'Can I try this on?', translation: '我可以试穿这个吗？' },
      { role: 'Staff', text: 'Of course! The fitting rooms are over there.', translation: '当然！试衣间在那边。' },
      { role: 'Customer', text: 'Thank you.', translation: '谢谢。' },
      { role: 'Staff', text: 'Take your time!', translation: '慢慢来！' },
    ],
    [
      { role: 'Customer', text: 'I\'d like to return this item.', translation: '我想退货。' },
      { role: 'Staff', text: 'Okay, do you have the receipt?', translation: '好的，您有收据吗？' },
      { role: 'Customer', text: 'Yes, here it is.', translation: '是的，在这里。' },
      { role: 'Staff', text: 'Alright, I\'ll process the return for you.', translation: '好的，我会为您处理退货。' },
    ],
  ],
  
  // 电话用语
  phone: [
    [
      { role: 'Caller', text: 'Hello, may I speak to John please?', translation: '你好，请问约翰在吗？' },
      { role: 'Receiver', text: 'Speaking. Who\'s calling?', translation: '我就是。请问您是？' },
      { role: 'Caller', text: 'Hi John, it\'s Mary. How are you?', translation: '嗨，约翰，我是玛丽。你好吗？' },
      { role: 'Receiver', text: 'Hi Mary! I\'m doing well, thank you.', translation: '嗨，玛丽！我很好，谢谢。' },
    ],
    [
      { role: 'Caller', text: 'Hello, is this the Smith residence?', translation: '你好，是史密斯家吗？' },
      { role: 'Receiver', text: 'Yes, who\'s calling?', translation: '是的，请问您是？' },
      { role: 'Caller', text: 'This is Tom from the office. May I speak to Mr. Smith?', translation: '我是办公室的汤姆。我可以和史密斯先生说话吗？' },
      { role: 'Receiver', text: 'I\'m sorry, he\'s not home right now. Can I take a message?', translation: '对不起，他现在不在家。我可以带个口信吗？' },
    ],
    [
      { role: 'Caller', text: 'Hello, I\'d like to make a reservation for two people tonight at 7 PM.', translation: '你好，我想预订今晚7点的两人桌。' },
      { role: 'Receiver', text: 'Sure, may I have your name please?', translation: '当然，请问您的名字？' },
      { role: 'Caller', text: 'My name is David Chen.', translation: '我叫大卫·陈。' },
      { role: 'Receiver', text: 'Okay, David. I\'ve reserved a table for two at 7 PM. See you tonight!', translation: '好的，大卫。我已经预订了晚上7点的两人桌。今晚见！' },
    ],
    [
      { role: 'Caller', text: 'Hello, I\'m calling about the job opening you advertised.', translation: '你好，我打电话是关于你们发布的职位空缺。' },
      { role: 'Receiver', text: 'Great! Can you tell me a little about yourself?', translation: '太好了！你能告诉我一些关于你自己的情况吗？' },
      { role: 'Caller', text: 'I have five years of experience in marketing.', translation: '我有五年的市场营销经验。' },
      { role: 'Receiver', text: 'Interesting. Can you come in for an interview next week?', translation: '很有趣。你下周能来面试吗？' },
    ],
    [
      { role: 'Caller', text: 'Hello, I need to cancel my appointment tomorrow.', translation: '你好，我需要取消明天的预约。' },
      { role: 'Receiver', text: 'I\'m sorry to hear that. May I ask why?', translation: '听到这个消息我很抱歉。我可以问为什么吗？' },
      { role: 'Caller', text: 'I have a family emergency.', translation: '我有家庭紧急情况。' },
      { role: 'Receiver', text: 'I understand. Let\'s reschedule for another day.', translation: '我理解。让我们改期到另一天。' },
    ],
  ],
  
  // 家庭生活
  family: [
    [
      { role: 'Parent', text: 'Honey, it\'s time for dinner!', translation: '亲爱的，该吃晚饭了！' },
      { role: 'Child', text: 'Okay, I\'ll be right there.', translation: '好的，我马上就来。' },
      { role: 'Parent', text: 'Did you finish your homework?', translation: '你完成作业了吗？' },
      { role: 'Child', text: 'Yes, I finished it earlier.', translation: '是的，我 earlier 完成了。' },
    ],
    [
      { role: 'Parent', text: 'What would you like for breakfast?', translation: '你早餐想吃什么？' },
      { role: 'Child', text: 'I\'d like cereal and milk, please.', translation: '我想要麦片和牛奶，谢谢。' },
      { role: 'Parent', text: 'Okay, I\'ll get that for you.', translation: '好的，我去给你拿。' },
      { role: 'Child', text: 'Thank you, Mom!', translation: '谢谢，妈妈！' },
    ],
    [
      { role: 'Spouse', text: 'How was your day at work?', translation: '你今天工作怎么样？' },
      { role: 'Spouse', text: 'It was busy, but productive.', translation: '很忙，但很有成效。' },
      { role: 'Spouse', text: 'That\'s good. What would you like for dinner?', translation: '很好。你晚饭想吃什么？' },
      { role: 'Spouse', text: 'Anything is fine with me.', translation: '我什么都可以。' },
    ],
    [
      { role: 'Parent', text: 'Don\'t forget to brush your teeth before bed.', translation: '睡觉前别忘了刷牙。' },
      { role: 'Child', text: 'Okay, I won\'t forget.', translation: '好的，我不会忘记的。' },
      { role: 'Parent', text: 'And put your toys away.', translation: '还有把你的玩具收起来。' },
      { role: 'Child', text: 'I will, Mom.', translation: '我会的，妈妈。' },
    ],
    [
      { role: 'Grandparent', text: 'Tell me about your school day.', translation: '告诉我你在学校的一天。' },
      { role: 'Child', text: 'We learned about dinosaurs today!', translation: '我们今天学习了恐龙！' },
      { role: 'Grandparent', text: 'That sounds fascinating!', translation: '听起来很有趣！' },
      { role: 'Child', text: 'Yes, they\'re really cool!', translation: '是的，它们真的很酷！' },
    ],
  ],
};

export default englishPhrases;