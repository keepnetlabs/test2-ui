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
})
