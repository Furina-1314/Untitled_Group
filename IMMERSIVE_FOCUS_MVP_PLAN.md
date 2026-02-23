# 沉浸式专注陪伴工具（Web + PWA）可落地开发方案

> 版本：v1.0（MVP 4 周交付）  
> 技术栈：Next.js + TypeScript + TailwindCSS + Supabase（Auth/Postgres/Storage/Edge Functions）

---

## A. 产品 PRD（问题定义、目标、用户故事、非功能需求）

### A1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：构建“专注优先、低打扰陪伴”的番茄钟产品，解决拖延、分心、孤独、难坚持问题。
- **输入**：用户身份、番茄配置、环境音配置、互动开关、目标习惯配置。
- **输出**：可追踪的专注会话、奖励与好感增量、复盘数据、可执行迭代依据。
- **边界**：MVP 不含多人实时、语音视频、复杂社交、重 RPG。
- **异常处理**：断网/后台切换/刷新后可恢复会话状态；失败会话给恢复建议而非惩罚。

### A2. 问题定义
| 痛点 | 现象 | 机会点 |
|---|---|---|
| 拖延与分心 | 开始难、中途频繁切走 | 低门槛启动+中断判定+恢复流程 |
| 孤独感 | 长时间独学动力下降 | 虚拟人物 A 轻陪伴、非侵入互动 |
| 难坚持 | 三天热度后放弃 | 习惯目标+连续达成可视化+温和反馈 |
| 工具碎片化 | 番茄钟、笔记、音乐分散 | 一体化闭环（专注-记录-复盘） |

### A3. 产品目标（MVP）
1. 让用户在 30 秒内发起一次专注。
2. 提升“首周有效专注天数”与“D7 留存”。
3. 验证“陪伴互动”对完成率的正向贡献（可埋点对照）。

### A4. 核心用户故事（摘录）
- 作为备考学生，我希望一键开始 25 分钟专注并听雨声，这样我能快速进入状态。
- 作为自由职业者，我希望在休息时收到简短鼓励，而专注中不被打断。
- 作为长期用户，我希望看到周/月专注趋势，并知道自己是否在接近目标。
- 作为注重隐私用户，我希望可关闭互动并知道角色文案为 AI/系统生成。

### A5. 非功能需求
- 性能：核心页面 LCP < 2.5s（4G）、交互响应 < 200ms。
- 可靠性：会话状态恢复成功率 > 99%。
- 安全：RLS 全表启用，用户仅访问自己的数据。
- 可观测：关键链路埋点覆盖率 > 95%。
- 可迁移：数据模型避免前端耦合字段，便于 iOS/Android 复用。

---

## B. 信息架构（IA）与页面流转（文本流程图）

### B1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：最短路径完成“开始专注→完成→复盘”。
- **输入**：导航行为、深链参数、当前会话状态。
- **输出**：可恢复的页面状态机与导航路径。
- **边界**：MVP 保持 6 个主页面。
- **异常处理**：未登录访问受限页跳转登录；异常会话进入恢复弹层。

### B2. IA
1. 登录/注册（Auth）
2. 主控台（Home：计时器+角色 A+音频）
3. 笔记（Notes）
4. 习惯与统计（Habits & Analytics）
5. 角色成长（Companion）
6. 设置（Settings：互动开关、夜间模式、提醒）

### B3. 页面流转（文本流程图）
```text
[未登录] -> [登录/注册] -> [主控台]
[主控台] --开始专注--> [专注中]
[专注中] --完成--> [休息中互动卡片] --继续--> [下一轮专注]
[专注中] --中断>3min--> [失败结算+恢复建议]
[主控台] --写想法--> [快速笔记抽屉(关联session)]
[主控台] --查看复盘--> [习惯与统计]
[主控台] --查看角色--> [角色成长页]
[任意页] --设置--> [设置页]
```

---

## C. MVP 功能清单（P0/P1/P2 分级，含不做清单）

