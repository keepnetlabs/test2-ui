import { shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/CallbackCampaignManager/CampaignManagerRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock123')
}))

describe('CallbackCampaignManager/CampaignManagerRowActions.vue', () => {
  const createWrapper = ({
    status = ACTION_STATUSES.IDLE,
    createPerm = true,
    deletePerm = true
  } = {}) =>
    shallowMount(CampaignManagerRowActions, {
      propsData: {
        scope: { row: { status, frequency: 0, resourceId: 'cb-1' }, $index: 0 },
        rowActions: []
      },
      computed: {
        getCallbackCampaignPreviewPermissions: () => true,
        getCallbackCampaignCreatePermissions: () => createPerm,
        getCallbackCampaignDeletePermissions: () => deletePerm
      },
      stubs: ['v-tooltip', 'v-btn', 'v-icon', 'v-menu', 'v-list', 'v-list-item', 'v-list-item-title']
    })

  it('builds preview id and status passthrough', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    expect(wrapper.vm.getId).toContain('btn-preview--row-action-mock123')
    expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)
  })

  it('returns expected row actions for idle/running statuses', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.IDLE })
    const actions = wrapper.vm.getItems.map((x) => x.action)

    expect(actions).toEqual(['on-launch', 'on-duplicate', 'on-delete'])
  })

  it('returns expected row actions for complete/cancel and other statuses', () => {
    const complete = createWrapper({ status: ACTION_STATUSES.COMPLETE })
    expect(complete.vm.getItems.map((x) => x.action)).toEqual(['on-launch', 'on-delete'])

    const cancel = createWrapper({ status: ACTION_STATUSES.CANCEL })
    expect(cancel.vm.getItems.map((x) => x.action)).toEqual(['on-launch', 'on-delete'])

    const error = createWrapper({ status: ACTION_STATUSES.ERROR })
    expect(error.vm.getItems.map((x) => x.action)).toEqual(['on-delete'])
  })

  it('applies permission-based disabled states in generated items', () => {
    const wrapper = createWrapper({
      status: ACTION_STATUSES.IDLE,
      createPerm: false,
      deletePerm: false
    })
    const launch = wrapper.vm.getItems.find((x) => x.action === 'on-launch')
    const del = wrapper.vm.getItems.find((x) => x.action === 'on-delete')

    expect(launch.disabled).toBe(true)
    expect(del.disabled).toBe(true)
  })

  it('emits direct action by default and maps status-like action to on-launch', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.IDLE })
    wrapper.vm.handleItemClick({ action: 'on-preview' })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })

    expect(wrapper.emitted('on-preview')[0][0]).toEqual({
      status: ACTION_STATUSES.IDLE,
      frequency: 0,
      resourceId: 'cb-1'
    })
    expect(wrapper.emitted('on-launch')[0][0]).toEqual({
      status: ACTION_STATUSES.IDLE,
      frequency: 0,
      resourceId: 'cb-1'
    })
  })

  it('maps COMPLETE and CANCEL status-like actions to on-launch event', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.COMPLETE })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.COMPLETE })
    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.CANCEL })

    expect(wrapper.emitted('on-launch')).toHaveLength(2)
  })
})

