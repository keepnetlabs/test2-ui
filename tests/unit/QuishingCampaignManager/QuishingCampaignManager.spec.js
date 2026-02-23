import { shallowMount } from '@vue/test-utils'
import QuishingCampaignManager from '@/views/QuishingCampaignManager'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

jest.mock('@/api/quishing', () => ({
  getCampaignManagerPreview: jest.fn(),
  getCampaignManagerFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { status: [{ text: 'Running', value: 'Running' }] } } })
  ),
  deleteCampaign: jest.fn(() => Promise.resolve()),
  deleteBulkCampaigns: jest.fn(() => Promise.resolve())
}))

const QuishingService = require('@/api/quishing')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManager.vue', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(QuishingCampaignManager, {
      stubs: {
        KContainer: true,
        CommonCampaignManagerCreateNewInstanceDialog: true,
        CommonCampaignManagerDeleteDialog: true,
        CommonCampaignManagerPreviewDialog: true,
        QuishingCampaignManagerAddOrEditModal: true,
        QuishingCampaignManagerPrintoutAddOrEditModal: true,
        QuishingCampaignManagerNewInstanceModal: true,
        QuishingCampaignManagerParentTable: true,
        QuishingCampaignManagerItemTable: true,
        QuishingCampaignManagerFrequencyTable: true
      },
      mocks: {
        $route: { query: {} },
        $router: { replace: jest.fn(), push: jest.fn() },
        $store: {
          getters: {
            'permissions/getQuishingCampaignManagerParentDeletePermissions': true
          }
        },
        ...(overrides.mocks || {})
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads form details on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(QuishingService.getCampaignManagerFormDetails).toHaveBeenCalled()
    expect(wrapper.vm.formDetails.status).toEqual([{ text: 'Running', value: 'Running' }])
    expect(wrapper.vm.getStatusItems).toEqual([{ text: 'Running', value: 'Running' }])
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
      mostRecentInstanceGroup: 5
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Quishing Report',
      params: { id: 'r1', instanceGroup: 5 }
    })

    wrapper.vm.handleOnRecordButtonClick({
      resourceId: 'r2',
      total: 2,
      status: 'Idle',
      templateType: 'Email'
    })
    expect(wrapper.vm.selectedParentItem).toEqual({
      resourceId: 'r2',
      total: 2,
      status: 'Idle',
      templateType: 'Email'
    })
    expect(resetTable).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isItemTableShowing).toBe(true)
  })

  it('handles item row click for report and frequency paths', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedParentItem: { resourceId: 'parent-1', templateType: 'Email' } })

    wrapper.vm.handleItemTableRecordButtonClick({ total: 1, status: 'Running', instanceGroup: 'ig-1' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Quishing Report',
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

    wrapper.vm.handleConfirmLaunchDialog('instance-1')
    expect(wrapper.vm.instanceResourceId).toBe('instance-1')
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.isShowNewInstanceModal).toBe(true)

    wrapper.vm.closeNewInstanceModal()
    expect(wrapper.vm.instanceResourceId).toBe('')
    expect(wrapper.vm.isShowNewInstanceModal).toBe(false)
  })

  it('handles submit and back flows', () => {
    const wrapper = createWrapper()
    const parentCall = jest.fn()
    const itemCall = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = { callForData: parentCall }
    wrapper.vm.$refs.campaignManagerItemTable = { callForData: itemCall }

    wrapper.setData({
      isItemTableShowing: true,
      isShowNewInstanceModal: true,
      instanceResourceId: 'x1',
      isShowAddOrEditCampaignManagerModal: true,
      selectedRow: { id: 'row-1' },
      isEdit: true
    })
    wrapper.vm.handleOnSubmitNewInstance()
    expect(itemCall).toHaveBeenCalled()
    expect(parentCall).toHaveBeenCalled()
    expect(wrapper.vm.isShowNewInstanceModal).toBe(false)
    expect(wrapper.vm.instanceResourceId).toBe('')

    wrapper.vm.handleOnSubmit()
    expect(parentCall).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('handles delete and multiple delete flows with refs updates', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    const resetSelectableParams = jest.fn()
    const callForData = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = {
      callForData,
      $refs: { refTable: { unSelectRow, changeServerSideSelectionCount, resetSelectableParams } }
    }

    await wrapper.vm.handleOnDelete({ resourceId: 'del-1' })
    await flushPromises()

    expect(QuishingService.deleteCampaign).toHaveBeenCalledWith('del-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)

    wrapper.vm.toggleShowDeleteDialog()
    wrapper.vm.handleMultipleDelete({ ids: ['a'] }, 1)
    expect(wrapper.vm.isMultipleDelete).toBe(true)
    expect(wrapper.vm.multipleDeletedUserCount).toBe(1)

    await wrapper.vm.handleOnMultipleDelete()
    await flushPromises()
    expect(QuishingService.deleteBulkCampaigns).toHaveBeenCalledWith({ ids: ['a'] })
    expect(resetSelectableParams).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('skips delete api call when permission is false', async () => {
    const wrapper = createWrapper({
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignManagerParentDeletePermissions': false
          }
        }
      }
    })

    await wrapper.vm.handleOnDelete({ resourceId: 'skip' })
    expect(QuishingService.deleteCampaign).not.toHaveBeenCalled()
  })

  it('handles edit/preview/duplicate with printout branch', () => {
    const wrapper = createWrapper()
    const printoutRow = {
      resourceId: 'p1',
      templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    }
    const emailRow = { resourceId: 'e1', templateType: 'Email' }

    wrapper.vm.handleItemOnEdit(printoutRow)
    expect(wrapper.vm.selectedRow).toEqual(printoutRow)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isShowIndividualPrintoutTemplateModal).toBe(true)

    wrapper.vm.$refs.campaignManagerParentTable = { callForData: jest.fn() }
    wrapper.vm.handleOnSubmitPrintout()
    expect(wrapper.vm.isShowIndividualPrintoutTemplateModal).toBe(false)

    wrapper.vm.handleItemOnEdit(emailRow)
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(true)

    wrapper.vm.toggleAddCampaignManagerModal()
    wrapper.vm.handleItemOnDuplicate(emailRow)
    expect(wrapper.vm.isDuplicate).toBe(true)

    wrapper.setData({ selectedParentItem: { resourceId: 'parent-priority', templateType: 'Email' } })
    wrapper.vm.handleItemOnPreview({ resourceId: 'row-preview' })
    expect(wrapper.vm.selectedRow).toEqual({ resourceId: 'parent-priority', templateType: 'Email' })
    expect(wrapper.vm.isShowPreviewDialog).toBe(true)
  })

  it('beforeRouteLeave blocks when modal is open and allows otherwise', () => {
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

  it('watcher resets route state on parent query and computed printout flag works', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: {
        resourceId: 'p1',
        templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toUpperCase()
      },
      selectedInstanceItem: { instanceGroup: 'i1' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true
    })

    expect(wrapper.vm.isSelectedItemQuishingPrintout).toBe(true)

    wrapper.vm.$options.watch['$route.query'].handler.call(wrapper.vm, { status: 'parent' })
    expect(wrapper.vm.selectedParentItem).toBe(null)
    expect(wrapper.vm.selectedInstanceItem).toBe(null)
    expect(wrapper.vm.isItemTableShowing).toBe(false)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/quishing-simulator/campaign-manager')
  })

  it('watcher no-op branch keeps state for non-parent status', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: { resourceId: 'p2', templateType: 'Email' },
      selectedInstanceItem: { instanceGroup: 'i2' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true
    })

    wrapper.vm.$options.watch['$route.query'].handler.call(wrapper.vm, { status: 'item' })
    expect(wrapper.vm.selectedParentItem).toEqual({ resourceId: 'p2', templateType: 'Email' })
    expect(wrapper.vm.selectedInstanceItem).toEqual({ instanceGroup: 'i2' })
    expect(wrapper.vm.isItemTableShowing).toBe(true)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)
    expect(wrapper.vm.$router.replace).not.toHaveBeenCalled()
  })

  it('toggle and back helper methods reset state correctly', () => {
    const wrapper = createWrapper()
    const parentCall = jest.fn()
    const itemCall = jest.fn()
    wrapper.vm.$refs.campaignManagerParentTable = { callForData: parentCall }
    wrapper.vm.$refs.campaignManagerItemTable = { callForData: itemCall }
    wrapper.setData({
      isShowLaunchDialog: true,
      launchResourceId: 'launch-2',
      isShowPreviewDialog: true,
      selectedRow: { resourceId: 'row-1' },
      isShowDeleteDialog: true,
      multipleSystemUserPayload: { ids: ['x'] },
      isMultipleDelete: true,
      isItemTableShowing: true,
      isFrequencyTableShowing: true
    })

    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.launchResourceId).toBe('')

    wrapper.vm.toggleShowPreviewDialog()
    expect(wrapper.vm.isShowPreviewDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)

    wrapper.vm.toggleShowDeleteDialog()
    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.multipleSystemUserPayload).toEqual({})
    expect(wrapper.vm.isMultipleDelete).toBe(false)

    wrapper.vm.handleOnBackClick()
    expect(parentCall).toHaveBeenCalled()
    expect(wrapper.vm.isItemTableShowing).toBe(false)

    wrapper.vm.handleOnFrequencyBackClick()
    expect(itemCall).toHaveBeenCalled()
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
  })

  it('setDeleteDialogActionButtonDisabled uses explicit and default values', () => {
    const wrapper = createWrapper()

    wrapper.vm.setDeleteDialogActionButtonDisabled(true)
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(true)

    wrapper.vm.setDeleteDialogActionButtonDisabled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)
  })
})
