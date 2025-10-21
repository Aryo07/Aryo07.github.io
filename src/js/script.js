// Cyber Terminal Portfolio with Safe Sound Effects
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".loading-screen");
    const terminal = document.querySelector(".terminal");
    const buttons = document.querySelectorAll(".nav-bar button");
    const sections = document.querySelectorAll(".content-section");
    let audioCtx = null; // delay initialization until user gesture

    // Loader bar animation
    const loaderBar = document.querySelector(".loader-progress");
    if (loaderBar) {
        loaderBar.addEventListener("animationend", () => {
            if (audioCtx) playBootSound();
        });
    }

    // Typewriter effect for loader message (randomize message, smooth typing)
    const loaderMessages = [
        "Initializing system",
        // "Booting neon circuits",
        // "Loading modules",
        // "Authenticating user",
        // "Connecting to cyber terminal"
    ];
    const loaderMessageEl = document.getElementById("loader-message");
    if (loaderMessageEl) {
        const msg = loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
        let i = 0;
        loaderMessageEl.textContent = "";
        const typeInterval = setInterval(() => {
            loaderMessageEl.textContent += msg[i];
            i++;
            if (i >= msg.length) clearInterval(typeInterval);
        }, 55); // lebih smooth, total ~2 detik
    }

    // Create sound safely after user gesture
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playBeep = (frequency = 440, duration = 80, volume = 0.05) => {
        if (!audioCtx) return; // skip if not yet initialized
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "square";
        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume;
        oscillator.start();
        setTimeout(() => oscillator.stop(), duration);
    };

    const playBootSound = () => {
        if (!audioCtx) return;
        let delay = 0;
        [440, 520, 640].forEach((freq) => {
            setTimeout(() => playBeep(freq, 100, 0.04), delay);
            delay += 120;
        });
    };

    const playClickSound = () => playBeep(300, 50, 0.07);

    // Boot animation
    const LOADING_DELAY = 2200; // 2.2 detik, sama dengan progress bar dan typing
    setTimeout(() => {
        // Jika audioCtx sudah aktif, mainkan boot sound dan transisi
        if (audioCtx) {
            playBootSound();
            setTimeout(() => {
                loader.classList.add("hidden");
                terminal.classList.remove("hidden");
            }, 400); // boot sound selesai sebelum transisi
        } else {
            // Tampilkan instruksi klik untuk masuk dengan transisi smooth
            const loaderText = document.querySelector('.loader-text');
            if (loaderText) {
                loaderText.classList.add('fade-out');
                setTimeout(() => {
                    loaderText.innerHTML = '<span style="color:#00ff66">Click anywhere to enter...</span>';
                    loaderText.classList.remove('fade-out');
                    loaderText.classList.add('fade-in-loader');
                }, 500);
            }
            document.body.addEventListener("click", () => {
                initAudio();
                playBootSound();
                setTimeout(() => {
                    loader.classList.add("hidden");
                    terminal.classList.remove("hidden");
                }, 400); // boot sound selesai sebelum transisi
            }, { once: true });
        }
    }, LOADING_DELAY);

    // Navigation click logic
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            playClickSound();
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const target = button.dataset.section;
            sections.forEach(sec => {
                sec.classList.remove("active");
                if (sec.id === target) sec.classList.add("active");
            });
        });
    });

    // Year
    document.getElementById("year").textContent = new Date().getFullYear();
});
