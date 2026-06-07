import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Revalidate every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        colors: true,
      },
    });

    if (products.length === 0) {
      // Seed initial data
      const product = await prisma.product.create({
        data: {
          name: "Premium T-Shirt",
          description: "High-quality 100% cotton t-shirt, perfect for everyday wear",
          price: 29.99,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
          colors: {
            create: [
              { name: "Black", hex: "#000000" },
              { name: "White", hex: "#FFFFFF" },
              { name: "Red", hex: "#FF0000" },
              { name: "Blue", hex: "#0000FF" },
              { name: "Green", hex: "#00AA00" },
              { name: "Gray", hex: "#808080" },
              { name: "Navy", hex: "#000080" },
              { name: "Yellow", hex: "#FFFF00" },
            ],
          },
        },
        include: { colors: true },
      });
      return Response.json([product]);
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