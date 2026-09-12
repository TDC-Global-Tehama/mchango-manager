-- ============================================================
-- Michango Manager — seed.sql
-- Data ya majaribio: ILE ILE iliyo kwenye dashboard yetu!
-- Harusi ya Amina & Juma, Mama Ntilie, Mzee Kassim,
-- Dada Neema, na Fundi Musa (na mahema yake 🎁)
-- ============================================================
-- Kwa nini data ile ile? Session tutakapoiunganisha app na
-- database, dashboard itaonyesha namba zile zile mlizozizoea —
-- na mtajua kila kitu kimeunganishwa sawasawa.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Tukio (tunalipa id maalum ili tuweze kulirejea chini)
-- ------------------------------------------------------------
insert into events (id, jina, aina, tarehe, lengo_la_fedha)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Harusi ya Amina & Juma',
  'harusi',
  '2026-12-12',
  5000000
);


-- ------------------------------------------------------------
-- 2. Wachangiaji wanne
-- ------------------------------------------------------------
insert into contributors (id, event_id, jina, simu) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mama Ntilie',  '0754000001'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Mzee Kassim',  '0713000002'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Dada Neema',   '0688000003'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Fundi Musa',   '0765000004');


-- ------------------------------------------------------------
-- 3. Ahadi (angalia: Fundi Musa HANA ahadi — FR-D3!)
-- ------------------------------------------------------------
insert into pledges (contributor_id, kiasi, tarehe) values
  ('c0000000-0000-0000-0000-000000000001',  500000, '2026-09-01'),  -- Mama Ntilie
  ('c0000000-0000-0000-0000-000000000002', 1000000, '2026-09-01'),  -- Mzee Kassim
  ('c0000000-0000-0000-0000-000000000003',  300000, '2026-09-02');  -- Dada Neema


-- ------------------------------------------------------------
-- 4. Malipo
-- Mama Ntilie: amelipa YOTE (mara mbili — FR-E2: kidogo kidogo!)
-- Mzee Kassim: nusu safari (balance 400,000)
-- Dada Neema: bado hajalipa (hakuna row — na hiyo yenyewe ni taarifa)
-- ------------------------------------------------------------
insert into payments (contributor_id, kiasi, tarehe, njia, kumbukumbu) values
  ('c0000000-0000-0000-0000-000000000001', 300000, '2026-09-05', 'mpesa', 'TXN-8801'),
  ('c0000000-0000-0000-0000-000000000001', 200000, '2026-09-20', 'cash',  null),
  ('c0000000-0000-0000-0000-000000000002', 600000, '2026-09-10', 'benki', 'REF-2210');


-- ------------------------------------------------------------
-- 5. Mchango wa vitu — Fundi Musa na mahema yake (FR-H1)
-- Angalia: thamani_makadirio ni NULL — hiari (NFR-9)!
-- ------------------------------------------------------------
insert into in_kind (contributor_id, maelezo, thamani_makadirio, tarehe)
values (
  'c0000000-0000-0000-0000-000000000004',
  'Mahema 2',
  null,
  '2026-09-15'
);


-- ============================================================
-- Thibitisha: run hii — unapaswa kuona rows 4
-- ============================================================
select jina, simu from contributors;
