import tableFilterMixin from '@/components/TrainingLibrary/mixins/tableFilterMixin'

describe('tableFilterMixin methods', () => {
  const methods = tableFilterMixin.methods

  it('maps filter keys both directions', () => {
    expect(methods.getFilterKey('vendorName')).toBe('vendor')
    expect(methods.getFilterKey('roles')).toBe('targetAudience')
    expect(methods.getFilterKey('status')).toBe('status')

    expect(methods.getTableFieldName('vendor')).toBe('vendorName')
    expect(methods.getTableFieldName('targetAudience')).toBe('roles')
    expect(methods.getTableFieldName('status')).toBe('status')
  })

  it('columnFilterChanged sets active filter and pushes to payload', () => {
    const activeFilter = { key: 'vendor', filterType: 'select' }
    const ctx = {
      filters: [activeFilter],
      getFilterKey: methods.getFilterKey,
      setFilterToPayload: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    methods.columnFilterChanged.call(ctx, {
      FieldName: 'vendorName',
      Value: 'Acme',
      Operator: 'Contains'
    })

    expect(activeFilter.isFilterActive).toBe(true)
    expect(activeFilter.activeValue).toBe('Acme')
    expect(activeFilter.activeOperator).toBe('Contains')
    expect(ctx.setFilterToPayload).toHaveBeenCalledWith(activeFilter)
  })

  it('columnFilterCleared resets select filter values', () => {
    const activeFilter = {
      key: 'vendor',
      filterType: 'select',
      value: 'x',
      operator: 'Contains'
    }
    const ctx = {
      filters: [activeFilter],
      getFilterKey: methods.getFilterKey,
      removeFilterFromPayload: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    methods.columnFilterCleared.call(ctx, 'vendorName')

    expect(activeFilter.isFilterActive).toBe(false)
    expect(activeFilter.value).toBe('')
    expect(activeFilter.activeValue).toBe('')
    expect(activeFilter.operator).toBe('Contains')
    expect(ctx.removeFilterFromPayload).toHaveBeenCalledWith(activeFilter)
  })

  it('addFilterToTable sends mapped filter object to refTable', () => {
    const reRenderFilters = jest.fn()
    const ctx = {
      filters: [
        { key: 'vendor', activeOperator: 'Contains', activeValue: 'Acme' },
        { key: 'status', activeOperator: 'Include', activeValue: ['Active'] }
      ],
      getTableFieldName: methods.getTableFieldName,
      $refs: { refTable: { reRenderFilters } }
    }

    methods.addFilterToTable.call(ctx)

    expect(reRenderFilters).toHaveBeenCalled()
    const payload = reRenderFilters.mock.calls[0][0]
    expect(payload.vendorName.fieldName).toBe('vendorName')
    expect(payload.vendorName.selectValue).toBe('Contains')
    expect(payload.status.selectValue).toBe('Active')
  })

  it('sortChanged builds sort payload and normalizes Name labels', () => {
    const setSortBy = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [{ property: 'trainingName', label: 'Training Name' }]
      },
      setSortBy
    }

    methods.sortChanged.call(ctx, {
      prop: 'trainingName',
      order: 'ascending'
    })

    expect(setSortBy).toHaveBeenCalledWith({
      item: {
        text: 'Material Name',
        orderBy: 'trainingName'
      },
      sort: {
        ascending: true,
        text: 'A to Z'
      }
    })
  })
})
