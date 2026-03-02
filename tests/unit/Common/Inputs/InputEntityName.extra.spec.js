import { shallowMount } from '@vue/test-utils'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  CannotStartWithSpace: 'Cannot start with space',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} max ${length}`)
}))

describe('InputEntityName.vue (extra branch coverage)', () => {
  it('applyRequiredProps sets requiredProps when required is true', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { required: true, entityName: 'template' }
    })
    expect(wrapper.vm.requiredProps).toMatchObject({
      hint: expect.any(String),
      persistentHint: true
    })
  })

  it('applyRequiredProps uses hint when provided and required', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { required: true, hint: 'Custom hint', entityName: 'item' }
    })
    expect(wrapper.vm.requiredProps.hint).toBe('Custom hint')
  })

  it('applyRequiredProps clears when required is false', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { required: false, entityName: 'item', initialRules: [] }
    })
    wrapper.vm.applyRequiredProps()
    expect(wrapper.vm.requiredProps).toEqual({})
  })

  it('placeholder uses initialPlaceholder when provided', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { initialPlaceholder: 'Type here', entityName: 'template' }
    })
    expect(wrapper.vm.placeholder).toBe('Type here')
  })

  it('placeholder uses entityName when initialPlaceholder not provided', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { entityName: 'campaign' }
    })
    expect(wrapper.vm.placeholder).toBe('Enter campaign name')
  })

  it('initialRules watcher updates rules when val provided', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { required: false, applyRules: true, entityName: 'x', initialRules: [] }
    })
    const customRule = (v) => v
    const watchHandler = wrapper.vm.$options.watch?.initialRules
    const handler = typeof watchHandler === 'function' ? watchHandler : watchHandler?.handler
    if (handler) handler.call(wrapper.vm, [customRule])
    expect(wrapper.vm.rules).toContain(customRule)
  })

  it('initialRules watcher sets empty when applyRules false', () => {
    const wrapper = shallowMount(InputEntityName, {
      propsData: { required: false, applyRules: false, entityName: 'x' }
    })
    const watchHandler = wrapper.vm.$options.watch?.initialRules
    const handler = typeof watchHandler === 'function' ? watchHandler : watchHandler?.handler
    if (handler) handler.call(wrapper.vm, [(v) => true])
    expect(wrapper.vm.rules).toEqual([])
  })
})
