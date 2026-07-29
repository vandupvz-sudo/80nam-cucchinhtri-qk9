"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       GALLERY LIGHTBOX
    ========================================================== */

    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButtons = document.querySelectorAll("[data-close-lightbox]");

    function openLightbox(imagePath, caption) {

        if (!lightbox) return;

        lightboxImage.src = imagePath;
        lightboxImage.alt = caption;
        lightboxCaption.textContent = caption;

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("lightbox-open");
    }

    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("lightbox-open");

        setTimeout(() => {

            lightboxImage.src = "";
            lightboxImage.alt = "";

        }, 200);

    }

    galleryItems.forEach((item) => {

        item.addEventListener("click", () => {

            openLightbox(
                item.dataset.image,
                item.dataset.caption || ""
            );

        });

    });

    closeButtons.forEach((button) => {

        button.addEventListener("click", closeLightbox);

    });

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            lightbox &&
            lightbox.classList.contains("is-open")
        ) {

            closeLightbox();

        }

    });


    /* ==========================================================
       HEADER
    ========================================================== */

    const header = document.getElementById("site-header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {

            header.classList.add("is-scrolled");

        } else {

            header.classList.remove("is-scrolled");

        }

    }

    window.addEventListener("scroll", updateHeader);

    updateHeader();


    /* ==========================================================
       MOBILE MENU
    ========================================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("site-nav-mobile");

    if (menuToggle && mobileNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mobileNav.classList.toggle("is-open");

            menuToggle.classList.toggle("is-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        });

    }

    const mobileLinks = document.querySelectorAll(".mobile-nav__link");

    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("is-open");

            menuToggle.classList.remove("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /* ==========================================================
       ACTIVE MENU
    ========================================================== */

    const sections = document.querySelectorAll("main section[id]");

    const navLinks = document.querySelectorAll(".site-nav__link");

    function updateActiveMenu() {

        let current = "trang-chu";

        sections.forEach((section) => {

            if (

                window.scrollY >=

                section.offsetTop - 160

            ) {

                current = section.id;

            }

        });

        navLinks.forEach((link) => {

            link.classList.remove("is-active");

            if (

                link.getAttribute("href") === "#" + current

            ) {

                link.classList.add("is-active");

            }

        });

    }

    window.addEventListener("scroll", updateActiveMenu);

    updateActiveMenu();
    document.addEventListener("DOMContentLoaded", () => {
    });
    /* =========================================================
    MODULE LỊCH SỬ
    Tự động chạy + chuyển tay + tạm dừng
 ========================================================= */

        const slides = Array.from(
            document.querySelectorAll(".history-slide")
        );

        const periodElement =
            document.getElementById("history-period");

        const currentElement =
            document.getElementById("history-current");

        const totalElement =
            document.getElementById("history-total");

        const progressBar =
            document.getElementById("history-progress-bar");

        const previousButton =
            document.getElementById("history-prev");

        const toggleButton =
            document.getElementById("history-toggle");

        const nextButton =
            document.getElementById("history-next");

        if (slides.length === 0) {
            console.warn(
                "Module Lịch sử: Không tìm thấy phần tử .history-slide"
            );

            return;
        }

        let currentIndex = 0;
        let autoPlayTimer = null;
        let isPlaying = true;
        let isTransitioning = false;

        const SLIDE_DURATION = 5000;
        const FADE_DURATION = 750;

        const formatNumber = (number) => {
            return String(number).padStart(2, "0");
        };

        const getPeriod = (slide) => {
            return slide.dataset.period || "";
        };

        const updateStatus = () => {
            const activeSlide = slides[currentIndex];

            if (periodElement) {
                periodElement.textContent =
                    getPeriod(activeSlide);
            }

            if (currentElement) {
                currentElement.textContent =
                    formatNumber(currentIndex + 1);
            }

            if (totalElement) {
                totalElement.textContent =
                    formatNumber(slides.length);
            }

            if (progressBar) {
                const percentage =
                    ((currentIndex + 1) / slides.length) * 100;

                progressBar.style.width = `${percentage}%`;
            }
        };

        const setToggleAppearance = () => {
            if (!toggleButton) {
                return;
            }

            if (isPlaying) {
                toggleButton.textContent = "❚❚";

                toggleButton.setAttribute(
                    "aria-label",
                    "Tạm dừng trình chiếu"
                );
            } else {
                toggleButton.textContent = "▶";

                toggleButton.setAttribute(
                    "aria-label",
                    "Tiếp tục trình chiếu"
                );
            }
        };

        const changeSlide = (nextIndex) => {
            if (
                isTransitioning ||
                nextIndex === currentIndex
            ) {
                return;
            }

            isTransitioning = true;

            const currentSlide = slides[currentIndex];
            const nextSlide = slides[nextIndex];

            currentSlide.classList.add("is-leaving");

            if (periodElement) {
                periodElement.classList.add("is-hidden");
            }

            window.setTimeout(() => {
                currentSlide.classList.remove(
                    "is-active",
                    "is-leaving"
                );

                currentIndex = nextIndex;

                updateStatus();

                nextSlide.classList.add("is-active");

                window.requestAnimationFrame(() => {
                    if (periodElement) {
                        periodElement.classList.remove(
                            "is-hidden"
                        );
                    }
                });

                window.setTimeout(() => {
                    isTransitioning = false;
                }, FADE_DURATION);

            }, FADE_DURATION);
        };

        const showNextSlide = () => {
            const nextIndex =
                (currentIndex + 1) % slides.length;

            changeSlide(nextIndex);
        };

        const showPreviousSlide = () => {
            const previousIndex =
                (currentIndex - 1 + slides.length) %
                slides.length;

            changeSlide(previousIndex);
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer !== null) {
                window.clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }

            isPlaying = false;
            setToggleAppearance();
        };

        const startAutoPlay = () => {
            if (slides.length < 2) {
                return;
            }

            if (autoPlayTimer !== null) {
                window.clearInterval(autoPlayTimer);
            }

            autoPlayTimer = window.setInterval(
                showNextSlide,
                SLIDE_DURATION
            );

            isPlaying = true;
            setToggleAppearance();
        };

        const restartAutoPlay = () => {
            if (!isPlaying) {
                return;
            }

            if (autoPlayTimer !== null) {
                window.clearInterval(autoPlayTimer);
            }

            autoPlayTimer = window.setInterval(
                showNextSlide,
                SLIDE_DURATION
            );
        };

        /* Khởi tạo */

        slides.forEach((slide, index) => {
            slide.classList.toggle(
                "is-active",
                index === 0
            );

            slide.classList.remove("is-leaving");
        });

        updateStatus();
        setToggleAppearance();
        startAutoPlay();

        /* Nút trước */

        if (previousButton) {
            previousButton.addEventListener("click", () => {
                if (isTransitioning) {
                    return;
                }

                showPreviousSlide();
                restartAutoPlay();
            });
        }

        /* Nút tiếp theo */

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                if (isTransitioning) {
                    return;
                }

                showNextSlide();
                restartAutoPlay();
            });
        }

        /* Tạm dừng và tiếp tục */

        if (toggleButton) {
            toggleButton.addEventListener("click", () => {
                if (isPlaying) {
                    stopAutoPlay();
                } else {
                    startAutoPlay();
                }
            });
        }

        /* Dừng khi tab trình duyệt không còn hiển thị */

        document.addEventListener(
            "visibilitychange",
            () => {
                if (document.hidden) {
                    if (autoPlayTimer !== null) {
                        window.clearInterval(autoPlayTimer);
                        autoPlayTimer = null;
                    }
                } else if (isPlaying) {
                    startAutoPlay();
                }
            }
        );
        /* =========================================================
   HIỆU ỨNG ĐẾM SỐ — CHẠY LẠI MỖI KHI CUỘN ĐẾN
========================================================= */

