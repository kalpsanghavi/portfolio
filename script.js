/* =====================================================
   KALP PORTFOLIO · JAVASCRIPT
   Particles, Counters, Scroll FX, Filter, Nav
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '';
        spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // ===== PARTICLE CANVAS =====
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.color = ['#4f8ef7', '#a78bfa', '#22d3ee', '#34d399'][Math.floor(Math.random() * 4)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const count = Math.min(120, Math.floor(window.innerWidth / 12));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        // Draw connecting lines between close particles
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.save();
                        ctx.globalAlpha = 0.06 * (1 - dist / 100);
                        ctx.strokeStyle = '#4f8ef7';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            animId = requestAnimationFrame(animate);
        };
        animate();
    }

    // ===== COUNTER ANIMATION =====
    const animateCounter = (el, end, duration = 1800) => {
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { start = end; clearInterval(timer); }
            el.textContent = Math.round(start);
        }, 16);
    };

    const counters = document.querySelectorAll('.stat-num[data-count]');
    let countersStarted = false;
    const heroObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(el => animateCounter(el, parseInt(el.dataset.count)));
        }
    }, { threshold: 0.5 });
    if (counters.length) heroObs.observe(document.querySelector('.hero-stats'));

    // ===== SCROLL REVEAL =====
    const reveals = document.querySelectorAll('.about-card, .skill-group, .product-card, .tl-card, .about-grid > *, .section-title, .section-desc');
    reveals.forEach(el => el.classList.add('reveal'));

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), 80);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObs.observe(el));

    // ===== STAGGERED PRODUCT CARDS =====
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.05}s`;
    });

    // ===== ERA FILTER TABS =====
    const eraTabs = document.querySelectorAll('.era-tab');
    const allCards = document.querySelectorAll('.product-card[data-era]');

    eraTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const era = tab.dataset.era;

            // Update active tab
            eraTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            allCards.forEach(card => {
                if (era === 'all' || card.dataset.era === era) {
                    card.style.display = 'flex';
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Re-trigger grid layout animation
            const grid = document.getElementById('productsGrid');
            if (era === 'eqint') {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else if (era === 'wonderly') {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }
        });
    });

    // ===== SMOOTH SCROLL NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== ACTIVE NAV HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) current = section.getAttribute('id');
        });
        navLinksAll.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--blue-light)' : '';
        });
    }, { passive: true });

    // ===== CURSOR GLOW EFFECT =====
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: left 0.15s ease, top 0.15s ease;
        border-radius: 50%;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }, { passive: true });

    // ===== PRODUCT CARD TILT =====
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    console.log('🚀 Kalp Sanghavi Portfolio loaded successfully!');
});
