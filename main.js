const { Plugin, ItemView, PluginSettingTab, Setting } = require('obsidian');

const VIEW_TYPE_KEYBOARD_GARDEN = 'keyboard-garden-view';

// ─── Default Settings ──────────────────────────────────────────
const DEFAULT_SETTINGS = {
  baseKeySize: 20,        // px, 1U standard (16/18/20/22/24)
  showLabels: true,       // show A, B, C... on keys
  showCounts: true,       // show keystroke count bottom-right
  flowerTheme: 'garden',  // garden | forest | fruit
  animationSpeed: 1,      // 0.3 - 2
  showTotalStats: true,   // top header stats bar
  keyGap: 2,              // px, 0-4
  soilColor: '#8B4513',   // bare key soil color (not used in inline CSS yet)
  ignoreModifiers: false, // skip Shift/Ctrl/Cmd/etc. from count
  customEmojis: {},       // per-stage override {0:'', 1:'🍃', ...}
  // thresholds: null,    // future: custom per-level thresholds
};

// ─── Flower Theme Presets (9 stages) ───────────────────────────
const FLOWER_THEMES = {
  garden: ['\u{1F343}','\u{1F331}','\u{1F33F}','\u{1F338}','\u{1F337}','\u{1F339}','\u{1F33A}','\u{1F33B}','\u{1F33C}'],
  forest: ['\u{1F340}','\u{1F341}','\u{1F342}','\u{1F343}','\u{1F332}','\u{1F333}','\u{1F334}','\u{1F33F}','\u{1F344}'],
  fruit:  ['\u{1F347}','\u{1F348}','\u{1F349}','\u{1F34A}','\u{1F34B}','\u{1F34C}','\u{1F34D}','\u{1F34E}','\u{1F34F}'],
};

function getThemeEmojis(settings) {
  const theme = FLOWER_THEMES[settings.flowerTheme] || FLOWER_THEMES.garden;
  return theme.map((emoji, i) => settings.customEmojis[i] || emoji);
}

