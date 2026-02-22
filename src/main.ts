import { App, Modal, Notice, Plugin, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab, PRESET_THEMES, DeviceSettings, ThemeCustomization } from "./settings";

export default class HelloWorldPlugin extends Plugin {
  settings: MyPluginSettings;
  private deviceId: string;
  settingsModal: ReadingSettingsModal | null = null;
 injectGoogleFonts() {
  if (document.getElementById('reading-ease-google-fonts')) return;

  const link = document.createElement('link');
  link.id  = 'reading-ease-google-fonts';
  link.rel = 'stylesheet';

  // 只列出 Bunny Fonts 實際有提供的字體
  // 分號必須編碼為 %3B
  const weights = '300%3B400%3B500%3B600%3B700';

  const families = [
    // 現代無襯線（Google/Bunny Fonts 有提供）
    `Nunito:wght@${weights}`,
    `DM+Sans:ital,opsz,wght@0,9..40,${weights}`,
    `Outfit:wght@${weights}`,
    `Manrope:wght@${weights}`,
    `Plus+Jakarta+Sans:wght@${weights}`,
    `Karla:wght@${weights}`,
    `Cabin:wght@400%3B500%3B600%3B700`,
    `Inter:wght@${weights}`,
    `Roboto:wght@${weights}`,
    `Open+Sans:wght@${weights}`,
    `Lato:wght@300%3B400%3B700`,
    `Raleway:wght@${weights}`,
    `Poppins:wght@300%3B400%3B500%3B600%3B700`,
    `Work+Sans:wght@${weights}`,
    // 襯線體
    `Merriweather:wght@300%3B400%3B700`,
    `Lora:wght@400%3B500%3B600%3B700`,
    `Playfair+Display:wght@400%3B500%3B600%3B700`,
    `Cormorant+Garamond:wght@300%3B400%3B500%3B600%3B700`,
    `Spectral:wght@300%3B400%3B500%3B600%3B700`,
    `Crimson+Text:wght@400%3B600%3B700`,
    `EB+Garamond:wght@400%3B500%3B600%3B700`,
    // 等寬
    `Fira+Code:wght@300%3B400%3B500%3B600%3B700`,
    `Inconsolata:wght@300%3B400%3B500%3B600%3B700`,
    `IBM+Plex+Mono:wght@300%3B400%3B500%3B600%3B700`,
    `Courier+Prime:wght@400%3B700`,
    `JetBrains+Mono:wght@${weights}`,
  ].map(f => `family=${f}`).join('&');

  link.href = `https://fonts.bunny.net/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

  openSettingsModal() {
  // 若已有實例且是開著的，只把焦點帶回來
  if (this.settingsModal) {
    this.settingsModal.onOpen();
    return;
  }
  // 否則建立新實例
  this.settingsModal = new ReadingSettingsModal(this.app, this);
  this.settingsModal.open();
}

  async onload() {
    await this.loadSettings();
    this.deviceId = this.getDeviceId();
    this.loadDeviceSettings();

    if (!this.settings.deviceSettings[this.deviceId]) {
      this.detectAndApplySystemTheme();
    }

    this.injectGoogleFonts();  // ← 新增，插件載入時即開始預載字體

    this.addRibbonIcon('book-open', 'Reading Settings', () => {
      this.openSettingsModal();  // ← 改這
    });

    this.addCommand({
      id: 'open-reading-settings',
      name: 'Open reading settings',
      callback: () => {
        this.openSettingsModal();  // ← 改這
      }
    });


    this.addSettingTab(new SampleSettingTab(this.app, this));
    this.applyStyles();
  }

  onunload() {
    document.querySelectorAll('.reading-view-custom-styles').forEach(el => el.remove());
    document.getElementById('reading-ease-google-fonts')?.remove();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    this.saveDeviceSettings();
    await this.saveData(this.settings);
  }

  getDeviceId(): string {
    const id = `device_${window.screen.width}x${window.screen.height}_${navigator.platform}`;
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  loadDeviceSettings() {
    const deviceConfig = this.settings.deviceSettings[this.deviceId];
    if (deviceConfig) {
      this.settings.fontSize            = deviceConfig.fontSize;
      this.settings.lineHeight          = deviceConfig.lineHeight;
      this.settings.letterSpacing       = deviceConfig.letterSpacing;
      this.settings.fontFamily          = deviceConfig.fontFamily;
      this.settings.fontWeight          = deviceConfig.fontWeight;
      this.settings.paragraphSpacing    = deviceConfig.paragraphSpacing;
      this.settings.maxWidth            = deviceConfig.maxWidth;
      this.settings.pageMargin          = deviceConfig.pageMargin;
      this.settings.textAlign           = deviceConfig.textAlign;
      this.settings.backgroundColor     = deviceConfig.backgroundColor;
      this.settings.textColor           = deviceConfig.textColor;
      this.settings.currentTheme        = deviceConfig.currentTheme;
      this.settings.themeCustomizations = deviceConfig.themeCustomizations || {};
    }
  }

  saveDeviceSettings() {
    const deviceConfig: DeviceSettings = {
      fontSize:            this.settings.fontSize,
      lineHeight:          this.settings.lineHeight,
      letterSpacing:       this.settings.letterSpacing,
      fontFamily:          this.settings.fontFamily,
      fontWeight:          this.settings.fontWeight,
      paragraphSpacing:    this.settings.paragraphSpacing,
      maxWidth:            this.settings.maxWidth,
      pageMargin:          this.settings.pageMargin,
      textAlign:           this.settings.textAlign,
      backgroundColor:     this.settings.backgroundColor,
      textColor:           this.settings.textColor,
      currentTheme:        this.settings.currentTheme,
      themeCustomizations: this.settings.themeCustomizations
    };
    this.settings.deviceSettings[this.deviceId] = deviceConfig;
  }

  detectAndApplySystemTheme() {
    const isDarkMode = document.body.classList.contains('theme-dark');
    if (isDarkMode) this.switchTheme('night');
  }

  async switchTheme(themeKey: string) {
    const theme = PRESET_THEMES[themeKey as keyof typeof PRESET_THEMES];
    if (!theme) return;

    this.settings.currentTheme = themeKey;
    const customization = this.settings.themeCustomizations[themeKey];

    if (customization) {
      this.settings.fontSize         = customization.fontSize;
      this.settings.lineHeight       = customization.lineHeight;
      this.settings.letterSpacing    = customization.letterSpacing;
      this.settings.fontFamily       = customization.fontFamily;
      this.settings.fontWeight       = customization.fontWeight;
      this.settings.paragraphSpacing = customization.paragraphSpacing;
      this.settings.maxWidth         = customization.maxWidth;
      this.settings.pageMargin       = customization.pageMargin;
      this.settings.textAlign        = customization.textAlign;
    } else {
      this.settings.fontSize         = theme.fontSize;
      this.settings.lineHeight       = theme.lineHeight;
      this.settings.letterSpacing    = theme.letterSpacing;
      this.settings.fontFamily       = theme.fontFamily;
      this.settings.fontWeight       = theme.fontWeight;
      this.settings.paragraphSpacing = theme.paragraphSpacing;
      this.settings.textAlign        = theme.textAlign;
      this.settings.maxWidth         = 700;
      this.settings.pageMargin       = 40;
    }

    this.settings.backgroundColor = theme.backgroundColor;
    this.settings.textColor       = theme.textColor;
    this.settings.darkMode        = theme.darkMode;

    await this.saveSettings();
    this.applyStyles();
    new Notice(`Switched to ${theme.name}`);
  }

  saveThemeCustomization() {
    const t = this.settings.currentTheme;
    this.settings.themeCustomizations[t] = {
      fontSize:         this.settings.fontSize,
      lineHeight:       this.settings.lineHeight,
      letterSpacing:    this.settings.letterSpacing,
      fontFamily:       this.settings.fontFamily,
      fontWeight:       this.settings.fontWeight,
      paragraphSpacing: this.settings.paragraphSpacing,
      maxWidth:         this.settings.maxWidth,
      pageMargin:       this.settings.pageMargin,
      textAlign:        this.settings.textAlign
    };
  }

  async resetCurrentTheme() {
    const t = this.settings.currentTheme;
    delete this.settings.themeCustomizations[t];
    await this.switchTheme(t);
    new Notice('Reset to theme defaults');
  }

  applyStyles() {
    document.querySelectorAll('.reading-view-custom-styles').forEach(el => el.remove());
    const style = document.createElement('style');
    style.classList.add('reading-view-custom-styles');

    const bgColor       = this.settings.backgroundColor;
    const textColor     = this.settings.textColor;
    const maxWidthStyle = this.settings.maxWidth > 0
      ? `max-width: ${this.settings.maxWidth}px; margin-left: auto; margin-right: auto;`
      : '';

    style.textContent = `
      .markdown-reading-view {
        background-color: ${bgColor} !important;
        color: ${textColor} !important;
        padding-left: ${this.settings.pageMargin}px !important;
        padding-right: ${this.settings.pageMargin}px !important;
      }
      .markdown-reading-view .markdown-preview-view,
      .markdown-reading-view .markdown-preview-section {
        font-family: ${this.settings.fontFamily} !important;
        font-size: ${this.settings.fontSize}px !important;
        font-weight: ${this.settings.fontWeight} !important;
        line-height: ${this.settings.lineHeight} !important;
        letter-spacing: ${this.settings.letterSpacing}px !important;
        text-align: ${this.settings.textAlign} !important;
        color: ${textColor} !important;
        ${maxWidthStyle}
      }
      .markdown-reading-view p,
      .markdown-reading-view li,
      .markdown-reading-view div,
      .markdown-reading-view span {
        font-family: ${this.settings.fontFamily} !important;
        font-size: ${this.settings.fontSize}px !important;
        font-weight: ${this.settings.fontWeight} !important;
        line-height: ${this.settings.lineHeight} !important;
        letter-spacing: ${this.settings.letterSpacing}px !important;
        color: ${textColor} !important;
      }
      .markdown-reading-view p {
        margin-bottom: ${this.settings.paragraphSpacing}em !important;
      }
      .markdown-reading-view h1, .markdown-reading-view h2,
      .markdown-reading-view h3, .markdown-reading-view h4,
      .markdown-reading-view h5, .markdown-reading-view h6 {
        font-family: ${this.settings.fontFamily} !important;
        color: ${textColor} !important;
      }
      .markdown-reading-view a {
        color: ${this.settings.darkMode ? '#58a6ff' : '#0969da'} !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================================
// ReadingSettingsModal
// ============================================================
class ReadingSettingsModal extends Modal {
  plugin: HelloWorldPlugin;
  private lastClickTime: { [key: string]: number } = {};
  private dragging  = false;
  private offsetX   = 0;
  private offsetY   = 0;
  private savedLeft: string | null = null;
  private savedTop:  string | null = null;
  private hasMoved  = false;
  private themeObserver: MutationObserver | null = null;

  constructor(app: App, plugin: HelloWorldPlugin) {
    super(app);
    this.plugin = plugin;
  }

  injectGlassStyles() {
    document.querySelectorAll('.rm-glass-modal ').forEach(el => el.remove());
    const style = document.createElement('style');
    style.classList.add('rm-glass-modal');

    style.textContent = `
      /* ===== 下拉選單 ===== */
      .reading-settings-modal select {
        background: var(--background-modifier-form-field) !important;
        border: 1px solid var(--background-modifier-border) !important;
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 13px;
        color: var(--text-normal);
        font-weight: 400;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        transition: all 0.15s cubic-bezier(0.4,0.0,0.2,1);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        letter-spacing: -0.08px;
        text-align: center;
        text-align-last: center;
        width: 100%;
      }
      .reading-settings-modal select:hover {
        background: var(--background-modifier-hover) !important;
        border-color: var(--background-modifier-border-hover) !important;
      }
      .reading-settings-modal select:focus {
        border-color: var(--interactive-accent) !important;
        outline: none !important;
      }
      @media (max-width: 767px) {
        .reading-settings-modal select {
          padding-left: 0;
          padding-right: 0;
        }
        .reading-settings-modal select option {
          text-align: center;
        }
      }

      /* ===== 區塊標題 ===== */
      .reading-settings-modal .section-title {
        font-weight: 600;
        font-size: 13px;
        padding-bottom: 8px;
        margin-bottom: 8px;
        border-bottom: 1px solid var(--background-modifier-border);
        color: var(--text-normal);
        letter-spacing: -0.08px;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      }

      /* ===== 滑桿軌道 ===== */
      .reading-settings-modal input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        outline: none;
        background: linear-gradient(
          to right,
          var(--interactive-accent) 0%,
          var(--interactive-accent) var(--slider-progress, 50%),
          var(--background-modifier-border) var(--slider-progress, 50%),
          var(--background-modifier-border) 100%
        );
      }
      .reading-settings-modal input[type="range"]::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 2px;
        background: transparent;
      }
      .reading-settings-modal input[type="range"]::-moz-range-track {
        height: 4px;
        border-radius: 2px;
        background: transparent;
      }

      /* ===== 滑桿拇指 - 橫向圓角矩形 ===== */
      .reading-settings-modal input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 15px;
        border-radius: 11px;
        background: var(--text-on-accent);
        border: 1.5px solid var(--interactive-accent);
        cursor: grab;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        z-index: 2;
        transition: all 0.12s cubic-bezier(0.4,0.0,0.2,1);
        margin-top: 0px;
      }
      @media (max-width: 767px) {
        .reading-settings-modal input[type="range"]::-webkit-slider-thumb {
          margin-top: 2px;
        }
      }
      .reading-settings-modal input[type="range"]::-moz-range-thumb {
        width: 24px;
        height: 15px;
        border-radius: 11px;
        background: var(--text-on-accent);
        border: 1.5px solid var(--interactive-accent);
        cursor: grab;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        transition: all 0.12s cubic-bezier(0.4,0.0,0.2,1);
      }
      .reading-settings-modal input[type="range"]::-webkit-slider-thumb:hover {
        box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        transform: scale(1.05);
      }
      .reading-settings-modal input[type="range"]:active::-webkit-slider-thumb {
        cursor: grabbing;
        transform: scale(1.08);
      }

      /* ===== 修正 Obsidian 設定項樣式 ===== */
      .reading-settings-modal .setting-item {
        padding: 0 !important; margin: 0 !important;
        border: none !important; display: contents !important;
      }
      .reading-settings-modal .setting-item-name { display: none !important; }

      /* ===== Header 區域 ===== */
      .rm-sticky-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 12px 16px;
        flex-shrink: 0;
        border-bottom: 1px solid var(--background-modifier-border);
        cursor: move;
        user-select: none;
      }
      .rm-sticky-header * {
        cursor: move !important;
      }
      .rm-sticky-header .rm-close-btn,
      .rm-sticky-header .rm-close-btn * {
        cursor: pointer !important;
      }

      /* ===== 關閉按鈕 ===== */
      .rm-close-btn {
        background: var(--background-modifier-hover);
        border: 1px solid var(--background-modifier-border);
        border-radius: 50%;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--text-muted);
        transition: all 0.15s ease;
        flex-shrink: 0;
        line-height: 1;
      }
      .rm-close-btn:hover {
        background: var(--background-modifier-border);
        color: var(--text-normal);
      }

      /* ===== 數值標籤 ===== */
      .slider-value-label {
        font-size: 11px;
        font-weight: 500;
        color: var(--text-muted);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        letter-spacing: -0.08px;
        min-width: 36px;
        text-align: right;
        flex-shrink: 0;
      }

      /* ===== Reset 按鈕 ===== */
      .reading-settings-modal .mod-warning {
        background: rgba(255,69,58,0.1);
        color: #FF453A;
        border: 1px solid rgba(255,69,58,0.2);
      }
      .reading-settings-modal .mod-warning:hover {
        background: rgba(255,69,58,0.15);
        border-color: rgba(255,69,58,0.3);
      }

      /* ===== 電腦版：無遮罩 ===== */
      @media (min-width: 768px) {
        .modal-container:has(.reading-settings-modal) { pointer-events: none; }
        .modal-container:has(.reading-settings-modal) .modal-bg { display: none !important; }
      }
      /* ===== 手機版：半透明遮罩 ===== */
      @media (max-width: 767px) {
        .modal-container:has(.reading-settings-modal) .modal-bg {
          background: rgba(0,0,0,0.3) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ----------------------------------------------------------
  createSliderWithProgress(
    container: HTMLElement,
    name: string,
    min: number,
    max: number,
    step: number,
    currentValue: number,
    unit: string,
    onChange: (value: number) => Promise<void>
  ) {
    const wrap = container.createDiv();
    wrap.style.cssText = `
      display: flex; flex-direction: column;
      gap: 4px; width: 100%; margin-bottom: 10px;
    `;

    const topRow = wrap.createDiv();
    topRow.style.cssText = `display: flex; justify-content: space-between; align-items: center;`;

    const nameEl = topRow.createDiv();
    nameEl.style.cssText = `
      font-size: 13px; font-weight: 500; color: var(--text-normal);
      letter-spacing: -0.08px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    `;
    nameEl.textContent = name;

    const valueEl = topRow.createDiv();
    valueEl.className = 'slider-value-label';
    valueEl.textContent = `${currentValue}${unit}`;

    const sliderWrap = wrap.createDiv();
    new Setting(sliderWrap).addSlider(slider => {
      const sliderEl = slider.sliderEl;
      const updateProgress = (val: number) => {
        const pct = ((val - min) / (max - min)) * 100;
        sliderEl.style.setProperty('--slider-progress', `${pct}%`);
        valueEl.textContent = `${Math.round(val * 100) / 100}${unit}`;
      };
      slider
        .setLimits(min, max, step)
        .setValue(currentValue)
        .setDynamicTooltip()
        .onChange(async (val) => { updateProgress(val); await onChange(val); });
      updateProgress(currentValue);
    });
  }

  // ----------------------------------------------------------
  createDropdownRow(
    container: HTMLElement,
    label: string,
    options: { value: string; display: string }[],
    currentValue: string,
    onChange: (value: string) => Promise<void>
  ) {
    const wrap = container.createDiv();
    wrap.style.cssText = `
      display: flex; flex-direction: column;
      gap: 4px; width: 100%; margin-bottom: 10px;
    `;
    const nameEl = wrap.createDiv();
    nameEl.style.cssText = `
      font-size: 13px; font-weight: 500; color: var(--text-normal);
      letter-spacing: -0.08px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    `;
    nameEl.textContent = label;

    const dropWrap = wrap.createDiv();
    new Setting(dropWrap).addDropdown(dropdown => {
      options.forEach(opt => dropdown.addOption(opt.value, opt.display));
      dropdown.setValue(currentValue);
      dropdown.onChange(async (val) => { await onChange(val); });
    });
  }

  // ----------------------------------------------------------
  onOpen() {
    const { contentEl, modalEl } = this;

    if (this.hasMoved) {
      this.savedLeft = modalEl.style.left;
      this.savedTop  = modalEl.style.top;
    }

    contentEl.empty();
    contentEl.addClass('reading-settings-modal');
    this.injectGlassStyles();

    const isMobile = window.innerWidth < 768;
    const opacity  = this.plugin.settings.modalOpacity ?? 1;

    // 偵測 Obsidian 明暗模式
   const isDark = document.body.classList.contains('theme-dark');
    const getBg = () => {
      const dark = document.body.classList.contains('theme-dark');
      return dark
        ? `rgba(30, 30, 30, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`;
    };
    const bgWithOpacity = getBg();

    if (isMobile) {
      modalEl.style.cssText = `
        position: fixed;
        bottom: 0; left: 0; right: 0; top: auto;
        width: 100%; max-width: 100%;
        max-height: 40vh;
        background-color: ${bgWithOpacity} !important;
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border-radius: 16px 16px 0 0;
        overflow: hidden;
        padding: 0;
        box-shadow: 0 -4px 24px rgba(0,0,0,0.25);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        z-index: 1000; pointer-events: all;
      `;
    } else {
      modalEl.style.cssText = `
        position: fixed;
        top: 50%; left: 16px; right: auto; bottom: auto;
        transform: translateY(-50%);
        width: 260px; max-width: 260px;
        max-height: 85vh;
        background-color: ${bgWithOpacity} !important;
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border-radius: 16px;
        overflow: hidden;
        padding: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        z-index: 1000; pointer-events: all;
      `;
    }

    // ← 新增：監聽 Obsidian 主題切換
    if (this.themeObserver) this.themeObserver.disconnect();
    this.themeObserver = new MutationObserver(() => {
      modalEl.style.backgroundColor = getBg();
    });
    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    if (this.hasMoved && this.savedLeft && this.savedTop) {
      modalEl.style.left      = this.savedLeft;
      modalEl.style.top       = this.savedTop;
      modalEl.style.transform = 'none';
      modalEl.style.bottom    = 'auto';
      modalEl.style.right     = 'auto';
    }

    const defaultClose = modalEl.querySelector('.modal-close-button');
    if (defaultClose) (defaultClose as HTMLElement).style.display = 'none';

    contentEl.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    `;

    // ===== Header =====
    const stickyHeader = contentEl.createDiv({ cls: 'rm-sticky-header' });

    if (!isMobile) {
      stickyHeader.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('.rm-close-btn')) return;
        this.onMouseDown(e);
      });
    }

    const titleDiv = stickyHeader.createDiv();
    titleDiv.style.cssText = `
      display: flex; align-items: center; gap: 8px;
      user-select: none; flex: 1;
      pointer-events: none;
    `;
    titleDiv.createEl('span', { text: '☰' }).style.cssText =
      'font-size: 14px; color: var(--text-muted); opacity: 0.6;';
    titleDiv.createEl('h2', { text: 'ReadEase by LCPYM' }).style.cssText = `
      margin: 0; font-size: 16px; font-weight: 600; letter-spacing: -0.41px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
      color: var(--text-normal);
    `;

    const closeBtn = stickyHeader.createDiv({ cls: 'rm-close-btn' });
    closeBtn.textContent = '✕';
    closeBtn.style.pointerEvents = 'all';
    closeBtn.addEventListener('click', () => this.close());

    // ===== 滾動區 =====
    const scrollArea = contentEl.createDiv();
    scrollArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px 16px 24px 16px;
    `;

    const scroll = scrollArea.createDiv();
    scroll.style.cssText = `display: flex; flex-direction: column; gap: 24px;`;

    // ==========================================
    // 1. THEMES
    // ==========================================
    const themeBlock = scroll.createDiv();
    themeBlock.createDiv({ cls: 'section-title' }).textContent = 'Themes';

    const currentTheme = this.plugin.settings.currentTheme;
    if (this.plugin.settings.themeCustomizations[currentTheme]) {
      themeBlock.createEl('div', { text: 'Double-click to reset theme' }).style.cssText =
        'font-size: 10px; color: var(--text-muted); margin-bottom: 8px; font-style: italic;';
    }

    const themeGrid = themeBlock.createDiv();
    themeGrid.style.cssText = `display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;`;

    Object.entries(PRESET_THEMES).forEach(([key, theme]) => {
      const hasCustom = !!this.plugin.settings.themeCustomizations[key];
      const isActive  = this.plugin.settings.currentTheme === key;
      const btn = themeGrid.createEl('button', {
        text: theme.name + (hasCustom ? ' ✦' : ''),
        cls: isActive ? 'mod-cta' : ''
      });
      btn.style.cssText = `
        padding: 0; height: 44px; font-size: 11px; border-radius: 8px;
        background-color: ${theme.backgroundColor}; color: ${theme.textColor};
        border: 1.5px solid ${isActive ? 'var(--interactive-accent)' : 'rgba(128,128,128,0.2)'};
        font-weight: ${isActive ? '600' : '500'};
        transition: all 0.15s cubic-bezier(0.4,0.0,0.2,1); cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        letter-spacing: -0.08px;
        display: flex; align-items: center; justify-content: center;
        text-align: center; width: 100%;
      `;
      btn.onmouseenter = () => { if (!isActive) btn.style.opacity = '0.7'; };
      btn.onmouseleave = () => { btn.style.opacity = '1'; };
      btn.onclick = async () => {
        const now  = Date.now();
        const last = this.lastClickTime[key] || 0;
        const dbl  = (now - last) < 400;
        this.lastClickTime[key] = now;
        if (key === this.plugin.settings.currentTheme && dbl) {
          await this.plugin.resetCurrentTheme();
        } else {
          await this.plugin.switchTheme(key);
        }
        this.onOpen();
      };
    });

    // ==========================================
    // 2. TYPOGRAPHY
    // ==========================================
    const fontBlock = scroll.createDiv();
    fontBlock.createDiv({ cls: 'section-title' }).textContent = 'Typography';

    this.createSliderWithProgress(
      fontBlock, 'Size', 12, 32, 1, this.plugin.settings.fontSize, 'px',
      async (v) => { this.plugin.settings.fontSize = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );
    this.createSliderWithProgress(
      fontBlock, 'Weight', 300, 700, 100, this.plugin.settings.fontWeight, '',
      async (v) => { this.plugin.settings.fontWeight = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );
 this.createDropdownRow(
  fontBlock, 'Font',
  [
    // ── 設計感 Sans（† = 系統字體，需已安裝）──
    { value: 'system-ui', display: 'System UI †' },
    { value: '"Futura", "Futura PT", "Century Gothic", sans-serif', display: 'Futura †' },
    { value: '"Avenir Next", Avenir, sans-serif', display: 'Avenir †' },
    { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', display: 'Helvetica Neue †' },
    { value: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif', display: 'Gill Sans †' },
    { value: '"Optima", "Segoe UI", sans-serif', display: 'Optima †' },
    { value: '"Proxima Nova", "Montserrat", sans-serif', display: 'Proxima Nova †' },
    { value: '"DIN Next", "DIN", "Arial Narrow", sans-serif', display: 'DIN †' },
    { value: '"Myriad Pro", "Trebuchet MS", sans-serif', display: 'Myriad Pro †' },
    { value: '"Brandon Grotesque", "Nunito", sans-serif', display: 'Brandon Grotesque †' },
    { value: '"Trade Gothic", "Franklin Gothic Medium", sans-serif', display: 'Trade Gothic †' },
    { value: '"Univers", Arial, sans-serif', display: 'Univers †' },
    // ── 現代無襯線（Web Fonts，自動載入）──
    { value: '"Inter", -apple-system, sans-serif', display: 'Inter' },
    { value: '"Roboto", "Noto Sans", sans-serif', display: 'Roboto' },
    { value: '"Open Sans", "Source Sans Pro", sans-serif', display: 'Open Sans' },
    { value: '"Lato", sans-serif', display: 'Lato' },
    { value: '"Raleway", sans-serif', display: 'Raleway' },
    { value: '"Poppins", sans-serif', display: 'Poppins' },
    { value: '"Work Sans", sans-serif', display: 'Work Sans' },
    { value: '"Nunito", sans-serif', display: 'Nunito' },
    { value: '"DM Sans", sans-serif', display: 'DM Sans' },
    { value: '"Outfit", sans-serif', display: 'Outfit' },
    { value: '"Manrope", sans-serif', display: 'Manrope' },
    { value: '"Plus Jakarta Sans", sans-serif', display: 'Plus Jakarta Sans' },
    { value: '"Karla", sans-serif', display: 'Karla' },
    { value: '"Cabin", sans-serif', display: 'Cabin' },
    // ── 襯線體（† = 系統字體）──
    { value: 'Georgia, serif', display: 'Georgia †' },
    { value: 'Garamond, "EB Garamond", serif', display: 'Garamond †' },
    { value: '"Baskerville", "Libre Baskerville", serif', display: 'Baskerville †' },
    { value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', display: 'Palatino †' },
    { value: '"Times New Roman", Times, serif', display: 'Times New Roman †' },
    { value: '"Didot", "Bodoni MT", serif', display: 'Didot / Bodoni †' },
    { value: '"Hoefler Text", "Baskerville Old Face", serif', display: 'Hoefler Text †' },
    { value: '"Caslon", "Big Caslon", "Libre Caslon Text", serif', display: 'Caslon †' },
    { value: '"Merriweather", Georgia, serif', display: 'Merriweather' },
    { value: '"Lora", serif', display: 'Lora' },
    { value: '"Playfair Display", "Didot", serif', display: 'Playfair Display' },
    { value: '"Cormorant Garamond", Garamond, serif', display: 'Cormorant Garamond' },
    { value: '"Spectral", Georgia, serif', display: 'Spectral' },
    { value: '"Crimson Text", Georgia, serif', display: 'Crimson Text' },
    // ── 中文字體（全部為系統字體 †）──
    { value: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif', display: 'PingFang SC / 微軟雅黑 †' },
    { value: '"PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif', display: 'PingFang TC / 微軟正黑體 †' },
    { value: '"Noto Sans TC", "Noto Sans SC", sans-serif', display: 'Noto Sans TC / SC †' },
    { value: '"Source Han Sans", "Noto Sans CJK", "思源黑體", sans-serif', display: 'Source Han Sans / 思源黑體 †' },
    { value: '"Source Han Serif", "Noto Serif CJK", "思源宋體", serif', display: 'Source Han Serif / 思源宋體 †' },
    { value: '"Hiragino Sans GB", "Heiti SC", "STHeiti", sans-serif', display: 'Hiragino / 黑體 †' },
    { value: '"STSong", "Songti SC", SimSun, serif', display: 'Songti / 宋體 †' },
    { value: '"STKaiti", "Kaiti SC", KaiTi, serif', display: 'Kaiti / 楷體 †' },
    { value: '"STFangsong", FangSong, serif', display: 'Fangsong / 仿宋 †' },
    { value: '"LiSu", "STLiSu", serif', display: 'LiSu / 隸書 †' },
    { value: '"STXingkai", "Xingkai SC", serif', display: 'Xingkai / 行楷 †' },
    { value: '"STZhongsong", "Zhongsong", serif', display: 'Zhongsong / 中宋 †' },
    // ── 等寬字體 ──
    { value: 'Consolas, "Monaco", "Courier New", monospace', display: 'Consolas / Monaco †' },
    { value: '"Cascadia Code", "Cascadia Mono", monospace', display: 'Cascadia Code †' },
    { value: '"SF Mono", Menlo, monospace', display: 'SF Mono / Menlo †' },
    { value: '"Fira Code", "Source Code Pro", monospace', display: 'Fira Code' },
    { value: '"JetBrains Mono", monospace', display: 'JetBrains Mono' },
    { value: '"Inconsolata", monospace', display: 'Inconsolata' },
    { value: '"IBM Plex Mono", monospace', display: 'IBM Plex Mono' },
    { value: '"Courier Prime", "Courier New", monospace', display: 'Courier Prime' },
  ],
  this.plugin.settings.fontFamily,
  async (v) => { this.plugin.settings.fontFamily = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
);

    // ==========================================
    // 3. SPACING
    // ==========================================
    const spacingBlock = scroll.createDiv();
    spacingBlock.createDiv({ cls: 'section-title' }).textContent = 'Spacing';

    this.createSliderWithProgress(
      spacingBlock, 'Line', 1.0, 2.5, 0.1, this.plugin.settings.lineHeight, '',
      async (v) => { this.plugin.settings.lineHeight = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );
    this.createSliderWithProgress(
      spacingBlock, 'Paragraph', 0.5, 2.5, 0.1, this.plugin.settings.paragraphSpacing, 'em',
      async (v) => { this.plugin.settings.paragraphSpacing = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );
    this.createSliderWithProgress(
      spacingBlock, 'Letter', -1, 3, 0.1, this.plugin.settings.letterSpacing, 'px',
      async (v) => { this.plugin.settings.letterSpacing = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );

    // ==========================================
    // 4. LAYOUT
    // ==========================================
    const layoutBlock = scroll.createDiv();
    layoutBlock.createDiv({ cls: 'section-title' }).textContent = 'Layout';

    this.createSliderWithProgress(
      layoutBlock, 'Width', 0, 1200, 50, this.plugin.settings.maxWidth, 'px',
      async (v) => { this.plugin.settings.maxWidth = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );
    this.createSliderWithProgress(
      layoutBlock, 'Margin', 0, 100, 5, this.plugin.settings.pageMargin, 'px',
      async (v) => { this.plugin.settings.pageMargin = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );
    this.createDropdownRow(
      layoutBlock, 'Align',
      [
        { value: 'left',    display: 'Left'    },
        { value: 'justify', display: 'Justify' },
        { value: 'center',  display: 'Center'  },
      ],
      this.plugin.settings.textAlign,
      async (v) => { this.plugin.settings.textAlign = v; this.plugin.saveThemeCustomization(); await this.plugin.saveSettings(); this.plugin.applyStyles(); }
    );

    // ==========================================
    // 5. RESET
    // ==========================================
    const resetBlock = scroll.createDiv();
    resetBlock.style.cssText = 'padding-top: 4px; padding-bottom: 8px;';

    const resetBtn = resetBlock.createEl('button', { text: 'Reset Theme' });
    resetBtn.style.cssText = `
      padding: 8px 20px; border-radius: 8px; font-weight: 500; font-size: 13px;
      width: 100%; cursor: pointer;
      transition: all 0.15s cubic-bezier(0.4,0.0,0.2,1);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      letter-spacing: -0.08px;
    `;
    resetBtn.classList.add('mod-warning');
    resetBtn.onmouseenter = () => { resetBtn.style.transform = 'translateY(-1px)'; };
    resetBtn.onmouseleave = () => { resetBtn.style.transform = 'translateY(0)'; };
    resetBtn.onclick = async () => { await this.plugin.resetCurrentTheme(); this.onOpen(); };
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.dragging = true;
    const rect   = this.modalEl.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup',   this.onMouseUp.bind(this));
  }

  onMouseMove(e: MouseEvent) {
    if (!this.dragging) return;
    const x    = e.clientX - this.offsetX;
    const y    = e.clientY - this.offsetY;
    const maxX = window.innerWidth  - this.modalEl.offsetWidth;
    const maxY = window.innerHeight - this.modalEl.offsetHeight;
    this.modalEl.style.left      = Math.max(0, Math.min(x, maxX)) + 'px';
    this.modalEl.style.top       = Math.max(0, Math.min(y, maxY)) + 'px';
    this.modalEl.style.bottom    = 'auto';
    this.modalEl.style.right     = 'auto';
    this.modalEl.style.transform = 'none';
    this.hasMoved = true;
  }

  onMouseUp() {
    this.dragging = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup',   this.onMouseUp.bind(this));
  }

  onClose() {
    this.contentEl.empty();
    document.querySelectorAll('.rm-glass-modal ').forEach(el => el.remove());
    
    // ← 新增
  if (this.themeObserver) {
    this.themeObserver.disconnect();
    this.themeObserver = null;

    // ← 新增：清除 plugin 持有的引用
  this.plugin.settingsModal = null;

  }
}
}
