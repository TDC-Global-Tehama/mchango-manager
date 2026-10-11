# Homework — Session 7: Login na Usalama

**Michango Manager · Safari ya Software Development — TEHAMA TDC Global**
Muda: saa 1–2 · Wasilisha: kabla ya session ijayo

---

## Kabla hujaanza

Session ya jana ilikuwa na vipande vingi — Supabase, SQL, policies, JavaScript — na ni kawaida kabisa kujisikia umeelemewa. Hilo si tatizo. Kusikia kitu mara moja hakutoshi; kukifanya kwa mikono yako ndiko kunakokifundisha.

Leo tunairudia safari ile ile, **polepole, kwenye project yako mwenyewe**. Hakuna haraka, hakuna mtu anayekutazama. Ukikwama mahali, simama hapo na uandike kwenye group — mahali ulipokwama ndipo somo lilipo.

**Utahitaji:**
- Project yako ya Supabase (ile ile uliyoitengeneza Session 4)
- Project yako ya Michango Manager kwenye VS Code
- Saa moja au mbili za utulivu

---

## Sehemu ya 1 — Tengeneza watumiaji wawili

Mpaka sasa mfumo wetu hauna watumiaji kabisa. Mtu yeyote mwenye link anaweza kurekodi malipo. Leo tunalirekebisha.

### 1.1 Mtumiaji wa kwanza (wewe)

1. Fungua Supabase project yako
2. Nenda **Authentication → Users**
3. Bonyeza **Add user → Create new user**
4. Weka email yako na password (kumbuka password hiyo!)
5. ⚠️ **Washa "Auto Confirm User"** — bila hii, Supabase itasubiri uthibitishe email, na hutaweza kuingia

### 1.2 Mtumiaji wa pili

Rudia hatua zile zile na email tofauti, mfano `mtu2@mfano.co.tz`. Password yoyote.

Huyu ndiye atakayekuthibitishia mwishoni kwamba usalama unafanya kazi kweli. Usimruke.

### 1.3 Zima uthibitisho wa email

**Authentication → Providers → Email** → zima **"Confirm email"** → Save.

> ✅ **Utajuaje imefanikiwa:** Kwenye Authentication → Users unaona watumiaji **wawili**, na wote wana alama ya "Confirmed".

---

## Sehemu ya 2 — SQL: usalama halisi

Hapa ndipo kazi kuu ilipo. Tutafanya hatua tano, **moja kwa wakati**.

> 📌 **Kanuni ya leo:** usipaste SQL yote mara moja. Paste sehemu moja, bonyeza **Run**, soma jibu, kisha nenda inayofuata. Ukiharakisha na kitu kikaenda vibaya, hutajua ni hatua ipi iliyokosea.

Fungua **SQL Editor** kwenye Supabase.

### Hatua 1 — Jua id yako

```sql
select id, email from auth.users;
```

Utaona watumiaji wako wawili. **Nakili email yako** — utaihitaji hatua inayofuata.

---

### Hatua 2 — Ongeza `user_id` kwenye matukio

Kumbuka ERD tuliyochora Session 3? Tulichora **USER** tangu mwanzo, lakini hatukutengeneza table yake — tukasema "Supabase ina yake." Leo ndiyo siku ya kuiunganisha.

Bila column hii, "kila mratibu anaona data yake tu" haiwezekani kabisa. Database haina namna ya kujua tukio ni la nani.

```sql
alter table events
  add column user_id uuid references auth.users(id) on delete cascade;
```

Sasa matukio yaliyopo hayana mmiliki. Yape wewe — **badilisha email iwe yako**:

```sql
update events
set user_id = (select id from auth.users where email = 'email-yako@mfano.co.tz')
where user_id is null;
```

Kisha fanya column hiyo iwe ya lazima:

```sql
alter table events alter column user_id set not null;
```

> ✅ **Utajuaje imefanikiwa:**
> ```sql
> select jina, user_id from events;
> ```
> Kila tukio lina uuid, hakuna `null`.
>
> ⚠️ Ukipata kosa kwenye mstari wa `set not null`, maana yake update haikufanya kazi — email uliyoandika haipo kwenye `auth.users`. Rudi hatua 1 na uangalie tena.

---

### Hatua 3 — Ondoa policies za zamani ⚠️

**Hii ndiyo hatua muhimu kuliko zote, na ndiyo watu wanayoisahau.**

Postgres ina-unganisha policies kwa **AU** (OR). Yaani:

```
policy ya zamani:  using (true)                  ← kila mtu
policy mpya:       using (user_id = auth.uid())  ← mimi tu
```

Matokeo: **"kila mtu AU mimi" = kila mtu.**

Ukiacha policy ya zamani, mpya haifanyi chochote kabisa — na utaamini usalama upo wakati haupo. Hili ndilo kosa linalogharimu makampuni fedha na sifa.

