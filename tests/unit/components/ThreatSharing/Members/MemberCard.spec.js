import { shallowMount } from '@vue/test-utils'
import MemberCard from '@/components/ThreatSharing/Members/MemberCard.vue'

describe('MemberCard.vue', () => {
  const defaultMember = {
    companyName: 'Acme Corp',
    userCount: 5,
    industryName: 'Technology',
    postCount: 12
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(MemberCard, {
      propsData: {
        member: { ...defaultMember },
        index: 0,
        memberImage: 'https://example.com/logo.png',
        canAppointNewOwner: true,
        canRemoveFromCommunity: true,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays member company name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('displays user count for member', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('5 users')
  })

  it('displays industry name or Unknown when missing', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Technology')

    const wrapperNoIndustry = createWrapper({
      member: { ...defaultMember, industryName: null }
    })
    expect(wrapperNoIndustry.text()).toContain('Unknown')
  })

  it('displays post count', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('12 threat posts')
  })

  it('onSeePostedIncidents emits seePostedIncidents', () => {
    const wrapper = createWrapper()
    wrapper.vm.onSeePostedIncidents()
    expect(wrapper.emitted('seePostedIncidents')).toBeTruthy()
  })

  it('onAppointNewOwner emits appointNewOwner', () => {
    const wrapper = createWrapper()
    wrapper.vm.onAppointNewOwner()
    expect(wrapper.emitted('appointNewOwner')).toBeTruthy()
  })

  it('onRemoveFromCommunity emits removeFromCommunity', () => {
    const wrapper = createWrapper()
    wrapper.vm.onRemoveFromCommunity()
    expect(wrapper.emitted('removeFromCommunity')).toBeTruthy()
  })
})
