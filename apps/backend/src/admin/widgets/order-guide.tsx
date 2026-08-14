import { ForcePersian } from "../components/force-persian"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

const OrderGuideWidget = () => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <ForcePersian />
      <div className="px-6 py-4">
        <Heading level="h2">{t("cms.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle mt-2">
          {t("guide.orders")}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default OrderGuideWidget
