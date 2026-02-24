import { shallowMount } from '@vue/test-utils'
import ContentLanguageSelecItem from '@/components/AwarenessEducator/SendTraining/ContentLanguageSelecItem.vue'

describe('ContentLanguageSelecItem.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ContentLanguageSelecItem, {
      propsData: {
        item: { text: 'English' },
        isDisabled: false,
        isFirst: false,
        isSelected: false,
        ...propsData
      },
      stubs: { VCheckbox: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays item text', () => {
    const wrapper = createWrapper({ item: { text: 'Turkish' } })
    expect(wrapper.text()).toContain('Turkish')
  })

  it('getClasses includes first modifier when isFirst', () => {
    const wrapper = createWrapper({ isFirst: true })
    const classObj = wrapper.vm.getClasses[1]
    expect(classObj['mail-configuration-select-sources__item-container--first']).toBe(true)
  })

  it('getClasses includes disabled modifier when isDisabled', () => {
    const wrapper = createWrapper({ isDisabled: true })
    const classObj = wrapper.vm.getClasses[1]
    expect(classObj['mail-configuration-select-sources__item-container--disabled']).toBe(true)
  })

  it('getClasses has base class', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getClasses).toContain('mail-configuration-select-sources__item-container')
  })
})
