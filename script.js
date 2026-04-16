/* ============================================================
   787 GASTRONOMIA PUERTORRIQUEÑA - Premium Dark Mode JS
   ============================================================ */

'use strict';

// ─── DOM Ready ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initReservationForm();
    initConfirmModal();
    initNavbar();
    initMobileMenu();
    initFlipCards();
    initScrollReveal();
    initCounters();
    initDishCarousel();
    initStatusBadge(); // Dynamic Open/Closed badge
});

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 25 : 50;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = (Math.random() * 20) + 's';
        particle.style.animationDuration = (15 + Math.random() * 12) + 's';

        // Vary sizes slightly
        const size = 1.5 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = (0.2 + Math.random() * 0.6).toString();

        container.appendChild(particle);
    }
}

/* ============================================================
   NAVBAR — sticky + scroll class
   ============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = debounce(() => {
        if (window.scrollY > 48) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const links = mobileNav ? mobileNav.querySelectorAll('a') : [];

    if (!toggle || !mobileNav) return;

    const close = () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('open');
        mobileNav.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.forEach(link => link.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}

/* ============================================================
   FLIP CARDS — hover desktop / tap mobile
   ============================================================ */
function initFlipCards() {
    const isTouchDevice = () =>
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const cards = document.querySelectorAll('.service-card-flip');

    cards.forEach(card => {
        if (isTouchDevice()) {
            card.addEventListener('click', () => {
                // Toggle the card; close siblings
                const isFlipped = card.classList.contains('flipped');
                cards.forEach(c => c.classList.remove('flipped'));
                if (!isFlipped) card.classList.add('flipped');
            });
        }
        // Desktop flip is handled purely by CSS hover
    });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
    const counterEls = document.querySelectorAll('[data-counter]');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.counter, 10);
                const suffix = el.dataset.suffix || '';
                const prefix = el.dataset.prefix || '';
                animateCounter(el, target, suffix, prefix);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
}

function animateCounter(el, target, suffix = '', prefix = '', duration = 2000) {
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
        }
    };

    requestAnimationFrame(update);
}

/* ============================================================
   RESERVATION FORM → GOOGLE CALENDAR (GAS BRIDGE)
   ============================================================ */
// URL de tu implementación de Google Apps Script (Sustituir después de desplegar)
const GAS_URL = 'https://script.google.com/macros/s/AKfycbx83_277jQi2ZNx8VjLaE4HvM_XfGuZYBvLO5GbnKotKdE_3CSDM5g9B7a9GVYwe-YC/exec'; 

// Festivos Colombia 2024-2027 (Ley Emiliani aplicada)
const COLOMBIAN_HOLIDAYS = [
    // 2024
    '2024-01-01', '2024-01-08', '2024-03-25', '2024-03-28', '2024-03-29', '2024-05-01', '2024-05-13', '2024-06-03', '2024-06-10', '2024-07-01', '2024-07-20', '2024-08-07', '2024-08-19', '2024-10-14', '2024-11-04', '2024-11-11', '2024-12-08', '2024-12-25',
    // 2025
    '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18', '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-20', '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17', '2025-12-08', '2025-12-25',
    // 2026
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
    // 2027
    '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26', '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-06-28', '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25'
];

