import MapCustomAndSCIMFieldsItem from '@/components/Company Settings/SCIM/MapCustomAndSCIMFieldsItem.vue'

describe('MapCustomAndSCIMFieldsItem.vue', () => {
  it('has correct component name', () => {
    expect(MapCustomAndSCIMFieldsItem.name).toBe('MapCustomAndSCIMFieldsItem')
  })

  it('handleDeleteClick emits on-delete with index', () => {
    const ctx = { index: 3, $emit: jest.fn() }
    MapCustomAndSCIMFieldsItem.methods.handleDeleteClick.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', 3)
  })

  it('handleScimFieldChange emits field change and input payload', () => {
    const ctx = {
      value: {
        customFieldResourceId: 'custom-1',
        scimFieldResourceId: 'scim-old'
      },
      $emit: jest.fn()
    }
    MapCustomAndSCIMFieldsItem.methods.handleScimFieldChange.call(ctx, 'scim-new')
    expect(ctx.$emit).toHaveBeenCalledWith('on-scim-field-change', 'scim-new', 'scim-old')
    expect(ctx.$emit).toHaveBeenCalledWith('input', {
      customFieldResourceId: 'custom-1',
      scimFieldResourceId: 'scim-new'
    })
  })

  it('handleCustomFieldChange emits field change and input payload', () => {
    const ctx = {
      value: {
        customFieldResourceId: 'custom-old',
        scimFieldResourceId: 'scim-1'
      },
      $emit: jest.fn()
    }
    MapCustomAndSCIMFieldsItem.methods.handleCustomFieldChange.call(ctx, 'custom-new')
    expect(ctx.$emit).toHaveBeenCalledWith('on-custom-field-change', 'custom-new', 'custom-old')
    expect(ctx.$emit).toHaveBeenCalledWith('input', {
      customFieldResourceId: 'custom-new',
      scimFieldResourceId: 'scim-1'
    })
  })
})
