/**
 * @fileoverview Lightweight HTML sanitizer using the browser's DOMParser.
 * Allows only safe tags and attributes — strips everything else.
 * Replace with DOMPurify if a full-featured sanitizer is ever added to deps.
 */

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "em", "b", "i", "u", "s", "mark", "small", "sub", "sup",
  "a", "img",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "span",
  "figure", "figcaption",
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan"]),
  "*": new Set(["class"]),
}

function sanitizeNode(node: Node, doc: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent || "")
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null

  const el = node as Element
  const tag = el.tagName.toLowerCase()

  if (!ALLOWED_TAGS.has(tag)) {
    // Unwrap children of disallowed tags (keep text, drop the tag)
    const fragment = doc.createDocumentFragment()
    for (const child of Array.from(el.childNodes)) {
      const clean = sanitizeNode(child, doc)
      if (clean) fragment.appendChild(clean)
    }
    return fragment
  }

  const cleanEl = doc.createElement(tag)

  // Copy only allowed attributes
  const allowedForTag = ALLOWED_ATTRS[tag]
  const allowedGlobal = ALLOWED_ATTRS["*"]
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase()
    if (allowedForTag?.has(name) || allowedGlobal?.has(name)) {
      let value = attr.value
      // Block javascript: URLs
      if ((name === "href" || name === "src") && /^\s*javascript:/i.test(value)) {
        continue
      }
      cleanEl.setAttribute(name, value)
    }
  }

  // Force safe link behavior
  if (tag === "a") {
    cleanEl.setAttribute("rel", "noopener noreferrer")
  }

  // Recurse children
  for (const child of Array.from(el.childNodes)) {
    const clean = sanitizeNode(child, doc)
    if (clean) cleanEl.appendChild(clean)
  }

  return cleanEl
}

export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    // SSR fallback: strip dangerous tags but preserve safe structural ones
    // Remove script, style, iframe, object, embed, form, input tags completely
    const stripped = dirty
      .replace(/<(script|style|iframe|object|embed|form|input|textarea|button|select)[\s\S]*?<\/\1>/gi, "")
      .replace(/<(script|style|iframe|object|embed|form|input|textarea|button|select)[^>]*\/?>/gi, "")
    // Remove event handlers (onclick, onerror, etc.)
    return stripped.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
  }

  const parser = new DOMParser()
  const parsed = parser.parseFromString(dirty, "text/html")
  const doc = document.implementation.createHTMLDocument("")
  const container = doc.createElement("div")

  for (const child of Array.from(parsed.body.childNodes)) {
    const clean = sanitizeNode(child, doc)
    if (clean) container.appendChild(clean)
  }

  return container.innerHTML
}
