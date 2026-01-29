#!/usr/bin/env python3
"""
词汇导入脚本
用于将词汇批量导入到SQLite数据库中
支持从CSV文件导入词汇，自动分配难度等级
"""

import sqlite3
import csv
import json
import os

# 数据库连接
db_path = os.path.join(os.path.dirname(__file__), 'pinecone.db')
db = sqlite3.connect(db_path)
cursor = db.cursor()

# 词汇等级配置
LEVEL_CONFIG = {
    'raz_aa_c': {'levels': range(1, 6), 'word_count': 500, 'description': 'RAZ早期级别（AA-C）基础词汇'},
    'raz_d_j': {'levels': range(6, 11), 'word_count': 750, 'description': 'RAZ中级级别（D-J）进阶词汇'},
    'raz_k_o': {'levels': range(11, 16), 'word_count': 750, 'description': 'RAZ高级级别（K-O）高级词汇'},
    'raz_p_z2': {'levels': range(16, 21), 'word_count': 1000, 'description': 'RAZ专家级别（P-Z2）专家词汇'},
    'ket': {'levels': range(21, 26), 'word_count': 1000, 'description': 'KET词汇考试核心词汇'},
    'pet': {'levels': range(26, 31), 'word_count': 1000, 'description': 'PET词汇考试扩展词汇'}
}

