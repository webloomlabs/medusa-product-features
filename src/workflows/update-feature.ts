import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  updateFeatureStep,
  UpdateFeatureStepInput,
} from "./steps/update-feature"

export type UpdateFeatureWorkflowInput = UpdateFeatureStepInput

export const updateFeatureWorkflow = createWorkflow(
  "update-feature",
  function (input: UpdateFeatureWorkflowInput) {
    const feature = updateFeatureStep(input)

    return new WorkflowResponse(feature)
  }
)

export default updateFeatureWorkflow
