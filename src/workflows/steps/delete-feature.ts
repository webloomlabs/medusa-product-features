import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_FEATURES_MODULE } from "../../modules/product-features"
import ProductFeaturesModuleService from "../../modules/product-features/service"

export type DeleteFeatureStepInput = {
  id: string
}

export const deleteFeatureStep = createStep(
  "delete-feature",
  async (input: DeleteFeatureStepInput, { container }) => {
    const service: ProductFeaturesModuleService =
      container.resolve(PRODUCT_FEATURES_MODULE)

    const feature = await service.retrieveFeature(input.id)

    await service.deleteFeatures(input.id)

    return new StepResponse({ id: input.id }, {
      title: feature.title,
      subtitle: feature.subtitle,
      icon: feature.icon,
    })
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service: ProductFeaturesModuleService =
      container.resolve(PRODUCT_FEATURES_MODULE)

    await service.createFeatures(previous)
  }
)
