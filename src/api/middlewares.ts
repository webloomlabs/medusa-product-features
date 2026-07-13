import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import {
  CreateFeatureSchema,
  UpdateFeatureSchema,
} from "./admin/product-features/validators"
import { SetProductFeaturesSchema } from "./admin/products/[id]/features/validators"

export const GetFeaturesSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/product-features",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetFeaturesSchema, {
          defaults: ["id", "title", "subtitle", "icon", "created_at"],
          isList: true,
          defaultLimit: 100,
        }),
      ],
    },
    {
      matcher: "/admin/product-features",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateFeatureSchema)],
    },
    {
      matcher: "/admin/product-features/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateFeatureSchema)],
    },
    {
      matcher: "/admin/products/:id/features",
      method: "POST",
      middlewares: [validateAndTransformBody(SetProductFeaturesSchema)],
    },
  ],
})
