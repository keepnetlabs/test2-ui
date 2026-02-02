import { shallowMount } from '@vue/test-utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'

describe('InputDate.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputDate)
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 120,
      height: 35,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0
    }))
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
  })

  describe('prop defaults', () => {
    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Select a date')
    })

    it('should have startPlaceholder default', () => {
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should have endPlaceholder default', () => {
      expect(wrapper.vm.endPlaceholder).toBe('End Date')
    })

    it('should have rangeSeparator default', () => {
      expect(wrapper.vm.rangeSeparator).toBe('To')
    })

    it('should have popperClass default', () => {
      expect(wrapper.vm.popperClass).toBe('filter__date-picker')
    })

    it('should have type default to date', () => {
      expect(wrapper.vm.type).toBe('date')
    })

    it('should have clearable default true', () => {
      expect(wrapper.vm.clearable).toBe(true)
    })
  })

  describe('format properties', () => {
    it('should have format property', () => {
      expect(wrapper.vm.format).toBeDefined()
    })

    it('should have valueFormat property', () => {
      expect(wrapper.vm.valueFormat).toBeDefined()
    })

    it('should format be string', () => {
      expect(typeof wrapper.vm.format).toBe('string')
    })

    it('should valueFormat be string', () => {
      expect(typeof wrapper.vm.valueFormat).toBe('string')
    })
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Choose date'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose date')
    })

    it('should accept custom type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.type).toBe('daterange')
    })

    it('should accept custom format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-dd')
    })

    it('should accept clearable false', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: false
        }
      })
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('date range placeholders', () => {
    it('should have startPlaceholder for range', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should have endPlaceholder for range', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.endPlaceholder).toBe('End Date')
    })

    it('should support custom startPlaceholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          startPlaceholder: 'From Date',
          type: 'daterange'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBe('From Date')
    })

    it('should support custom endPlaceholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          endPlaceholder: 'To Date',
          type: 'daterange'
        }
      })
      expect(wrapper.vm.endPlaceholder).toBe('To Date')
    })
  })

  describe('lifecycle hook - created', () => {
    it('should set defaultTime for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime).toBeDefined()
    })

    it('should set start time 00:00:00 for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime[0]).toBe('00:00:00')
    })

    it('should set end time 23:59:00 for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime[1]).toBe('23:59:00')
    })

    it('should not set defaultTime for other types', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })
  })

  describe('date type variants', () => {
    it('should support date type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      expect(wrapper.vm.type).toBe('date')
    })

    it('should support datetime type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime'
        }
      })
      expect(wrapper.vm.type).toBe('datetime')
    })

    it('should support daterange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.type).toBe('daterange')
    })

    it('should support datetimerange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
    })

    it('should support month type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'month'
        }
      })
      expect(wrapper.vm.type).toBe('month')
    })

    it('should support year type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year'
        }
      })
      expect(wrapper.vm.type).toBe('year')
    })
  })

  describe('clearable functionality', () => {
    it('should be clearable by default', () => {
      expect(wrapper.vm.clearable).toBe(true)
    })

    it('should support non-clearable', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: false
        }
      })
      expect(wrapper.vm.clearable).toBe(false)
    })

    it('should support toggling clearable', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: true
        }
      })
      await wrapper.setProps({ clearable: false })
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('popper styling', () => {
    it('should have filter__date-picker class by default', () => {
      expect(wrapper.vm.popperClass).toBe('filter__date-picker')
    })

    it('should support custom popperClass', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          popperClass: 'custom-date-picker'
        }
      })
      expect(wrapper.vm.popperClass).toBe('custom-date-picker')
    })
  })

  describe('range separator', () => {
    it('should have "To" as default separator', () => {
      expect(wrapper.vm.rangeSeparator).toBe('To')
    })

    it('should support custom separator', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '-'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('-')
    })

    it('should support other separators', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '~'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('~')
    })
  })

  describe('component reactivity', () => {
    it('should update placeholder when prop changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Original'
        }
      })
      await wrapper.setProps({ placeholder: 'Updated' })
      expect(wrapper.vm.placeholder).toBe('Updated')
    })

    it('should update type when prop changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      await wrapper.setProps({ type: 'daterange' })
      expect(wrapper.vm.type).toBe('daterange')
    })

    it('should update clearable when prop changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: true
        }
      })
      await wrapper.setProps({ clearable: false })
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should have descriptive placeholder', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('date')
    })

    it('should support custom aria attributes', async () => {
      wrapper = shallowMount(InputDate, {
        attrs: {
          'aria-label': 'Select meeting date'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    it('should work as single date picker with defaults', () => {
      expect(wrapper.vm.type).toBe('date')
      expect(wrapper.vm.placeholder).toBe('Select a date')
      expect(wrapper.vm.clearable).toBe(true)
    })

    it('should work as date range picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          startPlaceholder: 'Start',
          endPlaceholder: 'End'
        }
      })
      expect(wrapper.vm.type).toBe('daterange')
      expect(wrapper.vm.startPlaceholder).toBe('Start')
      expect(wrapper.vm.endPlaceholder).toBe('End')
    })

    it('should work as datetime picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      })
      expect(wrapper.vm.type).toBe('datetime')
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm:ss')
    })

    it('should work as datetime range picker with defaultTime', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
      expect(wrapper.vm.defaultTime).toBeDefined()
      expect(wrapper.vm.defaultTime.length).toBe(2)
    })

    it('should work as month picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'month',
          placeholder: 'Select month'
        }
      })
      expect(wrapper.vm.type).toBe('month')
    })
  })
})
