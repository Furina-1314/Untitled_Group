# 沉浸式专注陪伴工具（可运行工程版）

## A. 产品 PRD（问题定义、目标、用户故事、非功能需求）
### 目标/输入/输出/边界/异常处理
- 目标：在 4 周内交付可运行 Web+PWA MVP，形成专注闭环（专注-音乐-陪伴-笔记-习惯-待办）。
- 输入：用户专注配置、音频配置、笔记/日记内容、习惯目标、待办事项。
- 输出：可结算会话、好感成长、可视化统计、可埋点数据。
- 边界：不做多人实时房间、语音视频、重社交、重 RPG。
- 异常处理：网络失败显示重试；计时器异常按“立即结束”结算。

### 问题定义
| 问题 | 目标 |
|---|---|
| 拖延与开始困难 | 30 秒内启动专注 |
| 分心中断 | 提供暂停/恢复与快进 |
| 孤独感 | 虚拟角色轻陪伴，低打扰 |
| 长期坚持困难 | 习惯追踪 + 连续打卡奖励 |

### 非功能需求
- 性能：页面首屏 <2.5s。
- 稳定性：核心 API 99% 可用。
- 安全：输入校验、最小数据采集。
- 伦理：文案温和，不做羞辱式提示。

## B. 信息架构（IA）与页面流转（文本流程图）
### 目标/输入/输出/边界/异常处理
- 目标：用户最短路径完成“开始-专注-结算-复盘”。
- 输入：导航行为、计时状态。
- 输出：主控台、笔记、日历、习惯、待办五页面可访问。
- 边界：MVP 单用户模式。
- 异常处理：无会话时隐藏结算按钮。

```text
主控台 -> 开始专注 -> 专注中(暂停/快进/结束)
专注完成 -> 休息互动 -> 下一轮
主控台 -> 笔记页 / 日历页 / 习惯页 / 待办页
```

## C. MVP 功能清单（P0/P1/P2）
### 目标/输入/输出/边界/异常处理
- 目标：明确 4 周可交付范围。
- 输入：业务优先级与开发工作量。
- 输出：P0/P1/P2 列表。
- 边界：P0 必交付。
- 异常处理：延期优先砍 P2。

| 级别 | 内容 |
|---|---|
| P0 | 番茄钟（暂停/快进/立即结束）、音频混音、本地音乐导入、角色陪伴、笔记、习惯打勾、待办 CRUD、API、埋点 |
| P1 | 日历日记深度筛选、剧情片段更多分支、PWA 完整离线 |
| P2 | 智能推荐时长/音频、跨端同步优化 |

不做：多人房间、语音视频、复杂社交。

## D. 详细交互流程
### 目标/输入/输出/边界/异常处理
- 目标：把关键交互做成状态机。
- 输入：模式、时长、按钮动作。
- 输出：session 状态与奖励。
- 边界：专注中不弹重交互。
- 异常处理：按钮幂等，重复点击不重复结算。

1. 开始专注：选择 25/45/60 或自定义 -> `POST /api/focus/start`。
2. 专注中：支持暂停、快进、立即结束 -> `POST /api/focus/action`。
3. 休息互动：角色给 1 条短句，夜间降刺激。
4. 复盘：`POST /api/focus/finish` 返回积分/好感/剧情触发。

## E. 虚拟人物养成系统设计
### 目标/输入/输出/边界/异常处理
- 目标：降低孤独感，保持低打扰。
- 输入：有效专注完成次数、连续天数、夜间配置。
- 输出：Lv1~Lv50、互动语气、剧情解锁。
- 边界：互动可静默或隐藏。
- 异常处理：连续失败仅给恢复建议。

- 等级：Lv1~Lv50，每级 100 好感。
- 状态机：`idle -> focus_encourage -> break_chat -> summary`。
- 剧情：连续 7 天每天>=1 个有效番茄，触发特殊剧情。

## F. 数据库模型（草案）
### 目标/输入/输出/边界/异常处理
- 目标：支持 Windows 平台可用的 SQLite 或未来 Supabase Postgres 迁移。
- 输入：会话/笔记/习惯/待办/埋点。
- 输出：标准数据表与索引。
- 边界：MVP 单用户。
- 异常处理：关键写入事务。

| 表 | 关键字段 |
|---|---|
| focus_sessions | id, mode, planned_focus_min, elapsed_sec, status, started_at |
| notes | id, session_id, title, content, tags, created_at |
| diary_entries | id, date, title, content |
| habits | id, title, checked, date |
| todos | id, content, due_date, done |
| companion_profile | level, affinity_total, night_mode |
| events | event_name, properties, event_time |

## G. API 设计
### 目标/输入/输出/边界/异常处理
- 目标：前后端合约稳定可迭代。
- 输入：JSON 参数。
- 输出：统一 `{code,data,message}`。
- 边界：MVP REST。
- 异常处理：参数非法返回 4xx。

| 接口 | 方法 | 用途 |
|---|---|---|
| /api/focus/start | POST | 新建会话 |
| /api/focus/action | POST | pause/resume/fast_forward/end_now |
| /api/focus/finish | POST | 结算积分好感 |
| /api/notes | GET/POST | 笔记查询与创建 |
| /api/habits/check | POST | 目标打勾 |
| /api/todos | GET/POST | 待办查询与新增 |
| /api/track | POST | 埋点上报 |

错误码：40001 参数错误、42201 动作非法、50001 服务异常。

## H. 前端页面与组件树
### 目标/输入/输出/边界/异常处理
- 目标：可运行、可扩展组件化。
- 输入：UI 操作 + API 数据。
- 输出：页面渲染与状态更新。
- 边界：MVP 轻量 UI。
- 异常处理：失败提示 + 重试。