function initReservationForm() {
    const form = document.getElementById('reservaForm');
    const submitBtn = document.getElementById('submitReserva');
    const submitText = document.getElementById('submitText');
    const spinner = document.getElementById('submitSpinner');
    const dateInput = document.getElementById('reservaFecha');
    const timeSelect = document.getElementById('reservaHora');
    
    if (!form) return;

    // Set minimum date to today
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Real-time validation on blur
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) validateField(input);
        });
    });

    // Check availability when date or time changes
    [dateInput, timeSelect].forEach(input => {
        if (input) {
            input.addEventListener('change', async () => {
                const fecha = dateInput.value;
                const hora = timeSelect.value;
                if (fecha && hora) {
                    await checkSlotAvailability(fecha, hora);
                }
            });
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Full form validation
        const valid = validateForm(form);
        if (!valid) return;

        const payload = {
            nombre: document.getElementById('reservaNombre').value.trim(),
            telefono: document.getElementById('reservaTelefono').value.trim(),
            email: document.getElementById('reservaEmail').value.trim(),
            fecha: document.getElementById('reservaFecha').value,
            hora: document.getElementById('reservaHora').value,
            personas: document.getElementById('reservaPersonas').value,
            ocasion: document.getElementById('reservaOcasion').value || 'Ninguna',
            mensaje: document.getElementById('reservaMensaje').value.trim() || '',
            restaurante: '787 Gastronomía Puertorriqueña'
        };

        // Final availability check before submitting
        setLoading(true, submitBtn, submitText, spinner);
        submitText.textContent = 'Verificando...';

        try {
            const isAvailable = await checkSlotAvailability(payload.fecha, payload.hora);
            if (!isAvailable) {
                setLoading(false, submitBtn, submitText, spinner);
                submitText.textContent = 'Reservar Mesa';
                return;
            }

            submitText.textContent = 'Procesando...';
            
            const response = await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors', // Necesario para GAS Apps Script
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // En modo no-cors no podemos leer la respuesta, pero si no hay error de red, asumimos éxito
            showConfirmModal(payload);
            form.reset();
            form.querySelectorAll('.form-input').forEach(inp => inp.classList.remove('input-valid', 'input-error'));
            
        } catch (err) {
            console.error('Reservation error:', err);
            showToast('error', '❌', 'Error al conectar con el sistema. Inténtalo de nuevo.');
        } finally {
            setLoading(false, submitBtn, submitText, spinner);
            submitText.textContent = 'Reservar Mesa';
        }
    });
}

/** 
 * Checks if a slot is busy in Google Calendar via GAS bridge
 */
async function checkSlotAvailability(fecha, hora) {
    const errorHora = document.getElementById('errorHora');
    const timeSelect = document.getElementById('reservaHora');
    
    if (GAS_URL === 'URL_DE_TU_SCRIPT_AQUI') return true; // Debug simple

    try {
        const response = await fetch(`${GAS_URL}?fecha=${fecha}&hora=${hora}`);
        const data = await response.json();
        
        if (!data.available) {
            if (errorHora) {
                errorHora.textContent = '⚠️ Este horario ya está reservado. Por favor elige otro.';
                errorHora.classList.add('visible');
            }
            timeSelect.classList.add('input-error');
            showToast('warning', '📅', 'El horario seleccionado ya no está disponible.');
            return false;
        } else {
            if (errorHora && errorHora.textContent.includes('ya está reservado')) {
                errorHora.textContent = '';
                errorHora.classList.remove('visible');
            }
            timeSelect.classList.remove('input-error');
            return true;
        }
    } catch (err) {
        console.warn('Could not verify availability:', err);
        return true; // Si falla la red, permitimos intentar el registro
    }
}


/** Toggle loading state on the submit button */
function setLoading(isLoading, btn, textEl, spinnerEl) {
    btn.disabled = isLoading;
    textEl.style.display = isLoading ? 'none' : 'inline';
    spinnerEl.style.display = isLoading ? 'inline-block' : 'none';
}

