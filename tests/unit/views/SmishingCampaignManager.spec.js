import CampaignManager from '@/views/SmishingCampaignManager.vue'
import SmishingService from '@/api/smishing'
import { createTargetGroup } from '@/api/targetUsers'

jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getCampaignManagerFormDetails: jest.fn(() =>
      Promise.resolve({ data: { data: { status: [{ text: 'Running', value: 'running' }] } } })
    ),
    getSmishingScenarioFormDetails: jest.fn(() =>
      Promise.resolve({ data: { data: { methodTypes: [{ id: 1 }], difficultyTypes: [] } } })
    ),
    deleteSmishingCampaign: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/targetUsers', () => ({
  createTargetGroup: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingCampaignManager.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created loaders map form/scenario details', async () => {
    const ctx = { formDetails: {}, scenarioDetailsLookup: {} }
    CampaignManager.methods.callForFormDetails.call(ctx)
    CampaignManager.methods.callForScenarioDetails.call(ctx)
    await flushPromises()
    expect(ctx.formDetails.status).toEqual([{ text: 'Running', value: 'running' }])
    expect(ctx.scenarioDetailsLookup.methodTypes).toEqual([{ id: 1 }])
  })

  it('beforeRouteLeave blocks when modal open and allows otherwise', () => {
    const next = jest.fn()
    const closeOverlay = jest.fn()
    CampaignManager.beforeRouteLeave.call(
      { $refs: { refCampaignModal: { status: true, closeOverlay } } },
      {},
      {},
      next
    )
    expect(closeOverlay).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    CampaignManager.beforeRouteLeave.call({ $refs: { refCampaignModal: { status: false } } }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('route watcher resets table state only on parent query', () => {
    const ctx = {
      selectedParentItem: { id: 1 },
      selectedInstanceItem: { id: 2 },
      isItemTableShowing: true,
      isFrequencyTableShowing: true,
      $router: { replace: jest.fn() }
    }
    CampaignManager.watch['$route.query'].handler.call(ctx, { status: 'parent' })
    expect(ctx.selectedParentItem).toBe(null)
    expect(ctx.selectedInstanceItem).toBe(null)
    expect(ctx.isItemTableShowing).toBe(false)
    expect(ctx.$router.replace).toHaveBeenCalledWith('/smishing-simulator/campaign-manager')

    ctx.selectedParentItem = { id: 5 }
    ctx.$router.replace.mockClear()
    CampaignManager.watch['$route.query'].handler.call(ctx, { status: 'other' })
    expect(ctx.selectedParentItem).toEqual({ id: 5 })
    expect(ctx.$router.replace).not.toHaveBeenCalled()
  })

  it('record handlers route for one-time rows and open nested tables otherwise', () => {
    const ctx = {
      $router: { push: jest.fn() },
      selectedParentItem: { resourceId: 'p1', frequency: 2 },
      selectedInstanceItem: null,
      isItemTableShowing: false,
      isFrequencyTableShowing: false,
      $refs: { campaignManagerItemTable: { resetTable: jest.fn(), callForData: jest.fn() } },
      toggleItemTableShowing: CampaignManager.methods.toggleItemTableShowing,
      toggleFrequencyTableShowing: CampaignManager.methods.toggleFrequencyTableShowing
    }

    CampaignManager.methods.handleOnRecordButtonClick.call(ctx, {
      resourceId: 'r1',
      total: 1,
      status: 'Running',
      mostRecentInstanceGroup: 3
    })
    expect(ctx.$router.push).toHaveBeenCalledWith({
      name: 'Smishing Report',
      params: { id: 'r1', instanceGroup: 3 }
    })

    CampaignManager.methods.handleOnRecordButtonClick.call(ctx, {
      resourceId: 'r2',
      total: 1,
      status: 'Running',
      frequency: 1
    })
    expect(ctx.selectedParentItem).toEqual({ resourceId: 'r2', total: 1, status: 'Running', frequency: 1 })
    expect(ctx.isItemTableShowing).toBe(true)

    CampaignManager.methods.handleItemTableRecordButtonClick.call(ctx, {
      total: 1,
      status: 'Running',
      instanceGroup: 10
    })
    expect(ctx.selectedInstanceItem).toEqual({ total: 1, status: 'Running', instanceGroup: 10 })
    expect(ctx.isFrequencyTableShowing).toBe(true)
  })

  it('handleOnDelete respects permission guard', async () => {
    const toggleShowDeleteDialog = jest.fn()
    const setDeleteDialogActionButtonDisabled = jest.fn()
    const permittedCtx = {
      getSmishingCampaignManagerDeletePermissions: true,
      toggleShowDeleteDialog,
      setDeleteDialogActionButtonDisabled,
      $refs: {
        campaignManagerParentTable: {
          callForData: jest.fn(),
          $refs: { refTable: { unSelectRow: jest.fn(), changeServerSideSelectionCount: jest.fn() } }
        }
      }
    }
    await CampaignManager.methods.handleOnDelete.call(permittedCtx, { resourceId: 'x1' })
    await flushPromises()
    expect(SmishingService.deleteSmishingCampaign).toHaveBeenCalledWith('x1')
    expect(toggleShowDeleteDialog).toHaveBeenCalled()

    const blockedCtx = {
      getSmishingCampaignManagerDeletePermissions: false,
      toggleShowDeleteDialog: jest.fn(),
      setDeleteDialogActionButtonDisabled: jest.fn()
    }
    await CampaignManager.methods.handleOnDelete.call(blockedCtx, { resourceId: 'x2' })
    expect(SmishingService.deleteSmishingCampaign).toHaveBeenCalledTimes(1)
  })

  it('target group modal confirm/close and no-target-group flow updates states', async () => {
    const ctx = {
      isTargetGroupModalVisible: true,
      isCreateTargetGroupButtonDisabled: false,
      isNoTargetUserGroupModalVisible: true,
      $refs: { campaignManagerParentTable: { callForData: jest.fn() } },
      handleShowTargetGroupModal: CampaignManager.methods.handleShowTargetGroupModal
    }
    CampaignManager.methods.handleCloseTargetGroupModal.call(ctx)
    expect(ctx.isTargetGroupModalVisible).toBe(false)

    CampaignManager.methods.handleConfirmTargetGroupModal.call(ctx, { name: 'tg' })
    await flushPromises()
    expect(createTargetGroup).toHaveBeenCalledWith({ name: 'tg' })
    expect(ctx.isTargetGroupModalVisible).toBe(false)
    expect(ctx.$refs.campaignManagerParentTable.callForData).toHaveBeenCalled()
    expect(ctx.isCreateTargetGroupButtonDisabled).toBe(false)

    CampaignManager.methods.handleConfirmNoTargetUserGroupModal.call(ctx)
    expect(ctx.isNoTargetUserGroupModalVisible).toBe(false)
    expect(ctx.isTargetGroupModalVisible).toBe(true)
  })
})

