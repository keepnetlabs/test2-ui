import { shallowMount } from '@vue/test-utils'
import CallbackCampaignManager from '@/views/CallbackCampaignManager.vue'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getUsedCallbackNumbers: jest.fn(() =>
      Promise.resolve({ data: { data: { companyCount: 10, usedCount: 4 } } })
    ),
    getCallbackTemplateLanguages: jest.fn(() =>
      Promise.resolve({ data: { data: [{ text: 'English', value: 'en' }] } })
    ),
    getCampaignManagerFormDetails: jest.fn(() =>
      Promise.resolve({ data: { data: { status: [{ text: 'Running', value: 'Running' }] } } })
    ),
    deleteCallbackCampaign: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/targetUsers', () => ({
  createTargetGroup: jest.fn(() => Promise.resolve())
}))

const CallbackService = require('@/api/callback').default
const { createTargetGroup } = require('@/api/targetUsers')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager.vue', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(CallbackCampaignManager, {
      stubs: {
        KContainer: true,
        CampaignManagerAddOrEditModal: true,
        CampaignManagerNewInstanceModal: true,
        CommonCampaignManagerCreateNewInstanceDialog: true,
        CallbackScenarioModal: true,
        CreateNewUserGroupModal: true,
        CampaignPreviewModal: true,
        NoScenarioModal: true,
        NoTargetUserGroupModal: true,
        CommonCampaignManagerDeleteDialog: true,
        CampaignManagerParentTable: true,
        CampaignManagerItemTable: true,
        CampaignManagerFrequencyTable: true,
        'v-overlay': true
      },
      mocks: {
        $route: { query: {} },
        $router: { replace: jest.fn(), push: jest.fn() },
        $store: {
          getters: {
            'permissions/getCallbackCampaignDeletePermissions': true
          }
        },
        ...(overrides.mocks || {})
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads languages, form details and available numbers on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(CallbackService.getCallbackTemplateLanguages).toHaveBeenCalled()
    expect(CallbackService.getCampaignManagerFormDetails).toHaveBeenCalled()
    expect(CallbackService.getUsedCallbackNumbers).toHaveBeenCalled()
    expect(wrapper.vm.languages).toEqual([{ text: 'English', value: 'en' }])
    expect(wrapper.vm.formDetails.status).toEqual([{ text: 'Running', value: 'Running' }])
    expect(wrapper.vm.availableNumbers).toBe(6)
  })

  it('callForAvailableNumbers uses zero defaults when response fields are missing', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ availableNumbers: 99 })
    CallbackService.getUsedCallbackNumbers.mockResolvedValueOnce({ data: { data: {} } })

    await wrapper.vm.callForAvailableNumbers()
    await flushPromises()

    expect(wrapper.vm.availableNumbers).toBe(0)
  })

  it('handles parent row click with route branch and table branch', () => {
    const wrapper = createWrapper()
    const resetTable = jest.fn()
    const callForData = jest.fn()
    wrapper.vm.$refs.campaignManagerItemTable = { resetTable, callForData }

    wrapper.vm.handleOnRecordButtonClick({
      resourceId: 'r1',
      total: 1,
      status: 'Running',
      mostRecentInstanceGroup: 3
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Callback Report',
      params: { id: 'r1', instanceGroup: 3 }
    })

    wrapper.vm.handleOnRecordButtonClick({ resourceId: 'r2', total: 2, status: 'Idle' })
    expect(wrapper.vm.selectedParentItem).toEqual({ resourceId: 'r2', total: 2, status: 'Idle' })
    expect(resetTable).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isItemTableShowing).toBe(true)

    wrapper.vm.handleOnRecordButtonClick({
      resourceId: 'r3',
      total: 1,
      status: 'Running',
      frequency: 1
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  })

  it('handles item row record click for report and frequency paths', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedParentItem: { resourceId: 'parent-1' } })

    wrapper.vm.handleItemTableRecordButtonClick({ total: 1, status: 'Running', instanceGroup: 'ig-1' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Callback Report',
      params: { id: 'parent-1', instanceGroup: 'ig-1' }
    })

    wrapper.vm.handleItemTableRecordButtonClick({ total: 2, status: 'Running', instanceGroup: 'ig-2' })
    expect(wrapper.vm.selectedInstanceItem).toEqual({ total: 2, status: 'Running', instanceGroup: 'ig-2' })
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)

    wrapper.setData({
      selectedParentItem: { resourceId: 'parent-2', frequency: 2 },
      isFrequencyTableShowing: false
    })
    wrapper.vm.handleItemTableRecordButtonClick({ total: 1, status: 'Running', instanceGroup: 'ig-3' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.selectedInstanceItem).toEqual({
      total: 1,
      status: 'Running',
      instanceGroup: 'ig-3'
    })
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)
  })

  it('handles launch and submit flows', () => {
    const wrapper = createWrapper()
    const callForNumbers = jest.fn()
    const callForData = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = { callForNumbers }
    wrapper.vm.$refs.campaignManagerItemTable = { callForData }

    wrapper.vm.handleLaunch({ resourceId: 'launch-1' })
    expect(wrapper.vm.launchResourceId).toBe('launch-1')
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)

    wrapper.vm.handleConfirmLaunchDialog('instance-1')
    expect(wrapper.vm.instanceResourceId).toBe('instance-1')
    expect(wrapper.vm.isShowNewInstanceModal).toBe(true)

    wrapper.setData({ isItemTableShowing: true })
    wrapper.vm.handleOnSubmitNewInstance()
    expect(callForData).toHaveBeenCalled()
    expect(callForNumbers).toHaveBeenCalled()
    expect(wrapper.vm.isShowNewInstanceModal).toBe(false)
    expect(wrapper.vm.instanceResourceId).toBe('')

    wrapper.vm.handleOnSubmit()
    expect(callForNumbers).toHaveBeenCalledTimes(2)
  })

  it('handles delete flow with and without permission', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    const callForNumbers = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = {
      callForNumbers,
      $refs: { refTable: { unSelectRow, changeServerSideSelectionCount } }
    }

    await wrapper.vm.handleOnDelete({ resourceId: 'd1' })
    await flushPromises()
    expect(CallbackService.deleteCallbackCampaign).toHaveBeenCalledWith('d1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(callForNumbers).toHaveBeenCalled()

    const wrapperNoPerm = createWrapper({
      mocks: {
        $store: {
          getters: {
            'permissions/getCallbackCampaignDeletePermissions': false
          }
        }
      }
    })
    await wrapperNoPerm.vm.handleOnDelete({ resourceId: 'd2' })
    expect(CallbackService.deleteCallbackCampaign).toHaveBeenCalledTimes(1)
  })

  it('handles no-scenario/no-target-group and target group create flow', async () => {
    const wrapper = createWrapper()
    const callForNumbers = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = { callForNumbers }

    wrapper.vm.handleShowNoScenarioModal()
    wrapper.vm.handleConfirmNoScenarioModal()
    expect(wrapper.vm.isNoScenarioModalVisible).toBe(false)
    expect(wrapper.vm.isNewScenarioModalVisible).toBe(true)

    wrapper.vm.handleShowNoTargetUserGroupModal()
    wrapper.vm.handleConfirmNoTargetUserGroupModal()
    expect(wrapper.vm.isNoTargetUserGroupModalVisible).toBe(false)
    expect(wrapper.vm.isTargeGroupModalVisible).toBe(true)

    await wrapper.vm.handleConfirmTargetGroupModal({ name: 'g1' })
    await flushPromises()
    expect(createTargetGroup).toHaveBeenCalledWith({ name: 'g1' })
    expect(callForNumbers).toHaveBeenCalled()
    expect(wrapper.vm.isCreateTargetGroupButtonDisabled).toBe(false)
  })

  it('beforeRouteLeave and route watcher branches work', () => {
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
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/callback-simulator/campaign-manager')
  })

  it('watcher no-op branch and toggle reset helpers', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: { resourceId: 'p2' },
      selectedInstanceItem: { instanceGroup: 'i2' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true,
      isShowLaunchDialog: true,
      launchResourceId: 'launch-1',
      isShowDeleteDialog: true,
      selectedRow: { resourceId: 'r1' },
      multipleSystemUserPayload: { ids: ['x'] },
      isMultipleDelete: true
    })

    wrapper.vm.$options.watch['$route.query'].handler.call(wrapper.vm, { status: 'item' })
    expect(wrapper.vm.selectedParentItem).toEqual({ resourceId: 'p2' })
    expect(wrapper.vm.$router.replace).not.toHaveBeenCalled()

    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.launchResourceId).toBe('')

    wrapper.vm.toggleShowDeleteDialog()
    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.multipleSystemUserPayload).toEqual({})
    expect(wrapper.vm.isMultipleDelete).toBe(false)
  })

  it('supports safe back/frequency and computed status branch', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      formDetails: { status: [{ text: 'Idle' }] },
      isItemTableShowing: true,
      isFrequencyTableShowing: true,
      selectedInstanceItem: { instanceGroup: 'ig-1' }
    })

    expect(wrapper.vm.getStatusItems).toEqual([{ text: 'Idle' }])

    wrapper.vm.$refs.campaignManagerParentTable = undefined
    wrapper.vm.handleOnBackClick()
    expect(wrapper.vm.isItemTableShowing).toBe(false)

    wrapper.vm.handleOnFrequencyBackClick()
    expect(wrapper.vm.selectedInstanceItem).toBe(null)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
  })

  it('handles row action helpers and modal close helpers', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'row-1' }

    wrapper.vm.handleItemOnEdit(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(true)

    wrapper.vm.toggleAddCampaignManagerModal()
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)

    wrapper.vm.handleItemOnDuplicate(row)
    expect(wrapper.vm.isDuplicate).toBe(true)
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(true)

    wrapper.vm.toggleAddCampaignManagerModal()
    wrapper.vm.handleItemOnPreview(row)
    expect(wrapper.vm.isShowPreviewDialog).toBe(true)
    wrapper.vm.toggleShowPreviewDialog()
    expect(wrapper.vm.isShowPreviewDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)

    wrapper.vm.handleItemOnDelete(row)
    expect(wrapper.vm.isShowDeleteDialog).toBe(true)
    wrapper.vm.toggleShowDeleteDialog()
    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)

    wrapper.vm.handleCloseTargetGroupModal()
    wrapper.vm.handleCloseNoScenarioModal()
    wrapper.vm.handleCloseNewScenarioModal()
    wrapper.vm.handleCloseNoTargetUserGroupModal()
    expect(wrapper.vm.isTargeGroupModalVisible).toBe(false)
    expect(wrapper.vm.isNoScenarioModalVisible).toBe(false)
    expect(wrapper.vm.isNewScenarioModalVisible).toBe(false)
    expect(wrapper.vm.isNoTargetUserGroupModalVisible).toBe(false)
  })

  it('setDeleteDialogActionButtonDisabled handles explicit and default values', () => {
    const wrapper = createWrapper()

    wrapper.vm.setDeleteDialogActionButtonDisabled(true)
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(true)

    wrapper.vm.setDeleteDialogActionButtonDisabled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('handleOnMultipleDelete currently throws due to missing bulkDeleteCampaignReports binding', () => {
    const wrapper = createWrapper()
    wrapper.setData({ multipleSystemUserPayload: { ids: ['x'] } })

    expect(() => wrapper.vm.handleOnMultipleDelete()).toThrow()
  })
})
