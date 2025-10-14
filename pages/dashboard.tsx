import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import ProtectedRoute from '../components/protected-route'
import { 
  ShoppingCart, 
  Users, 
  Coffee, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  BarChart3,
  ChefHat,
  Table,
  User,
  Tag,
  Package,
  LogOut
} from 'lucide-react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    
    setLoading(false)
  }, [isLoaded])

  const handleSignOut = () => {
    // Redirect to Clerk's sign out URL
    window.location.href = '/sign-out'
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Pempek POS</title>
        <meta name="description" content="Dashboard Pempek POS" />
      </Head>

      <div className="min-h-screen bg-ivory">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-slate font-display">
                  Pempek POS
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate">
                  Selamat datang, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}
                </span>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {(user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'U')?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Redirect to sign-in page when clicking Account
                    window.location.href = '/sign-in'
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Akun
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate font-display">
              Dashboard
            </h2>
            <p className="text-slate mt-2">
              Kelola operasional kedai Pempek Anda
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                  Kasir POS
                </CardTitle>
                <CardDescription>
                  Proses pesanan dan pembayaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => router.push('/pos')}>
                  Buka Kasir
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Package className="h-5 w-5 text-secondary mr-2" />
                  Produk
                </CardTitle>
                <CardDescription>
                  Kelola produk dan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Link href="/products">
                    <Button className="flex-1" variant="secondary" size="sm">
                      <Package className="h-4 w-4 mr-1" />
                      Produk
                    </Button>
                  </Link>
                  <Link href="/products/new">
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Tag className="h-5 w-5 text-accent mr-2" />
                  Kategori
                </CardTitle>
                <CardDescription>
                  Kelola kategori produk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Link href="/categories">
                    <Button className="flex-1" variant="accent" size="sm">
                      <Tag className="h-4 w-4 mr-1" />
                      Kategori
                    </Button>
                  </Link>
                  <Link href="/categories/new">
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <ChefHat className="h-5 w-5 text-secondary mr-2" />
                  Kitchen Display
                </CardTitle>
                <CardDescription>
                  Monitor status pesanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" onClick={() => router.push('/kds')}>
                  Buka KDS
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Table className="h-5 w-5 text-accent mr-2" />
                  Meja
                </CardTitle>
                <CardDescription>
                  Kelola meja makan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="accent" onClick={() => router.push('/tables')}>
                  Kelola Meja
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  Laporan
                </CardTitle>
                <CardDescription>
                  Lihat analitik penjualan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" onClick={() => router.push('/reports')}>
                  Lihat Laporan
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Coffee className="h-5 w-5 text-secondary mr-2" />
                  Stok
                </CardTitle>
                <CardDescription>
                  Kelola inventori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" onClick={() => router.push('/stock')}>
                  Kelola Stok
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 text-accent mr-2" />
                  Pelanggan
                </CardTitle>
                <CardDescription>
                  Kelola data pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="accent" onClick={() => router.push('/customers')}>
                  Kelola Pelanggan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Penjualan Hari Ini
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 1.250.000</div>
                <p className="text-xs text-muted-foreground">
                  +12% dari kemarin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pesanan
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  +5 dari kemarin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pelanggan
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">
                  +8 dari kemarin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stok Menipis
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Perlu restock
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coffee className="h-5 w-5 text-primary mr-2" />
                Pesanan Terbaru
              </CardTitle>
              <CardDescription>
                Pesanan terbaru hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'ORD2410140001', customer: 'Budi Santoso', total: 125000, status: 'selesai', time: '10:30' },
                  { id: 'ORD2410140002', customer: 'Siti Nurhaliza', total: 85000, status: 'diproses', time: '10:45' },
                  { id: 'ORD2410140003', customer: 'Ahmad Fadli', total: 150000, status: 'dikonfirmasi', time: '11:00' },
                  { id: 'ORD2410140004', customer: 'Diana Putri', total: 95000, status: 'selesai', time: '11:15' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-slate">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rp {order.total.toLocaleString('id-ID')}</p>
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-slate">{order.time}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'selesai' ? 'bg-green-100 text-green-800' :
                          order.status === 'diproses' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}