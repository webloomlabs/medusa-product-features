import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_FEATURES_MODULE } from "../../modules/product-features"
import ProductFeaturesModuleService from "../../modules/product-features/service"

export type CreateFeatureStepInput = {
  title: string
  subtitle?: string | null
  icon?: string | null
}

export const createFeatureStep = createStep(
  "create-feature",
  async (input: CreateFeatureStepInput, { container }) => {
    const service: ProductFeaturesModuleService =
      container.resolve(PRODUCT_FEATURES_MODULE)

    const feature = await service.createFeatures(input)

    return new StepResponse(feature, feature.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service: ProductFeaturesModuleService =
      container.resolve(PRODUCT_FEATURES_MODULE)

    await service.deleteFeatures(id)
  }
)
