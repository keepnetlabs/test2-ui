import { shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/CallbackCampaignManager/CampaignManagerRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock999')
}))

describe('CallbackCampaignManager/CampaignManagerRowActions.vue (extra)', () => {
  const createWrapper = ({
    status = ACTION_STATUSES.IDLE,
    createPerm = true,
    deletePerm = true,
    previewPerm = true
  } = {}) =>
    shallowMount(CampaignManagerRowActions, {
      propsData: {
        scope: { row: { status, resourceId: 'cb-extra-1' }, $index: 1 },
        rowActions: []
      },
      computed: {
        getCallbackCampaignPreviewPermissions: () => previewPerm,
        getCallbackCampaignCreatePermissions: () => createPerm,
        getCallbackCampaignDeletePermissions: () => deletePerm
      },
      stubs: ['v-tooltip', 'v-btn', 'v-icon', 'v-menu', 'v-list', 'v-list-item', 'v-list-item-title']
    })

  it('fallback status keeps only delete action in getItems', () => {
    const wrapper = createWrapper({ status: 'UnknownStatus' })
    expect(wrapper.vm.getItems.map((x) => x.action)).toEqual(['on-delete'])
  })

  it('RUNNING status branch includes launch/duplicate/delete actions', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    expect(wrapper.vm.getItems.map((x) => x.action)).toEqual([
      'on-launch',
      'on-duplicate',
      'on-delete'
    ])
  })

  it('getId keeps deterministic preview id prefix', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.CANCEL })
    expect(wrapper.vm.getId).toContain('btn-preview--row-action-mock999')
  })

  it('permission branches disable launch/delete actions', () => {
    const wrapper = createWrapper({
      status: ACTION_STATUSES.IDLE,
      createPerm: false,
      deletePerm: false
    })
    expect(wrapper.vm.getItems.find((x) => x.action === 'on-launch').disabled).toBe(true)
    expect(wrapper.vm.getItems.find((x) => x.action === 'on-delete').disabled).toBe(true)
  })

  it('handleItemClick emits direct action for non-mapped values', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })
    expect(wrapper.emitted(ACTION_STATUSES.RUNNING)).toHaveLength(1)
  })

  it('handleItemClick maps COMPLETE/CANCEL to on-launch and throws on empty payload', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.COMPLETE })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.COMPLETE })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.CANCEL })
    expect(wrapper.emitted('on-launch')).toHaveLength(2)

    expect(() => wrapper.vm.handleItemClick({})).toThrow()
  })
})
