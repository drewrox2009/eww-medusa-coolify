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
  const { action, cartId } = req.body as { action: string; cartId: string };

  try {
    if (action === "complete_cart") {
      // Use the container to resolve services
      const cartModuleService = req.scope.resolve("cartModuleService");
      const paymentModuleService = req.scope.resolve("paymentModuleService");
      
      // Get the cart to retrieve total amount
      const cart = await cartModuleService.retrieveCarts(
        { id: cartId },
        { relations: ["items"] }
      );
      
      if (!cart || cart.length === 0) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      const cartData = cart[0];
      
      // Create a payment collection for the cart
      const paymentCollection = await paymentModuleService.createPaymentCollections({
        cart_id: cartId,
        amount: cartData.total,
        currency_code: cartData.currency_code
      });

      // Create a payment session with the manual provider
      const paymentSession = await paymentModuleService.createPaymentSessions({
        payment_collection_id: paymentCollection.id,
        provider_id: "manual",
        data: {}
      });

      // Authorize the payment
      await paymentModuleService.authorizePaymentSession({
        payment_id: paymentSession.id,
        context: {}
      });

      // Capture the payment
      await paymentModuleService.capturePayment({
        payment_id: paymentSession.id,
        amount: paymentCollection.amount
      });

      // Complete the cart
      const order = await cartModuleService.completeCart(cartId);

      res.json({
        success: true,
        order: order,
      });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Cart completion error:", error);
    res.status(500).json({
      error: "Failed to complete cart",
      details: (error as Error).message
    });
  }
}
