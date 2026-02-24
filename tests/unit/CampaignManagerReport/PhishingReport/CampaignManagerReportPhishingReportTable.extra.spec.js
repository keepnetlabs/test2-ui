jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserPhishingReport: jest.fn(),
  exportCampaignJobUserPhishingReport: jest.fn()
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
      orderBy: 'FirstName',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'cf_1', label: 'CF1' }])
}))

import CampaignManagerReportPhishingReportTable from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import {
  exportCampaignJobUserPhishingReport,
  searchCampaignJobUserPhishingReport
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportPhishingReportTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher injects custom columns and respects insert location', () => {
    const columns = [
      { property: 'firstName' },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }
    CampaignManagerReportPhishingReportTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'A' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      COLUMNS.GROUPS.property,
      'cf_1',
      'department'
    ])
  })

  it('callForLanguages maps language options and rerenders filters', async () => {
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
    CampaignManagerReportPhishingReportTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(preferredCol.filterableItems).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(templateCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForData maps table rows and paging', async () => {
    searchCampaignJobUserPhishingReport.mockResolvedValue({
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
    CampaignManagerReportPhishingReportTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserPhishingReport).toHaveBeenCalledWith(ctx.axiosPayload, 'id-1', 'grp-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({ resourceId: 'u1', Region: 'EU', preferredLanguage: 'EN' })
    )
  })

  it('exports with file extension mapping', async () => {
    exportCampaignJobUserPhishingReport.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:phishing')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })
    const ctx = {
      id: 'id-2',
      instanceGroup: 'grp-2',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }
    CampaignManagerReportPhishingReportTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCampaignJobUserPhishingReport).toHaveBeenCalledTimes(2)
    expect(links[0].download).toBe('Campaign-Report-Phishing-Reporter.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Phishing-Reporter.pdf')
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('emits selection, resend and detail payloads plus group helpers', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      axiosPayload: { filter: { FilterGroups: [] } },
      selectedGroups: [],
      isGroupsDialogOpen: false
    }

    CampaignManagerReportPhishingReportTable.methods.handleSelectionChange.call(ctx, 9)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 9)

    CampaignManagerReportPhishingReportTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['x'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [6],
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportPhishingReportTable.methods.handleOnResend.call(ctx, { resourceId: 'single' })
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['single'], selectAll: false })
    )

    CampaignManagerReportPhishingReportTable.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(emit).toHaveBeenCalledWith('on-detail', { resourceId: 'r1' })

    CampaignManagerReportPhishingReportTable.methods.handleGroupsClick.call(ctx, ['G1'])
    expect(ctx.selectedGroups).toEqual([{ name: 'G1' }])
    CampaignManagerReportPhishingReportTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.selectedGroups).toEqual([])
    expect(ctx.isGroupsDialogOpen).toBe(false)
  })
})
