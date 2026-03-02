import { shallowMount, createLocalVue } from '@vue/test-utils'
import EnrollmentsAllTypesTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsAllTypesTable.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const localVue = createLocalVue()

// Mock URL.createObjectURL for Node.js (used by exportEnrollments)
beforeAll(() => {
  globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
  globalThis.URL.revokeObjectURL = jest.fn()
})

describe('EnrollmentsAllTypesTable.vue - Extra Branch Coverage', () => {
  const createWrapper = (propsData = {}, getters = {}) => {
    return shallowMount(EnrollmentsAllTypesTable, {
      localVue,
      propsData: {
        enrollmentStatusEnum: [],
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getExportEnrollmentPermission': true,
            'trainingLibraryHelpers/getTrainingTypes': [],
            ...getters
          }
        }
      },
      stubs: { DataTable: true, EnrollmentsTableRowActions: true }
    })
  }

  describe('isTrash logic', () => {
    it('uses trash keys when isTrash is true', () => {
      const wrapper = createWrapper({ isTrash: true })
      expect(wrapper.vm.savedFiltersKey).toContain('TrashAllTypes')
    })

    it('uses normal keys when isTrash is false', () => {
      const wrapper = createWrapper({ isTrash: false })
      expect(wrapper.vm.savedFiltersKey).toContain('EnrollmentsAllTypes')
    })
  })

  describe('types watcher', () => {
    it('updates type column filterable items and re-renders', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refTable = { reRenderFilters: jest.fn() }
      
      const types = [{ text: 'Training', value: 1 }, { text: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER, value: 2 }]
      // Trigger watcher - Vue may merge watchers into an array
      const typesWatcher = wrapper.vm.$options.watch.types
      const handler = Array.isArray(typesWatcher) ? typesWatcher[0].handler : typesWatcher.handler
      handler.call(wrapper.vm, types)
      
      const typeCol = wrapper.vm.tableOptions.columns.find(col => col.property === 'type')
      // SCREENSAVER should be filtered out
      expect(typeCol.filterableItems.length).toBe(1)
      expect(wrapper.vm.$refs.refTable.reRenderFilters).toHaveBeenCalled()
    })
  })

  describe('exportEnrollments payload', () => {
    it('sets enrollmentType in export payload', async () => {
      const mockApi = jest.fn(() => Promise.resolve({ data: new Blob() }))
      const AwarenessEducatorService = require('@/api/awarenessEducator').default
      const spy = jest.spyOn(AwarenessEducatorService, 'exportEnrollments').mockImplementation(mockApi)

      const wrapper = createWrapper()
      wrapper.setData({ axiosPayload: { enrollmentType: 'TestType', filter: {}, orderBy: '', ascending: true } })

      wrapper.vm.exportEnrollments({ exportTypes: ['PDF'], pageNumber: 1, pageSize: 10 })

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(mockApi).toHaveBeenCalledWith(expect.objectContaining({ enrollmentType: 'TestType' }))
      spy.mockRestore()
    })
  })
})
