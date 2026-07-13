import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listProductFeatures } from "../../../../utils/list-product-features"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  const features = await listProductFeatures(req.scope, id)

  res.json({ features })
}
