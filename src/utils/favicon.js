const appendCacheBust = (url) => {
  if (!url) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${Date.now()}`
}

const updateOrCreateLink = (rel, href) => {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

const replaceLink = (rel, href) => {
  const existingLinks = document.querySelectorAll(`link[rel="${rel}"]`)
  existingLinks.forEach((link) => link.remove())
  const link = document.createElement('link')
  link.rel = rel
  link.href = href
  document.head.appendChild(link)
}

export const updateFavicon = (faviconUrl, options = {}) => {
  if (!faviconUrl || typeof document === 'undefined') return
  const { cacheBust = true } = options
  const href = cacheBust ? appendCacheBust(faviconUrl) : faviconUrl

  updateOrCreateLink('icon', href)
  replaceLink('apple-touch-icon', href)
  replaceLink('shortcut icon', href)
}
