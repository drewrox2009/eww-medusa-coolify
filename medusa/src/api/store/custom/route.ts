import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";

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
      // Use the proper Medusa workflow to complete the cart
      const { result } = await completeCartWorkflow(req.scope).run({
        input: {
          id: cartId
        }
      });

      res.json({
        success: true,
        order: (result as any).order || result,
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
