#!/usr/bin/env python3
"""
下载并处理KyleBing/english-vocabulary开源词库
目标：提取CET4、CET6等单词并转换为标准格式
"""
import os
import json
import requests
import zipfile
import io

# 项目配置
OPEN_SOURCE_REPO = "KyleBing/english-vocabulary"
DOWNLOAD_URL = f"https://github.com/{OPEN_SOURCE_REPO}/archive/refs/heads/master.zip"
OUTPUT_DIR = "./data/level_words"

# 确保输出目录存在
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_repo():
    """下载GitHub仓库"""
    print(f"正在下载 {OPEN_SOURCE_REPO} 项目...")
    try:
        response = requests.get(DOWNLOAD_URL, timeout=30)
        if response.status_code == 200:
            # 检查响应头，确认是zip文件
            content_type = response.headers.get('Content-Type', '')
            if 'zip' in content_type:
                print("下载成功！")
                return response.content
            else:
                print(f"下载失败：返回的不是zip文件，Content-Type: {content_type}")
                # 打印前100个字符，查看返回的内容
                print(f"返回内容预览: {response.text[:100]}...")
                return None
        else:
            print(f"下载失败，状态码：{response.status_code}")
            print(f"响应内容: {response.text[:200]}...")
            return None
    except Exception as e:
        print(f"下载异常: {e}")
        return None

def extract_words(zip_content):
    """从压缩包中提取单词文件"""
    print("正在提取单词文件...")
    words_data = {
        "CET4": [],
        "CET6": []
    }
    
    with zipfile.ZipFile(io.BytesIO(zip_content)) as zf:
        # 遍历所有文件
        for file_info in zf.infolist():
            if file_info.filename.endswith('.txt') or file_info.filename.endswith('.json'):
                # 检查是否是四六级单词文件
                if 'cet4' in file_info.filename.lower():
                    print(f"找到CET4单词文件：{file_info.filename}")
                    with zf.open(file_info) as f:
                        content = f.read().decode('utf-8', errors='ignore')
                        words_data["CET4"].extend(parse_word_file(content, file_info.filename))
                elif 'cet6' in file_info.filename.lower():
                    print(f"找到CET6单词文件：{file_info.filename}")
                    with zf.open(file_info) as f:
                        content = f.read().decode('utf-8', errors='ignore')
                        words_data["CET6"].extend(parse_word_file(content, file_info.filename))
    
    return words_data

