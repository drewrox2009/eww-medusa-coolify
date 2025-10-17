import { medusa } from "./client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function createCheckoutSession(cartId: string) {
  try {
    // Get cart details
    const cart = await medusa.store.cart.retrieve(cartId);

    // Create checkout session (this would typically be handled by Medusa's checkout flow)
    // For now, we'll return the cart data
    return {
      cart,
      sessionId: `checkout_${cartId}_${Date.now()}`,
      paymentMethods: [
        {
          id: "btcpay",
          name: "Bitcoin/Lightning (BTCPay)",
          description: "Pay with Bitcoin or Lightning Network",
          logo: "/images/payments/btcpay.png",
        },
        {
          id: "solana",
          name: "Solana (SPL Tokens)",
          description: "Pay with Solana and SPL tokens",
          logo: "/images/payments/solana.png",
        },
        {
          id: "shkeeper",
          name: "Shkeeper",
          description: "Multi-currency crypto payments",
          logo: "/images/payments/shkeeper.png",
        },
        {
          id: "nowpayments",
          name: "NowPayments",
          description: "100+ cryptocurrencies supported",
          logo: "/images/payments/nowpayments.png",
        },
      ],
    };
  } catch (error) {
    console.error("Create checkout session error:", error);
    throw error;
  }
}

export async function updateShippingAddress(
  cartId: string,
  address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    province?: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  }
) {
  try {
    return await medusa.store.cart.update(cartId, {
      shipping_address: address,
      billing_address: address, // Same as shipping for simplicity
    });
  } catch (error) {
    console.error("Update shipping address error:", error);
    throw error;
  }
}

export async function selectShippingOption(cartId: string, optionId: string) {
  try {
    // Use HTTP endpoint to add/select shipping method (avoids SDK type mismatch)
    const res = await fetch(
      `${BACKEND_URL}/store/carts/${cartId}/shipping-methods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        credentials: "include",
        // Support both Medusa API shapes
        body: JSON.stringify({
          option_id: optionId,
          shipping_option_id: optionId,
        }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body.message || `Failed to set shipping option (${res.status})`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Select shipping option error:", error);
    throw error;
  }
}

export async function createPaymentSession(cartId: string, providerId: string) {
  try {
    // Create payment sessions on backend (Medusa) via HTTP (SDK doesn't expose this method)
    const res = await fetch(
      `${BACKEND_URL}/store/carts/${cartId}/payment-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        credentials: "include",
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body.message || `Failed to create payment sessions (${res.status})`
      );
    }

    const data = await res.json();

    // Return a lightweight session descriptor to drive UI
    const amount = data?.cart?.total ?? data?.cart?.subtotal ?? 0;
    const currency = data?.cart?.currency_code ?? "USD";

    return {
      id: `payment_${cartId}_${Date.now()}`,
      provider_id: providerId,
      status: "pending",
      payment_url: `https://payment.example.com/${providerId}/${cartId}`,
      amount,
      currency,
    };
  } catch (error) {
    console.error("Create payment session error:", error);
    throw error;
  }
}

export async function createPaymentSessions(cartId: string) {
  try {
    // Use HTTP call because the JS SDK doesn't expose createPaymentSessions()
    const res = await fetch(
      `${BACKEND_URL}/store/carts/${cartId}/payment-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        credentials: "include",
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body.message || `Failed to create payment sessions (${res.status})`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Create payment sessions error:", error);
    throw error;
  }
}

export async function completeOrder(cartId: string) {
  try {
    // Use HTTP call to avoid SDK surface differences across versions
    const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Failed to complete cart (${res.status})`);
    }

    const result = await res.json();

    if (result?.type === "order" && result.order) {
      return {
        order: result.order,
        orderId: result.order.id,
        status: "completed",
        confirmationNumber: `ORD-${result.order.id.slice(-8).toUpperCase()}`,
      };
    } else if (result?.order) {
      // Some Medusa responses may not include 'type'
      return {
        order: result.order,
        orderId: result.order.id,
        status: "completed",
        confirmationNumber: `ORD-${result.order.id.slice(-8).toUpperCase()}`,
      };
    } else if (result?.type === "cart" && result.cart) {
      // Error path
      throw new Error(result.error?.message || "Failed to complete order");
    } else {
      throw new Error("Unexpected response from order completion");
    }
  } catch (error) {
    console.error("Complete order error:", error);
    throw error;
  }
}


export async function getOrder(orderId: string) {
  try {
    return await medusa.store.order.retrieve(orderId);
  } catch (error) {
    console.error("Get order error:", error);
    throw error;
  }
}

export async function getCustomerOrders(
  customerId: string,
  limit = 20,
  offset = 0
) {
  try {
    // The Store API returns the authenticated customer's orders; explicit customer_id isn't required
    return await medusa.store.order.list({
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get customer orders error:", error);
    throw error;
  }
}

export async function initManualPayment(cartId: string) {
  try {
    // Ensure sessions exist
    await createPaymentSessions(cartId);
    // Select the manual provider as the active session
    await selectManualPaymentSession(cartId);
    // Authorize the manual payment session so the cart can be completed
    await authorizeManualPayment(cartId);
  } catch (error) {
    console.error("Init manual payment error:", error);
    throw error;
  }
}

export async function selectManualPaymentSession(cartId: string) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/carts/${cartId}/payment-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        credentials: "include",
        body: JSON.stringify({ provider_id: "manual" }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body.message ||
          `Failed to select manual payment session (${res.status})`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Select manual payment session error:", error);
    throw error;
  }
}

export async function authorizeManualPayment(cartId: string) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/carts/${cartId}/payment-session/manual/authorize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        credentials: "include",
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body.message || `Failed to authorize manual payment (${res.status})`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Authorize manual payment error:", error);
    throw error;
  }
}
