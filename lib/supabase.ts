import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          address: string | null
          phone: string | null
          email: string | null
          tax_id: string | null
          settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      outlets: {
        Row: {
          id: string
          organization_id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          is_active: boolean
          settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['outlets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['outlets']['Insert']>
      }
      org_members: {
        Row: {
          id: string
          organization_id: string
          clerk_user_id: string
          email: string
          name: string | null
          role: 'owner' | 'admin' | 'cashier' | 'cook' | 'waiter' | 'courier'
          outlet_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['org_members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['org_members']['Insert']>
      }
      categories: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          organization_id: string
          category_id: string | null
          name: string
          description: string | null
          image_url: string | null
          price: number
          cost: number
          sku: string | null
          barcode: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          price: number
          cost: number
          sku: string | null
          barcode: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
      }
      orders: {
        Row: {
          id: string
          organization_id: string
          outlet_id: string
          order_number: string
          clerk_user_id: string | null
          customer_name: string | null
          customer_phone: string | null
          table_id: string | null
          order_type: 'dine_in' | 'takeaway' | 'delivery'
          status: 'draft' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          subtotal: number
          tax: number
          service_charge: number
          discount: number
          total: number
          payment_method: 'cash' | 'card' | 'ewallet' | 'transfer'
          payment_status: 'pending' | 'paid' | 'refunded'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_variant_id: string | null
          quantity: number
          price: number
          cost: number
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      payments: {
        Row: {
          id: string
          order_id: string
          amount: number
          payment_method: 'cash' | 'card' | 'ewallet' | 'transfer'
          payment_status: 'pending' | 'paid' | 'refunded'
          reference: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      dining_tables: {
        Row: {
          id: string
          organization_id: string
          outlet_id: string
          number: string
          capacity: number
          qr_code: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['dining_tables']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['dining_tables']['Insert']>
      }
      qr_sessions: {
        Row: {
          id: string
          table_id: string
          session_token: string
          is_active: boolean
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['qr_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['qr_sessions']['Insert']>
      }
      ingredients: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          unit: string
          current_stock: number
          min_stock: number
          cost_per_unit: number
          supplier_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ingredients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ingredients']['Insert']>
      }
      recipes: {
        Row: {
          id: string
          product_id: string
          name: string | null
          instructions: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['recipes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['recipes']['Insert']>
      }
      recipe_items: {
        Row: {
          id: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['recipe_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['recipe_items']['Insert']>
      }
      stock_movements: {
        Row: {
          id: string
          organization_id: string
          ingredient_id: string
          movement_type: 'in' | 'out' | 'adjustment' | 'wastage'
          quantity: number
          reference: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stock_movements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stock_movements']['Insert']>
      }
      kds_tickets: {
        Row: {
          id: string
          order_id: string
          order_item_id: string
          status: 'new' | 'in_progress' | 'ready' | 'done'
          notes: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['kds_tickets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['kds_tickets']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          organization_id: string
          clerk_user_id: string | null
          action: string
          table_name: string
          record_id: string
          old_values: any | null
          new_values: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
      }
    }
  }
}

// Type helpers
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Outlet = Database['public']['Tables']['outlets']['Row']
export type OrgMember = Database['public']['Tables']['org_members']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type DiningTable = Database['public']['Tables']['dining_tables']['Row']
export type QRSession = Database['public']['Tables']['qr_sessions']['Row']
export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type Recipe = Database['public']['Tables']['recipes']['Row']
export type RecipeItem = Database['public']['Tables']['recipe_items']['Row']
export type StockMovement = Database['public']['Tables']['stock_movements']['Row']
export type KDSTicket = Database['public']['Tables']['kds_tickets']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']

// Join types for extended data
export type ProductWithCategory = Product & {
  categories: Category | null
  product_variants: ProductVariant[]
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: Product | null
    product_variants: ProductVariant | null
  })[]
  payments: Payment[]
}

export type KDSTicketWithOrder = KDSTicket & {
  order_items: (OrderItem & {
    products: Product | null
  })[]
  orders: {
    order_number: string
    table_id: string | null
    dining_tables: {
      number: string
    } | null
  } | null
}