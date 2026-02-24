import { shallowMount } from '@vue/test-utils'
import EmailDetailsPreviewFooter from '@/components/IncidentResponder/EmailDetails/EmailDetailsPreviewFooter.vue'

describe('EmailDetailsPreviewFooter.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(EmailDetailsPreviewFooter, {
      propsData: {
        mailDetails: { attachments: [] },
        ...propsData
      },
      stubs: { VMenu: true, VList: true, VListItem: true, VIcon: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getClass returns red-attach when malicious', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getClass([
      { result: 'Malicious' },
      { result: 'Clean' }
    ])
    expect(result).toBe('red-attach')
  })

  it('getClass returns red-attach when Phishing', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getClass([{ result: 'Phishing' }])
    expect(result).toBe('red-attach')
  })

  it('getClass returns blue-attach when not malicious', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getClass([{ result: 'Clean' }])
    expect(result).toBe('blue-attach')
  })

  it('getClass returns blue-attach when empty', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getClass([])
    expect(result).toBe('blue-attach')
  })

  it('getIsAnalysisMalicious returns true for Malicious', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getIsAnalysisMalicious([{ result: 'Malicious' }])).toBe(true)
  })

  it('getIsAnalysisMalicious returns true for Phishing', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getIsAnalysisMalicious([{ result: 'Phishing' }])).toBe(true)
  })

  it('getIsAnalysisMalicious returns false for Clean', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getIsAnalysisMalicious([{ result: 'Clean' }])).toBe(false)
  })

  it('getIsAnalysisMalicious returns falsy for empty array', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getIsAnalysisMalicious([])).toBeFalsy()
  })

  it('getClass handles undefined analysisList', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getClass()
    expect(result).toBe('blue-attach')
  })
})
