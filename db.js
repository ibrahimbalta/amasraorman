/* ==========================================================================
   Amasra Orman Ürünleri - Local Database Manager (db.js)
   ========================================================================== */

const DB_KEY = 'amasra_orman_db';

// Default dynamic contents if database is empty
const DEFAULT_DB = {
    hero: {
        badge: 'Tapulu Arazi Ağaç Değerlendirme',
        title: 'Arazinizdeki Ağaçları <span>En Yüksek Değerle</span> Kazanca Dönüştürün',
        description: 'Bartın, Zonguldak ve Karabük genelinde tapulu arazilerinizde bulunan ağaçlarınızı, yasal mevzuata %100 uygun olarak, çevreye duyarlı profesyonel kesim yöntemleriyle en yüksek değerden ekonomiye kazandırıyoruz.',
        bg_image: 'assets/hero_forest.png',
        whatsapp_text: 'Merhaba, Bartın/Zonguldak/Karabük bölgesindeki tapulu arazimdeki ağaçların kesimi ve değerlendirilmesi hakkında bilgi almak istiyorum.',
        btn_secondary_text: 'Hizmetlerimizi Keşfet'
    },
    about: {
        subtitle: 'Biz Kimiz?',
        title: 'Bartın, Zonguldak ve Karabük Orman Ürünleri Çözümleri',
        desc1: 'Bartın, Zonguldak ve Karabük başta olmak üzere Batı Karadeniz genelinde yılların verdiği deneyimle orman ürünleri ve profesyonel ağaç kesim hizmetleri sunmaktayız. Amacımız, tapulu arazilerinizdeki ağaç varlıklarınızı en şeffaf, yasal ve karlı şekilde yönetmenizi sağlamaktır.',
        desc2: 'Tüm süreç boyunca bürokratik kesim izinlerinden lojistiğe kadar her detayı uzman kadromuzla üstleniyor, ağaçlarınızı değerinin üstünde satın alarak doğrudan ekonomiye kazandırıyoruz.',
        experience_years: '15+',
        experience_text: 'Yıllık Ormancılık ve Sektör Tecrübesi',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        features: [
            {
                title: 'Resmi İzin Yönetimi',
                desc: 'Bartın, Zonguldak ve Karabük\'teki tüm bürokratik başvuruları ve kesim izinlerini sizin yerinize yapıyoruz.'
            },
            {
                title: 'Şeffaf Değerleme',
                desc: 'Arazinizdeki ağaç cinsini ve kalitesini tam belirleyip piyasa üstü değerle nakit ödüyoruz.'
            }
        ]
    },
    services: [
        {
            id: 1,
            title: 'Profesyonel Kesim ve Temizlik',
            desc: 'Tapulu arazilerinizde bulunan her türlü ağacı, profesyonel ekipmanlar ve iş güvenliği kurallarına uygun olarak güvenle kesiyoruz. Arazinizi temiz bir şekilde teslim ediyoruz.',
            image: 'https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?auto=format&fit=crop&w=800&q=80',
            icon: 'fa-trowel-bricks'
        },
        {
            id: 2,
            title: 'Yasal İzin ve Projelendirme',
            desc: 'Orman İşletme Müdürlükleri ve ilgili resmi kurumlardan alınması gereken tapulu arazi kesim izinleri, nakliye tezkeresi ve diğer tüm yasal izinleri baştan sona yönetiyoruz.',
            image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
            icon: 'fa-file-shield'
        },
        {
            id: 3,
            title: 'En Yüksek Değerden Satış',
            desc: 'Ağaçlarınızı odun, tomruk, kereste veya maden direği olarak sınıflandırıyor, piyasadaki en yüksek güncel birim fiyatlar üzerinden hesaplayarak size kazanç sağlıyoruz.',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            icon: 'fa-coins'
        }
    ],
    process: {
        subtitle: 'Adım Adım Süreç',
        title: 'Ağaçlarınızı Kazanca Dönüştürme Yolculuğu',
        desc: 'Amasra Orman Ürünleri ile çalışırken hiçbir bürokrasiyle uğraşmazsınız. Sizin için tüm süreci biz planlarız.',
        steps: [
            {
                number: 1,
                title: 'Ücretsiz Keşif & Analiz',
                desc: 'Bartın, Zonguldak ve Karabük genelindeki tapulu arazinize gelerek ağaç türlerini, yaşlarını, hacimlerini ve kalitelerini inceliyor, piyasa değerini hesaplıyoruz.',
                icon: 'fa-compass'
            },
            {
                number: 2,
                title: 'Yasal İzin Başvuruları',
                desc: 'Orman Bölge Müdürlüğü\'ne tapu belgenizle birlikte gerekli resmi başvuruları yapıyor, ağaç damgalama ve kesim izni sürecini tamamlıyoruz.',
                icon: 'fa-file-signature'
            },
            {
                number: 3,
                title: 'Profesyonel Kesim & Nakliye',
                desc: 'Deneyimli kesim kadromuzla ağaçların güvenli şekilde kesimini yapıyor, tomruklara ayırıyor ve nakliye araçlarımızla sevk ediyoruz.',
                icon: 'fa-helmet-safety'
            },
            {
                number: 4,
                title: 'Hızlı Ödeme & Teslimat',
                desc: 'Belirlenen en yüksek değer üzerinden ödemenizi kesim öncesinde nakit veya banka havalesiyle alarak kazanç elde edersiniz.',
                icon: 'fa-handshake'
            }
        ]
    },
    why_choose: {
        subtitle: 'Neden Amasra Orman Ürünleri?',
        title: 'Arazinizin Değerini Biliyoruz ve Koruyoruz',
        desc: 'Bartın, Zonguldak, Karabük ve çevre ilçelerde orman ürünleri sektöründe bizi öne çıkaran en önemli faktör, güven ve şeffaflık üzerine kurduğumuz iş modelimizdir. Ağaçlarınızı keserken arazinizin genel yapısına zarar vermez, iş güvenliğini her şeyin üstünde tutarız.',
        cards: [
            {
                title: 'En Yüksek Fiyat Garantisi',
                desc: 'Piyasa rayiç bedellerini yakından takip ederek ağaçlarınıza en yüksek fiyatı teklif ediyoruz.',
                icon: 'fa-money-bill-trend-up'
            },
            {
                title: 'Hızlı Resmi Onaylar',
                desc: 'Evrak işlerinizi bürokratik engellere takılmadan en kısa sürede çözüme ulaştırıyoruz.',
                icon: 'fa-clock'
            },
            {
                title: 'Komple Hizmet Ağı',
                desc: 'Kesim, budama, boylama, yükleme ve nakliye işlemlerinin tamamını kendi araçlarımızla yapıyoruz.',
                icon: 'fa-truck-ramp-box'
            },
            {
                title: 'Güvenli ve Lisanslı',
                desc: 'Tüm operasyonlarımız sigortalı, iş güvenliği kurallarına uygun ve yasal yetki belgeleriyle yapılır.',
                icon: 'fa-user-shield'
            }
        ]
    },
    contact: {
        address: 'Çatmaca/Bartın, Bartın, Türkiye',
        phone: '0543 428 74 67',
        email: 'kmelemez@gmail.com',
        map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47690.64069818856!2d32.30230230303881!3d41.62479590863004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409b6df7d6dfef55%3A0xc0787e954ea8a1fb!2zQ2F0bWFjYSwgQmFydMSxbiBNZXJrZXovQmFydMSxbg!5e0!3m2!1str!2str!4v1716120000000!5m2!1str!2str'
    },
    gallery: [
        {
            id: 1,
            title: 'Saha Temizlik Operasyonu',
            image: 'https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            title: 'Kaliteli Çam Tomrukları',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 3,
            title: 'Bartın Meşe Ormanı Sahası',
            image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 4,
            title: 'Lojistik Sevkiyat Hazırlığı',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
        }
    ],
    testimonials: [
        {
            id: 1,
            name: 'Mustafa Yılmaz',
            role: 'Arazi Sahibi - Bartın',
            stars: 5,
            text: 'Bartın Çatmaca\'daki tapulu arazimizdeki eski çam ağaçları için Amasra Orman Ürünleri ile çalıştık. İzinleri o kadar hızlı aldılar ki şaşırdık. Kesimi de arazideki diğer meyve ağaçlarına hiç zarar vermeden yaptılar. Ödemeyi de hemen nakit aldık.'
        },
        {
            id: 2,
            name: 'Ahmet K.',
            role: 'Çiftçi - Kurucaşile',
            stars: 5,
            text: 'Arazimizdeki meşelerin kesimi için birkaç firma ile görüştük ancak en yüksek ve şeffaf fiyatı Amasra Orman Ürünleri verdi. Kesim esnasında gösterdikleri profesyonellik harikaydı. Son derece güvenilir ve işinin ehli bir esnaf.'
        },
        {
            id: 3,
            name: 'Hasan Melemez',
            role: 'Arsa Sahibi - Ulus',
            stars: 5,
            text: 'Kemal Bey ve ekibine çok teşekkür ederiz. Arazimizdeki ağaçların tespiti, Orman İşletme\'den izinlerin çıkarılması ve sonrasındaki sevk sürecini mükemmel yönettiler. Kendileriyle gönül rahatlığıyla çalışabilirsiniz.'
        }
    ],
    messages: [
        {
            id: 1,
            name: 'Mehmet Demir',
            phone: '0532 123 45 67',
            email: 'mehmet@gmail.com',
            location: 'Bartın / Kozcağız',
            message: 'Arazimde yaklaşık 45 adet yetişkin meşe ağacı bulunmaktadır. Kesim ve satın alma işlemleri için ücretsiz keşif ve fiyat teklifi rica ediyorum.',
            date: '2026-05-19 14:32',
            status: 'new'
        }
    ]
};

