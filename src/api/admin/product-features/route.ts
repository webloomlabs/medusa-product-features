import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createFeatureWorkflow } from "../../../workflows/create-feature"
import { CreateFeatureSchema } from "./validators"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data: features, metadata } = await query.graph({
    entity: "feature",
    ...req.queryConfig,
  })

  res.json({
    features,
    count: metadata?.count ?? features.length,
    offset: req.queryConfig?.pagination?.skip ?? 0,
    limit: req.queryConfig?.pagination?.take,
  })
}

export async function POST(
  req: AuthenticatedMedusaRequest<CreateFeatureSchema>,
  res: MedusaResponse
) {
  const { result: feature } = await createFeatureWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.status(201).json({ feature })
}
