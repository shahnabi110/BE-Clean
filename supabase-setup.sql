-- =====================================================================
-- BE-CLEAN — Supabase Database Setup & RLS Security Script
-- Instructions: Run this script in your Supabase SQL Editor.
-- Replace 'YOUR_ADMIN_EMAIL' with your actual login email address!
-- =====================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT '1 Bottle',
    sort INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Distributors Table
CREATE TABLE IF NOT EXISTS public.distributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Prices Table (Per-Distributor Custom Rates)
CREATE TABLE IF NOT EXISTS public.prices (
    distributor_id UUID REFERENCES public.distributors(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (distributor_id, product_id)
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Only your admin email can read/write directly to the tables.
-- =====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running script
DROP POLICY IF EXISTS "Admin Full Access on Products" ON public.products;
DROP POLICY IF EXISTS "Admin Full Access on Distributors" ON public.distributors;
DROP POLICY IF EXISTS "Admin Full Access on Prices" ON public.prices;

-- Products RLS Policy
CREATE POLICY "Admin Full Access on Products" ON public.products
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
    WITH CHECK ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- Distributors RLS Policy
CREATE POLICY "Admin Full Access on Distributors" ON public.distributors
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
    WITH CHECK ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- Prices RLS Policy
CREATE POLICY "Admin Full Access on Prices" ON public.prices
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
    WITH CHECK ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- =====================================================================
-- SECURITY DEFINER RPC FUNCTION: get_rates(p_token uuid)
-- Safe, read-only function for anonymous visitors to view their own
-- distributor rate list without table access.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_rates(p_token UUID)
RETURNS TABLE (
    distributor_name TEXT,
    updated_at TIMESTAMPTZ,
    product_id UUID,
    product_name TEXT,
    unit TEXT,
    price NUMERIC(10,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.name AS distributor_name,
        d.updated_at AS updated_at,
        p.id AS product_id,
        p.name AS product_name,
        p.unit AS unit,
        pr.price AS price
    FROM public.distributors d
    INNER JOIN public.prices pr ON pr.distributor_id = d.id
    INNER JOIN public.products p ON p.id = pr.product_id
    WHERE d.token = p_token
      AND pr.price > 0
    ORDER BY p.sort ASC, p.name ASC;
END;
$$;

-- Grant execution permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_rates(UUID) TO anon, authenticated;
