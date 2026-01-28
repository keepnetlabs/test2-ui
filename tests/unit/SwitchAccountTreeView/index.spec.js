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
})
