// ============================================================
// Michango Manager — app.js
// Session 8: Mfumo wako mwenyewe
//   • Kujisajili (FR-A1)
//   • Kufungua tukio lako (FR-B1)
//   • Kuongeza wachangiaji na ahadi zao (FR-C1, FR-D1)
// ============================================================

// ------------------------------------------------------------
// EVENT_ID imeondoka! 🎉
// ------------------------------------------------------------
// Session 5 tuliandika:
//     const EVENT_ID = "a0000000-0000-...";
//
// Ilikuwa "scaffolding" — mbao za muda zinazosaidia ujenzi kisha
// zinaondolewa. Ilitutumikia sessions tatu, lakini sasa kila
// mtumiaji ana matukio YAKE, kwa hiyo uuid moja iliyoandikwa
// kwenye code haina maana tena.
//
// Badala yake, app inauliza: "matukio ya mtumiaji huyu ni yapi?"
let tukioId = null;          // tukio tunalolitazama sasa
let matukioYangu = [];       // matukio yote ya mtumiaji
let wachangiajiWote = [];

const TUKIO_KUMBUKUMBU = "michango:tukio";   // tukio alilochagua mwisho


// ============================================================
// SEHEMU 1 — KULETA DATA
// ============================================================

// MPYA Session 8: leta matukio YANGU.
// Angalia: hakuna ".eq('user_id', ...)" hapa — RLS tuliyoiweka
// Session 7 ndiyo inayochuja. Database inatoa yangu tu.
async function letaMatukio() {
  const { data, error } = await db
    .from("events")
    .select("*")
    .order("tarehe", { ascending: false });

  if (error) {
    console.error("Kosa la kuleta matukio:", error);
    return [];
  }
  return data;
}

async function letaData() {
  const { data: tukio, error: e1 } = await db
    .from("events")
    .select("*")
    .eq("id", tukioId)
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
    .eq("event_id", tukioId)
    .order("jina");

  if (e2) {
    console.error("Kosa la kuleta wachangiaji:", e2);
    return null;
  }

  return { tukio, wachangiaji };
}


// ============================================================
// SEHEMU 2 — HESABU (hazijabadilika)
// ============================================================

// ------------------------------------------------------------
// Kusoma ahadi — na somo moja la Supabase
// ------------------------------------------------------------
// Tuliandika "m.pledges?.[0]?.kiasi" tukidhani pledges ni ARRAY.
// Lakini kwenye schema yetu, pledges.contributor_id ina "unique":
// mchangiaji ana ahadi MOJA tu. Supabase ikiona "unique", inatambua
// uhusiano kama one-to-one na inarudisha OBJECT badala ya array:
//
//     pledges:  { kiasi: 500000 }      <- object (ina unique)
//     payments: [ { kiasi: 50000 } ]   <- array  (haina unique)
//
// Ndiyo maana malipo yalionekana lakini ahadi hapana. Data ilikuwepo,
// policy ilikuwa sawa — code yetu ndiyo iliyokuwa ikiisoma vibaya.
//
// Function hii inasoma vyovyote vile, ili code isitegemee jambo
// tunaloweza kulisahau.
function ahadiYake(mchangiaji) {
  const p = mchangiaji.pledges;
  if (!p) return 0;
  if (Array.isArray(p)) return Number(p[0]?.kiasi ?? 0);
  return Number(p.kiasi ?? 0);
}

function jumlaYaMalipo(mchangiaji) {
  const p = mchangiaji.payments;
  if (!p) return 0;
  const orodha = Array.isArray(p) ? p : [p];
  return orodha.reduce((jumla, m) => jumla + Number(m.kiasi), 0);
}

function vituVyake(mchangiaji) {
  const k = mchangiaji.in_kind;
  if (!k) return [];
  return Array.isArray(k) ? k : [k];
}

function calculateBalance(mchangiaji) {
  return ahadiYake(mchangiaji) - jumlaYaMalipo(mchangiaji);
}

