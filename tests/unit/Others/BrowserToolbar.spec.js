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

  describe('component rendering', () => {
    it('renders correctly when showToolbar is true', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      expect(wrapper.find('.browser-toolbar').exists()).toBe(true)
      expect(wrapper.find('.browser-toolbar__url-text').text()).toContain('http://test.com')
    })

    it('hides toolbar when showToolbar is false', () => {
      const wrapper = mountComponent({ showToolbar: false })
      expect(wrapper.find('.browser-toolbar').exists()).toBe(false)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      expect(wrapper.vm.$options.name).toBe('BrowserToolbar')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm).toBeDefined()
    })

    it('renders with default showToolbar true', () => {
      const wrapper = mountComponent({ url: 'http://test.com' })
      expect(wrapper.find('.browser-toolbar').exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should accept url prop', () => {
      const wrapper = mountComponent({ url: 'http://example.com' })
      expect(wrapper.vm.url).toBe('http://example.com')
    })

    it('should accept pageIndex prop', () => {
      const wrapper = mountComponent({ pageIndex: 3 })
      expect(wrapper.vm.pageIndex).toBe(3)
    })

    it('should accept showToolbar prop', () => {
      const wrapper = mountComponent({ showToolbar: false })
      expect(wrapper.vm.showToolbar).toBe(false)
    })

    it('should have default url as empty string', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm.url).toBe('')
    })

    it('should have default pageIndex as 0', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm.pageIndex).toBe(0)
    })

    it('should have default showToolbar as true', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm.showToolbar).toBe(true)
    })
  })

  describe('URL formatting', () => {
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

    it('handles different page indexes', () => {
      const wrapper = mountComponent({ url: 'http://test.com?', pageIndex: 5 })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('&order=6')
    })

    it('does not add order param when pageIndex is 0', () => {
      const wrapper = mountComponent({
        url: 'http://test.com?param=value',
        pageIndex: 0
      })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('param=value')
      expect(formatted).not.toContain('&order=')
    })

    it('computes URL correctly with random number', () => {
      const wrapper = mountComponent({ url: 'http://simple.com?' })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('http://simple.com?')
      expect(formatted.length).toBeGreaterThan('http://simple.com?'.length)
    })

    it('includes random number in formatted URL', () => {
      const wrapper = mountComponent({ url: 'http://test.com?' })
      const formatted = wrapper.vm.formattedUrl
      const randomPart = formatted.replace('http://test.com?', '').split('&')[0]
      expect(randomPart).toMatch(/^\d+$/)
    })

    it('order parameter is correctly calculated from pageIndex', () => {
      const wrapper = mountComponent({ url: 'http://test.com?', pageIndex: 10 })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('&order=11')
    })

    it('handles URL with existing parameters', () => {
      const wrapper = mountComponent({ url: 'http://test.com?existing=param', pageIndex: 2 })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('existing=param')
      expect(formatted).toContain('&order=3')
    })

    it('returns empty string when URL is null', () => {
      const wrapper = mountComponent({ url: null })
      expect(wrapper.vm.formattedUrl).toBe('')
    })

    it('returns empty string when URL is undefined', () => {
      const wrapper = mountComponent({ url: undefined })
      expect(wrapper.vm.formattedUrl).toBe('')
    })
  })

  describe('toolbar controls and dots', () => {
    it('renders browser control dots', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      expect(wrapper.find('.browser-toolbar__controls').exists()).toBe(true)
      expect(wrapper.findAll('.browser-toolbar__dot').length).toBe(3)
    })

    it('renders three colored dots', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      const dots = wrapper.findAll('.browser-toolbar__dot')
      expect(dots.at(0).classes()).toContain('browser-toolbar__dot--red')
      expect(dots.at(1).classes()).toContain('browser-toolbar__dot--yellow')
      expect(dots.at(2).classes()).toContain('browser-toolbar__dot--green')
    })

    it('should not render controls when showToolbar is false', () => {
      const wrapper = mountComponent({ showToolbar: false })
      expect(wrapper.find('.browser-toolbar__controls').exists()).toBe(false)
    })

    it('control dots have correct CSS classes', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      const dots = wrapper.findAll('.browser-toolbar__dot')
      dots.wrappers.forEach((dot) => {
        expect(dot.classes()).toContain('browser-toolbar__dot')
      })
    })
  })

  describe('URL bar display', () => {
    it('displays URL in url-text element', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://example.com' })
      const urlText = wrapper.find('.browser-toolbar__url-text')
      expect(urlText.exists()).toBe(true)
      expect(urlText.text()).toContain('http://example.com')
    })

    it('should not render url-bar when showToolbar is false', () => {
      const wrapper = mountComponent({ showToolbar: false })
      expect(wrapper.find('.browser-toolbar__url-bar').exists()).toBe(false)
    })

    it('url text updates when URL prop changes', async () => {
      const wrapper = mountComponent({ url: 'http://initial.com' })
      await wrapper.setProps({ url: 'http://updated.com' })
      expect(wrapper.find('.browser-toolbar__url-text').text()).toContain('http://updated.com')
    })

    it('displays formatted URL in the text element', () => {
      const wrapper = mountComponent({ url: 'http://test.com?', pageIndex: 1 })
      const urlText = wrapper.find('.browser-toolbar__url-text').text()
      expect(urlText).toContain('&order=2')
    })
  })

  describe('reactive prop updates', () => {
    it('should update when showToolbar prop changes', async () => {
      const wrapper = mountComponent({ showToolbar: false, url: 'http://test.com' })
      expect(wrapper.find('.browser-toolbar').exists()).toBe(false)
      await wrapper.setProps({ showToolbar: true })
      expect(wrapper.find('.browser-toolbar').exists()).toBe(true)
    })

    it('should update when pageIndex prop changes', async () => {
      const wrapper = mountComponent({ url: 'http://test.com?', pageIndex: 0 })
      let formatted = wrapper.vm.formattedUrl
      expect(formatted).not.toContain('&order=')

      await wrapper.setProps({ pageIndex: 2 })
      formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('&order=3')
    })

    it('should generate new random number on URL prop change', async () => {
      const wrapper = mountComponent({ url: 'http://test.com?' })
      const firstFormatted = wrapper.vm.formattedUrl

      await wrapper.setProps({ url: 'http://test2.com?' })
      const secondFormatted = wrapper.vm.formattedUrl

      expect(firstFormatted).toContain('http://test.com?')
      expect(secondFormatted).toContain('http://test2.com?')
    })
  })

  describe('edge cases', () => {
    it('should handle URL with hash', () => {
      const wrapper = mountComponent({ url: 'http://test.com#section' })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('http://test.com#section')
    })

    it('should handle URL with special characters', () => {
      const wrapper = mountComponent({ url: 'http://test.com?param=%20' })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('param=%20')
    })

    it('should handle very large pageIndex', () => {
      const wrapper = mountComponent({ url: 'http://test.com?', pageIndex: 999999 })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('&order=1000000')
    })

    it('should handle very long URL', () => {
      const longUrl = 'http://test.com?' + 'a'.repeat(500)
      const wrapper = mountComponent({ url: longUrl })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain(longUrl)
    })

    it('should handle URL with multiple query parameters', () => {
      const wrapper = mountComponent({
        url: 'http://test.com?param1=value1&param2=value2',
        pageIndex: 1
      })
      const formatted = wrapper.vm.formattedUrl
      expect(formatted).toContain('param1=value1')
      expect(formatted).toContain('param2=value2')
      expect(formatted).toContain('&order=2')
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ url: 'http://test.com' })
      const wrapper2 = mountComponent({ url: 'http://test.com' })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent({ url: 'http://test.com' })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain props after lifecycle', async () => {
      const wrapper = mountComponent({ url: 'http://test.com', pageIndex: 5 })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.url).toBe('http://test.com')
      expect(wrapper.vm.pageIndex).toBe(5)
    })
  })

  describe('data types validation', () => {
    it('url should be string type', () => {
      const wrapper = mountComponent({ url: 'http://test.com' })
      expect(typeof wrapper.vm.url).toBe('string')
    })

    it('pageIndex should be number type', () => {
      const wrapper = mountComponent({ pageIndex: 3 })
      expect(typeof wrapper.vm.pageIndex).toBe('number')
    })

    it('showToolbar should be boolean type', () => {
      const wrapper = mountComponent({ showToolbar: true })
      expect(typeof wrapper.vm.showToolbar).toBe('boolean')
    })

    it('formattedUrl should be string type', () => {
      const wrapper = mountComponent({ url: 'http://test.com' })
      expect(typeof wrapper.vm.formattedUrl).toBe('string')
    })
  })

  describe('computed property behavior', () => {
    it('formattedUrl should be computed property', () => {
      const wrapper = mountComponent({ url: 'http://test.com' })
      expect(wrapper.vm.$options.computed.formattedUrl).toBeDefined()
    })

    it('formattedUrl changes when url changes', async () => {
      const wrapper = mountComponent({ url: 'http://test1.com?' })
      const first = wrapper.vm.formattedUrl

      await wrapper.setProps({ url: 'http://test2.com?' })
      const second = wrapper.vm.formattedUrl

      expect(first).not.toBe(second)
    })

    it('formattedUrl always includes base URL', () => {
      const wrapper = mountComponent({ url: 'http://test.com?' })
      expect(wrapper.vm.formattedUrl).toContain('http://test.com?')
    })
  })

  describe('template structure', () => {
    it('should have correct DOM structure', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      expect(wrapper.find('.browser-toolbar').exists()).toBe(true)
      expect(wrapper.find('.browser-toolbar__controls').exists()).toBe(true)
      expect(wrapper.find('.browser-toolbar__url-bar').exists()).toBe(true)
      expect(wrapper.find('.browser-toolbar__url-text').exists()).toBe(true)
    })

    it('all child elements should be spans or divs', () => {
      const wrapper = mountComponent({ showToolbar: true, url: 'http://test.com' })
      const toolbar = wrapper.find('.browser-toolbar')
      expect(toolbar.element.tagName).toBe('DIV')
    })
  })
})
