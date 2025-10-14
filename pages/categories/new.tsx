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
  Save, 
  Tag,
  Loader2
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

export default function NewCategoryPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6' // Default blue
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoaded) return
    
    setLoading(false)
  }, [isLoaded])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (data.success) {
        router.push('/categories')
      } else {
        alert(`Gagal membuat kategori: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Terjadi kesalahan saat membuat kategori')
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

  return (
    <ProtectedRoute>
      <Head>
        <title>Tambah Kategori Baru - Pempek POS</title>
        <meta name="description" content="Tambah kategori baru untuk produk kedai Pempek" />
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
            <Link href="/categories">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            
            <div>
              <h2 className="text-3xl font-bold text-slate font-display">
                Tambah Kategori Baru
              </h2>
              <p className="text-slate mt-2">
                Masukkan detail kategori untuk mengelompokkan produk
              </p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>
                Lengkapi form di bawah untuk menambahkan kategori baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Contoh: Pempek Goreng"
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
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi kategori..."
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
                        className={`w-10 h-10 rounded-md border-2 ${
                          formData.color === color ? 'border-slate-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Pilih warna ${color}`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center">
                    <div 
                      className="w-6 h-6 rounded-md mr-2"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-sm text-slate">
                      Warna yang dipilih: {formData.color}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/categories">
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
                        Simpan Kategori
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