```sql
drop policy if exists "darasa: kusoma"          on events;
drop policy if exists "darasa: kusoma"          on contributors;
drop policy if exists "darasa: kusoma"          on pledges;
drop policy if exists "darasa: kusoma"          on payments;
drop policy if exists "darasa: kusoma"          on in_kind;
drop policy if exists "darasa: kuandika malipo" on payments;
```

Thibitisha kwamba hakuna iliyobaki:

```sql
select tablename, policyname from pg_policies where schemaname = 'public';
```

> ✅ **Utajuaje imefanikiwa:** jibu ni tupu — hakuna policy hata moja.
>
> 🔍 **Sasa fanya hili:** refresh app yako. **Dashboard itakuwa tupu kabisa.**
>
> Usiogope — hiyo ndiyo hali sahihi. RLS ipo, hakuna policy inayoruhusu chochote, kwa hiyo database inakataa kila kitu. **Hii ndiyo hali salama zaidi ya mfumo wowote.** Tunaanzia hapa, kisha tunafungua milango tunayoihitaji tu.

---

### Hatua 4 — Policy ya matukio

`auth.uid()` ni swali: **"ni nani ameingia sasa hivi?"**

Jibu linatoka kwenye token ya mtumiaji, na **database yenyewe** ndiyo inayoisoma. JavaScript haiwezi kuidanganya — hata mtu akifungua Console na kuandika query mwenyewe.

```sql
create policy "tukio langu" on events
  for all
  using      (user_id = auth.uid())     -- rows zipi naziona
  with check (user_id = auth.uid());    -- rows zipi naruhusiwa kuingiza
```

Kumbuka tofauti ya maneno mawili haya, tuliyoijifunza Session 6:
- `using` → **"row hii nionyeshwe?"** (kusoma)
- `with check` → **"row hii iruhusiwe kuingia?"** (kuandika)

---

### Hatua 5 — Policies za tables nyingine

Mchangiaji hana `user_id`. Basi tunajuaje ni wa nani?

Tunafuata mnyororo: **mchangiaji → tukio → mmiliki.**

`exists (select 1 ...)` inamaanisha: *"kama swali hili lina jibu lolote, ruhusu."*

```sql
create policy "wachangiaji wa tukio langu" on contributors
  for all
  using (exists (
    select 1 from events e
    where e.id = contributors.event_id
      and e.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from events e
    where e.id = contributors.event_id
      and e.user_id = auth.uid()
  ));
```

Malipo, ahadi na vitu vina mnyororo mrefu zaidi: **malipo → mchangiaji → tukio → mmiliki.**

```sql
create policy "ahadi za tukio langu" on pledges
  for all
  using (exists (
    select 1 from contributors c
    join events e on e.id = c.event_id
    where c.id = pledges.contributor_id
      and e.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from contributors c
    join events e on e.id = c.event_id
    where c.id = pledges.contributor_id
      and e.user_id = auth.uid()
  ));

create policy "malipo ya tukio langu" on payments
  for all
  using (exists (
    select 1 from contributors c
    join events e on e.id = c.event_id
    where c.id = payments.contributor_id
      and e.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from contributors c
    join events e on e.id = c.event_id
    where c.id = payments.contributor_id
      and e.user_id = auth.uid()
  ));

create policy "vitu vya tukio langu" on in_kind
  for all
  using (exists (
    select 1 from contributors c
    join events e on e.id = c.event_id
    where c.id = in_kind.contributor_id
      and e.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from contributors c
    join events e on e.id = c.event_id
    where c.id = in_kind.contributor_id
      and e.user_id = auth.uid()
  ));
```

> ✅ **Utajuaje imefanikiwa:**
> ```sql
> select tablename, policyname, cmd from pg_policies
> where schemaname = 'public' order by tablename;
> ```
> Unaona policies **tano**, moja kwa kila table.

Database yako sasa iko salama. Lakini app bado haijui jinsi ya kuingia — hiyo ndiyo sehemu inayofuata.

---

## Sehemu ya 3 — Pata code mpya ya login

Code ya skrini ya kuingia nimeiweka kwenye repo. Ichukue:

```bash
git pull
```

Files zilizobadilika ni **tatu**:

| File | Kilichobadilika |
|---|---|
| `app/index.html` | Skrini ya kuingia imeongezwa; dashboard imezungushwa kwenye `#appScreen` |
| `app/js/app.js` | Sehemu mpya ya 7: `angaliaSession()`, `ingia()`, `toka()` |
| `app/css/style.css` | Mwonekano wa skrini ya kuingia na sehemu ya "nani ameingia" |

**Fungua `app/js/app.js` na usome Sehemu ya 7 polepole**, kuanzia mwanzo hadi mwisho. Usikimbilie kuirun — isome kwanza kama hadithi. Vipande vyake:

- `angaliaSession()` — "kuna mtu ameingia tayari?" Supabase inahifadhi session kwenye browser, ndiyo maana ukirefresh hurudishwi kwenye login
- `ingia()` — `signInWithPassword()`, pamoja na validation ile ile tuliyoijifunza Session 6
- `toka()` — `signOut()` kisha `location.reload()`
- `.maybeSingle()` badala ya `.single()` — kwa nini? Angalia maelezo yaliyo ndani ya code

