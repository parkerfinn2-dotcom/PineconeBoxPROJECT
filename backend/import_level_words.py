#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
词汇导入工具 - 从 level_words 目录导入各级别词汇到数据库
"""

import json
import os
import sqlite3

# 数据库路径
DB_PATH = './pinecone.db'

# 词汇文件目录
LEVEL_WORDS_DIR = './data/level_words'

# 难度级别映射
LEVEL_DIFFICULTY_MAP = {
    'MINI': 1,         # 幼儿
    'PRIMARY': 2,      # 小学
    'KET': 3,          # KET
    'PET': 4,          # PET
    'FCE': 5,          # FCE
    'MIDDLE': 6,       # 初中
    'HIGH': 7,         # 高中
    'CET4': 8,         # 四级
    'CET6': 9,         # 六级
    'TOEFL': 10,       # 托福
    'IELTS': 11,       # 雅思
    'GRE': 12          # GRE
}

def get_difficulty_from_level(level):
    """
    根据级别获取难度值
    """
    return LEVEL_DIFFICULTY_MAP.get(level.upper(), 1)

def import_words_from_file(file_path, level):
    """
    从单个 JSON 文件导入词汇
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        words = data.get('words', [])
        print(f"从 {file_path} 中读取到 {len(words)} 个单词")
        
        return words
    except Exception as e:
        print(f"读取文件 {file_path} 失败: {e}")
        return []

def import_all_level_words():
    """
    导入所有级别的词汇
    """
    # 连接数据库
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 遍历词汇文件目录
        for filename in os.listdir(LEVEL_WORDS_DIR):
            if filename.endswith('.json'):
                # 从文件名提取级别
                level_name = filename.split('_all.json')[0]
                file_path = os.path.join(LEVEL_WORDS_DIR, filename)
                
                print(f"\n正在导入 {level_name} 级别的词汇...")
                
                # 导入词汇
                words = import_words_from_file(file_path, level_name)
                
                # 插入到数据库
                inserted_count = 0
                skipped_count = 0
                
                for word_data in words:
                    word = word_data.get('word', '').strip()
                    meaning = word_data.get('meaning', '').strip()
                    phonetic = word_data.get('phonetic', '').strip()
                    level = word_data.get('level', level_name).strip()
                    
                    if not word or not meaning:
                        skipped_count += 1
                        # 每1000个单词打印一次调试信息
                        if skipped_count % 1000 == 0:
                            print(f"跳过单词 (空字段): {word} - {meaning}")
                        continue
                    
                    # 获取难度值
                    difficulty = get_difficulty_from_level(level)
                    
                    try:
                        # 插入单词，忽略重复
                        cursor.execute(
                            '''INSERT OR IGNORE INTO words 
                            (word, meaning, phonetic, level, difficulty) 
                            VALUES (?, ?, ?, ?, ?)''',
                            (word, meaning, phonetic, level, difficulty)
                        )
                        inserted_count += 1
                        # 每1000个单词打印一次调试信息
                        if inserted_count % 1000 == 0:
                            print(f"成功插入第{inserted_count}个单词: {word} - {meaning}")
                    except Exception as e:
                        print(f"插入单词 '{word}' 失败: {e}")
                        skipped_count += 1
                
                # 提交事务
                conn.commit()
                
                print(f"导入完成: 成功 {inserted_count} 个, 跳过 {skipped_count} 个")
        
        print("\n所有级别词汇导入完成！")
        
    except Exception as e:
        print(f"导入过程出错: {e}")
        conn.rollback()
    finally:
        conn.close()

def count_words_by_level():
    """
    统计各级别词汇数量
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        print("\n词汇级别分布统计:")
        cursor.execute('''SELECT level, COUNT(*) as count 
                        FROM words 
                        GROUP BY level 
                        ORDER BY MIN(difficulty)''')
        
        total = 0
        for row in cursor.fetchall():
            level, count = row
            total += count
            print(f"{level}: {count} 个单词")
        
        print(f"总计: {total} 个单词")
        
    except Exception as e:
        print(f"统计出错: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    print("词汇导入工具")
    print("=" * 50)
    
    # 导入词汇
    import_all_level_words()
    
    # 统计词汇
    count_words_by_level()
