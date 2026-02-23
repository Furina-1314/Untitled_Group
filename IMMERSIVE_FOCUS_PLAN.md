# 沉浸式专注陪伴工具产品与实现方案

## A. 产品 PRD
- 目标：发布一体化专注工具，覆盖番茄钟、音乐环境、虚拟人物、笔记、日历、习惯、待办。
- 输入：用户配置、音频文件、笔记内容、习惯目标、待办内容。
- 输出：可持续追踪的专注记录、XP成长数据、全量可操作页面。
- 边界：不包含多人实时房间、语音通话、复杂社交。
- 异常处理：断网后本地持久化，恢复后继续使用。

## B. IA与流转
主控台 -> 开始专注(倒计时) -> 暂停/恢复/快进/立即结束结算
主控台 -> 笔记页(检索/编辑/删除)
主控台 -> 日历页(日记按日期增删改)
主控台 -> 习惯页(目标创建/打勾/删除)
主控台 -> 待办页(创建/编辑/截止日期/删除)

## C. 功能分级
- P0：全模块可用（专注、音频、陪伴、笔记、日历、习惯、待办）
- P1：云端同步、跨设备一致性
- P2：个性化推荐与更丰富剧情

## D. 交互流程
1. 开始番茄钟：选择时长与模式，进入倒计时。
2. 专注中：支持暂停、恢复、快进、立即结束。
3. 立即结束：按已完成时长折算XP并计入XP系统。
4. 完成后：进入休息态并展示复盘提示。

## E. 虚拟人物系统
- 等级：Lv1~Lv50。
- 语气：未开始时轻松、专注中认真督促、休息时鼓励。
- 语音：支持语音播报互动文案。
- 剧情：连续7天完成至少1轮触发特殊剧情。

## F. 数据模型
- focus_sessions、xp_profiles、notes、diaries、habits、todos、audio_tracks、events。
- 关键字段：created_at、updated_at、状态字段、关联session_id。
- 索引：按 user_id + created_at / date 建索引。

## G. API
- focus/start, focus/action, focus/finish
- notes CRUD
- diary CRUD
- habits CRUD + check
- todos CRUD
- track 上报

## H. 前端组件
- FocusTimer, AudioPanel, CompanionCard, QuickNote, TodoCard
- 页面：home/notes/calendar/habits/todos

## I. 埋点
focus_started, focus_paused, focus_resumed, focus_fast_forward, focus_end_now,
focus_settled, note_saved, diary_saved, habit_checked, todo_updated,
audio_track_added, audio_track_deleted, audio_next_track, companion_interacted

## J. 指标
- 北极星：周有效专注分钟
- 漏斗：访问->开始->完成->次日回访
- 留存：D1/D7/D30
- 质量：完成率、立即结束率、任务达成率

## K. 验收标准
- 专注：倒计时准确、立即结束可结算XP、快进可进入下一状态
- 音乐：导入后可播放/下一首/删除，音量生效
- 笔记：保存后笔记页可见，含创建和编辑时间
- 日历：按日期创建和编辑日记
- 习惯：可创建目标并点击显示对勾
- 待办：可编辑内容和截止日期并删除

## L. 测试策略
- 单元：奖励计算/等级计算
- 集成：API CRUD
- E2E：主流程与跨页面数据一致性
- 异常：非法输入、大文件导入、空数据

## M. 风险合规
- 隐私：本地数据最小化存储
- 内容：仅使用鼓励型文案
- 健康：长时间提醒休息

## N. 4周计划
- W1 架构与核心状态管理
- W2 专注与音频模块
- W3 笔记日历习惯待办完善
- W4 联调测试与发布

## O. 二期路线
- 云端同步、账户系统、跨平台同步、推荐策略
