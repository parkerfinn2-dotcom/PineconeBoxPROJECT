import json
import os

# 验证所有JSON文件
files = [f for f in os.listdir('.') if f.endswith('.json')]

for file in files:
    print(f'Checking {file}...')
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f'{file}: OK')
        # 检查是否包含words字段
        if 'words' in data:
            print(f'{file}: Contains {len(data["words"])} words')
        else:
            print(f'{file}: WARNING - No words field')
    except Exception as e:
        print(f'{file}: ERROR - {e}')
