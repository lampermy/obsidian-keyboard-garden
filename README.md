# 🌻 Keyboard Garden V2 — Obsidian Plugin

A beautiful Obsidian plugin that grows flowers on a virtual Magic Keyboard. **V2 adds seasonal keycap themes, weather effects, and time-based statistics!**

## ✨ Features

### 🎨 Seasonal Keycap Themes (NEW)
Six built-in keycap aesthetic packs:
- ⌨️ **Default** — Classic grey gradient
- 🌸 **Spring** — Cherry blossom pink tones
- 🌊 **Summer** — Ocean blue & lavender
- 🍂 **Autumn** — Warm orange & brown
- ❄️ **Winter** — Frost white & ice silver
- 🌲 **Forest** — Nature green & moss

### 🌤️ Weather Effects (NEW)
Random weather animations triggered by typing milestones:
- ❄️ **Snow** — 1,000+ total keystrokes (25% chance)
- 🌧️ **Rain** — 2,500+ total keystrokes (20% chance)
- ☁️ **Cloud Drift** — 3,000+ total keystrokes (30% chance)
- 🧊 **Hail** — 5,000+ total keystrokes (12% chance)

Weather events have animated particles, cooldown periods, and don't interrupt your flow.

### 📊 Time-Based Statistics (NEW)
Track your typing across time:
- 📅 **Today** — Today's keystroke count
- 🗓️ **This Week** — Last 7 days total
- 📆 **This Month** — Current month total
- 📅 **This Year** — Year-to-date total

Daily counts are persisted automatically.

### 🌺 9-Level Flower Growth
Keys bloom through 9 stages: 🌿 Leaf → 🌱 Seedling → 🌿 Herb → 🌸 Blossom → 🌷 Tulip → 🌹 Rose → 🌺 Hibiscus → 🌻 Sunflower → 🌼 Bloom (glowing!)

### 🎭 3 Flower Theme Packs
- 🌻 Garden (flowers) · 🌲 Forest (trees) · 🍎 Fruit (fruits)

### ⚙️ 15+ Settings (fully bilingual)
| Setting | Description |
|---------|-------------|
| Keycap theme | ⌨️/🌸/🌊/🍂/❄️/🌲 aesthetic pack |
| 1U base size | 16/18/20/22/24px key size |
| Weather effects | Toggle on/off |
| Flower theme | Garden/Forest/Fruit |
| Show labels | Key letter display |
| Show counts | Keystroke number per key |
| Animation speed | 0.5x~2x |
| Show stats bar | Top header toggle |
| Key gap | 0-4px spacing |
| Ignore modifiers | Skip Shift/Ctrl/Alt/Cmd |
| Reset statistics | Clear all data |

## 📦 Installation

1. Copy this folder to your Obsidian vault's `.obsidian/plugins/` directory
2. Restart Obsidian or reload plugins
3. Enable "Keyboard Garden V2" in Settings → Community Plugins

## 🏗️ Tech

- Pure JavaScript (no build required)
- Dynamic CSS injection
- `dailyCounts` persistence for time-based stats
- Weather cooldown system prevents spam
- All CSS class names use `kg-v2-` prefix (won't conflict with V1)

## 🔄 V2 vs V1

V2 is a separate plugin (different id). You can run both V1 and V2 side by side.

**New in V2:**
- 6 keycap theme packs with per-theme gradients and styling
- Weather effects (snow, rain, hail, cloud drift) triggered by typing milestones
- Year/Month/Week/Day period statistics via `dailyCounts`
- Enhanced settings panel with weather info section
- Redesigned stats bar with period selector buttons

## 📄 License

MIT