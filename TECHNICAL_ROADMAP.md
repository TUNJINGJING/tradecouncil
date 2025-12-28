# TradeCouncil 技术改造清单

**版本**: 1.0
**更新时间**: 2025-12-28
**GitHub**: https://github.com/TUNJINGJING/tradecouncil

---

## 📋 Sprint 1: 基础架构改造

### Task 1.1: 删除不需要的模块 ✅

#### 删除文件/文件夹

```bash
# Draw模块
rm -rf src/apps/draw/
rm -rf pages/draw.tsx

# Call模块
rm -rf src/apps/call/
rm -rf pages/call.tsx

# Labs功能
rm -rf src/apps/settings-modal/UxLabsSettings.tsx
```

#### 修改文件

**`src/apps/settings-modal/SettingsModal.tsx`**
- 删除Draw和Call的Tab
- 删除Labs Tab引用

**`src/common/app.nav.ts`** (如果存在)
- 删除Draw和Call的导航项

---

### Task 1.2: 重命名Beam → Analysis ✅

#### 文件夹重命名

```bash
# 核心模块
mv src/modules/beam/ src/modules/analysis/

# App
mv src/apps/beam/ src/apps/analysis/

# 页面
mv pages/beam.tsx pages/analysis.tsx
```

#### 文件重命名

```bash
cd src/modules/analysis/

# 主视图
mv BeamView.tsx AnalysisView.tsx

# Scatter
cd scatter/
mv BeamRay.tsx ExpertAnalysis.tsx
mv BeamRayGrid.tsx ExpertGrid.tsx
mv BeamScatterPane.tsx AnalysisScatterPane.tsx
mv BeamScatterInput.tsx AnalysisInput.tsx

cd ../gather/
mv Fusion.tsx ConsensusReport.tsx
mv BeamFusionGrid.tsx ConsensusGrid.tsx
mv BeamGatherPane.tsx AnalysisGatherPane.tsx

# Store
cd ../
mv store-beam_vanilla.ts store-analysis_vanilla.ts
mv store-beam.hooks.ts store-analysis.hooks.ts
mv store-module-beam.tsx store-module-analysis.tsx
```

#### 类型重命名（全局查找替换）

在所有 `src/modules/analysis/` 文件中：

```typescript
// 查找替换
BRay          → ExpertAnalysis
BRayId        → ExpertAnalysisId
BFusion       → ConsensusReport
BFusionId     → ConsensusReportId
BeamStore     → AnalysisStore
BeamScatter   → AnalysisScatter
BeamGather    → AnalysisGather
rayScatter    → expertAnalyze
```

#### 关键文件修改

**`src/modules/analysis/AnalysisView.tsx`**
```typescript
// 修改组件名
export function AnalysisView() {
  // 导入路径更新
  import { AnalysisScatterPane } from './scatter/AnalysisScatterPane';
  import { ExpertGrid } from './scatter/ExpertGrid';
  import { ConsensusGrid } from './gather/ConsensusGrid';
  // ...
}
```

**`src/modules/analysis/store-analysis_vanilla.ts`**
```typescript
// 接口重命名
export interface ExpertAnalysis {
  analysisId: ExpertAnalysisId;
  modelId: DLLMId;
  modelName: string;
  result: DMessage;
  status: 'analyzing' | 'completed' | 'error';
  // ...
}

export interface ConsensusReport {
  reportId: ConsensusReportId;
  factoryId: FFactoryId;
  outputDMessage?: DMessage;
  // ...
}

export interface AnalysisStore {
  experts: ExpertAnalysis[];
  reports: ConsensusReport[];
  // ...
}
```

**`pages/analysis.tsx`**
```typescript
import { AnalysisView } from '../src/modules/analysis/AnalysisView';

export default function AnalysisPage() {
  return <AnalysisView />;
}
```

---

### Task 1.3: 重命名Personas → Strategies ✅

#### 文件夹重命名

```bash
# App
mv src/apps/personas/ src/apps/strategies/

# 页面
mv pages/personas.tsx pages/strategies.tsx
```

#### 文件重命名