// ─── Dynamic CSS Builder ───────────────────────────────────────
function buildCSS(settings) {
  const u  = settings.baseKeySize;
  const g  = settings.keyGap;
  const sp = settings.animationSpeed;

  // Key width helpers (all round to 2 decimals)
  const w1u25 = (u * 1.25).toFixed(2);  // fn, ctrl, opt, cmd
  const wTab   = (u * 2.5).toFixed(2);   // Tab, Backspace
  const wCaps  = (u * 1.75).toFixed(2);  // Caps, Enter
  const wShift = (u * 2.85).toFixed(2);  // left & right Shift

  // All 5 rows = same width: 15.5u + 13g
  // Row1: 13u + 2.5u + 13g | Row2: 2.5u + 13u + 13g
  // Row3: 1.75u + 12u + 1.75u + 13g | Row4: 2.85u + 10u + 2.85u + 11g
  // Row5: 7.5u + space + 6g
  const containerW = (u * 15.5 + g * 13).toFixed(2);
  const spaceW = (parseFloat(containerW) - u * 7.5 - g * 6).toFixed(2);

  return `
.kg-container { padding:10px 0; overflow-y:auto; height:100%; display:flex; flex-direction:column; align-items:center; }
.kg-header { margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid var(--background-modifier-border); text-align:center; }
.kg-header h3 { margin:0 0 2px; font-size:14px; }
.kg-stats { font-size:10.5px; color:var(--text-muted); margin:0; }

/* Keyboard layout — all rows = ${containerW}px */
.kg-keyboard {
  display:flex; flex-direction:column; gap:4px;
  width:${containerW}px; box-sizing:border-box;
  border:1px solid transparent;
  transform-origin: top center;
}
.kg-row {
  display:flex; align-items:flex-start; gap:${g}px;
  flex-shrink:0; height:32px;
  justify-content: center;
}

/* Key button */
.kg-key {
  position:relative; min-width:0; height:32px;
  background:linear-gradient(180deg, #F5F5F5 0%, #E8E8E8 40%, #D4D4D4 100%);
  border:1px solid #BDBDBD;
  border-radius:4px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all ${(0.15/sp).toFixed(2)}s ease; overflow:hidden; flex-shrink:0;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(0,0,0,.08);
}
.kg-key:hover { transform:translateY(-1px); box-shadow:inset 0 1px 0 rgba(255,255,255,.9), 0 3px 6px rgba(0,0,0,.12); }
.kg-key.kg-pressed { animation:kg-press ${(0.25/sp).toFixed(2)}s ease; }

@keyframes kg-press{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}

/* Key size variants */
.kg-1u   { width:${u}px; }
.kg-1u25 { width:${w1u25}px; }
.kg-2u5  { width:${wTab}px; }
.kg-tab  { width:${wTab}px; }
.kg-caps { width:${wCaps}px; }
.kg-enter{ width:${wCaps}px; }
.kg-shift-l { width:${wShift}px; }
.kg-shift-r { width:${wShift}px; }
.kg-space  { width:${spaceW}px; }

/* Label text */
.kg-label {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  font-size:9px; font-weight:500; color:#333;
  pointer-events:none; letter-spacing:.2px; z-index:1;
  text-align:center; line-height:1;
}

/* Flower overlay */
.kg-flower-wrap {
  position:absolute; inset:0; z-index:2;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  pointer-events:none;
}
.kg-flower { line-height:1; filter:drop-shadow(0 1px 2px rgba(0,0,0,.2)); transition:all ${(0.35/sp).toFixed(2)}s ease; }
.kg-count {
  position:absolute; bottom:1px; right:2px;
  font-size:6px; color:rgba(80,60,40,.85); font-weight:800;
  text-shadow:0 0 2px rgba(255,255,255,.8); z-index:3;
}

/* Level colors (10 levels) */
.kg-key[data-level="0"] { border-color:#BDBDBD; background:linear-gradient(180deg,#F5F5F5 0%,#E8E8E8 40%,#D4D4D4 100%); }
.kg-key[data-level="1"] { border-color:#81C784; background:linear-gradient(180deg,#C8E6C9 0%,#A5D6A7 60%,#81C784 100%); }
.kg-key[data-level="2"] { border-color:#66BB6A; background:linear-gradient(180deg,#A5D6A7 0%,#81C784 60%,#66BB6A 100%); }
.kg-key[data-level="3"] { border-color:#FFB74D; background:linear-gradient(180deg,#FFE0B2 0%,#FFCC80 60%,#FFB74D 100%); }
.kg-key[data-level="4"] { border-color:#FF7043; background:linear-gradient(180deg,#FFCCBC 0%,#FFAB91 60%,#FF7043 100%); }
.kg-key[data-level="5"] { border-color:#EC407A; box-shadow:0 0 6px rgba(236,64,122,.2), inset 0 1px 0 rgba(255,255,255,.5); background:linear-gradient(180deg,#F48FB1 0%,#F06292 60%,#EC407A 100%); }
.kg-key[data-level="6"] { border-color:#AB47BC; box-shadow:0 0 8px rgba(171,71,188,.25), inset 0 1px 0 rgba(255,255,255,.5); background:linear-gradient(180deg,#CE93D8 0%,#BA68C8 60%,#AB47BC 100%); }
.kg-key[data-level="7"] { border-color:#FFC107; box-shadow:0 0 12px rgba(255,193,7,.35), inset 0 1px 0 rgba(255,255,255,.5); background:linear-gradient(180deg,#FFF59D 0%,#FFEE58 60%,#FFC107 100%); }
.kg-key[data-level="8"] { border-color:#26C6DA; box-shadow:0 0 16px rgba(38,198,218,.45), inset 0 1px 0 rgba(255,255,255,.4); background:linear-gradient(180deg,#80DEEA 0%,#4DD0E1 60%,#26C6DA 100%); animation:kg-glow ${(2/sp).toFixed(2)}s ease-in-out infinite alternate; }
.kg-key[data-level="9"] { border-color:#FF5722; box-shadow:0 0 20px rgba(255,87,34,.5), inset 0 1px 0 rgba(255,255,255,.4); background:linear-gradient(180deg,#FFAB91 0%,#FF8A65 60%,#FF5722 100%); animation:kg-glow-fire ${(2/sp).toFixed(2)}s ease-in-out infinite alternate; }

@keyframes kg-bloom {
  0%{transform:scale(0) rotate(-30deg); opacity:0}
  60%{transform:scale(1.15) rotate(10deg); opacity:1}
  100%{transform:scale(1) rotate(0deg); opacity:1}
}
.kg-flower-wrap .kg-flower { animation:kg-bloom ${(0.4/sp).toFixed(2)}s ease-out; }

@keyframes kg-glow {
  from { box-shadow:0 0 12px rgba(38,198,218,.4), 0 0 24px rgba(38,198,218,.18); }
  to   { box-shadow:0 0 24px rgba(38,198,218,.6), 0 0 48px rgba(38,198,218,.28), 0 0 72px rgba(38,198,218,.12); }
}
@keyframes kg-glow-fire {
  from { box-shadow:0 0 14px rgba(255,87,34,.45), 0 0 28px rgba(255,87,34,.22); }
  to   { box-shadow:0 0 28px rgba(255,87,34,.65), 0 0 56px rgba(255,87,34,.35), 0 0 84px rgba(255,87,34,.15); }
}

/* Scrollbar */
.kg-container::-webkit-scrollbar { width:3px; }
.kg-container::-webkit-scrollbar-thumb { background:var(--background-modifier-border); border-radius:2px; }
`;
}

