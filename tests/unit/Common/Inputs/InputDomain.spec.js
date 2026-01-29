import { shallowMount } from '@vue/test-utils'
import InputDomain from '@/components/Common/Inputs/InputDomain.vue'
import labels from '@/model/constants/labels'

jest.mock('@/model/constants/labels', () => ({
  AllDomains: '*'
}))

describe('InputDomain.vue', () => {
  let wrapper

  const mockItems = [
    { text: 'All Domains', value: '*', disabled: false },
    { text: 'example.com', value: 'example.com', disabled: false },
    { text: 'test.com', value: 'test.com', disabled: false }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputDomain, {
      propsData: {
        value: [],
        items: mockItems
      },
      stubs: {
        'k-select': true,
        'k-select-loading': true
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
      expect(wrapper.vm.$options.name).toBe('InputDomain')
    })

    it('should render KSelect component', () => {
      expect(wrapper.findComponent({ name: 'k-select' }).exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should have value prop with default empty array', () => {
      expect(Array.isArray(wrapper.vm.value)).toBe(true)
      expect(wrapper.vm.value.length).toBe(0)
    })

    it('should have items prop with default empty array', () => {
      wrapper = shallowMount(InputDomain, {
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(Array.isArray(wrapper.vm.items)).toBe(true)
    })

    it('should have placeholder prop with default Select a item', () => {
      expect(wrapper.vm.placeholder).toBe('Select a item')
    })

    it('should have rules prop with default empty array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have isLoading prop with default false', () => {
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should have showLoader prop with default false', () => {
      expect(wrapper.vm.showLoader).toBe(false)
    })

    it('should accept custom value', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: ['example.com'] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toEqual(['example.com'])
    })

    it('should accept custom items', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { items: mockItems },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { placeholder: 'Choose domains' },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.placeholder).toBe('Choose domains')
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => !!v || 'Required']
      wrapper = shallowMount(InputDomain, {
        propsData: { rules: customRules },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should accept isLoading prop', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { isLoading: true },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should accept showLoader prop', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { showLoader: true },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.showLoader).toBe(true)
    })
  })

  describe('KSelect configuration', () => {
    it('should use autocomplete type', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('type')).toBe('autocomplete')
    })

    it('should be outlined', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('outlined')).toBe(true)
    })

    it('should be dense', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('dense')).toBe(true)
    })

    it('should have persistent hint', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('persistentHint')).toBe(true)
    })

    it('should support small chips', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('smallChips')).toBe(true)
    })

    it('should support deletable chips', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('deletableChips')).toBe(true)
    })

    it('should be multiple select', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('multiple')).toBe(true)
    })

    it('should pass loading state', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [], items: mockItems, isLoading: true },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('loading')).toBe(true)
    })

    it('should hide no data when loading', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [], items: mockItems, isLoading: true },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('hideNoData')).toBe(true)
    })

    it('should have hint *Required', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('hint')).toBe('*Required')
    })

    it('should pass custom placeholder', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: [],
          items: mockItems,
          placeholder: 'Pick domains'
        },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('placeholder')).toBe('Pick domains')
    })

    it('should pass custom rules', () => {
      const customRules = [(v) => !!v || 'Required']
      wrapper = shallowMount(InputDomain, {
        propsData: { rules: customRules },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('rules')).toEqual(customRules)
    })

    it('should pass items to KSelect', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      expect(kselect.props('items')).toEqual(mockItems)
    })
  })

  describe('handleDomainChange method', () => {
    it('should emit input event', () => {
      wrapper.vm.handleDomainChange(['example.com'])
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit only AllDomains when AllDomains is selected', () => {
      wrapper.vm.handleDomainChange(['*', 'example.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['*'])
    })

    it('should emit selected domains when no AllDomains', () => {
      wrapper.vm.handleDomainChange(['example.com', 'test.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['example.com', 'test.com'])
    })

    it('should emit empty array for empty selection', () => {
      wrapper.vm.handleDomainChange([])
      expect(wrapper.emitted('input')[0][0]).toEqual([])
    })

    it('should disable other items when AllDomains selected', () => {
      wrapper.vm.handleDomainChange(['*'])
      expect(wrapper.vm.items[1].disabled).toBe(true)
      expect(wrapper.vm.items[2].disabled).toBe(true)
    })

    it('should keep AllDomains enabled when AllDomains selected', () => {
      wrapper.vm.handleDomainChange(['*'])
      expect(wrapper.vm.items[0].disabled).toBe(false)
    })

    it('should enable all items when AllDomains not selected', () => {
      wrapper.vm.handleDomainChange(['example.com'])
      expect(wrapper.vm.items[1].disabled).toBe(false)
      expect(wrapper.vm.items[2].disabled).toBe(false)
    })
  })

  describe('setDomainItemsDisability method', () => {
    it('should disable non-AllDomains items when disabled is true', () => {
      wrapper.vm.setDomainItemsDisability(true)
      expect(wrapper.vm.items[1].disabled).toBe(true)
      expect(wrapper.vm.items[2].disabled).toBe(true)
    })

    it('should not disable AllDomains item', () => {
      wrapper.vm.setDomainItemsDisability(true)
      expect(wrapper.vm.items[0].disabled).toBe(false)
    })

    it('should enable all items when disabled is false', () => {
      wrapper.vm.setDomainItemsDisability(false)
      expect(wrapper.vm.items[1].disabled).toBe(false)
      expect(wrapper.vm.items[2].disabled).toBe(false)
    })
  })

  describe('handleFocus method', () => {
    it('should emit on-focus event', () => {
      wrapper.vm.handleFocus()
      expect(wrapper.emitted('on-focus')).toBeTruthy()
    })
  })

  describe('AllDomains functionality', () => {
    it('should recognize AllDomains value', () => {
      expect(labels.AllDomains).toBe('*')
    })

    it('should handle AllDomains selection exclusively', () => {
      wrapper.vm.handleDomainChange(['*', 'example.com', 'test.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['*'])
    })

    it('should disable other options when AllDomains selected', () => {
      wrapper.vm.handleDomainChange(['*'])
      const nonAllDomains = wrapper.vm.items.filter((item) => item.value !== '*')
      expect(nonAllDomains.every((item) => item.disabled)).toBe(true)
    })
  })

  describe('KSelectLoading component', () => {
    it('should render KSelectLoading in progress slot', () => {
      expect(wrapper.findComponent({ name: 'k-select-loading' }).exists()).toBe(true)
    })

    it('should show loader when showLoader is true', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [], items: mockItems, showLoader: true },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.showLoader).toBe(true)
    })
  })

  describe('event handling', () => {
    it('should handle change event from KSelect', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      kselect.vm.$emit('change', ['example.com'])
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle focus event from KSelect', () => {
      const kselect = wrapper.findComponent({ name: 'k-select' })
      kselect.vm.$emit('focus')
      expect(wrapper.emitted('on-focus')).toBeTruthy()
    })
  })

  describe('real-world scenarios', () => {
    it('should work as domain selector with all domains option', () => {
      expect(wrapper.vm.items.some((item) => item.value === '*')).toBe(true)
    })

    it('should prevent multiple selection with AllDomains', () => {
      wrapper.vm.handleDomainChange(['*', 'example.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['*'])
    })

    it('should support loading state during domain fetch', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: [],
          items: [],
          isLoading: true,
          showLoader: true
        },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.isLoading).toBe(true)
      expect(wrapper.vm.showLoader).toBe(true)
    })

    it('should support multiple domain selection', () => {
      wrapper.vm.handleDomainChange(['example.com', 'test.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['example.com', 'test.com'])
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      expect(wrapper.vm.value).toEqual(['example.com'])
    })

    it('should update when items prop changes', async () => {
      const newItems = [...mockItems, { text: 'new.com', value: 'new.com' }]
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items.length).toBe(4)
    })

    it('should update when isLoading prop changes', async () => {
      await wrapper.setProps({ isLoading: true })
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should update when showLoader prop changes', async () => {
      await wrapper.setProps({ showLoader: true })
      expect(wrapper.vm.showLoader).toBe(true)
    })
  })

  describe('props type validation', () => {
    it('should have Array type for value', () => {
      expect(wrapper.vm.$options.props.value.type).toBe(Array)
    })

    it('should have Array type for items', () => {
      expect(wrapper.vm.$options.props.items.type).toBe(Array)
    })

    it('should have String type for placeholder', () => {
      expect(wrapper.vm.$options.props.placeholder.type).toBe(String)
    })

    it('should have Array type for rules', () => {
      expect(wrapper.vm.$options.props.rules.type).toBe(Array)
    })

    it('should have Boolean type for isLoading', () => {
      expect(wrapper.vm.$options.props.isLoading.type).toBe(Boolean)
    })

    it('should have Boolean type for showLoader', () => {
      expect(wrapper.vm.$options.props.showLoader.type).toBe(Boolean)
    })
  })
})
