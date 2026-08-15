import "./styles/theme.css"
import logo from "./assets/logo.png"

const BRAND = "راوی‌استایل"
const MEDUSA_NAME = /\bMedusa(?:\s+(?:Admin|Cloud|API))?\b/gi

function brandify(value: string) {
  return value
    .replace(/\s*-\s*Medusa\s*$/i, ` - ${BRAND}`)
    .replace(/^Medusa$/i, BRAND)
    .replace(MEDUSA_NAME, BRAND)
}

function applyTitle() {
  const next = brandify(document.title)
  if (next !== document.title) {
    document.title = next
  }
}

function applyText(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const parent = node.parentElement
    if (!parent || parent.closest("script, style, code, pre, textarea")) {
      continue
    }
    if (node.nodeValue && MEDUSA_NAME.test(node.nodeValue)) {
      nodes.push(node)
    }
    MEDUSA_NAME.lastIndex = 0
  }

  for (const node of nodes) {
    node.nodeValue = brandify(node.nodeValue || "")
  }

  if (root instanceof Element) {
    for (const el of root.querySelectorAll("[aria-label], [title], [alt]")) {
      for (const attr of ["aria-label", "title", "alt"] as const) {
        const value = el.getAttribute(attr)
        if (value && MEDUSA_NAME.test(value)) {
          el.setAttribute(attr, brandify(value))
        }
        MEDUSA_NAME.lastIndex = 0
      }
    }
  }
}

function applyFavicon() {
  const icon =
    document.querySelector<HTMLLinkElement>("link[rel='icon']") ||
    document.querySelector<HTMLLinkElement>("link[data-placeholder-favicon]")
  if (icon) {
    icon.href = logo
    return
  }
  const link = document.createElement("link")
  link.rel = "icon"
  link.href = logo
  document.head.appendChild(link)
}

function startBranding() {
  window.localStorage.setItem("lng", "fa")
  document.cookie = "lng=fa; path=/; max-age=31536000"
  applyFavicon()
  applyTitle()
  applyText(document.body)

  const observer = new MutationObserver((mutations) => {
    applyTitle()
    for (const mutation of mutations) {
      if (mutation.type === "characterData" && mutation.target.parentNode) {
        applyText(mutation.target.parentNode)
        continue
      }
      for (const node of mutation.addedNodes) {
        applyText(node)
      }
    }
  })

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  })
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startBranding, { once: true })
  } else {
    startBranding()
  }
}
