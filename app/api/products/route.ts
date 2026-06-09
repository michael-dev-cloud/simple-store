// Revalidate every 60 seconds
export const revalidate = 60;

async function getPrisma() {
  try {
    const mod = await import('../../lib/prisma-client');
    return mod.getPrisma ? await mod.getPrisma() : mod.default || null;
  } catch (error) {
    console.error('Prisma lazy-load error:', error);
    return null;
  }
}

export async function GET() {
  try {
    const prisma = await getPrisma();

    if (!prisma) {
      console.warn('Prisma client unavailable; returning empty products list during build.');
      return Response.json([]);
    }

    let products = await prisma.product.findMany({
      include: {
        colors: true,
      },
    });

    // Seed initial data if database is empty or contains only the template product
    if (products.length <= 1) {
      // Clear existing records to start clean
      await prisma.color.deleteMany();
      await prisma.product.deleteMany();

      const seedProducts = [
        {
          name: "Classic Minimal Tee",
          description: "Cut from 240gsm long-staple organic cotton. A standard draped fit with a dense rib collar. Designed for daily rotation.",
          price: 35.00,
          image: "/images/classic-black.png",
          colors: {
            create: [
              { name: "Black", hex: "#000000", image: "/images/classic-black.png" },
              { name: "White", hex: "#FFFFFF", image: "/images/classic-white.png" },
              { name: "Grey", hex: "#8E8E93", image: "/images/classic-grey.png" },
              { name: "Navy", hex: "#1D2A44", image: "/images/classic-navy.png" },
              { name: "Beige", hex: "#D2C4B1", image: "/images/classic-beige.png" },
            ],
          },
        },
        {
          name: "Oversized Boxy Tee",
          description: "Crafted from 300gsm double-knit cotton jersey. Drop shoulder silhouette with a relaxed boxy cut. Pre-shrunk for the perfect fit.",
          price: 45.00,
          image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop",
          colors: {
            create: [
              { name: "Black", hex: "#000000", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop" },
              { name: "White", hex: "#FFFFFF", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop" },
              { name: "Beige", hex: "#D2C4B1", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop" },
              { name: "Grey", hex: "#8E8E93", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop" },
            ],
          },
        },
        {
          name: "Antigravity Graphic Tee",
          description: "Featuring our signature seasonal typographic screen-print. 220gsm mid-weight cotton with a high-definition print finish.",
          price: 50.00,
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop",
          colors: {
            create: [
              { name: "Black", hex: "#000000", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop" },
              { name: "White", hex: "#FFFFFF", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop" },
            ],
          },
        },
        {
          name: "Signature Embroidered Tee",
          description: "Limited edition piece with micro-embellished branding. Heavyweight combed cotton, custom boxy fit with clean double-needle hems.",
          price: 60.00,
          image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop",
          colors: {
            create: [
              { name: "Beige", hex: "#D2C4B1", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop" },
              { name: "Black", hex: "#000000", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop" },
              { name: "White", hex: "#FFFFFF", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop" },
            ],
          },
        },
      ];

      for (const p of seedProducts) {
        await prisma.product.create({
          data: p,
        });
      }

      // Re-fetch seeded products
      products = await prisma.product.findMany({
        include: {
          colors: true,
        },
      });
    }

    return Response.json(products);
  } catch (error) {
    console.error("Products error:", error);
    return Response.json(
      { error: "Failed to fetch products", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const prisma = await getPrisma();

    if (!prisma) {
      return Response.json({ error: 'Prisma client unavailable' }, { status: 500 });
    }

    const body = await req.json();
    const { name, description, price, image, colors } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        colors: {
          create: colors,
        },
      },
      include: { colors: true },
    });

    return Response.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}