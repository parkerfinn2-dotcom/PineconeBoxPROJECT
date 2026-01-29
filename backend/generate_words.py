#!/usr/bin/env python3
"""
词汇生成脚本
用于批量生成词汇并导入到数据库中
按照等级分布生成模拟词汇数据
"""

import sqlite3
import os
import random

# 数据库连接
db_path = os.path.join(os.path.dirname(__file__), 'pinecone.db')
db = sqlite3.connect(db_path)
cursor = db.cursor()

print("=== 词汇生成工具 ===")

# 词汇生成配置
WORD_CONFIG = [
    # RAZ AA-C (1-5级)
    {'levels': [1, 2, 3, 4, 5], 'total': 500, 'themes': ['颜色', '数字', '家庭成员', '日常用品', '动物'], 'prefix': 'raz_aa_c'},
    # RAZ D-J (6-10级)
    {'levels': [6, 7, 8, 9, 10], 'total': 750, 'themes': ['职业', '学校用品', '食物', '交通工具', '天气'], 'prefix': 'raz_d_j'},
    # RAZ K-O (11-15级)
    {'levels': [11, 12, 13, 14, 15], 'total': 750, 'themes': ['学科', '社会', '文化', '自然', '技术'], 'prefix': 'raz_k_o'},
    # RAZ P-Z2 (16-20级)
    {'levels': [16, 17, 18, 19, 20], 'total': 1000, 'themes': ['学术', '专业', '抽象', '复杂', '高级'], 'prefix': 'raz_p_z2'},
    # KET (21-25级)
    {'levels': [21, 22, 23, 24, 25], 'total': 1000, 'themes': ['考试核心', '动词短语', '固定搭配', '常用表达', '基础语法'], 'prefix': 'ket'},
    # PET (26-30级)
    {'levels': [26, 27, 28, 29, 30], 'total': 1000, 'themes': ['考试扩展', '学术词汇', '高级动词短语', '复杂句型', '专业表达'], 'prefix': 'pet'}
]

# 基础词汇列表（用于生成真实感的词汇）
BASIC_WORDS = [
    'apple', 'banana', 'cat', 'dog', 'elephant', 'fish', 'goat', 'horse', 'ice', 'juice',
    'kite', 'lion', 'monkey', 'nest', 'orange', 'pencil', 'queen', 'rabbit', 'sun', 'tree',
    'water', 'xylophone', 'yellow', 'zebra', 'book', 'chair', 'desk', 'paper', 'ruler', 'school',
    'teacher', 'student', 'classroom', 'blackboard', 'computer', 'mouse', 'keyboard', 'screen', 'printer', 'scanner',
    'phone', 'camera', 'watch', 'clock', 'lamp', 'table', 'sofa', 'bed', 'chair', 'cabinet',
    'kitchen', 'bathroom', 'bedroom', 'livingroom', 'diningroom', 'garden', 'yard', 'garage', 'attic', 'basement',
    'car', 'bus', 'train', 'plane', 'ship', 'bicycle', 'motorcycle', 'truck', 'van', 'taxi',
    'food', 'drink', 'fruit', 'vegetable', 'meat', 'fish', 'egg', 'milk', 'bread', 'rice',
    'soup', 'salad', 'pizza', 'pasta', 'steak', 'chicken', 'hamburger', 'hotdog', 'fries', 'icecream',
    'weather', 'sunny', 'rainy', 'cloudy', 'snowy', 'windy', 'stormy', 'foggy', 'hot', 'cold'
]

# 中文词汇列表（用于生成真实感的词义）
CHINESE_WORDS = [
    '苹果', '香蕉', '猫', '狗', '大象', '鱼', '山羊', '马', '冰', '果汁',
    '风筝', '狮子', '猴子', '鸟巢', '橙子', '铅笔', '女王', '兔子', '太阳', '树',
    '水', '木琴', '黄色', '斑马', '书', '椅子', '桌子', '纸', '尺子', '学校',
    '老师', '学生', '教室', '黑板', '电脑', '鼠标', '键盘', '屏幕', '打印机', '扫描仪',
    '电话', '相机', '手表', '时钟', '灯', '桌子', '沙发', '床', '椅子', '柜子',
    '厨房', '浴室', '卧室', '客厅', '餐厅', '花园', '院子', '车库', '阁楼', '地下室',
    '汽车', '公交车', '火车', '飞机', '船', '自行车', '摩托车', '卡车', '货车', '出租车',
    '食物', '饮料', '水果', '蔬菜', '肉', '鱼', '鸡蛋', '牛奶', '面包', '米饭',
    '汤', '沙拉', '披萨', '意大利面', '牛排', '鸡肉', '汉堡', '热狗', '薯条', '冰淇淋',
    '天气', '晴朗', '下雨', '多云', '下雪', '有风', '暴风雨', '有雾', '热', '冷'
]