function statusYake(mchangiaji) {
  const ahadi = ahadiYake(mchangiaji);
  const amelipa = jumlaYaMalipo(mchangiaji);
  const balance = ahadi - amelipa;
  const vitu = vituVyake(mchangiaji).map(k => k.maelezo).join(", ");

  if (ahadi === 0 && amelipa === 0 && vitu) {
    return { badge: "inkind", maandishi: vitu + " (vitu) 🎁" };
  }
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
  return { badge: "unpaid", maandishi: vitu ? "Ana vitu, fedha bado" : "Hajaanza" };
}

function fedha(n) {
  return Number(n).toLocaleString("en-US");
}

function tareheYaLeo() {
  return new Date().toISOString().split("T")[0];
}


// ============================================================
// SEHEMU 3 — VIPANDE VIDOGO VINAVYOTUMIKA KILA MAHALI
// ============================================================
// Session 8 tumezifanya hizi ziwe za jumla, kwa sababu sasa
// tuna forms NNE (login, malipo, tukio, mchangiaji) badala ya
// moja. Function moja inayotumika sehemu nne ni bora kuliko
// function nne zinazofanana.

function onyesha(id) { document.getElementById(id).hidden = false; }
function ficha(id)   { document.getElementById(id).hidden = true; }


// ------------------------------------------------------------
// MENEJA WA FOMU — fomu MOJA kwa wakati
// ------------------------------------------------------------
// Tulikuwa na forms tatu wazi kwa pamoja. Mtumiaji aki-scroll
// kidogo bila kukusudia, alijikuta anajaza fomu ya malipo akidhani
// anaongeza mchangiaji — na hakuna kinachomwambia amekosea.
//
// Suluhisho si kuongeza maelezo. Ni kuondoa uwezekano wenyewe:
// fomu moja tu inaonekana kwa wakati. Usipompa mtumiaji nafasi
// ya kukosea, hatakosea.
const FOMU_ZOTE = ["malipoFormSection", "mchangiajiFormSection", "tukioFormSection"];

// Sehemu ya kwanza ya kujaza kwenye kila fomu
const SEHEMU_YA_KWANZA = {
  malipoFormSection: "mchangiaji",
  mchangiajiFormSection: "mJina",
  tukioFormSection: "tukioJina",
};

function funguaFomu(id) {
  // Huwezi kurekodi malipo bila mchangiaji — mwelekeze mahali sahihi
  if (id === "malipoFormSection" && wachangiajiWote.length === 0) {
    funguaFomu("mchangiajiFormSection");
    onyeshaUjumbe("mchangiajiUjumbe",
      "Huna mchangiaji bado. Mwongeze mmoja kwanza, kisha urekodi malipo yake.", "");
    return;
  }

  FOMU_ZOTE.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.hidden = (f !== id);
  });

  // Alama kwenye kitufe kinachohusika
  document.querySelectorAll("[data-fomu]").forEach(b => {
    b.classList.toggle("hai", b.dataset.fomu === id);
  });

  // Peleka macho ya mtumiaji kwenye fomu, kisha mkono kwenye sehemu ya kwanza
  const fomu = document.getElementById(id);
  fomu.scrollIntoView({ behavior: "smooth", block: "start" });
  const kwanza = document.getElementById(SEHEMU_YA_KWANZA[id]);
  if (kwanza) setTimeout(() => kwanza.focus(), 250);
}

function fungaFomu() {
  FOMU_ZOTE.forEach(ficha);
  document.querySelectorAll("[data-fomu]").forEach(b => b.classList.remove("hai"));
}

// Sasa inachukua ID ya mahali ujumbe unapoonekana
function onyeshaUjumbe(id, maandishi, aina) {
  const el = document.getElementById(id);
  el.textContent = maandishi;
  el.className = "ujumbe " + (aina || "");
}

// Ondoa nyekundu zote ndani ya form fulani
function safishaMakosa(form) {
  form.querySelectorAll(".makosa").forEach(el => el.classList.remove("makosa"));
}

function wekaKosa(sehemu) {
  sehemu.classList.add("makosa");
  sehemu.focus();
}


