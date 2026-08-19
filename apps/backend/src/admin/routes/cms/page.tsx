import { ForcePersian } from "../../components/force-persian"
import { AdminGrid } from "../../components/admin-grid"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PencilSquare } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import type { ColDef } from "ag-grid-community"

type SitePage = {
  id: string
  handle: string
  title: string
  body: string
  image_url: string | null
  images?: string[] | null
}

const CmsPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [handle, setHandle] = useState<string>("home")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [images, setImages] = useState<string[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["cms-pages"],
    queryFn: async () => {
      const response = await fetch("/admin/cms/pages", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to load pages")
      }
      return (await response.json()) as { pages: SitePage[] }
    },
  })

  const page = data?.pages.find((item) => item.handle === handle)

  const pageColumns = useMemo<ColDef<SitePage>[]>(
    () => [
      {
        field: "handle",
        headerName: t("cms.handle"),
        valueFormatter: (params) => t(`cms.${params.value}`),
      },
      { field: "title", headerName: t("cms.pageTitle") },
      {
        field: "image_url",
        headerName: t("cms.image"),
        valueFormatter: (params) => (params.value ? "دارد" : "ندارد"),
      },
    ],
    [t]
  )

  useEffect(() => {
    if (!page) {
      return
    }
    setTitle(page.title)
    setBody(page.body)
    setImageUrl(page.image_url ?? "")
    setImages(
      page.images?.length
        ? page.images
        : page.image_url
          ? [page.image_url]
          : [],
    )
  }, [page])

  const save = useMutation({
    mutationFn: async () => {
      const response = await fetch("/admin/cms/pages", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          handle,
          title,
          body,
          image_url: images.length ? imageUrl || null : null,
          images,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to save")
      }
      return response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cms-pages"] })
      toast.success(t("cms.saved"))
    },
    onError: () => {
      toast.error(t("cms.save"))
    },
  })

  async function onUpload(file: File) {
    const payload = new FormData()
    payload.append("files", file)
    const response = await fetch("/admin/uploads", {
      method: "POST",
      credentials: "include",
      body: payload,
    })
    if (!response.ok) {
      toast.error(t("cms.upload"))
      return
    }
    const json = (await response.json()) as {
      files?: Array<{ url: string }>
      uploads?: Array<{ url: string }>
    }
    const url = json.files?.[0]?.url ?? json.uploads?.[0]?.url
    if (url) {
      setImageUrl(url)
      setImages((current) => [...current, url])
    }
  }

  return (
    <Container className="p-0">
      <ForcePersian />
      <div className="px-6 py-4 border-b border-ui-border-base">
        <Heading>{t("cms.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle mt-1">
          {t("cms.description")}
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-4">
        <AdminGrid<SitePage>
          rowData={data?.pages ?? []}
          columnDefs={pageColumns}
          height={220}
          onRowClicked={(event) => {
            if (event.data?.handle) {
              setHandle(event.data.handle)
            }
          }}
        />
        <Text size="small" className="text-ui-fg-subtle">
          {t("cms.handle")}: {t(`cms.${handle}`)}
        </Text>
        <div>
          <Label>{t("cms.pageTitle")}</Label>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
          <Label>{t("cms.body")}</Label>
          <Textarea
            rows={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </div>
        <div>
          <Label>{t("cms.image")}</Label>
          <Input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              className="flex-1 text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  void onUpload(file)
                }
              }}
            />
            <Button
              variant="secondary"
              size="small"
              onClick={() => setImages([])}
            >
              {t("cms.clearImages")}
            </Button>
          </div>
          {images.length ? (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="group relative overflow-hidden rounded-md border border-ui-border-base"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-ui-bg-base text-sm shadow-elevation-card-rest transition hover:bg-ui-bg-base-hover"
                    onClick={() =>
                      setImages((current) =>
                        current.filter((item) => item !== url),
                      )
                    }
                    title={t("cms.removeImage")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <Text size="small" className="mt-2 text-ui-fg-muted">
              {t("cms.imagesEmpty")}
            </Text>
          )}
        </div>
      </div>
      <div className="px-6 py-4 flex justify-end border-t border-ui-border-base">
        <Button
          disabled={isLoading || save.isPending}
          onClick={() => save.mutate()}
        >
          {t("cms.save")}
        </Button>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "محتوای سایت",
  icon: PencilSquare,
})

export default CmsPage
