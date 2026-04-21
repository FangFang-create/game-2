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

静态文件推到 GitHub 仓库后，可直接用 CDN 预览：

- `https://cdn.jsdelivr.net/gh/FangFang-create/game-2@main/index.html`

如果后续要切换成官方 GitHub Pages 域名，可在仓库设置里启用 Pages，或使用带 `workflow` 权限的凭证再补一个自动部署 workflow。
