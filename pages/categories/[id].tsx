import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import ProtectedRoute from '../../components/protected-route'
import { 
  ArrowLeft, 
  Edit, 
  Save,
  Tag,
  Loader2,
  Trash2
} from 'lucide-react'

const PREDEFINED_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
]

interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export default function CategoryDetailPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6' // Default blue
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoaded || !id) return
    
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`)
        const data = await res.json()
        
        if (data.success) {
          const fetchedCategory = data.data
          setCategory(fetchedCategory)
          
          // Set form data
          setFormData({
            name: fetchedCategory.name || '',
            description: fetchedCategory.description || '',
            color: fetchedCategory.color || '#3b82f6'
          })
        } else {
          alert(`Gagal mengambil data kategori: ${data.error}`)
          router.push('/categories')
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        alert('Terjadi kesalahan saat mengambil data kategori')
        router.push('/categories')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategory()
  }, [isLoaded, id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (category) {
      // Reset form data to original category data
      setFormData({
        name: category.name || '',
        description: category.description || '',
        color: category.color || '#3b82f6'
      })
    }
    setIsEditing(false)
    setErrors({})
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Update category with new data
        setCategory(data.data)
        setIsEditing(false)
        alert('Kategori berhasil diperbarui')
      } else {
        alert(`Gagal memperbarui kategori: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Terjadi kesalahan saat memperbarui kategori')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return
    }
    
    setDeleting(true)
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert('Kategori berhasil dihapus')
        router.push('/categories')
      } else {
        alert(`Gagal menghapus kategori: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Terjadi kesalahan saat menghapus kategori')
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

  if (!category) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-ivory">
          <div className="text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate mb-2">Kategori Tidak Ditemukan</h2>
            <p className="text-slate mb-4">Kategori yang Anda cari tidak ada atau telah dihapus</p>
            <Link href="/categories">
              <Button>Kembali ke Kategori</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>{category.name} - Pempek POS</title>
        <meta name="description" content={`Detail kategori ${category.name}`} />
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
          <div className="flex items-center justify-between mb-8">
            <Link href="/categories">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate font-display">
                {category.name}
              </h2>
              <p className="text-slate mt-2">
                Detail kategori untuk kedai Pempek
              </p>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
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
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Preview Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center rounded-lg relative" 
                     style={{ backgroundColor: isEditing ? formData.color : category.color || '#f3f4f6' }}>
                  <Tag className="h-16 w-16 text-white/80" />
                  <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-slate">
                      {isEditing ? formData.name : category.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Informasi Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate mb-2">
                        Nama Kategori <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate mb-2">
                        Warna Kategori
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`w-8 h-8 rounded-md border-2 ${
                              formData.color === color ? 'border-slate-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Pilih warna ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate mb-1">Nama Kategori</h3>
                      <p className="text-lg">{category.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-slate mb-1">Warna</h3>
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-md mr-2"
                          style={{ backgroundColor: category.color || '#f3f4f6' }}
                        />
                        <span>{category.color || 'Tidak ada warna'}</span>
                      </div>
                    </div>
                    
                    {category.description && (
                      <div>
                        <h3 className="text-sm font-medium text-slate mb-1">Deskripsi</h3>
                        <p className="text-slate">{category.description}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <div className="text-xs text-slate">
                        <p>Dibuat: {new Date(category.created_at).toLocaleString('id-ID')}</p>
                        <p>Diperbarui: {new Date(category.updated_at).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}