import { createLocalVue, shallowMount } from '@vue/test-utils'
import KSelectLoading from '@/components/KSelectLoading.vue'

describe('KSelectLoading.vue', () => {
  const localVue = createLocalVue()

  it('renders correctly', () => {
    const wrapper = shallowMount(KSelectLoading, {
      localVue
    })
    expect(wrapper.find('.k-select-loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('has all required CSS classes', () => {
    const wrapper = shallowMount(KSelectLoading, {
      localVue
    })

    expect(wrapper.find('.k-select-loading').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__icon-container').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__tip-text').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__loading-tip-text').exists()).toBe(true)
  })

  it('has correct icon container structure', () => {
    const wrapper = shallowMount(KSelectLoading, {
      localVue
    })

    const iconContainer = wrapper.find('.vue-treeselect__icon-container')
    expect(iconContainer.exists()).toBe(true)

    const loaderSpan = iconContainer.find('.vue-treeselect__icon-loader')
    expect(loaderSpan.exists()).toBe(true)
  })

  it('displays loading text correctly', () => {
    const wrapper = shallowMount(KSelectLoading, {
      localVue
    })

    const textElement = wrapper.find('.vue-treeselect__tip-text')
    expect(textElement.exists()).toBe(true)
    expect(textElement.text()).toBe('Loading...')
  })
})