### C1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：锁定 4 周必交付范围，降低蔓延。
- **输入**：需求优先级、开发人力、依赖复杂度。
- **输出**：P0/P1/P2 与 Out-of-Scope 清单。
- **边界**：仅保留可验证功能。
- **异常处理**：延期时优先砍 P2，再砍 P1，P0 不动。

| 优先级 | 功能 | 验收阈值 |
|---|---|---|
| P0 | 番茄钟（标准/深度）、中断判定、奖励结算 | 完整链路可用，失败判定准确率 100% |
| P0 | 音乐白噪音混音与预设保存 | 可保存/读取预设，切换耗时 < 300ms |
| P0 | 角色 A 轻互动（开始鼓励/休息互动/等级解锁） | 互动可关闭，文案透明标识 AI/系统生成 |
| P0 | 快速笔记并关联 session | 关联成功率 > 99% |
| P0 | 习惯目标+日周月统计+连续打卡 | 连续天数计算正确 |
| P0 | 埋点与看板基础指标 | 10+ 事件可追踪 |
| P1 | 夜间低刺激策略（可配置时段） | 夜间互动频率降低生效 |
| P1 | 特殊剧情（7 天连续触发） | 触发去重正确 |
| P1 | PWA 离线壳与安装引导 | 可安装、基础缓存可用 |
| P2 | 多角色皮肤、更多剧情分支 | 不影响主链路 |
| P2 | 智能推荐音频预设 | 可灰度上线 |

**不做清单（MVP）**：多人实时房间、语音/视频、复杂社交、重剧情 RPG、跨用户排行榜。

---

## D. 详细交互流程（开始专注、专注中、休息互动、复盘）

### D1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：明确状态迁移与用户感知反馈。
- **输入**：计时参数、模式、互动开关、系统时间、页面可见性。
- **输出**：session 状态（running/interrupted/completed/failed）、奖励结果、UI反馈。
- **边界**：休息互动不侵入专注阶段。
- **异常处理**：页面关闭后重进可恢复倒计时（以服务端时间校准）。

### D2. 流程细节
1. **开始专注**
   - 选择时长（25/45/60/自定义）、休息时长（5/10/自定义）、模式（标准/深度）。
   - 点击开始：创建 `focus_session`，状态=running，记录 `started_at`。
   - 角色 A 触发 1 条鼓励（可静默）。
2. **专注中**
   - 显示倒计时、环境音控制、快速笔记入口。
   - 若切到后台，开始中断计时；累计 >180 秒判定 failed。
3. **休息互动**
   - 完成后进入 break，弹出 1~2 句轻互动卡片；支持“稍后再看”。
   - 不出现长对话，不阻断下轮启动。
4. **复盘结算**
   - 展示本轮时长、积分、好感、连续数、建议文案。
   - 失败仅发 20% 积分，不发剧情奖励。

---

## E. 虚拟人物养成系统设计（等级、人格维度、状态机、剧情解锁规则）

### E1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：通过“轻陪伴”提升坚持率，不制造焦虑。
- **输入**：有效专注时长、连续天数、夜间配置、互动偏好。
- **输出**：等级、语气包、剧情片段解锁状态。
- **边界**：不做重度数值养成和强制任务。
- **异常处理**：好感到日上限后提示“今日已满，明天继续”。

### E2. 等级与好感（Lv1~Lv10）
- 每 100 好感升 1 级（Lv10 封顶，超出转为积分）。
- 日好感上限 200。
- 有效专注奖励（25 分钟基准）：+10 积分、+10 好感；按时长比例线性换算。
- 深度模式系数 1.1；连续倍率：1~3=1.0，4~6=1.2，7+=1.3。
- 同日同短时长（<=15 分钟）第 6 次起奖励 *0.8。

