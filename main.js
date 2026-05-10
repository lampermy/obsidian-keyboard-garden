/* ─── Keyboard Garden V2 ────────────────────────────────────────
 * Seasonal keycap themes · 3D keys · Weather effects · Time stats
 * ──────────────────────────────────────────────────────────── */

const { Plugin, ItemView, PluginSettingTab, Setting } = require('obsidian');
const VIEW_TYPE = 'keyboard-garden-v2-view';

// ═══════════════════════════════════════════════════════════════
// i18n
// ═══════════════════════════════════════════════════════════════
const L = {
  zh: {
    header: '键盘花园 V2',
    stats: { today:'今日', week:'本周', month:'本月', year:'今年' },
    settings: {
      title:'键盘花园 V2 设置',
      main:'主要', weather:'天气效果', display:'显示', misc:'其他', management:'管理',
      lang:'界面语言', langDesc:'设置面板和统计栏显示语言。',
      keycapTheme:'键帽主题', keycapThemeDesc:'切换键帽配色方案：四季、海洋、森林，或自定义颜色。',
      baseKeySize:'基础键宽', baseKeySizeDesc:'标准按键宽度(像素)，影响整体键盘缩放。默认: 20',
      showLabels:'显示按键标签', showLabelsDesc:'在按键上显示字母。关闭后纯净花圃模式。',
      showCounts:'显示敲击次数', showCountsDesc:'在按键右下角显示敲击次数。',
      flowerTheme:'花朵主题', flowerThemeDesc:'选择各生长阶段的植物/emoji主题。',
      weatherEnabled:'天气效果', weatherEnabledDesc:'下雪、下雨、冰雹、云朵飘过，由敲击里程碑自动触发。',
      animationSpeed:'动画速度', animationSpeedDesc:'开花和发光动画播放速度。1 = 正常。',
      showTotalStats:'显示统计栏', showTotalStatsDesc:'在顶部显示敲击总数和时间段统计。',
      keyGap:'按键间隙', keyGapDesc:'按键之间的像素间距。0 = 紧凑，4 = 宽松。',
      ignoreModifiers:'忽略修饰键', ignoreModifiersDesc:'不计入 Shift、Ctrl、Alt、Cmd。',
      heatmapMode:'热力图模式', heatmapModeDesc:'按键颜色根据敲击频率呈现红→橙→黄渐变（取代阶段颜色）。',
      darkModeAdapt:'暗色模式适配', darkModeAdaptDesc:'自动调暗键帽颜色以适配 Obsidian 暗色主题。',
      dailyGoal:'每日目标', dailyGoalDesc:'每日击键目标数。达标后在统计栏显示 🎯。',
      weeklyGoal:'每周目标', weeklyGoalDesc:'每周击键目标数。',
      miniMode:'迷你模式', miniModeDesc:'默认只显示统计数字和花园，点击展开完整键盘。',
      showWPM:'显示 WPM', showWPMDesc:'在统计栏显示实时打字速度。',
      autoDark:'自动暗色', autoDarkDesc:'检测系统深色模式偏好，自动应用暗色键帽方案。',
      soundEnabled:'按键音效', soundEnabledDesc:'每次击键播放轻柔机械键盘声（Web Audio）。',
      bgEnabled:'背景色', bgEnabledDesc:'为键盘画布添加背景色，让层次感更强。',
      bgColor:'背景颜色', bgColorDesc:'自定义键盘背景颜色。',
      customFlower:'自定义花朵', customFlowerDesc:'为每个生长阶段设置自定义 emoji 和触发阈值（按所选花朵主题分别配置）。',
      flowerStage:'第{s}阶段',
      customStageMin:'阶段最小值', customStageMinDesc:'达到该击键数才能进入此阶段。',
      reset:'重置统计', resetDesc:'清零所有按键统计和每日记录，花园重新开始。',
      resetBtn:'全部重置',
      customTheme:'自定义键帽颜色', customThemeDesc:'选择自定义颜色来绘制你的键帽。仅在主题设为「自定义」时生效。',
      customTop:'键帽顶部色', customBottom:'键帽底部色',
      customBorder:'边框色', customBorderHover:'悬停边框色', customLabel:'标签色',
      // weather info
      weatherThreshold:'天气触发阈值', weatherThresholdDesc:'设置每种天气的总敲击触发门槛。0 表示禁用该天气。',
      weatherThresholdCloud:'☁️ 云朵飘过触发阈值', weatherThresholdRain:'🌧️ 下雨触发阈值', weatherThresholdSnow:'❄️ 下雪触发阈值', weatherThresholdHail:'🧊 冰雹触发阈值',
      weatherInfo:'天气概率：云朵 30%、下雨 20%、下雪 25%、冰雹 12%，每 2 分钟最多触发一次。',
      // dropdowns
      pxSmall:'16px (小)', px18:'18px', pxDefault:'20px (默认)', px22:'22px', pxLarge:'24px (大)',
      gapTight:'0px (紧凑)', gap1:'1px', gap2:'2px (默认)', gap3:'3px', gapLoose:'4px (宽松)',
      speedSlow:'0.5x (慢)', speed75:'0.75x', speedNormal:'1x (默认)', speed15:'1.5x', speedFast:'2x (快)',
      themeGarden:'🌻 花园', themeForest:'🌲 森林', themeFruit:'🍎 水果', themeCustom:'🎨 自定义',
      exportData:'导出数据', exportDataDesc:'下载 JSON 格式的花园数据备份',
      importData:'导入数据', importDataDesc:'从 JSON 备份文件恢复花园数据',
    },
  },
  en: {
    header: 'Keyboard Garden V2',
    stats: { today:'Today', week:'Week', month:'Month', year:'Year' },
    settings: {
      title:'Keyboard Garden V2 Settings',
      main:'Main', weather:'Weather', display:'Display', misc:'Misc', management:'Management',
      lang:'Language', langDesc:'UI language for settings and stats.',
      keycapTheme:'Keycap Theme', keycapThemeDesc:'Choose keycap style: seasonal, ocean, forest, or custom colors.',
      baseKeySize:'1U Base Size', baseKeySizeDesc:'Standard key width in pixels. Affects overall scale. Default: 20',
      showLabels:'Show Key Labels', showLabelsDesc:'Display letters on keys. Disable for pure garden view.',
      showCounts:'Show Keystroke Counts', showCountsDesc:'Show hit count in bottom-right corner of each key.',
      flowerTheme:'Flower Theme', flowerThemeDesc:'Choose the plant/emoji set for each growth stage.',
      weatherEnabled:'Weather Effects', weatherEnabledDesc:'Snow, rain, hail, and cloud drift triggered by typing milestones.',
      animationSpeed:'Animation Speed', animationSpeedDesc:'Bloom and glow animation speed. 1 = normal.',
      showTotalStats:'Show Stats Bar', showTotalStatsDesc:'Display keystroke totals and period selector at the top.',
      keyGap:'Key Gap', keyGapDesc:'Space between keys in pixels. 0 = tight, 4 = loose.',
      ignoreModifiers:'Ignore Modifier Keys', ignoreModifiersDesc:'Skip Shift, Ctrl, Alt, Cmd from tracking.',
      heatmapMode:'Heatmap Mode', heatmapModeDesc:'Keys colored by keystroke frequency (red→orange→yellow) instead of stage colors.',
      darkModeAdapt:'Dark Mode Adaptation', darkModeAdaptDesc:'Auto-darken keycap colors for Obsidian dark theme.',
      dailyGoal:'Daily Goal', dailyGoalDesc:'Daily keystroke target. 🎯 appears when met.',
      weeklyGoal:'Weekly Goal', weeklyGoalDesc:'Weekly keystroke target.',
      miniMode:'Mini Mode', miniModeDesc:'Show compact stats + flower only; click to expand full keyboard.',
      showWPM:'Show WPM', showWPMDesc:'Display real-time typing speed in stats bar.',
      autoDark:'Auto Dark', autoDarkDesc:'Detect system dark mode preference and auto-apply dark keycap theme.',
      soundEnabled:'Key Sound', soundEnabledDesc:'Play a gentle mechanical keyboard click on each keystroke (Web Audio).',
      bgEnabled:'Background', bgEnabledDesc:'Add background color to keyboard canvas for better depth.',
      bgColor:'Background Color', bgColorDesc:'Custom background color for keyboard canvas.',
      customFlower:'Custom Flowers', customFlowerDesc:'Override flower emoji for each growth stage (per theme).',
      customStageMin:'Stage {s} Min', customStageMinDesc:'Minimum keystrokes to reach this stage.',
      reset:'Reset Statistics', resetDesc:'Clear all keystroke counts and daily history. Garden starts fresh.',
      resetBtn:'Reset All',
      customTheme:'Custom Keycap Colors', customThemeDesc:'Pick your own keycap colors. Only applies when theme is set to Custom.',
      customTop:'Keycap Top', customBottom:'Keycap Bottom',
      customBorder:'Border Color', customBorderHover:'Hover Border', customLabel:'Label Color',
      weatherThreshold:'Weather Trigger Thresholds', weatherThresholdDesc:'Set total keystroke threshold for each weather. 0 disables a type.',
      weatherThresholdCloud:'☁️ Cloud drift threshold', weatherThresholdRain:'🌧️ Rain threshold', weatherThresholdSnow:'❄️ Snow threshold', weatherThresholdHail:'🧊 Hail threshold',
      weatherInfo:'Probabilities: cloud 30%, rain 20%, snow 25%, hail 12%. Cooldown: 2 minutes.',
      pxSmall:'16px (Small)', px18:'18px', pxDefault:'20px (Default)', px22:'22px', pxLarge:'24px (Large)',
      gapTight:'0px (Tight)', gap1:'1px', gap2:'2px (Default)', gap3:'3px', gapLoose:'4px (Loose)',
      speedSlow:'0.5x (Slow)', speed75:'0.75x', speedNormal:'1x (Default)', speed15:'1.5x', speedFast:'2x (Fast)',
      themeGarden:'🌻 Garden', themeForest:'🌲 Forest', themeFruit:'🍎 Fruit', themeCustom:'🎨 Custom',
      exportData:'Export Data', exportDataDesc:'Download garden data as JSON backup',
      importData:'Import Data', importDataDesc:'Restore garden data from a JSON backup',
    },
  },
};
function tr(s, key) {
  const lang = L[s.lang] || L.en;
  return key.split('.').reduce((o,k)=>o?.[k],lang) || key;
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT SETTINGS
// ═══════════════════════════════════════════════════════════════
const DEFAULT_SETTINGS = {
  baseKeySize: 20, showLabels: true, showCounts: true,
  flowerTheme: 'garden', animationSpeed: 1, showTotalStats: true,
  keyGap: 2, ignoreModifiers: false,
  customEmojis: {},
  keycapTheme: 'default', weatherEnabled: true,
  lang: 'zh',
  customTheme: { top:'#F5F5F5', bottom:'#D4D4D4', border:'#BDBDBD', hover:'#9E9E9E', label:'#333333' },
  weatherThresholds: { cloud:3000, rain:6000, snow:10000, hail:15000 },
  weatherTriggered: {},
  heatmapMode: false, darkModeAdapt: true,
  dailyGoal: 1000, weeklyGoal: 5000,
  miniMode: false, autoDark: true, soundEnabled: false, bgEnabled: false, bgColor: '#222831',
  showWPM: true,
  customStageMins: [1,11,31,81,201,501,1001,3001,5001],
  dailyCounts: {}, totalKeystrokes: 0, keyCounts: {},
};

// ═══════════════════════════════════════════════════════════════
// KEYCAP THEMES ─ reworked: 7 themes with distinct seasonal colors
// ═══════════════════════════════════════════════════════════════
const KEYCAP_THEMES = {
  default: {
    name:{en:'Default',zh:'默认'}, emoji:'⌨️',
    top:'#F5F5F5', bottom:'#D4D4D4', border:'#BDBDBD', hover:'#9E9E9E', label:'#333333',
  },
  spring: {
    name:{en:'Spring',zh:'春'}, emoji:'🌸',
    top:'#FFE4EC', bottom:'#F06292', border:'#EC407A', hover:'#D81B60', label:'#AD1457',
  },
  summer: {
    name:{en:'Summer',zh:'夏'}, emoji:'☀️',
    top:'#FFFDE7', bottom:'#FFD54F', border:'#FFB300', hover:'#FF8F00', label:'#BF360C',
  },
  autumn: {
    name:{en:'Autumn',zh:'秋'}, emoji:'🍂',
    top:'#FFF8E1', bottom:'#FF8F00', border:'#EF6C00', hover:'#E65100', label:'#3E2723',
  },
  winter: {
    name:{en:'Winter',zh:'冬'}, emoji:'❄️',
    top:'#F4FAFF', bottom:'#B0C4DE', border:'#87CEEB', hover:'#5C9CE6', label:'#1A237E',
  },
  ocean: {
    name:{en:'Ocean',zh:'海洋'}, emoji:'🌊',
    top:'#B2EBF2', bottom:'#006064', border:'#00838F', hover:'#004D40', label:'#E0F7FA',
  },
  forest: {
    name:{en:'Forest',zh:'森林'}, emoji:'🌲',
    top:'#C8E6C9', bottom:'#1B5E20', border:'#2E7D32', hover:'#0D3B0F', label:'#E8F5E9',
  },
  heatmap: {
    name:{en:'Heatmap',zh:'热力图'}, emoji:'🔥',
    top:'#FFFDE7', bottom:'#BF360C', border:'#E65100', hover:'#D84315', label:'#3E2723',
  },
  custom: {
    name:{en:'Custom',zh:'自定义'}, emoji:'🎨',
    top:'#F5F5F5', bottom:'#D4D4D4', border:'#BDBDBD', hover:'#9E9E9E', label:'#333333',
  },
};

// ═══════════════════════════════════════════════════════════════
// FLOWER THEME PRESETS
// ═══════════════════════════════════════════════════════════════
const FLOWER_THEMES = {
  garden: ['🍃','🌱','🌿','🌸','🌷','🌹','🌺','🌻','🌼'],
  forest: ['🍀','🌱','🌿','🌳','🌲','🎄','🌴','🏵️','🏔️'],
  fruit:  ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🍎','🍐'],
  custom: ['🌸','🌷','🌹','🌺','🌻','🌼','🏵️','🪷','🏵️'],
};
function getThemeEmojis(s) {
  const t = FLOWER_THEMES[s.flowerTheme] || FLOWER_THEMES.garden;
  if(s.flowerTheme==="custom"){return t.map((e,i)=>s.customEmojis[i]||e)}
  return t;
}

// ═══════════════════════════════════════════════════════════════
// WEATHER
// ═══════════════════════════════════════════════════════════════
const WEATHER = {
  cloud:{e:'☁️',p:0.30,d:14,n:3,s:'drift'},
  rain: {e:'💧',p:0.20,d:10,n:40,s:'fast'},
  snow: {e:'❄️',p:0.25,d:12,n:30,s:'slow'},
  hail: {e:'🧊',p:0.12,d:8, n:18,s:'fastest'},
};

// ═══════════════════════════════════════════════════════════════
// KEYBOARD LAYOUT
// ═══════════════════════════════════════════════════════════════
const ROWS = [
  [['`','1u'],['1','1u'],['2','1u'],['3','1u'],['4','1u'],['5','1u'],['6','1u'],['7','1u'],['8','1u'],['9','1u'],['0','1u'],['-','1u'],['=','1u'],['⌫','2u5']],
  [['tab','tab'],['Q','1u'],['W','1u'],['E','1u'],['R','1u'],['T','1u'],['Y','1u'],['U','1u'],['I','1u'],['O','1u'],['P','1u'],['[','1u'],[']','1u'],['\\','1u']],
  [['caps','caps'],['A','1u'],['S','1u'],['D','1u'],['F','1u'],['G','1u'],['H','1u'],['J','1u'],['K','1u'],['L','1u'],[';','1u'],["'",'1u'],['enter','enter']],
  [['shift','shift-l'],['Z','1u'],['X','1u'],['C','1u'],['V','1u'],['B','1u'],['N','1u'],['M','1u'],[',','1u'],['.','1u'],['/','1u'],['shift2','shift-r']],
  [['fn','125'],['ctrl','125'],['opt','125'],['cmd','125'],[' ','space'],['cmd2','125'],['opt2','125']],
];
const LABELS = {
  '`':'`','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0','-':'-','=':'=','⌫':'⌫',
  tab:'Tab','Q':'Q','W':'W','E':'E','R':'R','T':'T','Y':'Y','U':'U','I':'I','O':'O','P':'P','[':'[',']':']','\\':'\\',
  caps:'⇪','A':'A','S':'S','D':'D','F':'F','G':'G','H':'H','J':'J','K':'K','L':'L',';':';',"'":"'",enter:'↩',
  shift:'⇧','shift2':'⇧','Z':'Z','X':'X','C':'C','V':'V','B':'B','N':'N','M':'M',',':',','.':'.','/':'/',
  fn:'fn','ctrl':'⌃','opt':'⌥','cmd':'⌘','cmd2':'⌘','opt2':'⌥',' ':'space',
};
function toEv(k) {
  const m={ '⌫':'Backspace',tab:'Tab',caps:'CapsLock',enter:'Enter',shift:'Shift',shift2:'Shift',ctrl:'Control',opt:'Alt',cmd:'Meta',fn:'Fn',' ':' ','`':'`','-':'-','=':'=','[':'[',']':']','\\':'\\',';':';',"'":"'",',':',','.':'.','/':'/' };
  return m[k]||k;
}
const MODS=new Set(['Shift','Control','Alt','Meta','CapsLock','Fn','OS','Symbol','Hyper']);
// Physical key code → display key (ROWS identifier)
const CODE_MAP={'Backquote':'`','Digit1':'1','Digit2':'2','Digit3':'3','Digit4':'4','Digit5':'5','Digit6':'6','Digit7':'7','Digit8':'8','Digit9':'9','Digit0':'0','Minus':'-','Equal':'=','Backspace':'⌫','Tab':'tab','KeyQ':'Q','KeyW':'W','KeyE':'E','KeyR':'R','KeyT':'T','KeyY':'Y','KeyU':'U','KeyI':'I','KeyO':'O','KeyP':'P','BracketLeft':'[','BracketRight':']','Backslash':'\\','CapsLock':'caps','KeyA':'A','KeyS':'S','KeyD':'D','KeyF':'F','KeyG':'G','KeyH':'H','KeyJ':'J','KeyK':'K','KeyL':'L','Semicolon':';','Quote':"'",'Enter':'enter','ShiftLeft':'shift','ShiftRight':'shift2','KeyZ':'Z','KeyX':'X','KeyC':'C','KeyV':'V','KeyB':'B','KeyN':'N','KeyM':'M','Comma':',','Period':'.','Slash':'/','Fn':'fn','ControlLeft':'ctrl','ControlRight':'ctrl','AltLeft':'opt','AltRight':'opt2','MetaLeft':'cmd','MetaRight':'cmd2','Space':' '};

// ═══════════════════════════════════════════════════════════════
// FLOWER STAGES
// ═══════════════════════════════════════════════════════════════
const STAGES=[
  {min:1,level:1,size:12},{min:11,level:2,size:14},{min:31,level:3,size:16},
  {min:81,level:4,size:18},{min:201,level:5,size:19},{min:501,level:6,size:21},
  {min:1001,level:7,size:23},{min:3001,level:8,size:25},{min:5001,level:9,size:28},
];
function getStage(count,emojis,stageMins){
  if(count<=0)return{level:0,emoji:'',size:0};
  const ss=stageMins&&stageMins.length===9?stageMins.map((min,i)=>({min,level:i+1,size:STAGES[i]?.size||12+i*2})):STAGES;
  for(let i=ss.length-1;i>=0;i--)if(count>=ss[i].min){const s={...ss[i]};if(emojis&&emojis[i])s.emoji=emojis[i];return s}
  return{level:0,emoji:'',size:0};
}
function getStageProgress(count,stageMins){
  if(count<=0)return{level:0,pct:0};
  const ss=stageMins&&stageMins.length===9?stageMins.map((min,i)=>({min,level:i+1,size:STAGES[i]?.size||12+i*2})):STAGES;
  for(let i=ss.length-1;i>=0;i--){
    if(count>=ss[i].min){
      if(i===ss.length-1)return{level:ss[i].level,pct:1};
      const cur=ss[i],nxt=ss[i+1];
      const pct=(count-cur.min)/(nxt.min-cur.min);
      return{level:cur.level,pct:Math.min(1,Math.max(0,pct))};
    }
  }
  return{level:0,pct:0};
}
function todayS(){return new Date().toISOString().slice(0,10)}
function getPeriod(daily,p){
  if(!daily)return 0;const n=new Date();
  if(p==='today')return daily[todayS()]||0;
  if(p==='week'){let t=0;for(let i=0;i<7;i++){const d=new Date(n);d.setDate(d.getDate()-i);t+=daily[d.toISOString().slice(0,10)]||0}return t}
  if(p==='month'){let t=0;for(let d=1;d<=n.getDate();d++){const ds=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;t+=daily[ds]||0}return t}
  if(p==='year'){let t=0;for(let m=0;m<=n.getMonth();m++){const dim=new Date(n.getFullYear(),m+1,0).getDate();const md=m===n.getMonth()?n.getDate():dim;for(let d=1;d<=md;d++){const ds=`${n.getFullYear()}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;t+=daily[ds]||0}}return t}
  return 0;
}
function containerW(s){return s.baseKeySize*15.5+s.keyGap*13}

// ═══════════════════════════════════════════════════════════════
// DYNAMIC CSS ─ 3D keys, themed, weather particles
// ═══════════════════════════════════════════════════════════════
function resolveTheme(s){
  let t=s.keycapTheme==='custom'?KEYCAP_THEMES.custom:KEYCAP_THEMES[s.keycapTheme]||KEYCAP_THEMES.default;
  if(s.keycapTheme==='custom'&&s.customTheme){const ct=s.customTheme;t={...t,top:ct.top||t.top,bottom:ct.bottom||t.bottom,border:ct.border||t.border,hover:ct.hover||t.hover,label:ct.label||t.label}}
  return t;
}
function buildCSS(s){
  const t=resolveTheme(s),u=s.baseKeySize,g=s.keyGap,sp=s.animationSpeed;
  const w125=(u*1.25).toFixed(2),wTab=(u*2.5).toFixed(2),wCaps=(u*2.25).toFixed(2),wShift=(u*2.85).toFixed(2);
  const cw=(u*15.5+g*13).toFixed(2),sw=(parseFloat(cw)-u*7.5-g*6).toFixed(2);

  return`
/* ═══ KG V2 ─ Theme: ${t.name[s.lang]||t.name.en} ═══ */

.kg-v2-container { padding:8px 0 12px; overflow-y:auto; height:100%; display:flex; flex-direction:column; align-items:center; }
.kg-v2-header { margin-bottom:6px; padding-bottom:5px; border-bottom:1px solid var(--background-modifier-border); text-align:center; width:100%; max-width:420px; }
.kg-v2-header h3 { margin:0 0 3px; font-size:13px; font-weight:600; }
.kg-v2-stats { font-size:10px; color:var(--text-muted); margin:3px 0; display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
.kg-v2-stat-item { white-space:nowrap; }
.kg-v2-stat-label { opacity:.65; }
.kg-v2-periods { display:flex; gap:1px; margin-top:2px; justify-content:center; }
.kg-v2-period-btn {
  background:var(--background-modifier-hover); border:none; border-radius:3px;
  padding:1px 8px; font-size:9px; color:var(--text-muted); cursor:pointer; transition:all .12s;
}
.kg-v2-period-btn:hover{ background:var(--background-modifier-active-hover); }
.kg-v2-period-btn.kg-v2-active{ background:var(--interactive-accent); color:var(--text-on-accent); font-weight:600; }

.kg-v2-keyboard {
  position:relative; display:flex; flex-direction:column; gap:4px;
  width:${cw}px; box-sizing:border-box;
  transform-origin:top center; border:1px solid transparent;
}
.kg-v2-weather-active{ border-color:rgba(255,255,255,.06); border-radius:6px; }
.kg-row { display:flex; align-items:flex-start; gap:${g}px; flex-shrink:0; height:32px; justify-content:center; }

/* ── 3D Keycap ── */
.kg-key {
  position:relative; min-width:0; height:32px;
  background:linear-gradient(180deg,${t.top} 0%,${t.top} 28%,${t.bottom} 100%);
  border:1.5px solid ${t.border};
  border-radius:5px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all ${(0.12/sp).toFixed(2)}s ease;
  overflow:hidden; flex-shrink:0;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.55),inset 0 -2px 0 rgba(0,0,0,.06),0 2px 3px rgba(0,0,0,.1);
}
.kg-key:hover {
  transform:translateY(-1.5px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(0,0,0,.04),0 4px 8px rgba(0,0,0,.16);
  border-color:${t.hover};
}
.kg-key:active{ transform:translateY(0); box-shadow:inset 0 1px 0 rgba(255,255,255,.3),inset 0 -1px 0 rgba(0,0,0,.12),0 0 2px rgba(0,0,0,.1); transition:all .05s; }

.kg-1u{width:${u}px}.kg-125{width:${w125}px}.kg-2u5{width:${wTab}px}.kg-tab{width:${wTab}px}
.kg-caps{width:${wCaps}px}.kg-enter{width:${wCaps}px}.kg-shift-l{width:${wShift}px}.kg-shift-r{width:${wShift}px}.kg-space{width:${sw}px}

.kg-label {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  font-size:9px; font-weight:600; color:${t.label};
  pointer-events:none; letter-spacing:.2px; z-index:1; text-align:center; line-height:1;
  text-shadow:0 1px 0 rgba(255,255,255,.35);
}
.kg-flower-wrap { position:absolute; inset:0; z-index:2; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; }
.kg-flower {
  line-height:1; filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));
  transition:all ${(0.35/sp).toFixed(2)}s ease;
  animation:kg-v2-bloom ${(0.4/sp).toFixed(2)}s ease-out;
}
.kg-count { position:absolute; bottom:1px; right:2px; font-size:6px; color:rgba(60,40,20,.85); font-weight:800; text-shadow:0 0 2px rgba(255,255,255,.8); z-index:3; }
/* Feature 8 ─ progress bar */
.kg-progress{position:absolute;bottom:0;left:0;height:2px;background:${t.hover};border-radius:0 0 4px 4px;transition:width .3s ease;z-index:1;opacity:.8;}

/* ── Level colors ── */
.kg-key[data-level="0"] { border-color:${t.border}; }
.kg-key[data-level="1"] { border-color:#81C784; background:linear-gradient(180deg,#C8E6C9 0%,#C8E6C9 28%,#81C784 100%); }
.kg-key[data-level="2"] { border-color:#66BB6A; background:linear-gradient(180deg,#A5D6A7 0%,#A5D6A7 28%,#66BB6A 100%); }
.kg-key[data-level="3"] { border-color:#FFB74D; background:linear-gradient(180deg,#FFE0B2 0%,#FFE0B2 28%,#FFB74D 100%); }
.kg-key[data-level="4"] { border-color:#FF7043; background:linear-gradient(180deg,#FFCCBC 0%,#FFCCBC 28%,#FF7043 100%); }
.kg-key[data-level="5"] { border-color:#EC407A; box-shadow:0 0 6px rgba(236,64,122,.2),inset 0 1px 0 rgba(255,255,255,.5); background:linear-gradient(180deg,#F48FB1 0%,#F48FB1 28%,#EC407A 100%); }
.kg-key[data-level="6"] { border-color:#AB47BC; box-shadow:0 0 8px rgba(171,71,188,.25),inset 0 1px 0 rgba(255,255,255,.5); background:linear-gradient(180deg,#CE93D8 0%,#CE93D8 28%,#AB47BC 100%); }
.kg-key[data-level="7"] { border-color:#FFC107; box-shadow:0 0 12px rgba(255,193,7,.35),inset 0 1px 0 rgba(255,255,255,.5); background:linear-gradient(180deg,#FFF59D 0%,#FFF59D 28%,#FFC107 100%); }
.kg-key[data-level="8"] { border-color:#26C6DA; box-shadow:0 0 16px rgba(38,198,218,.45),inset 0 1px 0 rgba(255,255,255,.4); background:linear-gradient(180deg,#80DEEA 0%,#80DEEA 28%,#26C6DA 100%); animation:kg-v2-glow ${(2/sp).toFixed(2)}s ease-in-out infinite alternate; }
.kg-key[data-level="9"] { border-color:#FF5722; box-shadow:0 0 20px rgba(255,87,34,.5),inset 0 1px 0 rgba(255,255,255,.4); background:linear-gradient(180deg,#FFAB91 0%,#FFAB91 28%,#FF5722 100%); animation:kg-v2-glow-fire ${(2/sp).toFixed(2)}s ease-in-out infinite alternate; }

@keyframes kg-v2-glow {
  from{box-shadow:0 0 12px rgba(38,198,218,.4),0 0 24px rgba(38,198,218,.18)}
  to{box-shadow:0 0 24px rgba(38,198,218,.6),0 0 48px rgba(38,198,218,.28),0 0 72px rgba(38,198,218,.12)}
}
@keyframes kg-v2-glow-fire {
  from{box-shadow:0 0 14px rgba(255,87,34,.45),0 0 28px rgba(255,87,34,.22)}
  to{box-shadow:0 0 28px rgba(255,87,34,.65),0 0 56px rgba(255,87,34,.35),0 0 84px rgba(255,87,34,.15)}
}

/* ── Weather particles ── */
.kg-v2-weather { position:absolute; inset:-4px; overflow:hidden; z-index:5; pointer-events:none; border-radius:6px; }
.kg-v2-particle {
  position:absolute; top:-28px; pointer-events:none; font-size:15px; opacity:0;
  animation:kg-v2-fall var(--d,4s) var(--delay,0s) linear infinite;
  text-shadow:0 1px 3px rgba(0,0,0,.1);
}
.kg-v2-particle-c {
  position:absolute; pointer-events:none; font-size:38px; opacity:0;
  animation:kg-v2-cloud var(--d,12s) var(--delay,0s) linear 1; line-height:1;
}
@keyframes kg-v2-fall {
  0%{transform:translateY(0)translateX(0);opacity:1} 90%{opacity:.75} 100%{transform:translateY(420px)translateX(12px);opacity:0}
}
@keyframes kg-v2-cloud {
  0%{transform:translateX(-100px);opacity:0} 15%{opacity:.82} 85%{opacity:.82} 100%{transform:translateX(calc(100% + 120px));opacity:0}
}

@keyframes kg-v2-bloom { 0%{transform:scale(0)rotate(-30deg);opacity:0} 60%{transform:scale(1.15)rotate(10deg);opacity:1} 100%{transform:scale(1)rotate(0);opacity:1} }

.kg-v2-container::-webkit-scrollbar { width:3px; }
.kg-v2-container::-webkit-scrollbar-thumb { background:var(--background-modifier-border); border-radius:2px; }
/* Feature 7 ─ popup */
.kg-v2-popup{background:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:6px;padding:6px 10px;box-shadow:0 4px 20px rgba(0,0,0,.2);font-size:11px;color:var(--text-normal);min-width:180px;max-width:260px;}
.kg-v2-popup-title{font-size:12px;margin-bottom:3px;border-bottom:1px solid var(--background-modifier-border);padding-bottom:3px;}
.kg-v2-popup table{width:100%;border-collapse:collapse;}
.kg-v2-popup td{padding:2px 4px;}
.kg-v2-popup td:first-child{color:var(--text-muted);font-size:10px;}
.kg-v2-popup td:last-child{text-align:right;font-weight:600;}
/* Feature 5 ─ dark mode adaptation */
body.theme-dark .kg-key{box-shadow:inset 0 1px 0 rgba(255,255,255,.25),inset 0 -2px 0 rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.35)}
body.theme-dark .kg-v2-popup{box-shadow:0 4px 20px rgba(0,0,0,.5)}
/* Feature 6 ─ heatmap */
.kg-v2-heat .kg-key[data-level="0"]{filter:grayscale(.4)}
/* Heatmap inline colors applied by upKey() — no !important to allow JS override */
/* Mini chart */
.kg-v2-goal-met { color:#4CAF50; font-weight:600; }
.kg-v2-wpm { color:#FF7043; }
/* Mini mode */
.kg-v2-mini { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; padding:24px 16px; cursor:pointer; user-select:none; }
.kg-v2-mini:hover { opacity:.8; }
.kg-v2-mini .kg-v2-mini-total { font-size:32px; font-weight:700; color:var(--text-normal); }
.kg-v2-mini .kg-v2-mini-flower { font-size:36px; animation:kg-v2-bloom .4s ease-out; }
.kg-v2-mini .kg-v2-mini-hint { font-size:10px; color:var(--text-muted); }
/* Background */
.kg-v2-bg { background:var(--kg-v2-bg,#222831); border-radius:8px; padding:10px; }
`;
}

// ═══════════════════════════════════════════════════════════════
// VIEW
// ═══════════════════════════════════════════════════════════════
class KeyboardGardenV2View extends ItemView {
  constructor(leaf,plugin){super(leaf);this.plugin=plugin;this._wt=null}
  getViewType(){return VIEW_TYPE}
  getDisplayText(){return'Keyboard Garden V2'}
  getIcon(){return'lucide-flower-2'}

  async onOpen(){
    const c=this.containerEl.children[1];c.empty();c.addClass('kg-v2-container');
    const s=this.plugin.settings;
    // Mini mode
    if(s.miniMode){
      this._h=null;this._se=null;this._pe=null;this.kb=null;this._mi=c.createEl('div',{cls:'kg-v2-mini'});
      this._mi.addEventListener('click',()=>{s.miniMode=false;this.plugin.saveSettings();this.rebuildView();});
      this.renderMini();return;
    }
    if(s.showTotalStats){
      this._h=c.createEl('div',{cls:'kg-v2-header'});
      this._h.createEl('h3',{text:`${(KEYCAP_THEMES[s.keycapTheme]||KEYCAP_THEMES.default).emoji} ${tr(s,'header')}`});
      this._se=this._h.createEl('div',{cls:'kg-v2-stats'});
      this._pe=this._h.createEl('div',{cls:'kg-v2-periods'});
      this.renderStats();
    }else{this._h=null;this._se=null;this._pe=null;}
    this.kb=c.createEl('div',{cls:`kg-v2-keyboard${s.heatmapMode?' kg-v2-heat':''}${s.bgEnabled?' kg-v2-bg':''}`});
    if(s.bgEnabled)this.kb.style.setProperty('--kg-v2-bg',s.bgColor||'#222831');
    this.wl=this.kb.createEl('div',{cls:'kg-v2-weather'});
    this.renderKb();this.resizeKb();
    this._ro=new ResizeObserver(()=>this.resizeKb());this._ro.observe(c);
  }
  async onClose(){if(this._ro)this._ro.disconnect();if(this._wt){clearTimeout(this._wt);this._wt=null}}
  resizeKb(){
    if(!this.kb)return;const p=this.kb.parentElement;if(!p)return;
    const kw=containerW(this.plugin.settings);
    this.kb.style.transform=`scale(${Math.min(1,(p.clientWidth-20)/kw)})`;
  }
  rebuildView(){this.onOpen()}
  renderMini(){
    if(!this._mi)return;this._mi.empty();
    const s=this.plugin.settings,t=this.plugin.getTotalKeystrokes();
    const st=getStage(t,getThemeEmojis(s),s.customStageMins);
    this._mi.createEl('div',{cls:'kg-v2-mini-total',text:t.toLocaleString()});
    this._mi.createEl('div',{cls:'kg-v2-mini-flower',text:st.emoji||'🌸'});
    this._mi.createEl('div',{cls:'kg-v2-mini-hint',text:s.lang==='zh'?'点击展开键盘':'Click to expand'});
  }
  updateKb(){
    const s=this.plugin.settings;
    if(s.miniMode){this.renderMini();return;}
    if(this._se&&s.showTotalStats)this.renderStats();
    const mc=s.heatmapMode?Math.max(1,...Object.values(s.keyCounts||{})):0;
    this.kb.querySelectorAll('.kg-key').forEach(el=>{
      const k=el.getAttribute('data-key');if(k!==null)this.upKey(el,k,this.plugin.getKeyCount(k),s,mc);
    });
  }
  renderKb(){
    this.kb.querySelectorAll('.kg-row').forEach(r=>r.remove());
    const s=this.plugin.settings;
    ROWS.forEach(row=>{
      const re=this.kb.createEl('div',{cls:'kg-row'});
      row.forEach(([key,sz])=>{
        const ke=re.createEl('div',{cls:`kg-key kg-${sz}`,attr:{'data-key':toEv(key)}});
        if(s.showLabels)ke.createEl('span',{cls:'kg-label',text:LABELS[key]||key.toUpperCase()});
        ke.createEl('div',{cls:'kg-flower-wrap'});
        this.upKey(ke,toEv(key),this.plugin.getKeyCount(toEv(key)),s,0);
        // Feature 7 ─ right-click details
        ke.addEventListener('contextmenu',ev=>{ev.preventDefault();ev.stopPropagation();this.showKeyPopup(ke,toEv(key),ev);});
      });
    });
  }
  upKey(el,key,count,s,maxCount){
    const w=el.querySelector('.kg-flower-wrap');if(!w)return;w.empty();
    const stage=getStage(count,getThemeEmojis(s),s.customStageMins);
    el.setAttribute('data-level',String(stage.level));
    if(s.heatmapMode&&count>0){const r=Math.min(1,count/(maxCount||1));let cr,cg,cb;if(r<.111){const t=r*9;cr=255;cg=255;cb=Math.round(240-t*40)}else if(r<.222){const t=(r-.111)/.111;cr=255;cg=255;cb=Math.round(200-t*50)}else if(r<.333){const t=(r-.222)/.111;cr=255;cg=Math.round(255-t*15);cb=0}else if(r<.444){const t=(r-.333)/.111;cr=255;cg=Math.round(240-t*40);cb=0}else if(r<.555){const t=(r-.444)/.111;cr=255;cg=Math.round(200-t*40);cb=0}else if(r<.666){const t=(r-.555)/.111;cr=255;cg=Math.round(160-t*40);cb=0}else if(r<.777){const t=(r-.666)/.111;cr=255;cg=Math.round(120-t*60);cb=0}else if(r<.888){const t=(r-.777)/.111;cr=255;cg=Math.round(60-t*60);cb=0}else{const t=(r-.888)/.112;cr=Math.round(255-t*75);cg=0;cb=0}el.style.background=`linear-gradient(180deg,rgb(${cr},${cg},${cb}) 0%,rgb(${cr},${cg},${cb}) 28%,rgb(${Math.round(cr*.72)},${Math.round(cg*.72)},${Math.round(cb*.72)}) 100%)`;el.style.borderColor=`rgb(${Math.round(cr*.55)},${Math.round(cg*.55)},${Math.round(cb*.55)})`}
    else{el.style.background='';el.style.borderColor='';}
    if(count>0&&stage.emoji){w.createEl('span',{cls:'kg-flower',text:stage.emoji}).style.fontSize=stage.size+'px';if(s.showCounts)w.createEl('span',{cls:'kg-count',text:String(count)})}
    // Progress bar (Feature 8)
    let pb=el.querySelector('.kg-progress');
    if(!pb){pb=el.createEl('div',{cls:'kg-progress'});}
    const p=getStageProgress(count,s.customStageMins);
    if(p.level>=9){pb.style.width='0px';pb.style.opacity='0';}
    else{pb.style.width=(p.pct*100).toFixed(1)+'%';pb.style.opacity='1';}
  }
  renderStats(){
    if(!this._se||!this._pe)return;
    const s=this.plugin.settings,daily=s.dailyCounts||{};
    const ps=[{k:'today'},{k:'week'},{k:'month'},{k:'year'}];
    this._se.empty();
    // WPM
    if(s.showWPM!==false){
      const wpm=this.plugin.getWPM();
      this._se.createEl('span',{cls:'kg-v2-stat-item kg-v2-wpm',text:`⚡ ${wpm} WPM`});
    }
    ps.forEach(p=>{
      const v=getPeriod(daily,p.k);
      this._se.createEl('span',{cls:'kg-v2-stat-item',text:`${tr(s,'stats.'+p.k)}: ${v.toLocaleString()}`});
    });
    // Goals
    const dg=s.dailyGoal||0,wg=s.weeklyGoal||0;
    if(dg>0){const td=getPeriod(daily,'today'),dp=Math.min(1,td/dg);this._se.createEl('span',{cls:`kg-v2-stat-item${dp>=1?' kg-v2-goal-met':''}`,text:`${dp>=1?'🎯':'🎯'} ${Math.round(dp*100)}%`});}
    if(wg>0){const wk=getPeriod(daily,'week'),wp=Math.min(1,wk/wg);this._se.createEl('span',{cls:`kg-v2-stat-item${wp>=1?' kg-v2-goal-met':''}`,text:`${wp>=1?'✅':'📅'} ${Math.round(wp*100)}%`});}
    this._pe.empty();
    ps.forEach(p=>{
      const b=this._pe.createEl('button',{cls:'kg-v2-period-btn',text:tr(s,'stats.'+p.k)});
      if(p.k===s.statsPeriod)b.addClass('kg-v2-active');
      b.addEventListener('click',()=>{s.statsPeriod=p.k;this.plugin.saveSettings();this.plugin.updateAllViews();});
    });
  }
  showWeather(type){
    const cfg=WEATHER[type];if(!cfg||!this.wl)return;this.wl.empty();this.kb.addClass('kg-v2-weather-active');
    const isC=type==='cloud';
    for(let i=0;i<cfg.n;i++){
      if(isC){
        const p=this.wl.createEl('span',{cls:'kg-v2-particle-c'});p.textContent=cfg.e;
        p.style.top=(Math.random()*35+10)+'%';p.style.setProperty('--d',(Math.random()*6+10)+'s');p.style.setProperty('--delay',(Math.random()*4)+'s');
      }else{
        const p=this.wl.createEl('span',{cls:'kg-v2-particle'});p.textContent=cfg.e;
        p.style.left=(Math.random()*95+2)+'%';p.style.setProperty('--d',(Math.random()*3+(cfg.s==='fastest'?1.5:cfg.s==='fast'?2.5:4))+'s');p.style.setProperty('--delay',(Math.random()*3)+'s');p.style.fontSize=(Math.random()*10+10)+'px';
      }
    }
    if(this._wt)clearTimeout(this._wt);this._wt=setTimeout(()=>this.clearWeather(),cfg.d*1000);
  }
  clearWeather(){if(this.wl)this.wl.empty();if(this.kb)this.kb.removeClass('kg-v2-weather-active')}
  // Feature 7 ─ right-click key details popup
  showKeyPopup(el,key,ev){
    const s=this.plugin.settings,count=this.plugin.getKeyCount(key);
    const sp=getStageProgress(count,s.customStageMins),emoji=getStage(count,getThemeEmojis(s),s.customStageMins).emoji||'⬚';
    const p=document.getElementById('kg-v2-popup');if(p)p.remove();
    const pop=document.body.createEl('div',{cls:'kg-v2-popup',attr:{id:'kg-v2-popup'}});
    const label=LABELS[key]||key;const resStages=s.customStageMins&&s.customStageMins.length===9?STAGES.map((st2,i)=>({...st2,min:s.customStageMins[i]||st2.min})):STAGES;const nextThr=sp.level<9&&sp.level>0?resStages.find(st2=>st2.level===sp.level+1):null;
    const today=getPeriod(s.dailyCounts||{},'today'),daily=s.dailyCounts?((s.dailyCounts[todayS()]||0)):0;
    pop.innerHTML=`<div class="kg-v2-popup-inner">
      <div class="kg-v2-popup-title">${emoji} <b>${label}</b> (${key})</div>
      <table><tr><td>Total hits</td><td><b>${count.toLocaleString()}</b></td></tr>
      <tr><td>Level</td><td>${sp.level}/9</td></tr>
      <tr><td>Progress</td><td>${(sp.pct*100).toFixed(0)}% ${nextThr?'→ next at '+(nextThr.min-count).toLocaleString():'MAX'}</td></tr>
      <tr><td>Today</td><td>${today.toLocaleString()}</td></tr></table></div>`;
    Object.assign(pop.style,{position:'fixed',zIndex:'99999',top:(ev.clientY+8)+'px',left:(ev.clientX+8)+'px'});
    const h=()=>{const pp=document.getElementById('kg-v2-popup');if(pp)pp.remove();document.removeEventListener('click',h);document.removeEventListener('contextmenu',h);};
    setTimeout(()=>{document.addEventListener('click',h);document.addEventListener('contextmenu',h);},50);
  }
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS TAB ─ single language, custom color pickers
// ═══════════════════════════════════════════════════════════════
class KeyboardGardenV2SettingTab extends PluginSettingTab {
  constructor(app,plugin){super(app,plugin);this.plugin=plugin}
  tr(key){return tr(this.plugin.settings,key)}
  display(){
    const{containerEl:c}=this;c.empty();const s=this.plugin.settings,t=this.tr.bind(this);

    c.createEl('h2',{text:`${(KEYCAP_THEMES[s.keycapTheme]||KEYCAP_THEMES.default).emoji} ${t('settings.title')}`});

    // Language
    new Setting(c).setName(t('settings.lang')).setDesc(t('settings.langDesc'))
      .addDropdown(d=>d.addOption('zh','中文').addOption('en','English').setValue(s.lang).onChange(async v=>{s.lang=v;await this.plugin.saveSettings();this.display();}));

    // ── Main ──
    c.createEl('h3',{text:`⭐ ${t('settings.main')}`});

    // ── Keycap Theme ──
    new Setting(c).setName(t('settings.keycapTheme')).setDesc(t('settings.keycapThemeDesc'))
      .addDropdown(d=>{Object.entries(KEYCAP_THEMES).forEach(([id,th])=>d.addOption(id,th.name[s.lang]||th.name.en));return d.setValue(s.keycapTheme).onChange(async v=>{s.keycapTheme=v;s.heatmapMode=v==='heatmap';await this.plugin.saveSettings();this.plugin.rebuildAllViews();if(v==='custom')this.display();});});

    // Custom theme color pickers — only when 'custom'
    if(s.keycapTheme==='custom'){
      const ct=s.customTheme||{};
      c.createEl('h4',{text:`🎨 ${t('settings.customTheme')}`});
      c.createEl('p',{text:t('settings.customThemeDesc'),cls:'setting-item-description'});
      new Setting(c).setName(t('settings.customTop')).addText(tx=>{tx.inputEl.type='color';tx.setValue(ct.top||'#F5F5F5');tx.onChange(async v=>{ct.top=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();});});
      new Setting(c).setName(t('settings.customBottom')).addText(tx=>{tx.inputEl.type='color';tx.setValue(ct.bottom||'#D4D4D4');tx.onChange(async v=>{ct.bottom=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();});});
      new Setting(c).setName(t('settings.customBorder')).addText(tx=>{tx.inputEl.type='color';tx.setValue(ct.border||'#BDBDBD');tx.onChange(async v=>{ct.border=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();});});
      new Setting(c).setName(t('settings.customBorderHover')).addText(tx=>{tx.inputEl.type='color';tx.setValue(ct.hover||'#9E9E9E');tx.onChange(async v=>{ct.hover=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();});});
      new Setting(c).setName(t('settings.customLabel')).addText(tx=>{tx.inputEl.type='color';tx.setValue(ct.label||'#333333');tx.onChange(async v=>{ct.label=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();});});
    }

    new Setting(c).setName(t('settings.baseKeySize')).setDesc(t('settings.baseKeySizeDesc'))
      .addDropdown(d=>d.addOption('16',t('settings.pxSmall')).addOption('18',t('settings.px18')).addOption('20',t('settings.pxDefault')).addOption('22',t('settings.px22')).addOption('24',t('settings.pxLarge')).setValue(String(s.baseKeySize)).onChange(async v=>{s.baseKeySize=parseInt(v);await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));

    new Setting(c).setName(t('settings.showLabels')).setDesc(t('settings.showLabelsDesc'))
      .addToggle(tx=>tx.setValue(s.showLabels).onChange(async v=>{s.showLabels=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    new Setting(c).setName(t('settings.showCounts')).setDesc(t('settings.showCountsDesc'))
      .addToggle(tx=>tx.setValue(s.showCounts).onChange(async v=>{s.showCounts=v;await this.plugin.saveSettings();this.plugin.updateAllViews();}));
    new Setting(c).setName(t('settings.flowerTheme')).setDesc(t('settings.flowerThemeDesc'))
      .addDropdown(d=>d.addOption('garden',t('settings.themeGarden')).addOption('forest',t('settings.themeForest')).addOption('fruit',t('settings.themeFruit')).addOption('custom',t('settings.themeCustom')||'🎨 Custom').setValue(s.flowerTheme).onChange(async v=>{s.flowerTheme=v;await this.plugin.saveSettings();this.plugin.updateAllViews();this.display();}));
    // Custom flowers + stage thresholds — only for custom flower theme
    if(s.flowerTheme==='custom'){
    c.createEl('h4',{text:`🌸 ${t('settings.customFlower')}`});
    c.createEl('p',{text:t('settings.customFlowerDesc'),cls:'setting-item-description'});
    const emojis=getThemeEmojis(s),mins=s.customStageMins||DEFAULT_SETTINGS.customStageMins;
    for(let i=0;i<9;i++){
      const st=STAGES[i];
      new Setting(c)
        .setName(`${t('settings.flowerStage').replace('{s}',String(i+1))} (≥${mins[i]||st.min})`)
        .setDesc(t('settings.customStageMinDesc'))
        .addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='1';tx.inputEl.style.width='70px';tx.setValue(String(mins[i]||st.min));tx.onChange(async v=>{if(!s.customStageMins||s.customStageMins.length!==9)s.customStageMins=[...DEFAULT_SETTINGS.customStageMins];s.customStageMins[i]=parseInt(v)||st.min;await this.plugin.saveSettings();this.plugin.updateAllViews();})})
        .addText(tx=>{tx.inputEl.placeholder=emojis[i]||'';tx.setValue(s.customEmojis[i]||'');tx.onChange(async v=>{s.customEmojis[i]=v||'';await this.plugin.saveSettings();this.plugin.updateAllViews();})});
    }

    }
    // ── Weather ──
    c.createEl('h3',{text:`🌤️ ${t('settings.weather')}`});
    new Setting(c).setName(t('settings.weatherEnabled')).setDesc(t('settings.weatherEnabledDesc'))
      .addToggle(tx=>tx.setValue(s.weatherEnabled).onChange(async v=>{s.weatherEnabled=v;await this.plugin.saveSettings();}));
    c.createEl('h4',{text:t('settings.weatherThreshold')});
    c.createEl('p',{text:t('settings.weatherThresholdDesc'),cls:'setting-item-description'});
    const th=s.weatherThresholds||{cloud:3000,rain:6000,snow:10000,hail:15000};
    new Setting(c).setName(t('settings.weatherThresholdCloud')).addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='0';tx.setValue(String(th.cloud||3000));tx.onChange(async v=>{th.cloud=parseInt(v)||0;await this.plugin.saveSettings();});});
    new Setting(c).setName(t('settings.weatherThresholdRain')).addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='0';tx.setValue(String(th.rain||6000));tx.onChange(async v=>{th.rain=parseInt(v)||0;await this.plugin.saveSettings();});});
    new Setting(c).setName(t('settings.weatherThresholdSnow')).addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='0';tx.setValue(String(th.snow||10000));tx.onChange(async v=>{th.snow=parseInt(v)||0;await this.plugin.saveSettings();});});
    new Setting(c).setName(t('settings.weatherThresholdHail')).addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='0';tx.setValue(String(th.hail||15000));tx.onChange(async v=>{th.hail=parseInt(v)||0;await this.plugin.saveSettings();});});
    new Setting(c).setDesc(t('settings.weatherInfo')).setClass('kg-setting-info');

    // ── Display ──
    c.createEl('h3',{text:`🎛️ ${t('settings.display')}`});
    new Setting(c).setName(t('settings.animationSpeed')).setDesc(t('settings.animationSpeedDesc'))
      .addDropdown(d=>d.addOption('0.5',t('settings.speedSlow')).addOption('0.75',t('settings.speed75')).addOption('1',t('settings.speedNormal')).addOption('1.5',t('settings.speed15')).addOption('2',t('settings.speedFast')).setValue(String(s.animationSpeed)).onChange(async v=>{s.animationSpeed=parseFloat(v);await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    new Setting(c).setName(t('settings.showTotalStats')).setDesc(t('settings.showTotalStatsDesc'))
      .addToggle(tx=>tx.setValue(s.showTotalStats).onChange(async v=>{s.showTotalStats=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    new Setting(c).setName(t('settings.showWPM')).setDesc(t('settings.showWPMDesc'))
      .addToggle(tx=>tx.setValue(s.showWPM!==false).onChange(async v=>{s.showWPM=v;await this.plugin.saveSettings();this.plugin.updateAllViews();}));
    new Setting(c).setName(t('settings.darkModeAdapt')).setDesc(t('settings.darkModeAdaptDesc'))
      .addToggle(tx=>tx.setValue(s.darkModeAdapt!==false).onChange(async v=>{s.darkModeAdapt=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    new Setting(c).setName(t('settings.autoDark')).setDesc(t('settings.autoDarkDesc'))
      .addToggle(tx=>tx.setValue(s.autoDark!==false).onChange(async v=>{s.autoDark=v;await this.plugin.saveSettings()}));
    new Setting(c).setName(t('settings.miniMode')).setDesc(t('settings.miniModeDesc'))
      .addToggle(tx=>tx.setValue(s.miniMode||false).onChange(async v=>{s.miniMode=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    // Goals
    new Setting(c).setName(t('settings.dailyGoal')).setDesc(t('settings.dailyGoalDesc'))
      .addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='0';tx.setValue(String(s.dailyGoal||1000));tx.onChange(async v=>{s.dailyGoal=parseInt(v)||0;await this.plugin.saveSettings();this.plugin.updateAllViews();})});
    new Setting(c).setName(t('settings.weeklyGoal')).setDesc(t('settings.weeklyGoalDesc'))
      .addText(tx=>{tx.inputEl.type='number';tx.inputEl.min='0';tx.setValue(String(s.weeklyGoal||5000));tx.onChange(async v=>{s.weeklyGoal=parseInt(v)||0;await this.plugin.saveSettings();this.plugin.updateAllViews();})});
    // Sound
    new Setting(c).setName(t('settings.soundEnabled')).setDesc(t('settings.soundEnabledDesc'))
      .addToggle(tx=>tx.setValue(s.soundEnabled||false).onChange(async v=>{s.soundEnabled=v;await this.plugin.saveSettings()}));
    // Background
    new Setting(c).setName(t('settings.bgEnabled')).setDesc(t('settings.bgEnabledDesc'))
      .addToggle(tx=>tx.setValue(s.bgEnabled||false).onChange(async v=>{s.bgEnabled=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    new Setting(c).setName(t('settings.bgColor')).setDesc(t('settings.bgColorDesc'))
      .addText(tx=>{tx.inputEl.type='color';tx.setValue(s.bgColor||'#222831');tx.onChange(async v=>{s.bgColor=v;await this.plugin.saveSettings();this.plugin.rebuildAllViews();})});

    // ── Misc ──
    c.createEl('h3',{text:`🔧 ${t('settings.misc')}`});
    new Setting(c).setName(t('settings.keyGap')).setDesc(t('settings.keyGapDesc'))
      .addDropdown(d=>d.addOption('0',t('settings.gapTight')).addOption('1',t('settings.gap1')).addOption('2',t('settings.gap2')).addOption('3',t('settings.gap3')).addOption('4',t('settings.gapLoose')).setValue(String(s.keyGap)).onChange(async v=>{s.keyGap=parseInt(v);await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
    new Setting(c).setName(t('settings.ignoreModifiers')).setDesc(t('settings.ignoreModifiersDesc'))
      .addToggle(tx=>tx.setValue(s.ignoreModifiers).onChange(async v=>{s.ignoreModifiers=v;await this.plugin.saveSettings();}));

    // ── Reset ──
    c.createEl('h3',{text:`🔄 ${t('settings.management')}`});
    new Setting(c).setName('📤 '+t('settings.exportData')||'导出数据').setDesc(t('settings.exportDataDesc')||'下载 JSON 格式的花园数据备份')
      .addButton(b=>b.setButtonText('📤 导出').onClick(async()=>{
        const data={keyCounts:s.keyCounts,totalKeystrokes:s.totalKeystrokes,dailyCounts:s.dailyCounts,weatherTriggered:s.weatherTriggered||{}};
        const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
        const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='keyboard-garden-v2-backup.json';a.click();URL.revokeObjectURL(a.href);
      }));
    new Setting(c).setName('📥 '+t('settings.importData')||'导入数据').setDesc(t('settings.importDataDesc')||'从 JSON 备份文件恢复')
      .addButton(b=>b.setButtonText('📥 导入').onClick(async()=>{
        const i=document.createElement('input');i.type='file';i.accept='.json';
        i.onchange=async()=>{const f=i.files[0];if(!f)return;const txt=await f.text();try{
          const d=JSON.parse(txt);
          if(d.keyCounts)s.keyCounts=d.keyCounts;
          if(d.totalKeystrokes||d.totalKeystrokes===0)s.totalKeystrokes=d.totalKeystrokes;
          if(d.dailyCounts)s.dailyCounts=d.dailyCounts;
          if(d.weatherTriggered)s.weatherTriggered=d.weatherTriggered;
          await this.plugin.saveSettings();this.plugin.rebuildAllViews();
          new Notice('✅ 数据导入成功！');
        }catch(e){new Notice('❌ 文件格式错误：'+e.message);}};
        i.click();
      }));
    new Setting(c).setName(t('settings.reset')).setDesc(t('settings.resetDesc'))
      .addButton(b=>b.setButtonText(t('settings.resetBtn')).setWarning().onClick(async()=>{s.keyCounts={};s.totalKeystrokes=0;s.dailyCounts={};s.weatherTriggered={};await this.plugin.saveSettings();this.plugin.rebuildAllViews();}));
  }
}

// ═══════════════════════════════════════════════════════════════
// PLUGIN
// ═══════════════════════════════════════════════════════════════
module.exports=class KeyboardGardenV2Plugin extends Plugin{
  async onload(){
    await this.loadSettings();
    this._sel=document.createElement('style');this._sel.id='kg-v2-css';this._sel.textContent=buildCSS(this.settings);
    document.head.appendChild(this._sel);
    this.registerView(VIEW_TYPE,leaf=>new KeyboardGardenV2View(leaf,this));
    this.addSettingTab(new KeyboardGardenV2SettingTab(this.app,this));
    this.addRibbonIcon('lucide-flower-2','Keyboard Garden V2',()=>this.activateView());
    this._kd=e=>this.hk(e);document.addEventListener('keydown',this._kd);
    this.addCommand({id:'open-kg-v2',name:'Open Keyboard Garden V2',callback:()=>this.activateView()});
    this._lwt=0;this._ts=[];this._aud=null;
    this._setupDarkMode();
    console.log(`[KG V2] Loaded | Total:${this.getTotalKeystrokes()} | Today:${getPeriod(this.settings.dailyCounts||{},'today')}`);
  }
  onunload(){
    document.removeEventListener('keydown',this._kd);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    const e=document.getElementById('kg-v2-css');if(e)e.remove();
    if(this._dmObserver)this._dmObserver.disconnect();
  }
  async loadSettings(){
    const d=await this.loadData()||{};
    this.settings=Object.assign({},DEFAULT_SETTINGS,d);
    this.settings.keyCounts=this.settings.keyCounts||{};
    this.settings.dailyCounts=this.settings.dailyCounts||{};
    this.settings.totalKeystrokes=this.settings.totalKeystrokes||0;
    if(!this.settings.customEmojis)this.settings.customEmojis=[];this.settings.customEmojis.length=9;
    if(!this.settings.customTheme)this.settings.customTheme={top:'#F5F5F5',bottom:'#D4D4D4',border:'#BDBDBD',hover:'#9E9E9E',label:'#333333'};
  }
  async saveSettings(){await this.saveData(this.settings)}
  rebuildAllViews(){if(this._sel)this._sel.textContent=buildCSS(this.settings);this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(l=>{if(l.view instanceof KeyboardGardenV2View)l.view.rebuildView();});}
  updateAllViews(){this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(l=>{if(l.view instanceof KeyboardGardenV2View)l.view.updateKb();});}
  showWeatherAll(type){this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(l=>{if(l.view instanceof KeyboardGardenV2View)l.view.showWeather(type);});}

  hk(e){
    const dk=CODE_MAP[e.code];
    if(!dk)return;
    const k=toEv(dk);
    if(this.settings.ignoreModifiers&&MODS.has(k))return;
    this._ts.push(Date.now());if(this._ts.length>100)this._ts.shift();
    this._playClick();
    if(!this.settings.keyCounts[k])this.settings.keyCounts[k]=0;
    this.settings.keyCounts[k]++;this.settings.totalKeystrokes++;
    const td=todayS();if(!this.settings.dailyCounts[td])this.settings.dailyCounts[td]=0;this.settings.dailyCounts[td]++;
    this.saveSettings();this.updateAllViews();
    if(this.settings.weatherEnabled)this.checkWeather();
  }
  checkWeather(){
    const n=Date.now();if(n-this._lwt<120000)return;
    const t=this.getTotalKeystrokes();const s=this.settings;
    const th=s.weatherThresholds||{cloud:3000,rain:6000,snow:10000,hail:15000};
    if(!s.weatherTriggered)s.weatherTriggered={};
    const o=['cloud','rain','snow','hail'];
    for(const tp of o){
      const thr=th[tp]||0;if(thr===0)continue;
      const tk=tp+'_'+thr;
      if(t>=thr&&!s.weatherTriggered[tk]){s.weatherTriggered[tk]=true;this._lwt=n;this.showWeatherAll(tp);this.saveSettings();break}
    }
  }
  async activateView(){
    const w=this.app.workspace;let l=w.getLeavesOfType(VIEW_TYPE)[0];
    if(!l){const r=w.getRightLeaf(false);if(r){await r.setViewState({type:VIEW_TYPE,active:true});l=r}}
    if(l)w.revealLeaf(l);
  }
  getKeyCount(k){return(this.settings.keyCounts&&this.settings.keyCounts[k])||0}
  getTotalKeystrokes(){return this.settings.totalKeystrokes||0}
  getTopKeys(n){if(!this.settings.keyCounts)return[];return Object.entries(this.settings.keyCounts).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k,c])=>({key:k,count:c}))}
  getWPM(){const ts=this._ts;if(!ts||ts.length<2)return 0;const t=ts.slice(-20);const e=(t[t.length-1]-t[0])/1000;if(e<.5)return 0;return Math.round(t.length/e*12)}
  _playClick(){if(!this.settings.soundEnabled)return;try{if(!this._aud){this._aud=new(window.AudioContext||window.webkitAudioContext)()}const a=this._aud;if(a.state==='suspended')a.resume();const g=a.createGain(),o=a.createOscillator();g.gain.setValueAtTime(.05,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.05);o.type='sine';o.frequency.setValueAtTime(500+Math.random()*400,a.currentTime);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.05)}catch(e){}}
  _setupDarkMode(){const apply=d=>{document.body.classList.toggle('kg-v2-dark',d);if(this._sel)this._sel.textContent=buildCSS(this.settings)};const ck=()=>apply(document.body.classList.contains('theme-dark'));this._dmObserver=new MutationObserver(ck);this._dmObserver.observe(document.body,{attributes:true,attributeFilter:['class']});ck()}
};