def parse_word_file(content, filename="unknown"):
    """解析单词文件内容"""
    words = []
    
    # 尝试解析为完整的JSON
    try:
        data = json.loads(content)
        if isinstance(data, list):
            # 打印前2个元素，查看实际结构
            if len(data) > 0:
                print(f"{filename}数组结构预览: {data[:2]}")
            # 数组格式：[{word1}, {word2}, ...]
            for item in data:
                if isinstance(item, dict):
                    # 打印键名，查看实际字段名
                    if len(words) < 2:
                        print(f"{filename}对象键名: {list(item.keys())}")
                    # 尝试不同的字段名
                    word_key = 'word' if 'word' in item else 'name' if 'name' in item else 'word_en' if 'word_en' in item else None
                    # 支持更多字段名
                    meaning_key = None
                    if 'meaning' in item:
                        meaning_key = 'meaning'
                    elif 'translation' in item:
                        meaning_key = 'translation'
                    elif 'translations' in item:
                        meaning_key = 'translations'
                    elif 'explain' in item:
                        meaning_key = 'explain'
                    elif 'definition' in item:
                        meaning_key = 'definition'
                    
                    if word_key and meaning_key:
                        word = item[word_key].strip()
                        
                        # 处理不同类型的meaning字段
                        meaning_value = item[meaning_key]
                        meaning = ''
                        
                        if meaning_key == 'translations' and isinstance(meaning_value, list):
                            # 特殊处理translations数组
                            for trans_item in meaning_value:
                                if isinstance(trans_item, dict) and 'translation' in trans_item:
                                    meaning = trans_item['translation'].strip()
                                    break
                                elif isinstance(trans_item, dict) and 'text' in trans_item:
                                    meaning = trans_item['text'].strip()
                                    break
                            # 如果还是空，尝试获取第一个元素的字符串表示
                            if not meaning and meaning_value:
                                meaning = str(meaning_value[0]).strip()
                        elif isinstance(meaning_value, list):
                            # 如果是其他数组，取第一个元素
                            meaning = meaning_value[0].strip() if meaning_value else ''
                        elif isinstance(meaning_value, dict):
                            # 如果是对象，尝试获取主要的翻译字段
                            meaning = meaning_value.get('text', '').strip() or meaning_value.get('value', '').strip() or meaning_value.get('translation', '').strip() or ''
                        else:
                            # 字符串直接使用
                            meaning = str(meaning_value).strip()
                        
                        if word and meaning:
                            words.append({
                                "word": word,
                                "meaning": meaning,
                                "phonetic": item.get('phonetic', '') or item.get('pronunciation', '') or item.get('us', '') or item.get('uk', '') or '',
                                "level": ""
                            })
                        elif word:
                            # 打印缺少meaning的单词，用于调试
                            if len(words) < 5:
                                print(f"缺少meaning的单词: {word}, 字段: {meaning_key}, 值: {meaning_value}")
            print(f"解析{filename}为JSON数组，成功解析{len(words)}个单词")
        elif isinstance(data, dict):
            # 对象格式：{"words": [{word1}, {word2}, ...]}
            word_list = data.get('words', [])
            if isinstance(word_list, list):
                for item in word_list:
                    if isinstance(item, dict) and 'word' in item:
                        word = item['word'].strip()
                        meaning = item.get('meaning', '').strip()
                        if word and meaning:
                            words.append({
                                "word": word,
                                "meaning": meaning,
                                "phonetic": item.get('phonetic', ''),
                                "level": ""
                            })
            print(f"解析{filename}为JSON对象，成功解析{len(words)}个单词")
    except Exception as e:
        # JSON解析失败，尝试逐行解析
        print(f"JSON解析失败：{e}，尝试逐行解析{filename}")
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            # 简单解析：假设格式为 "单词 释义"
            parts = line.split(' ', 1)
            if len(parts) >= 2:
                word = parts[0].strip()
                meaning = parts[1].strip()
                if word and meaning:
                    words.append({
                        "word": word,
                        "meaning": meaning,
                        "phonetic": "",
                        "level": ""
                    })
        print(f"逐行解析{filename}，成功解析{len(words)}个单词")
    
    return words

def save_to_json(words_data):
    """保存为标准JSON格式"""
    for level, words in words_data.items():
        if words:
            output_file = os.path.join(OUTPUT_DIR, f"{level}_all.json")
            # 读取现有内容
            existing_words = []
            if os.path.exists(output_file):
                with open(output_file, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                    existing_words = existing_data.get('words', [])
            
            # 合并并去重
            existing_word_set = set(w['word'] for w in existing_words)
            new_words = []
            for word in words:
                if word['word'] not in existing_word_set:
                    word['level'] = level
                    new_words.append(word)
                    existing_word_set.add(word['word'])
            
            # 合并所有单词
            all_words = existing_words + new_words
            
            # 保存
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"words": all_words}, f, ensure_ascii=False, indent=2)
            
            print(f"{level}级别：现有{len(existing_words)}个单词，新增{len(new_words)}个单词，总计{len(all_words)}个单词")
            # 调试信息：显示前5个新单词
            if new_words:
                print(f"前5个新单词：{new_words[:5]}")

def main():
    """主函数"""
    print("=== 下载并处理开源词库 ===")
    
    # 下载仓库
    zip_content = download_repo()
    if not zip_content:
        return
    
    # 提取单词
    words_data = extract_words(zip_content)
    
    # 保存为标准格式
    save_to_json(words_data)
    
    print("\n=== 处理完成 ===")
    print("请运行 import_level_words.py 导入新单词到数据库")

if __name__ == "__main__":
    main()