function getContainerWidth(settings) {
  const u = settings.baseKeySize;
  const g = settings.keyGap;
  return u * 15.5 + g * 13;
}

// ─── Keyboard Layout ───────────────────────────────────────────
const KEYBOARD_ROWS = [
  // Row 1: ` 1 2 3 4 5 6 7 8 9 0 - = Backspace
  [
    ['`',    'kg-1u'],
    ['1',    'kg-1u'], ['2','kg-1u'], ['3','kg-1u'], ['4','kg-1u'], ['5','kg-1u'],
    ['6',    'kg-1u'], ['7','kg-1u'], ['8','kg-1u'], ['9','kg-1u'], ['0','kg-1u'],
    ['-',    'kg-1u'], ['=','kg-1u'],
    ['⌫',    'kg-2u5'],
  ],
  // Row 2: Tab Q W E R T Y U I O P [ ] \
  [
    ['tab',  'kg-tab'],
    ['Q',    'kg-1u'], ['W','kg-1u'], ['E','kg-1u'], ['R','kg-1u'], ['T','kg-1u'],
    ['Y',    'kg-1u'], ['U','kg-1u'], ['I','kg-1u'], ['O','kg-1u'], ['P','kg-1u'],
    ['[',    'kg-1u'], [']','kg-1u'], ['\\','kg-1u'],
  ],
  // Row 3: Caps A S D F G H J K L ; ' Enter
  [
    ['caps', 'kg-caps'],
    ['A',    'kg-1u'], ['S','kg-1u'], ['D','kg-1u'], ['F','kg-1u'], ['G','kg-1u'],
    ['H',    'kg-1u'], ['J','kg-1u'], ['K','kg-1u'], ['L','kg-1u'],
    [';',    'kg-1u'], ["'",'kg-1u'],
    ['enter','kg-enter'],
  ],
  // Row 4: Shift Z X C V B N M , . / Shift
  [
    ['shift','kg-shift-l'],
    ['Z',    'kg-1u'], ['X','kg-1u'], ['C','kg-1u'], ['V','kg-1u'], ['B','kg-1u'],
    ['N',    'kg-1u'], ['M','kg-1u'],
    [',',    'kg-1u'], ['.','kg-1u'], ['/','kg-1u'],
    ['shift2','kg-shift-r'],
  ],
  // Row 5: Fn Ctrl Opt Cmd Space Cmd Opt
  [
    ['fn',   'kg-1u25'],
    ['ctrl', 'kg-1u25'],
    ['opt',  'kg-1u25'],
    ['cmd',  'kg-1u25'],
    [' ',    'kg-space'],
    ['cmd2', 'kg-1u25'],
    ['opt2', 'kg-1u25'],
  ],
];

