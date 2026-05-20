/* ==========================================================================
   Amasra Orman Ürünleri - Admin Controller Logic (admin.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Session Auth Check
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLogin = document.getElementById('adminLogin');
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginErrorMsg');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    const checkAuth = () => {
        const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
        if (isLoggedIn) {
            adminDashboard.style.display = 'block';
            adminLogin.style.display = 'none';
        } else {
            adminDashboard.style.display = 'none';
            adminLogin.style.display = 'flex';
        }
    };

    // Bind login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameVal = document.getElementById('login-username').value.trim();
            const passwordVal = document.getElementById('login-password').value.trim();

            if (usernameVal === 'kmelemez' && passwordVal === '7467') {
                sessionStorage.setItem('admin_logged_in', 'true');
                loginError.style.display = 'none';
                checkAuth();
                showToast('Yönetim paneline başarıyla giriş yapıldı.');
            } else {
                loginError.style.display = 'flex';
                // Shake card animation
                const card = document.querySelector('.admin-login-card');
                if (card) {
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'shake 0.3s ease';
                }
            }
        });
    }

    // Bind logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('admin_logged_in');
            window.location.reload();
        });
    }

    // Mobile Hamburger Menu for Admin Dashboard
    const adminMobileToggle = document.getElementById('adminMobileToggle');
    const adminSidebar = document.querySelector('.admin-sidebar');

    if (adminMobileToggle && adminSidebar) {
        const toggleAdminSidebar = () => {
            adminSidebar.classList.toggle('active');
            const icon = adminMobileToggle.querySelector('i');
            if (adminSidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        adminMobileToggle.addEventListener('click', toggleAdminSidebar);

        // Auto close sidebar when an item is selected on mobile screens
        const adminMenuBtns = document.querySelectorAll('.admin-menu-btn');
        adminMenuBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth < 992 && adminSidebar.classList.contains('active')) {
                    toggleAdminSidebar();
                }
            });
        });
    }

    // Run initial auth check
    checkAuth();

    // Get database state
    const db = getDB();

    // 1. Toast Notification Helper
    const toast = document.getElementById('adminToast');
    const toastMsg = document.getElementById('adminToastMsg');

    const showToast = (msg, success = true) => {
        toastMsg.textContent = msg;
        const icon = toast.querySelector('i');
        if (success) {
            icon.className = 'fa-solid fa-circle-check';
            icon.style.color = '#D4AF37'; // gold
            toast.style.borderLeftColor = '#D4AF37';
        } else {
            icon.className = 'fa-solid fa-triangle-exclamation';
            icon.style.color = '#EF4444'; // red
            toast.style.borderLeftColor = '#EF4444';
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // 2. Tab Navigation
    const menuButtons = document.querySelectorAll('.admin-menu-btn');
    const sections = document.querySelectorAll('.admin-section');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            menuButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Helper: Compress a base64 string if it's a large image, returns same string if it's a URL or already small
    const compressBase64Image = (src, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => {
        return new Promise((resolve) => {
            if (!src || !src.startsWith('data:image/')) {
                resolve(src);
                return;
            }
            // If it's already very small (e.g. less than 150KB), don't waste time re-compressing
            if (src.length < 200000) {
                resolve(src);
                return;
            }

            const img = new Image();
            img.src = src;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const format = src.includes('image/png') ? 'image/png' : 'image/jpeg';
                const dataUrl = canvas.toDataURL(format, quality);
                resolve(dataUrl);
            };
            img.onerror = () => resolve(src);
        });
    };

    // Clean up any pre-existing large base64 images inside db to free up space immediately
    const cleanDatabaseImages = async () => {
        try {
            let modified = false;
            
            // 1. Hero bg_image
            if (db.hero && db.hero.bg_image && db.hero.bg_image.startsWith('data:image/') && db.hero.bg_image.length > 200000) {
                db.hero.bg_image = await compressBase64Image(db.hero.bg_image);
                modified = true;
            }
            
            // 2. About image
            if (db.about && db.about.image && db.about.image.startsWith('data:image/') && db.about.image.length > 200000) {
                db.about.image = await compressBase64Image(db.about.image);
                modified = true;
            }
            
            // 3. Services images
            if (db.services && Array.isArray(db.services)) {
                for (let i = 0; i < db.services.length; i++) {
                    const s = db.services[i];
                    if (s && s.image && s.image.startsWith('data:image/') && s.image.length > 200000) {
                        s.image = await compressBase64Image(s.image);
                        modified = true;
                    }
                }
            }
            
            // 4. Gallery images
            if (db.gallery && Array.isArray(db.gallery)) {
                for (let i = 0; i < db.gallery.length; i++) {
                    const item = db.gallery[i];
                    if (item && item.image && item.image.startsWith('data:image/') && item.image.length > 200000) {
                        item.image = await compressBase64Image(item.image);
                        modified = true;
                    }
                }
            }
            
            if (modified) {
                console.log('Database images cleaned & compressed successfully.');
                saveDB(db);
            }
        } catch (e) {
            console.error('Failed to clean database images:', e);
        }
    };

    // Helper: Convert File to compressed Base64 String using Canvas
    const fileToBase64 = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                    const dataUrl = canvas.toDataURL(format, quality);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    // 3. Load & Save HERO SECTION
    const initHero = () => {
        document.getElementById('inp-heroBadge').value = db.hero.badge;
        document.getElementById('inp-heroSecondary').value = db.hero.btn_secondary_text;
        document.getElementById('inp-heroTitle').value = db.hero.title;
        document.getElementById('inp-heroDesc').value = db.hero.description;
        document.getElementById('inp-heroWhatsApp').value = db.hero.whatsapp_text;
        document.getElementById('prev-heroBg').src = db.hero.bg_image;

        // Image upload preview trigger
        const fileInput = document.getElementById('inp-heroBgFile');
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                try {
                    const base64 = await fileToBase64(file);
                    document.getElementById('prev-heroBg').src = base64;
                } catch (err) {
                    showToast('Görsel okunamadı!', false);
                }
            }
        });

        // Form submission
        document.getElementById('heroForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            db.hero.badge = document.getElementById('inp-heroBadge').value.trim();
            db.hero.btn_secondary_text = document.getElementById('inp-heroSecondary').value.trim();
            db.hero.title = document.getElementById('inp-heroTitle').value.trim();
            db.hero.description = document.getElementById('inp-heroDesc').value.trim();
            db.hero.whatsapp_text = document.getElementById('inp-heroWhatsApp').value.trim();
            
            let bgImgSrc = document.getElementById('prev-heroBg').src;
            if (bgImgSrc.startsWith('data:image/')) {
                bgImgSrc = await compressBase64Image(bgImgSrc);
            }
            db.hero.bg_image = bgImgSrc;

            saveDB(db);
            showToast('Ana Sayfa (Hero) bilgileri başarıyla güncellendi.');
        });
    };

    // 4. Load & Save ABOUT SECTION
    const initAbout = () => {
        document.getElementById('inp-aboutSubtitle').value = db.about.subtitle;
        document.getElementById('inp-aboutTitle').value = db.about.title;
        document.getElementById('inp-aboutDesc1').value = db.about.desc1;
        document.getElementById('inp-aboutDesc2').value = db.about.desc2;
        document.getElementById('inp-aboutYears').value = db.about.experience_years;
        document.getElementById('inp-aboutExpText').value = db.about.experience_text;
        document.getElementById('prev-aboutImg').src = db.about.image;

        // Load 2 sub features
        document.getElementById('inp-aboutFeat1Title').value = db.about.features[0].title;
        document.getElementById('inp-aboutFeat1Desc').value = db.about.features[0].desc;
        document.getElementById('inp-aboutFeat2Title').value = db.about.features[1].title;
        document.getElementById('inp-aboutFeat2Desc').value = db.about.features[1].desc;

        // Image preview
        const fileInput = document.getElementById('inp-aboutImageFile');
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                try {
                    const base64 = await fileToBase64(file);
                    document.getElementById('prev-aboutImg').src = base64;
                } catch (err) {
                    showToast('Görsel yükleme hatası!', false);
                }
            }
        });

        // Form submission
        document.getElementById('aboutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            db.about.subtitle = document.getElementById('inp-aboutSubtitle').value.trim();
            db.about.title = document.getElementById('inp-aboutTitle').value.trim();
            db.about.desc1 = document.getElementById('inp-aboutDesc1').value.trim();
            db.about.desc2 = document.getElementById('inp-aboutDesc2').value.trim();
            db.about.experience_years = document.getElementById('inp-aboutYears').value.trim();
            db.about.experience_text = document.getElementById('inp-aboutExpText').value.trim();
            
            let aboutImgSrc = document.getElementById('prev-aboutImg').src;
            if (aboutImgSrc.startsWith('data:image/')) {
                aboutImgSrc = await compressBase64Image(aboutImgSrc);
            }
            db.about.image = aboutImgSrc;

            // Features update
            db.about.features[0].title = document.getElementById('inp-aboutFeat1Title').value.trim();
            db.about.features[0].desc = document.getElementById('inp-aboutFeat1Desc').value.trim();
            db.about.features[1].title = document.getElementById('inp-aboutFeat2Title').value.trim();
            db.about.features[1].desc = document.getElementById('inp-aboutFeat2Desc').value.trim();

            saveDB(db);
            showToast('Hakkımızda bilgileri başarıyla güncellendi.');
        });
    };

    // 5. Load & Save SERVICES SECTION
    const initServices = () => {
        const container = document.getElementById('servicesFormContainer');
        container.innerHTML = ''; // reset

        db.services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.style.backgroundColor = 'var(--bg-light)';
            card.style.borderColor = 'rgba(13,44,29,0.08)';

            card.innerHTML = `
                <h3 style="margin-bottom: 20px; font-size: 1.15rem; color: var(--primary-deep); display: flex; align-items: center; justify-content: space-between;">
                    <span>Hizmet #${index + 1}: ${service.title}</span>
                    <i class="fa-solid ${service.icon}" style="color: var(--accent);"></i>
                </h3>
                <div class="admin-grid-2">
                    <div>
                        <div class="admin-form-group">
                            <label class="admin-form-label">Hizmet Başlığı</label>
                            <input type="text" class="admin-form-input val-title" value="${service.title}" required>
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-form-label">Hizmet Açıklaması</label>
                            <textarea class="admin-form-input val-desc" required>${service.desc}</textarea>
                        </div>
                    </div>
                    <div>
                        <div class="admin-form-group">
                            <label class="admin-form-label">Görsel Seç (Yükle)</label>
                            <input type="file" class="admin-form-input val-file" accept="image/*">
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-form-label">Görsel Önizleme</label>
                            <div class="admin-img-preview" style="height: 100px;">
                                <img class="val-prev-img" src="${service.image}" alt="${service.title}">
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-primary btn-save-service" data-id="${service.id}" style="padding: 10px 20px; font-size: 0.9rem;">
                    <i class="fa-solid fa-save"></i> Bu Hizmeti Kaydet
                </button>
            `;

            container.appendChild(card);

            // Bind image upload logic
            const fileInput = card.querySelector('.val-file');
            const prevImg = card.querySelector('.val-prev-img');
            fileInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    try {
                        const base64 = await fileToBase64(e.target.files[0]);
                        prevImg.src = base64;
                    } catch (err) {
                        showToast('Görsel yüklenemedi!', false);
                    }
                }
            });

            // Bind save service click
            const saveBtn = card.querySelector('.btn-save-service');
            saveBtn.addEventListener('click', async () => {
                const sId = parseInt(saveBtn.getAttribute('data-id'));
                const titleVal = card.querySelector('.val-title').value.trim();
                const descVal = card.querySelector('.val-desc').value.trim();
                let imageVal = prevImg.src;

                if (!titleVal || !descVal) {
                    showToast('Lütfen tüm alanları doldurun!', false);
                    return;
                }

                // Compress imageVal if it's a giant base64
                if (imageVal.startsWith('data:image/')) {
                    imageVal = await compressBase64Image(imageVal);
                }

                // Update db with deep fallback support for ID discrepancies
                let sIndex = db.services.findIndex(s => s.id === sId);
                if (sIndex === -1) {
                    sIndex = db.services.findIndex(s => String(s.id) === String(sId));
                }
                if (sIndex === -1) {
                    sIndex = index; // Fallback to exact array index
                }

                if (sIndex !== -1 && db.services[sIndex]) {
                    db.services[sIndex].title = titleVal;
                    db.services[sIndex].desc = descVal;
                    db.services[sIndex].image = imageVal;
                    saveDB(db);
                    showToast(`"${titleVal}" hizmeti başarıyla güncellendi.`);
                } else {
                    showToast('Hizmet güncellenemedi! Hatalı indeks.', false);
                }
            });
        });
    };

    // 6. Load & Save GALLERY SECTION
    const renderGallery = () => {
        const container = document.getElementById('adminGalleryItems');
        container.innerHTML = ''; // reset

        if (db.gallery.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">Galeride henüz resim bulunmuyor.</div>';
            return;
        }

        db.gallery.forEach(item => {
            const card = document.createElement('div');
            card.className = 'admin-item-card';
            card.innerHTML = `
                <div class="admin-item-img">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="admin-item-actions">
                        <button class="admin-item-btn btn-delete-gal" data-id="${item.id}" title="Resmi Sil">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="admin-item-info">
                    <div class="admin-item-title">${item.title}</div>
                </div>
            `;
            container.appendChild(card);

            // Bind delete button
            card.querySelector('.btn-delete-gal').addEventListener('click', () => {
                db.gallery = db.gallery.filter(g => g.id !== item.id);
                saveDB(db);
                renderGallery();
                showToast('Görsel galeriden silindi.');
            });
        });
    };

    const initGalleryForm = () => {
        const fileInput = document.getElementById('inp-galFile');
        const prevImg = document.getElementById('prev-galImg');
        const prevText = document.getElementById('prev-galText');

        // File upload trigger preview
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                try {
                    const base64 = await fileToBase64(e.target.files[0]);
                    prevImg.src = base64;
                    prevImg.style.display = 'block';
                    prevText.style.display = 'none';
                } catch (err) {
                    showToast('Görsel okunamadı!', false);
                }
            }
        });

        // Form Submission
        document.getElementById('addGalleryForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const titleVal = document.getElementById('inp-galTitle').value.trim();
            let imgVal = prevImg.src;

            if (!titleVal || !imgVal || prevImg.style.display === 'none') {
                showToast('Lütfen resim yükleyin ve açıklama ekleyin!', false);
                return;
            }

            if (imgVal.startsWith('data:image/')) {
                imgVal = await compressBase64Image(imgVal);
            }

            // Add new gallery object
            const newGal = {
                id: Date.now(),
                title: titleVal,
                image: imgVal
            };

            db.gallery.unshift(newGal); // Add to the top
            saveDB(db);

            // Reset Form
            document.getElementById('addGalleryForm').reset();
            prevImg.src = '';
            prevImg.style.display = 'none';
            prevText.style.display = 'block';

            renderGallery();
            showToast('Görsel başarıyla galeriye eklendi!');
        });

        renderGallery();
    };

    // 7. Load & Save PROCESS TIMELINE
    const initProcess = () => {
        // Headers
        document.getElementById('inp-procSubtitle').value = db.process.subtitle;
        document.getElementById('inp-procTitle').value = db.process.title;
        document.getElementById('inp-procDesc').value = db.process.desc;

        document.getElementById('processHeaderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            db.process.subtitle = document.getElementById('inp-procSubtitle').value.trim();
            db.process.title = document.getElementById('inp-procTitle').value.trim();
            db.process.desc = document.getElementById('inp-procDesc').value.trim();
            saveDB(db);
            showToast('İşleyiş süreci başlıkları kaydedildi.');
        });

        // Render steps list
        const container = document.getElementById('processStepsContainer');
        container.innerHTML = ''; // reset

        db.process.steps.forEach((step, index) => {
            const box = document.createElement('div');
            box.className = 'admin-card';
            box.style.backgroundColor = 'var(--bg-light)';
            box.style.marginBottom = '20px';
            box.style.padding = '20px';

            box.innerHTML = `
                <h4 style="margin-bottom: 15px; color: var(--primary-deep); font-size: 1.05rem;">Adım #${step.number}: ${step.title}</h4>
                <div class="admin-grid-2">
                    <div class="admin-form-group" style="margin-bottom: 0;">
                        <label class="admin-form-label">Adım Başlığı</label>
                        <input type="text" class="admin-form-input step-val-title" value="${step.title}" required>
                    </div>
                    <div class="admin-form-group" style="margin-bottom: 0;">
                        <label class="admin-form-label">Adım Açıklaması</label>
                        <input type="text" class="admin-form-input step-val-desc" value="${step.desc}" required>
                    </div>
                </div>
                <button type="button" class="btn btn-primary btn-save-step" data-num="${step.number}" style="margin-top: 15px; padding: 8px 16px; font-size: 0.85rem;">
                    <i class="fa-solid fa-save"></i> Adımı Kaydet
                </button>
            `;
            container.appendChild(box);

            box.querySelector('.btn-save-step').addEventListener('click', () => {
                const sNum = parseInt(box.querySelector('.btn-save-step').getAttribute('data-num'));
                const tVal = box.querySelector('.step-val-title').value.trim();
                const dVal = box.querySelector('.step-val-desc').value.trim();

                if (!tVal || !dVal) {
                    showToast('Lütfen tüm alanları doldurun!', false);
                    return;
                }

                const sIndex = db.process.steps.findIndex(s => s.number === sNum);
                if (sIndex !== -1) {
                    db.process.steps[sIndex].title = tVal;
                    db.process.steps[sIndex].desc = dVal;
                    saveDB(db);
                    showToast(`Adım #${sNum} başarıyla güncellendi.`);
                }
            });
        });
    };

    // 8. Load & Save WHY CHOOSE US
    const initWhy = () => {
        document.getElementById('inp-whySubtitle').value = db.why_choose.subtitle;
        document.getElementById('inp-whyTitle').value = db.why_choose.title;
        document.getElementById('inp-whyDesc').value = db.why_choose.desc;

        document.getElementById('whyHeaderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            db.why_choose.subtitle = document.getElementById('inp-whySubtitle').value.trim();
            db.why_choose.title = document.getElementById('inp-whyTitle').value.trim();
            db.why_choose.desc = document.getElementById('inp-whyDesc').value.trim();
            saveDB(db);
            showToast('Neden biz başlıkları güncellendi.');
        });

        // Cards list
        const container = document.getElementById('whyCardsContainer');
        container.innerHTML = '';

        db.why_choose.cards.forEach((card, index) => {
            const box = document.createElement('div');
            box.className = 'admin-card';
            box.style.backgroundColor = 'var(--bg-light)';
            box.style.marginBottom = '20px';
            box.style.padding = '20px';

            box.innerHTML = `
                <h4 style="margin-bottom: 15px; color: var(--primary-deep); font-size: 1.05rem;"><i class="fa-solid ${card.icon}" style="color: var(--accent);"></i> Kart #${index + 1}: ${card.title}</h4>
                <div class="admin-grid-2">
                    <div class="admin-form-group" style="margin-bottom: 0;">
                        <label class="admin-form-label">Kart Başlığı</label>
                        <input type="text" class="admin-form-input card-val-title" value="${card.title}" required>
                    </div>
                    <div class="admin-form-group" style="margin-bottom: 0;">
                        <label class="admin-form-label">Kart Açıklaması</label>
                        <input type="text" class="admin-form-input card-val-desc" value="${card.desc}" required>
                    </div>
                </div>
                <button type="button" class="btn btn-primary btn-save-why" data-idx="${index}" style="margin-top: 15px; padding: 8px 16px; font-size: 0.85rem;">
                    <i class="fa-solid fa-save"></i> Kartı Kaydet
                </button>
            `;
            container.appendChild(box);

            box.querySelector('.btn-save-why').addEventListener('click', () => {
                const cIdx = parseInt(box.querySelector('.btn-save-why').getAttribute('data-idx'));
                const tVal = box.querySelector('.card-val-title').value.trim();
                const dVal = box.querySelector('.card-val-desc').value.trim();

                if (!tVal || !dVal) {
                    showToast('Lütfen tüm alanları doldurun!', false);
                    return;
                }

                db.why_choose.cards[cIdx].title = tVal;
                db.why_choose.cards[cIdx].desc = dVal;
                saveDB(db);
                showToast(`Neden biz kartı #${cIdx + 1} güncellendi.`);
            });
        });
    };

    // 9. Load & Save REVIEWS (TESTIMONIALS)
    const renderReviews = () => {
        const container = document.getElementById('adminReviewsItems');
        container.innerHTML = ''; // reset

        if (db.testimonials.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">Henüz aktif müşteri yorumu bulunmuyor.</div>';
            return;
        }

        db.testimonials.forEach(rev => {
            const card = document.createElement('div');
            card.className = 'admin-item-card';
            card.innerHTML = `
                <div class="admin-item-info">
                    <div class="admin-item-title" style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${rev.name}</span>
                        <span style="color: var(--accent); font-size: 0.85rem;">${'★'.repeat(rev.stars)}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">${rev.role}</div>
                    <p class="admin-item-desc" style="font-style: italic;">"${rev.text}"</p>
                    <div class="admin-review-meta">
                        <span style="font-size: 0.75rem; color: var(--success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Sitede Yayında</span>
                        <button class="admin-item-btn btn-delete-rev" data-id="${rev.id}" style="position: static; width: auto; height: auto; padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-trash-can"></i> Sil
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);

            // Delete Review
            card.querySelector('.btn-delete-rev').addEventListener('click', () => {
                db.testimonials = db.testimonials.filter(t => t.id !== rev.id);
                saveDB(db);
                renderReviews();
                showToast('Müşteri yorumu silindi.');
            });
        });
    };

    const initReviewsForm = () => {
        document.getElementById('addReviewForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('inp-revName').value.trim();
            const roleVal = document.getElementById('inp-revRole').value.trim();
            const starVal = parseInt(document.getElementById('inp-revStars').value);
            const textVal = document.getElementById('inp-revText').value.trim();

            if (!nameVal || !roleVal || !textVal) {
                showToast('Lütfen tüm zorunlu alanları doldurun!', false);
                return;
            }

            const newRev = {
                id: Date.now(),
                name: nameVal,
                role: roleVal,
                stars: starVal,
                text: textVal
            };

            db.testimonials.unshift(newRev); // add to the top
            saveDB(db);

            // Reset form
            document.getElementById('addReviewForm').reset();

            renderReviews();
            showToast('Müşteri yorumu başarıyla eklendi ve yayına alındı!');
        });

        renderReviews();
    };

    // 10. Load & Save CONTACT INFO
    const initContact = () => {
        document.getElementById('inp-contAddress').value = db.contact.address;
        document.getElementById('inp-contPhone').value = db.contact.phone;
        document.getElementById('inp-contEmail').value = db.contact.email;
        document.getElementById('inp-contMap').value = db.contact.map_embed;

        document.getElementById('contactFormAdmin').addEventListener('submit', (e) => {
            e.preventDefault();
            db.contact.address = document.getElementById('inp-contAddress').value.trim();
            db.contact.phone = document.getElementById('inp-contPhone').value.trim();
            db.contact.email = document.getElementById('inp-contEmail').value.trim();
            db.contact.map_embed = document.getElementById('inp-contMap').value.trim();

            saveDB(db);
            showToast('İletişim bilgileri başarıyla güncellendi.');
        });
    };

    // --- 11. Gelen Keşif Talepleri (Inbox) Management ---
    const unreadBadge = document.getElementById('unreadCountBadge');
    const messagesContainer = document.getElementById('messagesListContainer');
    const clearAllBtn = document.getElementById('btn-clearAllMessages');

    const updateUnreadBadge = () => {
        if (!db.messages) db.messages = [];
        const count = db.messages.filter(m => m.status === 'new').length;
        if (unreadBadge) {
            if (count > 0) {
                unreadBadge.textContent = count;
                unreadBadge.style.display = 'inline-block';
            } else {
                unreadBadge.style.display = 'none';
            }
        }
    };

    const renderMessages = () => {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '';
        
        if (!db.messages || db.messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="no-messages-placeholder">
                    <i class="fa-solid fa-inbox"></i>
                    <h3>Henüz Gelen Keşif Talebi Yok</h3>
                    <p>Müşterileriniz ana sayfadaki keşif formunu doldurduğunda talepleri burada listelenecektir.</p>
                </div>
            `;
            updateUnreadBadge();
            return;
        }

        // Sort reverse chronological (newest first)
        const sortedMsgs = [...db.messages].sort((a, b) => b.id - a.id);

        sortedMsgs.forEach(msg => {
            const card = document.createElement('div');
            card.className = `message-card-item ${msg.status === 'new' ? 'new-message' : ''}`;
            
            const isNew = msg.status === 'new';
            const statusLabel = isNew ? 
                '<span style="background-color: #ef4444; color: white; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700;"><i class="fa-solid fa-bell"></i> Yeni Talep</span>' : 
                '<span style="background-color: #10b981; color: white; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> İletişim Kuruldu</span>';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h3 style="font-size: 1.15rem; margin-bottom: 0; color: var(--primary-deep); font-weight: 700;">${msg.name}</h3>
                        ${statusLabel}
                    </div>
                    <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;"><i class="fa-solid fa-clock"></i> ${msg.date}</span>
                </div>

                <div class="message-meta-grid">
                    <div class="message-meta-item">
                        <i class="fa-solid fa-phone"></i>
                        <a href="tel:${msg.phone.replace(/\s+/g, '')}" style="color: var(--primary); font-weight: 600;">${msg.phone}</a>
                    </div>
                    ${msg.email ? `
                    <div class="message-meta-item">
                        <i class="fa-solid fa-envelope"></i>
                        <a href="mailto:${msg.email}" style="color: var(--text-dark);">${msg.email}</a>
                    </div>` : ''}
                    ${msg.location ? `
                    <div class="message-meta-item">
                        <i class="fa-solid fa-map-location-dot"></i>
                        <span>${msg.location}</span>
                    </div>` : ''}
                </div>

                <div class="message-text-content">${msg.message}</div>

                <div class="message-card-actions">
                    ${isNew ? `
                    <button class="btn-message-action contacted btn-mark-contacted" data-id="${msg.id}">
                        <i class="fa-solid fa-phone-slash"></i> Arandı Olarak İşaretle
                    </button>` : `
                    <button class="btn-message-action contacted btn-mark-contacted" data-id="${msg.id}" style="background-color: transparent; border-color: rgba(0,0,0,0.1); color: var(--text-muted);">
                        <i class="fa-solid fa-phone"></i> Geri Al (Yeni Yap)
                    </button>
                    `}
                    <button class="btn-message-action delete btn-delete-msg" data-id="${msg.id}">
                        <i class="fa-solid fa-trash-can"></i> Sil
                    </button>
                </div>
            `;

            // Action: Mark as contacted / Toggle
            card.querySelector('.btn-mark-contacted').addEventListener('click', () => {
                const targetMsg = db.messages.find(m => m.id === msg.id);
                if (targetMsg) {
                    targetMsg.status = targetMsg.status === 'new' ? 'contacted' : 'new';
                    saveDB(db);
                    renderMessages();
                    showToast(targetMsg.status === 'contacted' ? 'Talep arandı olarak işaretlendi.' : 'Talep yeni olarak işaretlendi.');
                }
            });

            // Action: Delete
            card.querySelector('.btn-delete-msg').addEventListener('click', () => {
                db.messages = db.messages.filter(m => m.id !== msg.id);
                saveDB(db);
                renderMessages();
                showToast('Keşif talebi silindi.');
            });

            messagesContainer.appendChild(card);
        });

        updateUnreadBadge();
    };

    const initMessages = () => {
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (!db.messages || db.messages.length === 0) return;
                if (confirm('Tüm keşif taleplerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
                    db.messages = [];
                    saveDB(db);
                    renderMessages();
                    showToast('Tüm gelen talepler temizlendi.');
                }
            });
        }
        
        renderMessages();
    };

    // Run deep database cleanup for legacy giant base64 images in background
    cleanDatabaseImages();

    // Initialize all components
    initMessages();
    initHero();
    initAbout();
    initServices();
    initGalleryForm();
    initProcess();
    initWhy();
    initReviewsForm();
    initContact();

    // Background cloud database sync (SWR pattern for Admin Panel)
    if (typeof fetchVercelKV === 'function') {
        fetchVercelKV().then(cloudData => {
            if (cloudData) {
                const localStr = JSON.stringify(db);
                const cloudStr = JSON.stringify(cloudData);
                if (localStr !== cloudStr) {
                    window.location.reload();
                }
            }
        }).catch(err => console.log('KV sync omitted or running locally:', err));
    }
});
