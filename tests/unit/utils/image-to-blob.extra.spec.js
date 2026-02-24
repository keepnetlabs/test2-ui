describe('image-to-blob.js (extra coverage)', () => {
  let imageToBlob

  beforeEach(() => {
    jest.resetModules()
    imageToBlob = require('@/utils/image-to-blob').default
  })

  it('calls callback with error when img is null', () => {
    const cb = jest.fn()
    imageToBlob(null, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
    expect(cb.mock.calls[0][0].message).toContain('IMG DOM node')
  })

  it('calls callback with error when img is undefined', () => {
    const cb = jest.fn()
    imageToBlob(undefined, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })

  it('handles data URI without convert option - returns blob via callback', (done) => {
    const dataUri = 'data:image/png;base64,iVBORw0KGgo='
    imageToBlob(dataUri, { convert: false }, (err, blob) => {
      expect(err).toBeNull()
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('image/png')
      done()
    })
  })

  it('handles data URI with base64 encoding', (done) => {
    const base64 = Buffer.from('test').toString('base64')
    const dataUri = `data:image/png;base64,${base64}`
    imageToBlob(dataUri, { convert: false }, (err, blob) => {
      expect(err).toBeNull()
      expect(blob).toBeInstanceOf(Blob)
      done()
    })
  })

  it('calls callback with error for unsupported image type', (done) => {
    imageToBlob('https://x.com/image.xyz', (err) => {
      expect(err).toBeTruthy()
      expect(err.message).toContain('not supported')
      done()
    })
  })

  it('handles data URI without base64 encoding', (done) => {
    const dataUri = 'data:image/png,test%20data'
    imageToBlob(dataUri, { convert: false }, (err, blob) => {
      expect(err).toBeNull()
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('image/png')
      done()
    })
  })
})
