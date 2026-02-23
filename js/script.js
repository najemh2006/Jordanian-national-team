document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. جلب العناصر الأساسية من الـ DOM
    // ==========================================
    const backToTopBtn = document.getElementById("backToTop");
    const navbar = document.querySelector(".navbar");
    const cards = document.querySelectorAll('.player-card');
    const sliders = document.querySelectorAll('.slider-wrapper');

    // ==========================================
    // 2. أحداث التمرير العامة (Navbar, BackToTop, Hover Disable)
    // ==========================================
    let windowScrollTimeout; 

    window.addEventListener("scroll", () => {
        // تخزين قيمة التمرير لتحسين الأداء
        const currentScroll = window.scrollY;

        // التحكم في شريط التنقل وزر العودة للأعلى
        if (navbar) navbar.classList.toggle("scrolled", currentScroll > 50);
        if (backToTopBtn) backToTopBtn.classList.toggle("active", currentScroll > 300);

        // إيقاف تأثير الماوس أثناء التمرير العمودي
        document.body.classList.add('is-scrolling-vertically');
        
        clearTimeout(windowScrollTimeout);
        windowScrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling-vertically');
        }, 300);
    });

    // ==========================================
    // 3. مراقب الظهور (Intersection Observer) للبطاقات
    // ==========================================
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show-scroll");
                obs.unobserve(entry.target); // إيقاف المراقبة بعد الظهور
            }
        });
    }, observerOptions);

    // تطبيق الإخفاء المبدئي وبدء المراقبة
    cards.forEach((card) => {
        card.classList.add('hidden-scroll');
        observer.observe(card);
    });

    // ==========================================
    // 4. برمجة التمرير الجانبي (Carousel)
    // ==========================================
    
    // دالة فحص الحاجة لأسهم التمرير
    const checkSliderButtons = () => {
        sliders.forEach(slider => {
            const grid = slider.querySelector('.players-grid');
            const rightBtn = slider.querySelector('.right-btn');
            const leftBtn = slider.querySelector('.left-btn');

            if (grid && rightBtn && leftBtn) {
                const needsScroll = grid.scrollWidth > grid.clientWidth;
                rightBtn.style.display = needsScroll ? 'flex' : 'none';
                leftBtn.style.display = needsScroll ? 'flex' : 'none';
            }
        });
    };

    // إعداد أزرار وحركة كل قسم
    sliders.forEach(slider => {
        const grid = slider.querySelector('.players-grid');
        const rightBtn = slider.querySelector('.right-btn');
        const leftBtn = slider.querySelector('.left-btn');
        let scrollTimeout;

        const disableHoverDuringScroll = () => {
            if (!grid) return;
            grid.classList.add('is-scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                grid.classList.remove('is-scrolling');
            }, 500); 
        };

        if (grid && leftBtn) {
            leftBtn.addEventListener('click', () => {
                disableHoverDuringScroll();
                grid.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }

        if (grid && rightBtn) {
            rightBtn.addEventListener('click', () => {
                disableHoverDuringScroll();
                grid.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }

        if (grid) {
            grid.addEventListener('scroll', disableHoverDuringScroll);
        }
    });

    // ==========================================
    // 5. مشغلات الأحداث (Event Triggers)
    // ==========================================
    window.addEventListener('load', checkSliderButtons);
    window.addEventListener('resize', checkSliderButtons);
});