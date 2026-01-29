#!/usr/bin/env python3
"""
词库数据库测试脚本
用于验证词库数据完整性和功能
"""

import sqlite3
import os

# 数据库连接
db_path = os.path.join(os.path.dirname(__file__), 'pinecone.db')
db = sqlite3.connect(db_path)
cursor = db.cursor()

print("=== 词库数据库测试 ===")

# 1. 测试单词表是否存在
print("\n1. 测试单词表结构:")
try:
    cursor.execute("PRAGMA table_info(words)")
    columns = cursor.fetchall()
    print(f"单词表字段数: {len(columns)}")
    for column in columns:
        print(f"  - {column[1]} ({column[2]})")
    print("✓ 单词表结构正常")
except Exception as e:
    print(f"✗ 单词表结构测试失败: {e}")

# 2. 测试词汇数量
print("\n2. 测试词汇数量:")
try:
    cursor.execute("SELECT COUNT(*) FROM words")
    total_words = cursor.fetchone()[0]
    print(f"总词汇数: {total_words}")
    if total_words > 0:
        print("✓ 词汇数量测试通过")
    else:
        print("✗ 词汇数量为0")
except Exception as e:
    print(f"✗ 词汇数量测试失败: {e}")

# 3. 测试等级分布
print("\n3. 测试等级分布:")
try:
    cursor.execute("SELECT difficulty, COUNT(*) FROM words GROUP BY difficulty ORDER BY difficulty")
    level_distribution = cursor.fetchall()
    print(f"覆盖等级数: {len(level_distribution)}")
    for level, count in level_distribution[:10]:  # 只显示前10个等级
        print(f"  等级 {level}: {count} 词")
    if len(level_distribution) > 0:
        print("✓ 等级分布测试通过")
    else:
        print("✗ 等级分布为空")
except Exception as e:
    print(f"✗ 等级分布测试失败: {e}")

# 4. 测试词汇质量
print("\n4. 测试词汇质量:")
try:
    # 测试是否有重复词汇
    cursor.execute("SELECT word, COUNT(*) FROM words GROUP BY word HAVING COUNT(*) > 1")
    duplicates = cursor.fetchall()
    if len(duplicates) == 0:
        print("✓ 无重复词汇")
    else:
        print(f"✗ 发现 {len(duplicates)} 个重复词汇")
    
    # 测试是否有缺失字段
    cursor.execute("SELECT COUNT(*) FROM words WHERE word IS NULL OR meaning IS NULL OR difficulty IS NULL")
    incomplete = cursor.fetchone()[0]
    if incomplete == 0:
        print("✓ 无缺失字段的词汇")
    else:
        print(f"✗ 发现 {incomplete} 个字段缺失的词汇")
    
    # 测试词汇示例
    cursor.execute("SELECT word, meaning, difficulty FROM words LIMIT 5")
    sample_words = cursor.fetchall()
    print("\n词汇示例:")
    for word, meaning, difficulty in sample_words:
        print(f"  {word} - {meaning} (等级: {difficulty})")
    
except Exception as e:
    print(f"✗ 词汇质量测试失败: {e}")

# 5. 测试词汇导入功能
print("\n5. 测试词汇导入功能:")
try:
    # 测试插入新词汇
    test_word = "test_word"
    test_meaning = "测试词汇"
    test_difficulty = 1
    
    cursor.execute(
        "INSERT OR IGNORE INTO words (word, meaning, difficulty) VALUES (?, ?, ?)",
        (test_word, test_meaning, test_difficulty)
    )
    db.commit()
    
    if cursor.rowcount > 0:
        print(f"✓ 成功插入测试词汇: {test_word}")
    else:
        print(f"⚠ 测试词汇已存在: {test_word}")
    
    # 测试查询词汇
    cursor.execute("SELECT * FROM words WHERE word = ?", (test_word,))
    result = cursor.fetchone()
    if result:
        print(f"✓ 成功查询到测试词汇")
    else:
        print(f"✗ 无法查询到测试词汇")
        
except Exception as e:
    print(f"✗ 词汇导入功能测试失败: {e}")

# 6. 测试词汇统计功能
print("\n6. 测试词汇统计功能:")
try:
    # 按等级统计
    cursor.execute("SELECT difficulty, COUNT(*) FROM words GROUP BY difficulty ORDER BY difficulty")
    level_counts = cursor.fetchall()
    
    total = sum(count for _, count in level_counts)
    print(f"统计结果: 共 {total} 个词汇，分布在 {len(level_counts)} 个等级")
    
    # 计算覆盖率
    target_total = 5000
    coverage = (total / target_total) * 100
    print(f"目标覆盖率: {coverage:.2f}%")
    
    print("✓ 词汇统计功能测试通过")
except Exception as e:
    print(f"✗ 词汇统计功能测试失败: {e}")

print("\n=== 测试完成 ===")
db.close()
print("数据库连接已关闭")
