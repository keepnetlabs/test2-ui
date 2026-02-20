import {
  getFormData,
  getFormDataWithObjects,
  setFormData
} from '@/components/Integrations/AdvancedSettings/util'

describe('Integrations AdvancedSettings util', () => {
  it('getFormData filters values by exclusionType', () => {
    const input = [
      { exclusionType: 'URL', value: 'https://a.test' },
      { exclusionType: 'IP', value: '1.1.1.1' },
      { exclusionType: 'URL', value: 'https://b.test' }
    ]

    expect(getFormData(input, 'URL')).toEqual(['https://a.test', 'https://b.test'])
    expect(getFormData(input, 'IP')).toEqual(['1.1.1.1'])
  })

  it('getFormDataWithObjects returns matching full objects', () => {
    const input = [
      { exclusionType: 'IP', value: '1.1.1.1', isEditable: true },
      { exclusionType: 'URL', value: 'https://x.test', isEditable: false }
    ]

    expect(getFormDataWithObjects(input, 'IP')).toEqual([
      { exclusionType: 'IP', value: '1.1.1.1', isEditable: true }
    ])
  })

  it('setFormData normalizes string and object inputs', () => {
    expect(setFormData(['https://a.test'], 'URL')).toEqual([
      { attachmentExtensionType: null, exclusionType: 'URL', value: 'https://a.test' }
    ])

    expect(setFormData([{ value: '2.2.2.2' }], 'IP')).toEqual([
      { attachmentExtensionType: null, exclusionType: 'IP', value: '2.2.2.2' }
    ])
  })
})
