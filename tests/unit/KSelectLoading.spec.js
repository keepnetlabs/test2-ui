import { shallowMount } from '@vue/test-utils'
import KSelectLoading from '@/components/KSelectLoading.vue'

describe('KSelectLoading.vue', () => {
  it('renders component and loading label', () => {
    const wrapper = shallowMount(KSelectLoading)
    expect(wrapper.vm.$options.name).toBe('KSelectLoading')
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders loader css classes', () => {
    const wrapper = shallowMount(KSelectLoading)
    expect(wrapper.find('.k-select-loading').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__icon-loader').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__loading-tip-text').exists()).toBe(true)
  })
})