/** Validate a single field; returns true if valid */
function validateField(input) {
    const id = input.id;
    const val = input.value.trim();
    const errEl = document.getElementById('error' + id.replace('reserva', '').replace(/^\w/, c => c.toUpperCase()));
    let msg = '';

    if (input.required && !val) {
        msg = 'Este campo es obligatorio.';
    } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = 'Ingresa un correo electrónico válido.';
    } else if (input.type === 'tel' && val) {
        const digits = val.replace(/\D/g, '');
        if (digits.length !== 10 && digits.length !== 12) {
            msg = 'El número de teléfono debe tener 10 o 12 dígitos.';
        }
    } else if (input.type === 'date' && val) {
        const selectedDate = new Date(val + 'T00:00:00');
        const dayOfWeek = selectedDate.getDay(); // 0: Dom, 1: Lun...
        const today = new Date(); today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            msg = 'La fecha no puede ser en el pasado.';
        } else if (dayOfWeek === 1 && !COLOMBIAN_HOLIDAYS.includes(val)) {
            msg = 'Los lunes no abrimos (excepto si es festivo).';
            // Mostrar pop-up como solicitó el usuario
            showToast('warning', '📅', 'Este día no es válido para reservar. Los lunes solo abrimos si es festivo.');
        }
    }

    if (errEl) {
        errEl.textContent = msg;
        errEl.classList.toggle('visible', !!msg);
    }
    input.classList.toggle('input-error', !!msg);
    input.classList.toggle('input-valid', !msg && !!val);
    return !msg;
}

/** Run validateField on every required input; returns true if all pass */
function validateForm(form) {
    let allValid = true;
    form.querySelectorAll('.form-input').forEach(input => {
        if (input.required || input.value.trim()) {
            if (!validateField(input)) allValid = false;
        }
    });
    return allValid;
}

/** Show a toast notification */
function showToast(type, icon, message, durationMs = 5000) {
    const toast = document.getElementById('toast');
    const iconEl = document.getElementById('toastIcon');
    const msgEl = document.getElementById('toastMsg');
    if (!toast) return;

    toast.className = `toast toast-${type} toast-show`;
    iconEl.textContent = icon;
    msgEl.textContent = message;

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('toast-show');
    }, durationMs);
}

/* ============================================================
   CONFIRMATION MODAL
   ============================================================ */

/** Open the modal and fill in the reservation summary */
function showConfirmModal(data) {
    const overlay = document.getElementById('confirmModal');
    if (!overlay) return;

    // Populate summary fields
    setText('mNombre', data.nombre);
    setText('mFecha', formatDate(data.fecha));
    setText('mHora', formatHora(data.hora));
    setText('mPersonas', data.personas + ' persona' + (data.personas === '1' ? '' : 's'));
    setText('mTelefono', data.telefono);

    // Ocasión — hide row if empty/Ninguna
    const ocasionRow = document.getElementById('mOcasionRow');
    if (data.ocasion && data.ocasion !== 'Ninguna') {
        setText('mOcasion', data.ocasion);
        if (ocasionRow) ocasionRow.style.display = '';
    } else {
        if (ocasionRow) ocasionRow.style.display = 'none';
    }

    // Show modal
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    setTimeout(() => {
        const closeBtn = document.getElementById('modalClose');
        if (closeBtn) closeBtn.focus();
    }, 400);
}

/** Close the confirmation modal */
function hideConfirmModal() {
    const overlay = document.getElementById('confirmModal');
    if (!overlay) return;
    overlay.classList.remove('modal-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

/** Wire up close triggers */
function initConfirmModal() {
    const overlay = document.getElementById('confirmModal');
    const closeBtn = document.getElementById('modalClose');
    const closePrimary = document.getElementById('modalCloseBtn');
    if (!overlay) return;

    // Close button (×)
    if (closeBtn) closeBtn.addEventListener('click', hideConfirmModal);
    // Primary CTA button
    if (closePrimary) closePrimary.addEventListener('click', hideConfirmModal);

    // Click on backdrop (outside modal-box)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideConfirmModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('modal-open')) {
            hideConfirmModal();
        }
    });
}

/** Helper: set text content safely */
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '—';
}

/** Format ISO date string → DD/MM/YYYY */
function formatDate(isoDate) {
    if (!isoDate) return '—';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
}

