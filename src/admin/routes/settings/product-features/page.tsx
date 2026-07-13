import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Star, PencilSquare, Trash, EllipsisHorizontal } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FeatureForm, FeatureFormValue } from "../../../components/feature-form"
import { FeatureIcon } from "../../../components/feature-icon"
import {
  createFeature,
  deleteFeature,
  Feature,
  featureKeys,
  listFeatures,
  updateFeature,
} from "../../../lib/features"

const EMPTY_FORM: FeatureFormValue = { title: "", subtitle: "", icon: null }

const toPayload = (value: FeatureFormValue) => ({
  title: value.title.trim(),
  subtitle: value.subtitle.trim() || null,
  icon: value.icon,
})

const CreateFeatureModal = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FeatureFormValue>(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: () => createFeature(toPayload(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.list })
      toast.success("Feature created")
      setForm(EMPTY_FORM)
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create")
    },
  })

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    mutation.mutate()
  }

  return (
    <FocusModal
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) {
          setForm(EMPTY_FORM)
        }
      }}
    >
      <FocusModal.Trigger asChild>
        <Button size="small" variant="secondary">
          Create
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button
                size="small"
                variant="secondary"
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </FocusModal.Close>
            <Button
              size="small"
              onClick={handleSubmit}
              isLoading={mutation.isPending}
              disabled={uploading}
            >
              Save
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-1 flex-col items-center overflow-auto py-16">
          <div className="flex w-full max-w-lg flex-col gap-y-6">
            <div className="flex flex-col gap-y-1">
              <Heading level="h2">New feature</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Add a feature to the global catalog.
              </Text>
            </div>
            <FeatureForm
              value={form}
              onChange={setForm}
              onUploadingChange={setUploading}
            />
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

const EditFeatureDrawer = ({
  feature,
  open,
  onOpenChange,
}: {
  feature: Feature
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FeatureFormValue>({
    title: feature.title,
    subtitle: feature.subtitle ?? "",
    icon: feature.icon,
  })
  const [uploading, setUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: () => updateFeature(feature.id, toPayload(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.list })
      toast.success("Feature updated")
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update")
    },
  })

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    mutation.mutate()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit feature</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="flex-1 overflow-auto">
          <FeatureForm
            value={form}
            onChange={setForm}
            onUploadingChange={setUploading}
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button size="small" variant="secondary" disabled={mutation.isPending}>
              Cancel
            </Button>
          </Drawer.Close>
          <Button
            size="small"
            onClick={handleSubmit}
            isLoading={mutation.isPending}
            disabled={uploading}
          >
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}

const FeatureRow = ({ feature }: { feature: Feature }) => {
  const queryClient = useQueryClient()
  const prompt = usePrompt()
  const [editOpen, setEditOpen] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => deleteFeature(feature.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.list })
      toast.success("Feature deleted")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete")
    },
  })

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: "Delete feature",
      description: `Are you sure you want to delete "${feature.title}"? It will be removed from all products.`,
    })
    if (confirmed) {
      deleteMutation.mutate()
    }
  }

  return (
    <div className="flex items-center justify-between gap-x-4 px-6 py-4">
      <div className="flex items-center gap-x-3">
        <FeatureIcon src={feature.icon} alt={feature.title} />
        <div className="flex flex-col">
          <Text size="small" leading="compact" weight="plus">
            {feature.title}
          </Text>
          {feature.subtitle && (
            <Text
              size="small"
              leading="compact"
              className="text-ui-fg-subtle"
            >
              {feature.subtitle}
            </Text>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton size="small" variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => setEditOpen(true)}
          >
            <PencilSquare className="text-ui-fg-subtle" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
            <Trash className="text-ui-fg-subtle" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <EditFeatureDrawer
        feature={feature}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}

const ProductFeaturesSettingsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: featureKeys.list,
    queryFn: listFeatures,
  })

  const features = data?.features ?? []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading level="h2">Product Features</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage the global catalog of features you can assign to products.
          </Text>
        </div>
        <CreateFeatureModal />
      </div>

      {isLoading ? (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-subtle">
            Loading…
          </Text>
        </div>
      ) : features.length === 0 ? (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-subtle">
            No features yet. Create your first one.
          </Text>
        </div>
      ) : (
        <div className="divide-y">
          {features.map((feature) => (
            <FeatureRow key={feature.id} feature={feature} />
          ))}
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Product Features",
  icon: Star,
})

export default ProductFeaturesSettingsPage
