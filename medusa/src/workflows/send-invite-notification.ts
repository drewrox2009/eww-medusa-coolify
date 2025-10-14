import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { sendNotificationStep } from "./steps/send-notification";

type WorkflowInput = {
  id: string;
};

export const sendInviteNotificationWorkflow = createWorkflow(
  "send-invite-notification",
  ({ id }: WorkflowInput) => {
    const { data: invites } = useQueryGraphStep({
      entity: "invite",
      fields: ["id", "email", "token", "user.*", "role.*"],
      filters: {
        id,
      },
    });

    const notification = sendNotificationStep([
      {
        to: invites[0].email,
        channel: "email",
        template: "user-invited",
        data: {
          invite: invites[0],
        },
      },
    ]);

    return new WorkflowResponse(notification);
  }
);
