import { MedusaService } from "@medusajs/framework/utils"
import SitePage from "./models/site-page"

class CmsModuleService extends MedusaService({
  SitePage,
}) {}

export default CmsModuleService
