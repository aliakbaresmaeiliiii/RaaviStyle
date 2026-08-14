import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { AdminLoginFooter } from "../components/admin-login-hero"
import { ForcePersian } from "../components/force-persian"

const DefaultLocaleWidget = () => {
  return (
    <>
      <ForcePersian />
      <AdminLoginFooter />
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "login.after",
})

export default DefaultLocaleWidget
