const path = require('path');

// Load the Prisma singleton we added for runtime
const prisma = require(path.resolve(__dirname, '..', 'app', 'lib', 'prisma-client.js'));

async function main() {
  console.log('Clearing existing colors and products...');
  await prisma.color.deleteMany();
  await prisma.product.deleteMany();

  const seedProducts = [
    {
      name: 'Classic Minimal Tee',
      description:
        'Cut from 240gsm long-staple organic cotton. A standard draped fit with a dense rib collar. Designed for daily rotation.',
      price: 35.0,
      image: '/images/classic-black.png',
      colors: [
        { name: 'Black', hex: '#000000', image: '/images/classic-black.png' },
        { name: 'White', hex: '#FFFFFF', image: '/images/classic-white.png' },
        { name: 'Grey', hex: '#8E8E93', image: '/images/classic-grey.png' },
      ],
    },
    {
      name: 'Oversized Boxy Tee',
      description:
        'Crafted from 300gsm double-knit cotton jersey. Drop shoulder silhouette with a relaxed boxy cut. Pre-shrunk for the perfect fit.',
      price: 45.0,
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop',
      colors: [
        { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop' },
        { name: 'White', hex: '#FFFFFF', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop' },
      ],
    },
    {
      name: 'Signature Embroidered Tee',
      description:
        'Limited edition piece with micro-embellished branding. Heavyweight combed cotton, custom boxy fit with clean double-needle hems.',
      price: 60.0,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop',
      colors: [
        { name: 'Beige', hex: '#D2C4B1', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop' },
        { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop' },
      ],
    },
  ];

  for (const p of seedProducts) {
    console.log('Creating product:', p.name);
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        colors: {
          create: p.colors,
        },
      },
    });
  }

  const count = await prisma.product.count();
  console.log(`Seed complete. Products in DB: ${count}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
