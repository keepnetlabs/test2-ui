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
})
