import { createLocalVue, shallowMount } from '@vue/test-utils'
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup.vue'
import Vuetify from 'vuetify'

describe('KButtonRadioGroup.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(KButtonRadioGroup, {
      localVue,
      vuetify,
      propsData: {
        items: [
            { label: 'Option 1', infoText: 'Info 1' },
            { label: 'Option 2', infoText: 'Info 2' }
        ],
        ...propsData
      },
      stubs: {
        'v-btn': {
            template: '<button class="v-btn-stub" @click="$emit(\'click\')"><slot/></button>'
        },
        'v-icon': {
            template: '<span class="v-icon-stub"><slot/></span>'
        }
      }
    })
  }

  it('renders items correctly', () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAll('.v-btn-stub')
    expect(btns.length).toBe(2)
    expect(btns.at(0).text()).toContain('Option 1')
  })

  it('selects item on click', () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAll('.v-btn-stub')
    
    // Click second item
    btns.at(1).trigger('click')
    
    expect(wrapper.vm.selectedIndex).toBe(1)
    expect(wrapper.emitted('input')[0]).toEqual([1])
    expect(wrapper.emitted('on-item-click')[0]).toEqual([{ label: 'Option 2', infoText: 'Info 2' }])
  })

  it('updates selection when prop changes', async () => {
    const wrapper = mountComponent({ value: 0 })
    expect(wrapper.vm.selectedIndex).toBe(0)
    
    await wrapper.setProps({ value: 1 })
    expect(wrapper.vm.selectedIndex).toBe(1)
  })

  it('shows info text for selected item', async () => {
    const wrapper = mountComponent({ value: 0 })
    expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 1')
    
    await wrapper.setProps({ value: 1 })
    expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 2')
  })

  it('sets isSelected correctly', () => {
    const wrapper = mountComponent({ value: 1 })
    expect(wrapper.vm.isSelected(1)).toBe(true)
    expect(wrapper.vm.isSelected(0)).toBe(false)
  })
})
