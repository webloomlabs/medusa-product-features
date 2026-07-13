import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_FEATURES_MODULE } from "../../modules/product-features"
import ProductFeaturesModuleService from "../../modules/product-features/service"

export type UpdateFeatureStepInput = {
  id: string
  title?: string
  subtitle?: string | null
  icon?: string | null
}

export const updateFeatureStep = createStep(
  "update-feature",
  async (input: UpdateFeatureStepInput, { container }) => {
    const service: ProductFeaturesModuleService =
      container.resolve(PRODUCT_FEATURES_MODULE)

    const previous = await service.retrieveFeature(input.id)

    const feature = await service.updateFeatures(input)

    return new StepResponse(feature, {
      id: previous.id,
      title: previous.title,
      subtitle: previous.subtitle,
      icon: previous.icon,
    })
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service: ProductFeaturesModuleService =
      container.resolve(PRODUCT_FEATURES_MODULE)

    await service.updateFeatures(previous)
  }
)