const KEY_LABELS = {
  '`':'`', '1':'1', '2':'2', '3':'3', '4':'4', '5':'5',
  '6':'6', '7':'7', '8':'8', '9':'9', '0':'0', '-':'-', '=':'=',
  '⌫':'⌫',
  'tab':'Tab', 'Q':'Q', 'W':'W', 'E':'E', 'R':'R', 'T':'T',
  'Y':'Y', 'U':'U', 'I':'I', 'O':'O', 'P':'P', '[':'[', ']':']', '\\':'\\',
  'caps':'Caps', 'A':'A', 'S':'S', 'D':'D', 'F':'F', 'G':'G',
  'H':'H', 'J':'J', 'K':'K', 'L':'L', ';':';', "'":"'",
  'enter':'↵',
  'shift':'⇧', 'shift2':'⇧',
  'Z':'Z', 'X':'X', 'C':'C', 'V':'V', 'B':'B', 'N':'N', 'M':'M',
  ',':',', '.':'.', '/':'/',
  'fn':'Fn', 'ctrl':'⌃', 'opt':'⌥', 'cmd':'⌘', 'cmd2':'⌘', 'opt2':'⌥', ' ':' ',
};

function toEventKey(dk) {
  const m = {
    '⌫':'Backspace', 'tab':'Tab', 'caps':'CapsLock', 'enter':'Enter',
    'shift':'Shift', 'shift2':'Shift', 'ctrl':'Control', 'opt':'Alt',
    'cmd':'Meta', 'fn':'Fn',
    'del':'Delete', 'pgup':'PageUp', 'pgdn':'PageDown',
    'home':'Home', 'end':'End',
    ' ':' ', '`^':'`',
    ';':';', "'":"'", ',':',', '.':'.', '/':'/', '`':'`', '-':'-', '=':'=',
    '[':'[', ']':']', '\\':'\\',
  };
  return m[dk] || dk.toLowerCase();
}

// ─── Modifier key list for ignoreModifiers ─────────────────────
const MODIFIER_KEYS = new Set([
  'Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight',
  'Fn', 'OS', 'Symbol', 'SymbolLock', 'Hyper',
]);

// ─── Flower Stages ─────────────────────────────────────────────
const FLOWER_STAGES = [
  { min: 1,      emoji: '\u{1F343}', size: 13, name: 'Leaf',     label: '1-10' },
  { min: 11,     emoji: '\u{1F331}', size: 14, name: 'Seedling', label: '11-30' },
  { min: 31,     emoji: '\u{1F33F}', size: 16, name: 'Herb',     label: '31-80' },
  { min: 81,     emoji: '\u{1F338}', size: 18, name: 'Blossom',  label: '81-200' },
  { min: 201,    emoji: '\u{1F337}', size: 19, name: 'Tulip',    label: '201-500' },
  { min: 501,    emoji: '\u{1F339}', size: 21, name: 'Rose',     label: '501-1000' },
  { min: 1001,   emoji: '\u{1F33A}', size: 23, name: 'Hibiscus', label: '1001-3000' },
  { min: 3001,   emoji: '\u{1F33B}', size: 25, name: 'Sunflower',label: '3001-5000' },
  { min: 5001,   emoji: '\u{1F33C}', size: 27, name: 'Bloom',    label: '5000+' },
];

function getFlowerStage(count, themeEmojis) {
  if (count <= 0) return { ...FLOWER_STAGES[0], level: 0, emoji: '', size: 0 };
  for (let i = FLOWER_STAGES.length - 1; i >= 0; i--) {
    if (count >= FLOWER_STAGES[i].min) {
      const stage = { ...FLOWER_STAGES[i], level: i };
      // Apply theme emoji if available
      if (themeEmojis && themeEmojis[i]) stage.emoji = themeEmojis[i];
      return stage;
    }
  }
  return { ...FLOWER_STAGES[0], level: 0 };
}

