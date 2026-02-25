jest.mock('@/api/awarenessEducator', () => ({
  getEnrollmentFormDetails: jest.fn().mockResolvedValue({
    data: {
      data: {
        enumNameValuePairs: {
          EnrollmentStatusEnum: []
        }
      }
    }
  })
}))

import Enrollments from '@/views/Enrollments.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('Enrollments.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created calls form helper methods', () => {
    const callForFormDetails = jest.fn()
    const callForLanguages = jest.fn()
    const callForCategories = jest.fn()
    const callForTargetAudiences = jest.fn()
    const callForTypes = jest.fn()
    const ctx = {
      callForFormDetails,
      callForLanguages,
      callForCategories,
      callForTargetAudiences,
      callForTypes
    }
    Enrollments.created.call(ctx)
    expect(callForFormDetails).toHaveBeenCalled()
    expect(callForLanguages).toHaveBeenCalled()
    expect(callForCategories).toHaveBeenCalled()
    expect(callForTargetAudiences).toHaveBeenCalled()
    expect(callForTypes).toHaveBeenCalled()
  })

  it('callForFormDetails sets enrollmentStatusEnum from API response', async () => {
    AwarenessEducatorService.getEnrollmentFormDetails.mockResolvedValueOnce({
      data: {
        data: {
          enumNameValuePairs: {
            EnrollmentStatusEnum: [{ name: 'Active', value: 1 }]
          }
        }
      }
    })
    const ctx = { enrollmentStatusEnum: [] }
    Enrollments.methods.callForFormDetails.call(ctx)
    await Promise.resolve()
    expect(ctx.enrollmentStatusEnum).toEqual([{ name: 'Active', value: 1 }])
  })
})
