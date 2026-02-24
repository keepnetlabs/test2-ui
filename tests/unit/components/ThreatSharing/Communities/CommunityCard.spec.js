import { shallowMount } from '@vue/test-utils'
import CommunityCard from '@/components/ThreatSharing/Communities/CommunityCard.vue'

describe('CommunityCard.vue', () => {
  const defaultCommunity = {
    communityName: 'Test Community',
    membershipStatusId: 1,
    memberCount: 10,
    industryName: 'Technology',
    privacyStatusName: 'Public',
    communityDescription: 'A test community',
    createTime: '2024-01-01',
    lastPostTime: null
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(CommunityCard, {
      propsData: {
        isOwnerOrMember: true,
        community: { ...defaultCommunity },
        isRequestToJoinDisabled: false,
        canEditCommunity: false,
        canLeaveCommunity: true,
        canDeleteCommunity: false,
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
    expect(wrapper.text()).toContain('Test Community')
  })

  it('isPrivateCommunity true when privacyStatusName Private and no membership', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, membershipStatusId: null, privacyStatusName: 'Private' }
    })
    expect(wrapper.vm.isPrivateCommunity).toBe(true)
  })

  it('isPublicCommunity true when privacyStatusName Public and no membership', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, membershipStatusId: null, privacyStatusName: 'Public' }
    })
    expect(wrapper.vm.isPublicCommunity).toBe(true)
  })

  it('isRequestDeclined true when membershipStatusId 5 and privacy set', () => {
    const wrapper = createWrapper({
      community: { ...defaultCommunity, membershipStatusId: 5, privacyStatusName: 'Private' }
    })
    expect(wrapper.vm.isRequestDeclined).toBe(true)
  })

  it('onClickDetails emits detailsClick', () => {
    const wrapper = createWrapper()
    wrapper.vm.onClickDetails()
    expect(wrapper.emitted('detailsClick')).toBeTruthy()
  })

  it('onRequestJoin emits requestJoin', () => {
    const wrapper = createWrapper()
    wrapper.vm.onRequestJoin()
    expect(wrapper.emitted('requestJoin')).toBeTruthy()
  })

  it('onJoin emits join', () => {
    const wrapper = createWrapper()
    wrapper.vm.onJoin()
    expect(wrapper.emitted('join')).toBeTruthy()
  })

  it('onClickInvited emits invitedClick', () => {
    const wrapper = createWrapper()
    wrapper.vm.onClickInvited()
    expect(wrapper.emitted('invitedClick')).toBeTruthy()
  })

  it('onEditCommunity emits editCommunity', () => {
    const wrapper = createWrapper()
    wrapper.vm.onEditCommunity()
    expect(wrapper.emitted('editCommunity')).toBeTruthy()
  })

  it('onClickNotificationSettings emits notificationSettingsClick', () => {
    const wrapper = createWrapper()
    wrapper.vm.onClickNotificationSettings()
    expect(wrapper.emitted('notificationSettingsClick')).toBeTruthy()
  })

  it('onLeaveCommunity emits leaveCommunity', () => {
    const wrapper = createWrapper()
    wrapper.vm.onLeaveCommunity()
    expect(wrapper.emitted('leaveCommunity')).toBeTruthy()
  })

  it('onDeleteCommunity emits deleteCommunity', () => {
    const wrapper = createWrapper()
    wrapper.vm.onDeleteCommunity()
    expect(wrapper.emitted('deleteCommunity')).toBeTruthy()
  })

  it('onCancelRequest emits cancelRequest', () => {
    const wrapper = createWrapper()
    wrapper.vm.onCancelRequest()
    expect(wrapper.emitted('cancelRequest')).toBeTruthy()
  })
})
