import { shallowMount } from '@vue/test-utils'
import SmishingCampaignManager from '@/views/SmishingCampaignManager'

jest.mock('@/api/smishing', () => ({
  getSmishingScenarioFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { methodTypes: [{ text: 'SMS' }], difficultyTypes: [] } } })
  ),
  getCampaignManagerFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { status: [{ text: 'Running' }] } } })
  ),
  deleteSmishingCampaign: jest.fn(() => Promise.resolve())
}))

jest.mock('@/api/targetUsers', () => ({
  createTargetGroup: jest.fn(() => Promise.resolve())
}))

const SmishingService = require('@/api/smishing')
const { createTargetGroup } = require('@/api/targetUsers')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingCampaignManager.vue', () => {
  const createWrapper = (overrides = {}) => {
    const replace = jest.fn()
    const push = jest.fn()
    return shallowMount(SmishingCampaignManager, {
      mocks: {
        $route: { query: {} },
        $router: { replace, push },
        $store: {
          getters: {
            'permissions/getSmishingCampaignManagerDeletePermissions': true
          }
        },
        ...(overrides.mocks || {})
      },
      stubs: {
        KContainer: true,
        CampaignManagerAddOrEditModal: true,
        CampaignManagerNewInstanceModal: true,
        CommonCampaignManagerCreateNewInstanceDialog: true,
        NewScenario: true,
        CreateNewUserGroupModal: true,
        CampaignManagerPreview: true,
        NoScenarioModal: true,
        NoTargetUserGroupModal: true,
        CommonCampaignManagerDeleteDialog: true,
        CampaignManagerParentTable: true,
        CampaignManagerItemTable: true,
        CampaignManagerFrequencyTable: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads form and scenario details on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(SmishingService.getCampaignManagerFormDetails).toHaveBeenCalled()
    expect(SmishingService.getSmishingScenarioFormDetails).toHaveBeenCalled()
    expect(wrapper.vm.formDetails.status).toEqual([{ text: 'Running' }])
    expect(wrapper.vm.scenarioDetailsLookup.methodTypes).toEqual([{ text: 'SMS' }])
  })

  it('handles parent row navigation and table toggles', () => {
    const wrapper = createWrapper()
    const resetTable = jest.fn()
    const callForData = jest.fn()
    wrapper.vm.$refs.campaignManagerItemTable = { resetTable, callForData }

    wrapper.vm.handleOnRecordButtonClick({ resourceId: 'p1', total: 3, status: 'Running' })

    expect(wrapper.vm.selectedParentItem.resourceId).toBe('p1')
    expect(resetTable).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isItemTableShowing).toBe(true)
  })

  it('navigates to smishing report from parent row when total is one and status is not Idle', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleOnRecordButtonClick({
      resourceId: 'campaign-1',
      total: 1,
      status: 'Running',
      mostRecentInstanceGroup: 7
    })

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Smishing Report',
      params: { id: 'campaign-1', instanceGroup: 7 }
    })
    expect(wrapper.vm.isItemTableShowing).toBe(false)
  })

  it('handles item row record click for report and frequency table paths', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedParentItem: { resourceId: 'parent-1' } })

    wrapper.vm.handleItemTableRecordButtonClick({ total: 1, status: 'Running', instanceGroup: 'ig-1' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Smishing Report',
      params: { id: 'parent-1', instanceGroup: 'ig-1' }
    })

    wrapper.vm.handleItemTableRecordButtonClick({ total: 2, status: 'Running', instanceGroup: 'ig-2' })
    expect(wrapper.vm.selectedInstanceItem).toEqual({ total: 2, status: 'Running', instanceGroup: 'ig-2' })
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)
  })

  it('handles launch and new instance flow', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleLaunch({ resourceId: 'launch-1' })
    expect(wrapper.vm.launchResourceId).toBe('launch-1')
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)

    wrapper.vm.handleConfirmLaunchDialog('instance-22')
    expect(wrapper.vm.instanceResourceId).toBe('instance-22')
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.isShowNewInstanceModal).toBe(true)

    wrapper.vm.closeNewInstanceModal()
    expect(wrapper.vm.instanceResourceId).toBe('')
    expect(wrapper.vm.isShowNewInstanceModal).toBe(false)
  })

  it('handles submit flows for parent and item tables', () => {
    const wrapper = createWrapper()
    const parentCall = jest.fn()
    const itemCall = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = { callForData: parentCall }
    wrapper.vm.$refs.campaignManagerItemTable = { callForData: itemCall }
    wrapper.setData({ isItemTableShowing: true, isShowNewInstanceModal: true, instanceResourceId: 'x1' })

    wrapper.vm.handleOnSubmitNewInstance()
    expect(itemCall).toHaveBeenCalled()
    expect(parentCall).toHaveBeenCalled()
    expect(wrapper.vm.isShowNewInstanceModal).toBe(false)
    expect(wrapper.vm.instanceResourceId).toBe('')

    wrapper.setData({ isShowAddOrEditCampaignManagerModal: true, selectedRow: { id: 'row' }, isEdit: true })
    wrapper.vm.handleOnSubmit()
    expect(parentCall).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('handles delete flows with permission checks', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    const parentCall = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = {
      callForData: parentCall,
      $refs: { refTable: { unSelectRow, changeServerSideSelectionCount } }
    }

    await wrapper.vm.handleOnDelete({ resourceId: 'del-1' })
    await flushPromises()

    expect(SmishingService.deleteSmishingCampaign).toHaveBeenCalledWith('del-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(parentCall).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('skips delete call when permission is false', async () => {
    const wrapper = createWrapper({
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingCampaignManagerDeletePermissions': false
          }
        }
      }
    })

    await wrapper.vm.handleOnDelete({ resourceId: 'no-call' })
    expect(SmishingService.deleteSmishingCampaign).not.toHaveBeenCalled()
  })

  it('handles target group modal open/confirm/close', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = { callForData }

    wrapper.vm.handleShowTargetGroupModal()
    expect(wrapper.vm.isTargetGroupModalVisible).toBe(true)

    await wrapper.vm.handleConfirmTargetGroupModal({ name: 'Group 1' })
    await flushPromises()

    expect(createTargetGroup).toHaveBeenCalledWith({ name: 'Group 1' })
    expect(wrapper.vm.isTargetGroupModalVisible).toBe(false)
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isCreateTargetGroupButtonDisabled).toBe(false)
  })

  it('handles no-scenario and no-target-group modal confirmations', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleShowNoScenarioModal()
    wrapper.vm.handleConfirmNoScenarioModal()
    expect(wrapper.vm.isNoScenarioModalVisible).toBe(false)
    expect(wrapper.vm.isNewScenarioModalVisible).toBe(true)

    wrapper.vm.handleShowNoTargetUserGroupModal()
    wrapper.vm.handleConfirmNoTargetUserGroupModal()
    expect(wrapper.vm.isNoTargetUserGroupModalVisible).toBe(false)
    expect(wrapper.vm.isTargetGroupModalVisible).toBe(true)
  })

  it('beforeRouteLeave blocks when campaign modal is open', () => {
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

  it('route query watcher resets item/frequency views on parent status', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: { resourceId: 'p1' },
      selectedInstanceItem: { instanceGroup: 'i1' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true
    })

    wrapper.vm.$options.watch['$route.query'].handler.call(wrapper.vm, { status: 'parent' })

    expect(wrapper.vm.selectedParentItem).toBe(null)
    expect(wrapper.vm.selectedInstanceItem).toBe(null)
    expect(wrapper.vm.isItemTableShowing).toBe(false)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/smishing-simulator/campaign-manager')
  })

  it('route query watcher keeps state when status is not parent', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: { resourceId: 'p2' },
      selectedInstanceItem: { instanceGroup: 'i2' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true
    })

    wrapper.vm.$options.watch['$route.query'].handler.call(wrapper.vm, { status: 'item' })

    expect(wrapper.vm.selectedParentItem).toEqual({ resourceId: 'p2' })
    expect(wrapper.vm.selectedInstanceItem).toEqual({ instanceGroup: 'i2' })
    expect(wrapper.vm.isItemTableShowing).toBe(true)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)
    expect(wrapper.vm.$router.replace).not.toHaveBeenCalled()
  })

  it('toggle and back helpers reset state safely', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      isShowLaunchDialog: true,
      launchResourceId: 'launch-x',
      isShowDeleteDialog: true,
      selectedRow: { resourceId: 'row-1' },
      multipleSystemUserPayload: { ids: ['a'] },
      isMultipleDelete: true,
      isFrequencyTableShowing: true,
      selectedInstanceItem: { instanceGroup: 'ig-1' }
    })

    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.launchResourceId).toBe('')

    wrapper.vm.toggleShowDeleteDialog()
    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.multipleSystemUserPayload).toEqual({})
    expect(wrapper.vm.isMultipleDelete).toBe(false)

    wrapper.vm.$refs.campaignManagerParentTable = undefined
    wrapper.vm.handleOnBackClick()
    expect(wrapper.vm.isItemTableShowing).toBe(true)

    wrapper.vm.handleOnFrequencyBackClick()
    expect(wrapper.vm.selectedInstanceItem).toBe(null)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
  })

  it('computed status items and route leave fallback branch', () => {
    const wrapper = createWrapper()
    const next = jest.fn()

    wrapper.setData({ formDetails: { status: [{ text: 'Idle' }] } })
    expect(wrapper.vm.getStatusItems).toEqual([{ text: 'Idle' }])

    wrapper.vm.$refs = {}
    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('computed getStatusItems can be undefined and handleOnMultipleDelete is a no-op', () => {
    const wrapper = createWrapper()
    wrapper.setData({ formDetails: {} })

    expect(wrapper.vm.getStatusItems).toBeUndefined()
    expect(wrapper.vm.handleOnMultipleDelete()).toBeUndefined()
  })
})
