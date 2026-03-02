import { shallowMount, createLocalVue } from '@vue/test-utils'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_TYPES, TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const localVue = createLocalVue()

jest.mock('@/api/awarenessEducator', () => ({
  searchEnrollments: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getEnrollment: jest.fn(() => Promise.resolve({ data: { data: { trainingId: 't1' } } })),
  stopReminder: jest.fn(() => Promise.resolve()),
  stopAutoEnroll: jest.fn(() => Promise.resolve()),
  restoreEnrollment: jest.fn(() => Promise.resolve()),
  downloadEnrollmentPackage: jest.fn(() => Promise.resolve({ data: new ArrayBuffer(0) }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsSubTabs.spec.js', () => {
  const createWrapper = (getters = {}) => {
    return shallowMount(EnrollmentsSubTabs, {
      localVue,
      mocks: {
        $store: {
          getters: {
            'trainingLibrary/getTrainingPreviewDialog': {},
            'trainingLibrary/getPosterPreviewDialog': {},
            'trainingLibrary/getInfographicPreviewDialog': {},
            'trainingLibrary/getScreensaverPreviewDialog': {},
            'trainingLibrary/getLearningPathPreviewDialog': {},
            'trainingLibrary/getSurveyPreviewDialog': {},
            'trainingLibrary/getLightbox': {},
            'trainingLibrary/getNestedDrawer': {},
            'trainingLibrary/getDeepNestedDrawer': {},
            ...getters
          },
          dispatch: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      },
      stubs: {
        TrainingLibraryCommonComponents: true,
        EditEnrollmentsModal: true,
        SendEnrollmentDialog: true,
        DeleteEnrollmentDialog: true,
        TrashDeletePermanentlyDialog: true,
        StopEnrollmentDialog: true,
        StopReminderDialog: true,
        StopAutoEnrollDialog: true,
        ElTabs: true,
        ElTabPane: true,
        EnrollmentsAllTypesTable: true,
        EnrollmentsLearningPathTable: true,
        EnrollmentsTrainingTable: true,
        EnrollmentsSurveyTable: true,
        EnrollmentsPosterTable: true,
        EnrollmentsInfographicTable: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    }
  })

  describe('Computed: getEditEnrollmentsModalTitle', () => {
    it('returns Survey title if hasQuiz is true', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { hasQuiz: true } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Survey Enrollment')
    })

    it('returns Poster title for Poster type', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Poster Enrollment')
    })

    it('returns Learning Path title for Learning Path type', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Learning Path Enrollment')
    })
  })

  describe('Methods: Preview Logic', () => {
    it('handlePreviewRowClick calls API and sets Training Preview for Training type', async () => {
      const mockSetTraining = jest.fn()
      const wrapper = createWrapper()
      wrapper.setMethods({ setTrainingPreviewDialog: mockSetTraining })
      
      await wrapper.vm.handlePreviewRowClick({ enrollmentId: 'e1', type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING })
      await flushPromises()
      
      expect(AwarenessEducatorService.getEnrollment).toHaveBeenCalledWith('e1')
      expect(mockSetTraining).toHaveBeenCalledWith(expect.objectContaining({ status: true }))
    })

    it('handlePreviewRowClick sets Survey Preview for Survey type', async () => {
      const mockSetSurvey = jest.fn()
      const wrapper = createWrapper()
      wrapper.setMethods({ setSurveyPreviewDialog: mockSetSurvey })
      
      await wrapper.vm.handlePreviewRowClick({ enrollmentId: 's1', type: TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY })
      await flushPromises()
      
      expect(mockSetSurvey).toHaveBeenCalled()
    })
  })

  describe('Methods: Report Navigation', () => {
    it('handleRouteToReport pushes Scorm Proxy Report for its status', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleRouteToReport({ enrollmentId: 'r1', status: 'SCORM Proxy', type: 'Training' })
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(expect.objectContaining({ name: 'Scorm Proxy Report' }))
    })

    it('handleRouteToReport sets trainingType 1 for Poster', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleRouteToReport({ enrollmentId: 'p1', type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER })
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(expect.objectContaining({ query: { trainingType: 1 } }))
    })
  })

  describe('Methods: Stop Actions', () => {
    it('handleConfirmStopReminder calls API and refreshes table', async () => {
      const wrapper = createWrapper()
      const mockCallForData = jest.fn()
      wrapper.vm.$refs = { 'refTableAll Types': [{ callForData: mockCallForData }] }
      wrapper.setData({ selectedRow: { enrollmentId: 'stop1' }, tab: 'All Types' })
      
      await wrapper.vm.handleConfirmStopReminder()
      await flushPromises()
      
      expect(AwarenessEducatorService.stopReminder).toHaveBeenCalledWith('stop1')
      expect(mockCallForData).toHaveBeenCalled()
    })
  })
})
