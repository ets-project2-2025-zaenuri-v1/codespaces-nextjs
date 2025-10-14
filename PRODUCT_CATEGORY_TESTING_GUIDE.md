# Panduan Testing Manajemen Produk dan Kategori

Panduan ini akan membantu Anda menguji fitur manajemen produk dan kategori yang telah diimplementasikan di Pempek POS.

## 🚀 Prerequisites

Sebelum memulai testing, pastikan:

1. **Supabase Setup**
   - Supabase project sudah dibuat
   - Database schema sudah diimport
   - Environment variables sudah dikonfigurasi

2. **Clerk Authentication**
   - Clerk application sudah dibuat
   - Environment variables sudah dikonfigurasi
   - Anda sudah bisa login ke aplikasi

3. **Development Server**
   - Development server berjalan: `npm run dev`
   - Aplikasi dapat diakses di `http://localhost:3001`

## 🧪 Testing Kategori

### 1. Akses Halaman Kategori

1. Login ke aplikasi
2. Klik tombol "Kategori" di dashboard atau navigasi ke `http://localhost:3001/categories`
3. Verifikasi halaman kategori ter-load dengan benar

### 2. Tambah Kategori Baru

1. Klik tombol "Kategori Baru" di halaman kategori
2. Isi form dengan data berikut:
   - Nama Kategori: "Pempek Goreng"
   - Deskripsi: "Pempek yang digoreng dengan minyak panas"
   - Warna: Pilih warna biru
3. Klik tombol "Simpan Kategori"
4. Verifikasi Anda diarahkan kembali ke halaman kategori
5. Verifikasi kategori baru muncul di daftar kategori

### 3. Lihat Detail Kategori

1. Klik tombol "Detail" pada kategori yang baru dibuat
2. Verifikasi halaman detail kategori ter-load dengan benar
3. Verifikasi semua informasi kategori ditampilkan dengan benar

### 4. Edit Kategori

1. Klik tombol "Edit" di halaman detail kategori
2. Ubah nama kategori menjadi "Pempek Goreng Spesial"
3. Klik tombol "Simpan"
4. Verifikasi perubahan tersimpan
5. Verifikasi Anda tetap di halaman detail kategori dengan informasi yang diperbarui

### 5. Hapus Kategori

1. Klik tombol "Hapus" di halaman detail kategori
2. Konfirmasi penghapusan pada dialog
3. Verifikasi Anda diarahkan kembali ke halaman kategori
4. Verifikasi kategori yang dihapus tidak muncul lagi di daftar

## 🧪 Testing Produk

### 1. Akses Halaman Produk

1. Login ke aplikasi
2. Klik tombol "Produk" di dashboard atau navigasi ke `http://localhost:3001/products`
3. Verifikasi halaman produk ter-load dengan benar

### 2. Tambah Produk Baru

1. Klik tombol "Produk Baru" di halaman produk
2. Isi form dengan data berikut:
   - Nama Produk: "Pempek Kapal Selam"
   - Harga: "25000"
   - Kategori: Pilih kategori yang sudah dibuat
   - Deskripsi: "Pempek dengan telur di dalamnya"
   - URL Gambar: Kosongkan (opsional)
   - Status Aktif: Centang
3. Klik tombol "Simpan Produk"
4. Verifikasi Anda diarahkan kembali ke halaman produk
5. Verifikasi produk baru muncul di daftar produk

### 3. Lihat Detail Produk

1. Klik tombol "Detail" pada produk yang baru dibuat
2. Verifikasi halaman detail produk ter-load dengan benar
3. Verifikasi semua informasi produk ditampilkan dengan benar

### 4. Edit Produk

1. Klik tombol "Edit" di halaman detail produk
2. Ubah harga produk menjadi "30000"
3. Klik tombol "Simpan Perubahan"
4. Verifikasi perubahan tersimpan
5. Verifikasi Anda diarahkan ke halaman detail produk dengan informasi yang diperbarui

### 5. Hapus Produk

