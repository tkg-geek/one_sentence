class FullscreenManager {
    constructor() {
        this.fullscreenView = document.getElementById('fullscreenView');
        this.fullscreenText = this.fullscreenView.querySelector('.fullscreen-text');
        this.currentIndex = 0;
        this.texts = [];
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.fullscreenView.addEventListener('click', (e) => {
            const halfWidth = window.innerWidth / 2;
            if (e.clientX > halfWidth) {
                this.showNext();
            } else {
                this.showPrevious();
            }
        });
    }

    start() {
        this.texts = Array.from(document.querySelectorAll('.text-input'))
            .map(input => input.value)
            .filter(text => text.trim() !== '');

        if (this.texts.length === 0) return;

        this.currentIndex = 0;
        this.fullscreenView.classList.remove('hidden');
        this.showCurrent();

        // スマートフォンの場合、画面を横向きにする
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape')
                .catch(err => console.log('画面の向きを固定できませんでした:', err));
        }

        // フルスクリーンモードを開始
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
                .catch(err => console.log('フルスクリーンモードを開始できませんでした:', err));
        }
    }

    showCurrent() {
        this.fullscreenText.textContent = this.texts[this.currentIndex];
    }

    showNext() {
        if (this.currentIndex < this.texts.length - 1) {
            this.currentIndex++;
            this.showCurrent();
        } else {
            this.exit();
        }
    }

    showPrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showCurrent();
        } else {
            this.exit();
        }
    }

    exit() {
        this.fullscreenView.classList.add('hidden');
        
        // フルスクリーンモードを終了
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }

        // 画面の向きのロックを解除
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
}

// フルスクリーンマネージャーの初期化
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenManager = new FullscreenManager();
    document.getElementById('playButton').addEventListener('click', () => {
        fullscreenManager.start();
    });
}); 