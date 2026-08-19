import { model } from "@medusajs/framework/utils"

const SitePage = model.define("site_page", {
  id: model.id().primaryKey(),
  handle: model.text().unique(),
  title: model.text(),
  body: model.text().default(""),
  image_url: model.text().nullable(),
  images: model.array().nullable(),
})

export default SitePage
