import Image from "next/image"
import Link from "next/link"
import { messages } from "@/lib/i18n"

export const brandLogoSrc = "/brnading/logo.png"

type BrandLogoProps = {
  className?: string
  href?: string | null
  priority?: boolean
}

export function BrandLogo({
  className = "h-16",
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={brandLogoSrc}
      alt={messages.brand}
      width={1536}
      height={1024}
      className="h-full w-auto object-contain"
      sizes="200px"
      priority={priority}
    />
  )

  const frameClassName = `inline-flex items-center ${className}`.trim()

  if (href === null) {
    return <span className={frameClassName}>{image}</span>
  }

  return (
    <Link href={href} className={frameClassName}>
      {image}
    </Link>
  )
}
