import { shallowMount } from '@vue/test-utils'
import InputNumber from '@/components/Common/Inputs/InputNumber.vue'

describe('InputNumber.vue (extra branch coverage)', () => {
  it('sets placeholder to "Enter undefined name" when both initialPlaceholder and entityName are empty/undefined', () => {
    const wrapper = shallowMount(InputNumber, {
      propsData: { required: false }
    })
    expect(wrapper.vm.placeholder).toBe('Enter undefined name')
  })

  it('uses this.rules when applyRules is true and initialRules is undefined', () => {
    const wrapper = shallowMount(InputNumber, {
      propsData: { required: true, applyRules: true }
    })
    expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    expect(wrapper.vm.rules[0]).toBeInstanceOf(Function)
  })

  it('handleInputChange emits when value is empty string', () => {
    const wrapper = shallowMount(InputNumber)
    wrapper.vm.handleInputChange('')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  it('handleInputChange resets ref when pattern fails and value is undefined', () => {
    const wrapper = shallowMount(InputNumber, {
      propsData: { value: undefined }
    })
    wrapper.vm.$refs.refInputNumber = { initialValue: undefined, lazyValue: undefined }
    wrapper.vm.handleInputChange('abc')
    expect(wrapper.vm.$refs.refInputNumber.initialValue).toBeUndefined()
    expect(wrapper.vm.$refs.refInputNumber.lazyValue).toBeUndefined()
  })
})
