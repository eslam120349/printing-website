/**
 * Scroll‑driven image sequence animation
 * فقط Hero + خلفية فيديو + خدمات (Opacity)
 */

const TOTAL_FRAMES = 167;
const FRAME_PATH = 'frames/printer-animation';
const FRAME_EXT = '.jpg';

const images = [];
let loadedCount = 0;
let hasAtLeastOne = false;
const container = document.getElementById('frame-container');

for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.onload = () => {
        loadedCount++;
        hasAtLeastOne = true;
    };
    img.onerror = () => {
        console.warn('فشل تحميل الصورة:', img.src);
    };
    img.src = FRAME_PATH + String(i).padStart(3, '0') + FRAME_EXT;
    images.push(img);
}

let currentScroll = 0;
let targetScroll = 0;

function onScroll() {
    const spacer = document.getElementById('animation-spacer');
    if (!spacer) return;
    const spacerHeight = spacer.offsetHeight;
    const scrollY = window.scrollY;
    targetScroll = Math.min(1, Math.max(0, scrollY / spacerHeight));
}

function smoothstep(value, edge0, edge1) {
    const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

function animate() {
    requestAnimationFrame(animate);

    currentScroll += (targetScroll - currentScroll) * 0.08;

    // تحديث الخلفية
    if (hasAtLeastOne && container) {
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(currentScroll * TOTAL_FRAMES));
        const img = images[frameIndex];
        if (img && img.src) {
            container.style.backgroundImage = `url(${img.src})`;
        }
    }

    // SERVICES PANEL
    const services = document.querySelector('#services');
    const appearServices = smoothstep(currentScroll, 0.8, 1.0); // يظهر بعد 80% من الفيديو
    if (services) {
        services.style.opacity = appearServices;
        services.style.transform = 'scale(1)';
        services.style.clipPath = 'none';

        const servicesContent = document.querySelector('.services-content');
        if (servicesContent) {
            servicesContent.style.opacity = appearServices;
            servicesContent.style.transform = 'scale(1)';
        }
    }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', () => { });
animate();