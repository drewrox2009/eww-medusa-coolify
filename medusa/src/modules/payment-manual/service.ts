import {
  AbstractPaymentProvider,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types";
import { MedusaError } from "@medusajs/framework/utils";

class ManualPaymentProviderService extends AbstractPaymentProvider {
  static identifier = "manual";

  async initiatePayment(
    context: any
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, currency_code, context: paymentContext } = context;

    return {
      data: {
        id: `manual_${Date.now()}`,
        amount,
        currency_code,
        status: "pending",
        ...paymentContext,
      },
    };
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    PaymentProviderError | {
      status: PaymentSessionStatus;
      data: PaymentProviderSessionResponse["data"];
    }
  > {
    return {
      status: "authorized" as PaymentSessionStatus,
      data: {
        ...paymentSessionData,
        status: "authorized",
      },
    };
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["data"]
  > {
    return {
      ...paymentSessionData,
      status: "canceled",
    };
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["data"]
  > {
    return {
      ...paymentSessionData,
      status: "captured",
    };
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["data"]
  > {
    return {
      ...paymentSessionData,
      status: "deleted",
    };
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    return (paymentSessionData.status as PaymentSessionStatus) || "pending";
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["data"]
  > {
    return {
      ...paymentSessionData,
      status: "refunded",
      refund_amount: refundAmount,
    };
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["data"]
  > {
    return paymentSessionData;
  }

  async updatePayment(
    context: any
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, currency_code, data } = context;

    return {
      data: {
        ...data,
        amount,
        currency_code,
      },
    };
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    return {
      action: "not_supported",
    };
  }
}

export default ManualPaymentProviderService;