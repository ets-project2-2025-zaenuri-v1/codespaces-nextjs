-- Initial Schema for Pempek POS System
-- Generated for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    tax_id VARCHAR(100),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outlets table
CREATE TABLE outlets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members table
CREATE TABLE org_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'cashier', 'cook', 'waiter', 'courier')),
    outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addons table
CREATE TABLE addons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product addons relationship table
CREATE TABLE product_addons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES addons(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, addon_id)
);

-- Media assets table
CREATE TABLE media_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dining tables table
CREATE TABLE dining_tables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    number VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 4,
    qr_code VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, outlet_id, number)
);

-- QR sessions table
CREATE TABLE qr_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_id UUID NOT NULL REFERENCES dining_tables(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    min_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255),
    instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id)
);

-- Recipe items table
CREATE TABLE recipe_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, ingredient_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    clerk_user_id VARCHAR(255) REFERENCES org_members(clerk_user_id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    table_id UUID REFERENCES dining_tables(id) ON DELETE SET NULL,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    service_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'ewallet', 'transfer')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, outlet_id, order_number)
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order item addons table
CREATE TABLE order_item_addons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES addons(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_item_id, addon_id)
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'ewallet', 'transfer')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock movements table
CREATE TABLE stock_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'wastage')),
    quantity DECIMAL(10,3) NOT NULL,
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wastage table
CREATE TABLE wastage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) NOT NULL,
    reason TEXT,
    reported_by VARCHAR(255) REFERENCES org_members(clerk_user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock take table
CREATE TABLE stock_take (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    system_stock DECIMAL(10,3) NOT NULL,
    actual_stock DECIMAL(10,3) NOT NULL,
    difference DECIMAL(10,3) NOT NULL,
    notes TEXT,
    conducted_by VARCHAR(255) REFERENCES org_members(clerk_user_id) ON DELETE SET NULL,
    conducted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase orders table
CREATE TABLE purchase_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    po_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    expected_delivery_date DATE,
    notes TEXT,
    created_by VARCHAR(255) REFERENCES org_members(clerk_user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, po_number)
);

-- Purchase order items table
CREATE TABLE purchase_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    received_quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goods receipts table
CREATE TABLE goods_receipts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    gr_number VARCHAR(50) NOT NULL,
    received_by VARCHAR(255) REFERENCES org_members(clerk_user_id) ON DELETE SET NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(gr_number)
);

-- Goods receipt items table
CREATE TABLE goods_receipt_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    goods_receipt_id UUID NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    purchase_order_item_id UUID NOT NULL REFERENCES purchase_order_items(id) ON DELETE CASCADE,
    received_quantity DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KDS tickets table
