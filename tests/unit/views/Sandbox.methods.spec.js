jest.mock('@/api/sandbox', () => ({
  getSandboxSummaryData: jest.fn(() =>
    Promise.resolve({
      data: { data: [{ total: 5 }] }
    })
  )
}))

import Sandbox from '@/views/Sandbox.vue'
import { getSandboxSummaryData } from '@/api/sandbox'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Sandbox.vue methods', () => {
  const { methods, computed } = Sandbox

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('computed permission helpers return expected values', () => {
    expect(
      computed.isStatsRender.call({ permissions: { SEARCH_STATS: { hasPermission: true } } })
    ).toBe(true)
    expect(
      computed.isLogsRender.call({ permissions: { SEARCH_LOG: { hasPermission: false } } })
    ).toBe(false)
    expect(
      computed.getDateKey.call({ $store: { state: { auth: { user: { userCompany: { timeZone: 'UTC' } } } } } })
    ).toBe('UTC')
  })

  it('handleListItemClick supports set default, restore default and clear filters actions', () => {
    const setFilterOptions = jest.fn()
    const handleFilter = jest.fn()
    localStorage.setItem('sandboxCompany', 'c1,c2')
    localStorage.setItem('sandboxIntegration', 'VirusTotal,Vmray')
    localStorage.setItem('sandboxDateFormat', 'between')
    localStorage.setItem('sandboxDateOption', '2025-01-01,2025-01-02')
    localStorage.setItem('sandboxDateValue', 'custom')

    const ctx = {
      companyValue: '',
      analysisEngineTypeResourceId: null,
      filteredDateValue: null,
      filteredDateValueRange: null,
      filteredDateValueSelect: { name: 'All Time', value: '' },
      filteredSelectValueDate: '>=',
      setFilterOptions,
      handleFilter
    }

    methods.handleListItemClick.call(ctx, 'Set as default filter')
    expect(setFilterOptions).toHaveBeenCalledTimes(1)

    methods.handleListItemClick.call(ctx, 'Restore default filter')
    expect(ctx.companyValue).toEqual(['c1', 'c2'])
    expect(ctx.analysisEngineTypeResourceId).toEqual(['VirusTotal', 'Vmray'])
    expect(ctx.filteredDateValueSelect.value).toBe('custom')
    expect(handleFilter).toHaveBeenCalledTimes(1)

    methods.handleListItemClick.call(ctx, 'Clear filters')
    expect(ctx.companyValue).toBe('')
    expect(ctx.analysisEngineTypeResourceId).toBe(null)
    expect(ctx.filteredDateValueSelect).toEqual({ name: 'All Time', value: '' })
    expect(handleFilter).toHaveBeenCalledTimes(2)
  })

  it('getDateFilterForTable returns between array or single filter object', () => {
    expect(
      methods.getDateFilterForTable.call(
        { filteredSelectValueDate: 'between' },
        ['2025-01-01', '2025-01-31']
      )
    ).toEqual([
      { FieldName: 'CreateTime', Operator: '>=', Value: '2025-01-01' },
      { FieldName: 'CreateTime', Operator: '<=', Value: '2025-01-31' }
    ])

    expect(
      methods.getDateFilterForTable.call({ filteredSelectValueDate: '>=' }, '2025-01-01')
    ).toEqual({
      FieldName: 'CreateTime',
      Operator: '>=',
      Value: '2025-01-01'
    })
  })

  it('changeDateValueSelect opens custom picker flow and otherwise updates filter then applies', () => {
    jest.useFakeTimers()
    const focus = jest.fn()
    const getByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue({ focus })

    const customCtx = {
      filteredDateValue: 'x',
      filteredDateValueRange: ['a', 'b'],
      filteredDateValueSelect: { name: 'Custom', value: 'custom' },
      filteredDateValueSelectValues: [{}, {}, {}, {}, {}, { name: 'Custom' }],
      menuOpen: false
    }
    const customReturn = methods.changeDateValueSelect.call(customCtx, 'constant')
    jest.advanceTimersByTime(200)

    expect(customReturn).toBe(false)
    expect(customCtx.menuOpen).toBe(true)
    expect(focus).toHaveBeenCalledTimes(1)

    const nonCustomCtx = {
      filteredDateValue: null,
      filteredDateValueRange: [],
      filteredDateValueSelect: { name: 'All time', value: '' },
      filteredSelectValueDate: 'between',
      filteredDateValueSelectValues: [{}, {}, {}, {}, {}, { name: 'x' }],
      summaryOptions: {
        filter: { FilterGroups: [{ FilterItems: [{}, {}, { Value: 'old' }] }] }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      handleFilter: jest.fn()
    }
    methods.changeDateValueSelect.call(nonCustomCtx, 'constant')

    expect(nonCustomCtx.filteredSelectValueDate).toBe('>=')
    expect(nonCustomCtx.filteredDateValueSelectValues[5].name).toBe('Custom')
    expect(nonCustomCtx.summaryOptions.filter.FilterGroups[0].FilterItems[2].Value).toBe('')
    expect(nonCustomCtx.handleFilter).toHaveBeenCalledTimes(1)

    getByIdSpy.mockRestore()
    jest.useRealTimers()
  })

  it('changeDateValue returns false when menu is open, otherwise updates summary filter and refreshes', () => {
    const openCtx = { menuOpen: true }
    expect(methods.changeDateValue.call(openCtx)).toBe(false)

    const closeCtx = {
      menuOpen: false,
      filteredDateValue: '2025-01-01',
      summaryOptions: {
        filter: { FilterGroups: [{ FilterItems: [{}, {}, { Value: '' }] }] }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      getSummaryData: jest.fn()
    }

    methods.changeDateValue.call(closeCtx)
    expect(closeCtx.summaryOptions.filter.FilterGroups[0].FilterItems[2].Value).toBe('2025-01-01')
    expect(closeCtx.getSummaryData).toHaveBeenCalledTimes(1)
  })

  it('getAnalysisEngineTypeResourceId and getDateFilter return mapped values', () => {
    const ctx = {
      analysisEngineTypeResourceId: ['VirusTotal', 'Vmray'],
      integrationTypesEnum: [
        { name: 'VirusTotal', value: 1 },
        { name: 'Vmray', value: 3 }
      ],
      filteredSelectValueDate: 'between',
      filteredDateValueSelect: { value: '' },
      filteredDateValue: null,
      filteredDateValueRange: ['a', 'b']
    }

    expect(methods.getAnalysisEngineTypeResourceId.call(ctx)).toBe('1,3')
    expect(methods.getDateFilter.call(ctx)).toEqual(['a', 'b'])
  })

  it('changeCompanyData and changeEngineType propagate filters to child refs and refresh summary', () => {
    const sandboxLog = { getDatatableListWhenFilterChange: jest.fn() }
    const sandboxStats = { getDatatableListWhenFilterChange: jest.fn() }
    const getSummaryData = jest.fn()
    const baseCtx = {
      companyValue: ['c-1'],
      analysisEngineTypeResourceId: ['VirusTotal'],
      integrationTypesEnum: [{ name: 'VirusTotal', value: 1 }],
      summaryOptions: {
        filter: { FilterGroups: [{ FilterItems: [{ Value: '' }, { Value: '' }, {}] }] }
      },
      $refs: { sandboxLog, sandboxStats },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      getAnalysisEngineTypeResourceId: methods.getAnalysisEngineTypeResourceId,
      getDateFilter: jest.fn(() => 'date-filter'),
      getSummaryData
    }

    methods.changeCompanyData.call(baseCtx)
    expect(baseCtx.summaryOptions.filter.FilterGroups[0].FilterItems[1].Value).toBe('c-1')
    expect(sandboxLog.getDatatableListWhenFilterChange).toHaveBeenCalledWith(
      'c-1',
      '1',
      'date-filter'
    )
    expect(getSummaryData).toHaveBeenCalledTimes(1)

    methods.changeEngineType.call(baseCtx)
    expect(baseCtx.summaryOptions.filter.FilterGroups[0].FilterItems[0].Value).toBe('VirusTotal')
    expect(sandboxStats.getDatatableListWhenFilterChange).toHaveBeenCalledWith(
      'c-1',
      '1',
      'date-filter'
    )
    expect(getSummaryData).toHaveBeenCalledTimes(2)
  })

  it('getSummaryData updates summary and clears loading in finally', async () => {
    const ctx = {
      incidentLoading: false,
      summaryOptions: { filter: {} },
      summaryData: {}
    }

    methods.getSummaryData.call(ctx)
    await flushPromises()

    expect(getSandboxSummaryData).toHaveBeenCalledWith(ctx.summaryOptions)
    expect(ctx.summaryData).toEqual({ total: 5 })
    expect(ctx.incidentLoading).toBe(false)
  })
})
