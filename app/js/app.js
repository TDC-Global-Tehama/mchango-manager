// ============================================================
// Michango Manager — app.js
// Session 7: Login na usalama halisi (FR-A1, FR-A2, NFR-3)
// ============================================================

const EVENT_ID = "a0000000-0000-0000-0000-000000000001";

// Tunahifadhi wachangiaji hapa ili sehemu mbalimbali za app
// (jedwali, dropdown, hesabu) zizitumie bila kuuliza database tena.
let wachangiajiWote = [];


// ============================================================
// SEHEMU 1 — KULETA DATA (kutoka Session 5)
// ============================================================
async function letaData() {
  // .maybeSingle() badala ya .single():
  // ".single()" inarudisha KOSA kama hakuna row.
  // ".maybeSingle()" inarudisha null kwa utulivu — na baada ya
  // RLS, "hakuna row" ni jibu la kawaida kabisa: tukio lipo,
  // lakini siyo lako.
  const { data: tukio, error: e1 } = await db
    .from("events")
    .select("*")
    .eq("id", EVENT_ID)
    .maybeSingle();

  if (e1) {
    console.error("Kosa la kuleta tukio:", e1);
    return null;
  }

  const { data: wachangiaji, error: e2 } = await db
    .from("contributors")
    .select(`
      id,
      jina,
      simu,
      pledges ( kiasi ),
      payments ( kiasi ),
      in_kind ( maelezo )
    `)
    .eq("event_id", EVENT_ID)
    .order("jina");

  if (e2) {
    console.error("Kosa la kuleta wachangiaji:", e2);
    return null;
  }

  return { tukio, wachangiaji };
}


// ============================================================
// SEHEMU 2 — HESABU (kila function na kazi MOJA)
// ============================================================

function jumlaYaMalipo(mchangiaji) {
  return mchangiaji.payments.reduce((jumla, m) => jumla + Number(m.kiasi), 0);
}

// FR-E3: balance = ahadi − jumla ya malipo
function calculateBalance(mchangiaji) {
  const ahadi = Number(mchangiaji.pledges?.[0]?.kiasi ?? 0);
  return ahadi - jumlaYaMalipo(mchangiaji);
}

// FR-F2 + FR-H3: status ya mchangiaji
function statusYake(mchangiaji) {
  const ahadi = Number(mchangiaji.pledges?.[0]?.kiasi ?? 0);
  const amelipa = jumlaYaMalipo(mchangiaji);
  const balance = ahadi - amelipa;
  const vitu = mchangiaji.in_kind.map(k => k.maelezo).join(", ");

  // Hakuna ahadi, hakuna malipo, lakini amechangia VITU (FR-H1)
  if (ahadi === 0 && amelipa === 0 && vitu) {
    return { badge: "inkind", maandishi: vitu + " (vitu) 🎁" };
  }

  // Amelipa BILA kuahidi (FR-D3) — hakuna balance ya kuzungumzia.
  // Bug tuliyoigundua darasani: bila tawi hili, mtu huyu alionyeshwa
  // "Balance -50,000" — balance hasi haina maana!
  if (ahadi === 0 && amelipa > 0) {
    return {
      badge: "paid",
      maandishi: "Amechangia " + fedha(amelipa) + (vitu ? " + " + vitu + " 🎁" : "")
    };
  }

  if (ahadi > 0 && balance <= 0) {
    return { badge: "paid", maandishi: "Amelipa yote" };
  }
  if (amelipa > 0) {
    return { badge: "partial", maandishi: "Balance " + fedha(balance) };
  }
  return { badge: "unpaid", maandishi: "Hajalipa" };
}

function fedha(n) {
  return Number(n).toLocaleString("en-US");
}


// ============================================================
// SEHEMU 3 — KUONYESHA
// ============================================================

function onyeshaTukio(tukio) {
  document.getElementById("eventName").textContent =
    tukio.jina + (tukio.tarehe ? " — " + tukio.tarehe : "");
}

function onyeshaCards(tukio, wachangiaji) {
  const iliyokusanywa = wachangiaji.reduce(
    (jumla, m) => jumla + jumlaYaMalipo(m), 0
  );
  const lengo = Number(tukio.lengo_la_fedha);

  document.getElementById("collected").textContent = "TZS " + fedha(iliyokusanywa);
  document.getElementById("target").textContent = "TZS " + fedha(lengo);

  const asilimia = lengo > 0 ? Math.round((iliyokusanywa / lengo) * 100) : 0;
  animateDonut(asilimia);
}

