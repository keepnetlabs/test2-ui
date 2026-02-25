import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Integrations from '@/views/Integrations.vue'

describe('Integrations.vue', () => {
  let store

  const createWrapper = (getters = {}) => {
    store = new Vuex.Store({
      modules: {
        permissions: {
          namespaced: true,
          getters: {
            getIntegrationPermissions: () =>
              getters.getIntegrationPermissions ?? { SEARCH: { hasPermission: true } },
            getAdvancedSettingsPermissions: () =>
              getters.getAdvancedSettingsPermissions ?? { SEARCH: { hasPermission: true } }
          }
        }
      }
    })
    return shallowMount(Integrations, { store })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name Integrations', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('Integrations')
  })

  describe('computed isRenderIntegrations', () => {
    it('returns true when tab is integrations and has permission', () => {
      const wrapper = createWrapper()
      wrapper.vm.tab = 'integrations'
      expect(wrapper.vm.isRenderIntegrations).toBe(true)
    })

    it('returns false when tab is advanced-settings', () => {
      const wrapper = createWrapper()
      wrapper.vm.tab = 'advanced-settings'
      expect(wrapper.vm.isRenderIntegrations).toBe(false)
    })

    it('returns false when integrationPermissions has no SEARCH permission', () => {
      const wrapper = createWrapper({
        getIntegrationPermissions: { SEARCH: { hasPermission: false } }
      })
      wrapper.vm.tab = 'integrations'
      expect(wrapper.vm.isRenderIntegrations).toBe(false)
    })
  })

  describe('computed isRenderAdvancedSettings', () => {
    it('returns true when tab is advanced-settings and has permission', () => {
      const wrapper = createWrapper()
      wrapper.vm.tab = 'advanced-settings'
      expect(wrapper.vm.isRenderAdvancedSettings).toBe(true)
    })

    it('returns false when tab is integrations', () => {
      const wrapper = createWrapper()
      wrapper.vm.tab = 'integrations'
      expect(wrapper.vm.isRenderAdvancedSettings).toBe(false)
    })
  })

  it('changeTabStatus updates tab', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeTabStatus('advanced-settings')
    expect(wrapper.vm.tab).toBe('advanced-settings')
  })
})
