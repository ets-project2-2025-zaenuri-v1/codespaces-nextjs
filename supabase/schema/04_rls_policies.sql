-- Row Level Security Policies for Pempek POS System
-- These policies ensure users can only access data from their own organization

-- Drop existing policies if they exist (for development)
DROP POLICY IF EXISTS "Users can view organizations they are members of" ON organizations;
DROP POLICY IF EXISTS "Users can insert organizations they own" ON organizations;
DROP POLICY IF EXISTS "Users can update organizations they own" ON organizations;
DROP POLICY IF EXISTS "Users can delete organizations they own" ON organizations;

-- Organizations policies
CREATE POLICY "Users can view organizations they are members of" ON organizations
  FOR SELECT USING (
    app_is_member_of(id, auth.uid()::text)
  );

CREATE POLICY "Users can insert organizations they own" ON organizations
  FOR INSERT WITH CHECK (
    app_is_member_of(id, auth.uid()::text) AND 
    app_user_role(id, auth.uid()::text) = 'owner'
  );

CREATE POLICY "Users can update organizations they own" ON organizations
  FOR UPDATE USING (
    app_is_member_of(id, auth.uid()::text) AND 
    app_user_role(id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete organizations they own" ON organizations
  FOR DELETE USING (
    app_is_member_of(id, auth.uid()::text) AND 
    app_user_role(id, auth.uid()::text) = 'owner'
  );

-- Drop existing policies for outlets if they exist
DROP POLICY IF EXISTS "Users can view outlets from their organization" ON outlets;
DROP POLICY IF EXISTS "Users can insert outlets from their organization" ON outlets;
DROP POLICY IF EXISTS "Users can update outlets from their organization" ON outlets;
DROP POLICY IF EXISTS "Users can delete outlets from their organization" ON outlets;

-- Outlets policies
CREATE POLICY "Users can view outlets from their organization" ON outlets
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert outlets from their organization" ON outlets
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update outlets from their organization" ON outlets
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete outlets from their organization" ON outlets
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) = 'owner'
  );

-- Drop existing policies for org_members if they exist
DROP POLICY IF EXISTS "Users can view org members from their organization" ON org_members;
DROP POLICY IF EXISTS "Users can insert org members from their organization" ON org_members;
DROP POLICY IF EXISTS "Users can update org members from their organization" ON org_members;
DROP POLICY IF EXISTS "Users can delete org members from their organization" ON org_members;
DROP POLICY IF EXISTS "Users can view their own org member record" ON org_members;
DROP POLICY IF EXISTS "Users can update their own org member record" ON org_members;

-- Organization members policies
CREATE POLICY "Users can view org members from their organization" ON org_members
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert org members from their organization" ON org_members
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update org members from their organization" ON org_members
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete org members from their organization" ON org_members
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can view their own org member record" ON org_members
  FOR SELECT USING (
    clerk_user_id = auth.uid()::text
  );

CREATE POLICY "Users can update their own org member record" ON org_members
  FOR UPDATE USING (
    clerk_user_id = auth.uid()::text
  );

-- Drop existing policies for categories if they exist
DROP POLICY IF EXISTS "Users can view categories from their organization" ON categories;
DROP POLICY IF EXISTS "Users can insert categories from their organization" ON categories;
DROP POLICY IF EXISTS "Users can update categories from their organization" ON categories;
DROP POLICY IF EXISTS "Users can delete categories from their organization" ON categories;

-- Categories policies
CREATE POLICY "Users can view categories from their organization" ON categories
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert categories from their organization" ON categories
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update categories from their organization" ON categories
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete categories from their organization" ON categories
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for products if they exist
DROP POLICY IF EXISTS "Users can view products from their organization" ON products;
DROP POLICY IF EXISTS "Users can insert products from their organization" ON products;
DROP POLICY IF EXISTS "Users can update products from their organization" ON products;
DROP POLICY IF EXISTS "Users can delete products from their organization" ON products;

-- Products policies
CREATE POLICY "Users can view products from their organization" ON products
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert products from their organization" ON products
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update products from their organization" ON products
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete products from their organization" ON products
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for product_variants if they exist
DROP POLICY IF EXISTS "Users can view product variants from their organization" ON product_variants;
DROP POLICY IF EXISTS "Users can insert product variants from their organization" ON product_variants;
DROP POLICY IF EXISTS "Users can update product variants from their organization" ON product_variants;
DROP POLICY IF EXISTS "Users can delete product variants from their organization" ON product_variants;

