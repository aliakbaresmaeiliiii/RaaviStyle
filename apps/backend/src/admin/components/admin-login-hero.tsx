import { useEffect } from "react"
import { Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { ForcePersian } from "./force-persian"
import { adminLoginCopy } from "../login-copy"
import logo from "../assets/logo.png"

export function AdminLoginHero() {
  useEffect(() => {
    document.body.classList.add("rs-custom-login")
    const icon = document.querySelector<HTMLLinkElement>(
      "link[rel='icon'], link[data-placeholder-favicon]"
    )
    if (icon) {
      icon.href = logo
    }
    return () => {
      document.body.classList.remove("rs-custom-login")
    }
  }, [])

  return (
    <div className="rs-login-hero mb-4 flex flex-col items-center">
      <ForcePersian />
      <img src={logo} alt="راوی‌استایل" className="rs-login-logo" />
      <Heading>{adminLoginCopy.title}</Heading>
      <Text size="small" className="text-ui-fg-subtle text-center">
        {adminLoginCopy.hint}
      </Text>
    </div>
  )
}

export function AdminLoginFooter() {
  return (
    <span className="text-ui-fg-muted txt-small my-2">
      {adminLoginCopy.forgot}{" "}
      <Link
        to="/reset-password"
        className="text-ui-fg-interactive font-medium"
      >
        {adminLoginCopy.reset}
      </Link>
    </span>
  )
}
