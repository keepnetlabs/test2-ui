jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    searchCallbackJobs: jest.fn().mockResolvedValue({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    }),
    exportCallbackJobs: jest.fn().mockResolvedValue({ data: Buffer.from('') }),
    deleteCallbackJob: jest.fn(),
    stopCallbackCampaignJob: jest.fn(),
    startCallbackCampaignJob: jest.fn()
  }
}))

import { shallowMount } from '@vue/test-utils'
import CampaignManagerFrequencyTable from '@/components/CallbackCampaignManager/CampaignManagerFrequencyTable.vue'
import CallbackService from '@/api/callback'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerFrequencyTable.vue (extra branch coverage)', () => {
  const createWrapper = (props = {}) =>
    shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: {
          frequencyGroup: 'fg-1',
          frequencyDescription: 'Weekly',
          instanceGroup: 'ig-1'
        },
        statusItems: [],
        parentResourceId: 'parent-1',
        parentCampaignType: 4,
        ...props
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignReportsPausePermissions': true,
            'permissions/getCampaignReportsDeletePermissions': true
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        CampaignManagerItemRowActions: true,
        DataTable: { template: '<div><slot name="table-all-records" /></div>' },
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      }
    })

  it('getTooltipDisabilityStatus returns true when no error', () => {
    const wrapper = createWrapper()
    const row = { status: 'Scheduled', jobResultMessage: '' }
    expect(wrapper.vm.getTooltipDisabilityStatus(row)).toBe(true)
  })

  it('getTooltipDisabilityStatus returns false when has error', () => {
    const wrapper = createWrapper()
    const row = { status: 'Error', jobResultMessage: 'Failed' }
    expect(wrapper.vm.getTooltipDisabilityStatus(row)).toBe(false)
  })

  it('getErrorMessage returns jobResultMessage when status is Error', () => {
    const wrapper = createWrapper()
    const row = { status: 'Error', jobResultMessage: 'Custom error' }
    expect(wrapper.vm.getErrorMessage(row)).toBe('Custom error')
  })

  it('getErrorMessage returns empty string when status is not Error', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getErrorMessage({ status: 'Running', jobResultMessage: 'x' })).toBe('')
  })

  it('computed getTableAllRecordsText formats frequency instance name and fallback', () => {
    expect(
      CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call({
        item: { name: 'Campaign A' }
      })
    ).toBe('Runs Of Campaign: Campaign A')
    expect(
      CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call({
        item: null
      })
    ).toBe('Runs Of Campaign: undefined')
  })

  it('handleDelete sets selected row and opens dialog', () => {
    const ctx = {
      selectedRow: {},
      toggleShowDeleteDialog: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleDelete.call(ctx, { instanceGroup: 'ig-2' })
    expect(ctx.selectedRow).toEqual({ instanceGroup: 'ig-2' })
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('handleDelete uses default empty row when payload is missing', () => {
    const ctx = {
      selectedRow: { x: 1 },
      toggleShowDeleteDialog: jest.fn()
    }
    CampaignManagerFrequencyTable.methods.handleDelete.call(ctx)
    expect(ctx.selectedRow).toEqual({})
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('handleOnDelete toggles action button flag and closes dialog after success', async () => {
    CallbackService.deleteCallbackJob.mockResolvedValueOnce({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-err',
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn()
    }

    CampaignManagerFrequencyTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-err' })
    await flushPromises()

    expect(CallbackService.deleteCallbackJob).toHaveBeenCalledWith('parent-err', 'ig-err')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
    expect(ctx.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('handleBackClick and handleOnAddButtonClick emit expected events', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit, parentResourceId: 'parent-emit' }
    CampaignManagerFrequencyTable.methods.handleBackClick.call(ctx)
    CampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'parent-emit' })
  })

  it('getStatusBadgeProps delegates and getTooltipDisabilityStatus default row branch is true', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusBadgeProps('Completed')).toEqual(
      expect.objectContaining({ text: 'Completed' })
    )
    expect(wrapper.vm.getTooltipDisabilityStatus()).toBe(true)
  })

  it('computed getTableAllRecordsText supports normal and fallback item', () => {
    expect(
      CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call({
        item: { name: 'Callback Campaign A' }
      })
    ).toBe('Runs Of Campaign: Callback Campaign A')
    expect(
      CampaignManagerFrequencyTable.computed.getTableAllRecordsText.call({
        item: null
      })
    ).toBe('Runs Of Campaign: undefined')
  })

  it('toggleShowDeleteDialog clears selected row only when dialog was open', () => {
    const ctx = { isShowDeleteDialog: false, selectedRow: { id: 'x' } }
    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 'x' })

    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({})
  })

  it('handleDelete default argument sets empty selected row', () => {
    const ctx = { selectedRow: { old: true }, toggleShowDeleteDialog: jest.fn() }
    CampaignManagerFrequencyTable.methods.handleDelete.call(ctx)
    expect(ctx.selectedRow).toEqual({})
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('exportCampaignManagerItemList safely no-ops with empty export types', async () => {
    const ctx = {
      parentResourceId: 'parent-no-export',
      item: { frequencyGroup: 'fg-1' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }
    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: [],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(CallbackService.exportCallbackJobs).not.toHaveBeenCalled()
  })

  it('reRenderFilters path is safe when refs are absent in status watcher', () => {
    const col = { property: 'status', filterableItems: [] }
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: {}
    }

    expect(() =>
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Error' }])
    ).not.toThrow()
    expect(col.filterableItems).toEqual([{ text: 'Error', value: 'Error' }])
  })

  it('callForData handles missing nested payload with default branches', async () => {
    CallbackService.searchCallbackJobs.mockResolvedValueOnce({ data: {} })
    const ctx = {
      item: { frequencyGroup: 'fg-default' },
      parentResourceId: 'parent-default',
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(CallbackService.searchCallbackJobs).toHaveBeenCalledWith(
      expect.objectContaining({ phishingCampaignFrequencyGroup: 'fg-default' }),
      'parent-default'
    )
    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBeUndefined()
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('table row actions are disabled when related permissions are missing', () => {
    const wrapper = shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: {
          frequencyGroup: 'fg-1',
          frequencyDescription: 'Weekly',
          instanceGroup: 'ig-1'
        },
        statusItems: [],
        parentResourceId: 'parent-1'
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCallbackCampaignJobStopPermissions': false,
            'permissions/getCallbackCampaignJobDeletePermissions': false
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        CampaignManagerItemRowActions: true,
        DataTable: true,
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      }
    })

    expect(wrapper.vm.tableOptions.rowActions[0].disabled).toBe(true)
    expect(wrapper.vm.tableOptions.rowActions[1].disabled).toBe(true)
  })

  it('handleStop and handleLaunch use default row object when argument is omitted', async () => {
    CallbackService.stopCallbackCampaignJob.mockResolvedValueOnce({})
    CallbackService.startCallbackCampaignJob.mockResolvedValueOnce({})
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-default-row',
      callForData
    }

    CampaignManagerFrequencyTable.methods.handleStop.call(ctx)
    CampaignManagerFrequencyTable.methods.handleLaunch.call(ctx)
    await flushPromises()

    expect(CallbackService.stopCallbackCampaignJob).toHaveBeenCalledWith(
      'parent-default-row',
      undefined
    )
    expect(CallbackService.startCallbackCampaignJob).toHaveBeenCalledWith(
      'parent-default-row',
      undefined
    )
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('handleOnDelete supports default item object and still resets dialog state in finally', async () => {
    CallbackService.deleteCallbackJob.mockResolvedValueOnce({})
    const ctx = {
      parentResourceId: 'parent-default-delete',
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow: jest.fn() } },
      callForData: jest.fn(),
      toggleShowDeleteDialog: jest.fn()
    }

    CampaignManagerFrequencyTable.methods.handleOnDelete.call(ctx)
    await flushPromises()

    expect(CallbackService.deleteCallbackJob).toHaveBeenCalledWith(
      'parent-default-delete',
      undefined
    )
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
    expect(ctx.isDeleteDialogActionButtonDisabled).toBe(false)
  })
})
