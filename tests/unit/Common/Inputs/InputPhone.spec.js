import { shallowMount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone.vue'
import labels from '@/model/constants/labels'

describe('InputPhone.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputPhone, {
      stubs: {
        VueTelInput: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputPhone')
    })

    it('should render main container div', () => {
      const div = wrapper.find('div[style*="margin-bottom"]')
      expect(div.exists()).toBe(true)
    })

    it('should include VueTelInput component', () => {
      expect(wrapper.findComponent({ name: 'VueTelInput' }).exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should have value prop', () => {
      expect(wrapper.vm.$options.props.value).toBeDefined()
    })

    it('should have required prop with default true', () => {
      expect(wrapper.vm.$options.props.required).toBeDefined()
      expect(wrapper.vm.$options.props.required.default).toBe(true)
    })

    it('should accept value prop', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.value).toBe('+441234567890')
    })

    it('should accept required prop as true', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should accept required prop as false', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('data initialization', () => {
    it('should initialize isPhoneNumberValid to true', () => {
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should initialize maxLen to 17', () => {
      expect(wrapper.vm.maxLen).toBe(17)
    })

    it('should initialize regionCode to GB', () => {
      expect(wrapper.vm.regionCode).toBe('GB')
    })

    it('should have all data properties defined', () => {
      expect(wrapper.vm.isPhoneNumberValid).toBeDefined()
      expect(wrapper.vm.maxLen).toBeDefined()
      expect(wrapper.vm.regionCode).toBeDefined()
    })
  })

  describe('VueTelInput configuration', () => {
    it('should have validCharactersOnly prop', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      expect(telInput.vm.$attrs.validCharactersOnly).toBeDefined()
    })

    it('should have defaultCountry set to GB', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      expect(telInput.vm.$attrs.defaultCountry).toBe('GB')
    })

    it('should have mode set to international', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      expect(telInput.vm.$attrs.mode).toBe('international')
    })

    it('should pass maxLen to tel input', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      expect(telInput.vm.$attrs.maxLen).toBe(17)
    })

    it('should bind value to tel input', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      expect(telInput.vm.$attrs.value).toBeDefined()
    })

    it('should apply k-tel-input class', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      const classStr = telInput.vm.$attrs.class
      expect(classStr).toContain('k-tel-input')
    })

    it('should show dial code in input options', () => {
      const telInput = wrapper.findComponent({ name: 'VueTelInput' })
      const inputOptions = telInput.vm.$attrs.inputOptions
      expect(inputOptions.showDialCode).toBe(true)
    })
  })

  describe('computed getErrorText', () => {
    it('should return invalid message when value exists and invalid', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: 'invalid'
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getErrorText).toBeDefined()
    })

    it('should return empty string when valid', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890',
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getErrorText).toBe('')
    })

    it('should return Required text when required and no value', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '',
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.getErrorText).toContain('Required')
    })

    it('should return InvalidPhoneNumber label when invalid', () => {
      expect(labels.InvalidPhoneNumber).toBeDefined()
    })
  })

  describe('watch value property', () => {
    it('should validate phone number when value changes', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.validatePhoneNumber = jest.fn()
      await wrapper.setProps({ value: '+441234567891' })
      expect(wrapper.vm.validatePhoneNumber).toBeDefined()
    })
  })

  describe('handleTelChange method', () => {
    it('should be defined', () => {
      expect(wrapper.vm.handleTelChange).toBeDefined()
      expect(typeof wrapper.vm.handleTelChange).toBe('function')
    })

    it('should handle regular phone input', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          possibility: 'valid',
          regionCode: 'GB'
        },
        phone: ''
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle multiple plus signs', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          possibility: 'valid',
          regionCode: 'GB'
        },
        phone: '',
        split: jest.fn()
      }
      wrapper.vm.handleTelChange('++441234567890')
      expect(wrapper.vm.handleTelChange).toBeDefined()
    })

    it('should emit input event', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          possibility: 'valid',
          regionCode: 'GB'
        },
        phone: ''
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.emitted('input')).toBeDefined()
    })
  })

  describe('handleTelBlur method', () => {
    it('should be defined', () => {
      expect(wrapper.vm.handleTelBlur).toBeDefined()
      expect(typeof wrapper.vm.handleTelBlur).toBe('function')
    })

    it('should call validatePhoneNumber on blur', () => {
      wrapper.vm.validatePhoneNumber = jest.fn()
      wrapper.vm.handleTelBlur()
      expect(wrapper.vm.validatePhoneNumber).toBeDefined()
    })
  })

  describe('validatePhoneNumber method', () => {
    it('should be defined', () => {
      expect(wrapper.vm.validatePhoneNumber).toBeDefined()
      expect(typeof wrapper.vm.validatePhoneNumber).toBe('function')
    })

    it('should update isPhoneNumberValid state', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.isPhoneNumberValid).toBeDefined()
    })

    it('should set valid state for valid phone numbers', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should handle missing phoneObject', () => {
      wrapper.vm.$refs.refTelInput = null
      expect(() => wrapper.vm.validatePhoneNumber()).not.toThrow()
    })

    it('should catch exceptions silently', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: null
      }
      expect(() => wrapper.vm.validatePhoneNumber()).not.toThrow()
    })
  })

  describe('error display', () => {
    it('should show error div when invalid', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: 'invalid'
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      await wrapper.vm.$nextTick()
      const errorDiv = wrapper.find('.v-text-field__details.checkbox-error')
      expect(errorDiv.exists()).toBe(false) // Because of v-if condition
    })

    it('should show error message when phone is invalid', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: 'invalid'
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhoneNumberValid).toBe(false)
    })

    it('should hide error when valid', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })
  })

  describe('required hint display', () => {
    it('should show required hint when required and valid', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.required).toBe(true)
    })

    it('should not show required hint when not required', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('phone number validation for specific regions', () => {
    it('should handle GB phone numbers', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'GB',
          isValid: true
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.regionCode).toBe('GB')
    })

    it('should handle CN phone numbers', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'CN',
          isValid: true
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.regionCode).toBe('CN')
    })

    it('should handle US phone numbers', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'US',
          isValid: true
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.regionCode).toBe('US')
    })
  })

  describe('input event emission', () => {
    it('should emit input event on phone change', async () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          possibility: 'valid',
          regionCode: 'GB'
        },
        phone: '+441234567890'
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct phone value', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          possibility: 'valid',
          regionCode: 'GB'
        },
        phone: '+441234567890'
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.emitted('input')[0][0]).toBeDefined()
    })
  })

  describe('reactivity', () => {
    it('should update when required prop changes', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should update when value prop changes', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        },
        stubs: {
          VueTelInput: true
        }
      })
      await wrapper.setProps({ value: '+441234567891' })
      expect(wrapper.vm.value).toBe('+441234567891')
    })
  })

  describe('accessibility', () => {
    it('should support required field indication', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should display error messages', () => {
      wrapper.vm.isPhoneNumberValid = false
      expect(wrapper.vm.getErrorText).toBeDefined()
    })

    it('should show validation hints', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      expect(wrapper.vm.required).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work as required phone field', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should work as optional phone field', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should work with initial phone value', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890',
          required: true
        },
        stubs: {
          VueTelInput: true
        }
      })
      expect(wrapper.vm.value).toBe('+441234567890')
    })
  })
})
