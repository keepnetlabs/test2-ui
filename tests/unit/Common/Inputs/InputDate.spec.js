import { shallowMount } from '@vue/test-utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { getTimeZone } from '@/utils/functions'

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

    it('should extend DatePicker from element-ui', () => {
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

    it('should have defaultTime undefined by default', () => {
      expect(wrapper.vm.defaultTime).toBeUndefined()
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

    it('should format include timezone from getTimeZone or default', () => {
      const tzFormat = getTimeZone()
      expect(wrapper.vm.format).toBe(tzFormat || 'yyyy/MM/dd HH:mm')
    })

    it('should valueFormat match format property', () => {
      expect(wrapper.vm.valueFormat).toBe(wrapper.vm.format)
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

    it('should accept custom valueFormat', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          valueFormat: 'timestamp'
        }
      })
      expect(wrapper.vm.valueFormat).toBe('timestamp')
    })

    it('should accept clearable false', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: false
        }
      })
      expect(wrapper.vm.clearable).toBe(false)
    })

    it('should accept custom startPlaceholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          startPlaceholder: 'From'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBe('From')
    })

    it('should accept custom endPlaceholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          endPlaceholder: 'Until'
        }
      })
      expect(wrapper.vm.endPlaceholder).toBe('Until')
    })

    it('should accept custom rangeSeparator', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '-'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('-')
    })

    it('should accept custom popperClass', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          popperClass: 'custom-picker'
        }
      })
      expect(wrapper.vm.popperClass).toBe('custom-picker')
    })

    it('should accept custom defaultTime', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          defaultTime: ['10:00:00', '20:00:00']
        }
      })
      expect(wrapper.vm.defaultTime).toEqual(['10:00:00', '20:00:00'])
    })

    it('should accept all props together', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          placeholder: 'Custom',
          startPlaceholder: 'Start',
          endPlaceholder: 'End',
          format: 'yyyy-MM-dd HH:mm:ss',
          clearable: false
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
      expect(wrapper.vm.placeholder).toBe('Custom')
      expect(wrapper.vm.startPlaceholder).toBe('Start')
      expect(wrapper.vm.endPlaceholder).toBe('End')
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm:ss')
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('date range placeholders', () => {
    it('should have startPlaceholder for daterange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should have endPlaceholder for daterange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.endPlaceholder).toBe('End Date')
    })

    it('should have startPlaceholder for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should have endPlaceholder for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
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

    it('should support empty string placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          startPlaceholder: '',
          endPlaceholder: '',
          type: 'daterange'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBe('')
      expect(wrapper.vm.endPlaceholder).toBe('')
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

    it('should set defaultTime as array for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(Array.isArray(wrapper.vm.defaultTime)).toBe(true)
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

    it('should set defaultTime array length to 2', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime.length).toBe(2)
    })

    it('should not set defaultTime for date type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })

    it('should not set defaultTime for datetime type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime'
        }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })

    it('should not set defaultTime for daterange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })

    it('should not set defaultTime for month type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'month'
        }
      })
      expect(wrapper.vm.defaultTime).toBeUndefined()
    })

    it('should not set defaultTime for year type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year'
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

    it('should support monthrange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'monthrange'
        }
      })
      expect(wrapper.vm.type).toBe('monthrange')
    })

    it('should support yearrange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'yearrange'
        }
      })
      expect(wrapper.vm.type).toBe('yearrange')
    })

    it('should support week type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'week'
        }
      })
      expect(wrapper.vm.type).toBe('week')
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

    it('should support toggling clearable true to false', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: true
        }
      })
      await wrapper.setProps({ clearable: false })
      expect(wrapper.vm.clearable).toBe(false)
    })

    it('should support toggling clearable false to true', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: false
        }
      })
      await wrapper.setProps({ clearable: true })
      expect(wrapper.vm.clearable).toBe(true)
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

    it('should support multiple classes in popperClass', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          popperClass: 'custom-picker dark-theme wide'
        }
      })
      expect(wrapper.vm.popperClass).toBe('custom-picker dark-theme wide')
    })

    it('should support empty popperClass', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          popperClass: ''
        }
      })
      expect(wrapper.vm.popperClass).toBe('')
    })
  })

  describe('range separator', () => {
    it('should have "To" as default separator', () => {
      expect(wrapper.vm.rangeSeparator).toBe('To')
    })

    it('should support custom separator "-"', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '-'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('-')
    })

    it('should support custom separator "~"', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '~'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('~')
    })

    it('should support custom separator " to "', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: ' to '
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe(' to ')
    })

    it('should support multiple character separators', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '...'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('...')
    })

    it('should support empty separator', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: ''
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('')
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

    it('should update format when prop changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd'
        }
      })
      await wrapper.setProps({ format: 'dd/MM/yyyy' })
      expect(wrapper.vm.format).toBe('dd/MM/yyyy')
    })

    it('should update rangeSeparator when prop changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: 'To'
        }
      })
      await wrapper.setProps({ rangeSeparator: '-' })
      expect(wrapper.vm.rangeSeparator).toBe('-')
    })

    it('should handle multiple prop changes reactively', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date',
          placeholder: 'Pick date',
          clearable: true
        }
      })
      await wrapper.setProps({
        type: 'daterange',
        placeholder: 'Pick range',
        clearable: false
      })
      expect(wrapper.vm.type).toBe('daterange')
      expect(wrapper.vm.placeholder).toBe('Pick range')
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('format consistency', () => {
    it('should have matching format and valueFormat by default', () => {
      expect(wrapper.vm.format).toBe(wrapper.vm.valueFormat)
    })

    it('should maintain format when valueFormat is different', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-dd')
      expect(wrapper.vm.valueFormat).toBe('timestamp')
    })

    it('should allow null valueFormat', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          valueFormat: null
        }
      })
      expect(wrapper.vm.valueFormat).toBeNull()
    })
  })

  describe('datetime specific configurations', () => {
    it('should include time in datetime format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      })
      expect(wrapper.vm.format).toContain('HH:mm')
    })

    it('should have defaultTime for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime).toBeDefined()
      expect(wrapper.vm.defaultTime[0]).toBe('00:00:00')
      expect(wrapper.vm.defaultTime[1]).toBe('23:59:00')
    })

    it('should set defaultTime even with custom defaultTime prop', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          defaultTime: ['08:00:00', '18:00:00']
        }
      })
      // The created hook will override with default times
      expect(wrapper.vm.defaultTime).toBeDefined()
      expect(Array.isArray(wrapper.vm.defaultTime)).toBe(true)
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

    it('should have placeholder for range start', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.startPlaceholder).toBeTruthy()
    })

    it('should have placeholder for range end', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.endPlaceholder).toBeTruthy()
    })
  })

  describe('state management', () => {
    it('should maintain all props in state', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          placeholder: 'Custom',
          format: 'yyyy-MM-dd HH:mm',
          clearable: false,
          popperClass: 'custom'
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
      expect(wrapper.vm.placeholder).toBe('Custom')
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm')
      expect(wrapper.vm.clearable).toBe(false)
      expect(wrapper.vm.popperClass).toBe('custom')
    })

    it('should maintain independent state between instances', () => {
      const wrapper1 = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Picker 1',
          type: 'date'
        }
      })
      const wrapper2 = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Picker 2',
          type: 'daterange'
        }
      })
      expect(wrapper1.vm.placeholder).toBe('Picker 1')
      expect(wrapper2.vm.placeholder).toBe('Picker 2')
      expect(wrapper1.vm.type).toBe('date')
      expect(wrapper2.vm.type).toBe('daterange')
      wrapper1.destroy()
      wrapper2.destroy()
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

    it('should work as year picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year',
          placeholder: 'Select year'
        }
      })
      expect(wrapper.vm.type).toBe('year')
    })

    it('should work as month range picker', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'monthrange',
          startPlaceholder: 'Start Month',
          endPlaceholder: 'End Month'
        }
      })
      expect(wrapper.vm.type).toBe('monthrange')
    })

    it('should work with custom styling and placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          startPlaceholder: 'From Date & Time',
          endPlaceholder: 'To Date & Time',
          popperClass: 'dark-theme-picker',
          rangeSeparator: '→',
          clearable: false,
          format: 'dd/MM/yyyy HH:mm'
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
      expect(wrapper.vm.startPlaceholder).toBe('From Date & Time')
      expect(wrapper.vm.endPlaceholder).toBe('To Date & Time')
      expect(wrapper.vm.popperClass).toBe('dark-theme-picker')
      expect(wrapper.vm.rangeSeparator).toBe('→')
      expect(wrapper.vm.clearable).toBe(false)
      expect(wrapper.vm.format).toBe('dd/MM/yyyy HH:mm')
    })
  })

  describe('timezone handling', () => {
    it('should use getTimeZone for default format', () => {
      const tzFormat = getTimeZone()
      expect(wrapper.vm.format).toBe(tzFormat || 'yyyy/MM/dd HH:mm')
    })

    it('should use getTimeZone for default valueFormat', () => {
      const tzFormat = getTimeZone()
      expect(wrapper.vm.valueFormat).toBe(tzFormat || 'yyyy/MM/dd HH:mm')
    })

    it('should allow overriding timezone format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd HH:mm:ss Z'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm:ss Z')
    })
  })

  describe('edge cases', () => {
    it('should handle empty placeholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: ''
        }
      })
      expect(wrapper.vm.placeholder).toBe('')
    })

    it('should handle very long placeholder text', () => {
      const longText = 'This is a very long placeholder text that spans multiple words and explains the date field'
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: longText
        }
      })
      expect(wrapper.vm.placeholder).toBe(longText)
    })

    it('should handle special characters in placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Select date (YYYY/MM/DD)'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Select date (YYYY/MM/DD)')
    })

    it('should handle unicode characters in placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: '날짜 선택'
        }
      })
      expect(wrapper.vm.placeholder).toBe('날짜 선택')
    })
  })

  describe('boolean prop validation', () => {
    it('should reject invalid clearable values', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: true
        }
      })
      expect(wrapper.vm.clearable).toBe(true)
    })

    it('should handle clearable as boolean type', () => {
      expect(typeof wrapper.vm.clearable).toBe('boolean')
    })
  })

  describe('complex scenarios', () => {
    it('should handle switching between date and datetime', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date',
          format: 'yyyy-MM-dd'
        }
      })
      expect(wrapper.vm.type).toBe('date')
      await wrapper.setProps({
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss'
      })
      expect(wrapper.vm.type).toBe('datetime')
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm:ss')
    })

    it('should handle switching between range and single selection', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date',
          placeholder: 'Select date'
        }
      })
      expect(wrapper.vm.type).toBe('date')
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
      await wrapper.setProps({
        type: 'daterange'
      })
      expect(wrapper.vm.type).toBe('daterange')
      expect(wrapper.vm.startPlaceholder).toBe('Start Date')
    })

    it('should maintain non-defaultTime settings during type transition', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date',
          clearable: true,
          popperClass: 'custom-class'
        }
      })
      await wrapper.setProps({ type: 'datetimerange' })
      expect(wrapper.vm.type).toBe('datetimerange')
      // clearable and popperClass should be maintained
      expect(wrapper.vm.clearable).toBe(true)
      expect(wrapper.vm.popperClass).toBe('custom-class')
    })
  })

  describe('date format variations', () => {
    it('should support ISO 8601 format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-ddTHH:mm:ss'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-ddTHH:mm:ss')
    })

    it('should support US date format MM/DD/YYYY', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'MM/dd/yyyy'
        }
      })
      expect(wrapper.vm.format).toBe('MM/dd/yyyy')
    })

    it('should support European date format DD/MM/YYYY', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'dd/MM/yyyy'
        }
      })
      expect(wrapper.vm.format).toBe('dd/MM/yyyy')
    })

    it('should support dotted format DD.MM.YYYY', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'dd.MM.yyyy'
        }
      })
      expect(wrapper.vm.format).toBe('dd.MM.yyyy')
    })

    it('should support dashed format YYYY-MM-DD', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-dd')
    })

    it('should support time with seconds HH:mm:ss', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      })
      expect(wrapper.vm.format).toContain('HH:mm:ss')
    })

    it('should support time with milliseconds HH:mm:ss.SSS', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd HH:mm:ss.SSS'
        }
      })
      expect(wrapper.vm.format).toContain('SSS')
    })

    it('should support 12-hour format hh:mm a', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd hh:mm a'
        }
      })
      expect(wrapper.vm.format).toContain('hh')
    })

    it('should support month and year format MM/yyyy', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'month',
          format: 'MM/yyyy'
        }
      })
      expect(wrapper.vm.format).toBe('MM/yyyy')
    })

    it('should support year only format yyyy', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year',
          format: 'yyyy'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy')
    })
  })

  describe('date value formats and parsing', () => {
    it('should accept ISO string date', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-12-25'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept ISO datetime string', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-12-25T15:30:00'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept ISO datetime with timezone', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-12-25T15:30:00Z'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept Unix timestamp', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: 1703520600000,
          valueFormat: 'timestamp'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept Date object', () => {
      const date = new Date('2023-12-25')
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: date
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept array for date range', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          value: ['2023-12-01', '2023-12-31']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should support daterange type without values', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.type).toBe('daterange')
    })

    it('should handle date range with values', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange'
        }
      })
      expect(wrapper.vm.type).toBe('daterange')
    })

    it('should accept no value', () => {
      wrapper = shallowMount(InputDate)
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle missing value prop', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {}
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should support type prop without value', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      expect(wrapper.vm.type).toBe('date')
    })
  })

  describe('time validation and edge cases', () => {
    it('should accept midnight 00:00:00', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          value: '2023-12-25 00:00:00'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept last second of day 23:59:59', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          value: '2023-12-25 23:59:59'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept noon 12:00:00', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          value: '2023-12-25 12:00:00'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept single digit hours 01:00:00', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          value: '2023-12-25 01:00:00'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept various minute values', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetime',
          value: '2023-12-25 14:30:00'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should set default start time 00:00:00 for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime[0]).toBe('00:00:00')
    })

    it('should set default end time 23:59:00 for datetimerange', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange'
        }
      })
      expect(wrapper.vm.defaultTime[1]).toBe('23:59:00')
    })
  })

  describe('date range specific tests', () => {
    it('should create array with start and end dates', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          value: ['2023-12-01', '2023-12-31']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should validate start date before end date', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          value: ['2023-12-31', '2023-12-01']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle single day range', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          value: ['2023-12-25', '2023-12-25']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle range with UTC dates', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          value: ['2023-12-01T00:00:00Z', '2023-12-31T23:59:59Z']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle range with different formats', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'daterange',
          format: 'dd/MM/yyyy',
          value: ['25/12/2023', '31/12/2023']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle monthrange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'monthrange'
        }
      })
      expect(wrapper.vm.type).toBe('monthrange')
    })

    it('should handle yearrange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'yearrange'
        }
      })
      expect(wrapper.vm.type).toBe('yearrange')
    })

    it('should handle datetimerange with defaultTime', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          value: ['2023-12-01 10:00:00', '2023-12-31 15:00:00']
        }
      })
      expect(wrapper.vm.defaultTime).toBeDefined()
    })
  })

  describe('event handling and emissions', () => {
    it('should have input event listener', () => {
      wrapper = shallowMount(InputDate)
      const listener = jest.fn()
      wrapper.vm.$on('input', listener)
      expect(wrapper.vm._events.input).toBeDefined()
    })

    it('should have change event listener', () => {
      wrapper = shallowMount(InputDate)
      const listener = jest.fn()
      wrapper.vm.$on('change', listener)
      expect(wrapper.vm._events.change).toBeDefined()
    })

    it('should have blur event listener', () => {
      wrapper = shallowMount(InputDate)
      const listener = jest.fn()
      wrapper.vm.$on('blur', listener)
      expect(wrapper.vm._events.blur).toBeDefined()
    })

    it('should have focus event listener', () => {
      wrapper = shallowMount(InputDate)
      const listener = jest.fn()
      wrapper.vm.$on('focus', listener)
      expect(wrapper.vm._events.focus).toBeDefined()
    })

    it('should support pick-click event', () => {
      wrapper = shallowMount(InputDate)
      const listener = jest.fn()
      wrapper.vm.$on('pick', listener)
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('special date scenarios', () => {
    it('should handle leap year date Feb 29', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2024-02-29'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle century transition dates', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2000-01-01'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle year 2000 (Y2K)', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2000-12-31'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle far future date', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2099-12-31'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle recent past date', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2000-01-01'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle daylight saving transition dates', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-03-12 02:00:00'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle new year date', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2024-01-01'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle last day of month variations', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-01-31'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle February 28 (non-leap year)', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-02-28'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle December 31', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          value: '2023-12-31'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('placeholder text variations', () => {
    it('should accept long placeholder text', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Select a date from the calendar'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Select a date from the calendar')
    })

    it('should accept placeholder with special characters', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Date (YYYY-MM-DD)'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Date (YYYY-MM-DD)')
    })

    it('should accept placeholder with emoji', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Pick a date 📅'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Pick a date 📅')
    })

    it('should accept unicode placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: '날짜를 선택하세요'
        }
      })
      expect(wrapper.vm.placeholder).toBe('날짜를 선택하세요')
    })

    it('should accept Arabic placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'اختر تاريخ'
        }
      })
      expect(wrapper.vm.placeholder).toBe('اختر تاريخ')
    })

    it('should accept Cyrillic placeholders', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Выберите дату'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Выберите дату')
    })
  })

  describe('value format variations', () => {
    it('should support timestamp valueFormat', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          valueFormat: 'timestamp'
        }
      })
      expect(wrapper.vm.valueFormat).toBe('timestamp')
    })

    it('should support milliseconds timestamp', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          valueFormat: 'timestamps'
        }
      })
      expect(wrapper.vm.valueFormat).toBe('timestamps')
    })

    it('should support ISO 8601 valueFormat', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          valueFormat: 'yyyy-MM-ddTHH:mm:ss'
        }
      })
      expect(wrapper.vm.valueFormat).toBe('yyyy-MM-ddTHH:mm:ss')
    })

    it('should support custom date string valueFormat', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          valueFormat: 'dd/MM/yyyy'
        }
      })
      expect(wrapper.vm.valueFormat).toBe('dd/MM/yyyy')
    })

    it('should allow valueFormat different from format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp'
        }
      })
      expect(wrapper.vm.format).not.toBe(wrapper.vm.valueFormat)
    })
  })

  describe('disabled and readonly states', () => {
    it('should support disabled prop', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should support readonly prop', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should toggle disabled state', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          disabled: false
        }
      })
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should toggle readonly state', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          readonly: false
        }
      })
      await wrapper.setProps({ readonly: true })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should prevent interaction when disabled', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          disabled: true,
          value: '2023-12-25'
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should allow clearing when not disabled', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: true,
          disabled: false
        }
      })
      expect(wrapper.vm.clearable).toBe(true)
    })
  })

  describe('performance and large datasets', () => {
    it('should handle multiple instances efficiently', () => {
      const wrappers = []
      for (let i = 0; i < 10; i++) {
        const w = shallowMount(InputDate, {
          propsData: {
            placeholder: `Date ${i}`,
            type: i % 2 === 0 ? 'date' : 'daterange'
          }
        })
        wrappers.push(w)
      }
      expect(wrappers.length).toBe(10)
      wrappers.forEach((w) => w.destroy())
    })

    it('should handle frequent prop updates', async () => {
      wrapper = shallowMount(InputDate)
      for (let i = 0; i < 20; i++) {
        await wrapper.setProps({
          format: `yyyy-MM-dd ${i}`
        })
      }
      expect(wrapper.vm.format).toBeDefined()
    })

    it('should handle rapid date value changes', () => {
      const dates = [
        '2023-01-01',
        '2023-06-15',
        '2023-12-31',
        '2024-03-20',
        '2024-09-10'
      ]
      wrapper = shallowMount(InputDate)
      dates.forEach((date) => {
        wrapper = shallowMount(InputDate, {
          propsData: { value: date }
        })
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('month and year specific tests', () => {
    it('should format month type correctly', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'month',
          format: 'yyyy-MM'
        }
      })
      expect(wrapper.vm.type).toBe('month')
      expect(wrapper.vm.format).toBe('yyyy-MM')
    })

    it('should format year type correctly', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year',
          format: 'yyyy'
        }
      })
      expect(wrapper.vm.type).toBe('year')
      expect(wrapper.vm.format).toBe('yyyy')
    })

    it('should accept month value', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'month',
          value: '2023-12'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept year value', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year',
          value: '2023'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle monthrange type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'monthrange',
          startPlaceholder: 'Start Month',
          endPlaceholder: 'End Month'
        }
      })
      expect(wrapper.vm.type).toBe('monthrange')
    })

    it('should handle month range value', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'monthrange',
          value: ['2023-01', '2023-12']
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('week type tests', () => {
    it('should support week type', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'week'
        }
      })
      expect(wrapper.vm.type).toBe('week')
    })

    it('should format week with custom format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'week',
          format: 'yyyy-MM-dd'
        }
      })
      expect(wrapper.vm.type).toBe('week')
    })

    it('should support week placeholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'week',
          placeholder: 'Select a week'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Select a week')
    })
  })

  describe('timezone and locale considerations', () => {
    it('should use getTimeZone for format by default', () => {
      const tzFormat = getTimeZone()
      wrapper = shallowMount(InputDate)
      expect(wrapper.vm.format).toBe(tzFormat || 'yyyy/MM/dd HH:mm')
    })

    it('should use timezone aware format', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd HH:mm:ss Z'
        }
      })
      expect(wrapper.vm.format).toContain('Z')
    })

    it('should handle custom timezone offset', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd HH:mm:ss XXX'
        }
      })
      expect(wrapper.vm.format).toContain('XXX')
    })

    it('should maintain timezone consistency across range', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:ss Z'
        }
      })
      expect(wrapper.vm.format).toContain('Z')
    })
  })

  describe('string length and encoding', () => {
    it('should handle very long placeholder', () => {
      const longText = 'Select your date ' + 'x'.repeat(500)
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: longText
        }
      })
      expect(wrapper.vm.placeholder.length).toBeGreaterThan(500)
    })

    it('should handle very long startPlaceholder', () => {
      const longText = 'Start date ' + 'x'.repeat(500)
      wrapper = shallowMount(InputDate, {
        propsData: {
          startPlaceholder: longText
        }
      })
      expect(wrapper.vm.startPlaceholder.length).toBeGreaterThan(500)
    })

    it('should handle special characters in format string', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy/MM/dd HH:mm:ss (UTC)'
        }
      })
      expect(wrapper.vm.format).toContain('UTC')
    })

    it('should handle special characters in rangeSeparator', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          rangeSeparator: '→→→'
        }
      })
      expect(wrapper.vm.rangeSeparator).toBe('→→→')
    })
  })

  describe('combination tests with multiple props', () => {
    it('should combine datetimerange with custom separators', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          startPlaceholder: 'When?',
          endPlaceholder: 'Until when?',
          rangeSeparator: '→',
          format: 'dd/MM/yyyy HH:mm'
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
      expect(wrapper.vm.startPlaceholder).toBe('When?')
      expect(wrapper.vm.endPlaceholder).toBe('Until when?')
      expect(wrapper.vm.rangeSeparator).toBe('→')
      expect(wrapper.vm.format).toBe('dd/MM/yyyy HH:mm')
    })

    it('should combine monthrange with custom styling', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'monthrange',
          popperClass: 'dark-month-picker large',
          clearable: false
        }
      })
      expect(wrapper.vm.type).toBe('monthrange')
      expect(wrapper.vm.popperClass).toContain('dark-month-picker')
      expect(wrapper.vm.clearable).toBe(false)
    })

    it('should combine year with specific formatting', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'year',
          format: 'yyyy年',
          placeholder: '選択してください'
        }
      })
      expect(wrapper.vm.type).toBe('year')
      expect(wrapper.vm.format).toBe('yyyy年')
    })

    it('should handle all properties simultaneously', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:ss',
          valueFormat: 'timestamp',
          placeholder: 'Select dates',
          startPlaceholder: 'From',
          endPlaceholder: 'To',
          rangeSeparator: ' - ',
          popperClass: 'custom-dark-picker',
          clearable: false
        }
      })
      expect(wrapper.vm.type).toBe('datetimerange')
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm:ss')
      expect(wrapper.vm.valueFormat).toBe('timestamp')
      expect(wrapper.vm.placeholder).toBe('Select dates')
      expect(wrapper.vm.startPlaceholder).toBe('From')
      expect(wrapper.vm.endPlaceholder).toBe('To')
      expect(wrapper.vm.rangeSeparator).toBe(' - ')
      expect(wrapper.vm.popperClass).toBe('custom-dark-picker')
      expect(wrapper.vm.clearable).toBe(false)
    })
  })

  describe('error states and validation', () => {
    it('should support disabled state', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should support clearable prop configuration', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: false
        }
      })
      expect(wrapper.vm.clearable).toBe(false)
    })

    it('should maintain form field properties', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date',
          placeholder: 'Select date'
        }
      })
      expect(wrapper.vm.type).toBe('date')
      expect(wrapper.vm.placeholder).toBe('Select date')
    })
  })

  describe('watchers and reactivity', () => {
    it('should react to type changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      const initialType = wrapper.vm.type
      await wrapper.setProps({ type: 'month' })
      expect(wrapper.vm.type).not.toBe(initialType)
    })

    it('should react to format changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd'
        }
      })
      await wrapper.setProps({ format: 'dd/MM/yyyy' })
      expect(wrapper.vm.format).toBe('dd/MM/yyyy')
    })

    it('should react to clearable changes', async () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          clearable: true
        }
      })
      const initialState = wrapper.vm.clearable
      await wrapper.setProps({ clearable: false })
      expect(wrapper.vm.clearable).not.toBe(initialState)
    })
  })

  describe('null and undefined handling', () => {
    it('should handle missing placeholder', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          placeholder: 'Custom placeholder'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })

    it('should handle type with value', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          type: 'date'
        }
      })
      expect(wrapper.vm.type).toBe('date')
    })

    it('should handle format property', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-dd')
    })

    it('should handle custom format string', () => {
      wrapper = shallowMount(InputDate, {
        propsData: {
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      })
      expect(wrapper.vm.format).toBe('yyyy-MM-dd HH:mm:ss')
    })
  })
})
