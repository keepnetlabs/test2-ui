import { shallowMount } from '@vue/test-utils'
import RequestCard from '@/components/ThreatSharing/Members/RequestCard.vue'

describe('RequestCard.vue', () => {
  const defaultRequest = {
    companyName: 'Acme Corp',
    userCount: 3,
    industryName: 'Technology',
    postCount: 5,
    communityRequestResourceId: 'req-1'
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(RequestCard, {
      propsData: {
        request: { ...defaultRequest },
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays request company name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('displays user count', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('3 users')
  })

  it('displays industry name or fallback when missing', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Technology')

    const wrapperNoIndustry = createWrapper({
      request: { ...defaultRequest, industryName: null }
    })
    expect(wrapperNoIndustry.text()).toContain('No Category defined')
  })

  it('displays post count', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('5 threat posts')
  })

  it('onRefuseRequest emits refuseRequest', () => {
    const wrapper = createWrapper()
    wrapper.vm.onRefuseRequest()
    expect(wrapper.emitted('refuseRequest')).toBeTruthy()
  })

  it('onAcceptRequesst emits acceptRequest', () => {
    const wrapper = createWrapper()
    wrapper.vm.onAcceptRequesst()
    expect(wrapper.emitted('acceptRequest')).toBeTruthy()
  })
})
