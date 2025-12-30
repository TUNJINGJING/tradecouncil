# TradeCouncil 定价分层方案

**Version:** 1.0 (Finalized)
**Date:** 2025-12-30

---

## 💰 定价结构

| **定价维度** | **$0 / 月<br>OBSERVER<br>体验与尝鲜** | **$39 / 月<br>TRADER<br>日常辅助分析** | **$99 / 月（推荐）<br>ARCHITECT<br>专家共识与深度策略** |
|---|---|---|---|
| **核心定位** | 体验产品，建立信任 | 单一资产日常分析 | 专业交易员深度研究 |
| | | | |
| **可用模型** | • **无限使用**：OpenRouter 免费模型<br>  - Gemini 2.0 Flash Experimental<br>  - Llama 3.3 70B<br>  - Qwen 2.5 72B<br>• **体验额度**：3次/月高级模型<br>  - GPT-4o, Claude 3.5 | • **主流模型无限使用**：<br>  - GPT-4o<br>  - Claude 3.5 Sonnet<br>  - Gemini 2.0 Flash (收费版)<br>  - DeepSeek R1 | • **所有顶级模型无限使用**：<br>  - Claude 4.5 Opus<br>  - GPT-5 (when available)<br>  - Gemini 2.0 Pro<br>  - DeepSeek V3<br>  - o1/o3<br>• **优先访问**最新模型 |
| | | | |
| **分析额度（Credit）** | • **免费模型**：每日 3 次<br>• **高级模型**：每月 3 次（重置） | • 每月 **500 积分**<br>  - 免费模型：0积分<br>  - 主流模型：1积分/次（500次）<br>  - 顶级模型：3积分/次（166次）<br>  - 不累积，月底清零 | • 每月 **1500 积分**<br>  - 免费模型：0积分（无限）<br>  - 主流模型：1积分/次（1500次）<br>  - 顶级模型：3积分/次（500次）<br>  - 可累积 1 个月（上限 3000） |
| | | | |
| **Council（多AI会诊）<br>并发模型数** | ⚠️ **限制体验**<br>• 每天 3 次使用权<br>• 仅支持 2 个免费模型并发<br>• 无 Fusion 功能 | ✅ **解锁 2-3 个模型并发**<br>• Ray Min: 1<br>• Ray Max: 3<br>• Ray Default: 2<br>• 支持所有主流模型 | ✅ **解锁 3-5 个模型并发**<br>• Ray Min: 1<br>• Ray Max: 5<br>• Ray Default: 3<br>• 支持所有顶级模型 |
| | | | |
| **Fusion（智能融合）** | ❌ **不可用** | ✅ **基础融合**<br>• Fuse（自动合成）<br>• 生成共识报告 | ✅ **高级融合（全部 4 种）**<br>• Fuse（自动合成）<br>• Guided（清单式引导）<br>• Compare（评估对比表）<br>• Custom（自定义融合逻辑） |
| | | | |
| **策略库** | ❌ **无策略库**<br>系统使用通用金融分析提示词 | ✅ **8 个预设策略（只读）**<br>• Scalping (2个)<br>• Day Trading (2个)<br>• Swing Trading (2个)<br>• Investing (2个)<br>• 示例提示词 | ✅ **8 个预设 + 自定义创建器**<br>• 所有预设策略<br>• **Strategy Creator**<br>• 保存自定义策略（最多 50 个）<br>• 策略导入/导出 |
| | | | |
| **图表分析（Vision）** | ✅ **基础图表识别**<br>• 免费 Vision 模型<br>  - Gemini 2.0 Flash<br>• 识别基本形态<br>  - 头肩顶、双底等<br>• 文字输出 | ✅ **深度形态识别**<br>• 主流 Vision 模型<br>  - GPT-4o Vision<br>  - Claude 3.5 Vision<br>• 多时间框架分析<br>• 关键位识别<br>• 指标叠加识别 | ✅ **多维度交叉验证**<br>• 所有顶级 Vision 模型<br>• **Council Vision**<br>  - 3-5 个模型同时分析图表<br>• Fusion 综合报告<br>• 细节放大分析 |
| | | | |
| **结果展示** | • 纯文本可复制粘贴<br>• 无导出功能 | ✅ **格式化输出**<br>• Markdown 格式<br>• JSON 导出<br>• 报告可视化 | ✅ **完整导出**<br>• 所有 TRADER 功能<br>• **分享链接**（带加密）<br>• 历史对比（Phase 3） |
| | | | |
| **历史记录** | • 仅保留 **7 天**<br>• 最多 10 条对话 | • 保留 **90 天**<br>• 无对话数量限制<br>• 按策略分类浏览 | • **永久保留**<br>• 无限对话<br>• 标签系统<br>• 搜索过滤<br>• 云端备份（Phase 2.5） |
| | | | |
| **响应速度** | • 标准队列<br>• 可能需要等待 5-10 秒 | • 标准队列<br>• 平均响应 < 3 秒 | • **优先队列**<br>• 平均响应 < 1 秒<br>• 高峰时段优先处理 |
| | | | |
| **其他特性** | • 聊天模式（基础对话）<br>• 语音输入<br>• 社区支持（Discord） | • 所有 OBSERVER 功能<br>• 多窗格并行（2 个窗格）<br>• Email 支持（48h 响应）<br>• 每月策略更新 | • 所有 TRADER 功能<br>• 多窗格并行（**4 个窗格**）<br>• **优先 Email 支持**（12h）<br>• **1对1 策略咨询**（每季度 1 次）<br>• **Beta 功能优先访问**<br>• **API 访问**（Phase 3） |
| | | | |
| **年付优惠** | - | **$390/年**<br>（省 $78，相当于 10 个月价格） | **$990/年**<br>（省 $198，相当于 10 个月价格） |

