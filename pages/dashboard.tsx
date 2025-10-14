import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  ShoppingCart, 
  Users, 
  Coffee, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  BarChart3,
  ChefHat,
  Table
} from 'lucide-react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    
    if (!user) {
      router.push('/sign-in')
      return
    }
    
    setLoading(false)
  }, [user, isLoaded, router])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Dashboard - Pempek POS</title>
        <meta name="description" content="Pempek POS Dashboard" />
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
                  Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {(user.firstName || user.emailAddresses[0]?.emailAddress || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
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
              Manage your Pempek restaurant operations
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                  POS Kasir
                </CardTitle>
                <CardDescription>
                  Process orders and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => router.push('/pos')}>
                  Open POS
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <ChefHat className="h-5 w-5 text-secondary mr-2" />
                  Kitchen Display
                </CardTitle>
                <CardDescription>
                  Monitor order status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" onClick={() => router.push('/kds')}>
                  Open KDS
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Table className="h-5 w-5 text-accent mr-2" />
                  Table Management
                </CardTitle>
                <CardDescription>
                  Manage dining tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="accent" onClick={() => router.push('/tables')}>
                  Manage Tables
                </Button>
              </CardContent>
            </Card>

            <Card className="card-pempek hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  Reports
                </CardTitle>
                <CardDescription>
                  View analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" onClick={() => router.push('/reports')}>
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Sales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 1,250,000</div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  +5 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">
                  +8 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Needs restocking
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coffee className="h-5 w-5 text-primary mr-2" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Latest orders from today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'ORD2410140001', customer: 'Budi Santoso', total: 125000, status: 'completed', time: '10:30' },
                  { id: 'ORD2410140002', customer: 'Siti Nurhaliza', total: 85000, status: 'preparing', time: '10:45' },
                  { id: 'ORD2410140003', customer: 'Ahmad Fadli', total: 150000, status: 'confirmed', time: '11:00' },
                  { id: 'ORD2410140004', customer: 'Diana Putri', total: 95000, status: 'completed', time: '11:15' },
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
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
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
    </>
  )
}