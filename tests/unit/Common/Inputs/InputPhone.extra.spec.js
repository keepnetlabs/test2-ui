import { shallowMount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone.vue'
import labels from '@/model/constants/labels'

describe('InputPhone.vue (extra branch coverage)', () => {
  it('getErrorText returns InvalidPhoneNumber when value exists and invalid', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+44123' }
    })
    wrapper.vm.isPhoneNumberValid = false
    expect(wrapper.vm.getErrorText).toBe(labels.InvalidPhoneNumber)
  })

  it('getErrorText returns empty string when not required and no value', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { required: false, value: '' }
    })
    wrapper.vm.isPhoneNumberValid = false
    expect(wrapper.vm.getErrorText).toBe('')
  })

  it('setOldValueBySplitter uses splitted value when this.value is empty', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    wrapper.vm.$refs.refTelInput = { phone: '' }
    wrapper.vm.setOldValueBySplitter('+', '+44+1234567890')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  it('validatePhoneNumber sets isPhoneNumberValid false on catch', async () => {
    const wrapper = shallowMount(InputPhone)
    wrapper.vm.$refs.refTelInput = {
      get phoneObject() {
        throw new Error('test')
      }
    }
    wrapper.vm.validatePhoneNumber()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isPhoneNumberValid).toBe(false)
  })

  it('handleTelChange with split plus: setOldValueBySplitter when multiple plus signs', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'GB' },
      phone: '+44'
    }
    wrapper.vm.handleTelChange('+44+55+123')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  it('handleTelChange with hyphen: setOldValueBySplitter for GB region', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'GB' },
      phone: '+44'
    }
    wrapper.vm.handleTelChange('+44-1234-567890')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('handleTelChange too-long: different regionCode emits newVal', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+441234567890' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'US', possibility: 'too-long' },
      phone: '+441234567890',
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = '+441234567890'
    wrapper.vm.handleTelChange('+44123456789012345')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('+44123456789012345')
  })

  it('handleTelChange too-long: same regionCode reverts to value', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+441234567890' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'GB', possibility: 'too-long' },
      phone: '+441234567890',
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = '+441234567890'
    wrapper.vm.handleTelChange('+44123456789012345')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('+441234567890')
  })

  it('handleTelChange China 17-char: setValueSubStr when newVal[4] !== 1', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    const val17 = '+8612345678901234'
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'CN' },
      phone: val17,
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = val17
    wrapper.vm.handleTelChange(val17)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toHaveLength(16)
  })

  it('handleTelChange Poland 16-char: setValueSubStr', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    const val16 = '+481234567890123'
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'PL' },
      phone: val16,
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = val16
    wrapper.vm.handleTelChange(val16)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toHaveLength(15)
  })

  it('handleTelChange Sweden 17-char: setValueSubStr', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    const val17 = '+4612345678901234'
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'SE' },
      phone: val17,
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = val17
    wrapper.vm.handleTelChange(val17)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toHaveLength(16)
  })
})
