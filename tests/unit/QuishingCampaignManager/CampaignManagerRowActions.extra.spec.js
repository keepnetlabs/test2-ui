import { shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/QuishingCampaignManager/CampaignManagerRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock999')
}))

describe('QuishingCampaignManager/CampaignManagerRowActions.vue (extra)', () => {
  const createWrapper = ({
    status = ACTION_STATUSES.IDLE,
    frequency = 0,
    isQuishingPrintPreview = false,
    createPerm = true,
    deletePerm = true,
    updatePerm = true,
    previewPerm = true
  } = {}) =>
    shallowMount(CampaignManagerRowActions, {
      propsData: {
        scope: { row: { status, frequency, resourceId: 'q-2' }, $index: 0 },
        rowActions: [],
        isQuishingPrintPreview
      },
      computed: {
        getQuishingCampaignManagerParentPreviewPermissions: () => previewPerm,
        getQuishingCampaignManagerParentCreatePermissions: () => createPerm,
        getQuishingCampaignManagerParentDeletePermissions: () => deletePerm,
        getQuishingCampaignManagerParentUpdatePermissions: () => updatePerm
      },
      stubs: [
        'v-tooltip',
        'v-btn',
        'v-icon',
        'v-menu',
        'v-list',
        'v-list-item',
        'v-list-item-title'
      ]
    })

  it('getItems for COMPLETE excludes duplicate and includes delete', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.COMPLETE })
    expect(wrapper.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(false)
    expect(wrapper.vm.getItems.some((x) => x.action === 'on-delete')).toBe(true)
  })

  it('getItems fallback branch (unknown status) includes only edit and delete', () => {
    const wrapper = createWrapper({ status: 'Paused' })
    const actions = wrapper.vm.getItems.map((x) => x.action)
    expect(actions).toEqual(['on-edit', 'on-delete'])
  })

  it('permission branches disable create and delete actions', () => {
    const wrapper = createWrapper({
      status: ACTION_STATUSES.RUNNING,
      createPerm: false,
      deletePerm: false
    })
    expect(wrapper.vm.getItems.find((x) => x.action === 'on-launch').disabled).toBe(true)
    expect(wrapper.vm.getItems.find((x) => x.action === 'on-delete').disabled).toBe(true)
  })

  it('print preview mode adds on-print-preview in fallback branch', () => {
    const wrapper = createWrapper({ status: 'Paused', isQuishingPrintPreview: true })
    expect(wrapper.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(true)
    expect(wrapper.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(false)
  })

  it('INDIVIDUAL status follows first branch and toggles duplicate/print-preview by mode', () => {
    const normal = createWrapper({
      status: ACTION_STATUSES.INDIVIDUAL,
      isQuishingPrintPreview: false
    })
    expect(normal.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(true)
    expect(normal.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(false)

    const printPreview = createWrapper({
      status: ACTION_STATUSES.INDIVIDUAL,
      isQuishingPrintPreview: true
    })
    expect(printPreview.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(false)
    expect(printPreview.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(true)
  })

  it('handleItemClick maps cancel/complete to on-launch and throws for empty action payload', () => {
    const completeWrapper = createWrapper({ status: ACTION_STATUSES.COMPLETE })
    completeWrapper.vm.handleItemClick({ action: ACTION_STATUSES.COMPLETE })
    completeWrapper.vm.handleItemClick({ action: ACTION_STATUSES.CANCEL })
    expect(completeWrapper.emitted('on-launch')).toHaveLength(2)

    const unknownWrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    expect(() => unknownWrapper.vm.handleItemClick({})).toThrow()
  })

  it('handleItemClick maps idle action and keeps direct action events', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
    wrapper.vm.handleItemClick({ action: 'on-delete' })

    expect(wrapper.emitted('on-launch')).toHaveLength(1)
    expect(wrapper.emitted('on-delete')).toHaveLength(1)
  })
})
