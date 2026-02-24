jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserAttachmentOpened: jest.fn(),
  exportCampaignJobUserAttachmentOpened: jest.fn()
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

import CampaignManagerReportOpenedAttachmentTable from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable.vue'
import {
  exportCampaignJobUserAttachmentOpened,
  searchCampaignJobUserAttachmentOpened
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManagerReport/OpenedAttachment/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedAttachmentTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher inserts custom columns after groups or department', () => {
    const columns = [
      { property: 'firstName' },
      { property: COLUMNS.GROUPS.property },
      { property: 'department' }
    ]
    const ctx = { tableOptions: { columns } }
    CampaignManagerReportOpenedAttachmentTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])
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
    CampaignManagerReportOpenedAttachmentTable.watch.isShowSandbox.call({ $emit: emit }, true)
    expect(emit).toHaveBeenCalledWith('update:is-show-sandbox-from-parent', true)
  })

  it('callForLanguages sets language filters and rerenders', async () => {
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

    CampaignManagerReportOpenedAttachmentTable.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(preferredCol.filterableItems).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-en' }
    ])
    expect(templateCol.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForData sets default activity type and maps custom fields', async () => {
    searchCampaignJobUserAttachmentOpened.mockResolvedValue({
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
          totalSandBoxActivityCount: 4
        }
      }
    })
    const ctx = {
      id: 'id-1',
      instanceGroup: 'grp-1',
      axiosPayload: { filter: {}, orderBy: 'FirstName', ascending: true },
      languageOptions: [{ text: 'EN', languageTypeName: 'English', value: 'lang-en' }],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      botActivityCount: 0,
      setLoading: jest.fn()
    }

    CampaignManagerReportOpenedAttachmentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(searchCampaignJobUserAttachmentOpened).toHaveBeenCalledWith(ctx.axiosPayload, 'id-1', 'grp-1')
    expect(ctx.tableData[0]).toEqual(
      expect.objectContaining({ resourceId: 'u1', Region: 'EU', preferredLanguage: 'EN' })
    )
    expect(ctx.botActivityCount).toBe(4)
  })

  it('callForData keeps existing activity type when already defined', async () => {
    searchCampaignJobUserAttachmentOpened.mockResolvedValue({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })
    const ctx = {
      id: 'id-2',
      instanceGroup: 'grp-2',
      axiosPayload: { activityType: 2, filter: {} },
      languageOptions: [],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      botActivityCount: 0,
      setLoading: jest.fn()
    }
    CampaignManagerReportOpenedAttachmentTable.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.axiosPayload.activityType).toBe(2)
  })

  it('exports with xls/xlsx filename mapping', async () => {
    exportCampaignJobUserAttachmentOpened.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:attachment')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })
    const ctx = {
      id: 'id-3',
      instanceGroup: 'grp-3',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {}, activityType: 1 }
    }
    CampaignManagerReportOpenedAttachmentTable.methods.exportCampaignManagerReportOpenedTable.call(
      ctx,
      { exportTypes: ['XLS', 'CSV'], pageNumber: 1, pageSize: 10, reportAllPages: false }
    )
    await flushPromises()

    expect(exportCampaignJobUserAttachmentOpened).toHaveBeenCalledTimes(2)
    expect(links[0].download).toBe('Campaign-Report-Opened-Attachment.xlsx')
    expect(links[1].download).toBe('Campaign-Report-Opened-Attachment.csv')
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('emits resend/detail and groups helpers cover payload branches', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      axiosPayload: { filter: { FilterGroups: [] } },
      selectedGroups: [],
      isGroupsDialogOpen: false
    }

    CampaignManagerReportOpenedAttachmentTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['x'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [1],
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    CampaignManagerReportOpenedAttachmentTable.methods.handleOnResend.call(ctx, { resourceId: 'single' })
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['single'], selectAll: false })
    )

    CampaignManagerReportOpenedAttachmentTable.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(emit).toHaveBeenCalledWith('on-detail', { resourceId: 'r1' })

    CampaignManagerReportOpenedAttachmentTable.methods.handleGroupsClick.call(ctx, undefined)
    expect(ctx.selectedGroups).toEqual([])
    expect(ctx.isGroupsDialogOpen).toBe(true)
    CampaignManagerReportOpenedAttachmentTable.methods.handleGroupsDialogClose.call(ctx)
    expect(ctx.isGroupsDialogOpen).toBe(false)
  })
})
