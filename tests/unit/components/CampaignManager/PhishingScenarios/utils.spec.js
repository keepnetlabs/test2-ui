import {
  enrollmentItems,
  enrollmentItemsTrainingTab,
  attachmentScenarioEnrollmentItems,
  certificateTypeItems,
  getEnrollmentSendTypeIdByEnum
} from '@/components/CampaignManager/PhishingScenarios/utils'

describe('CampaignManager PhishingScenarios utils', () => {
  it('exports expected enrollment/certificate constants', () => {
    expect(enrollmentItems).toHaveLength(3)
    expect(enrollmentItemsTrainingTab).toHaveLength(2)
    expect(attachmentScenarioEnrollmentItems).toHaveLength(1)
    expect(certificateTypeItems).toHaveLength(2)
  })

  it('maps enrollment enum strings to id values', () => {
    expect(getEnrollmentSendTypeIdByEnum('StartTrainingImmediately ')).toBe('1')
    expect(getEnrollmentSendTypeIdByEnum('EnrollViaEmailNotification')).toBe('2')
    expect(getEnrollmentSendTypeIdByEnum('StartTrainingImmediatelyAndEnrollViaEmailNotification')).toBe('3')
  })

  it('falls back to default value for unknown enum', () => {
    expect(getEnrollmentSendTypeIdByEnum('Unknown')).toBe('1')
  })
})
