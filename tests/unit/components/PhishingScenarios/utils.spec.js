import {
  MERGED_TEXTS,
  SCENARIO_METHOD_TYPES,
  SCENARIO_METHODS,
  SCENARIO_DIFFICULTIES,
  getDefaultEmailTemplatePayload,
  getDefaultLandingPageTemplatePayload,
  getEmailTemplateMethodItems,
  EMAIL_TEMPLATE_DETAIL_ACTION_TYPES,
  EMAIL_TEMPLATE_DIFFICULTY_ITEMS,
  defaultRedFlags
} from '@/components/PhishingScenarios/utils'

describe('PhishingScenarios utils', () => {
  it('exports merged texts and scenario constants', () => {
    expect(MERGED_TEXTS).toHaveProperty('{FULLNAME}')
    expect(MERGED_TEXTS).toHaveProperty('{QRCODEURLIMAGE}')
    expect(SCENARIO_METHOD_TYPES.CLICK_ONLY).toBe('Click-Only')
    expect(SCENARIO_METHODS).toHaveLength(4)
    expect(SCENARIO_DIFFICULTIES).toHaveLength(3)
  })

  it('builds default email template payload and handles MFA mapping', () => {
    const normalPayload = getDefaultEmailTemplatePayload('1')
    expect(
      normalPayload.filter.FilterGroups[0].FilterItems[0].value
    ).toBe('WNZt0sCVCWB3')

    const mfaPayload = getDefaultEmailTemplatePayload('4')
    expect(
      mfaPayload.filter.FilterGroups[0].FilterItems[0].value
    ).toBe('WNZt0sCVCWB3,DYC0gugxJMjT')
  })

  it('builds landing page payload and exports other constants', () => {
    const landing = getDefaultLandingPageTemplatePayload('Click-Only')
    expect(landing.filter.FilterGroups[0].FilterItems[0]).toEqual({
      value: 'Click-Only',
      FieldName: 'Method',
      Operator: '='
    })

    expect(getEmailTemplateMethodItems()).toHaveLength(3)
    expect(EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.EDIT).toBe(1)
    expect(EMAIL_TEMPLATE_DIFFICULTY_ITEMS).toHaveLength(3)
    expect(defaultRedFlags).toHaveProperty('subject')
    expect(defaultRedFlags.subject.isRedFlagged).toBe(false)
  })
})
