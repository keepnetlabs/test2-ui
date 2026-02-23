import { shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/SmishingCampaignManager/CampaignManagerRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock123')
}))

describe('SmishingCampaignManager/CampaignManagerRowActions.vue', () => {
  const createWrapper = ({
    status = ACTION_STATUSES.IDLE,
    frequency = 0,
    isQuishingPrintPreview = false,
    createPerm = true,
    deletePerm = true,
    editPerm = true
  } = {}) =>
    shallowMount(CampaignManagerRowActions, {
      propsData: {
        scope: { row: { status, frequency, resourceId: 'sm-1' }, $index: 0 },
        rowActions: [],
        isQuishingPrintPreview
      },
      computed: {
        getSmishingCampaignManagerPreviewPermissions: () => true,
        getSmishingCampaignManagerCreatePermissions: () => createPerm,
        getSmishingCampaignManagerDeletePermissions: () => deletePerm,
        getSmishingCampaignManagerEditPermissions: () => editPerm
      },
      stubs: ['v-tooltip', 'v-btn', 'v-icon', 'v-menu', 'v-list', 'v-list-item', 'v-list-item-title']
    })

  it('builds preview id and status passthrough', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    expect(wrapper.vm.getId).toContain('btn-preview--row-action-mock123')
    expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)
  })

  it('uses duplicate action in non-quishing mode and print-preview in quishing mode', () => {
    const normal = createWrapper({ status: ACTION_STATUSES.IDLE, isQuishingPrintPreview: false })
    const quishing = createWrapper({ status: ACTION_STATUSES.IDLE, isQuishingPrintPreview: true })

    expect(normal.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(true)
    expect(normal.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(false)
    expect(quishing.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(true)
    expect(quishing.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(false)
  })

  it('disables edit action when frequency > 0 or edit permission is false', () => {
    const byFrequency = createWrapper({ frequency: 2, editPerm: true })
    const byPermission = createWrapper({ frequency: 0, editPerm: false })

    expect(byFrequency.vm.getItems.find((x) => x.action === 'on-edit').disabled).toBe(true)
    expect(byPermission.vm.getItems.find((x) => x.action === 'on-edit').disabled).toBe(true)
  })

  it('returns reduced actions for complete/cancel and fallback statuses', () => {
    const complete = createWrapper({ status: ACTION_STATUSES.COMPLETE })
    const error = createWrapper({ status: ACTION_STATUSES.ERROR, isQuishingPrintPreview: true })

    expect(complete.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(false)
    expect(error.vm.getItems.some((x) => x.action === 'on-edit')).toBe(true)
    expect(error.vm.getItems.some((x) => x.action === 'on-delete')).toBe(true)
    expect(error.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(true)
  })

  it('emits direct action by default and maps status-like action to on-launch', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.IDLE })
    wrapper.vm.handleItemClick({ action: 'on-preview' })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })

    expect(wrapper.emitted('on-preview')[0][0]).toEqual({
      status: ACTION_STATUSES.IDLE,
      frequency: 0,
      resourceId: 'sm-1'
    })
    expect(wrapper.emitted('on-launch')[0][0]).toEqual({
      status: ACTION_STATUSES.IDLE,
      frequency: 0,
      resourceId: 'sm-1'
    })
  })
})