def generate_word(prefix, level, index):
    """生成单词"""
    # 随机选择基础词汇或生成新词汇
    if random.random() < 0.7:
        # 使用基础词汇
        word = random.choice(BASIC_WORDS)
        # 添加后缀以确保唯一性
        if random.random() < 0.3:
            word = f"{word}{level}{index % 10}"
    else:
        # 生成新词汇
        word = f"{prefix}_{level}_{index}"
    return word

def generate_meaning(theme, level):
    """生成词义"""
    # 随机选择中文词汇或生成新词义
    if random.random() < 0.7:
        meaning = f"{random.choice(CHINESE_WORDS)} ({theme})"
    else:
        meaning = f"{theme}相关词汇 (等级{level})"
    return meaning

def generate_words():
    """生成词汇并导入数据库"""
    total_generated = 0
    total_imported = 0
    total_skipped = 0
    
    print("\n开始生成词汇...")
    
    for config in WORD_CONFIG:
        levels = config['levels']
        total_words = config['total']
        themes = config['themes']
        prefix = config['prefix']
        
        words_per_level = total_words // len(levels)
        
        print(f"\n生成 {prefix} 词汇 ({total_words}词):")
        
        for i, level in enumerate(levels):
            words_for_level = words_per_level
            if i == len(levels) - 1:
                words_for_level += total_words % len(levels)
            
            print(f"  等级 {level}: {words_for_level}词")
            
            for j in range(words_for_level):
                theme = random.choice(themes)
                word = generate_word(prefix, level, j)
                meaning = generate_meaning(theme, level)
                
                try:
                    cursor.execute(
                        "INSERT OR IGNORE INTO words (word, meaning, difficulty) VALUES (?, ?, ?)",
                        (word, meaning, level)
                    )
                    
                    if cursor.rowcount > 0:
                        total_imported += 1
                        if total_imported % 100 == 0:
                            print(f"  已导入 {total_imported} 词...")
                    else:
                        total_skipped += 1
                        if total_skipped % 100 == 0:
                            print(f"  跳过 {total_skipped} 重复词...")
                    
                    total_generated += 1
                    if total_generated % 500 == 0:
                        db.commit()
                        print(f"  已提交 {total_generated} 词到数据库...")
                        
                except Exception as e:
                    print(f"  导入词 {word} 时出错: {e}")
                    total_skipped += 1
    
    # 最终提交
    db.commit()
    print(f"\n词汇生成完成:")
    print(f"  总生成: {total_generated} 词")
    print(f"  成功导入: {total_imported} 词")
    print(f"  跳过: {total_skipped} 词")

def verify_database():
    """验证数据库状态"""
    print("\n=== 数据库验证 ===")
    
    # 1. 总词汇量
    cursor.execute("SELECT COUNT(*) FROM words")
    total = cursor.fetchone()[0]
    print(f"总词汇量: {total}")
    
    # 2. 等级分布
    cursor.execute("SELECT difficulty, COUNT(*) FROM words GROUP BY difficulty ORDER BY difficulty")
    level_counts = cursor.fetchall()
    
    print("\n等级分布:")
    for level, count in level_counts:
        print(f"等级 {level}: {count} 词")
    
    # 3. 计算覆盖率
    target = 5000
    coverage = (total / target) * 100
    print(f"\n目标覆盖率: {coverage:.2f}% ({total}/{target})")
    
    # 4. 检查重复词汇
    cursor.execute("SELECT word, COUNT(*) FROM words GROUP BY word HAVING COUNT(*) > 1")
    duplicates = cursor.fetchall()
    print(f"重复词汇: {len(duplicates)}")
    
    # 5. 检查缺失字段
    cursor.execute("SELECT COUNT(*) FROM words WHERE word IS NULL OR meaning IS NULL OR difficulty IS NULL")
    incomplete = cursor.fetchone()[0]
    print(f"缺失字段的词汇: {incomplete}")

def main():
    """主函数"""
    print("=== 词汇生成工具 ===")
    print("1. 生成并导入词汇")
    print("2. 验证数据库状态")
    print("3. 退出")
    
    while True:
        choice = input("\n请选择操作 (1-3): ")
        
        if choice == '1':
            generate_words()
        elif choice == '2':
            verify_database()
        elif choice == '3':
            print("退出程序...")
            break
        else:
            print("无效的选择，请重新输入")

def auto_run():
    """自动运行模式"""
    print("=== 自动运行模式 ===")
    print("1. 生成并导入词汇...")
    generate_words()
    print("\n2. 验证数据库状态...")
    verify_database()
    print("\n自动运行完成！")

if __name__ == '__main__':
    try:
        # 检查是否有命令行参数
        import sys
        if len(sys.argv) > 1 and sys.argv[1] == '--auto':
            auto_run()
        else:
            main()
    finally:
        db.close()
        print("数据库连接已关闭")
