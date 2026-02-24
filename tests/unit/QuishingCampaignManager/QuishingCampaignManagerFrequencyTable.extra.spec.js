jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignQuishingJob: jest.fn().mockResolvedValue({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    }),
    exportCampaignManagerItem: jest.fn(),
    deleteQuishingCampaignJob: jest.fn(),
    stopQuishingCampaignJob: jest.fn(),
    launchQuishingCampaignInstanceGroup: jest.fn()
  }
}))

import { shallowMount } from '@vue/test-utils'
import QuishingCampaignManagerFrequencyTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerFrequencyTable.vue'
import QuishingService from '@/api/quishing'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManagerFrequencyTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData fetches by parent id and frequency group', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValueOnce({
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

    QuishingCampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignQuishingJob).toHaveBeenCalledWith(
      expect.objectContaining({ phishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(ctx.tableData).toEqual([{ instanceGroup: 'ig-1', status: 'Running' }])
  })

  it('callForData handles missing nested payload with defaults', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValueOnce({ data: {} })
    const ctx = {
      item: { frequencyGroup: 'fg-x' },
      parentResourceId: 'parent-x',
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    QuishingCampaignManagerFrequencyTable.methods.callForData.call(ctx)
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

    QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctx, [{ text: 'Paused' }])
    expect(col.filterableItems).toEqual([{ text: 'Paused', value: 'Paused' }])
    expect(reRenderFilters).toHaveBeenCalled()

    const setMissing = jest.fn()
    const ctxMissing = {
      tableOptions: { columns: [{ property: 'other' }] },
      $set: setMissing,
      $refs: { refTable: { reRenderFilters } }
    }
    QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctxMissing, [])
    QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctxMissing, [{ text: 'Error' }])
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
    QuishingCampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: [],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(QuishingService.exportCampaignManagerItem).not.toHaveBeenCalled()

    QuishingService.exportCampaignManagerItem.mockResolvedValueOnce({ data: new Uint8Array([1]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:qf')
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => ({
      href: '',
      download: '',
      click: jest.fn()
    }))

    QuishingCampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()
    expect(QuishingService.exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel', phishingCampaignFrequencyGroup: 'fg-1' }),
      'p-1'
    )

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('delete/stop/launch flows support default args and refresh state', async () => {
    QuishingService.deleteQuishingCampaignJob.mockResolvedValueOnce({})
    QuishingService.stopQuishingCampaignJob.mockResolvedValueOnce({})
    QuishingService.launchQuishingCampaignInstanceGroup.mockResolvedValueOnce({})

    const deleteCtx = {
      parentResourceId: 'p-del',
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow: jest.fn() } },
      callForData: jest.fn(),
      toggleShowDeleteDialog: jest.fn()
    }
    QuishingCampaignManagerFrequencyTable.methods.handleOnDelete.call(deleteCtx)
    await flushPromises()
    expect(QuishingService.deleteQuishingCampaignJob).toHaveBeenCalledWith('p-del', undefined)
    expect(deleteCtx.isDeleteDialogActionButtonDisabled).toBe(false)

    const stopCtx = {
      item: { resourceId: 'item-stop' },
      isStopDialogActionButtonDisabled: false,
      callForData: jest.fn(),
      toggleStopCampaignDialog: jest.fn()
    }
    QuishingCampaignManagerFrequencyTable.methods.handleStopCampaign.call(stopCtx)
    await flushPromises()
    expect(QuishingService.stopQuishingCampaignJob).toHaveBeenCalledWith('item-stop', undefined)
    expect(stopCtx.isStopDialogActionButtonDisabled).toBe(false)

    const launchCtx = {
      parentResourceId: 'p-launch',
      callForData: jest.fn()
    }
    QuishingCampaignManagerFrequencyTable.methods.handleLaunch.call(launchCtx)
    await flushPromises()
    expect(QuishingService.launchQuishingCampaignInstanceGroup).toHaveBeenCalledWith(
      'p-launch',
      undefined
    )
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

    QuishingCampaignManagerFrequencyTable.methods.handleBackClick.call(ctx)
    QuishingCampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'p-emit' })

    QuishingCampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    QuishingCampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.selectedRow).toEqual({})

    QuishingCampaignManagerFrequencyTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(true)

    expect(QuishingCampaignManagerFrequencyTable.methods.getErrorMessage({ status: 'Done' })).toBe('')
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus({
        status: 'Error',
        jobResultMessage: ''
      })
    ).toBe(true)

    const callForData = jest.fn()
    QuishingCampaignManagerFrequencyTable.created.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('row actions are disabled when delete permission is absent', () => {
    const wrapper = shallowMount(QuishingCampaignManagerFrequencyTable, {
      propsData: {
        item: { frequencyGroup: 'fg-1', frequencyDescription: 'Weekly' },
        statusItems: [],
        parentResourceId: 'parent-1'
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignReportsDeletePermissions': false
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
    QuishingCampaignManagerFrequencyTable.methods.handleDelete.call(deleteCtx, { instanceGroup: 'd-1' })
    expect(deleteCtx.selectedRow).toEqual({ instanceGroup: 'd-1' })
    expect(deleteCtx.toggleShowDeleteDialog).toHaveBeenCalled()

    const stopCtx = {
      selectedRow: {},
      toggleStopCampaignDialog: jest.fn()
    }
    QuishingCampaignManagerFrequencyTable.methods.handleStop.call(stopCtx, { instanceGroup: 's-1' })
    expect(stopCtx.selectedRow).toEqual({ instanceGroup: 's-1' })
    expect(stopCtx.toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('getStatusBadgeProps delegates to util and tooltip default row is true', () => {
    const badge = QuishingCampaignManagerFrequencyTable.methods.getStatusBadgeProps('Completed')
    expect(badge).toEqual(expect.objectContaining({ text: 'Completed' }))
    expect(QuishingCampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus()).toBe(true)
  })

  it('getErrorMessage returns job message for Error status and tooltip can be enabled', () => {
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getErrorMessage({
        status: 'Error',
        jobResultMessage: 'request timeout'
      })
    ).toBe('request timeout')
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus({
        status: 'Error',
        jobResultMessage: 'request timeout'
      })
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
      QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctx, [{ text: 'Running' }])
    ).not.toThrow()
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
  })

  it('toggleStopCampaignDialog switches boolean state', () => {
    const ctx = { isShowStopDialog: false }
    QuishingCampaignManagerFrequencyTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(true)
    QuishingCampaignManagerFrequencyTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(false)
  })

  it('handleLaunch with explicit row uses parentResourceId and instanceGroup', async () => {
    QuishingService.launchQuishingCampaignInstanceGroup.mockResolvedValueOnce({})
    const ctx = {
      parentResourceId: 'p-exp',
      callForData: jest.fn()
    }

    QuishingCampaignManagerFrequencyTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-exp' })
    await flushPromises()

    expect(QuishingService.launchQuishingCampaignInstanceGroup).toHaveBeenCalledWith(
      'p-exp',
      'ig-exp'
    )
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('exportCampaignManagerItemList keeps lowercase xls exportType and file extension xlsx', async () => {
    QuishingService.exportCampaignManagerItem.mockResolvedValueOnce({ data: new Uint8Array([1]) })
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
    QuishingCampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(QuishingService.exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls', phishingCampaignFrequencyGroup: 'fg-lower' }),
      'p-lower'
    )
    expect(createdLinks[0].download).toBe('Quishing-Campaign-Manager-Run.xlsx')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })
})