### E3. 人格维度
| 维度 | 低等级表达 | 高等级表达 |
|---|---|---|
| 陪伴温度 | 简短鼓励 | 更懂用户语境的共情鼓励 |
| 主动性 | 仅在关键节点出现 | 休息时提供 1 条可选建议 |
| 反馈深度 | 描述结果 | 结合趋势给恢复策略 |

### E4. 状态机
`idle -> focusing_silent -> break_chat -> summary_feedback -> idle`
- 若用户关闭互动：`idle -> focusing_silent -> summary_minimal -> idle`
- 夜间模式：`break_chat` 降级为“安静提示卡”。

### E5. 剧情解锁规则
- 普通剧情：Lv2/Lv4/Lv6/Lv8/Lv10 各解锁 1 段。
- 特殊剧情：连续 7 天每天 >=1 个完成番茄触发 1 段（每自然月最多 1 次）。
- 失败场景：不扣好感，不给惩罚；提供“下一次从 10 分钟微番茄开始”的建议。

---

## F. 数据库模型（表结构、字段、索引、关系）

### F1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：提供可扩展、可审计、可埋点的数据底座（优先 MVP）。
- **输入**：用户行为事件、会话结算、互动内容、习惯配置。
- **输出**：标准化关系模型 + 核心索引 + RLS 策略。
- **边界**：MVP 以单用户域模型为主，不含社交关系。
- **异常处理**：关键写入走事务；结算幂等键防重复发奖。

### F2. 实体关系（简版）
- `users` 1 - n `focus_sessions`
- `focus_sessions` 1 - n `notes`
- `users` 1 - n `audio_presets`
- `users` 1 - 1 `companion_profiles`
- `users` 1 - n `companion_story_unlocks`
- `users` 1 - n `habit_goals`
- `users` 1 - n `habit_checkins`
- `users` 1 - n `event_logs`

### F3. 表结构（MVP）

#### 1) `users`（映射 auth.users）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK, FK->auth.users.id | 用户ID |
| display_name | text |  | 昵称 |
| timezone | text | default 'Asia/Shanghai' | 时区 |
| created_at | timestamptz | default now() | 创建时间 |

索引：`idx_users_created_at(created_at)`

#### 2) `focus_sessions`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | 会话ID |
| user_id | uuid | FK users(id), not null | 用户 |
| mode | text | check in ('standard','deep') | 模式 |
| planned_focus_min | int | not null | 计划专注分钟 |
| planned_break_min | int | not null | 计划休息分钟 |
| actual_focus_sec | int | default 0 | 实际专注秒 |
| interrupt_sec | int | default 0 | 中断累计秒 |
| status | text | check in ('running','completed','failed','abandoned') | 状态 |
| streak_count | int | default 1 | 当日连续完成数 |
| reward_points | int | default 0 | 积分 |
| reward_affinity | int | default 0 | 好感 |
| no_story_reward | bool | default false | 是否禁剧情奖励 |
| idempotency_key | text | unique | 防重 |
| started_at | timestamptz | not null | 开始时间 |
| ended_at | timestamptz |  | 结束时间 |
| created_at | timestamptz | default now() | 创建时间 |

索引：
- `idx_focus_sessions_user_started(user_id, started_at desc)`
- `idx_focus_sessions_user_status(user_id, status)`
- `idx_focus_sessions_user_day(user_id, (date(started_at)))`

#### 3) `session_interrupt_logs`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | 记录ID |
| session_id | uuid | FK focus_sessions(id) | 会话 |
| interrupt_start | timestamptz | not null | 中断开始 |
| interrupt_end | timestamptz |  | 中断结束 |
| duration_sec | int | default 0 | 时长 |
| reason | text |  | 如 tab_hidden/app_background |

索引：`idx_interrupt_session(session_id)`

#### 4) `notes`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | 笔记ID |
| user_id | uuid | FK users(id) | 用户 |
| session_id | uuid | FK focus_sessions(id) | 关联番茄 |
| content | text | not null | 正文 |
| tags | text[] | default '{}' | 标签 |
| created_at | timestamptz | default now() | 创建时间 |

