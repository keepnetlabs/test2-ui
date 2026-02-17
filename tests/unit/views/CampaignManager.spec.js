import { shallowMount } from '@vue/test-utils'
import CampaignManager from '@/views/CampaignManager.vue'

jest.mock('@/api/phishingsimulator', () => ({
  bulkDeleteCampaignReports: jest.fn(() => Promise.resolve()),
  deleteCampaignManager: jest.fn(() => Promise.resolve()),
  getCampaignManagerFormDetails: jest.fn(() => Promise.resolve({ data: { data: { status: [{ text: 'Running' }] } } })),
  launchPhishingCampaignInstanceGroup: jest.fn(() => Promise.resolve()),
  stopPhishingCampaignJob: jest.fn(() => Promise.resolve())
}))

const {
  bulkDeleteCampaignReports,
  deleteCampaignManager,
  getCampaignManagerFormDetails,
  launchPhishingCampaignInstanceGroup,
  stopPhishingCampaignJob
} = require('@/api/phishingsimulator')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManager.vue', () => {
  const createWrapper = () => {
    return shallowMount(CampaignManager, {
      mocks: {
        $store: {
          getters: {
            'auth/userGetter': { id: 'u1' },
            'permissions/getCampaignManagerParentDeletePermissions': true
          }
        },
        $route: { query: {} },
        $router: { replace: jest.fn() }
      },
      stubs: {
        KContainer: true,
        CampaignManagerParentTable: true,
        CampaignManagerItemTable: true,
        CampaignManagerFrequencyTable: true,
        CampaignManagerAddOrEditModal: true,
        CampaignManagerNewInstanceModal: true,
        CampaignManagerTargetGroupsDialog: true,
        CommonCampaignManagerDeleteDialog: true,
        CommonCampaignManagerCreateNewInstanceDialog: true,
        CommonCampaignManagerPreviewDialog: true,
        CommonCampaignManagerLaunchCampaignDialog: true,
        CommonCampaignManagerCancelCampaignDialog: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads form details on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getCampaignManagerFormDetails).toHaveBeenCalled()
    expect(wrapper.vm.formDetails.status).toEqual([{ text: 'Running' }])
  })

  it('handles parent->item->frequency navigation toggles', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.campaignManagerParentTable = { callForData: jest.fn() }
    wrapper.vm.$refs.campaignManagerItemTable = { callForData: jest.fn(), resetTable: jest.fn() }

    wrapper.vm.handleOnRecordButtonClick({ resourceId: 'parent-1' })
    expect(wrapper.vm.selectedParentItem).toEqual({ resourceId: 'parent-1' })
    expect(wrapper.vm.isItemTableShowing).toBe(true)

    wrapper.vm.handleItemTableRecordButtonClick({ instanceGroup: 'ig-1' })
    expect(wrapper.vm.selectedInstanceItem).toEqual({ instanceGroup: 'ig-1' })
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)

    wrapper.vm.handleOnBackClick()
    expect(wrapper.vm.isItemTableShowing).toBe(false)

    wrapper.vm.handleOnFrequencyBackClick()
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
  })

  it('controls launch/new instance flow', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleLaunch({ resourceId: 'r-launch' })
    expect(wrapper.vm.launchResourceId).toBe('r-launch')
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)

    wrapper.vm.handleConfirmLaunchDialog('new-instance-id')
    expect(wrapper.vm.instanceResourceId).toBe('new-instance-id')
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.isShowNewInstanceModal).toBe(true)

    wrapper.vm.closeNewInstanceModal()
    expect(wrapper.vm.instanceResourceId).toBe('')
    expect(wrapper.vm.isShowNewInstanceModal).toBe(false)
  })

  it('handles edit/duplicate/preview dialog states', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleItemOnEdit({ id: 'e1' })
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(true)

    wrapper.vm.toggleAddCampaignManagerModal()
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)

    wrapper.vm.handleItemOnDuplicate({ id: 'd1' })
    expect(wrapper.vm.isDuplicate).toBe(true)

    wrapper.vm.handleItemOnPreview({ id: 'p1' })
    expect(wrapper.vm.isShowPreviewDialog).toBe(true)

    wrapper.vm.toggleShowPreviewDialog()
    expect(wrapper.vm.isShowPreviewDialog).toBe(false)
  })

  it('runs start and stop campaign flows', async () => {
    const wrapper = createWrapper()
    const itemTableCall = jest.fn()
    wrapper.vm.$refs.campaignManagerItemTable = { callForData: itemTableCall }

    wrapper.vm.toggleStartCampaignDialog()
    await wrapper.vm.handleStartCampaign({ resourceId: 'r1', instanceGroup: 'i1' })
    await flushPromises()

    expect(launchPhishingCampaignInstanceGroup).toHaveBeenCalledWith('r1', 'i1')
    expect(itemTableCall).toHaveBeenCalled()
    expect(wrapper.vm.isStartDialogActionButtonDisabled).toBe(false)

    wrapper.vm.toggleStopCampaignDialog()
    await wrapper.vm.handleStopCampaign({ resourceId: 'r2', instanceGroup: 'i2' })
    await flushPromises()

    expect(stopPhishingCampaignJob).toHaveBeenCalledWith('r2', 'i2')
    expect(wrapper.vm.isStopDialogActionButtonDisabled).toBe(false)
  })

  it('runs parent delete and bulk delete flows', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    const resetSelectableParams = jest.fn()

    wrapper.vm.$refs.campaignManagerParentTable = {
      callForData,
      $refs: {
        refTable: {
          unSelectRow,
          changeServerSideSelectionCount,
          resetSelectableParams
        }
      }
    }

    await wrapper.vm.handleOnDelete({ resourceId: 'delete-1' })
    await flushPromises()

    expect(deleteCampaignManager).toHaveBeenCalledWith('delete-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    // Close dialog opened by single delete flow before starting multiple-delete scenario.
    wrapper.vm.toggleShowDeleteDialog()

    wrapper.vm.handleMultipleDelete({ ids: ['a', 'b'] }, 2)
    await wrapper.vm.handleOnMultipleDelete()
    await flushPromises()

    expect(bulkDeleteCampaignReports).toHaveBeenCalledWith({ ids: ['a', 'b'] })
    expect(resetSelectableParams).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('computes target groups metadata and emits dialog toggles', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleTargetUsersGroupsClick({ resourceId: 'c1', campaignType: 3, instanceGroup: 'ig-10' })
    expect(wrapper.vm.isShowTargetGroupsDialog).toBe(true)
    expect(wrapper.vm.targetGroupsDialogCampaignResourceId).toBe('c1')
    expect(wrapper.vm.targetGroupsDialogCampaignType).toBe(3)
    expect(wrapper.vm.targetGroupsDialogInstanceGroup).toBe('ig-10')

    wrapper.vm.toggleTargetGroupsDialog()
    expect(wrapper.vm.isShowTargetGroupsDialog).toBe(false)
    expect(wrapper.vm.targetGroupsDialogCampaign).toBe(null)
  })

  it('blocks route leave when campaign modal is open', () => {
    const wrapper = createWrapper()
    const next = jest.fn()
    const closeOverlay = jest.fn()

    wrapper.vm.$refs.refCampaignModal = { status: true, closeOverlay }
    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)
    expect(closeOverlay).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    wrapper.vm.$refs.refCampaignModal = { status: false }
    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
