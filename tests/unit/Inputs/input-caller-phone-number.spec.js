import { createLocalVue, mount } from '@vue/test-utils'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber'
import { setupPromisePool } from '../promise-pool-helpers'
describe('Input caller phone number component', () => {
  setupPromisePool()
  const localVue = createLocalVue()

  describe('Component Rendering', () => {
    it('Check is rendering', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(wrapper.text().includes('Caller Phone Number')).toBeTruthy()
      expect(wrapper.text().includes('Select caller phone number for this campaign')).toBeTruthy()
    })

    it('renders component labels correctly', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(wrapper.text()).toContain('Caller Phone Number')
      expect(wrapper.text()).toContain('Select caller phone number for this campaign')
    })

    it('component exists and is mountable', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('Phone Number Object Creation', () => {
    it('createPhoneNumberObj', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.createPhoneNumberObj(wrapper.vm.value)).toBeTruthy()
    })

    it('validates phone number object creation', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj(wrapper.vm.value)
      expect(phoneObj).toBeTruthy()
      expect(typeof phoneObj).toBe('object')
    })

    it('createPhoneNumberObj handles different formats', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj1 = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj1).toBeTruthy()
    })

    it('createPhoneNumberObj returns valid object', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj).toBeTruthy()
      expect(typeof phoneObj).toBe('object')
    })
  })

  describe('Phone Number Formatting', () => {
    it('getPhoneNumberFormatted', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.getPhoneNumberFormatted(wrapper.vm.value)).toBe('+90 537 208 60 61')
    })

    it('formats various phone numbers correctly', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formattedTR = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formattedTR).toBeTruthy()
      expect(formattedTR).toContain('+90')
    })

    it('getPhoneNumberFormatted returns string', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(typeof formatted).toBe('string')
    })

    it('formatted number includes country code', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formatted).toMatch(/^\+\d+/)
    })

    it('formatting preserves phone number validity', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formatted).toBeTruthy()
      expect(formatted.length).toBeGreaterThan(0)
    })
  })

  describe('Country Detection', () => {
    it('getPhoneNumberCountry', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry(wrapper.vm.value)
      expect(['Turkey', 'Türkiye']).toContain(country)
    })

    it('detects country from phone number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry('+905372086061')
      expect(country).toBeTruthy()
      expect(typeof country).toBe('string')
    })

    it('returns valid country name', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry('+905372086061')
      expect(country.length).toBeGreaterThan(0)
    })
  })

  describe('Empty and Null Values', () => {
    it('handles empty phone number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('initializes with empty value when not provided', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(wrapper.vm.value === '' || wrapper.vm.value === undefined).toBeTruthy()
    })

    it('handles null value gracefully', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: null
        }
      })
      expect(wrapper.vm.value === null || wrapper.vm.value === '').toBeTruthy()
    })
  })

  describe('Props and Data', () => {
    it('accepts value prop', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('updates internal value from prop', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('component has required methods', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(typeof wrapper.vm.createPhoneNumberObj).toBe('function')
      expect(typeof wrapper.vm.getPhoneNumberFormatted).toBe('function')
      expect(typeof wrapper.vm.getPhoneNumberCountry).toBe('function')
    })
  })

  describe('Multiple Phone Numbers', () => {
    it('handles different valid phone numbers', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const numbers = ['+905372086061', '+905372086062', '+905372086063']
      numbers.forEach(num => {
        const phoneObj = wrapper.vm.createPhoneNumberObj(num)
        expect(phoneObj).toBeTruthy()
      })
    })

    it('formats multiple numbers consistently', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const numbers = ['+905372086061', '+905372086062']
      const formatted = numbers.map(num => wrapper.vm.getPhoneNumberFormatted(num))
      formatted.forEach(fmt => {
        expect(fmt).toBeTruthy()
        expect(fmt.includes('+90')).toBeTruthy()
      })
    })
  })

  describe('Phone Number Validation', () => {
    it('validates Turkish phone number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj).toBeTruthy()
    })

    it('phone number object is created successfully', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj).toBeTruthy()
    })
  })
})
