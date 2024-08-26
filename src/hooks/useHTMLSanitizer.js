import sanitizeHtml from 'sanitize-html'
export default function (html) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'center']),
    allowedAttributes: {
      '*': ['style', 'align', 'width', 'height', 'valign', 'bgcolor'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['style', 'href', 'target'],
      td: ['colspan', 'rowspan']
    },
    allowedSchemes: ['data', 'http', 'https', 'mailto']
  })
}
