import { Plugin } from 'obsidian';
import { KeyboardGardenView, VIEW_TYPE_KEYBOARD_GARDEN } from './KeyboardGardenView';

interface KeyboardGardenSettings {
  keyCounts: { [key: string]: number };
  totalKeystrokes: number;
}

const DEFAULT_SETTINGS: KeyboardGardenSettings = {
  keyCounts: {},
  totalKeystrokes: 0
};

export default class KeyboardGardenPlugin extends Plugin {
  settings: KeyboardGardenSettings;
  private keydownHandler: (event: KeyboardEvent) => void;

  async onload() {
    await this.loadSettings();

    // 注册视图
    this.registerView(
      VIEW_TYPE_KEYBOARD_GARDEN,
      (leaf) => new KeyboardGardenView(leaf, this)
    );

    // 添加侧边栏图标
    this.addRibbonIcon('flower', 'Keyboard Garden', () => {
      this.activateView();
    });

    // 监听键盘事件
    this.keydownHandler = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.keydownHandler);

    // 添加命令
    this.addCommand({
      id: 'open-keyboard-garden',
      name: 'Open Keyboard Garden',
      callback: () => {
        this.activateView();
      }
    });

    // 添加设置标签页
    // this.addSettingTab(new KeyboardGardenSettingTab(this.app, this));
  }

  onunload() {
    document.removeEventListener('keydown', this.keydownHandler);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  handleKeydown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    
    // 初始化按键计数
    if (!this.settings.keyCounts[key]) {
      this.settings.keyCounts[key] = 0;
    }
    
    // 增加计数
    this.settings.keyCounts[key]++;
    this.settings.totalKeystrokes++;
    
    // 保存设置
    this.saveSettings();
    
    // 通知所有视图更新
    this.updateAllViews();
  }

  updateAllViews() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN);
    leaves.forEach((leaf) => {
      if (leaf.view instanceof KeyboardGardenView) {
        leaf.view.updateKeyboard();
      }
    });
  }

  async activateView() {
    const { workspace } = this.app;

    // 检查是否已有该视图
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_KEYBOARD_GARDEN)[0];

    if (!leaf) {
      // 在右侧边栏创建新叶子
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({
          type: VIEW_TYPE_KEYBOARD_GARDEN,
          active: true,
        });
        leaf = rightLeaf;
      }
    }

    // 激活该叶子
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  getKeyCount(key: string): number {
    return this.settings.keyCounts[key.toLowerCase()] || 0;
  }

  getTotalKeystrokes(): number {
    return this.settings.totalKeystrokes;
  }

  getTopKeys(count: number): Array<{ key: string; count: number }> {
    const sorted = Object.entries(this.settings.keyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([key, count]) => ({ key, count }));
    return sorted;
  }
}