-- Product variants policies
CREATE POLICY "Users can view product variants from their organization" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert product variants from their organization" ON product_variants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
      AND app_user_role(products.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can update product variants from their organization" ON product_variants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
      AND app_user_role(products.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can delete product variants from their organization" ON product_variants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
      AND app_user_role(products.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

-- Drop existing policies for addons if they exist
DROP POLICY IF EXISTS "Users can view addons from their organization" ON addons;
DROP POLICY IF EXISTS "Users can insert addons from their organization" ON addons;
DROP POLICY IF EXISTS "Users can update addons from their organization" ON addons;
DROP POLICY IF EXISTS "Users can delete addons from their organization" ON addons;

-- Addons policies
CREATE POLICY "Users can view addons from their organization" ON addons
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert addons from their organization" ON addons
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update addons from their organization" ON addons
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete addons from their organization" ON addons
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for dining_tables if they exist
DROP POLICY IF EXISTS "Users can view dining tables from their organization" ON dining_tables;
DROP POLICY IF EXISTS "Users can insert dining tables from their organization" ON dining_tables;
DROP POLICY IF EXISTS "Users can update dining tables from their organization" ON dining_tables;
DROP POLICY IF EXISTS "Users can delete dining tables from their organization" ON dining_tables;

-- Dining tables policies
CREATE POLICY "Users can view dining tables from their organization" ON dining_tables
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert dining tables from their organization" ON dining_tables
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update dining tables from their organization" ON dining_tables
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete dining tables from their organization" ON dining_tables
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for orders if they exist
DROP POLICY IF EXISTS "Users can view orders from their organization" ON orders;
DROP POLICY IF EXISTS "Users can insert orders from their organization" ON orders;
DROP POLICY IF EXISTS "Users can update orders from their organization" ON orders;
DROP POLICY IF EXISTS "Users can delete orders from their organization" ON orders;

-- Orders policies
CREATE POLICY "Users can view orders from their organization" ON orders
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert orders from their organization" ON orders
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier', 'waiter')
  );

CREATE POLICY "Users can update orders from their organization" ON orders
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier', 'waiter', 'cook', 'courier')
  );

CREATE POLICY "Users can delete orders from their organization" ON orders
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for order_items if they exist
DROP POLICY IF EXISTS "Users can view order items from their organization" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items from their organization" ON order_items;
DROP POLICY IF EXISTS "Users can update order items from their organization" ON order_items;
DROP POLICY IF EXISTS "Users can delete order items from their organization" ON order_items;

-- Order items policies
CREATE POLICY "Users can view order items from their organization" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert order items from their organization" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier', 'waiter')
    )
  );

CREATE POLICY "Users can update order items from their organization" ON order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier', 'waiter')
    )
  );

CREATE POLICY "Users can delete order items from their organization" ON order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier', 'waiter')
    )
  );

-- Drop existing policies for payments if they exist
DROP POLICY IF EXISTS "Users can view payments from their organization" ON payments;
DROP POLICY IF EXISTS "Users can insert payments from their organization" ON payments;
DROP POLICY IF EXISTS "Users can update payments from their organization" ON payments;
DROP POLICY IF EXISTS "Users can delete payments from their organization" ON payments;

-- Payments policies
CREATE POLICY "Users can view payments from their organization" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert payments from their organization" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier')
    )
  );

CREATE POLICY "Users can update payments from their organization" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin', 'cashier')
    )
  );

CREATE POLICY "Users can delete payments from their organization" ON payments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

-- Drop existing policies for ingredients if they exist
DROP POLICY IF EXISTS "Users can view ingredients from their organization" ON ingredients;
DROP POLICY IF EXISTS "Users can insert ingredients from their organization" ON ingredients;
DROP POLICY IF EXISTS "Users can update ingredients from their organization" ON ingredients;
DROP POLICY IF EXISTS "Users can delete ingredients from their organization" ON ingredients;

-- Ingredients policies
CREATE POLICY "Users can view ingredients from their organization" ON ingredients
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert ingredients from their organization" ON ingredients
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update ingredients from their organization" ON ingredients
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete ingredients from their organization" ON ingredients
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for recipes if they exist
DROP POLICY IF EXISTS "Users can view recipes from their organization" ON recipes;
DROP POLICY IF EXISTS "Users can insert recipes from their organization" ON recipes;
DROP POLICY IF EXISTS "Users can update recipes from their organization" ON recipes;
DROP POLICY IF EXISTS "Users can delete recipes from their organization" ON recipes;

-- Recipes policies
CREATE POLICY "Users can view recipes from their organization" ON recipes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = recipes.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert recipes from their organization" ON recipes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = recipes.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
      AND app_user_role(products.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can update recipes from their organization" ON recipes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = recipes.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
      AND app_user_role(products.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can delete recipes from their organization" ON recipes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = recipes.product_id 
      AND app_is_member_of(products.organization_id, auth.uid()::text)
      AND app_user_role(products.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

-- Drop existing policies for stock_movements if they exist
DROP POLICY IF EXISTS "Users can view stock movements from their organization" ON stock_movements;
DROP POLICY IF EXISTS "Users can insert stock movements from their organization" ON stock_movements;
DROP POLICY IF EXISTS "Users can update stock movements from their organization" ON stock_movements;
DROP POLICY IF EXISTS "Users can delete stock movements from their organization" ON stock_movements;

-- Stock movements policies
CREATE POLICY "Users can view stock movements from their organization" ON stock_movements
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert stock movements from their organization" ON stock_movements
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update stock movements from their organization" ON stock_movements
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete stock movements from their organization" ON stock_movements
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for kds_tickets if they exist
DROP POLICY IF EXISTS "Users can view KDS tickets from their organization" ON kds_tickets;
DROP POLICY IF EXISTS "Users can update KDS tickets from their organization" ON kds_tickets;
DROP POLICY IF EXISTS "Users can delete KDS tickets from their organization" ON kds_tickets;

-- KDS tickets policies
CREATE POLICY "Users can view KDS tickets from their organization" ON kds_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = kds_tickets.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
    )
  );

CREATE POLICY "Users can update KDS tickets from their organization" ON kds_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = kds_tickets.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin', 'cook')
    )
  );

