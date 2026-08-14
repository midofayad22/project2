// Dynamic Cursor Glow Tracking
const mouseGlow = document.getElementById('mouseGlow');
if (mouseGlow) {
    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = `${e.clientX}px`;
        mouseGlow.style.top = `${e.clientY}px`;
    });
}
<button id="academicBtn">🎓 عرض التفاصيل الأكاديمية</button>