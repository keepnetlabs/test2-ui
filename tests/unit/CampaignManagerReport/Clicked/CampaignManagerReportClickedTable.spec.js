jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailClicked: jest.fn(),
  exportCampaignJobUserEmailClicked: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([
      { isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-en' },
      { isoFriendlyName: 'TR', name: 'Turkish', resourceId: 'lang-tr' }
    ])
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

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [
      { property: 'cf_1', label: 'CF1' },
      { property: 'cf_2', label: 'CF2' }
    ])
  }
})

import CampaignManagerReportClickedTable from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedTable.vue'
import {
  exportCampaignJobUserEmailClicked,
  searchCampaignJobUserEmailClicked
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportClickedTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher inserts custom columns after groups column', () => {
    const columns = [
      { property: COLUMNS.FIRST_NAME.property },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }

    CampaignManagerReportClickedTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'A' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      COLUMNS.FIRST_NAME.property,
      COLUMNS.GROUPS.property,
      'cf_1',
      'cf_2',
      'department'
    ])
  })

  it('isShowSandbox watcher emits sync event', () => {
    const emit = jest.fn()
    CampaignManagerReportClickedTable.watch.isShowSandbox.call({ $emit: emit }, true)
    expect(emit).toHaveBeenCalledWith('update:is-show-sandbox-from-parent', true)
  })

  it('callForLanguages maps options, sets filterable items and rerenders', async () => {
    const preferredCol = { property: 'preferredLanguage' }
    const templateLangCol = { property: 'emailTemplateLanguage' }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      languageOptions: [],
      tableOptions: { columns: [preferredCol, templateLangCol] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerReportClickedTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' },
      { text: 'TR', languageTypeName: 'Turkish', value: 'lang-tr' }
    ])
    expect(preferredCol.filterableItems).toHaveLength(2)
    expect(templateLangCol.filterableItems).toEqual([
      { text: 'EN', value: 'EN' },
      { text: 'TR', value: 'TR' }
    ])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('group modal helpers and selection event emitters work', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit, isGroupsDialogOpen: false, selectedGroups: [] }

    CampaignManagerReportClickedTable.methods.handleSelectionChange.call(ctx, 3)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 3)

    CampaignManagerReportClickedTable.methods.handleGroupsClick.call(ctx, ['G1', 'G2'])
    expect(ctx.isGroupsDialogOpen).toBe(true)
    expect(ctx.selectedGroups).toEqual([{ name: 'G1' }, { name: 'G2' }])

    CampaignManagerReportClickedTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.isGroupsDialogOpen).toBe(false)
    expect(ctx.selectedGroups).toEqual([])
  })

  it('callForData fetches/mutates rows and sets bot activity count', async () => {
    searchCampaignJobUserEmailClicked.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'r1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Region', value: 'EU' }]
            },
            {
              resourceId: 'r2',
              preferredLanguage: 'Unknown',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 5
        }
      }
    })
    const ctx = {
      id: 'campaign-1',
      instanceGroup: 'ig-1',
      axiosPayload: { filter: {}, orderBy: 'FirstName', ascending: true },
      languageOptions: [{ text: 'EN', languageTypeName: 'English', value: 'lang-en' }],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      botActivityCount: 0,
      setLoading: jest.fn()
    }

    CampaignManagerReportClickedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(searchCampaignJobUserEmailClicked).toHaveBeenCalledWith(ctx.axiosPayload, 'campaign-1', 'ig-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({ resourceId: 'r1', Region: 'EU', preferredLanguage: 'EN' })
    )
    expect(ctx.tableData[1].preferredLanguage).toBe('Unknown')
    expect(ctx.botActivityCount).toBe(5)
  })

  it('exportCampaignManagerReportClickedTable exports files with extension mapping', async () => {
    exportCampaignJobUserEmailClicked.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:clicked')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const ctx = {
      id: 'campaign-2',
      instanceGroup: 'ig-2',
      axiosPayload: {
        orderBy: 'FirstName',
        ascending: true,
        filter: { FilterGroups: [] },
        activityType: 2
      }
    }

    CampaignManagerReportClickedTable.methods.exportCampaignManagerReportClickedTable.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCampaignJobUserEmailClicked).toHaveBeenCalledTimes(2)
    expect(exportCampaignJobUserEmailClicked.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel', activityType: 2 })
    )
    expect(links[0].download).toBe('Campaign-Report-Clicked.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Clicked.pdf')

    globalThis.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handleOnResend and handleOnDetail emit expected payloads', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      axiosPayload: { filter: { FilterGroups: [] } }
    }
    CampaignManagerReportClickedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [2],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportClickedTable.methods.handleOnResend.call(
      ctx,
      { resourceId: 'single' }
    )
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['single'], selectAll: false })
    )

    CampaignManagerReportClickedTable.methods.handleOnDetail.call(ctx, { resourceId: 'row-1' })
    expect(emit).toHaveBeenCalledWith('on-detail', { resourceId: 'row-1' })
  })
})
