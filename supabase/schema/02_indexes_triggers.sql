-- Indexes and Triggers for Pempek POS System

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