```text
app/
  page.tsx (主控台)
  notes/page.tsx
  calendar/page.tsx
  habits/page.tsx
  todos/page.tsx
components/
  FocusTimer.tsx
  AudioPanel.tsx
  CompanionCard.tsx
  QuickNote.tsx
  TodoCard.tsx
```

## I. 埋点方案（>=10）
### 目标/输入/输出/边界/异常处理
- 目标：支持漏斗与留存分析。
- 输入：用户行为。
- 输出：标准事件。
- 边界：不采集敏感正文。
- 异常处理：失败补发。

事件：
1) focus_start_clicked
2) focus_started
3) focus_paused
4) focus_resumed
5) focus_fast_forward
6) focus_end_now
7) focus_finished
8) audio_preset_saved
9) local_music_imported
10) companion_prompt_shown
11) note_created
12) habit_checked
13) todo_created
14) todo_checked

## J. 指标体系
### 目标/输入/输出/边界/异常处理
- 目标：形成增长与质量看板。
- 输入：会话事实 + 埋点。
- 输出：NSM、漏斗、留存、质量指标。
- 边界：MVP 基础统计。
- 异常处理：数据延迟标注。

- 北极星：周有效专注分钟（WAFM）
- 漏斗：访问主控台->开始专注->完成结算->当日第2个完成
- 留存：D1/D7/D30
- 质量：完成率、快进率、立即结束率、互动静默率

## K. 验收标准（GWT）
### 目标/输入/输出/边界/异常处理
- 目标：可测可验收。
- 输入：业务规则。
- 输出：Given/When/Then。
- 边界：每模块>=3条。
- 异常处理：失败必须可复现。

- 专注
  1. Given 25 分钟，When 完成，Then +10 积分/+10 好感（含倍率）。
  2. Given 不足25分钟，When 结束，Then 不发奖励。
  3. Given 点击快进，When 到达目标，Then 可进入下一轮。
- 音乐
  1. Given 导入 mp3，When 选择文件，Then 前端显示文件名。
  2. Given 调整白噪音，When 拖动滑块，Then 数值立即更新。
  3. Given 调整混音，When 变更比例，Then 保持实时渲染。
- 角色
  1. Given Lv1，When 开始专注，Then 显示温和鼓励。
  2. Given 夜间模式，When 休息，Then 低刺激文案。
  3. Given 连续 7 天完成，When 结算，Then 触发特殊剧情标识。
- 笔记/日历
  1. Given 会话中创建笔记，When 保存，Then 可绑定 session_id。
  2. Given 新建多个笔记页，When 切换，Then 内容独立。
  3. Given 日历日期，When 添加日记，Then 该日期可回看。
- 习惯
  1. Given 目标完成，When 点击按钮，Then 展示对勾。
  2. Given 连续天数增长，When 查看，Then 数值递增。
  3. Given 中断一天，When 次日查看，Then streak 重算。
- 待办
  1. Given 新建待办，When 保存，Then 列表新增。
  2. Given 设置截止日，When 展示，Then 日期可见。
  3. Given 勾选完成，When 刷新视图，Then 状态为 done。

## L. 测试策略
### 目标/输入/输出/边界/异常处理
- 目标：保障 MVP 可发布。
- 输入：函数、API、页面。
- 输出：单元/集成/E2E 报告。
- 边界：先覆盖主路径。
- 异常处理：P0 缺陷优先修复。

- 单元：`calcReward`（阈值、倍率、深度模式）。
- 集成：focus API start/action/finish。
- E2E：主控台开始->暂停->快进->结算。
- 异常：非法参数、空内容、超大输入。

## M. 风险与合规
### 目标/输入/输出/边界/异常处理
- 目标：降低隐私与内容风险。
- 输入：用户行为与文本。
- 输出：合规策略。
- 边界：MVP 仅必要采集。
- 异常处理：违规文案可即时下线。

- 隐私：笔记正文不入埋点。
- 内容：禁止羞辱/PUA/负罪文案。
- 健康：夜间弱刺激互动。

## N. 4 周开发计划
### 目标/输入/输出/边界/异常处理
- 目标：4 周上线 MVP。
- 输入：PM/FE/BE/QA 角色。
- 输出：每周里程碑。
- 边界：Week2 冻结需求。
- 异常处理：延期砍 P2。

| 周次 | 交付 |
|---|---|
| W1 | 架构与页面骨架/API 契约 |
| W2 | 专注+音频+笔记+待办 |
| W3 | 陪伴+习惯+日历+埋点 |
| W4 | 测试/优化/发布 |

## O. 二期路线图
### 目标/输入/输出/边界/异常处理
- 目标：扩展能力但保持专注优先。
- 输入：MVP 数据反馈。
- 输出：扩展计划。
- 边界：不走重社交。
- 异常处理：灰度发布。

- 二期功能：角色剧情扩展、音频智能推荐、跨端同步、离线增强。

## 为什么这样设计
1. 奖励阈值“25 分钟起算”，可防止短时刷分。
2. 支持暂停/快进/立即结束，符合真实学习场景。
3. Lv1~Lv50 细粒度成长，满足长期陪伴但不重游戏。
4. 将待办与习惯并列，解决“知道要做但未拆行动”的执行断层。

## 自检清单
- [x] 覆盖核心模块（专注、音频、陪伴、笔记/日历、习惯、待办）
- [x] 提供 MVP/二期边界
- [x] 提供数据库与 API 草案
- [x] 提供埋点与指标
- [x] 提供 Given/When/Then
- [x] 满足轻养成、低打扰、专注优先
