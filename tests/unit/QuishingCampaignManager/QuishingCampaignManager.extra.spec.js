import { shallowMount } from '@vue/test-utils'
import QuishingCampaignManager from '@/views/QuishingCampaignManager'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

jest.mock('@/api/quishing', () => ({
  getCampaignManagerPreview: jest.fn(),
  getCampaignManagerFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { status: [] } } })
  ),
  deleteCampaign: jest.fn(() => Promise.resolve()),
  deleteBulkCampaigns: jest.fn(() => Promise.resolve())
}))

const QuishingService = require('@/api/quishing')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManager.vue (extra branch coverage)', () => {
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

  it('toggleAddCampaignManagerModal resets row/edit/duplicate only when closing', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.setData({
      isShowAddOrEditCampaignManagerModal: true,
      selectedRow: { id: 'x' },
      isEdit: true,
      isDuplicate: true
    })
    wrapper.vm.toggleAddCampaignManagerModal()

    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)

    wrapper.vm.toggleAddCampaignManagerModal()
    expect(wrapper.vm.isShowAddOrEditCampaignManagerModal).toBe(true)
  })

  it('toggleShowLaunchDialog keeps id while opening and clears id while closing', () => {
    const wrapper = createWrapper()

    wrapper.setData({ isShowLaunchDialog: false, launchResourceId: 'keep-id' })
    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)
    expect(wrapper.vm.launchResourceId).toBe('keep-id')

    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.launchResourceId).toBe('')
  })

  it('handleItemOnPreview uses row when selectedParentItem is not set', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedParentItem: null, isShowPreviewDialog: false })

    wrapper.vm.handleItemOnPreview({ resourceId: 'preview-row' })

    expect(wrapper.vm.selectedRow).toEqual({ resourceId: 'preview-row' })
    expect(wrapper.vm.isShowPreviewDialog).toBe(true)
  })

  it('handleItemTableRecordButtonClick goes frequency view for recurring parent campaign', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: { resourceId: 'parent-2', frequency: 3, templateType: 'Email' },
      isFrequencyTableShowing: false
    })

    wrapper.vm.handleItemTableRecordButtonClick({
      total: 1,
      status: 'Running',
      instanceGroup: 'ig-r'
    })

    expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
    expect(wrapper.vm.selectedInstanceItem).toEqual({
      total: 1,
      status: 'Running',
      instanceGroup: 'ig-r'
    })
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)
  })

  it('toggleAddIndividualPrintoutCampaignModal toggles modal visibility', () => {
    const wrapper = createWrapper()
    wrapper.setData({ isShowIndividualPrintoutTemplateModal: false })

    wrapper.vm.toggleAddIndividualPrintoutCampaignModal()
    expect(wrapper.vm.isShowIndividualPrintoutTemplateModal).toBe(true)

    wrapper.vm.toggleAddIndividualPrintoutCampaignModal()
    expect(wrapper.vm.isShowIndividualPrintoutTemplateModal).toBe(false)
  })

  it('watch route query ignores undefined value and keeps state', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      selectedParentItem: { resourceId: 'p1', templateType: 'Email' },
      selectedInstanceItem: { instanceGroup: 'i1' },
      isItemTableShowing: true,
      isFrequencyTableShowing: true
    })

    wrapper.vm.$options.watch['$route.query'].handler.call(wrapper.vm, undefined)

    expect(wrapper.vm.selectedParentItem).toEqual({
      resourceId: 'p1',
      templateType: 'Email'
    })
    expect(wrapper.vm.selectedInstanceItem).toEqual({ instanceGroup: 'i1' })
    expect(wrapper.vm.isItemTableShowing).toBe(true)
    expect(wrapper.vm.isFrequencyTableShowing).toBe(true)
    expect(wrapper.vm.$router.replace).not.toHaveBeenCalled()
  })

  it('back handlers toggle table states even when refs are missing', () => {
    const wrapper = createWrapper()
    wrapper.setData({ isItemTableShowing: true, isFrequencyTableShowing: true })

    wrapper.vm.$refs.campaignManagerParentTable = null
    wrapper.vm.handleOnBackClick()
    expect(wrapper.vm.isItemTableShowing).toBe(false)

    wrapper.vm.$refs.campaignManagerItemTable = null
    wrapper.vm.handleOnFrequencyBackClick()
    expect(wrapper.vm.isFrequencyTableShowing).toBe(false)
  })

  it('isSelectedItemQuishingPrintout computed returns true/false branches', () => {
    expect(
      QuishingCampaignManager.computed.isSelectedItemQuishingPrintout.call({
        selectedParentItem: { templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT }
      })
    ).toBe(true)
    expect(
      QuishingCampaignManager.computed.isSelectedItemQuishingPrintout.call({
        selectedParentItem: { templateType: 'Email' }
      })
    ).toBe(false)
  })

  it('getStatusItems computed falls back to empty array when formDetails.status is missing', () => {
    expect(QuishingCampaignManager.computed.getStatusItems.call({ formDetails: {} })).toEqual([])
    expect(
      QuishingCampaignManager.computed.getStatusItems.call({
        formDetails: { status: [{ text: 'Running', value: 'Running' }] }
      })
    ).toEqual([{ text: 'Running', value: 'Running' }])
  })

  it('beforeRouteLeave allows navigation when refCampaignModal is missing', () => {
    const next = jest.fn()
    QuishingCampaignManager.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

})