索引：
- `idx_notes_user_created(user_id, created_at desc)`
- `idx_notes_tags_gin using gin(tags)`
- FullText: `idx_notes_fts using gin(to_tsvector('simple', content))`

#### 5) `audio_presets`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | 预设ID |
| user_id | uuid | FK users(id) | 用户 |
| name | text | not null | 预设名 |
| noise_type | text | check in ('rain','cafe','forest','none') | 白噪音 |
| music_type | text | check in ('lofi','light','none') | 音乐 |
| noise_volume | int | check 0~100 | 白噪音音量 |
| music_volume | int | check 0~100 | 音乐音量 |
| mix_ratio | numeric(4,2) | check 0~1 | 混音比例 |
| created_at | timestamptz | default now() | 创建时间 |

索引：`idx_audio_presets_user(user_id, created_at desc)`

#### 6) `companion_profiles`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| user_id | uuid | PK, FK users(id) | 用户 |
| level | int | default 1 | Lv1~Lv10 |
| affinity_total | int | default 0 | 总好感 |
| affinity_today | int | default 0 | 今日好感 |
| last_affinity_reset_date | date |  | 日重置 |
| interaction_enabled | bool | default true | 互动开关 |
| night_mode_enabled | bool | default true | 夜间低刺激 |
| night_start | time | default '22:30' | 夜间开始 |
| night_end | time | default '07:00' | 夜间结束 |
| persona_seed | text |  | 语气变体 |
| updated_at | timestamptz | default now() | 更新时间 |

索引：`idx_companion_level(level)`

#### 7) `companion_story_unlocks`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | ID |
| user_id | uuid | FK users(id) | 用户 |
| story_code | text | not null | 剧情编码 |
| unlock_type | text | check in ('level','streak7') | 解锁类型 |
| unlocked_at | timestamptz | default now() | 解锁时间 |
| month_bucket | date |  | 月去重 |

唯一约束：`(user_id, story_code)`、`(user_id, unlock_type, month_bucket)`

#### 8) `habit_goals`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | 目标ID |
| user_id | uuid | FK users(id) | 用户 |
| goal_type | text | check in ('weekly_focus_min','daily_pomodoro_count') | 类型 |
| target_value | int | not null | 目标值 |
| active | bool | default true | 是否启用 |
| created_at | timestamptz | default now() | 创建时间 |

索引：`idx_habit_goals_user_active(user_id, active)`

#### 9) `habit_checkins`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | uuid | PK | ID |
| user_id | uuid | FK users(id) | 用户 |
| checkin_date | date | not null | 打卡日期 |
| completed_pomodoro_count | int | default 0 | 当日完成数 |
| completed_focus_min | int | default 0 | 当日专注分钟 |
| streak_days | int | default 0 | 连续天数 |
| reward_claimed | bool | default false | 是否领连续奖励 |

唯一约束：`(user_id, checkin_date)`

#### 10) `event_logs`
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | bigserial | PK | 事件ID |
| user_id | uuid | FK users(id) | 用户 |
| event_name | text | not null | 事件名 |
| event_time | timestamptz | default now() | 事件时间 |
| session_id | uuid | nullable | 关联会话 |
| properties | jsonb | default '{}'::jsonb | 属性 |
| client_ts | bigint |  | 客户端时间戳 |

索引：
- `idx_event_logs_user_time(user_id, event_time desc)`
- `idx_event_logs_name_time(event_name, event_time desc)`
- `idx_event_logs_props_gin using gin(properties)`

