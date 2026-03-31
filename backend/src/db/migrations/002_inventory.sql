-- METALS

CREATE TABLE metals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  purity TEXT
);


-- METAL RATES

CREATE TABLE metal_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_id UUID REFERENCES metals(id),
  rate NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);


-- CATEGORIES

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT,
  description TEXT
);


-- PRODUCTS

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  category_id UUID REFERENCES categories(id),
  metal_id UUID REFERENCES metals(id),
  name TEXT,
  sku TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


-- INVENTORY

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  gross_weight NUMERIC,
  net_weight NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);


-- STOCK MOVEMENTS

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  type TEXT,
  quantity INTEGER,
  reference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


-- BARCODE

CREATE TABLE barcodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  code TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);


-- PRICING RULES

CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  making_charge NUMERIC,
  wastage_percent NUMERIC
);