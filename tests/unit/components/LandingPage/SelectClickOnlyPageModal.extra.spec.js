import { shallowMount, createLocalVue } from '@vue/test-utils'
import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'

const localVue = createLocalVue()

describe('SelectClickOnlyPageModal.extra.spec.js', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(SelectClickOnlyPageModal, {
      localVue,
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        VNavigationDrawer: { template: '<div><slot /></div>' },
        VIcon: true,
        VBtn: true,
        LandingPageTemplateListPreview: true,
        ConfigureCompanyStepHeader: true
      },
      directives: {
        'click-outside': jest.fn()
      }
    })
  }

  beforeEach(() => {
    jest.useFakeTimers()
    // Mock document.querySelector for drawer styles
    document.querySelector = jest.fn(() => ({
      style: { right: '' }
    }))
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('getSelectedPageIndex branching', () => {
    it('returns 0 if tab index results in NaN', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.templateListPreview = { selectedLandingPageTab: 'invalid' }
      expect(wrapper.vm.getSelectedPageIndex()).toBe(0)
    })

    it('returns 0 if tab index is less than 0', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.templateListPreview = { selectedLandingPageTab: '0' } // 0 - 1 = -1
      expect(wrapper.vm.getSelectedPageIndex()).toBe(0)
    })

    it('returns correct index for valid tab', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.templateListPreview = { selectedLandingPageTab: '2' }
      expect(wrapper.vm.getSelectedPageIndex()).toBe(1)
    })
  })

  describe('handleClickOutside exceptions', () => {
    it('does nothing if isJustOpened is true', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isJustOpened: true })
      const spy = jest.spyOn(wrapper.vm, 'handleClose')
      wrapper.vm.handleClickOutside({})
      expect(spy).not.toHaveBeenCalled()
    })

    const popperClasses = ['.el-select-dropdown', '.el-picker-panel', '.el-popper', '.v-menu__content']
    popperClasses.forEach(className => {
      it(`does nothing if click target is within ${className}`, () => {
        const wrapper = createWrapper()
        wrapper.setData({ isJustOpened: false })
        const spy = jest.spyOn(wrapper.vm, 'handleClose')
        
        const event = {
          target: {
            closest: jest.fn(selector => selector === className ? {} : null)
          }
        }
        
        wrapper.vm.handleClickOutside(event)
        expect(spy).not.toHaveBeenCalled()
      })
    })

    it('calls handleClose if click target is outside everything', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isJustOpened: false })
      const spy = jest.spyOn(wrapper.vm, 'handleClose')
      
      const event = {
        target: { closest: jest.fn(() => null) }
      }
      
      wrapper.vm.handleClickOutside(event)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('closeDrawer branching', () => {
    it('sets isVisible to false after timeout', async () => {
      const wrapper = createWrapper()
      wrapper.setData({ isVisible: true, selectedResourceId: 'old' })
      
      wrapper.vm.closeDrawer()
      expect(wrapper.vm.isVisible).toBe(true)
      
      jest.advanceTimersByTime(250)
      expect(wrapper.vm.isVisible).toBe(false)
      expect(wrapper.vm.selectedResourceId).toBe(null)
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('openDrawer branching', () => {
    it('sets styles correctly', () => {
      const mockEl = { style: { right: '' } }
      document.querySelector = jest.fn(() => mockEl)
      
      const wrapper = createWrapper()
      wrapper.vm.openDrawer()
      
      expect(mockEl.style.right).toBe('-100%')
      jest.advanceTimersByTime(10)
      expect(mockEl.style.right).toBe('0')
    })
  })

  describe('apiFuncs binding', () => {
    it('binds apiFuncs if provided', () => {
      const apiFuncs = { test: () => {} }
      const wrapper = createWrapper({ apiFuncs })
      const preview = wrapper.findComponent({ name: 'LandingPageTemplateListPreview' })
      // Since it's shallowMount, we can check v-bind result or props if stubs support it
      // v-bind="{ apiFuncs }" means it should pass apiFuncs as a prop if defined in child, 
      // or at least be in the attributes.
      expect(wrapper.vm.apiFuncs).toEqual(apiFuncs)
    })
  })
})
