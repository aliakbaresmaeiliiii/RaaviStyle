import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function phoneAuthOtpGeneratedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ phone: string; otp: string }>) {
  if (process.env.NODE_ENV === "production") {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  logger.info(`OTP code: ${data.otp}`)
}

export const config: SubscriberConfig = {
  event: "phone-auth.otp.generated",
}
