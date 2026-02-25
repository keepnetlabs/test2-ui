jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getEnrollment: jest.fn(),
    updateEnrollment: jest.fn(),
    stopReminder: jest.fn(() => Promise.resolve()),
    stopAutoEnroll: jest.fn(() => Promise.resolve())
  }
}))

import EditEnrollmentsModal from '@/components/AwarenessEducator/Enrollments/EditEnrollmentsModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('EditEnrollmentsModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('filteredEndTypeItems returns survey end types for survey/quiz rows', () => {
    const result = EditEnrollmentsModal.computed.filteredEndTypeItems.call({
      selectedRow: { trainingTypeId: 'Survey' }
    })
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('callForData maps enrollment response to form and flags', async () => {
    AwarenessEducatorService.getEnrollment.mockResolvedValueOnce({
      data: {
        data: {
          enrollmentReminder: { periodCount: 2, stopTime: null },
          enrollmentAutoEnroll: { type: 'SameDay', stopTime: null },
          enrollmentScheduler: { scheduledDate: '2025-01-01', scheduledTimeZoneId: 'UTC' },
          distributionDays: 5
        }
      }
    })
    const ctx = {
      selectedRow: { enrollmentId: 'e1', status: 'Scheduled', type: 'Learning Path' },
      formData: {
        enrollmentReminder: { periodCount: 1 },
        enrollmentAutoEnroll: { type: 'SameDay' },
        enrollmentScheduler: { scheduledDate: '', scheduledTimeZoneId: '' }
      },
      isLearningPath: true,
      isDistributionEnabled: false,
      isAutoEnroll: false,
      sendReminderEvery: false
    }

    EditEnrollmentsModal.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.sendReminderEvery).toBe(true)
    expect(ctx.isDistributionEnabled).toBe(true)
    expect(ctx.formData.distributionDays).toBe(5)
    expect(ctx.isAutoEnroll).toBe(true)
  })

  it('handleSubmit builds payload and emits close on success', async () => {
    AwarenessEducatorService.updateEnrollment.mockResolvedValueOnce({})
    const emit = jest.fn()
    const ctx = {
      selectedRow: { enrollmentId: 'en-1', status: 'Now', type: 'Training' },
      isDateValid: true,
      sendReminderEvery: false,
      isAutoEnroll: false,
      isLearningPath: false,
      isDistributionEnabled: false,
      loading: false,
      $emit: emit,
      $refs: { refForm: { validate: jest.fn(() => true) } },
      formData: {
        distributionDays: 3,
        enrollmentScheduler: { scheduledDate: 'x', scheduledTimeZoneId: 'UTC' },
        enrollmentReminder: { periodCount: 1 },
        enrollmentAutoEnroll: { type: 'SameDay' }
      }
    }

    EditEnrollmentsModal.methods.handleSubmit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.updateEnrollment).toHaveBeenCalled()
    const sentPayload = AwarenessEducatorService.updateEnrollment.mock.calls[0][0]
    expect(sentPayload.enrollmentScheduler).toBeNull()
    expect(sentPayload.enrollmentReminder).toBeNull()
    expect(sentPayload.enrollmentAutoEnroll).toBeNull()
    expect(sentPayload.distributionDays).toBeNull()
    expect(emit).toHaveBeenCalledWith('on-close', true)
    expect(ctx.loading).toBe(false)
  })
})