```bash
cd src/apps/strategies/

# Creator
cd creator/
mv Creator.tsx StrategyCreator.tsx
mv FromYouTube.tsx FromTradingVideo.tsx
mv FromText.tsx FromTradingBook.tsx

# Store
cd ../
mv store-app-personas.ts store-app-strategies.ts
```

#### 类型重命名

在所有 `src/apps/strategies/` 文件中：

```typescript
// 查找替换
SimplePersona      → TradingStrategy
SystemPurpose      → StrategyPreset
SystemPurposeId    → StrategyPresetId
SystemPurposeData  → StrategyData
prependSimplePersona  → prependStrategy
deleteSimplePersona   → deleteStrategy
useSimplePersonas     → useTradingStrategies
```

#### 创建新文件

**`src/data-strategies.ts`** (新建)
```typescript
export type StrategyPresetId =
  | 'vwap-bounce-scalper'
  | 'liquidity-sweep-scalper'
  | 'opening-range-breakout'
  | 'trend-pullback-ema'
  | 'ema-pullback-swing'
  | 'breakout-retest-swing'
  | 'dma-filtered-dca'
  | 'momentum-rotation'
  | 'custom';

export interface StrategyData {
  title: string;
  category: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Investing';
  description: string;
  systemMessage: string;
  symbol: string;
  imageUri?: string;
  examples?: string[];
}

export const TRADING_STRATEGY_PRESETS: Record<StrategyPresetId, StrategyData> = {
  'vwap-bounce-scalper': {
    title: 'VWAP Bounce Scalper',
    category: 'Scalping',
    description: 'Scalping + VWAP + RSI/MACD',
    symbol: '⚡',
    systemMessage: `You are a VWAP Bounce Scalping specialist.

ANALYSIS FRAMEWORK:
1. Trading Style: Scalping (Minutes to hours)
2. Asset Class: Stocks, Crypto with high liquidity
3. Entry Logic:
   - Trigger: Price bounces off VWAP
   - Confirmation: RSI oversold/overbought + MACD cross
   - Timing: High volume periods only
4. Exit Logic:
   - Stop Loss: 0.5% or below VWAP
   - Take Profit: Quick scalp, 0.5-1% target
5. Risk Management:
   - Risk per Trade: 0.5% max
   - Position Sizing: Risk-Based

OUTPUT:
- Trend: [Bullish/Bearish/Neutral]
- Signal: [Entry/Wait/Exit]
- Entry Price: [specific]
- Stop Loss: [specific]
- Take Profit: [specific]
- R/R Ratio: [calculated]
- Reasoning: [detailed]`,
    examples: [
      'Analyze this 5m chart for VWAP scalp opportunities',
      'Is this a good VWAP bounce setup?',
    ],
  },

  'ema-pullback-swing': {
    title: 'EMA Pullback Swing',
    category: 'Swing Trading',
    description: 'Swing + EMA + RSI',
    symbol: '📊',
    systemMessage: `You are an EMA Pullback Swing Trading analyst.

ANALYSIS FRAMEWORK:
1. Trading Style: Swing Trading (1-4 weeks)
2. Asset Class: Stocks, Crypto, Forex
3. Entry Logic:
   - Trigger: Pullback to EMA 20/50
   - Confirmation: Candle pattern + RSI reversal + Volume
   - Timing: Regular trading hours
4. Exit Logic:
   - Stop Loss: Below swing low (or 1.5 ATR)
   - Take Profit: 2R minimum
5. Risk Management:
   - Risk per Trade: 1%
   - Position Sizing: (Capital * 1%) / (Entry - Stop)

OUTPUT:
- Trend: [Bullish/Bearish/Neutral]
- Signal: [Entry/Wait/Exit]
- Entry Price: [specific]
- Stop Loss: [specific]
- Take Profit: [specific]
- R/R Ratio: [calculated]
- Reasoning: [detailed with MA analysis]`,
    examples: [
      'Analyze this 4H chart for EMA pullback',
      'Is this a valid swing setup?',
    ],
  },

  // TODO: 完成其他6个策略...

  'custom': {
    title: 'Custom Strategy',
    category: 'Day Trading',
    description: 'Create your own trading strategy',
    symbol: '✏️',
    systemMessage: 'You are a professional trading analyst. Analyze the chart comprehensively and provide Entry, Stop Loss, Take Profit recommendations with detailed reasoning.',
    examples: ['Analyze this chart', 'What do you think of this setup?'],
  },
};
```