---

## 🔢 积分消耗模型

### 模型积分成本表

```typescript
const MODEL_CREDIT_COST = {
  // 免费模型（OpenRouter 免费层）
  'openrouter/google/gemini-2.0-flash-exp:free': 0,
  'openrouter/meta-llama/llama-3.3-70b-instruct:free': 0,
  'openrouter/qwen/qwen-2.5-72b-instruct:free': 0,

  // 主流模型
  'openai/gpt-4o': 1,
  'anthropic/claude-3.5-sonnet': 1,
  'google/gemini-2.0-flash': 0.5,
  'deepseek/deepseek-r1': 0.5,

  // 顶级模型
  'anthropic/claude-4.5-opus': 3,
  'openai/o1': 3,
  'openai/gpt-5': 4,
};
```

### 使用示例

**TRADER 用户（500 积分/月）：**
- 500 次 GPT-4o 分析，或
- 1000 次 Gemini 2.0 Flash 分析，或
- 166 次 Claude 4.5 Opus 分析，或
- 组合使用：250 次 GPT-4o + 500 次 Gemini Flash

**ARCHITECT 用户（1500 积分/月）：**
- 1500 次 GPT-4o 分析，或
- 500 次 Claude 4.5 Opus 分析，或
- 无限次免费模型分析（0 积分）+ 1500 积分用于顶级模型

---

## 🎯 成本控制策略

### 问题：顶级模型成本过高

**场景：** 用户大量使用 Claude Opus，可能导致成本超过订阅费用。

**解决方案：**

#### 方案 1：降低积分额度（已采用）
- TRADER: 500 积分（原 500）
- ARCHITECT: 1500 积分（原 2000）

**成本估算：**
- ARCHITECT 全部用 Opus：1500 / 3 = 500 次 × $0.20 = **$100**（接近 $99 售价）
- ARCHITECT 混合使用：750 次 GPT-4o ($37.5) + 250 次 Opus ($50) = **$87.5** ✅

#### 方案 2：动态定价（Phase 3 考虑）
- 基础积分池：1500 积分（主流模型）
- 顶级模型池：200 积分（专门用于 Opus/o1）

---

## 🚦 功能限制矩阵

### Council（多AI分析）限制

| Tier | 最小模型数 | 最大模型数 | 默认模型数 | 可用预设 | 每日使用限制 |
|------|-----------|-----------|-----------|---------|------------|
| OBSERVER | 2 | 2 | 2 | [2] | 3 次/日（仅免费模型） |
| TRADER | 1 | 3 | 2 | [2, 3] | 无限（扣积分） |
| ARCHITECT | 1 | 5 | 3 | [2, 3, 5] | 无限（扣积分） |

### Fusion 限制

| Tier | 可用融合方法 |
|------|-------------|
| OBSERVER | 无 |
| TRADER | Fuse（自动合成） |
| ARCHITECT | Fuse, Guided, Compare, Custom（全部 4 种） |

### 策略库限制

| Tier | 访问权限 |
|------|---------|
| OBSERVER | 无策略库（使用通用提示词） |
| TRADER | 8 个预设策略（只读，不可编辑） |
| ARCHITECT | 8 个预设 + 自定义创建器（最多保存 50 个） |

---

## 📊 实施优先级

### Phase 2.0: 基础认证（当前）
- ✅ 用户登录（Google OAuth）
- ✅ Supabase 集成
- ✅ 用户数据存储
- ⚠️ **所有功能暂时开放**（无付费墙）

### Phase 2.1: 付费墙 + 积分系统
- ⏳ 积分检查中间件
- ⏳ 功能分层限制
- ⏳ 使用仪表板
- ⏳ Stripe 集成
- ⏳ 定价页面

### Phase 2.5: 增强功能
- ⏳ 云端历史同步（ARCHITECT 专属）
- ⏳ PDF 导出
- ⏳ 策略回测

---

## 💡 关键决策记录

### 1. 免费用户的 Council 体验
**决策：** 允许每天 3 次，仅限 2 个免费模型并发
**理由：** 让用户体验核心差异化功能，但设置足够限制以触发升级意愿

### 2. 积分额度调整
**决策：** ARCHITECT 从 2000 降至 1500 积分
**理由：** 控制顶级模型成本，避免亏损

### 3. 策略库访问
**决策：** 免费用户完全无法访问策略库
**理由：** 策略库是高价值内容，作为付费核心吸引力

### 4. 本地存储优先
**决策：** Phase 2.0 不做云端同步
**理由：** 加快上线速度，云端同步作为 ARCHITECT 后续福利

### 5. 导出功能
**决策：** Phase 2.0 只提供现有功能（Markdown, JSON）
**理由：** PDF 导出需要额外开发，延后到 Phase 2.5

---

**End of Pricing Document**