// Helper to recursively heal target schema from source schema
function healSchemaDeep(target, source) {
    let healed = false;
    for (const key in source) {
        if (target[key] === undefined || target[key] === null) {
            target[key] = JSON.parse(JSON.stringify(source[key]));
            healed = true;
        } else if (typeof source[key] === 'object' && source[key] !== null) {
            if (Array.isArray(source[key])) {
                if (!Array.isArray(target[key])) {
                    target[key] = JSON.parse(JSON.stringify(source[key]));
                    healed = true;
                } else {
                    for (let i = 0; i < source[key].length; i++) {
                        if (target[key][i] === undefined || target[key][i] === null) {
                            target[key][i] = JSON.parse(JSON.stringify(source[key][i]));
                            healed = true;
                        } else if (typeof source[key][i] === 'object' && source[key][i] !== null) {
                            if (typeof target[key][i] === 'object' && target[key][i] !== null) {
                                if (healSchemaDeep(target[key][i], source[key][i])) {
                                    healed = true;
                                }
                            } else {
                                target[key][i] = JSON.parse(JSON.stringify(source[key][i]));
                                healed = true;
                            }
                        }
                    }
                }
            } else {
                if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
                    if (healSchemaDeep(target[key], source[key])) {
                        healed = true;
                    }
                } else {
                    target[key] = JSON.parse(JSON.stringify(source[key]));
                    healed = true;
                }
            }
        }
    }
    return healed;
}

