// Michango Manager — app.js
// Session 3: hesabu yetu ya kwanza! (preview ya Session 6 — Programming)

// Data ya kubuni (session ya database itaileta halisi kutoka Supabase)
const lengo = 5000000; // TZS — lengo la tukio
const iliyokusanywa = 3250000; // TZS — jumla ya malipo

// FR-F1: asilimia ya lengo iliyofikiwa
const asilimia = Math.round((iliyokusanywa / lengo) * 100);

// Onyesha kwenye ukurasa
document.getElementById("percent").textContent = asilimia + "%";
document.getElementById("barFill").style.width = asilimia + "%";

//document.getElementById("percent2").textContent = asilimia + "%";
//document.getElementById("percent").textContent = asilimia + "%";

// Subiri frame moja ya kwanza (donut ikiwa 0), kisha jaza — transition inachukua kazi
// Animation: 0 → asilimia, namba na donut vinapanda pamoja
const muda = 1200; // ms
const percentEl = document.getElementById("percent2");
const donutEl = document.getElementById("donut");

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3); // inaanza kasi, inafika taratibu
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let anza = null;

function panda(sasa) {
  if (anza === null) anza = sasa; // saa inaanza frame ya KWANZA inayoonekana

  const t = Math.min((sasa - anza) / muda, 1);
  const value = Math.round(easeInOut(t) * asilimia);

  percentEl.textContent = value + "%";
  donutEl.style.setProperty("--p", value);

  if (t < 1) requestAnimationFrame(panda);
}

requestAnimationFrame(panda);
console.log("Dashboard imepakiwa. Asilimia ya lengo: " + asilimia + "%");
