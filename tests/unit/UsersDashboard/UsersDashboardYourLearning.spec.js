import { shallowMount } from '@vue/test-utils'
import UsersDashboardYourLearning from '@/components/UsersDashboard/UsersDashboardYourLearning.vue'

describe('UsersDashboardYourLearning.vue', () => {
  const labels = {
    yourLearningTitle: 'Your Learning',
    yourLearningSubtitle: 'Subtitle',
    yourLearningTrainingMaterialName: 'Material',
    yourLearningStartDate: 'Start Date',
    yourLearningTrainingStatus: 'Status',
    yourLearningCertificate: 'Certificate',
    yourLearningPoints: 'Points',
    yourLearningNoTrainingMaterials: 'No materials',
    yourLearningAvailable: 'Available',
    yourLearningNotAvailable: 'Not Available',
    yourLearningMaxPoints: 'max',
    yourLearningRedoTraining: 'Redo',
    yourLearningStartTraining: 'Start',
    yourLearningNotStarted: 'Not Started',
    yourLearningNotCompleted: 'Not Completed',
    yourLearningInProgress: 'In Progress',
    yourLearningCompleted: 'Completed',
    actionTypeExamPassed: 'Exam Passed',
    yourCertificatesInQueue: 'In Queue',
    actionTypeExamFailed: 'Exam Failed'
  }

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardYourLearning, {
      stubs: {
        DataTable: true,
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true,
        VCard: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getMyLearning': [],
            'usersDashboard/getMyLearningLoading': false,
            ...getterOverrides
          }
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardYourLearning')
  })

  it('returns empty tableData when myLearning is empty', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.emptyOptions).toEqual({ message: labels.yourLearningNoTrainingMaterials })
  })

  it('builds expected table columns from labels', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.tableColumns).toHaveLength(5)
    expect(wrapper.vm.tableColumns[0]).toEqual(
      expect.objectContaining({
        property: 'name',
        label: labels.yourLearningTrainingMaterialName
      })
    )
    expect(wrapper.vm.tableColumns[4]).toEqual(
      expect.objectContaining({
        property: 'points',
        label: labels.yourLearningPoints
      })
    )
  })

  it('reflects loading state from getter', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyLearningLoading': true
    })

    expect(wrapper.vm.myLearningLoading).toBe(true)
  })

  it('maps learning rows with status/points/certificate fields', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyLearning': [
        {
          enrollmentId: 'e1',
          trainingName: 'Training 1',
          enrollmentStartDate: '2026-02-01',
          status: 'Completed',
          certificate: true,
          points: 25,
          isMaxPoints: true,
          trainingUrl: 'https://example.com/t1'
        },
        {
          enrollmentId: 'e2',
          trainingName: 'Training 2',
          enrollmentStartDate: '2026-02-02',
          status: 'NotCompleted',
          certificate: false,
          points: '-5'
        }
      ]
    })

    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        id: 'e1',
        status: 'Completed',
        certificate: labels.yourLearningAvailable,
        points: '25',
        isMaxPoints: true,
        pointsEarned: true
      })
    )
    expect(wrapper.vm.tableData[1]).toEqual(
      expect.objectContaining({
        id: 'e2',
        status: 'Not Completed',
        certificate: labels.yourLearningNotAvailable,
        points: '-5',
        pointsEarned: false
      })
    )
  })

  it('maps status aliases and normalizes invalid points to 0', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyLearning': [
        {
          enrollmentId: 'n1',
          trainingName: 'Not Started Item',
          status: 'NotStarted',
          points: undefined
        },
        {
          enrollmentId: 'n2',
          trainingName: 'Invalid Points Item',
          status: 'Completed',
          points: 'invalid-number'
        },
        {
          enrollmentId: 'n3',
          trainingName: 'Null Points Item',
          status: 'NotCompleted',
          points: null
        }
      ]
    })

    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        status: 'Not Started',
        points: '0'
      })
    )
    expect(wrapper.vm.tableData[1]).toEqual(
      expect.objectContaining({
        status: 'Completed',
        points: '0'
      })
    )
    expect(wrapper.vm.tableData[2]).toEqual(
      expect.objectContaining({
        status: 'Not Completed',
        points: '0'
      })
    )
  })

  it('returns action icon and tooltip by status', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getActionIcon('Completed')).toBe('mdi-replay')
    expect(wrapper.vm.getActionIcon('In Progress')).toBe('mdi-play-circle')
    expect(wrapper.vm.getActionTooltip('Completed')).toBe(labels.yourLearningRedoTraining)
    expect(wrapper.vm.getActionTooltip('In Progress')).toBe(labels.yourLearningStartTraining)
  })

  it('returns status labels and colors with fallback', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusLabel('Exam Failed')).toBe(labels.actionTypeExamFailed)
    expect(wrapper.vm.getStatusLabel('Unknown')).toBe('Unknown')
    expect(wrapper.vm.getStatusColor('Completed')).toBe('#217124')
    expect(wrapper.vm.getStatusColor('Unknown')).toBe('#757575')
  })

  it('returns points icon branches', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getPointsIcon('10', true)).toBe('mdi-star')
    expect(wrapper.vm.getPointsIcon('-3', false)).toBe('mdi-close-circle')
    expect(wrapper.vm.getPointsIcon('0', false)).toBe('mdi-minus-circle')
    expect(wrapper.vm.getPointsIcon('5', false)).toBe('mdi-check-circle')
    expect(wrapper.vm.getPointsIcon('not-a-number', false)).toBe('mdi-check-circle')
    expect(wrapper.vm.getPointsIcon('5(max)', false)).toBe('mdi-star')
  })

  it('returns points icon color branches', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getPointsIconColor('10', true)).toBe('#D1AD0C')
    expect(wrapper.vm.getPointsIconColor('-3', false)).toBe('#B83A3A')
    expect(wrapper.vm.getPointsIconColor('0', false)).toBe('#757575')
    expect(wrapper.vm.getPointsIconColor('5', false)).toBe('#217124')
    expect(wrapper.vm.getPointsIconColor('not-a-number', false)).toBe('#217124')
    expect(wrapper.vm.getPointsIconColor('7(max)', false)).toBe('#D1AD0C')
  })

  it('opens window when row has trainingUrl', () => {
    const wrapper = createWrapper()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleAction({
      status: 'Completed',
      trainingUrl: 'https://example.com/training'
    })

    expect(openSpy).toHaveBeenCalledWith('https://example.com/training', '_blank')
    openSpy.mockRestore()
  })

  it('logs fallback action when trainingUrl is missing', () => {
    const wrapper = createWrapper()
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    wrapper.vm.handleAction({ status: 'Completed' })
    wrapper.vm.handleAction({ status: 'In Progress' })

    expect(logSpy).toHaveBeenCalledTimes(2)
    logSpy.mockRestore()
  })
})
