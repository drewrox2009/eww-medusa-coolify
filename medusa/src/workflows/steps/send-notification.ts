import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateNotificationDTO } from "@medusajs/framework/types";

export const sendNotificationStep = createStep(
  "send-notification",
  async (data: CreateNotificationDTO[], { container }) => {
    console.log(
      "sendNotificationStep called with data:",
      JSON.stringify(data, null, 2)
    );

    const notificationModuleService = container.resolve(Modules.NOTIFICATION);

    console.log("Resolved notification module service");

    const notification = await notificationModuleService.createNotifications(
      data
    );

    console.log(
      "createNotifications completed with result:",
      JSON.stringify(notification, null, 2)
    );

    return new StepResponse(notification);
  }
);
