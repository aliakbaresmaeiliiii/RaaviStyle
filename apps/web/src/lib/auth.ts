"use server";

import { FetchError } from "@medusajs/js-sdk";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  AUTH_PROVIDER,
  createMedusaClient,
  missingPublishableKeyMessage,
} from "./medusa";
import { messages, translateError } from "./i18n";
import { normalizePhone, phoneToPlaceholderEmail } from "./phone";

export type AuthResult = { ok: true } | { ok: false; error: string };

async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value ?? null;
}

function rawErrorMessage(error: unknown): string {
  if (error instanceof FetchError || error instanceof Error) {
    return error.message;
  }

  return "";
}

function errorMessage(error: unknown): string {
  const raw = rawErrorMessage(error);
  return raw ? translateError(raw) : messages.errors.generic;
}

function isAlreadyRegistered(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    message.includes("از قبل وجود دارد")
  );
}

export async function requestOtp(rawPhone: string): Promise<AuthResult> {
  const phone = normalizePhone(rawPhone);

  if (!phone) {
    return { ok: false, error: messages.errors.invalidPhone };
  }

  const configError = missingPublishableKeyMessage();
  if (configError) {
    return { ok: false, error: messages.errors.missingPublishableKey };
  }

  try {
    const sdk = createMedusaClient();
    let registrationToken: string | null = null;

    try {
      registrationToken = await sdk.auth.register("customer", AUTH_PROVIDER, {
        phone,
      });
    } catch (error) {
      if (!isAlreadyRegistered(rawErrorMessage(error))) {
        return { ok: false, error: errorMessage(error) };
      }
    }

    if (registrationToken) {
      try {
        await sdk.store.customer.create(
          {
            email: phoneToPlaceholderEmail(phone),
            phone,
          },
          {},
          {
            Authorization: `Bearer ${registrationToken}`,
          }
        );
      } catch (error) {
        if (!isAlreadyRegistered(rawErrorMessage(error))) {
          return { ok: false, error: errorMessage(error) };
        }
      }
    }

    const loginResult = await sdk.auth.login("customer", AUTH_PROVIDER, {
      phone,
    });

    if (
      typeof loginResult === "string" ||
      !("location" in loginResult) ||
      loginResult.location !== "otp"
    ) {
      return {
        ok: false,
        error: messages.errors.sendFailed,
      };
    }
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }

  redirect(`/login/otp?phone=${encodeURIComponent(phone)}`);
}

export async function verifyOtp(
  rawPhone: string,
  otp: string
): Promise<AuthResult> {
  const phone = normalizePhone(rawPhone);
  const code = otp.trim();

  if (!phone) {
    return { ok: false, error: messages.errors.invalidPhone };
  }

  if (!/^\d{6}$/.test(code)) {
    return { ok: false, error: messages.errors.otpRequired };
  }

  try {
    const sdk = createMedusaClient();
    const result = await sdk.auth.callback("customer", AUTH_PROVIDER, {
      phone,
      otp: code,
    });

    if (typeof result !== "string") {
      return {
        ok: false,
        error: messages.errors.verifyFailed,
      };
    }

    await setAuthToken(result);
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }

  redirect("/account");
}

export async function getCustomer() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const sdk = createMedusaClient();
    const { customer } = await sdk.store.customer.retrieve(
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return customer;
  } catch {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
