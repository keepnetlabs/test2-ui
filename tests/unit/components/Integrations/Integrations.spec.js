const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import Integrations from '@/components/Integrations/Integrations.vue'

jest.mock('@/api/integrations', () => ({
  getIntegrationList: jest.fn().mockResolvedValue({
    data: {
      data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 }
    }
  }),
  deleteIntegration: jest.fn().mockResolvedValue({}),
  disableIntegration: jest.fn().mockResolvedValue({}),
  enableIntegration: jest.fn().mockResolvedValue({}),
  exportReportedEmails: jest.fn().mockResolvedValue({ data: mockBlob })
}))

describe('Integrations.vue', () => {
  const defaultPermissions = {
    SEARCH: { hasPermission: true },
    UPDATE: { hasPermission: true },
    DISABLE: { hasPermission: true },
    DELETE: { hasPermission: true },
    POST: { hasPermission: true },
    EXPORT: { hasPermission: true }
  }

  const createWrapper = (propsData = {}) => {
    const wrapper = shallowMount(Integrations, {
      propsData: {
        permissions: defaultPermissions,
        ...propsData
      }
    })
    wrapper.vm.$refs.refIntegrationsList = { unSelectRow: jest.fn() }
    return wrapper
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name Integrations', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('Integrations')
  })

  describe('changeModalStatus', () => {
    it('sets modalStatus and clears integrationId', () => {
      const wrapper = createWrapper()
      wrapper.vm.integrationId = '123'
      wrapper.vm.changeModalStatus(true)
      expect(wrapper.vm.modalStatus).toBe(true)
      expect(wrapper.vm.integrationId).toBeNull()
    })

    it('calls callForData when restart is true', () => {
      const wrapper = createWrapper()
      const callForDataSpy = jest.spyOn(wrapper.vm, 'callForData')
      wrapper.vm.changeModalStatus(true, true)
      expect(callForDataSpy).toHaveBeenCalled()
    })

    it('does not call callForData when restart is false', () => {
      const wrapper = createWrapper()
      const callForDataSpy = jest.spyOn(wrapper.vm, 'callForData')
      wrapper.vm.changeModalStatus(true, false)
      expect(callForDataSpy).not.toHaveBeenCalled()
    })
  })

  describe('handleEdit', () => {
    it('sets modalStatus true and integrationId from row', () => {
      const wrapper = createWrapper()
      const row = { resourceId: 'abc-123' }
      wrapper.vm.handleEdit(row)
      expect(wrapper.vm.modalStatus).toBe(true)
      expect(wrapper.vm.integrationId).toBe('abc-123')
    })
  })

  describe('handleActionDelete', () => {
    it('sets selectedIntegration and showDeleteModal', () => {
      const wrapper = createWrapper()
      const row = { resourceId: '1', name: 'Test' }
      wrapper.vm.handleActionDelete(row)
      expect(wrapper.vm.selectedIntegration).toEqual(row)
      expect(wrapper.vm.showDeleteModal).toBe(true)
    })
  })

  describe('checkIfCanCloseNewIntegrationModal', () => {
    it('sets modalStatus to false when modalStatus is true', () => {
      const wrapper = createWrapper()
      wrapper.vm.modalStatus = true
      wrapper.vm.checkIfCanCloseNewIntegrationModal()
      expect(wrapper.vm.modalStatus).toBe(false)
    })

    it('leaves modalStatus false when already false', () => {
      const wrapper = createWrapper()
      wrapper.vm.modalStatus = false
      wrapper.vm.checkIfCanCloseNewIntegrationModal()
      expect(wrapper.vm.modalStatus).toBe(false)
    })
  })

  describe('handleDeleteMultiple', () => {
    it('calls handleDelete for each selection', () => {
      const wrapper = createWrapper()
      const handleDeleteSpy = jest.spyOn(wrapper.vm, 'handleDelete')
      const selections = [{ resourceId: '1' }, { resourceId: '2' }]
      wrapper.vm.handleDeleteMultiple(selections)
      expect(handleDeleteSpy).toHaveBeenCalledTimes(2)
      expect(handleDeleteSpy).toHaveBeenCalledWith({ resourceId: '1' })
      expect(handleDeleteSpy).toHaveBeenCalledWith({ resourceId: '2' })
    })
  })

  describe('handleSearchChange', () => {
    it('maps AnalysisEngineName to analysisEngineTypeId in filter', () => {
      const wrapper = createWrapper()
      const searchFilter = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'AnalysisEngineName', value: 'x' },
                { FieldName: 'Name', value: 'y' }
              ]
            }
          ]
        }
      }
      wrapper.vm.axiosPayload = {
        filter: {
          FilterGroups: [{}, { FilterItems: [] }]
        }
      }
      wrapper.vm.handleSearchChange(searchFilter)
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ FieldName: 'analysisEngineTypeId' }),
          expect.objectContaining({ FieldName: 'Name' })
        ])
      )
    })
  })
})