### F4. 奖励结算 SQL 规则（Edge Function 内执行）
- `base_points = floor(actual_focus_sec / 1500 * 10)`
- `base_affinity = floor(actual_focus_sec / 1500 * 10)`
- `mode_coef = case deep then 1.1 else 1.0 end`
- `streak_coef = case streak 1-3:1.0, 4-6:1.2, >=7:1.3 end`
- `anti_farm_coef = if short_repeat_count>=6 then 0.8 else 1.0`
- `failed => points = floor(base_points*0.2), affinity=0, no_story_reward=true`
- `affinity_today` 封顶 200。

### F5. RLS 策略（摘要）
- 所有业务表 `user_id = auth.uid()` 才可 `select/insert/update/delete`。
- `event_logs` 仅允许本用户写入与读取，禁止跨用户聚合读取（聚合通过服务角色离线处理）。

---

## G. API 设计（接口清单、入参/出参、错误码）

### G1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：提供前后端解耦 API 合约，支持 Web/PWA/未来 App 复用。
- **输入**：JWT、业务参数、幂等键。
- **输出**：统一 JSON 响应、错误码、可追踪 request_id。
- **边界**：MVP 以 Supabase RPC + Edge Function 为主。
- **异常处理**：统一错误结构 `{code,message,details,request_id}`。

### G2. 通用约定
- Base: `/functions/v1`
- Auth: `Authorization: Bearer <access_token>`
- Header: `x-idempotency-key`（结算/创建关键写入必填）
- 成功：`{code:0,data:{...},request_id}`
- 失败：`{code:业务码,message:'',details:{},request_id}`

### G3. 接口清单（MVP）

| 接口 | 方法 | 说明 |
|---|---|---|
| `/focus/start` | POST | 创建专注会话 |
| `/focus/interrupt` | POST | 上报中断开始/结束 |
| `/focus/finish` | POST | 结束并结算（完成/失败） |
| `/focus/recover` | GET | 获取进行中会话恢复状态 |
| `/audio/presets` | GET/POST | 预设列表/创建 |
| `/audio/presets/{id}` | PATCH/DELETE | 更新/删除预设 |
| `/notes` | GET/POST | 查询/创建笔记 |
| `/notes/{id}` | PATCH/DELETE | 更新/删除笔记 |
| `/habits/goals` | GET/POST | 目标列表/创建 |
| `/habits/checkin/today` | GET | 今日打卡数据 |
| `/companion/profile` | GET/PATCH | 角色配置与开关 |
| `/companion/story/unlocks` | GET | 已解锁剧情 |
| `/analytics/summary` | GET | 日/周/月统计 |
| `/events/track` | POST | 客户端埋点上报 |

### G4. 关键接口定义

#### 1) POST `/focus/start`
**入参**
```json
{
  "mode":"standard|deep",
  "planned_focus_min":25,
  "planned_break_min":5,
  "audio_preset_id":"uuid|null"
}
```
**出参**
```json
{
  "code":0,
  "data":{"session_id":"uuid","status":"running","started_at":"..."}
}
```
**异常**：`40001 INVALID_DURATION`、`40101 UNAUTHORIZED`

#### 2) POST `/focus/interrupt`
**入参**
```json
{
  "session_id":"uuid",
  "action":"start|end",
  "reason":"tab_hidden|app_background"
}
```
**出参**：返回累计 `interrupt_sec` 与是否 `auto_failed`。
**异常**：`40401 SESSION_NOT_FOUND`、`40901 SESSION_NOT_RUNNING`

#### 3) POST `/focus/finish`
**入参**
```json
{
  "session_id":"uuid",
  "finish_type":"completed|manual_abort|timeout_fail",
  "actual_focus_sec":1500
}
```
**出参**
```json
{
  "code":0,
  "data":{
    "status":"completed",
    "reward_points":13,
    "reward_affinity":12,
    "affinity_today":88,
    "level":3,
    "story_unlocked":["L2_SEG_A"]
  }
}
```
**异常**：`40902 IDEMPOTENCY_CONFLICT`、`42201 INVALID_SESSION_STATE`

#### 4) GET `/analytics/summary?range=week`
**出参**：`completed_sessions`、`focus_minutes`、`completion_rate`、`streak_days`、`goal_progress`。

