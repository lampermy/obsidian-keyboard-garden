import { ItemView, WorkspaceLeaf } from 'obsidian';
import KeyboardGardenPlugin from './main';

export const VIEW_TYPE_KEYBOARD_GARDEN = 'keyboard-garden-view';

export class KeyboardGardenView extends ItemView {
  plugin: KeyboardGardenPlugin;
  private keyboardContainer: HTMLElement;

  constructor(leaf: WorkspaceLeaf, plugin: KeyboardGardenPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_KEYBOARD_GARDEN;
  }

  getDisplayText(): string {
    return 'Keyboard Garden';
  }

  getIcon(): string {
    return 'flower';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('keyboard-garden-container');

    // 标题
    const header = container.createEl('div', { cls: 'keyboard-garden-header' });
    header.createEl('h3', { text: '🌻 Keyboard Garden' });
    header.createEl('p', { 
      text: `Total keystrokes: ${this.plugin.getTotalKeystrokes()}`, 
      cls: 'keyboard-garden-stats' 
    });

    // 键盘容器
    this.keyboardContainer = container.createEl('div', { cls: 'keyboard-garden-keyboard' });
    
    // 渲染键盘
    this.renderKeyboard();

    // 添加图例
    this.renderLegend(container);
  }

  async onClose() {
    // 清理
  }

  updateKeyboard() {
    // 更新统计数据
    const statsEl = this.containerEl.querySelector('.keyboard-garden-stats');
    if (statsEl) {
      statsEl.textContent = `Total keystrokes: ${this.plugin.getTotalKeystrokes()}`;
    }

    // 更新所有按键
    const keys = this.keyboardContainer.querySelectorAll('.keyboard-key');
    keys.forEach((keyEl) => {
      const key = keyEl.getAttribute('data-key');
      if (key) {
        const count = this.plugin.getKeyCount(key);
        this.updateKeyVisualization(keyEl as HTMLElement, key, count);
      }
    });
  }

  private renderKeyboard() {
    // QWERTY 键盘布局
    const rows = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];

    rows.forEach((row, rowIndex) => {
      const rowEl = this.keyboardContainer.createEl('div', { cls: 'keyboard-row' });
      
      // 为第二行添加缩进
      if (rowIndex === 1) {
        rowEl.createEl('div', { cls: 'keyboard-indent', attr: { style: 'width: 20px;' } });
      }
      // 为第三行添加更多缩进
      if (rowIndex === 2) {
        rowEl.createEl('div', { cls: 'keyboard-indent', attr: { style: 'width: 40px;' } });
      }

      row.forEach(key => {
        const keyEl = rowEl.createEl('div', { 
          cls: 'keyboard-key',
          attr: { 'data-key': key }
        });

        // 按键标签
        const label = keyEl.createEl('span', { cls: 'key-label', text: key });
        
        // 花朵容器
        const flowerContainer = keyEl.createEl('div', { cls: 'flower-container' });
        
        // 获取按键计数并更新可视化
        const count = this.plugin.getKeyCount(key);
        this.updateKeyVisualization(keyEl, key, count);
      });

      // 为第二行和第三行关闭缩进
      if (rowIndex === 1 || rowIndex === 2) {
        rowEl.createEl('div', { cls: 'keyboard-indent', attr: { style: `width: ${rowIndex === 1 ? 20 : 40}px;` } });
      }
    });

    // 空格键
    const spaceRow = this.keyboardContainer.createEl('div', { cls: 'keyboard-row' });
    const spaceKey = spaceRow.createEl('div', { 
      cls: 'keyboard-key keyboard-space',
      attr: { 'data-key': ' ' }
    });
    const spaceLabel = spaceKey.createEl('span', { cls: 'key-label', text: 'space' });
    const spaceFlowerContainer = spaceKey.createEl('div', { cls: 'flower-container' });
    const spaceCount = this.plugin.getKeyCount(' ');
    this.updateKeyVisualization(spaceKey, ' ', spaceCount);
  }

  private updateKeyVisualization(keyEl: HTMLElement, key: string, count: number) {
    const flowerContainer = keyEl.querySelector('.flower-container') as HTMLElement;
    if (!flowerContainer) return;

    flowerContainer.empty();

    // 根据按键次数决定花朵阶段
    let flowerEmoji = '🌱'; // 幼苗
    let flowerSize = 12;
    let flowerColor = '#90EE90';

    if (count > 1000) {
      flowerEmoji = '🌻'; // 向日葵 - 成熟
      flowerSize = 24;
      flowerColor = '#FFD700';
    } else if (count > 500) {
      flowerEmoji = '🌺'; // 热门花
      flowerSize = 20;
      flowerColor = '#FF69B4';
    } else if (count > 100) {
      flowerEmoji = '🌿'; // 生长中
      flowerSize = 16;
      flowerColor = '#32CD32';
    } else if (count > 10) {
      flowerEmoji = '🌱'; // 幼苗
      flowerSize = 14;
      flowerColor = '#90EE90';
    }

    // 创建花朵元素
    const flower = flowerContainer.createEl('span', { 
      cls: 'flower',
      text: flowerEmoji
    });
    flower.style.fontSize = `${flowerSize}px`;
    
    // 添加计数显示
    if (count > 0) {
      flowerContainer.createEl('span', {
        cls: 'key-count',
        text: count.toString()
      });
    }

    // 添加动画效果（如果刚按过这个键）
    if (this.plugin.getTopKeys(1)[0]?.key === key) {
      keyEl.addClass('key-pressed');
      setTimeout(() => keyEl.removeClass('key-pressed'), 300);
    }
  }

  private renderLegend(container: HTMLElement) {
    const legend = container.createEl('div', { cls: 'keyboard-garden-legend' });
    legend.createEl('h4', { text: 'Growth Stages:' });
    
    const stages = [
      { emoji: '🌱', label: '0-10 presses' },
      { emoji: '🌿', label: '11-100 presses' },
      { emoji: '🌺', label: '101-500 presses' },
      { emoji: '🌻', label: '500+ presses' }
    ];

    stages.forEach(stage => {
      const item = legend.createEl('div', { cls: 'legend-item' });
      item.createEl('span', { text: stage.emoji, cls: 'legend-emoji' });
      item.createEl('span', { text: stage.label, cls: 'legend-label' });
    });

    // 显示最常用的按键
    const topKeys = this.plugin.getTopKeys(5);
    if (topKeys.length > 0) {
      const topSection = legend.createEl('div', { cls: 'top-keys' });
      topSection.createEl('h4', { text: 'Top Keys:' });
      topKeys.forEach((item, index) => {
        const keyItem = topSection.createEl('div', { cls: 'top-key-item' });
        keyItem.createEl('span', { text: `${index + 1}.`, cls: 'top-key-rank' });
        keyItem.createEl('span', { text: item.key === ' ' ? 'space' : item.key, cls: 'top-key' });
        keyItem.createEl('span', { text: `(${item.count})`, cls: 'top-key-count' });
      });
    }
  }
}
