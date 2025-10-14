# Pempek POS - Sistem Point of Sale untuk Kedai Pempek

Sistem POS modern untuk kedai Pempek Palembang dengan QR Ordering, Kitchen Display, dan Manajemen Stok yang terintegrasi.

## 🚀 Fitur Utama

- **POS Kasir** - Sistem kasir modern dengan interface intuitif
- **QR Table Ordering** - Pelanggan bisa pesan langsung dari meja
- **Kitchen Display System (KDS)** - Monitor order real-time di dapur
- **Manajemen Stok** - Pantau stok bahan baku otomatis
- **Laporan & Analitik** - Dashboard lengkap dengan penjualan dan profit analysis
- **Multi-Outlet** - Kelola multiple outlet dari satu dashboard
- **WhatsApp Notifications** - Kirim struk dan notifikasi via WhatsApp

## 🛠️ Teknologi

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Payment**: Xendit (opsional)
- **Real-time**: Supabase Realtime

## 📋 Prerequisites

- Node.js 18+ 
- Akun Supabase
- Akun Clerk

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd codespaces-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.local.example` ke `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi dengan nilai yang sesuai:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Setup Supabase Database

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Copy URL dan keys ke environment variables
3. Run migration SQL di Supabase SQL Editor:

```sql
-- Copy contents dari supabase/migrations/001_initial_schema.sql
```

4. Run RLS policies:

```sql
-- Copy contents dari supabase/migrations/002_rls_policies.sql
```

### 5. Setup Clerk

1. Buat aplikasi baru di [Clerk Dashboard](https://dashboard.clerk.com)
2. Copy keys ke environment variables
3. Configure redirect URLs:
   - Sign in: `http://localhost:3000/sign-in`
   - Sign up: `http://localhost:3000/sign-up`
   - After sign in: `http://localhost:3000/dashboard`
   - After sign up: `http://localhost:3000/dashboard`

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   ├── clerk.tsx       # Clerk auth utilities
│   └── utils.ts        # Helper functions
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   └── _app.tsx        # App wrapper
├── supabase/           # Database migrations
│   ├── migrations/
│   └── ...
├── styles/             # Global styles
├── types/              # TypeScript types
└── public/             # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#FF7A00)
- **Secondary**: Mint Green (#5AC8B8)
- **Accent**: Golden Yellow (#FFD54F)
- **Background**: Soft Ivory (#FFF8F0)
- **Neutral**: Charcoal Gray (#2E2E2E)

### Typography
- **Display**: Poppins (headings, KPI numbers)
- **Body**: Inter (main text)

## 📱 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order
- `GET /api/orders/[id]` - Get order details

### KDS
- `GET /api/kds` - Get KDS tickets
- `PUT /api/kds/[id]` - Update KDS ticket status

### Stock
- `GET /api/stock/ingredients` - Get ingredients
- `POST /api/stock/movements` - Create stock movement
- `GET /api/stock/critical` - Get critical stock items

## 🔐 Authentication & Authorization

### Roles
- **Owner**: Full access to all features
- **Admin**: Full access except organization deletion
- **Cashier**: Orders, payments, basic product access
- **Cook**: KDS access only
- **Waiter**: Orders, table management
- **Courier**: Order status updates

### Row Level Security (RLS)
Semua data dilindungi dengan RLS policies untuk memastikan user hanya bisa mengakses data dari organisasi mereka.

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Setup environment variables di Vercel
4. Deploy!

### Environment Variables untuk Production:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Pempek POS
```

## 📝 Development Notes

### Database Schema
Lihat `supabase/migrations/001_initial_schema.sql` untuk schema lengkap.

### API Patterns
- Server-side API routes untuk semua database operations
- Input validation di server side
- Error handling dengan status codes yang tepat
- Audit logging untuk semua perubahan data

### Real-time Features
- Supabase Realtime untuk:
  - Order status updates
  - KDS ticket updates
  - Stock level changes
  - Multi-user collaboration

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Untuk support atau questions:
- Email: support@pempekpos.com
- Documentation: [docs.pempekpos.com](https://docs.pempekpos.com)

---

Built with ❤️ for kedai Pempek Palembang
