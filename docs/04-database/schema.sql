-- ============================================================
-- Michango Manager — schema.sql
-- Session 4: Database · Safari ya Software Development
-- ============================================================
-- Hii ni "birth certificate" ya database yetu: mtu yeyote
-- akiwa na file hii anaweza kujenga database yetu upya.
-- Kila table hapa inatoka moja kwa moja kwenye ERD yetu
-- (docs/03-design/erd.md).
--
-- Kumbuka: table ya USER kwenye ERD haipo hapa kwa makusudi —
-- Supabase ina mfumo wake wa watumiaji (auth.users) ambao
-- tutaunganisha kwenye session ya login (FR-A1, FR-A2).
-- ============================================================


-- ------------------------------------------------------------
-- 1. EVENTS — Matukio (FR-B1)
-- ------------------------------------------------------------
create table events (
  -- uuid = kitambulisho cha kipekee; gen_random_uuid() inaunda yenyewe
  id uuid primary key default gen_random_uuid(),

  jina text not null,                    -- "not null" = lazima kijazwe
  aina text not null check (aina in ('harusi', 'msiba', 'sherehe', 'nyingine')),
  tarehe date,
  lengo_la_fedha numeric not null default 0,   -- TZS (NFR-8: sarafu moja)
  status text not null default 'wazi' check (status in ('wazi', 'limefungwa')),  -- FR-B3

  created_at timestamptz not null default now()  -- kumbukumbu: liliundwa lini
);

comment on table events is 'Matukio: harusi, misiba, sherehe (FR-B1)';


-- ------------------------------------------------------------
-- 2. CONTRIBUTORS — Wachangiaji (FR-C1)
-- ------------------------------------------------------------
create table contributors (
  id uuid primary key default gen_random_uuid(),

  -- FOREIGN KEY: kila mchangiaji ni wa tukio fulani (ERD: EVENT ||--o{ CONTRIBUTOR)
  -- "on delete cascade" = tukio likifutwa, wachangiaji wake wanafutwa pia
  event_id uuid not null references events(id) on delete cascade,

  jina text not null,
  simu text not null,                    -- simu ndiyo kitambulisho cha kawaida TZ
  email text,                            -- hiari (hakuna "not null")

  created_at timestamptz not null default now()
);

comment on table contributors is 'Wachangiaji wa tukio (FR-C1)';


-- ------------------------------------------------------------
-- 3. PLEDGES — Ahadi (FR-D1)
-- ------------------------------------------------------------
create table pledges (
  id uuid primary key default gen_random_uuid(),

  -- "unique" = mchangiaji ana ahadi MOJA tu (ERD: CONTRIBUTOR ||--o| PLEDGE)
  -- lakini anaweza kutokuwa nayo kabisa — FR-D3 inaruhusu kulipa bila ahadi
  contributor_id uuid not null unique references contributors(id) on delete cascade,

  kiasi numeric not null check (kiasi > 0),   -- ahadi ya TZS 0 haina maana!
  tarehe date not null default current_date
);

comment on table pledges is 'Ahadi za michango — moja kwa mchangiaji, hiari (FR-D1, FR-D3)';


-- ------------------------------------------------------------
-- 4. PAYMENTS — Malipo (FR-E1, FR-E2)
-- ------------------------------------------------------------
create table payments (
  id uuid primary key default gen_random_uuid(),

  -- HAKUNA "unique" hapa — mchangiaji analipa mara NYINGI (FR-E2: kidogo kidogo)
  contributor_id uuid not null references contributors(id) on delete cascade,

  kiasi numeric not null check (kiasi > 0),
  tarehe date not null default current_date,
  njia text not null check (njia in ('cash', 'mpesa', 'benki')),
  kumbukumbu text,                       -- hiari: namba ya muamala n.k.

  created_at timestamptz not null default now()
);

comment on table payments is 'Malipo — mengi kwa mchangiaji (FR-E1, FR-E2)';

-- ANGALIA: hakuna column ya "balance" popote!
-- Balance inahesabiwa: ahadi - jumla ya malipo (FR-E3).
-- Ukihifadhi kitu kinachoweza kuhesabiwa, siku moja kitakosana na ukweli.


-- ------------------------------------------------------------
-- 5. IN_KIND — Michango Isiyo ya Fedha (FR-H1)
-- Unique value yetu — kutoka kwa mwanafunzi wetu!
-- ------------------------------------------------------------
create table in_kind (
  id uuid primary key default gen_random_uuid(),

  contributor_id uuid not null references contributors(id) on delete cascade,

  maelezo text not null,                 -- "mahema 2", "gunia la mchele", "usafiri"
  thamani_makadirio numeric check (thamani_makadirio > 0),  -- HIARI (NFR-9)!
  tarehe date not null default current_date,

  created_at timestamptz not null default now()
);

comment on table in_kind is 'Michango ya vitu/huduma — thamani ni hiari (FR-H1, NFR-9)';


-- ============================================================
-- Mwisho. Tables 5 zimeundwa: events, contributors, pledges,
-- payments, in_kind — sawa kabisa na ERD yetu.
-- Hatua ijayo: seed.sql (data ya majaribio)
-- ============================================================
