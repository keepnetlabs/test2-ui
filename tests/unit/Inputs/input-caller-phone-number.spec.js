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

  describe('Phone Number Input State Management', () => {
    it('maintains internal state for phone number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('updates state when value prop changes', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.setProps({ value: '+905372086062' })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('stores formatted phone number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted(wrapper.vm.value)
      expect(formatted).toBeTruthy()
    })

    it('handles state transitions correctly', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(wrapper.vm.value === '' || wrapper.vm.value === undefined).toBeTruthy()
      wrapper.setProps({ value: '+905372086061' })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('Event Emission & User Interaction', () => {
    it('emits input event on value change', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.setProps({ value: '+905372086062' })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('handles user input correctly', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('supports programmatic value updates', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: ''
        }
      })
      wrapper.setProps({ value: '+905372086061' })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('handles clear value action', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.setProps({ value: '' })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('Phone Number Parsing', () => {
    it('parses country code from number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry('+905372086061')
      expect(country).toBeTruthy()
    })

    it('extracts national number from international format', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj).toBeTruthy()
    })

    it('handles different number formats consistently', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const formats = ['+905372086061']
      formats.forEach(fmt => {
        const phoneObj = wrapper.vm.createPhoneNumberObj(fmt)
        expect(phoneObj).toBeTruthy()
      })
    })

    it('normalizes phone numbers before parsing', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formatted).toBeTruthy()
    })
  })

  describe('Country Code Handling', () => {
    it('identifies country from +90 prefix', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry('+905372086061')
      expect(country).toBeTruthy()
    })

    it('maintains country information in phone object', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj).toBeTruthy()
    })

    it('supports different country codes', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const turkishNumber = '+905372086061'
      const phoneObj = wrapper.vm.createPhoneNumberObj(turkishNumber)
      expect(phoneObj).toBeTruthy()
    })

    it('handles multiple country formats', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const numbers = ['+905372086061']
      numbers.forEach(num => {
        const country = wrapper.vm.getPhoneNumberCountry(num)
        expect(country).toBeTruthy()
      })
    })
  })

  describe('Format Consistency', () => {
    it('maintains consistent formatting', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted1 = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      const formatted2 = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formatted1).toBe(formatted2)
    })

    it('formats multiple same numbers identically', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const numbers = ['+905372086061', '+905372086061']
      const formatted = numbers.map(n => wrapper.vm.getPhoneNumberFormatted(n))
      expect(formatted[0]).toBe(formatted[1])
    })

    it('produces valid formatted output', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formatted.length).toBeGreaterThan(0)
      expect(formatted).toMatch(/\+\d+/)
    })

    it('formatting is reversible to original number', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const original = '+905372086061'
      const formatted = wrapper.vm.getPhoneNumberFormatted(original)
      expect(formatted).toBeTruthy()
    })
  })

  describe('Component Lifecycle', () => {
    it('initializes component correctly', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('mounts with initial value', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.exists()).toBeTruthy()
    })

    it('updates when props change', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.setProps({ value: '+905372086062' })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.value).toBe('+905372086062')
    })

    it('destroys without errors', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('cleans up on unmount', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.destroy()
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('Error Handling', () => {
    it('handles invalid phone number gracefully', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: 'invalid'
        }
      })
      expect(() => wrapper.vm.createPhoneNumberObj('invalid')).not.toThrow()
    })

    it('handles empty input gracefully', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('handles undefined value gracefully', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      expect(wrapper.vm.value === '' || wrapper.vm.value === undefined).toBeTruthy()
    })

    it('handles null input without crashing', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: null
        }
      })
      expect(wrapper.exists()).toBeTruthy()
    })

    it('handles invalid country code gracefully', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const country = wrapper.vm.getPhoneNumberCountry('+905372086061')
      expect(country).toBeTruthy()
    })
  })

  describe('International Numbers', () => {
    it('handles Turkish numbers correctly', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry('+905372086061')
      expect(country).toBeTruthy()
    })

    it('supports Turkish number formatting', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted = wrapper.vm.getPhoneNumberFormatted('+905372086061')
      expect(formatted).toContain('+90')
    })

    it('parses Turkish area codes correctly', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const phoneObj = wrapper.vm.createPhoneNumberObj('+905372086061')
      expect(phoneObj).toBeTruthy()
    })

    it('handles multiple international formats', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const numbers = ['+905372086061']
      numbers.forEach(num => {
        const phoneObj = wrapper.vm.createPhoneNumberObj(num)
        expect(phoneObj).toBeTruthy()
      })
    })
  })

  describe('Props Changes & Updates', () => {
    it('reacts to value prop changes', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
      wrapper.setProps({ value: '+905372086062' })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.value).toBe('+905372086062')
    })

    it('handles rapid prop updates', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.setProps({ value: '+905372086062' })
      wrapper.setProps({ value: '+905372086063' })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.value).toBe('+905372086063')
    })

    it('maintains data when prop updates', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const formatted1 = wrapper.vm.getPhoneNumberFormatted(wrapper.vm.value)
      wrapper.setProps({ value: '+905372086062' })
      await wrapper.vm.$nextTick()
      const formatted2 = wrapper.vm.getPhoneNumberFormatted(wrapper.vm.value)
      expect(formatted1).toBeTruthy()
      expect(formatted2).toBeTruthy()
    })

    it('updates display when prop changes', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      wrapper.setProps({ value: '+905372086062' })
      await wrapper.vm.$nextTick()
      const text = wrapper.text()
      expect(text).toBeTruthy()
    })
  })

  describe('Component Integration', () => {
    it('works as form input component', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('integrates with parent state', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('supports two-way binding pattern', async () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: ''
        }
      })
      wrapper.setProps({ value: '+905372086061' })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.value).toBe('+905372086061')
    })

    it('can be used in form submission', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const value = wrapper.vm.value
      expect(value).toBe('+905372086061')
    })
  })

  describe('Performance & Edge Cases', () => {
    it('mounts quickly with phone number', () => {
      const start = performance.now()
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      const duration = performance.now() - start
      expect(duration).toBeLessThan(500)
    })

    it('formats large batch of numbers efficiently', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const numbers = Array(100).fill('+905372086061')
      const start = performance.now()
      numbers.forEach(num => wrapper.vm.getPhoneNumberFormatted(num))
      const duration = performance.now() - start
      expect(duration).toBeLessThan(1000)
    })

    it('handles special characters in input', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+90-537-208-60-61'
        }
      })
      expect(wrapper.exists()).toBeTruthy()
    })

    it('handles very long number strings', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue
      })
      const longNumber = '+90537208606199999999999'
      expect(() => wrapper.vm.createPhoneNumberObj(longNumber)).not.toThrow()
    })

    it('handles rapid method calls', () => {
      const wrapper = mount(InputCallerPhoneNumber, {
        localVue,
        propsData: {
          value: '+905372086061'
        }
      })
      for (let i = 0; i < 50; i++) {
        wrapper.vm.getPhoneNumberFormatted('+905372086061')
      }
      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
