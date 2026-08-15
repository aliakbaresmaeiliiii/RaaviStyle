import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CMS_MODULE } from "../modules/cms"
import type CmsModuleService from "../modules/cms/service"

export const DEFAULT_PAGES = [
  {
    handle: "home",
    title: "شلواری که روی تن می‌نشیند",
    body: "بگ، مام‌استایل، کارگو و راسته. پارچه‌های سبک، رنگ‌های گرم، دوخت دقیق.",
  },
  {
    handle: "about",
    title: "از کمر، کمد شکل می‌گیرد",
    body: "راوی‌استایل فقط شلوار می‌فروشد. وقتی پایین‌تنه درست بنشیند، بقیه لباس‌ها جای خودشان را پیدا می‌کنند.",
  },
  {
    handle: "faq",
    title: "قبل از خرید، همین‌جا بپرسید",
    body: "سایز، ارسال و مرجوعی را شفاف نوشته‌ایم. اگر جواب نبود، مستقیم با فروشگاه تماس بگیرید.",
  },
]

type PageInput = {
  handle: string
  title: string
  body: string
  image_url?: string | null
}

const listPagesStep = createStep(
  "list-pages",
  async (_, { container }) => {
    const cms: CmsModuleService = container.resolve(CMS_MODULE)
    let pages = await cms.listSitePages({}, { take: 50 })

    if (!pages.length) {
      await cms.createSitePages(DEFAULT_PAGES)
      pages = await cms.listSitePages({}, { take: 50 })
    }

    return new StepResponse(pages)
  }
)

const upsertPageStep = createStep(
  "upsert-page",
  async (input: PageInput, { container }) => {
    const cms: CmsModuleService = container.resolve(CMS_MODULE)
    const existing = await cms.listSitePages(
      { handle: input.handle },
      { take: 5 }
    )
    const current = existing.find((page) => page.handle === input.handle)
    const imageUrl = input.image_url || null

    if (current) {
      const updated = await cms.updateSitePages({
        id: current.id,
        title: input.title,
        body: input.body,
        image_url: imageUrl,
      })
      return new StepResponse(updated)
    }

    const created = await cms.createSitePages({
      handle: input.handle,
      title: input.title,
      body: input.body,
      image_url: imageUrl,
    })
    return new StepResponse(created)
  }
)

export const listSitePagesWorkflow = createWorkflow(
  "list-site-pages",
  () => {
    const pages = listPagesStep()
    return new WorkflowResponse(pages)
  }
)

export const upsertSitePageWorkflow = createWorkflow(
  "upsert-site-page",
  (input: PageInput) => {
    const page = upsertPageStep(input)
    return new WorkflowResponse(page)
  }
)