#### 5) POST `/events/track`
**入参**：`event_name` + `properties` + `client_ts` + `session_id?`
**限流**：同用户 60 req/min，超限返回 `42901 RATE_LIMITED`。

### G5. 错误码
| 错误码 | 含义 | 处理建议 |
|---|---|---|
| 40001 | 时长参数非法 | 前端限制 1~180 分钟 |
| 40101 | 未授权 | 刷新 token 或重新登录 |
| 40301 | RLS 拒绝 | 校验资源归属 |
| 40401 | 会话不存在 | 提示刷新页面 |
| 40901 | 会话状态冲突 | 拉取 recover 状态 |
| 40902 | 幂等键冲突 | 使用原结果回放 |
| 42201 | 业务状态不允许 | 前端状态机纠正 |
| 42901 | 请求过频 | 指数退避重试 |
| 50001 | 服务器异常 | 上报 request_id |

---

## H. 前端页面与组件树（页面级+核心组件级）

### H1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：组件可复用、状态可预测、PWA 友好。
- **输入**：API 数据、用户交互、本地缓存。
- **输出**：页面渲染、状态同步、交互反馈。
- **边界**：MVP 使用 App Router + Server Actions（可选）。
- **异常处理**：接口失败显示可恢复 toast + 重试按钮。

### H2. 页面与组件
```text
app/
  (auth)/login
  (main)/home
    - FocusTimerPanel
    - ModeSelector
    - AudioMixer
    - CompanionWidget
    - QuickNoteDrawer
    - SessionResultModal
  (main)/notes
    - NoteEditor
    - TagFilterBar
    - NoteList
  (main)/habits
    - GoalCards
    - HeatmapCalendar
    - TrendCharts
  (main)/companion
    - LevelProgress
    - StoryTimeline
    - InteractionToggleCard
  (main)/settings
    - NightModeConfig
    - ReminderConfig
    - PrivacyCard
```

核心状态管理：
- `focusSessionStore`（zustand）：会话状态机。
- `audioStore`：混音参数与预设。
- `companionStore`：互动开关、等级信息。

---

## I. 埋点方案（至少 10 个核心事件，含事件属性）

### I1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：支撑漏斗、留存、质量评估与实验分析。
- **输入**：前端行为、后端结算结果。
- **输出**：标准事件流与属性字典。
- **边界**：不采集敏感正文（笔记内容不入埋点）。
- **异常处理**：离线缓存队列，恢复网络后批量补发。

### I2. 事件列表（14个）
| 事件名 | 触发时机 | 核心属性 |
|---|---|---|
| `focus_start_clicked` | 点击开始按钮 | mode, planned_focus_min, planned_break_min |
| `focus_session_started` | 会话创建成功 | session_id, preset_id |
| `focus_interrupted` | 中断开始 | session_id, reason |
| `focus_interruption_resumed` | 中断结束 | session_id, interrupt_duration_sec |
| `focus_session_finished` | 结算完成 | status, actual_focus_sec, reward_points, reward_affinity |
| `focus_session_failed` | 失败判定 | fail_reason, interrupt_sec |
| `audio_preset_saved` | 保存预设 | noise_type, music_type, mix_ratio |
| `companion_prompt_shown` | 展示角色文案 | scene(start/break/summary), level |
| `companion_interaction_toggled` | 开关互动 | enabled, night_mode_enabled |
| `note_created` | 创建笔记 | session_bound(bool), tag_count |
| `habit_goal_created` | 新建目标 | goal_type, target_value |
| `habit_checkin_updated` | 每日打卡更新 | checkin_date, streak_days |
| `story_unlocked` | 剧情解锁 | story_code, unlock_type |
| `analytics_viewed` | 查看统计页 | range(day/week/month) |

---

## J. 指标体系（北极星指标 + 漏斗 + 留存 + 质量指标）