// ─── Keyboard Garden View ─────────────────────────────────────
class KeyboardGardenView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType()   { return VIEW_TYPE_KEYBOARD_GARDEN; }
  getDisplayText() { return 'Keyboard Garden'; }
  getIcon()       { return 'lucide-flower-2'; }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('kg-container');

    const settings = this.plugin.settings;

    // Header (conditional)
    if (settings.showTotalStats) {
      const header = container.createEl('div', { cls: 'kg-header' });
      header.createEl('h3', { text: '\u{1F33B} Keyboard Garden' });
      this._statsEl = header.createEl('p', { cls: 'kg-stats' });
      this._statsEl.textContent = 'Total keystrokes: ' + (this.plugin.getTotalKeystrokes() || 0);
    } else {
      this._statsEl = null;
    }

    this.kbContainer = container.createEl('div', { cls: 'kg-keyboard' });
    this.renderKeyboard();
    this.resizeKeyboard();

    this._resizeObserver = new ResizeObserver(() => this.resizeKeyboard());
    this._resizeObserver.observe(container);
  }

  async onClose() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }

  resizeKeyboard() {
    if (!this.kbContainer) return;
    const parent = this.kbContainer.parentElement;
    if (!parent) return;
    const settings = this.plugin.settings;
    const kw = getContainerWidth(settings);
    const scale = Math.min(1, (parent.clientWidth - 20) / kw);
    this.kbContainer.style.transform = `scale(${scale})`;
  }

  rebuildView() {
    // Called when settings require full rebuild (key size change, gap change)
    this.onOpen();
  }

  updateKeyboard() {
    const settings = this.plugin.settings;

    // Update header if visible
    if (this._statsEl) {
      this._statsEl.textContent = 'Total keystrokes: ' + (this.plugin.getTotalKeystrokes() || 0);
    } else if (settings.showTotalStats) {
      // Header now required but element missing — rebuild
      this.rebuildView();
      return;
    }

    this.kbContainer.querySelectorAll('.kg-key').forEach((el) => {
      const k = el.getAttribute('data-key');
      if (k !== null) {
        this.updateKey(el, k, this.plugin.getKeyCount(k), settings);
      }
    });
  }

  renderKeyboard() {
    this.kbContainer.empty();
    const settings = this.plugin.settings;

    KEYBOARD_ROWS.forEach((row, rowIdx) => {
      const rowEl = this.kbContainer.createEl('div', { cls: 'kg-row' });

      row.forEach(([key, sizeClass]) => {
        const keyEl = rowEl.createEl('div', {
          cls: 'kg-key ' + sizeClass,
          attr: { 'data-key': toEventKey(key) }
        });

        // Label
        if (settings.showLabels) {
          const label = KEY_LABELS[key] || key.toUpperCase();
          keyEl.createEl('span', { cls: 'kg-label', text: label });
        }

        keyEl.createEl('div', { cls: 'kg-flower-wrap' });
        this.updateKey(keyEl, toEventKey(key), this.plugin.getKeyCount(toEventKey(key)), settings);
      });
    });
  }

  updateKey(el, key, count, settings) {
    const wrap = el.querySelector('.kg-flower-wrap');
    if (!wrap) return;
    wrap.empty();

    const themeEmojis = getThemeEmojis(settings);
    const stage = getFlowerStage(count, themeEmojis);
    el.setAttribute('data-level', String(stage.level));

    if (count > 0 && stage.emoji) {
      wrap.createEl('span', { cls: 'kg-flower', text: stage.emoji }).style.fontSize = stage.size + 'px';

      if (settings.showCounts) {
        wrap.createEl('span', { cls: 'kg-count', text: String(count) });
      }
    }
  }
}

