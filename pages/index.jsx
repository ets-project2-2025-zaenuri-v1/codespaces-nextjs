import Head from 'next/head'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ShoppingCart, QrCode, ChefHat, BarChart3, CheckCircle, Zap, Shield, TrendingUp, Users, Coffee } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pempek POS - Sistem Kasir Modern untuk Kedai Pempek</title>
        <meta name="description" content="Sistem POS modern untuk kedai pempek dengan QR ordering, kitchen display, dan manajemen inventori" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-ivory">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-slate font-display">
                  Pempek POS
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/sign-in">
                  <Button variant="outline" className="border-slate-300 text-slate hover:bg-slate-100">Masuk</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-primary hover:bg-primary/90 text-white">Daftar</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-slate mb-6 font-display leading-tight">
              Sistem POS Modern untuk <span className="text-primary">Kedai Pempek</span>
            </h2>
            <p className="text-xl text-slate mb-8 max-w-3xl mx-auto leading-relaxed">
              Permudah operasi bisnis Anda dengan QR ordering, kitchen display, dan manajemen inventori real-time. Sempurna untuk kedai pempek skala kecil hingga menengah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-3">
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="border-slate-300 text-slate hover:bg-slate-100 text-lg px-8 py-3">
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate mb-4 font-display">
                Semua yang Anda Butuhkan untuk Mengelola Kedai
              </h3>
              <p className="text-lg text-slate max-w-2xl mx-auto">
                Dari menerima pesanan hingga mengelola inventori, sistem POS kami memiliki semua fitur yang Anda butuhkan.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="card-pempek border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <ShoppingCart className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Kasir POS</CardTitle>
                  <CardDescription className="text-sm">
                    Proses pesanan dengan cepat menggunakan antarmuka intuitif yang dirancang khusus untuk kedai pempek
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">QR Ordering</CardTitle>
                  <CardDescription className="text-sm">
                    Biarkan pelanggan memesan langsung dari meja mereka menggunakan smartphone
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <ChefHat className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Kitchen Display</CardTitle>
                  <CardDescription className="text-sm">
                    Sederhanakan operasi dapur dengan tampilan pesanan real-time
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Analitik</CardTitle>
                  <CardDescription className="text-sm">
                    Dapatkan wawasan tentang bisnis Anda dengan laporan penjualan detail
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate mb-4 font-display">
                Mengapa Memilih Pempek POS?
              </h3>
              <p className="text-lg text-slate max-w-2xl mx-auto">
                Dirancang khusus untuk kedai pempek dengan fitur-fitur yang penting untuk bisnis Anda.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate mb-2">Mudah Digunakan</h4>
                    <p className="text-slate">Antarmuka intuitif yang dirancang untuk pemilik kedai, bukan ahli teknologi</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <Zap className="h-6 w-6 text-primary mr-3 mt-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate mb-2">Setup Cepat</h4>
                    <p className="text-slate">Mulai dalam hitungan menit dengan proses panduan setup kami</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary mr-3 mt-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate mb-2">Aman & Terpercaya</h4>
                    <p className="text-slate">Data Anda aman dengan keamanan tingkat enterprise</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary mr-3 mt-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate mb-2">Berkembang Bersama</h4>
                    <p className="text-slate">Buat keputusan berbasis data dengan analitik detail</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <Coffee className="h-6 w-6 text-primary mr-3 mt-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate mb-2">Kurangi Pemborosan</h4>
                    <p className="text-slate">Kelola inventori dengan tepat untuk meminimalkan makanan terbuang</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-primary mr-3 mt-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate mb-2">Pengalaman Pelanggan Lebih Baik</h4>
                    <p className="text-slate">QR ordering mengurangi waktu tunggu dan meningkatkan layanan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4 font-display">
              Siap untuk Transformasi Kedai Pempek Anda?
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Bergabunglah dengan ratusan pemilik kedai yang telah menyederhanakan operasi mereka dengan Pempek POS.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="bg-white hover:bg-gray-100 text-primary text-lg px-8 py-3">
                Mulai Hari Ini
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-charcoal text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <h4 className="ml-3 text-xl font-bold font-display">Pempek POS</h4>
                </div>
                <p className="text-gray-400 mb-4">
                  Sistem POS modern yang dirancang khusus untuk pemilik kedai pempek.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Produk</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Fitur</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Harga</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Testimoni</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Dukungan</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Dokumentasi</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Hubungi Kami</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} Pempek POS. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}