import { shallowMount } from '@vue/test-utils'
import CommunityInvitationCard from '@/components/ThreatSharing/Communities/CommunityInvitationCard.vue'

describe('CommunityInvitationCard.vue', () => {
  const defaultCommunity = {
    name: 'Invited Community',
    memberCount: 15,
    industryName: 'Finance',
    privacyStatusName: 'Public',
    description: 'A community you have been invited to',
    lastPostTime: '2024-01-15',
    disabled: false
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(CommunityInvitationCard, {
      propsData: {
        community: { ...defaultCommunity },
        ...propsData
      },
      stubs: {
        VClamp: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays community name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Invited Community')
  })

  it('displays member count', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('15')
  })

  it('displays industry name or fallback', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Finance')

    const wrapperNoIndustry = createWrapper({
      community: { ...defaultCommunity, industryName: null }
    })
    expect(wrapperNoIndustry.text()).toContain('Industry')
  })

  it('displays last post time when present', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Last update:')
    expect(wrapper.text()).toContain('2024-01-15')
  })

  it('onClickCommunityName emits communityNameClick', () => {
    const wrapper = createWrapper()
    wrapper.vm.onClickCommunityName()
    expect(wrapper.emitted('communityNameClick')).toBeTruthy()
  })

  it('onRefuseRequest emits refuseRequest', () => {
    const wrapper = createWrapper()
    wrapper.vm.onRefuseRequest()
    expect(wrapper.emitted('refuseRequest')).toBeTruthy()
  })

  it('onAcceptRequest emits acceptRequest', () => {
    const wrapper = createWrapper()
    wrapper.vm.onAcceptRequest()
    expect(wrapper.emitted('acceptRequest')).toBeTruthy()
  })
})
