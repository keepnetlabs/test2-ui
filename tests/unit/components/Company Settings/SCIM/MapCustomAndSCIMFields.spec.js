import MapCustomAndSCIMFields from '@/components/Company Settings/SCIM/MapCustomAndSCIMFields.vue'

describe('MapCustomAndSCIMFields.vue', () => {
  it('has correct component name', () => {
    expect(MapCustomAndSCIMFields.name).toBe('MapCustomAndSCIMFields')
  })

  it('isEmptyMessageRendered returns true when there is no mapping', () => {
    expect(MapCustomAndSCIMFields.computed.isEmptyMessageRendered.call({ fieldMappings: [] })).toBe(
      true
    )
  })

  it('handleCustomFieldChange updates disabled flags for new and old values', () => {
    const customFields = [
      { value: 'c1', disabled: false },
      { value: 'c2', disabled: true }
    ]
    const ctx = {
      customFields,
      getCustomFieldIndexByValue: MapCustomAndSCIMFields.methods.getCustomFieldIndexByValue,
      changeCustomFieldItemDisability: MapCustomAndSCIMFields.methods.changeCustomFieldItemDisability,
      $set: (arr, index, value) => {
        arr[index] = value
      }
    }
    MapCustomAndSCIMFields.methods.handleCustomFieldChange.call(ctx, 'c1', 'c2')
    expect(ctx.customFields[0].disabled).toBe(true)
    expect(ctx.customFields[1].disabled).toBe(false)
  })

  it('handleScimFieldChange updates disabled flags for new and old values', () => {
    const scimFields = [
      { value: 's1', disabled: false },
      { value: 's2', disabled: true }
    ]
    const ctx = {
      scimFields,
      getScimFieldIndexByValue: MapCustomAndSCIMFields.methods.getScimFieldIndexByValue,
      changeScimFieldDisability: MapCustomAndSCIMFields.methods.changeScimFieldDisability,
      $set: (arr, index, value) => {
        arr[index] = value
      }
    }
    MapCustomAndSCIMFields.methods.handleScimFieldChange.call(ctx, 's1', 's2')
    expect(ctx.scimFields[0].disabled).toBe(true)
    expect(ctx.scimFields[1].disabled).toBe(false)
  })

  it('handleItemDelete enables previous selections and removes item', () => {
    const customFields = [{ value: 'c1', disabled: true }]
    const scimFields = [{ value: 's1', disabled: true }]
    const fieldMappings = [{ customFieldResourceId: 'c1', scimFieldResourceId: 's1' }]
    const ctx = {
      customFields,
      scimFields,
      fieldMappings,
      getCustomFieldIndexByValue: MapCustomAndSCIMFields.methods.getCustomFieldIndexByValue,
      getScimFieldIndexByValue: MapCustomAndSCIMFields.methods.getScimFieldIndexByValue,
      changeCustomFieldItemDisability: MapCustomAndSCIMFields.methods.changeCustomFieldItemDisability,
      changeScimFieldDisability: MapCustomAndSCIMFields.methods.changeScimFieldDisability,
      $set: (arr, index, value) => {
        arr[index] = value
      }
    }
    MapCustomAndSCIMFields.methods.handleItemDelete.call(ctx, 0)
    expect(ctx.customFields[0].disabled).toBe(false)
    expect(ctx.scimFields[0].disabled).toBe(false)
    expect(ctx.fieldMappings).toHaveLength(0)
  })
})
