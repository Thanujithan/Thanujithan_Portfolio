document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector("i");

    const menuButton = document.getElementById("menuButton");
    const menuIcon = menuButton?.querySelector("i");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar a");
    const sections = document.querySelectorAll("main section[id]");

    const typingText = document.getElementById("typingText");

    const showMoreBtn = document.getElementById("showMoreBtn");
    const projectsContainer = document.getElementById("projectsContainer");

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const sendButton = contactForm?.querySelector('button[type="submit"]');

    /* =========================
       Theme Toggle
    ========================= */

    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        body.classList.add("light-theme");
    }

    function updateThemeIcon() {
        if (!themeIcon) return;

        const isLight = body.classList.contains("light-theme");

        themeIcon.classList.toggle("fa-sun", !isLight);
        themeIcon.classList.toggle("fa-moon", isLight);
    }

    updateThemeIcon();

    themeToggle?.addEventListener("click", () => {
        body.classList.toggle("light-theme");

        const isLight = body.classList.contains("light-theme");

        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );

        updateThemeIcon();
    });

    /* =========================
       Mobile Menu
    ========================= */

    function closeMenu() {
        navbar?.classList.remove("show-menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }

        menuButton?.setAttribute("aria-expanded", "false");
    }

    menuButton?.setAttribute("aria-expanded", "false");

    menuButton?.addEventListener("click", () => {
        if (!navbar) return;

        const isOpen = navbar.classList.toggle("show-menu");

        menuIcon?.classList.toggle("fa-bars", !isOpen);
        menuIcon?.classList.toggle("fa-xmark", isOpen);

        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!navbar || !menuButton) return;

        if (
            !navbar.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });

    /* =========================
       Active Navigation
    ========================= */

    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 170;
        let currentSection = "home";

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (
                scrollPosition >= top &&
                scrollPosition < bottom
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`
            );
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();

    /* =========================
       Skills Animation
    ========================= */

    const skillCircles = document.querySelectorAll(
        ".compact-skill-circle[data-progress]"
    );

    skillCircles.forEach((circle) => {
        const progress = circle.querySelector(
            ".compact-circle-progress"
        );

        const percentage = circle.querySelector("small");

        progress?.style.setProperty("--progress", "0deg");

        if (percentage) {
            percentage.textContent = "0%";
        }

        circle.dataset.animated = "false";
        circle.classList.remove("animation-complete");
    });

    function animateSkill(circle, delay = 0) {
        if (circle.dataset.animated === "true") return;

        const progress = circle.querySelector(
            ".compact-circle-progress"
        );

        const percentage = circle.querySelector("small");

        const target = Math.min(
            100,
            Math.max(
                0,
                Number(circle.dataset.progress) || 0
            )
        );

        if (!progress || !percentage) return;

        circle.dataset.animated = "true";

        setTimeout(() => {
            const duration = 1400;
            const start = performance.now();

            function animate(time) {
                const elapsed = time - start;
                const value = Math.min(elapsed / duration, 1);

                const eased =
                    1 - Math.pow(1 - value, 3);

                const current = Math.round(target * eased);

                progress.style.setProperty(
                    "--progress",
                    `${current * 3.6}deg`
                );

                percentage.textContent = `${current}%`;

                if (value < 1) {
                    requestAnimationFrame(animate);
                } else {
                    progress.style.setProperty(
                        "--progress",
                        `${target * 3.6}deg`
                    );

                    percentage.textContent = `${target}%`;

                    circle.classList.add(
                        "animation-complete"
                    );
                }
            }

            requestAnimationFrame(animate);
        }, delay);
    }

    const skillsSection =
        document.getElementById("skills");

    if (
        skillsSection &&
        "IntersectionObserver" in window
    ) {
        const skillObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const circles =
                            entry.target.querySelectorAll(
                                ".compact-skill-circle[data-progress]"
                            );

                        circles.forEach(
                            (circle, index) => {
                                animateSkill(
                                    circle,
                                    index * 90
                                );
                            }
                        );

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.18,
                    rootMargin: "0px 0px -60px 0px"
                }
            );

        skillObserver.observe(skillsSection);
    } else {
        skillCircles.forEach((circle, index) => {
            animateSkill(circle, index * 70);
        });
    }

    /* =========================
       Show More Projects
    ========================= */

    if (showMoreBtn && projectsContainer) {
        const buttonText =
            showMoreBtn.querySelector("span");

        showMoreBtn.addEventListener("click", () => {
            const isShowingAll =
                projectsContainer.classList.toggle(
                    "show-all"
                );

            showMoreBtn.classList.toggle(
                "active",
                isShowingAll
            );

            showMoreBtn.setAttribute(
                "aria-expanded",
                String(isShowingAll)
            );

            if (buttonText) {
                buttonText.textContent =
                    isShowingAll
                        ? "Show Less"
                        : "Show More";
            }

            if (!isShowingAll) {
                document
                    .getElementById("projects")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        });
    }

    /* =========================
       Contact Form - EmailJS
    ========================= */

    if (contactForm && sendButton) {
        contactForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const originalButtonContent =
                    sendButton.innerHTML;

                sendButton.disabled = true;
                sendButton.innerHTML =
                    'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

                if (formMessage) {
                    formMessage.textContent = "Sending message...";
                    formMessage.classList.add("show-message");
                }
                const now = new Date();

                    document.getElementById("sentDate").value =
                        now.toLocaleDateString("en-GB");

                    document.getElementById("sentTime").value =
                        now.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        });

                    await emailjs.sendForm(
                        "service_fbpr9bm",
                        "template_67abrsw",
                        contactForm,
                        {
                            publicKey: "5vVSBeW_z2nhj83ZR"
                        }
                    );

                try {
                    await emailjs.sendForm(
                        "service_fbpr9bm",
                        "template_67abrsw",
                        contactForm
                    );

                    if (formMessage) {
                        formMessage.textContent =
                            "Message sent successfully!";
                    }

                    contactForm.reset();
                }  catch (error) {
                    console.error("EmailJS full error:", error);
                    console.error("Status:", error.status);
                    console.error("Message:", error.text);

                    alert(
                        `EmailJS Error ${error.status}: ${error.text}`
                    );
                }
                 finally {
                    sendButton.disabled = false;
                    sendButton.innerHTML =
                        originalButtonContent;

                    setTimeout(() => {
                        if (formMessage) {
                            formMessage.textContent = "";
                            formMessage.classList.remove(
                                "show-message"
                            );
                        }
                    }, 5000);
                }
            }
        );
    }

    /* =========================
       Typing Animation
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
    let deleting = false;

    function typingAnimation() {
        if (!typingText) return;

        const title = titles[titleIndex];

        if (!deleting) {
            characterIndex++;

            typingText.textContent =
                title.substring(0, characterIndex);

            if (characterIndex === title.length) {
                deleting = true;

                setTimeout(typingAnimation, 1500);
                return;
            }
        } else {
            characterIndex--;

            typingText.textContent =
                title.substring(0, characterIndex);

            if (characterIndex === 0) {
                deleting = false;

                titleIndex =
                    (titleIndex + 1) % titles.length;
            }
        }

        setTimeout(
            typingAnimation,
            deleting ? 45 : 85
        );
    }

    typingAnimation();
});