#### 修改关键文件

**`src/apps/strategies/store-app-strategies.ts`**
```typescript
import { TRADING_STRATEGY_PRESETS } from '../../data-strategies';

export interface TradingStrategy {
  id: string;
  name?: string;
  systemPrompt: string;
  creationDate: string;
  pictureUrl?: string;
  inputText: string;
  llmLabel?: string;
  inputProvenance?: {
    type: 'trading-video' | 'trading-book' | 'paper';
    url?: string;
    title?: string;
  };
}

export interface AppStrategiesStore {
  tradingStrategies: TradingStrategy[];
  prependStrategy: (prompt: string, text: string, provenance?, llm?) => void;
  deleteStrategy: (id: string) => void;
  deleteStrategies: (ids: Set<string>) => void;
}
```

**`pages/strategies.tsx`**
```typescript
import { AppStrategies } from '../src/apps/strategies/AppStrategies';

export default function StrategiesPage() {
  return <AppStrategies />;
}
```

---

### Task 1.4: 修改导航和路由 ✅

#### 更新导航标签

**`src/apps/settings-modal/SettingsModal.tsx`** (或类似文件)
```typescript
const APP_TABS = [
  { id: 'chat', label: 'Chat', path: '/chat' },
  { id: 'analysis', label: 'Analysis', path: '/analysis' },  // 原beam
  { id: 'strategies', label: 'Strategies', path: '/strategies' },  // 原personas
  { id: 'settings', label: 'Settings', path: '/settings' },
];
```

#### 更新路由配置

**`pages/_app.tsx`** (或Next.js配置)
```typescript
// 确保路由正确
// /chat → Chat页面
// /analysis → Analysis页面（原/beam）
// /strategies → Strategies页面（原/personas）
```

---

### Task 1.5: 删除Settings中的Labs和API Key ✅

#### 修改文件

**`src/apps/settings-modal/SettingsModal.tsx`**
```typescript
// 删除Labs Tab
const tabs = [
  { id: 'models', label: 'Models' },
  { id: 'ui', label: 'UI' },
  { id: 'advanced', label: 'Advanced' },
  // ❌ 删除: { id: 'labs', label: 'Labs' },
];
```

**`src/apps/settings-modal/ModelsSettings.tsx`** (或类似)
```typescript
// 删除API Key输入框
// 保留：
// - 模型选择（哪些模型可用）
// - 模型参数（temperature等）

// ❌ 删除:
<FormControl>
  <FormLabel>OpenAI API Key</FormLabel>
  <Input type="password" ... />
</FormControl>
```

#### 环境变量配置

**`.env.local`** (本地开发)
```bash
# 开发者自己的API Key（不提交到Git）
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GEMINI_API_KEY=...
```

**Vercel环境变量** (生产环境)
- 在Vercel后台配置相同的环境变量
- 不暴露给用户

---

### Task 1.6: 全局查找替换 ✅

#### 需要替换的术语

在整个项目中查找替换（除了`node_modules/`）：

```bash
# 使用VS Code或IDE的全局查找替换

1. "beam" → "analysis" (小写，代码中的变量)
2. "Beam" → "Analysis" (大写，组件名和类型)
3. "persona" → "strategy" (小写)
4. "Persona" → "Strategy" (大写)
5. "System Purpose" → "Strategy Preset"
6. "/beam" → "/analysis" (URL路径)
7. "/personas" → "/strategies" (URL路径)
```

#### 排除文件

不要替换以下文件：
- `node_modules/`
- `.next/`
- `package-lock.json`
- 第三方库导入

---

### Task 1.7: 更新导入路径 ✅

#### 自动化脚本（可选）

```bash
# 使用sed批量替换导入路径（macOS/Linux）

# Beam → Analysis
find src/ -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/from.*beam/from .\/analysis/g'
find src/ -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/from.*Beam/from .\/Analysis/g'

# Personas → Strategies
find src/ -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/from.*personas/from .\/strategies/g'
find src/ -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/from.*Personas/from .\/Strategies/g'
```

