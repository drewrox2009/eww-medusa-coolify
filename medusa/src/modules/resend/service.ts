import { Resend, type CreateEmailOptions } from "resend";
import type {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types";
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import type { ReactNode } from "react";

type ResendHtmlTemplate = {
  subject?: string;
  content: string;
};

type ResendOptions = {
  api_key: string;
  from: string;
  channels?: string[];
  html_templates?: Record<string, ResendHtmlTemplate>;
};

type TemplateRenderer = (data: Record<string, unknown>) => ReactNode;

/**
 * Built-in template registry. Populate this object with React renderers or
 * pre-compiled HTML strings (as needed) to make them available without
 * additional configuration. Consumers can also provide templates at runtime
 * through the provider options.
 */
const builtinTemplates: Record<string, TemplateRenderer | string> = {
  "order-placed": `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p>Order ID: {{order.display_id}}</p>
    <p>Total: {{order.total}} {{order.currency_code}}</p>
  `,
  "user-invited": `
    <h1>You've been invited!</h1>
    <p>You have been invited to join our platform.</p>
    <p>Please use the following link to accept your invitation:</p>
    <a href="https://medusa.eww-pew.com/app/invite?token={{invite.token}}">Accept Invitation</a>
  `,
};

type InjectedDependencies = {
  logger: Logger;
};

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend";

  private resendClient: Resend;
  private options: Required<Pick<ResendOptions, "channels">> & ResendOptions;
  private logger: Logger;

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super();

    ResendNotificationProviderService.validateOptions(options);

    this.resendClient = new Resend(options.api_key);
    this.options = {
      channels: options.channels?.length ? options.channels : ["email"],
      ...options,
    };
    this.logger = logger;
  }

  static validateOptions(options: Partial<ResendOptions>): void {
    if (!options?.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend provider option `api_key` is required."
      );
    }

    if (!options?.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend provider option `from` is required."
      );
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    this.logger.info(
      `Attempting to send notification via Resend: ${JSON.stringify(
        notification
      )}`
    );

    if (!this.canSend(notification.channel)) {
      this.logger.warn(
        `Skipping notification because channel '${notification.channel}' is not enabled for Resend`
      );
      return {};
    }

    const emailOptions = this.buildEmailOptions(notification);

    if (!emailOptions) {
      this.logger.error(
        `Unable to send notification via Resend because no template or content was resolved for '${
          notification.template ?? "unknown"
        }'`
      );
      return {};
    }

    this.logger.info(
      `Sending email with options: ${JSON.stringify(emailOptions)}`
    );

    try {
      const { data, error } = await this.resendClient.emails.send(emailOptions);

      if (error || !data) {
        if (error) {
          this.logger.error("Failed to send email through Resend", error);
        } else {
          this.logger.error(
            "Failed to send email through Resend: unknown error"
          );
        }
        return {};
      }

      this.logger.info(`Email sent successfully with ID: ${data.id}`);
      return { id: data.id };
    } catch (error) {
      this.logger.error(
        "Unexpected error while sending email through Resend",
        error as Error
      );
      return {};
    }
  }

  async resend(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    return this.send(notification);
  }

  private canSend(channel?: string | null): boolean {
    if (!channel) {
      return this.options.channels.includes("email");
    }

    return this.options.channels.includes(channel);
  }

  private buildEmailOptions(
    notification: ProviderSendNotificationDTO
  ): CreateEmailOptions | null {
    const templateKey = notification.template as string | undefined;
    const template = templateKey ? this.getTemplate(templateKey) : null;
    const data = (notification.data ?? {}) as Record<string, unknown>;

    const to = this.coerceStringArray(notification.to);
    const cc = this.coerceStringArray(data.cc);
    const bcc = this.coerceStringArray(data.bcc);

    if (!to.length) {
      this.logger.error("Resend notification requires a recipient (`to`).");
      return null;
    }

    const subject =
      this.resolveString(data.subject) ??
      (templateKey ? this.getTemplateSubject(templateKey) : undefined) ??
      "Notification";

    const baseOptions: Partial<CreateEmailOptions> & {
      from: string;
      to: string[];
      subject: string;
    } = {
      from: this.options.from,
      to,
      subject,
    };

    if (cc.length) {
      baseOptions.cc = cc;
    }

    if (bcc.length) {
      baseOptions.bcc = bcc;
    }

    const replyTo = this.coerceReplyTo(data);
    if (replyTo) {
      baseOptions.replyTo = replyTo;
    }

    const attachments = this.resolveAttachments(data.attachments);
    if (attachments) {
      baseOptions.attachments = attachments;
    }

    if (typeof template === "string") {
      // Simple template replacement for basic variables
      let html = template;
      if (data.order) {
        const order = data.order as any;
        html = html.replace(
          /\{\{order\.display_id\}\}/g,
          order.display_id || ""
        );
        html = html.replace(/\{\{order\.total\}\}/g, order.total || "");
        html = html.replace(
          /\{\{order\.currency_code\}\}/g,
          order.currency_code || ""
        );
      }
      if (data.invite) {
        const invite = data.invite as any;
        html = html.replace(/\{\{invite\.token\}\}/g, invite.token || "");
      }
      return {
        ...baseOptions,
        html,
      } as CreateEmailOptions;
    }

    if (typeof template === "function") {
      try {
        return {
          ...baseOptions,
          react: template(data),
        } as CreateEmailOptions;
      } catch (error) {
        this.logger.error(
          `Failed to render React template '${templateKey}':`,
          error
        );
        return null;
      }
    }

    const html = this.resolveString(data.html);
    if (html) {
      return {
        ...baseOptions,
        html,
      } as CreateEmailOptions;
    }

    const react = this.resolveReactNode(data.react);
    if (react) {
      return {
        ...baseOptions,
        react,
      } as CreateEmailOptions;
    }

    const text = this.resolveString(data.text);
    if (text) {
      return {
        ...baseOptions,
        text,
      } as CreateEmailOptions;
    }

    return null;
  }

  private getTemplate(template: string): TemplateRenderer | string | null {
    if (this.options.html_templates?.[template]) {
      return this.options.html_templates[template].content;
    }

    if (builtinTemplates[template]) {
      return builtinTemplates[template];
    }

    return null;
  }

  private getTemplateSubject(template: string): string | undefined {
    if (this.options.html_templates?.[template]?.subject) {
      return this.options.html_templates[template].subject;
    }

    return undefined;
  }

  private coerceStringArray(value: unknown): string[] {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value
        .map((entry) => this.resolveString(entry))
        .filter((entry): entry is string => typeof entry === "string");
    }

    const single = this.resolveString(value);
    return single ? [single] : [];
  }

  private coerceReplyTo(
    value: Record<string, unknown>
  ): CreateEmailOptions["replyTo"] | undefined {
    const replyTo =
      this.resolveString(value.reply_to) ?? this.resolveString(value.replyTo);
    const replyToList = this.coerceStringArray(value.reply_to ?? value.replyTo);

    if (replyToList.length > 0) {
      return replyToList;
    }

    return replyTo ?? undefined;
  }

  private resolveString(value: unknown): string | undefined {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : undefined;
    }

    return undefined;
  }

  private resolveReactNode(value: unknown): ReactNode | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    return value as ReactNode;
  }

  private resolveAttachments(
    value: unknown
  ): CreateEmailOptions["attachments"] | undefined {
    if (!Array.isArray(value)) {
      return undefined;
    }

    return value as CreateEmailOptions["attachments"];
  }
}

export default ResendNotificationProviderService;
