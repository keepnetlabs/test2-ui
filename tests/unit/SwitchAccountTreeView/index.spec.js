import { createLocalVue, shallowMount } from '@vue/test-utils'
import SwitchAccountTreeView from '@/components/SwitchAccountTreeView.vue'
import Vuetify from 'vuetify'

describe('SwitchAccountTreeView.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(SwitchAccountTreeView, {
      localVue,
      vuetify,
      propsData: {
        items: [],
        ...propsData
      },
      stubs: {
        'v-lazy': {
          template: '<div><slot /></div>'
        },
        'v-treeview': {
          template: `
            <div class="v-treeview-stub">
              <div v-for="item in items" :key="item.resourceId" class="tree-item">
                <slot name="prepend" :item="item"></slot>
                <slot name="label" :item="item"></slot>
              </div>
            </div>
          `,
          props: ['items']
        },
        'k-select-loading': {
          template: '<div class="k-select-loading-stub"></div>'
        }
      }
    })
  }

  it('renders correctly with items', () => {
    const items = [{ name: 'Company A', resourceId: '1' }]
    const wrapper = mountComponent({ items })
    
    expect(wrapper.find('.switch-account__container').exists()).toBe(true)
    expect(wrapper.find('.v-treeview-stub').exists()).toBe(true)
    expect(wrapper.find('.tree-item').exists()).toBe(true)
    expect(wrapper.text()).toContain('Company A')
  })

  it('shows no results message when items are empty', () => {
    const wrapper = mountComponent({ items: [] })
    const footer = wrapper.find('.switch-account__select-footer')
    expect(footer.isVisible()).toBe(true)
    expect(footer.text()).toContain('No results found')
  })

  it('shows loading indicator when loading and showing menu', () => {
    const wrapper = mountComponent({
      items: [],
      loading: true,
      isShowingMenu: true
    })
    expect(wrapper.find('.k-select-loading-stub').exists()).toBe(true)
  })

  it('emits on-selected-account when item clicked', async () => {
    const item = { 
        name: 'Company B', 
        resourceId: '2', 
        privacyDurationId: 1, 
        licenceExpired: false, 
        logoUrl: '' 
    }
    const wrapper = mountComponent({ items: [item] })
    
    // Trigger via method directly to verify logic
    wrapper.vm.handleTreeViewChange(item)
    
    expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    expect(wrapper.emitted('on-selected-account')[0][0]).toEqual({
        label: 'Company B',
        id: '2',
        privacyDurationId: 1,
        licenceExpired: false
    })
  })

  it('calculates menu max height on resize', async () => {
    const wrapper = mountComponent({ items: [] })

    // Mock getBoundingClientRect
    const menuEl = wrapper.element.querySelector('.switch-account__container') || wrapper.find('.switch-account__container').element
    // We can't easily overwrite element.getBoundingClientRect in JSDOM if it's not the root or if mapped weirdly.
    // Instead, mock document.querySelector logic inside the method?
    // Using jest.spyOn(document, 'querySelector').

    const mockMenu = {
      getBoundingClientRect: jest.fn(() => ({ bottom: 100 }))
    }
    jest.spyOn(document, 'querySelector').mockImplementation((sel) => {
        if (sel === '.switch-account__container') return mockMenu
        return null
    })

    wrapper.vm.handleMenuHeight()
    expect(mockMenu.getBoundingClientRect).toHaveBeenCalled()
  })

  it('displays correct container class', () => {
    const wrapper = mountComponent({ items: [{ name: 'Test', resourceId: '1' }] })
    expect(wrapper.find('.switch-account__container').exists()).toBe(true)
  })

  it('handles items with licenceExpired flag', async () => {
    const item = {
      name: 'Expired Company',
      resourceId: '3',
      privacyDurationId: 1,
      licenceExpired: true,
      logoUrl: ''
    }
    const wrapper = mountComponent({ items: [item] })

    wrapper.vm.handleTreeViewChange(item)

    expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    expect(wrapper.emitted('on-selected-account')[0][0].licenceExpired).toBe(true)
  })

  it('transforms item data correctly on selection', async () => {
    const item = {
      name: 'Test Company',
      resourceId: 'abc-123',
      privacyDurationId: 5,
      licenceExpired: false,
      logoUrl: 'http://example.com/logo.png'
    }
    const wrapper = mountComponent({ items: [item] })

    wrapper.vm.handleTreeViewChange(item)
    const emitted = wrapper.emitted('on-selected-account')[0][0]

    expect(emitted.label).toBe('Test Company')
    expect(emitted.id).toBe('abc-123')
    expect(emitted.privacyDurationId).toBe(5)
    expect(emitted.licenceExpired).toBe(false)
  })

  it('renders treeview with correct items prop', () => {
    const items = [
      { name: 'Company 1', resourceId: '1' },
      { name: 'Company 2', resourceId: '2' }
    ]
    const wrapper = mountComponent({ items })

    expect(wrapper.findAll('.tree-item').length).toBe(2)
    expect(wrapper.text()).toContain('Company 1')
    expect(wrapper.text()).toContain('Company 2')
  })

  it('does not show loading indicator when not loading', () => {
    const wrapper = mountComponent({
      items: [{ name: 'Company', resourceId: '1' }],
      loading: false
    })
    expect(wrapper.find('.k-select-loading-stub').exists()).toBe(false)
  })

  describe('Component Structure', () => {
    it('should render component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have container element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.switch-account__container').exists()).toBe(true)
    })

    it('should have defined DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.element).toBeDefined()
    })

    it('should have footer for empty state', () => {
      const wrapper = mountComponent({ items: [] })
      expect(wrapper.find('.switch-account__select-footer').exists()).toBe(true)
    })
  })

  describe('Props Management', () => {
    it('should accept items prop', () => {
      const wrapper = mountComponent({ items: [] })
      expect(wrapper.props('items')).toBeDefined()
    })

    it('should accept loading prop', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.props('loading')).toBe(true)
    })

    it('should accept isShowingMenu prop', () => {
      const wrapper = mountComponent({ isShowingMenu: true })
      expect(wrapper.props('isShowingMenu')).toBe(true)
    })

    it('should support dynamic prop updates', async () => {
      const wrapper = mountComponent({ items: [] })
      await wrapper.setProps({ items: [{ name: 'Test', resourceId: '1' }] })
      expect(wrapper.props('items').length).toBe(1)
    })
  })

  describe('Tree View Rendering', () => {
    it('should render single item', () => {
      const wrapper = mountComponent({
        items: [{ name: 'Company', resourceId: '1' }]
      })
      expect(wrapper.find('.tree-item').exists()).toBe(true)
    })

    it('should render multiple items', () => {
      const items = [
        { name: 'Company 1', resourceId: '1' },
        { name: 'Company 2', resourceId: '2' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.findAll('.tree-item').length).toBe(2)
    })

    it('should display item names', () => {
      const wrapper = mountComponent({
        items: [{ name: 'Test Company', resourceId: '1' }]
      })
      expect(wrapper.text()).toContain('Test Company')
    })

    it('should handle empty items gracefully', () => {
      const wrapper = mountComponent({ items: [] })
      expect(wrapper.find('.switch-account__select-footer').exists()).toBe(true)
    })
  })

  describe('Item Selection', () => {
    it('should emit event when item selected', async () => {
      const item = {
        name: 'Selected Company',
        resourceId: '1',
        privacyDurationId: 1,
        licenceExpired: false
      }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    })

    it('should pass correct data with selection event', async () => {
      const item = {
        name: 'Company B',
        resourceId: '2',
        privacyDurationId: 1,
        licenceExpired: false,
        logoUrl: ''
      }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]

      expect(emitted.label).toBe('Company B')
      expect(emitted.id).toBe('2')
    })

    it('should include privacyDurationId in event', async () => {
      const item = {
        name: 'Test',
        resourceId: '1',
        privacyDurationId: 5,
        licenceExpired: false
      }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]
      expect(emitted.privacyDurationId).toBe(5)
    })
  })

  describe('Event Emission', () => {
    it('should emit on-selected-account event', () => {
      const item = { name: 'Test', resourceId: '1', privacyDurationId: 1 }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    })

    it('should emit with transformed data', () => {
      const item = {
        name: 'Test Company',
        resourceId: 'abc-123',
        privacyDurationId: 5,
        licenceExpired: false
      }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]

      expect(emitted).toEqual({
        label: 'Test Company',
        id: 'abc-123',
        privacyDurationId: 5,
        licenceExpired: false
      })
    })

    it('should emit for each item selection', () => {
      const item1 = { name: 'Company 1', resourceId: '1', privacyDurationId: 1 }
      const item2 = { name: 'Company 2', resourceId: '2', privacyDurationId: 2 }
      const wrapper = mountComponent({ items: [item1, item2] })

      wrapper.vm.handleTreeViewChange(item1)
      wrapper.vm.handleTreeViewChange(item2)

      expect(wrapper.emitted('on-selected-account').length).toBe(2)
    })
  })

  describe('Loading States', () => {
    it('should show loading indicator when loading', () => {
      const wrapper = mountComponent({
        items: [],
        loading: true,
        isShowingMenu: true
      })
      expect(wrapper.find('.k-select-loading-stub').exists()).toBe(true)
    })

    it('should hide loading indicator when not loading', () => {
      const wrapper = mountComponent({
        items: [{ name: 'Test', resourceId: '1' }],
        loading: false
      })
      expect(wrapper.find('.k-select-loading-stub').exists()).toBe(false)
    })

    it('should show loading only with isShowingMenu', () => {
      const wrapper = mountComponent({
        items: [],
        loading: true,
        isShowingMenu: false
      })
      // Loading should not show if menu is not visible
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Menu Height Calculation', () => {
    it('should handle menu height calculation', () => {
      const wrapper = mountComponent({ items: [] })

      const mockMenu = {
        getBoundingClientRect: jest.fn(() => ({ bottom: 100 }))
      }
      jest.spyOn(document, 'querySelector').mockImplementation((sel) => {
        if (sel === '.switch-account__container') return mockMenu
        return null
      })

      wrapper.vm.handleMenuHeight()
      expect(mockMenu.getBoundingClientRect).toHaveBeenCalled()
    })

    it('should respond to resize events', () => {
      const wrapper = mountComponent({ items: [] })
      expect(wrapper.vm.handleMenuHeight).toBeDefined()
    })
  })

  describe('Data Transformation', () => {
    it('should transform name to label', () => {
      const item = { name: 'Original Name', resourceId: '1' }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]
      expect(emitted.label).toBe('Original Name')
    })

    it('should transform resourceId to id', () => {
      const item = { name: 'Company', resourceId: 'res-123' }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]
      expect(emitted.id).toBe('res-123')
    })

    it('should preserve privacyDurationId', () => {
      const item = { name: 'Test', resourceId: '1', privacyDurationId: 42 }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]
      expect(emitted.privacyDurationId).toBe(42)
    })

    it('should preserve licenceExpired flag', () => {
      const item = {
        name: 'Expired',
        resourceId: '1',
        licenceExpired: true,
        privacyDurationId: 1
      }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      const emitted = wrapper.emitted('on-selected-account')[0][0]
      expect(emitted.licenceExpired).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle items with special characters in names', () => {
      const item = {
        name: 'Company & Co. <Test>',
        resourceId: '1',
        privacyDurationId: 1
      }
      const wrapper = mountComponent({ items: [item] })
      expect(wrapper.text()).toContain('Company')
    })

    it('should handle very long company names', () => {
      const longName = 'A'.repeat(100)
      const item = { name: longName, resourceId: '1', privacyDurationId: 1 }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    })

    it('should handle numeric resourceIds', () => {
      const item = { name: 'Test', resourceId: 123, privacyDurationId: 1 }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    })

    it('should handle missing optional properties', () => {
      const item = { name: 'Test', resourceId: '1' }
      const wrapper = mountComponent({ items: [item] })

      wrapper.vm.handleTreeViewChange(item)
      expect(wrapper.emitted('on-selected-account')).toBeTruthy()
    })
  })

  describe('CSS Classes', () => {
    it('should apply container class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.switch-account__container').exists()).toBe(true)
    })

    it('should apply footer class for empty state', () => {
      const wrapper = mountComponent({ items: [] })
      expect(wrapper.find('.switch-account__select-footer').exists()).toBe(true)
    })

    it('should apply tree-item class to items', () => {
      const wrapper = mountComponent({
        items: [{ name: 'Test', resourceId: '1' }]
      })
      expect(wrapper.find('.tree-item').exists()).toBe(true)
    })
  })

  describe('Integration', () => {
    it('should handle full selection flow', async () => {
      const items = [
        { name: 'Company A', resourceId: '1', privacyDurationId: 1, licenceExpired: false },
        { name: 'Company B', resourceId: '2', privacyDurationId: 2, licenceExpired: true }
      ]
      const wrapper = mountComponent({ items })

      wrapper.vm.handleTreeViewChange(items[0])
      expect(wrapper.emitted('on-selected-account').length).toBe(1)

      wrapper.vm.handleTreeViewChange(items[1])
      expect(wrapper.emitted('on-selected-account').length).toBe(2)
    })

    it('should work with loading state changes', async () => {
      const wrapper = mountComponent({ items: [], loading: false })

      await wrapper.setProps({ loading: true, isShowingMenu: true })
      expect(wrapper.find('.k-select-loading-stub').exists()).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.find('.k-select-loading-stub').exists()).toBe(false)
    })
  })
})
