import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import TargetUsers from '@/views/TargetUsers.vue'

jest.mock('@/api/company', () => ({
  getCheckCompanyLicense: jest.fn().mockResolvedValue({ data: { data: {} } })
}))

const $route = { params: {}, name: '', query: {} }

describe('TargetUsers.vue', () => {
  let store

  const createWrapper = (getters = {}) => {
    store = new Vuex.Store({
      modules: {
        permissions: {
          namespaced: true,
          getters: {
            getTargetUsersSearchPermissions: () =>
              getters.getTargetUsersSearchPermissions ?? true,
            getTargetGroupsSearchPermissions: () =>
              getters.getTargetGroupsSearchPermissions ?? true
          }
        },
        login: {
          namespaced: true,
          getters: {
            getCurrentCompany: () => getters.getCurrentCompany ?? { resourceId: '1' }
          }
        }
      }
    })
    return shallowMount(TargetUsers, {
      store,
      mocks: { $route, $router: { push: jest.fn(), replace: jest.fn() } }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getDialogBody', () => {
    it('returns empty string when companyLicense is null', () => {
      const wrapper = createWrapper()
      wrapper.vm.companyLicense = null
      expect(wrapper.vm.getDialogBody).toBe('')
    })

    it('uses activeUserCount when available', () => {
      const wrapper = createWrapper()
      wrapper.vm.companyLicense = { licenseLimit: 100, activeUserCount: 50 }
      expect(wrapper.vm.getDialogBody).toContain('100')
      expect(wrapper.vm.getDialogBody).toContain('50')
    })

    it('falls back to totalUserCount when activeUserCount is undefined', () => {
      const wrapper = createWrapper()
      wrapper.vm.companyLicense = { licenseLimit: 200, totalUserCount: 75 }
      expect(wrapper.vm.getDialogBody).toContain('200')
      expect(wrapper.vm.getDialogBody).toContain('75')
    })
  })

  it('changeTabStatus updates tab', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeTabStatus('target-users--group')
    expect(wrapper.vm.tab).toBe('target-users--group')
  })

  it('toggleShowLicenseExceededDialog toggles dialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.showLicenseExceededDialog = false
    wrapper.vm.toggleShowLicenseExceededDialog()
    expect(wrapper.vm.showLicenseExceededDialog).toBe(true)
  })

  it('watch tab sets isLoadState to false when switching to people', () => {
    const wrapper = createWrapper()
    wrapper.vm.isLoadState = true
    const watchHandler = wrapper.vm.$options.watch.tab
    if (typeof watchHandler === 'function') {
      watchHandler.call(wrapper.vm, 'target-users--people')
    } else if (watchHandler?.handler) {
      watchHandler.handler.call(wrapper.vm, 'target-users--people')
    }
    expect(wrapper.vm.isLoadState).toBe(false)
  })

  it('handleRouteToTargetGroup switches to groups tab and sets isOpenTargetGroupModalOnCreated', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleRouteToTargetGroup()
    expect(wrapper.vm.tab).toBe('target-users--group')
    expect(wrapper.vm.isOpenTargetGroupModalOnCreated).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isOpenTargetGroupModalOnCreated).toBe(false)
  })
})
