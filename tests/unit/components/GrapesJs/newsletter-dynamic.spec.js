const fs = require('fs')
const path = require('path')

describe('GrapesJs newsletter dynamic modules', () => {
  const root = process.cwd()
  const mergedTextsDir = path.join(root, 'src/components/GrapesJs/Newsletter/mergedTexts')
  const mergedBlocksDir = path.join(
    root,
    'src/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks'
  )
  const componentsDir = path.join(root, 'src/components/GrapesJs/Newsletter/components')

  it('all mergedTexts modules export merge tag config objects', () => {
    const files = fs.readdirSync(mergedTextsDir).filter((f) => f.endsWith('.js'))
    expect(files.length).toBeGreaterThan(50)

    files.forEach((file) => {
      const modulePath = path.join(mergedTextsDir, file)
      const exported = require(modulePath).default
      expect(exported).toBeTruthy()
      expect(typeof exported).toBe('object')
      expect(exported.category).toBe('Merge Tags')
      expect(exported.content).toBeTruthy()
      expect(typeof exported.content).toBe('object')
      expect(
        exported.content.components || exported.content.tagName || exported.content.attributes
      ).toBeTruthy()
    })
  })

  it('all mergedTextsBlocks modules export token arrays', () => {
    const files = fs.readdirSync(mergedBlocksDir).filter((f) => f.endsWith('.js'))
    expect(files.length).toBeGreaterThan(50)

    files.forEach((file) => {
      const modulePath = path.join(mergedBlocksDir, file)
      const exported = require(modulePath).default
      expect(Array.isArray(exported)).toBe(true)
      expect(exported.length).toBeGreaterThan(0)
      expect(exported[0]).toBeTruthy()
    })
  })

  it('all newsletter component modules export objects with content', () => {
    const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.js'))
    expect(files.length).toBeGreaterThanOrEqual(5)

    files.forEach((file) => {
      const modulePath = path.join(componentsDir, file)
      const exported = require(modulePath).default
      expect(exported).toBeTruthy()
      expect(typeof exported).toBe('object')
      expect(exported.label).toBeTruthy()
      expect(exported.category).toBeTruthy()
      expect(exported.content).toBeTruthy()
    })
  })
})
