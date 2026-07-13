import { z } from "zod"

export const CreateFeatureSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullish(),
  icon: z.string().url().nullish(),
})
export type CreateFeatureSchema = z.infer<typeof CreateFeatureSchema>

export const UpdateFeatureSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullish(),
  icon: z.string().url().nullish(),
})
export type UpdateFeatureSchema = z.infer<typeof UpdateFeatureSchema>