### J1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：形成可迭代经营面板。
- **输入**：事件日志、会话事实表、目标达成表。
- **输出**：周报指标与实验判定口径。
- **边界**：MVP 先做基础看板，不做复杂归因。
- **异常处理**：数据延迟 > 2h 时看板标注“数据处理中”。

### J2. 指标定义
- **北极星指标 NSM**：`周有效专注总分钟数（WAFM）`。
- **核心漏斗**：访问主控台 -> 点击开始 -> 会话完成 -> 当日第2个完成 -> D7再完成。
- **留存**：D1/D7/D30（以“完成至少1个番茄”为活跃定义）。
- **质量指标**：
  - 会话完成率 = completed / started
  - 中断失败率 = fail_by_interrupt / started
  - 人均日有效分钟
  - 互动关闭率（过高说明打扰）
  - 夜间时段使用后睡前失败率

---

## K. 验收标准（Given/When/Then）

### K1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：将“功能可用”转化为可测试条款。
- **输入**：需求规则、边界条件。
- **输出**：可自动化/手工执行的 GWT 条目。
- **边界**：每核心模块至少3条。
- **异常处理**：用例失败必须关联缺陷单与重现步骤。

### K2. GWT 条目

#### 1) 专注系统
1. Given 用户开始 25 分钟标准模式，When 正常完成，Then 发放 >=10 积分与 >=10 好感（受倍率影响）。
2. Given 会话中断累计 181 秒，When 系统检测，Then 状态为 failed 且仅发 20% 积分、0 好感。
3. Given 同日短时长会话已完成 5 次，When 第 6 次再完成短时长，Then 奖励系数自动 *0.8。

#### 2) 音乐环境
1. Given 用户配置雨声 70/Lo-fi 30，When 保存预设，Then 预设列表可见且重进页面可恢复。
2. Given 会话进行中调整音量，When 拖动滑杆，Then 音量实时变化且不重启计时。
3. Given 预设被删除，When 刷新页面，Then 不再出现在可选列表。

#### 3) 虚拟人物 A
1. Given 用户开启互动，When 点击开始专注，Then 展示 1 条鼓励文案并标注 AI/系统生成。
2. Given 用户关闭互动，When 完成会话，Then 不展示对话，仅展示极简结算。
3. Given 连续 7 天每天 >=1 个完成番茄，When 第 7 天结算，Then 解锁特殊剧情一次。

#### 4) 笔记系统
1. Given 会话进行中，When 用户快速记录，Then 笔记自动绑定 session_id。
2. Given 用户输入标签“数学”，When 搜索标签，Then 返回包含该标签的笔记。
3. Given 删除笔记，When 列表刷新，Then 该条不可见且不可检索。

#### 5) 习惯追踪
1. Given 设置“每日2个番茄”，When 当日完成2个，Then 目标状态显示达成。
2. Given 连续多日完成至少1个，When 查看统计页，Then streak_days 正确递增。
3. Given 某日未完成，When 次日查看，Then 连续天数按规则中断并重新累计。

---

## L. 测试策略（单元测试、集成测试、E2E、异常场景）

### L1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：以最小成本覆盖高风险链路。
- **输入**：状态机、API、DB 规则、UI交互。
- **输出**：测试套件、覆盖率报告、缺陷清单。
- **边界**：MVP 覆盖关键链路优先于广度。
- **异常处理**：高优先缺陷（P0）24h 内修复回归。

### L2. 策略
- **单元测试**（Vitest）
  - 奖励计算器（倍率/上限/防刷）。
  - 会话状态机（running->failed/completed）。
  - 夜间模式判断函数。
- **集成测试**（Supabase 本地）
  - `focus_finish` 事务一致性与幂等。
  - RLS 访问控制。
- **E2E**（Playwright）
  - 登录->开始25分钟（mock快进）->完成->结算展示。
  - 会话中断超时失败路径。
  - 笔记绑定会话路径。
