import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { AdminLoginHero } from "../components/admin-login-hero"

const LoginHeroWidget = () => {
  return <AdminLoginHero />
}

export const config = defineWidgetConfig({
  zone: "login.before",
})

export default LoginHeroWidget
