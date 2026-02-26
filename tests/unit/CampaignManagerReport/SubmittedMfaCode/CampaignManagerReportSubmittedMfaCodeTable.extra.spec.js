jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmittedMfa: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 1,
        pageNumber: 1
      }
    }
  }),
  exportCampaignJobUserEmailSubmittedMfa: jest.fn().mockResolvedValue({ data: Buffer.from('') })
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn().mockResolvedValue([])
}))

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'cfDepartment' }])
}))

import CampaignManagerReportSubmittedMfaCodeTable from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeTable.vue'

describe('CampaignManagerReportSubmittedMfaCodeTable.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')
    document.createElement = jest.fn(() => ({
      href: '',
      download: '',
      click: jest.fn()
    }))
  })

  describe('handleOnResend', () => {
    it('maps array items to resourceIds when items is array', () => {
      const emit = jest.fn()
      const ctx = {
        axiosPayload: { filter: {} },
        $emit: emit
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnResend.call(ctx, [
        { resourceId: 'r1' },
        { resourceId: 'r2' }
      ])
      expect(emit).toHaveBeenCalledWith(
        'on-resend',
        expect.objectContaining({
          items: ['r1', 'r2'],
          excludedItems: [],
          selectAll: false
        })
      )
    })

    it('wraps single item in array when items is object', () => {
      const emit = jest.fn()
      const ctx = {
        axiosPayload: { filter: {} },
        $emit: emit
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnResend.call(ctx, {
        resourceId: 'r1'
      })
      expect(emit).toHaveBeenCalledWith(
        'on-resend',
        expect.objectContaining({
          items: ['r1'],
          excludedItems: [],
          selectAll: false
        })
      )
    })

    it('passes excludedResourceIdList and selectAll when provided', () => {
      const emit = jest.fn()
      const ctx = {
        axiosPayload: { filter: {} },
        $emit: emit
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnResend.call(
        ctx,
        [{ resourceId: 'r1' }],
        ['excluded1'],
        true
      )
      expect(emit).toHaveBeenCalledWith(
        'on-resend',
        expect.objectContaining({
          excludedItems: ['excluded1'],
          selectAll: true
        })
      )
    })
  })

  describe('handleOnDetail', () => {
    it('emits on-detail with row', () => {
      const emit = jest.fn()
      const row = { resourceId: 'r1', firstName: 'John' }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnDetail.call(
        { $emit: emit },
        row
      )
      expect(emit).toHaveBeenCalledWith('on-detail', row)
    })
  })

  describe('handleGroupsClick', () => {
    it('sets selectedGroups and opens dialog when groups provided', () => {
      const ctx = {
        selectedGroups: [],
        isGroupsDialogOpen: false
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleGroupsClick.call(ctx, [
        'Group1',
        'Group2'
      ])
      expect(ctx.selectedGroups).toEqual([{ name: 'Group1' }, { name: 'Group2' }])
      expect(ctx.isGroupsDialogOpen).toBe(true)
    })

    it('handles null/undefined groups', () => {
      const ctx = {
        selectedGroups: [],
        isGroupsDialogOpen: false
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleGroupsClick.call(ctx, null)
      expect(ctx.selectedGroups).toEqual([])
      expect(ctx.isGroupsDialogOpen).toBe(true)
    })
  })

  describe('handleGroupsDialogClose', () => {
    it('closes dialog and clears selectedGroups', () => {
      const ctx = {
        isGroupsDialogOpen: true,
        selectedGroups: [{ name: 'G1' }]
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleGroupsDialogClose.call(ctx)
      expect(ctx.isGroupsDialogOpen).toBe(false)
      expect(ctx.selectedGroups).toEqual([])
    })
  })

  describe('handleSelectionChange', () => {
    it('emits on-selection-text-change', () => {
      const emit = jest.fn()
      CampaignManagerReportSubmittedMfaCodeTable.methods.handleSelectionChange.call(
        { $emit: emit },
        5
      )
      expect(emit).toHaveBeenCalledWith('on-selection-text-change', 5)
    })
  })

  describe('exportCampaignManagerReportSubmittedTable', () => {
    it('uses Excel for XLS export type', async () => {
      const { exportCampaignJobUserEmailSubmittedMfa } = require('@/api/phishingsimulator')
      const ctx = {
        axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
      }
      const downloadTypes = {
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false,
        exportTypes: ['XLS'],
        exportType: 'Excel'
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.exportCampaignManagerReportSubmittedTable.call(
        ctx,
        downloadTypes
      )
      await new Promise((r) => setTimeout(r, 0))
      expect(exportCampaignJobUserEmailSubmittedMfa).toHaveBeenCalledWith(
        expect.objectContaining({
          exportType: 'Excel'
        }),
        undefined,
        undefined
      )
    })

    it('uses xlsx extension for XLS download', async () => {
      const createElementSpy = jest.spyOn(document, 'createElement')
      const mockLink = { href: '', download: '', click: jest.fn() }
      createElementSpy.mockReturnValue(mockLink)

      const { exportCampaignJobUserEmailSubmittedMfa } = require('@/api/phishingsimulator')
      exportCampaignJobUserEmailSubmittedMfa.mockResolvedValue({ data: Buffer.from('') })

      const ctx = {
        axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
      }
      const downloadTypes = {
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false,
        exportTypes: ['XLS']
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.exportCampaignManagerReportSubmittedTable.call(
        ctx,
        downloadTypes
      )
      await new Promise((r) => setTimeout(r, 0))
      expect(mockLink.download).toContain('xlsx')

      createElementSpy.mockRestore()
    })

    it('uses item as exportType when not XLS', async () => {
      const { exportCampaignJobUserEmailSubmittedMfa } = require('@/api/phishingsimulator')
      const ctx = {
        axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
      }
      const downloadTypes = {
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false,
        exportTypes: ['CSV']
      }
      CampaignManagerReportSubmittedMfaCodeTable.methods.exportCampaignManagerReportSubmittedTable.call(
        ctx,
        downloadTypes
      )
      await new Promise((r) => setTimeout(r, 0))
      expect(exportCampaignJobUserEmailSubmittedMfa).toHaveBeenCalledWith(
        expect.objectContaining({
          exportType: 'CSV'
        }),
        undefined,
        undefined
      )
    })
  })

  describe('customFields watcher', () => {
    it('inserts generated custom fields right after groups column when groups exists', () => {
      const ctx = {
        tableOptions: {
          columns: [{ property: 'firstName' }, { property: 'targetGroups' }, { property: 'email' }]
        }
      }
      CampaignManagerReportSubmittedMfaCodeTable.watch.customFields.handler.call(ctx, [
        { key: 'x' }
      ])
      expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
        'firstName',
        'targetGroups',
        'cfDepartment',
        'email'
      ])
    })

    it('falls back to department index when groups column is missing', () => {
      const ctx = {
        tableOptions: {
          columns: [{ property: 'firstName' }, { property: 'department' }, { property: 'email' }]
        }
      }
      CampaignManagerReportSubmittedMfaCodeTable.watch.customFields.handler.call(ctx, [
        { key: 'x' }
      ])
      expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
        'firstName',
        'department',
        'cfDepartment',
        'email'
      ])
    })

    it('does not mutate columns when both groups and department are missing', () => {
      const ctx = {
        tableOptions: {
          columns: [{ property: 'firstName' }, { property: 'email' }]
        }
      }
      CampaignManagerReportSubmittedMfaCodeTable.watch.customFields.handler.call(ctx, [
        { key: 'x' }
      ])
      expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['firstName', 'email'])
    })
  })

  describe('callForLanguages', () => {
    it('maps language options, sets filter items and rerenders table filters', async () => {
      const LookupLocalStorage = require('@/helper-classes/lookup-local-storage').default || require('@/helper-classes/lookup-local-storage')
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-1' }
      ])

      const preferredLangColumn = { property: 'preferredLanguage' }
      const templateLangColumn = { property: 'emailTemplateLanguage' }
      const reRenderFilters = jest.fn()
      const ctx = {
        tableOptions: {
          columns: [preferredLangColumn, templateLangColumn]
        },
        languageOptions: [],
        $refs: { refTable: { reRenderFilters } },
        $set: (obj, key, value) => {
          obj[key] = value
        }
      }

      CampaignManagerReportSubmittedMfaCodeTable.methods.callForLanguages.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
      expect(ctx.languageOptions).toEqual([
        { text: 'EN', languageTypeName: 'English', value: 'lang-1' }
      ])
      expect(preferredLangColumn.filterableItems).toEqual(ctx.languageOptions)
      expect(templateLangColumn.filterableItems).toEqual([{ text: 'EN', value: 'EN' }])
      expect(reRenderFilters).toHaveBeenCalledTimes(1)
    })

    it('falls back to empty list when language response is missing', async () => {
      const LookupLocalStorage = require('@/helper-classes/lookup-local-storage').default || require('@/helper-classes/lookup-local-storage')
      LookupLocalStorage.getSingle.mockResolvedValueOnce(undefined)

      const preferredLangColumn = { property: 'preferredLanguage' }
      const templateLangColumn = { property: 'emailTemplateLanguage' }
      const ctx = {
        tableOptions: {
          columns: [preferredLangColumn, templateLangColumn]
        },
        languageOptions: [{ text: 'TR' }],
        $refs: {},
        $set: (obj, key, value) => {
          obj[key] = value
        }
      }

      CampaignManagerReportSubmittedMfaCodeTable.methods.callForLanguages.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(ctx.languageOptions).toEqual([])
      expect(preferredLangColumn.filterableItems).toEqual([])
      expect(templateLangColumn.filterableItems).toEqual([])
    })
  })

  describe('callForData', () => {
    it('maps server response and converts preferredLanguage using lookup options', async () => {
      const { searchCampaignJobUserEmailSubmittedMfa } = require('@/api/phishingsimulator')
      searchCampaignJobUserEmailSubmittedMfa.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              {
                resourceId: 'u1',
                preferredLanguage: 'English',
                customFieldValues: [{ name: 'Region', value: 'EMEA' }]
              },
              {
                resourceId: 'u2',
                preferredLanguage: 'German',
                customFieldValues: []
              }
            ],
            totalNumberOfRecords: 2,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })

      const ctx = {
        id: 'job-1',
        instanceGroup: 'g-1',
        axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
        languageOptions: [{ text: 'EN', languageTypeName: 'English', value: 'lang-1' }],
        tableData: [],
        serverSideProps: {},
        setLoading: jest.fn()
      }

      CampaignManagerReportSubmittedMfaCodeTable.methods.callForData.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(ctx.setLoading).toHaveBeenNthCalledWith(1, true)
      expect(searchCampaignJobUserEmailSubmittedMfa).toHaveBeenCalledWith(
        ctx.axiosPayload,
        'job-1',
        'g-1'
      )
      expect(ctx.tableData[0].Region).toBe('EMEA')
      expect(ctx.tableData[0].preferredLanguage).toBe('EN')
      expect(ctx.tableData[1].preferredLanguage).toBe('German')
      expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
      expect(ctx.setLoading).toHaveBeenLastCalledWith()
    })
  })
})
