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

document.getElementById("percent2").textContent = asilimia + "%";
document.getElementById("donut").style.setProperty("--p", asilimia);

console.log("Dashboard imepakiwa. Asilimia ya lengo: " + asilimia + "%");
