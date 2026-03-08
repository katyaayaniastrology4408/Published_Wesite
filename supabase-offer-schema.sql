-- 1. Create the offer_settings table
CREATE TABLE IF NOT EXISTS offer_settings (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    original_price NUMERIC DEFAULT 501,
    offer_price NUMERIC DEFAULT 501,
    title TEXT DEFAULT '🎉 Special Festival Offer',
    urgency_text TEXT DEFAULT 'Only Few Slots Left',
    popup_text TEXT DEFAULT '🎉 Special Festival Offer – Book Now at ₹501 Only!',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insert initial configuration (Disabled by default)
INSERT INTO offer_settings (id, is_active, original_price, offer_price)
SELECT 1, false, 501, 501
WHERE NOT EXISTS (SELECT 1 FROM offer_settings WHERE id = 1);
