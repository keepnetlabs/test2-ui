import Companies from '@/views/Companies.vue'

describe('Companies.vue', () => {
  it('created switches tab to company groups when companies permission is missing', () => {
    const ctx = {
      tab: 'company-companies',
      getCompaniesSearchPermissions: false,
      getCompanyGroupsSearchPermissions: true
    }

    Companies.created.call(ctx)

    expect(ctx.tab).toBe('company-company-groups')
  })

  it('watch tab resets isLoadState when tab becomes company-companies', () => {
    const ctx = { isLoadState: true }

    Companies.watch.tab.call(ctx, 'company-companies')
    expect(ctx.isLoadState).toBe(false)
  })

  it('beforeRouteEnter sets groups tab when navigating back from Company Group Details', () => {
    const next = jest.fn()
    Companies.beforeRouteEnter({ name: 'Companies' }, { name: 'Company Group Details' }, next)

    const vm = { tab: 'company-companies', isLoadState: false }
    const callback = next.mock.calls[0][0]
    callback(vm)

    expect(vm.tab).toBe('company-company-groups')
    expect(vm.isLoadState).toBe(true)
  })

  it('beforeRouteEnter sets companies tab when navigating to Company Group Details', () => {
    const next = jest.fn()
    Companies.beforeRouteEnter({ name: 'Company Group Details' }, { name: 'Companies' }, next)

    const vm = { tab: 'company-company-groups', isLoadState: true }
    const callback = next.mock.calls[0][0]
    callback(vm)

    expect(vm.tab).toBe('company-companies')
  })

  it('updated syncs tab from route params and enforces permission fallback', () => {
    const ctx = {
      tab: 'company-companies',
      $route: { params: { tab: 'company-company-groups', force: false } },
      getCompaniesSearchPermissions: false
    }

    Companies.updated.call(ctx)
    expect(ctx.tab).toBe('company-company-groups')
  })

  it('beforeRouteLeave blocks navigation and opens leaving dialog for changed form', () => {
    const next = jest.fn()
    const cancelCreateOrEditForm = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const refCompanyList = {
      isShowCreateOrEditModal: true,
      cancelCreateOrEditForm,
      $refs: {
        refCreateOrEditModal: { isFormDataChanged: jest.fn(() => true) }
      }
    }
    const ctx = {
      $refs: { refCompanyList },
      $store: { dispatch }
    }

    Companies.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(next).toHaveBeenCalledWith(false)
    expect(refCompanyList.isShowCreateOrEditModal).toBe(false)
    expect(cancelCreateOrEditForm).toHaveBeenCalledTimes(1)
  })

  it('beforeRouteLeave closes modal directly when form is unchanged', () => {
    const next = jest.fn()
    const refCompanyList = {
      isShowCreateOrEditModal: true,
      $refs: {
        refCreateOrEditModal: { isFormDataChanged: jest.fn(() => false) }
      }
    }
    const ctx = {
      $refs: { refCompanyList },
      $store: { dispatch: jest.fn() }
    }

    Companies.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(refCompanyList.isShowCreateOrEditModal).toBe(false)
    expect(next).not.toHaveBeenCalled()
  })

  it('beforeRouteLeave allows navigation when modal is not open', () => {
    const next = jest.fn()
    const ctx = {
      $refs: { refCompanyList: { isShowCreateOrEditModal: false } },
      $store: { dispatch: jest.fn() }
    }

    Companies.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('changeTabStatus updates active tab', () => {
    const ctx = { tab: 'company-companies' }
    Companies.methods.changeTabStatus.call(ctx, 'company-company-groups')
    expect(ctx.tab).toBe('company-company-groups')
  })
})
