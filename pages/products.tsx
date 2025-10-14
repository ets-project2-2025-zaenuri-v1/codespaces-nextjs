import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import ProtectedRoute from '../components/protected-route'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Coffee,
  ShoppingCart,
  ChefHat,
  Tag,
  Loader2
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

interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export default function ProductsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        
        if (productsData.success) {
          setProducts(productsData.data)
        }
        
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isLoaded])

  if (!isLoaded || loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-ivory">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    )
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return
    }
    
    setIsDeleting(id)
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Remove product from state
        setProducts(products.filter(product => product.id !== id))
      } else {
        alert(`Gagal menghapus produk: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Terjadi kesalahan saat menghapus produk')
    } finally {
      setIsDeleting(null)
    }
  }

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !filterCategory || product.category_id === filterCategory
    
    const matchesStatus = showInactive || product.is_active
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <ProtectedRoute>
      <Head>
        <title>Manajemen Produk - Pempek POS</title>
        <meta name="description" content="Kelola produk dan kategori untuk kedai Pempek" />
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate font-display">
                Manajemen Produk
              </h2>
              <p className="text-slate mt-2">
                Kelola produk dan kategori untuk kedai Pempek Anda
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/categories">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Tag className="h-4 w-4 mr-2" />
                  Kategori
                </Button>
              </Link>
              <Link href="/products/new">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Produk Baru
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="h-5 w-5 mr-2 text-primary" />
                Filter dan Pencarian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showInactive"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showInactive" className="text-sm text-slate">
                    Tampilkan Produk Tidak Aktif
                  </label>
                </div>
                
                <div className="text-sm text-slate">
                  {filteredProducts.length} dari {products.length} produk
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate mb-2">
                  Tidak Ada Produk
                </h3>
                <p className="text-slate mb-4 text-center">
                  {searchTerm || filterCategory || !showInactive
                    ? 'Tidak ada produk yang cocok dengan filter yang dipilih.'
                    : 'Belum ada produk yang ditambahkan.'}
                </p>
                <Link href="/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className={`overflow-hidden ${!product.is_active ? 'opacity-60' : ''}`}>
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {product.categories && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded-full">
                          {product.categories.name}
                        </span>
                      </div>
                    )}
                    
                    {!product.is_active && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                          Tidak Aktif
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">
                        {product.name}
                      </CardTitle>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      Rp {product.price.toLocaleString('id-ID')}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {product.description && (
                      <p className="text-sm text-slate mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={isDeleting === product.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isDeleting === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}