jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchSmishingCampaignJobReport: jest.fn(),
    exportSmishingCampaignItems: jest.fn(),
    startSmishingCampaign: jest.fn(),
    stopSmishingCampaign: jest.fn(),
    deleteSmishingCampaignItem: jest.fn()
  }
}))

import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemTable from '@/components/SmishingCampaignManager/CampaignManagerItemTable.vue'
import SmishingService from '@/api/smishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerItemTable.vue (extra branch coverage)', () => {
  describe('getRecordsButtonSingleLabel', () => {
    it('returns empty string when status is Idle', () => {
      const ctx = { item: { frequency: 0 } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Idle',
          frequency: 0
        })
      ).toBe('')
    })
    it('returns empty string when item is recurring', () => {
      const ctx = { item: { frequency: 1 } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 0
        })
      ).toBe('')
    })
    it('returns View Report when not Idle and not recurring', () => {
      const ctx = { item: { frequency: 0 } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 0
        })
      ).toBe('View Report')
    })

    it('returns View Report when item.frequency is null (non-recurring)', () => {
      const ctx = { item: { frequency: null } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Running'
        })
      ).toBe('View Report')
    })
  })

  describe('getTooltipDisabilityStatus', () => {
    it('returns false when status is Error and has jobResultMessage', () => {
      const ctx = {}
      expect(
        CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Failed'
        })
      ).toBe(false)
    })

    it('returns true for non-error rows', () => {
      const ctx = {}
      expect(
        CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Completed',
          jobResultMessage: 'ignored'
        })
      ).toBe(true)
    })
  })

  describe('getErrorMessage', () => {
    it('returns jobResultMessage when status is Error', () => {
      const ctx = {}
      expect(
        CampaignManagerItemTable.methods.getErrorMessage.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Custom'
        })
      ).toBe('Custom')
    })

    it('returns empty string when status is not Error', () => {
      const ctx = {}
      expect(
        CampaignManagerItemTable.methods.getErrorMessage.call(ctx, {
          status: 'Running',
          jobResultMessage: 'Custom'
        })
      ).toBe('')
    })
  })

  describe('table helper methods', () => {
    it('reRenderFilters is safe when table ref is missing', () => {
      const ctx = { $refs: {} }
      expect(() => CampaignManagerItemTable.methods.reRenderFilters.call(ctx, {})).not.toThrow()
    })

    it('resetTable resets payload and calls search/filter reset helpers', () => {
      const resetSearchText = jest.fn()
      const reRenderFilters = jest.fn()
      const ctx = {
        axiosPayload: { orderBy: 'Other' },
        $refs: { refTable: { resetSearchText, reRenderFilters } },
        resetSearchText: CampaignManagerItemTable.methods.resetSearchText,
        reRenderFilters: CampaignManagerItemTable.methods.reRenderFilters
      }

      CampaignManagerItemTable.methods.resetTable.call(ctx)

      expect(resetSearchText).toHaveBeenCalled()
      expect(reRenderFilters).toHaveBeenCalledWith({})
      expect(ctx.axiosPayload.orderBy).toBe('CreatedDate')
    })
  })

  describe('default-argument branches on async actions', () => {
    it('handleStopCampaign works with missing row argument', async () => {
      SmishingService.stopSmishingCampaign.mockResolvedValueOnce({})
      const ctx = {
        item: { resourceId: 's-1' },
        isStopDialogActionButtonDisabled: false,
        callForData: jest.fn(),
        toggleStopCampaignDialog: jest.fn()
      }

      CampaignManagerItemTable.methods.handleStopCampaign.call(ctx)
      await flushPromises()

      expect(SmishingService.stopSmishingCampaign).toHaveBeenCalledWith('s-1', undefined)
      expect(ctx.isStopDialogActionButtonDisabled).toBe(false)
      expect(ctx.callForData).toHaveBeenCalled()
      expect(ctx.toggleStopCampaignDialog).toHaveBeenCalled()
    })

    it('handleOnDelete works with missing item argument', async () => {
      SmishingService.deleteSmishingCampaignItem.mockResolvedValueOnce({})
      const ctx = {
        item: { resourceId: 's-2' },
        isDeleteDialogActionButtonDisabled: false,
        $refs: { refTable: { unSelectRow: jest.fn() } },
        callForData: jest.fn(),
        toggleShowDeleteDialog: jest.fn()
      }

      CampaignManagerItemTable.methods.handleOnDelete.call(ctx)
      await flushPromises()

      expect(SmishingService.deleteSmishingCampaignItem).toHaveBeenCalledWith('s-2', undefined)
      expect(ctx.isDeleteDialogActionButtonDisabled).toBe(false)
      expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
      expect(ctx.$refs.refTable.unSelectRow).toHaveBeenCalled()
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('handleLaunch works with missing row argument', async () => {
      SmishingService.startSmishingCampaign.mockResolvedValueOnce({})
      const ctx = {
        item: { resourceId: 's-3' },
        callForData: jest.fn()
      }

      CampaignManagerItemTable.methods.handleLaunch.call(ctx)
      await flushPromises()

      expect(SmishingService.startSmishingCampaign).toHaveBeenCalledWith('s-3', undefined)
      expect(ctx.callForData).toHaveBeenCalled()
    })
  })

  describe('additional branch coverage', () => {
    it('callForData handles missing nested response data safely', async () => {
      SmishingService.searchSmishingCampaignJobReport.mockResolvedValueOnce({ data: {} })
      const ctx = {
        item: { resourceId: 's-safe' },
        axiosPayload: { filter: {} },
        serverSideProps: {},
        tableData: [{ old: true }],
        setLoading: jest.fn(),
        $nextTick: (fn) => fn()
      }

      CampaignManagerItemTable.methods.callForData.call(ctx)
      await flushPromises()

      expect(ctx.tableData).toEqual([])
      expect(ctx.serverSideProps.totalNumberOfRecords).toBeUndefined()
      expect(ctx.setLoading).toHaveBeenCalled()
    })

    it('exportCampaignManagerItemList no-ops when exportTypes is empty', async () => {
      const ctx = {
        item: { resourceId: 's-exp' },
        axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
      }
      CampaignManagerItemTable.methods.exportCampaignManagerItemList.call(ctx, {
        exportTypes: [],
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false
      })
      await flushPromises()
      expect(SmishingService.exportSmishingCampaignItems).not.toHaveBeenCalled()
    })

    it('status watcher branch handles missing status column definition', () => {
      const set = jest.fn()
      const reRenderFilters = jest.fn()
      const ctx = {
        tableOptions: { columns: [{ property: 'other' }] },
        $set: set,
        $refs: { refTable: { reRenderFilters } }
      }

      CampaignManagerItemTable.watch.statusItems.handler.call(ctx, [{ text: 'Running' }])
      expect(set).toHaveBeenCalledWith(undefined, 'filterableItems', [
        { text: 'Running', value: 'Running' }
      ])
      expect(reRenderFilters).toHaveBeenCalled()
    })

    it('table actions are disabled when related permissions are absent', () => {
      SmishingService.searchSmishingCampaignJobReport.mockResolvedValueOnce({
        data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
      })
      const wrapper = shallowMount(CampaignManagerItemTable, {
        propsData: {
          item: { resourceId: 'sm-1', name: 'Smishing X' },
          statusItems: []
        },
        mocks: {
          $store: {
            getters: {
              'permissions/getSmishingCampaignManagerCreatePermissions': false,
              'permissions/getSmishingCampaignJobStopPermissions': false,
              'permissions/getSmishingCampaignJobDeletePermissions': false
            }
          }
        },
        stubs: {
          DataTable: true,
          CampaignManagerItemDeleteDialog: true,
          CommonCampaignManagerCancelCampaignDialog: true,
          CampaignManagerItemRowActions: true,
          Badge: true,
          TheRecordsButton: true,
          VBtn: true,
          VIcon: true,
          VTooltip: true
        }
      })

      expect(wrapper.vm.tableOptions.addButton.disabled).toBe(true)
      expect(wrapper.vm.tableOptions.rowActions[0].disabled).toBe(true)
      expect(wrapper.vm.tableOptions.rowActions[1].disabled).toBe(true)
    })
  })
})
