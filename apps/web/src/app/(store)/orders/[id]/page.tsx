import type { Metadata } from "next"
import { OrderTrackView } from "@/components/store/order-track-view"
import { messages } from "@/lib/i18n"

export const metadata: Metadata = {
  title: `${messages.track.nav} | ${messages.meta.title}`,
  description: messages.track.metaDescription,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

type OrderTrackPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderTrackPage({ params }: OrderTrackPageProps) {
  const { id } = await params

  return <OrderTrackView orderId={id} />
}