/** Format 24h time → 12h AM/PM */
function formatHora(hora) {
    if (!hora) return '—';
    const [h, m] = hora.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/* ============================================================
   HERO 3D DISH SLIDER
   ============================================================ */
function initDishCarousel() {
    const cards   = Array.from(document.querySelectorAll('.slider-card'));
    const dots    = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const viewport = document.getElementById('sliderViewport');
    if (!cards.length) return;

    const total    = cards.length;
    let   current  = 0;
    let   autoTimer = null;
    const INTERVAL  = 3500;

    /* ── Layout constants ── */
    const SIDE_ROTATE_Y = 45;
    const SIDE_SCALE    = 0.80;
    const SIDE_OFFSET   = 48;
    const FAR_SCALE     = 0.65;
    const FAR_OFFSET    = 110;
    const TILT_MAX      = 8; // max tilt degrees

    /* ─────────────────────────────────────────────
       OPTIMIZATION 1 — IMAGE PRELOADER
       Avoids layout jumps and broken 3D on first paint.
       Uses native Image() + Promise.all — no external lib.
    ───────────────────────────────────────────── */
    function preloadImages() {
        if (viewport) viewport.classList.add('is-loading');

        const imgEls = cards
            .map(c => c.querySelector('.slider-card__img'))
            .filter(Boolean);

        const promises = imgEls.map(img => {
            // Already in cache — resolve immediately, no flash
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise(resolve => {
                const loader = new Image();
                loader.src     = img.src;
                loader.onload  = resolve;
                loader.onerror = resolve; // fail gracefully — never block the UI
            });
        });

        return Promise.all(promises).then(() => {
            if (viewport) viewport.classList.remove('is-loading');
        });
    }

    /* ─────────────────────────────────────────────
       OPTIMIZATION 2 — 3D TILT with toFixed(2)
       Writing values like "7.834729374deg" to the DOM on every
       mousemove frame forces the browser to parse a 16-char string.
       toFixed(2) → "7.83deg" (7 chars) — ~56% shorter string,
       measurably faster style recalc on lower-end devices.
    ───────────────────────────────────────────── */
    let tiltRafId   = null;
    let pendingTX   = 0;
    let pendingTY   = 0;

    function flushTilt() {
        const inner = cards[current]?.querySelector('.slider-card__inner');
        if (inner) {
            // toFixed(2) is the key micro-optimization
            inner.style.setProperty('--tilt-x', pendingTX.toFixed(2) + 'deg');
            inner.style.setProperty('--tilt-y', pendingTY.toFixed(2) + 'deg');
        }
        tiltRafId = null;
    }

    function clearTilt(cardIndex) {
        const inner = cards[cardIndex]?.querySelector('.slider-card__inner');
        if (inner) {
            inner.style.setProperty('--tilt-x', '0.00deg');
            inner.style.setProperty('--tilt-y', '0.00deg');
        }
    }

    if (viewport) {
        viewport.addEventListener('mousemove', (e) => {
            const r  = viewport.getBoundingClientRect();
            const nx = (e.clientX - r.left)  / r.width  - 0.5; // -0.5 → 0.5
            const ny = (e.clientY - r.top)   / r.height - 0.5;
            pendingTX = ny * -TILT_MAX; // pitch
            pendingTY = nx *  TILT_MAX; // yaw
            // Schedule one RAF — skip frames automatically
            if (!tiltRafId) tiltRafId = requestAnimationFrame(flushTilt);
        }, { passive: true });

        viewport.addEventListener('mouseleave', () => {
            if (tiltRafId) { cancelAnimationFrame(tiltRafId); tiltRafId = null; }
            clearTilt(current);
        }, { passive: true });
    }

    function applyPositions() {
        cards.forEach((card, i) => {
            const wrap = ((i - current) + total) % total;
            const half = Math.floor(total / 2);
            const norm = wrap > half ? wrap - total : wrap;

            let tx, ry, sc, op, zi;

            if (norm === 0) {
                tx = -50; ry = 0; sc = 1; op = 1; zi = 10;
            } else if (norm === -1) {
                tx = -(50 + SIDE_OFFSET); ry =  SIDE_ROTATE_Y; sc = SIDE_SCALE; op = 0.5; zi = 8;
            } else if (norm === 1) {
                tx = -(50 - SIDE_OFFSET); ry = -SIDE_ROTATE_Y; sc = SIDE_SCALE; op = 0.5; zi = 8;
            } else if (norm === -2) {
                tx = -(50 + FAR_OFFSET); ry = SIDE_ROTATE_Y; sc = FAR_SCALE; op = 0.15; zi = 6;
            } else if (norm === 2) {
                tx = -(50 - FAR_OFFSET); ry = -SIDE_ROTATE_Y; sc = FAR_SCALE; op = 0.15; zi = 6;
            } else {
                tx = norm < 0 ? -(50 + (FAR_OFFSET * 1.5)) : -(50 - (FAR_OFFSET * 1.5));
                ry = norm < 0 ?  SIDE_ROTATE_Y     : -SIDE_ROTATE_Y;
                sc = FAR_SCALE * 0.8; op = 0; zi = 1;
            }

            card.style.transform = `translateX(${tx}%) rotateY(${ry}deg) scale(${sc})`;
            card.style.opacity   = op;
            card.style.zIndex    = zi;
            card.classList.toggle('is-active', norm === 0);

            // Reset tilt vars on card change to avoid stale tilt on incoming card
            clearTilt(i);
        });

        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function goTo(index) {
        current = ((index % total) + total) % total;
        applyPositions();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() { stopAuto(); autoTimer = setInterval(next, INTERVAL); }
    function stopAuto()  { if (autoTimer) clearInterval(autoTimer); }

    // Arrows
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

    // Dots
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

    // Side-card click → navigate
    cards.forEach((card, i) => card.addEventListener('click', () => {
        if (i !== current) { goTo(i); startAuto(); }
    }));

    // Touch swipe
    let touchStartX = 0;
    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX; stopAuto();
        }, { passive: true });
        viewport.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
            startAuto();
        }, { passive: true });
    }

    /* ── Boot: preload → render → autoplay ── */
    preloadImages().then(() => {
        applyPositions();
        startAuto();
    });
}



