import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createFeatureStep,
  CreateFeatureStepInput,
} from "./steps/create-feature"

export type CreateFeatureWorkflowInput = CreateFeatureStepInput

export const createFeatureWorkflow = createWorkflow(
  "create-feature",
  function (input: CreateFeatureWorkflowInput) {
    const feature = createFeatureStep(input)

    return new WorkflowResponse(feature)
  }
)

export default createFeatureWorkflow
