import { MedusaService } from "@medusajs/framework/utils"
import Feature from "./models/feature"

class ProductFeaturesModuleService extends MedusaService({
  Feature,
}) {}

export default ProductFeaturesModuleService
