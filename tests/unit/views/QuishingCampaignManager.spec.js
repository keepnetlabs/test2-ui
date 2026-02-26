import QuishingCampaignManager from '@/views/QuishingCampaignManager.vue'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getCampaignManagerFormDetails: jest.fn(() =>
      Promise.resolve({ data: { data: { status: [{ text: 'Running', value: 'Running' }] } } })
    ),
    deleteCampaign: jest.fn(() => Promise.resolve()),
    deleteBulkCampaigns: jest.fn(() => Promise.resolve()),
    getCampaignManagerPreview: jest.fn()
  }
}))

const QuishingService = require('@/api/quishing').default
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManager.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForFormDetails maps payload and getStatusItems returns fallback', async () => {
    const ctx = { formDetails: {} }
    QuishingCampaignManager.methods.callForFormDetails.call(ctx)
    await flushPromises()
    expect(ctx.formDetails.status).toEqual([{ text: 'Running', value: 'Running' }])
    expect(QuishingCampaignManager.computed.getStatusItems.call({ formDetails: {} })).toEqual([])
  })

  it('beforeRouteLeave blocks when campaign modal is open and allows otherwise', () => {
    const next = jest.fn()
    const closeOverlay = jest.fn()
    QuishingCampaignManager.beforeRouteLeave.call(
      { $refs: { refCampaignModal: { status: true, closeOverlay } } },
      {},
      {},
      next
    )
    expect(closeOverlay).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    QuishingCampaignManager.beforeRouteLeave.call({ $refs: { refCampaignModal: { status: false } } }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('route query watcher resets parent/item state only for parent status', () => {
    const ctx = {
      selectedParentItem: { resourceId: 'p1' },
      selectedInstanceItem: { instanceGroup: 'i1' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true,
      $router: { replace: jest.fn() }
    }
    QuishingCampaignManager.watch['$route.query'].handler.call(ctx, { status: 'parent' })
    expect(ctx.selectedParentItem).toBe(null)
    expect(ctx.isFrequencyTableShowing).toBe(false)
    expect(ctx.$router.replace).toHaveBeenCalledWith('/quishing-simulator/campaign-manager')

    ctx.selectedParentItem = { resourceId: 'p2' }
    ctx.$router.replace.mockClear()
    QuishingCampaignManager.watch['$route.query'].handler.call(ctx, { status: 'item' })
    expect(ctx.selectedParentItem).toEqual({ resourceId: 'p2' })
    expect(ctx.$router.replace).not.toHaveBeenCalled()
  })

  it('handleOnRecordButtonClick routes for one-time active rows and opens item table otherwise', () => {
    const ctx = {
      selectedParentItem: null,
      $router: { push: jest.fn() },
      $refs: {
        campaignManagerItemTable: { resetTable: jest.fn(), callForData: jest.fn() }
      },
      isItemTableShowing: false,
      toggleItemTableShowing: QuishingCampaignManager.methods.toggleItemTableShowing
    }
    QuishingCampaignManager.methods.handleOnRecordButtonClick.call(ctx, {
      resourceId: 'r1',
      total: 1,
      status: 'Running',
      mostRecentInstanceGroup: 2
    })
    expect(ctx.$router.push).toHaveBeenCalledWith({
      name: 'Quishing Report',
      params: { id: 'r1', instanceGroup: 2 }
    })

    QuishingCampaignManager.methods.handleOnRecordButtonClick.call(ctx, {
      resourceId: 'r2',
      total: 1,
      status: 'Running',
      frequency: 2
    })
    expect(ctx.selectedParentItem).toEqual({ resourceId: 'r2', total: 1, status: 'Running', frequency: 2 })
    expect(ctx.$refs.campaignManagerItemTable.resetTable).toHaveBeenCalled()
    expect(ctx.isItemTableShowing).toBe(true)
  })

  it('handleOnDelete runs only with permission and resets flags in finally', async () => {
    const setDeleteDialogActionButtonDisabled = jest.fn((flag = false) => {
      ctx.isDeleteDialogActionButtonDisabled = flag
    })
    const toggleShowDeleteDialog = jest.fn()
    const ctx = {
      getQuishingCampaignManagerDeletePermissions: true,
      setDeleteDialogActionButtonDisabled,
      toggleShowDeleteDialog,
      $refs: {
        campaignManagerParentTable: {
          callForData: jest.fn(),
          $refs: { refTable: { unSelectRow: jest.fn(), changeServerSideSelectionCount: jest.fn() } }
        }
      }
    }
    await QuishingCampaignManager.methods.handleOnDelete.call(ctx, { resourceId: 'x1' })
    await flushPromises()
    expect(QuishingService.deleteCampaign).toHaveBeenCalledWith('x1')
    expect(toggleShowDeleteDialog).toHaveBeenCalled()

    const noPermCtx = {
      getQuishingCampaignManagerDeletePermissions: false,
      setDeleteDialogActionButtonDisabled: jest.fn(),
      toggleShowDeleteDialog: jest.fn()
    }
    await QuishingCampaignManager.methods.handleOnDelete.call(noPermCtx, { resourceId: 'x2' })
    expect(QuishingService.deleteCampaign).toHaveBeenCalledTimes(1)
  })
})

