import Medusa from "@medusajs/js-sdk";

export const AUTH_COOKIE = "_medusa_jwt";
export const AUTH_PROVIDER = "phone-auth";

export function createMedusaClient() {
  return new Medusa({
    baseUrl:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000",
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    auth: {
      type: "jwt",
      jwtTokenStorageMethod: "nostore",
    },
  });
}

export function missingPublishableKeyMessage() {
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return null;
  }

  return "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is missing. Copy it from Medusa Admin → Settings → Publishable API Keys into apps/web/.env.local.";
}
