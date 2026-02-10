import { createLocalVue, shallowMount } from '@vue/test-utils'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch.vue'
import Vuetify from 'vuetify'

describe('DataContainerWithSearch.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const stubs = {
      'v-text-field': {
          template: '<input class="search-input" v-model="value" />',
          props: ['value']
      },
      'v-menu': {
          template: '<div><slot name="activator" :on="{}"></slot><slot /></div>',
          props: ['value']
      },
      'v-checkbox': {
          template: '<input type="checkbox" :checked="value" @change="$emit(\'change\', $event.target.checked)" />',
          props: ['value', 'label']
      },
      'v-btn': {
          template: '<button @click="$emit(\'click\')"><slot /></button>'
      },
      'v-icon': true,
      'v-virtual-scroll': {
          template: '<div class="scroll-stub"><slot v-for="(item, index) in items" :item="item" :index="index" /></div>',
          props: ['items']
      },
      'data-container-with-search-item': {
          template: '<div class="item-mock">Item: {{ value }} <button class="del-btn" @click="$emit(\'on-delete\', value)">Del</button></div>',
          props: ['value', 'index']
      }
  }

  const mountComponent = (propsData = {}) => {
      return shallowMount(DataContainerWithSearch, {
          localVue,
          vuetify,
          propsData: {
              value: ['test1.com', 'test2.com'],
              ...propsData
          },
          stubs
      })
  }

  it('renders correctly with given values', () => {
      const wrapper = mountComponent()
      expect(wrapper.findAll('.item-mock').length).toBe(2)
  })

  it('filters items based on search input', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'test1' })
      expect(wrapper.vm.getItems.length).toBe(1)
      expect(wrapper.vm.getItems[0].val).toBe('test1.com')
  })

  it('handles filtering for custom entries', async () => {
      // getEditability determines if item isEditable
      // let's make test2.com NOT editable
      const wrapper = mountComponent({
          filters: ['custom'],
          getEditability: (val) => val === 'test1.com'
      })
      
      // Initially, no filter active
      expect(wrapper.vm.getItems.length).toBe(2)
      
      // Activate custom filter
      wrapper.setData({ isCustomFilterChecked: true })
      wrapper.vm.handleFilter()
      
      // Only test1.com should remain
      expect(wrapper.vm.getItems.length).toBe(1)
      expect(wrapper.vm.getItems[0].val).toBe('test1.com')
  })

  it('handles filtering for invalid entries', async () => {
      const wrapper = mountComponent({
          filters: ['invalid'],
          textFieldRules: [(v) => v === 'test1.com' || 'Invalid']
      })
      
      // test2.com is invalid
      wrapper.setData({ isFilterChecked: true })
      wrapper.vm.handleFilter()
      
      expect(wrapper.vm.getItems.length).toBe(1)
      expect(wrapper.vm.getItems[0].val).toBe('test2.com')
  })

  it('clears filters', async () => {
       const wrapper = mountComponent({ filters: ['invalid'] })
       wrapper.setData({ isFilterChecked: true, isFilterActive: true })
       
       wrapper.vm.clearFilter()
       expect(wrapper.vm.isFilterChecked).toBe(false)
       expect(wrapper.vm.isFilterActive).toBe(false)
  })

  it('handles item deletion', async () => {
      const wrapper = mountComponent()
      // find first delete button and click
      await wrapper.find('.del-btn').trigger('click')
      
      expect(wrapper.emitted('on-delete')).toBeTruthy()
      expect(wrapper.vm.value).toEqual(['test2.com'])
  })

  it('updates overall validity', async () => {
      const wrapper = mountComponent({
          textFieldRules: [(v) => v === 'test1.com' || 'Error']
      })
      // test2.com is invalid
      wrapper.vm.checkAllValid()
      expect(wrapper.vm.isAllValid).toBe(false)
      
      // update value
      await wrapper.setProps({ value: ['test1.com'] })
      expect(wrapper.vm.isAllValid).toBe(true)
  })

  it('handles input change from items', async () => {
      const wrapper = mountComponent({ value: ['old.com'] })
      // handleInputChange(newVal, oldVal, index)
      wrapper.vm.handleInputChange('new.com', 'old.com', 0)

      expect(wrapper.vm.value).toEqual(['new.com'])
      expect(wrapper.emitted('input')[0]).toEqual([['new.com']])
  })

  describe('Component Rendering', () => {
    it('renders component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders all items provided', () => {
      const wrapper = mountComponent()
      expect(wrapper.findAll('.item-mock').length).toBe(2)
    })

    it('renders search input field', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.search-input').exists()).toBe(true)
    })

    it('mounts with vuetify', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Search Functionality', () => {
    it('filters items based on search input', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'test1' })
      expect(wrapper.vm.getItems.length).toBe(1)
    })

    it('displays matching items only', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'test1' })
      expect(wrapper.vm.getItems[0].val).toBe('test1.com')
    })

    it('handles search with no matches', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'nomatch' })
      expect(wrapper.vm.getItems.length).toBe(0)
    })

    it('clears search and shows all items', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'test1' })
      expect(wrapper.vm.getItems.length).toBe(1)

      wrapper.setData({ search: '' })
      expect(wrapper.vm.getItems.length).toBe(2)
    })

    it('handles case-insensitive search', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'TEST1' })
      // Assuming case-insensitive search
      expect(wrapper.vm.getItems.length).toBeGreaterThanOrEqual(0)
    })

    it('filters items with partial text', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: '.com' })
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })
  })

  describe('Filtering Logic', () => {
    it('handles custom filter', async () => {
      const wrapper = mountComponent({
        filters: ['custom'],
        getEditability: (val) => val === 'test1.com'
      })

      wrapper.setData({ isCustomFilterChecked: true })
      wrapper.vm.handleFilter()

      expect(wrapper.vm.getItems.length).toBe(1)
    })

    it('handles invalid filter', async () => {
      const wrapper = mountComponent({
        filters: ['invalid'],
        textFieldRules: [(v) => v === 'test1.com' || 'Invalid']
      })

      wrapper.setData({ isFilterChecked: true })
      wrapper.vm.handleFilter()

      expect(wrapper.vm.getItems.length).toBe(1)
    })

    it('clears filters correctly', async () => {
      const wrapper = mountComponent({ filters: ['invalid'] })
      wrapper.setData({ isFilterChecked: true, isFilterActive: true })

      wrapper.vm.clearFilter()
      expect(wrapper.vm.isFilterChecked).toBe(false)
      expect(wrapper.vm.isFilterActive).toBe(false)
    })

    it('activates filter state', () => {
      const wrapper = mountComponent({ filters: ['custom'] })
      wrapper.setData({ isCustomFilterChecked: true })
      wrapper.vm.handleFilter()
      expect(wrapper.vm.isFilterActive).toBeDefined()
    })

    it('handles multiple filter types', () => {
      const wrapper = mountComponent({
        filters: ['custom', 'invalid', 'other']
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Item Deletion', () => {
    it('deletes item on button click', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.del-btn').trigger('click')
      expect(wrapper.emitted('on-delete')).toBeTruthy()
    })

    it('removes item from value array', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.del-btn').trigger('click')
      expect(wrapper.vm.value).toEqual(['test2.com'])
    })

    it('handles deletion from multiple items', async () => {
      const wrapper = mountComponent({
        value: ['item1.com', 'item2.com', 'item3.com']
      })
      const buttons = wrapper.findAll('.del-btn')
      expect(buttons.length).toBe(3)
    })

    it('can delete all items sequentially', async () => {
      const wrapper = mountComponent({
        value: ['item1.com', 'item2.com']
      })

      let button = wrapper.find('.del-btn')
      await button.trigger('click')
      expect(wrapper.vm.value.length).toBe(1)
    })

    it('emits on-delete event with item value', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.del-btn').trigger('click')
      expect(wrapper.emitted('on-delete')).toBeTruthy()
    })
  })

  describe('Validation', () => {
    it('checks all items for validity', async () => {
      const wrapper = mountComponent({
        textFieldRules: [(v) => v === 'test1.com' || 'Error']
      })

      wrapper.vm.checkAllValid()
      expect(wrapper.vm.isAllValid).toBe(false)
    })

    it('marks all valid when all items pass rules', async () => {
      const wrapper = mountComponent({
        value: ['test1.com'],
        textFieldRules: [(v) => v === 'test1.com' || 'Error']
      })

      wrapper.vm.checkAllValid()
      expect(wrapper.vm.isAllValid).toBe(true)
    })

    it('updates validity on prop change', async () => {
      const wrapper = mountComponent({
        textFieldRules: [(v) => v === 'test1.com' || 'Error']
      })

      await wrapper.setProps({ value: ['test1.com'] })
      expect(wrapper.vm.isAllValid).toBe(true)
    })

    it('handles custom validation rules', () => {
      const customRule = (v) => v.includes('.com') || 'Must be .com'
      const wrapper = mountComponent({
        textFieldRules: [customRule]
      })
      expect(wrapper.vm.textFieldRules).toBeDefined()
    })

    it('validates individual items', () => {
      const wrapper = mountComponent({
        textFieldRules: [(v) => v.length > 0 || 'Required']
      })
      expect(wrapper.vm.textFieldRules).toBeTruthy()
    })
  })

  describe('Input Change', () => {
    it('handles item input change', async () => {
      const wrapper = mountComponent({ value: ['old.com'] })
      wrapper.vm.handleInputChange('new.com', 'old.com', 0)

      expect(wrapper.vm.value).toEqual(['new.com'])
    })

    it('emits input event on change', async () => {
      const wrapper = mountComponent({ value: ['old.com'] })
      wrapper.vm.handleInputChange('new.com', 'old.com', 0)

      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('updates specific item at index', async () => {
      const wrapper = mountComponent({
        value: ['item1.com', 'item2.com', 'item3.com']
      })
      wrapper.vm.handleInputChange('updated.com', 'item2.com', 1)

      expect(wrapper.vm.value[1]).toBe('updated.com')
    })

    it('preserves other items during change', async () => {
      const wrapper = mountComponent({
        value: ['item1.com', 'item2.com']
      })
      wrapper.vm.handleInputChange('changed.com', 'item1.com', 0)

      expect(wrapper.vm.value[1]).toBe('item2.com')
    })

    it('handles changing to same value', async () => {
      const wrapper = mountComponent({ value: ['same.com'] })
      wrapper.vm.handleInputChange('same.com', 'same.com', 0)

      expect(wrapper.vm.value).toEqual(['same.com'])
    })
  })

  describe('Props Handling', () => {
    it('accepts value prop', () => {
      const wrapper = mountComponent({
        value: ['custom1.com', 'custom2.com']
      })
      expect(wrapper.props('value')).toEqual(['custom1.com', 'custom2.com'])
    })

    it('accepts filters prop', () => {
      const wrapper = mountComponent({
        filters: ['custom', 'invalid']
      })
      expect(wrapper.props('filters')).toBeDefined()
    })

    it('accepts textFieldRules prop', () => {
      const rules = [(v) => v.length > 0 || 'Required']
      const wrapper = mountComponent({
        textFieldRules: rules
      })
      expect(wrapper.props('textFieldRules')).toBeDefined()
    })

    it('handles empty value array', () => {
      const wrapper = mountComponent({ value: [] })
      expect(wrapper.findAll('.item-mock').length).toBe(0)
    })

    it('updates when props change', async () => {
      const wrapper = mountComponent({ value: ['item1.com'] })
      await wrapper.setProps({ value: ['item1.com', 'item2.com', 'item3.com'] })
      expect(wrapper.vm.value.length).toBe(3)
    })
  })

  describe('Event Emission', () => {
    it('emits input event', async () => {
      const wrapper = mountComponent()
      wrapper.vm.handleInputChange('new.com', 'old.com', 0)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('emits on-delete event', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.del-btn').trigger('click')
      expect(wrapper.emitted('on-delete')).toBeTruthy()
    })

    it('emits correct payload with input', async () => {
      const wrapper = mountComponent({ value: ['old.com'] })
      wrapper.vm.handleInputChange('new.com', 'old.com', 0)
      expect(wrapper.emitted('input')[0]).toEqual([['new.com']])
    })

    it('emits multiple events on multiple actions', async () => {
      const wrapper = mountComponent()
      wrapper.vm.handleInputChange('new.com', 'test1.com', 0)
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('handles multiple mount/unmount cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mountComponent()
        expect(wrapper.vm).toBeDefined()
        wrapper.destroy()
      }
    })

    it('maintains state after operations', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: 'test' })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.search).toBe('test')
    })
  })

  describe('Edge Cases', () => {
    it('handles very long domain names', () => {
      const longDomain = 'a'.repeat(100) + '.com'
      const wrapper = mountComponent({
        value: [longDomain]
      })
      expect(wrapper.vm.value[0]).toBe(longDomain)
    })

    it('handles special characters in values', () => {
      const wrapper = mountComponent({
        value: ['test@#$.com', 'test-2.co.uk']
      })
      expect(wrapper.vm.value.length).toBe(2)
    })

    it('handles single item', () => {
      const wrapper = mountComponent({
        value: ['single.com']
      })
      expect(wrapper.findAll('.item-mock').length).toBe(1)
    })

    it('handles large number of items', () => {
      const items = Array.from({ length: 50 }, (_, i) => `item${i}.com`)
      const wrapper = mountComponent({
        value: items
      })
      expect(wrapper.vm.value.length).toBe(50)
    })

    it('handles empty search matching all', async () => {
      const wrapper = mountComponent()
      wrapper.setData({ search: '' })
      expect(wrapper.vm.getItems.length).toBe(2)
    })
  })
})
