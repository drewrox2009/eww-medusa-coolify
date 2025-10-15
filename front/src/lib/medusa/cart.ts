import { medusa } from "./client";

export async function createCart() {
  return medusa.store.cart.create({});
}

export async function getCart(cartId: string) {
  return medusa.store.cart.retrieve(cartId);
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
) {
  return medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  return medusa.store.cart.updateLineItem(cartId, lineItemId, { quantity });
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  return medusa.store.cart.deleteLineItem(cartId, lineItemId);
}

export async function completeCart(cartId: string) {
  return medusa.store.cart.complete(cartId);
}
