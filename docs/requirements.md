# Requirements — Michango Manager

**Safari ya Software Development — TEHAMA TDC Global · Toleo 1.1**

Hati hii inageuza problem statement kuwa orodha ya kile mfumo **LAZIMA** ufanye (functional requirements) na jinsi unavyopaswa kufanya kazi (non-functional requirements). Kila kipande cha mfumo — design, database, UI, code — kinajibu requirements zilizo hapa. Zikibadilika, tunabadilisha hapa kwanza: **hati hii ndiyo chanzo cha ukweli.**

---

## 1. Problem Statement (Commit Zero)

> Kamati za matukio (harusi, misiba na sherehe) zinapata shida ya kusimamia michango kwa sababu hazina mfumo maalum — zinategemea madaftari, Excel na kumbukumbu za vichwani. Hii inasababisha taarifa kupotea, kutokujua kwa wakati nani amechangia na nani bado, na ugumu wa kutoa ripoti sahihi. Zaidi ya hayo, michango isiyo ya fedha — vitu, huduma na nguvu kazi — mara nyingi hairekodiwi kabisa, na mchango wa watu hao husahaulika wanapofikwa na shida zao wenyewe. Tunajenga **Michango Manager**, mfumo wa kidijitali utakaowezesha kamati kusajili wachangiaji, kurekodi ahadi na michango ya fedha na isiyo ya fedha, na kupata ripoti sahihi wakati wowote.

*Toleo 1.1: sentensi ya michango isiyo ya fedha imeongezwa kutokana na mchango wa mwanafunzi — mfano hai wa requirement inayotoka kwa mtumiaji.*

---

## 2. Watumiaji na Roles

| Role | Maelezo | Anaweza kufanya |
|---|---|---|
| **Mratibu (Admin)** | Kiongozi wa kamati anayesimamia tukio na taarifa zake zote | Kila kitu: matukio, wachangiaji, ahadi, malipo, ripoti |
| **Mjumbe / Mchangiaji** | Mwanakamati au mchangiaji wa kawaida | Kuona taarifa zake mwenyewe: ahadi, malipo, balance |

---

## 3. Functional Requirements — kwa Moduli

