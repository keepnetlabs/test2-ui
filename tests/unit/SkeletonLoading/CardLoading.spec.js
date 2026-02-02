import { createLocalVue, shallowMount } from '@vue/test-utils'
import CardLoading from '@/components/SkeletonLoading/CardLoading.vue'
import Vuetify from 'vuetify'

describe('CardLoading.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders correctly', () => {
    const wrapper = shallowMount(CardLoading, {
      localVue,
      vuetify
    })
    expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
  })

  it('passes loading prop', () => {
    const wrapper = shallowMount(CardLoading, {
      localVue,
      vuetify,
      propsData: {
        loading: true
      }
    })
    expect(wrapper.find('v-skeleton-loader-stub').props('loading')).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = shallowMount(CardLoading, {
      localVue,
      vuetify,
      slots: {
        'skeleton-content': '<div class="test-slot">Slot Content</div>'
      }
    })
    expect(wrapper.find('.test-slot').exists()).toBe(true)
  })

  it('has boilerplate attribute in attrs', () => {
    const wrapper = shallowMount(CardLoading, {
      localVue,
      vuetify,
      propsData: {
        loading: true
      }
    })
    
    expect(wrapper.vm.attrs.boilerplate).toBe(false)
  })

  it('handles loading state transitions', async () => {
    const wrapper = shallowMount(CardLoading, {
      localVue,
      vuetify,
      propsData: {
        loading: true
      }
    })
    
    expect(wrapper.find('v-skeleton-loader-stub').props('loading')).toBe(true)
    
    await wrapper.setProps({ loading: false })
    
    expect(wrapper.find('v-skeleton-loader-stub').props('loading')).toBe(false)
  })

  it('uses default type attribute', () => {
    const wrapper = shallowMount(CardLoading, {
      localVue,
      vuetify
    })
    
    // Type is hard-coded in template, check attributes instead
    const skeleton = wrapper.find('v-skeleton-loader-stub')
    expect(skeleton.exists()).toBe(true)
    expect(skeleton.attributes('type')).toContain('article')
  })
})
