import { Text } from "@medusajs/ui"

type Props = {
  src?: string | null
  alt?: string
}

// Small square preview for a feature's icon image, with a neutral fallback.
export const FeatureIcon = ({ src, alt }: Props) => {
  return (
    <div className="bg-ui-bg-component flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border">
      {src ? (
        <img src={src} alt={alt ?? ""} className="size-full object-contain" />
      ) : (
        <Text size="xsmall" className="text-ui-fg-muted">
          —
        </Text>
      )}
    </div>
  )
}