const achievementNumbers = document.querySelectorAll(
    ".achievement-stat__number"
);

const animateNumber = (element) => {
    const target = Number(element.dataset.target);

    if (!Number.isFinite(target)) {
        return;
    }

    const duration = 1500;
    const startTime = performance.now();

    element.classList.add("is-counting");

    const updateNumber = (currentTime) => {
        if (element.dataset.counting !== "true") {
            return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress =
            1 - Math.pow(1 - progress, 3);

        const currentValue =
            Math.floor(target * easedProgress);

        element.textContent =
            currentValue.toLocaleString("vi-VN");

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent =
                target.toLocaleString("vi-VN");

            element.classList.remove("is-counting");
        }
    };

    requestAnimationFrame(updateNumber);
};

const numberObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            const numberElement = entry.target;

            if (entry.isIntersecting) {
                if (
                    numberElement.dataset.counting === "true"
                ) {
                    return;
                }

                numberElement.dataset.counting = "true";
                animateNumber(numberElement);
            } else {
                numberElement.dataset.counting = "false";
                numberElement.textContent = "0";
                numberElement.classList.remove("is-counting");
            }
        });
    },
    {
        threshold: 0.5
    }
);

achievementNumbers.forEach((numberElement) => {
    numberElement.textContent = "0";
    numberElement.dataset.counting = "false";

    numberObserver.observe(numberElement);
});
/* =========================================================
   CAROUSEL NHÓM TÁC GIẢ
========================================================= */

