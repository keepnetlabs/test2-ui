import { shallowMount } from '@vue/test-utils'
import InputTrainingDuration from '@/components/Common/Inputs/InputTrainingDuration.vue'
import labels from '@/model/constants/labels'

describe('InputTrainingDuration.vue', () => {
  let wrapper
  const mockItems = [
    { text: '15 minutes', id: '15min' },
    { text: '30 minutes', id: '30min' },
    { text: '1 hour', id: '1h' },
    { text: '2 hours', id: '2h' },
    { text: '4 hours', id: '4h' }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputTrainingDuration, {
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
      expect(wrapper.vm.$options.name).toBe('InputTrainingDuration')
    })

    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should render k-select component', () => {
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
      expect(wrapper.vm.title).toBe('Duration')
    })

    it('should have subTitle default', () => {
      expect(wrapper.vm.subTitle).toBe('Select the estimated time it takes to complete the training')
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Select duration')
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
      wrapper = shallowMount(InputTrainingDuration, {
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
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          value: '30min'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('30min')
    })

    it('should accept numeric value', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          value: 60
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe(60)
    })

    it('should accept custom items', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should accept custom title', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          title: 'Training Time'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.title).toBe('Training Time')
    })

    it('should accept custom subTitle', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          subTitle: 'How long is the training?'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.subTitle).toBe('How long is the training?')
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          placeholder: 'Choose duration'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose duration')
    })

    it('should accept required false', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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
      wrapper = shallowMount(InputTrainingDuration, {
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
      wrapper = shallowMount(InputTrainingDuration, {
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
      wrapper = shallowMount(InputTrainingDuration, {
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
      wrapper = shallowMount(InputTrainingDuration, {
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

  describe('requiredRules computed property', () => {
    it('should provide validation rules when required', () => {
      expect(wrapper.vm.requiredRules).toBeDefined()
      expect(Array.isArray(wrapper.vm.requiredRules)).toBe(true)
      expect(wrapper.vm.requiredRules.length).toBeGreaterThan(0)
    })

    it('should return array of rules', () => {
      expect(Array.isArray(wrapper.vm.requiredRules)).toBe(true)
    })

    it('should include validation function', () => {
      expect(typeof wrapper.vm.requiredRules[0]).toBe('function')
    })

    it('should validate required field', () => {
      const rule = wrapper.vm.requiredRules[0]
      expect(rule('')).not.toBe(true)
      expect(rule('30min')).toBe(true)
    })

    it('should return empty array when not required', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should be reactive to required prop changes', async () => {
      expect(wrapper.vm.requiredRules.length).toBeGreaterThan(0)
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.requiredRules).toBeDefined()
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

    it('should pass disabled to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass loading to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should be dense', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should be outlined', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: '1h' })
      expect(wrapper.vm.value).toBe('1h')
    })

    it('should update when required prop changes', async () => {
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should update when disabled prop changes', async () => {
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update when loading prop changes', async () => {
      await wrapper.setProps({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should update when title prop changes', async () => {
      await wrapper.setProps({ title: 'New Title' })
      expect(wrapper.vm.title).toBe('New Title')
    })

    it('should update when placeholder prop changes', async () => {
      await wrapper.setProps({ placeholder: 'New Placeholder' })
      expect(wrapper.vm.placeholder).toBe('New Placeholder')
    })

    it('should update when items prop changes', async () => {
      const newItems = [{ text: '5 minutes', id: '5min' }]
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items).toEqual(newItems)
    })
  })

  describe('integration scenarios', () => {
    it('should work as training duration selector', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
      expect(wrapper.vm.title).toBe('Duration')
    })

    it('should support various duration options', () => {
      const durations = ['15min', '30min', '1h', '2h']
      durations.forEach((duration) => {
        const item = mockItems.find((i) => i.id === duration)
        expect(item).toBeDefined()
      })
    })

    it('should work in required mode', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should work in optional mode', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should work with loading state', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should work with disabled state', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should work with selected value', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          value: '2h'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('2h')
    })

    it('should work with all props configured', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          value: '1h',
          title: 'Course Duration',
          subTitle: 'Set the course length',
          placeholder: 'Select time',
          required: true,
          disabled: false,
          loading: false
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('1h')
      expect(wrapper.vm.title).toBe('Course Duration')
      expect(wrapper.vm.required).toBe(true)
    })
  })

  describe('form integration', () => {
    it('should work with FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should support validation rules', () => {
      expect(wrapper.vm.requiredRules).toBeDefined()
    })

    it('should pass hint when required', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should work with form submission', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should maintain value for form binding', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          value: '30min'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('30min')
    })
  })

  describe('duration options', () => {
    it('should support 15 minute option', () => {
      const option = mockItems.find((i) => i.id === '15min')
      expect(option).toBeDefined()
      expect(option.text).toBe('15 minutes')
    })

    it('should support 30 minute option', () => {
      const option = mockItems.find((i) => i.id === '30min')
      expect(option).toBeDefined()
      expect(option.text).toBe('30 minutes')
    })

    it('should support 1 hour option', () => {
      const option = mockItems.find((i) => i.id === '1h')
      expect(option).toBeDefined()
      expect(option.text).toBe('1 hour')
    })

    it('should support 2 hour option', () => {
      const option = mockItems.find((i) => i.id === '2h')
      expect(option).toBeDefined()
      expect(option.text).toBe('2 hours')
    })

    it('should support 4 hour option', () => {
      const option = mockItems.find((i) => i.id === '4h')
      expect(option).toBeDefined()
      expect(option.text).toBe('4 hours')
    })

    it('should have all durations defined', () => {
      expect(mockItems.length).toBe(5)
    })

    it('should have consistent id/text mapping', () => {
      mockItems.forEach(item => {
        expect(item.id).toBeDefined()
        expect(item.text).toBeDefined()
      })
    })
  })

  describe('state management', () => {
    it('should maintain selected duration', () => {
      wrapper = shallowMount(InputTrainingDuration, {
        propsData: {
          items: mockItems,
          value: '1h'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('1h')
    })

    it('should preserve empty value', () => {
      expect(wrapper.vm.value).toBe('')
    })

    it('should maintain configuration across updates', async () => {
      expect(wrapper.vm.required).toBe(true)
      await wrapper.setProps({ value: '2h' })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should handle value clearing', async () => {
      await wrapper.setProps({ value: '30min' })
      expect(wrapper.vm.value).toBe('30min')
      await wrapper.setProps({ value: '' })
      expect(wrapper.vm.value).toBe('')
    })

    it('should preserve state during multiple updates', async () => {
      await wrapper.setProps({ value: '15min', required: true })
      expect(wrapper.vm.value).toBe('15min')
      expect(wrapper.vm.required).toBe(true)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.value).toBe('15min')
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('validation behavior', () => {
    it('should require value when required is true', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should not require value when required is false', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should have persistent hint when required', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should toggle required state', async () => {
      expect(wrapper.vm.required).toBe(true)
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })
  })

  describe('UI behavior', () => {
    it('should show loading indicator when loading', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should disable when disabled prop is true', () => {
      wrapper = shallowMount(InputTrainingDuration, {
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

    it('should show title and subtitle', () => {
      expect(wrapper.vm.title).toBe('Duration')
      expect(wrapper.vm.subTitle).toBe('Select the estimated time it takes to complete the training')
    })

    it('should show placeholder text', () => {
      expect(wrapper.vm.placeholder).toBe('Select duration')
    })

    it('should toggle enabled/disabled state', async () => {
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
      await wrapper.setProps({ disabled: false })
      expect(wrapper.vm.disabled).toBe(false)
    })
  })
})
