import { createLocalVue, shallowMount } from '@vue/test-utils'
import KButtonCheckbox from '@/components/Common/Checkbox/KButtonCheckbox.vue'
import Vuetify from 'vuetify'

describe('KButtonCheckbox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(KButtonCheckbox, {
      localVue,
      vuetify,
      propsData: {
        label: 'Test Label',
        value: false,
        ...propsData
      },
      stubs: {
        'v-btn': {
            template: '<button class="v-btn-mock" @click="$emit(\'click\')"><slot /></button>'
        },
        'v-icon': true
      }
    })
  }

  it('renders label', () => {
    const wrapper = mountComponent({ label: 'Check Me' })
    expect(wrapper.text()).toContain('Check Me')
  })

  it('emits toggled value on click', async () => {
    const wrapper = mountComponent({ value: false })
    await wrapper.find('.v-btn-mock').trigger('click')
    expect(wrapper.emitted('input')[0]).toEqual([true])
  })

  it('emits toggled value on click (from true to false)', async () => {
    const wrapper = mountComponent({ value: true })
    await wrapper.find('.v-btn-mock').trigger('click')
    expect(wrapper.emitted('input')[0]).toEqual([false])
  })

  it('applies custom styles', () => {
    const wrapper = mountComponent({ customStyle: 'color: red;' })
    expect(wrapper.find('.v-btn-mock').attributes('style')).toContain('color: red;')
  })
})
