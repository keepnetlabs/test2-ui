import { createLocalVue, shallowMount } from '@vue/test-utils'
import KContainer from '@/components/KContainer/KContainer.vue'
import Vuetify from 'vuetify'

describe('KContainer.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders correctly', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    expect(wrapper.find('.k-container').exists()).toBe(true)
    expect(wrapper.find('v-card-stub').exists()).toBe(true)
  })

  it('applies no-tab class when tabless prop is true', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: {
        tabless: true
      }
    })
    expect(wrapper.find('.k-container__no-tab').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      slots: {
        default: '<div class="test-content">Content</div>'
      }
    })
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  it('renders v-card component', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    expect(wrapper.find('v-card-stub').exists()).toBe(true)
  })

  it('has correct CSS class for container', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    const container = wrapper.find('.k-container')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('k-container')
  })

  it('applies tabless class correctly', () => {
    const wrapperWithTab = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: { tabless: false }
    })
    expect(wrapperWithTab.find('.k-container__no-tab').exists()).toBe(false)

    const wrapperTabless = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: { tabless: true }
    })
    expect(wrapperTabless.find('.k-container__no-tab').exists()).toBe(true)
  })

  it('handles multiple slot contents', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      slots: {
        default: '<div class="item-1">Item 1</div><div class="item-2">Item 2</div>'
      }
    })
    expect(wrapper.find('.item-1').exists()).toBe(true)
    expect(wrapper.find('.item-2').exists()).toBe(true)
  })
})
