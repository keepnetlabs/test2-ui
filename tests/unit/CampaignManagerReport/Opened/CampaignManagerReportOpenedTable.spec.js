jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailOpened: jest.fn(),
  exportCampaignJobUserEmailOpened: jest.fn()
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

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [{ property: 'cf_1', label: 'CF1' }])
  }
})

import CampaignManagerReportOpenedTable from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedTable.vue'
import {
  exportCampaignJobUserEmailOpened,
  searchCampaignJobUserEmailOpened
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher injects custom columns after groups', () => {
    const columns = [
      { property: 'firstName' },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }
    CampaignManagerReportOpenedTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])

    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'A' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      COLUMNS.GROUPS.property,
      'cf_1',
      'department'
    ])
  })

  it('isShowSandbox watcher emits update event', () => {
    const emit = jest.fn()
    CampaignManagerReportOpenedTable.watch.isShowSandbox.call({ $emit: emit }, true)
    expect(emit).toHaveBeenCalledWith('update:is-show-sandbox-from-parent', true)
  })

  it('callForLanguages maps language options and updates filter columns', async () => {
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

    CampaignManagerReportOpenedTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(preferredCol.filterableItems).toEqual(ctx.languageOptions)
    expect(templateCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('selection and groups dialog helpers work', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit, selectedGroups: [], isGroupsDialogOpen: false }

    CampaignManagerReportOpenedTable.methods.handleSelectionChange.call(ctx, 4)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 4)

    CampaignManagerReportOpenedTable.methods.handleGroupsClick.call(ctx, ['G1'])
    expect(ctx.isGroupsDialogOpen).toBe(true)
    expect(ctx.selectedGroups).toEqual([{ name: 'G1' }])

    CampaignManagerReportOpenedTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.isGroupsDialogOpen).toBe(false)
    expect(ctx.selectedGroups).toEqual([])
  })

  it('callForData maps rows, paging and sandbox count', async () => {
    searchCampaignJobUserEmailOpened.mockResolvedValue({
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
          pageNumber: 1,
          totalSandBoxActivityCount: 2
        }
      }
    })
    const ctx = {
      id: 'c1',
      instanceGroup: 'ig1',
      axiosPayload: { filter: {}, orderBy: 'FirstName', ascending: true },
      languageOptions: [{ text: 'EN', languageTypeName: 'English', value: 'lang-en' }],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      botActivityCount: 0,
      setLoading: jest.fn()
    }

    CampaignManagerReportOpenedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(searchCampaignJobUserEmailOpened).toHaveBeenCalledWith(ctx.axiosPayload, 'c1', 'ig1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'u1',
        preferredLanguage: 'EN',
        Region: 'EU'
      })
    )
    expect(ctx.botActivityCount).toBe(2)
  })

  it('exportCampaignManagerReportOpenedTable exports with extension mapping', async () => {
    exportCampaignJobUserEmailOpened.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:opened')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const ctx = {
      id: 'c2',
      instanceGroup: 'ig2',
      axiosPayload: {
        orderBy: 'FirstName',
        ascending: true,
        filter: { FilterGroups: [] },
        activityType: 2
      }
    }
    CampaignManagerReportOpenedTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCampaignJobUserEmailOpened).toHaveBeenCalledTimes(2)
    expect(exportCampaignJobUserEmailOpened.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel', activityType: 2 })
    )
    expect(links[0].download).toBe('Campaign-Report-Opened.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Opened.pdf')

    globalThis.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handleOnResend and handleOnDetail emit expected payloads', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit, axiosPayload: { filter: { FilterGroups: [] } } }

    CampaignManagerReportOpenedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['c'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [1],
      items: ['a', 'b'],
      excludedItems: ['c'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportOpenedTable.methods.handleOnResend.call(ctx, { resourceId: 'single' })
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['single'], selectAll: false })
    )

    CampaignManagerReportOpenedTable.methods.handleOnDetail.call(ctx, { resourceId: 'row-1' })
    expect(emit).toHaveBeenCalledWith('on-detail', { resourceId: 'row-1' })
  })
})
