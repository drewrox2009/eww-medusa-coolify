import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.sendStatus(200);
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { action, cartId, paymentId } = req.body;

  try {
    if (action === "complete_payment") {
      // Get cart and complete it
      const cartService = req.scope.resolve("cartService");
      const orderService = req.scope.resolve("orderService");

      // Complete the cart to create an order
      const order = await cartService.complete(cartId);

      res.json({
        success: true,
        order: {
          id: order.id,
          status: order.status,
        }
      });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Payment completion error:", error);
    res.status(500).json({
      error: "Failed to complete payment",
      details: error.message
    });
  }
}
