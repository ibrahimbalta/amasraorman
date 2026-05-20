/* ==========================================================================
   Amasra Orman Ürünleri - Interactive & Dynamic Rendering JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data from local database (db.js)
    const db = getDB();

    // 2. Render Page Elements dynamically from DB
    const renderPage = () => {
        // --- HERO SECTION ---
        const heroBg = document.getElementById('heroBg');
        const heroBadge = document.getElementById('heroBadge');
        const heroTitle = document.getElementById('heroTitle');
        const heroDesc = document.getElementById('heroDesc');
        const heroWhatsAppBtn = document.getElementById('heroWhatsAppBtn');
        const heroSecondaryBtn = document.getElementById('heroSecondaryBtn');

        if (heroBg) heroBg.style.backgroundImage = `url('${db.hero.bg_image}')`;
        if (heroBadge) heroBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${db.hero.badge}`;
        if (heroTitle) heroTitle.innerHTML = db.hero.title;
        if (heroDesc) heroDesc.textContent = db.hero.description;
        if (heroSecondaryBtn) heroSecondaryBtn.textContent = db.hero.btn_secondary_text;

        // Custom phone & email mapping everywhere
        const phoneClean = db.contact.phone.replace(/\s+/g, '');
        const whatsappUrl = `https://wa.me/90${phoneClean}?text=${encodeURIComponent(db.hero.whatsapp_text)}`;

        const waBtns = [
            document.getElementById('navWhatsAppBtn'),
            document.getElementById('heroWhatsAppBtn'),
            document.getElementById('ctaWhatsAppBtn'),
            document.getElementById('floatWhatsAppBtn')
        ];
        waBtns.forEach(btn => {
            if (btn) btn.href = whatsappUrl;
        });

        const phoneLinks = [
            document.getElementById('navPhoneLink'),
            document.getElementById('whyPhoneLink'),
            document.getElementById('contactPhone'),
            document.getElementById('ctaPhoneLink'),
            document.getElementById('footerPhone')
        ];
        phoneLinks.forEach(link => {
            if (link) {
                link.href = `tel:${phoneClean}`;
                link.textContent = db.contact.phone;
            }
        });

        const emailLinks = [
            document.getElementById('contactEmail'),
            document.getElementById('footerEmail')
        ];
        emailLinks.forEach(link => {
            if (link) {
                link.href = `mailto:${db.contact.email}`;
                link.textContent = db.contact.email;
            }
        });

        // --- ABOUT SECTION ---
        const aboutSubtitle = document.getElementById('aboutSubtitle');
        const aboutTitle = document.getElementById('aboutTitle');
        const aboutDesc1 = document.getElementById('aboutDesc1');
        const aboutDesc2 = document.getElementById('aboutDesc2');
        const aboutYears = document.getElementById('aboutYears');
        const aboutExpText = document.getElementById('aboutExpText');
        const aboutImage = document.getElementById('aboutImage');

        if (aboutSubtitle) aboutSubtitle.textContent = db.about.subtitle;
        if (aboutTitle) aboutTitle.textContent = db.about.title;
        if (aboutDesc1) aboutDesc1.textContent = db.about.desc1;
        if (aboutDesc2) aboutDesc2.textContent = db.about.desc2;
        if (aboutYears) aboutYears.textContent = db.about.experience_years;
        if (aboutExpText) aboutExpText.textContent = db.about.experience_text;
        if (aboutImage) aboutImage.src = db.about.image;

        // Features under About us
        const featuresContainer = document.getElementById('aboutFeaturesContainer');
        if (featuresContainer) {
            featuresContainer.innerHTML = '';
            db.about.features.forEach((feat, index) => {
                const icon = index === 0 ? 'fa-signature' : 'fa-hand-holding-dollar';
                const fBox = document.createElement('div');
                fBox.className = 'feature-box';
                fBox.innerHTML = `
                    <div class="feature-box-icon"><i class="fa-solid ${icon}"></i></div>
                    <div>
                        <h4 class="feature-box-title">${feat.title}</h4>
                        <p class="feature-box-desc">${feat.desc}</p>
                    </div>
                `;
                featuresContainer.appendChild(fBox);
            });
        }

        // --- SERVICES GRID ---
        const servicesGrid = document.getElementById('servicesGrid');
        if (servicesGrid) {
            servicesGrid.innerHTML = '';
            db.services.forEach(serv => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-img">
                        <img src="${serv.image}" alt="${serv.title}">
                        <div class="service-icon-badge"><i class="fa-solid ${serv.icon}"></i></div>
                    </div>
                    <div class="service-info">
                        <h3 class="service-title">${serv.title}</h3>
                        <p class="service-desc">${serv.desc}</p>
                        <a href="#contact" class="service-link">Bilgi Al <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                `;
                servicesGrid.appendChild(card);
            });
        }

        // --- GALLERY GRID (Yeni) ---
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '';
            db.gallery.forEach(item => {
                const gItem = document.createElement('div');
                gItem.className = 'gallery-item';
                gItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="gallery-overlay">
                        <div class="gallery-tag">Bartın / Kesim Sahası</div>
                        <div class="gallery-title">${item.title}</div>
                    </div>
                `;
                galleryGrid.appendChild(gItem);

                // Lightbox click integration
                gItem.addEventListener('click', () => {
                    openLightbox(item.image, item.title);
                });
            });
        }

        // --- PROCESS TIMELINE ---
        const processSubtitle = document.getElementById('processSubtitle');
        const processTitle = document.getElementById('processTitle');
        const processDesc = document.getElementById('processDesc');
        const processTimeline = document.getElementById('processTimeline');

        if (processSubtitle) processSubtitle.textContent = db.process.subtitle;
        if (processTitle) processTitle.textContent = db.process.title;
        if (processDesc) processDesc.textContent = db.process.desc;

        if (processTimeline) {
            processTimeline.innerHTML = '';
            db.process.steps.forEach(step => {
                const sStep = document.createElement('div');
                sStep.className = 'process-step';
                sStep.innerHTML = `
                    <div class="process-node">${step.number}</div>
                    <div class="process-card">
                        <div class="process-card-icon"><i class="fa-solid ${step.icon}"></i></div>
                        <h3 class="process-card-title">${step.title}</h3>
                        <p class="process-card-desc">${step.desc}</p>
                    </div>
                `;
                processTimeline.appendChild(sStep);
            });
        }

        // --- WHY CHOOSE US ---
        const whySubtitle = document.getElementById('whySubtitle');
        const whyTitle = document.getElementById('whyTitle');
        const whyDesc = document.getElementById('whyDesc');
        const whyFeaturesGrid = document.getElementById('whyFeaturesGrid');

        if (whySubtitle) whySubtitle.textContent = db.why_choose.subtitle;
        if (whyTitle) whyTitle.textContent = db.why_choose.title;
        if (whyDesc) whyDesc.textContent = db.why_choose.desc;

        if (whyFeaturesGrid) {
            whyFeaturesGrid.innerHTML = '';
            db.why_choose.cards.forEach(card => {
                const cBox = document.createElement('div');
                cBox.className = 'why-card';
                cBox.innerHTML = `
                    <div class="why-icon"><i class="fa-solid ${card.icon}"></i></div>
                    <h3 class="why-title">${card.title}</h3>
                    <p class="why-desc">${card.desc}</p>
                `;
                whyFeaturesGrid.appendChild(cBox);
            });
        }

        // --- TESTIMONIALS SLIDER ---
        const testimonialsSlider = document.getElementById('testimonialsSlider');
        if (testimonialsSlider) {
            testimonialsSlider.innerHTML = '';
            db.testimonials.forEach(rev => {
                // Get name initials for avatar
                const initials = rev.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                
                const item = document.createElement('div');
                item.className = 'testimonial-item';
                item.innerHTML = `
                    <i class="fa-solid fa-quote-right quote-icon"></i>
                    <div class="stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(rev.stars)}
                        ${'<i class="fa-regular fa-star"></i>'.repeat(5 - rev.stars)}
                    </div>
                    <p class="testimonial-text">"${rev.text}"</p>
                    <div class="client-info">
                        <div class="client-img">${initials}</div>
                        <div>
                            <div class="client-name">${rev.name}</div>
                            <div class="client-role">${rev.role}</div>
                        </div>
                    </div>
                `;
                testimonialsSlider.appendChild(item);
            });
        }

        // --- CONTACT INFO & MAP ---
        const contactAddress = document.getElementById('contactAddress');
        const footerAddress = document.getElementById('footerAddress');
        const contactMap = document.getElementById('contactMap');

        if (contactAddress) contactAddress.textContent = db.contact.address;
        if (footerAddress) footerAddress.textContent = db.contact.address;
        if (contactMap) contactMap.src = db.contact.map_embed;

        // CTA and Footer Background sync
        const ctaBannerBg = document.getElementById('ctaBannerBg');
        if (ctaBannerBg) ctaBannerBg.style.backgroundImage = `url('${db.hero.bg_image}')`;
    };

    // 3. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    const openLightbox = (src, caption) => {
        if (lightbox && lightboxImg && lightboxCaption) {
            lightboxImg.src = src;
            lightboxCaption.textContent = caption;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // lock scroll
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // unlock scroll
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // 4. Sticky Header Functionality
    const header = document.querySelector('.header');
    const scrollThreshold = 100;

    const handleScroll = () => {
        if (header) {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 5. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        mobileToggle.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // 6. Contact Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !phone || !message) {
                showStatus('Lütfen tüm zorunlu alanları doldurun.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                contactForm.reset();
                showStatus('Keşif talebiniz başarıyla iletildi. En kısa sürede dönüş sağlayacağız.', 'success');
            }, 1500);
        });
    }

    const showStatus = (msg, type) => {
        if (formStatus) {
            formStatus.textContent = msg;
            formStatus.className = 'form-status'; 
            if (type === 'success') {
                formStatus.classList.add('success');
                formStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                formStatus.style.color = '#10B981';
                formStatus.style.border = '1px solid rgba(16, 185, 129, 0.2)';
            } else {
                formStatus.classList.add('error');
                formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                formStatus.style.color = '#EF4444';
                formStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
            }
            formStatus.style.display = 'block';

            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    };

    // 7. Active Navigation Link highlighting on scroll
    const updateActiveLink = () => {
        let scrollPos = window.scrollY + 150;
        const pageSections = document.querySelectorAll('section, header');

        pageSections.forEach(section => {
            if (section.id) {
                const top = section.offsetTop;
                const height = section.offsetHeight;

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active-link');
                        if (link.getAttribute('href') === `#${section.id}`) {
                            link.classList.add('active-link');
                            link.style.color = '#D4AF37';
                        } else {
                            link.style.color = '';
                        }
                    });
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);

    // Initial page load rendering
    renderPage();
});
