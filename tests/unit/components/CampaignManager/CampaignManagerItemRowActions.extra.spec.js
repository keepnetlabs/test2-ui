import { shallowMount, createLocalVue } from '@vue/test-utils'
import CampaignManagerItemRowActions from '@/components/CampaignManager/CampaignManagerItemRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

const localVue = createLocalVue()

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '123'),
  createRandomString: jest.fn(() => 'abc')
}))

describe('CampaignManagerItemRowActions.extra.spec.js', () => {
  const defaultProps = {
    rowActions: [
      { name: 'Launch', action: ACTION_STATUSES.IDLE },
      { name: 'Stop', action: ACTION_STATUSES.RUNNING }
    ],
    scope: {
      row: {
        status: ACTION_STATUSES.IDLE,
        instanceGroup: 'g1'
      },
      $index: 0
    },
    campaignResourceId: 'camp1',
    type: SCENARIO_TYPES.PHISHING
  }

  const createWrapper = (propsData = {}, getters = {}) => {
    return shallowMount(CampaignManagerItemRowActions, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignReportsDeletePermissions': true,
            ...getters
          }
        },
        $router: { push: jest.fn() }
      },
      stubs: { VTooltip: true, VBtn: true, VIcon: true, VMenu: true, VList: true, VListItem: true, VListItemTitle: true }
    })
  }

  describe('handleItemClick Branching', () => {
    it('navigates to Quishing Report for non-phishing type', () => {
      const wrapper = createWrapper({ 
        type: SCENARIO_TYPES.QUISHING,
        scope: { row: { status: ACTION_STATUSES.COMPLETE, instanceGroup: 'g2' } }
      })
      wrapper.vm.handleItemClick({})
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(expect.objectContaining({ 
        name: 'Quishing Report',
        params: { id: 'camp1', instanceGroup: 'g2' }
      }))
    })

    it('emits on-launch for IDLE action', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })

    it('emits on-stop for RUNNING action', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })
      expect(wrapper.emitted('on-stop')).toBeTruthy()
    })

    it('emits on-preview for SCHEDULED status', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.SCHEDULED })
      expect(wrapper.emitted('on-preview')).toBeTruthy()
    })
  })

  describe('getId Branching', () => {
    it('returns cancel id for RUNNING status', () => {
      const wrapper = createWrapper({ 
        scope: { row: { status: ACTION_STATUSES.RUNNING } } 
      })
      expect(wrapper.vm.getId).toContain('btn-cancel')
    })

    it('returns send id for IDLE status', () => {
      const wrapper = createWrapper({ 
        scope: { row: { status: ACTION_STATUSES.IDLE } } 
      })
      expect(wrapper.vm.getId).toContain('btn-send')
    })

    it('returns view-report id for COMPLETE status', () => {
      const wrapper = createWrapper({ 
        scope: { row: { status: ACTION_STATUSES.COMPLETE } } 
      })
      expect(wrapper.vm.getId).toContain('btn-view-report')
    })
  })

  describe('getRowActions Branching', () => {
    it('adds View Report action for ERROR status', () => {
      const wrapper = createWrapper({ 
        scope: { row: { status: ACTION_STATUSES.ERROR } } 
      })
      const actions = wrapper.vm.getRowActions
      expect(actions[0].action).toBe('on-view-report')
    })
  })
})
