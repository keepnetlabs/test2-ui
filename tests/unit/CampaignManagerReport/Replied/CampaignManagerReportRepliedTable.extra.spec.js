jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserReplied: jest.fn(),
  exportCampaignJobUserReplied: jest.fn()
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

import CampaignManagerReportRepliedTable from '@/components/CampaignManagerReport/Replied/CampaignManagerReportRepliedTable.vue'
import {
  exportCampaignJobUserReplied,
  searchCampaignJobUserReplied
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportRepliedTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher inserts generated columns near groups/department', () => {
    const columns = [
      { property: 'firstName' },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }

    CampaignManagerReportRepliedTable.watch.customFields.handler.call(ctx, [{ name: 'Custom A' }])

    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'Custom A' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      COLUMNS.GROUPS.property,
      'cf_1',
      'department'
    ])
  })

  it('callForLanguages maps language options and updates filterable columns', async () => {
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

    CampaignManagerReportRepliedTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(preferredCol.filterableItems).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(templateCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForData maps pagination and row custom fields', async () => {
    searchCampaignJobUserReplied.mockResolvedValue({
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

    CampaignManagerReportRepliedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserReplied).toHaveBeenCalledWith(ctx.axiosPayload, 'id-1', 'grp-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({ resourceId: 'u1', Region: 'EU', preferredLanguage: 'EN' })
    )
  })

  it('export method maps xls to xlsx filename', async () => {
    exportCampaignJobUserReplied.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:replied')
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

    CampaignManagerReportRepliedTable.methods.exportCampaignManagerReportRepliedTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: false
    })
    await flushPromises()

    expect(exportCampaignJobUserReplied).toHaveBeenCalledTimes(2)
    expect(links[0].download).toBe('Campaign-Report-Replied-Data.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Replied-Data.csv')
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('selection/detail/groups helpers emit and mutate state correctly', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      selectedGroups: [],
      isGroupsDialogOpen: false
    }

    CampaignManagerReportRepliedTable.methods.handleSelectionChange.call(ctx, 7)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 7)

    CampaignManagerReportRepliedTable.methods.handleDetail.call(ctx, { resourceId: 'r-1' })
    expect(emit).toHaveBeenCalledWith('on-detail', { resourceId: 'r-1' })

    CampaignManagerReportRepliedTable.methods.handleGroupsClick.call(ctx, ['G1'])
    expect(ctx.selectedGroups).toEqual([{ name: 'G1' }])
    expect(ctx.isGroupsDialogOpen).toBe(true)

    CampaignManagerReportRepliedTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.selectedGroups).toEqual([])
    expect(ctx.isGroupsDialogOpen).toBe(false)
  })
})
