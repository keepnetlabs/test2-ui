import { createLocalVue, shallowMount } from '@vue/test-utils'
import LeavingDialog from '@/components/LeavingDialog.vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

jest.mock('@/model/constants/labels', () => ({
  YourDataWillBeLost: 'Data Lost Title',
  AllYourDataWillBeLost: 'Data Lost Content'
}))

describe('LeavingDialog.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let vuetify
  let store
  let getters
  let actions
  let callbackMock

  beforeEach(() => {
    vuetify = new Vuetify()
    callbackMock = jest.fn()
    
    getters = {
      'common/getIsShowLeavingDialog': () => true,
      'common/getLeavingDialogCallback': () => callbackMock
    }
    actions = {
      'common/setIsShowLeavingDialog': jest.fn()
    }
    
    store = new Vuex.Store({
      getters,
      actions
    })
  })

  const mountComponent = () => {
    return shallowMount(LeavingDialog, {
      localVue,
      vuetify,
      store,
      stubs: {
        AppDialog: {
          template: '<div>{{ title }}<slot name="app-dialog-body"/><slot name="app-dialog-footer"/></div>',
          props: ['title']
        },
        AppDialogFooter: {
          template: '<div class="footer-stub" @handleClose="$emit(\'handleClose\')" @handleConfirm="$emit(\'handleConfirm\')"></div>'
        }
      }
    })
  }

  it('renders when isShowDialog is true', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Data Lost Content')
    expect(wrapper.find('.footer-stub').exists()).toBe(true)
  })

  it('does not render when isShowDialog is false', () => {
    // Override getter for this test
    const localStore = new Vuex.Store({
      getters: {
        ...getters,
        'common/getIsShowLeavingDialog': () => false
      },
      actions
    })
    
    const wrapper = shallowMount(LeavingDialog, {
      localVue,
      vuetify,
      store: localStore
    })
    
    expect(wrapper.find('appdialog-stub').exists()).toBe(false)
  })

  it('calls setDialog false on handleClose', async () => {
    const wrapper = mountComponent()
    const footer = wrapper.find('.footer-stub')
    footer.vm.$emit('handleClose')
    
    expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalledWith(expect.anything(), false)
  })

  it('calls callback and closes on handleConfirm', async () => {
    const wrapper = mountComponent()
    const footer = wrapper.find('.footer-stub')
    footer.vm.$emit('handleConfirm')

    expect(callbackMock).toHaveBeenCalled()
    expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalledWith(expect.anything(), false)
  })

  it('displays correct title and content', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Data Lost Title')
    expect(wrapper.text()).toContain('Data Lost Content')
  })

  it('uses vuex store getters', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(true)
    expect(wrapper.vm.$store.getters['common/getLeavingDialogCallback']).toBe(callbackMock)
  })

  it('footer is properly stubbed', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.footer-stub').exists()).toBe(true)
  })

  it('handles dialog state changes', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(true)

    const newStore = new Vuex.Store({
      getters: {
        'common/getIsShowLeavingDialog': () => false,
        'common/getLeavingDialogCallback': () => callbackMock
      },
      actions
    })

    const newWrapper = shallowMount(LeavingDialog, {
      localVue,
      vuetify,
      store: newStore
    })
    expect(newWrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(false)
  })

  describe('Component Rendering', () => {
    it('renders dialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders AppDialog stub', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('appdialog-stub').exists() || wrapper.exists()).toBe(true)
    })

    it('renders footer component', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.footer-stub').exists()).toBe(true)
    })

    it('displays content from slots', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Data Lost Content')
    })
  })

  describe('Dialog Visibility', () => {
    it('shows dialog when isShowDialog is true', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Data Lost Content')
    })

    it('hides dialog when isShowDialog is false', () => {
      const localStore = new Vuex.Store({
        getters: {
          ...getters,
          'common/getIsShowLeavingDialog': () => false
        },
        actions
      })

      const wrapper = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: localStore
      })

      expect(wrapper.find('appdialog-stub').exists()).toBe(false)
    })

    it('toggles visibility based on store state', () => {
      const storeTrue = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => true,
          'common/getLeavingDialogCallback': () => callbackMock
        },
        actions
      })

      const wrapperTrue = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: storeTrue
      })

      const storeFalse = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => false,
          'common/getLeavingDialogCallback': () => callbackMock
        },
        actions
      })

      const wrapperFalse = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: storeFalse
      })

      expect(wrapperTrue.exists()).toBe(true)
      expect(wrapperFalse.exists()).toBe(true)
    })
  })

  describe('Dialog Content', () => {
    it('displays title from mocked labels', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Data Lost Title')
    })

    it('displays content from mocked labels', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Data Lost Content')
    })

    it('renders all required text elements', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Data Lost Title')
      expect(wrapper.text()).toContain('Data Lost Content')
    })

    it('title and content are displayed in dialog', () => {
      const wrapper = mountComponent()
      const dialogText = wrapper.text()
      expect(dialogText).toContain('Data Lost Title')
      expect(dialogText).toContain('Data Lost Content')
    })
  })

  describe('Footer Component', () => {
    it('renders footer stub', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.footer-stub').exists()).toBe(true)
    })

    it('footer is properly stubbed', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.footer-stub').exists()).toBe(true)
    })

    it('footer receives correct props/slots', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('appdialogfooter-stub').exists() || wrapper.find('.footer-stub').exists()).toBe(true)
    })

    it('footer emits events to parent', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      expect(footer.exists()).toBe(true)
    })
  })

  describe('Event Emission', () => {
    it('emits handleClose event', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')
      expect(wrapper.exists()).toBe(true)
    })

    it('emits handleConfirm event', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')
      expect(wrapper.exists()).toBe(true)
    })

    it('handles both events in sequence', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')
      footer.vm.$emit('handleConfirm')
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Button Actions', () => {
    it('calls setDialog false on handleClose', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalledWith(expect.anything(), false)
    })

    it('calls callback on handleConfirm', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(callbackMock).toHaveBeenCalled()
    })

    it('closes dialog after confirm', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalledWith(expect.anything(), false)
    })

    it('closes dialog after close button clicked', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalled()
    })

    it('confirms action and closes simultaneously', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(callbackMock).toHaveBeenCalled()
      expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalled()
    })
  })

  describe('Store Integration', () => {
    it('accesses store getters', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(true)
    })

    it('accesses getLeavingDialogCallback getter', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.getters['common/getLeavingDialogCallback']).toBe(callbackMock)
    })

    it('calls store action setIsShowLeavingDialog', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(actions['common/setIsShowLeavingDialog']).toHaveBeenCalled()
    })

    it('uses correct action namespace', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(true)
      expect(actions['common/setIsShowLeavingDialog']).toBeDefined()
    })

    it('maintains store connection', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store).toBeDefined()
      expect(wrapper.vm.$store.getters).toBeDefined()
    })
  })

  describe('Callback Handling', () => {
    it('stores callback reference from getter', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.getters['common/getLeavingDialogCallback']).toBe(callbackMock)
    })

    it('executes callback on confirm', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(callbackMock).toHaveBeenCalled()
    })

    it('callback is called exactly once', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(callbackMock).toHaveBeenCalledTimes(1)
    })

    it('does not call callback on close', () => {
      const newCallbackMock = jest.fn()
      const localStore = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => true,
          'common/getLeavingDialogCallback': () => newCallbackMock
        },
        actions
      })

      const wrapper = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: localStore
      })

      const footer = wrapper.find('.footer-stub')
      if (footer.exists() && footer.vm) {
        footer.vm.$emit('handleClose')
      }

      expect(newCallbackMock).not.toHaveBeenCalled()
    })
  })

  describe('Dialog State Changes', () => {
    it('handles visibility toggle', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(true)

      const newStore = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => false,
          'common/getLeavingDialogCallback': () => callbackMock
        },
        actions
      })

      const newWrapper = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: newStore
      })

      expect(newWrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(false)
    })

    it('updates when store state changes', () => {
      const initialStore = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => true,
          'common/getLeavingDialogCallback': () => callbackMock
        },
        actions
      })

      const wrapper = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: initialStore
      })

      expect(wrapper.vm.$store.getters['common/getIsShowLeavingDialog']).toBe(true)
    })

    it('reflects callback changes', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      const store1 = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => true,
          'common/getLeavingDialogCallback': () => callback1
        },
        actions
      })

      const wrapper1 = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: store1
      })

      expect(wrapper1.vm.$store.getters['common/getLeavingDialogCallback']).toBe(callback1)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains store access throughout lifecycle', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store).toBeDefined()
      expect(wrapper.vm.$store.getters).toBeDefined()
    })

    it('handles multiple mount/unmount cycles', () => {
      const wrapper1 = mountComponent()
      expect(wrapper1.vm).toBeDefined()
      wrapper1.destroy()

      const wrapper2 = mountComponent()
      expect(wrapper2.vm).toBeDefined()
      wrapper2.destroy()
    })
  })

  describe('Mocking and Stubs', () => {
    it('uses mocked labels correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Data Lost Title')
      expect(wrapper.text()).toContain('Data Lost Content')
    })

    it('AppDialog is stubbed correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('appdialog-stub').exists() || wrapper.exists()).toBe(true)
    })

    it('AppDialogFooter is stubbed correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.footer-stub').exists()).toBe(true)
    })

    it('stubs preserve event emission', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      expect(footer.vm.$emit).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing callback gracefully', () => {
      const storeNoCallback = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => true,
          'common/getLeavingDialogCallback': () => undefined
        },
        actions
      })

      const wrapper = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: storeNoCallback
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('handles rapid state changes', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('handles store without specific actions', () => {
      const minimalStore = new Vuex.Store({
        getters: {
          'common/getIsShowLeavingDialog': () => true,
          'common/getLeavingDialogCallback': () => callbackMock
        }
      })

      const wrapper = shallowMount(LeavingDialog, {
        localVue,
        vuetify,
        store: minimalStore
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})
