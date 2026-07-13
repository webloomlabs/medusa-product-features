import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, HttpTypes } from "@medusajs/framework/types"
import { ArrowDownMini, ArrowUpMini, Plus, XMarkMini } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  Heading,
  IconButton,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { FeatureIcon } from "../components/feature-icon"
import {
  Feature,
  featureKeys,
  listFeatures,
  listProductFeatures,
  setProductFeatures,
} from "../lib/features"

const EditFeaturesDrawer = ({
  productId,
  current,
  open,
  onOpenChange,
}: {
  productId: string
  current: Feature[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Reset local selection whenever the drawer opens.
  useEffect(() => {
    if (open) {
      setSelectedIds(current.map((f) => f.id))
    }
  }, [open, current])

  const { data: catalogData, isLoading } = useQuery({
    queryKey: featureKeys.list,
    queryFn: listFeatures,
    enabled: open,
  })

  const catalog = catalogData?.features ?? []
  const byId = useMemo(() => {
    const map = new Map<string, Feature>()
    catalog.forEach((f) => map.set(f.id, f))
    // Include current features too (in case catalog query hasn't loaded yet).
    current.forEach((f) => {
      if (!map.has(f.id)) {
        map.set(f.id, f)
      }
    })
    return map
  }, [catalog, current])

  const available = catalog.filter((f) => !selectedIds.includes(f.id))

  const move = (index: number, direction: -1 | 1) => {
    setSelectedIds((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) {
        return prev
      }
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const mutation = useMutation({
    mutationFn: () => setProductFeatures(productId, selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: featureKeys.productFeatures(productId),
      })
      queryClient.invalidateQueries({ queryKey: ["product", productId] })
      toast.success("Features updated")
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to save")
    },
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit product features</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="flex-1 overflow-auto">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <Text size="small" weight="plus">
                Selected ({selectedIds.length})
              </Text>
              {selectedIds.length === 0 ? (
                <Text size="small" className="text-ui-fg-subtle">
                  No features selected yet. Add some below.
                </Text>
              ) : (
                <div className="flex flex-col gap-y-2">
                  {selectedIds.map((id, index) => {
                    const feature = byId.get(id)
                    if (!feature) {
                      return null
                    }
                    return (
                      <div
                        key={id}
                        className="bg-ui-bg-component shadow-elevation-card-rest flex items-center justify-between gap-x-3 rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-x-3">
                          <Text
                            size="small"
                            className="text-ui-fg-muted w-5 text-center"
                          >
                            {index + 1}
                          </Text>
                          <FeatureIcon
                            src={feature.icon}
                            alt={feature.title}
                          />
                          <Text size="small" leading="compact" weight="plus">
                            {feature.title}
                          </Text>
                        </div>
                        <div className="flex items-center gap-x-1">
                          <IconButton
                            size="small"
                            variant="transparent"
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                          >
                            <ArrowUpMini />
                          </IconButton>
                          <IconButton
                            size="small"
                            variant="transparent"
                            disabled={index === selectedIds.length - 1}
                            onClick={() => move(index, 1)}
                          >
                            <ArrowDownMini />
                          </IconButton>
                          <IconButton
                            size="small"
                            variant="transparent"
                            onClick={() =>
                              setSelectedIds((prev) =>
                                prev.filter((x) => x !== id)
                              )
                            }
                          >
                            <XMarkMini />
                          </IconButton>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <Text size="small" weight="plus">
                Available
              </Text>
              {isLoading ? (
                <Text size="small" className="text-ui-fg-subtle">
                  Loading…
                </Text>
              ) : available.length === 0 ? (
                <Text size="small" className="text-ui-fg-subtle">
                  All catalog features are selected.
                </Text>
              ) : (
                <div className="flex flex-col gap-y-2">
                  {available.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between gap-x-3 rounded-md px-3 py-2"
                    >
                      <div className="flex items-center gap-x-3">
                        <FeatureIcon
                          src={feature.icon}
                          alt={feature.title}
                        />
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
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() =>
                          setSelectedIds((prev) => [...prev, feature.id])
                        }
                      >
                        <Plus />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button size="small" variant="secondary" disabled={mutation.isPending}>
              Cancel
            </Button>
          </Drawer.Close>
          <Button
            size="small"
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
          >
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}

const ProductFeaturesWidget = ({
  data: product,
}: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  const [editOpen, setEditOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: featureKeys.productFeatures(product.id),
    queryFn: () => listProductFeatures(product.id),
  })

  const features = data?.features ?? []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Features</Heading>
        <Button
          size="small"
          variant="secondary"
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
      </div>

      {isLoading ? (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            Loading…
          </Text>
        </div>
      ) : features.length === 0 ? (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            No features assigned to this product.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-y-3 px-6 py-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center gap-x-3">
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
          ))}
        </div>
      )}

      <EditFeaturesDrawer
        productId={product.id}
        current={features}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default ProductFeaturesWidget
