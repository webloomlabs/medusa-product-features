import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { updateFeatureWorkflow } from "../../../../workflows/update-feature"
import { deleteFeatureWorkflow } from "../../../../workflows/delete-feature"
import { UpdateFeatureSchema } from "../validators"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "feature",
    fields: req.queryConfig?.fields ?? ["id", "title", "subtitle", "icon"],
    filters: { id },
  })

  if (!data.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Feature not found")
  }

  res.json({ feature: data[0] })
}

export async function POST(
  req: AuthenticatedMedusaRequest<UpdateFeatureSchema>,
  res: MedusaResponse
) {
  const { id } = req.params

  const { result: feature } = await updateFeatureWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
  })

  res.json({ feature })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  await deleteFeatureWorkflow(req.scope).run({
    input: { id },
  })

  res.json({ id, object: "feature", deleted: true })
}