Muundo: kitendo kimoja kinachopimika kwa kila requirement. Priority kwa **MoSCoW** (Must / Should / Could / Won't kwa toleo la kwanza).

### Moduli A — Akaunti na Usalama

| ID | Requirement | Priority |
|---|---|---|
| FR-A1 | Mratibu anaweza kujisajili na kuingia kwenye mfumo kwa email na password | **Must** |
| FR-A2 | Mfumo unatofautisha role ya Mratibu (admin) na ya Mjumbe | **Must** |
| FR-A3 | Mratibu anaweza kubadilisha au kureset password yake | Should |
| FR-A4 | Mratibu anaweza kumwalika mjumbe kuona taarifa zake mwenyewe | Could |

### Moduli B — Matukio (Events)

| ID | Requirement | Priority |
|---|---|---|
| FR-B1 | Mratibu anaweza kufungua tukio jipya: jina, aina (harusi/msiba/sherehe/nyingine), tarehe, na lengo la fedha | **Must** |
| FR-B2 | Mratibu anaweza kuhariri taarifa za tukio | **Must** |
| FR-B3 | Mratibu anaweza kufunga tukio (limekamilika) — halipokei malipo mapya | Should |
| FR-B4 | Mfumo unaruhusu matukio zaidi ya moja kwa wakati mmoja | Should |
| FR-B5 | Mratibu anaweza kufuta tukio lisilo na malipo yoyote | Could |

### Moduli C — Wachangiaji (Contributors)

| ID | Requirement | Priority |
|---|---|---|
| FR-C1 | Mratibu anaweza kusajili mchangiaji: jina na namba ya simu (email hiari) | **Must** |
| FR-C2 | Mratibu anaweza kuhariri taarifa za mchangiaji | **Must** |
| FR-C3 | Mratibu anaweza kutafuta mchangiaji kwa jina au namba ya simu | **Must** |
| FR-C4 | Mratibu anaweza kuondoa mchangiaji asiye na malipo | Should |
| FR-C5 | Mratibu anaweza kuweka wachangiaji kwenye makundi (familia, marafiki, wafanyakazi wenzake) | Could |

### Moduli D — Ahadi (Pledges)

| ID | Requirement | Priority |
|---|---|---|
| FR-D1 | Mratibu anaweza kurekodi ahadi ya mchangiaji kwenye tukio (kiasi) | **Must** |
| FR-D2 | Mratibu anaweza kuhariri ahadi | **Must** |
| FR-D3 | Mchangiaji anaweza kulipa bila kuwa na ahadi (mchango wa moja kwa moja) | Should |

### Moduli E — Malipo (Payments)

| ID | Requirement | Priority |
|---|---|---|
| FR-E1 | Mratibu anaweza kurekodi malipo: kiasi, tarehe, njia (cash / M-Pesa / benki), na kumbukumbu (hiari) | **Must** |
| FR-E2 | Mchangiaji mmoja anaweza kulipa mara nyingi (malipo kidogo kidogo) na mfumo unajumlisha | **Must** |
| FR-E3 | Mfumo unahesabu balance ya kila mchangiaji: ahadi − jumla ya malipo | **Must** |
| FR-E4 | Mratibu anaweza kusahihisha malipo yaliyorekodiwa kimakosa | Should |
| FR-E5 | Mfumo unaonyesha risiti ya kidijitali ya malipo inayoweza kushare (WhatsApp/screenshot) | Could |

### Moduli F — Ripoti na Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-F1 | Dashboard ya tukio: jumla iliyokusanywa, lengo, na asilimia iliyofikiwa | **Must** |
| FR-F2 | Orodha ya wachangiaji ikionyesha: amelipa yote / ana balance / hajalipa kabisa | **Must** |
| FR-F3 | Statement ya mchangiaji mmoja: ahadi yake, malipo yake yote, na balance | Should |
| FR-F4 | Ripoti kwa makundi (kama FR-C5 ipo) | Could |
| FR-F5 | Ku-export au ku-print ripoti (PDF/Excel) | Could |

### Moduli G — Reminders

| ID | Requirement | Priority |
|---|---|---|
| FR-G1 | Mratibu anaweza kuona orodha ya wenye balance na kutengeneza ujumbe wa reminder wa kucopy (kutuma mwenyewe WhatsApp/SMS) | Should |
| FR-G2 | Ujumbe wa reminder unajaza jina na balance ya mchangiaji otomatiki (template) | Could |

### Moduli H — Michango Isiyo ya Fedha (In-Kind)

> **Chanzo: mchango wa mwanafunzi.** Kwenye misiba hasa, watu huchangia kimya kimya — vitu, huduma, nguvu kazi — na hawarekodiwi popote. Wanapofikwa na shida zao, jamii inadhani hawakushiriki. Hii ndiyo **unique value feature** ya Michango Manager.

| ID | Requirement | Priority |
|---|---|---|
| FR-H1 | Mratibu anaweza kurekodi mchango usio wa fedha: mchangiaji, maelezo ya kitu/huduma (mfano: "mahema 2", "gunia la mchele", "usafiri"), na tarehe | **Must** |
| FR-H2 | Thamani ya makadirio kwa TZS inaweza kuwekwa — ni **HIARI** | Should |
| FR-H3 | Statement na ripoti za mchangiaji zinaonyesha michango yake ya fedha NA isiyo ya fedha | **Must** |
| FR-H4 | Dashboard inaonyesha muhtasari wa michango isiyo ya fedha (orodha), tofauti na jumla ya fedha | Could |

---

## 4. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-1 | UI yote kwa Kiswahili; maneno ya kiufundi ya lazima tu kwa Kiingereza | **Must** |
| NFR-2 | Mobile-first: kila kitu kinafanya kazi vizuri kwenye simu | **Must** |
| NFR-3 | Usalama wa data: kila kamati/mratibu anaona data yake TU; passwords hazihifadhiwi wazi | **Must** |
| NFR-4 | Urahisi: mratibu asiye wa kiufundi anaweza kurekodi malipo bila mafunzo maalum (kipimo: mtu mpya anarekodi malipo ndani ya dakika 2) | **Must** |
| NFR-5 | Kasi: kurasa kuu zinafunguka chini ya sekunde 3 kwenye mtandao wa simu | Should |
| NFR-6 | Upatikanaji: mfumo uko live mtandaoni 24/7 | Should |
| NFR-7 | Data haipotei: backups za mara kwa mara | Should |
| NFR-8 | Sarafu: TZS peke yake toleo la kwanza | **Must** |
| NFR-9 | Mchango usio wa fedha haulazimishwi kupewa thamani ya fedha — lengo ni kutambuliwa kwa mchangiaji, siyo uhasibu | **Must** |

---

## 5. Nje ya Wigo — Toleo la Kwanza (Won't — kwa sasa)

Vitu hivi vimeandikwa ili tusivisahau — na ili kila mtu ajue **HATUVIJENGI sasa**. Kujua cha kuacha ni nusu ya requirements.

- Malipo ya moja kwa moja kupitia M-Pesa API au mitandao mingine — malipo yanafanyika nje ya mfumo, yanarekodiwa ndani
- Kutuma SMS/WhatsApp otomatiki kutoka kwenye mfumo — reminder ni ya kucopy na kutuma mwenyewe
- Multi-tenancy / SaaS — mfumo mmoja kwa kamati nyingi zisizojuana; toleo la kwanza ni mfumo mmoja
- Offline mode — mfumo unahitaji internet
- Native mobile app (Android/iOS) — web app inayofanya kazi vizuri kwenye simu inatosha
- Michango ya kujirudia (recurring/monthly) — hiyo ni domain ya VICOBA, siyo matukio
- Sarafu zaidi ya moja

---

## 6. Mawazo ya Msingi (Assumptions)

- Mratibu ana simu au kompyuta yenye internet
- Malipo halisi yanafanyika nje ya mfumo (cash, M-Pesa ya kawaida, benki) — mfumo ni daftari la kidijitali, siyo njia ya malipo
- Kamati moja ina mratibu mmoja au wachache wanaoshirikiana akaunti moja (toleo la kwanza)
- Idadi ya wachangiaji kwa tukio: hadi ~500

---

## 7. Ramani ya Requirements → Sessions

| Session | Requirements zinazohusika |
|---|---|
| 3 — Design | Zote — architecture inajibu requirements zote kwa pamoja |
| 4 — Database | FR-B1, B4, C1, D1, E1–E3, H1 (entities: Event, Contributor, Pledge, Payment, InKindContribution, User) + NFR-3, NFR-8 |
| 5 — UI Design | FR-F1, F2 (screens kuu), FR-B1, C1, E1 (forms) + NFR-1, NFR-2, NFR-4 |
| 6 — Programming | FR-E3 (calculateBalance!), hesabu za FR-F1 |
| 7 — Backend/APIs | CRUD za moduli B, C, D, E, H + FR-A1, A2 |
| 8 — UI + Integration | FR-F1–F3 na FR-H3 live, FR-E5 (risiti) kama muda upo |
| 9 — Deploy | NFR-5, NFR-6 |
| 10 — AI | FR-G1, G2 (AI-generated reminder messages), documentation |

---

*Hati hii inaishi kwenye `docs/02-requirements/` na inasasishwa na darasa. Badiliko lolote la requirement — kwanza hapa, kisha kwenye code.*
