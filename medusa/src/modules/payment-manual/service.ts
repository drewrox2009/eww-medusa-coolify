import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/framework/types";

type Options = {
  name?: string;
};

type InjectedDependencies = {
  logger: Logger;
};

class ManualPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "manual";
  protected logger_: Logger;
  protected options_: Options;

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);
    this.logger_ = container.logger;
    this.options_ = options;
  }

  async initiatePayment(input: any): Promise<any> {
    const { amount, currency_code, context } = input;

    return {
      id: `manual_${Date.now()}`,
      data: {
        amount,
        currency_code,
        status: "pending",
        ...context,
      },
    };
  }

  async updatePayment(input: any): Promise<any> {
    const { amount, currency_code, data } = input;

    return {
      data: {
        ...data,
        amount,
        currency_code,
      },
    };
  }

  async authorizePayment(input: any): Promise<any> {
    return {
      status: "authorized",
      data: {
        ...input.data,
        status: "authorized",
      },
    };
  }

  async capturePayment(input: any): Promise<any> {
    const externalId = input.data?.id;

    return {
      data: {
        ...input.data,
        id: externalId,
        status: "captured",
      },
    };
  }

  async cancelPayment(input: any): Promise<any> {
    return {
      data: {
        ...input.data,
        status: "canceled",
      },
    };
  }

  async deletePayment(input: any): Promise<any> {
    return {
      data: {
        ...input.data,
        status: "deleted",
      },
    };
  }

  async refundPayment(input: any): Promise<any> {
    return {
      data: {
        ...input.data,
        status: "refunded",
        refund_amount: input.amount,
      },
    };
  }

  async retrievePayment(input: any): Promise<any> {
    return {
      id: input.data?.id || "",
      data: input.data || {},
    };
  }

  async getPaymentStatus(input: any): Promise<any> {
    const status = input.data?.status as string;

    switch (status) {
      case "authorized":
        return { status: "authorized" };
      case "captured":
        return { status: "captured" };
      case "canceled":
        return { status: "canceled" };
      default:
        return { status: "pending" };
    }
  }
}

export default ManualPaymentProviderService;