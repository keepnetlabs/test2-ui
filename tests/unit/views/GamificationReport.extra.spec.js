jest.mock('@/api/reports', () => ({
  getLeaderboardData: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  getTopPerformersData: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  exportLeaderboardData: jest.fn(),
  getLeaderboardFormDetails: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn()
  }
}))

import GamificationReport from '@/views/GamificationReport.vue'
import { getLeaderboardData, getTopPerformersData, getLeaderboardFormDetails } from '@/api/reports'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import axios from 'axios'
import AuthenticationService from '@/services/authentication'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('GamificationReport.vue (extra)', () => {
  const { methods, watch, created, data, computed } = GamificationReport

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created calls initial data loaders', () => {
    const ctx = {
      callForData: jest.fn(),
      callForTopPerformers: jest.fn(),
      callForFormDetails: jest.fn(),
      callForLanguages: jest.fn()
    }

    created.call(ctx)

    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.callForTopPerformers).toHaveBeenCalledTimes(1)
    expect(ctx.callForFormDetails).toHaveBeenCalledTimes(1)
    expect(ctx.callForLanguages).toHaveBeenCalledTimes(1)
  })

  it('selectedDateRange watcher ignores invalid values and processes valid range', () => {
    const ctx = {
      axiosPayload: { startDate: null, endDate: null },
      callForData: jest.fn(),
      callForTopPerformers: jest.fn()
    }

    watch.selectedDateRange.handler.call(ctx, null)
    watch.selectedDateRange.handler.call(ctx, ['only-one'])
    expect(ctx.callForData).not.toHaveBeenCalled()
    expect(ctx.callForTopPerformers).not.toHaveBeenCalled()

    watch.selectedDateRange.handler.call(ctx, ['2026-01-01', '2026-01-31'])
    expect(ctx.axiosPayload.startDate).toBe('2026-01-01')
    expect(ctx.axiosPayload.endDate).toBe('2026-01-31')
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.callForTopPerformers).toHaveBeenCalledTimes(1)
  })

  it('getDateRangeText returns empty when split side is not a valid string', () => {
    expect(
      computed.getDateRangeText.call({
        selectedDateRange: [{}, '2026-02-01 00:00']
      })
    ).toBe('')
  })

  it('getDateRangeText returns formatted range for valid values', () => {
    expect(
      computed.getDateRangeText.call({
        selectedDateRange: ['2026-02-01 00:00', '2026-02-28 23:59']
      })
    ).toBe('2026-02-01 - 2026-02-28')
  })

  it('getDatePayload returns date fields from axios payload', () => {
    const result = computed.getDatePayload.call({
      axiosPayload: {
        datePeriod: 'LastMonth',
        startDate: '2026-01-01',
        endDate: '2026-01-31'
      }
    })

    expect(result).toEqual({
      datePeriod: 'LastMonth',
      startDate: '2026-01-01',
      endDate: '2026-01-31'
    })
  })

  it('data() adds Autonomous AI row action on localhost', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'localhost' },
      configurable: true
    })

    const momentMock = () => ({
      subtract: () => ({ format: () => '2026-01-01 00:00' }),
      format: () => '2026-02-01 00:00'
    })
    const result = data.call({ $moment: momentMock })

    expect(result.tableOptions.rowActions.some((a) => a.action === 'on-send-with-ai')).toBe(true)

    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('data() always includes details row action', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'app.keepnetlabs.com' },
      configurable: true
    })

    const momentMock = () => ({
      subtract: () => ({ format: () => '2026-01-01 00:00' }),
      format: () => '2026-02-01 00:00'
    })
    const result = data.call({ $moment: momentMock })

    expect(result.tableOptions.rowActions.some((a) => a.action === 'on-details')).toBe(true)

    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('data() does not add Autonomous AI row action on production-like host', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'app.keepnetlabs.com' },
      configurable: true
    })

    const momentMock = () => ({
      subtract: () => ({ format: () => '2026-01-01 00:00' }),
      format: () => '2026-02-01 00:00'
    })
    const result = data.call({ $moment: momentMock })

    expect(result.tableOptions.rowActions.some((a) => a.action === 'on-send-with-ai')).toBe(false)

    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('data() adds Autonomous AI row action on test-ui host', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'test-ui.devkeepnet.com' },
      configurable: true
    })

    const momentMock = () => ({
      subtract: () => ({ format: () => '2026-01-01 00:00' }),
      format: () => '2026-02-01 00:00'
    })
    const result = data.call({ $moment: momentMock })

    expect(result.tableOptions.rowActions.some((a) => a.action === 'on-send-with-ai')).toBe(true)

    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('picker onPick updates datePeriod and formats selected range when both dates exist', () => {
    const momentMock = () => ({
      subtract: () => ({ format: () => '2026-01-01 00:00' }),
      format: () => '2026-02-01 00:00'
    })
    const ctx = {
      $moment: momentMock,
      axiosPayload: { datePeriod: null },
      $refs: {
        refInputDate: {
          formatToValue: jest.fn(() => ['2026-01-01', '2026-01-31'])
        }
      }
    }
    const result = data.call(ctx)
    ctx.axiosPayload = { ...result.axiosPayload }

    result.pickerOptions.onPick({
      minDate: new Date('2026-01-01'),
      maxDate: new Date('2026-01-31')
    })

    expect(ctx.date).toEqual(['2026-01-01', '2026-01-31'])
    expect(ctx.axiosPayload.datePeriod).toBeTruthy()
  })

  it('picker onPick still sets custom date period when only one boundary exists', () => {
    const momentMock = () => ({
      subtract: () => ({ format: () => '2026-01-01 00:00' }),
      format: () => '2026-02-01 00:00'
    })
    const ctx = {
      $moment: momentMock,
      axiosPayload: { datePeriod: null },
      $refs: {
        refInputDate: {
          formatToValue: jest.fn()
        }
      }
    }
    const result = data.call(ctx)
    ctx.axiosPayload = { ...result.axiosPayload }

    result.pickerOptions.onPick({
      minDate: new Date('2026-01-01'),
      maxDate: null
    })

    expect(ctx.$refs.refInputDate.formatToValue).not.toHaveBeenCalled()
    expect(ctx.axiosPayload.datePeriod).toBeTruthy()
  })

  it('callForData returns early when search permission is missing', () => {
    const ctx = {
      getGamificationReportSearchPermissions: false,
      setLoading: jest.fn(),
      axiosPayload: {}
    }

    methods.callForData.call(ctx)

    expect(ctx.setLoading).not.toHaveBeenCalled()
    expect(getLeaderboardData).not.toHaveBeenCalled()
  })

  it('callForTopPerformers returns early when permission is missing', () => {
    const ctx = {
      getGamificationReportTopPerformersPermissions: false
    }

    methods.callForTopPerformers.call(ctx)
    expect(getTopPerformersData).not.toHaveBeenCalled()
  })

  it('handleDateRangeChange ignores invalid payload and processes valid range', () => {
    const ctx = {
      axiosPayload: { startDate: null, endDate: null },
      callForData: jest.fn(),
      callForTopPerformers: jest.fn()
    }

    methods.handleDateRangeChange.call(ctx, [])
    expect(ctx.callForData).not.toHaveBeenCalled()
    expect(ctx.callForTopPerformers).not.toHaveBeenCalled()

    methods.handleDateRangeChange.call(ctx, ['2026-02-01', '2026-02-28'])
    expect(ctx.axiosPayload.startDate).toBe('2026-02-01')
    expect(ctx.axiosPayload.endDate).toBe('2026-02-28')
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.callForTopPerformers).toHaveBeenCalledTimes(1)
  })

  it('disabledDates returns true for too old/future dates and false for recent past', () => {
    const now = new Date()
    const tooOld = new Date()
    tooOld.setFullYear(tooOld.getFullYear() - 2)
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const recentPast = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    expect(methods.disabledDates.call({}, tooOld)).toBe(true)
    expect(methods.disabledDates.call({}, future)).toBe(true)
    expect(methods.disabledDates.call({}, recentPast)).toBe(false)
  })

  it('handleDateRangeClick forwards to InputDate.showPicker', () => {
    const showPicker = jest.fn()
    methods.handleDateRangeClick.call({
      $refs: { refInputDate: { showPicker } }
    })
    expect(showPicker).toHaveBeenCalled()
  })

  it('callForFormDetails maps response data to formDetails', async () => {
    getLeaderboardFormDetails.mockResolvedValueOnce({
      data: { data: { periods: ['LastMonth'] } }
    })
    const ctx = { formDetails: null }

    methods.callForFormDetails.call(ctx)
    await flushPromises()

    expect(ctx.formDetails).toEqual({ periods: ['LastMonth'] })
  })

  it('callForFormDetails falls back to empty array when response is malformed', async () => {
    getLeaderboardFormDetails.mockResolvedValueOnce({})
    const ctx = { formDetails: null }

    methods.callForFormDetails.call(ctx)
    await flushPromises()

    expect(ctx.formDetails).toEqual([])
  })

  it('callForTopPerformers maps results and clears loading', async () => {
    getTopPerformersData.mockResolvedValueOnce({
      data: { data: { results: [{ targetUserResourceId: 'u-1' }] } }
    })
    const ctx = {
      getGamificationReportTopPerformersPermissions: true,
      isTopPerformersLoading: false,
      axiosPayload: { datePeriod: 'LastMonth', startDate: null, endDate: null },
      topPerformers: []
    }

    methods.callForTopPerformers.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.topPerformers).toEqual([{ targetUserResourceId: 'u-1' }])
    expect(ctx.isTopPerformersLoading).toBe(false)
  })

  it('callForTopPerformers falls back to empty list on malformed response', async () => {
    getTopPerformersData.mockResolvedValueOnce({})
    const ctx = {
      getGamificationReportTopPerformersPermissions: true,
      isTopPerformersLoading: false,
      axiosPayload: { datePeriod: 'LastMonth', startDate: null, endDate: null },
      topPerformers: [{ targetUserResourceId: 'old' }]
    }

    methods.callForTopPerformers.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.topPerformers).toEqual([])
    expect(ctx.isTopPerformersLoading).toBe(false)
  })


  it('callForLanguages updates preferredLanguage filter items and rerenders table filters', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: '1' }
    ])
    const reRenderFilters = jest.fn()
    const preferredLanguageColumn = { property: 'preferredLanguage' }
    const ctx = {
      tableOptions: { columns: [preferredLanguageColumn] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      $refs: {
        refTable: { reRenderFilters }
      }
    }

    methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.$set).toHaveBeenCalled()
    expect(preferredLanguageColumn.filterableItems).toEqual([{ text: 'English', value: '1' }])
    expect(reRenderFilters).toHaveBeenCalledTimes(1)
  })

  it('handleSearchChange creates OR group if missing and appends fullName filter', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { Condition: 'AND', FilterItems: [] },
            { Condition: 'AND', FilterItems: [] }
          ]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'email', Operator: 'Contains', Value: 'alice' }]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    const orGroup = ctx.axiosPayload.filter.FilterGroups.find((g) => g.Condition === 'OR')
    expect(orGroup).toBeDefined()
    expect(orGroup.FilterItems).toEqual([
      { FieldName: 'fullName', Operator: 'Contains', Value: 'alice' }
    ])
  })

  it('handleSearchChange removes previous fullName filter and does not add a new one for empty search', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { Condition: 'AND', FilterItems: [] },
            { Condition: 'OR', FilterItems: [{ FieldName: 'fullName', Value: 'old' }] }
          ]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'email', Operator: 'Contains', Value: '   ' }]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    const orGroup = ctx.axiosPayload.filter.FilterGroups.find((g) => g.Condition === 'OR')
    expect(orGroup.FilterItems.some((item) => item.FieldName === 'fullName')).toBe(false)
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleSearchChange prioritizes fullName filter value when present in incoming search group', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { Condition: 'AND', FilterItems: [] },
            { Condition: 'OR', FilterItems: [{ FieldName: 'email', Value: 'keep-me' }] }
          ]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'email', Operator: 'Contains', Value: 'mail-value' },
              { FieldName: 'fullName', Operator: 'Contains', Value: 'name-value' }
            ]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    const orGroup = ctx.axiosPayload.filter.FilterGroups.find((g) => g.Condition === 'OR')
    expect(orGroup.FilterItems).toEqual(
      expect.arrayContaining([
        { FieldName: 'email', Operator: 'Contains', Value: 'mail-value' },
        { FieldName: 'fullName', Operator: 'Contains', Value: 'name-value' }
      ])
    )
  })

  it('callForLanguages safely skips when preferredLanguage column is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: '1' }
    ])
    const ctx = {
      tableOptions: { columns: [{ property: 'email' }] },
      $set: jest.fn(),
      $refs: {}
    }

    methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.$set).not.toHaveBeenCalled()
  })

  it('callForLanguages uses name fallback when isoFriendlyName is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: '', name: 'Turkish', resourceId: 'tr' }
    ])
    const preferredLanguageColumn = { property: 'preferredLanguage' }
    const ctx = {
      tableOptions: { columns: [preferredLanguageColumn] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      $refs: {}
    }

    methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(preferredLanguageColumn.filterableItems).toEqual([{ text: 'Turkish', value: 'tr' }])
  })

  it('callForLanguages sets empty filter items when lookup response is empty', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce(undefined)
    const preferredLanguageColumn = { property: 'preferredLanguage' }
    const ctx = {
      tableOptions: { columns: [preferredLanguageColumn] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      $refs: {}
    }

    methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(preferredLanguageColumn.filterableItems).toEqual([])
  })

  it('callForData maps response and does not dispatch badges when user ids are missing', async () => {
    getLeaderboardData.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ performance: 77, targetUserResourceId: null }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getGamificationReportSearchPermissions: true,
      setLoading: jest.fn(),
      axiosPayload: {
        datePeriod: 'LastMonth',
        startDate: null,
        endDate: null,
        filter: { FilterGroups: [] },
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'rank',
        ascending: true
      },
      serverSideProps: {},
      tableData: [],
      $store: { dispatch: jest.fn() }
    }

    methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].performance).toBe('77%')
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('callForData dispatches badge fetch when valid user ids exist', async () => {
    getLeaderboardData.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ performance: 11, targetUserResourceId: 'u-9' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getGamificationReportSearchPermissions: true,
      setLoading: jest.fn(),
      axiosPayload: {
        datePeriod: 'LastMonth',
        startDate: null,
        endDate: null,
        filter: { FilterGroups: [] },
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'rank',
        ascending: true
      },
      serverSideProps: {},
      tableData: [],
      $store: { dispatch: jest.fn() }
    }

    methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.$store.dispatch).toHaveBeenCalledWith('gamificationBadges/fetchBadgesForTable', ['u-9'])
  })

  it('callForData maps zero performance value to percent string', async () => {
    getLeaderboardData.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ performance: 0, targetUserResourceId: null }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getGamificationReportSearchPermissions: true,
      setLoading: jest.fn(),
      axiosPayload: {
        datePeriod: 'LastMonth',
        startDate: null,
        endDate: null,
        filter: { FilterGroups: [] },
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'rank',
        ascending: true
      },
      serverSideProps: {},
      tableData: [],
      $store: { dispatch: jest.fn() }
    }

    methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.tableData[0].performance).toBe('0%')
  })

  it('getBadgesForRow returns badges array and falls back to empty array for non-array', () => {
    const ctx = {
      getBadgesForUser: jest
        .fn()
        .mockReturnValueOnce([{ id: 'b1' }])
        .mockReturnValueOnce(null)
    }

    expect(methods.getBadgesForRow.call(ctx, { targetUserResourceId: 'u-1' })).toEqual([{ id: 'b1' }])
    expect(methods.getBadgesForRow.call(ctx, { targetUserResourceId: 'u-2' })).toEqual([])
  })

  it('getBadgesForRow falls back to empty array when row is missing', () => {
    const ctx = {
      getBadgesForUser: jest.fn(() => null)
    }

    expect(methods.getBadgesForRow.call(ctx, null)).toEqual([])
  })

  it('isBadgesLoadingForRow returns true when user has no cache and badge loading flags are active', () => {
    const ctx = {
      hasValidBadgesCache: jest.fn(() => false),
      isBadgesCalculating: true,
      isBadgesFetching: false
    }

    expect(methods.isBadgesLoadingForRow.call(ctx, { targetUserResourceId: 'u-loading' })).toBe(true)
  })

  it('handleDetails opens drawer and stores selected row', () => {
    const ctx = {
      selectedRow: null,
      isUserDetailsDrawerOpen: false
    }
    const row = { targetUserResourceId: 'u-77' }

    methods.handleDetails.call(ctx, row)

    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.isUserDetailsDrawerOpen).toBe(true)
  })

  it('handleSendWithAI stores row, resets options and opens dialog', () => {
    const ctx = {
      selectedRowForAI: null,
      sendWithAIOptions: { training: false, phishing: false },
      isSendWithAIDialogOpen: false
    }
    const row = { targetUserResourceId: 'u-ai' }

    methods.handleSendWithAI.call(ctx, row)

    expect(ctx.selectedRowForAI).toEqual(row)
    expect(ctx.sendWithAIOptions).toEqual({ training: true, phishing: true })
    expect(ctx.isSendWithAIDialogOpen).toBe(true)
  })

  it('handleCloseSendWithAIDialog closes and resets row/options', () => {
    const ctx = {
      isSendWithAIDialogOpen: true,
      selectedRowForAI: { targetUserResourceId: 'u-ai' },
      sendWithAIOptions: { training: false, phishing: false }
    }

    methods.handleCloseSendWithAIDialog.call(ctx)

    expect(ctx.isSendWithAIDialogOpen).toBe(false)
    expect(ctx.selectedRowForAI).toBeNull()
    expect(ctx.sendWithAIOptions).toEqual({ training: true, phishing: true })
  })

  it('handleCloseDrawer animates and closes drawer state', () => {
    jest.useFakeTimers()
    const drawer = { style: { right: '0' } }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(drawer)
    const ctx = {
      selectedRow: { id: 'x' },
      isUserDetailsDrawerOpen: true
    }

    methods.handleCloseDrawer.call(ctx)

    expect(drawer.style.right).toBe('-100%')
    jest.advanceTimersByTime(250)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isUserDetailsDrawerOpen).toBe(false)

    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('exportLeaderboard maps XLS to Excel and triggers download', async () => {
    const { exportLeaderboardData } = require('@/api/reports')
    exportLeaderboardData.mockResolvedValueOnce({ data: 'file-xls' })
    exportLeaderboardData.mockResolvedValueOnce({ data: 'file-csv' })

    const click = jest.fn()
    const downloadNames = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click }
      Object.defineProperty(link, 'download', {
        set: (val) => downloadNames.push(val)
      })
      return link
    })
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')

    const ctx = {
      axiosPayload: {
        datePeriod: 'LastMonth',
        filter: { FilterGroups: [] },
        orderBy: 'rank',
        ascending: true
      }
    }

    methods.exportLeaderboard.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })

    await flushPromises()
    await flushPromises()

    expect(exportLeaderboardData).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'Excel' }))
    expect(exportLeaderboardData).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'CSV' }))
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)
    expect(downloadNames).toEqual(expect.arrayContaining(['Leaderboard.xlsx', 'Leaderboard.csv']))

    createElementSpy.mockRestore()
  })

  it('exportLeaderboard creates xlsx filename when only XLS is requested', async () => {
    const { exportLeaderboardData } = require('@/api/reports')
    exportLeaderboardData.mockResolvedValueOnce({ data: 'file-xls-only' })

    const click = jest.fn()
    const downloadNames = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click }
      Object.defineProperty(link, 'download', {
        set: (val) => downloadNames.push(val)
      })
      return link
    })
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-xls')

    const ctx = {
      axiosPayload: {
        datePeriod: 'LastMonth',
        filter: { FilterGroups: [] },
        orderBy: 'rank',
        ascending: true
      }
    }

    methods.exportLeaderboard.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 2,
      pageSize: 25
    })

    await flushPromises()
    await flushPromises()

    expect(exportLeaderboardData).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        reportAllPages: false,
        pagination: expect.objectContaining({ pageNumber: 2, pageSize: 25 })
      })
    )
    expect(downloadNames).toEqual(['Leaderboard.xlsx'])
    expect(click).toHaveBeenCalledTimes(1)

    createElementSpy.mockRestore()
  })

  it('handleConfirmSendWithAI catches axios errors and logs them', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-x')
    const postSpy = jest.spyOn(axios, 'post').mockRejectedValue(new Error('fail'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'en',
        targetUserResourceId: 'u1',
        department: 'IT'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, { training: false, phishing: true })
    await flushPromises()
    await flushPromises()

    expect(postSpy).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()
    expect(ctx.handleCloseSendWithAIDialog).not.toHaveBeenCalled()

    tokenSpy.mockRestore()
    postSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  it('handleConfirmSendWithAI builds empty actions when both options are false', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-y')
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'tr',
        targetUserResourceId: 'u2',
        department: 'SOC'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, { training: false, phishing: false })
    await flushPromises()
    await flushPromises()

    const [, body] = postSpy.mock.calls[0]
    expect(body.actions).toEqual([])
    expect(body.sendAfterPhishingSimulation).toBe(false)
    expect(ctx.handleCloseSendWithAIDialog).toHaveBeenCalled()

    tokenSpy.mockRestore()
    postSpy.mockRestore()
  })

  it('handleConfirmSendWithAI sends single action when only training is selected', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-single')
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'en',
        targetUserResourceId: 'u-single',
        department: 'BlueTeam'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, { training: true, phishing: false })
    await flushPromises()
    await flushPromises()

    const [, body] = postSpy.mock.calls[0]
    expect(body.actions).toEqual(['training'])
    expect(body.sendAfterPhishingSimulation).toBe(false)
    expect(ctx.handleCloseSendWithAIDialog).toHaveBeenCalled()

    tokenSpy.mockRestore()
    postSpy.mockRestore()
  })

  it('handleConfirmSendWithAI sends single action when only phishing is selected', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-phishing')
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'en',
        targetUserResourceId: 'u-phishing',
        department: 'RedTeam'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, { training: false, phishing: true })
    await flushPromises()
    await flushPromises()

    const [, body] = postSpy.mock.calls[0]
    expect(body.actions).toEqual(['phishing'])
    expect(body.sendAfterPhishingSimulation).toBe(false)
    expect(ctx.handleCloseSendWithAIDialog).toHaveBeenCalled()

    tokenSpy.mockRestore()
    postSpy.mockRestore()
  })

  it('handleConfirmSendWithAI defaults sendAfterPhishingSimulation to false when missing in dual mode', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-z')
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'en',
        targetUserResourceId: 'u3',
        department: 'Sales'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, { training: true, phishing: true })
    await flushPromises()
    await flushPromises()

    const [, body] = postSpy.mock.calls[0]
    expect(body.actions).toEqual(['training', 'phishing'])
    expect(body.sendAfterPhishingSimulation).toBe(false)

    tokenSpy.mockRestore()
    postSpy.mockRestore()
  })

  it('handleConfirmSendWithAI uses production autonomous endpoint when hostname is not localhost', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-prod')
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'app.keepnetlabs.com' },
      configurable: true
    })

    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'en',
        targetUserResourceId: 'u4',
        department: 'Ops'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, { training: false, phishing: true })
    await flushPromises()
    await flushPromises()

    expect(postSpy).toHaveBeenCalledWith(
      'https://agentic-ai-agent.keepnetlabs.com/autonomous',
      expect.any(Object),
      expect.any(Object)
    )

    tokenSpy.mockRestore()
    postSpy.mockRestore()
    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('handleConfirmSendWithAI uses localhost endpoint and keeps explicit sendAfterPhishingSimulation', async () => {
    const tokenSpy = jest.spyOn(AuthenticationService, 'getToken').mockReturnValue('token-local')
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'localhost' },
      configurable: true
    })

    const ctx = {
      selectedRowForAI: {
        preferredLanguage: 'en',
        targetUserResourceId: 'u5',
        department: 'R&D'
      },
      handleCloseSendWithAIDialog: jest.fn()
    }

    methods.handleConfirmSendWithAI.call(ctx, {
      training: true,
      phishing: true,
      sendAfterPhishingSimulation: true
    })
    await flushPromises()
    await flushPromises()

    expect(postSpy).toHaveBeenCalledWith(
      'http://localhost:4111/autonomous',
      expect.objectContaining({
        actions: ['training', 'phishing'],
        sendAfterPhishingSimulation: true
      }),
      expect.any(Object)
    )
    expect(ctx.handleCloseSendWithAIDialog).toHaveBeenCalled()

    tokenSpy.mockRestore()
    postSpy.mockRestore()
    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('isBadgesLoadingForRow returns false when not loading even without cache', () => {
    const ctx = {
      hasValidBadgesCache: jest.fn(() => false),
      isBadgesCalculating: false,
      isBadgesFetching: false
    }

    expect(methods.isBadgesLoadingForRow.call(ctx, { targetUserResourceId: 'u-x' })).toBe(false)
  })

  it('isBadgesLoadingForRow returns false when cache exists even if loading flags are true', () => {
    const ctx = {
      hasValidBadgesCache: jest.fn(() => true),
      isBadgesCalculating: true,
      isBadgesFetching: true
    }

    expect(methods.isBadgesLoadingForRow.call(ctx, { targetUserResourceId: 'u-cached' })).toBe(
      false
    )
  })

  it('isBadgesLoadingForRow returns true when fetching is active and cache is missing', () => {
    const ctx = {
      hasValidBadgesCache: jest.fn(() => false),
      isBadgesCalculating: false,
      isBadgesFetching: true
    }

    expect(methods.isBadgesLoadingForRow.call(ctx, { targetUserResourceId: 'u-fetching' })).toBe(
      true
    )
  })

  it('isBadgesLoadingForRow returns false when row has no targetUserResourceId', () => {
    const ctx = {
      hasValidBadgesCache: jest.fn(() => false),
      isBadgesCalculating: true,
      isBadgesFetching: true
    }

    expect(methods.isBadgesLoadingForRow.call(ctx, {})).toBe(false)
  })
})