function onyeshaJedwali(wachangiaji) {
  const tbody = document.getElementById("contributorRows");
  tbody.innerHTML = "";

  wachangiaji.forEach(m => {
    const ahadi = Number(m.pledges?.[0]?.kiasi ?? 0);
    const amelipa = jumlaYaMalipo(m);
    const st = statusYake(m);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.jina}</td>
      <td>${ahadi > 0 ? fedha(ahadi) : "—"}</td>
      <td>${amelipa > 0 ? fedha(amelipa) : (ahadi > 0 ? "0" : "—")}</td>
      <td><span class="badge ${st.badge}">${st.maandishi}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// MPYA Session 6: kujaza dropdown ya form kutoka database
function jazaDropdown(wachangiaji) {
  const select = document.getElementById("mchangiaji");
  const iliyochaguliwa = select.value;          // kumbuka aliyechaguliwa

  select.innerHTML = '<option value="">-- Chagua mchangiaji --</option>';

  wachangiaji.forEach(m => {
    const option = document.createElement("option");
    option.value = m.id;                        // uuid inakwenda database
    option.textContent = m.jina;                // jina linaonekana kwa mtumiaji
    select.appendChild(option);
  });

  select.value = iliyochaguliwa;                // rudisha chaguo lake
}


// ============================================================
// SEHEMU 4 — ANIMATION YA DONUT
// ============================================================
function animateDonut(asilimia) {
  const muda = 1200;
  const percentEl = document.getElementById("percent");
  const donutEl = document.getElementById("donut");

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  let anza = null;

  function panda(sasa) {
    if (anza === null) anza = sasa;
    const t = Math.min((sasa - anza) / muda, 1);
    const value = Math.round(easeOut(t) * asilimia);

    percentEl.textContent = value + "%";
    donutEl.style.setProperty("--p", value);

    if (t < 1) requestAnimationFrame(panda);
  }

  requestAnimationFrame(panda);
}


// ============================================================
// SEHEMU 5 — FORM: KUSOMA, KU-VALIDATE, KUHIFADHI  (MPYA!)
// ============================================================

// ------------------------------------------------------------
// 5a. VALIDATION — kuangalia kabla ya kutuma
// ------------------------------------------------------------
// Function hii inarudisha:
//   null              = kila kitu ni sawa
//   "ujumbe wa kosa"  = kuna tatizo
//
// Kanuni: validation MOJA kwa kila sharti, na ujumbe unaoeleweka
// kwa mtumiaji — siyo "Error 400".
function angaliaMalipo(malipo) {
  if (!malipo.contributor_id) {
    return { ujumbe: "Tafadhali chagua mchangiaji.", sehemu: "mchangiaji" };
  }

  if (!malipo.kiasi || Number.isNaN(malipo.kiasi)) {
    return { ujumbe: "Tafadhali andika kiasi.", sehemu: "kiasi" };
  }

  if (malipo.kiasi <= 0) {
    return { ujumbe: "Kiasi lazima kiwe zaidi ya sifuri.", sehemu: "kiasi" };
  }

  if (!malipo.tarehe) {
    return { ujumbe: "Tafadhali chagua tarehe.", sehemu: "tarehe" };
  }

  const njiaHalali = ["cash", "mpesa", "benki"];
  if (!njiaHalali.includes(malipo.njia)) {
    return { ujumbe: "Tafadhali chagua njia ya malipo.", sehemu: "njia" };
  }

  return null;   // hakuna kosa
}

// ------------------------------------------------------------
// 5b. HOMEWORK: kuonyesha kosa kwenye SEHEMU yenyewe (nyekundu)
// ------------------------------------------------------------
// Sehemu zote za form — tunazihifadhi mahali pamoja ili tusirudie
// majina kila mara (na tukiongeza sehemu mpya, tunabadilisha hapa tu).
const SEHEMU_ZOTE = ["mchangiaji", "kiasi", "tarehe", "njia", "kumbukumbu"];

function safishaMakosa() {
  SEHEMU_ZOTE.forEach(id => {
    document.getElementById(id).classList.remove("makosa");
  });
}

function wekaKosa(sehemu) {
  const el = document.getElementById(sehemu);
  el.classList.add("makosa");
  el.focus();
}

// HOMEWORK: kurudisha form yote mwanzo baada ya kuhifadhi
function safishaForm() {
  document.getElementById("mchangiaji").value = "";
  document.getElementById("kiasi").value = "";
  document.getElementById("njia").value = "";
  document.getElementById("kumbukumbu").value = "";
  tarehYaLeo();
  safishaMakosa();
}

// ------------------------------------------------------------
// 5c. Kuonyesha ujumbe wa juu (kosa au mafanikio)
// ------------------------------------------------------------
function onyeshaUjumbe(maandishi, aina) {
  const el = document.getElementById("ujumbe");
  el.textContent = maandishi;
  el.className = "ujumbe " + (aina || "");      // aina: "kosa" au "mafanikio"
}

// ------------------------------------------------------------
// 5d. Kuhifadhi malipo kwenye database (FR-E1)
// ------------------------------------------------------------
async function hifadhiMalipo(malipo) {
  const { data, error } = await db
    .from("payments")
    .insert(malipo)
    .select();            // .select() inaturudishia row iliyohifadhiwa

  return { data, error };
}

// ------------------------------------------------------------
// 5e. Kinachotokea mtu anapobonyeza "Hifadhi Malipo"
// ------------------------------------------------------------
async function tumaForm(tukio) {
  tukio.preventDefault();          // zuia browser kupakia ukurasa upya

  const btn = document.getElementById("btnHifadhi");

  // 1. SOMA thamani kutoka form
  const malipo = {
    contributor_id: document.getElementById("mchangiaji").value,
    kiasi: Number(document.getElementById("kiasi").value),
    tarehe: document.getElementById("tarehe").value,
    njia: document.getElementById("njia").value,
    kumbukumbu: document.getElementById("kumbukumbu").value.trim() || null
  };

  // 2. ANGALIA (validation)
  safishaMakosa();                 // ondoa nyekundu za jaribio lililopita
  const kosa = angaliaMalipo(malipo);
  if (kosa) {
    onyeshaUjumbe(kosa.ujumbe, "kosa");
    wekaKosa(kosa.sehemu);
    return;                        // simama hapa — hatutumi chochote
  }

  // 3. TUMA — na zuia mtu kubonyeza mara mbili akiwa anasubiri
  btn.disabled = true;
  onyeshaUjumbe("Inahifadhi...", "");

  const { error } = await hifadhiMalipo(malipo);

  btn.disabled = false;

  // 4. JIBU
  if (error) {
    console.error("Kosa la kuhifadhi:", error);
    onyeshaUjumbe("Imeshindikana kuhifadhi: " + error.message, "kosa");
    return;
  }

  onyeshaUjumbe(
    "Imehifadhiwa! TZS " + fedha(malipo.kiasi) + " imerekodiwa. ✅",
    "mafanikio"
  );

  // 5. SAFISHA form yote (mchangiaji, kiasi, njia, tarehe, kumbukumbu)
  safishaForm();

  // 6. PAKIA UPYA — dashboard nzima inajibu bila ku-refresh ukurasa
  await anzisha();
}


// ============================================================
// SEHEMU 6 — KUANZISHA
// ============================================================
async function anzisha() {
  const data = await letaData();

  if (!data) {
    document.getElementById("eventName").textContent =
      "Imeshindikana kupata data — angalia Console (F12)";
    return;
  }

  // Umeingia, lakini database haikukupa tukio lolote.
  // Siyo kosa — ni RLS ikifanya kazi: tukio si lako. (NFR-3)
  if (!data.tukio) {
    document.getElementById("eventName").textContent =
      "Huna tukio lolote — database haikutoa data yoyote kwako.";
    document.getElementById("collected").textContent = "TZS 0";
    document.getElementById("target").textContent = "TZS 0";
    document.getElementById("contributorRows").innerHTML = "";
    jazaDropdown([]);
    animateDonut(0);
    return;
  }

  wachangiajiWote = data.wachangiaji;

  onyeshaTukio(data.tukio);
  onyeshaCards(data.tukio, data.wachangiaji);
  onyeshaJedwali(data.wachangiaji);
  jazaDropdown(data.wachangiaji);
}

// Weka tarehe ya leo kwenye form (default nzuri kwa mtumiaji)
function tarehYaLeo() {
  const leo = new Date().toISOString().split("T")[0];   // "2026-09-25"
  document.getElementById("tarehe").value = leo;
}

// Unganisha form na function yetu
document.getElementById("paymentForm").addEventListener("submit", tumaForm);


// ============================================================
// SEHEMU 7 — LOGIN NA USALAMA  (MPYA Session 7)
// ============================================================

// ------------------------------------------------------------
// 7a. Kuonyesha skrini sahihi
// ------------------------------------------------------------
function onyeshaLogin() {
  document.getElementById("loginScreen").hidden = false;
  document.getElementById("appScreen").hidden = true;
}

async function onyeshaApp(mtumiaji) {
  document.getElementById("loginScreen").hidden = true;
  document.getElementById("appScreen").hidden = false;
  document.getElementById("mtumiajiEmail").textContent = mtumiaji.email;

  tarehYaLeo();
  await anzisha();
}

// ------------------------------------------------------------
// 7b. Je, kuna mtu ameingia tayari? (FR-A1)
// ------------------------------------------------------------
// Supabase inahifadhi session kwenye browser. Ukirefresh ukurasa,
// hutakiwi kuingia tena — na hiyo ndiyo tabia tunayoitegemea
// kwenye app zote tunazozitumia.
async function angaliaSession() {
  const { data } = await db.auth.getSession();

  if (data.session) {
    await onyeshaApp(data.session.user);
  } else {
    onyeshaLogin();
  }
}

// ------------------------------------------------------------
// 7c. Kuingia
// ------------------------------------------------------------
async function ingia(tukio) {
  tukio.preventDefault();

  const btn = document.getElementById("loginBtn") || document.getElementById("btnIngia");
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  safishaMakosaYaLogin();

  const email = emailEl.value.trim();
  const password = passEl.value;

  // Validation ile ile tuliyoijifunza Session 6
  if (!email) return kosaLaLogin("Andika email yako.", emailEl);
  if (!password) return kosaLaLogin("Andika password yako.", passEl);

  btn.disabled = true;
  onyeshaUjumbeWaLogin("Inaingia...", "");

  const { data, error } = await db.auth.signInWithPassword({ email, password });

  btn.disabled = false;

  if (error) {
    // HATUSEMI "email haipo" wala "password si sahihi" peke yake.
    // Ukimwambia mtu "email ipo lakini password si sahihi",
    // umemthibitishia kwamba akaunti ipo — hilo ni msaada kwa
    // anayejaribu kuvunja.
    console.error("Kosa la kuingia:", error);
    return kosaLaLogin("Email au password si sahihi.", passEl);
  }

  // Safisha form (password isibaki kwenye skrini)
  emailEl.value = "";
  passEl.value = "";
  onyeshaUjumbeWaLogin("", "");

  await onyeshaApp(data.user);
}

// ------------------------------------------------------------
// 7d. Kutoka
// ------------------------------------------------------------
async function toka() {
  await db.auth.signOut();
  location.reload();     // njia safi zaidi ya kufuta kila kitu
}

// ------------------------------------------------------------
// 7e. Vipande vidogo vya skrini ya login
// ------------------------------------------------------------
function onyeshaUjumbeWaLogin(maandishi, aina) {
  const el = document.getElementById("loginUjumbe");
  el.textContent = maandishi;
  el.className = "ujumbe " + (aina || "");
}

function kosaLaLogin(ujumbe, sehemu) {
  onyeshaUjumbeWaLogin(ujumbe, "kosa");
  if (sehemu) {
    sehemu.classList.add("makosa");
    sehemu.focus();
  }
}

function safishaMakosaYaLogin() {
  ["email", "password"].forEach(id => {
    document.getElementById(id).classList.remove("makosa");
  });
}

// ------------------------------------------------------------
// 7f. Kuunganisha
// ------------------------------------------------------------
document.getElementById("loginForm").addEventListener("submit", ingia);
document.getElementById("btnToka").addEventListener("click", toka);

angaliaSession();