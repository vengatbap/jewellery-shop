-- INVOICES

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  subtotal NUMERIC,
  tax NUMERIC,
  discount NUMERIC,
  total NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);


-- INVOICE ITEMS

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  product_id UUID REFERENCES products(id),
  price NUMERIC,
  quantity INTEGER
);


-- PAYMENTS

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  method TEXT,
  amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);


-- LOYALTY

CREATE TABLE loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  points INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);


-- SCHEMES

CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  months INTEGER,
  bonus_percent NUMERIC
);


-- PAWN

CREATE TABLE pawn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  item_description TEXT,
  loan_amount NUMERIC,
  interest_rate NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);


-- ACCOUNTING

CREATE TABLE accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT,
  debit NUMERIC,
  credit NUMERIC,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


-- NOTIFICATIONS

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);