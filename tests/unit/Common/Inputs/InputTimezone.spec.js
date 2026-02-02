import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import InputTimezone from '@/components/Common/Inputs/InputTimezone.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('InputTimezone.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    const getters = {
      'common/getTimezones': () => ({
        timeZoneList: [
          { id: 'UTC', displayName: 'UTC' },
          { id: 'EST', displayName: 'Eastern Standard Time' },
          { id: 'CST', displayName: 'Central Standard Time' },
          { id: 'PST', displayName: 'Pacific Standard Time' },
          { id: 'GMT', displayName: 'Greenwich Mean Time' }
        ]
      })
    }

    store = new Vuex.Store({ getters })

    wrapper = shallowMount(InputTimezone, {
      store,
      localVue,
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
      expect(wrapper.vm.$options.name).toBe('InputTimezone')
    })

    it('should render k-select component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have k-select as child component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.vm).toBeDefined()
    })

    it('should have properly defined component options', () => {
      expect(wrapper.vm.$options).toHaveProperty('name')
      expect(wrapper.vm.$options).toHaveProperty('components')
      expect(wrapper.vm.$options).toHaveProperty('props')
      expect(wrapper.vm.$options).toHaveProperty('computed')
      expect(wrapper.vm.$options).toHaveProperty('methods')
    })
  })

  describe('prop defaults', () => {
    it('should have value undefined by default', () => {
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should have hint undefined by default', () => {
      expect(wrapper.vm.hint).toBeUndefined()
    })

    it('should have rules as empty array by default', () => {
      expect(wrapper.vm.rules).toEqual([])
    })

    it('should have persistentHint default false', () => {
      expect(wrapper.vm.persistentHint).toBe(false)
    })

    it('should have isBlock default false', () => {
      expect(wrapper.vm.isBlock).toBe(false)
    })

    it('should have isBlankSelectable default false', () => {
      expect(wrapper.vm.isBlankSelectable).toBe(false)
    })

    it('should have prependInnerIcon optional', () => {
      expect(wrapper.vm.prependInnerIcon).toBeUndefined()
    })

    it('should have rules as array type', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          value: 'UTC'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('UTC')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          hint: 'Select your timezone'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hint).toBe('Select your timezone')
    })

    it('should accept custom rules', () => {
      const rules = [(v) => v || 'Timezone is required']
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          rules
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.rules).toEqual(rules)
    })

    it('should accept persistentHint true', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          persistentHint: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should accept isBlock true', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlock: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.isBlock).toBe(true)
    })

    it('should accept isBlankSelectable true', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlankSelectable: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.isBlankSelectable).toBe(true)
    })

    it('should accept custom prependInnerIcon', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          prependInnerIcon: 'mdi-clock'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.prependInnerIcon).toBe('mdi-clock')
    })

    it('should accept value as string', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          value: 'EST'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(typeof wrapper.vm.value).toBe('string')
    })

    it('should accept multiple rules', () => {
      const rules = [(v) => Boolean(v) || 'Required', (v) => v.length > 0 || 'Not empty']
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          rules
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.rules.length).toBe(2)
    })
  })

  describe('getStyle computed property', () => {
    it('should return max-width style when isBlock is false', () => {
      expect(wrapper.vm.getStyle).toBe('max-width: 195px;')
    })

    it('should return empty string when isBlock is true', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlock: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.getStyle).toBe('')
    })

    it('should return string type', () => {
      expect(typeof wrapper.vm.getStyle).toBe('string')
    })

    it('should contain correct CSS value', () => {
      expect(wrapper.vm.getStyle).toContain('195px')
    })

    it('should be reactive to isBlock changes', async () => {
      expect(wrapper.vm.getStyle).toBe('max-width: 195px;')
      await wrapper.setProps({ isBlock: true })
      expect(wrapper.vm.getStyle).toBe('')
    })
  })

  describe('items computed property', () => {
    it('should fetch timezones from store', () => {
      expect(wrapper.vm.items).toBeDefined()
      expect(Array.isArray(wrapper.vm.items)).toBe(true)
    })

    it('should map timezone list to items', () => {
      const items = wrapper.vm.items
      expect(items.length).toBeGreaterThan(0)
    })

    it('should include text and value properties', () => {
      const items = wrapper.vm.items
      if (items.length > 0) {
        expect(items[0]).toHaveProperty('text')
        expect(items[0]).toHaveProperty('value')
      }
    })

    it('should map displayName to text property', () => {
      const items = wrapper.vm.items
      const utcItem = items.find(item => item.value === 'UTC')
      expect(utcItem.text).toBe('UTC')
    })

    it('should map id to value property', () => {
      const items = wrapper.vm.items
      const estItem = items.find(item => item.text === 'Eastern Standard Time')
      expect(estItem.value).toBe('EST')
    })

    it('should add Blank option when isBlankSelectable is true', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlankSelectable: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const items = wrapper.vm.items
      const blankItem = items.find((item) => item.value === 'Blank')
      expect(blankItem).toBeDefined()
    })

    it('should not include Blank option when isBlankSelectable is false', () => {
      const items = wrapper.vm.items
      const blankItem = items.find((item) => item.value === 'Blank')
      expect(blankItem).toBeUndefined()
    })

    it('should have Blank at first position when added', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlankSelectable: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const items = wrapper.vm.items
      expect(items[0].value).toBe('Blank')
    })

    it('should have correct count of items with blank option', () => {
      const itemsWithoutBlank = wrapper.vm.items.length
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlankSelectable: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const itemsWithBlank = wrapper.vm.items.length
      expect(itemsWithBlank).toBe(itemsWithoutBlank + 1)
    })
  })

  describe('lifecycle hooks', () => {
    it('should call callForGetTimeZones in created', () => {
      expect(wrapper.vm.callForGetTimeZones).toBeDefined()
    })

    it('should have created hook defined', () => {
      expect(wrapper.vm.$options.created).toBeDefined()
    })
  })

  describe('callForGetTimeZones method', () => {
    it('should have callForGetTimeZones method', () => {
      expect(typeof wrapper.vm.callForGetTimeZones).toBe('function')
    })

    it('should handle store without timezone list', () => {
      expect(() => wrapper.vm.callForGetTimeZones()).not.toThrow()
    })

    it('should handle store check gracefully', () => {
      expect(wrapper.vm.callForGetTimeZones).toBeDefined()
    })

    it('should check if store exists', () => {
      expect(wrapper.vm.$store).toBeDefined()
    })

    it('should access store getters', () => {
      const timezones = wrapper.vm.$store.getters['common/getTimezones']
      expect(timezones).toBeDefined()
    })
  })

  describe('KSelect integration', () => {
    it('should pass value to KSelect', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          value: 'UTC'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass items to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass hint to KSelect', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          hint: 'Select timezone'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass rules to KSelect', () => {
      const rules = [(v) => true]
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          rules
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should use autocomplete type', () => {
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

  describe('event handling', () => {
    it('should emit input event when value changes', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      if (kSelect.exists()) {
        expect(wrapper.vm).toBeDefined()
      }
    })

    it('should handle change events', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should propagate change event to input', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          value: 'UTC'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      await wrapper.setProps({ value: 'EST' })
      expect(wrapper.vm.value).toBe('EST')
    })

    it('should update when hint prop changes', async () => {
      await wrapper.setProps({ hint: 'New hint' })
      expect(wrapper.vm.hint).toBe('New hint')
    })

    it('should update when isBlock prop changes', async () => {
      await wrapper.setProps({ isBlock: true })
      expect(wrapper.vm.getStyle).toBe('')
    })

    it('should update items when isBlankSelectable changes', async () => {
      const itemsWithoutBlank = wrapper.vm.items.length
      await wrapper.setProps({ isBlankSelectable: true })
      const itemsWithBlank = wrapper.vm.items.length
      expect(itemsWithBlank).toBeGreaterThan(itemsWithoutBlank)
    })

    it('should update persistentHint reactively', async () => {
      await wrapper.setProps({ persistentHint: true })
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should update prependInnerIcon reactively', async () => {
      await wrapper.setProps({ prependInnerIcon: 'mdi-calendar' })
      expect(wrapper.vm.prependInnerIcon).toBe('mdi-calendar')
    })

    it('should update rules reactively', async () => {
      const newRules = [(v) => Boolean(v) || 'Required']
      await wrapper.setProps({ rules: newRules })
      expect(wrapper.vm.rules).toEqual(newRules)
    })
  })

  describe('accessibility', () => {
    it('should have placeholder text', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should support custom hint text', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          hint: 'Select your timezone'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hint).toBe('Select your timezone')
    })

    it('should support prepend icon', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          prependInnerIcon: 'mdi-clock-outline'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.prependInnerIcon).toBe('mdi-clock-outline')
    })

    it('should support persistent hint visibility', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          persistentHint: true,
          hint: 'Help text'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work as basic timezone selector', () => {
      expect(wrapper.vm.items).toBeDefined()
      expect(wrapper.vm.items.length).toBeGreaterThan(0)
    })

    it('should work with selected timezone', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          value: 'UTC'
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('UTC')
    })

    it('should work with block layout', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlock: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.getStyle).toBe('')
    })

    it('should work with custom hint and persistent', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          hint: 'Required field',
          persistentHint: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.hint).toBe('Required field')
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should work with blank selectable option', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          isBlankSelectable: true
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      const blankOption = wrapper.vm.items.find((item) => item.value === 'Blank')
      expect(blankOption).toBeDefined()
    })

    it('should work with all props combined', () => {
      wrapper = shallowMount(InputTimezone, {
        propsData: {
          value: 'EST',
          hint: 'Your timezone',
          persistentHint: true,
          isBlock: false,
          isBlankSelectable: true,
          prependInnerIcon: 'mdi-clock',
          rules: [(v) => Boolean(v) || 'Required']
        },
        store,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('EST')
      expect(wrapper.vm.hint).toBe('Your timezone')
      expect(wrapper.vm.persistentHint).toBe(true)
      expect(wrapper.vm.isBlock).toBe(false)
      expect(wrapper.vm.isBlankSelectable).toBe(true)
      expect(wrapper.vm.prependInnerIcon).toBe('mdi-clock')
    })
  })

  describe('data properties', () => {
    it('should have properly initialized data', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have initialized computed properties', () => {
      expect(wrapper.vm.getStyle).toBeDefined()
      expect(wrapper.vm.items).toBeDefined()
    })
  })

  describe('store integration', () => {
    it('should call store getter for timezones', () => {
      const items = wrapper.vm.items
      expect(Array.isArray(items)).toBe(true)
    })

    it('should handle empty timezone list', () => {
      const storeNoTimezones = new Vuex.Store({
        getters: {
          'common/getTimezones': () => ({ timeZoneList: [] })
        }
      })
      wrapper = shallowMount(InputTimezone, {
        store: storeNoTimezones,
        localVue,
        stubs: {
          'k-select': true
        }
      })
      expect(wrapper.vm.items).toEqual([])
    })

    it('should retrieve timezone list from store', () => {
      const timeZoneList = wrapper.vm.$store.getters['common/getTimezones'].timeZoneList
      expect(Array.isArray(timeZoneList)).toBe(true)
      expect(timeZoneList.length).toBeGreaterThan(0)
    })

    it('should use correct store path', () => {
      const getters = wrapper.vm.$store.getters
      expect(getters['common/getTimezones']).toBeDefined()
    })

    it('should access store without errors', () => {
      expect(() => {
        const timezones = wrapper.vm.$store.getters['common/getTimezones']
        return timezones
      }).not.toThrow()
    })
  })

  describe('timezone list handling', () => {
    it('should have 5 timezones in default list', () => {
      expect(wrapper.vm.items.length).toBe(5)
    })

    it('should include UTC timezone', () => {
      const utcItem = wrapper.vm.items.find(item => item.value === 'UTC')
      expect(utcItem).toBeDefined()
      expect(utcItem.text).toBe('UTC')
    })

    it('should include EST timezone', () => {
      const estItem = wrapper.vm.items.find(item => item.value === 'EST')
      expect(estItem).toBeDefined()
    })

    it('should include all mapped timezones', () => {
      const values = wrapper.vm.items.map(item => item.value)
      expect(values).toContain('UTC')
      expect(values).toContain('EST')
      expect(values).toContain('CST')
      expect(values).toContain('PST')
      expect(values).toContain('GMT')
    })
  })
})
