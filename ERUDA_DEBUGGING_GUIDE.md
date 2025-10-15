# Panduan Debugging dengan ERUDA

Panduan ini akan membantu Anda menggunakan ERUDA untuk debugging aplikasi Pempek POS, terutama untuk masalah dengan menyimpan data ke database Supabase.

## 🔧 Apa itu ERUDA?

ERUDA adalah alat debugging untuk mobile web yang menyediakan:
- Console untuk melihat log dan error
- Network tab untuk melihat HTTP requests
- Elements untuk inspeksi DOM
- Resources untuk melihat resource loading
- Info untuk melihat informasi sistem
- Snippets untuk menjalankan kode JavaScript

## 🚀 Cara Menggunakan ERUDA

### 1. Mengakses ERUDA

1. Buka aplikasi di browser (desktop atau mobile)
2. Scroll ke bagian bawah halaman
3. Ketuk ikon ERUDA yang muncul di pojok kanan bawah
4. ERUDA akan terbuka dengan berbagai tab debugging

### 2. Menggunakan Console

1. Buka tab **Console** di ERUDA
2. Lihat log dan error yang muncul
3. Gunakan console untuk menjalankan kode JavaScript
4. Contoh: `console.log('Debug message')`

### 3. Menggunakan Network

1. Buka tab **Network** di ERUDA
2. Lakukan operasi yang bermasalah (misalnya tambah produk)
3. Lihat request yang muncul di network tab
4. Klik request untuk melihat detail:
   - Request URL
   - Request method (GET, POST, PUT, DELETE)
   - Request headers
   - Request body
   - Response status
   - Response body

### 4. Menggunakan Elements

1. Buka tab **Elements** di ERUDA
2. Inspeksi elemen DOM
3. Lihat struktur HTML dan CSS
4. Modifikasi elemen untuk testing

## 🐛 Debugging Masalah Umum

### 1. "Gagal membuat produk"

**Langkah Debugging:**
1. Buka ERUDA
2. Buka tab **Network**
3. Coba tambah produk baru
4. Lihat request ke `/api/products`
5. Periksa response status dan body

**Possible Issues:**
- **401 Unauthorized**: User tidak terautentikasi
- **400 Bad Request**: Data tidak valid
- **500 Internal Server Error**: Error di server

**Console Logs yang Mungkin Muncul:**
```
Failed to create product: Error: Nama produk dan harga wajib diisi
```

### 2. "User tidak ditemukan di database"

**Langkah Debugging:**
1. Buka ERUDA
2. Buka tab **Network**
3. Akses `/api/auth/user`
4. Periksa response status dan body

**Possible Issues:**
- **User tidak dibuat**: API user tidak dipanggil
- **Organization tidak ada**: Organization default tidak dibuat
- **Error di database**: Kesalahan saat menyimpan ke Supabase

**Console Logs yang Mungkin Muncul:**
```
Failed to sync user: Error: Gagal membuat user baru
```

### 3. "Tidak ada tombol Keluar"

**Langkah Debugging:**
1. Buka ERUDA
2. Buka tab **Elements**
3. Cari elemen dengan text "Keluar"
4. Periksa apakah elemen tersembunyi atau tidak ada

**Console Logs yang Mungkin Muncul:**
```
Sign out button not found
```

## 📊 Monitoring API Requests

### 1. Memantau Request Products

```javascript
// Di console ERUDA
fetch('/api/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. Memantau Request User

```javascript
// Di console ERUDA
fetch('/api/auth/user')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 3. Memantau Request Categories

```javascript
// Di console ERUDA
fetch('/api/categories')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🛠️ Advanced Debugging

### 1. Debugging Form Submission

```javascript
// Di console ERUDA
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log('Form data:', Object.fromEntries(formData));
});
```

### 2. Debugging User State

```javascript
// Di console ERUDA
const clerk = window.Clerk;
if (clerk) {
  console.log('Clerk user:', clerk.user);
  console.log('Clerk session:', clerk.session);
}
```

### 3. Debugging Supabase Connection

```javascript
// Di console ERUDA
fetch('/api/test-db')
  .then(res => res.json())
  .then(data => console.log('DB connection:', data));
```

## 📱 Menggunakan ERUDA di Mobile

### 1. Android Chrome
1. Buka aplikasi di Chrome Android
2. Tap 3 kali pada URL bar
3. Enable "Enable debugging"
4. Refresh halaman
5. ERUDA akan muncul di pojok kanan bawah

### 2. iOS Safari
1. Buka aplikasi di Safari iOS
2. Tap 3 kali pada toolbar
3. Enable "Debug Console"
4. Refresh halaman
5. ERUDA akan muncul di pojok kanan bawah

## 🔧 Konfigurasi ERUDA

### 1. Custom Konfigurasi

```javascript
// Di pages/_app.tsx
import('eruda').then((eruda) => {
  eruda.default.init({
    defaults: {
      theme: 'dark',
      transparency: 0.9,
    },
    console: {
      maxLogNumber: 1000,
    },
  });
});
```

### 2. Disable ERUDA di Production

```javascript
// Di pages/_app.tsx
useEffect(() => {
  if (typeof window !== 'undefined' && 
      process.env.NODE_ENV === 'development' && 
      !window.location.search.includes('no-debug')) {
    import('eruda').then((eruda) => {
      eruda.default.init();
    });
  }
}, []);
```

## 📝 Checklist Debugging

- [ ] ERUDA terinstall dan berfungsi
- [ ] Console menampilkan log dan error
- [ ] Network tab menampilkan requests
- [ ] Request `/api/auth/user` berhasil
- [ ] User record dibuat di database
- [ ] Organization record dibuat di database
- [ ] Org_members record dibuat di database
- [ ] Request `/api/products` berhasil
- [ ] Produk berhasil dibuat di database
- [ ] Request `/api/categories` berhasil
- [ ] Kategori berhasil dibuat di database

## 🎯 Tips Pro

1. **Clear Console**: Gunakan tombol clear di console untuk membersihkan log
2. **Filter Network**: Gunakan filter di network tab untuk mencari request spesifik
3. **Copy Response**: Gunakan copy button untuk menyalin response body
4. **Save Logs**: Screenshot console dan network tab untuk dokumentasi
5. **Refresh Data**: Gunakan refresh button di network tab untuk mengirim ulang request

## 📞 Bantuan

Jika Anda masih mengalami masalah:

1. **Screenshots**: Ambil screenshot console dan network tab
2. **Error Logs**: Salin error messages dari console
3. **Request Details**: Salin request dan response details dari network tab
4. **Steps**: Catat langkah-langkah untuk mereproduksi masalah
5. **Contact**: Buat issue dengan semua detail debugging

Happy debugging! 🐛