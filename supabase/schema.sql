-- ========================================================
-- പാലക്കാട് എക്കോ ഷോപ്പ് (Palakkad Eco Shop) - Supabase Database Schema
-- ========================================================

-- 1. PRODUCTS TABLE (ഉൽപ്പന്നങ്ങളുടെ പട്ടിക)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name_ml TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    unit TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS TABLE (ഉപഭോക്താക്കൾ)
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    landmark TEXT,
    zone TEXT NOT NULL,
    pincode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE (ഓർഡറുകൾ)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_landmark TEXT,
    customer_zone TEXT NOT NULL,
    customer_pincode TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_charge NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'received' NOT NULL,
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (true);

-- Allow public insert/update/delete to products (for store manager)
CREATE POLICY "Allow store manager full access to products" ON products
    FOR ALL USING (true);

-- Allow public read and write access to orders
CREATE POLICY "Allow public access to orders" ON orders
    FOR ALL USING (true);

-- Allow public read and write access to customers
CREATE POLICY "Allow public access to customers" ON customers
    FOR ALL USING (true);

-- Realtime replication enable for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 4. INITIAL SEED DATA (പാലക്കാടൻ നാടൻ ഉൽപ്പന്നങ്ങൾ)
INSERT INTO products (id, name_ml, name_en, category, price, original_price, unit, image, description, in_stock)
VALUES
('prod-1', 'പാലക്കാടൻ നാടൻ മട്ടയരി (ജൈവ കൃഷി)', 'Palakkadan Matta Rice (Organic)', 'ധാന്യങ്ങൾ', 68, 80, '1 Kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'പാലക്കാട്ടെ കർഷകരിൽ നിന്ന് നേരിട്ട് ശേഖരിച്ച പോഷകഗുണമുള്ള തവിടുള്ള നാടൻ മട്ടയരി.', true),
('prod-2', 'വെർജിൻ വെളിച്ചെണ്ണ (ചക്കിലാട്ടിയത്)', 'Cold Pressed Virgin Coconut Oil', 'പ്രകൃതിദത്ത എണ്ണകൾ', 240, 280, '500 ml', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', 'പച്ചത്തേങ്ങയിൽ നിന്നും പരമ്പരാഗത മരച്ചക്കിലാട്ടി തയ്യാറാക്കിയ 100% പരിശുദ്ധമായ വെളിച്ചെണ്ണ.', true),
('prod-3', 'നാടൻ പനങ്കരുപ്പട്ടി (Palmyra Jaggery)', 'Pure Palm Jaggery (Karupatti)', 'പരമ്പരാഗത പലഹാരങ്ങൾ', 180, 210, '500 g', 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=600&q=80', 'പാലക്കാടൻ പനകളിൽ നിന്ന് പരമ്പരാഗതമായി നിർമ്മിച്ച കെമിക്കലുകൾ ചേർക്കാത്ത നാടൻ കരിപ്പട്ടി.', true),
('prod-4', 'വനജൈവ ചെറുതേൻ (Wild Forest Honey)', 'Wild Raw Forest Honey', 'പരമ്പരാഗത പലഹാരങ്ങൾ', 320, 380, '350 g', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', 'അട്ടപ്പാടി / നെല്ലിയാമ്പതി വനമേഖലയിൽ നിന്നും ശേഖരിച്ച ശുദ്ധമായ അസംസ്കൃത ചെറുതേൻ.', true),
('prod-5', 'ജൈവ മഞ്ഞൾപ്പൊടി (വയനാടൻ തനി നാടൻ)', 'Organic Turmeric Powder (High Curcumin)', 'മസാലകൾ', 95, 120, '250 g', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', 'കൃത്രിമ നിറങ്ങളോ പ്രിസർവേറ്റീവുകളോ ഇല്ലാത്ത ഉയർന്ന കുർക്കുമിൻ അടങ്ങിയ ശുദ്ധമായ മഞ്ഞൾപ്പൊടി.', true),
('prod-6', 'മുള ടൂത്ത്ബ്രഷ് & കോക്കനട്ട് ഫൈബർ സ്ക്രബ്ബർ', 'Bamboo Toothbrush & Eco Scrub Set', 'ഇക്കോ ക്ലീനിംഗ്', 110, 150, 'Set of 3', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80', 'പ്ലാസ്റ്റിക് മുക്തമായ പ്രകൃതിദത്ത മുള ബ്രഷും ചകിരി സ്ക്രബ്ബറും അടങ്ങിയ കോംബോ പാക്ക്.', true),
('prod-7', 'ജൈവ ചീരയും നാടൻ പച്ചക്കറി കോംബോയും', 'Fresh Farm Organic Greens Combo', 'ജൈവ പച്ചക്കറികൾ', 120, 140, '1 Basket (Approx 1.5kg)', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', 'രാവിലെ പാലക്കാട്ടെ ഫാമുകളിൽ നിന്ന് നേരിട്ട് വിളവെടുത്ത വിഷരഹിത നാടൻ ചീര, വെണ്ട, പയർ.', true),
('prod-8', 'പ്രകൃതിദത്ത സോപ്പ്നട്ട് ലിക്വിഡ് വാഷ്', 'Natural Bio Soapnut Liquid Cleaner', 'ഇക്കോ ക്ലീനിംഗ്', 190, 220, '1 Litre', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 'സോപ്പ് കായയിൽ നിന്ന് നിർമ്മിച്ച പാത്രങ്ങളും വസ്ത്രങ്ങളും കഴുകാൻ പറ്റിയ കെമിക്കൽ രഹിത ലിക്വിഡ്.', true)
ON CONFLICT (id) DO NOTHING;
