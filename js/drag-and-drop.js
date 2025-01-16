document.addEventListener('DOMContentLoaded', () => {
    const textAreas = document.getElementById('textAreas');
    let draggingElement = null;

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
            // すべてのドラッグオーバー効果を削除
            document.querySelectorAll('.text-container').forEach(container => {
                container.classList.remove('drag-over');
            });
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggingElement === container) return;
            
            const rect = container.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            
            if (e.clientY < midY) {
                container.classList.add('drag-over');
            } else {
                container.classList.remove('drag-over');
            }
        });

        container.addEventListener('dragleave', () => {
            container.classList.remove('drag-over');
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
            
            container.classList.remove('drag-over');
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