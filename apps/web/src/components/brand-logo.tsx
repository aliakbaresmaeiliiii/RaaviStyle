import Image from "next/image"
import Link from "next/link"
import { messages } from "@/lib/i18n"

export const brandLogoSrc = "/logo.png"


type BrandLogoProps = {
  className?: string
  href?: string | null
  priority?: boolean
  onDark?: boolean
}

export function BrandLogo({
  className = "h-16",
  href = "/",
  priority = false,
  onDark = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={brandLogoSrc}
      alt={messages.brand}
      width={999}
      height={819}
      unoptimized
      priority={priority}
      className={`${className} w-auto object-contain`}
      style={{ width: "auto" }}
      sizes="280px"
    />
  )

  const frameClassName = onDark
    ? "inline-flex shrink-0 items-center"
    : "inline-flex items-center rounded-xl  px-1.5 py-0.5 dark:bg-transparent dark:px-0 dark:py-0"

  if (href === null) {
    return <span className={frameClassName}>{image}</span>
  }

  return (
    <Link href={href} className={frameClassName}>
      {image}
    </Link>
  )
}
