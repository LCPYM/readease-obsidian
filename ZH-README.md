# ReadEase — Obsidian 閱讀體驗插件

> **將你的 Obsidian 閱讀視圖，變成專屬的舒適閱讀環境。**

ReadEase 提供一個懸浮設定面板，讓你在不離開當前頁面的情況下，即時調整字體、排版、主題等所有閱讀相關設定。

[![Buy Me A Coffee|149x20](https://img.shields.io/badge/請我喝杯咖啡-支持開發-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/lcpym)

---

## ✨ 功能介紹

### 🎨 11 種預設主題
一鍵切換精心設計的閱讀主題，適應不同光線環境與閱讀心情：

| 淺色主題 | 深色主題 |
|---|---|
| Original（原始） | Night（夜間） |
| Sepia（暖棕） | Midnight（深夜） |
| Gray（灰調） | Charcoal（炭灰） |
| Paper（紙白） | Forest（森林） |
| Calm（平靜藍） | Slate（石板藍） |
| | Coffee（咖啡深褐） |

- **單擊**切換主題
- **雙擊**當前主題可重置所有自訂修改回預設值
- 已有自訂修改的主題會顯示 ✦ 標記

### 🔤 字體控制
- **字體大小** — 12px 至 32px
- **字體粗細** — 細體 (300) 至粗體 (700)
- **字體系列** — 超過 50 款字體，分為 5 大類：
  - 設計感無襯線（Futura、Avenir、Helvetica Neue、Optima……）
  - 現代無襯線（Inter、Roboto、Poppins、Nunito、DM Sans……）
  - 英文襯線體（Georgia、Garamond、Baskerville、Playfair Display、Lora……）
  - 中文字體（蘋方、思源黑體/宋體、宋體、楷體、仿宋、隸書……）
  - 等寬字體（Fira Code、JetBrains Mono、Cascadia Code……）

### 📐 間距與版面
- **行高** — 1.0× 至 2.5×
- **段落間距** — 0.5em 至 2.5em
- **字元間距** — −1px 至 3px
- **最大行寬** — 0（不限）至 1200px
- **頁面邊距** — 0px 至 100px
- **文字對齊** — 靠左、左右對齊、居中

### 🖥️ 智能介面
- **懸浮面板** — 閱讀時保持顯示於畫面上
- **可拖動** — 電腦版可自由拖到任意位置
- **底部抽屜** — 手機版從底部彈出，不遮擋內容
- **面板透明度** — 在插件設定中調整（30% 至 100%）
- **自動明暗模式** — 面板背景跟隨 Obsidian 的明暗主題
- **裝置獨立設定** — 電腦與手機自動套用不同設定

---

## 🚀 安裝方法

### 通過社群插件市場安裝（推薦）
1. 打開 Obsidian → 設定 → 社群插件
2. 搜尋 **ReadEase**
3. 點擊安裝 → 啟用

### 通過 BRAT 安裝（測試版）
1. 先安裝 [BRAT 插件](https://github.com/TfTHacker/obsidian42-brat)
2. 添加 Beta 插件：`your-username/readease-obsidian`

### 手動安裝
1. 從 [最新版本](https://github.com/your-username/readease-obsidian/releases) 下載 `main.js`、`manifest.json`
2. 複製到 `.obsidian/plugins/readease/` 資料夾
3. 在「設定 → 社群插件」中啟用

---

## 🎮 使用方法

1. 點擊左側側邊欄的 **📖 書本圖示**，或使用命令面板（`Ctrl/Cmd + P` → *Open reading settings*）
2. 懸浮面板出現後，調整任何設定均**即時生效**
3. 點擊主題按鈕切換主題
4. 電腦版可拖動面板到喜歡的位置
5. 所有設定**自動儲存**，並區分不同裝置

---

## ⚙️ 插件設定頁面

在 **設定 → ReadEase** 中可調整：

| 設定項目 | 說明 |
|---|---|
| 面板透明度 | 懸浮面板的透明程度（0.3–1.0） |

---

## 💬 意見回饋與支持

遇到問題或有功能建議？歡迎在 [GitHub Issues](https://github.com/your-username/readease-obsidian/issues) 提出。

如果 ReadEase 讓你的閱讀體驗變得更好，歡迎請我喝杯咖啡，支持持續開發！☕

[![Buy Me A Coffee|170x37](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/lcpym)

---

## 📄 授權條款

MIT License — 免費使用，歡迎修改。

> **† 系統字體說明**
> 標有 **†** 的字體為 macOS、Windows 或 iOS 的系統字體或商業字體。
> 這些字體只有在你的裝置上**已安裝**的情況下才能正確顯示。
> 若未安裝，插件會自動 fallback 至最接近的可用字體。
> **沒有 †** 的字體為 Web Font，透過 [Bunny Fonts](https://fonts.bunny.net) 自動載入，
> 有網絡連線的裝置均可使用，無需額外安裝。