// Initialize DB
function getDB() {
    try {
        const localData = localStorage.getItem(DB_KEY);
        if (!localData) {
            saveDB(DEFAULT_DB);
            return DEFAULT_DB;
        }
        let parsed = JSON.parse(localData);
        if (typeof parsed === 'string') {
            try {
                parsed = JSON.parse(parsed);
            } catch (e) {
                console.error('Failed parsing double-serialized local database:', e);
                parsed = DEFAULT_DB;
            }
        }
        
        // Self-healing schema validation: ensure all DEFAULT_DB keys exist recursively
        const healed = healSchemaDeep(parsed, DEFAULT_DB);
        if (healed) {
            localStorage.setItem(DB_KEY, JSON.stringify(parsed));
        }
        return parsed;
    } catch (e) {
        console.error('Database corrupted or incomplete. Self-healing active: resetting to defaults.', e);
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DB));
        return DEFAULT_DB;
    }
}

function saveDB(data) {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('localStorage kayıt hatası (QuotaExceeded?):', e);
        if (typeof window.showToast === 'function') {
            window.showToast('HATA: Tarayıcı hafızası dolu! Görsel çok büyük olabilir.', false);
        }
        return Promise.reject(new Error('localStorage_quota'));
    }
    
    // Automatically trigger background Vercel KV sync if helper is available
    if (typeof saveVercelKV === 'function') {
        return saveVercelKV(data, '7467').then(success => {
            if (!success) {
                if (typeof window.showToast === 'function') {
                    window.showToast('HATA: Bulut veritabanına kaydedilemedi! Değişiklikler kalıcı olmayabilir.', false);
                }
                return Promise.reject(new Error('kv_save_failed'));
            }
            return true;
        }).catch(err => {
            console.error('KV sync hatası:', err);
            if (typeof window.showToast === 'function') {
                window.showToast('HATA: Bulut senkronizasyon hatası oluştu!', false);
            }
            return Promise.reject(err);
        });
    }
    return Promise.resolve(true);
}

// Background Vercel KV Sync Helpers (SWR Pattern)
async function fetchVercelKV() {
    try {
        const res = await fetch('/api/get-data');
        if (!res.ok) return null;
        const result = await res.json();
        if (result.success && result.data) {
            let cloudData = result.data;
            if (typeof cloudData === 'string') {
                try {
                    cloudData = JSON.parse(cloudData);
                } catch (e) {
                    console.error('Failed parsing double-serialized cloud data:', e);
                    return null;
                }
            }
            
            // Self-healing merge on cloud data as well to prevent local crashes
            healSchemaDeep(cloudData, DEFAULT_DB);
            
            localStorage.setItem(DB_KEY, JSON.stringify(cloudData));
            return cloudData;
        }
    } catch (e) {
        console.warn('Vercel KV sync offline or running locally:', e);
    }
    return null;
}

async function saveVercelKV(data, password) {
    try {
        const res = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': password
            },
            body: JSON.stringify({ data: data })
        });
        const result = await res.json();
        if (result.success) {
            console.log('Data successfully saved to Vercel KV bulut veritabanı!');
            return true;
        } else {
            console.error('Vercel KV save error:', result.error);
        }
    } catch (e) {
        console.error('Vercel KV save failed:', e);
    }
    return false;
}

// Atomic message submission to cloud (does NOT overwrite entire DB)
async function submitMessageToCloud(message) {
    try {
        const res = await fetch('/api/submit-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        const result = await res.json();
        if (result.success) {
            console.log('Message successfully submitted to cloud database!');
            return true;
        } else {
            console.error('Cloud message submission error:', result.error);
        }
    } catch (e) {
        console.error('Cloud message submission failed:', e);
    }
    return false;
}
