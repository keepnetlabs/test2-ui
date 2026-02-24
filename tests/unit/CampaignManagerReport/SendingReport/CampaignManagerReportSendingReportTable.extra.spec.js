jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserSendingReport: jest.fn(),
  exportCampaignJobUserSendingReport: jest.fn(),
  getCampaignJobEmailActivity: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([{ isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-en' }])
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastSendingTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'cf_1', label: 'CF1' }])
}))

import CampaignManagerReportSendingReportTable from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import {
  exportCampaignJobUserSendingReport,
  getCampaignJobEmailActivity,
  searchCampaignJobUserSendingReport
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSendingReportTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher injects custom columns near groups/department', () => {
    const columns = [
      { property: 'firstName' },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }
    CampaignManagerReportSendingReportTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'A' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      COLUMNS.GROUPS.property,
      'cf_1',
      'department'
    ])
  })

  it('callForLanguages maps options and updates filter items', async () => {
    const preferredCol = { property: 'preferredLanguage' }
    const templateCol = { property: 'emailTemplateLanguage' }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      languageOptions: [],
      tableOptions: { columns: [preferredCol, templateCol] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }
    CampaignManagerReportSendingReportTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(preferredCol.filterableItems).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(templateCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('setLastSendingStatusItems updates status filter options', () => {
    const statusCol = { property: 'status' }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [statusCol] },
      lastSendingStatusItems: [{ text: 'Delivered' }, { text: 'Error' }],
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }
    CampaignManagerReportSendingReportTable.methods.setLastSendingStatusItems.call(ctx)
    expect(statusCol.filterableItems).toEqual([
      { text: 'Delivered', value: 'Delivered' },
      { text: 'Error', value: 'Error' }
    ])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForData maps rows and pagination', async () => {
    searchCampaignJobUserSendingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'u1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Region', value: 'EU' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'id-1',
      instanceGroup: 'grp-1',
      axiosPayload: { filter: {} },
      languageOptions: [{ text: 'EN', languageTypeName: 'English', value: 'lang-en' }],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }
    CampaignManagerReportSendingReportTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserSendingReport).toHaveBeenCalledWith(ctx.axiosPayload, 'id-1', 'grp-1')
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({ resourceId: 'u1', Region: 'EU', preferredLanguage: 'EN' })
    )
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
  })

  it('computes event reason and no-event messages across branches', () => {
    const ctx = { extendedViewValue: [{ originatingIP: '1.1.1.1', serviceProvider: 'Sendgrid' }] }
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { reason: 'x' })
    ).toBe('x')
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { eventName: 'processed' })
    ).toContain('1.1.1.1')
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { eventName: 'delivered' })
    ).toBe('This email was delivered')
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { eventName: 'unknown' })
    ).toBe('')

    expect(
      CampaignManagerReportSendingReportTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'Sendgrid' }]
      })
    ).toBe('Activity details will be available in a few minutes...')
    expect(
      CampaignManagerReportSendingReportTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'SMTP' }]
      })
    ).toBe('Event history is only available for SMTP')
  })

  it('handleOnDetail handles both success and error flows', async () => {
    getCampaignJobEmailActivity.mockResolvedValueOnce({
      data: { data: { events: [{ event: 'processed', timestamp: 't' }] } }
    })
    const ctxSuccess = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    CampaignManagerReportSendingReportTable.methods.handleOnDetail.call(ctxSuccess, { resourceId: 'r-1' })
    await flushPromises()
    expect(ctxSuccess.isShowExtendedView).toBe(true)
    expect(ctxSuccess.extendedViewOptions.isErrorState).toBe(false)
    expect(ctxSuccess.extendedViewValue).toEqual([{ events: [{ event: 'processed', timestamp: 't' }] }])
    expect(ctxSuccess.extendedViewLoading).toBe(false)

    getCampaignJobEmailActivity.mockRejectedValueOnce(new Error('fail'))
    const ctxFail = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    CampaignManagerReportSendingReportTable.methods.handleOnDetail.call(ctxFail, { resourceId: 'r-2' })
    await flushPromises()
    expect(ctxFail.extendedViewOptions.isErrorState).toBe(true)
    expect(ctxFail.extendedViewValue).toEqual([{}])
    expect(ctxFail.extendedViewLoading).toBe(false)
  })

  it('exports and emits resend/detail-selection payloads', async () => {
    exportCampaignJobUserSendingReport.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:sending')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const emit = jest.fn()
    const ctx = {
      id: 'id-3',
      instanceGroup: 'grp-3',
      axiosPayload: { orderBy: 'lastSendingTime', ascending: false, filter: { FilterGroups: [] } },
      $emit: emit,
      selectedGroups: [],
      isGroupsDialogOpen: false
    }

    CampaignManagerReportSendingReportTable.methods.exportCampaignManagerReportSendingReportTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()
    expect(links[0].download).toBe('Campaign-Report-Sending.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Sending.csv')

    CampaignManagerReportSendingReportTable.methods.handleSelectionChange.call(ctx, 5)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 5)

    CampaignManagerReportSendingReportTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }],
      [],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [0],
      items: ['a'],
      excludedItems: [],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportSendingReportTable.methods.handleGroupsClick.call(ctx, ['G1'])
    expect(ctx.isGroupsDialogOpen).toBe(true)
    CampaignManagerReportSendingReportTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.selectedGroups).toEqual([])

    expect(CampaignManagerReportSendingReportTable.methods.getErrorMessage({ status: 'Error', jobResultMessage: 'x' })).toBe('x')
    expect(CampaignManagerReportSendingReportTable.methods.getErrorMessage({ status: 'Delivered' })).toBe('')
    expect(CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: 'x' })).toBe(false)
    expect(CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: '' })).toBe(true)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
