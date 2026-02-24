import { shallowMount } from '@vue/test-utils'
import CommunityCard from '@/components/ThreatSharing/Communities/CommunityCard.vue'

describe('CommunityCard.vue (extra)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CommunityCard, {
      propsData: {
        isOwnerOrMember: false,
        community: {
          communityName: 'Test',
          membershipStatusId: null,
          memberCount: 5,
          industryName: 'Tech',
          privacyStatusName: 'Public',
          communityDescription: 'Desc',
          createTime: '2024-01-01',
          lastPostTime: null
        },
        isRequestToJoinDisabled: false,
        canEditCommunity: false,
        canLeaveCommunity: false,
        canDeleteCommunity: false,
        ...propsData
      },
      stubs: { VClamp: true }
    })

  it('isRequestDeclined true when membershipStatusId 5 and privacy Public', () => {
    const wrapper = createWrapper({
      community: {
        communityName: 'X',
        membershipStatusId: 5,
        privacyStatusName: 'Public',
        memberCount: 0,
        communityDescription: '',
        createTime: '',
        lastPostTime: null
      }
    })
    expect(wrapper.vm.isRequestDeclined).toBe(true)
  })

  it('displays Industry fallback when industryName missing', () => {
    const wrapper = createWrapper({
      community: {
        communityName: 'X',
        membershipStatusId: 1,
        memberCount: 0,
        industryName: null,
        privacyStatusName: 'Public',
        communityDescription: '',
        createTime: '',
        lastPostTime: null
      }
    })
    expect(wrapper.text()).toContain('Industry')
  })

  it('displays lastPostTime when available', () => {
    const wrapper = createWrapper({
      community: {
        communityName: 'X',
        membershipStatusId: 1,
        memberCount: 0,
        industryName: 'Tech',
        privacyStatusName: 'Public',
        communityDescription: '',
        createTime: '2024-01-01',
        lastPostTime: '2024-02-01'
      }
    })
    expect(wrapper.text()).toContain('2024-02-01')
  })

  it('displays createTime when lastPostTime missing', () => {
    const wrapper = createWrapper({
      community: {
        communityName: 'X',
        membershipStatusId: 1,
        memberCount: 0,
        industryName: 'Tech',
        privacyStatusName: 'Public',
        communityDescription: '',
        createTime: '2024-01-01',
        lastPostTime: null
      }
    })
    expect(wrapper.text()).toContain('2024-01-01')
  })

  it('hides privacyStatusName when not set', () => {
    const wrapper = createWrapper({
      community: {
        communityName: 'X',
        membershipStatusId: 1,
        memberCount: 0,
        industryName: 'Tech',
        privacyStatusName: null,
        communityDescription: '',
        createTime: '',
        lastPostTime: null
      }
    })
    expect(wrapper.find('.ts-community-industry').exists()).toBe(true)
  })
})