#### 手动检查

运行后检查：
```bash
npm run build

# 如果有报错，逐个修复导入路径
```

---

### Task 1.8: 测试验证 ✅

#### 启动开发服务器

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`

#### 功能测试清单

- [ ] **Chat页面** (`/chat`)
  - [ ] 能正常打开
  - [ ] 能创建新对话
  - [ ] 能发送消息并收到AI回复

- [ ] **Analysis页面** (`/analysis`)
  - [ ] 能正常打开
  - [ ] 能上传图片
  - [ ] 能选择多个模型
  - [ ] Scatter功能正常（多模型并行）
  - [ ] Expert卡片正常显示
  - [ ] Fusion功能正常
  - [ ] 4种Fusion策略都可选
  - [ ] Merge Model选择正常

- [ ] **Strategies页面** (`/strategies`)
  - [ ] 能正常打开
  - [ ] 预设策略列表显示
  - [ ] Strategy Creator能打开
  - [ ] 能创建新策略（LLM Chain）

- [ ] **Settings页面**
  - [ ] Models设置正常
  - [ ] UI设置正常
  - [ ] ❌ 没有Labs Tab
  - [ ] ❌ 没有API Key输入框

#### 控制台检查

- [ ] 无Console错误
- [ ] 无TypeScript类型错误
- [ ] 无导入路径错误

---

## 📋 Sprint 2: 策略系统实现

### Task 2.1: 完成8个预设策略Prompt ✅

#### 需要完成的策略

在 `src/data-strategies.ts` 中完成以下策略的`systemMessage`：

1. ✅ vwap-bounce-scalper
2. ⏰ liquidity-sweep-scalper
3. ⏰ opening-range-breakout
4. ⏰ trend-pullback-ema
5. ✅ ema-pullback-swing
6. ⏰ breakout-retest-swing
7. ⏰ dma-filtered-dca
8. ⏰ momentum-rotation

#### Prompt模板结构

每个策略Prompt必须包含：

```
You are a [Strategy Name] analyst.

ANALYSIS FRAMEWORK:
1. Trading Style: [类型] ([持仓周期])
2. Asset Class: [适用市场]
3. Entry Logic:
   - Trigger: [触发条件]
   - Confirmation: [确认信号]
   - Timing: [时间过滤]
4. Exit Logic:
   - Stop Loss: [止损规则]
   - Take Profit: [止盈规则]
5. Risk Management:
   - Risk per Trade: [风险敞口]
   - Position Sizing: [仓位计算]

OUTPUT STRUCTURE:
- Trend: [Bullish/Bearish/Neutral]
- Signal: [Entry/Wait/Exit]
- Entry Price: [specific]
- Stop Loss: [specific]
- Take Profit: [specific]
- Risk/Reward Ratio: [calculated]
- Reasoning: [detailed explanation]
```

---

### Task 2.2: 修改Strategy Creator的LLM Chain ✅

#### 文件位置

`src/apps/strategies/creator/StrategyCreator.tsx`

#### LLM Chain配置

```typescript
const STRATEGY_CREATION_CHAIN: LLMChainStep[] = [
  {
    name: 'Extract Trading Logic',
    setSystem: 'You are a quantitative analyst extracting trading rules from books and papers.',
    addUserChainInput: true,
    addUserText: 'Extract: philosophy, entry rules, exit rules, risk management, timeframes.',
  },
  {
    name: 'Define Framework',
    setSystem: 'You are a trading system architect.',
    addModelPrevOutput: true,
    addUserText: 'Create structured strategy: Name, Style, Entry, Exit, Risk.',
  },
  {
    name: 'Generate System Prompt',
    setSystem: 'You are a prompt engineering expert.',
    addModelPrevOutput: true,
    addUserText: 'Generate AI analyst System Prompt with analysis steps and output format.',
  },
  {
    name: 'Validate',
    setSystem: 'You are a strategy validator.',
    addModelPrevOutput: true,
    addUserText: 'Review and optimize for production use.',
  },
];
```

---

### Task 2.3: 实现Custom策略编辑器 ✅

#### 文件位置

`src/apps/strategies/CustomStrategyEditor.tsx` (新建)

#### 功能需求

```typescript
export function CustomStrategyEditor() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');

  return (
    <Box>
      <Typography level="h4">Custom Strategy (Pro)</Typography>

      <FormControl>
        <FormLabel>Strategy Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>System Prompt</FormLabel>
        <Textarea
          minRows={15}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="You are a trading analyst..."
        />
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button onClick={handleTest}>Test on Demo Chart</Button>
        <Button variant="solid" onClick={handleSave}>Save Strategy</Button>
      </Box>
    </Box>
  );
}
```

---

## 📋 Sprint 3: UI优化

### Task 3.1: 应用DESIGN.md视觉规范 ✅

#### CSS变量配置

**`src/apps/theme/theme.ts`** (或全局CSS)

```css
:root {
  /* 背景 */
  --bg-deep: #0a0a0a;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);

  /* 文字 */
  --text-primary: #ffffff;
  --text-secondary: #888888;
  --text-dim: #666666;

  /* 强调色 */
  --accent-green: #00E676;
  --danger-red: #FF1744;

  /* 纹理 */
  --concrete-noise: url("data:image/svg+xml,...");
}

