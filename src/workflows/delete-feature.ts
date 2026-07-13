import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  deleteFeatureStep,
  DeleteFeatureStepInput,
} from "./steps/delete-feature"

export type DeleteFeatureWorkflowInput = DeleteFeatureStepInput

export const deleteFeatureWorkflow = createWorkflow(
  "delete-feature",
  function (input: DeleteFeatureWorkflowInput) {
    const result = deleteFeatureStep(input)

    return new WorkflowResponse(result)
  }
)

export default deleteFeatureWorkflow
