// ============================================================
// Michango Manager — supabase.js
// Session 5: Kuunganisha app na database
// ============================================================
// File hii ni "daraja" kati ya app yetu (browser) na Supabase.
// Kila file nyingine ya JS itatumia `db` iliyoundwa hapa.
// ============================================================

// Badilisha hizi mbili na za project YAKO:
// Supabase → Settings → API → Project URL na anon public key
const SUPABASE_URL = "https://wiifvpdczqymyanhezqi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZimKDgsMxFZcj53gTVOlvg_j9Ynv_0u";

// Tunaunda "client" — ndiye atakayeongea na database kwa niaba yetu
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------------------------------------------------
// Kwa nini anon key iko wazi hapa?
// ------------------------------------------------------------
// Kwa sababu ni ya HADHARANI kwa makusudi — inakwenda kwenye
// browser ya kila mtumiaji, huwezi kuificha hata ukitaka.
//
// Basi usalama uko wapi? Uko kwenye DATABASE yenyewe:
// Row Level Security (RLS) na policies zake ndizo zinazoamua
// nani anaruhusiwa kuona au kubadilisha nini. (NFR-3)
//
// Kanuni: "Usalama hauko kwenye kuficha ufunguo —
//          uko kwenye kufunga milango isiyohitajika."
// ============================================================