# 基础词汇表（示例）
BASIC_VOCABULARY = [
    # RAZ AA-C 基础词汇（等级1-5）
    {'word': 'apple', 'meaning': '苹果', 'category': '日常用品', 'source': 'raz_aa_c'},
    {'word': 'banana', 'meaning': '香蕉', 'category': '日常用品', 'source': 'raz_aa_c'},
    {'word': 'cat', 'meaning': '猫', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'dog', 'meaning': '狗', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'elephant', 'meaning': '大象', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'fish', 'meaning': '鱼', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'goat', 'meaning': '山羊', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'horse', 'meaning': '马', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'ice cream', 'meaning': '冰淇淋', 'category': '食物', 'source': 'raz_aa_c'},
    {'word': 'juice', 'meaning': '果汁', 'category': '食物', 'source': 'raz_aa_c'},
    {'word': 'kite', 'meaning': '风筝', 'category': '玩具', 'source': 'raz_aa_c'},
    {'word': 'lion', 'meaning': '狮子', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'monkey', 'meaning': '猴子', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'nest', 'meaning': '鸟巢', 'category': '自然', 'source': 'raz_aa_c'},
    {'word': 'orange', 'meaning': '橙子', 'category': '日常用品', 'source': 'raz_aa_c'},
    {'word': 'pencil', 'meaning': '铅笔', 'category': '学习用品', 'source': 'raz_aa_c'},
    {'word': 'queen', 'meaning': '女王', 'category': '人物', 'source': 'raz_aa_c'},
    {'word': 'rabbit', 'meaning': '兔子', 'category': '动物', 'source': 'raz_aa_c'},
    {'word': 'sun', 'meaning': '太阳', 'category': '自然', 'source': 'raz_aa_c'},
    {'word': 'tree', 'meaning': '树', 'category': '自然', 'source': 'raz_aa_c'},
    {'word': 'red', 'meaning': '红色', 'category': '颜色', 'source': 'raz_aa_c'},
    {'word': 'blue', 'meaning': '蓝色', 'category': '颜色', 'source': 'raz_aa_c'},
    {'word': 'green', 'meaning': '绿色', 'category': '颜色', 'source': 'raz_aa_c'},
    {'word': 'yellow', 'meaning': '黄色', 'category': '颜色', 'source': 'raz_aa_c'},
    {'word': 'one', 'meaning': '一', 'category': '数字', 'source': 'raz_aa_c'},
    {'word': 'two', 'meaning': '二', 'category': '数字', 'source': 'raz_aa_c'},
    {'word': 'three', 'meaning': '三', 'category': '数字', 'source': 'raz_aa_c'},
    {'word': 'four', 'meaning': '四', 'category': '数字', 'source': 'raz_aa_c'},
    {'word': 'five', 'meaning': '五', 'category': '数字', 'source': 'raz_aa_c'},
    {'word': 'father', 'meaning': '父亲', 'category': '家庭成员', 'source': 'raz_aa_c'},
    {'word': 'mother', 'meaning': '母亲', 'category': '家庭成员', 'source': 'raz_aa_c'},
    {'word': 'brother', 'meaning': '兄弟', 'category': '家庭成员', 'source': 'raz_aa_c'},
    {'word': 'sister', 'meaning': '姐妹', 'category': '家庭成员', 'source': 'raz_aa_c'},
    
    # RAZ D-J 进阶词汇（等级6-10）
    {'word': 'teacher', 'meaning': '老师', 'category': '职业', 'source': 'raz_d_j'},
    {'word': 'doctor', 'meaning': '医生', 'category': '职业', 'source': 'raz_d_j'},
    {'word': 'nurse', 'meaning': '护士', 'category': '职业', 'source': 'raz_d_j'},
    {'word': 'engineer', 'meaning': '工程师', 'category': '职业', 'source': 'raz_d_j'},
    {'word': 'book', 'meaning': '书', 'category': '学习用品', 'source': 'raz_d_j'},
    {'word': 'ruler', 'meaning': '尺子', 'category': '学习用品', 'source': 'raz_d_j'},
    {'word': 'eraser', 'meaning': '橡皮擦', 'category': '学习用品', 'source': 'raz_d_j'},
    {'word': 'bread', 'meaning': '面包', 'category': '食物', 'source': 'raz_d_j'},
    {'word': 'milk', 'meaning': '牛奶', 'category': '食物', 'source': 'raz_d_j'},
    {'word': 'cheese', 'meaning': '奶酪', 'category': '食物', 'source': 'raz_d_j'},
    {'word': 'egg', 'meaning': '鸡蛋', 'category': '食物', 'source': 'raz_d_j'},
    {'word': 'car', 'meaning': '汽车', 'category': '交通工具', 'source': 'raz_d_j'},
    {'word': 'bus', 'meaning': '公交车', 'category': '交通工具', 'source': 'raz_d_j'},
    {'word': 'train', 'meaning': '火车', 'category': '交通工具', 'source': 'raz_d_j'},
    {'word': 'plane', 'meaning': '飞机', 'category': '交通工具', 'source': 'raz_d_j'},
    {'word': 'sunny', 'meaning': '晴朗的', 'category': '天气', 'source': 'raz_d_j'},
    {'word': 'rainy', 'meaning': '下雨的', 'category': '天气', 'source': 'raz_d_j'},
    {'word': 'cloudy', 'meaning': '多云的', 'category': '天气', 'source': 'raz_d_j'},
    {'word': 'snowy', 'meaning': '下雪的', 'category': '天气', 'source': 'raz_d_j'},
    
    # RAZ K-O 高级词汇（等级11-15）
    {'word': 'science', 'meaning': '科学', 'category': '学科', 'source': 'raz_k_o'},
    {'word': 'biology', 'meaning': '生物学', 'category': '学科', 'source': 'raz_k_o'},
    {'word': 'chemistry', 'meaning': '化学', 'category': '学科', 'source': 'raz_k_o'},
    {'word': 'physics', 'meaning': '物理学', 'category': '学科', 'source': 'raz_k_o'},
    {'word': 'society', 'meaning': '社会', 'category': '社会', 'source': 'raz_k_o'},
    {'word': 'community', 'meaning': '社区', 'category': '社会', 'source': 'raz_k_o'},
    {'word': 'culture', 'meaning': '文化', 'category': '社会', 'source': 'raz_k_o'},
    {'word': 'tradition', 'meaning': '传统', 'category': '社会', 'source': 'raz_k_o'},
    {'word': 'art', 'meaning': '艺术', 'category': '文化', 'source': 'raz_k_o'},
    {'word': 'music', 'meaning': '音乐', 'category': '文化', 'source': 'raz_k_o'},
    {'word': 'literature', 'meaning': '文学', 'category': '文化', 'source': 'raz_k_o'},
    {'word': 'history', 'meaning': '历史', 'category': '文化', 'source': 'raz_k_o'},
    {'word': 'nature', 'meaning': '自然', 'category': '自然', 'source': 'raz_k_o'},
    {'word': 'environment', 'meaning': '环境', 'category': '自然', 'source': 'raz_k_o'},
    {'word': 'ecosystem', 'meaning': '生态系统', 'category': '自然', 'source': 'raz_k_o'},
    {'word': 'climate', 'meaning': '气候', 'category': '自然', 'source': 'raz_k_o'},
    {'word': 'technology', 'meaning': '技术', 'category': '技术', 'source': 'raz_k_o'},
    {'word': 'computer', 'meaning': '电脑', 'category': '技术', 'source': 'raz_k_o'},
    {'word': 'internet', 'meaning': '互联网', 'category': '技术', 'source': 'raz_k_o'},
    {'word': 'digital', 'meaning': '数字的', 'category': '技术', 'source': 'raz_k_o'},
    
    # RAZ P-Z2 专家词汇（等级16-20）
    {'word': 'academic', 'meaning': '学术的', 'category': '学术', 'source': 'raz_p_z2'},
    {'word': 'research', 'meaning': '研究', 'category': '学术', 'source': 'raz_p_z2'},
    {'word': 'study', 'meaning': '学习', 'category': '学术', 'source': 'raz_p_z2'},
    {'word': 'analyze', 'meaning': '分析', 'category': '学术', 'source': 'raz_p_z2'},
    {'word': 'professional', 'meaning': '专业的', 'category': '专业', 'source': 'raz_p_z2'},
    {'word': 'expertise', 'meaning': '专业知识', 'category': '专业', 'source': 'raz_p_z2'},
    {'word': 'skill', 'meaning': '技能', 'category': '专业', 'source': 'raz_p_z2'},
    {'word': 'knowledge', 'meaning': '知识', 'category': '专业', 'source': 'raz_p_z2'},
    {'word': 'abstract', 'meaning': '抽象的', 'category': '抽象', 'source': 'raz_p_z2'},
    {'word': 'concept', 'meaning': '概念', 'category': '抽象', 'source': 'raz_p_z2'},
    {'word': 'theory', 'meaning': '理论', 'category': '抽象', 'source': 'raz_p_z2'},
    {'word': 'principle', 'meaning': '原则', 'category': '抽象', 'source': 'raz_p_z2'},
    {'word': 'complex', 'meaning': '复杂的', 'category': '复杂', 'source': 'raz_p_z2'},
    {'word': 'sophisticated', 'meaning': '复杂的', 'category': '复杂', 'source': 'raz_p_z2'},
    {'word': 'advanced', 'meaning': '高级的', 'category': '复杂', 'source': 'raz_p_z2'},
    {'word': 'comprehensive', 'meaning': '全面的', 'category': '复杂', 'source': 'raz_p_z2'},
    
    # KET 考试核心词汇（等级21-25）
    {'word': 'vocabulary', 'meaning': '词汇', 'category': '考试核心', 'source': 'ket'},
    {'word': 'grammar', 'meaning': '语法', 'category': '考试核心', 'source': 'ket'},
    {'word': 'reading', 'meaning': '阅读', 'category': '考试核心', 'source': 'ket'},
    {'word': 'writing', 'meaning': '写作', 'category': '考试核心', 'source': 'ket'},
    {'word': 'listening', 'meaning': '听力', 'category': '考试核心', 'source': 'ket'},
    {'word': 'speaking', 'meaning': '口语', 'category': '考试核心', 'source': 'ket'},
    {'word': 'spelling', 'meaning': '拼写', 'category': '考试核心', 'source': 'ket'},
    {'word': 'pronunciation', 'meaning': '发音', 'category': '考试核心', 'source': 'ket'},
    {'word': 'dictation', 'meaning': '听写', 'category': '考试核心', 'source': 'ket'},
    {'word': 'translation', 'meaning': '翻译', 'category': '考试核心', 'source': 'ket'},
    
    # PET 考试扩展词汇（等级26-30）
    {'word': 'academic', 'meaning': '学术的', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'syllabus', 'meaning': '教学大纲', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'curriculum', 'meaning': '课程', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'assessment', 'meaning': '评估', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'evaluation', 'meaning': '评价', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'achievement', 'meaning': '成就', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'proficiency', 'meaning': '熟练程度', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'fluency', 'meaning': '流利度', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'accuracy', 'meaning': '准确性', 'category': '考试扩展', 'source': 'pet'},
    {'word': 'comprehension', 'meaning': '理解', 'category': '考试扩展', 'source': 'pet'}
]

