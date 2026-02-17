import { shallowMount } from '@vue/test-utils'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'

describe('CampaignManagerTargetGroupsAndUserSummaryInfo.vue', () => {
  it('returns verified domain count when isPhoneNumber is false', () => {
    const wrapper = shallowMount(CampaignManagerTargetGroupsAndUserSummaryInfo, {
      propsData: {
        isPhoneNumber: false,
        items: []
      }
    })

    const count = wrapper.vm.getUserCount({
      domainAllowList: [{ status: 'Verified', count: 8 }]
    })
    expect(count).toBe(8)
  })

  it('returns phone number yes count when isPhoneNumber is true', () => {
    const wrapper = shallowMount(CampaignManagerTargetGroupsAndUserSummaryInfo, {
      propsData: {
        isPhoneNumber: true,
        items: []
      }
    })

    const count = wrapper.vm.getUserCount({
      hasPhoneNumber: [{ status: 'Yes', count: 5 }]
    })
    expect(count).toBe(5)
  })

  it('returns 0 when expected status rows are missing', () => {
    const wrapperPhone = shallowMount(CampaignManagerTargetGroupsAndUserSummaryInfo, {
      propsData: {
        isPhoneNumber: true,
        items: []
      }
    })
    const wrapperDomain = shallowMount(CampaignManagerTargetGroupsAndUserSummaryInfo, {
      propsData: {
        isPhoneNumber: false,
        items: []
      }
    })

    expect(wrapperPhone.vm.getUserCount({ hasPhoneNumber: [{ status: 'No', count: 3 }] })).toBe(0)
    expect(wrapperDomain.vm.getUserCount({ domainAllowList: [{ status: 'Pending', count: 7 }] })).toBe(0)
  })

  it('renders target group rows and computed counts', () => {
    const wrapper = shallowMount(CampaignManagerTargetGroupsAndUserSummaryInfo, {
      propsData: {
        isPhoneNumber: false,
        items: [
          {
            targetGroupName: 'IT Team',
            domainAllowList: [{ status: 'Verified', count: 12 }]
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('IT Team')
    expect(wrapper.text()).toContain('12')
  })
})
