import { shallowMount } from '@vue/test-utils'
import EnrollmentsTableRowActions from '@/components/AwarenessEducator/Enrollments/EnrollmentsTableRowActions.vue'
import { ENROLLMENT_STATUSES } from '@/components/AwarenessEducator/utils'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('EnrollmentsTableRowActions.vue', () => {
  const baseRowActions = [
    { id: 'a1', icon: 'mdi-1', name: 'First', disabled: false },
    { id: 'a2', icon: 'mdi-2', name: 'Edit', disabled: false },
    { id: 'a3', icon: 'mdi-3', name: 'Preview', disabled: false },
    { id: 'a4', icon: 'mdi-4', name: 'Delete', disabled: false },
    { id: 'a5', icon: 'mdi-5', name: 'Download', disabled: false }
  ]

  const createWrapper = (rowOverrides = {}) =>
    shallowMount(EnrollmentsTableRowActions, {
      propsData: {
        rowActions: baseRowActions,
        scope: {
          row: {
            status: ENROLLMENT_STATUSES.FINISHED,
            type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING,
            isReminderActive: true,
            isAutoEnrollmentActive: false,
            ...rowOverrides
          }
        }
      },
      stubs: {
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('EnrollmentsTableRowActions')
  })

  it('computes stop auto-enroll visibility from status and flag', () => {
    const wrapperByStatus = createWrapper({ status: ENROLLMENT_STATUSES.AUTO_ENROLL })
    const wrapperByFlag = createWrapper({ status: ENROLLMENT_STATUSES.SCHEDULED, isAutoEnrollmentActive: true })
    const wrapperFalse = createWrapper({ status: ENROLLMENT_STATUSES.SCHEDULED, isAutoEnrollmentActive: false })

    expect(wrapperByStatus.vm.isRenderStopAutoEnrollButton).toBe(true)
    expect(wrapperByFlag.vm.isRenderStopAutoEnrollButton).toBe(true)
    expect(wrapperFalse.vm.isRenderStopAutoEnrollButton).toBe(false)
  })

  it('computes stop reminder visibility with poster/infographic exclusions', () => {
    const poster = createWrapper({ type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER, isReminderActive: true })
    const infographic = createWrapper({
      type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
      isReminderActive: true
    })
    const training = createWrapper({ type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING, isReminderActive: true })

    expect(poster.vm.isRenderStopReminderButton).toBe(false)
    expect(infographic.vm.isRenderStopReminderButton).toBe(false)
    expect(training.vm.isRenderStopReminderButton).toBe(true)
  })

  it('computes report/scorm flags and first action params', () => {
    const reportWrapper = createWrapper({ status: ENROLLMENT_STATUSES.FINISHED })
    const scheduledWrapper = createWrapper({ status: ENROLLMENT_STATUSES.SCHEDULED })
    const scormWrapper = createWrapper({ status: ENROLLMENT_STATUSES.SCORM_PROXY })

    expect(reportWrapper.vm.isShowReport).toBe(true)
    expect(reportWrapper.vm.getFirstActionParams).toEqual({
      icon: 'mdi-text-box',
      text: 'View Report'
    })

    expect(scheduledWrapper.vm.isShowReport).toBe(false)
    expect(scheduledWrapper.vm.getFirstActionParams).toEqual({
      icon: 'mdi-send',
      text: 'Send Now'
    })

    expect(scormWrapper.vm.isScormProxy).toBe(true)
  })

  it('handleAction routes to report for report statuses', () => {
    const wrapper = createWrapper({ status: ENROLLMENT_STATUSES.ERROR, enrollmentId: 'enr-1' })
    const routeSpy = jest.spyOn(wrapper.vm, 'routeToTrainingReport')
    const row = wrapper.props().scope.row

    wrapper.vm.handleAction(row)

    expect(routeSpy).toHaveBeenCalledWith(row)
  })

  it('handleAction emits on-send for scheduled status', () => {
    const wrapper = createWrapper({ status: ENROLLMENT_STATUSES.SCHEDULED, enrollmentId: 'enr-2' })
    const row = wrapper.props().scope.row

    wrapper.vm.handleAction(row)

    expect(wrapper.emitted('on-send')).toEqual([[row]])
  })

  it('routeToTrainingReport emits on-route-to-report', () => {
    const wrapper = createWrapper({ enrollmentId: 'enr-3' })
    const row = wrapper.props().scope.row

    wrapper.vm.routeToTrainingReport(row)

    expect(wrapper.emitted('on-route-to-report')).toEqual([[row]])
  })
})
