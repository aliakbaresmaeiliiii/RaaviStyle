import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { ANALYTICS_MODULE } from "../modules/analytics"
import type AnalyticsModuleService from "../modules/analytics/service"
import {
  addDays,
  faDateLabel,
  rangeStart,
  startOfTehranDay,
  tehranDayKey,
  weekdayFa,
} from "../lib/tehran-time"

type RecordEventInput = {
  path?: string
  session_id?: string
}

type CountRange = {
  today: number
  week: number
  month: number
  total: number
}

export type AnalyticsOverview = {
  users: CountRange
  visitors: CountRange
  views: CountRange
  orders: CountRange
  products: number
  series: Array<{
    date: string
    label: string
    users: number
    visitors: number
    views: number
  }>
  weekdays: Array<{
    day: string
    visitors: number
    users: number
  }>
  topPages: Array<{ path: string; count: number }>
}

function cleanPath(path?: string) {
  const next = (path || "/").trim() || "/"
  if (!next.startsWith("/")) {
    return "/"
  }
  return next.slice(0, 200)
}

function cleanSession(session?: string) {
  const next = (session || "").trim()
  if (!next || next.length > 80) {
    return `anon_${Date.now()}`
  }
  return next
}

const recordEventStep = createStep(
  "record-event",
  async (input: RecordEventInput, { container }) => {
    const analytics: AnalyticsModuleService = container.resolve(ANALYTICS_MODULE)
    const created = await analytics.createSiteEvents({
      kind: "visit",
      path: cleanPath(input.path),
      session_id: cleanSession(input.session_id),
    })
    return new StepResponse(created)
  }
)

export const recordSiteEventWorkflow = createWorkflow(
  "record-site-event",
  (input: RecordEventInput) => {
    const event = recordEventStep(input)
    return new WorkflowResponse(event)
  }
)

async function countSince(
  listAndCount: (
    filters: Record<string, unknown>,
    config: { take: number }
  ) => Promise<[unknown[], number]>,
  since?: Date
) {
  const filters = since ? { created_at: { $gte: since } } : {}
  const [, count] = await listAndCount(filters, { take: 1 })
  return count
}

const getOverviewStep = createStep(
  "get-overview",
  async (_, { container }) => {
    const analytics: AnalyticsModuleService = container.resolve(ANALYTICS_MODULE)
    const customer = container.resolve(Modules.CUSTOMER) as {
      listAndCountCustomers: (
        filters: Record<string, unknown>,
        config: { take: number }
      ) => Promise<[unknown[], number]>
    }
    const order = container.resolve(Modules.ORDER) as {
      listAndCountOrders: (
        filters: Record<string, unknown>,
        config: { take: number }
      ) => Promise<[unknown[], number]>
    }
    const product = container.resolve(Modules.PRODUCT) as {
      listAndCountProducts: (
        filters: Record<string, unknown>,
        config: { take: number }
      ) => Promise<[unknown[], number]>
    }

    const today = startOfTehranDay()
    const week = rangeStart(7)
    const month = rangeStart(30)
    const chartStart = rangeStart(30)

    const [usersToday, usersWeek, usersMonth, usersTotal] = await Promise.all([
      countSince(customer.listAndCountCustomers, today),
      countSince(customer.listAndCountCustomers, week),
      countSince(customer.listAndCountCustomers, month),
      countSince(customer.listAndCountCustomers),
    ])

    const [ordersToday, ordersWeek, ordersMonth, ordersTotal] = await Promise.all([
      countSince(order.listAndCountOrders, today),
      countSince(order.listAndCountOrders, week),
      countSince(order.listAndCountOrders, month),
      countSince(order.listAndCountOrders),
    ])

    const [, products] = await product.listAndCountProducts({}, { take: 1 })

    const events = await analytics.listSiteEvents(
      { created_at: { $gte: chartStart } },
      { take: 10000, order: { created_at: "ASC" } }
    )
    const [, viewsTotal] = await analytics.listAndCountSiteEvents({}, { take: 1 })
    const lifetime = await analytics.listSiteEvents({}, { take: 10000 })

    const viewsToday = events.filter(
      (item) => new Date(item.created_at) >= today
    )
    const viewsWeek = events.filter(
      (item) => new Date(item.created_at) >= week
    )
    const viewsMonth = events

    function uniqueSessions(list: typeof events) {
      return new Set(list.map((item) => item.session_id)).size
    }

    const seriesMap = new Map<
      string,
      { views: number; sessions: Set<string>; users: number }
    >()
    for (let i = 0; i < 30; i++) {
      const key = tehranDayKey(addDays(chartStart, i))
      seriesMap.set(key, { views: 0, sessions: new Set(), users: 0 })
    }
    for (const event of events) {
      const key = tehranDayKey(new Date(event.created_at))
      const bucket = seriesMap.get(key)
      if (!bucket) {
        continue
      }
      bucket.views += 1
      bucket.sessions.add(event.session_id)
    }

    const recentCustomers = await customer.listAndCountCustomers(
      { created_at: { $gte: chartStart } },
      { take: 1000 }
    )
    const customerRows = recentCustomers[0] as Array<{ created_at?: Date | string }>
    for (const row of customerRows) {
      if (!row.created_at) {
        continue
      }
      const key = tehranDayKey(new Date(row.created_at))
      const bucket = seriesMap.get(key)
      if (bucket) {
        bucket.users += 1
      }
    }

    const series = [...seriesMap.entries()].map(([date, bucket]) => ({
      date,
      label: faDateLabel(date),
      users: bucket.users,
      visitors: bucket.sessions.size,
      views: bucket.views,
    }))

    const weekKeys = series.slice(-7)
    const weekdays = weekKeys.map((item) => ({
      day: weekdayFa(new Date(`${item.date}T12:00:00.000+03:30`)),
      visitors: item.visitors,
      users: item.users,
    }))

    const pageCounts = new Map<string, number>()
    for (const event of viewsWeek) {
      pageCounts.set(event.path, (pageCounts.get(event.path) || 0) + 1)
    }
    const topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([path, count]) => ({ path, count }))

    const overview: AnalyticsOverview = {
      users: {
        today: usersToday,
        week: usersWeek,
        month: usersMonth,
        total: usersTotal,
      },
      visitors: {
        today: uniqueSessions(viewsToday),
        week: uniqueSessions(viewsWeek),
        month: uniqueSessions(viewsMonth),
        total: uniqueSessions(lifetime),
      },
      views: {
        today: viewsToday.length,
        week: viewsWeek.length,
        month: viewsMonth.length,
        total: viewsTotal,
      },
      orders: {
        today: ordersToday,
        week: ordersWeek,
        month: ordersMonth,
        total: ordersTotal,
      },
      products,
      series,
      weekdays,
      topPages,
    }

    return new StepResponse(overview)
  }
)

export const getAnalyticsOverviewWorkflow = createWorkflow(
  "get-analytics-overview",
  () => {
    const overview = getOverviewStep()
    return new WorkflowResponse(overview)
  }
)
