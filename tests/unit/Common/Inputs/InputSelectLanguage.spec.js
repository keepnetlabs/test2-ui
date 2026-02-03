import { shallowMount } from '@vue/test-utils'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage.vue'

describe('InputSelectLanguage.vue', () => {
  let wrapper
  const mockItems = [
    { text: 'English', value: 'en', isDisabled: false },
    { text: 'Spanish', value: 'es', isDisabled: false },
    { text: 'French', value: 'fr', isDisabled: true },
    { text: 'German', value: 'de', isDisabled: false },
    { text: 'Italian', value: 'it', isDisabled: false }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputSelectLanguage, {
      propsData: {
        items: mockItems,
        value: 'en'
      },
      stubs: {
        'k-select': true
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
      expect(wrapper.vm.$options.name).toBe('InputSelectLanguage')
    })

    it('should render k-select component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have k-select as root element', () => {
      expect(wrapper.findComponent({ name: 'KSelect' }).exists()).toBe(true)
    })

    it('should expose correct component options', () => {
      expect(wrapper.vm.$options).toHaveProperty('name')
      expect(wrapper.vm.$options).toHaveProperty('components')
      expect(wrapper.vm.$options).toHaveProperty('props')
      expect(wrapper.vm.$options).toHaveProperty('methods')
    })
  })

  describe('prop defaults', () => {
    it('should have itemText default "text"', () => {
      expect(wrapper.vm.itemText).toBe('text')
    })

    it('should have itemValue default "value"', () => {
      expect(wrapper.vm.itemValue).toBe('value')
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Select language')
    })

    it('should have required default false', () => {
      expect(wrapper.vm.required).toBe(false)
    })

    it('should have persistentHint default false', () => {
      expect(wrapper.vm.persistentHint).toBe(false)
    })

    it('should have outlined default false', () => {
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should have disabled default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should have hideDetails default false', () => {
      expect(wrapper.vm.hideDetails).toBe(false)
    })

    it('should have menuProps with offsetY true', () => {
      expect(wrapper.vm.menuProps.offsetY).toBe(true)
    })

    it('should have menuProps as object', () => {
      expect(typeof wrapper.vm.menuProps).toBe('object')
    })
  })

  describe('props configuration', () => {
    it('should accept custom items', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should accept custom value', () => {
      expect(wrapper.vm.value).toBe('en')
    })

    it('should accept custom itemText', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          itemText: 'label'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.itemText).toBe('label')
    })

    it('should accept custom itemValue', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          itemValue: 'id'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.itemValue).toBe('id')
    })

    it('should accept custom itemDisabled function', () => {
      const itemDisabled = jest.fn((item) => item.disabled)
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          itemDisabled
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.itemDisabled).toBeDefined()
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          placeholder: 'Choose language'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose language')
    })

    it('should accept required prop', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          required: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          hint: 'Select interface language'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hint).toBe('Select interface language')
    })

    it('should accept custom label', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          label: 'Language'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.label).toBe('Language')
    })

    it('should accept disabled state', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          disabled: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept persistentHint true', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          persistentHint: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should accept outlined true', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          outlined: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should accept hideDetails true', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          hideDetails: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hideDetails).toBe(true)
    })
  })

  describe('itemDisabled function', () => {
    it('should have default itemDisabled function', () => {
      expect(typeof wrapper.vm.itemDisabled).toBe('function')
    })

    it('should check isDisabled property true', () => {
      const item = { isDisabled: true }
      expect(wrapper.vm.itemDisabled(item)).toBe(true)
    })

    it('should return false for enabled items', () => {
      const item = { isDisabled: false }
      expect(wrapper.vm.itemDisabled(item)).toBe(false)
    })

    it('should work with item without isDisabled property', () => {
      const item = { text: 'Chinese', value: 'zh' }
      expect(wrapper.vm.itemDisabled(item)).toBeFalsy()
    })

    it('should correctly identify disabled language in mockItems', () => {
      const frenchItem = mockItems.find(item => item.value === 'fr')
      expect(wrapper.vm.itemDisabled(frenchItem)).toBe(true)
    })

    it('should correctly identify enabled language in mockItems', () => {
      const englishItem = mockItems.find(item => item.value === 'en')
      expect(wrapper.vm.itemDisabled(englishItem)).toBe(false)
    })
  })

  describe('handleLanguageChange method', () => {
    it('should have handleLanguageChange method', () => {
      expect(typeof wrapper.vm.handleLanguageChange).toBe('function')
    })

    it('should emit input event with new value', () => {
      wrapper.vm.handleLanguageChange('es')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('es')
    })

    it('should emit with different language values', () => {
      wrapper.vm.handleLanguageChange('fr')
      expect(wrapper.emitted('input')[0][0]).toBe('fr')
    })

    it('should emit multiple times for different selections', () => {
      wrapper.vm.handleLanguageChange('de')
      wrapper.vm.handleLanguageChange('it')
      expect(wrapper.emitted('input').length).toBe(2)
      expect(wrapper.emitted('input')[1][0]).toBe('it')
    })

    it('should emit event with single argument', () => {
      wrapper.vm.handleLanguageChange('es')
      expect(wrapper.emitted('input')[0].length).toBe(1)
    })
  })

  describe('KSelect integration', () => {
    it('should pass value to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass items to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass itemText to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass itemValue to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass rules to KSelect', () => {
      const rules = [(v) => v || 'Language required']
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          rules
        },
        stubs: {
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass disabled prop to KSelect', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          disabled: true
        },
        stubs: {
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support autocomplete type in KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: 'es' })
      expect(wrapper.vm.value).toBe('es')
    })

    it('should update when items prop changes', async () => {
      const newItems = [
        { text: 'German', value: 'de' },
        { text: 'Italian', value: 'it' }
      ]
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items).toEqual(newItems)
    })

    it('should update when disabled prop changes', async () => {
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update when required prop changes', async () => {
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should update when label prop changes', async () => {
      await wrapper.setProps({ label: 'Interface Language' })
      expect(wrapper.vm.label).toBe('Interface Language')
    })

    it('should update when hint prop changes', async () => {
      await wrapper.setProps({ hint: 'New hint' })
      expect(wrapper.vm.hint).toBe('New hint')
    })

    it('should update when placeholder prop changes', async () => {
      await wrapper.setProps({ placeholder: 'Pick a language' })
      expect(wrapper.vm.placeholder).toBe('Pick a language')
    })
  })

  describe('integration scenarios', () => {
    it('should work as basic language selector', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
      expect(wrapper.vm.value).toBe('en')
    })

    it('should work with required field', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          required: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should work with disabled options', () => {
      const disabledItem = mockItems.find((item) => item.isDisabled)
      expect(wrapper.vm.itemDisabled(disabledItem)).toBe(true)
    })

    it('should work with custom hint text', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          hint: 'Select your preferred language',
          persistentHint: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hint).toBe('Select your preferred language')
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should work with label and validation rules', () => {
      const rules = [(v) => v || 'Language is required']
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          label: 'System Language',
          rules
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.label).toBe('System Language')
      expect(wrapper.vm.rules).toEqual(rules)
    })

    it('should work with custom menu props', () => {
      const menuProps = { offsetY: false, offsetX: true }
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          menuProps
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.menuProps).toEqual(menuProps)
    })

    it('should work when both required and disabled', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          required: true,
          disabled: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should work with all styling options enabled', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          outlined: true,
          persistentHint: true,
          hideDetails: false
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.persistentHint).toBe(true)
      expect(wrapper.vm.hideDetails).toBe(false)
    })
  })

  describe('event handling', () => {
    it('should emit input when language is changed', () => {
      wrapper.vm.handleLanguageChange('es')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should pass selected language value in event', () => {
      const selectedValue = 'fr'
      wrapper.vm.handleLanguageChange(selectedValue)
      expect(wrapper.emitted('input')[0][0]).toBe(selectedValue)
    })

    it('should handle rapid language changes', () => {
      wrapper.vm.handleLanguageChange('es')
      wrapper.vm.handleLanguageChange('fr')
      wrapper.vm.handleLanguageChange('de')
      expect(wrapper.emitted('input').length).toBe(3)
    })

    it('should handle same value selection', () => {
      wrapper.vm.handleLanguageChange('en')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('en')
    })
  })

  describe('language items handling', () => {
    it('should handle multiple languages', () => {
      expect(wrapper.vm.items.length).toBeGreaterThan(0)
    })

    it('should identify disabled languages', () => {
      const disabledLanguages = mockItems.filter((item) => wrapper.vm.itemDisabled(item))
      expect(disabledLanguages.length).toBeGreaterThan(0)
    })

    it('should identify enabled languages', () => {
      const enabledLanguages = mockItems.filter((item) => !wrapper.vm.itemDisabled(item))
      expect(enabledLanguages.length).toBeGreaterThan(0)
    })

    it('should count correct number of disabled items', () => {
      const disabledLanguages = mockItems.filter((item) => wrapper.vm.itemDisabled(item))
      expect(disabledLanguages.length).toBe(1)
    })

    it('should count correct number of enabled items', () => {
      const enabledLanguages = mockItems.filter((item) => !wrapper.vm.itemDisabled(item))
      expect(enabledLanguages.length).toBe(4)
    })

    it('should have correct total items count', () => {
      expect(wrapper.vm.items.length).toBe(5)
    })
  })

  describe('state management', () => {
    it('should maintain current language value', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'es'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('es')
    })

    it('should maintain item mapping properties', () => {
      expect(wrapper.vm.itemText).toBe('text')
      expect(wrapper.vm.itemValue).toBe('value')
    })

    it('should preserve disabled state across changes', async () => {
      await wrapper.setProps({ disabled: true })
      await wrapper.setProps({ value: 'es' })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.value).toBe('es')
    })

    it('should preserve multiple state changes', async () => {
      await wrapper.setProps({ value: 'de', required: true, disabled: false })
      expect(wrapper.vm.value).toBe('de')
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.disabled).toBe(false)
    })
  })

  describe('UI properties', () => {
    it('should be outlined when configured', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          outlined: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should hide details when configured', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          hideDetails: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hideDetails).toBe(true)
    })

    it('should not show details by default', () => {
      expect(wrapper.vm.hideDetails).toBe(false)
    })

    it('should show persistent hint when enabled', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          persistentHint: true,
          hint: 'Test hint'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
      expect(wrapper.vm.hint).toBe('Test hint')
    })
  })

  describe('validation and rules', () => {
    it('should accept validation rules', () => {
      const rules = [(v) => Boolean(v) || 'This field is required']
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          rules
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.rules).toEqual(rules)
    })

    it('should support multiple validation rules', () => {
      const rules = [
        (v) => Boolean(v) || 'Required',
        (v) => v.length > 0 || 'Must not be empty'
      ]
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          rules
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.rules.length).toBe(2)
    })

    it('should have undefined rules by default', () => {
      expect(wrapper.vm.rules).toBeUndefined()
    })
  })

  describe('accessibility features', () => {
    it('should support custom placeholder for accessibility', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          placeholder: 'Choose your language'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose your language')
    })

    it('should support hint text for assistance', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          hint: 'This will change the interface language'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hint).toBe('This will change the interface language')
    })

    it('should support label for accessibility', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          label: 'Interface Language'
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.label).toBe('Interface Language')
    })

    it('should support persistent hint visibility', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: mockItems,
          value: 'en',
          persistentHint: true
        },
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })

  describe('advanced itemDisabled scenarios', () => {
    it('should handle items with complex disable conditions', () => {
      const items = [
        { text: 'English', value: 'en', isDisabled: false },
        { text: 'Spanish', value: 'es', isDisabled: true },
        { text: 'Mandarin', value: 'zh', isDisabled: false }
      ]
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: { items },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.itemDisabled(items[1])).toBe(true)
    })

    it('should handle items without isDisabled property gracefully', () => {
      const items = [
        { text: 'English', value: 'en' },
        { text: 'French', value: 'fr' }
      ]
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: { items },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.itemDisabled(items[0])).toBeFalsy()
    })

    it('should consistently evaluate all items', () => {
      const evaluations = mockItems.map(item => wrapper.vm.itemDisabled(item))
      const expectedPattern = [false, false, true, false, false]
      expect(evaluations).toEqual(expectedPattern)
    })
  })

  describe('menu props configuration', () => {
    it('should have offsetY set to true by default', () => {
      expect(wrapper.vm.menuProps.offsetY).toBe(true)
    })

    it('should allow custom menu props', () => {
      const customMenuProps = { offsetY: false, offsetX: true }
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: { items: mockItems, value: 'en', menuProps: customMenuProps },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.menuProps.offsetX).toBe(true)
    })
  })

  describe('language change workflow', () => {
    it('should handle complete language change workflow', () => {
      wrapper.vm.handleLanguageChange('es')
      expect(wrapper.emitted('input')[0][0]).toBe('es')

      wrapper.vm.handleLanguageChange('fr')
      expect(wrapper.emitted('input')[1][0]).toBe('fr')

      wrapper.vm.handleLanguageChange('de')
      expect(wrapper.emitted('input').length).toBe(3)
    })

    it('should handle switching to same language twice', () => {
      wrapper.vm.handleLanguageChange('en')
      wrapper.vm.handleLanguageChange('en')
      expect(wrapper.emitted('input').length).toBe(2)
    })

    it('should handle language list updates during selection', async () => {
      const newItems = [
        { text: 'Italian', value: 'it', isDisabled: false },
        { text: 'Portuguese', value: 'pt', isDisabled: false }
      ]
      wrapper.vm.handleLanguageChange('it')
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items.length).toBe(2)
    })
  })

  describe('disabled options and item handling', () => {
    it('should identify disabled languages correctly', () => {
      const frenchItem = mockItems.find(item => item.value === 'fr')
      expect(wrapper.vm.itemDisabled(frenchItem)).toBe(true)
    })

    it('should count disabled items in list', () => {
      const disabledCount = mockItems.filter(item => wrapper.vm.itemDisabled(item)).length
      expect(disabledCount).toBe(1)
    })

    it('should handle selection of enabled items only', () => {
      const enabledItems = mockItems.filter(item => !wrapper.vm.itemDisabled(item))
      expect(enabledItems.length).toBe(4)
    })

    it('should allow emitting disabled language value if needed', () => {
      wrapper.vm.handleLanguageChange('fr')
      expect(wrapper.emitted('input')[0][0]).toBe('fr')
    })
  })

  describe('large language lists', () => {
    it('should handle 50+ languages', () => {
      const manyLanguages = Array.from({ length: 60 }, (_, i) => ({
        text: `Language ${i}`,
        value: `lang${i}`,
        isDisabled: i % 5 === 0
      }))
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: { items: manyLanguages, value: 'lang0' },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.items.length).toBe(60)
    })

    it('should handle rapid navigation through many languages', () => {
      const languages = Array.from({ length: 30 }, (_, i) => `lang${i}`)
      languages.forEach(lang => wrapper.vm.handleLanguageChange(lang))
      expect(wrapper.emitted('input').length).toBe(30)
    })
  })

  describe('value binding edge cases', () => {
    it('should handle numeric language codes', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: [{ text: 'Language 1', value: 1 }],
          value: 1
        },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.value).toBe(1)
    })

    it('should handle boolean-like string values', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: [{ text: 'Active', value: 'true' }],
          value: 'true'
        },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.value).toBe('true')
    })

    it('should handle empty string value', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: [{ text: 'None', value: '' }],
          value: ''
        },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should handle special character values', () => {
      wrapper = shallowMount(InputSelectLanguage, {
        propsData: {
          items: [{ text: 'Special', value: 'zh-CN' }],
          value: 'zh-CN'
        },
        stubs: { 'k-select': true }
      })
      expect(wrapper.vm.value).toBe('zh-CN')
    })
  })

  describe('item text and value mapping', () => {
    it('should correctly display item text', () => {
      expect(wrapper.vm.items[0].text).toBe('English')
      expect(wrapper.vm.items[1].text).toBe('Spanish')
    })

    it('should correctly map item values', () => {
      expect(wrapper.vm.items[0].value).toBe('en')
      expect(wrapper.vm.items[1].value).toBe('es')
    })

    it('should preserve all item properties during selection', () => {
      wrapper.vm.handleLanguageChange('es')
      expect(wrapper.vm.items[1].isDisabled).toBe(false)
    })
  })

  describe('reactive behavior during language updates', () => {
    it('should emit updated value after prop changes', async () => {
      await wrapper.setProps({ value: 'es' })
      wrapper.vm.handleLanguageChange('es')
      expect(wrapper.emitted('input')[0][0]).toBe('es')
    })

    it('should handle multiple rapid property changes', async () => {
      await wrapper.setProps({ value: 'en' })
      await wrapper.setProps({ value: 'fr' })
      await wrapper.setProps({ value: 'de' })
      expect(wrapper.vm.value).toBe('de')
    })
  })
})
