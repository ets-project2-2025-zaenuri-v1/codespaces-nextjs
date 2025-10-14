---

🧠 TECH SPEC v1.0

ProjectProject: Pempek Palembang POS & Ordering System
Prepared for: Claude Code + GLM 4.6 (Agent AI)
Environment: GitHub Codespaces + Supabase + Vercel + Clerk + Xendit


---

🎯 GOAL UTAMA

Membangun sistem aplikasi F&B digital terintegrasi untuk kedai makanan Pempek Palembang Asli Indonesia yang terdiri dari:

1. POS Kasir (Frontend & Backend)

2. QR Table Ordering (pelanggan bisa pesan langsung)


3. Website Menu + Checkout


4. Manajemen stok, resep (BOM), supplier & pembelian


5. KDS (Kitchen Display System)


6. Dashboard Admin lengkap


7. Integrasi pembayaran (Cash + Xendit)


8. Integrasi WhatsApp (share struk / notifikasi)


9. Multi-outlet ready


10. Realtime sync dengan Supabase


11. Tampilan UI/UX colorful dan profesional



> Semua data bersumber langsung dari Supabase — tanpa dummy data di kode TypeScript.




---

🏗️ TEKNOLOGI INTI

Komponen	Stack / Tool

Frontend Framework	Next.js (App Router, TypeScript)
UI Library	shadcn/ui + Tailwind CSS
Database	Supabase (PostgreSQL)
Backend Logic	Next.js API Routes (server-side)
Auth	Clerk (Email + Password)
AI Integration	Google AI Studio API (free key)
Hosting	Vercel (Production + Staging)
Dev Environment	GitHub Codespaces (Tablet Android)
Debugger Mobile	ERUDA
Payment Gateway	Xendit
Notification	WhatsApp Text Notifikasi Free push ke chat Whatsapp
Realtime Engine	Supabase Realtime
Version Control	GitHub main branch
Monitoring	Console + ERUDA (tanpa Sentry)


---

🧩 FITUR-FITUR MVP

Fitur	Deskripsi

POS Kasir	CRUD order, pembayaran (tunai & Xendit), cetak & kirim struk
QR Table Ordering	Pelanggan scan QR meja → pesan → bayar di kasir
Website Menu	Menu publik, add-to-cart, order & status
Kitchen Display System (KDS)	1 layar (NEW, IN_PROGRESS, READY, DONE)
Manajemen Stok & Resep	Deduct stok otomatis via trigger Supabase
Supplier & Pembelian	PO & GRN sederhana, update stok otomatis
Laporan & Analitik	Sales daily, top items, stock critical, COGS
Audit Log	Ubah harga, void order, update stok
Multi Outlet	Organisasi, outlet, anggota, role management
AI	Rekomendasi menu, prediksi stok, anomali transaksi
Admin Dashboard	CRUD semua entitas, laporan, dan setting
UI/UX	Colorful, profesional, mobile-first, responsive



---

🧠 ARSITEKTUR SISTEM

Next.js (App Router)
 ├── Frontend (POS, Menu, Admin)
 ├── API Routes (server logic)
 └── Clerk Auth Middleware
        ↓
 Supabase (PostgreSQL)
        ↓
 Triggers (BOM, Stock, KDS)

Frontend: Client fetch → API (server) → Supabase (service role)

Backend: Next.js API Routes handle CRUD & validation

Supabase: Menangani trigger, RLS, view, dan function (fn_recalculate, fn_deduct_stock_on_paid)

Realtime: Subscriptions (orders, kds, stock)

Auth: Clerk user dihubungkan ke org_members (Supabase)

Payment: Xendit webhook → update Supabase (orders.status=PAID)



---

🧾 DATABASE SCHEMA (Supabase)

Skema utama:

organizations

outlets

org_members

categories

products

product_variants

addons

product_addons

media_assets

dining_tables

qr_sessions

ingredients

recipes

recipe_items

orders

order_items

order_item_addons

payments

stock_movements

wastage

stock_take

suppliers

purchase_orders

purchase_order_items

goods_receipts

goods_receipt_items

kds_tickets

audit_logs


Views:

v_sales_daily

v_top_items

v_stock_critical


Triggers:

fn_deduct_stock_on_paid()

fn_recalculate_order_totals()

fn_make_kds_on_confirmed()

set_timestamp()


RLS Policies:

Staging: open access (for dev)

Production: predicate app_is_member_of(org, clerk_user_id)



---

🔌 API ENDPOINTS (Summary)

Modul	Endpoint	Method	Deskripsi

