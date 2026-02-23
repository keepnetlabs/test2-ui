jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignManager: jest.fn(),
  exportCampaignManager: jest.fn()
}))

import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable.vue'
import { searchCampaignManager, exportCampaignManager } from '@/api/phishingsimulator'
import { ACTION_STATUSES, COLUMNS } from '@/components/CampaignManager/utils'
import * as CampaignManagerUtils from '@/components/CampaignManager/utils'
import * as CommonFns from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerParentTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData fetches and maps table data when search permission is enabled', async () => {
    searchCampaignManager.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'c1',
              name: 'Campaign A',
              targetUsers: '12',
              instanceCount: '2'
            }
          ],
          totalNumberOfRecords: 25,
          totalNumberOfPages: 3,
          pageNumber: 2
        }
      }
    })

    const ctx = {
      getCampaignManagerParentSearchPermissions: true,
      axiosPayload: { filter: {}, orderBy: 'createTime', ascending: false },
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignManager).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(25)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(3)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
    expect(ctx.tableData).toEqual([
      {
        resourceId: 'c1',
        name: 'Campaign A',
        targetUsers: 12,
        total: 2
      }
    ])
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('callForData does nothing when search permission is disabled', () => {
    const ctx = {
      getCampaignManagerParentSearchPermissions: false,
      setLoading: jest.fn(),
      axiosPayload: {},
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerParentTable.methods.callForData.call(ctx)
    expect(searchCampaignManager).not.toHaveBeenCalled()
    expect(ctx.setLoading).not.toHaveBeenCalled()
  })

  it('handleSearchChange updates filter group, renames scenario distribution field and refreshes', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            {
              FilterItems: [{ FieldName: 'Old', Value: 'x' }]
            }
          ]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerParentTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'CategoryDistributionType', Value: 'AI' },
              { FieldName: 'Status', Value: 'Active' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'ScenarioDistribution', Value: 'AI' },
      { FieldName: 'Status', Value: 'Active' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('getMethodDetail parses json and handles invalid values safely', () => {
    expect(
      CampaignManagerParentTable.methods.getMethodDetail.call({}, '[{"method":"Click","count":2}]')
    ).toEqual([{ method: 'Click', count: 2 }])
    expect(CampaignManagerParentTable.methods.getMethodDetail.call({}, '{invalid')).toEqual({})
    expect(CampaignManagerParentTable.methods.getMethodDetail.call({}, null)).toEqual({})
  })

  it('exportCampaignManagerList exports files with expected payload and extension mapping', async () => {
    exportCampaignManager.mockResolvedValue({ data: new Blob(['x']) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    const createdLinks = []
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => {
        const link = { click: jest.fn(), href: '', download: '' }
        createdLinks.push(link)
        return link
      })

    const ctx = {
      getCampaignManagerParentExportPermissions: true,
      axiosPayload: {
        orderBy: 'createTime',
        ascending: false,
        filter: { FilterGroups: [] }
      }
    }

    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCampaignManager).toHaveBeenCalledTimes(2)
    expect(exportCampaignManager.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        exportType: 'Excel',
        pageNumber: 1,
        pageSize: 20,
        reportAllPages: true
      })
    )
    expect(exportCampaignManager.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        exportType: 'PDF'
      })
    )
    expect(window.URL.createObjectURL).toHaveBeenCalled()
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(createdLinks[0].click).toHaveBeenCalled()
    expect(createdLinks[1].click).toHaveBeenCalled()
    expect(createdLinks[0].download).toBe('Campaign-Manager.xlsx')
    expect(createdLinks[1].download).toBe('Campaign-Manager.pdf')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('exportCampaignManagerList does nothing without export permission', () => {
    const ctx = {
      getCampaignManagerParentExportPermissions: false,
      axiosPayload: { orderBy: '', ascending: true, filter: {} }
    }

    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    expect(exportCampaignManager).not.toHaveBeenCalled()
  })

  it('handleMultipleDeleteOfCampaigns emits payload for selected and selectAll flows', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      serverSideProps: { totalNumberOfRecords: 99 },
      $emit: emit
    }
    const items = [{ resourceId: 'c1' }, { resourceId: 'c2' }]
    const excluded = ['c9']

    CampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      items,
      excluded,
      false
    )
    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      {
        items: ['c1', 'c2'],
        excludedItems: excluded,
        selectAll: false,
        filter: ctx.axiosPayload.filter
      },
      2
    )

    CampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      items,
      excluded,
      true
    )
    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      {
        items: [],
        excludedItems: excluded,
        selectAll: true,
        filter: ctx.axiosPayload.filter
      },
      99
    )
  })

  it('status helpers and target users visibility methods behave correctly', () => {
    expect(
      CampaignManagerParentTable.methods.getErrorMessage.call({}, {
        status: 'Error',
        jobResultMessage: 'SMTP failed'
      })
    ).toBe('SMTP failed')
    expect(CampaignManagerParentTable.methods.getErrorMessage.call({}, { status: 'Active' })).toBe('')

    expect(
      CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error',
        jobResultMessage: 'x'
      })
    ).toBe(false)
    expect(
      CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error'
      })
    ).toBe(true)

    expect(
      CampaignManagerParentTable.methods.isTargetUsersShowGroups.call({}, {
        status: ACTION_STATUSES.IDLE
      })
    ).toBe(true)
    expect(
      CampaignManagerParentTable.methods.isTargetUsersShowGroups.call({}, {
        status: ACTION_STATUSES.SCHEDULED
      })
    ).toBe(true)
    expect(
      CampaignManagerParentTable.methods.isTargetUsersShowGroups.call({}, {
        status: 'Error'
      })
    ).toBe(false)
  })

  it('statusItems watcher maps filter items and rerenders filters when items exist', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }
    const val = [{ text: 'Active', color: '#0f0' }]

    CampaignManagerParentTable.watch.statusItems.call(ctx, val)
    expect(set).toHaveBeenCalled()
    expect(col.filterableItems).toEqual([{ text: 'Active', color: '#0f0', value: 'Active' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('statusItems watcher updates filter items safely even when refTable is missing', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: {}
    }
    const val = [{ text: 'Paused' }]

    expect(() => CampaignManagerParentTable.watch.statusItems.call(ctx, val)).not.toThrow()
    expect(col.filterableItems).toEqual([{ text: 'Paused', value: 'Paused' }])
  })

  it('statusItems watcher uses value fallback when text is missing', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: {}
    }

    CampaignManagerParentTable.watch.statusItems.call(ctx, [{ value: 'Scheduled' }])
    expect(col.filterableItems).toEqual([{ value: 'Scheduled' }])
  })

  it('statusItems watcher does nothing for empty input list', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerParentTable.watch.statusItems.call(ctx, [])
    expect(set).not.toHaveBeenCalled()
    expect(reRenderFilters).not.toHaveBeenCalled()
    expect(col.filterableItems).toEqual([])
  })

  it('forwards row action handlers and helper button events via emits', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }
    const row = { resourceId: 'c1' }

    CampaignManagerParentTable.methods.handleRecordButtonClick.call(ctx, row)
    CampaignManagerParentTable.methods.handleEdit.call(ctx, row)
    CampaignManagerParentTable.methods.handlePreview.call(ctx, row)
    CampaignManagerParentTable.methods.handleDelete.call(ctx, row)
    CampaignManagerParentTable.methods.handleDuplicate.call(ctx, row)
    CampaignManagerParentTable.methods.handleLaunch.call(ctx, row)
    CampaignManagerParentTable.methods.handleTargetUsersGroupsClick.call(ctx, row)
    CampaignManagerParentTable.methods.toggleAddCampaignManagerModal.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-record-button-click', row)
    expect(emit).toHaveBeenCalledWith('on-edit', row)
    expect(emit).toHaveBeenCalledWith('on-preview', row)
    expect(emit).toHaveBeenCalledWith('on-delete', row)
    expect(emit).toHaveBeenCalledWith('on-duplicate', row)
    expect(emit).toHaveBeenCalledWith('on-launch', row)
    expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', row)
    expect(emit).toHaveBeenCalledWith('toggle-add-campaign-manager-modal')
  })

  it('delegates badge and field label helpers to utility functions', () => {
    const badgeSpy = jest.spyOn(CampaignManagerUtils, 'getStatusBadgeProps')
    const labelSpy = jest.spyOn(CommonFns, 'getDataTableFieldLabel')

    CampaignManagerParentTable.methods.getStatusBadgeProps.call({}, 'Error')
    CampaignManagerParentTable.methods.getDataTableFieldLabel.call({}, 'status')

    expect(badgeSpy).toHaveBeenCalledWith('Error')
    expect(labelSpy).toHaveBeenCalledWith('status')

    badgeSpy.mockRestore()
    labelSpy.mockRestore()
  })

  it('setLoading emits update:is-loading with given flag', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    CampaignManagerParentTable.methods.setLoading.call(ctx, true)
    CampaignManagerParentTable.methods.setLoading.call(ctx, false)

    expect(emit).toHaveBeenCalledWith('update:is-loading', true)
    expect(emit).toHaveBeenCalledWith('update:is-loading', false)
  })

  it('callForData handles empty api payload with defaults', async () => {
    searchCampaignManager.mockResolvedValue({
      data: {
        data: {}
      }
    })

    const ctx = {
      getCampaignManagerParentSearchPermissions: true,
      axiosPayload: { filter: {}, orderBy: '', ascending: true },
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 99
      },
      tableData: [{ resourceId: 'old' }],
      setLoading: jest.fn()
    }

    CampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(0)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([])
  })

  it('callForData sets loading true and then false via finally callback', async () => {
    searchCampaignManager.mockResolvedValue({
      data: {
        data: {
          results: []
        }
      }
    })

    const loadingFlags = []
    const ctx = {
      getCampaignManagerParentSearchPermissions: true,
      axiosPayload: { filter: {}, orderBy: '', ascending: true },
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      },
      tableData: [],
      setLoading: jest.fn((flag = false) => loadingFlags.push(flag))
    }

    CampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenCalled()
    expect(loadingFlags).toEqual([true, false])
  })

  it('callForData maps invalid numeric values to zero', async () => {
    searchCampaignManager.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'c-zero',
              targetUsers: undefined,
              instanceCount: 'not-a-number'
            }
          ]
        }
      }
    })

    const ctx = {
      getCampaignManagerParentSearchPermissions: true,
      axiosPayload: { filter: {}, orderBy: '', ascending: true },
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([{ resourceId: 'c-zero', targetUsers: 0, total: 0 }])
  })

  it('handleSearchChange keeps fields untouched when distribution column is absent', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerParentTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'Status', Value: 'Active' }]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Status', Value: 'Active' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleSearchChange only renames the first scenario distribution field', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerParentTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'CategoryDistributionType', Value: 'AI' },
              { FieldName: 'CategoryDistributionType', Value: 'Random' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'ScenarioDistribution', Value: 'AI' },
      { FieldName: 'CategoryDistributionType', Value: 'Random' }
    ])
  })

  it('tooltip and target users helpers return defaults for empty row', () => {
    expect(CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call({}, {})).toBe(true)
    expect(CampaignManagerParentTable.methods.isTargetUsersShowGroups.call({}, {})).toBe(false)
  })

  it('calls callForData on mounted hook', () => {
    const callForData = jest.fn()
    CampaignManagerParentTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('exportCampaignManagerList writes csv filename suffix correctly', async () => {
    exportCampaignManager.mockResolvedValue({ data: new Blob(['x']) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:csv-url')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      getCampaignManagerParentExportPermissions: true,
      axiosPayload: {
        orderBy: 'createTime',
        ascending: false,
        filter: { FilterGroups: [] }
      }
    }

    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(createdLinks[0].download).toBe('Campaign-Manager.csv')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handleMultipleDeleteOfCampaigns emits zero count when no selected items and selectAll=false', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: { totalNumberOfRecords: 10 },
      $emit: emit
    }

    CampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      [],
      [],
      false
    )

    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      {
        items: [],
        excludedItems: [],
        selectAll: false,
        filter: { FilterGroups: [] }
      },
      0
    )
  })

  it('getErrorMessage returns empty string when status is Error but message missing', () => {
    expect(CampaignManagerParentTable.methods.getErrorMessage.call({}, { status: 'Error' })).toBe('')
  })
})
