import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemRowActions from '@/components/SmishingCampaignManager/CampaignManagerItemRowActions.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '123')
}))

describe('CampaignManagerItemRowActions.vue (extra branch coverage)', () => {
  const createWrapper = (scope = { row: { status: 'Scheduled', instanceGroup: 'ig-1' } }) =>
    shallowMount(CampaignManagerItemRowActions, {
      propsData: {
        scope,
        rowActions: [
          { name: 'Launch', action: 'on-launch', id: 'launch' },
          { name: 'Delete', action: 'on-delete', id: 'delete' }
        ],
        campaignResourceId: 'camp-1'
      },
      mocks: {
        $router: { push: jest.fn() },
        $store: {
          getters: {
            'permissions/getSmishingCampaignJobDeletePermissions': true
          }
        }
      },
      stubs: { VTooltip: true, VMenu: true, VBtn: true, VIcon: true, VList: true, VListItem: true }
    })

  describe('getIconName branches', () => {
    it('returns mdi-text-box for COMPLETE', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.COMPLETE, instanceGroup: 'ig-1' }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-text-box')
    })
    it('returns mdi-close for RUNNING', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.RUNNING, instanceGroup: 'ig-1' }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-close')
    })
    it('returns mdi-send for IDLE', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.IDLE, instanceGroup: 'ig-1' }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-send')
    })
    it('returns mdi-eye for unknown status', () => {
      const wrapper = createWrapper({
        row: { status: 'Unknown', instanceGroup: 'ig-1' }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-eye')
    })
  })

  describe('getTooltipText branches', () => {
    it('returns Delete for DELETE status', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.DELETE, instanceGroup: 'ig-1' }
      })
      expect(wrapper.vm.getTooltipText).toContain('Delete')
    })
    it('returns Cancel for RUNNING', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.RUNNING, instanceGroup: 'ig-1' }
      })
      expect(wrapper.vm.getTooltipText).toBe('Cancel')
    })
  })

  describe('getRowActions branches', () => {
    it('prepends ViewReport for RUNNING', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.RUNNING, instanceGroup: 'ig-1' }
      })
      const actions = wrapper.vm.getRowActions
      expect(actions[0].action).toBe('on-view-report')
    })
  })

  describe('handleItemClick branches', () => {
    it('pushes to router for on-view-report', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.COMPLETE, instanceGroup: 'ig-1' }
      })
      wrapper.vm.handleItemClick({ action: 'on-view-report' })
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Smishing Report',
          params: { id: 'camp-1', instanceGroup: 'ig-1' }
        })
      )
    })
    it('emits on-launch for IDLE action', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.IDLE, instanceGroup: 'ig-1' }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })
    it('emits on-stop for RUNNING action', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.RUNNING, instanceGroup: 'ig-1' }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })
      expect(wrapper.emitted('on-stop')).toBeTruthy()
    })
    it('emits on-preview for SCHEDULED action', () => {
      const wrapper = createWrapper({
        row: { status: ACTION_STATUSES.SCHEDULED, instanceGroup: 'ig-1' }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.SCHEDULED })
      expect(wrapper.emitted('on-preview')).toBeTruthy()
    })
  })
})
