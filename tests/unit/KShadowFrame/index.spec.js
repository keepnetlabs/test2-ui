import { createLocalVue, shallowMount } from '@vue/test-utils'
import KShadowFrame from '@/components/KShadowFrame.vue'

describe('KShadowFrame.vue', () => {
  const localVue = createLocalVue()

  it('renders content prop as html', () => {
    const content = '<p class="test-content">Hello</p>'
    const wrapper = shallowMount(KShadowFrame, {
      localVue,
      propsData: {
        content
      }
    })

    expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello')
  })

  it('renders properly with empty content', () => {
    const wrapper = shallowMount(KShadowFrame, {
      localVue,
      propsData: {
        content: ''
      }
    })

    expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('renders properly with null content', () => {
    const wrapper = shallowMount(KShadowFrame, {
      localVue,
      propsData: {
        content: null
      }
    })

    expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
  })

  it('renders complex HTML structures correctly', () => {
    const content = `
      <table>
        <tr><td>Row 1</td></tr>
      </table>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
      <div class="nested"><span>Nested content</span></div>
    `
    const wrapper = shallowMount(KShadowFrame, {
      localVue,
      propsData: {
        content
      }
    })

    expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.find('.nested span').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nested content')
  })

  it('supports multiple instances without conflicts', () => {
    const content1 = '<p class="content-1">First</p>'
    const content2 = '<p class="content-2">Second</p>'

    const wrapper1 = shallowMount(KShadowFrame, {
      localVue,
      propsData: { content: content1 }
    })

    const wrapper2 = shallowMount(KShadowFrame, {
      localVue,
      propsData: { content: content2 }
    })

    expect(wrapper1.find('.content-1').exists()).toBe(true)
    expect(wrapper1.find('.content-2').exists()).toBe(false)
    expect(wrapper2.find('.content-1').exists()).toBe(false)
    expect(wrapper2.find('.content-2').exists()).toBe(true)
  })

  describe('Component Rendering', () => {
    it('renders k-shadow-frame container', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p>Test</p>' }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })

    it('applies k-shadow-frame class to root', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<div>Content</div>' }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })

    it('mounts successfully with valid content', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<span>Valid</span>' }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Content Props', () => {
    it('accepts string content prop', () => {
      const content = '<p>String content</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.props('content')).toBe(content)
    })

    it('renders content as HTML', () => {
      const content = '<p class="special">Special content</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.special').exists()).toBe(true)
    })

    it('updates content when prop changes', async () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p class="first">First</p>' }
      })
      expect(wrapper.find('.first').exists()).toBe(true)

      await wrapper.setProps({ content: '<p class="second">Second</p>' })
      expect(wrapper.find('.second').exists()).toBe(true)
    })

    it('handles HTML entities in content', () => {
      const content = '<p>&lt;script&gt;&amp;&lt;/script&gt;</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })
  })

  describe('HTML Content Handling', () => {
    it('renders paragraph tags correctly', () => {
      const content = '<p>Paragraph content</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.text()).toContain('Paragraph content')
    })

    it('renders div elements correctly', () => {
      const content = '<div class="test-div">Div content</div>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.test-div').exists()).toBe(true)
    })

    it('renders span elements correctly', () => {
      const content = '<span class="highlight">Highlighted</span>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.highlight').exists()).toBe(true)
    })

    it('preserves text content from HTML', () => {
      const content = '<p><strong>Bold</strong> text</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.text()).toContain('Bold')
      expect(wrapper.text()).toContain('text')
    })
  })

  describe('Complex Content Structures', () => {
    it('renders nested elements', () => {
      const content = '<div class="outer"><div class="inner">Nested</div></div>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.outer .inner').exists()).toBe(true)
    })

    it('renders table structures', () => {
      const content = '<table><tr><td>Cell</td></tr></table>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.find('td').exists()).toBe(true)
    })

    it('renders list elements', () => {
      const content = '<ul><li>Item 1</li><li>Item 2</li></ul>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('ul').exists()).toBe(true)
      expect(wrapper.findAll('li').length).toBe(2)
    })

    it('renders ordered lists', () => {
      const content = '<ol><li>First</li><li>Second</li></ol>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('ol').exists()).toBe(true)
    })

    it('renders mixed content structures', () => {
      const content = `
        <h1>Title</h1>
        <p>Paragraph</p>
        <div class="box">
          <span>Span content</span>
        </div>
      `
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('h1').exists()).toBe(true)
      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.find('.box').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string content', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '' }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
      expect(wrapper.text()).toBe('')
    })

    it('handles null content', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: null }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })

    it('handles undefined content', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: undefined }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })

    it('handles whitespace-only content', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '   ' }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })

    it('handles very long HTML content', () => {
      const longContent = '<p>' + 'a'.repeat(1000) + '</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: longContent }
      })
      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('handles special HTML characters', () => {
      const content = '<p>&copy; &nbsp; &lt;&gt;</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('maintains separate content for each instance', () => {
      const content1 = '<p class="first">Instance 1</p>'
      const content2 = '<p class="second">Instance 2</p>'

      const wrapper1 = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: content1 }
      })

      const wrapper2 = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: content2 }
      })

      expect(wrapper1.find('.first').exists()).toBe(true)
      expect(wrapper2.find('.second').exists()).toBe(true)
    })

    it('does not cross-contaminate between instances', () => {
      const wrapper1 = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p class="a">A</p>' }
      })

      const wrapper2 = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p class="b">B</p>' }
      })

      expect(wrapper1.find('.a').exists()).toBe(true)
      expect(wrapper1.find('.b').exists()).toBe(false)
      expect(wrapper2.find('.a').exists()).toBe(false)
      expect(wrapper2.find('.b').exists()).toBe(true)
    })

    it('handles three simultaneous instances', () => {
      const wrappers = [
        shallowMount(KShadowFrame, {
          localVue,
          propsData: { content: '<p class="one">1</p>' }
        }),
        shallowMount(KShadowFrame, {
          localVue,
          propsData: { content: '<p class="two">2</p>' }
        }),
        shallowMount(KShadowFrame, {
          localVue,
          propsData: { content: '<p class="three">3</p>' }
        })
      ]

      expect(wrappers[0].find('.one').exists()).toBe(true)
      expect(wrappers[1].find('.two').exists()).toBe(true)
      expect(wrappers[2].find('.three').exists()).toBe(true)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('applies shadow frame class', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p>Test</p>' }
      })
      expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    })

    it('preserves custom classes in content', () => {
      const content = '<p class="custom-class">Custom</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.custom-class').exists()).toBe(true)
    })

    it('handles multiple classes in content elements', () => {
      const content = '<p class="class1 class2 class3">Multi-class</p>'
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content }
      })
      expect(wrapper.find('.class1.class2.class3').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p>Content</p>' }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p>Content</p>' }
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('updates on prop change', async () => {
      const wrapper = shallowMount(KShadowFrame, {
        localVue,
        propsData: { content: '<p class="v1">Version 1</p>' }
      })
      expect(wrapper.find('.v1').exists()).toBe(true)

      await wrapper.setProps({ content: '<p class="v2">Version 2</p>' })
      expect(wrapper.find('.v2').exists()).toBe(true)
    })
  })
})
