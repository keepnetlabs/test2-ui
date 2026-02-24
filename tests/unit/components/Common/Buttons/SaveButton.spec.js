import { shallowMount } from '@vue/test-utils'
import SaveButton from '@/components/Common/Buttons/SaveButton.vue'

describe('SaveButton.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SaveButton, {
      propsData: { ...propsData }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('SaveButton')
  })

  it('uses default label from labels.Save', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.label).toBeDefined()
  })

  it('uses custom label when provided', () => {
    const wrapper = createWrapper({ label: 'Save Changes' })
    expect(wrapper.text()).toContain('Save Changes')
  })
})
