import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import HelloWorldPlugin from "./main";

export interface MyPluginSettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  darkMode: boolean;
  pageMargin: number;
  fontFamily: string;
  maxWidth: number;
  textAlign: string;
  fontWeight: number;
  paragraphSpacing: number;
  currentTheme: string;
  backgroundColor: string;
  textColor: string;
  deviceSettings: { [deviceId: string]: DeviceSettings };
  modalOpacity: number;
  themeCustomizations: { [themeName: string]: ThemeCustomization };  // 新增：每個主題的自訂值
}

export interface DeviceSettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  fontWeight: number;
  paragraphSpacing: number;
  maxWidth: number;
  pageMargin: number;
  textAlign: string;
  backgroundColor: string;
  textColor: string;
  currentTheme: string;
  themeCustomizations: { [themeName: string]: ThemeCustomization };
}

export interface ThemeCustomization {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  fontWeight: number;
  paragraphSpacing: number;
  maxWidth: number;
  pageMargin: number;
  textAlign: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  letterSpacing: 0,
  darkMode: false,
  pageMargin: 40,
  fontFamily: 'system-ui',
  maxWidth: 700,
  textAlign: 'left',
  fontWeight: 400,
  paragraphSpacing: 1.0,
  currentTheme: 'original',
  backgroundColor: '#ffffff',
  textColor: '#2e3338',
  deviceSettings: {},
  modalOpacity: 0.5,
  themeCustomizations: {}
}

export const PRESET_THEMES = {
  original: {
    name: 'Original',
    fontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
    darkMode: false,
    fontFamily: 'system-ui',
    fontWeight: 400,
    paragraphSpacing: 1.0,
    textAlign: 'left',
    backgroundColor: '#ffffff',
    textColor: '#2e3338'
  },
  sepia: {
    name: 'Sepia',
    fontSize: 16,
    lineHeight: 1.65,
    letterSpacing: 0.1,
    darkMode: false,
    fontFamily: 'Georgia, serif',
    fontWeight: 400,
    paragraphSpacing: 1.2,
    textAlign: 'left',
    backgroundColor: '#f4ecd8',
    textColor: '#5b4636'
  },
  gray: {
    name: 'Gray',
    fontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
    darkMode: false,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 400,
    paragraphSpacing: 1.1,
    textAlign: 'left',
    backgroundColor: '#e8e8e8',
    textColor: '#1a1a1a'
  },
  paper: {
    name: 'Paper',
    fontSize: 17,
    lineHeight: 1.7,
    letterSpacing: 0.1,
    darkMode: false,
    fontFamily: '"Times New Roman", serif',
    fontWeight: 400,
    paragraphSpacing: 1.3,
    textAlign: 'justify',
    backgroundColor: '#fefefe',
    textColor: '#333333'
  },
  calm: {
    name: 'Calm',
    fontSize: 16,
    lineHeight: 1.8,
    letterSpacing: 0.3,
    darkMode: false,
    fontFamily: 'Georgia, serif',
    fontWeight: 300,
    paragraphSpacing: 1.4,
    textAlign: 'left',
    backgroundColor: '#e8f4f8',
    textColor: '#2c5364'
  },
  night: {
    name: 'Night',
    fontSize: 16,
    lineHeight: 1.7,
    letterSpacing: 0.2,
    darkMode: true,
    fontFamily: 'system-ui',
    fontWeight: 400,
    paragraphSpacing: 1.2,
    textAlign: 'left',
    backgroundColor: '#1a1a1a',
    textColor: '#d4d4d4'
  },
  midnight: {
    name: 'Midnight',
    fontSize: 17,
    lineHeight: 1.75,
    letterSpacing: 0.3,
    darkMode: true,
    fontFamily: 'Georgia, serif',
    fontWeight: 400,
    paragraphSpacing: 1.3,
    textAlign: 'left',
    backgroundColor: '#0d1117',
    textColor: '#c9d1d9'
  },
  charcoal: {
    name: 'Charcoal',
    fontSize: 16,
    lineHeight: 1.65,
    letterSpacing: 0.1,
    darkMode: true,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 400,
    paragraphSpacing: 1.2,
    textAlign: 'left',
    backgroundColor: '#2b2b2b',
    textColor: '#e0e0e0'
  },
  forest: {
    name: 'Forest',
    fontSize: 16,
    lineHeight: 1.7,
    letterSpacing: 0.2,
    darkMode: true,
    fontFamily: 'Georgia, serif',
    fontWeight: 400,
    paragraphSpacing: 1.3,
    textAlign: 'left',
    backgroundColor: '#1a2421',
    textColor: '#c8d6c2'
  },
  slate: {
    name: 'Slate',
    fontSize: 16,
    lineHeight: 1.65,
    letterSpacing: 0.1,
    darkMode: true,
    fontFamily: 'system-ui',
    fontWeight: 400,
    paragraphSpacing: 1.2,
    textAlign: 'left',
    backgroundColor: '#1e2936',
    textColor: '#cbd5e1'
  },
  coffee: {
    name: 'Coffee',
    fontSize: 16,
    lineHeight: 1.7,
    letterSpacing: 0.2,
    darkMode: true,
    fontFamily: 'Georgia, serif',
    fontWeight: 400,
    paragraphSpacing: 1.25,
    textAlign: 'left',
    backgroundColor: '#2c1810',
    textColor: '#d4b5a0'
  }
};

