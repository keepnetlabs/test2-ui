export default async function (html) {
  const sanitizeHtml = await import('sanitize-html')

  return sanitizeHtml.default(html, {
    allowedTags: sanitizeHtml.default.defaults.allowedTags.concat(['img', 'center']),
    allowedAttributes: {
      '*': ['style', 'align', 'width', 'height', 'valign', 'bgcolor'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['style', 'href', 'target'],
      td: ['colspan', 'rowspan']
    },
    allowedSchemes: ['data', 'http', 'https', 'mailto']
  })
}