CREATE TABLE kds_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'ready', 'done')),
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    clerk_user_id VARCHAR(255) REFERENCES org_members(clerk_user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_org_members_organization_id ON org_members(organization_id);
CREATE INDEX idx_org_members_clerk_user_id ON org_members(clerk_user_id);
CREATE INDEX idx_products_organization_id ON products(organization_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_organization_id ON orders(organization_id);
CREATE INDEX idx_orders_outlet_id ON orders(outlet_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_kds_tickets_status ON kds_tickets(status);
CREATE INDEX idx_kds_tickets_created_at ON kds_tickets(created_at);
CREATE INDEX idx_stock_movements_ingredient_id ON stock_movements(ingredient_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_outlets_updated_at BEFORE UPDATE ON outlets FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_org_members_updated_at BEFORE UPDATE ON org_members FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_addons_updated_at BEFORE UPDATE ON addons FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_media_assets_updated_at BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_dining_tables_updated_at BEFORE UPDATE ON dining_tables FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_qr_sessions_updated_at BEFORE UPDATE ON qr_sessions FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_recipe_items_updated_at BEFORE UPDATE ON recipe_items FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_stock_movements_updated_at BEFORE UPDATE ON stock_movements FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_wastage_updated_at BEFORE UPDATE ON wastage FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_purchase_order_items_updated_at BEFORE UPDATE ON purchase_order_items FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_kds_tickets_updated_at BEFORE UPDATE ON kds_tickets FOR EACH ROW EXECUTE FUNCTION set_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dining_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wastage ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_take ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kds_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is member of organization
CREATE OR REPLACE FUNCTION app_is_member_of(organization_id UUID, clerk_user_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_members.organization_id = app_is_member_of.organization_id 
    AND org_members.clerk_user_id = app_is_member_of.clerk_user_id 
    AND org_members.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role in organization
CREATE OR REPLACE FUNCTION app_user_role(organization_id UUID, clerk_user_id VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  user_role VARCHAR;
BEGIN
  SELECT role INTO user_role FROM org_members 
  WHERE org_members.organization_id = app_user_role.organization_id 
  AND org_members.clerk_user_id = app_user_role.clerk_user_id 
  AND org_members.is_active = true;
  
  RETURN COALESCE(user_role, 'anonymous');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number(organization_id UUID, outlet_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  order_count INTEGER;
  order_number VARCHAR;
  today DATE := CURRENT_DATE;
BEGIN
  SELECT COUNT(*) INTO order_count 
  FROM orders 
  WHERE orders.organization_id = generate_order_number.organization_id 
  AND orders.outlet_id = generate_order_number.outlet_id 
  AND DATE(orders.created_at) = today;
  
  order_number := 'ORD' || TO_CHAR(today, 'YYMMDD') || LPAD((order_count + 1)::TEXT, 4, '0');
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to recalculate order totals
CREATE OR REPLACE FUNCTION fn_recalculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate subtotal from order items
  SELECT COALESCE(SUM(total), 0) INTO NEW.subtotal
  FROM order_items 
  WHERE order_items.order_id = COALESCE(NEW.order_id, OLD.order_id);
  
  -- Calculate tax (11%)
  NEW.tax := ROUND(NEW.subtotal * 0.11);
  
  -- Calculate service charge (5% for dine_in only)
  IF NEW.order_type = 'dine_in' THEN
    NEW.service_charge := ROUND(NEW.subtotal * 0.05);
  ELSE
    NEW.service_charge := 0;
  END IF;
  
  -- Calculate total
  NEW.total := NEW.subtotal + NEW.tax + NEW.service_charge - NEW.discount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order totals calculation
CREATE TRIGGER trigger_recalculate_order_totals
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION fn_recalculate_order_totals();

-- Create function to deduct stock when order is paid
CREATE OR REPLACE FUNCTION fn_deduct_stock_on_paid()
RETURNS TRIGGER AS $$
DECLARE
  order_item_record RECORD;
  recipe_record RECORD;
  recipe_item_record RECORD;
BEGIN
  -- Only proceed if payment status is changed to paid
  IF TG_OP = 'UPDATE' AND OLD.payment_status = 'pending' AND NEW.payment_status = 'paid' THEN
    
    -- Loop through order items
    FOR order_item_record IN 
      SELECT * FROM order_items WHERE order_items.order_id = NEW.id
    LOOP
      
      -- Get recipe for this product
      SELECT * INTO recipe_record 
      FROM recipes 
      WHERE recipes.product_id = order_item_record.product_id 
      AND recipes.is_active = true;
      
      -- If recipe exists, deduct stock for each ingredient
      IF recipe_record.id IS NOT NULL THEN
        FOR recipe_item_record IN 
          SELECT * FROM recipe_items WHERE recipe_items.recipe_id = recipe_record.id
        LOOP
          -- Update ingredient stock
          UPDATE ingredients 
          SET current_stock = current_stock - (recipe_item_record.quantity * order_item_record.quantity)
          WHERE ingredients.id = recipe_item_record.ingredient_id;
          
          -- Create stock movement record
          INSERT INTO stock_movements (
            organization_id, ingredient_id, movement_type, quantity, reference, notes
          ) VALUES (
            NEW.organization_id, 
            recipe_item_record.ingredient_id, 
            'out', 
            -(recipe_item_record.quantity * order_item_record.quantity),
            'Order#' || NEW.order_number,
            'Stock deducted for order #' || NEW.order_number
          );
        END LOOP;
      END IF;
    END LOOP;
    
    -- Create KDS tickets for each order item
    FOR order_item_record IN 
      SELECT * FROM order_items WHERE order_items.order_id = NEW.id
    LOOP
      INSERT INTO kds_tickets (
        order_id, order_item_id, status
      ) VALUES (
        NEW.id, order_item_record.id, 'new'
      );
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock deduction
CREATE TRIGGER trigger_deduct_stock_on_paid
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION fn_deduct_stock_on_paid();

-- Create function to create KDS tickets when order is confirmed
CREATE OR REPLACE FUNCTION fn_make_kds_on_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status is changed to confirmed
  IF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
    
    -- Create KDS tickets for each order item
    INSERT INTO kds_tickets (
      order_id, order_item_id, status
    )
    SELECT 
      NEW.id, 
      order_items.id, 
      'new'
    FROM order_items 
    WHERE order_items.order_id = NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for KDS ticket creation
CREATE TRIGGER trigger_make_kds_on_confirmed
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION fn_make_kds_on_confirmed();

-- Create views for reporting
CREATE VIEW v_sales_daily AS
SELECT 
  DATE(o.created_at) as date,
  o.organization_id,
  o.outlet_id,
  COUNT(*) as total_orders,
  SUM(o.total) as total_sales,
  SUM(o.subtotal) as subtotal,
  SUM(o.tax) as total_tax,
  SUM(o.service_charge) as total_service_charge,
  SUM(o.discount) as total_discount,
  AVG(o.total) as avg_order_value
FROM orders o
WHERE o.payment_status = 'paid'
GROUP BY DATE(o.created_at), o.organization_id, o.outlet_id
ORDER BY date DESC;

CREATE VIEW v_top_items AS
SELECT
  p.name as product_name,
  p.id as product_id,
  COUNT(*) as total_orders,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.total) as total_revenue,
  o.organization_id
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE o.payment_status = 'paid'
GROUP BY p.id, p.name, o.organization_id
ORDER BY total_quantity DESC;

CREATE VIEW v_stock_critical AS
SELECT 
  i.name as ingredient_name,
  i.id as ingredient_id,
  i.current_stock,
  i.min_stock,
  i.unit,
  (i.current_stock - i.min_stock) as stock_difference,
  i.organization_id
FROM ingredients i
WHERE i.current_stock <= i.min_stock AND i.is_active = true
ORDER BY stock_difference ASC;

-- Insert sample organization for testing
INSERT INTO organizations (id, name, description) VALUES 
('00000000-0000-0000-0000-000000000001', 'Pempek Palembang', 'Sample organization for testing');

-- Insert sample outlet
INSERT INTO outlets (id, organization_id, name, address) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Main Outlet', 'Jl. Sudirman No. 123, Palembang');

-- Insert sample categories
INSERT INTO categories (id, organization_id, name, sort_order) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Pempek', 1),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Minuman', 2),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Lainnya', 3);

-- Insert sample products
INSERT INTO products (id, organization_id, category_id, name, description, price, cost, sort_order) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Pempek Kapal Selam', 'Pempek dengan telur di dalam', 25000, 15000, 1),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Pempek Lenjer', 'Pempek bentuk panjang', 20000, 12000, 2),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Pempek Adaan', 'Pempek bulat', 15000, 9000, 3),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Es Teh Manis', 'Teh manis dingin', 5000, 2000, 1),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Es Jeruk', 'Jeruk peras dingin', 8000, 3000, 2);

-- Insert sample ingredients
INSERT INTO ingredients (id, organization_id, name, unit, current_stock, min_stock, cost_per_unit) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Tepung Tapioka', 'kg', 50, 10, 15000),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ikan Tenggiri', 'kg', 20, 5, 80000),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Telur', 'butir', 100, 20, 2500),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Gula', 'kg', 25, 5, 12000),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Teh', 'kg', 5, 1, 100000);

-- Insert sample recipes
INSERT INTO recipes (id, product_id, name, instructions) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Resep Pempek Kapal Selam', 'Campur tepung dan ikan, bentuk, isi telur, goreng'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Resep Pempek Lenjer', 'Campur tepung dan ikan, bentuk panjang, goreng'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Resep Pempek Adaan', 'Campur tepung dan ikan, bentuk bulat, goreng'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Resep Es Teh Manis', 'Seduh teh, tambah gula, dinginkan'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Resep Es Jeruk', 'Peras jeruk, tambah gula, dinginkan');

-- Insert sample recipe items
INSERT INTO recipe_items (id, recipe_id, ingredient_id, quantity) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 0.5),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 0.3),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 1),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 0.4),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 0.25),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 0.3),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 0.2),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 0.02),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 0.03),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 0.02);

-- Insert sample dining tables
INSERT INTO dining_tables (id, organization_id, outlet_id, number, capacity) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MEJA-01', 4),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MEJA-02', 4),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MEJA-03', 6),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MEJA-04', 2),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MEJA-05', 8);