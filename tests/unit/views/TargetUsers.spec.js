import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import TargetUsers from '@/views/TargetUsers.vue'
import { getCheckCompanyLicense } from '@/api/company'

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

  it('created maps route params tab values and falls back to groups by permissions', () => {
    const ctxFromFirst = {
      tab: 'target-users--group',
      $route: { params: { tab: 'first' } },
      getTargetUsersSearchPermissions: true,
      getTargetGroupsSearchPermissions: true,
      callForLicenseCheck: jest.fn()
    }
    TargetUsers.created.call(ctxFromFirst)
    expect(ctxFromFirst.tab).toBe('target-users--people')
    expect(ctxFromFirst.callForLicenseCheck).toHaveBeenCalledWith(true)

    const ctxPermissionFallback = {
      tab: 'target-users--people',
      $route: { params: { tab: 'custom-tab' } },
      getTargetUsersSearchPermissions: false,
      getTargetGroupsSearchPermissions: true,
      callForLicenseCheck: jest.fn()
    }
    TargetUsers.created.call(ctxPermissionFallback)
    expect(ctxPermissionFallback.tab).toBe('target-users--group')
  })

  it('beforeRouteEnter sets group tab and load state only for non-people return path', () => {
    const next = jest.fn((cb) => cb(vm))
    const vm = { tab: 'target-users--people', isLoadState: false }
    TargetUsers.beforeRouteEnter({ name: 'Target Users' }, { name: 'Target Group Users', params: { tab: 'second' } }, next)
    expect(vm.tab).toBe('target-users--group')
    expect(vm.isLoadState).toBe(true)

    const nextNoChange = jest.fn((cb) => cb(vm2))
    const vm2 = { tab: 'target-users--people', isLoadState: false }
    TargetUsers.beforeRouteEnter({ name: 'Target Users' }, { name: 'Target Group Users', params: { tab: 'people' } }, nextNoChange)
    expect(vm2.tab).toBe('target-users--people')
    expect(vm2.isLoadState).toBe(false)
  })

  it('callForLicenseCheck opens cachable dialog only when license is exceeded', async () => {
    getCheckCompanyLicense.mockResolvedValueOnce({
      data: { data: { isLimited: true, isLicenseExceeded: true, licenseLimit: 10, activeUserCount: 15 } }
    })
    const ctx = {
      companyLicense: null,
      showLicenseExceededDialog: false,
      getCurrentCompany: { resourceId: 'comp-1' },
      canShowCachableDialog: jest.fn(() => true),
      saveCachableDialogTimestamp: jest.fn()
    }
    localStorage.setItem('companyId', 'company-1')
    TargetUsers.methods.callForLicenseCheck.call(ctx, true)
    await Promise.resolve()
    await Promise.resolve()

    expect(getCheckCompanyLicense).toHaveBeenCalledWith('company-1')
    expect(ctx.showLicenseExceededDialog).toBe(true)
    expect(ctx.canShowCachableDialog).toHaveBeenCalledWith('licenseExceededDialog_comp-1')
    expect(ctx.saveCachableDialogTimestamp).toHaveBeenCalled()
  })

  it('beforeRouteLeave covers delete/import/custom-fields and no-ref branches', () => {
    const next = jest.fn()
    const deleteCtx = {
      $refs: { refPeople: { isWantToShowDeleteUserModal: true, changeDeleteModalStatus: jest.fn() } }
    }
    TargetUsers.beforeRouteLeave.call(deleteCtx, {}, {}, next)
    expect(deleteCtx.$refs.refPeople.changeDeleteModalStatus).toHaveBeenCalledWith(false)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const importCtx = {
      $refs: {
        refPeople: {
          isWantToShowDeleteUserModal: false,
          isWantToShowAddUsersManuallyModal: false,
          isWantToShowAddUsersModal: false,
          isWantToShowImportUsersFromFileModal: true
        }
      }
    }
    TargetUsers.beforeRouteLeave.call(importCtx, {}, {}, next)
    expect(importCtx.$refs.refPeople.isWantToShowImportUsersFromFileModal).toBe(false)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const customFieldsCtx = {
      $refs: {
        refPeople: {
          isWantToShowDeleteUserModal: false,
          isWantToShowAddUsersManuallyModal: false,
          isWantToShowAddUsersModal: false,
          isWantToShowImportUsersFromFileModal: false,
          isWantToShowCustomFieldsModal: true
        }
      }
    }
    TargetUsers.beforeRouteLeave.call(customFieldsCtx, {}, {}, next)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    TargetUsers.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
