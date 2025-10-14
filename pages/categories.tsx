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
  Tag,
  Loader2,
  Palette
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export default function CategoriesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [isLoaded])

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return
    }
    
    setIsDeleting(id)
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Remove category from state
        setCategories(categories.filter(category => category.id !== id))
      } else {
        alert(`Gagal menghapus kategori: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Terjadi kesalahan saat menghapus kategori')
    } finally {
      setIsDeleting(null)
    }
  }

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <ProtectedRoute>
      <Head>
        <title>Manajemen Kategori - Pempek POS</title>
        <meta name="description" content="Kelola kategori untuk produk kedai Pempek" />
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
                Manajemen Kategori
              </h2>
              <p className="text-slate mt-2">
                Kelola kategori untuk mengelompokkan produk di kedai Pempek Anda
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/products">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Tag className="h-4 w-4 mr-2" />
                  Produk
                </Button>
              </Link>
              <Link href="/categories/new">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Kategori Baru
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Pencarian Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-slate mt-2">
                {filteredCategories.length} dari {categories.length} kategori
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          {filteredCategories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate mb-2">
                  Tidak Ada Kategori
                </h3>
                <p className="text-slate mb-4 text-center">
                  {searchTerm
                    ? 'Tidak ada kategori yang cocok dengan pencarian.'
                    : 'Belum ada kategori yang ditambahkan.'}
                </p>
                <Link href="/categories/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kategori
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <div className="h-24 flex items-center justify-center relative" 
                       style={{ backgroundColor: category.color || '#f3f4f6' }}>
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                        <Palette className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <Tag className="h-10 w-10 text-white/80" />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {category.description && (
                      <p className="text-sm text-slate mb-4">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between">
                      <Link href={`/categories/${category.id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Link href={`/categories/${category.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting === category.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isDeleting === category.id ? (
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