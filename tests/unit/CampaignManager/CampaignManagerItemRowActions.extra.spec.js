import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerItemRowActions from '@/components/CampaignManager/CampaignManagerItemRowActions'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'stable-id')
}))

describe('CampaignManagerItemRowActions.vue (extra branching)', () => {
  const localVue = createLocalVue()

  const baseRowActions = [
    { name: 'Stop', id: 'btn-stop', icon: 'mdi-stop', action: 'on-stop' },
    { name: 'Delete', id: 'btn-del', icon: 'mdi-delete', action: 'on-delete' }
  ]

  const mountWithStatus = (status) => {
    return shallowMount(CampaignManagerItemRowActions, {
      localVue,
      propsData: {
        rowActions: baseRowActions,
        scope: {
          row: { status, instanceGroup: 'ig-1' },
          $index: 0
        },
        campaignResourceId: 'camp-r'
      },
      computed: {
        getCampaignReportsDeletePermissions: () => true
      },
      mocks: {
        $router: { push: jest.fn() }
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
  }

  describe('getId (icon branch → btn prefix)', () => {
    it('uses view-report prefix when icon is mdi-text-box (Complete)', () => {
      const wrapper = mountWithStatus(ACTION_STATUSES.COMPLETE)
      expect(wrapper.vm.getId).toBe('btn-view-report--row-action-stable-id')
    })

    it('uses cancel prefix when icon is mdi-close (Running)', () => {
      const wrapper = mountWithStatus(ACTION_STATUSES.RUNNING)
      expect(wrapper.vm.getId).toBe('btn-cancel--row-action-stable-id')
    })

    it('uses send prefix when icon is mdi-send (Idle)', () => {
      const wrapper = mountWithStatus(ACTION_STATUSES.IDLE)
      expect(wrapper.vm.getId).toBe('btn-send--row-action-stable-id')
    })

    it('uses send prefix for default mdi-eye icon (e.g. Scheduled)', () => {
      const wrapper = mountWithStatus(ACTION_STATUSES.SCHEDULED)
      expect(wrapper.vm.getIconName).toBe('mdi-eye')
      expect(wrapper.vm.getId).toBe('btn-send--row-action-stable-id')
    })
  })

  describe('handleItemClick action mapping', () => {
    it('maps ERROR action to on-preview emit', () => {
      const emit = jest.fn()
      CampaignManagerItemRowActions.methods.handleItemClick.call(
        {
          isMenuRender: true,
          actionStatus: ACTION_STATUSES.RUNNING,
          type: SCENARIO_TYPES.PHISHING,
          campaignResourceId: 'camp-x',
          scope: { row: { instanceGroup: 'ig-err' } },
          $emit: emit,
          $router: { push: jest.fn() }
        },
        { action: ACTION_STATUSES.ERROR }
      )
      expect(emit).toHaveBeenCalledWith(
        'on-preview',
        expect.objectContaining({ instanceGroup: 'ig-err' })
      )
    })

    it('maps SCHEDULED action to on-preview emit', () => {
      const emit = jest.fn()
      CampaignManagerItemRowActions.methods.handleItemClick.call(
        {
          isMenuRender: true,
          actionStatus: ACTION_STATUSES.IDLE,
          type: SCENARIO_TYPES.PHISHING,
          campaignResourceId: 'camp-s',
          scope: { row: { instanceGroup: 'ig-s' } },
          $emit: emit,
          $router: { push: jest.fn() }
        },
        { action: ACTION_STATUSES.SCHEDULED }
      )
      expect(emit).toHaveBeenCalledWith('on-preview', expect.objectContaining({ instanceGroup: 'ig-s' }))
    })

    it('navigates to Campaign Report when single-button mode and status is Completed', () => {
      const push = jest.fn()
      CampaignManagerItemRowActions.methods.handleItemClick.call(
        {
          isMenuRender: false,
          actionStatus: ACTION_STATUSES.COMPLETE,
          type: SCENARIO_TYPES.PHISHING,
          campaignResourceId: 'camp-cr',
          scope: { row: { instanceGroup: 'ig-cr' } },
          $emit: jest.fn(),
          $router: { push }
        },
        { action: ACTION_STATUSES.COMPLETE }
      )
      expect(push).toHaveBeenCalledWith({
        name: 'Campaign Report',
        params: { id: 'camp-cr', instanceGroup: 'ig-cr' }
      })
    })

    it('navigates to Quishing Report when type is Quishing and report path applies', () => {
      const push = jest.fn()
      CampaignManagerItemRowActions.methods.handleItemClick.call(
        {
          isMenuRender: false,
          actionStatus: ACTION_STATUSES.COMPLETE,
          type: SCENARIO_TYPES.QUISHING,
          campaignResourceId: 'q1',
          scope: { row: { instanceGroup: 'ig-q' } },
          $emit: jest.fn(),
          $router: { push }
        },
        { action: ACTION_STATUSES.COMPLETE }
      )
      expect(push).toHaveBeenCalledWith({
        name: 'Quishing Report',
        params: { id: 'q1', instanceGroup: 'ig-q' }
      })
    })

    it('navigates on on-view-report even when menu mode', () => {
      const push = jest.fn()
      CampaignManagerItemRowActions.methods.handleItemClick.call(
        {
          isMenuRender: true,
          actionStatus: ACTION_STATUSES.RUNNING,
          type: SCENARIO_TYPES.PHISHING,
          campaignResourceId: 'camp-vr',
          scope: { row: { instanceGroup: 'ig-vr' } },
          $emit: jest.fn(),
          $router: { push }
        },
        { action: 'on-view-report' }
      )
      expect(push).toHaveBeenCalledWith({
        name: 'Campaign Report',
        params: { id: 'camp-vr', instanceGroup: 'ig-vr' }
      })
    })

    it('maps IDLE action to on-launch in single-button mode (no router)', () => {
      const emit = jest.fn()
      const push = jest.fn()
      CampaignManagerItemRowActions.methods.handleItemClick.call(
        {
          isMenuRender: false,
          actionStatus: ACTION_STATUSES.IDLE,
          type: SCENARIO_TYPES.PHISHING,
          campaignResourceId: 'camp-idle',
          scope: { row: { instanceGroup: 'ig-l' } },
          $emit: emit,
          $router: { push }
        },
        { action: ACTION_STATUSES.IDLE }
      )
      expect(emit).toHaveBeenCalledWith(
        'on-launch',
        expect.objectContaining({ instanceGroup: 'ig-l' })
      )
      expect(push).not.toHaveBeenCalled()
    })
  })
})
