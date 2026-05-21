-- Create seller products table
CREATE TABLE public.seller_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price > 0),
  original_price NUMERIC,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  key_ingredients TEXT,
  benefits TEXT,
  usage_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paused')),
  views INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seller_products ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own products
CREATE POLICY "Sellers can view their own products"
ON public.seller_products
FOR SELECT
USING (auth.uid() = seller_id);

-- Sellers can insert their own products
CREATE POLICY "Sellers can insert their own products"
ON public.seller_products
FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own products
CREATE POLICY "Sellers can update their own products"
ON public.seller_products
FOR UPDATE
USING (auth.uid() = seller_id);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete their own products"
ON public.seller_products
FOR DELETE
USING (auth.uid() = seller_id);

-- Public can view approved products
CREATE POLICY "Public can view approved products"
ON public.seller_products
FOR SELECT
USING (status = 'approved');

-- Create saved products / wishlist table
CREATE TABLE public.saved_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT NOT NULL,
  product_image TEXT,
  product_price NUMERIC NOT NULL,
  product_original_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved products
CREATE POLICY "Users can view their own saved products"
ON public.saved_products
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own saved products
CREATE POLICY "Users can insert their own saved products"
ON public.saved_products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved products
CREATE POLICY "Users can delete their own saved products"
ON public.saved_products
FOR DELETE
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_seller_products_updated_at
BEFORE UPDATE ON public.seller_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();