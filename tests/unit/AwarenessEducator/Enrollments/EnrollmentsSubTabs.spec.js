import { shallowMount } from '@vue/test-utils'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

jest.mock('@/api/awarenessEducator', () => ({
  searchTrash: jest.fn(),
  searchEnrollments: jest.fn(),
  getEnrollment: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          trainingId: 'tr-1'
        }
      }
    })
  ),
  restoreEnrollment: jest.fn(() => Promise.resolve()),
  downloadEnrollmentPackage: jest.fn(() => Promise.resolve({ data: Buffer.from('zip') })),
  stopReminder: jest.fn(() => Promise.resolve()),
  stopAutoEnroll: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsSubTabs.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(EnrollmentsSubTabs, {
      propsData: {
        isTrash: false,
        ...propsData
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
      },
      mocks: {
        $router: {
          push: jest.fn()
        },
        $store: {
          getters: {
            'trainingLibrary/getTrainingPreviewDialog': false,
            'trainingLibrary/getPosterPreviewDialog': false,
            'trainingLibrary/getInfographicPreviewDialog': false,
            'trainingLibrary/getScreensaverPreviewDialog': false,
            'trainingLibrary/getLearningPathPreviewDialog': false,
            'trainingLibrary/getSurveyPreviewDialog': false,
            'trainingLibrary/getLightbox': false,
            'trainingLibrary/getNestedDrawer': false,
            'trainingLibrary/getDeepNestedDrawer': false
          },
          dispatch: jest.fn(() => Promise.resolve())
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('EnrollmentsSubTabs')
  })

  it('computes api function by trash mode', () => {
    const normal = createWrapper({ isTrash: false })
    const trash = createWrapper({ isTrash: true })

    expect(normal.vm.getApiFunc).toBe(AwarenessEducatorService.searchEnrollments)
    expect(trash.vm.getApiFunc).toBe(AwarenessEducatorService.searchTrash)
  })

  it('computes edit modal title by selected row type', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ selectedRow: { hasQuiz: true, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING } })
    expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Survey Enrollment')

    await wrapper.setData({ selectedRow: { hasQuiz: false, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER } })
    expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Poster Enrollment')

    await wrapper.setData({ selectedRow: { hasQuiz: false, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC } })
    expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Infographic Enrollment')

    await wrapper.setData({ selectedRow: { hasQuiz: false, type: TRAINING_LIBRARY_TYPES.LEARNING_PATH } })
    expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Learning Path Enrollment')

    await wrapper.setData({ selectedRow: { hasQuiz: false, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING } })
    expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Training Enrollment')
  })

  it('opens and closes stop reminder dialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleStopReminder({ enrollmentId: 'enr-1' })
    expect(wrapper.vm.selectedRow).toEqual({ enrollmentId: 'enr-1' })
    expect(wrapper.vm.isStopReminderDialogVisible).toBe(true)

    wrapper.vm.handleCloseStopReminderDialog()
    expect(wrapper.vm.isStopReminderDialogVisible).toBe(false)
  })

  it('confirms stop reminder and refreshes active table', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = [{ callForData }]
    wrapper.vm.selectedRow = { enrollmentId: 'enr-2' }
    wrapper.vm.isStopReminderDialogVisible = true

    wrapper.vm.handleConfirmStopReminder()
    await flushPromises()

    expect(AwarenessEducatorService.stopReminder).toHaveBeenCalledWith('enr-2')
    expect(wrapper.vm.isStopReminderDialogVisible).toBe(false)
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('confirms stop auto enroll and refreshes active table', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = [{ callForData }]
    wrapper.vm.selectedRow = { enrollmentId: 'enr-22' }
    wrapper.vm.isStopAutoEnrollDialogVisible = true

    wrapper.vm.handleConfirmStopAutoEnroll()
    await flushPromises()

    expect(AwarenessEducatorService.stopAutoEnroll).toHaveBeenCalledWith('enr-22')
    expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(false)
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('opens and closes stop auto enroll dialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleStopAutoEnroll({ enrollmentId: 'enr-5' })
    expect(wrapper.vm.selectedRow).toEqual({ enrollmentId: 'enr-5' })
    expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(true)

    wrapper.vm.handleCloseStopAutoEnrollDialog()
    expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(false)
  })

  it('downloads enrollment package as zip', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement
    const originalCreateObjectURL = window.URL.createObjectURL

    document.createElement = jest.fn(() => ({
      click,
      href: '',
      download: ''
    }))
    window.URL.createObjectURL = jest.fn(() => 'blob:enrollment')

    wrapper.vm.handleDownloadPackage({ enrollmentId: 'enr-zip' })
    await flushPromises()

    expect(AwarenessEducatorService.downloadEnrollmentPackage).toHaveBeenCalledWith('enr-zip')
    expect(window.URL.createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()

    document.createElement = originalCreateElement
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('toggles delete/edit/send dialogs and resets selected row on close', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = [{ callForData }]

    wrapper.vm.handleDeleteRowClick({ enrollmentId: 'e1' })
    expect(wrapper.vm.isShowDeleteEnrollmentsDialog).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual({ enrollmentId: 'e1' })
    wrapper.vm.toggleShowDeleteEnrollmentsDialog(true)
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isShowDeleteEnrollmentsDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBeNull()

    wrapper.vm.handleEditRowClick({ enrollmentId: 'e2', type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING })
    expect(wrapper.vm.isShowEditEnrollmentModal).toBe(true)
    wrapper.vm.toggleShowEditEnrollmentModal(true)
    expect(wrapper.vm.isShowEditEnrollmentModal).toBe(false)
    expect(wrapper.vm.selectedRow).toBeNull()

    wrapper.vm.handleSend({ enrollmentId: 'e3' })
    expect(wrapper.vm.isShowSendEnrollmentDialog).toBe(true)
    wrapper.vm.toggleShowSendEnrollmentDialog(true)
    expect(wrapper.vm.isShowSendEnrollmentDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBeNull()
  })

  it('handles restore and refreshes active table', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = [{ callForData }]

    wrapper.vm.handleRestoreRowClick({ enrollmentId: 'restore-1' })
    await flushPromises()

    expect(AwarenessEducatorService.restoreEnrollment).toHaveBeenCalledWith('restore-1')
    expect(callForData).toHaveBeenCalled()
  })

  it('toggles permanently delete dialog and refreshes when forced', () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = { refTable: { callForData } }
    wrapper.vm.selectedRow = { enrollmentId: 'perm-1' }

    wrapper.vm.toggleShowPermanentlyDeleteDialog(true)
    expect(wrapper.vm.isShowDeletePermanentlyDialog).toBe(true)
    expect(callForData).toHaveBeenCalledTimes(1)

    wrapper.vm.toggleShowPermanentlyDeleteDialog()
    expect(wrapper.vm.isShowDeletePermanentlyDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBeNull()
  })

  it('handleDeleteSuccess and handleDuplicateSuccess call table refresh only when ref exists', () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = 'NotExistingTab'

    wrapper.vm.handleDeleteSuccess()
    wrapper.vm.handleDuplicateSuccess()
    expect(callForData).not.toHaveBeenCalled()

    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = [{ callForData }]
    wrapper.vm.handleDeleteSuccess()
    wrapper.vm.handleDuplicateSuccess()
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('opens and closes stop enrollment dialog and supports refresh on force update', () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.tab = TRAINING_LIBRARY_TYPES.ALL_TYPES
    wrapper.vm.$refs[`refTable${wrapper.vm.tab}`] = [{ callForData }]

    wrapper.vm.handleStop({ enrollmentId: 'stop-1' })
    expect(wrapper.vm.isShowStopEnrollmentDialog).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual({ enrollmentId: 'stop-1' })

    wrapper.vm.toggleShowStopEnrollmentDialog(true)
    expect(wrapper.vm.isShowStopEnrollmentDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBeNull()
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handlePreviewRowClick opens survey/training/learning path previews', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.handlePreviewRowClick({
      enrollmentId: 'p-1',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY,
      hasQuiz: false
    })
    await flushPromises()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'trainingLibrary/setSurveyPreviewDialog',
      expect.objectContaining({ status: true, onlyPreview: true })
    )

    await wrapper.vm.handlePreviewRowClick({
      enrollmentId: 'p-2',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING,
      hasQuiz: false
    })
    await flushPromises()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'trainingLibrary/setTrainingPreviewDialog',
      expect.objectContaining({ status: true, onlyPreview: true })
    )

    await wrapper.vm.handlePreviewRowClick({
      enrollmentId: 'p-3',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH,
      hasQuiz: false
    })
    await flushPromises()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'trainingLibrary/setLearningPathPreviewDialog',
      expect.objectContaining({ status: true, onlyPreview: true })
    )
  })

  it('handlePreviewRowClick opens poster and infographic previews', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.handlePreviewRowClick({
      enrollmentId: 'p-4',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER,
      hasQuiz: false
    })
    await flushPromises()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'trainingLibrary/setPosterPreviewDialog',
      expect.objectContaining({ status: true, type: 'poster', onlyPreview: true })
    )

    await wrapper.vm.handlePreviewRowClick({
      enrollmentId: 'p-5',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
      hasQuiz: false
    })
    await flushPromises()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'trainingLibrary/setInfographicPreviewDialog',
      expect.objectContaining({ status: true, type: 'infographic', onlyPreview: true })
    )
  })

  it('routes to report for infographic, screensaver and learning path types', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleRouteToReport({
      enrollmentId: 'enr-6',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
      status: 'Finished'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Training Report',
      params: { id: 'enr-6' },
      query: { trainingType: 2 }
    })

    wrapper.vm.handleRouteToReport({
      enrollmentId: 'enr-7',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER,
      status: 'Finished'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Training Report',
      params: { id: 'enr-7' },
      query: { trainingType: 3 }
    })

    wrapper.vm.handleRouteToReport({
      enrollmentId: 'enr-8',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH,
      status: 'Finished'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Training Report',
      params: { id: 'enr-8' },
      query: { trainingType: 4 }
    })
  })

  it('routes to report with proper name and training type', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleRouteToReport({
      enrollmentId: 'enr-3',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER,
      status: 'Finished'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Training Report',
      params: { id: 'enr-3' },
      query: { trainingType: 1 }
    })

    wrapper.vm.handleRouteToReport({
      enrollmentId: 'enr-4',
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING,
      status: 'SCORM Proxy'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Scorm Proxy Report',
      params: { id: 'enr-4' },
      query: { trainingType: 0 }
    })
  })
})
