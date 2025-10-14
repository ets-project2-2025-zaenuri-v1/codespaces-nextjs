# Panduan Setup Admin dan Testing untuk Pempek POS

Panduan ini akan membantu Anda mengatasi masalah dengan menambahkan produk, mengedit produk, dan setup akun admin untuk testing development.

## 🔧 Masalah yang Dihadapi

1. **Gagal menambah produk**: Produk tidak tersimpan di database Supabase
2. **Gagal mengedit produk**: Perubahan tidak tersimpan di database Supabase
3. **Akun tidak memiliki akses full CRUD**: Akun user tidak bisa melakukan semua operasi
4. **Tidak ada tombol sign out**: Tidak bisa keluar dari aplikasi

## ✅ Solusi yang Telah Diimplementasi

### 1. Tombol Sign Out

Saya telah menambahkan tombol "Keluar" di dashboard dengan navigasi ke halaman sign-out.

**Lokasi**: `pages/dashboard.tsx`
**Implementasi**:
- Tombol "Keluar" dengan styling merah
- Navigasi ke `/sign-out`
- Sign out page dengan loading indicator

### 2. User Authentication

Saya telah memperbaiki semua API endpoints untuk menggunakan user authentication dari Clerk.

**Lokasi**: 
- `pages/api/auth/user.ts` - API untuk mendapatkan dan membuat user
- `pages/api/products/index.ts` - API produk dengan authentication
- `pages/api/products/[id].ts` - API detail produk dengan authentication
- `pages/api/categories/index.ts` - API kategori dengan authentication
- `pages/api/categories/[id].ts` - API detail kategori dengan authentication

**Implementasi**:
- Menggunakan `getAuth(req)` dari Clerk
- Auto-create user record di database saat pertama kali login
- Default role: 'admin'
- Default organization_id: '00000000-0000-0000-0000-000000000001'

## 🚀 Cara Setup Akun Admin

### 1. Login dengan Akun Clerk

1. Buka aplikasi di `http://localhost:3001`
2. Klik "Daftar" untuk membuat akun baru
3. Gunakan email Gmail Anda
4. Selesaikan proses registrasi

### 2. Verifikasi User Creation

1. Setelah login, user akan secara otomatis dibuat di database Supabase
2. User akan memiliki role 'admin' dan organization_id default
3. User akan memiliki akses full CRUD ke semua resources

### 3. Test CRUD Operations

1. **Tambah Kategori**:
   - Klik tombol "Kategori" di dashboard
   - Klik "Kategori Baru"
   - Isi form dan simpan
   - Verifikasi kategori muncul di daftar

2. **Tambah Produk**:
   - Klik tombol "Produk" di dashboard
   - Klik "Produk Baru"
   - Isi form dan simpan
   - Verifikasi produk muncul di daftar

3. **Edit Produk**:
   - Klik tombol "Detail" pada produk
   - Klik tombol "Edit"
   - Ubah data dan simpan
   - Verifikasi perubahan tersimpan

4. **Hapus Produk**:
   - Klik tombol "Detail" pada produk
   - Klik tombol "Hapus"
   - Konfirmasi penghapusan
   - Verifikasi produk dihapus

## 🧪 Testing Checklist

- [ ] Login dengan akun Clerk berhasil
- [ ] User record dibuat di database Supabase
- [ ] Tombol "Keluar" berfungsi
- [ ] Tambah kategori berhasil
- [ ] Tambah produk berhasil
- [ ] Edit kategori berhasil
- [ ] Edit produk berhasil
- [ ] Hapus kategori berhasil
- [ ] Hapus produk berhasil
- [ ] Data tersimpan di database Supabase
- [ ] Data muncul kembali setelah refresh

## 🐛 Troubleshooting

### Issue: "Gagal membuat produk"

**Possible Solutions**:
1. **Periksa Console**: Buka browser dev tools dan lihat console untuk error
2. **Cek API Response**: Buka tab Network dan lihat response dari API calls
3. **Verify Environment Variables**: Pastikan `.env.local` memiliki Supabase credentials
4. **Test Database Connection**: Akses `/api/test-db` untuk verifikasi koneksi database

### Issue: "Unauthorized"

**Possible Solutions**:
1. **Login Ulang**: Logout dan login kembali
2. **Clear Browser Cache**: Clear browser cache dan cookies
3. **Restart Development Server**: Restart server dengan `npm run dev`

### Issue: "User tidak ditemukan di database"

**Possible Solutions**:
1. **Akses User API**: Akses `/api/auth/user` untuk membuat user record
2. **Refresh Halaman**: Refresh halaman dashboard setelah login
3. **Check Clerk User ID**: Pastikan user ID dari Clerk tersimpan dengan benar

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'admin',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Organizations Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Security Notes

1. **Service Role Key**: API endpoints menggunakan service role key untuk akses penuh ke database
2. **User Authentication**: Semua API endpoints memerlukan user authentication dari Clerk
3. **Auto-Creation**: User record dibuat otomatis saat pertama kali login
4. **Default Role**: Semua user baru memiliki role 'admin' untuk kemudahan development

## 🎯 Next Steps

Setelah menyelesaikan setup admin:

1. **Implementasi Fitur Berikutnya**:
   - POS Kasir dengan CRUD orders
   - QR Table Ordering
   - Kitchen Display System (KDS)

2. **Enhance Authentication**:
   - Role-based access control (RBAC)
   - Multi-organization support
   - User invitation system

3. **Testing Lanjutan**:
   - Testing dengan multiple users
   - Testing permissions
   - Testing data isolation

## 📞 Bantuan

Jika Anda masih mengalami masalah:

1. **Periksa Console**: Lihat error message di browser console
2. **Periksa Network Tab**: Lihat failed requests di browser dev tools
3. **Restart Server**: Restart development server dengan `rm -rf .next && npm run dev`
4. **Clear Cache**: Clear browser cache dan cookies
5. **Contact Support**: Buat issue dengan semua detail error

Happy coding! 🚀