1. Klik tombol "Hapus" di halaman detail produk
2. Konfirmasi penghapusan pada dialog
3. Verifikasi Anda diarahkan kembali ke halaman produk
4. Verifikasi produk yang dihapus tidak muncul lagi di daftar

## 🧪 Testing Fitur Tambahan

### 1. Filter dan Pencarian Produk

1. Di halaman produk, gunakan fitur pencarian dengan kata kunci "Pempek"
2. Verifikasi hanya produk yang mengandung kata "Pempek" yang muncul
3. Gunakan filter kategori untuk memfilter berdasarkan kategori
4. Verifikasi hanya produk dengan kategori yang dipilih yang muncul
5. Centang "Tampilkan Produk Tidak Aktif" untuk melihat produk tidak aktif

### 2. Pencarian Kategori

1. Di halaman kategori, gunakan fitur pencarian dengan kata kunci "Goreng"
2. Verifikasi hanya kategori yang mengandung kata "Goreng" yang muncul

### 3. Validasi Form

1. Coba tambah produk tanpa mengisi nama
2. Verifikasi error "Nama produk wajib diisi" muncul
3. Coba tambah produk dengan harga 0 atau negatif
4. Verifikasi error "Harga produk harus lebih dari 0" muncul
5. Coba tambah kategori tanpa mengisi nama
6. Verifikasi error "Nama kategori wajib diisi" muncul

## 🐛 Troubleshooting

### Issue: "Gagal membuat produk"

**Possible Solutions**:
1. Periksa console browser untuk error message
2. Verifikasi Supabase connection dengan mengakses `/api/test-db`
3. Pastikan semua field required sudah diisi
4. Coba refresh halaman dan coba lagi

### Issue: "Gagal menghapus kategori"

**Possible Solutions**:
1. Pastikan kategori tidak sedang digunakan oleh produk
2. Hapus semua produk yang menggunakan kategori tersebut terlebih dahulu
3. Periksa console browser untuk error message

### Issue: "Halaman tidak ditemukan (404)"

**Possible Solutions**:
1. Pastikan development server berjalan
2. Periksa URL yang dimasukkan
3. Restart development server jika perlu

### Issue: "Data tidak tersimpan di database"

**Possible Solutions**:
1. Periksa environment variables untuk Supabase
2. Verifikasi RLS policies di Supabase
3. Pastikan service role key digunakan untuk API calls

## 📊 Testing Checklist

- [ ] Login ke aplikasi berhasil
- [ ] Halaman kategori ter-load dengan benar
- [ ] Tambah kategori baru berhasil
- [ ] Lihat detail kategori berhasil
- [ ] Edit kategori berhasil
- [ ] Hapus kategori berhasil
- [ ] Halaman produk ter-load dengan benar
- [ ] Tambah produk baru berhasil
- [ ] Lihat detail produk berhasil
- [ ] Edit produk berhasil
- [ ] Hapus produk berhasil
- [ ] Filter dan pencarian produk berfungsi
- [ ] Pencarian kategori berfungsi
- [ ] Validasi form berfungsi dengan benar
- [ ] Data tersimpan di database Supabase

## 📝 Reporting Issues

Jika Anda mengalami masalah selama testing:

1. **Periksa Console**: Lihat error message di browser console
2. **Periksa Network Tab**: Lihat failed requests di browser dev tools
3. **Dokumentasi**: Catat langkah-langkah untuk mereproduksi issue
4. **Screenshot**: Ambil screenshot error message jika perlu
5. **Buat Issue**: Buat issue dengan semua detail

## 🎯 Next Steps

Setelah menyelesaikan testing:

1. **Implementasi Fitur Berikutnya**:
   - POS Kasir dengan CRUD orders
   - QR Table Ordering
   - Kitchen Display System (KDS)

2. **Optimasi**:
   - Upload gambar produk
   - Advanced filtering dan sorting
   - Pagination untuk data yang banyak

3. **Testing Lanjutan**:
   - Testing dengan data yang banyak
   - Testing performa
   - Testing responsivitas di berbagai device

Happy testing! 🚀