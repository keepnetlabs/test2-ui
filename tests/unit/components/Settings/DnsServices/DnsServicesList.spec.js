const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import DnsServicesList from '@/components/Settings/DnsServices/DnsServicesList.vue'

jest.mock('@/api/dnsServices', () => ({
  getDnsServiceList: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  deleteEmailTemplate: jest.fn().mockResolvedValue({}),
  exportDnsService: jest.fn().mockResolvedValue(mockBlob)
}))

describe('Settings DnsServices DnsServicesList.vue', () => {
  const createWrapper = () => {
    return shallowMount(DnsServicesList, {
      mocks: {
        $store: {
          getters: {
            'permissions/getDnsSearchPermissions': true,
            'permissions/getDnsUpdatePermissions': true,
            'permissions/getDnsDeletePermissions': true,
            'permissions/getDnsExportPermissions': true,
            'permissions/getDnsCreatePermissions': true
          }
        }
      },
      stubs: {
        DataTable: true,
        NewEditDnsService: true,
        DeleteServiceModal: true,
        CantDeleteDnsServiceDialog: true,
        DefaultButtonRowAction: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('handleEdit', () => {
    it('sets resourceId, isEdit and opens modal', () => {
      const wrapper = createWrapper()
      const row = { resourceId: 'r1' }
      wrapper.vm.handleEdit(row)
      expect(wrapper.vm.resourceId).toBe('r1')
      expect(wrapper.vm.isEdit).toBe(true)
      expect(wrapper.vm.modalStatus).toBe(true)
    })
  })

  describe('handleAdd', () => {
    it('sets isEdit false and opens modal', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleAdd()
      expect(wrapper.vm.isEdit).toBe(false)
      expect(wrapper.vm.modalStatus).toBe(true)
    })
  })

  describe('changeStatus', () => {
    it('toggles modalStatus and clears resourceId when value is false', () => {
      const wrapper = createWrapper()
      wrapper.setData({ modalStatus: true, resourceId: 'r1' })
      wrapper.vm.changeStatus(false)
      expect(wrapper.vm.modalStatus).toBe(false)
      expect(wrapper.vm.resourceId).toBe('')
    })
  })

  describe('handleActionDelete', () => {
    it('sets selectedDnsService and shows delete modal when more than one record', () => {
      const wrapper = createWrapper()
      wrapper.setData({ serverSideProps: { totalNumberOfRecords: 5 } })
      const row = { resourceId: 'r1' }
      wrapper.vm.handleActionDelete(row)
      expect(wrapper.vm.selectedDnsService).toEqual(row)
      expect(wrapper.vm.showDeleteModal).toBe(true)
    })

    it('opens cant delete dialog when only one record', () => {
      const wrapper = createWrapper()
      wrapper.setData({ serverSideProps: { totalNumberOfRecords: 1 } })
      const row = { resourceId: 'r1' }
      wrapper.vm.handleActionDelete(row)
      expect(wrapper.vm.isShowCantDeleteDialog).toBe(true)
    })
  })
})

