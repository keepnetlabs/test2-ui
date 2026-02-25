import LDAPFieldMappings from '@/components/Company Settings/LDAP/LDAPFieldMappings.vue'

describe('LDAPFieldMappings.vue', () => {
  it('has correct component name', () => {
    expect(LDAPFieldMappings.name).toBe('LDAPFieldMappings')
  })

  it('getSubmitButtonStyle returns disabled style when no permission', () => {
    const style = LDAPFieldMappings.computed.getSubmitButtonStyle.call({
      isLoading: false,
      isLoadingFromParent: false,
      getLDAPSettingCreatePermission: false,
      mappingData: {},
      initialMappingData: {}
    })
    expect(style.opacity).toBe('0.5')
  })

  it('getSubmitButtonStyle returns disabled style when data unchanged', () => {
    const style = LDAPFieldMappings.computed.getSubmitButtonStyle.call({
      isLoading: false,
      isLoadingFromParent: false,
      getLDAPSettingCreatePermission: true,
      mappingData: { a: 1 },
      initialMappingData: { a: 1 }
    })
    expect(style.pointerEvents).toBe('none')
  })

  it('handleMapTableSelectChange clears required mapping when none selected', async () => {
    const fieldMappings = [{ customFieldResourceId: 'Email', ldapFieldResourceId: 'ldap-1' }]
    const customFields = [{ name: 'Email', customFieldResourceId: 'Email' }]
    const ctx = {
      fieldMappings,
      customFields,
      setLoading: jest.fn(),
      callForData: jest.fn(() => Promise.resolve())
    }
    LDAPFieldMappings.methods.handleMapTableSelectChange.call(ctx, {
      name: 'None Selected',
      header: { name: 'Email' }
    })
    await Promise.resolve()
    expect(ctx.fieldMappings[0].ldapFieldResourceId).toBe('')
  })

  it('handleMapTableSelectChange pushes new mapping when not existing', async () => {
    const ctx = {
      fieldMappings: [],
      customFields: [{ name: 'Office', customFieldResourceId: 'cf-1' }],
      setLoading: jest.fn(),
      callForData: jest.fn(() => Promise.resolve())
    }
    LDAPFieldMappings.methods.handleMapTableSelectChange.call(ctx, {
      name: 'Department',
      resourceId: 'ldap-dept',
      header: { name: 'Office', customFieldResourceId: 'cf-1' }
    })
    await Promise.resolve()
    expect(ctx.fieldMappings).toEqual([
      { customFieldResourceId: 'cf-1', ldapFieldResourceId: 'ldap-dept' }
    ])
  })

  it('handleSubmit emits filtered field mappings', () => {
    const ctx = {
      fieldMappings: [
        { customFieldResourceId: 'a', ldapFieldResourceId: 'x' },
        { customFieldResourceId: 'b', ldapFieldResourceId: '' }
      ],
      $emit: jest.fn()
    }
    LDAPFieldMappings.methods.handleSubmit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-submit', {
      fieldMappings: [{ customFieldResourceId: 'a', ldapFieldResourceId: 'x' }]
    })
  })
})
