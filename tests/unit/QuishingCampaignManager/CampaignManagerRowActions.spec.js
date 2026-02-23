import { shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/QuishingCampaignManager/CampaignManagerRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock123')
}))

describe('QuishingCampaignManager/CampaignManagerRowActions.vue', () => {
  const createWrapper = ({
    status = ACTION_STATUSES.IDLE,
    frequency = 0,
    isQuishingPrintPreview = false,
    createPerm = true,
    deletePerm = true,
    updatePerm = true
  } = {}) =>
    shallowMount(CampaignManagerRowActions, {
      propsData: {
        scope: { row: { status, frequency, resourceId: 'q-1' }, $index: 0 },
        rowActions: [],
        isQuishingPrintPreview
      },
      computed: {
        getQuishingCampaignManagerParentPreviewPermissions: () => true,
        getQuishingCampaignManagerParentCreatePermissions: () => createPerm,
        getQuishingCampaignManagerParentDeletePermissions: () => deletePerm,
        getQuishingCampaignManagerParentUpdatePermissions: () => updatePerm
      },
      stubs: ['v-tooltip', 'v-btn', 'v-icon', 'v-menu', 'v-list', 'v-list-item', 'v-list-item-title']
    })

  it('computes preview id and action status', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    expect(wrapper.vm.getId).toContain('btn-preview--row-action-mock123')
    expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)
  })

  it('returns duplicate for normal mode and print preview for quishing mode', () => {
    const normal = createWrapper({ status: ACTION_STATUSES.IDLE, isQuishingPrintPreview: false })
    const quishing = createWrapper({ status: ACTION_STATUSES.IDLE, isQuishingPrintPreview: true })

    expect(normal.vm.getItems.some((x) => x.action === 'on-duplicate')).toBe(true)
    expect(normal.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(false)
    expect(quishing.vm.getItems.some((x) => x.action === 'on-print-preview')).toBe(true)
  })

  it('disables edit when frequency > 0 or update permission is false', () => {
    const byFreq = createWrapper({ frequency: 2, updatePerm: true })
    const byPerm = createWrapper({ frequency: 0, updatePerm: false })

    expect(byFreq.vm.getItems.find((x) => x.action === 'on-edit').disabled).toBe(true)
    expect(byPerm.vm.getItems.find((x) => x.action === 'on-edit').disabled).toBe(true)
  })

  it('maps complete/idle/cancel actions to on-launch emit and keeps direct emit otherwise', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.IDLE })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
    wrapper.vm.handleItemClick({ action: 'on-preview' })

    expect(wrapper.emitted('on-launch')[0][0]).toEqual({
      status: ACTION_STATUSES.IDLE,
      frequency: 0,
      resourceId: 'q-1'
    })
    expect(wrapper.emitted('on-preview')[0][0]).toEqual({
      status: ACTION_STATUSES.IDLE,
      frequency: 0,
      resourceId: 'q-1'
    })
  })
})

