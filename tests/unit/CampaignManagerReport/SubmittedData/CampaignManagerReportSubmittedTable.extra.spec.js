jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmitted: jest.fn(),
  exportCampaignJobUserEmailSubmitted: jest.fn()
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

import CampaignManagerReportSubmittedTable from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable.vue'
import {
  exportCampaignJobUserEmailSubmitted,
  searchCampaignJobUserEmailSubmitted
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher adds custom columns', () => {
    const columns = [
      { property: 'firstName' },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }
    CampaignManagerReportSubmittedTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'A' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      COLUMNS.GROUPS.property,
      'cf_1',
      'department'
    ])
  })

  it('setPasswordComplexityItems maps filter options and rerenders filters', () => {
    const complexityCol = { property: 'minPasswordComplexity' }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [complexityCol] },
      passwordComplexities: [{ text: 'Strong' }, { text: 'Weak' }],
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }
    CampaignManagerReportSubmittedTable.methods.setPasswordComplexityItems.call(ctx)
    expect(complexityCol.filterableItems).toEqual([
      { text: 'Strong', value: 'Strong' },
      { text: 'Weak', value: 'Weak' }
    ])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForLanguages populates language filter lists', async () => {
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
    CampaignManagerReportSubmittedTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(preferredCol.filterableItems).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(templateCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForData maps response rows and paging', async () => {
    searchCampaignJobUserEmailSubmitted.mockResolvedValue({
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
    CampaignManagerReportSubmittedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserEmailSubmitted).toHaveBeenCalledWith(ctx.axiosPayload, 'id-1', 'grp-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({ resourceId: 'u1', Region: 'EU', preferredLanguage: 'EN' })
    )
  })

  it('export, resend, detail and groups methods cover payload branches', async () => {
    exportCampaignJobUserEmailSubmitted.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:submitted')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const emit = jest.fn()
    const ctx = {
      id: 'id-2',
      instanceGroup: 'grp-2',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: { FilterGroups: [] } },
      $emit: emit,
      selectedGroups: [],
      isGroupsDialogOpen: false
    }
    CampaignManagerReportSubmittedTable.methods.exportCampaignManagerReportSubmittedTable.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: false
    })
    await flushPromises()
    expect(links[0].download).toBe('Campaign-Report-Submitted-Data.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Submitted-Data.pdf')

    CampaignManagerReportSubmittedTable.methods.handleSelectionChange.call(ctx, 6)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 6)

    CampaignManagerReportSubmittedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['x'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [3],
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportSubmittedTable.methods.handleOnResend.call(ctx, { resourceId: 'single' })
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['single'], selectAll: false })
    )

    CampaignManagerReportSubmittedTable.methods.handleOnDetail.call(ctx, { resourceId: 'r-1' })
    expect(emit).toHaveBeenCalledWith('on-detail', { resourceId: 'r-1' })

    CampaignManagerReportSubmittedTable.methods.handleGroupsClick.call(ctx, ['G1'])
    expect(ctx.selectedGroups).toEqual([{ name: 'G1' }])
    CampaignManagerReportSubmittedTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.selectedGroups).toEqual([])
    expect(ctx.isGroupsDialogOpen).toBe(false)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
