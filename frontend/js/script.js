document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       ELEMENTS
    ========================= */

    const body = document.body;

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle
        ? themeToggle.querySelector("i")
        : null;

    const menuButton = document.getElementById("menuButton");
    const menuIcon = menuButton
        ? menuButton.querySelector("i")
        : null;

    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar a");
    const sections = document.querySelectorAll("main section");

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    const typingText = document.getElementById("typingText");

    /* =========================
       DARK / LIGHT THEME
    ========================= */

    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        body.classList.add("light-theme");

        if (themeIcon) {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("light-theme");

            const isLightTheme =
                body.classList.contains("light-theme");

            if (themeIcon) {
                if (isLightTheme) {
                    themeIcon.classList.remove("fa-sun");
                    themeIcon.classList.add("fa-moon");
                } else {
                    themeIcon.classList.remove("fa-moon");
                    themeIcon.classList.add("fa-sun");
                }
            }

            localStorage.setItem(
                "portfolio-theme",
                isLightTheme ? "light" : "dark"
            );
        });
    }

    /* =========================
       MOBILE MENU
    ========================= */

    if (menuButton && navbar) {
        menuButton.addEventListener("click", () => {
            navbar.classList.toggle("show-menu");

            const menuOpened =
                navbar.classList.contains("show-menu");

            if (menuIcon) {
                menuIcon.classList.toggle(
                    "fa-bars",
                    !menuOpened
                );

                menuIcon.classList.toggle(
                    "fa-xmark",
                    menuOpened
                );
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navbar) {
                navbar.classList.remove("show-menu");
            }

            if (menuIcon) {
                menuIcon.classList.remove("fa-xmark");
                menuIcon.classList.add("fa-bars");
            }
        });
    });

    /* Close mobile menu when clicking outside */

    document.addEventListener("click", (event) => {
        if (!navbar || !menuButton) return;

        const clickedInsideNavbar =
            navbar.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (!clickedInsideNavbar && !clickedMenuButton) {
            navbar.classList.remove("show-menu");

            if (menuIcon) {
                menuIcon.classList.remove("fa-xmark");
                menuIcon.classList.add("fa-bars");
            }
        }
    });

    /* =========================
       ACTIVE NAVIGATION LINK
    ========================= */

    function updateActiveNavigation() {
        let currentSection = "home";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();

    /* =========================
       CIRCULAR SKILL ANIMATION
    ========================= */

    const skillCircles = document.querySelectorAll(
        ".compact-skill-circle"
    );

    /*
       Set all circles and numbers to zero
       when the page is loaded/refreshed.
    */

    skillCircles.forEach((circle) => {
        const progressCircle = circle.querySelector(
            ".compact-circle-progress"
        );

        const percentageText = circle.querySelector("small");

        if (progressCircle) {
            progressCircle.style.setProperty(
                "--progress",
                "0deg"
            );
        }

        if (percentageText) {
            percentageText.textContent = "0%";
        }

        circle.classList.remove("animation-complete");
        circle.dataset.animated = "false";
    });

    function animateSkillCircle(circle, delay = 0) {
        if (circle.dataset.animated === "true") {
            return;
        }

        circle.dataset.animated = "true";

        const progressCircle = circle.querySelector(
            ".compact-circle-progress"
        );

        const percentageText = circle.querySelector("small");

        const targetPercentage = Number(
            circle.dataset.progress
        );

        if (
            !progressCircle ||
            !percentageText ||
            Number.isNaN(targetPercentage)
        ) {
            return;
        }

        const safeTarget = Math.min(
            Math.max(targetPercentage, 0),
            100
        );

        setTimeout(() => {
            const duration = 1400;
            const startTime = performance.now();

            function updateProgress(currentTime) {
                const elapsedTime = currentTime - startTime;

                const animationProgress = Math.min(
                    elapsedTime / duration,
                    1
                );

                /*
                   Smooth animation:
                   starts slowly, speeds up, ends smoothly.
                */

                const easedProgress =
                    1 - Math.pow(1 - animationProgress, 3);

                const currentPercentage = Math.round(
                    safeTarget * easedProgress
                );

                const currentDegree =
                    currentPercentage * 3.6;

                progressCircle.style.setProperty(
                    "--progress",
                    `${currentDegree}deg`
                );

                percentageText.textContent =
                    `${currentPercentage}%`;

                if (animationProgress < 1) {
                    requestAnimationFrame(updateProgress);
                } else {
                    progressCircle.style.setProperty(
                        "--progress",
                        `${safeTarget * 3.6}deg`
                    );

                    percentageText.textContent =
                        `${safeTarget}%`;

                    circle.classList.add(
                        "animation-complete"
                    );
                }
            }

            requestAnimationFrame(updateProgress);
        }, delay);
    }

    /*
       Animation starts only when the skills
       section enters the screen.
    */

    const skillObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const visibleCircles =
                    entry.target.querySelectorAll(
                        ".compact-skill-circle"
                    );

                visibleCircles.forEach((circle, index) => {
                    animateSkillCircle(circle, index * 90);
                });

                /*
                   Animation runs once per page load.
                   Refreshing the page resets it.
                */

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    const skillsSection =
        document.getElementById("skills");

    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    /* =========================
       CONTACT FORM
    ========================= */

    if (contactForm) {
        contactForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const nameInput =
                    document.getElementById("name");

                const name = nameInput
                    ? nameInput.value.trim()
                    : "";

                if (formMessage) {
                    formMessage.textContent =
                        `Thank you ${name || "for contacting me"}. Your message is ready to be submitted.`;

                    formMessage.classList.add(
                        "show-message"
                    );
                }

                contactForm.reset();

                setTimeout(() => {
                    if (formMessage) {
                        formMessage.textContent = "";
                        formMessage.classList.remove(
                            "show-message"
                        );
                    }
                }, 5000);
            }
        );
    }

    /* =========================
       TYPING ANIMATION
    ========================= */

    const titles = [
        "Undergraduate at RUSL",
        "BICT Student",
        "Passionate about AI & ML",
        "Full-Stack Development",
        "UI & UX Design"
    ];

    let titleIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    function typingAnimation() {
        if (!typingText) return;

        const currentTitle = titles[titleIndex];

        if (!isDeleting) {
            characterIndex++;

            typingText.textContent =
                currentTitle.substring(
                    0,
                    characterIndex
                );

            if (characterIndex === currentTitle.length) {
                isDeleting = true;

                setTimeout(
                    typingAnimation,
                    1500
                );

                return;
            }
        } else {
            characterIndex--;

            typingText.textContent =
                currentTitle.substring(
                    0,
                    characterIndex
                );

            if (characterIndex === 0) {
                isDeleting = false;

                titleIndex =
                    (titleIndex + 1) %
                    titles.length;
            }
        }

        const typingSpeed = isDeleting ? 45 : 85;

        setTimeout(
            typingAnimation,
            typingSpeed
        );
    }

    typingAnimation();
});