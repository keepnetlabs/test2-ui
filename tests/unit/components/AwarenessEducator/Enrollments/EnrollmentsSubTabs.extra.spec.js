import { shallowMount, createLocalVue } from '@vue/test-utils'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES, TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const localVue = createLocalVue()

jest.mock('@/api/awarenessEducator', () => ({
  searchEnrollments: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  searchTrash: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getEnrollment: jest.fn(() => Promise.resolve({ data: { data: { trainingId: 't1' } } })),
  restoreEnrollment: jest.fn(() => Promise.resolve()),
  downloadEnrollmentPackage: jest.fn(() => Promise.resolve({ data: new ArrayBuffer(0) })),
  stopReminder: jest.fn(() => Promise.resolve()),
  stopAutoEnroll: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsSubTabs.vue - Extra Branch Coverage', () => {
  const createWrapper = (getters = {}, propsData = {}) => {
    return shallowMount(EnrollmentsSubTabs, {
      localVue,
      propsData: {
        enrollmentStatusEnum: [],
        languages: [],
        ...propsData
      },
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
        $router: { push: jest.fn() }
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

  describe('getEditEnrollmentsModalTitle Branching', () => {
    it('returns Infographic title', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Infographic Enrollment')
    })

    it('returns default Training title for other types', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { type: 'Other' } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Training Enrollment')
    })
  })

  describe('handleRouteToReport Branching', () => {
    const testCases = [
      { type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC, expected: 2 },
      { type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER, expected: 3 },
      { type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH, expected: 4 },
      { type: TRAINING_LIBRARY_TYPES.LEARNING_PATH, expected: 4 }
    ]

    testCases.forEach(({ type, expected }) => {
      it(`sets trainingType ${expected} for ${type}`, () => {
        const wrapper = createWrapper()
        wrapper.vm.handleRouteToReport({ enrollmentId: '1', type })
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
          expect.objectContaining({ query: { trainingType: expected } })
        )
      })
    })

    it('sets trainingType 0 for unknown type', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleRouteToReport({ enrollmentId: '1', type: 'Unknown' })
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
        expect.objectContaining({ query: { trainingType: 0 } })
      )
    })

    it('pushes Training Report when status is not SCORM Proxy', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleRouteToReport({ enrollmentId: '1', type: 'Training', status: 'Completed' })
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Training Report' })
      )
    })
  })

  describe('getApiFunc branching', () => {
    it('returns searchTrash when isTrash is true', () => {
      const wrapper = createWrapper({}, { isTrash: true })
      expect(wrapper.vm.getApiFunc).toBe(AwarenessEducatorService.searchTrash)
    })

    it('returns searchEnrollments when isTrash is false', () => {
      const wrapper = createWrapper({}, { isTrash: false })
      expect(wrapper.vm.getApiFunc).toBe(AwarenessEducatorService.searchEnrollments)
    })
  })

  describe('handlePreviewRowClick branching', () => {
    it('sets Poster preview for Poster type', async () => {
      const mockSetPoster = jest.fn()
      const wrapper = createWrapper()
      wrapper.setMethods({ setPosterPreviewDialog: mockSetPoster })
      await wrapper.vm.handlePreviewRowClick({
        enrollmentId: 'p1',
        type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
      await flushPromises()
      expect(mockSetPoster).toHaveBeenCalledWith(expect.objectContaining({ type: 'poster' }))
    })

    it('sets Infographic preview for Infographic type', async () => {
      const mockSetInfographic = jest.fn()
      const wrapper = createWrapper()
      wrapper.setMethods({ setInfographicPreviewDialog: mockSetInfographic })
      await wrapper.vm.handlePreviewRowClick({
        enrollmentId: 'i1',
        type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
      await flushPromises()
      expect(mockSetInfographic).toHaveBeenCalledWith(expect.objectContaining({ type: 'infographic' }))
    })

    it('sets Learning Path preview for Learning Path type', async () => {
      const mockSetLearningPath = jest.fn()
      const wrapper = createWrapper()
      wrapper.setMethods({ setLearningPathPreviewDialog: mockSetLearningPath })
      await wrapper.vm.handlePreviewRowClick({
        enrollmentId: 'lp1',
        type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
      await flushPromises()
      expect(mockSetLearningPath).toHaveBeenCalledWith(expect.objectContaining({ status: true }))
    })
  })

  describe('handleRestoreRowClick', () => {
    it('calls restoreEnrollment and refreshes table', async () => {
      const mockCallForData = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = { 'refTableAll Types': [{ callForData: mockCallForData }] }
      wrapper.setData({ tab: 'All Types' })
      await wrapper.vm.handleRestoreRowClick({ enrollmentId: 'restore-1' })
      await flushPromises()
      expect(AwarenessEducatorService.restoreEnrollment).toHaveBeenCalledWith('restore-1')
      expect(mockCallForData).toHaveBeenCalled()
    })
  })

  describe('handleDownloadPackage', () => {
    it('calls downloadEnrollmentPackage and creates download link', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.handleDownloadPackage({ enrollmentId: 'dl-1' })
      await flushPromises()
      expect(AwarenessEducatorService.downloadEnrollmentPackage).toHaveBeenCalledWith('dl-1')
    })
  })

  describe('Stop Auto Enroll branching', () => {
    it('handleStopAutoEnroll sets dialog visible', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleStopAutoEnroll({ enrollmentId: 'ae1' })
      expect(wrapper.vm.selectedRow).toEqual({ enrollmentId: 'ae1' })
      expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(true)
    })

    it('handleCloseStopAutoEnrollDialog hides dialog', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isStopAutoEnrollDialogVisible: true })
      wrapper.vm.handleCloseStopAutoEnrollDialog()
      expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(false)
    })

    it('handleConfirmStopAutoEnroll calls API and refreshes', async () => {
      const mockCallForData = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = { 'refTableAll Types': [{ callForData: mockCallForData }] }
      wrapper.setData({ selectedRow: { enrollmentId: 'stop-ae1' }, tab: 'All Types' })
      await wrapper.vm.handleConfirmStopAutoEnroll()
      await flushPromises()
      expect(AwarenessEducatorService.stopAutoEnroll).toHaveBeenCalledWith('stop-ae1')
      expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(false)
      expect(mockCallForData).toHaveBeenCalled()
    })
  })

  describe('handleCloseStopReminderDialog', () => {
    it('hides stop reminder dialog', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isStopReminderDialogVisible: true })
      wrapper.vm.handleCloseStopReminderDialog()
      expect(wrapper.vm.isStopReminderDialogVisible).toBe(false)
    })
  })

  describe('Dialog toggles with forceUpdate', () => {
    it('toggleShowDeleteEnrollmentsDialog with forceUpdate refreshes table', () => {
      const mockCallForData = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = { 'refTableAll Types': [{ callForData: mockCallForData }] }
      wrapper.setData({ isShowDeleteEnrollmentsDialog: true, tab: 'All Types' })
      wrapper.vm.toggleShowDeleteEnrollmentsDialog(true)
      expect(mockCallForData).toHaveBeenCalled()
    })

    it('toggleShowEditEnrollmentModal with forceUpdate refreshes table', () => {
      const mockCallForData = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = { 'refTableAll Types': [{ callForData: mockCallForData }] }
      wrapper.setData({ isShowEditEnrollmentModal: true, tab: 'All Types' })
      wrapper.vm.toggleShowEditEnrollmentModal(true)
      expect(mockCallForData).toHaveBeenCalled()
    })

    it('toggleShowSendEnrollmentDialog with forceUpdate refreshes table', () => {
      const mockCallForData = jest.fn()
      const wrapper = createWrapper()
      wrapper.vm.$refs = { 'refTableAll Types': [{ callForData: mockCallForData }] }
      wrapper.setData({ isShowSendEnrollmentDialog: true, tab: 'All Types' })
      wrapper.vm.toggleShowSendEnrollmentDialog(true)
      expect(mockCallForData).toHaveBeenCalled()
    })
  })

  describe('Dialog Toggles', () => {
    it('toggleShowPermanentlyDeleteDialog resets selectedRow when closing', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isShowDeletePermanentlyDialog: true, selectedRow: { id: 1 } })
      wrapper.vm.toggleShowPermanentlyDeleteDialog()
      expect(wrapper.vm.selectedRow).toBe(null)
    })

    it('toggleShowEditEnrollmentModal toggles visibility', () => {
      const wrapper = createWrapper()
      wrapper.vm.toggleShowEditEnrollmentModal()
      expect(wrapper.vm.isShowEditEnrollmentModal).toBe(true)
    })
  })

  describe('handleDeleteRowClick', () => {
    it('sets row and shows dialog', () => {
      const wrapper = createWrapper()
      const row = { id: 5 }
      wrapper.vm.handleDeleteRowClick(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDeleteEnrollmentsDialog).toBe(true)
    })
  })
})
