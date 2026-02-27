import { shallowMount, createLocalVue } from '@vue/test-utils'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog.vue'
import SendEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/SendEnrollmentDialog.vue'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog.vue'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog.vue'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()

jest.mock('@/api/awarenessEducator', () => ({
  deleteEnrollment: jest.fn(() => Promise.resolve()),
  sendEnrollment: jest.fn(() => Promise.resolve()),
  stopEnrollment: jest.fn(() => Promise.resolve()),
  stopReminder: jest.fn(() => Promise.resolve()),
  stopAutoEnroll: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Enrollments Dialogs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DeleteEnrollmentDialog.vue', () => {
    it('calls deleteEnrollment API and emits close on success', async () => {
      const wrapper = shallowMount(DeleteEnrollmentDialog, {
        localVue,
        propsData: { status: true, selectedRow: { enrollmentId: '1' } },
        stubs: { AppDialog: true, AppDialogFooter: true }
      })
      
      wrapper.vm.handleDelete()
      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
      await flushPromises()
      
      expect(AwarenessEducatorService.deleteEnrollment).toHaveBeenCalledWith('1')
      expect(wrapper.emitted('on-close')).toBeTruthy()
      expect(wrapper.emitted('on-close')[0][0]).toBe(true)
    })
  })

  describe('SendEnrollmentDialog.vue', () => {
    it('calls sendEnrollment API and emits close on success', async () => {
      const wrapper = shallowMount(SendEnrollmentDialog, {
        localVue,
        propsData: { status: true, selectedRow: { enrollmentId: '2' } },
        stubs: { AppDialog: true, AppDialogFooter: true }
      })
      
      wrapper.vm.handleConfirm()
      await flushPromises()
      
      expect(AwarenessEducatorService.sendEnrollment).toHaveBeenCalledWith('2')
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('StopEnrollmentDialog.vue', () => {
    it('calls stopEnrollment API and emits close on success', async () => {
      const wrapper = shallowMount(StopEnrollmentDialog, {
        localVue,
        propsData: { status: true, selectedRow: { enrollmentId: '3' } },
        stubs: { AppDialog: true, AppDialogFooter: true }
      })
      
      wrapper.vm.handleDelete()
      await flushPromises()
      
      expect(AwarenessEducatorService.stopEnrollment).toHaveBeenCalledWith('3')
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('StopReminderDialog.vue', () => {
    it('emits confirm when handleConfirm is called', () => {
      const wrapper = shallowMount(StopReminderDialog, {
        localVue,
        propsData: { status: true },
        stubs: { AppDialog: true, AppDialogFooter: true }
      })
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('confirm')).toBeTruthy()
    })
  })

  describe('StopAutoEnrollDialog.vue', () => {
    it('emits confirm when handleConfirm is called', () => {
      const wrapper = shallowMount(StopAutoEnrollDialog, {
        localVue,
        propsData: { status: true },
        stubs: { AppDialog: true, AppDialogFooter: true }
      })
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('confirm')).toBeTruthy()
    })
  })
})
