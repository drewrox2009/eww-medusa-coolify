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
    console.log("sendInviteNotificationWorkflow started with id:", id);

    const { data: invites } = useQueryGraphStep({
      entity: "invite",
      fields: ["id", "email", "token"],
      filters: {
        id,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    });

    console.log("Retrieved invites:", JSON.stringify(invites, null, 2));

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

    console.log("Notification step completed");
    return new WorkflowResponse(notification);
  }
);