- **异常场景**
  - 网络抖动、重复提交、多标签页并发、客户端时间漂移。

---

## M. 风险与合规（隐私、安全、内容风险、防沉迷）

### M1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：降低法律/口碑/安全风险。
- **输入**：用户数据、AI 文案、使用时段。
- **输出**：合规策略与审计点。
- **边界**：MVP 仅采集必要最小数据。
- **异常处理**：发现违规文案可一键下线模板。

### M2. 风险控制
- 隐私：最小化采集；笔记正文不进埋点；提供数据导出与删除。
- 安全：RLS + JWT + HTTPS；敏感操作审计日志。
- 内容：禁止羞辱/PUA；连续失败仅恢复建议。
- 透明：所有角色对话处展示“AI/系统生成内容，仅供陪伴参考”。
- 防沉迷：夜间低刺激、可配置提醒、连续超长使用提示休息。

---

## N. 4 周开发计划（按周里程碑、角色分工、交付件）

### N1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：4 周上线可用 MVP。
- **输入**：团队角色（PM/FE/BE/QA/设计/数据）。
- **输出**：每周里程碑与可验收产物。
- **边界**：需求冻结窗口：第2周末。
- **异常处理**：风险项触发后启动降级方案（砍P2/P1）。

### N2. 周计划
| 周次 | 里程碑 | 角色分工 | 交付件 |
|---|---|---|---|
| Week1 | 需求冻结+架构搭建 | PM定PRD，BE建库与RLS，FE搭骨架，设计出高保真 | PRD v1、ERD、API草案、UI稿 |
| Week2 | 核心链路开发 | FE实现计时器/音频/笔记，BE完成focus与结算函数 | 可跑通“开始-完成-结算” |
| Week3 | 陪伴与习惯统计 | FE角色/统计页，BE剧情解锁与聚合接口，数据埋点 | 端到端主流程 + 埋点联调 |
| Week4 | 测试与发布 | QA回归/E2E，FE性能优化，BE安全审计，PM验收 | Release Candidate、上线清单、回滚预案 |

---

## O. 二期路线图（功能扩展与技术演进）

### O1. 模块定义（目标/输入/输出/边界/异常处理）
- **目标**：在不破坏“专注优先”前提下扩展增长能力。
- **输入**：MVP 指标表现、用户反馈、技术债。
- **输出**：二期功能包与架构演进路径。
- **边界**：仍不走重社交重游戏化。
- **异常处理**：新增功能须先灰度 + A/B。

### O2. 路线图
1. **产品扩展**：多角色主题、更多环境音库、轻量共学榜（非实时）。
2. **智能化**：根据历史完成率推荐时长与音频预设。
3. **跨端演进**：抽离 BFF/API SDK，复用至 React Native/Flutter。
4. **数据演进**：建设实验平台（feature flag + 指标归因）。

---

## 关键设计决策说明（Why）
1. **奖励按时长线性换算**：兼容 25/45/60 与自定义时长，减少“固定时长最优”刷分。  
2. **失败给20%积分但0好感**：保留努力反馈，避免“全无奖励”挫败，同时限制养成通道被刷。  
3. **好感日上限200**：控制用户节奏与防刷，降低沉迷风险。  
4. **互动默认可见但可一键关闭**：兼顾陪伴价值与专注优先原则。  
5. **夜间低刺激降级**：降低睡前认知负荷，符合健康与伦理要求。

---

## 自检清单
- [x] 1) 覆盖五大核心模块（专注、音乐环境、角色陪伴、笔记、习惯追踪）。
- [x] 2) 给出 MVP/二期边界。
- [x] 3) 提供数据库模型与 API 草案（含字段/索引/错误码）。
- [x] 4) 提供埋点方案与指标体系。
- [x] 5) 提供 Given/When/Then 验收标准。
- [x] 6) 满足轻养成、低打扰、专注优先原则。
