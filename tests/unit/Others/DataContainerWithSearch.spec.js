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
})
