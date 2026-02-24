import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemRowActions from '@/components/CallbackCampaignManager/CampaignManagerItemRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock456')
}))

describe('CallbackCampaignManager/CampaignManagerItemRowActions.vue (extra)', () => {
  const createWrapper = ({
    status = ACTION_STATUSES.IDLE,
    rowActions = [{ action: 'on-delete', icon: 'mdi-delete', name: 'Delete', id: 'btn-delete' }],
    canDelete = true
  } = {}) =>
    shallowMount(CampaignManagerItemRowActions, {
      propsData: {
        rowActions,
        campaignResourceId: 'cb-2',
        scope: { row: { status, instanceGroup: 'ig-2' }, $index: 0 }
      },
      mocks: {
        $router: { push: jest.fn() }
      },
      computed: {
        getCallbackCampaignJobDeletePermissions: () => canDelete
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

  it('getIconName/getTooltipText fallback branches are covered', () => {
    const unknown = createWrapper({ status: 'Paused' })
    expect(unknown.vm.getIconName).toBe('mdi-eye')
    expect(unknown.vm.getTooltipText).toBe(unknown.vm.labels.Preview)

    const cancelled = createWrapper({ status: ACTION_STATUSES.CANCEL })
    expect(cancelled.vm.getIconName).toBe('mdi-text-box')
    expect(cancelled.vm.getTooltipText).toBe(cancelled.vm.labels.ViewReport)

    const deleted = createWrapper({ status: ACTION_STATUSES.DELETE })
    expect(deleted.vm.getTooltipText).toBe(deleted.vm.labels.Delete)
  })

  it('getId default branch uses send prefix when icon is not text-box/stop', () => {
    const wrapper = createWrapper({ status: 'Paused' })
    expect(wrapper.vm.getId).toContain('btn-send--row-action-mock456')
  })

  it('getRowActions keeps original actions when status is not running/error', () => {
    const baseActions = [
      { action: 'on-delete', icon: 'mdi-delete', name: 'Delete', id: 'btn-delete' }
    ]
    const wrapper = createWrapper({ status: ACTION_STATUSES.IDLE, rowActions: baseActions })
    expect(wrapper.vm.getRowActions).toEqual(baseActions)
  })

  it('isMenuRender is false for complete/idle/delete/cancel/error statuses', () => {
    ;[
      ACTION_STATUSES.COMPLETE,
      ACTION_STATUSES.IDLE,
      ACTION_STATUSES.DELETE,
      ACTION_STATUSES.CANCEL,
      ACTION_STATUSES.ERROR
    ].forEach((status) => {
      const wrapper = createWrapper({ status })
      expect(wrapper.vm.isMenuRender).toBe(false)
    })
  })

  it('handleItemClick emits raw event action when menu is rendered and action is custom', () => {
    const wrapper = createWrapper({ status: ACTION_STATUSES.RUNNING })
    wrapper.vm.handleItemClick({ action: 'on-custom' })
    expect(wrapper.emitted('on-custom')[0][0]).toEqual({
      status: ACTION_STATUSES.RUNNING,
      instanceGroup: 'ig-2'
    })
  })
})
