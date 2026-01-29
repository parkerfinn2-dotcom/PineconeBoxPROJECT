# 🪼 Unity 水母项目｜AI 小白友好说明书

## 🎯 项目简介

这是一个在 Unity 中创建会发光的水母世界的项目。水母可以：
- 从 JSON 文件中读取数据
- 自动生成
- 白天暗一点，晚上亮一点
- 看起来透明、柔软、会发光

## 📁 文件夹结构

```
Assets
├── Scripts
│   ├── JellyfishDatabase.cs       # 水母资料管理员（查水母、生成水母）
│   ├── JellyfishMaterial.cs        # 控制水母亮不亮、颜色变化
│   └── DayNightCycle.cs            # 控制白天 / 夜晚
├── Shaders
│   └── JellyfishTransparent.shader # 决定水母“透明 + 发光”的样子
└── StreamingAssets
    └── jellyfish.json              # 水母百科全书（写着有哪些水母）
```

## 🚀 快速开始

### 第 1 步：创建 Unity 项目
1. 打开 **Unity Hub**
2. 点击 **Add**
3. 选择本项目文件夹 `JellyfishWorld`
4. 点击 **Open**

### 第 2 步：创建水母材质
1. 在 Unity 左下角 **Project 面板**中
2. 右键 → Create → Material
3. 重命名：`JellyfishMaterial`
4. 选中材质，在 Inspector 中：
   - Shader → Custom → JellyfishTransparent

### 推荐参数
- Opacity：`0.8`
- Emission Strength：`1.0`
- Rim Power：`3.0`
- 颜色选淡蓝色即可

### 第 3 步：搭建场景结构
1. **创建总控制物体**：
   - Hierarchy 面板右键 → Create Empty
   - 改名为：`GameManager`

2. **给 GameManager 添加组件**：
   - 选中 GameManager → Inspector → Add Component
   - 添加：`JellyfishDatabase`
   - 添加：`DayNightCycle`

3. **设置 JellyfishDatabase**：
   - Json File Name：`jellyfish.json`
   - Load From Streaming Assets：✅
   - Show Debug Info：✅

4. **设置 DayNightCycle**：
   - Directional Light：拖入场景主光
   - Auto Find Directional Light：✅
   - Enable Auto Time：✅
   - Cycle Duration：`120`

### 第 4 步：创建水母物体
1. Hierarchy 面板右键 → 3D Object → Sphere
2. 改名：`Jellyfish`
3. 选中 Jellyfish → Add Component：`JellyfishMaterial`
4. 在组件中：
   - Jellyfish Material：拖入你创建的材质
   - Allow Runtime Update：✅

### 第 5 步：运行项目
点击 ▶️ **Play**

如果你看到：
- 水母是透明的
- 夜晚更亮，白天更暗
- 水母会随时间自动调整发光强度

🎉 **说明项目已经成功运行**

## 📝 自定义水母

### 修改水母数据
打开 `Assets/StreamingAssets/jellyfish.json` 文件，你可以：

1. **添加新水母**：在 `jellyfishes` 数组中添加新的水母对象
2. **修改现有水母**：调整现有水母的属性

### 水母属性说明

| 属性 | 类型 | 描述 |
|------|------|------|
| name | string | 水母唯一标识符（英文） |
| displayName | string | 水母显示名称（中文） |
| size | float | 水母大小 |
| color | [float, float, float] | 水母颜色（RGB，0-1） |
| glowIntensity | float | 发光强度（0-1） |
| transparency | float | 透明度（0-1） |
| speed | float | 移动速度 |
| description | string | 水母描述 |

## 🎨 自定义材质

### 材质参数说明

| 参数 | 范围 | 描述 |
|------|------|------|
| Color | Color | 水母基础颜色 |
| Opacity | 0-1 | 整体透明度 |
| Emission Strength | 0-5 | 发光强度 |
| Rim Power | 0.5-10 | 边缘光强度 |
| Rim Color | Color | 边缘光颜色 |

## 🌞 昼夜循环

### 循环设置

| 设置 | 描述 |
|------|------|
| Cycle Duration | 昼夜循环 duration（秒） |
| Enable Auto Time | 是否自动运行时间 |
| Time Of Day | 当前时间（0=午夜，0.5=中午，1=午夜） |

## 🤖 技术说明

### 核心脚本功能

1. **JellyfishDatabase.cs**：
   - 从 JSON 文件读取水母数据
   - 管理水母数据字典
   - 提供创建水母的方法

2. **JellyfishMaterial.cs**：
   - 应用水母数据到材质
   - 根据时间调整发光强度
   - 管理材质属性

3. **DayNightCycle.cs**：
   - 控制定向光的角度、强度和颜色
   - 自动运行昼夜循环
   - 通知所有水母调整发光强度

### Shader 功能

**JellyfishTransparent.shader**：
- 透明效果
- 边缘光效果
- 自发光效果
- 响应材质参数变化

## 💡 提示与技巧

1. **性能优化**：
   - 不要同时生成太多水母
   - 调整材质复杂度

2. **视觉效果**：
   - 尝试不同的颜色组合
   - 调整发光强度获得不同效果
   - 改变昼夜循环速度

3. **扩展功能**：
   - 添加水母动画
   - 实现水母移动逻辑
   - 添加碰撞检测

## 🎮 示例场景

项目包含所有必要的文件，你只需要按照 **快速开始** 步骤设置即可运行。

## 📄 许可证

本项目为学习目的创建，可自由修改和使用。

## 🪼 完成

祝你在 Unity 水母世界中玩得开心！
