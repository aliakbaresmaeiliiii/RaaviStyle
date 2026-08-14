import { MedusaService } from "@medusajs/framework/utils"
import SiteEvent from "./models/site-event"

class AnalyticsModuleService extends MedusaService({
  SiteEvent,
}) {}

export default AnalyticsModuleService
