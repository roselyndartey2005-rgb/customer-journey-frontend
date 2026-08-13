import type { Product } from '../types';

export const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    price: 249.99,
    category: 'Electronics',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for commutes, travel, or deep focus work sessions.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Portable Bluetooth Speaker',
    price: 79.99,
    category: 'Electronics',
    description: 'Compact waterproof speaker with 360-degree sound, 12-hour playtime, and rugged design. Take your music anywhere from the beach to the mountains.',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Smart Fitness Watch',
    price: 199.99,
    category: 'Electronics',
    description: 'Track your health metrics with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Syncs seamlessly with your phone for notifications on the go.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'USB-C Fast Charging Hub',
    price: 59.99,
    category: 'Electronics',
    description: '7-in-1 hub with 100W power delivery, 4K HDMI output, SD card reader, and three USB 3.0 ports. The only adapter you will ever need.',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    price: 149.99,
    category: 'Electronics',
    description: 'Hot-swappable mechanical keyboard with RGB backlighting, PBT keycaps, and a satisfying tactile typing experience. Built for both work and gaming.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop&q=80',
  },

  // Clothing
  {
    id: 6,
    name: 'Merino Wool Crew Neck Sweater',
    price: 89.99,
    category: 'Clothing',
    description: 'Ultra-soft 100% merino wool sweater that regulates temperature naturally. Machine washable, pill-resistant, and perfect for layering in any season.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Slim Fit Chino Pants',
    price: 65.00,
    category: 'Clothing',
    description: 'Versatile stretch chinos with a modern slim fit. Made from organic cotton with just enough elastane for all-day comfort. Dress them up or down.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Organic Cotton T-Shirt',
    price: 35.00,
    category: 'Clothing',
    description: 'Heavyweight organic cotton tee with a relaxed fit. Pre-shrunk, garment-dyed for a lived-in feel from day one. The everyday essential done right.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 9,
    name: 'Water-Resistant Shell Jacket',
    price: 175.00,
    category: 'Clothing',
    description: 'Lightweight packable jacket with sealed seams and adjustable hood. Keeps you dry in unexpected downpours without the bulk of a traditional rain coat.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&h=800&fit=crop&q=80',
  },

  // Home & Living
  {
    id: 10,
    name: 'Hand-Poured Soy Candle Set',
    price: 42.00,
    category: 'Home & Living',
    description: 'Set of three artisan soy candles in calming scents: cedar and sage, vanilla bean, and fresh linen. 45-hour burn time each. Clean-burning with cotton wicks.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 11,
    name: 'Ceramic Pour-Over Coffee Set',
    price: 68.00,
    category: 'Home & Living',
    description: 'Handcrafted ceramic dripper with matching carafe and measuring scoop. Produces a clean, bright cup of coffee. Includes 50 natural paper filters.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 12,
    name: 'Linen Throw Blanket',
    price: 95.00,
    category: 'Home & Living',
    description: 'Stonewashed French linen throw in a neutral oat color. Gets softer with every wash. Generous 60x80 inch size for the couch or end of the bed.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 13,
    name: 'Minimalist Desk Organizer',
    price: 48.00,
    category: 'Home & Living',
    description: 'Solid walnut desk organizer with compartments for pens, phone, cards, and small items. Clean lines and natural wood grain keep your workspace tidy and elegant.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 14,
    name: 'Indoor Herb Garden Kit',
    price: 55.00,
    category: 'Home & Living',
    description: 'Self-watering planter with grow light, organic soil pods, and seeds for basil, mint, and cilantro. Fresh herbs year-round with minimal effort.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop&q=80',
  },

  // Accessories
  {
    id: 15,
    name: 'Leather Bifold Wallet',
    price: 75.00,
    category: 'Accessories',
    description: 'Full-grain vegetable-tanned leather wallet with RFID blocking. Six card slots, two bill compartments, and a slim profile that fits comfortably in any pocket.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 16,
    name: 'Polarized Sunglasses',
    price: 125.00,
    category: 'Accessories',
    description: 'Classic acetate frames with polarized lenses that reduce glare and protect against UV rays. Lightweight, durable, and flattering on every face shape.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 17,
    name: 'Canvas Weekender Bag',
    price: 110.00,
    category: 'Accessories',
    description: 'Waxed canvas duffle with leather handles and detachable shoulder strap. Separate shoe compartment. The perfect companion for two-day getaways.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&q=80',
  },
  {
    id: 18,
    name: 'Stainless Steel Water Bottle',
    price: 38.00,
    category: 'Accessories',
    description: 'Double-walled vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12. Leak-proof lid, powder-coated finish, and a 750ml capacity.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&q=80',
  },
];

export const categories = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661"
  },
  {
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050"
  },
  {
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
  }
];
