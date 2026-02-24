import TrainingReportEnrollmentEmail from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportEnrollmentEmail.vue'

describe('TrainingReportEnrollmentEmail.vue (extra)', () => {
  it('isFormData returns key count', () => {
    expect(TrainingReportEnrollmentEmail.computed.isFormData.call({ formData: {} })).toBe(0)
    expect(TrainingReportEnrollmentEmail.computed.isFormData.call({ formData: { a: 1 } })).toBe(1)
  })
})
