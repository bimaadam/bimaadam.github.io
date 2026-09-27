/**
 * Main Application Script
 * Throttled scroll listener via requestAnimationFrame and IntersectionObserver.
 */
document.addEventListener('DOMContentLoaded', () => {
    const progress = document.getElementById('reading-progress');
    const heroBg = document.getElementById('heroBg');
    const sections = document.querySelectorAll('.section');

    // ── Optimized Scroll Handling via requestAnimationFrame ──
    let isTicking = false;

    const onScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        // 1. Reading Progress
        if (progress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrollPct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
                progress.style.width = `${scrollPct}%`;
            }
        }

        // 2. Hero Background Parallax (hanya saat hero masih terlihat di viewport)
        if (heroBg && scrollY <= window.innerHeight) {
            heroBg.style.transform = `scale(1.06) translateY(${scrollY * 0.18}px)`;
        }

        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(onScroll);
            isTicking = true;
        }
    }, { passive: true });

    // Initial check on load
    onScroll();

    // ── Intersection Observer for Section Reveal ──
    if (sections.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        sections.forEach((section) => observer.observe(section));
    } else {
        // Fallback untuk browser yang tidak mendukung IntersectionObserver
        sections.forEach((section) => section.classList.add('visible'));
    }
});