// ============================================================
// SEHEMU 4 — KUONYESHA
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

  // Hali tupu: tukio jipya halina wachangiaji bado
  document.getElementById("hakunaWachangiaji").hidden = wachangiaji.length > 0;

  wachangiaji.forEach(m => {
    const ahadi = ahadiYake(m);
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

function jazaDropdown(wachangiaji) {
  const select = document.getElementById("mchangiaji");
  const iliyochaguliwa = select.value;

  select.innerHTML = '<option value="">-- Chagua mchangiaji --</option>';

  wachangiaji.forEach(m => {
    const option = document.createElement("option");
    option.value = m.id;
    option.textContent = m.jina;
    select.appendChild(option);
  });

  select.value = iliyochaguliwa;
}

// MPYA Session 8: orodha ya matukio yako juu ya ukurasa
function jazaChaguaTukio() {
  const select = document.getElementById("chaguaTukio");

  select.innerHTML = matukioYangu.map(e =>
    `<option value="${e.id}" ${e.id === tukioId ? "selected" : ""}>${e.jina}</option>`
  ).join("");

  // Onyesha chaguo tu kama una matukio
  document.getElementById("tukioSafu").hidden = matukioYangu.length === 0;
}


// ============================================================
// SEHEMU 5 — ANIMATION YA DONUT
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
// SEHEMU 6 — FORM YA MALIPO (kutoka Session 6)
// ============================================================

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
  return null;
}

function safishaFormYaMalipo() {
  document.getElementById("mchangiaji").value = "";
  document.getElementById("kiasi").value = "";
  document.getElementById("njia").value = "";
  document.getElementById("kumbukumbu").value = "";
  document.getElementById("tarehe").value = tareheYaLeo();
}

async function tumaMalipo(tukio) {
  tukio.preventDefault();
  const form = tukio.target;
  const btn = document.getElementById("btnHifadhi");

  const malipo = {
    contributor_id: document.getElementById("mchangiaji").value,
    kiasi: Number(document.getElementById("kiasi").value),
    tarehe: document.getElementById("tarehe").value,
    njia: document.getElementById("njia").value,
    kumbukumbu: document.getElementById("kumbukumbu").value.trim() || null
  };

  safishaMakosa(form);
  const kosa = angaliaMalipo(malipo);
  if (kosa) {
    onyeshaUjumbe("ujumbe", kosa.ujumbe, "kosa");
    wekaKosa(document.getElementById(kosa.sehemu));
    return;
  }

  btn.disabled = true;
  onyeshaUjumbe("ujumbe", "Inahifadhi...", "");

  const { error } = await db.from("payments").insert(malipo);

  btn.disabled = false;

  if (error) {
    console.error("Kosa la kuhifadhi:", error);
    onyeshaUjumbe("ujumbe", "Imeshindikana kuhifadhi: " + error.message, "kosa");
    return;
  }

  onyeshaUjumbe("ujumbe", "Imehifadhiwa! TZS " + fedha(malipo.kiasi) + " imerekodiwa. ✅", "mafanikio");
  safishaFormYaMalipo();
  safishaMakosa(form);
  await pakiaTukio();
}


// ============================================================
// SEHEMU 7 — KUFUNGUA TUKIO  (MPYA Session 8, FR-B1)
// ============================================================

function angaliaTukio(t) {
  if (!t.jina) {
    return { ujumbe: "Andika jina la tukio.", sehemu: "tukioJina" };
  }
  if (t.lengo_la_fedha < 0) {
    return { ujumbe: "Lengo haliwezi kuwa chini ya sifuri.", sehemu: "tukioLengo" };
  }
  return null;
}

async function tumaTukio(tukioLaBrowser) {
  tukioLaBrowser.preventDefault();
  const form = tukioLaBrowser.target;
  const btn = document.getElementById("btnHifadhiTukio");

  const t = {
    jina: document.getElementById("tukioJina").value.trim(),
    aina: document.getElementById("tukioAina").value,
    tarehe: document.getElementById("tukioTarehe").value || null,
    lengo_la_fedha: Number(document.getElementById("tukioLengo").value) || 0,
    // user_id HAIPO hapa kwa makusudi!
    // Database inajijaza yenyewe kwa "default auth.uid()".
    // Angalia sql/session8-mfumo-wako.sql
  };

  safishaMakosa(form);
  const kosa = angaliaTukio(t);
  if (kosa) {
    onyeshaUjumbe("tukioUjumbe", kosa.ujumbe, "kosa");
    wekaKosa(document.getElementById(kosa.sehemu));
    return;
  }

  btn.disabled = true;
  onyeshaUjumbe("tukioUjumbe", "Inafungua...", "");

  // .select().single() inaturudishia tukio lililoundwa — tunahitaji
  // id yake ili tulifungue mara moja
  const { data, error } = await db.from("events").insert(t).select().single();

  btn.disabled = false;

  if (error) {
    console.error("Kosa la kufungua tukio:", error);
    onyeshaUjumbe("tukioUjumbe", "Imeshindikana: " + error.message, "kosa");
    return;
  }

  onyeshaUjumbe("tukioUjumbe", "", "");
  form.reset();
  fungaFomu();

  // Fungua tukio jipya moja kwa moja
  tukioId = data.id;
  localStorage.setItem(TUKIO_KUMBUKUMBU, tukioId);
  await pakiaKilaKitu();
}


// ============================================================
// SEHEMU 8 — KUONGEZA MCHANGIAJI  (MPYA Session 8, FR-C1, FR-D1)
// ============================================================

function angaliaMchangiaji(m) {
  if (!m.jina) {
    return { ujumbe: "Andika jina la mchangiaji.", sehemu: "mJina" };
  }
  if (!m.simu) {
    return { ujumbe: "Andika namba ya simu.", sehemu: "mSimu" };
  }
  if (m.ahadi !== null && m.ahadi <= 0) {
    return { ujumbe: "Ahadi lazima iwe zaidi ya sifuri.", sehemu: "mAhadi" };
  }
  return null;
}

async function tumaMchangiaji(tukioLaBrowser) {
  tukioLaBrowser.preventDefault();
  const form = tukioLaBrowser.target;
  const btn = document.getElementById("btnHifadhiMchangiaji");

  const ahadiMaandishi = document.getElementById("mAhadi").value;

  const m = {
    jina: document.getElementById("mJina").value.trim(),
    simu: document.getElementById("mSimu").value.trim(),
    ahadi: ahadiMaandishi ? Number(ahadiMaandishi) : null,
  };

  safishaMakosa(form);
  const kosa = angaliaMchangiaji(m);
  if (kosa) {
    onyeshaUjumbe("mchangiajiUjumbe", kosa.ujumbe, "kosa");
    wekaKosa(document.getElementById(kosa.sehemu));
    return;
  }

  btn.disabled = true;
  onyeshaUjumbe("mchangiajiUjumbe", "Inahifadhi...", "");

  // HATUA 1: hifadhi mchangiaji
  const { data: mpya, error: e1 } = await db
    .from("contributors")
    .insert({ event_id: tukioId, jina: m.jina, simu: m.simu })
    .select()
    .single();

  if (e1) {
    btn.disabled = false;
    console.error("Kosa la kuongeza mchangiaji:", e1);
    onyeshaUjumbe("mchangiajiUjumbe", "Imeshindikana: " + e1.message, "kosa");
    return;
  }

  // HATUA 2: kama ameahidi, hifadhi ahadi yake
  // Angalia: hii ni insert ya PILI, kwenye table NYINGINE, lakini
  // ni kitendo KIMOJA machoni pa mtumiaji. Ndiyo maana tunahitaji
  // id ya mchangiaji kutoka hatua ya 1.
  if (m.ahadi) {
    const { error: e2 } = await db.from("pledges").insert({
      contributor_id: mpya.id,
      kiasi: m.ahadi,
      tarehe: tareheYaLeo(),
    });

    // ⚠️ KAMWE usimeze kosa kimya kimya.
    //
    // Toleo la kwanza la code hii lilikuwa na "if (e2) console.error(...)"
    // peke yake — kosa lilikwenda Console, lakini mtumiaji aliona
    // "ameongezwa ✅". Mchangiaji alihifadhiwa, ahadi haikuhifadhiwa,
    // na hakuna aliyejua. Hiyo ni aina mbaya zaidi ya bug:
    // inayoonekana imefanikiwa.
    //
    // Kama hatua moja kati ya mbili imeshindwa, mwambie mtumiaji
    // NINI kilifanikiwa na NINI hakikufanikiwa.
    if (e2) {
      console.error("Kosa la kuhifadhi ahadi:", e2);
      btn.disabled = false;
      onyeshaUjumbe(
        "mchangiajiUjumbe",
        m.jina + " ameongezwa, LAKINI ahadi haikuhifadhiwa: " + e2.message,
        "kosa"
      );
      await pakiaTukio();
      return;
    }
  }

  btn.disabled = false;
  onyeshaUjumbe("mchangiajiUjumbe", m.jina + " ameongezwa. ✅", "mafanikio");
  form.reset();
  document.getElementById("mJina").focus();   // tayari kwa mwingine

  await pakiaTukio();
}


// ============================================================
// SEHEMU 9 — KUPAKIA
// ============================================================

// Pakia data ya tukio lililochaguliwa
async function pakiaTukio() {
  const data = await letaData();
  if (!data || !data.tukio) return;

  wachangiajiWote = data.wachangiaji;

  onyeshaTukio(data.tukio);
  onyeshaCards(data.tukio, data.wachangiaji);
  onyeshaJedwali(data.wachangiaji);
  jazaDropdown(data.wachangiaji);
}

// Pakia kila kitu: matukio, kisha tukio lililochaguliwa
async function pakiaKilaKitu() {
  matukioYangu = await letaMatukio();

  // Mtumiaji mpya: hana tukio lolote
  if (matukioYangu.length === 0) {
    onyesha("hakunaTukio");
    ficha("tukioData");
    fungaFomu();
    jazaChaguaTukio();
    return;
  }

  ficha("hakunaTukio");
  onyesha("tukioData");

  // Tumia tukio alilochagua mwisho, kama bado lipo
  const lililohifadhiwa = localStorage.getItem(TUKIO_KUMBUKUMBU);
  const lipo = matukioYangu.find(e => e.id === lililohifadhiwa);
  tukioId = lipo ? lipo.id : matukioYangu[0].id;
  localStorage.setItem(TUKIO_KUMBUKUMBU, tukioId);

  jazaChaguaTukio();
  document.getElementById("tarehe").value = tareheYaLeo();
  await pakiaTukio();
}


// ============================================================
// SEHEMU 10 — KUINGIA NA KUJISAJILI
// ============================================================

let niKujisajili = false;    // tuko kwenye hali ipi?

function onyeshaLogin() {
  onyesha("loginScreen");
  ficha("appScreen");
}

async function onyeshaApp(mtumiaji) {
  ficha("loginScreen");
  onyesha("appScreen");
  document.getElementById("mtumiajiEmail").textContent = mtumiaji.email;
  await pakiaKilaKitu();
}

async function angaliaSession() {
  const { data } = await db.auth.getSession();
  if (data.session) {
    await onyeshaApp(data.session.user);
  } else {
    onyeshaLogin();
  }
}

// MPYA Session 8: kubadilisha kati ya "Ingia" na "Jisajili"
function badilishaHali() {
  niKujisajili = !niKujisajili;

  document.getElementById("loginMaelezo").textContent = niKujisajili
    ? "Tengeneza akaunti yako ili uanze kusimamia michango."
    : "Ingia ili kuendelea kusimamia michango ya kamati yako.";

  document.getElementById("btnIngia").textContent = niKujisajili ? "Jisajili" : "Ingia";
  document.getElementById("badilishaMaandishi").textContent = niKujisajili
    ? "Una akaunti tayari?" : "Huna akaunti?";
  document.getElementById("btnBadilisha").textContent = niKujisajili ? "Ingia" : "Jisajili";

  onyeshaUjumbe("loginUjumbe", "", "");
}

async function ingiaAuJisajili(tukioLaBrowser) {
  tukioLaBrowser.preventDefault();
  const form = tukioLaBrowser.target;
  const btn = document.getElementById("btnIngia");
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  safishaMakosa(form);

  const email = emailEl.value.trim();
  const password = passEl.value;

  if (!email) {
    onyeshaUjumbe("loginUjumbe", "Andika email yako.", "kosa");
    return wekaKosa(emailEl);
  }
  if (!password) {
    onyeshaUjumbe("loginUjumbe", "Andika password yako.", "kosa");
    return wekaKosa(passEl);
  }
  // Supabase inakataa password fupi — tumwambie mapema, kwa upole
  if (niKujisajili && password.length < 6) {
    onyeshaUjumbe("loginUjumbe", "Password iwe na herufi 6 au zaidi.", "kosa");
    return wekaKosa(passEl);
  }

  btn.disabled = true;
  onyeshaUjumbe("loginUjumbe", niKujisajili ? "Inasajili..." : "Inaingia...", "");

  const { data, error } = niKujisajili
    ? await db.auth.signUp({ email, password })
    : await db.auth.signInWithPassword({ email, password });

  btn.disabled = false;

  if (error) {
    console.error(error);

    // ------------------------------------------------------------
    // Kutofautisha makosa: siyo kila kosa ni siri
    // ------------------------------------------------------------
    // "Email au password si sahihi" ni ujumbe wa makusudi — hatutaki
    // kumthibitishia mtu kwamba email fulani ina akaunti.
    //
    // LAKINI "haujathibitisha email" si siri: ni hali ambayo mtumiaji
    // anaweza kuirekebisha, na kumficha kunamwacha akizunguka bure.
    // Usalama ni kuficha kinachosaidia mvamizi — siyo kuficha kila kitu.
    const haijathibitishwa =
      error.code === "email_not_confirmed" ||
      /not confirmed/i.test(error.message || "");

    let ujumbe;
    if (haijathibitishwa) {
      ujumbe = "Akaunti yako haijathibitishwa. Angalia email yako, au muulize msimamizi akuthibitishe.";
    } else if (niKujisajili) {
      ujumbe = "Imeshindikana kujisajili: " + error.message;
    } else {
      ujumbe = "Email au password si sahihi.";
    }

    onyeshaUjumbe("loginUjumbe", ujumbe, "kosa");
    return wekaKosa(haijathibitishwa ? emailEl : passEl);
  }

  emailEl.value = "";
  passEl.value = "";
  onyeshaUjumbe("loginUjumbe", "", "");

  await onyeshaApp(data.user);
}

async function toka() {
  await db.auth.signOut();
  localStorage.removeItem(TUKIO_KUMBUKUMBU);
  location.reload();
}


// ============================================================
// SEHEMU 11 — KUUNGANISHA KILA KITU
// ============================================================

// Forms
document.getElementById("loginForm").addEventListener("submit", ingiaAuJisajili);
document.getElementById("paymentForm").addEventListener("submit", tumaMalipo);
document.getElementById("tukioForm").addEventListener("submit", tumaTukio);
document.getElementById("mchangiajiForm").addEventListener("submit", tumaMchangiaji);

// Vitufe
document.getElementById("btnBadilisha").addEventListener("click", badilishaHali);
document.getElementById("btnToka").addEventListener("click", toka);

// Vitufe vya kufungua fomu
document.querySelectorAll("[data-fomu]").forEach(btn => {
  btn.addEventListener("click", () => funguaFomu(btn.dataset.fomu));
});

// Vitufe vyote vya kufunga (X na "Funga")
document.querySelectorAll("[data-funga]").forEach(btn => {
  btn.addEventListener("click", fungaFomu);
});

// Mtumiaji mpya asiye na tukio
document.getElementById("btnTukioLaKwanza").addEventListener("click", () => {
  onyesha("tukioData");
  funguaFomu("tukioFormSection");
});

// Esc inafunga fomu iliyo wazi
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fungaFomu();
});

// Kubadilisha tukio
document.getElementById("chaguaTukio").addEventListener("change", async (e) => {
  tukioId = e.target.value;
  localStorage.setItem(TUKIO_KUMBUKUMBU, tukioId);
  await pakiaTukio();
});

// Anza
angaliaSession();