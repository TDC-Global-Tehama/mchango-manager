-- ============================================================
-- Michango Manager — Session 7: Login na Usalama
-- SQL ya homework yako
-- ============================================================
-- Maelekezo kamili yako kwenye docs/homework-session7.md
--
-- 📌 KANUNI MUHIMU:
-- Usipaste file hii yote mara moja. Paste HATUA MOJA, bonyeza
-- Run, soma jibu, kisha nenda inayofuata.
--
-- Ukiharakisha na kitu kikaenda vibaya, hutajua ni hatua ipi
-- iliyokosea — na utatumia saa moja kutafuta kitu ambacho
-- ungekiona kwa sekunde tano.
-- ============================================================


-- ============================================================
-- KABLA YA SQL: tengeneza watumiaji wawili
-- ============================================================
-- Hii haifanyiki kwa SQL. Nenda:
--   Authentication → Users → Add user
--
-- Tengeneza WAWILI:
--   1. Email yako (hii ndiyo utakayoitumia kuingia)
--   2. Email nyingine yoyote, mfano mtu2@mfano.co.tz
--
-- ⚠️ Washa "Auto Confirm User" kwa wote wawili.
--
-- Kisha: Authentication → Providers → Email → zima "Confirm email"
-- ============================================================


-- ============================================================
-- HATUA 1 — Jua id yako
-- ============================================================
select id, email from auth.users;

-- Unapaswa kuona watumiaji wawili.
-- Nakili EMAIL YAKO — utaihitaji hatua inayofuata.


-- ============================================================
-- HATUA 2 — Ongeza user_id kwenye matukio
-- ============================================================
-- Kumbuka ERD yetu ya Session 3: tulichora USER tangu mwanzo,
-- lakini hatukutengeneza table yake — Supabase ina yake.
-- Leo tunaiunganisha.
--
-- Bila column hii, "kila mratibu anaona data yake tu"
-- haiwezekani. Database haina namna ya kujua tukio ni la nani.

alter table events
  add column user_id uuid references auth.users(id) on delete cascade;


-- ⚠️ BADILISHA email hapa chini IWE YAKO
update events
set user_id = (select id from auth.users where email = 'email-yako@mfano.co.tz')
where user_id is null;


-- Sasa kila tukio LAZIMA liwe na mmiliki
alter table events alter column user_id set not null;


-- ✅ Thibitisha: kila tukio lina uuid, hakuna null
select jina, user_id from events;

-- Ukipata kosa kwenye "set not null", maana yake update
-- haikufanya kazi — email uliyoandika haipo. Rudi hatua 1.


-- ============================================================
-- HATUA 3 — Ondoa policies za zamani  ⚠️ MUHIMU KULIKO ZOTE
-- ============================================================
-- Postgres ina-unganisha policies kwa AU (OR):
--
--   policy ya zamani: using (true)                  ← kila mtu
--   policy mpya:      using (user_id = auth.uid())  ← mimi tu
--
--   Matokeo: "kila mtu AU mimi" = KILA MTU.
--
-- Ukiacha ya zamani, mpya haifanyi chochote — na utaamini
-- usalama upo wakati haupo kabisa.

drop policy if exists "darasa: kusoma"          on events;
drop policy if exists "darasa: kusoma"          on contributors;
drop policy if exists "darasa: kusoma"          on pledges;
drop policy if exists "darasa: kusoma"          on payments;
drop policy if exists "darasa: kusoma"          on in_kind;
drop policy if exists "darasa: kuandika malipo" on payments;


-- ✅ Thibitisha: jibu linapaswa kuwa TUPU
select tablename, policyname from pg_policies where schemaname = 'public';


-- 🔍 SASA FANYA HILI: refresh app yako.
-- Dashboard itakuwa TUPU KABISA.
--
-- Usiogope. Hiyo ndiyo hali sahihi: RLS ipo, hakuna policy
-- inayoruhusu chochote, kwa hiyo database inakataa kila kitu.
-- Hii ndiyo hali salama zaidi ya mfumo wowote — tunaanzia hapa,
-- kisha tunafungua milango tunayoihitaji TU.


-- ============================================================
-- HATUA 4 — Policy ya matukio: "langu tu"
-- ============================================================
-- auth.uid() ni swali: "ni nani ameingia sasa hivi?"
--
-- Jibu linatoka kwenye token ya mtumiaji, na DATABASE yenyewe
-- ndiyo inayoisoma. JavaScript haiwezi kuidanganya — hata mtu
-- akifungua Console na kuandika query mwenyewe.

create policy "tukio langu" on events
  for all
  using      (user_id = auth.uid())     -- rows zipi naziona
  with check (user_id = auth.uid());    -- rows zipi naruhusiwa kuingiza

-- Kumbuka tofauti (tuliijifunza Session 6):
--   using      → "row hii nionyeshwe?"       (kusoma)
--   with check → "row hii iruhusiwe kuingia?" (kuandika)


-- ============================================================
-- HATUA 5 — Tables nyingine: kurithi ruhusa
-- ============================================================
-- Mchangiaji hana user_id. Tunajuaje ni wa nani?
-- Tunafuata mnyororo: mchangiaji → tukio → mmiliki.
--
-- "exists (select 1 ...)" = "kama swali hili lina jibu, ruhusu"

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


-- Ahadi, malipo na vitu vina mnyororo mrefu zaidi:
-- malipo → mchangiaji → tukio → mmiliki

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


-- ============================================================
-- ✅ KUTHIBITISHA — unapaswa kuona policies TANO
-- ============================================================
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename;


-- ============================================================
-- IMEKAMILIKA. Sasa nenda kwenye code:
--
--   git pull
--
-- Kisha refresh app yako — skrini ya kuingia itaonekana.
-- Ingia kwa email na password uliyoitengeneza mwanzoni.
--
-- Maelekezo yaliyobaki (majaribio matatu ya kuthibitisha
-- usalama) yako kwenye docs/homework-session7.md
-- ============================================================
