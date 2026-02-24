document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       1️⃣ العناصر الأساسية
    ========================================== */
    const backToTopBtn = document.getElementById("backToTop");
    const navbar = document.querySelector(".navbar");
    const cards = document.querySelectorAll(".player-card");
    const sliders = document.querySelectorAll(".slider-wrapper");

    /* ==========================================
       2️⃣ Scroll عام (Navbar + BackToTop)
    ========================================== */
    let windowScrollTimeout;

    window.addEventListener("scroll", () => {

        const currentScroll = window.scrollY;

        // Navbar effect
        if (navbar) {
            navbar.classList.toggle("scrolled", currentScroll > 50);
        }

        // Back To Top button
        if (backToTopBtn) {
            backToTopBtn.classList.toggle("active", currentScroll > 300);
        }

        // تعطيل hover أثناء التمرير العمودي
        document.body.classList.add("is-scrolling-vertically");

        clearTimeout(windowScrollTimeout);
        windowScrollTimeout = setTimeout(() => {
            document.body.classList.remove("is-scrolling-vertically");
        }, 250);

    }, { passive: true });

    /* ==========================================
       3️⃣ Intersection Observer (Animation)
    ========================================== */
    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show-scroll");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        cards.forEach(card => {
            card.classList.add("hidden-scroll");
            observer.observe(card);
        });

    }

    /* ==========================================
       4️⃣ Carousel System
    ========================================== */

    const checkSliderButtons = () => {
        sliders.forEach(slider => {

            const grid = slider.querySelector(".players-grid");
            const rightBtn = slider.querySelector(".right-btn");
            const leftBtn = slider.querySelector(".left-btn");

            if (!grid || !rightBtn || !leftBtn) return;

            const needsScroll = grid.scrollWidth > grid.clientWidth;

            rightBtn.style.display = needsScroll ? "flex" : "none";
            leftBtn.style.display = needsScroll ? "flex" : "none";
        });
    };

    sliders.forEach(slider => {

        const grid = slider.querySelector(".players-grid");
        const rightBtn = slider.querySelector(".right-btn");
        const leftBtn = slider.querySelector(".left-btn");

        if (!grid || !rightBtn || !leftBtn) return;

        let scrollTimeout;

        const getScrollAmount = () => {
            const card = grid.querySelector(".player-card");
            if (!card) return 300;

            const gap = parseInt(getComputedStyle(grid).gap) || 30;
            return card.offsetWidth + gap;
        };

        const disableHoverDuringScroll = () => {
            grid.classList.add("is-scrolling");

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                grid.classList.remove("is-scrolling");
            }, 400);
        };

        const updateArrowState = () => {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            const isRTL = document.documentElement.dir === "rtl";

            const currentScroll = Math.abs(grid.scrollLeft);

            if (isRTL) {
                rightBtn.style.opacity = currentScroll <= 5 ? "0.4" : "1";
                leftBtn.style.opacity = currentScroll >= maxScroll - 5 ? "0.4" : "1";
            } else {
                leftBtn.style.opacity = currentScroll <= 5 ? "0.4" : "1";
                rightBtn.style.opacity = currentScroll >= maxScroll - 5 ? "0.4" : "1";
            }
        };

        // زر يرجع للخلف
        rightBtn.addEventListener("click", () => {
            disableHoverDuringScroll();
            grid.scrollBy({
                left: getScrollAmount(),
                behavior: "smooth"
            });
        });

        // زر يتقدم للأمام
        leftBtn.addEventListener("click", () => {
            disableHoverDuringScroll();
            grid.scrollBy({
                left: -getScrollAmount(),
                behavior: "smooth"
            });
        });

        grid.addEventListener("scroll", () => {
            disableHoverDuringScroll();
            updateArrowState();
        });

        updateArrowState();
    });

    /* ==========================================
       5️⃣ Event Triggers
    ========================================== */

    window.addEventListener("load", checkSliderButtons);
    window.addEventListener("resize", checkSliderButtons);

});
