# T-Shirt Store - Complete Next.js E-Commerce Application

## Features Implemented

✅ **Product Catalog**
- Display t-shirts with color variants
- Color preview with hex codes
- Product details page with color selection
- Add to cart functionality

✅ **Shopping Cart**
- Add/remove items
- Adjust quantities
- Real-time price calculation
- Color selection for each item

✅ **Checkout with Stripe**
- Secure payment processing with Stripe API
- Demo Stripe keys configured
- Order confirmation page
- Email-based order tracking

✅ **Admin Panel**
- Add new products
- Manage product colors
- Set pricing and descriptions
- Upload product images

✅ **Database**
- PostgreSQL with Neon
- Prisma ORM
- Product, Color, Order, and OrderItem models

## Project Structure

```
my-app/
├── app/
│   ├── page.tsx                 # Home / Product listing
│   ├── product/[id]/page.tsx    # Product detail page
│   ├── cart/page.tsx            # Shopping cart
│   ├── success/page.tsx         # Order confirmation
│   ├── admin/
│   │   └── products/page.tsx    # Admin product management
│   ├── api/
│   │   ├── products/route.ts    # Product API (GET/POST)
│   │   └── checkout/route.ts    # Stripe checkout API
│   ├── store/
│   │   └── useCartStore.ts      # Zustand cart store
│   └── layout.tsx               # Root layout
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript config
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

The `.env` file is already configured with:
- Database URL (Neon PostgreSQL)
- Stripe demo keys
- NextAuth settings

### 3. Database Migration

```bash
npx prisma migrate dev --name init
```

This will create all necessary tables (Product, Color, Order, OrderItem).

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Default Demo Data

When you visit the products page for the first time, a demo t-shirt product is automatically created with 8 color options:
- Black, White, Red, Blue, Green, Gray, Navy, Yellow

## Pages & Routes

### Public Pages
- **`/`** - Product listing page
- **`/product/[id]`** - Product detail with color selection
- **`/cart`** - Shopping cart
- **`/success`** - Order confirmation (after Stripe checkout)

### Admin Pages
- **`/admin/products`** - Add new products with colors

### API Routes
- **`GET /api/products`** - Fetch all products (with auto-seed)
- **`POST /api/products`** - Create new product
- **`POST /api/checkout`** - Create Stripe checkout session
- **`GET /api/checkout`** - Verify payment and create order

## Testing the Checkout

### Stripe Demo Credentials

Use the following test card numbers in Stripe checkout:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: `12/26`
- CVC: `123`

**Test Payment Failed:**
- Card Number: `4000 0000 0000 0002`
- Expiry: `12/26`
- CVC: `123`

## Key Features & Code

### Cart Management (Zustand)
```typescript
const { addItem, removeItem, updateQuantity, getTotalPrice } = useCart();
```

### Product with Colors
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  colors: Color[];
}
```

### Stripe Integration
- Secure payment processing
- Session-based checkout
- Order confirmation with email
- Payment status tracking

## Customization

### Add More Products
1. Go to `/admin/products`
2. Fill in product details
3. Add available colors
4. Submit to save

### Change Stripe Keys
Update in `.env`:
```env
STRIPE_SECRET_KEY=your_secret_key
NEXT_PUBLIC_STRIPE_KEY=your_publishable_key
```

### Modify Product Seed Data
Edit `/app/api/products/route.ts` to change the default product that's created.

## Dependencies

- **Next.js 16** - React framework
- **Prisma 7** - ORM
- **Stripe** - Payment processing
- **Zustand 5** - State management
- **Tailwind CSS 4** - Styling
- **React Hook Form 7** - Form handling
- **Zod 4** - Schema validation
- **PostgreSQL** - Database (via Neon)

## Development Tips

### Database
- View database: `npx prisma studio`
- Reset database: `npx prisma migrate reset`
- Create backup: Use Neon dashboard

### Debugging
- Check browser console for client errors
- Use Prisma Studio to inspect database
- Review `/api` responses in Network tab
- Check Next.js terminal for server errors

## Production Deployment

Before deploying to production:

1. Update Stripe keys to live keys
2. Set real domain for `NEXTAUTH_URL`
3. Configure CORS for your domain
4. Set strong `NEXTAUTH_SECRET`
5. Review security headers in `next.config.ts`
6. Enable HTTPS

## Support & Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL in .env
- Check Neon dashboard for connection limits
- Ensure firewall allows connections

### Stripe Checkout Not Working
- Verify API keys in .env
- Check Stripe dashboard for errors
- Use test mode credentials

### Cart Not Persisting
- Zustand stores in memory only
- Consider adding localStorage persistence
- Use NextAuth for user-specific carts

## Future Enhancements

- [ ] User authentication & accounts
- [ ] Order history
- [ ] Email notifications
- [ ] Inventory management
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Coupon/discount codes
- [ ] Multiple product types
- [ ] Size selection
- [ ] Payment methods (PayPal, Apple Pay)

---

**Ready to deploy your t-shirt store!** 🎉
