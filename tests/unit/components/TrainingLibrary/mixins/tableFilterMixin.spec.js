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

  it('columnFilterChanged maps Include operator to array and supports filter array input', () => {
    const includeFilter = { key: 'vendor', filterType: 'search', activeValue: [] }
    const dateFilter = { key: 'createTime', filterType: 'date', activeValue: '' }
    const ctx = {
      filters: [includeFilter, dateFilter],
      getFilterKey: methods.getFilterKey,
      setFilterToPayload: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    methods.columnFilterChanged.call(ctx, {
      FieldName: 'vendorName',
      Value: 'Acme,Globex',
      Operator: 'Include'
    })
    expect(includeFilter.activeValue).toEqual(['Acme', 'Globex'])

    methods.columnFilterChanged.call(ctx, [
      { FieldName: 'createTime', Value: '2026-01-01' },
      { FieldName: 'createTime', Value: '2026-01-31' }
    ])
    expect(dateFilter.activeOperator).toBe('between')
    expect(dateFilter.activeValue).toEqual(['2026-01-01', '2026-01-31'])
  })

  it('columnFilterChanged exits when filter key is unknown', () => {
    const ctx = {
      filters: [{ key: 'vendor' }],
      getFilterKey: methods.getFilterKey,
      setFilterToPayload: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    methods.columnFilterChanged.call(ctx, {
      FieldName: 'notExistingField',
      Value: 'x',
      Operator: 'Contains'
    })

    expect(ctx.setFilterToPayload).not.toHaveBeenCalled()
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

  it('columnFilterCleared resets search and date filter branches', () => {
    const searchFilter = { key: 'vendor', filterType: 'search', value: ['a'] }
    const dateFilter = { key: 'createTime', filterType: 'date', value: '2026-01-01' }
    const ctx = {
      filters: [searchFilter, dateFilter],
      getFilterKey: methods.getFilterKey,
      removeFilterFromPayload: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    methods.columnFilterCleared.call(ctx, 'vendorName')
    expect(searchFilter.value).toEqual([])
    expect(searchFilter.activeOperator).toBe('Include')

    methods.columnFilterCleared.call(ctx, 'createTime')
    expect(dateFilter.value).toBe('')
    expect(dateFilter.activeOperator).toBe('=')
  })

  it('columnFilterCleared exits when filter is not found', () => {
    const ctx = {
      filters: [{ key: 'vendor' }],
      getFilterKey: methods.getFilterKey,
      removeFilterFromPayload: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }
    methods.columnFilterCleared.call(ctx, 'missing')
    expect(ctx.removeFilterFromPayload).not.toHaveBeenCalled()
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

  it('addFilterToTable handles unknown operator and missing refTable safely', () => {
    const ctx = {
      filters: [{ key: 'status', activeOperator: 'StartsWith', activeValue: 'Act' }],
      getTableFieldName: methods.getTableFieldName,
      $refs: {}
    }
    expect(() => methods.addFilterToTable.call(ctx)).not.toThrow()
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

  it('sortChanged uses date ordering labels and keeps non-name labels as is', () => {
    const setSortBy = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [{ property: 'createTime', label: 'Date Created' }]
      },
      setSortBy
    }

    methods.sortChanged.call(ctx, {
      prop: 'createTime',
      order: 'descending'
    })

    expect(setSortBy).toHaveBeenCalledWith({
      item: {
        text: 'Date Created',
        orderBy: 'createTime'
      },
      sort: {
        ascending: false,
        text: 'Old to new'
      }
    })
  })
})
