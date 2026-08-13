import { randomInt } from "crypto"
import {
  AbstractAuthModuleProvider,
  AbstractEventBusModuleService,
  MedusaError,
} from "@medusajs/framework/utils"
import type {
  AuthIdentityProviderService,
  AuthenticationInput,
  AuthenticationResponse,
  Logger,
} from "@medusajs/framework/types"
import jwt from "jsonwebtoken"
import { normalizePhone } from "./phone"

type InjectedDependencies = {
  logger: Logger
  event_bus: AbstractEventBusModuleService
}

type Options = {
  jwtSecret: string
}

type OtpPayload = {
  otp: string
}

const OTP_LENGTH = 6
const OTP_TTL = "5m"

class PhoneAuthService extends AbstractAuthModuleProvider {
  static DISPLAY_NAME = "ورود با موبایل"
  static identifier = "phone-auth"

  private options: Options
  private logger: Logger
  private eventBus: AbstractEventBusModuleService

  constructor(container: InjectedDependencies, options: Options) {
    // @ts-expect-error Auth providers receive container + options via super
    super(...arguments)

    this.options = options
    this.logger = container.logger
    this.eventBus = container.event_bus
  }

  static validateOptions(options: Record<string, unknown>): void | never {
    if (!options.jwtSecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "JWT secret is required"
      )
    }
  }

  async register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const phone = this.readPhone(data)

    if (!phone) {
      return {
        success: false,
        error: "شماره موبایل معتبر لازم است",
      }
    }

    try {
      await authIdentityProviderService.retrieve({
        entity_id: phone,
      })

      return {
        success: false,
        error: "کاربری با این شماره موبایل از قبل وجود دارد",
      }
    } catch {
      const user = await authIdentityProviderService.create({
        entity_id: phone,
      })

      return {
        success: true,
        authIdentity: user,
      }
    }
  }

  async authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const phone = this.readPhone(data)
    if (!phone) {
      return {
        success: false,
        error: "شماره موبایل معتبر لازم است",
      }
    }

    try {
      await authIdentityProviderService.retrieve({
        entity_id: phone,
      })
    } catch {
      return {
        success: false,
        error: "کاربری با این شماره موبایل یافت نشد",
      }
    }

    const { hashedOTP, otp } = this.generateOTP()

    await authIdentityProviderService.update(phone, {
      provider_metadata: {
        otp: hashedOTP,
      },
    })

    await this.eventBus.emit(
      {
        name: "phone-auth.otp.generated",
        data: {
          otp,
          phone,
        },
      },
      {}
    )

    this.logger.info(`OTP code (6 digits): ${otp}`)

    return {
      success: true,
      location: process.env.NODE_ENV === "production" ? "otp" : otp,
    }
  }

  async validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const phone = this.readPhone(data)
    const otp = this.readOtp(data)

    if (!phone || !otp) {
      return {
        success: false,
        error: "شماره موبایل و کد تأیید لازم است",
      }
    }

    let user
    try {
      user = await authIdentityProviderService.retrieve({
        entity_id: phone,
      })
    } catch {
      return {
        success: false,
        error: "کاربری با این شماره موبایل یافت نشد",
      }
    }

    const userProvider = user.provider_identities?.find((provider) => {
      return (
        provider.provider === this.identifier ||
        provider.provider.endsWith(this.identifier)
      )
    })

    if (!userProvider?.provider_metadata?.otp) {
      return {
        success: false,
        error: "ابتدا یک کد جدید درخواست کنید",
      }
    }

    try {
      const decodedOTP = jwt.verify(
        userProvider.provider_metadata.otp as string,
        this.options.jwtSecret
      ) as OtpPayload

      if (decodedOTP.otp !== otp) {
        return {
          success: false,
          error: "کد تأیید نامعتبر است",
        }
      }
    } catch (error) {
      const expired =
        error instanceof Error && error.name === "TokenExpiredError"

      return {
        success: false,
        error: expired ? "کد تأیید منقضی شده است" : "کد تأیید نامعتبر است",
      }
    }

    const updatedUser = await authIdentityProviderService.update(phone, {
      provider_metadata: {
        otp: null,
      },
    })

    return {
      success: true,
      authIdentity: updatedUser,
    }
  }

  private generateOTP(): { hashedOTP: string; otp: string } {
    let otp = String(randomInt(1, 10))

    for (let index = 1; index < OTP_LENGTH; index++) {
      otp += String(randomInt(0, 10))
    }

    const hashedOTP = jwt.sign({ otp }, this.options.jwtSecret, {
      expiresIn: OTP_TTL,
    })

    return { hashedOTP, otp }
  }

  private readPhone(data: AuthenticationInput): string | null {
    const raw =
      (data.body?.phone as string | undefined) ||
      (data.query?.phone as string | undefined)

    if (!raw) {
      return null
    }

    return normalizePhone(raw)
  }

  private readOtp(data: AuthenticationInput): string | null {
    const raw =
      (data.body?.otp as string | undefined) ||
      (data.query?.otp as string | undefined)

    if (!raw) {
      return null
    }

    const otp = raw.trim()
    return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otp) ? otp : null
  }
}

export default PhoneAuthService
