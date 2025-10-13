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

type TemplateRenderer = (data: unknown) => ReactNode;

/**
 * Built-in template registry. Populate this object with React renderers or
 * pre-compiled HTML strings (as needed) to make them available without
 * additional configuration. Consumers can also provide templates at runtime
 * through the provider options.
 */
const builtinTemplates: Record<string, TemplateRenderer | string> = {};

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

    const to = this.coerceStringArray(notification.to);
    const cc = this.coerceStringArray(notification.data?.cc);
    const bcc = this.coerceStringArray(notification.data?.bcc);

    if (!to.length) {
      this.logger.error("Resend notification requires a recipient (`to`).");
      return null;
    }

    const subject =
      notification.data?.subject ??
      (templateKey ? this.getTemplateSubject(templateKey) : undefined) ??
      "Notification";

    const baseOptions: CreateEmailOptions = {
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

    if (notification.data?.reply_to || notification.data?.replyTo) {
      baseOptions.reply_to =
        notification.data.reply_to ?? notification.data.replyTo;
    }

    if (notification.data?.attachments) {
      baseOptions.attachments = notification.data
        .attachments as CreateEmailOptions["attachments"];
    }

    if (typeof template === "string") {
      return {
        ...baseOptions,
        html: template,
      };
    }

    if (typeof template === "function") {
      return {
        ...baseOptions,
        react: template(notification.data),
      };
    }

    if (notification.data?.html) {
      return {
        ...baseOptions,
        html: notification.data.html,
      };
    }

    if (notification.data?.react) {
      return {
        ...baseOptions,
        react: notification.data.react,
      };
    }

    if (notification.data?.text) {
      return {
        ...baseOptions,
        text: notification.data.text,
      };
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
      return value.filter(
        (entry): entry is string => typeof entry === "string" && !!entry
      );
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return [value];
    }

    return [];
  }
}

export default ResendNotificationProviderService;
