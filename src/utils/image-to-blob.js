const imageToUri = function (url, mimeType, cb) {
  const canvas = document.createElement('canvas'),
    img = document.createElement('img')
  if (typeof mimeType === 'function') {
    cb = mimeType
    mimeType = null
  }
  mimeType = mimeType || 'image/png'
  img.crossOrigin = 'Anonymous'
  img.onload = function () {
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    cb(null, canvas.toDataURL(mimeType))
  }
  img.onerror = function () {
    cb(new Error('FailedToLoadImage'))
  }
  if (!canvas.getContext) {
    cb(new Error('CanvasIsNotSupported'))
  } else {
    img.src = url
  }
}

const types = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml' // this gets converted to png
}

export default function imageToBlob(img, options, callback) {
  let src
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = options || {}

  if (!img) {
    return callback(new Error('Pass in a IMG DOM node or a url as first param'))
  }

  if (typeof img === 'object' && img.tagName.toLowerCase() === 'img') {
    src = img.src
  }

  if (typeof img === 'string') {
    src = img
  }

  if (src?.startsWith('data:') && !options.convert) {
    // check to see if its a data uri
    callback(null, dataURItoBlob(src)) // script to datauri conversion
    return
  }

  options.type = types[options.type] || getType(src)
  options.src = src
  options.callback = callback
  if (!options.type) {
    callback(new Error('Image type is not supported'))
    return
  }

  imageToUri(src, options.type, handleImageToURI.bind(null, options)) // attempt if we have a
}

function dataURItoBlob(uri) {
  let byteString, mimeString

  if (uri?.split(',')[0].indexOf('base64') >= 0) {
    //atob(uri.split(',')[1])
    byteString = Buffer.from(uri?.split(',')[1], 'base64')
  } else {
    byteString = decodeURI(uri?.split(',')[1])
  }

  mimeString = uri?.split(',')?.[0]?.split(':')?.[1]?.split(';')?.[0]

  return new Blob([byteString], {
    type: mimeString
  })
}

function handleImageToURI(options, err, uri) {
  if (err) {
    options.callback(err)
    return
  }

  options.callback(null, dataURItoBlob(uri))
}

function getType(url) {
  return url ? types[url?.split('?')?.shift()?.split('.')?.pop()] : null
}