def create_words_table():
    """创建单词表（如果不存在）"""
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT UNIQUE NOT NULL,
        meaning TEXT NOT NULL,
        difficulty INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    db.commit()
    print("单词表检查完成")

def import_words_from_list(word_list):
    """从单词列表导入词汇"""
    total_imported = 0
    total_skipped = 0
    
    for word_data in word_list:
        word = word_data['word']
        meaning = word_data['meaning']
        source = word_data['source']
        
        # 计算难度等级
        level_config = LEVEL_CONFIG.get(source)
        if not level_config:
            print(f"未知的词汇来源: {source}")
            total_skipped += 1
            continue
        
        # 简单的等级分配（实际应用中应该更复杂）
        level = level_config['levels'][0]  # 暂时使用每个范围的第一个等级
        
        try:
            # 插入单词
            cursor.execute(
                "INSERT OR IGNORE INTO words (word, meaning, difficulty) VALUES (?, ?, ?)",
                (word, meaning, level)
            )
            
            if cursor.rowcount > 0:
                total_imported += 1
                if total_imported % 100 == 0:
                    print(f"已导入 {total_imported} 个单词...")
            else:
                total_skipped += 1
                if total_skipped % 100 == 0:
                    print(f"跳过 {total_skipped} 个重复单词...")
                    
        except Exception as e:
            print(f"导入单词 {word} 时出错: {e}")
            total_skipped += 1
    
    db.commit()
    print(f"\n导入完成！")
    print(f"成功导入: {total_imported} 个单词")
    print(f"跳过: {total_skipped} 个单词（重复或错误）")

