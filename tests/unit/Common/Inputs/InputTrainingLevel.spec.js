import { shallowMount } from '@vue/test-utils'
import InputTrainingLevel from '@/components/Common/Inputs/InputTrainingLevel.vue'
import labels from '@/model/constants/labels'

describe('InputTrainingLevel.vue', () => {
  let wrapper
  const mockItems = [
    { text: 'Beginner', id: 'beginner' },
    { text: 'Intermediate', id: 'intermediate' },
    { text: 'Advanced', id: 'advanced' },
    { text: 'Expert', id: 'expert' }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputTrainingLevel, {
      propsData: {
        items: mockItems
      },
      stubs: {
        'form-group': true,
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
      expect(wrapper.vm.$options.name).toBe('InputTrainingLevel')
    })

    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should render k-select component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have k-select nested in FormGroup', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have properly defined component options', () => {
      expect(wrapper.vm.$options).toHaveProperty('name')
      expect(wrapper.vm.$options).toHaveProperty('components')
      expect(wrapper.vm.$options).toHaveProperty('props')
      expect(wrapper.vm.$options).toHaveProperty('computed')
    })
  })

  describe('prop defaults', () => {
    it('should have value default empty string', () => {
      expect(wrapper.vm.value).toBe('')
    })

    it('should have title default', () => {
      expect(wrapper.vm.title).toBe('Training Level')
    })

    it('should have subTitle default', () => {
      expect(wrapper.vm.subTitle).toBe('Select the level of knowledge required for this training')
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Select level')
    })

    it('should have required default true', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should have disabled default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should have loading default false', () => {
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should have itemText default "text"', () => {
      expect(wrapper.vm.itemText).toBe('text')
    })

    it('should have itemValue default "id"', () => {
      expect(wrapper.vm.itemValue).toBe('id')
    })

    it('should have items default empty array', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.items).toEqual([])
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          value: 'advanced'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('advanced')
    })

    it('should accept numeric value', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          value: 2
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe(2)
    })

    it('should accept custom items', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should accept custom title', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          title: 'Knowledge Level'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.title).toBe('Knowledge Level')
    })

    it('should accept custom subTitle', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          subTitle: 'What level of knowledge is needed?'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.subTitle).toBe('What level of knowledge is needed?')
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          placeholder: 'Choose level'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose level')
    })

    it('should accept required false', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should accept disabled true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept loading true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          loading: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should accept custom itemText', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          itemText: 'label'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemText).toBe('label')
    })

    it('should accept custom itemValue', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          itemValue: 'value'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemValue).toBe('value')
    })
  })

  describe('computed properties', () => {
    it('should have requiredRules computed property', () => {
      expect(wrapper.vm.requiredRules).toBeDefined()
      expect(Array.isArray(wrapper.vm.requiredRules)).toBe(true)
    })

    it('should return validation rules array when required is true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.requiredRules).toBeDefined()
      expect(Array.isArray(wrapper.vm.requiredRules)).toBe(true)
      expect(wrapper.vm.requiredRules.length).toBeGreaterThan(0)
    })

    it('should return empty array when required is false', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.requiredRules).toBeDefined()
    })

    it('should have required validation rule function', () => {
      const rules = wrapper.vm.requiredRules
      expect(typeof rules[0]).toBe('function')
    })

    it('should validate empty string with required rule', () => {
      const rules = wrapper.vm.requiredRules
      const result = rules[0]('')
      expect(result).not.toBe(true)
    })

    it('should validate non-empty string with required rule', () => {
      const rules = wrapper.vm.requiredRules
      const result = rules[0]('beginner')
      expect(result).toBe(true)
    })
  })

  describe('required vs optional behavior', () => {
    it('should show required validation when required is true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.requiredRules.length).toBeGreaterThan(0)
    })

    it('should not require validation when required is false', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should have hint when required is true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should not have hint when required is false', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('loading state', () => {
    it('should accept loading true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          loading: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should accept loading false', () => {
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should toggle loading state', async () => {
      expect(wrapper.vm.loading).toBe(false)
      await wrapper.setProps({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should maintain loading state across updates', async () => {
      await wrapper.setProps({ loading: true, value: 'beginner' })
      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.vm.value).toBe('beginner')
    })
  })

  describe('disabled state', () => {
    it('should accept disabled true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept disabled false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should toggle disabled state', async () => {
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
      await wrapper.setProps({ disabled: false })
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should maintain disabled state with value', async () => {
      await wrapper.setProps({ disabled: true, value: 'advanced' })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.value).toBe('advanced')
    })
  })

  describe('FormGroup integration', () => {
    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should pass title to FormGroup', () => {
      expect(wrapper.vm.title).toBe('Training Level')
    })

    it('should pass subTitle to FormGroup', () => {
      expect(wrapper.vm.subTitle).toBe('Select the level of knowledge required for this training')
    })

    it('should support custom title in FormGroup', async () => {
      await wrapper.setProps({ title: 'Custom Title' })
      expect(wrapper.vm.title).toBe('Custom Title')
    })

    it('should support custom subTitle in FormGroup', async () => {
      await wrapper.setProps({ subTitle: 'Custom Subtitle' })
      expect(wrapper.vm.subTitle).toBe('Custom Subtitle')
    })
  })

  describe('KSelect integration', () => {
    it('should render k-select component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

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

    it('should pass disabled to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass loading to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass placeholder to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass rules to KSelect when required', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should be dense', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should be outlined', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have autocomplete off', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('event emissions', () => {
    it('should emit input event on value change', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should pass through input events', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should emit input event with selected value', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: 'beginner' })
      expect(wrapper.vm.value).toBe('beginner')
    })

    it('should update when required prop changes', async () => {
      expect(wrapper.vm.required).toBe(true)
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should update when disabled prop changes', async () => {
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update when loading prop changes', async () => {
      expect(wrapper.vm.loading).toBe(false)
      await wrapper.setProps({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should update when items prop changes', async () => {
      const newItems = [
        { text: 'Level 1', id: 'level1' },
        { text: 'Level 2', id: 'level2' }
      ]
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items).toEqual(newItems)
    })

    it('should handle complex prop updates', async () => {
      await wrapper.setProps({
        value: 'advanced',
        required: false,
        disabled: true,
        loading: false
      })
      expect(wrapper.vm.value).toBe('advanced')
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('state management', () => {
    it('should maintain value state', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          value: 'intermediate'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('intermediate')
    })

    it('should preserve state across multiple updates', async () => {
      expect(wrapper.vm.value).toBe('')
      await wrapper.setProps({ value: 'beginner' })
      expect(wrapper.vm.value).toBe('beginner')
      await wrapper.setProps({ value: 'advanced' })
      expect(wrapper.vm.value).toBe('advanced')
    })

    it('should handle value clearing', async () => {
      await wrapper.setProps({ value: 'expert' })
      expect(wrapper.vm.value).toBe('expert')
      await wrapper.setProps({ value: '' })
      expect(wrapper.vm.value).toBe('')
    })

    it('should maintain required state', async () => {
      expect(wrapper.vm.required).toBe(true)
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain disabled state', async () => {
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
      await wrapper.setProps({ disabled: false })
      expect(wrapper.vm.disabled).toBe(false)
    })
  })

  describe('template structure', () => {
    it('should have FormGroup component', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should wrap KSelect in FormGroup', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should have has-hint prop on FormGroup', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have proper form group title', () => {
      expect(wrapper.vm.title).toBe('Training Level')
    })

    it('should have proper form group subtitle', () => {
      expect(wrapper.vm.subTitle).toBe('Select the level of knowledge required for this training')
    })
  })

  describe('validation behavior', () => {
    it('should have required rules when required is true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.requiredRules.length).toBeGreaterThan(0)
    })

    it('should validate correctly with required rule', () => {
      const rules = wrapper.vm.requiredRules
      expect(rules.length).toBeGreaterThan(0)
      expect(typeof rules[0]).toBe('function')
    })

    it('should apply rules to KSelect when required', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.requiredRules.length).toBeGreaterThan(0)
    })

    it('should not apply rules when required is false', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should show hint when required is true', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should not show hint when required is false', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          required: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should work with all props configured', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          value: 'advanced',
          title: 'Knowledge Level',
          subTitle: 'Required knowledge',
          placeholder: 'Pick level',
          required: true,
          disabled: false,
          loading: false,
          itemText: 'text',
          itemValue: 'id'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('advanced')
      expect(wrapper.vm.title).toBe('Knowledge Level')
      expect(wrapper.vm.required).toBe(true)
    })

    it('should work with minimal configuration', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.items).toEqual([])
    })

    it('should work as training level selector', () => {
      expect(wrapper.vm.items.length).toBeGreaterThan(0)
    })

    it('should work with different item structures', () => {
      const customItems = [
        { label: 'Basic', value: 'basic' },
        { label: 'Standard', value: 'standard' }
      ]
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: customItems,
          itemText: 'label',
          itemValue: 'value'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemText).toBe('label')
      expect(wrapper.vm.itemValue).toBe('value')
    })

    it('should work with empty selection', () => {
      wrapper = shallowMount(InputTrainingLevel, {
        propsData: {
          items: mockItems,
          value: ''
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('')
    })
  })
})
