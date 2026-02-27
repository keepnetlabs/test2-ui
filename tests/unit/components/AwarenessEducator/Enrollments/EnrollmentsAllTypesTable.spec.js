import { shallowMount, createLocalVue } from '@vue/test-utils'
import EnrollmentsAllTypesTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsAllTypesTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()

jest.mock('@/api/awarenessEducator', () => ({
  searchEnrollments: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  exportEnrollments: jest.fn(() => Promise.resolve({ data: new Blob() }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsAllTypesTable.spec.js', () => {
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
            'permissions/getEnrollmentEditPermission': true,
            'permissions/getDeleteEnrollmentPermission': true,
            'trainingLibraryHelpers/getTrainingTypes': [],
            'trainingLibraryHelpers/getPreferredLanguageTypes': [],
            ...getters
          }
        }
      },
      stubs: {
        DataTable: true,
        EnrollmentsTableRowActions: true,
        LanguagesColumn: true
      }
    })
  }

  it('calls callForData on mount', () => {
    createWrapper()
    expect(AwarenessEducatorService.searchEnrollments).toHaveBeenCalled()
  })

  it('enriches results with language names', async () => {
    const results = [
      { 
        enrollmentId: '1', 
        languages: ['EN', 'TR'],
        trainingRoles: [{ roleName: 'Admin' }]
      }
    ]
    AwarenessEducatorService.searchEnrollments.mockResolvedValueOnce({
      data: { data: { results, totalNumberOfRecords: 1 } }
    })
    
    const wrapper = createWrapper({
      languages: [
        { code: 'EN', isoFriendlyName: 'English' },
        { code: 'TR', isoFriendlyName: 'Turkish' }
      ]
    })
    
    await flushPromises()
    
    expect(wrapper.vm.tableData[0].languages).toEqual(['English', 'Turkish'])
    expect(wrapper.vm.tableData[0].targetAudience).toEqual(['Admin'])
  })
})
