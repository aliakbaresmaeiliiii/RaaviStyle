import { model } from "@medusajs/framework/utils"

const SiteEvent = model.define("site_event", {
  id: model.id().primaryKey(),
  kind: model.text().default("visit"),
  path: model.text().default("/"),
  session_id: model.text(),
})

export default SiteEvent
