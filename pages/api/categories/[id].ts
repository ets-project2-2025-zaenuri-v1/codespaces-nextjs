import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for API calls
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables for Supabase')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get authenticated user
  const { userId } = getAuth(req)
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Unauthorized' 
    })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      error: 'ID kategori tidak valid' 
    })
  }

  if (req.method === 'GET') {
    try {
      // Get category by ID
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Category query error:', error)
        return res.status(500).json({ 
          error: 'Gagal mengambil data kategori',
          details: error.message 
        })
      }

      if (!category) {
        return res.status(404).json({ 
          error: 'Kategori tidak ditemukan' 
        })
      }

      return res.status(200).json({
        success: true,
        data: category
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, color } = req.body

      // Validate at least one field to update
      if (!name && !description && !color) {
        return res.status(400).json({ 
          error: 'Setidaknya satu field harus diisi untuk update' 
        })
      }

      // Build update object with only provided fields
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (color !== undefined) updateData.color = color

      // Update category
      const { data: category, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Category update error:', error)
        return res.status(500).json({ 
          error: 'Gagal memperbarui kategori',
          details: error.message 
        })
      }

      if (!category) {
        return res.status(404).json({ 
          error: 'Kategori tidak ditemukan' 
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Kategori berhasil diperbarui',
        data: category
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Check if category is being used by any products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', id)
        .limit(1)

      if (productsError) {
        console.error('Products check error:', productsError)
        return res.status(500).json({ 
          error: 'Gagal memeriksa penggunaan kategori',
          details: productsError.message 
        })
      }

      if (products && products.length > 0) {
        return res.status(400).json({ 
          error: 'Kategori tidak dapat dihapus karena masih digunakan oleh produk' 
        })
      }

      // Delete category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Category deletion error:', error)
        return res.status(500).json({ 
          error: 'Gagal menghapus kategori',
          details: error.message 
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Kategori berhasil dihapus'
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ 
      error: 'Metode tidak diizinkan' 
    })
  }
}