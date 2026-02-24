import { shallowMount } from '@vue/test-utils'
import InputDescription from '@/components/Common/Inputs/InputDescription.vue'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  Description: 'Description',
  CannotStartWithSpace: 'Cannot start with space',
  RequiredStar: '*Required',
  EnterDescription: 'Enter description',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} cannot exceed ${length} characters`)
}))

describe('InputDescription.vue (extra branch coverage)', () => {
  it('created uses hint when required and hint provided', () => {
    const wrapper = shallowMount(InputDescription, {
      propsData: { required: true, hint: 'Custom required hint' }
    })
    expect(wrapper.vm.requiredProps.hint).toBe('Custom required hint')
  })

  it('created uses RequiredStar when required and hint not provided', () => {
    const wrapper = shallowMount(InputDescription, {
      propsData: { required: true }
    })
    expect(wrapper.vm.requiredProps.hint).toBe(labels.RequiredStar)
  })

  it('created uses initialPlaceholder when provided', () => {
    const wrapper = shallowMount(InputDescription, {
      propsData: { initialPlaceholder: 'Describe here' }
    })
    expect(wrapper.vm.placeholder).toBe('Describe here')
  })

  it('created uses EnterDescription when initialPlaceholder not provided', () => {
    const wrapper = shallowMount(InputDescription)
    expect(wrapper.vm.placeholder).toBe(labels.EnterDescription)
  })

  it('created clears rules when applyRules is false', () => {
    const wrapper = shallowMount(InputDescription, {
      propsData: { applyRules: false, initialRules: [(v) => true], required: false }
    })
    expect(wrapper.vm.rules).toEqual([])
  })

  it('required watcher does not add required rule when val is false', async () => {
    const wrapper = shallowMount(InputDescription, {
      propsData: { required: false }
    })
    const initialRulesLength = wrapper.vm.rules.length
    await wrapper.setProps({ required: false })
    const watchHandler = wrapper.vm.$options.watch?.required
    const handler = typeof watchHandler === 'function' ? watchHandler : watchHandler?.handler
    if (handler) handler.call(wrapper.vm, false)
    expect(wrapper.vm.rules.length).toBe(initialRulesLength)
  })

  it('required watcher adds required rule when val is true', async () => {
    const wrapper = shallowMount(InputDescription, {
      propsData: { required: false }
    })
    const watchHandler = wrapper.vm.$options.watch?.required
    const handler = typeof watchHandler === 'function' ? watchHandler : watchHandler?.handler
    if (handler) handler.call(wrapper.vm, true)
    expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    expect(wrapper.vm.requiredProps.hint).toBe(labels.RequiredStar)
  })
})
