import { shallowMount, createLocalVue } from '@vue/test-utils'
import CampaignManagerNewInstanceModal from '@/components/CampaignManager/CampaignManagerNewInstanceModal.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'

const localVue = createLocalVue()

describe('CampaignManagerNewInstanceModal.extra.spec.js', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerNewInstanceModal, {
      localVue,
      propsData: {
        status: true,
        resourceId: 'res1',
        selectedRow: { resourceId: 'res1', method: 'MFA' },
        ...propsData
      },
      mocks: {
        $moment: jest.fn((val) => ({ format: jest.fn(() => val || 'now') })),
        $store: {
          getters: {
            'common/getTimezones': { timeZoneList: [{ id: 'tz1', displayName: 'UTC' }] }
          },
          dispatch: jest.fn()
        }
      },
      stubs: {
        AppModal: { template: '<div><slot name="overlay-body" /></div>' },
        AppModalBodyHeader: true,
        FormGroup: true,
        CampaignManagerTargetGroups: true,
        CustomError: true,
        InputSchedule: true,
        InputDistribution: true
      }
    })
  }

  describe('isMFAScenarioSelected branching', () => {
    it('returns true when method is MFA', () => {
      const wrapper = createWrapper({ selectedRow: { method: 'MFA' } })
      expect(wrapper.vm.isMFAScenarioSelected).toBe(true)
    })

    it('returns true when method is Multiple Method and includes MFA', () => {
      const wrapper = createWrapper({ 
        selectedRow: { 
          method: 'Multiple Method', 
          methodDetail: JSON.stringify([{ method: 'Phishing' }, { method: 'MFA' }]) 
        } 
      })
      expect(wrapper.vm.isMFAScenarioSelected).toBe(true)
    })

    it('returns false when method is not MFA', () => {
      const wrapper = createWrapper({ selectedRow: { method: 'Phishing' } })
      expect(wrapper.vm.isMFAScenarioSelected).toBe(false)
    })
  })

  describe('handleSubmit validation', () => {
    it('sets isDateValid to false if schedule is SCHEDULE_TO but date is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO, scheduledDate: '' },
        formValues: { targetGroupResourceIds: ['group1'] }
      })
      wrapper.vm.handleSubmit()
      expect(wrapper.vm.isDateValid).toBe(false)
    })

    it('sets isTargetGroupsValid to false if target groups are empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.NOW, scheduledDate: '' },
        formValues: { targetGroupResourceIds: [] }
      })
      wrapper.vm.handleSubmit()
      expect(wrapper.vm.isTargetGroupsValid).toBe(false)
    })
  })

  describe('getDistributionDelayTimeItems', () => {
    it('returns empty array if formDetails is missing', () => {
      const wrapper = createWrapper({ formDetails: {} })
      expect(wrapper.vm.getDistributionDelayTimeItems).toEqual([])
    })

    it('returns items from formDetails', () => {
      const items = [{ text: '1', value: '1' }]
      const wrapper = createWrapper({ formDetails: { distributionSmtpDelayTimeTypes: items } })
      expect(wrapper.vm.getDistributionDelayTimeItems).toEqual(items)
    })
  })

  describe('getTargetGroupErrorMessage', () => {
    it('returns selection required error if groups are empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({ formValues: { targetGroupResourceIds: [] } })
      expect(wrapper.vm.getTargetGroupErrorMessage).toBe(wrapper.vm.labels.TargetGroupSelectionRequiredError)
    })
  })
})
