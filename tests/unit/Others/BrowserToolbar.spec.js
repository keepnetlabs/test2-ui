import { createLocalVue, shallowMount } from '@vue/test-utils'
import BrowserToolbar from '@/components/Common/Others/BrowserToolbar.vue'

describe('BrowserToolbar.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(BrowserToolbar, {
      localVue,
      propsData
    })
  }

  it('renders correctly when showToolbar is true', () => {
    const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
    expect(wrapper.find('.browser-toolbar').exists()).toBe(true)
    expect(wrapper.find('.browser-toolbar__url-text').text()).toContain('http://test.com')
  })

  it('hides toolbar when showToolbar is false', () => {
    const wrapper = mountComponent({ showToolbar: false })
    expect(wrapper.find('.browser-toolbar').exists()).toBe(false)
  })

  it('formats URL with random number and page index', () => {
    const wrapper = mountComponent({ url: 'http://test.com?', pageIndex: 1 })
    const formatted = wrapper.vm.formattedUrl
    expect(formatted).toContain('http://test.com?')
    expect(formatted).toContain('&order=2')
  })

  it('returns empty string if url is missing', () => {
    const wrapper = mountComponent({ url: '' })
    expect(wrapper.vm.formattedUrl).toBe('')
  })
})
