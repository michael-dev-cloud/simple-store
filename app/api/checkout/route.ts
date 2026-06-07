import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-15",
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email } = body;

    if (!items || items.length === 0) {
      return Response.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.productName} - ${item.color}`,
          image: item.image,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: email,
      metadata: {
        items: JSON.stringify(items),
      },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Create order in database
      const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      
      const order = await prisma.order.create({
        data: {
          email: session.customer_email || "",
          total: (session.amount_total || 0) / 100,
          stripeId: session.id,
          status: "completed",
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return Response.json(order);
    }

    return Response.json({ error: "Payment not completed" }, { status: 400 });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return Response.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}