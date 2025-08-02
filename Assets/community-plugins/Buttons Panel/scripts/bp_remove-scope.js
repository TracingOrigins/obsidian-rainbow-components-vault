module.exports = removeScopeFromFile;

const { Modal, Notice } = require('obsidian');
const fs = require('fs');

function removeScope(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(removeScope);
    } else if (typeof obj === 'object' && obj !== null) {
        if ('scope' in obj) {
            delete obj.scope;
        }
        for (const key in obj) {
            removeScope(obj[key]);
        }
    }
}

class FilePathModal extends Modal {
    constructor(app, callback) {
        super(app);
        this.callback = callback;
        this.inputValue = null;
    }
    onOpen() {
        const { contentEl } = this;
        const title = contentEl.createEl('span', { text: '请输入 data.json 的绝对路径' });
        title.style.display = 'block';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '1.1rem';
        title.style.marginBottom = '16px';
        const input = contentEl.createEl('input', {
            type: 'text',
            placeholder: '如 C:/path/to/data.json',
        });
        input.style.width = '100%';
        input.style.marginBottom = '20px';
        input.focus();
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.inputValue = input.value;
                this.callback(input.value);
                this.close();
            }
        });
        // 按钮容器
        const btnGroup = contentEl.createDiv();
        btnGroup.style.display = 'flex';
        btnGroup.style.justifyContent = 'flex-end';
        btnGroup.style.gap = '8px';
        // 取消按钮
        const cancelBtn = btnGroup.createEl('button', { text: '取消' });
        // cancelBtn.classList.add('mod-cta');
        // cancelBtn.style.background = '#444';
        // cancelBtn.style.color = '#ccc';
        cancelBtn.onclick = () => {
            this.inputValue = null;
            this.close();
        };
        // 确认按钮
        const okBtn = btnGroup.createEl('button', { text: '确认' });
        okBtn.classList.add('mod-cta');
        okBtn.style.background = '#1976d2';
        okBtn.style.color = '#fff';
        okBtn.onclick = () => {
            this.inputValue = input.value;
            this.callback(input.value);
            this.close();
        };
    }
    onClose() {
        if (!this.inputValue) {
            this.callback(null);
        }
        this.contentEl.empty();
    }
}

async function getFilePathModal(app) {
    return new Promise((resolve) => {
        new FilePathModal(app, resolve).open();
    });
}

async function removeScopeFromFile() {
    let filePath = await getFilePathModal(this.app);
    if (!filePath) {
        // 用户未输入内容或关闭了模态框
        return null; // 显式返回null，确保Promise resolve
    }
    filePath = filePath.trim().replace(/^['"](.*)['"]$/, '$1');
    // 校验：必须为绝对路径、.json 文件且文件存在
    const path = require('path');
    if (!path.isAbsolute(filePath)) {
        new Notice('请输入 data.json 的绝对路径');
        return null;
    }
    if (!filePath.toLowerCase().endsWith('.json')) {
        new Notice('请输入以 .json 结尾的文件路径');
        return null;
    }
    if (!fs.existsSync(filePath)) {
        new Notice('文件不存在，请检查路径是否正确');
        return null;
    }
    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        new Notice('读取或解析文件失败: ' + e.message);
        return null;
    }
    removeScope(data);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
        new Notice('已删除所有scope字段');
    } catch (e) {
        new Notice('写入文件失败: ' + e.message);
        return null;
    }
    return true; // 成功时返回true
}