Kisha refresh app yako. **Skrini ya kuingia itaonekana.** Ingia kwa email na password uliyoitengeneza Sehemu ya 1.

> ✅ **Utajuaje imefanikiwa:** Baada ya kuingia, dashboard yako inarudi na data yote. Juu kulia unaona email yako na kitufe cha "Toka".

---

## Sehemu ya 4 — Thibitisha kwamba usalama ni wa kweli

Hapa ndipo penye somo kuu la session nzima. Fanya majaribio haya matatu kwa mpangilio.

### Jaribio 1 — Password isiyo sahihi

Toka, kisha jaribu kuingia kwa password ya uongo.

Ujumbe unasema **"Email au password si sahihi"** — hausemi lipi limekosewa.

*Kwa nini?* Ukimwambia mtu *"email ipo lakini password si sahihi"*, umemthibitishia kwamba akaunti ipo. Anayejaribu kuvunja ameshapata nusu ya jibu. **Usalama siyo code tu — ni hata maneno tunayochagua.**

### Jaribio 2 — Mtumiaji wa pili ⭐

Toka. Sasa ingia kwa akaunti ya **pili** (`mtu2@...`).

Utaona: **umeingia kwa mafanikio, app inafanya kazi, lakini dashboard ni tupu.**

### Jaribio 3 — Thibitisha kwa mkono wako

Ukiwa bado umeingia kama mtumiaji wa pili, fungua **Console (F12)** na andika:

```js
await db.from("events").select("*")
```

Jibu: `[]`

Simama hapa kidogo na ufikirie kinachotokea:

> Hukufichiwa chochote. Umeomba **database moja kwa moja**, ukipita app yetu kabisa. Na database imekukatalia.
>
> Hii ndiyo tofauti kati ya **kuficha** na **kulinda**:
> - Kuficha ni adabu — JavaScript inaamua usione
> - Kulinda ni usalama — database inakataa kutoa
>
> Mtu anaweza kuzunguka JavaScript. Hawezi kuzunguka database.
>
> **Hii ndiyo NFR-3 yetu, ikifanya kazi kweli.** 🔒

---

## Matatizo ya kawaida

**"Email not confirmed" ninapojaribu kuingia**
→ Authentication → Providers → Email → zima "Confirm email". Au futa mtumiaji na umtengeneze upya kwa "Auto Confirm User".

**Nimeweka policies mpya lakini bado kila mtu anaona kila kitu**
→ Policy ya zamani bado ipo. Run:
```sql
select tablename, policyname from pg_policies where schemaname='public';
```
Ukiona inayosema `darasa: kusoma`, ifute. (Hatua ya 3)

**Dashboard ni tupu hata nimeingia kwa akaunti sahihi**
→ Tukio halina `user_id` yako. Angalia:
```sql
select e.jina, u.email from events e join auth.users u on u.id = e.user_id;
```
Kama email siyo yako, rudia hatua ya 2.

**"JSON object requested, multiple (or no) rows returned"**
→ `.single()` bado ipo kwenye `app.js`. Hakikisha umepata code mpya kwa `git pull`.

**Nimeingia lakini siwezi kurekodi malipo — insert inakataliwa**
→ Policy ya `payments` haina `with check`, au haikufanikiwa kuundwa. Rudia hatua ya 5.

**Refresh inanirudisha kwenye login kila mara**
→ `js/supabase.js` lazima ipakie **kabla** ya `js/app.js`. Angalia mpangilio wa `<script>` mwishoni mwa `index.html`.

**Nimekwama mahali pengine**
→ Andika kwenye group: unafanya hatua ipi, na error inasemaje (screenshot ya Console inasaidia sana). Kukwama ni sehemu ya kazi, siyo kushindwa. 💪🏽

---

## Kuwasilisha 📸

Tuma **screenshots mbili** kwenye WhatsApp group:

1. Dashboard yako ikiwa umeingia — na email yako ikionekana juu
2. Console ikionyesha `[]` ukiwa umeingia kama mtumiaji wa pili

---

## Kazi ya ziada (hiari, kwa anayetaka zaidi) 🌟

Ongeza kitufe cha **"Jisajili"** kwenye skrini ya kuingia, kinachotumia:

```js
await db.auth.signUp({ email, password })
```

Jaribu kujisajili kwa email mpya kabisa. Utaingia — lakini hutaona tukio lolote, kwa sababu huna.

**Na hapo kuna swali zuri la kufikiri:** mtumiaji mpya hana tukio. Je, aanze vipi? Nani anamtengenezea tukio lake la kwanza? Lete wazo lako session ijayo.

---

*Session ijayo: **Deployment** — mfumo wetu sasa ni salama, lakini bado unaishi kwenye kompyuta yako peke yako. Tunaupeleka duniani, na kila mmoja anapata link ya kushare.* 🚀
