import { useRef, useState } from "react"
import { Button, Input, Label, Text, toast } from "@medusajs/ui"
import { uploadIcon } from "../lib/features"
import { FeatureIcon } from "./feature-icon"

export type FeatureFormValue = {
  title: string
  subtitle: string
  icon: string | null
}

type Props = {
  value: FeatureFormValue
  onChange: (value: FeatureFormValue) => void
  onUploadingChange?: (uploading: boolean) => void
}

export const FeatureForm = ({ value, onChange, onUploadingChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset so the same file can be selected again after removal.
    e.target.value = ""
    if (!file) {
      return
    }

    setUploading(true)
    onUploadingChange?.(true)
    try {
      const url = await uploadIcon(file)
      onChange({ ...value, icon: url })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload icon"
      )
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label size="small" weight="plus">
          Title
        </Label>
        <Input
          placeholder="Breathable"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label size="small" weight="plus">
          Subtitle
        </Label>
        <Input
          placeholder="No AC, no sweat"
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
        />
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Optional short description shown under the title.
        </Text>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label size="small" weight="plus">
          Icon
        </Label>
        <div className="flex items-center gap-x-3">
          <FeatureIcon src={value.icon} alt="Feature icon" />
          <div className="flex items-center gap-x-2">
            <Button
              size="small"
              variant="secondary"
              type="button"
              isLoading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {value.icon ? "Replace" : "Upload"}
            </Button>
            {value.icon && (
              <Button
                size="small"
                variant="transparent"
                type="button"
                disabled={uploading}
                onClick={() => onChange({ ...value, icon: null })}
              >
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Optional image icon (PNG or SVG recommended).
        </Text>
      </div>
    </div>
  )
}
