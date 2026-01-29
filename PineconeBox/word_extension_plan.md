# 词库扩展方案

## 1. 目标
- 配置词库到5000词
- 以RAZ教材和KET PET词汇为主要抓取对象
- 寻找开放版权的美英小学教材资源

## 2. 现有词库结构
```sql
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT UNIQUE NOT NULL,
  meaning TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 3. 等级划分方案

### 3.1 等级结构（共30个等级）
- **等级1-5**：RAZ早期级别（AA-C），基础词汇，约500词
- **等级6-10**：RAZ中级级别（D-J），进阶词汇，约750词
- **等级11-15**：RAZ高级级别（K-O），高级词汇，约750词
- **等级16-20**：RAZ专家级别（P-Z2），专家词汇，约1000词
- **等级21-25**：KET词汇，考试核心词汇，约1000词
- **等级26-30**：PET词汇，考试扩展词汇，约1000词

### 3.2 词汇分布
| 等级范围 | 词汇数量 | 词汇来源 | 难度级别 |
|---------|---------|---------|----------|
| 1-5     | 500     | RAZ AA-C | 基础     |
| 6-10    | 750     | RAZ D-J  | 进阶     |
| 11-15   | 750     | RAZ K-O  | 高级     |
| 16-20   | 1000    | RAZ P-Z2 | 专家     |
| 21-25   | 1000    | KET      | 考试核心 |
| 26-30   | 1000    | PET      | 考试扩展 |
| **总计** | **5000** |          |          |

## 4. 词汇分类

### 4.1 基础词汇（等级1-5）
- 日常用品：apple, banana, cat, dog等
- 动物：elephant, fish, goat, horse等
- 颜色：red, blue, green, yellow等
- 数字：one, two, three, four等
- 家庭成员：father, mother, brother, sister等

### 4.2 进阶词汇（等级6-10）
- 职业：teacher, doctor, nurse, engineer等
- 学校用品：pencil, book, ruler, eraser等
- 食物：bread, milk, cheese, egg等
- 交通工具：car, bus, train, plane等
- 天气：sunny, rainy, cloudy, snowy等

### 4.3 高级词汇（等级11-15）
- 科学：science, biology, chemistry, physics等
- 社会：society, community, culture, tradition等
- 文化：art, music, literature, history等
- 自然：nature, environment, ecosystem, climate等
- 技术：technology, computer, internet, digital等

### 4.4 专家词汇（等级16-20）
- 学术：academic, research, study, analyze等
- 专业：professional, expertise, skill, knowledge等
- 抽象：abstract, concept, theory, principle等
- 复杂：complex, sophisticated, advanced, comprehensive等

### 4.5 KET词汇（等级21-25）
- 考试核心词汇
- 常用动词短语
- 固定搭配
- 同义词辨析

### 4.6 PET词汇（等级26-30）
- 考试扩展词汇
- 学术词汇
- 高级动词短语
- 复杂句型相关词汇

## 5. 词汇来源

### 5.1 主要来源
1. **RAZ教材词汇**：
   - RAZ AA-C：基础词汇
   - RAZ D-J：进阶词汇
   - RAZ K-O：高级词汇
   - RAZ P-Z2：专家词汇

2. **KET PET词汇**：
   - KET官方词汇表
   - PET官方词汇表

3. **开放版权资源**：
   - 美英小学教材（开放版权）
   - 公共领域词汇表
   - 教育部门发布的词汇标准

### 5.2 资源获取方式
- 网络搜索开放版权教材
- 利用教育资源平台
- 参考公开的词汇数据库
- 与教育机构合作获取资源

## 6. 实现方案

### 6.1 词汇导入脚本
- 创建Python脚本抓取和处理词汇
- 支持批量导入到SQLite数据库
- 确保词汇的唯一性和准确性
- 提供词汇验证和纠错功能

### 6.2 数据处理流程
1. 收集词汇资源
2. 清洗和标准化词汇
3. 分配难度等级
4. 批量导入数据库
5. 验证数据完整性

### 6.3 质量控制
- 词汇拼写检查
- 词义准确性验证
- 难度等级合理性评估
- 词汇覆盖度分析

## 7. 预期成果
- 5000词的完整词库
- 覆盖RAZ教材和KET PET词汇体系
- 合理的等级划分和词汇分类
- 高质量的词汇数据

## 8. 后续维护
- 定期更新词汇库
- 补充新的教育资源词汇
- 优化词汇难度等级
- 提供词汇使用分析报告
