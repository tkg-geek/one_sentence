class TextEditor {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        this.textAreas = document.getElementById('textAreas');
        this.addButton = document.getElementById('addButton');
        this.saveButton = document.getElementById('saveButton');
        this.deleteButton = document.getElementById('deleteButton');
        this.playButton = document.getElementById('playButton');
        
        // LocalStorageから保存データを読み込む
        this.loadFromStorage();
    }

    bindEvents() {
        this.addButton.addEventListener('click', () => this.addTextField());
        this.saveButton.addEventListener('click', () => this.saveToStorage());
        this.deleteButton.addEventListener('click', () => this.clearStorage());
        this.playButton.addEventListener('click', () => this.startFullscreen());
        
        // 最初のテキストフィールドのクリアボタンのイベントを設定
        this.setupClearButton(this.textAreas.querySelector('.text-container'));
    }

    addTextField() {
        const container = document.createElement('div');
        container.className = 'text-container';
        container.innerHTML = `
            <input type="text" class="text-input">
            <button class="clear-button">✕</button>
        `;
        
        this.textAreas.appendChild(container);
        this.setupClearButton(container);
    }

    setupClearButton(container) {
        const clearButton = container.querySelector('.clear-button');
        const input = container.querySelector('.text-input');
        
        clearButton.addEventListener('click', () => {
            if (container === this.textAreas.firstElementChild) {
                input.value = ''; // 最初のフィールドは内容のみクリア
            } else {
                container.remove(); // それ以外は要素ごと削除
            }
        });
    }

    saveToStorage() {
        const texts = Array.from(this.textAreas.querySelectorAll('.text-input'))
            .map(input => input.value);
        localStorage.setItem('savedTexts', JSON.stringify(texts));
        alert('保存しました');
    }

    loadFromStorage() {
        const savedTexts = JSON.parse(localStorage.getItem('savedTexts') || '[]');
        savedTexts.forEach((text, index) => {
            if (index === 0) {
                this.textAreas.querySelector('.text-input').value = text;
            } else {
                this.addTextField();
                const inputs = this.textAreas.querySelectorAll('.text-input');
                inputs[inputs.length - 1].value = text;
            }
        });
    }

    clearStorage() {
        localStorage.removeItem('savedTexts');
        Array.from(this.textAreas.querySelectorAll('.text-container')).forEach((container, index) => {
            if (index === 0) {
                container.querySelector('.text-input').value = '';
            } else {
                container.remove();
            }
        });
        alert('削除しました');
    }
}

// PWAの初期化
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new TextEditor();
}); 