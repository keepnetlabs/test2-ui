import exampleBlock from '@/components/GrapesJs/Newsletter/blocks/componentBlocks/exampleBlock'

describe('GrapesJs componentBlocks exampleBlock', () => {
  it('exports default array with tagName and components', () => {
    expect(Array.isArray(exampleBlock)).toBe(true)
    expect(exampleBlock[0].tagName).toBe('div')
    expect(exampleBlock[0]).toHaveProperty('components')
  })
})
