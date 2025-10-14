import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import ProtectedRoute from '../../../components/protected-route'
import { 
  ArrowLeft, 
  Save, 
  Upload,
  Coffee,
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
}

interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
}

export default function EditProductPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_active: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoaded || !id) return
    
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
        
        // Fetch product
        const productRes = await fetch(`/api/products/${id}`)
        const productData = await productRes.json()
        
        if (productData.success) {
          const fetchedProduct = productData.data
          setProduct(fetchedProduct)
          
          // Set form data
          setFormData({
            name: fetchedProduct.name || '',
            description: fetchedProduct.description || '',
            price: fetchedProduct.price ? fetchedProduct.price.toString() : '',
            category_id: fetchedProduct.category_id || '',
            image_url: fetchedProduct.image_url || '',
            is_active: fetchedProduct.is_active
          })
        } else {
          alert(`Gagal mengambil data produk: ${productData.error}`)
          router.push('/products')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Terjadi kesalahan saat mengambil data')
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isLoaded, id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga produk harus lebih dari 0'
    }
    
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'URL gambar tidak valid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert('Produk berhasil diperbarui')
        router.push(`/products/${id}`)
      } else {
        alert(`Gagal memperbarui produk: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Terjadi kesalahan saat memperbarui produk')
    } finally {
      setSaving(false)
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
            <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
        <title>Edit Produk - Pempek POS</title>
        <meta name="description" content={`Edit produk ${product.name}`} />
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
            <Link href={`/products/${id}`}>
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            
            <div>
              <h2 className="text-3xl font-bold text-slate font-display">
                Edit Produk
              </h2>
              <p className="text-slate mt-2">
                Perbarui detail produk "{product.name}"
              </p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Produk</CardTitle>
              <CardDescription>
                Perbarui form di bawah untuk mengubah detail produk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate mb-2">
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: Pempek Kapal Selam"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate mb-2">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="25000"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-slate mb-2">
                    Kategori
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi produk..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-slate mb-2">
                    URL Gambar
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className={errors.image_url ? 'border-red-500' : ''}
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.image_url && (
                    <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>
                  )}
                  <p className="text-xs text-slate mt-1">
                    Masukkan URL gambar atau gunakan fitur upload (akan datang)
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm text-slate">
                    Produk Aktif
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Link href={`/products/${id}`}>
                    <Button variant="outline" type="button">
                      Batal
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}