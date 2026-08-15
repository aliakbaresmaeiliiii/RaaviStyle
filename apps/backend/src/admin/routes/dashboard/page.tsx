import { ForcePersian } from "../../components/force-persian"
import { AdminGrid } from "../../components/admin-grid"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChartBar } from "@medusajs/icons"
import { Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { useMemo } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ColDef } from "ag-grid-community"

type CountRange = {
  today: number
  week: number
  month: number
  total: number
}

type DayRow = {
  date: string
  label: string
  users: number
  visitors: number
  views: number
}

type PageRow = {
  path: string
  count: number
}

type Overview = {
  users: CountRange
  visitors: CountRange
  views: CountRange
  orders: CountRange
  products: number
  series: DayRow[]
  weekdays: Array<{
    day: string
    visitors: number
    users: number
  }>
  topPages: PageRow[]
}

const PALETTE = {
  bronze: "#c4a574",
  mocha: "#a47864",
  sage: "#7e8a6a",
  clay: "#c26a4a",
}

function fa(value: number) {
  return value.toLocaleString("fa-IR")
}

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const response = await fetch("/admin/analytics/overview", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to load analytics")
      }
      return (await response.json()) as Overview
    },
    refetchInterval: 60_000,
  })

  const overview = data
  const series = overview?.series ?? []
  const weekdays = overview?.weekdays ?? []
  const topPages = overview?.topPages.length
    ? overview.topPages
    : [{ path: "/", count: 0 }]

  const dayColumns = useMemo<ColDef<DayRow>[]>(
    () => [
      { field: "label", headerName: "تاریخ" },
      {
        field: "users",
        headerName: "کاربر جدید",
        valueFormatter: (params) => fa(params.value ?? 0),
      },
      {
        field: "visitors",
        headerName: "بازدیدکننده",
        valueFormatter: (params) => fa(params.value ?? 0),
      },
      {
        field: "views",
        headerName: "بازدید صفحه",
        valueFormatter: (params) => fa(params.value ?? 0),
      },
    ],
    []
  )

  const pageColumns = useMemo<ColDef<PageRow>[]>(
    () => [
      { field: "path", headerName: "مسیر" },
      {
        field: "count",
        headerName: "بازدید",
        valueFormatter: (params) => fa(params.value ?? 0),
      },
    ],
    []
  )

  return (
    <div className="rs-theme rs-dash">
      <ForcePersian />
      <section className="rs-hero">
        <Text size="small" className="text-ui-fg-on-color">
          تجربه زنده فروشگاه
        </Text>
        <Heading className="text-ui-fg-on-color">داشبورد راوی‌استایل</Heading>
        <p>
          از اینجا کل سایت را مدیریت کنید: کاربران امروز، این هفته و این ماه،
          بازدید صفحات، و میانبرهای ساخت محصول و محتوا.
        </p>
      </section>

      <div className="rs-kpis">
        <article className="rs-kpi">
          <span>کاربران امروز</span>
          <strong>{isLoading ? "…" : fa(overview?.users.today ?? 0)}</strong>
          <em>این هفته {fa(overview?.users.week ?? 0)} · این ماه {fa(overview?.users.month ?? 0)}</em>
        </article>
        <article className="rs-kpi">
          <span>بازدیدکننده امروز</span>
          <strong>{isLoading ? "…" : fa(overview?.visitors.today ?? 0)}</strong>
          <em>این هفته {fa(overview?.visitors.week ?? 0)} · این ماه {fa(overview?.visitors.month ?? 0)}</em>
        </article>
        <article className="rs-kpi">
          <span>بازدید صفحه امروز</span>
          <strong>{isLoading ? "…" : fa(overview?.views.today ?? 0)}</strong>
          <em>کل {fa(overview?.views.total ?? 0)}</em>
        </article>
        <article className="rs-kpi">
          <span>سفارش‌ها / محصولات</span>
          <strong>{isLoading ? "…" : fa(overview?.orders.total ?? 0)}</strong>
          <em>{fa(overview?.products ?? 0)} محصول منتشرشده در کاتالوگ</em>
        </article>
      </div>

      <div className="rs-shortcuts">
        <Link className="rs-shortcut" to="/products">
          <b>محصولات</b>
          <span>عکس، قیمت، سایز و انتشار</span>
        </Link>
        <Link className="rs-shortcut" to="/cms">
          <b>محتوای سایت</b>
          <span>خانه، درباره ما و پرسش‌ها</span>
        </Link>
        <Link className="rs-shortcut" to="/customers">
          <b>مشتریان</b>
          <span>کاربران ثبت‌نام‌شده با موبایل</span>
        </Link>
        <Link className="rs-shortcut" to="/orders">
          <b>سفارش‌ها</b>
          <span>پیگیری خرید و وضعیت ارسال</span>
        </Link>
      </div>

      <div className="rs-panels">
        <section className="rs-card">
          <h2>۳۰ روز اخیر · کاربر و بازدید</h2>
          <div style={{ width: "100%", height: 280, direction: "ltr" }}>
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rsVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.bronze} stopOpacity={0.7} />
                    <stop offset="95%" stopColor={PALETTE.bronze} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="rsUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.mocha} stopOpacity={0.7} />
                    <stop offset="95%" stopColor={PALETTE.mocha} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: "#7a6a60", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#7a6a60", fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    fa(value),
                    name === "visitors" ? "بازدیدکننده" : "کاربر جدید",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke={PALETTE.bronze}
                  fill="url(#rsVisitors)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={PALETTE.mocha}
                  fill="url(#rsUsers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rs-card">
          <h2>این هفته</h2>
          <div style={{ width: "100%", height: 280, direction: "ltr" }}>
            <ResponsiveContainer>
              <BarChart data={weekdays} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: "#7a6a60", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#7a6a60", fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    fa(value),
                    name === "visitors" ? "بازدیدکننده" : "کاربر",
                  ]}
                />
                <Bar dataKey="visitors" fill={PALETTE.sage} radius={[8, 8, 0, 0]} />
                <Bar dataKey="users" fill={PALETTE.clay} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="rs-panels" style={{ marginTop: "0.85rem" }}>
        <section className="rs-card">
          <h2>جدول ۳۰ روز اخیر</h2>
          <AdminGrid<DayRow>
            rowData={series}
            columnDefs={dayColumns}
            height={360}
            pagination={true}
          />
        </section>
        <section className="rs-card">
          <h2>صفحات پربازدید این هفته</h2>
          <AdminGrid<PageRow>
            rowData={topPages}
            columnDefs={pageColumns}
            height={360}
          />
        </section>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "داشبورد",
  icon: ChartBar,
  rank: 0,
})

export default DashboardPage
