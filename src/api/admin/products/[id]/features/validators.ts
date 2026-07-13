import { z } from "zod"

export const SetProductFeaturesSchema = z.object({
  // Ordered list of feature ids — array order becomes the display order.
  feature_ids: z.array(z.string()),
})
export type SetProductFeaturesSchema = z.infer<typeof SetProductFeaturesSchema>
