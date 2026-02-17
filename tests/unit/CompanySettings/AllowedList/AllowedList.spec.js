import { shallowMount } from '@vue/test-utils'
import AllowedList from '@/components/Company Settings/AllowedList/AllowedList.vue'
import { getAllowListList, exportAllowList } from '@/api/allowList'

jest.mock('@/api/allowList', () => ({
  getAllowListList: jest.fn(),
  exportAllowList: jest.fn(() => Promise.resolve({ data: Buffer.from('csv') }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AllowedList.vue', () => {
  const createWrapper = ({ canSearch = true, roleName = 'Root' } = {}) =>
    shallowMount(AllowedList, {
      stubs: {
        CompanySettingsHeader: true,
        DataTable: true,
        DeleteDomain: true,
        NewDomaim: true,
        VerifyDomain: true,
        DomainVerified: true,
        DefaultButtonRowAction: true,
        DefaultMenuRowAction: true,
        RowActionsMenu: true,
        MarkAsVerifiedModal: true,
        MarkAsVerifiedSuccessModal: true,
        VOverlay: true
      },
      mocks: {
        $router: { push: jest.fn() },
        $store: {
          getters: {
            'permissions/getAllowListPermissionsSearch': canSearch,
            'permissions/getAllowListPermissionsVerify': true,
            'permissions/getAllowListPermissionsDelete': true,
            'permissions/getAllowListPermissionsExport': true,
            'permissions/getAllowListPermissionsCreate': true,
            'permissions/getSMTPSettingsDeletePermissions': true,
            'auth/userGetter': { role: { name: roleName } }
          }
        }
      },
      methods: {
        callForLanguages: jest.fn()
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getAllowListList.mockResolvedValue({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: []
        }
      }
    })
  })

  it('computes role flag and verify type/status helpers', () => {
    const wrapper = createWrapper({ roleName: 'Reseller' })
    expect(wrapper.vm.isRootOrReseller).toBe(true)
    expect(wrapper.vm.getVerifyTypeText({ status: 'Unverified', verifyType: 1 })).toBe('')
    expect(wrapper.vm.getVerifyTypeText({ status: 'Verified', verifyType: 1 })).toBe(
      'By DNS TXT Record'
    )
    expect(wrapper.vm.getVerifyTypeText({ status: 'Verified', verifyType: 2 })).toBe('By System')
    expect(wrapper.vm.getVerifyTypeText({ status: 'Verified', verifyType: 3 })).toBe(
      'As Primary Domain'
    )
    expect(wrapper.vm.getVerifyTypeText({ status: 'Verified', verifyType: 4 })).toBe(
      'By Reseller'
    )
    expect(wrapper.vm.setStatusColor('Verified')).toContain('#217124')
    expect(wrapper.vm.setStatusColor('Unverified')).toContain('#B6791D')
  })

  it('loads rows and maps verify type when search permission exists', async () => {
    getAllowListList.mockResolvedValue({
      data: {
        data: {
          totalNumberOfRecords: 3,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            { allowListResourceId: 1, status: 'Verified', verifyType: 2, domain: 'a.com' },
            { allowListResourceId: 2, status: 'Unverified', verifyType: 1, domain: 'b.com' }
          ]
        }
      }
    })
    const wrapper = createWrapper({ canSearch: true })

    await flushPromises()

    expect(getAllowListList).toHaveBeenCalledWith(wrapper.vm.axiosPayload)
    expect(wrapper.vm.tableData[0].verifyType).toBe('By System')
    expect(wrapper.vm.tableData[1].verifyType).toBe('')
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(3)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('redirects to root when search permission does not exist', async () => {
    const wrapper = createWrapper({ canSearch: false })
    await flushPromises()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('opens verify popup for newly saved resource in changeNewDomainPopupStatus flow', async () => {
    getAllowListList.mockResolvedValue({
      data: {
        data: {
          results: [{ allowListResourceId: 55, status: 'Verified', verifyType: 4, domain: 'x.com' }]
        }
      }
    })
    const wrapper = createWrapper()

    wrapper.vm.changeNewDomainPopupStatus(true, true, 55)
    await flushPromises()

    expect(wrapper.vm.verifyPopupStatus).toBe(true)
    expect(wrapper.vm.selectedDomain.allowListResourceId).toBe(55)
  })

  it('handles modal and selection actions', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refAllowList = { resetSelectableParams: jest.fn() }
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleMultipleDelete([{ id: 1 }])
    expect(wrapper.vm.selectedDeleteItems).toEqual([{ id: 1 }])
    expect(wrapper.vm.showDeleteModal).toBe(true)

    wrapper.vm.showDeleteModal = false
    wrapper.vm.selectedDeleteItems = []
    wrapper.vm.handleDelete({ id: 2 })
    expect(wrapper.vm.selectedDeleteItems).toEqual([{ id: 2 }])
    expect(wrapper.vm.showDeleteModal).toBe(true)

    wrapper.vm.handleMarkAsVerified({ domain: 'x.com' })
    expect(wrapper.vm.markAsVerifiedPopupStatus).toBe(true)

    wrapper.vm.handleMarkAsVerifiedSuccess()
    expect(wrapper.vm.markAsVerifiedPopupStatus).toBe(false)
    expect(wrapper.vm.markAsVerifiedSuccessPopupStatus).toBe(true)
    expect(wrapper.vm.callForData).toHaveBeenCalled()

    wrapper.vm.handleVerifyDomainPopup()
    expect(wrapper.vm.verifyPopupStatus).toBe(false)
    expect(wrapper.vm.verifiedDomainStatus).toBe(true)

    wrapper.vm.handleSuccessDeleteAction()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.selectedDeleteItems).toEqual([])
    expect(wrapper.vm.$refs.refAllowList.resetSelectableParams).toHaveBeenCalled()
  })

  it('exports with excel mapping and triggers downloads', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement
    const originalCreateObjectURL = window.URL.createObjectURL
    document.createElement = jest.fn(() => ({
      click,
      href: '',
      download: ''
    }))
    window.URL.createObjectURL = jest.fn(() => 'blob:allow')

    wrapper.vm.exportTableData({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 20
    })
    await flushPromises()

    expect(exportAllowList).toHaveBeenCalledTimes(2)
    expect(exportAllowList.mock.calls[0][0].exportType).toBe('Excel')
    expect(exportAllowList.mock.calls[1][0].exportType).toBe('CSV')
    expect(click).toHaveBeenCalledTimes(2)

    document.createElement = originalCreateElement
    window.URL.createObjectURL = originalCreateObjectURL
  })
})
