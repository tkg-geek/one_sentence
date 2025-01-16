document.addEventListener('DOMContentLoaded', () => {
    const textAreas = document.getElementById('textAreas');
    let draggingElement = null;
    let dropIndicator = null;

    // ドロップインジケーターを作成
    const createDropIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        document.body.appendChild(indicator);
        return indicator;
    };

    // ドロップインジケーターの位置を更新
    const updateDropIndicator = (container, isAbove) => {
        if (!dropIndicator) {
            dropIndicator = createDropIndicator();
        }

        const rect = container.getBoundingClientRect();
        const margin = parseInt(getComputedStyle(container).marginBottom);
        
        if (isAbove) {
            // 上のコンテナとの間に表示
            const prevContainer = container.previousElementSibling;
            if (prevContainer && prevContainer !== draggingElement) {
                const prevRect = prevContainer.getBoundingClientRect();
                dropIndicator.style.top = `${prevRect.bottom + margin / 2}px`;
            } else {
                dropIndicator.style.top = `${rect.top - margin / 2}px`;
            }
        } else {
            // 下のコンテナとの間に表示
            const nextContainer = container.nextElementSibling;
            if (nextContainer && nextContainer !== draggingElement) {
                dropIndicator.style.top = `${rect.bottom + margin / 2}px`;
            } else {
                dropIndicator.style.top = `${rect.bottom + margin / 2}px`;
            }
        }

        dropIndicator.style.left = `${rect.left}px`;
        dropIndicator.style.width = `${rect.width}px`;
        dropIndicator.classList.add('active');
    };

    // 新しいテキストエリアが追加されたときにドラッグ可能にする
    const makeTextContainerDraggable = (container) => {
        container.setAttribute('draggable', 'true');
        
        container.addEventListener('dragstart', (e) => {
            draggingElement = container;
            container.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        container.addEventListener('dragend', () => {
            draggingElement = null;
            container.classList.remove('dragging');
            if (dropIndicator) {
                dropIndicator.classList.remove('active');
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggingElement === container) return;
            
            const rect = container.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            updateDropIndicator(container, e.clientY < midY);
        });

        container.addEventListener('dragleave', (e) => {
            // マウスが子要素に移動した場合は無視
            if (e.relatedTarget && container.contains(e.relatedTarget)) return;
            
            if (dropIndicator) {
                dropIndicator.classList.remove('active');
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggingElement === container) return;

            const rect = container.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            
            if (e.clientY < midY) {
                container.parentNode.insertBefore(draggingElement, container);
            } else {
                container.parentNode.insertBefore(draggingElement, container.nextSibling);
            }
            
            if (dropIndicator) {
                dropIndicator.classList.remove('active');
            }
        });
    };

    // 既存のテキストエリアをドラッグ可能にする
    document.querySelectorAll('.text-container').forEach(makeTextContainerDraggable);

    // 新しいテキストエリアが追加されたときの処理を監視
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('text-container')) {
                    makeTextContainerDraggable(node);
                }
            });
        });
    });

    observer.observe(textAreas, { childList: true });
}); 