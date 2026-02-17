import { createLocalVue, shallowMount } from '@vue/test-utils'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'

describe('FormGroupHorizontalContent.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(FormGroupHorizontalContent, {
      localVue,
      propsData
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('FormGroupHorizontalContent')
  })

  it('renders label prop', () => {
    const wrapper = mountComponent({ label: 'Test Label' })
    expect(wrapper.text()).toContain('Test Label')
  })
})
