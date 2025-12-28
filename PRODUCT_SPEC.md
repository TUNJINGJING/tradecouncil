# TradeCouncil 产品规格文档 (PRD)

**版本**: 1.0 MVP
**最后更新**: 2025-12-28
**状态**: ✅ APPROVED - 开始实施
**GitHub仓库**: https://github.com/TUNJINGJING/tradecouncil

---

## 📋 执行摘要

### 产品定义
- **产品名称**: TradeCouncil
- **域名**: tradecouncil.app
- **基础代码**: big-AGI (https://github.com/enricoros/big-AGI)

### 核心价值主张
让多个顶级AI模型（GPT-4o, Claude 4.5, Gemini等）同时分析你的交易图表，获得专家共识，发现单一AI可能错过的风险和机会。

### 差异化竞争优势
1. ✅ **多模型并行对比** - 同时运行多个AI，并排显示结果
2. ✅ **智能融合(Fusion)** - 4种策略合成共识报告
3. ✅ **策略驱动分析** - 8个专业交易策略预设
4. ✅ **Vision AI** - 直接上传K线图截图分析

**参考竞品**: PROFIT AI
**我们的优势**: 多模型共识 + 成熟的big-AGI架构

---

## 🎯 产品决策总结

### 已确认的核心决策

| 决策项 | 结论 | 说明 |
|--------|------|------|
| **Ray数量限制** | 先全开，后期加限制 | 开发阶段不管限制 |
| **Fusion策略** | 4种全保留 | Fuse/Guided/Compare/Custom |
| **Merge Model选择** | 保留，默认便宜模型 | 付费用户可选 |
| **Personas系统** | 改造为Strategies | 8个交易策略预设 |
| **Strategy Creator** | 保留 | 从书籍/论文生成策略 |
| **Custom策略** | 高级功能($99用户) | 直接编辑Prompt |
| **Chat功能** | 完整保留 | 用于追问AI |
| **API Key** | 用你的KEY | 删除用户输入框 |
| **Settings** | 保留LLM和UI配置 | 删除Labs |
| **主界面** | 多页面结构 | /chat, /analysis, /strategies |
| **Beam命名** | 改为Analysis | 利于SEO |
| **历史记录** | localStorage | Phase 2再做云端 |
| **PDF/CSV导出** | Phase 2 | MVP不做 |
| **免费Vision模型** | Gemini 2.0 Flash | 确认免费 |

---

## 🏗️ 技术架构

### 基于big-AGI的模块复用

| big-AGI模块 | TradeCouncil用途 | 改造程度 | 优先级 |
|------------|-----------------|---------|--------|
| **Beam** | Analysis引擎 | 🟡 中度改造 | P0 |
| **Personas** | Strategies系统 | 🟡 中度改造 | P0 |
| **Chat** | 保留原样 | 🟢 直接复用 | P0 |
| **LLMs** | 模型管理 | 🟢 直接复用 | P0 |
| **AIX** | AI通信 | 🟢 直接复用 | P0 |
| **Optima布局** | UI框架 | 🟢 直接复用 | P0 |
| **Settings** | 配置页面 | 🟡 删除部分 | P1 |

### 删除模块
- ❌ Draw (AI绘图)
- ❌ Call (语音通话)
- ❌ Settings中的Labs功能

---

## 💎 核心功能详解

### 1. Analysis Engine (原Beam)

**功能**：多模型并行分析

**用户流程**：
```
1. 上传K线图截图 / 粘贴文字描述
   ↓
2. 选择交易策略 (8个预设 + Custom)
   ↓
3. 选择AI模型 (1-5个，取决于订阅)
   ↓
4. 点击 "Analyze" → Scatter启动
   ↓
5. 实时并排显示各AI分析结果
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ GPT-4o  │  │Claude4.5│  │ Gemini  │
   │ 分析中...│  │ 分析中...│  │ 分析中...│
   └─────────┘  └─────────┘  └─────────┘
   ↓
6. 选择Fusion策略 (Fuse/Guided/Compare/Custom)
   ↓
7. 生成共识报告或对比表格
   ↓
8. 切换到Chat追问细节
```

**技术实现**：
- 文件位置：`src/modules/beam/` → `src/modules/analysis/`
- 核心改动：
  - `BeamView.tsx` → `AnalysisView.tsx`
  - `BRay` → `ExpertAnalysis`
  - `BFusion` → `ConsensusReport`

---

### 2. Strategies System (原Personas)

**功能**：交易策略库

#### **8个预设策略**

基于PROFIT AI的Preset Library：

1. **VWAP Bounce Scalper** (⚡)
   - 类型: Scalping
   - 核心: VWAP + RSI/MACD
   - 时间框架: 5m, 15m

2. **Liquidity Sweep Scalper** (💧)
   - 类型: Scalping
   - 核心: ICT概念（扫流动性）
   - 时间框架: 1m, 5m

3. **Opening Range Breakout (ORB)** (🌅)
   - 类型: Day Trading
   - 核心: 开盘区间突破 + 量能
   - 时间框架: 5m, 15m, 30m

4. **Trend Pullback (20/50 EMA)** (📈)
   - 类型: Day Trading
   - 核心: EMA回调入场
   - 时间框架: 15m, 1H

5. **EMA Pullback Swing** (📊)
   - 类型: Swing Trading
   - 核心: EMA + RSI
   - 时间框架: 4H, 1D

6. **Breakout-Retest Swing** (🎯)
   - 类型: Swing Trading
   - 核心: 突破回踩 + MACD
   - 时间框架: 4H, 1D

7. **200DMA Filtered DCA** (💰)
   - 类型: Investing
   - 核心: 200日均线上方定投
   - 时间框架: 1D

8. **Momentum Rotation** (🔄)
   - 类型: Investing
   - 核心: 动能轮动选股
   - 时间框架: 1W

#### **策略Prompt结构**

每个策略包含完整的分析框架：

```typescript
interface TradingStrategy {
  id: string;
  name: string;
  category: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Investing';
  description: string;
  icon: string;

  // 核心：详细的System Prompt
  systemPrompt: string;  // 包含以下结构：
  /*
    You are a [Strategy Name] analyst.

    ANALYSIS FRAMEWORK:
    1. Trading Style: [类型] ([持仓周期])
    2. Asset Class: [适用市场]
    3. Entry Logic:
       - Trigger: [入场触发条件]
       - Confirmation: [确认信号列表]
       - Timing: [时间过滤]
    4. Exit Logic:
       - Stop Loss: [止损规则]
       - Take Profit: [止盈规则]
    5. Risk Management:
       - Risk per Trade: [风险敞口]
       - Position Sizing: [仓位计算]

    OUTPUT STRUCTURE:
    Provide analysis in this format:
    - Trend: [Bullish/Bearish/Neutral]
    - Signal: [Entry/Wait/Exit]
    - Entry Price: [specific price]
    - Stop Loss: [specific price]
    - Take Profit: [specific price]
    - Risk/Reward Ratio: [calculated]
    - Reasoning: [detailed explanation]
  */
}
```

#### **Strategy Creator**

**位置**：`/strategies` 页面（复用Persona Creator UI）

**功能**：从交易书籍/论文生成新策略

**工作流**：
```
1. 用户上传PDF（如《海龟交易法则》）
   或粘贴论文/YouTube链接
   ↓
2. LLM Chain处理（4步）：
   - Step 1: 分析源材料，提取核心逻辑
   - Step 2: 定义策略框架
   - Step 3: 制定风险管理规则
   - Step 4: 生成完整System Prompt
   ↓
3. 用户可编辑、测试、保存
   ↓
4. 策略加入个人策略库
```

**技术实现**：
- 复用：`src/apps/personas/creator/Creator.tsx`
- 改造：LLM Chain的Prompt内容
- 存储：`localStorage` (AppStrategiesStore)

#### **Custom策略（高级功能）**

**限制**：仅$99 Pro用户可用

**功能**：直接编辑System Prompt

**界面**：
```
┌────────────────────────────────────┐
│ Custom Strategy (Pro Only)         │
├────────────────────────────────────┤
│ Strategy Name:                     │
│ [My Bollinger Strategy_________]  │
│                                    │
│ System Prompt:                     │
│ ┌────────────────────────────────┐ │
│ │You are a Bollinger Band        │ │
│ │specialist focusing on...       │ │
│ │(Markdown editor with preview)  │ │
│ └────────────────────────────────┘ │
│                                    │
│ [Test] [Save] [Cancel]            │
└────────────────────────────────────┘
```

---

### 3. Fusion策略详解

保留big-AGI Beam的全部4种Fusion：

#### **1. Fuse - 统一共识**
- **用途**：生成一份综合所有AI意见的报告
- **场景**：快速获得最佳答案
- **Prompt示例**：
  ```
  Synthesize the N expert analyses into one cohesive answer.
  Highlight consensus points and note any disagreements.
  ```

#### **2. Guided - 引导式融合**
- **用途**：AI先提取关键点→用户勾选→再融合
- **场景**：用户想保持控制权
- **流程**：
  ```
  Step 1: AI生成勾选清单
  "Based on N analyses, key decision factors:
   □ Bullish trend confirmed by 3/4 experts
   □ Strong support at $150
   □ High volume divergence warning"

  Step 2: 用户选择

  Step 3: 基于选择重新融合
  ```

#### **3. Compare - 对比评估**
- **用途**：生成对比表格，打分
- **场景**：深度分析各AI的差异
- **输出示例**：
  ```markdown
  | Model | Trend | Entry | Confidence | Total |
  |-------|-------|-------|-----------|-------|
  | GPT-4o | Bullish | $152 | 85% | 4.2/5 |
  | Claude | Neutral | Wait | 70% | 3.5/5 |
  | Gemini | Bullish | $151 | 90% | 4.5/5 |
  ```

#### **4. Custom - 自定义融合**
- **用途**：高级用户自定义Fusion Prompt
- **场景**：特殊需求（如只看风险、只看机会等）

**Merge Model选择**：
- 默认：Gemini 2.0 Flash（免费）或GPT-4o-mini（便宜）
- 付费用户可选：GPT-4o, Claude 3.5等

---

### 4. Chat功能

**保留现状**，完全不改。

**集成点**：
- 在Analysis完成后，自动加载分析上下文到Chat
- 用户可以追问："为什么你认为会涨？"，"如果跌破止损怎么办？"
- AI基于之前的分析结果回答

---

## 🎨 UI/UX设计

### 页面结构

```
┌──────────────────────────────────────┐
│  TRADE COUNCIL          [Credits: 450]  [Login] │
└──────────────────────────────────────┘
│ [Chat] [Analysis] [Strategies] [Settings] │
└──────────────────────────────────────┘

/analysis 页面：
┌──────────────────────────────────────┐
│  Upload Chart / Paste Symbol         │
│  ┌────────────────────────────────┐  │
│  │ [Drag & Drop]  or  [Paste]     │  │
│  └────────────────────────────────┘  │
├──────────────────────────────────────┤
│  Select Strategy: [Swing Trading ▼]  │
│  Select Models:                       │
│  ☑ GPT-4o  ☑ Claude 3.5  ☑ Gemini   │
│                                       │
│  [Analyze]                           │
├──────────────────────────────────────┤
│  Expert Analyses (Real-time)         │
│  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │GPT-4o│  │Claude│  │Gemini│       │
│  │🟢分析中│  │✅完成 │  │✅完成 │       │
│  └──────┘  └──────┘  └──────┘       │
├──────────────────────────────────────┤
│  Fusion                              │
│  Strategy: [Fuse ▼]                 │
│  Merge Model: [GPT-4o-mini ▼]       │
│  [Generate Consensus Report]         │
│                                       │
│  ┌────────────────────────────────┐  │
│  │ 📊 Consensus Report            │  │
│  │ Trend: Bullish (3/3 agree)    │  │
│  │ Entry: $152.50                │  │
│  │ Stop: $148.00                 │  │
│  │ Target: $162.00               │  │
│  │ R/R: 2.1                      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

/strategies 页面：
┌──────────────────────────────────────┐
│  Strategy Library                     │
├──────────────────────────────────────┤
│  [My Strategies] [Presets] [Create]  │
│                                       │
│  Presets:                            │
│  ┌────────────────────────────────┐  │
│  │ ⚡ VWAP Bounce Scalper         │  │
│  │ 📊 EMA Pullback Swing          │  │
│  │ 🎯 Breakout-Retest Swing       │  │
│  │ ... (8个预设)                  │  │
│  └────────────────────────────────┘  │
│                                       │
│  My Strategies:                      │
│  ┌────────────────────────────────┐  │
│  │ ✏️ My Turtle Strategy          │  │
│  │ ✏️ Bollinger Reversal          │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

/chat 页面：
（保持big-AGI原样）
```

### 设计系统（基于DESIGN.md）

- **配色**：
  - 背景：#0a0a0a (极深黑)
  - 主色：#00E676 (金融绿)
  - 文字：#ffffff / #888888
  - 混凝土噪点纹理

- **字体**：
  - Display: Inter (粗体，紧凑)
  - Data: Courier New (等宽)

- **组件**：
  - 按钮：圆角50px，白色填充
  - 卡片：玻璃态，细边框
  - 表格：极简线条

---

## 💰 商业模式（Phase 2实现）

### 定价层级

| 层级 | 价格 | 模型访问 | 分析额度 | Beam | Fusion | Custom策略 |
|------|------|---------|---------|------|--------|-----------|
| FREE | $0 | Gemini Flash | 3次/天 | 1模型 | ❌ | ❌ |
| TRADER | $39 | GPT-4o, Claude3.5 | 500积分/月 | 2-3模型 | Fuse | ❌ |
| PRO | $99 | 全部顶级模型 | 2000积分/月 | 3-5模型 | All | ✅ |

**积分消耗**（待测试调整）：
```
单模型分析（无图片）：~10积分
单模型分析（含图片）：~20积分
Fusion：+5积分
```

### 认证和支付

**Phase 2再做**：
- Supabase Auth
- Stripe集成（复用birthdaycardgenerator-1）
- Credits系统

**现在（MVP）**：全功能开放，无限制

---

## 🚀 实施计划

### Sprint 1: 基础架构改造 (Week 1-2)

**目标**：删除不需要的模块，重命名核心文件，跑通基本流程

#### 任务清单

**1. 删除模块** (1天)
```bash
rm -rf src/apps/draw/
rm -rf src/apps/call/
rm -rf pages/draw.tsx
rm -rf pages/call.tsx
```

**2. 重命名Beam → Analysis** (2天)
```bash
# 核心模块
mv src/modules/beam/ src/modules/analysis/
mv src/modules/analysis/BeamView.tsx src/modules/analysis/AnalysisView.tsx

# 类型定义
BRay → ExpertAnalysis
BFusion → ConsensusReport
BeamStore → AnalysisStore

# 文件
beam.scatter.ts → analysis.scatter.ts
beam.gather.ts → analysis.gather.ts
store-beam_vanilla.ts → store-analysis_vanilla.ts
```

**3. 重命名Personas → Strategies** (2天)
```bash
mv src/apps/personas/ src/apps/strategies/
mv pages/personas.tsx pages/strategies.tsx

# 类型
SimplePersona → TradingStrategy
SystemPurpose → StrategyPreset
```

**4. 修改导航和路由** (1天)
```typescript
// src/apps/settings-modal/SettingsModal.tsx
const tabs = [
  { id: 'chat', label: 'Chat' },
  { id: 'analysis', label: 'Analysis' },  // 原beam
  { id: 'strategies', label: 'Strategies' },  // 原personas
  { id: 'settings', label: 'Settings' },
];
```

**5. 删除Settings中的Labs和API Key输入** (1天)
```typescript
// src/apps/settings-modal/
// 保留：Models选择、UI设置、Advanced
// 删除：Labs功能开关、API Key输入框
```

**6. 测试验证** (1天)
- [ ] Analysis页面能正常打开
- [ ] Scatter功能正常（多模型并行）
- [ ] Fusion功能正常（4种策略）
- [ ] Strategies页面能打开
- [ ] Chat功能正常

---

### Sprint 2: 策略系统实现 (Week 3)

**目标**：实现8个预设交易策略

#### 任务清单

**1. 创建策略定义文件** (1天)
```typescript
// src/data-strategies.ts
export const TRADING_STRATEGIES: Record<StrategyId, StrategyData> = {
  'vwap-bounce-scalper': {
    name: 'VWAP Bounce Scalper',
    category: 'Scalping',
    icon: '⚡',
    systemPrompt: `详细Prompt...`,
  },
  // ... 8个策略
};
```

**2. 编写高质量Prompt** (3天)
- 每个策略需要详细的System Prompt
- 包含Entry Logic, Exit Logic, Risk Management
- 定义输出格式

**3. 修改Strategy Creator** (2天)
- LLM Chain的Prompt改为交易策略生成
- 输入源：Trading Book, Paper, YouTube

**4. 实现Custom策略编辑器** (1天)
- 简单的Markdown编辑器
- 保存到localStorage

**5. 测试** (1天)
- [ ] 8个预设策略能正常选择
- [ ] 选择策略后，AI理解并按框架分析
- [ ] Strategy Creator能生成新策略
- [ ] Custom策略能保存和使用

---

### Sprint 3: UI优化和集成 (Week 4)

**目标**：应用DESIGN.md的视觉规范，优化用户体验

#### 任务清单

**1. 应用设计系统** (3天)
- 颜色变量（#0a0a0a, #00E676）
- 混凝土噪点背景
- 字体（Inter + Courier New）

**2. 改造Landing Page** (2天)
- 使用DESIGN.md的HTML作为模板
- 调整CTA按钮指向/analysis

**3. 优化Analysis界面** (2天)
- Expert卡片显示关键指标（Trend, Entry, Stop）
- Fusion结果可视化
- 实时进度显示

**4. 测试和修复** (1天)
- 移动端适配
- 浏览器兼容性
- 性能优化

---

### Sprint 4: 最终测试和发布 (Week 5)

**目标**：端到端测试，准备上线

#### 任务清单

**1. 功能测试** (2天)
- [ ] 上传图片 → 多模型分析 → Fusion → Chat 完整流程
- [ ] 8个策略都能正常工作
- [ ] 所有4种Fusion策略正常
- [ ] Strategy Creator正常

**2. 性能优化** (1天)
- Lighthouse测试 > 90分
- 图片压缩
- 代码分割

**3. 文档和帮助** (1天)
- 用户使用指南
- FAQ
- 示例演示

**4. 部署** (1天)
- Vercel部署
- 域名配置 (tradecouncil.app)
- 环境变量配置

---

## 📂 详细文件改造清单

### 需要删除的文件

```
src/apps/draw/
src/apps/call/
pages/draw.tsx
pages/call.tsx
src/apps/settings-modal/UxLabsSettings.tsx
```

### 需要重命名的文件

```
# Beam → Analysis
src/modules/beam/ → src/modules/analysis/
src/modules/beam/BeamView.tsx → src/modules/analysis/AnalysisView.tsx
src/modules/beam/scatter/BeamRay.tsx → src/modules/analysis/scatter/ExpertAnalysis.tsx
src/modules/beam/scatter/BeamRayGrid.tsx → src/modules/analysis/scatter/ExpertGrid.tsx
src/modules/beam/gather/Fusion.tsx → src/modules/analysis/gather/ConsensusReport.tsx
src/modules/beam/store-beam_vanilla.ts → src/modules/analysis/store-analysis_vanilla.ts
src/apps/beam/ → src/apps/analysis/
pages/beam.tsx → pages/analysis.tsx

# Personas → Strategies
src/apps/personas/ → src/apps/strategies/
pages/personas.tsx → pages/strategies.tsx
src/apps/personas/creator/Creator.tsx → src/apps/strategies/creator/StrategyCreator.tsx
```

### 需要修改的文件

```typescript
// src/data.ts → src/data-strategies.ts
- SystemPurposes (删除Developer等)
+ TRADING_STRATEGIES (新增8个交易策略)

// src/modules/analysis/store-analysis_vanilla.ts
- BRay → ExpertAnalysis
- BFusion → ConsensusReport

// src/apps/settings-modal/
- 删除Labs相关代码
- 删除API Key输入框
- 保留Models和UI设置

// pages/_app.tsx
- 更新导航菜单标签
```

---

## 🔧 环境配置

### 必需的环境变量

```bash
# .env.local

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google (Gemini)
GOOGLE_GEMINI_API_KEY=...

# 其他模型API Key（可选）
DEEPSEEK_API_KEY=...
GROQ_API_KEY=...
```

### Vercel部署配置

```json
{
  "name": "tradecouncil",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "OPENAI_API_KEY": "@openai-api-key",
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "GOOGLE_GEMINI_API_KEY": "@google-gemini-api-key"
  }
}
```

---

## ✅ 验收标准

### MVP完成标准

- [ ] Analysis页面能上传图片/粘贴文字
- [ ] 能同时运行3-5个模型分析
- [ ] 实时显示各模型分析结果
- [ ] 4种Fusion策略都能正常工作
- [ ] 8个预设策略能选择并正常工作
- [ ] Strategy Creator能从PDF生成策略
- [ ] Custom策略能编辑和保存
- [ ] Chat能追问分析结果
- [ ] UI应用了DESIGN.md的视觉规范
- [ ] 移动端适配正常
- [ ] 部署到tradecouncil.app可访问

---

## 📝 附录

### 附录A: 8个预设策略详细Prompt模板

```typescript
// 示例：EMA Pullback Swing策略

systemPrompt: `You are an EMA Pullback Swing Trading analyst.

ANALYSIS FRAMEWORK:

1. Trading Style: Swing Trading
   - Holding Period: 1-4 weeks
   - Decision Timeframe: 4H, 1D charts
   - Risk Tolerance: Medium

2. Asset Class: Stocks, Crypto, Forex
   - Focus on liquid, trending assets
   - Avoid low-volume, choppy markets

3. Entry Logic:

   Trigger (Primary Signal):
   - Price pulls back to EMA 20 or EMA 50
   - EMA 20 > EMA 50 (uptrend) or EMA 20 < EMA 50 (downtrend)
   - Price touches but doesn't close below MA

   Confirmation (Must have at least 2):
   - Bullish/Bearish candle pattern (engulfing, pin bar, hammer)
   - RSI oversold (<30) then reversal OR overbought (>70) then reversal
   - Volume above 20-period average
   - Higher timeframe (1D or 1W) trend alignment

   Timing:
   - Prefer entries during regular trading hours
   - Avoid major news events unless momentum-confirmed

4. Exit Logic:

   Stop Loss:
   - Place below recent swing low (for longs) or above swing high (for shorts)
   - Alternative: 1.5x ATR from entry

   Take Profit:
   - Target: Minimum 2R (Risk multiple)
   - Or previous swing high/low
   - Consider trailing stop after 1R profit

5. Risk Management:
   - Risk per Trade: 1% of capital (Balanced approach)
   - Position Sizing: (Account * 1%) / (Entry - Stop Loss)
   - Maximum 3 concurrent swing positions

OUTPUT STRUCTURE:

Please provide your analysis in the following format:

**Trend**: [Bullish / Bearish / Neutral]

**Signal**: [Entry / Wait / Exit]

**Entry Price**: $[specific price level]

**Stop Loss**: $[specific price level]

**Take Profit**: $[specific price level]

**Risk/Reward Ratio**: [calculated ratio]

**Reasoning**:
- Trigger Analysis: [Describe MA pullback situation]
- Confirmation Checklist: [List which confirmations are met]
- Risk Assessment: [Evaluate potential downside]
- Trade Plan: [Step-by-step execution plan]

**Key Risks**:
[List 2-3 main risks that could invalidate this setup]

**Alternative Scenarios**:
[What to watch if initial thesis doesn't play out]
`
```

### 附录B: Strategy Creator LLM Chain配置

```typescript
const STRATEGY_CREATION_CHAIN: LLMChainStep[] = [
  {
    name: 'Extract Trading Logic',
    setSystem: 'You are a quantitative trading analyst expert at extracting trading rules from books and papers.',
    addUserChainInput: true,
    addUserText: `Analyze the provided trading material and extract:
      1. Core trading philosophy
      2. Entry rules and triggers
      3. Exit rules (stop loss, take profit)
      4. Risk management principles
      5. Time frames and asset classes

      Be specific and cite examples from the text.`,
  },
  {
    name: 'Define Strategy Framework',
    setSystem: 'You are a trading system architect.',
    addModelPrevOutput: true,
    addUserText: `Based on the extracted logic, create a structured trading strategy definition with:
      - Strategy Name
      - Trading Style (Scalping/Day/Swing/Investing)
      - Entry Logic (Triggers + Confirmations)
      - Exit Logic (Stop Loss + Take Profit rules)
      - Risk Management (Position sizing, max risk)

      Format as a clear, actionable framework.`,
  },
  {
    name: 'Generate AI System Prompt',
    setSystem: 'You are an expert in prompt engineering for AI trading analysts.',
    addModelPrevOutput: true,
    addUserText: `Generate a comprehensive System Prompt that transforms the strategy framework into instructions for an AI analyst.

      The prompt should:
      1. Define the analyst role
      2. List all analysis steps
      3. Specify output format (Trend, Signal, Entry, Stop, Target, R/R, Reasoning)
      4. Include risk warnings and edge cases

      Make it detailed enough that any LLM can follow it consistently.`,
  },
  {
    name: 'Validate and Optimize',
    setSystem: 'You are a trading strategy validator.',
    addModelPrevOutput: true,
    addUserText: `Review the generated System Prompt and:
      1. Check for logical consistency
      2. Ensure all edge cases are covered
      3. Verify risk management is clear
      4. Optimize for clarity and conciseness

      Output the FINAL, production-ready System Prompt.`,
  },
];
```

---

## 🎯 下一步行动

**立即执行**：

1. ✅ 确认GitHub仓库访问权限
2. ✅ 配置本地开发环境
3. ✅ 开始Sprint 1任务
4. ✅ 每日同步进度

**Git工作流**：
```bash
# 克隆仓库
git clone git@github.com:TUNJINGJING/tradecouncil.git
cd tradecouncil

# 创建开发分支
git checkout -b sprint-1-architecture

# 提交代码
git add .
git commit -m "Sprint 1: Delete draw and call modules"
git push origin sprint-1-architecture

# 合并到main
git checkout main
git merge sprint-1-architecture
git push origin main
```

---

**文档版本**：
- v1.0: 2025-12-28 - 初始PRD，已确认所有核心决策

**审批状态**：
- ✅ 产品负责人确认
- ✅ 技术负责人确认
- ✅ 准备开始实施

🚀 **LET'S BUILD!**
