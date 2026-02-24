import { shallowMount } from '@vue/test-utils'
import SuggestedCommunity from '@/components/ThreatSharing/RightColumn/SuggestedCommunity.vue'

describe('SuggestedCommunity.vue', () => {
  const defaultCommunity = {
    communityName: 'Tech Community',
    memberCount: 25,
    industryName: 'Technology',
    privacyStatusName: 'Public',
    isJoined: false
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(SuggestedCommunity, {
      propsData: {
        community: { ...defaultCommunity },
        index: 0,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays community name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Tech Community')
  })

  it('displays member count', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('25')
  })

  it('displays industry and privacy', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Technology')
    expect(wrapper.text()).toContain('Public')
  })

  it('onJoinCommunity emits joinCommunity', () => {
    const wrapper = createWrapper({ community: { ...defaultCommunity, isJoined: false } })
    wrapper.vm.onJoinCommunity()
    expect(wrapper.emitted('joinCommunity')).toBeTruthy()
  })

  it('shows JOIN when not private and not joined', () => {
    const wrapper = createWrapper({ community: { ...defaultCommunity, privacyStatusName: 'Public' } })
    expect(wrapper.text()).toContain('JOIN')
  })

  it('shows Request to join when private and not joined', () => {
    const wrapper = createWrapper({ community: { ...defaultCommunity, privacyStatusName: 'Private' } })
    expect(wrapper.text()).toContain('Request to join')
  })

  it('shows Member when isJoined', () => {
    const wrapper = createWrapper({ community: { ...defaultCommunity, isJoined: true } })
    expect(wrapper.text()).toContain('Member')
  })
})
