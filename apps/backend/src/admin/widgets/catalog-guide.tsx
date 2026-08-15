import { ForcePersian } from "../components/force-persian"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const CatalogGuideWidget = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Container className="p-0">
      <ForcePersian />
      <div className="px-6 py-4 flex flex-col gap-3">
        <Heading level="h2">{t("cms.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("guide.products")}
        </Text>
        <div>
          <Button onClick={() => navigate("/products/create")}>
            افزودن محصول با عکس
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default CatalogGuideWidget
