import { shallowMount, createLocalVue } from '@vue/test-utils'
import EnrollmentsTableRowActions from '@/components/AwarenessEducator/Enrollments/EnrollmentsTableRowActions.vue'
import { ENROLLMENT_STATUSES } from '@/components/AwarenessEducator/utils'

const localVue = createLocalVue()

describe('EnrollmentsTableRowActions.vue', () => {
  const defaultProps = {
    rowActions: [
      { id: '1', disabled: false, icon: 'mdi-play', name: 'Start' },
      { id: '2', disabled: false, icon: 'mdi-pencil', name: 'Edit' },
      { id: '3', disabled: false, icon: 'mdi-eye', name: 'Preview' },
      { id: '4', disabled: false, icon: 'mdi-delete', name: 'Delete' },
      { id: '5', disabled: false, icon: 'mdi-download', name: 'Download' }
    ],
    scope: {
      row: {
        status: 'Scheduled',
        enrollmentId: '1',
        isAutoEnrollmentActive: false,
        isReminderActive: false,
        type: 'Training'
      }
    }
  }

  const createWrapper = (propsData = {}) => {
    return shallowMount(EnrollmentsTableRowActions, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      stubs: {
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true
      }
    })
  }

  describe('Computed Properties', () => {
    it('isRenderStopAutoEnrollButton returns true when status is Auto-enroll', () => {
      const wrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.AUTO_ENROLL } }
      })
      expect(wrapper.vm.isRenderStopAutoEnrollButton).toBe(true)
    })

    it('isRenderStopAutoEnrollButton returns true when isAutoEnrollmentActive is true', () => {
      const wrapper = createWrapper({
        scope: { row: { status: 'Other', isAutoEnrollmentActive: true } }
      })
      expect(wrapper.vm.isRenderStopAutoEnrollButton).toBe(true)
    })

    it('isRenderStopReminderButton returns false for Poster type', () => {
      const wrapper = createWrapper({
        scope: { row: { type: 'Poster', isReminderActive: true } }
      })
      expect(wrapper.vm.isRenderStopReminderButton).toBe(false)
    })

    it('isRenderStopReminderButton returns true when isReminderActive is true and type is Training', () => {
      const wrapper = createWrapper({
        scope: { row: { type: 'Training', isReminderActive: true } }
      })
      expect(wrapper.vm.isRenderStopReminderButton).toBe(true)
    })

    it('isScormProxy returns true when status is Scorm Proxy', () => {
      const wrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.SCORM_PROXY } }
      })
      expect(wrapper.vm.isScormProxy).toBe(true)
    })

    it('isShowReport returns true for multiple statuses', () => {
      const finishedWrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.FINISHED } }
      })
      expect(finishedWrapper.vm.isShowReport).toBe(true)

      const scheduledWrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.SCHEDULED } }
      })
      expect(scheduledWrapper.vm.isShowReport).toBe(false)
    })

    it('getFirstActionParams returns Send Now for Scheduled status', () => {
      const wrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.SCHEDULED } }
      })
      expect(wrapper.vm.getFirstActionParams.text).toBe('Send Now')
    })

    it('getFirstActionParams returns View Report for Finished status', () => {
      const wrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.FINISHED } }
      })
      expect(wrapper.vm.getFirstActionParams.text).toBe('View Report')
    })
  })

  describe('Methods', () => {
    it('handleAction emits on-send for Scheduled status', () => {
      const wrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.SCHEDULED } }
      })
      wrapper.vm.handleAction(wrapper.vm.scope.row)
      expect(wrapper.emitted('on-send')).toBeTruthy()
      expect(wrapper.emitted('on-send')[0][0]).toEqual(wrapper.vm.scope.row)
    })

    it('handleAction emits on-route-to-report for Finished status', () => {
      const wrapper = createWrapper({
        scope: { row: { status: ENROLLMENT_STATUSES.FINISHED } }
      })
      wrapper.vm.handleAction(wrapper.vm.scope.row)
      expect(wrapper.emitted('on-route-to-report')).toBeTruthy()
    })

    it('routeToTrainingReport emits on-route-to-report', () => {
      const wrapper = createWrapper()
      wrapper.vm.routeToTrainingReport({ id: 1 })
      expect(wrapper.emitted('on-route-to-report')).toBeTruthy()
      expect(wrapper.emitted('on-route-to-report')[0][0]).toEqual({ id: 1 })
    })
  })
})
