import { shallowMount } from '@vue/test-utils'
import InputDuration from '@/components/Common/Inputs/InputDuration.vue'

describe('InputDuration.vue (extra branch coverage)', () => {
  describe('handleDurationChange', () => {
    it('resets ref when value does not match 1-3 digit pattern', () => {
      const wrapper = shallowMount(InputDuration, {
        propsData: { value: '30' },
        stubs: { 'form-group': true, 'v-text-field': true }
      })
      const mockRef = { initialValue: '30', lazyValue: '30' }
      wrapper.vm.$refs.refDurationTextField = mockRef

      InputDuration.methods.handleDurationChange.call(wrapper.vm, '1234')

      expect(wrapper.emitted('input')).toBeFalsy()
      expect(mockRef.initialValue).toBe('1234')
      expect(mockRef.lazyValue).toBe('1234')
    })

    it('resets ref when value contains non-digits', () => {
      const wrapper = shallowMount(InputDuration, {
        propsData: { value: '30' },
        stubs: { 'form-group': true, 'v-text-field': true }
      })
      const mockRef = { initialValue: '30', lazyValue: '30' }
      wrapper.vm.$refs.refDurationTextField = mockRef

      InputDuration.methods.handleDurationChange.call(wrapper.vm, '12a')

      expect(wrapper.emitted('input')).toBeFalsy()
    })

    it('emits when value is empty', () => {
      const emit = jest.fn()
      const ctx = { $emit: emit }
      InputDuration.methods.handleDurationChange.call(ctx, '')
      expect(emit).toHaveBeenCalledWith('input', '')
    })

    it('emits when value matches 1-3 digit pattern', () => {
      const emit = jest.fn()
      const ctx = { $emit: emit }
      InputDuration.methods.handleDurationChange.call(ctx, '99')
      expect(emit).toHaveBeenCalledWith('input', '99')
    })
  })

  describe('isCallback watcher', () => {
    it('does not add range rule when isCallback is false', () => {
      const wrapper = shallowMount(InputDuration, {
        propsData: { isCallback: false },
        stubs: { 'form-group': true, 'v-text-field': true }
      })
      expect(wrapper.vm.rules.length).toBe(2)
    })
  })
})