body {
  background-color: var(--bg-deep);
  background-image: var(--concrete-noise);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
}

.mono {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}
```

---

### Task 3.2: 改造Landing Page ✅

#### 文件位置

`pages/index.tsx`

#### 实现方式

1. 复制 `DESIGN.md` 中的HTML
2. 转换为React/Next.js组件
3. CTA按钮指向 `/analysis`

```tsx
export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProtocolSection />
      <BeamSection />  {/* 展示多模型分析 */}
      <FeatureSlabs />
      <PrivacySection />
      <PricingSection />  {/* Phase 2再激活付费 */}
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
```

---

## 🔧 开发工具和命令

### 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npx tsc --noEmit

# Lint检查
npm run lint

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### Git工作流

```bash
# 克隆仓库
git clone git@github.com:TUNJINGJING/tradecouncil.git
cd tradecouncil

# 查看状态
git status

# 创建功能分支
git checkout -b sprint-1-task-1

# 提交更改
git add .
git commit -m "Task 1.1: Delete draw and call modules"

# 推送到远程
git push origin sprint-1-task-1

# 合并到main
git checkout main
git merge sprint-1-task-1
git push origin main
```

---

## ✅ 验收检查清单

### Sprint 1完成标准

- [ ] 所有删除的模块已移除
- [ ] Beam→Analysis重命名完成，无编译错误
- [ ] Personas→Strategies重命名完成
- [ ] 导航栏更新为Chat/Analysis/Strategies
- [ ] Settings删除了Labs和API Key输入
- [ ] 8个预设策略已定义（systemMessage可以是TODO）
- [ ] 开发服务器能正常启动
- [ ] 所有页面能正常访问
- [ ] 核心功能（Scatter, Fusion, Chat）正常工作
- [ ] 无TypeScript类型错误
- [ ] Git推送成功

### Sprint 2完成标准

- [ ] 8个策略的Prompt全部完成
- [ ] Strategy Creator的LLM Chain配置完成
- [ ] Custom策略编辑器实现
- [ ] 策略能正常保存和加载
- [ ] 策略选择后，AI理解并按框架分析

### Sprint 3完成标准

- [ ] 应用了DESIGN.md的视觉规范
- [ ] Landing Page改造完成
- [ ] Analysis界面优化
- [ ] 移动端适配
- [ ] Lighthouse分数 > 90

---

## 📝 注意事项

### 重要提醒

1. **备份数据**
   - 改造前先commit当前代码
   - 创建新分支进行修改

2. **渐进式改造**
   - 按Task顺序执行
   - 每完成一个Task就测试
   - 不要一次性改太多

3. **类型安全**
   - 随时运行 `npx tsc --noEmit`
   - 修复所有类型错误

4. **Git提交**
   - 每个Task完成后提交
   - Commit message要清晰

5. **测试驱动**
   - 每个功能改完立即测试
   - 不要等到最后才测试

---

**准备开始执行！** 🚀
