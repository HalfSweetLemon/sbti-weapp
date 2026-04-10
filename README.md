# SBTI 人格测试微信小程序

> 原始内容作者：B 站 `@蛆肉儿串儿`
>
> 本项目是将其相关测试内容与页面体验迁移为原生微信小程序的实现版本，仅对小程序工程化结构、页面组织和交互方式进行了适配。

项目主要包含以下页面流程：
1. 首页：进入测试或继续上次未完成的测试
2. 测试页：逐题作答，实时展示进度
3. 结果页：展示最终人格类型、简要解读和 15 维评分

## 功能

- 原生微信小程序实现
- 三个独立页面：首页、测试页、结果页
- 支持答题进度展示与断点续答
- 支持特殊题逻辑与隐藏人格分支
- 支持 15 个维度评分、匹配度计算与结果展示
- 结果页展示人格图片、结果文案与维度评分卡片
- 提供本地校验测试


## 项目结构

```text
.
├── app.js
├── app.json
├── app.wxss
├── assets/
│   └── images/types/
├── components/
│   ├── progress-bar/
│   └── score-card/
├── data/
│   ├── dimensions.js
│   ├── questions.js
│   └── types.js
├── pages/
│   ├── home/
│   ├── result/
│   └── test/
├── tools/
│   └── *.test.js
├── utils/
│   ├── scoring.js
│   └── storage.js
├── package.json
├── project.config.json
└── sitemap.json
```

## 核心模块

### `pages/`

- `pages/home/`：首页入口，负责开始测试和恢复历史会话
- `pages/test/`：测试流程页，负责题目渲染、答案更新、提交结果
- `pages/result/`：结果展示页，负责显示人格类型、描述和维度评分

### `components/`

- `progress-bar/`：测试页进度条组件
- `score-card/`：结果页维度评分卡片组件

### `data/`

- `questions.js`：题库与特殊题定义
- `dimensions.js`：15 维度元数据
- `types.js`：人格类型库、类型图片与维度说明

### `utils/`

- `scoring.js`：测试会话生成、题目可见性、分数计算、结果匹配
- `storage.js`：基于微信同步存储的测试会话与结果读写

### `tools/`

- 使用 Node 原生测试能力验证页面结构、数据完整性、评分逻辑、样式钩子和存储行为


## 快速上手

### 安装

项目没有运行时第三方依赖，克隆后即可直接使用。

```bash
git clone https://github.com/HalfSweetLemon/sbti-weapp.git
cd sbti-weapp
```

如需运行测试：

```bash
npm install
```

> 说明：当前 `package.json` 仅用于统一测试脚本，不依赖额外 npm 包。

### 使用微信开发者工具运行

1. 打开微信开发者工具
2. 选择“导入项目”
3. 项目目录选择当前仓库根目录
4. `AppID` 可填写你自己的小程序 AppID，或先使用测试号
5. 导入后即可在模拟器中预览与调试

## 可用脚本

```bash
npm test
```

该命令会执行：

```bash
node --test tools/*.test.js
```

## 测试用例

当前测试覆盖重点包括：
- 项目基础结构是否完整
- 首页开始/继续测试逻辑
- 测试页状态计算与单选选中状态装饰
- 结果页是否渲染预期内容
- 评分计算与特殊人格分支逻辑
- 数据文件与类型图片资源完整性
- 本地存储读写行为
- 关键样式和组件注册钩子

## 贡献指南

欢迎提交 Issue 或 Pull Request 来改进这个项目。

如果你准备贡献代码，建议先完成以下步骤：

1. Fork 本仓库
2. 创建功能分支
3. 完成修改并运行 `npm test`
4. 提交 PR，并说明变更内容与验证方式
