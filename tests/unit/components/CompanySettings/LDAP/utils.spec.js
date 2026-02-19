import {
  defaultFieldMappings,
  getDefaultFieldMappingsWithCurrent
} from '@/components/Company Settings/LDAP/utils'

describe('CompanySettings LDAP utils', () => {
  it('exports default field mappings', () => {
    expect(defaultFieldMappings).toHaveLength(6)
    expect(defaultFieldMappings[0]).toEqual({
      text: 'Email',
      customFieldResourceId: 'Email',
      ldapResourceId: ''
    })
  })

  it('merges default mappings with current mappings', () => {
    const current = [
      { customFieldResourceId: 'Email', ldapResourceId: 'mail' },
      { customFieldResourceId: 'CustomFieldX', ldapResourceId: 'x-value' }
    ]
    const merged = getDefaultFieldMappingsWithCurrent(defaultFieldMappings, current)

    const emailMapping = merged.find((m) => m.customFieldResourceId === 'Email')
    const customMapping = merged.find((m) => m.customFieldResourceId === 'CustomFieldX')

    expect(emailMapping.ldapResourceId).toBe('mail')
    expect(emailMapping.text).toBe('Email')
    expect(customMapping.text).toBe('CustomFieldX')
    expect(customMapping.ldapResourceId).toBe('x-value')
  })
})
