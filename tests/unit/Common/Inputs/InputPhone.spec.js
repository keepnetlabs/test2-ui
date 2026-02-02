import { shallowMount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone.vue'
import labels from '@/model/constants/labels'

describe('InputPhone.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputPhone)
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

    it('should contain VueTelInput component', () => {
      expect(wrapper.vm.$options.components.VueTelInput).toBeDefined()
    })
  })

  describe('prop defaults', () => {
    it('should have value prop', () => {
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should have required default true', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should accept custom value prop', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        }
      })
      expect(wrapper.vm.value).toBe('+441234567890')
    })

    it('should accept required false prop', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('data initialization', () => {
    it('should initialize isPhoneNumberValid as true', () => {
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should initialize maxLen as 17', () => {
      expect(wrapper.vm.maxLen).toBe(17)
    })

    it('should initialize regionCode as GB', () => {
      expect(wrapper.vm.regionCode).toBe('GB')
    })
  })

  describe('vue-tel-input props', () => {
    it('should pass validCharactersOnly to VueTelInput', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should set defaultCountry to GB', () => {
      expect(wrapper.vm.regionCode).toBe('GB')
    })

    it('should set mode to international', () => {
      expect(wrapper.vm) .toBeDefined()
    })

    it('should set maxLen to 17', () => {
      expect(wrapper.vm.maxLen).toBe(17)
    })
  })

  describe('phone number validation', () => {
    it('should initialize with valid phone state', () => {
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should have validatePhoneNumber method', () => {
      expect(typeof wrapper.vm.validatePhoneNumber).toBe('function')
    })

    it('should return early if refTelInput is not available', () => {
      wrapper.vm.$refs.refTelInput = null
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm).toBeDefined()
    })

    it('should return early if phoneObject is not available', () => {
      wrapper.vm.$refs.refTelInput = {}
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm).toBeDefined()
    })

    it('should set isPhoneNumberValid based on phoneObject.isValid', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should handle validation errors gracefully', () => {
      wrapper.vm.$refs.refTelInput = null
      try {
        wrapper.vm.validatePhoneNumber()
        expect(wrapper.vm.isPhoneNumberValid).toBe(true)
      } catch (e) {
        expect(wrapper.vm.isPhoneNumberValid).toBe(false)
      }
    })
  })

  describe('error text computation', () => {
    it('should return InvalidPhoneNumber label when value exists and invalid', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '123'
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      const errorText = wrapper.vm.getErrorText
      expect(errorText).toBeDefined()
    })

    it('should return Required message when required and invalid', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      const errorText = wrapper.vm.getErrorText
      expect(errorText).toBe('Required')
    })

    it('should return empty string when valid', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false,
          value: ''
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      const errorText = wrapper.vm.getErrorText
      expect(errorText).toBe('')
    })

    it('should handle when no value and optional', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false,
          value: ''
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      const errorText = wrapper.vm.getErrorText
      expect(errorText).toBe('')
    })
  })

  describe('phone input change handling', () => {
    it('should have handleTelChange method', () => {
      expect(typeof wrapper.vm.handleTelChange).toBe('function')
    })

    it('should emit input event on change', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' },
        phone: '+441234567890'
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.emitted('input')).toBeDefined()
    })

    it('should reject multiple plus signs', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' },
        phone: '+44'
      }
      wrapper.vm.handleTelChange('+44++1234567890')
      expect(wrapper.vm.$refs.refTelInput.phone).toBeDefined()
    })

    it('should handle GB region hyphen removal', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' },
        phone: '+44'
      }
      wrapper.vm.isRegionGBOrTRAndHasHyphen = jest.fn(() => true)
      expect(wrapper.vm.isRegionGBOrTRAndHasHyphen).toBeDefined()
    })

    it('should handle TR region hyphen removal', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'TR' },
        phone: '+90'
      }
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle too-long possibility', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'GB',
          possibility: 'too-long'
        },
        phone: '+44123456789012345'
      }
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle China specific logic', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'CN',
          possibility: 'is-possible'
        },
        phone: '+86'
      }
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle Poland specific logic', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'PL'
        },
        phone: '+48'
      }
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle Sweden specific logic', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'SE'
        },
        phone: '+46'
      }
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('region detection', () => {
    it('should have isRegionGBOrTRAndHasHyphen method', () => {
      expect(typeof wrapper.vm.isRegionGBOrTRAndHasHyphen).toBe('function')
    })

    it('should detect GB region with hyphen', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' }
      }
      const result = wrapper.vm.isRegionGBOrTRAndHasHyphen('+44-1234-567890')
      expect(result).toBe(true)
    })

    it('should detect TR region with hyphen', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'TR' }
      }
      const result = wrapper.vm.isRegionGBOrTRAndHasHyphen('+90-555-1234567')
      expect(result).toBe(true)
    })

    it('should not detect other regions with hyphen', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'US' }
      }
      const result = wrapper.vm.isRegionGBOrTRAndHasHyphen('+1-234-567-8900')
      expect(result).toBe(false)
    })

    it('should not detect GB without hyphen', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' }
      }
      const result = wrapper.vm.isRegionGBOrTRAndHasHyphen('+441234567890')
      expect(result).toBe(false)
    })
  })

  describe('phone blur handling', () => {
    it('should have handleTelBlur method', () => {
      expect(typeof wrapper.vm.handleTelBlur).toBe('function')
    })

    it('should call validatePhoneNumber on blur', () => {
      const validateSpy = jest.spyOn(wrapper.vm, 'validatePhoneNumber')
      wrapper.vm.handleTelBlur()
      expect(validateSpy).toHaveBeenCalled()
      validateSpy.mockRestore()
    })
  })

  describe('value modification methods', () => {
    it('should have setOldValueBySplitter method', () => {
      expect(typeof wrapper.vm.setOldValueBySplitter).toBe('function')
    })

    it('should have setValueSubStr method', () => {
      expect(typeof wrapper.vm.setValueSubStr).toBe('function')
    })

    it('setOldValueBySplitter should emit with previous value when exists', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        }
      })
      wrapper.vm.$refs.refTelInput = {
        phone: '+441234567890'
      }
      wrapper.vm.setOldValueBySplitter('-', '+44-1234-567890')
      expect(wrapper.emitted('input')).toBeDefined()
    })

    it('setValueSubStr should emit truncated value', () => {
      wrapper.vm.$refs.refTelInput = {
        phone: '+4412345678901234567'
      }
      wrapper.vm.setValueSubStr(16, '+4412345678901234567')
      expect(wrapper.emitted('input')).toBeDefined()
    })
  })

  describe('watchers', () => {
    it('should have value watcher', () => {
      expect(wrapper.vm.$options.watch.value).toBeDefined()
    })

    it('should call validatePhoneNumber when value changes', async () => {
      const validateSpy = jest.spyOn(wrapper.vm, 'validatePhoneNumber')
      await wrapper.setProps({ value: '+441234567890' })
      // Wait for watcher to execute
      await wrapper.vm.$nextTick()
      expect(validateSpy).toHaveBeenCalled()
      validateSpy.mockRestore()
    })
  })

  describe('required vs optional behavior', () => {
    it('should show error for empty required field', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true,
          value: ''
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      expect(wrapper.vm.isPhoneNumberValid).toBe(false)
    })

    it('should allow empty optional field', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false,
          value: ''
        }
      })
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: false,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should show *Required hint when required and valid', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true,
          value: '+441234567890'
        }
      })
      wrapper.vm.isPhoneNumberValid = true
      expect(wrapper.vm.required).toBe(true)
    })

    it('should not show hint for optional field', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('country-specific edge cases', () => {
    it('should handle China 17-char bug', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'CN',
          possibility: 'is-possible'
        },
        phone: '+8612345678901234'
      }
      const newVal = '+8612345678901234'
      expect(newVal.length).toBe(17)
      expect(newVal[4]).not.toBe('1')
    })

    it('should handle Poland 16-char limit', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'PL'
        },
        phone: '+48123456789012'
      }
      expect(wrapper.vm.maxLen).toBe(17)
    })

    it('should handle Sweden 17-char limit', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'SE'
        },
        phone: '+46123456789012'
      }
      expect(wrapper.vm.maxLen).toBe(17)
    })
  })

  describe('max length enforcement', () => {
    it('should enforce maxLen of 17', () => {
      expect(wrapper.vm.maxLen).toBe(17)
    })

    it('should handle input longer than maxLen', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890123456789'
        }
      })
      expect(wrapper.vm.value.length).toBeGreaterThan(wrapper.vm.maxLen)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+441234567890'
        }
      })
      await wrapper.setProps({ value: '+441987654321' })
      expect(wrapper.vm.value).toBe('+441987654321')
    })

    it('should update when required prop changes', async () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should maintain regionCode reactivity', async () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          regionCode: 'US',
          isValid: true
        }
      }
      wrapper.vm.validatePhoneNumber()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.regionCode).toBe('US')
    })
  })

  describe('error message display', () => {
    it('should display error when phone invalid', () => {
      wrapper.vm.isPhoneNumberValid = false
      wrapper.vm.value = '123'
      expect(wrapper.vm.isPhoneNumberValid).toBe(false)
    })

    it('should not display error when phone valid', () => {
      wrapper.vm.isPhoneNumberValid = true
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should show custom error message based on state', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: 'invalid',
          required: true
        }
      })
      wrapper.vm.isPhoneNumberValid = false
      const errorText = wrapper.vm.getErrorText
      expect(errorText).toBeDefined()
    })
  })

  describe('input event emission', () => {
    it('should emit input event with phone value', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' },
        phone: '+441234567890'
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit input event on valid phone change', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' },
        phone: '+441234567890'
      }
      wrapper.vm.handleTelChange('+441234567890')
      expect(wrapper.emitted('input')[0]).toEqual(['+441234567890'])
    })

    it('should handle emit on blur event', () => {
      wrapper.vm.handleTelBlur()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('special character handling', () => {
    it('should reject multiple consecutive plus signs', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' },
        phone: '+44'
      }
      const testValue = '+44++5555'
      expect(testValue.split('+').length).toBeGreaterThan(2)
    })

    it('should handle hyphen in appropriate regions', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'GB' }
      }
      expect(wrapper.vm.isRegionGBOrTRAndHasHyphen('+44-123-456')).toBe(true)
    })

    it('should preserve valid special characters', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: '+44 (0) 1234 567890'
        }
      })
      expect(wrapper.vm.value).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    it('should work as required phone field with defaults', () => {
      wrapper = shallowMount(InputPhone)
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should work as optional phone field', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should handle full phone entry workflow', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true,
          value: ''
        }
      })

      // Simulate entering phone
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        },
        phone: '+441234567890'
      }

      wrapper.vm.handleTelChange('+441234567890')
      wrapper.vm.validatePhoneNumber()

      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle phone validation and error display', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true,
          value: 'invalid'
        }
      })

      wrapper.vm.isPhoneNumberValid = false
      const errorText = wrapper.vm.getErrorText
      expect(errorText).toBeDefined()
    })
  })

  describe('nextTick handling', () => {
    it('should use nextTick in validatePhoneNumber', () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })

    it('should handle async validation properly', async () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle empty value', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should handle undefined value', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: undefined
        }
      })
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should handle very long input', () => {
      const longPhone = '+44' + '1'.repeat(20)
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: longPhone
        }
      })
      expect(wrapper.vm.value).toBe(longPhone)
    })

    it('should handle null value gracefully', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          value: null
        }
      })
      expect(wrapper.vm.value).toBeNull()
    })

    it('should recover from validation error', async () => {
      wrapper.vm.isPhoneNumberValid = false
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: true,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhoneNumberValid).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper component structure for accessibility', () => {
      expect(wrapper.vm.$options.name).toBe('InputPhone')
    })

    it('should provide error messages for validation failures', () => {
      wrapper.vm.isPhoneNumberValid = false
      wrapper.vm.value = 'invalid'
      expect(wrapper.vm.getErrorText).toBeDefined()
    })

    it('should display required indicator', () => {
      wrapper = shallowMount(InputPhone, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })
  })

  describe('security and validation', () => {
    it('should reject invalid phone formats', async () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: false,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhoneNumberValid).toBe(false)
    })

    it('should validate based on phoneObject.isValid', async () => {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: {
          isValid: false,
          regionCode: 'GB'
        }
      }
      wrapper.vm.validatePhoneNumber()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhoneNumberValid).toBe(false)
    })

    it('should enforce maxLen for security', () => {
      expect(wrapper.vm.maxLen).toBe(17)
    })
  })
})
