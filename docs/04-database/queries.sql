-- ============================================================
-- Michango Manager — queries.sql
-- Session 4: SQL zetu za kwanza — kutoka rahisi hadi nyota ya leo
-- ============================================================
-- Run kila query MOJA MOJA kwenye SQL Editor (highlight + Run),
-- kwa mpangilio. Kila moja inajenga juu ya iliyotangulia.
-- ============================================================


-- ------------------------------------------------------------
-- HATUA 1: SELECT — "nionyeshe kila kitu"
-- ------------------------------------------------------------
select * from contributors;

-- * inamaanisha "columns zote". Rows 4 — wachangiaji wetu wote.


-- ------------------------------------------------------------
-- HATUA 2: Chagua columns — "nionyeshe jina na simu tu"
-- ------------------------------------------------------------
select jina, simu from contributors;


-- ------------------------------------------------------------
-- HATUA 3: WHERE — "chuja" (FR-C3 ni hii hii kwa msingi wake!)
-- ------------------------------------------------------------
select * from contributors
where jina = 'Mzee Kassim';

-- Jaribu pia: tafuta kwa simu
select * from contributors
where simu = '0688000003';


-- ------------------------------------------------------------
-- HATUA 4: Hesabu ya kwanza — SUM (jumla ya malipo yote)
-- ------------------------------------------------------------
select sum(kiasi) as jumla_iliyokusanywa
from payments;

-- Jibu: 1,100,000 — namba hii mtaiona tena kwenye dashboard!


-- ------------------------------------------------------------
-- HATUA 5: JOIN — kuunganisha tables mbili
-- "Malipo ni ya NANI?" — payments ina contributor_id tu;
-- majina yako kwenye contributors. JOIN inaziunganisha.
-- ------------------------------------------------------------
select
  c.jina,
  p.kiasi,
  p.tarehe,
  p.njia
from payments p
join contributors c on c.id = p.contributor_id
order by p.tarehe;

-- Angalia: Mama Ntilie anaonekana mara MBILI — malipo yake mawili (FR-E2)


-- ------------------------------------------------------------
-- HATUA 6: GROUP BY — jumla KWA KILA mchangiaji
-- ------------------------------------------------------------
select
  c.jina,
  sum(p.kiasi) as jumla_ya_malipo
from contributors c
join payments p on p.contributor_id = c.id
group by c.jina;

-- Mama Ntilie: 500,000 (300k + 200k zimejumlishwa!)
-- Dada Neema haonekani — hana malipo. Tutamrudisha kwenye hatua ijayo...


-- ------------------------------------------------------------
-- ⭐ NYOTA YA LEO: Balance ya kila mchangiaji (FR-E3)
-- ahadi - jumla ya malipo — ile kanuni ya ERD:
-- "balance haihifadhiwi, inahesabiwa" — sasa inafanya kazi KWELI
-- ------------------------------------------------------------
select
  c.jina,
  coalesce(pl.kiasi, 0)                as ahadi,
  coalesce(sum(p.kiasi), 0)            as amelipa,
  coalesce(pl.kiasi, 0)
    - coalesce(sum(p.kiasi), 0)        as balance
from contributors c
left join pledges  pl on pl.contributor_id = c.id
left join payments p  on p.contributor_id  = c.id
group by c.jina, pl.kiasi
order by balance desc;

-- Maneno mapya mawili:
--   LEFT JOIN  = "wote, hata wasio na ahadi/malipo" — ndiyo inayomrudisha
--                Dada Neema (na Fundi Musa) kwenye orodha
--   COALESCE   = "kama hakuna kitu (null), tumia 0" — bila hii,
--                hesabu ya mtu asiye na malipo ingekuwa null, siyo namba
--
-- Matokeo yanayotarajiwa:
--   Mzee Kassim   1,000,000    600,000    400,000   ← balance!
--   Dada Neema      300,000          0    300,000
--   Mama Ntilie     500,000    500,000          0   ← amelipa yote
--   Fundi Musa            0          0          0   ← wa vitu (angalia chini)
--
-- Linganisheni na dashboard yetu — status badges zile zile!


-- ------------------------------------------------------------
-- BONUS 1: Asilimia ya lengo (FR-F1 — ile donut!)
-- ------------------------------------------------------------
select
  e.jina,
  e.lengo_la_fedha,
  coalesce(sum(p.kiasi), 0) as iliyokusanywa,
  round(
    coalesce(sum(p.kiasi), 0) * 100.0 / e.lengo_la_fedha
  ) as asilimia
from events e
left join contributors c on c.event_id = e.id
left join payments p     on p.contributor_id = c.id
group by e.id, e.jina, e.lengo_la_fedha;

-- Asilimia: 22 (1,100,000 / 5,000,000)
-- Subiri — dashboard inasema 65%! Kwa nini tofauti? 🤔
-- ...kwa sababu dashboard ina data ya KUBUNI (3,250,000 hardcoded).
-- Hii hapa ndiyo namba ya KWELI kutoka database.
-- Session ijayo tunaziunganisha — na uongo unakufa. 😄


-- ------------------------------------------------------------
-- BONUS 2: Bibi wa gunia la mchele hasahauliki (FR-H3)
-- Michango ya vitu ya kila mchangiaji
-- ------------------------------------------------------------
select
  c.jina,
  k.maelezo,
  k.thamani_makadirio,   -- null = hiari, na ni sawa kabisa (NFR-9)
  k.tarehe
from in_kind k
join contributors c on c.id = k.contributor_id;

-- Fundi Musa | Mahema 2 | null | 2026-09-15
-- Hakuna mchangiaji anayepotea. 🎁
