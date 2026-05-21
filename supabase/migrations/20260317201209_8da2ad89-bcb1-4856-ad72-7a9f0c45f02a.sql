-- Fix remaining URL encoding in HEALF image URLs (%3D -> =)
UPDATE seller_products
SET images = (
  SELECT array_agg(
    replace(replace(img, '%3D', '='), '%26', '&')
  )
  FROM unnest(images) AS img
)
WHERE LOWER(brand) = 'healf' AND images IS NOT NULL AND array_length(images, 1) > 0;