export class SampleSettingTab extends PluginSettingTab {
  plugin: HelloWorldPlugin;

  constructor(app: App, plugin: HelloWorldPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;
    containerEl.empty();

    containerEl.createEl('h2', {text: 'Reading Experience Settings'});

    containerEl.createEl('p', {
      text: `Current device: ${this.plugin.getDeviceId()}`,
      cls: 'setting-item-description'
    });

    // Modal 透明度設定
    new Setting(containerEl)
      .setName('Modal opacity')
      .setDesc('Transparency of the reading settings modal (0.3 = 70% transparent, 1.0 = opaque)')
      .addSlider(slider => slider
        .setLimits(0.3, 1.0, 0.05)
        .setValue(this.plugin.settings.modalOpacity)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.modalOpacity = value;
          await this.plugin.saveSettings();
        }));

    // 預設主題選擇
    containerEl.createEl('h3', {text: 'Themes'});
    
    const currentTheme = this.plugin.settings.currentTheme;
    const hasCustomization = !!this.plugin.settings.themeCustomizations[currentTheme];
    
    if (hasCustomization) {
      const notice = containerEl.createEl('p', {
        text: `⚠️ Theme "${PRESET_THEMES[currentTheme as keyof typeof PRESET_THEMES]?.name}" has custom settings. Double-click it to reset.`,
        cls: 'setting-item-description'
      });
      notice.style.cssText = 'color: var(--text-accent); margin-bottom: 10px;';
    }
    
    const themeContainer = containerEl.createDiv({ cls: 'theme-buttons-container' });
    themeContainer.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;';

    Object.entries(PRESET_THEMES).forEach(([key, theme]) => {
      const hasThemeCustom = !!this.plugin.settings.themeCustomizations[key];
      const btn = themeContainer.createEl('button', {
        text: theme.name + (hasThemeCustom ? ' *' : ''),
        cls: this.plugin.settings.currentTheme === key ? 'mod-cta' : ''
      });
      btn.style.cssText = `
        padding: 10px; 
        border-radius: 6px;
        background-color: ${theme.backgroundColor};
        color: ${theme.textColor};
        border: 2px solid ${this.plugin.settings.currentTheme === key ? 'var(--interactive-accent)' : 'transparent'};
        font-size: 12px;
      `;
      
      let lastClickTime = 0;
      btn.onclick = async () => {
        const now = Date.now();
        const isDoubleClick = (now - lastClickTime) < 400;
        lastClickTime = now;

        if (key === this.plugin.settings.currentTheme && isDoubleClick) {
          // 雙擊當前主題 → 重置為預設值
          await this.plugin.resetCurrentTheme();
          this.display();
        } else {
          // 切換到其他主題（或單擊當前主題）
          await this.plugin.switchTheme(key);
          this.display();
        }
      };
    });

    containerEl.createEl('h3', {text: 'Custom Settings'});

    // 所有設定項
    new Setting(containerEl)
      .setName('Font size')
      .setDesc('Reading view font size in pixels')
      .addSlider(slider => slider
        .setLimits(12, 32, 1)
        .setValue(this.plugin.settings.fontSize)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.fontSize = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Font family')
      .setDesc('Choose your reading font (30+ options)')
      .addDropdown(dropdown => {
        // ── 設計感 Sans（† = 系統字體）──
        dropdown.addOption('system-ui', 'System UI †');
        dropdown.addOption('"Futura", "Futura PT", "Century Gothic", sans-serif', 'Futura †');
        dropdown.addOption('"Avenir Next", Avenir, sans-serif', 'Avenir †');
        dropdown.addOption('"Helvetica Neue", Helvetica, Arial, sans-serif', 'Helvetica Neue †');
        dropdown.addOption('"Gill Sans", "Gill Sans MT", Calibri, sans-serif', 'Gill Sans †');
        dropdown.addOption('"Optima", "Segoe UI", sans-serif', 'Optima †');
        dropdown.addOption('"Proxima Nova", "Montserrat", sans-serif', 'Proxima Nova †');
        dropdown.addOption('"DIN Next", "DIN", "Arial Narrow", sans-serif', 'DIN †');
        dropdown.addOption('"Myriad Pro", "Trebuchet MS", sans-serif', 'Myriad Pro †');
        dropdown.addOption('"Brandon Grotesque", "Nunito", sans-serif', 'Brandon Grotesque †');
        dropdown.addOption('"Trade Gothic", "Franklin Gothic Medium", sans-serif', 'Trade Gothic †');
        dropdown.addOption('"Univers", Arial, sans-serif', 'Univers †');
        // ── 現代無襯線（Web Fonts）──
        dropdown.addOption('"Inter", -apple-system, sans-serif', 'Inter');
        dropdown.addOption('"Roboto", "Noto Sans", sans-serif', 'Roboto');
        dropdown.addOption('"Open Sans", "Source Sans Pro", sans-serif', 'Open Sans');
        dropdown.addOption('"Lato", sans-serif', 'Lato');
        dropdown.addOption('"Raleway", sans-serif', 'Raleway');
        dropdown.addOption('"Poppins", sans-serif', 'Poppins');
        dropdown.addOption('"Work Sans", sans-serif', 'Work Sans');
        dropdown.addOption('"Nunito", sans-serif', 'Nunito');
        dropdown.addOption('"DM Sans", sans-serif', 'DM Sans');
        dropdown.addOption('"Outfit", sans-serif', 'Outfit');
        dropdown.addOption('"Manrope", sans-serif', 'Manrope');
        dropdown.addOption('"Plus Jakarta Sans", sans-serif', 'Plus Jakarta Sans');
        dropdown.addOption('"Karla", sans-serif', 'Karla');
        dropdown.addOption('"Cabin", sans-serif', 'Cabin');
        // ── 襯線體（† = 系統字體）──
        dropdown.addOption('Georgia, serif', 'Georgia †');
        dropdown.addOption('Garamond, "EB Garamond", serif', 'Garamond †');
        dropdown.addOption('"Baskerville", "Libre Baskerville", serif', 'Baskerville †');
        dropdown.addOption('"Palatino Linotype", "Book Antiqua", Palatino, serif', 'Palatino †');
        dropdown.addOption('"Times New Roman", Times, serif', 'Times New Roman †');
        dropdown.addOption('"Didot", "Bodoni MT", serif', 'Didot / Bodoni †');
        dropdown.addOption('"Hoefler Text", "Baskerville Old Face", serif', 'Hoefler Text †');
        dropdown.addOption('"Caslon", "Big Caslon", "Libre Caslon Text", serif', 'Caslon †');
        dropdown.addOption('"Merriweather", Georgia, serif', 'Merriweather');
        dropdown.addOption('"Lora", serif', 'Lora');
        dropdown.addOption('"Playfair Display", "Didot", serif', 'Playfair Display');
        dropdown.addOption('"Cormorant Garamond", Garamond, serif', 'Cormorant Garamond');
        dropdown.addOption('"Spectral", Georgia, serif', 'Spectral');
        dropdown.addOption('"Crimson Text", Georgia, serif', 'Crimson Text');
        // ── 中文字體（全部 †）──
        dropdown.addOption('-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif', 'PingFang SC / 微軟雅黑 †');
        dropdown.addOption('"PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif', 'PingFang TC / 微軟正黑體 †');
        dropdown.addOption('"Noto Sans TC", "Noto Sans SC", sans-serif', 'Noto Sans TC / SC †');
        dropdown.addOption('"Source Han Sans", "Noto Sans CJK", "思源黑體", sans-serif', 'Source Han Sans / 思源黑體 †');
        dropdown.addOption('"Source Han Serif", "Noto Serif CJK", "思源宋體", serif', 'Source Han Serif / 思源宋體 †');
        dropdown.addOption('"Hiragino Sans GB", "Heiti SC", "STHeiti", sans-serif', 'Hiragino / 黑體 †');
        dropdown.addOption('"STSong", "Songti SC", SimSun, serif', 'Songti / 宋體 †');
        dropdown.addOption('"STKaiti", "Kaiti SC", KaiTi, serif', 'Kaiti / 楷體 †');
        dropdown.addOption('"STFangsong", FangSong, serif', 'Fangsong / 仿宋 †');
        dropdown.addOption('"LiSu", "STLiSu", serif', 'LiSu / 隸書 †');
        dropdown.addOption('"STXingkai", "Xingkai SC", serif', 'Xingkai / 行楷 †');
        dropdown.addOption('"STZhongsong", "Zhongsong", serif', 'Zhongsong / 中宋 †');
        // ── 等寬字體 ──
        dropdown.addOption('Consolas, "Monaco", "Courier New", monospace', 'Consolas / Monaco †');
        dropdown.addOption('"Cascadia Code", "Cascadia Mono", monospace', 'Cascadia Code †');
        dropdown.addOption('"SF Mono", Menlo, monospace', 'SF Mono / Menlo †');
        dropdown.addOption('"Fira Code", "Source Code Pro", monospace', 'Fira Code');
        dropdown.addOption('"JetBrains Mono", monospace', 'JetBrains Mono');
        dropdown.addOption('"Inconsolata", monospace', 'Inconsolata');
        dropdown.addOption('"IBM Plex Mono", monospace', 'IBM Plex Mono');
        dropdown.addOption('"Courier Prime", "Courier New", monospace', 'Courier Prime');

        dropdown.setValue(this.plugin.settings.fontFamily);
        dropdown.onChange(async (value) => {
          this.plugin.settings.fontFamily = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        });
      });



    new Setting(containerEl)
      .setName('Font weight')
      .setDesc('Text thickness (300=Light, 400=Regular, 600=Semibold, 700=Bold)')
      .addSlider(slider => slider
        .setLimits(300, 700, 100)
        .setValue(this.plugin.settings.fontWeight)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.fontWeight = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Line height')
      .setDesc('Space between lines')
      .addSlider(slider => slider
        .setLimits(1.0, 2.5, 0.1)
        .setValue(this.plugin.settings.lineHeight)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.lineHeight = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Paragraph spacing')
      .setDesc('Space between paragraphs')
      .addSlider(slider => slider
        .setLimits(0.5, 2.5, 0.1)
        .setValue(this.plugin.settings.paragraphSpacing)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.paragraphSpacing = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Letter spacing')
      .setDesc('Space between characters')
      .addSlider(slider => slider
        .setLimits(-1, 3, 0.1)
        .setValue(this.plugin.settings.letterSpacing)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.letterSpacing = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Max line width')
      .setDesc('Maximum reading width (0 = unlimited)')
      .addSlider(slider => slider
        .setLimits(0, 1200, 50)
        .setValue(this.plugin.settings.maxWidth)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.maxWidth = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Page margin')
      .setDesc('Left and right padding')
      .addSlider(slider => slider
        .setLimits(0, 100, 5)
        .setValue(this.plugin.settings.pageMargin)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.pageMargin = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    new Setting(containerEl)
      .setName('Text alignment')
      .setDesc('How text lines up')
      .addDropdown(dropdown => dropdown
        .addOption('left', 'Left')
        .addOption('justify', 'Justify')
        .addOption('center', 'Center')
        .setValue(this.plugin.settings.textAlign)
        .onChange(async (value) => {
          this.plugin.settings.textAlign = value;
          this.plugin.saveThemeCustomization();
          await this.plugin.saveSettings();
          this.plugin.applyStyles();
        }));

    // Reset 按鈕
    new Setting(containerEl)
      .setName('Reset current theme')
      .setDesc('Reset current theme to its default values')
      .addButton(button => button
        .setButtonText('Reset')
        .setWarning()
        .onClick(async () => {
          await this.plugin.resetCurrentTheme();
          this.display();
        }));
  }
}
