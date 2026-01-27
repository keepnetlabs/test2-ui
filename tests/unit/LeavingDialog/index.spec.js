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
          template: '<div><slot name="app-dialog-body"/><slot name="app-dialog-footer"/></div>'
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
})
