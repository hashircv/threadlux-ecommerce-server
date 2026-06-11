INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin', 'admin@example.com', '$2a$10$R3EOeqI5WE3GqoV8ycbuCei8Bc4CtN.uz8Fd2dRuzAVDE4gfXLxDC', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

INSERT INTO products (name, description, image_url, price, category, rating, stock)
VALUES
  ('Classic White Shirt', 'Crisp cotton shirt with a timeless silhouette, perfect for any occasion.', 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=800&q=80', 49.99, 'Tops', 4.5, 42),
  ('Slim Fit Chinos', 'Versatile slim-fit chinos in stretch cotton for all-day comfort.', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', 69.99, 'Bottoms', 4.3, 28),
  ('Floral Midi Dress', 'Elegant floral midi dress with a flattering A-line cut.', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 89.99, 'Dresses', 4.8, 16),
  ('Leather Belt', 'Genuine leather belt with a brushed silver buckle.', 'https://images.unsplash.com/photo-1611010344445-5f8f9e5e32cf?auto=format&fit=crop&w=800&q=80', 35.00, 'Accessories', 4.2, 64),
  ('Canvas Tote Bag', 'Sturdy canvas tote with inner pockets and zip closure.', 'https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&w=800&q=80', 42.00, 'Accessories', 4.6, 35),
  ('Denim Jacket', 'Classic blue denim jacket with washed finish and brass buttons.', 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&w=800&q=80', 119.00, 'Outerwear', 4.4, 19)
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, image_url, price, category, rating, stock)
VALUES
  ('Linen Blazer', 'Lightweight linen blazer for smart-casual looks in warm weather.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', 149.00, 'Outerwear', 4.6, 11),
  ('Ribbed Knit Sweater', 'Cozy ribbed knit sweater in merino wool blend.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', 79.00, 'Tops', 4.4, 24),
  ('Wide Leg Trousers', 'Flowy wide-leg trousers in soft crepe fabric.', 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80', 85.00, 'Bottoms', 4.5, 30),
  ('Pleated Midi Skirt', 'Satin pleated midi skirt with an elastic waistband.', 'https://images.unsplash.com/photo-1583496661160-fb5218afa9a4?auto=format&fit=crop&w=800&q=80', 65.00, 'Bottoms', 4.3, 22),
  ('Silk Scarf', 'Luxurious silk scarf with an abstract print.', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80', 55.00, 'Accessories', 4.7, 45),
  ('Graphic Tee', 'Relaxed-fit graphic tee in 100% organic cotton.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', 29.99, 'Tops', 4.5, 80),
  ('Trench Coat', 'Classic double-breasted trench coat with belt detail.', 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80', 229.00, 'Outerwear', 4.4, 9),
  ('Wrap Dress', 'Bohemian wrap dress in a vibrant geometric print.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', 95.00, 'Dresses', 4.6, 18),
  ('Crossbody Bag', 'Compact crossbody bag in pebbled vegan leather.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', 75.00, 'Accessories', 4.3, 27),
  ('Cargo Pants', 'Utility-style cargo pants with multiple pockets.', 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80', 79.99, 'Bottoms', 4.2, 21),
  ('Oversized Hoodie', 'Ultra-soft fleece hoodie in an oversized cut.', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80', 59.99, 'Tops', 4.4, 34),
  ('Slip Dress', 'Minimalist satin slip dress, perfect for layering or evening wear.', 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80', 72.00, 'Dresses', 4.3, 13),
  ('Wool Coat', 'Structured wool coat with notch lapel and full lining.', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', 259.00, 'Outerwear', 4.6, 8),
  ('Straw Hat', 'Wide-brim straw hat for sunny days.', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80', 28.00, 'Accessories', 4.6, 50)
ON CONFLICT DO NOTHING;
