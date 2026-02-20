import { shallowMount } from '@vue/test-utils'
import CommonSimulatorFastLaunchStep1 from '@/components/Common/Simulator/CommonSimulatorFastLaunchStep1.vue'

describe('CommonSimulatorFastLaunchStep1.vue', () => {
  const factory = (propsData = {}) =>
    shallowMount(CommonSimulatorFastLaunchStep1, {
      propsData: {
        formDetails: {
          sendRandomlyUsersCalculateTypes: [
            { text: 'Percent', value: '1' },
            { text: 'Count', value: '2' }
          ]
        },
        ...propsData
      },
      stubs: {
        CampaignManagerCampaignInfo: {
          name: 'CampaignManagerCampaignInfo',
          template: '<div />'
        },
        CampaignManagerTargetAudience: true,
        FormGroup: true,
        KSelect: true,
        VForm: true,
        VCheckbox: true,
        VTextField: true
      }
    })

  it('getDisabledStatusOfRandomlySelected is true by default', () => {
    const wrapper = factory()
    expect(wrapper.vm.getDisabledStatusOfRandomlySelected).toBe(true)
  })

  it('getDisabledStatusOfRandomlySelected is false when sendRandomlyUsers is enabled', async () => {
    const wrapper = factory()
    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        sendRandomlyUsers: true
      }
    })
    expect(wrapper.vm.getDisabledStatusOfRandomlySelected).toBe(false)
  })

  it('getRandomlySelectedItems returns values from formDetails', () => {
    const wrapper = factory()
    expect(wrapper.vm.getRandomlySelectedItems).toEqual([
      { text: 'Percent', value: '1' },
      { text: 'Count', value: '2' }
    ])
  })

  it('getRandomlySelectedItems returns empty array when formDetails is missing', () => {
    const wrapper = factory({ formDetails: undefined })
    expect(wrapper.vm.getRandomlySelectedItems).toEqual([])
  })

  it('getInitialFormValues stores a deep-copied merged payload', () => {
    const wrapper = factory()
    const payload = {
      customName: 'Campaign X',
      nested: { enabled: true }
    }

    wrapper.vm.getInitialFormValues(payload)
    payload.nested.enabled = false

    expect(wrapper.vm.initialFormValues.customName).toBe('Campaign X')
    expect(wrapper.vm.initialFormValues.nested.enabled).toBe(true)
    expect(wrapper.vm.initialFormValues.sendRandomlyUsersCount).toBe(20)
  })

  it('getCurrentFormValues merges local formData with campaign info formData', () => {
    const wrapper = factory()
    wrapper.vm.$refs.refCampaignManagerCampaignInfo = {
      formData: {
        campaignName: 'Fast Launch Campaign',
        timezone: 'UTC'
      }
    }

    const result = wrapper.vm.getCurrentFormValues()
    expect(result).toMatchObject({
      excludeFromReports: false,
      sendRandomlyUsers: false,
      sendRandomlyUsersCount: 20,
      sendRandomlyUsersCalculateTypeId: '1',
      campaignName: 'Fast Launch Campaign',
      timezone: 'UTC'
    })
  })
})
