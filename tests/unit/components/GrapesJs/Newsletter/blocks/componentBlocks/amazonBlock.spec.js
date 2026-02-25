import amazonBlock from '@/components/GrapesJs/Newsletter/blocks/componentBlocks/amazonBlock'

describe('GrapesJs componentBlocks amazonBlock', () => {
  it('exports default array with tagName and components', () => {
    expect(Array.isArray(amazonBlock)).toBe(true)
    expect(amazonBlock[0].tagName).toBe('div')
    expect(amazonBlock[0]).toHaveProperty('components')
  })
})
