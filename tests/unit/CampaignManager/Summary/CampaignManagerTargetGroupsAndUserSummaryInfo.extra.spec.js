import { shallowMount } from '@vue/test-utils'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'

describe('CampaignManagerTargetGroupsAndUserSummaryInfo.vue (extra branches)', () => {
  const mountOpts = (isPhoneNumber) => ({
    propsData: { isPhoneNumber, items: [] }
  })

  it('returns 0 when item is null or undefined', () => {
    const w = shallowMount(
      CampaignManagerTargetGroupsAndUserSummaryInfo,
      mountOpts(false)
    )
    expect(w.vm.getUserCount(null)).toBe(0)
    expect(w.vm.getUserCount(undefined)).toBe(0)
  })

  it('uses first Verified domain row when multiple Verified entries exist', () => {
    const w = shallowMount(
      CampaignManagerTargetGroupsAndUserSummaryInfo,
      mountOpts(false)
    )
    expect(
      w.vm.getUserCount({
        domainAllowList: [
          { status: 'Verified', count: 10 },
          { status: 'Verified', count: 20 }
        ]
      })
    ).toBe(10)
  })

  it('uses first Yes phone row when multiple Yes entries exist', () => {
    const w = shallowMount(
      CampaignManagerTargetGroupsAndUserSummaryInfo,
      mountOpts(true)
    )
    expect(
      w.vm.getUserCount({
        hasPhoneNumber: [
          { status: 'Yes', count: 3 },
          { status: 'Yes', count: 7 }
        ]
      })
    ).toBe(3)
  })

  it('returns 0 when domainAllowList or hasPhoneNumber is missing', () => {
    const wDomain = shallowMount(
      CampaignManagerTargetGroupsAndUserSummaryInfo,
      mountOpts(false)
    )
    const wPhone = shallowMount(
      CampaignManagerTargetGroupsAndUserSummaryInfo,
      mountOpts(true)
    )
    expect(wDomain.vm.getUserCount({})).toBe(0)
    expect(wPhone.vm.getUserCount({})).toBe(0)
  })
})
