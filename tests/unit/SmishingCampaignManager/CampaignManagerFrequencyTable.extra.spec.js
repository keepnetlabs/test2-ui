jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchSmishingCampaignJobReport: jest.fn().mockResolvedValue({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    }),
    exportSmishingCampaignItems: jest.fn(),
    deleteSmishingCampaignItem: jest.fn(),
    stopSmishingCampaign: jest.fn(),
    startSmishingCampaign: jest.fn()
  }
}))

import { shallowMount } from '@vue/test-utils'
import CampaignManagerFrequencyTable from '@/components/SmishingCampaignManager/CampaignManagerFrequencyTable.vue'
import SmishingService from '@/api/smishing'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingCampaignManager/CampaignManagerFrequencyTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData fetches by parent id and frequency group', async () => {
    SmishingService.searchSmishingCampaignJobReport.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-1', status: 'Running' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { frequencyGroup: 'fg-1' },
      parentResourceId: 'parent-1',
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(SmishingService.searchSmishingCampaignJobReport).toHaveBeenCalledWith(
      expect.objectContaining({ smishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(ctx.tableData).toEqual([{ instanceGroup: 'ig-1', status: 'Running' }])
  })

  it('callForData handles missing nested payload with defaults', async () => {
    SmishingService.searchSmishingCampaignJobReport.mockResolvedValueOnce({ data: {} })
    const ctx = {
      item: { frequencyGroup: 'fg-x' },
      parentResourceId: 'parent-x',
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBeUndefined()
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('statusItems watcher maps status filters and handles missing status column', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Paused' }])
    expect(col.filterableItems).toEqual([{ text: 'Paused', value: 'Paused' }])
    expect(reRenderFilters).toHaveBeenCalled()

    const setMissing = jest.fn()
    const ctxMissing = {
      tableOptions: { columns: [{ property: 'other' }] },
      $set: setMissing,
      $refs: { refTable: { reRenderFilters } }
    }
    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctxMissing, [])
    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctxMissing, [{ text: 'Error' }])
    expect(setMissing).toHaveBeenCalledWith(undefined, 'filterableItems', [
      { text: 'Error', value: 'Error' }
    ])
  })

  it('exportCampaignManagerItemList no-ops for empty exportTypes and maps XLS for download', async () => {
    const ctx = {
      item: { frequencyGroup: 'fg-1' },
      parentResourceId: 'p-1',
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }
    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: [],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(SmishingService.exportSmishingCampaignItems).not.toHaveBeenCalled()

    SmishingService.exportSmishingCampaignItems.mockResolvedValueOnce({ data: new Uint8Array([1]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:sf')
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => ({
      href: '',
      download: '',
      click: jest.fn()
    }))

    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()
    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel', smishingCampaignFrequencyGroup: 'fg-1' }),
      'p-1'
    )

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('delete/stop/launch flows support default args and refresh state', async () => {
    SmishingService.deleteSmishingCampaignItem.mockResolvedValueOnce({})
    SmishingService.stopSmishingCampaign.mockResolvedValueOnce({})
    SmishingService.startSmishingCampaign.mockResolvedValueOnce({})

    const deleteCtx = {
      parentResourceId: 'p-del',
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow: jest.fn() } },
      callForData: jest.fn(),
      toggleShowDeleteDialog: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleOnDelete.call(deleteCtx)
    await flushPromises()
    expect(SmishingService.deleteSmishingCampaignItem).toHaveBeenCalledWith('p-del', undefined)
    expect(deleteCtx.isDeleteDialogActionButtonDisabled).toBe(false)

    const stopCtx = {
      parentResourceId: 'p-stop',
      isStopDialogActionButtonDisabled: false,
      callForData: jest.fn(),
      toggleStopCampaignDialog: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleStopCampaign.call(stopCtx)
    await flushPromises()
    expect(SmishingService.stopSmishingCampaign).toHaveBeenCalledWith('p-stop', undefined)
    expect(stopCtx.isStopDialogActionButtonDisabled).toBe(false)

    const launchCtx = {
      parentResourceId: 'p-launch',
      callForData: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleLaunch.call(launchCtx)
    await flushPromises()
    expect(SmishingService.startSmishingCampaign).toHaveBeenCalledWith('p-launch', undefined)
    expect(launchCtx.callForData).toHaveBeenCalled()
  })

  it('helper methods, toggles, emits and created hook cover fallback paths', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      parentResourceId: 'p-emit',
      isShowDeleteDialog: false,
      isShowStopDialog: false,
      selectedRow: { id: 'old' }
    }

    CampaignManagerFrequencyTable.methods.handleBackClick.call(ctx)
    CampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'p-emit' })

    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.selectedRow).toEqual({})

    CampaignManagerFrequencyTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(true)

    expect(
      CampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Done' })
    ).toBe('')
    expect(
      CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call(
        {},
        { status: 'Error', jobResultMessage: '' }
      )
    ).toBe(true)

    const callForData = jest.fn()
    CampaignManagerFrequencyTable.created.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('row actions are disabled when delete permission is absent', () => {
    const wrapper = shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: { frequencyGroup: 'fg-1', frequencyDescription: 'Weekly' },
        statusItems: [],
        parentResourceId: 'parent-1'
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingCampaignJobDeletePermissions': false
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        CommonCampaignManagerCancelCampaignDialog: true,
        CampaignManagerItemRowActions: true,
        DataTable: true,
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      }
    })

    expect(wrapper.vm.tableOptions.rowActions[1].disabled).toBe(true)
  })

  it('handleDelete and handleStop set selected row and open dialogs', () => {
    const deleteCtx = {
      selectedRow: {},
      toggleShowDeleteDialog: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleDelete.call(deleteCtx, {
      instanceGroup: 'd-1'
    })
    expect(deleteCtx.selectedRow).toEqual({ instanceGroup: 'd-1' })
    expect(deleteCtx.toggleShowDeleteDialog).toHaveBeenCalled()

    const stopCtx = {
      selectedRow: {},
      toggleStopCampaignDialog: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleStop.call(stopCtx, { instanceGroup: 's-1' })
    expect(stopCtx.selectedRow).toEqual({ instanceGroup: 's-1' })
    expect(stopCtx.toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('getStatusBadgeProps delegates to util and tooltip default row is true', () => {
    const badge = CampaignManagerFrequencyTable.methods.getStatusBadgeProps.call({}, 'Completed')
    expect(badge).toEqual(expect.objectContaining({ text: 'Completed' }))
    expect(
      CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call({}, {})
    ).toBe(true)
  })

  it('getErrorMessage returns job message for Error status and tooltip can be enabled', () => {
    expect(
      CampaignManagerFrequencyTable.methods.getErrorMessage.call(
        {},
        { status: 'Error', jobResultMessage: 'request timeout' }
      )
    ).toBe('request timeout')
    expect(
      CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call(
        {},
        { status: 'Error', jobResultMessage: 'request timeout' }
      )
    ).toBe(false)
  })

  it('status watcher does not throw when refTable is absent', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: {}
    }

    expect(() =>
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [
        { text: 'Running' }
      ])
    ).not.toThrow()
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
  })

  it('toggleStopCampaignDialog switches boolean state', () => {
    const ctx = { isShowStopDialog: false }
    CampaignManagerFrequencyTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(true)
    CampaignManagerFrequencyTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(false)
  })

  it('handleLaunch with explicit row uses parentResourceId and instanceGroup', async () => {
    SmishingService.startSmishingCampaign.mockResolvedValueOnce({})
    const ctx = {
      parentResourceId: 'p-exp',
      callForData: jest.fn()
    }

    CampaignManagerFrequencyTable.methods.handleLaunch.call(ctx, {
      instanceGroup: 'ig-exp'
    })
    await flushPromises()

    expect(SmishingService.startSmishingCampaign).toHaveBeenCalledWith('p-exp', 'ig-exp')
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('exportCampaignManagerItemList keeps lowercase xls exportType and file extension xlsx', async () => {
    SmishingService.exportSmishingCampaignItems.mockResolvedValueOnce({
      data: new Uint8Array([1])
    })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:lower-f')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      item: { frequencyGroup: 'fg-lower' },
      parentResourceId: 'p-lower',
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }
    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls', smishingCampaignFrequencyGroup: 'fg-lower' }),
      'p-lower'
    )
    expect(createdLinks[0].download).toBe('Smishing-Campaign-Runs.xlsx')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('toggleShowDeleteDialog does not clear selectedRow when closing from false state', () => {
    const ctx = {
      isShowDeleteDialog: false,
      selectedRow: { instanceGroup: 'ig-1' }
    }
    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ instanceGroup: 'ig-1' })
  })

  it('getTableAllRecordsText returns label with item name when present', () => {
    const ctx = { item: { name: 'Weekly Run' } }
    expect(CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call(ctx)).toContain(
      'Weekly Run'
    )
  })

  it('getTableAllRecordsText handles undefined item and item.name', () => {
    const ctx = {}
    expect(CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call(ctx)).toContain(
      'Runs Of Campaign'
    )
    const ctxPartial = { item: {} }
    expect(
      CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call(ctxPartial)
    ).toBeDefined()
  })

  it('exportCampaignManagerItemList CSV branch uses csv extension', async () => {
    SmishingService.exportSmishingCampaignItems.mockResolvedValueOnce({
      data: new Uint8Array([1])
    })
    window.URL.createObjectURL = jest.fn(() => 'blob:csv')
    const link = { click: jest.fn(), href: '', download: '' }
    jest.spyOn(document, 'createElement').mockReturnValue(link)

    const ctx = {
      item: { frequencyGroup: 'fg-1' },
      parentResourceId: 'p-1',
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }
    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(link.download).toBe('Smishing-Campaign-Runs.csv')
    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'p-1'
    )

    jest.restoreAllMocks()
  })

  it('exportCampaignManagerItemList multiple export types triggers multiple downloads', async () => {
    SmishingService.exportSmishingCampaignItems.mockResolvedValue({ data: new Uint8Array([1]) })
    window.URL.createObjectURL = jest.fn(() => 'blob:multi')
    const links = []
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      links.push(link)
      return link
    })

    const ctx = {
      item: { frequencyGroup: 'fg-1' },
      parentResourceId: 'p-1',
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }
    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledTimes(2)
    expect(links[0].download).toBe('Smishing-Campaign-Runs.xlsx')
    expect(links[1].download).toBe('Smishing-Campaign-Runs.csv')

    jest.restoreAllMocks()
  })

  it('rowActions stop permission disabled when getter returns false', () => {
    const wrapper = shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: { frequencyGroup: 'fg-1' },
        statusItems: [],
        parentResourceId: 'parent-1'
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingCampaignJobStopPermissions': false,
            'permissions/getSmishingCampaignJobDeletePermissions': true
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        CommonCampaignManagerCancelCampaignDialog: true,
        CampaignManagerItemRowActions: true,
        DataTable: true,
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      }
    })

    const stopAction = wrapper.vm.tableOptions.rowActions.find((a) => a.action === 'on-stop')
    expect(stopAction.disabled).toBe(true)
  })

  it('getStatusBadgeProps returns undefined for empty string', () => {
    const result = CampaignManagerFrequencyTable.methods.getStatusBadgeProps.call({}, '')
    expect(result).toBeUndefined()
  })
})