// ─── Settings Tab ──────────────────────────────────────────────
class KeyboardGardenSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const s = this.plugin.settings;

    containerEl.createEl('h2', { text: 'Keyboard Garden Settings / 键盘花园设置' });

    // ── 高优先级 ──
    containerEl.createEl('h3', { text: '⭐ Main / 主要' });

    new Setting(containerEl)
      .setName('1U base size / 基础键宽')
      .setDesc('Standard key width in pixels. Affects overall keyboard scale. (default: 20)\n标准按键宽度(像素)，影响整体键盘缩放比例。默认: 20')
      .addDropdown(d => d
        .addOption('16', '16px (Small / 小)')
        .addOption('18', '18px')
        .addOption('20', '20px (Default / 默认)')
        .addOption('22', '22px')
        .addOption('24', '24px (Large / 大)')
        .setValue(String(s.baseKeySize))
        .onChange(async (val) => {
          s.baseKeySize = parseInt(val);
          await this.plugin.saveSettings();
          this.plugin.rebuildAllViews();
        }));

    new Setting(containerEl)
      .setName('Show key labels / 显示按键标签')
      .setDesc('Display A, B, C... text on each key. Disable for pure garden view.\n在每个按键上显示字母标签。关闭后纯净花圃模式。')
      .addToggle(t => t
        .setValue(s.showLabels)
        .onChange(async (val) => {
          s.showLabels = val;
          await this.plugin.saveSettings();
          this.plugin.rebuildAllViews();
        }));

    new Setting(containerEl)
      .setName('Show keystroke counts / 显示敲击次数')
      .setDesc('Show hit count in bottom-right corner of each key.\n在按键右下角显示该键的敲击次数。')
      .addToggle(t => t
        .setValue(s.showCounts)
        .onChange(async (val) => {
          s.showCounts = val;
          await this.plugin.saveSettings();
          this.plugin.updateAllViews();
        }));

    new Setting(containerEl)
      .setName('Flower theme / 花朵主题')
      .setDesc('Choose the plant/emoji set for each growth stage.\n选择各生长阶段的植物/emoji主题。')
      .addDropdown(d => d
        .addOption('garden', '🌻 Garden / 花园 (flowers)')
        .addOption('forest', '🌲 Forest / 森林 (trees)')
        .addOption('fruit',  '🍎 Fruit / 水果 (fruits)')
        .setValue(s.flowerTheme)
        .onChange(async (val) => {
          s.flowerTheme = val;
          await this.plugin.saveSettings();
          this.plugin.updateAllViews();
        }));

    new Setting(containerEl)
      .setName('Reset statistics / 重置统计')
      .setDesc('Clear all keystroke counts. Your garden starts fresh.\n清零所有按键统计，花园重新开始。')
      .addButton(b => b
        .setButtonText('Reset All / 全部重置')
        .setWarning()
        .onClick(async () => {
          this.plugin.settings.keyCounts = {};
          this.plugin.settings.totalKeystrokes = 0;
          await this.plugin.saveSettings();
          this.plugin.updateAllViews();
        }));

    // ── 中优先级 ──
    containerEl.createEl('h3', { text: '⭐⭐ Medium / 中等' });

    new Setting(containerEl)
      .setName('Animation speed / 动画速度')
      .setDesc('Control bloom & glow animation speed. 1 = normal.\n控制开花和发光动画速度。1 = 正常。')
      .addDropdown(d => d
        .addOption('0.5', '0.5x (Slow / 慢)')
        .addOption('0.75', '0.75x')
        .addOption('1', '1x (Default / 默认)')
        .addOption('1.5', '1.5x')
        .addOption('2', '2x (Fast / 快)')
        .setValue(String(s.animationSpeed))
        .onChange(async (val) => {
          s.animationSpeed = parseFloat(val);
          await this.plugin.saveSettings();
          this.plugin.rebuildAllViews();
        }));

    new Setting(containerEl)
      .setName('Show total stats / 显示统计栏')
      .setDesc('Display "Total keystrokes" bar at the top.\n在顶部显示总敲击次数统计栏。')
      .addToggle(t => t
        .setValue(s.showTotalStats)
        .onChange(async (val) => {
          s.showTotalStats = val;
          await this.plugin.saveSettings();
          this.plugin.rebuildAllViews();
        }));

    // ── 低优先级 ──
    containerEl.createEl('h3', { text: '⭐⭐⭐ Low / 次要' });

    new Setting(containerEl)
      .setName('Key gap / 按键间隙')
      .setDesc('Space between keys in pixels. 0 = tight, 4 = loose.\n按键之间的像素间距。0=紧凑，4=宽松。')
      .addDropdown(d => d
        .addOption('0', '0px (Tight / 紧凑)')
        .addOption('1', '1px')
        .addOption('2', '2px (Default / 默认)')
        .addOption('3', '3px')
        .addOption('4', '4px (Loose / 宽松)')
        .setValue(String(s.keyGap))
        .onChange(async (val) => {
          s.keyGap = parseInt(val);
          await this.plugin.saveSettings();
          this.plugin.rebuildAllViews();
        }));

    new Setting(containerEl)
      .setName('Soil color / 泥土颜色')
      .setDesc('Base color for bare (unused) keys.\n未使用按键的底色。')
      .addText(t => t
        .setValue(s.soilColor)
        .onChange(async (val) => {
          s.soilColor = val || '#8B4513';
          await this.plugin.saveSettings();
          this.plugin.rebuildAllViews();
        }));

    new Setting(containerEl)
      .setName('Ignore modifier keys / 忽略修饰键')
      .setDesc('Skip Shift, Ctrl, Alt, Cmd from tracking. Only count letters/numbers.\n不计入 Shift、Ctrl、Alt、Cmd 修饰键，仅统计字母和数字。')
      .addToggle(t => t
        .setValue(s.ignoreModifiers)
        .onChange(async (val) => {
          s.ignoreModifiers = val;
          await this.plugin.saveSettings();
        }));
  }
}

