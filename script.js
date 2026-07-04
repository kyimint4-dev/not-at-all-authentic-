const loadingScreen = document.getElementById('loadingScreen');
const nfcTapArea = document.getElementById('nfcTapArea');
const verifyModal = document.getElementById('verifyModal');
const modalClose = document.getElementById('modalClose');
const scanDate = document.getElementById('scanDate');

window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        updateScanDate();
    }, 1200);
});

function updateScanDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    scanDate.textContent = `Scan Date: ${now.toLocaleDateString('en-US', options)}`;
}

nfcTapArea.addEventListener('click', () => {
    nfcTapArea.style.transform = 'scale(0.92)';
    setTimeout(() => {
        nfcTapArea.style.transform = '';
    }, 150);
    showVerificationModal();
});

function showVerificationModal() {
    document.getElementById('modalProduct').textContent = 'Not At All Edition';
    document.getElementById('modalSerial').textContent = 'NAA-2026-001';
    document.getElementById('modalTime').textContent = 'Just now';
    verifyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    verifyModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

verifyModal.addEventListener('click', (e) => {
    if (e.target === verifyModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

document.getElementById('zoomBtn').addEventListener('click', () => {
    const img = document.querySelector('.product-silhouette');
    img.style.transform = 'scale(1.5)';
    img.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        img.style.transform = 'scale(1)';
    }, 600);
});

function addToHistory() {
    const historyList = document.getElementById('historyList');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <span class="history-date">Today, ${time}</span>
        <span class="history-status">✓ Verified</span>
    `;
    historyList.prepend(item);
    while (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

setTimeout(() => {
    addToHistory();
}, 2000);

console.log('🔐 Not At All Authentication System Ready');
