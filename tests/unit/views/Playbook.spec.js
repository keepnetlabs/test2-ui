import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Playbook from '@/views/Playbook.vue'

describe('Playbook.vue', () => {
  let store

  const createWrapper = () => {
    store = new Vuex.Store({
      modules: {
        permissions: {
          namespaced: true,
          getters: {
            getPlaybookPermissions: () => ({})
          }
        }
      }
    })
    return shallowMount(Playbook, { store })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name Playbook', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('Playbook')
  })

  it('permissions computed is mapped from store getter', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.permissions).toEqual({})
  })

  describe('beforeRouteLeave', () => {
    const getBeforeRouteLeave = (wrapper) => {
      const guard = wrapper.vm.$options.beforeRouteLeave
      return Array.isArray(guard) ? guard[0] : guard
    }

    it('calls next() when refRules does not exist', () => {
      const next = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = {}
      getBeforeRouteLeave(wrapper).call(wrapper.vm, {}, {}, next)
      expect(next).toHaveBeenCalledWith()
    })

    it('calls next(false) when refRules.showRuleModal is true', () => {
      const next = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refRules: {
          showRuleModal: true,
          checkIfCanCloseRuleModal: jest.fn()
        }
      }
      getBeforeRouteLeave(wrapper).call(wrapper.vm, {}, {}, next)
      expect(next).toHaveBeenCalledWith(false)
      expect(wrapper.vm.$refs.refRules.checkIfCanCloseRuleModal).toHaveBeenCalled()
    })

    it('calls next() when refRules exists but showRuleModal is false', () => {
      const next = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refRules: { showRuleModal: false }
      }
      getBeforeRouteLeave(wrapper).call(wrapper.vm, {}, {}, next)
      expect(next).toHaveBeenCalledWith()
    })
  })
})
