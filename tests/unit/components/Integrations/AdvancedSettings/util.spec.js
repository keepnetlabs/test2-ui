import {
  getFormData,
  getFormDataWithObjects,
  setFormData
} from '@/components/Integrations/AdvancedSettings/util'

describe('Integrations AdvancedSettings util', () => {
  const source = [
    { exclusionType: 'IP', value: '1.1.1.1' },
    { exclusionType: 'DOMAIN', value: 'example.com' },
    { exclusionType: 'IP', value: '2.2.2.2' }
  ]

  it('getFormData returns only values for the requested exclusion type', () => {
    expect(getFormData(source, 'IP')).toEqual(['1.1.1.1', '2.2.2.2'])
    expect(getFormData(source, 'DOMAIN')).toEqual(['example.com'])
    expect(getFormData(source, 'NONE')).toEqual([])
  })

  it('getFormDataWithObjects returns matching objects', () => {
    const result = getFormDataWithObjects(source, 'IP')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ exclusionType: 'IP', value: '1.1.1.1' })
  })

  it('setFormData maps values into payload objects', () => {
    expect(setFormData(['a', 'b'], 'DOMAIN')).toEqual([
      { attachmentExtensionType: null, exclusionType: 'DOMAIN', value: 'a' },
      { attachmentExtensionType: null, exclusionType: 'DOMAIN', value: 'b' }
    ])

    expect(setFormData([{ value: 'x' }], 'IP')).toEqual([
      { attachmentExtensionType: null, exclusionType: 'IP', value: 'x' }
    ])
  })
})
