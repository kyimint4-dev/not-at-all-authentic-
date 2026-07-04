const loadingScreen = document.getElementById('loadingScreen');
const nfcTapArea = document.getElementById('nfcTapArea');
const verifyModal = document.getElementById('verifyModal');
const modalClose = document.getElementById('modalClose');
const scanDate = document.getElementById('scanDate');

// ===== THREE.JS 3D SHIRT =====
let scene, camera, renderer, shirt;
let isRotating = true;
const container = document.getElementById('threeContainer');

function init3D() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4a6b8a, 0.4);
    fillLight.position.set(-2, 1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x888888, 0.3);
    rimLight.position.set(0, -2, 3);
    scene.add(rimLight);

    // Create 3D Shirt
    createShirt();

    // Animation
    animate();

    // Resize
    window.addEventListener('resize', onResize);
}

function createShirt() {
    const group = new THREE.Group();

    // Main body - using custom geometry for t-shirt shape
    const shape = new THREE.Shape();
    
    // T-shirt outline (front view)
    // Neck
    shape.moveTo(-0.3, 1.4);
    shape.quadraticCurveTo(-0.5, 1.6, -0.4, 1.8);
    shape.quadraticCurveTo(0, 2.0, 0.4, 1.8);
    shape.quadraticCurveTo(0.5, 1.6, 0.3, 1.4);
    
    // Right shoulder
    shape.lineTo(0.8, 1.2);
    shape.lineTo(1.0, 0.8);
    
    // Right arm
    shape.lineTo(1.4, 0.6);
    shape.lineTo(1.4, -0.2);
    shape.lineTo(1.0, -0.4);
    
    // Right body
    shape.lineTo(0.9, -1.0);
    shape.lineTo(0.6, -1.6);
    shape.lineTo(0.3, -1.8);
    
    // Bottom
    shape.quadraticCurveTo(0, -2.0, -0.3, -1.8);
    
    // Left body
    shape.lineTo(-0.6, -1.6);
    shape.lineTo(-0.9, -1.0);
    shape.lineTo(-1.0, -0.4);
    
    // Left arm
    shape.lineTo(-1.4, -0.2);
    shape.lineTo(-1.4, 0.6);
    shape.lineTo(-1.0, 0.8);
    
    // Left shoulder
    shape.lineTo(-0.8, 1.2);
    shape.lineTo(-0.3, 1.4);
    
    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 4
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Material with subtle color
    const material = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.6,
        metalness: 0.3,
        emissive: 0x111111,
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide,
    });

    shirt = new THREE.Mesh(geometry, material);
    shirt.rotation.x = -0.1;
    shirt.rotation.y = 0.3;
    shirt.position.y = -0.2;
    shirt.castShadow = true;
    
    group.add(shirt);

    // Add collar detail
    const collarGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 20);
    const collarMat = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        roughness: 0.7,
        metalness: 0.2,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 1.6, 0.15);
    collar.rotation.x = Math.PI / 3;
    collar.scale.set(1, 1, 0.5);
    group.add(collar);

    // Add subtle RE logo on shirt
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 128;
    logoCanvas.height = 128;
    const ctx = logoCanvas.getContext('2d');
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#4a6b8a';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RE', 64, 68);
    
    const texture = new THREE.CanvasTexture(logoCanvas);
    const logoMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.1,
    });
    const logoGeo = new THREE.PlaneGeometry(0.6, 0.6);
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, 0.3, 0.2);
    group.add(logoMesh);

    scene.add(group);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (isRotating && shirt) {
        shirt.parent.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

function onResize() {
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// ===== WEBSITE LOGIC =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        updateScanDate();
        init3D();
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

// NFC Tap
nfcTapArea.addEventListener('click', () => {
    nfcTapArea.style.transform = 'scale(0.92)';
    setTimeout(() => {
        nfcTapArea.style.transform = '';
    }, 150);
    showVerificationModal();
});

// Modal
function showVerificationModal() {
    document.getElementById('modalProduct').textContent = 'RE Edition';
    document.getElementById('modalSerial').textContent = 'RE-2026-001';
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
    if (e.target === verifyModal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Rotate Button
document.getElementById('rotateBtn').addEventListener('click', () => {
    isRotating = !isRotating;
    document.getElementById('rotateBtn').style.opacity = isRotating ? '1' : '0.5';
});

// Zoom Button
document.getElementById('zoomBtn').addEventListener('click', () => {
    if (shirt) {
        const scale = shirt.parent.scale.x === 1 ? 1.5 : 1;
        shirt.parent.scale.set(scale, scale, scale);
    }
});

// History
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

console.log('🔐 RE Authentication System Ready with 3D Shirt');
