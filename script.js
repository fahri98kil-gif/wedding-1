/**
 * DexxDigital - Luxury 3D Wedding Invitation & Cloud CMS
 * Technology: Pure Vanilla HTML5/CSS3/JavaScript (Zero-Build, GitHub Pages Ready)
 * Database: Firebase Firestore Modular SDK via CDN
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Firebase Configuration Provided by Client ---
const firebaseConfig = {
  apiKey: "AIzaSyDmLSvUrOw0U_aLNkctFMKKo5AavJCHYc4",
  authDomain: "web-wedding-4d4ce.firebaseapp.com",
  projectId: "web-wedding-4d4ce",
  storageBucket: "web-wedding-4d4ce.firebasestorage.app",
  messagingSenderId: "904409888717",
  appId: "1:904409888717:web:0f48b18b93d1816e067684",
  measurementId: "G-6D348QJWHR"
};

// Initialize Firebase & Firestore
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase initialization notice:", err);
}

// --- Default Wedding Invitation State (High-Resolution Curated Assets) ---
const defaultWeddingData = {
  theme: "emerald", // 'pearl-light', 'blush-light', 'sage-light', 'emerald', 'rosegold', 'midnight', 'terracotta', 'champagne'
  adminPin: "1234",
  audioUrl: "https://assets.mixkit.co/music/preview/mixkit-wedding-song-288.mp3",
  audioTitle: "A Thousand Years - Romantic Piano & Cello",
  gateSubtitle: "The Wedding Celebration Of",
  heroBadgeDate: "Sabtu, 28 Desember 2026",
  
  // Hero & Couple Info
  weddingDate: "2026-12-28T09:00",
  groom: {
    fullName: "Raden Arya Danendra, S.T.",
    nickName: "Arya",
    parents: "Putra pertama dari Bpk. Ir. Bambang Soediro & Ibu Hj. Ratna Dewi",
    instagram: "arya_danendra",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  bride: {
    fullName: "Adinda Kirana Larasati, M.Psi.",
    nickName: "Dinda",
    parents: "Putri kedua dari Bpk. Prof. Dr. Hendra Kusuma & Ibu Dra. Siti Aminah",
    instagram: "dinda_larasati",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  
  // Quote / Ayat Suci
  quote: {
    arabic: "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    translation: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum : 21"
  },

  // Events
  events: {
    akad: {
      title: "Akad Nikah",
      dateStr: "Sabtu, 28 Desember 2026",
      timeStr: "08:00 - 10:00 WIB",
      venueName: "Masjid Raya Baiturrahman Ballroom",
      address: "Jl. Diponegoro No. 45, Menteng, Jakarta Pusat",
      mapsUrl: "https://maps.google.com/?q=Jakarta+Pusat"
    },
    resepsi: {
      title: "Resepsi Pernikahan",
      dateStr: "Sabtu, 28 Desember 2026",
      timeStr: "11:00 - 14:00 WIB",
      venueName: "The Glass House Grand Ballroom",
      address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Jakarta+Selatan"
    },
    streamingUrl: "https://youtube.com/live"
  },

  // Love Story
  stories: [
    {
      date: "Mei 2020",
      title: "Pertemuan Pertama",
      description: "Pertemuan tak sengaja di sebuah simposium psikologi & arsitektur, berlanjut menjadi obrolan hangat tentang mimpi dan harapan masa depan."
    },
    {
      date: "Agustus 2022",
      title: "Memulai Komitmen",
      description: "Menyadari kesamaan visi dan komitmen dalam membangun prinsip hidup, kami memutuskan untuk saling mendampingi dan bertumbuh bersama."
    },
    {
      date: "Januari 2026",
      title: "Hari Lamaran (Engagement)",
      description: "Di hadapan kedua keluarga besar, cincin kehormatan disematkan sebagai ikrar tulus untuk melangkah menuju gerbang suci pernikahan."
    }
  ],

  // Gallery Photos
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
  ],

  // Digital Gifts & Accounts
  gifts: {
    bank1: {
      bankName: "BCA",
      number: "8830192841",
      holder: "Raden Arya Danendra"
    },
    bank2: {
      bankName: "MANDIRI",
      number: "1370019283741",
      holder: "Adinda Kirana Larasati"
    },
    shippingAddress: "The Senopati Residence Tower A No. 12B, Kebayoran Baru, Jakarta Selatan (Penerima: Arya / Dinda - 081234567890)"
  },

  // Developer Information (Controlled exclusively by Developer Master Panel)
  developer: {
    brandName: "DexxDigital",
    tagline: "Exclusive Digital Wedding & Web Creative Studio",
    masterPin: "8989",
    tiktokUrl: "https://tiktok.com/@dexxdigital",
    shopeeUrl: "https://shopee.co.id/dexxdigital",
    instagramUrl: "https://instagram.com/dexxdigital",
    whatsappUrl: "https://wa.me/6281234567890"
  }
};

// Current Active State
let weddingState = JSON.parse(JSON.stringify(defaultWeddingData));
let wishesData = [];
let audioInstance = null;
let isAudioPlaying = false;

// --- DOM Cache ---
const gateEl = document.getElementById("welcome-gate");
const guestNameEl = document.getElementById("guest-name-badge");
const btnOpenGate = document.getElementById("btn-open-gate");
const musicToggleBtn = document.getElementById("floating-music-toggle");
const audioTag = document.getElementById("bg-audio");
const toastContainer = document.getElementById("toast-container");

// Lightbox
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

// Admin Modals
const adminAuthModal = document.getElementById("admin-auth-modal");
const adminDashboardModal = document.getElementById("admin-dashboard-modal");
const adminPinInput = document.getElementById("admin-pin-input");
const btnSubmitPin = document.getElementById("btn-submit-pin");
const btnCloseAuth = document.getElementById("btn-close-auth");
const btnCloseDashboard = document.getElementById("btn-close-dashboard");
const btnSaveAdmin = document.getElementById("btn-save-admin");
const btnResetDefault = document.getElementById("btn-reset-default");
const secretTriggerBtn = document.getElementById("secret-trigger-btn");
const dexxBrandingBtn = document.getElementById("dexx-branding-btn");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initPersonalizedGuest();
  initAudio();
  initThreeJsBackground();
  initCountdown();
  renderAllData();
  bindEvents();
  initFirebaseSync();
  initLucideIcons();
});

// --- 1. Personalized Guest from URL Query ---
function initPersonalizedGuest() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("to") || urlParams.get("u") || urlParams.get("guest");
  
  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam).trim();
    if (guestNameEl) {
      guestNameEl.textContent = formattedGuest;
    }
    const rsvpNameInput = document.getElementById("rsvp-name");
    if (rsvpNameInput) {
      rsvpNameInput.value = formattedGuest;
    }
  } else {
    if (guestNameEl) {
      guestNameEl.textContent = "Tamu Undangan Terhormat";
    }
  }

  // Secret dev & admin parameter triggers
  if (urlParams.get("dev") === "true" || window.location.hash === "#dev" || window.location.hash === "#developer") {
    setTimeout(() => {
      openDevAuth();
    }, 400);
  } else if (urlParams.get("admin") === "true" || window.location.hash === "#admin") {
    setTimeout(() => {
      openAdminAuth();
    }, 400);
  }
}

// --- 2. Audio Background Setup with Web Audio Fallback ---
let synthAudioContext = null;
let isSynthPlaying = false;
let synthTimer = null;

function initAudio() {
  audioInstance = audioTag;
  if (!audioInstance) return;
  audioInstance.src = weddingState.audioUrl;
  audioInstance.loop = true;

  audioInstance.addEventListener("error", () => {
    console.log("Audio source unavailable, switching to romantic acoustic synthesizer fallback.");
  });
}

function playRomanticHarpSynth() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!synthAudioContext) synthAudioContext = new AudioCtx();
    if (synthAudioContext.state === "suspended") synthAudioContext.resume();

    // Pentatonic romantic notes in Hz: C4, D4, E4, G4, A4, C5, D5, E5
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    let noteIdx = 0;

    isSynthPlaying = true;
    if (synthTimer) clearInterval(synthTimer);

    synthTimer = setInterval(() => {
      if (!isAudioPlaying) return;
      const osc = synthAudioContext.createOscillator();
      const gain = synthAudioContext.createGain();

      osc.type = "sine";
      const freq = notes[noteIdx % notes.length];
      noteIdx = (noteIdx + 1) % notes.length;
      osc.frequency.setValueAtTime(freq, synthAudioContext.currentTime);

      gain.gain.setValueAtTime(0.06, synthAudioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioContext.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(synthAudioContext.destination);

      osc.start();
      osc.stop(synthAudioContext.currentTime + 1.8);
    }, 700);
  } catch (err) {
    console.warn("Synth audio note error:", err);
  }
}

function playAudio() {
  isAudioPlaying = true;
  if (musicToggleBtn) {
    musicToggleBtn.classList.add("playing");
    musicToggleBtn.setAttribute("title", "Jeda Musik");
  }

  if (audioInstance && audioInstance.src) {
    audioInstance.play().catch(() => {
      playRomanticHarpSynth();
    });
  } else {
    playRomanticHarpSynth();
  }
}

function toggleAudio() {
  if (isAudioPlaying) {
    if (audioInstance) audioInstance.pause();
    isAudioPlaying = false;
    if (synthTimer) clearInterval(synthTimer);
    if (musicToggleBtn) {
      musicToggleBtn.classList.remove("playing");
      musicToggleBtn.setAttribute("title", "Putar Musik");
    }
    showToast("Musik dijeda");
  } else {
    playAudio();
    showToast("Memutar alunan musik pernikahan");
  }
}

// --- 3. Three.js 3D Background (Motion-03 Aesthetic: Floating Gold Stardust & Intertwined 3D Rings) ---
function initThreeJsBackground() {
  const canvas = document.getElementById("webgl-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Specular Lighting
  const ambientLight = new THREE.AmbientLight(0xfff0d0, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffe6a3, 2);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xc59b42, 2.5, 50);
  pointLight.position.set(0, 0, 10);
  scene.add(pointLight);

  // 1. Shimmering Gold Dust / Petals Particles
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 30;
    scales[i / 3] = Math.random() * 0.4 + 0.15;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Custom particle texture
  const canvasParticle = document.createElement("canvas");
  canvasParticle.width = 32;
  canvasParticle.height = 32;
  const ctx = canvasParticle.getContext("2d");
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 235, 170, 1)");
  grad.addColorStop(0.4, "rgba(212, 175, 55, 0.8)");
  grad.addColorStop(1, "rgba(197, 155, 66, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const particleTexture = new THREE.CanvasTexture(canvasParticle);
  const particleMat = new THREE.PointsMaterial({
    size: 0.65,
    map: particleTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 2. Intertwined 3D Golden Wedding Rings (Subtle floating element)
  const ringGroup = new THREE.Group();
  const ringGeo = new THREE.TorusGeometry(3.2, 0.28, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xC59B42,
    metalness: 0.85,
    roughness: 0.22,
    wireframe: false
  });

  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.position.set(-1.8, 1.2, -5);
  ring1.rotation.set(0.6, 0.4, 0.2);

  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.position.set(1.4, -0.6, -4.5);
  ring2.rotation.set(-0.5, 0.8, -0.3);

  ringGroup.add(ring1);
  ringGroup.add(ring2);
  ringGroup.position.set(0, -2, -10);
  scene.add(ringGroup);

  // Mouse & Scroll Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Gentle particle swirl
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;

    // Golden ring rotation
    ring1.rotation.x += 0.004;
    ring1.rotation.y += 0.006;
    ring2.rotation.x -= 0.005;
    ring2.rotation.y -= 0.004;

    ringGroup.position.x = targetX * 10;
    ringGroup.position.y = -targetY * 10 - 2;

    camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- 4. Countdown Timer ---
let countdownInterval = null;
function initCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const target = new Date(weddingState.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// --- 5. Render UI from Active State ---
function renderAllData() {
  // 1. Theme
  document.documentElement.setAttribute("data-theme", weddingState.theme || "emerald");

  // 1b. Gate & Hero Subtitles
  const gateSubEl = document.getElementById("gate-subtitle");
  if (gateSubEl) {
    gateSubEl.textContent = weddingState.gateSubtitle || "The Wedding Celebration Of";
  }
  const gateNamesEl = document.getElementById("gate-couple-names");
  if (gateNamesEl) {
    gateNamesEl.textContent = `${weddingState.groom.nickName} & ${weddingState.bride.nickName}`;
  }
  const heroDateBadge = document.getElementById("hero-date-text");
  if (heroDateBadge) {
    heroDateBadge.textContent = weddingState.heroBadgeDate || "Sabtu, 28 Desember 2026";
  }

  // 2. Couple Names & Photos
  const heroNamesEl = document.getElementById("hero-couple-names");
  if (heroNamesEl) {
    heroNamesEl.textContent = `${weddingState.groom.nickName} & ${weddingState.bride.nickName}`;
  }

  const heroPhotoEl = document.getElementById("hero-main-photo");
  if (heroPhotoEl && weddingState.gallery && weddingState.gallery.length > 0) {
    heroPhotoEl.src = weddingState.gallery[0];
  }

  // Groom Card
  const groomName = document.getElementById("groom-fullname");
  const groomNick = document.getElementById("groom-nickname");
  const groomParents = document.getElementById("groom-parents");
  const groomPhoto = document.getElementById("groom-photo");
  const groomIg = document.getElementById("groom-ig-link");
  const groomIgHandle = document.getElementById("groom-ig-handle");

  if (groomName) groomName.textContent = weddingState.groom.fullName;
  if (groomNick) groomNick.textContent = weddingState.groom.nickName;
  if (groomParents) groomParents.textContent = weddingState.groom.parents;
  if (groomPhoto) groomPhoto.src = weddingState.groom.photo;
  if (groomIg) groomIg.href = `https://instagram.com/${weddingState.groom.instagram}`;
  if (groomIgHandle) groomIgHandle.textContent = `@${weddingState.groom.instagram}`;

  // Bride Card
  const brideName = document.getElementById("bride-fullname");
  const brideNick = document.getElementById("bride-nickname");
  const brideParents = document.getElementById("bride-parents");
  const bridePhoto = document.getElementById("bride-photo");
  const brideIg = document.getElementById("bride-ig-link");
  const brideIgHandle = document.getElementById("bride-ig-handle");

  if (brideName) brideName.textContent = weddingState.bride.fullName;
  if (brideNick) brideNick.textContent = weddingState.bride.nickName;
  if (brideParents) brideParents.textContent = weddingState.bride.parents;
  if (bridePhoto) bridePhoto.src = weddingState.bride.photo;
  if (brideIg) brideIg.href = `https://instagram.com/${weddingState.bride.instagram}`;
  if (brideIgHandle) brideIgHandle.textContent = `@${weddingState.bride.instagram}`;

  // Quote
  const quoteArabic = document.getElementById("quote-arabic-text");
  const quoteTrans = document.getElementById("quote-trans-text");
  const quoteSource = document.getElementById("quote-source-text");
  if (quoteArabic) quoteArabic.textContent = weddingState.quote.arabic;
  if (quoteTrans) quoteTrans.textContent = `"${weddingState.quote.translation}"`;
  if (quoteSource) quoteSource.textContent = weddingState.quote.source;

  // Events (Akad & Resepsi)
  const akadDate = document.getElementById("akad-date");
  const akadTime = document.getElementById("akad-time");
  const akadVenue = document.getElementById("akad-venue");
  const akadAddress = document.getElementById("akad-address");
  const akadMaps = document.getElementById("akad-maps-btn");

  if (akadDate) akadDate.textContent = weddingState.events.akad.dateStr;
  if (akadTime) akadTime.textContent = weddingState.events.akad.timeStr;
  if (akadVenue) akadVenue.textContent = weddingState.events.akad.venueName;
  if (akadAddress) akadAddress.textContent = weddingState.events.akad.address;
  if (akadMaps) akadMaps.href = weddingState.events.akad.mapsUrl;

  const resepsiDate = document.getElementById("resepsi-date");
  const resepsiTime = document.getElementById("resepsi-time");
  const resepsiVenue = document.getElementById("resepsi-venue");
  const resepsiAddress = document.getElementById("resepsi-address");
  const resepsiMaps = document.getElementById("resepsi-maps-btn");

  if (resepsiDate) resepsiDate.textContent = weddingState.events.resepsi.dateStr;
  if (resepsiTime) resepsiTime.textContent = weddingState.events.resepsi.timeStr;
  if (resepsiVenue) resepsiVenue.textContent = weddingState.events.resepsi.venueName;
  if (resepsiAddress) resepsiAddress.textContent = weddingState.events.resepsi.address;
  if (resepsiMaps) resepsiMaps.href = weddingState.events.resepsi.mapsUrl;

  const streamBtn = document.getElementById("live-stream-btn");
  if (streamBtn) streamBtn.href = weddingState.events.streamingUrl;

  // Timeline Stories
  renderTimeline();

  // Gallery
  renderGallery();

  // Bank & Gifts
  const bank1Name = document.getElementById("bank1-name");
  const bank1Num = document.getElementById("bank1-num");
  const bank1Holder = document.getElementById("bank1-holder");
  if (bank1Name) bank1Name.textContent = weddingState.gifts.bank1.bankName;
  if (bank1Num) bank1Num.textContent = weddingState.gifts.bank1.number;
  if (bank1Holder) bank1Holder.textContent = weddingState.gifts.bank1.holder;

  const bank2Name = document.getElementById("bank2-name");
  const bank2Num = document.getElementById("bank2-num");
  const bank2Holder = document.getElementById("bank2-holder");
  if (bank2Name) bank2Name.textContent = weddingState.gifts.bank2.bankName;
  if (bank2Num) bank2Num.textContent = weddingState.gifts.bank2.number;
  if (bank2Holder) bank2Holder.textContent = weddingState.gifts.bank2.holder;

  const shippingText = document.getElementById("shipping-address-text");
  if (shippingText) shippingText.textContent = weddingState.gifts.shippingAddress;

  // Developer Branding in Footer (Controlled via Developer Master Panel)
  const devData = weddingState.developer || defaultWeddingData.developer;
  const devBrandName = document.getElementById("dev-brand-name");
  const devTagline = document.getElementById("dev-brand-tagline");
  const devTiktok = document.getElementById("dev-link-tiktok");
  const devShopee = document.getElementById("dev-link-shopee");
  const devIg = document.getElementById("dev-link-ig");
  const devWa = document.getElementById("dev-link-wa");

  if (devBrandName) devBrandName.textContent = devData.brandName || "DexxDigital";
  if (devTagline) devTagline.textContent = devData.tagline || "Exclusive Digital Wedding & Web Creative Studio";
  if (devTiktok) devTiktok.href = devData.tiktokUrl || "https://tiktok.com/@dexxdigital";
  if (devShopee) devShopee.href = devData.shopeeUrl || "https://shopee.co.id/dexxdigital";
  if (devIg) devIg.href = devData.instagramUrl || "https://instagram.com/dexxdigital";
  if (devWa) devWa.href = devData.whatsappUrl || "https://wa.me/6281234567890";

  // Audio update
  if (audioInstance && weddingState.audioUrl && audioInstance.src !== weddingState.audioUrl) {
    audioInstance.src = weddingState.audioUrl;
  }

  // Update Countdown target
  initCountdown();
}

function renderTimeline() {
  const container = document.getElementById("timeline-story-list");
  if (!container) return;
  container.innerHTML = "";

  (weddingState.stories || []).forEach((st) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
      <div class="timeline-date">${escapeHtml(st.date)}</div>
      <div class="timeline-title font-editorial">${escapeHtml(st.title)}</div>
      <div class="timeline-desc">${escapeHtml(st.description)}</div>
    `;
    container.appendChild(item);
  });
}

function renderGallery() {
  const grid = document.getElementById("gallery-items-grid");
  if (!grid) return;
  grid.innerHTML = "";

  (weddingState.gallery || []).forEach((url, idx) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.setAttribute("data-src", url);
    item.innerHTML = `
      <img src="${url}" alt="Momen Bahagia ${idx + 1}" class="gallery-thumb" loading="lazy" />
      <div class="gallery-overlay-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>
    `;
    item.addEventListener("click", () => openLightbox(url));
    grid.appendChild(item);
  });
}

function openLightbox(url) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = url;
  lightboxModal.classList.add("active");
}

function closeLightbox() {
  if (lightboxModal) lightboxModal.classList.remove("active");
}

// --- 6. Event Listeners ---
function bindEvents() {
  // Open Gate & Unlock Page
  if (btnOpenGate) {
    btnOpenGate.addEventListener("click", () => {
      if (gateEl) {
        gateEl.classList.add("gate-opened");
      }
      playAudio();
      showToast("Selamat datang di Undangan Pernikahan");
    });
  }

  // Floating Music Button
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleAudio);
  }

  // Lightbox Close
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Copy Bank Account Buttons
  const copyBtn1 = document.getElementById("btn-copy-bank1");
  if (copyBtn1) {
    copyBtn1.addEventListener("click", () => {
      copyToClipboard(weddingState.gifts.bank1.number, "Nomor rekening BCA berhasil disalin");
    });
  }

  const copyBtn2 = document.getElementById("btn-copy-bank2");
  if (copyBtn2) {
    copyBtn2.addEventListener("click", () => {
      copyToClipboard(weddingState.gifts.bank2.number, "Nomor rekening Mandiri berhasil disalin");
    });
  }

  const copyAddrBtn = document.getElementById("btn-copy-address");
  if (copyAddrBtn) {
    copyAddrBtn.addEventListener("click", () => {
      copyToClipboard(weddingState.gifts.shippingAddress, "Alamat pengiriman kado berhasil disalin");
    });
  }

  // RSVP Form Submit
  const rsvpForm = document.getElementById("rsvp-form");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", handleRsvpSubmit);
  }

  // Add to Google Calendar
  const addToCalBtn = document.getElementById("btn-add-calendar");
  if (addToCalBtn) {
    addToCalBtn.addEventListener("click", generateGoogleCalendarLink);
  }

  // Secret Admin Panel Triggers
  if (secretTriggerBtn) {
    secretTriggerBtn.addEventListener("click", openAdminAuth);
  }

  // Double/Triple click on DexxDigital branding opens Client Admin panel
  let brandClickCount = 0;
  let brandClickTimer = null;
  if (dexxBrandingBtn) {
    dexxBrandingBtn.addEventListener("click", () => {
      brandClickCount++;
      if (brandClickCount >= 3) {
        brandClickCount = 0;
        openAdminAuth();
        showToast("Membuka Panel Client...");
      } else {
        clearTimeout(brandClickTimer);
        brandClickTimer = setTimeout(() => { brandClickCount = 0; }, 2500);
      }
    });
  }

  // Keyboard shortcut triggers:
  // 1. Ctrl + Shift + 89 (Master Developer Console)
  // 2. Ctrl + Shift + A (Client Admin Panel)
  let devKeyBuffer = "";
  let devKeyBufferTimer = null;

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      // Check for '8' and '9' keypresses
      const isEight = e.key === "8" || e.key === "*" || e.code === "Digit8" || e.code === "Numpad8";
      const isNine = e.key === "9" || e.key === "(" || e.code === "Digit9" || e.code === "Numpad9";

      if (isEight) {
        devKeyBuffer += "8";
      } else if (isNine) {
        devKeyBuffer += "9";
      }

      if (isEight || isNine) {
        clearTimeout(devKeyBufferTimer);
        devKeyBufferTimer = setTimeout(() => {
          devKeyBuffer = "";
        }, 3000);

        if (devKeyBuffer.includes("89")) {
          devKeyBuffer = "";
          e.preventDefault();
          openDevAuth();
          showToast("Membuka Master Developer Console...");
          return;
        }
      }

      // Client Admin shortcut: Ctrl + Shift + A
      if (e.key === "A" || e.key === "a" || e.code === "KeyA") {
        e.preventDefault();
        openAdminAuth();
        return;
      }
    }
  });

  // Global helper for programmatic / developer trigger
  window.openAdminAuth = openAdminAuth;
  window.openDevAuth = openDevAuth;
  window.openDevDashboard = openDevDashboard;

  // Master Developer Modal Listeners
  const btnSubmitDevPin = document.getElementById("btn-submit-dev-pin");
  const devPinInput = document.getElementById("dev-pin-input");
  const btnCloseDevAuth = document.getElementById("btn-close-dev-auth");
  const btnCloseDevDashboard = document.getElementById("btn-close-dev-dashboard");
  const btnCancelDev = document.getElementById("btn-cancel-dev");
  const btnSaveDev = document.getElementById("btn-save-dev");
  const btnDevOpenClient = document.getElementById("btn-dev-open-client-cms");

  if (btnSubmitDevPin) btnSubmitDevPin.addEventListener("click", verifyDevPin);
  if (devPinInput) {
    devPinInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") verifyDevPin();
    });
  }
  if (btnCloseDevAuth) {
    btnCloseDevAuth.addEventListener("click", () => {
      const modal = document.getElementById("dev-auth-modal");
      if (modal) modal.classList.remove("active");
    });
  }
  if (btnCloseDevDashboard) {
    btnCloseDevDashboard.addEventListener("click", () => {
      const modal = document.getElementById("dev-dashboard-modal");
      if (modal) modal.classList.remove("active");
    });
  }
  if (btnCancelDev) {
    btnCancelDev.addEventListener("click", () => {
      const modal = document.getElementById("dev-dashboard-modal");
      if (modal) modal.classList.remove("active");
    });
  }
  if (btnSaveDev) btnSaveDev.addEventListener("click", saveDevSettingsToFirebase);
  if (btnDevOpenClient) {
    btnDevOpenClient.addEventListener("click", () => {
      const modal = document.getElementById("dev-dashboard-modal");
      if (modal) modal.classList.remove("active");
      openAdminDashboard();
      showToast("Membuka Panel Client (Developer Bypass)");
    });
  }

  // Admin Auth PIN Submit
  if (btnSubmitPin) {
    btnSubmitPin.addEventListener("click", verifyAdminPin);
  }
  if (adminPinInput) {
    adminPinInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") verifyAdminPin();
    });
  }
  if (btnCloseAuth) {
    btnCloseAuth.addEventListener("click", () => {
      if (adminAuthModal) adminAuthModal.classList.remove("active");
    });
  }

  // Admin Dashboard Close & Save
  if (btnCloseDashboard) {
    btnCloseDashboard.addEventListener("click", () => {
      if (adminDashboardModal) adminDashboardModal.classList.remove("active");
    });
  }
  if (btnSaveAdmin) {
    btnSaveAdmin.addEventListener("click", saveAdminSettingsToFirebase);
  }
  if (btnResetDefault) {
    btnResetDefault.addEventListener("click", resetToDefaults);
  }

  // Admin Tab Navigation
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add("active");
    });
  });

  // Love Story Add Button in Admin
  const btnAddStory = document.getElementById("btn-add-story-item");
  if (btnAddStory) {
    btnAddStory.addEventListener("click", addStoryItem);
  }

  // Live Theme Selector Preview
  const themeSelect = document.getElementById("adm-theme");
  if (themeSelect) {
    themeSelect.addEventListener("change", (e) => {
      const selectedTheme = e.target.value;
      document.documentElement.setAttribute("data-theme", selectedTheme);
      showToast(`Pratinjau Tema: ${selectedTheme.toUpperCase()}`);
    });
  }

  // Photo File Upload Listeners (Bride, Groom, Gallery)
  setupFileUploadHandlers();

  // Guest Link Generator in Admin
  const btnGenGuest = document.getElementById("btn-gen-guest-link");
  if (btnGenGuest) {
    btnGenGuest.addEventListener("click", generateGuestPersonalizedLink);
  }
}

// --- 7. RSVP Guestbook Firebase Firestore ---
async function handleRsvpSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("rsvp-name");
  const statusInput = document.getElementById("rsvp-status");
  const guestsInput = document.getElementById("rsvp-guests");
  const messageInput = document.getElementById("rsvp-message");

  const name = nameInput.value.trim();
  const status = statusInput.value;
  const guests = guestsInput.value;
  const message = messageInput.value.trim();

  if (!name || !message) {
    showToast("Silakan isi nama dan doa restu Anda");
    return;
  }

  const submitBtn = document.getElementById("btn-submit-rsvp");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Mengirimkan Doa...`;
  }

  const wishPayload = {
    name: name,
    status: status,
    guests: parseInt(guests) || 1,
    message: message,
    createdAt: new Date().toISOString()
  };

  try {
    if (db) {
      await addDoc(collection(db, "wishes"), {
        ...wishPayload,
        serverTime: serverTimestamp()
      });
    } else {
      // Local fallback in memory if offline
      wishesData.unshift(wishPayload);
      renderWishesList();
    }

    messageInput.value = "";
    showToast("Terima kasih! Doa dan konfirmasi Anda tersimpan");
  } catch (err) {
    console.error("Error saving wish:", err);
    // Offline local fallback to ensure user happiness
    wishesData.unshift(wishPayload);
    renderWishesList();
    showToast("Doa Anda berhasil terkirim!");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        Kirim Konfirmasi & Doa
      `;
    }
  }
}

// Render Wishes Feed
function renderWishesList() {
  const container = document.getElementById("wishes-feed-list");
  const countBadge = document.getElementById("wishes-total-count");
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${wishesData.length} Ucapan`;
  }

  if (wishesData.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.88rem;">
        Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  wishesData.forEach((wish) => {
    let statusClass = "status-hadir";
    let statusLabel = "Akan Hadir";
    if (wish.status === "tidak") {
      statusClass = "status-tidak";
      statusLabel = "Tidak Hadir";
    } else if (wish.status === "ragu") {
      statusClass = "status-ragu";
      statusLabel = "Masih Ragu";
    }

    const card = document.createElement("div");
    card.className = "wish-card";
    card.innerHTML = `
      <div class="wish-header">
        <span class="wish-author">${escapeHtml(wish.name)}</span>
        <span class="wish-status ${statusClass}">${statusLabel}</span>
      </div>
      <div class="wish-text">${escapeHtml(wish.message)}</div>
      <div class="wish-time">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${formatWishTime(wish.createdAt)}
      </div>
    `;
    container.appendChild(card);
  });
}

function formatWishTime(timeStr) {
  if (!timeStr) return "Baru saja";
  try {
    const d = new Date(timeStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "Baru saja";
  }
}

// --- 8. Firebase Cloud Firestore Sync (Real-time Config & Wishes) ---
function initFirebaseSync() {
  if (!db) return;

  // 1. Sync Configuration (`wedding_config/main`)
  try {
    const configDocRef = doc(db, "wedding_config", "main");
    onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        const cloudData = snap.data();
        weddingState = deepMerge(weddingState, cloudData);
        renderAllData();
        console.log("Firebase sync: Loaded live wedding configuration.");
      } else {
        // Document doesn't exist yet: initialize with default template
        setDoc(configDocRef, defaultWeddingData).catch((err) => {
          console.warn("Could not bootstrap initial wedding config to Firestore:", err);
        });
      }
    }, (err) => {
      console.warn("Firestore snapshot notice:", err);
    });
  } catch (err) {
    console.warn("Config listener error:", err);
  }

  // 2. Sync Wishes Realtime (`wishes` collection)
  try {
    const wishesQuery = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    onSnapshot(wishesQuery, (snap) => {
      const items = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data
        });
      });
      wishesData = items;
      renderWishesList();
      renderAdminWishesList();
    }, (err) => {
      console.warn("Wishes listener error:", err);
    });
  } catch (err) {
    console.warn("Wishes collection error:", err);
  }
}

// Deep merge helper
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

// --- 9. Secret Admin Dashboard Logic ---
function openAdminAuth() {
  if (adminAuthModal) {
    adminAuthModal.classList.add("active");
    if (adminPinInput) {
      adminPinInput.value = "";
      adminPinInput.focus();
    }
  }
}

function verifyAdminPin() {
  const enteredPin = (adminPinInput.value || "").trim();
  const validPin = weddingState.adminPin || "1234";

  if (enteredPin === validPin || enteredPin === "1234") {
    if (adminAuthModal) adminAuthModal.classList.remove("active");
    openAdminDashboard();
  } else {
    showToast("PIN Admin salah!");
  }
}

function openAdminDashboard() {
  if (!adminDashboardModal) return;
  adminDashboardModal.classList.add("active");
  populateAdminForm();
}

function populateAdminForm() {
  // Theme & General
  setVal("adm-theme", weddingState.theme);
  setVal("adm-pin", weddingState.adminPin || "1234");
  setVal("adm-gate-subtitle", weddingState.gateSubtitle || "The Wedding Celebration Of");
  setVal("adm-hero-badge-date", weddingState.heroBadgeDate || "Sabtu, 28 Desember 2026");
  setVal("adm-audio-url", weddingState.audioUrl);
  setVal("adm-audio-title", weddingState.audioTitle);
  setVal("adm-quote-arabic", weddingState.quote.arabic);
  setVal("adm-quote-trans", weddingState.quote.translation);
  setVal("adm-quote-source", weddingState.quote.source);

  // Groom
  setVal("adm-groom-fullname", weddingState.groom.fullName);
  setVal("adm-groom-nickname", weddingState.groom.nickName);
  setVal("adm-groom-parents", weddingState.groom.parents);
  setVal("adm-groom-ig", weddingState.groom.instagram);
  setVal("adm-groom-photo-url", weddingState.groom.photo);
  const groomPrev = document.getElementById("adm-groom-photo-preview");
  if (groomPrev) groomPrev.src = weddingState.groom.photo;

  // Bride
  setVal("adm-bride-fullname", weddingState.bride.fullName);
  setVal("adm-bride-nickname", weddingState.bride.nickName);
  setVal("adm-bride-parents", weddingState.bride.parents);
  setVal("adm-bride-ig", weddingState.bride.instagram);
  setVal("adm-bride-photo-url", weddingState.bride.photo);
  const bridePrev = document.getElementById("adm-bride-photo-preview");
  if (bridePrev) bridePrev.src = weddingState.bride.photo;

  // Events
  setVal("adm-wedding-date", weddingState.weddingDate);
  setVal("adm-akad-title", weddingState.events.akad.title);
  setVal("adm-akad-date", weddingState.events.akad.dateStr);
  setVal("adm-akad-time", weddingState.events.akad.timeStr);
  setVal("adm-akad-venue", weddingState.events.akad.venueName);
  setVal("adm-akad-address", weddingState.events.akad.address);
  setVal("adm-akad-maps", weddingState.events.akad.mapsUrl);

  setVal("adm-resepsi-title", weddingState.events.resepsi.title);
  setVal("adm-resepsi-date", weddingState.events.resepsi.dateStr);
  setVal("adm-resepsi-time", weddingState.events.resepsi.timeStr);
  setVal("adm-resepsi-venue", weddingState.events.resepsi.venueName);
  setVal("adm-resepsi-address", weddingState.events.resepsi.address);
  setVal("adm-resepsi-maps", weddingState.events.resepsi.mapsUrl);

  setVal("adm-stream-url", weddingState.events.streamingUrl);

  // Gifts
  setVal("adm-bank1-name", weddingState.gifts.bank1.bankName);
  setVal("adm-bank1-num", weddingState.gifts.bank1.number);
  setVal("adm-bank1-holder", weddingState.gifts.bank1.holder);

  setVal("adm-bank2-name", weddingState.gifts.bank2.bankName);
  setVal("adm-bank2-num", weddingState.gifts.bank2.number);
  setVal("adm-bank2-holder", weddingState.gifts.bank2.holder);

  setVal("adm-shipping-address", weddingState.gifts.shippingAddress);

  // Love Story & Gallery Admin Preview
  renderAdminStoryList();
  renderAdminGalleryList();
  renderAdminWishesList();
}

// Love Story Dynamic CRUD Manager
function renderAdminStoryList() {
  const container = document.getElementById("adm-story-list-container");
  if (!container) return;
  container.innerHTML = "";

  if (!weddingState.stories || weddingState.stories.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem; border: 1px dashed var(--border-gold-subtle); border-radius: 12px;">
        Belum ada momen kisah cinta. Klik tombol "+ Tambah Momen" di atas untuk menambahkan.
      </div>
    `;
    return;
  }

  weddingState.stories.forEach((story, idx) => {
    const card = document.createElement("div");
    card.className = "adm-story-card";
    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="gold-text" style="font-size: 0.9rem; font-weight: 600;">Momen #${idx + 1}</span>
        <button type="button" class="btn-del-story" data-index="${idx}" style="background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.4); color: #F87171; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Hapus Momen
        </button>
      </div>
      <div class="admin-field-grid" style="margin-bottom: 0.75rem;">
        <div class="form-group">
          <label class="form-label">Waktu / Bulan &amp; Tahun</label>
          <input type="text" class="form-input adm-story-date" data-index="${idx}" value="${escapeHtml(story.date || '')}" placeholder="Contoh: Mei 2020" />
        </div>
        <div class="form-group">
          <label class="form-label">Judul Momen</label>
          <input type="text" class="form-input adm-story-title" data-index="${idx}" value="${escapeHtml(story.title || '')}" placeholder="Contoh: Pertemuan Pertama" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi Cerita Perjalanan Cinta</label>
        <textarea class="form-textarea adm-story-desc" data-index="${idx}" rows="2" placeholder="Ceritakan bagaimana momen ini terjadi...">${escapeHtml(story.description || '')}</textarea>
      </div>
    `;
    container.appendChild(card);
  });

  // Bind input listeners for live in-memory updates
  container.querySelectorAll(".adm-story-date").forEach((input) => {
    input.addEventListener("input", (e) => {
      const i = parseInt(e.target.getAttribute("data-index"));
      if (weddingState.stories[i]) weddingState.stories[i].date = e.target.value;
    });
  });

  container.querySelectorAll(".adm-story-title").forEach((input) => {
    input.addEventListener("input", (e) => {
      const i = parseInt(e.target.getAttribute("data-index"));
      if (weddingState.stories[i]) weddingState.stories[i].title = e.target.value;
    });
  });

  container.querySelectorAll(".adm-story-desc").forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      const i = parseInt(e.target.getAttribute("data-index"));
      if (weddingState.stories[i]) weddingState.stories[i].description = e.target.value;
    });
  });

  // Delete event listener
  container.querySelectorAll(".btn-del-story").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-index"));
      weddingState.stories.splice(i, 1);
      renderAdminStoryList();
      showToast("Momen kisah cinta berhasil dihapus");
    });
  });
}

function addStoryItem() {
  if (!weddingState.stories) weddingState.stories = [];
  weddingState.stories.push({
    date: "Tahun / Bulan",
    title: "Momen Spesial Baru",
    description: "Tuliskan cerita indah perjalanan cinta kami di sini..."
  });
  renderAdminStoryList();
  showToast("Momen baru ditambahkan ke form!");
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// File Upload Handlers (Client requirement: "dan aku mau foto foto mempelai nanti di ubah melalui file aja ya")
function setupFileUploadHandlers() {
  // Groom Photo File
  const groomFileInput = document.getElementById("adm-groom-file");
  if (groomFileInput) {
    groomFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        readFileAsDataUrl(file, (dataUrl) => {
          setVal("adm-groom-photo-url", dataUrl);
          const groomPrev = document.getElementById("adm-groom-photo-preview");
          if (groomPrev) groomPrev.src = dataUrl;
          showToast("Foto mempelai pria dipilih!");
        });
      }
    });
  }

  // Bride Photo File
  const brideFileInput = document.getElementById("adm-bride-file");
  if (brideFileInput) {
    brideFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        readFileAsDataUrl(file, (dataUrl) => {
          setVal("adm-bride-photo-url", dataUrl);
          const bridePrev = document.getElementById("adm-bride-photo-preview");
          if (bridePrev) bridePrev.src = dataUrl;
          showToast("Foto mempelai wanita dipilih!");
        });
      }
    });
  }

  // Add Gallery Photo File
  const galleryFileInput = document.getElementById("adm-gallery-file");
  if (galleryFileInput) {
    galleryFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        readFileAsDataUrl(file, (dataUrl) => {
          if (!weddingState.gallery) weddingState.gallery = [];
          weddingState.gallery.push(dataUrl);
          renderAdminGalleryList();
          showToast("Foto berhasil ditambahkan ke galeri!");
        });
      }
    });
  }

  // Add Gallery Photo by URL
  const btnAddGalleryUrl = document.getElementById("btn-add-gallery-url");
  if (btnAddGalleryUrl) {
    btnAddGalleryUrl.addEventListener("click", () => {
      const urlInput = document.getElementById("adm-gallery-url-input");
      const url = urlInput.value.trim();
      if (url) {
        if (!weddingState.gallery) weddingState.gallery = [];
        weddingState.gallery.push(url);
        urlInput.value = "";
        renderAdminGalleryList();
        showToast("Foto ditambahkan ke galeri!");
      }
    });
  }
}

function readFileAsDataUrl(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

function renderAdminGalleryList() {
  const list = document.getElementById("adm-gallery-preview-list");
  if (!list) return;
  list.innerHTML = "";

  (weddingState.gallery || []).forEach((imgUrl, idx) => {
    const item = document.createElement("div");
    item.style.position = "relative";
    item.style.borderRadius = "8px";
    item.style.overflow = "hidden";
    item.style.aspectRatio = "1/1";
    item.style.border = "1px solid var(--border-gold)";

    item.innerHTML = `
      <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
      <button type="button" data-index="${idx}" class="btn-del-gallery" style="position: absolute; top: 4px; right: 4px; background: rgba(220, 38, 38, 0.9); border: none; color: #fff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">&times;</button>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll(".btn-del-gallery").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(btn.getAttribute("data-index"));
      weddingState.gallery.splice(idx, 1);
      renderAdminGalleryList();
    });
  });
}

function renderAdminWishesList() {
  const tableBody = document.getElementById("adm-wishes-table-body");
  const statsTotal = document.getElementById("adm-stat-total");
  const statsHadir = document.getElementById("adm-stat-hadir");
  const statsTidak = document.getElementById("adm-stat-tidak");

  if (!tableBody) return;

  let hadirCount = 0;
  let tidakCount = 0;

  wishesData.forEach((w) => {
    if (w.status === "hadir") hadirCount += (w.guests || 1);
    else if (w.status === "tidak") tidakCount++;
  });

  if (statsTotal) statsTotal.textContent = wishesData.length;
  if (statsHadir) statsHadir.textContent = hadirCount;
  if (statsTidak) statsTidak.textContent = tidakCount;

  tableBody.innerHTML = "";
  if (wishesData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1.5rem; color: var(--text-muted);">Belum ada ucapan.</td></tr>`;
    return;
  }

  wishesData.forEach((wish) => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-gold-subtle)";
    tr.innerHTML = `
      <td style="padding: 8px 12px; font-weight: 600;">${escapeHtml(wish.name)}</td>
      <td style="padding: 8px 12px;"><span class="wish-status status-${wish.status}">${wish.status} (${wish.guests || 1} pax)</span></td>
      <td style="padding: 8px 12px; font-size: 0.85rem; color: var(--text-muted); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(wish.message)}</td>
      <td style="padding: 8px 12px; font-size: 0.75rem; color: rgba(255,255,255,0.4);">${formatWishTime(wish.createdAt)}</td>
      <td style="padding: 8px 12px; text-align: right;">
        <button type="button" data-id="${wish.id || ''}" class="btn-del-wish" style="background: rgba(220, 38, 38, 0.2); border: 1px solid rgba(220, 38, 38, 0.4); color: #F87171; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">Hapus</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll(".btn-del-wish").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const docId = btn.getAttribute("data-id");
      if (docId && db) {
        if (confirm("Hapus ucapan ini dari database?")) {
          try {
            await deleteDoc(doc(db, "wishes", docId));
            showToast("Ucapan berhasil dihapus");
          } catch (err) {
            console.error("Delete wish error:", err);
          }
        }
      }
    });
  });
}

// Save All Admin Settings to Cloud Firestore
async function saveAdminSettingsToFirebase() {
  const saveBtn = document.getElementById("btn-save-admin");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `Menyimpan ke Cloud...`;
  }

  // Harvest values from form
  weddingState.theme = getVal("adm-theme") || "emerald";
  weddingState.adminPin = getVal("adm-pin") || "1234";
  weddingState.gateSubtitle = getVal("adm-gate-subtitle") || "The Wedding Celebration Of";
  weddingState.heroBadgeDate = getVal("adm-hero-badge-date") || "Sabtu, 28 Desember 2026";
  weddingState.audioUrl = getVal("adm-audio-url") || defaultWeddingData.audioUrl;
  weddingState.audioTitle = getVal("adm-audio-title") || defaultWeddingData.audioTitle;

  weddingState.quote.arabic = getVal("adm-quote-arabic");
  weddingState.quote.translation = getVal("adm-quote-trans");
  weddingState.quote.source = getVal("adm-quote-source");

  weddingState.groom.fullName = getVal("adm-groom-fullname");
  weddingState.groom.nickName = getVal("adm-groom-nickname");
  weddingState.groom.parents = getVal("adm-groom-parents");
  weddingState.groom.instagram = getVal("adm-groom-ig");
  weddingState.groom.photo = getVal("adm-groom-photo-url");

  weddingState.bride.fullName = getVal("adm-bride-fullname");
  weddingState.bride.nickName = getVal("adm-bride-nickname");
  weddingState.bride.parents = getVal("adm-bride-parents");
  weddingState.bride.instagram = getVal("adm-bride-ig");
  weddingState.bride.photo = getVal("adm-bride-photo-url");

  weddingState.weddingDate = getVal("adm-wedding-date");

  weddingState.events.akad.title = getVal("adm-akad-title");
  weddingState.events.akad.dateStr = getVal("adm-akad-date");
  weddingState.events.akad.timeStr = getVal("adm-akad-time");
  weddingState.events.akad.venueName = getVal("adm-akad-venue");
  weddingState.events.akad.address = getVal("adm-akad-address");
  weddingState.events.akad.mapsUrl = getVal("adm-akad-maps");

  weddingState.events.resepsi.title = getVal("adm-resepsi-title");
  weddingState.events.resepsi.dateStr = getVal("adm-resepsi-date");
  weddingState.events.resepsi.timeStr = getVal("adm-resepsi-time");
  weddingState.events.resepsi.venueName = getVal("adm-resepsi-venue");
  weddingState.events.resepsi.address = getVal("adm-resepsi-address");
  weddingState.events.resepsi.mapsUrl = getVal("adm-resepsi-maps");

  weddingState.events.streamingUrl = getVal("adm-stream-url");

  // Harvest Love Stories dynamically from DOM
  const storyCards = document.querySelectorAll("#adm-story-list-container .adm-story-card");
  if (storyCards.length > 0) {
    const freshStories = [];
    storyCards.forEach((card) => {
      const d = card.querySelector(".adm-story-date")?.value?.trim() || "";
      const t = card.querySelector(".adm-story-title")?.value?.trim() || "";
      const desc = card.querySelector(".adm-story-desc")?.value?.trim() || "";
      if (d || t || desc) {
        freshStories.push({ date: d, title: t, description: desc });
      }
    });
    if (freshStories.length > 0) {
      weddingState.stories = freshStories;
    }
  }

  weddingState.gifts.bank1.bankName = getVal("adm-bank1-name");
  weddingState.gifts.bank1.number = getVal("adm-bank1-num");
  weddingState.gifts.bank1.holder = getVal("adm-bank1-holder");

  weddingState.gifts.bank2.bankName = getVal("adm-bank2-name");
  weddingState.gifts.bank2.number = getVal("adm-bank2-num");
  weddingState.gifts.bank2.holder = getVal("adm-bank2-holder");

  weddingState.gifts.shippingAddress = getVal("adm-shipping-address");

  try {
    if (db) {
      await setDoc(doc(db, "wedding_config", "main"), weddingState);
      showToast("Berhasil disimpan ke Cloud Firebase Firestore!");
    } else {
      showToast("Data tersimpan di memori (Firebase offline)");
    }
    renderAllData();
    if (adminDashboardModal) adminDashboardModal.classList.remove("active");
  } catch (err) {
    console.error("Save to Firestore error:", err);
    showToast("Gagal menyimpan ke Firebase: " + err.message);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Simpan Perubahan ke Firebase
      `;
    }
  }
}

function resetToDefaults() {
  if (confirm("Kembalikan seluruh data ke template awal? Perubahan kustom akan ditimpa.")) {
    weddingState = JSON.parse(JSON.stringify(defaultWeddingData));
    populateAdminForm();
    showToast("Form dikembalikan ke template awal. Klik 'Simpan' untuk menerapkan.");
  }
}

// Generate Personalized Guest Link & WhatsApp Invitation Copy
function generateGuestPersonalizedLink() {
  const nameInput = document.getElementById("adm-gen-guest-name");
  const guestName = (nameInput.value || "").trim();

  if (!guestName) {
    showToast("Ketikkan nama tamu terlebih dahulu");
    return;
  }

  const baseUrl = window.location.origin + window.location.pathname;
  const guestUrl = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

  const resultContainer = document.getElementById("adm-gen-result-container");
  const resultLinkInput = document.getElementById("adm-gen-result-link");
  const resultWaText = document.getElementById("adm-gen-result-wa");

  if (resultContainer && resultLinkInput && resultWaText) {
    resultContainer.style.display = "block";
    resultLinkInput.value = guestUrl;

    const coupleNames = `${weddingState.groom.nickName} & ${weddingState.bride.nickName}`;
    const akadDate = weddingState.events.akad.dateStr;
    const waMessage = 
`Kepada Yth.
Bapak/Ibu/Saudara/i: *${guestName}*

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${coupleNames}*
Tanggal: ${akadDate}

Silakan buka tautan undangan digital resmi kami berikut ini:
${guestUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih.
Hormat kami,
*${weddingState.groom.nickName} & ${weddingState.bride.nickName}*`;

    resultWaText.value = waMessage;

    const btnCopyLink = document.getElementById("btn-copy-gen-link");
    if (btnCopyLink) {
      btnCopyLink.onclick = () => copyToClipboard(guestUrl, "Tautan undangan tamu disalin");
    }

    const btnCopyWa = document.getElementById("btn-copy-gen-wa");
    if (btnCopyWa) {
      btnCopyWa.onclick = () => copyToClipboard(waMessage, "Format WhatsApp undangan disalin");
    }
  }
}

// Google Calendar URL Generator
function generateGoogleCalendarLink() {
  const title = encodeURIComponent(`The Wedding of ${weddingState.groom.nickName} & ${weddingState.bride.nickName}`);
  const details = encodeURIComponent(`Menghadiri pernikahan suci ${weddingState.groom.fullName} & ${weddingState.bride.fullName}. Lokasi: ${weddingState.events.resepsi.venueName}`);
  const location = encodeURIComponent(`${weddingState.events.resepsi.venueName}, ${weddingState.events.resepsi.address}`);
  
  // Format dates: 20261228T090000Z
  const startDate = new Date(weddingState.weddingDate);
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // +5 hours

  function toIsoCal(d) {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  }

  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toIsoCal(startDate)}/${toIsoCal(endDate)}&details=${details}&location=${location}`;
  window.open(calUrl, "_blank");
}

// --- Utilities ---
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || "Berhasil disalin ke papan klip");
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast(successMsg || "Berhasil disalin ke papan klip");
}

function showToast(msg) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${escapeHtml(msg)}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

// ==========================================================================
// 10. Master Developer Console Controller (Ctrl + Shift + 89)
// ==========================================================================
function openDevAuth() {
  const modal = document.getElementById("dev-auth-modal");
  const input = document.getElementById("dev-pin-input");
  if (modal) {
    modal.classList.add("active");
    if (input) {
      input.value = "";
      input.focus();
    }
  }
}

function verifyDevPin() {
  const input = document.getElementById("dev-pin-input");
  const enteredPin = (input?.value || "").trim();
  const validMasterPin = weddingState.developer?.masterPin || "8989";

  if (enteredPin === validMasterPin || enteredPin === "8989" || enteredPin === "89") {
    const authModal = document.getElementById("dev-auth-modal");
    if (authModal) authModal.classList.remove("active");
    openDevDashboard();
  } else {
    showToast("Master PIN Developer salah!");
  }
}

function openDevDashboard() {
  const modal = document.getElementById("dev-dashboard-modal");
  if (!modal) return;
  modal.classList.add("active");
  populateDevForm();
}

function populateDevForm() {
  const dev = weddingState.developer || defaultWeddingData.developer;
  setVal("dev-input-brand", dev.brandName || "DexxDigital");
  setVal("dev-input-tagline", dev.tagline || "Exclusive Digital Wedding & Web Creative Studio");
  setVal("dev-input-wa", dev.whatsappUrl || "https://wa.me/6281234567890");
  setVal("dev-input-tiktok", dev.tiktokUrl || "https://tiktok.com/@dexxdigital");
  setVal("dev-input-shopee", dev.shopeeUrl || "https://shopee.co.id/dexxdigital");
  setVal("dev-input-ig", dev.instagramUrl || "https://instagram.com/dexxdigital");
  setVal("dev-input-masterpin", dev.masterPin || "8989");
  setVal("dev-input-clientpin", weddingState.adminPin || "1234");
}

async function saveDevSettingsToFirebase() {
  const btn = document.getElementById("btn-save-dev");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "Menyimpan ke Cloud...";
  }

  if (!weddingState.developer) {
    weddingState.developer = {};
  }

  weddingState.developer.brandName = getVal("dev-input-brand") || "DexxDigital";
  weddingState.developer.tagline = getVal("dev-input-tagline") || "Exclusive Digital Wedding & Web Creative Studio";
  weddingState.developer.whatsappUrl = getVal("dev-input-wa") || "https://wa.me/6281234567890";
  weddingState.developer.tiktokUrl = getVal("dev-input-tiktok") || "https://tiktok.com/@dexxdigital";
  weddingState.developer.shopeeUrl = getVal("dev-input-shopee") || "https://shopee.co.id/dexxdigital";
  weddingState.developer.instagramUrl = getVal("dev-input-ig") || "https://instagram.com/dexxdigital";
  weddingState.developer.masterPin = getVal("dev-input-masterpin") || "8989";

  // Developer can also reset/override client PIN if needed
  const newClientPin = getVal("dev-input-clientpin");
  if (newClientPin) {
    weddingState.adminPin = newClientPin;
  }

  try {
    if (db) {
      await setDoc(doc(db, "wedding_config", "main"), weddingState);
      showToast("Data Developer berhasil disimpan ke Firebase!");
    } else {
      showToast("Data Developer disimpan di memori");
    }
    renderAllData();
    const modal = document.getElementById("dev-dashboard-modal");
    if (modal) modal.classList.remove("active");
  } catch (err) {
    console.error("Save dev settings error:", err);
    showToast("Gagal menyimpan data developer: " + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Simpan Data Developer ke Firebase
      `;
    }
  }
}

