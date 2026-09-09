# Kuandaa Kompyuta Yako kwa Development

**Michango Manager · Safari ya Software Development — TEHAMA TDC Global**
Muda: dakika 30–45 · Ngazi: beginner — hakuna uzoefu unaohitajika

**Habari njema:** tunahitaji programu **TATU tu** kwenye kompyuta yako — VS Code, Git, na Node.js. Kila kitu kingine cha safari yetu (GitHub, Supabase, Netlify) kinaishi kwenye browser. Hii siyo bahati — ndivyo modern development ilivyo siku hizi.

**Hatuhitaji Docker.** Utasikia jina hili mtandaoni — ni tool ya kuendesha services kwenye kompyuta yako. Sisi database yetu inaishi cloud (Supabase) na app yetu inaishi cloud (Netlify), kwa hiyo hakuna kitu cha ku-run locally. Kila tool inaingia tu pale inapohitajika — na hii haihitajiki.

---

## 1. Akaunti ya GitHub (dakika 5) — siyo install, ni kujisajili

GitHub ndiyo nyumba ya code yetu — hapa ndipo repo ya `mchango-manager` inaishi.

1. Fungua browser, nenda **github.com/signup**
2. Jisajili kwa email yako. Chagua username ya kitaalamu — utaitumia kwenye CV yako siku moja! (mfano: `jina-lako`, siyo `mtukufu_wa_mabonde254`)
3. Thibitisha email yako (angalia inbox/spam)
4. Ukishaingia, tafuta repo yetu (link ipo WhatsApp group) na bonyeza **Watch** — utapata notifications za mabadiliko

> ✅ **Utajuaje imefanikiwa:** Unaweza kufungua ukurasa wa repo ya mchango-manager ukiwa umelogin, na jina lako linaonekana kona ya juu kulia.

---

## 2. VS Code (dakika 10) — editor yetu

Visual Studio Code ni programu tutakayotumia kuandika na kusoma code. Ni bure, na inatumika na developers wengi zaidi duniani.

### Windows

1. Nenda **code.visualstudio.com** — bonyeza kitufe kikubwa cha *Download for Windows*
2. Fungua file iliyodownload (`VSCodeUserSetup-...exe`)
3. Kubali license → Next, Next... **Hakikisha checkbox ya "Add to PATH" ina tick** (huwa ina tick tayari) → Install

### Mac

1. Nenda **code.visualstudio.com** — *Download for Mac*
2. Fungua `.zip` iliyodownload — utapata icon ya Visual Studio Code
3. Buruta (drag) icon hiyo kwenye folder ya **Applications**

> ✅ **Utajuaje imefanikiwa:** Unafungua VS Code na unaona Welcome screen.

---

## 3. Git (dakika 10) — version control

Git ndiyo inayoweka historia ya kila badiliko la code — na inayounganisha kompyuta yako na GitHub.

### Windows

1. Nenda **git-scm.com/downloads** → Windows → download itaanza
2. Fungua installer
3. **Installer ina screens NYINGI za maswali — usiogope:** bonyeza Next kwenye kila screen ukikubali defaults. Defaults ni sahihi kwa kila kitu tunachohitaji.
4. Mwisho → Install → Finish

> ⚠️ **Windows:** Ukimaliza, programu mpya inaitwa **"Git Bash"** itaonekana kwenye Start Menu — hiyo ndiyo terminal tutakayoitumia kwenye Windows. Usiifute!

### Mac

1. Fungua app ya **Terminal** (Cmd+Space, andika Terminal, Enter)
2. Andika `git --version` na ubonyeze Enter
3. Kama Git haipo, Mac itakuuliza i-install **Xcode Command Line Tools** — hii ni ya kawaida kabisa, bonyeza Install na usubiri (inaweza kuchukua dakika 10–15)

> ✅ **Utajuaje imefanikiwa:** Kwenye terminal (Git Bash kwa Windows, Terminal kwa Mac), unaandika `git --version` na inajibu kitu kama: `git version 2.45.0` (namba yoyote ni sawa).

---

## 4. Node.js LTS (dakika 10) — injini ya tools zetu

Node.js inatuwezesha kutumia tools za kisasa za web development (npm). Tutaihitaji kuanzia Session 6 — tunai-install sasa ili siku hiyo tuwe tayari.

### Windows

1. Nenda **nodejs.org** — bonyeza kitufe cha **LTS** (namba kubwa, mfano 22.x LTS)
2. **MUHIMU:** download kutoka nodejs.org moja kwa moja — **siyo Microsoft Store**
3. Fungua `.msi` installer → Next, kubali defaults, Install

### Mac

1. Nenda **nodejs.org** — bonyeza LTS → download `.pkg`
2. Fungua `.pkg` → Continue, kubali defaults, Install

> ⚠️ **Zote mbili:** Ukishainstall, **FUNGA terminal zote zilizo wazi na ufungue mpya** — terminal ya zamani haioni programu mpya.

> ✅ **Utajuaje imefanikiwa:** Kwenye terminal MPYA, unaandika `node -v` na inajibu kitu kama `v22.11.0`. Kisha `npm -v` inajibu namba pia (mfano `10.9.0`).

---

## 5. Kuthibitisha — Screenshot Moja 📸

Fungua terminal MPYA (Git Bash kwenye Windows, Terminal kwenye Mac) na uandike commands hizi tatu, moja baada ya nyingine:

```bash
git --version
node -v
npm -v
```

**Piga screenshot ya terminal ikionyesha majibu ya zote tatu, na uitume kwenye WhatsApp group.** Hii ndiyo inayotuhakikishia kwamba session ya code itaanza bila matatizo ya "kwangu haifanyi kazi."

---

## 6. Kupata Project (baada ya setup)

Mara ya kwanza tu — **clone** (nakala kamili ya project):

```bash
cd Documents
git clone https://github.com/JINA-LA-ORG/mchango-manager.git
cd mchango-manager
code .
```

Kisha fungua `app/index.html` kwenye browser — ukurasa wa Michango Manager unaonekana.

**Kuanzia hapo na kuendelea** — kabla ya kila session, ukiwa ndani ya folder ya project:

```bash
git pull
```

> Kanuni: **clone ni mara moja tu maishani mwa project; pull ni kila siku.**

---

## Matatizo ya Kawaida (Troubleshooting)

**"command not found" au "not recognized" baada ya ku-install:**
Funga terminal, fungua mpya, jaribu tena. Bado? Restart kompyuta — inatatua 90% ya kesi hizi.

**Windows: nimeinstall Node kutoka Microsoft Store na haifanyi kazi vizuri:**
I-uninstall (Settings → Apps), kisha install upya kutoka nodejs.org.

**Mac: "xcode-select: note: no developer tools were found":**
Hiyo ndiyo prompt ya kuinstall — bonyeza Install kwenye dirisha litakalojitokeza na usubiri ikamilike.

**Kompyuta yangu ni ya zamani / space ndogo:**
Programu zote tatu kwa pamoja ni chini ya 1GB. Kama bado ni tatizo, tuandikie kwenye group — tutapanga jinsi ya kukusaidia, na sehemu kubwa ya safari inawezekana kwa browser tu.

---

**Umemaliza? Hongera 🎉 — kompyuta yako sasa ni development machine.** Maswali yoyote: WhatsApp group.
