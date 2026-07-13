import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ProductFeaturesModule from "../modules/product-features"

// Many-to-many: a product has many features, a feature is reusable across many
// products. `rank` stores the per-product display order on the link (pivot),
// since the same feature can sit at different positions on different products.
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  {
    linkable: ProductFeaturesModule.linkable.feature,
    isList: true,
  },
  {
    database: {
      extraColumns: {
        rank: {
          type: "integer",
          defaultValue: "0",
        },
      },
    },
  }
)
