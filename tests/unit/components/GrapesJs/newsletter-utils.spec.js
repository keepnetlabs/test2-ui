import {
  getTraits,
  getComponentTypeDefaultParams,
  setBlocksCategories
} from '@/components/GrapesJs/Newsletter/utils'

describe('GrapesJs Newsletter utils', () => {
  it('getTraits returns expected trait set with provided merge tag options', () => {
    const options = [{ value: '{FULLNAME}', name: 'Full Name' }]
    const traits = getTraits(options)

    expect(traits).toHaveLength(4)
    expect(traits[3].name).toBe('href')
    expect(traits[3].options).toEqual(options)
  })

  it('getComponentTypeDefaultParams builds defaults from args', () => {
    expect(getComponentTypeDefaultParams()).toEqual({
      model: { defaults: { droppable: false, editable: false } }
    })
    expect(getComponentTypeDefaultParams(true, true)).toEqual({
      model: { defaults: { droppable: true, editable: true } }
    })
  })

  it('setBlocksCategories mutates categories and form customId', () => {
    const blocks = [
      { attributes: { id: 'button' } },
      { attributes: { id: 'form' } },
      { attributes: { id: 'unknown-custom' } }
    ]

    setBlocksCategories(blocks)

    expect(blocks[0].attributes.category).toEqual({ label: 'Basic' })
    expect(blocks[1].attributes.category).toEqual({ label: 'Forms' })
    expect(blocks[1].attributes.customId).toBe('grapesForm')
    expect(blocks[2].attributes.category).toEqual({ label: 'Components' })
  })
})
