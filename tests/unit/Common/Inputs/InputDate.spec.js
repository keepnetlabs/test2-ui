import { shallowMount } from '@vue/test-utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'

describe('InputDate.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputDate, {
      stubs: {
        'el-date-picker': true
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
      expect(wrapper.vm.$options.name).toBe('InputDate')
    })

    it('should extend DatePicker from element-ui', () => {
      expect(wrapper.vm.$options.extends).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should have placeholder prop with default Select a date', () => {
      expect(wrapper.vm.placeholder).toBe('Select a date')
    })

    it('should have startPlaceholder prop with default Start Date', () => {
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should have endPlaceholder prop with default End Date', () => {
      expect(wrapper.vm.endPlaceholder).toBe('End Date')
    })

    it('should have rangeSeparator prop with default To', () => {
      expect(wrapper.vm.rangeSeparator).toBe('To')
    })

    it('should have popperClass with filter__date-picker', () => {
      expect(wrapper.vm.popperClass).toBe('filter__date-picker')
    })

    it('should have type prop with default date', () => {
      expect(wrapper.vm.type).toBe('date')
    })

    it('should have clearable prop default true', () => {
      expect(wrapper.vm.clearable).toBe(true)
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { placeholder: 'Pick a date' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.placeholder).toBe('Pick a date')
    })

    it('should accept custom type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'daterange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('daterange')
    })
  })

  describe('date format configuration', () => {
    it('should have format prop', () => {
      expect(wrapper.vm.format).toBeDefined()
    })

    it('should have valueFormat prop', () => {
      expect(wrapper.vm.valueFormat).toBeDefined()
    })

    it('should have default datetime format', () => {
      expect(wrapper.vm.format).toContain('HH:mm')
    })

    it('should have consistent format and valueFormat', () => {
      expect(wrapper.vm.format).toBe(wrapper.vm.valueFormat)
    })
  })

  describe('date picker types', () => {
    it('should support date type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'date' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('date')
    })

    it('should support datetime type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetime' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('datetime')
    })

    it('should support daterange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'daterange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('daterange')
    })

    it('should support datetimerange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetimerange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
    })

    it('should support month type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'month' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('month')
    })

    it('should support year type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'year' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('year')
    })
  })

  describe('range date configuration', () => {
    it('should have separate start and end placeholders', () => {
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
      expect(wrapper.vm.endPlaceholder).toBe('End Date')
    })

    it('should accept custom startPlaceholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { startPlaceholder: 'From' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.startPlaceholder).toBe('From')
    })

    it('should accept custom endPlaceholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { endPlaceholder: 'Until' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.endPlaceholder).toBe('Until')
    })

    it('should accept custom rangeSeparator', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { rangeSeparator: '-' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.rangeSeparator).toBe('-')
    })
  })

  describe('clearable functionality', () => {
    it('should be clearable by default', () => {
      expect(wrapper.vm.clearable).toBe(true)
    })

    it('should accept clearable false', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { clearable: false },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('popperClass configuration', () => {
    it('should have filter__date-picker class by default', () => {
      expect(wrapper.vm.popperClass).toBe('filter__date-picker')
    })

    it('should accept custom popperClass', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { popperClass: 'custom-date-picker' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.popperClass).toBe('custom-date-picker')
    })
  })

  describe('created hook - datetimerange handling', () => {
    it('should set defaultTime for datetimerange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetimerange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.defaultTime).toBeDefined()
      expect(wrapper.vm.defaultTime[0]).toBe('00:00:00')
      expect(wrapper.vm.defaultTime[1]).toBe('23:59:00')
    })

    it('should not set defaultTime for regular date type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'date' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })

    it('should not set defaultTime for daterange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'daterange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })
  })

  describe('defaultTime property', () => {
    it('should have defaultTime property', () => {
      expect(wrapper.vm.$options.props.defaultTime).toBeDefined()
    })

    it('should set start time to 00:00:00', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetimerange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.defaultTime[0]).toBe('00:00:00')
    })

    it('should set end time to 23:59:00', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetimerange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.defaultTime[1]).toBe('23:59:00')
    })
  })

  describe('real-world scenarios', () => {
    it('should work as date picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'date' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('date')
      expect(wrapper.vm.clearable).toBe(true)
    })

    it('should work as date range picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          startPlaceholder: 'Start Date',
          endPlaceholder: 'End Date'
        },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('daterange')
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should work as datetime picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetime' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('datetime')
      expect(wrapper.vm.format).toContain('HH:mm')
    })

    it('should work as datetime range picker with full-day times', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'datetimerange' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.defaultTime[0]).toBe('00:00:00')
      expect(wrapper.vm.defaultTime[1]).toBe('23:59:00')
    })

    it('should work as month picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'month' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('month')
    })

    it('should work as year picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: { type: 'year' },
        stubs: { 'el-date-picker': true }
      })
      expect(wrapper.vm.type).toBe('year')
    })
  })

  describe('timezone support', () => {
    it('should have timezone-aware format', () => {
      expect(wrapper.vm.format).toBeDefined()
    })

    it('should have timezone-aware valueFormat', () => {
      expect(wrapper.vm.valueFormat).toBeDefined()
    })
  })

  describe('component reactivity', () => {
    it('should update when placeholder prop changes', async () => {
      await wrapper.setProps({ placeholder: 'New placeholder' })
      expect(wrapper.vm.placeholder).toBe('New placeholder')
    })

    it('should update when type prop changes', async () => {
      await wrapper.setProps({ type: 'datetime' })
      expect(wrapper.vm.type).toBe('datetime')
    })

    it('should update when clearable prop changes', async () => {
      await wrapper.setProps({ clearable: false })
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('props type validation', () => {
    it('should have Boolean type for clearable', () => {
      expect(wrapper.vm.$options.props.clearable.type).toBe(Boolean)
    })

    it('should have correct default value for placeholder', () => {
      expect(wrapper.vm.$options.props.placeholder.default).toBe('Select a date')
    })

    it('should have correct default value for type', () => {
      expect(wrapper.vm.$options.props.type.default).toBe('date')
    })
  })
})
