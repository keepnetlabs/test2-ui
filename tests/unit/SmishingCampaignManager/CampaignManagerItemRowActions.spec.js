import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemRowActions from '@/components/SmishingCampaignManager/CampaignManagerItemRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock123')
}))

describe('SmishingCampaignManager/CampaignManagerItemRowActions.vue', () => {
  const createWrapper = (status = ACTION_STATUSES.IDLE) =>
    shallowMount(CampaignManagerItemRowActions, {
      propsData: {
        rowActions: [{ action: 'on-delete', icon: 'mdi-delete', name: 'Delete', id: 'btn-delete' }],
        campaignResourceId: 'sm-1',
        scope: { row: { status, instanceGroup: 'ig-1' }, $index: 0 }
      },
      mocks: {
        $router: { push: jest.fn() }
      },
      computed: {
        getSmishingCampaignJobDeletePermissions: () => true
      },
      stubs: ['v-tooltip', 'v-btn', 'v-icon', 'v-menu', 'v-list', 'v-list-item', 'v-list-item-title']
    })

  it('computes id/icon/tooltip with smishing-specific running behavior', () => {
    const running = createWrapper(ACTION_STATUSES.RUNNING)
    const idle = createWrapper(ACTION_STATUSES.IDLE)
    const complete = createWrapper(ACTION_STATUSES.COMPLETE)

    expect(running.vm.getId).toContain('btn-cancel--row-action-mock123')
    expect(idle.vm.getId).toContain('btn-send--row-action-mock123')
    expect(complete.vm.getId).toContain('btn-view-report--row-action-mock123')
    expect(running.vm.getTooltipText).toBe('Cancel')
  })

  it('shows menu only for running-like statuses and prepends view-report action', () => {
    const running = createWrapper(ACTION_STATUSES.RUNNING)
    const error = createWrapper(ACTION_STATUSES.ERROR)
    const idle = createWrapper(ACTION_STATUSES.IDLE)

    expect(running.vm.isMenuRender).toBe(true)
    expect(error.vm.getRowActions[0].action).toBe('on-view-report')
    expect(idle.vm.isMenuRender).toBe(false)
  })

  it('routes to smishing report when status is non-menu or action is on-view-report', () => {
    const complete = createWrapper(ACTION_STATUSES.COMPLETE)
    complete.vm.handleItemClick({ action: ACTION_STATUSES.COMPLETE })
    expect(complete.vm.$router.push).toHaveBeenCalledWith({
      name: 'Smishing Report',
      params: { id: 'sm-1', instanceGroup: 'ig-1' }
    })

    const running = createWrapper(ACTION_STATUSES.RUNNING)
    running.vm.handleItemClick({ action: 'on-view-report' })
    expect(running.vm.$router.push).toHaveBeenCalledWith({
      name: 'Smishing Report',
      params: { id: 'sm-1', instanceGroup: 'ig-1' }
    })
  })

  it('maps idle/running/scheduled actions to launch/stop/preview emits', () => {
    const idle = createWrapper(ACTION_STATUSES.IDLE)
    idle.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
    expect(idle.emitted('on-launch')[0][0]).toEqual({ status: ACTION_STATUSES.IDLE, instanceGroup: 'ig-1' })

    const running = createWrapper(ACTION_STATUSES.RUNNING)
    running.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })
    expect(running.emitted('on-stop')[0][0]).toEqual({ status: ACTION_STATUSES.RUNNING, instanceGroup: 'ig-1' })

    const scheduled = createWrapper(ACTION_STATUSES.SCHEDULED)
    scheduled.vm.handleItemClick({ action: ACTION_STATUSES.SCHEDULED })
    expect(scheduled.emitted('on-preview')[0][0]).toEqual({
      status: ACTION_STATUSES.SCHEDULED,
      instanceGroup: 'ig-1'
    })
  })
})

