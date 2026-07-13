import { sdk } from "./client"

export type Feature = {
  id: string
  title: string
  subtitle: string | null
  icon: string | null
}

export type FeaturePayload = {
  title: string
  subtitle?: string | null
  icon?: string | null
}

export const featureKeys = {
  list: ["product-features"] as const,
  productFeatures: (productId: string) =>
    ["product-features", "product", productId] as const,
}

export const listFeatures = () =>
  sdk.client.fetch<{ features: Feature[] }>("/admin/product-features", {
    query: { limit: 1000 },
  })

export const createFeature = (payload: FeaturePayload) =>
  sdk.client.fetch<{ feature: Feature }>("/admin/product-features", {
    method: "POST",
    body: payload,
  })

export const updateFeature = (id: string, payload: FeaturePayload) =>
  sdk.client.fetch<{ feature: Feature }>(`/admin/product-features/${id}`, {
    method: "POST",
    body: payload,
  })

export const deleteFeature = (id: string) =>
  sdk.client.fetch<{ id: string; deleted: boolean }>(
    `/admin/product-features/${id}`,
    { method: "DELETE" }
  )

export const listProductFeatures = (productId: string) =>
  sdk.client.fetch<{ features: Feature[] }>(
    `/admin/products/${productId}/features`
  )

export const setProductFeatures = (productId: string, featureIds: string[]) =>
  sdk.client.fetch<{ features: Feature[] }>(
    `/admin/products/${productId}/features`,
    {
      method: "POST",
      body: { feature_ids: featureIds },
    }
  )

// Uploads an image file via the built-in File Module and returns its URL.
export const uploadIcon = async (file: File): Promise<string> => {
  const { files } = await sdk.admin.upload.create({ files: [file] })
  return files[0].url
}
