# Homework — Session 6: Kuboresha Form Yetu

**Michango Manager · Safari ya Software Development**
Muda: saa 1–2 · Wasilisha: kabla ya session ijayo

---

## Kwa nini kazi hii?

Form yetu inafanya kazi — lakini bado haijawa rafiki kwa mtumiaji.

Fikiria mratibu wa kamati akiwa na haraka kwenye msiba, anarekodi malipo kwa simu yake. Anabonyeza "Hifadhi" na anaona ujumbe mwekundu juu: *"Tafadhali andika kiasi."* Sasa lazima asome ujumbe, afikirie, kisha atafute ni sehemu ipi ina tatizo.

Mfumo mzuri **haumwambii tu kwamba kuna kosa — unamwonyesha WAPI.**

Leo tunaongeza mambo matatu yanayogeuza form yetu kutoka "inafanya kazi" kwenda "inapendeza kutumia."

---

## Kazi 1: Sehemu yenye kosa iwe NYEKUNDU 🔴

Validation ikigundua tatizo kwenye **Mchangiaji** au **Kiasi**, sehemu hiyo yenyewe ibadilike kuwa nyekundu — siyo ujumbe wa juu peke yake.

### 1a. CSS — tengeneza "mwonekano wa kosa"

Kwenye `style.css`, ongeza class mpya inayoitwa `.makosa` yenye border nyekundu. Tumia rangi tuliyonayo tayari: `var(--bad)`.

```css
.field input.makosa,
.field select.makosa {
  border-color: var(--bad);
  background: #FDF4F4;     /* pinki hafifu — inaongeza msisitizo */
}
```

> ⚠️ **MUHIMU — mahali pa kuiweka:** weka rules hizi **BAADA** ya zile za `:focus` kwenye file.
> Kwa nini? CSS ina kanuni: rules zenye nguvu sawa, ya **mwisho** ndiyo inashinda. Ukiiweka kabla ya `:focus`, border itarudi dhahabu mara tu mtumiaji anapobofya sehemu hiyo — na kosa litatoweka machoni pake!

### 1b. JavaScript — kuongeza na kuondoa class

Mpaka sasa tumekuwa tukibadilisha class kwa `element.className = "..."`. Sasa tunahitaji **kuongeza au kuondoa class moja** bila kugusa nyingine. JavaScript ina `classList`:

```js
element.classList.add("makosa");      // weka
element.classList.remove("makosa");   // ondoa
```

### 1c. Changamoto kuu 🤔

Hapa ndipo penye fikra halisi ya kazi hii:

> **`angaliaMalipo()` inarudisha maandishi ya kosa tu. Code inajuaje ni sehemu IPI ya kuipaka nyekundu?**

Fikiri kwanza kabla ya kusoma kidokezo hapa chini.

<br>

**Kidokezo:** badilisha kile `angaliaMalipo()` inachorudisha — badala ya maandishi peke yake, irudishe **vitu viwili**: ujumbe NA jina la sehemu.

```js
// Zamani:
return "Tafadhali chagua mchangiaji.";

// Sasa:
return { ujumbe: "Tafadhali chagua mchangiaji.", sehemu: "mchangiaji" };
```

Kisha kwenye `tumaForm()`, utatumia `kosa.ujumbe` na `kosa.sehemu`.

> Kumbuka: ukibadilisha kile function inachorudisha, lazima **ubadilishe pia kila mahali inapotumika**. Hilo ni somo lenyewe — function ni ahadi kati ya sehemu mbili za code.

### 1d. Usisahau hili ⚠️

**Safisha makosa ya zamani kabla ya kuangalia upya.** Bila hivyo: Mchangiaji ikiwa nyekundu, ukimchagua kisha ukasahau kiasi — sehemu MBILI zitakuwa nyekundu, ingawa tatizo ni moja tu.

Tengeneza function ndogo inayoondoa `.makosa` kwenye sehemu zote, na uiite **kabla** ya validation.

