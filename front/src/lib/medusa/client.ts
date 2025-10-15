import Medusa from "@medusajs/js-sdk";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export type MedusaClient = typeof medusa;
