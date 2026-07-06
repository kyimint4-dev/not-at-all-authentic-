const loadingScreen = document.getElementById('loadingScreen');
const nfcTapArea = document.getElementById('nfcTapArea');
const verifyModal = document.getElementById('verifyModal');
const modalClose = document.getElementById('modalClose');
const scanDate = document.getElementById('scanDate');

// ===== THREE.JS 3D SHIRT =====
let scene, camera, renderer, shirtGroup;
let isRotating = true;
const container = document.getElementById('threeContainer');

function init3D() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(3, 4, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4a6b8a, 0.5);
    fillLight.position.set(-3, 1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x888888, 0.4);
    rimLight.position.set(0, -3, 4);
    scene.add(rimLight);

    const backLight = new THREE.DirectionalLight(0x666666, 0.3);
    backLight.position.set(0, 1, -4);
    scene.add(backLight);

    // Create 3D T-Shirt
    createTShirt();

    // Animation
    animate();

    // Resize
    window.addEventListener('resize', onResize);
}

function createTShirt() {
    shirtGroup = new THREE.Group();

    // ---- T-Shirt Body (မျက်နှာပြင် ချောမွတ်အောင် ပိုပြီးအသေးစိတ်ဆွဲ) ----
    const shape = new THREE.Shape();
    
    // Neck (အပေါ်ပိုင်း)
    shape.moveTo(-0.35, 1.5);
    shape.bezierCurveTo(-0.45, 1.7, -0.35, 1.9, -0.2, 2.0);
    shape.bezierCurveTo(0, 2.1, 0.2, 2.0, 0.35, 1.9);
    shape.bezierCurveTo(0.45, 1.7, 0.35, 1.5, 0.35, 1.5);
    
    // Right ပခုံး
    shape.bezierCurveTo(0.6, 1.4, 0.9, 1.2, 1.1, 0.9);
    shape.lineTo(1.2, 0.7);
    
    // Right လက်ပြင်
    shape.bezierCurveTo(1.5, 0.5, 1.7, 0.2, 1.6, -0.1);
    shape.bezierCurveTo(1.5, -0.4, 1.3, -0.5, 1.1, -0.4);
    shape.lineTo(0.9, -0.3);
    
    // Right ဘေးပိုင်း
    shape.bezierCurveTo(0.8, -0.8, 0.7, -1.3, 0.5, -1.7);
    shape.bezierCurveTo(0.4, -1.9, 0.2, -2.0, 0, -2.0);
    
    // အောက်ခြေ (ဘယ်ဘက်ခြမ်း)
    shape.bezierCurveTo(-0.2, -2.0, -0.4, -1.9, -0.5, -1.7);
    shape.bezierCurveTo(-0.7, -1.3, -0.8, -0.8, -0.9, -0.3);
    shape.lineTo(-1.1, -0.4);
    
    // Left လက်ပြင်
    shape.bezierCurveTo(-1.3, -0.5, -1.5, -0.4, -1.6, -0.1);
    shape.bezierCurveTo(-1.7, 0.2, -1.5, 0.5, -1.2, 0.7);
    shape.lineTo(-1.1, 0.9);
    
    // Left ပခုံး
    shape.bezierCurveTo(-0.9, 1.2, -0.6, 1.4, -0.35, 1.5);

    const extrudeSettings = {
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.06,
        bevelSegments: 8,
        curveSegments: 12,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // အင်္ကျီအရောင် (အနက်ရောင်အနီးစပ်)
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.1,
        emissive: 0x111111,
        emissiveIntensity: 0.05,
        side: THREE.DoubleSide,
        clearcoat: 0.05,
        clearcoatRoughness: 0.3,
    });

    const shirt = new THREE.Mesh(geometry, material);
    shirt.castShadow = true;
    shirt.receiveShadow = true;
    shirt.rotation.x = -0.1;
    shirt.rotation.y = 0.3;
    shirt.position.y = -0.2;
    shirtGroup.add(shirt);

    // ---- လည်ပတ်ကြိုး (Collar) ----
    const collarPoints = [];
    const collarRadius = 0.32;
    for (let i = 0; i <= 20; i++) {
        const theta = (i / 20) * Math.PI * 0.9 - Math.PI / 2;
        const x = collarRadius * Math.cos(theta);
        const y = collarRadius * Math.sin(theta) + 1.75;
        collarPoints.push(new THREE.Vector3(x, y, 0.15));
    }
    
    const collarCurve = new THREE.CatmullRomCurve3(collarPoints);
    const collarGeo = new THREE.TubeGeometry(collarCurve, 16, 0.045, 8, false);
    const collarMat = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.1,
        side: THREE.DoubleSide,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.castShadow = true;
    shirtGroup.add(collar);

    // ---- ခါးစပ်အနား စာလုံး (အနားသတ်မျဉ်း) ----
    const trimShape = new THREE.Shape();
    trimShape.moveTo(-0.9, -0.3);
    trimShape.quadraticCurveTo(-1.0, -0.3, -1.1, -0.2);
    trimShape.quadraticCurveTo(-1.2, 0.1, -1.0, 0.3);
    trimShape.quadraticCurveTo(-0.8, 0.4, -0.6, 0.2);
    
    const trimGeo = new THREE.ShapeGeometry(trimShape);
    const trimMat = new THREE.MeshPhysicalMaterial({
        color: 0x3a3a3a,
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide,
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.z = 0.2;
    trim.rotation.x = -0.1;
    shirtGroup.add(trim);

    // ---- RE Logo (အင်္ကျီပေါ်မှာ) ----
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 256;
    logoCanvas.height = 256;
    const ctx = logoCanvas.getContext('2d');
    
    // Background
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 256, 256);
    
    // Border circle
    ctx.beginPath();
    ctx.arc(128, 128, 80, 0, Math.PI * 2);
    ctx.strokeStyle = '#4a6b8a';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // RE Text
    ctx.fillStyle = '#4a6b8a';
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RE', 128, 135);
    
    // Small line details
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.lineTo(196, 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(60, 196);
    ctx.lineTo(196, 196);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(logoCanvas);
    texture.needsUpdate = true;
    
    const logoMat = new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.4,
        metalness: 0.1,
        emissive: 0x4a6b8a,
        emissiveIntensity: 0.05,
    });
    
    const logoGeo = new THREE.PlaneGeometry(0.7, 0.7);
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, 0.3, 0.25);
    logoMesh.rotation.x = -0.1;
    shirtGroup.add(logoMesh);

    // ---- အောက်ခြေအနားသတ် ----
    const hemShape = new THREE.Shape();
    hemShape.moveTo(-0.6, -1.9);
    hemShape.quadraticCurveTo(-0.3, -2.05, 0, -2.05);
    hemShape.quadraticCurveTo(0.3, -2.05, 0.6, -1.9);
    
    const hemGeo = new THREE.ShapeGeometry(hemShape);
    const hemMat = new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        roughness: 0.8,
        metalness: 0.05,
        side: THREE.DoubleSide,
    });
    const hem = new THREE.Mesh(hemGeo, hemMat);
    hem.position.z = 0.2;
    hem.rotation.x = -0.1;
    shirtGroup.add(hem);

    scene.add(shirtGroup);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (isRotating && shirtGroup) {
        shirtGroup.rotation.y += 0.008;
        // အင်္ကျီကို အနည်းငယ် ယိမ်းထိုးသလိုမျိုး
        shirtGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.01;
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
    if (shirtGroup) {
        const currentScale = shirtGroup.scale.x;
        const newScale = currentScale === 1 ? 1.6 : 1;
        shirtGroup.scale.set(newScale, newScale, newScale);
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

console.log('🔐 RE Authentication System Ready with 3D T-Shirt');
