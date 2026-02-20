import { shallowMount } from '@vue/test-utils'
import ThreatIntelligence from '@/views/ThreatIntelligence.vue'

describe('ThreatIntelligence.vue', () => {
  it('renders container and threat intelligence list component', () => {
    const wrapper = shallowMount(ThreatIntelligence, {
      stubs: {
        KContainer: true,
        ThreatIntelligenceList: true
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('ThreatIntelligence')
    expect(wrapper.find('kcontainer-stub').exists()).toBe(true)
    expect(wrapper.find('threatintelligencelist-stub').exists()).toBe(true)

    wrapper.destroy()
  })
})
