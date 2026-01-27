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
        'k-select-loading': true
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
    expect(wrapper.find('k-select-loading-stub').exists()).toBe(true)
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
})
