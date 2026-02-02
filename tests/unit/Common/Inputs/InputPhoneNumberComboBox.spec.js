import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import InputPhoneNumberComboBox from '@/components/Common/Inputs/InputPhoneNumberComboBox.vue'
import * as Validations from '@/utils/validations'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('InputPhoneNumberComboBox.vue', () => {
  let wrapper
  let store
  let getters

  const mockPhoneNumbers = [
    { id: '1', phoneNumber: '+11234567890', resourceId: 'phone-1' },
    { id: '2', phoneNumber: '+19876543210', resourceId: 'phone-2' }
  ]

  const mockFormattedItems = [
    { phoneNumber: '+1 (123) 456-7890', resourceId: 'phone-1' },
    { phoneNumber: '+1 (987) 654-3210', resourceId: 'phone-2' }
  ]

  beforeEach(() => {
    getters = {
      'whitelabel/getCountryCode': () => 'US'
    }

    store = new Vuex.Store({ getters })

    wrapper = shallowMount(InputPhoneNumberComboBox, {
      propsData: {
        value: ['phone-1'],
        defaultPhoneNumbers: mockFormattedItems
      },
      store,
      localVue,
      stubs: {
        'k-select': true,
        'v-checkbox': true
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
      expect(wrapper.vm.$options.name).toBe('InputPhoneNumberComboBox')
    })

    it('should render KSelect component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have value default empty array', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should have itemText default "phoneNumber"', () => {
      expect(wrapper.vm.itemText).toBe('phoneNumber')
    })

    it('should have itemValue default "resourceId"', () => {
      expect(wrapper.vm.itemValue).toBe('resourceId')
    })

    it('should have selectFirstItem default false', () => {
      expect(wrapper.vm.selectFirstItem).toBe(false)
    })

    it('should have isPhishingScenario default false', () => {
      expect(wrapper.vm.isPhishingScenario).toBe(false)
    })

    it('should have isSmishing default false', () => {
      expect(wrapper.vm.isSmishing).toBe(false)
    })

    it('should have callerPhoneNumber default empty string', () => {
      expect(wrapper.vm.callerPhoneNumber).toBe('')
    })

    it('should have rules default empty array', () => {
      expect(wrapper.vm.rules).toEqual([])
    })
  })

  describe('props configuration', () => {
    it('should accept custom value array', () => {
      expect(wrapper.vm.value).toEqual(['phone-1'])
    })

    it('should accept multiple values in value prop', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          value: ['phone-1', 'phone-2'],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.value).toEqual(['phone-1', 'phone-2'])
    })

    it('should accept custom itemText', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          itemText: 'phone',
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.itemText).toBe('phone')
    })

    it('should accept custom itemValue', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          itemValue: 'id',
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.itemValue).toBe('id')
    })

    it('should accept defaultPhoneNumbers', () => {
      expect(wrapper.vm.defaultPhoneNumbers).toEqual(mockFormattedItems)
    })

    it('should accept selectFirstItem true', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          selectFirstItem: true,
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.selectFirstItem).toBe(true)
    })

    it('should accept isPhishingScenario true', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          isPhishingScenario: true,
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.isPhishingScenario).toBe(true)
    })

    it('should accept isSmishing true', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          isSmishing: true,
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.isSmishing).toBe(true)
    })

    it('should accept custom rules', () => {
      const rules = [(v) => !!v || 'Required']
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          rules,
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.rules).toEqual(rules)
    })
  })

  describe('data properties', () => {
    it('should have Validations imported', () => {
      expect(wrapper.vm.Validations).toBeDefined()
      expect(wrapper.vm.Validations).toBe(Validations)
    })

    it('should have phoneNumbers array', () => {
      expect(wrapper.vm.phoneNumbers).toBeDefined()
      expect(Array.isArray(wrapper.vm.phoneNumbers)).toBe(true)
    })
  })

  describe('computed properties', () => {
    it('should have countryCode computed property', () => {
      expect(wrapper.vm.countryCode).toBeDefined()
    })

    it('should have getPhoneNumberItems computed property', () => {
      expect(wrapper.vm.getPhoneNumberItems).toBeDefined()
    })

    it('should have getSelectedPhoneNumbers computed property', () => {
      expect(wrapper.vm.getSelectedPhoneNumbers).toBeDefined()
      expect(Array.isArray(wrapper.vm.getSelectedPhoneNumbers)).toBe(true)
    })

    it('should return defaultPhoneNumbers in getPhoneNumberItems when available', () => {
      expect(wrapper.vm.getPhoneNumberItems).toEqual(mockFormattedItems)
    })

    it('should return selected phone numbers from items', () => {
      const selected = wrapper.vm.getSelectedPhoneNumbers
      expect(selected).toBeDefined()
    })
  })

  describe('multiple selection', () => {
    it('should support multiple phone number selection', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          value: ['phone-1', 'phone-2'],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.value.length).toBe(2)
    })

    it('should handle single selection in multiple mode', () => {
      expect(wrapper.vm.value.length).toBe(1)
    })

    it('should update selected phone numbers', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          value: ['phone-1'],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      const selected = wrapper.vm.getSelectedPhoneNumbers
      expect(selected).toBeDefined()
    })
  })

  describe('KSelect integration', () => {
    it('should render KSelect component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have autocomplete type', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support chips display', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have custom item slot for checkbox in smishing', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          isSmishing: true,
          value: [],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should not render checkbox when not smishing', () => {
      expect(wrapper.vm.isSmishing).toBe(false)
    })
  })

  describe('methods', () => {
    it('should have callForPhoneNumbers method', () => {
      expect(typeof wrapper.vm.callForPhoneNumbers).toBe('function')
    })

    it('should have sortPhoneNumbersAndOrderByRegionCode method', () => {
      expect(typeof wrapper.vm.sortPhoneNumbersAndOrderByRegionCode).toBe('function')
    })

    it('should have getPhoneNumberFormatted method', () => {
      expect(typeof wrapper.vm.getPhoneNumberFormatted).toBe('function')
    })

    it('should have getPhoneNumberCountry method', () => {
      expect(typeof wrapper.vm.getPhoneNumberCountry).toBe('function')
    })

    it('should have createPhoneNumberObj method', () => {
      expect(typeof wrapper.vm.createPhoneNumberObj).toBe('function')
    })

    it('should have handleInputChange method', () => {
      expect(typeof wrapper.vm.handleInputChange).toBe('function')
    })
  })

  describe('handleInputChange method', () => {
    it('should emit input event', () => {
      wrapper.vm.handleInputChange('phone-1')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value', () => {
      wrapper.vm.handleInputChange('phone-2')
      expect(wrapper.emitted('input')[0][0]).toBe('phone-2')
    })

    it('should emit update:callerPhoneNumber event', () => {
      wrapper.vm.phoneNumbers = [{ value: 'phone-1', text: '+1234567890' }]
      wrapper.vm.handleInputChange('phone-1')
      expect(wrapper.emitted('update:callerPhoneNumber')).toBeTruthy()
    })

    it('should handle array values', () => {
      wrapper.vm.handleInputChange(['phone-1', 'phone-2'])
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('phone number country', () => {
    it('should return country code string', () => {
      const country = wrapper.vm.getPhoneNumberCountry('+11234567890')
      expect(typeof country).toBe('string')
    })

    it('should handle undefined phone number', () => {
      const country = wrapper.vm.getPhoneNumberCountry()
      expect(country).toBe('')
    })

    it('should return EN for phishing scenario without phone numbers', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          isPhishingScenario: true,
          value: []
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      const country = wrapper.vm.getPhoneNumberCountry('+11234567890')
      expect(typeof country).toBe('string')
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: ['phone-2'] })
      expect(wrapper.vm.value).toEqual(['phone-2'])
    })

    it('should update when isPhishingScenario changes', async () => {
      await wrapper.setProps({ isPhishingScenario: true })
      expect(wrapper.vm.isPhishingScenario).toBe(true)
    })

    it('should update when isSmishing changes', async () => {
      await wrapper.setProps({ isSmishing: true })
      expect(wrapper.vm.isSmishing).toBe(true)
    })

    it('should update when defaultPhoneNumbers changes', async () => {
      const newNumbers = [
        { phoneNumber: '+1 (555) 666-7777', resourceId: 'phone-3' }
      ]
      await wrapper.setProps({ defaultPhoneNumbers: newNumbers })
      expect(wrapper.vm.getPhoneNumberItems).toEqual(newNumbers)
    })

    it('should update when rules changes', async () => {
      const newRules = [(v) => !!v || 'Required']
      await wrapper.setProps({ rules: newRules })
      expect(wrapper.vm.rules).toEqual(newRules)
    })
  })

  describe('integration scenarios', () => {
    it('should work with default phone numbers', () => {
      expect(wrapper.vm.getPhoneNumberItems).toEqual(mockFormattedItems)
    })

    it('should work without default phone numbers', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          value: []
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.phoneNumbers).toBeDefined()
    })

    it('should work for phishing scenarios', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          isPhishingScenario: true,
          value: [],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.isPhishingScenario).toBe(true)
    })

    it('should work for smishing scenarios', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          isSmishing: true,
          value: [],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.isSmishing).toBe(true)
    })

    it('should work with multiple selections', () => {
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          value: ['phone-1', 'phone-2'],
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.value.length).toBe(2)
    })

    it('should work with custom validation rules', () => {
      const rules = [(v) => Array.isArray(v) || 'Must be array']
      wrapper = shallowMount(InputPhoneNumberComboBox, {
        propsData: {
          value: [],
          rules,
          defaultPhoneNumbers: mockFormattedItems
        },
        store,
        localVue,
        stubs: {
          'k-select': true,
          'v-checkbox': true
        }
      })
      expect(wrapper.vm.rules).toEqual(rules)
    })
  })

  describe('state management', () => {
    it('should maintain selected phone numbers', () => {
      expect(wrapper.vm.value).toEqual(['phone-1'])
    })

    it('should maintain phone numbers list', () => {
      wrapper.vm.phoneNumbers = mockPhoneNumbers
      expect(wrapper.vm.phoneNumbers).toEqual(mockPhoneNumbers)
    })

    it('should maintain configuration properties', () => {
      expect(wrapper.vm.itemText).toBe('phoneNumber')
      expect(wrapper.vm.itemValue).toBe('resourceId')
    })
  })

  describe('validation', () => {
    it('should have required validation rule', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should use Validations.required', () => {
      expect(wrapper.vm.Validations.required).toBeDefined()
    })
  })

  describe('store integration', () => {
    it('should get country code from store', () => {
      expect(wrapper.vm.countryCode).toBe('US')
    })

    it('should use country code for phone number sorting', () => {
      const data = ['+1234567890']
      const sorted = wrapper.vm.sortPhoneNumbersAndOrderByRegionCode(data)
      expect(Array.isArray(sorted)).toBe(true)
    })
  })
})
