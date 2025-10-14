import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Coffee, Users, ShoppingCart, ChefHat, Package, BarChart3 } from 'lucide-react'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pempek POS - Sistem Point of Sale untuk Kedai Pempek</title>
        <meta name="description" content="Sistem POS modern untuk kedai Pempek Palembang dengan QR Ordering, Kitchen Display, dan Manajemen Stok" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-ivory">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Coffee className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-slate font-display">Pempek POS</h1>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline">Masuk</Button>
                <Button>Daftar</Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-slate mb-6 font-display">
              Sistem POS Modern untuk
              <span className="text-primary"> Kedai Pempek</span>
            </h2>
            <p className="text-xl text-slate mb-8 max-w-3xl mx-auto">
              Kelola kedai Pempek Anda dengan sistem terintegrasi: POS Kasir, QR Ordering, 
              Kitchen Display, Manajemen Stok, dan Laporan Real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Mulai Gratis
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate mb-4 font-display">
                Fitur Lengkap untuk Kedai Anda
              </h3>
              <p className="text-lg text-slate max-w-2xl mx-auto">
                Semua yang Anda butuhkan untuk mengelola kedai Pempek dengan efisien
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-pempek hover:scale-105 transition-transform">
                <CardHeader>
                  <ShoppingCart className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>POS Kasir</CardTitle>
                  <CardDescription>
                    Sistem kasir modern dengan interface intuitif, support pembayaran tunai dan digital
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek hover:scale-105 transition-transform">
                <CardHeader>
                  <Users className="h-10 w-10 text-secondary mb-4" />
                  <CardTitle>QR Table Ordering</CardTitle>
                  <CardDescription>
                    Pelanggan bisa pesan langsung dari meja dengan scan QR code
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek hover:scale-105 transition-transform">
                <CardHeader>
                  <ChefHat className="h-10 w-10 text-accent mb-4" />
                  <CardTitle>Kitchen Display</CardTitle>
                  <CardDescription>
                    Monitor order real-time di dapur dengan status yang jelas
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek hover:scale-105 transition-transform">
                <CardHeader>
                  <Package className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Manajemen Stok</CardTitle>
                  <CardDescription>
                    Pantau stok bahan baku otomatis dengan sistem recipe dan BOM
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek hover:scale-105 transition-transform">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-secondary mb-4" />
                  <CardTitle>Laporan & Analitik</CardTitle>
                  <CardDescription>
                    Dashboard lengkap dengan penjualan, item terlaris, dan profit analysis
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-pempek hover:scale-105 transition-transform">
                <CardHeader>
                  <Coffee className="h-10 w-10 text-accent mb-4" />
                  <CardTitle>Multi-Outlet</CardTitle>
                  <CardDescription>
                    Kelola multiple outlet dari satu dashboard terintegrasi
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4 font-display">
              Siap Membangun Kedai Pempek Modern?
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Bergabunglah dengan ratusan kedai yang sudah menggunakan Pempek POS
            </p>
            <Button size="lg" variant="secondary" className="text-lg">
              Mulai Sekarang
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-charcoal text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Coffee className="h-6 w-6 text-primary mr-2" />
                  <span className="text-lg font-bold font-display">Pempek POS</span>
                </div>
                <p className="text-gray-400">
                  Sistem POS modern untuk kedai Pempek Palembang
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Produk</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>POS Kasir</li>
                  <li>QR Ordering</li>
                  <li>Kitchen Display</li>
                  <li>Manajemen Stok</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Perusahaan</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Tentang Kami</li>
                  <li>Kontak</li>
                  <li>Blog</li>
                  <li>Karir</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Documentation</li>
                  <li>API</li>
                  <li>Status</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Pempek POS. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

export default Home