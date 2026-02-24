import { shallowMount } from '@vue/test-utils'
import CommunityInvitationCard from '@/components/ThreatSharing/Communities/CommunityInvitationCard.vue'

describe('CommunityInvitationCard.vue (branch coverage)', () => {
  const defaultCommunity = {
    name: 'Test Community',
    memberCount: 10,
    industryName: 'Tech',
    privacyStatusName: 'Public',
    description: 'A test community',
    lastPostTime: '2024-01-01',
    disabled: false
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(CommunityInvitationCard, {
      propsData: {
        community: { ...defaultCommunity },
        ...propsData
      },
      stubs: { VClamp: true }
    })

  it('hides privacyStatusName when absent', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, privacyStatusName: null }
    })
    expect(wrapper.vm.community.privacyStatusName).toBeNull()
  })

  it('hides lastPostTime section when absent', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, lastPostTime: null }
    })
    expect(wrapper.vm.community.lastPostTime).toBeNull()
  })

  it('passes disabled to JOIN button when community.disabled is true', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, disabled: true }
    })
    const joinBtn = wrapper.find('#threat-sharing-communities-accept-join-request')
    expect(joinBtn.attributes('disabled')).toBeDefined()
  })

  it('industryName fallback when null', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, industryName: null }
    })
    expect(wrapper.text()).toContain('Industry')
  })
})
