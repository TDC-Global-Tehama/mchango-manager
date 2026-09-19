// ============================================================
// Michango Manager — app.js
// Session 5: Data HALISI kutoka database (siyo ya kubuni tena!)
// ============================================================

// Tukio tunalolionyesha (session ijayo tutaruhusu kuchagua)
const EVENT_ID = "a0000000-0000-0000-0000-000000000001";

// ------------------------------------------------------------
// 1. KULETA DATA KUTOKA DATABASE
// ------------------------------------------------------------
// "async" = function inayoweza KUSUBIRI. Kuleta data kutoka
// internet kunachukua muda — hatuwezi kusimamisha ukurasa mzima.
async function letaData() {
  // Leta tukio
  const { data: tukio, error: e1 } = await db
    .from("events")
    .select("*")
    .eq("id", EVENT_ID)
    .single(); // tunataka row MOJA, siyo orodha

  if (e1) {
    console.error("Kosa la kuleta tukio:", e1);
    return null;
  }

  // Leta wachangiaji pamoja na ahadi, malipo na michango ya vitu.
  // Hii ni JOIN yetu ya SQL — sasa kwa lugha ya JavaScript!
  const { data: wachangiaji, error: e2 } = await db
    .from("contributors")
    .select(
      `
      id,
      jina,
      simu,
      pledges ( kiasi ),
      payments ( kiasi ),
      in_kind ( maelezo )
    `,
    )
    .eq("event_id", EVENT_ID)
    .order("jina");

  if (e2) {
    console.error("Kosa la kuleta wachangiaji:", e2);
    return null;
  }

  return { tukio, wachangiaji };
}

// ------------------------------------------------------------
// 2. HESABU — functions ndogo, kila moja na kazi MOJA
// ------------------------------------------------------------

// FR-E3: balance = ahadi − jumla ya malipo
// Ile kanuni ya ERD: "balance haihifadhiwi, inahesabiwa"
function calculateBalance(mchangiaji) {
  const ahadi = mchangiaji.pledges?.[0]?.kiasi ?? 0;
  return ahadi - jumlaYaMalipo(mchangiaji);
}

function jumlaYaMalipo(mchangiaji) {
  // reduce: "kusanya orodha kuwa namba moja"
  return mchangiaji.payments.reduce((jumla, m) => jumla + Number(m.kiasi), 0);
}

// FR-F2: status ya mchangiaji
function statusYake(mchangiaji) {
  const ahadi = Number(mchangiaji.pledges?.[0]?.kiasi ?? 0);
  const amelipa = jumlaYaMalipo(mchangiaji);
  const balance = ahadi - amelipa;

  // FR-H3: mchangiaji wa vitu hasahauliki!
  if (ahadi === 0 && amelipa === 0 && mchangiaji.in_kind.length > 0) {
    const vitu = mchangiaji.in_kind.map((k) => k.maelezo).join(", ");
    return { badge: "inkind", maandishi: vitu + " (vitu) 🎁" };
  }
  if (ahadi > 0 && balance <= 0) {
    return { badge: "paid", maandishi: "Amelipa yote" };
  }
  if (amelipa > 0) {
    return { badge: "partial", maandishi: "Balance " + fedha(balance) };
  }
  return { badge: "unpaid", maandishi: "Hajalipa" };
}

// Kuandika fedha kwa mtindo wa TZS: 1000000 → "1,000,000"
function fedha(n) {
  return Number(n).toLocaleString("en-US");
}

// ------------------------------------------------------------
// 3. KUONYESHA — kuweka data kwenye ukurasa
// ------------------------------------------------------------
function onyeshaTukio(tukio) {
  document.getElementById("eventName").textContent =
    tukio.jina + (tukio.tarehe ? " — " + tukio.tarehe : "");
}

function onyeshaCards(tukio, wachangiaji) {
  // Jumla ya malipo ya wachangiaji WOTE
  const iliyokusanywa = wachangiaji.reduce(
    (jumla, m) => jumla + jumlaYaMalipo(m),
    0,
  );
  const lengo = Number(tukio.lengo_la_fedha);

  document.getElementById("collected").textContent =
    "TZS " + fedha(iliyokusanywa);
  document.getElementById("target").textContent = "TZS " + fedha(lengo);

  // FR-F1: asilimia ya lengo
  const asilimia = lengo > 0 ? Math.round((iliyokusanywa / lengo) * 100) : 0;
  animateDonut(asilimia);
}

function onyeshaJedwali(wachangiaji) {
  const tbody = document.getElementById("contributorRows");
  tbody.innerHTML = ""; // futa yaliyokuwepo

  wachangiaji.forEach((m) => {
    const ahadi = Number(m.pledges?.[0]?.kiasi ?? 0);
    const amelipa = jumlaYaMalipo(m);
    const st = statusYake(m);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.jina}</td>
      <td>${ahadi > 0 ? fedha(ahadi) : "—"}</td>
      <td>${amelipa > 0 ? fedha(amelipa) : ahadi > 0 ? "0" : "—"}</td>
      <td><span class="badge ${st.badge}">${st.maandishi}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------------------------------------------------
// 4. ANIMATION YA DONUT (kutoka session iliyopita)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// 5. KUANZISHA — hapa kila kitu kinaanzia
// ------------------------------------------------------------
async function anzisha() {
  const data = await letaData();

  if (!data) {
    document.getElementById("eventName").textContent =
      "Imeshindikana kupata data — angalia Console (F12)";
    return;
  }

  console.log("Data kutoka database:", data); // 👀 fungua Console uione!

  onyeshaTukio(data.tukio);
  onyeshaCards(data.tukio, data.wachangiaji);
  onyeshaJedwali(data.wachangiaji);
}

anzisha();
