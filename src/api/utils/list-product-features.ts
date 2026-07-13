import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"
import ProductFeatureLink from "../../links/product-feature"

export type FeatureDTO = {
  id: string
  title: string
  subtitle: string | null
  icon: string | null
}

// Returns a product's linked features ordered by the per-product `rank`
// stored on the product<->feature link table.
export async function listProductFeatures(
  scope: MedusaContainer,
  productId: string
): Promise<FeatureDTO[]> {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: links } = await query.graph({
    entity: ProductFeatureLink.entryPoint,
    fields: [
      "rank",
      "feature.id",
      "feature.title",
      "feature.subtitle",
      "feature.icon",
    ],
    filters: { product_id: productId },
  })

  return links
    .filter((link) => Boolean(link.feature))
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((link) => link.feature as FeatureDTO)
}