/* ============================================================
   UTILITIES
   ============================================================ */
function debounce(fn, wait) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
}

/* ============================================================
   STATUS BADGE (Open / Closed Logic - Colombia)
   ============================================================ */
function initStatusBadge() {
    const badge = document.getElementById('statusBadge');
    if (!badge) return;

    function checkStatus() {
        // Get Colombia local time (UTC-5)
        const bogotaDateStr = new Date().toLocaleString("en-US", {timeZone: "America/Bogota"});
        const bogotaDate = new Date(bogotaDateStr);
        
        const day = bogotaDate.getDay(); // 0: Sun, 1: Mon...
        const hour = bogotaDate.getHours();
        
        // Format to YYYY-MM-DD for matching COLOMBIAN_HOLIDAYS
        const y = bogotaDate.getFullYear();
        const m = String(bogotaDate.getMonth() + 1).padStart(2, '0');
        const d = String(bogotaDate.getDate()).padStart(2, '0');
        const dateKey = `${y}-${m}-${d}`;
        
        const isHoliday = COLOMBIAN_HOLIDAYS.includes(dateKey);
        
        let isOpen = true;

        // Rule: Closed on Mondays unless it's a Holiday Monday
        if (day === 1 && !isHoliday) {
            isOpen = false;
        }

        // Rule: Open Hours (8 AM - 10 PM)
        if (hour < 8 || hour >= 22) {
            isOpen = false;
        }

        // Update UI
        if (isOpen) {
            badge.classList.remove('is-hidden');
        } else {
            badge.classList.add('is-hidden');
        }
    }

    // Initial check
    checkStatus();

    // Check every minute
    setInterval(checkStatus, 60000);
}