Products	/api/products	GET/POST	Ambil / tambah produk
Orders	/api/orders	GET/POST/PUT	CRUD order
Payments	/api/payments/xendit/*	POST	Integrasi Xendit
KDS	/api/kds	GET/PUT	Monitor status dapur
Stock	/api/stock/*	GET/POST	Movements, GRN, wastage
Reports	/api/reports/*	GET	Sales, top items, stok kritis
Tables	/api/tables	GET/POST	Manajemen meja & QR
Admin	/api/admin/*	GET/POST/PUT	Dashboard CRUD data
Audit	/api/audit	GET	Riwayat aktivitas


> Semua endpoint terhubung langsung ke Supabase.
Tidak ada dummy data. Semua fetch → insert → update → via API.




---

💻 UI/UX DESIGN SYSTEM

🎨 Color Palette

Elemen	Warna	Hex

Primary	Orange	#FF7A00
Secondary	Mint Green	#5AC8B8
Accent	Golden Yellow	#FFD54F
Background	Soft Ivory	#FFF8F0
Neutral	Charcoal Gray	#2E2E2E
Text	Dark Slate Gray	#3E3E3E


✍️ Typography

Display: Poppins (judul, angka KPI)

Body: Inter (teks utama)


🧩 Components

Buttons: Rounded 2xl, shadow halus

Cards: Shadow-md, hover lift

Icons: lucide-react

Animations: framer-motion fade + bounce-in

Chart: Recharts / ApexCharts (warna orange + mint)


📱 Layout Style

Modul	Tema	Desain

POS	Ivory + Orange	Grid 2 kolom, animasi add-to-cart
QR Menu	Gradasi Orange	Floating bottom bar
KDS	Dark Mode	Status warna dinamis
Admin Dashboard	Clean & colorful	Sidebar dark + chart vibrant



---

🧭 ADMIN DASHBOARD STRUCTURE

/admin
  ├── overview
  ├── catalog (categories, products, addons)
  ├── tables
  ├── inventory (ingredients, recipes, stock, purchase)
  ├── orders (list, detail, void)
  ├── reports (sales, top items, cogs)
  └── settings (organization, outlets, printers, auth)

Role Access

Owner: semua akses

Admin: semua kecuali hapus organisasi

Kasir/Koki/Kurir: tidak punya akses /admin



---

🎯 ROADMAP MVP

🚀 M1 — Fondasi & POS (3 minggu)

Setup monorepo (Next.js + Tailwind + shadcn)

Implement Clerk & Supabase schema

POS CRUD order + pembayaran cash

Realtime stock deduction trigger

Cetak & kirim struk via WA link

Audit logs


⚙️ M2 — QR Ordering + KDS + Website Menu (2 minggu)

QR scan → order → confirm

KDS ticket auto-create

Laporan harian (view)

Integrasi Xendit (kasir mode)

Stok opname, wastage simple


🧱 M3 — Supplier, Admin Dashboard, Reports (2 minggu)

CRUD supplier, PO, GRN

Dashboard admin lengkap

Multi-outlet management

WhatsApp API optional

Finishing UI/UX profesional colorful



---

🧠 NON-FUNCTIONAL REQUIREMENTS

Aspek	Deskripsi

Keamanan	Clerk Auth + RLS Supabase
Reliabilitas	Transaksi atomic + trigger DB
Kinerja	Responsif mobile/tablet/desktop
Data Real-time	Supabase Realtime untuk orders, stok, kds
Penyimpanan Data	Retensi 2 tahun sesuai UU PDP
Offline Mode	Akan dikembangkan fase berikutnya
Log Aktivitas	Audit trails lengkap



---

🌈 UI/UX GUIDELINES (Summary)

Warna utama: Orange (#FF7A00)

Accent: Mint Green (#5AC8B8)

Font: Inter + Poppins

Tombol utama: orange solid, hover gradasi

Card: rounded-xl, shadow lembut

Sidebar dark mode (charcoal)

Chart: vibrant color (orange, yellow, mint)

Layout: minimalis tapi cerah (clean, tradisional-modern)

Animasi: smooth fade-in, bounce tap effect

Feedback: notifikasi hijau mint (berhasil), merah (gagal)



---

⚡ NEXT ACTION UNTUK AGENT AI (Claude Code + GLM 4.6)

1. Generate Supabase Migration otomatis dari schema (A).


2. Generate semua endpoint API (B) sesuai kontrak payload.


3. Implement UI POS & Admin (C & D) dengan Tailwind dan shadcn.


4. Integrasikan Clerk Auth → Supabase via clerk_user_id.


5. Implement Xendit webhook untuk update orders.status=PAID.


6. Gunakan ERUDA untuk debugging di tablet.


7. Deploy staging di Vercel.




---

🔒 LEGAL & COMPLIANCE

Mematuhi UU PDP Indonesia (data tersimpan 2 tahun).

Kebijakan privasi & terms akan dibuat dalam template profesional di fase deploy.

Data pembayaran & struk terenkripsi via Supabase + HTTPS.



---

✅ RINGKASAN UTAMA UNTUK AGENT AI

Kategori	Detail

Framework	Next.js + Tailwind + shadcn
Backend	Next.js API + Supabase
Auth	Clerk
DB	Supabase (schema di atas)
Payment	Xendit
Notif	WhatsApp
Design	Colorful, warm, professional
Role	Owner, Admin, Kasir, Koki, Kurir
Hosting	Vercel
Dev Env	GitHub Codespaces (Tablet Android)
Debug	ERUDA
Goal	CRUD semua fitur fungsional + real data Supabase



---