const authorCards = Array.from(
    document.querySelectorAll(".author-card")
);

const authorsPrevButton =
    document.getElementById("authors-prev");

const authorsNextButton =
    document.getElementById("authors-next");

const authorDots = Array.from(
    document.querySelectorAll(".authors-dot")
);

if (authorCards.length > 0) {
    let currentAuthorIndex = 0;
    let authorsTimer = null;

    const AUTHORS_DURATION = 4500;

    const getRelativePosition = (index) => {
        const total = authorCards.length;

        let position =
            (index - currentAuthorIndex + total) % total;

        if (position > total / 2) {
            position -= total;
        }

        return position;
    };

    const updateAuthorsCarousel = () => {
        authorCards.forEach((card, index) => {
            card.classList.remove(
                "is-center",
                "is-left",
                "is-right",
                "is-far-left",
                "is-far-right"
            );

            const position = getRelativePosition(index);

            if (position === 0) {
                card.classList.add("is-center");
            } else if (position === -1) {
                card.classList.add("is-left");
            } else if (position === 1) {
                card.classList.add("is-right");
            } else if (position === -2) {
                card.classList.add("is-far-left");
            } else if (position === 2) {
                card.classList.add("is-far-right");
            }
        });

        authorDots.forEach((dot, index) => {
            dot.classList.toggle(
                "is-active",
                index === currentAuthorIndex
            );
        });
    };

    const showNextAuthor = () => {
        currentAuthorIndex =
            (currentAuthorIndex + 1) %
            authorCards.length;

        updateAuthorsCarousel();
    };

    const showPreviousAuthor = () => {
        currentAuthorIndex =
            (
                currentAuthorIndex -
                1 +
                authorCards.length
            ) % authorCards.length;

        updateAuthorsCarousel();
    };

    const startAuthorsAutoPlay = () => {
        if (authorsTimer !== null) {
            window.clearInterval(authorsTimer);
        }

        authorsTimer = window.setInterval(
            showNextAuthor,
            AUTHORS_DURATION
        );
    };

    const restartAuthorsAutoPlay = () => {
        startAuthorsAutoPlay();
    };

    if (authorsPrevButton) {
        authorsPrevButton.addEventListener(
            "click",
            () => {
                showPreviousAuthor();
                restartAuthorsAutoPlay();
            }
        );
    }

    if (authorsNextButton) {
        authorsNextButton.addEventListener(
            "click",
            () => {
                showNextAuthor();
                restartAuthorsAutoPlay();
            }
        );
    }

    authorDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentAuthorIndex = index;
            updateAuthorsCarousel();
            restartAuthorsAutoPlay();
        });
    });

    updateAuthorsCarousel();
    startAuthorsAutoPlay();
}
    });
