/**
 * Scroll‑driven image sequence animation
 * - جميع الصور تُحمّل أولاً قبل بدء الأنيميشن
 * - مع كاش المتصفح (Vercel headers)
 */
const TOTAL_FRAMES = 167;
const FRAME_PATH = 'frames/printer-animation';
const FRAME_EXT = '.jpg';

const images = [];
let allImagesLoaded = false;
const container = document.getElementById('frame-container');

// تحميل كل الصور
function preloadAllImages() {
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.onload = () => {
            loaded++;
            if (loaded === TOTAL_FRAMES) {
                allImagesLoaded = true;
                // نعرض أول إطار فوراً بعد التحميل
                container.style.backgroundImage = `url(${images[0].src})`;
            }
        };
        img.onerror = () => {
            console.warn('فشل تحميل:', img.src);
            loaded++; // حتى لو فشل، نكمل العد
        };
        img.src = FRAME_PATH + String(i).padStart(3, '0') + FRAME_EXT;
        images.push(img);
    }
}

// نبدأ التحميل فوراً
preloadAllImages();

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

    // تحديث الخلفية فقط إذا كل الصور جاهزة
    if (allImagesLoaded && container) {
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(currentScroll * TOTAL_FRAMES));
        const img = images[frameIndex];
        if (img) {
            container.style.backgroundImage = `url(${img.src})`;
        }
    }

    // SERVICES PANEL
    const services = document.querySelector('#services');
    const appearServices = smoothstep(currentScroll, 0.8, 1.0);
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