---

## Kazi 2: Placeholder ya Njia ya Malipo

Kwa sasa form inaanza na **Cash** ikiwa imechaguliwa tayari. Hilo ni tatizo dogo lakini la kweli: mtumiaji akisahau kubadilisha, malipo ya M-Pesa yatarekodiwa kama cash — na hakuna atakayegundua.

**Suluhisho:** ongeza chaguo la kwanza lisilo na thamani, kama tulivyofanya kwa mchangiaji:

```html
<option value="">-- Njia ya malipo --</option>
```

Kisha jaribu: bonyeza "Hifadhi" bila kuchagua njia. Validation yetu ya `njiaHalali` itaikamata! 🎯

**Lakini angalia ujumbe wake:** *"Njia ya malipo si sahihi."* — huo ni ujumbe wa mfumo, siyo wa binadamu. Uboreshe uwe wa upole zaidi, kama wa sehemu nyingine.

---

## Kazi 3: Reset kamili baada ya kuhifadhi ✨

Kwa sasa, malipo yakihifadhiwa tunafuta **kiasi** na **kumbukumbu** tu. Sasa form yote irudi mwanzo:

| Sehemu | Irudi kwenye |
|---|---|
| Mchangiaji | `-- Chagua mchangiaji --` |
| Kiasi | tupu |
| Tarehe | **tarehe ya leo** |
| Njia ya malipo | `-- Njia ya malipo --` |
| Kumbukumbu | tupu |
| Border nyekundu zozote | ziondoke |

**Vidokezo viwili:**

1. Kurudisha select kwenye placeholder: weka `.value = ""` — ndiyo thamani ya option ya placeholder.
2. Kwa tarehe: **usiandike code mpya!** Function `tarehYaLeo()` ipo tayari kwenye app.js — iite tu. Kanuni ya dhahabu ya programming: *usiandike kitu kile kile mara mbili.*

Pendekezo: tengeneza function moja `safishaForm()` inayofanya yote, kisha uiite mahali pamoja. Code inakuwa safi na rahisi kusoma.

---

## Utajuaje umefanikiwa ✅

Jaribu hatua hizi kwa mpangilio — kila moja ifanye kazi:

1. Bonyeza **Hifadhi** bila kujaza kitu → Mchangiaji inakuwa nyekundu
2. Chagua mchangiaji, bonyeza tena → Mchangiaji inarudi kawaida, **Kiasi** inakuwa nyekundu
3. Andika kiasi, bonyeza tena → Njia ya malipo inakuwa nyekundu
4. Chagua njia, bonyeza → **Imehifadhiwa!** ✅
5. Angalia form: sehemu zote ni tupu, njia inasema `-- Njia ya malipo --`, tarehe ni ya **leo**, na hakuna nyekundu popote
6. Angalia dashboard: jumla imeongezeka na donut imebadilika

---

## Bonus (hiari, kwa anayetaka changamoto) 🌟

**Bonus 1:** Nyekundu iondoke mara mtumiaji anapoanza kurekebisha — siyo kusubiri abonyeze Hifadhi tena.
*Kidokezo:* `addEventListener("input", ...)` kwa inputs, `"change"` kwa selects.

**Bonus 2:** Sehemu yenye kosa ichaguliwe yenyewe (cursor iende hapo).
*Kidokezo:* `element.focus()` — kwenye simu, hii inaokoa mtumiaji scroll ya kutafuta.

---

## Kuwasilisha 📸

Tuma **screenshots mbili** kwenye WhatsApp group:

1. Form ikiwa na sehemu nyekundu (kosa)
2. Form baada ya kuhifadhi kwa mafanikio (imerudi mwanzo)

Ukikwama mahali popote — andika kwenye group. Kukwama ni sehemu ya kazi, siyo kushindwa. 💪🏽

---

*Session ijayo: **Login na Usalama** — mfumo wetu unarekodi malipo, lakini ni NANI anayerekodi? 🔐*
