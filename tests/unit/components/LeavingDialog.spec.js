import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import LeavingDialog from '@/components/LeavingDialog.vue'

describe('LeavingDialog.vue', () => {
  let store
  const setDialog = jest.fn()

  const createWrapper = (getters = {}) => {
    store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          getters: {
            getIsShowLeavingDialog: () => getters['common/getIsShowLeavingDialog'] ?? false,
            getLeavingDialogCallback: () => getters['common/getLeavingDialogCallback'] ?? (() => {})
          },
          actions: {
            setIsShowLeavingDialog: setDialog
          }
        }
      }
    })
    return shallowMount(LeavingDialog, { store })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('handleClose dispatches setDialog with false', () => {
    const wrapper = createWrapper({ 'common/getIsShowLeavingDialog': true })
    wrapper.vm.handleClose()
    expect(setDialog).toHaveBeenCalledWith(expect.anything(), false)
  })

  it('handleCallback calls callback and handleClose', () => {
    const callback = jest.fn()
    const wrapper = createWrapper({ 'common/getLeavingDialogCallback': callback })
    wrapper.vm.handleCallback()
    expect(callback).toHaveBeenCalled()
    expect(setDialog).toHaveBeenCalled()
  })
})