CREATE POLICY "Users can delete KDS tickets from their organization" ON kds_tickets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = kds_tickets.order_id 
      AND app_is_member_of(orders.organization_id, auth.uid()::text)
      AND app_user_role(orders.organization_id, auth.uid()::text) IN ('owner', 'admin')
    )
  );

-- Drop existing policies for audit_logs if they exist
DROP POLICY IF EXISTS "Users can view audit logs from their organization" ON audit_logs;
DROP POLICY IF EXISTS "Users can insert audit logs from their organization" ON audit_logs;

-- Audit logs policies
CREATE POLICY "Users can view audit logs from their organization" ON audit_logs
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can insert audit logs from their organization" ON audit_logs
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text)
  );

-- Drop existing policies for suppliers if they exist
DROP POLICY IF EXISTS "Users can view suppliers from their organization" ON suppliers;
DROP POLICY IF EXISTS "Users can insert suppliers from their organization" ON suppliers;
DROP POLICY IF EXISTS "Users can update suppliers from their organization" ON suppliers;
DROP POLICY IF EXISTS "Users can delete suppliers from their organization" ON suppliers;

-- Suppliers policies
CREATE POLICY "Users can view suppliers from their organization" ON suppliers
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert suppliers from their organization" ON suppliers
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update suppliers from their organization" ON suppliers
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete suppliers from their organization" ON suppliers
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for purchase_orders if they exist
DROP POLICY IF EXISTS "Users can view purchase orders from their organization" ON purchase_orders;
DROP POLICY IF EXISTS "Users can insert purchase orders from their organization" ON purchase_orders;
DROP POLICY IF EXISTS "Users can update purchase orders from their organization" ON purchase_orders;
DROP POLICY IF EXISTS "Users can delete purchase orders from their organization" ON purchase_orders;

-- Purchase orders policies
CREATE POLICY "Users can view purchase orders from their organization" ON purchase_orders
  FOR SELECT USING (
    app_is_member_of(organization_id, auth.uid()::text)
  );

CREATE POLICY "Users can insert purchase orders from their organization" ON purchase_orders
  FOR INSERT WITH CHECK (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can update purchase orders from their organization" ON purchase_orders
  FOR UPDATE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

CREATE POLICY "Users can delete purchase orders from their organization" ON purchase_orders
  FOR DELETE USING (
    app_is_member_of(organization_id, auth.uid()::text) AND 
    app_user_role(organization_id, auth.uid()::text) IN ('owner', 'admin')
  );

-- Drop existing policies for qr_sessions if they exist
DROP POLICY IF EXISTS "Users can view QR sessions from their organization" ON qr_sessions;
DROP POLICY IF EXISTS "Users can insert QR sessions from their organization" ON qr_sessions;
DROP POLICY IF EXISTS "Users can update QR sessions from their organization" ON qr_sessions;
DROP POLICY IF EXISTS "Users can delete QR sessions from their organization" ON qr_sessions;
DROP POLICY IF EXISTS "Public can view QR sessions by token" ON qr_sessions;

-- QR sessions policies
CREATE POLICY "Users can view QR sessions from their organization" ON qr_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM dining_tables 
      WHERE dining_tables.id = qr_sessions.table_id 
      AND app_is_member_of(dining_tables.organization_id, auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert QR sessions from their organization" ON qr_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM dining_tables 
      WHERE dining_tables.id = qr_sessions.table_id 
      AND app_is_member_of(dining_tables.organization_id, auth.uid()::text)
      AND app_user_role(dining_tables.organization_id, auth.uid()::text) IN ('owner', 'admin', 'waiter')
    )
  );

CREATE POLICY "Users can update QR sessions from their organization" ON qr_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM dining_tables 
      WHERE dining_tables.id = qr_sessions.table_id 
      AND app_is_member_of(dining_tables.organization_id, auth.uid()::text)
      AND app_user_role(dining_tables.organization_id, auth.uid()::text) IN ('owner', 'admin', 'waiter')
    )
  );

CREATE POLICY "Users can delete QR sessions from their organization" ON qr_sessions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM dining_tables 
      WHERE dining_tables.id = qr_sessions.table_id 
      AND app_is_member_of(dining_tables.organization_id, auth.uid()::text)
      AND app_user_role(dining_tables.organization_id, auth.uid()::text) IN ('owner', 'admin', 'waiter')
    )
  );

-- Public access for QR scanning (no auth required)
CREATE POLICY "Public can view QR sessions by token" ON qr_sessions
  FOR SELECT USING (
    session_token IS NOT NULL AND 
    is_active = true AND 
    expires_at > NOW()
  );