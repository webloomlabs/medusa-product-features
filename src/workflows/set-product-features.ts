import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createRemoteLinkStep,
  dismissRemoteLinkStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { PRODUCT_FEATURES_MODULE } from "../modules/product-features"

export type SetProductFeaturesWorkflowInput = {
  product_id: string
  // Ordered list of feature ids — array order is the display order (rank).
  feature_ids: string[]
}

export const setProductFeaturesWorkflow = createWorkflow(
  "set-product-features",
  function (input: SetProductFeaturesWorkflowInput) {
    // Current features linked to the product (to replace them).
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["id", "features.id"],
      filters: { id: input.product_id },
    })

    const linkChanges = transform({ input, products }, ({ input, products }) => {
      const existing = products?.[0]?.features ?? []

      const dismiss = existing.map((feature: { id: string }) => ({
        [Modules.PRODUCT]: { product_id: input.product_id },
        [PRODUCT_FEATURES_MODULE]: { feature_id: feature.id },
      }))

      const create = input.feature_ids.map((feature_id, index) => ({
        [Modules.PRODUCT]: { product_id: input.product_id },
        [PRODUCT_FEATURES_MODULE]: { feature_id },
        data: { rank: index },
      }))

      return { dismiss, create }
    })

    // Remove all existing product<->feature links, then recreate with new ranks.
    dismissRemoteLinkStep(linkChanges.dismiss)
    createRemoteLinkStep(linkChanges.create)

    return new WorkflowResponse({ product_id: input.product_id })
  }
)

export default setProductFeaturesWorkflow
