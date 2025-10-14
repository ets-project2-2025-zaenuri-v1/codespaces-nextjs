import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import ProtectedRoute from '../../components/protected-route'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package,
  Loader2,
  Tag,
  Coffee,
  Eye
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
  } | null
}

export default function ProductDetailPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isLoaded || !id) return
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        
        if (data.success) {
          setProduct(data.data)
        } else {
          alert(`Gagal mengambil data produk: ${data.error}`)
          router.push('/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        alert('Terjadi kesalahan saat mengambil data produk')
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [isLoaded, id, router])

  const handleDeleteProduct = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return
    }
    
    setDeleting(true)
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert('Produk berhasil dihapus')
        router.push('/products')
      } else {
        alert(`Gagal menghapus produk: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Terjadi kesalahan saat menghapus produk')
    } finally {
      setDeleting(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-ivory">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    )
  }

  if (!product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-ivory">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-slate mb-4">Produk yang Anda cari tidak ada atau telah dihapus</p>
            <Link href="/products">
              <Button>Kembali ke Produk</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>{product.name} - Pempek POS</title>
        <meta name="description" content={`Detail produk ${product.name}`} />
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
                  {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title and Actions */}
          <div className="flex items-center mb-8">
            <Link href="/products">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate font-display">
                {product.name}
              </h2>
              <p className="text-slate mt-2">
                Detail produk untuk kedai Pempek
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Link href={`/products/${product.id}/edit`}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="text-red-600 hover:text-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Gambar Produk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Coffee className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Informasi Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate mb-1">Nama Produk</h3>
                  <p className="text-lg">{product.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate mb-1">Harga</h3>
                  <p className="text-2xl font-bold text-primary">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
                
                {product.categories && (
                  <div>
                    <h3 className="text-sm font-medium text-slate mb-1">Kategori</h3>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-primary" />
                      <span>{product.categories.name}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-slate mb-1">Status</h3>
                  <div>
                    {product.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Tidak Aktif
                      </span>
                    )}
                  </div>
                </div>
                
                {product.description && (
                  <div>
                    <h3 className="text-sm font-medium text-slate mb-1">Deskripsi</h3>
                    <p className="text-slate">{product.description}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <div className="text-xs text-slate">
                    <p>Dibuat: {new Date(product.created_at).toLocaleString('id-ID')}</p>
                    <p>Diperbarui: {new Date(product.updated_at).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}