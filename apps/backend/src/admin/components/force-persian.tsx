import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import "../styles/theme.css"

export function ForcePersian() {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.resolvedLanguage === "fa") {
      return
    }

    void i18n.changeLanguage("fa")
    window.localStorage.setItem("lng", "fa")
    document.cookie = "lng=fa; path=/; max-age=31536000"
  }, [i18n])

  return null
}
