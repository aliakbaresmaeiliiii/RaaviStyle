import {
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type RowClickedEvent,
} from "ag-grid-community"
import { AgGridProvider, AgGridReact } from "ag-grid-react"

const modules = [AllCommunityModule]

const theme = themeQuartz.withParams({
  fontFamily: "Vazirmatn, Tahoma, Segoe UI, Noto Sans Arabic, sans-serif",
  accentColor: "#c4a574",
  backgroundColor: "#fffdf8",
  foregroundColor: "#1c1410",
  headerBackgroundColor: "#1c1410",
  headerTextColor: "#f6f0e6",
  borderColor: "rgba(196, 165, 116, 0.28)",
  oddRowBackgroundColor: "#f7f1e8",
  rowHoverColor: "rgba(196, 165, 116, 0.16)",
  selectedRowBackgroundColor: "rgba(164, 120, 100, 0.18)",
  borderRadius: 12,
  wrapperBorderRadius: 16,
  spacing: 8,
})

const localeText = {
  page: "صفحه",
  more: "بیشتر",
  to: "تا",
  of: "از",
  next: "بعدی",
  last: "آخر",
  first: "اول",
  previous: "قبلی",
  loadingOoo: "در حال بارگذاری…",
  noRowsToShow: "داده‌ای نیست",
  filterOoo: "فیلتر…",
  searchOoo: "جستجو…",
  blanks: "خالی",
  equals: "برابر",
  notEqual: "نابرابر",
  contains: "شامل",
  notContains: "بدون",
  startsWith: "شروع با",
  endsWith: "پایان با",
}

type AdminGridProps<T> = {
  rowData: T[]
  columnDefs: ColDef<T>[]
  height?: number
  pagination?: boolean
  onRowClicked?: (event: RowClickedEvent<T>) => void
}

export function AdminGrid<T>({
  rowData,
  columnDefs,
  height = 320,
  pagination = false,
  onRowClicked,
}: AdminGridProps<T>) {
  return (
    <AgGridProvider modules={modules}>
      <div className="rs-ag" style={{ height, width: "100%" }}>
        <AgGridReact<T>
          theme={theme}
          enableRtl={true}
          localeText={localeText}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 90,
          }}
          animateRows={true}
          pagination={pagination}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          suppressCellFocus={true}
          onRowClicked={onRowClicked}
        />
      </div>
    </AgGridProvider>
  )
}
