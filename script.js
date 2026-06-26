document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation Library for other sections
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out-cubic',
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3D Scroll Morph Hero Animation ---
    gsap.registerPlugin(ScrollTrigger);

    const IMAGES = [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
        "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
        "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
        "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80",
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80",
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=80",
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80",
        "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80",
        "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80"
    ];
    
    const TOTAL_IMAGES = 20;
    const container = document.getElementById("morph-cards-container");
    const cards = [];

    // Helper: Linear Interpolation
    const lerp = (start, end, t) => start * (1 - t) + end * t;

    // Generate Cards
    IMAGES.forEach((src, i) => {
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "flip-card-wrapper";
        
        const cardInner = document.createElement("div");
        cardInner.className = "flip-card-inner";
        
        const front = document.createElement("div");
        front.className = "flip-card-front";
        front.innerHTML = `<img src="${src}" alt="hero-${i}"><div class="flip-card-front-overlay"></div>`;
        
        const back = document.createElement("div");
        back.className = "flip-card-back";
        back.innerHTML = `<p class="view-label">View</p><p class="view-text">Details</p>`;
        
        cardInner.appendChild(front);
        cardInner.appendChild(back);
        cardWrapper.appendChild(cardInner);
        container.appendChild(cardWrapper);
        cards.push(cardWrapper);

        // Initial Scatter State
        gsap.set(cardWrapper, {
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
            xPercent: -50,
            yPercent: -50
        });
    });

    let state = {
        morphProgress: 0,
        scrollRotate: 0,
        introPhase: "scatter" // scatter -> circle
    };

    // Initial scatter to circle animation
    setTimeout(() => {
        state.introPhase = "circle";
        gsap.to(".morph-intro-text", { opacity: 0, filter: "blur(10px)", duration: 1 });
    }, 1500);

    // ScrollTrigger to manage progress
    ScrollTrigger.create({
        trigger: ".scroll-morph-hero-section",
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            // First 20% of scroll is morphing from circle to arc
            state.morphProgress = Math.min(self.progress * 5, 1);
            
            // Remaining 80% is scrolling the arc
            const scrollFactor = Math.max((self.progress - 0.2) / 0.8, 0);
            state.scrollRotate = scrollFactor * 360;

            // Fade in active content
            if (self.progress > 0.2) {
                gsap.to(".morph-active-content", { opacity: 1, y: 0, duration: 0.5 });
            } else {
                gsap.to(".morph-active-content", { opacity: 0, y: 20, duration: 0.5 });
            }
        }
    });

    // Parallax mouse effect
    let parallaxValue = 0;
    container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const normalizedX = (relativeX / rect.width) * 2 - 1;
        gsap.to({ val: parallaxValue }, {
            val: normalizedX * 100,
            duration: 0.5,
            onUpdate: function() { parallaxValue = this.targets()[0].val; }
        });
    });

    // Render loop
    gsap.ticker.add(() => {
        if (state.introPhase === "scatter") return;

        const isMobile = window.innerWidth < 768;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const minDimension = Math.min(width, height);

        cards.forEach((card, i) => {
            // A. Circle Position
            const circleRadius = Math.min(minDimension * 0.35, 350);
            const circleAngle = (i / TOTAL_IMAGES) * 360;
            const circleRad = (circleAngle * Math.PI) / 180;
            const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
            };

            // B. Arc Position
            const baseRadius = Math.min(width, height * 1.5);
            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
            const arcApexY = height * (isMobile ? 0.35 : 0.25) - (height / 2); // Center offset
            const arcCenterY = arcApexY + arcRadius;

            const spreadAngle = isMobile ? 100 : 130;
            const startAngle = -90 - (spreadAngle / 2);
            const step = spreadAngle / (TOTAL_IMAGES - 1);

            const scrollProgress = Math.min(Math.max(state.scrollRotate / 360, 0), 1);
            const maxRotation = spreadAngle * 0.8;
            const boundedRotation = -scrollProgress * maxRotation;

            const currentArcAngle = startAngle + (i * step) + boundedRotation;
            const arcRad = (currentArcAngle * Math.PI) / 180;

            const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
            };

            // C. Interpolate (Morph)
            const targetX = lerp(circlePos.x, arcPos.x, state.morphProgress);
            const targetY = lerp(circlePos.y, arcPos.y, state.morphProgress);
            const targetRot = lerp(circlePos.rotation, arcPos.rotation, state.morphProgress);
            const targetScale = lerp(1, arcPos.scale, state.morphProgress);

            // Apply using GSAP quickSetter for performance
            gsap.set(card, {
                x: targetX,
                y: targetY,
                rotation: targetRot,
                scale: targetScale,
                opacity: 1
            });
        });
    });
});
