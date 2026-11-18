/*
 * EDITABLE INVITATION CONTENT
 * Update this object to change all names, dates, venues, map links, and the audio source.
 */
const invitation = {
  brideName: "Gayathri Harikrishnakumar",
  brideShort: "Gayathri",
  groomName: "Sreehari C M",
  groomShort: "Sreehari",
  weddingDate: "2026-12-31T11:00:00+05:30",
  weddingDateShort: "31 · 12 · 2026",
  weddingDateDisplay: "Thursday, 31 December 2026",
  weddingTime: "Muhurtham · 11:00 AM – 11:50 AM",
  weddingVenue: "Preethi Convention Center",
  weddingAddress: "Near Municipal Court, Perungala, Erezha South, Mavelikara · 690106",
  weddingMap: "https://maps.app.goo.gl/mU3XvPQaTmunUNsTA",
  receptionVenue: "RDR Convention Centre",
  receptionAddress: "Kochar Road, Edapazhanji, Thiruvananthapuram",
  receptionMap: "https://maps.app.goo.gl/KBGxHoSFVMAB5ZX67",
  audio: "assets/wedding-melody.mp3"
};

document.querySelectorAll("[data-field]").forEach((element) => {
  const value = invitation[element.dataset.field];
  if (value) element.textContent = value;
});
document.querySelectorAll("[data-link]").forEach((element) => {
  const value = invitation[element.dataset.link];
  if (value) element.href = value;
});
document.title = `${invitation.brideShort} & ${invitation.groomShort} | Wedding Invitation`;

const body = document.body;
const opening = document.getElementById("opening");
const openInvite = document.getElementById("openInvite");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
body.classList.add("locked");
music.querySelector("source").src = invitation.audio;
music.load();

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  musicLabel.textContent = isPlaying ? "Pause" : "Music";
}
async function playMusic() {
  try { await music.play(); setMusicState(true); } catch { setMusicState(false); }
}
openInvite.addEventListener("click", () => {
  openInvite.disabled = true;
  opening.classList.add("entering");
  playMusic();
  setTimeout(() => {
    opening.classList.add("opened");
    body.classList.remove("locked");
    document.getElementById("welcome").focus?.();
  }, 1650);
});
musicToggle.addEventListener("click", () => {
  if (music.paused) playMusic();
  else { music.pause(); setMusicState(false); }
});
music.addEventListener("ended", () => setMusicState(false));

// Scratch-to-reveal interaction
const canvas = document.getElementById("scratchCanvas");
const scratchWrap = document.getElementById("scratchWrap");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
let drawing = false;
let revealed = false;
function sizeScratchCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const fill = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  fill.addColorStop(0, "#b5812f"); fill.addColorStop(.45, "#efce77"); fill.addColorStop(1, "#a87326");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = fill; ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.strokeStyle = "rgba(255,246,207,.65)"; ctx.lineWidth = 1;
  for (let x = -rect.height; x < rect.width; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + rect.height, rect.height); ctx.stroke(); }
  ctx.fillStyle = "rgba(51,43,17,.92)"; ctx.font = "600 10px Arial"; ctx.textAlign = "center"; ctx.letterSpacing = "2px";
  ctx.fillText("REVEAL THE DATE", rect.width / 2, rect.height / 2 + 4);
}
function scratchAt(event) {
  const rect = canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = point.clientX - rect.left; const y = point.clientY - rect.top;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath(); ctx.arc(x, y, 29, 0, Math.PI * 2); ctx.fill();
  checkReveal();
}
function checkReveal() {
  if (revealed) return;
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let cleared = 0;
  for (let i = 3; i < pixels.length; i += 16) if (pixels[i] < 50) cleared++;
  if (cleared / (pixels.length / 16) > .33) finishScratch();
}
function finishScratch() {
  revealed = true; scratchWrap.classList.add("is-revealed");
  canvas.style.transition = "opacity 900ms ease"; canvas.style.opacity = "0";
  canvas.style.pointerEvents = "none"; scatterPetals();
}
canvas.addEventListener("pointerdown", (event) => { drawing = true; canvas.setPointerCapture?.(event.pointerId); scratchAt(event); });
canvas.addEventListener("pointermove", (event) => { if (drawing) scratchAt(event); });
canvas.addEventListener("pointerup", () => drawing = false);
canvas.addEventListener("pointercancel", () => drawing = false);
sizeScratchCanvas(); window.addEventListener("resize", () => { if (!revealed) sizeScratchCanvas(); });

function scatterPetals() {
  const layer = document.querySelector(".petal-layer");
  for (let i = 0; i < 34; i++) {
    const petal = document.createElement("i"); petal.className = "petal";
    petal.style.setProperty("--x", `${Math.random() * 100}vw`);
    petal.style.setProperty("--r", `${Math.random() * 360}deg`);
    petal.style.setProperty("--drift", `${(Math.random() - .5) * 220}px`);
    petal.style.setProperty("--d", `${2.7 + Math.random() * 2.3}s`);
    petal.style.animationDelay = `${Math.random() * .7}s`; layer.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}

// Countdown
const targetDate = new Date(invitation.weddingDate).getTime();
function updateCountdown() {
  const remaining = Math.max(0, targetDate - Date.now());
  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  document.getElementById("countDays").textContent = String(days).padStart(3, "0");
  document.getElementById("countHours").textContent = String(Math.floor(seconds % 86400 / 3600)).padStart(2, "0");
  document.getElementById("countMinutes").textContent = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
  document.getElementById("countSeconds").textContent = String(seconds % 60).padStart(2, "0");
}
updateCountdown(); setInterval(updateCountdown, 1000);

// Scroll-in motion
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), { threshold:.12 });
document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
