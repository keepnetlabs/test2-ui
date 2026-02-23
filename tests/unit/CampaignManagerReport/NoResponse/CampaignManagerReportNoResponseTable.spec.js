jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserNoResponse: jest.fn(),
  exportCampaignJobUserNoResponse: jest.fn()
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
    createCustomFieldColumns: jest.fn(() => [{ property: 'cf_dept', label: 'CF Dept' }])
  }
})

import CampaignManagerReportNoResponseTable from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import {
  exportCampaignJobUserNoResponse,
  searchCampaignJobUserNoResponse
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportNoResponseTable.vue', () => {
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
    CampaignManagerReportNoResponseTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'x' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      COLUMNS.GROUPS.property,
      'cf_dept',
      'department'
    ])
  })

  it('callForLanguages maps language options and updates filter items', async () => {
    const preferredCol = { property: 'preferredLanguage' }
    const emailLangCol = { property: 'emailTemplateLanguage' }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      languageOptions: [],
      tableOptions: { columns: [preferredCol, emailLangCol] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerReportNoResponseTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(preferredCol.filterableItems).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(emailLangCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('handles selection and groups dialog actions', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      selectedGroups: [],
      isGroupsDialogOpen: false
    }

    CampaignManagerReportNoResponseTable.methods.handleSelectionChange.call(ctx, 2)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 2)

    CampaignManagerReportNoResponseTable.methods.handleGroupsClick.call(ctx, ['A', 'B'])
    expect(ctx.isGroupsDialogOpen).toBe(true)
    expect(ctx.selectedGroups).toEqual([{ name: 'A' }, { name: 'B' }])

    CampaignManagerReportNoResponseTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.isGroupsDialogOpen).toBe(false)
    expect(ctx.selectedGroups).toEqual([])
  })

  it('callForData maps table rows and paging values', async () => {
    searchCampaignJobUserNoResponse.mockResolvedValue({
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
      id: 'campaign-x',
      instanceGroup: 'ig-x',
      axiosPayload: { filter: {}, orderBy: 'FirstName', ascending: true },
      languageOptions: [{ text: 'EN', languageTypeName: 'English', value: 'lang-en' }],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportNoResponseTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserNoResponse).toHaveBeenCalledWith(ctx.axiosPayload, 'campaign-x', 'ig-x')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([
      {
        resourceId: 'u1',
        preferredLanguage: 'EN',
        customFieldValues: [{ name: 'Region', value: 'EU' }],
        Region: 'EU'
      }
    ])
  })

  it('exports no-response report with extension mapping', async () => {
    exportCampaignJobUserNoResponse.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:nr')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const ctx = {
      id: 'campaign-y',
      instanceGroup: 'ig-y',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: { FilterGroups: [] } }
    }
    CampaignManagerReportNoResponseTable.methods.exportCampaignManagerReportNoResponseTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCampaignJobUserNoResponse).toHaveBeenCalledTimes(2)
    expect(exportCampaignJobUserNoResponse.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(links[0].download).toBe('Campaign-Report-No-Response.xlsx')
    expect(links[1].download).toBe('Campaign-Report-No-Response.csv')

    globalThis.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handleOnResend emits correct payload for single and multiple selection', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    CampaignManagerReportNoResponseTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [4],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportNoResponseTable.methods.handleOnResend.call(ctx, { resourceId: 'single' })
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['single'], selectAll: false })
    )
  })
})
