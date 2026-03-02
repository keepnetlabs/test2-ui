jest.mock('@/api/awarenessEducator', () => {
  const mockMethods = {
    getEnrollment: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    updateEnrollment: jest.fn(() => Promise.resolve({})),
    stopReminder: jest.fn(() => Promise.resolve()),
    stopAutoEnroll: jest.fn(() => Promise.resolve()),
    searchEnrollments: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getTrainingTypeCount: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    searchTraining: jest.fn(() => Promise.resolve({ data: { data: {} } }))
  };
  return {
    __esModule: true,
    ...mockMethods,
    default: mockMethods
  };
});

import { shallowMount, createLocalVue } from '@vue/test-utils'
import EditEnrollmentsModal from '@/components/AwarenessEducator/Enrollments/EditEnrollmentsModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import * as CompanyApi from '@/api/company'

const localVue = createLocalVue()

jest.mock('@/api/company', () => ({
  __esModule: true,
  getTimeByTimeZone: jest.fn(() => Promise.resolve({ data: { data: '2025-02-02T10:00:00' } }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EditEnrollmentsModal.vue - Extra Branch Coverage', () => {
  const createWrapper = (propsData = {}, getters = {}) => {
    return shallowMount(EditEnrollmentsModal, {
      localVue,
      propsData: {
        status: true,
        selectedRow: { enrollmentId: 'en-1', status: 'Scheduled', type: 'Learning Path' },
        ...propsData
      },
      mocks: {
        $moment: (v) => ({ 
          format: () => v || '2025-01-01',
          valueOf: () => 1735689600000 
        }),
        $store: {
          getters: {
            'common/getSelectedTimeZone': 'UTC',
            ...getters
          }
        }
      },
      stubs: {
        AppModal: { template: '<div><slot name="overlay-body" /></div>' },
        AppModalBodyHeader: true,
        FormGroup: true,
        InputEntityName: true,
        InputDate: true,
        InputTimezone: true,
        KSelect: true,
        AlertBox: true,
        StopReminderDialog: true,
        StopAutoEnrollDialog: true,
        VBtn: true,
        VIcon: true,
        VCheckbox: true,
        VTextField: true,
        VForm: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    AwarenessEducatorService.getEnrollment.mockImplementation(() => Promise.resolve({ data: { data: {} } }))
  })

  describe('Lifecycle and callForData', () => {
    it('handles empty response in callForData gracefully', async () => {
      AwarenessEducatorService.getEnrollment.mockResolvedValueOnce({ data: { data: null } })
      const wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.sendReminderEvery).toBe(false)
      expect(wrapper.vm.isAutoEnroll).toBe(false)
    })

    it('sets scheduler with defaults if response has no enrollmentScheduler but status is Scheduled', async () => {
      AwarenessEducatorService.getEnrollment.mockResolvedValueOnce({ 
        data: { data: { enrollmentReminder: null } } 
      })
      const wrapper = createWrapper({ selectedRow: { enrollmentId: 'e2', status: 'Scheduled' } })
      await flushPromises()
      
      expect(wrapper.vm.formData.enrollmentScheduler.scheduledDate).toBeDefined()
    })
  })

  describe('Computed Properties', () => {
    it('isDateValid returns false if status is Scheduled and date is missing', async () => {
      const wrapper = createWrapper({ selectedRow: { status: 'Scheduled' } })
      // Use shallow merge for formData to avoid losing other properties if needed, 
      // but here we just need scheduledDate to be falsy.
      wrapper.vm.formData.enrollmentScheduler.scheduledDate = ''
      
      expect(wrapper.vm.isDateValid).toBe(false)
    })

    it('isDateValid returns true if status is not Scheduled', async () => {
      const wrapper = createWrapper({ selectedRow: { status: 'Running' } })
      expect(wrapper.vm.isDateValid).toBe(true)
    })

  })

  describe('handleClose and dialog close handlers', () => {
    it('handleClose emits with stopped flags', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isReminderStopped: true })
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
      expect(wrapper.emitted('on-close')[0][0]).toBe(true)
    })

    it('handleCloseStopReminderDialog hides dialog', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isStopReminderDialogVisible: true })
      wrapper.vm.handleCloseStopReminderDialog()
      expect(wrapper.vm.isStopReminderDialogVisible).toBe(false)
    })

    it('handleCloseStopAutoEnrollDialog hides dialog', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isStopAutoEnrollDialogVisible: true })
      wrapper.vm.handleCloseStopAutoEnrollDialog()
      expect(wrapper.vm.isStopAutoEnrollDialogVisible).toBe(false)
    })
  })

  describe('Methods and Stop Actions', () => {
    it('handleConfirmStopReminder calls API and updates flags', async () => {
      const wrapper = createWrapper()
      wrapper.vm.handleConfirmStopReminder()
      expect(wrapper.vm.loading).toBe(true)
      await flushPromises()
      expect(wrapper.vm.isReminderStopped).toBe(true)
      expect(wrapper.vm.loading).toBe(false)
    })

    it('handleConfirmStopAutoEnroll calls API and updates flags', async () => {
      const wrapper = createWrapper()
      wrapper.vm.handleConfirmStopAutoEnroll()
      expect(wrapper.vm.loading).toBe(true)
      await flushPromises()
      expect(wrapper.vm.isAutoEnrollStopped).toBe(true)
      expect(wrapper.vm.loading).toBe(false)
    })

    it('disabledEndDates returns true for past dates', () => {
      const wrapper = createWrapper()
      const pastDate = new Date()
      pastDate.setFullYear(2000)
      expect(wrapper.vm.disabledEndDates(pastDate)).toBe(true)
      
      const futureDate = new Date()
      futureDate.setFullYear(2100)
      expect(wrapper.vm.disabledEndDates(futureDate)).toBe(false)
    })
  })

  describe('Watchers', () => {
    it('timezone watcher updates scheduledDate from API', async () => {
      const wrapper = createWrapper()
      await flushPromises() 
      
      await wrapper.setData({ 
        formData: { 
          enrollmentScheduler: { scheduledTimeZoneId: 'UTC', scheduledDate: 'old' },
          enrollmentReminder: {},
          enrollmentAutoEnroll: {}
        } 
      })
      
      // Trigger watcher
      wrapper.vm.formData.enrollmentScheduler.scheduledTimeZoneId = 'Europe/Stockholm'
      await flushPromises()
      
      expect(CompanyApi.getTimeByTimeZone).toHaveBeenCalledWith('Europe/Stockholm')
      expect(wrapper.vm.formData.enrollmentScheduler.scheduledDate).toBe('2025-02-02T10:00:00')
    })
  })

  describe('Submit Logic', () => {
    it('handleSubmit parses distributionDays when enabled', async () => {
      AwarenessEducatorService.updateEnrollment.mockResolvedValueOnce({})
      const wrapper = createWrapper({ selectedRow: { type: 'Learning Path', status: 'Scheduled', enrollmentId: '1' } })
      await wrapper.setData({
        isDistributionEnabled: true,
        formData: { 
          distributionDays: '10',
          enrollmentScheduler: { scheduledDate: '2025-01-01' },
          enrollmentReminder: {},
          enrollmentAutoEnroll: {}
        }
      })
      wrapper.vm.$refs.refForm = { validate: () => true }
      
      wrapper.vm.handleSubmit()
      await flushPromises()
      
      const payload = AwarenessEducatorService.updateEnrollment.mock.calls[0][0]
      expect(payload.distributionDays).toBe(10)
    })

    it('handleSubmit stops early if date or validation is invalid', async () => {
      const wrapper = createWrapper({ selectedRow: { status: 'Scheduled' } })
      wrapper.vm.formData.enrollmentScheduler.scheduledDate = ''
      wrapper.vm.$refs.refForm = { validate: () => true }
      
      wrapper.vm.handleSubmit()
      expect(AwarenessEducatorService.updateEnrollment).not.toHaveBeenCalled()
    })
  })
})
