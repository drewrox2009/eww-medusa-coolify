import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { sendInviteNotificationWorkflow } from "../workflows/send-invite-notification";

export default async function inviteResentHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log(
    "inviteResentHandler called with data:",
    JSON.stringify(data, null, 2)
  );
  try {
    const result = await sendInviteNotificationWorkflow(container).run({
      input: {
        id: data.id,
      },
    });
    console.log("inviteResentHandler completed successfully:", result);
  } catch (error) {
    console.error("inviteResentHandler failed:", error);
    throw error;
  }
}

export const config: SubscriberConfig = {
  event: "invite.resent",
};