// ─── Main Plugin ───────────────────────────────────────────────
module.exports = class KeyboardGardenPlugin extends Plugin {

  async onload() {
    await this.loadSettings();

    // Inject dynamic CSS
    this._styleEl = Object.assign(document.createElement('style'), {
      textContent: buildCSS(this.settings),
      id: 'kg-dynamic-css'
    });
    document.head.appendChild(this._styleEl);

    this.registerView(VIEW_TYPE_KEYBOARD_GARDEN, (leaf) =>
      new KeyboardGardenView(leaf, this)
    );

    // Settings tab
    this.addSettingTab(new KeyboardGardenSettingTab(this.app, this));

    this.addRibbonIcon('lucide-flower-2', 'Keyboard Garden', () => this.activateView());

    this._onKeydown = (e) => this.handleKeydown(e);
    document.addEventListener('keydown', this._onKeydown);

    this.addCommand({
      id: 'open-keyboard-garden',
      name: 'Open Keyboard Garden',
      callback: () => this.activateView()
    });

    console.log('[Keyboard Garden] Loaded! Total:', this.getTotalKeystrokes());
  }

  onunload() {
    document.removeEventListener('keydown', this._onKeydown);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN);
    // Remove injected CSS
    const el = document.getElementById('kg-dynamic-css');
    if (el) el.remove();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data, {
      keyCounts: (data && data.keyCounts) || {},
      totalKeystrokes: (data && data.totalKeystrokes) || 0,
    });
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ── CSS & View mgmt ──────────────────────────────────────────

  rebuildAllViews() {
    this._styleEl.textContent = buildCSS(this.settings);
    this.app.workspace.getLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN).forEach((leaf) => {
      if (leaf.view instanceof KeyboardGardenView) leaf.view.rebuildView();
    });
  }

  updateAllViews() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN).forEach((leaf) => {
      if (leaf.view instanceof KeyboardGardenView) leaf.view.updateKeyboard();
    });
  }

  // ── Keystroke handling ───────────────────────────────────────

  handleKeydown(event) {
    const key = event.key;

    // Skip modifier keys if setting enabled
    if (this.settings.ignoreModifiers && MODIFIER_KEYS.has(key)) return;

    if (!this.settings.keyCounts[key]) this.settings.keyCounts[key] = 0;
    this.settings.keyCounts[key]++;
    this.settings.totalKeystrokes++;
    this.saveSettings();
    this.updateAllViews();
  }

  // ── View activation ──────────────────────────────────────────

  async activateView() {
    const ws = this.app.workspace;
    let leaf = ws.getLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN)[0];
    if (!leaf) {
      const rightLeaf = ws.getRightLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({ type: VIEW_TYPE_KEYBOARD_GARDEN, active: true });
        leaf = rightLeaf;
      }
    }
    if (leaf) ws.revealLeaf(leaf);
  }

  // ── Queries ──────────────────────────────────────────────────

  getKeyCount(key)     { return (this.settings.keyCounts && this.settings.keyCounts[key]) || 0; }
  getTotalKeystrokes() { return (this.settings && this.settings.totalKeystrokes) || 0; }
  getTopKeys(n) {
    if (!this.settings || !this.settings.keyCounts) return [];
    return Object.entries(this.settings.keyCounts)
      .sort((a,b) => b[1]-a[1])
      .slice(0,n)
      .map(([key,count]) => ({key,count}));
  }
};