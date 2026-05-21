-- Fix HEALF product images: extract direct Shopify CDN URLs from next/image wrappers
UPDATE seller_products
SET images = (
  SELECT array_agg(
    CASE
      WHEN img LIKE '%/_next/image?url=%' THEN
        replace(
          replace(
            replace(
              split_part(split_part(img, 'url=', 2), '&w=', 1),
              '%3A', ':'
            ),
            '%2F', '/'
          ),
          '%3F', '?'
        )
      ELSE img
    END
  )
  FROM unnest(images) AS img
)
WHERE LOWER(brand) = 'healf' AND images IS NOT NULL AND array_length(images, 1) > 0;