import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { sendInviteNotificationWorkflow } from "../workflows/send-invite-notification";

export default async function inviteResentHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await sendInviteNotificationWorkflow(container).run({
    input: {
      id: data.id,
    },
  });
}

export const config: SubscriberConfig = {
  event: "invite.resent",
};