def import_words_from_csv(csv_file):
    """从CSV文件导入词汇"""
    word_list = []
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                word_data = {
                    'word': row.get('word', '').strip(),
                    'meaning': row.get('meaning', '').strip(),
                    'category': row.get('category', '').strip(),
                    'source': row.get('source', '').strip()
                }
                if word_data['word'] and word_data['meaning']:
                    word_list.append(word_data)
        
        print(f"从CSV文件读取了 {len(word_list)} 个单词")
        import_words_from_list(word_list)
        
    except Exception as e:
        print(f"读取CSV文件时出错: {e}")

def generate_sample_csv(output_file):
    """生成示例CSV文件"""
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['word', 'meaning', 'category', 'source']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for word_data in BASIC_VOCABULARY:
            writer.writerow(word_data)
    
    print(f"示例CSV文件已生成: {output_file}")

def count_words():
    """统计数据库中的单词数量"""
    cursor.execute("SELECT COUNT(*) FROM words")
    total = cursor.fetchone()[0]
    
    print(f"\n数据库单词统计:")
    print(f"总单词数: {total}")
    
    # 按难度等级统计
    cursor.execute("SELECT difficulty, COUNT(*) FROM words GROUP BY difficulty ORDER BY difficulty")
    level_counts = cursor.fetchall()
    
    print("\n按难度等级统计:")
    for level, count in level_counts:
        print(f"等级 {level}: {count} 个单词")

def auto_import():
    """自动导入模式"""
    print("=== 自动导入模式 ===")
    
    # 1. 创建单词表
    print("1. 创建单词表...")
    create_words_table()
    
    # 2. 从示例列表导入词汇
    print("2. 从示例列表导入词汇...")
    import_words_from_list(BASIC_VOCABULARY)
    
    # 3. 统计单词数量
    print("3. 统计单词数量...")
    count_words()
    
    print("\n自动导入完成！")

def main():
    """主函数"""
    print("=== 词汇导入工具 ===")
    print("1. 创建单词表")
    print("2. 从示例列表导入词汇")
    print("3. 从CSV文件导入词汇")
    print("4. 生成示例CSV文件")
    print("5. 统计单词数量")
    print("6. 自动导入模式")
    print("7. 退出")
    
    while True:
        choice = input("\n请选择操作 (1-7): ")
        
        if choice == '1':
            create_words_table()
        elif choice == '2':
            import_words_from_list(BASIC_VOCABULARY)
        elif choice == '3':
            csv_file = input("请输入CSV文件路径: ")
            if os.path.exists(csv_file):
                import_words_from_csv(csv_file)
            else:
                print(f"文件不存在: {csv_file}")
        elif choice == '4':
            output_file = input("请输入输出CSV文件路径: ")
            generate_sample_csv(output_file)
        elif choice == '5':
            count_words()
        elif choice == '6':
            auto_import()
        elif choice == '7':
            print("退出程序...")
            break
        else:
            print("无效的选择，请重新输入")

if __name__ == '__main__':
    try:
        # 检查是否有命令行参数
        import sys
        if len(sys.argv) > 1 and sys.argv[1] == '--auto':
            auto_import()
        else:
            main()
    finally:
        db.close()
        print("数据库连接已关闭")
