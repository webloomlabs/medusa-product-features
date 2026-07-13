import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { setProductFeaturesWorkflow } from "../../../../../workflows/set-product-features"
import { listProductFeatures } from "../../../../utils/list-product-features"
import { SetProductFeaturesSchema } from "./validators"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  const features = await listProductFeatures(req.scope, id)

  res.json({ features })
}

export async function POST(
  req: AuthenticatedMedusaRequest<SetProductFeaturesSchema>,
  res: MedusaResponse
) {
  const { id } = req.params

  await setProductFeaturesWorkflow(req.scope).run({
    input: {
      product_id: id,
      feature_ids: req.validatedBody.feature_ids,
    },
  })

  const features = await listProductFeatures(req.scope, id)

  res.json({ features })
}
