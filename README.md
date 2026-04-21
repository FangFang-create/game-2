# Combo Cats

一个竖屏移动端节奏小游戏：中间播放猫咪跳舞视频并保留原音，底部彩色小猫 note 会随节奏横向经过判定点，玩家点击屏幕叠高 combo。

## 文件结构

- `index.html`：页面骨架
- `styles.css`：移动端视觉与交互样式
- `script.js`：节奏 note、点击判定、combo 与结算逻辑
- `assets/cats-dance.mp4`：游戏主视频
- `assets/game-background.png`：用户提供的底图

## 本地预览

在仓库根目录执行：

```bash
python3 -m http.server 4173
```

然后打开 [http://localhost:4173](http://localhost:4173)。

## 部署

仓库内自带 GitHub Pages workflow，推送到 `main` 后会自动发布静态站点。
