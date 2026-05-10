# 🌻 Keyboard Garden - Obsidian Plugin

A beautiful Obsidian plugin that grows flowers on a virtual keyboard based on your typing frequency. Every keypress nurtures your garden!

## ✨ Features

- **Virtual Magic Keyboard**: Realistic iPad Magic Keyboard layout, 5 rows, 68 keys
- **10-Level Flower Growth**: Keys evolve through 9 flower stages as you type them more
  - 🌿 Leaf → 🌱 Seedling → 🌿 Herb → 🌸 Blossom → 🌷 Tulip → 🌹 Rose → 🌺 Hibiscus → 🌻 Sunflower → 🌼 Bloom (glowing!)
- **3 Flower Themes**: Garden (flowers), Forest (trees), Fruit (fruits)
- **Responsive Scaling**: Keyboard auto-scales to fit the sidebar width
- **Configurable Settings**: Full settings tab with 10 customizable options
- **No Build Step**: Pure JavaScript, works out of the box
- **Persistent Data**: Typing stats survive restarts

## 🔧 Settings

| Setting | Description |
|---------|-------------|
| 1U Base Size | Scale the keyboard (16/18/20/22/24px) |
| Show Key Labels | Toggle A-Z text on keys |
| Show Keystroke Counts | Toggle hit count numbers |
| Flower Theme | Garden / Forest / Fruit presets |
| Reset Statistics | One-click clear all counts |
| Animation Speed | 0.5x–2x bloom & glow speed |
| Show Total Stats | Toggle header stats bar |
| Key Gap | Space between keys (0–4px) |
| Soil Color | Color for unused keys |
| Ignore Modifiers | Skip Shift/Ctrl/Alt/Cmd from tracking |

## 📦 Installation

1. Download this repository
2. Copy the entire folder to your vault's `.obsidian/plugins/` directory
3. In Obsidian: **Settings → Community plugins** → Enable "Keyboard Garden"
4. Click the 🌻 ribbon icon or use command palette: "Open Keyboard Garden"

## 🚀 Usage

1. Open the Keyboard Garden view (ribbon icon or command)
2. Type normally — every keypress grows a flower on the corresponding key
3. Switch themes in settings to change flower styles
4. Adjust scale if the keyboard is too large/small for your screen

## 📁 File Structure

```
obsidian-keyboard-garden/
├── manifest.json         # Plugin metadata
├── main.js              # Main plugin (pure JS, no build)
├── styles.css           # Standalone stylesheet
├── README.md            # This file
└── versions.json        # Obsidian version compatibility
```

## 🛠 Technical Notes

- Pure JavaScript — no TypeScript compilation needed
- Uses Obsidian's `ItemView` for sidebar integration
- `ResizeObserver` for responsive scaling
- `PluginSettingTab` for the settings UI
- Dynamic CSS generation for key sizes and spacing
- Compatible with Obsidian v1.0.0+

## 📄 License

MIT