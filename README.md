# Immersive Focus Companion

完整功能工程：
- 番茄钟倒计时（开始/暂停/恢复/快进/立即结束结算XP）
- 音乐与环境（导入、播放、下一首、删除、音量控制）
- 虚拟人物交互（情境语气变化、语音播报）
- 笔记、日历日记、习惯追踪、待办管理（增删改查）

## Visual Studio 2022 运行方式（Windows）
1. 安装 Node.js 20+
2. VS2022 -> File -> Open -> Folder，打开本项目根目录
3. 在终端执行：
   ```bash
   npm install
   npm run dev
   ```
4. 访问 `http://localhost:3000`

## 打包为本地离线 EXE（Electron）
> 打包步骤需要联网拉取依赖；打包完成后的 EXE 可离线运行。

1. 安装依赖并构建 Next 产物：
   ```bash
   npm install
   npm run build
   ```
2. 生成 Windows 便携版 EXE：
   ```bash
   npm run desktop:build
   ```
3. 产物目录：
   - `release/ImmersiveFocusCompanion-0.2.0.exe`

### 本地桌面调试
```bash
npm run dev
npm run desktop:dev
```

### 白屏排查
- 开发模式必须开两个终端：
  1) `npm run dev`
  2) `npm run desktop:dev`
- 若仍白屏，请查看错误日志文件：
  - Windows: `%APPDATA%/ImmersiveFocusCompanion/desktop-error.log`
  - 其中会记录服务未启动/页面加载失败等原因。

## 命令
```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run desktop:dev
npm run desktop:build
```


## 面向日常用户发布（只点 EXE 即可）
1. 你（开发者）先在打包机执行一次：
   ```bash
   npm install
   npm run build
   npm run desktop:build
   ```
2. 把 `release/ImmersiveFocusCompanion-0.2.1.exe` 发给用户。
3. 用户侧无需 Node、无需 PowerShell、无需 `run dev`，直接双击 EXE 即可离线运行。

说明：当前打包采用 Next standalone 模式，EXE 内会自行拉起本地内置服务。
