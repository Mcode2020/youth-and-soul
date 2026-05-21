ALTER TABLE public.seller_products DROP CONSTRAINT seller_products_price_check;
ALTER TABLE public.seller_products ADD CONSTRAINT seller_products_price_check CHECK (price >= 0);