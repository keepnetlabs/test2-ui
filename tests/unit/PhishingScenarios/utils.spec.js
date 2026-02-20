import {
  SCENARIO_METHOD_TYPES,
  SCENARIO_METHODS,
  SCENARIO_DIFFICULTIES,
  EMAIL_TEMPLATE_DETAIL_ACTION_TYPES,
  EMAIL_TEMPLATE_DIFFICULTY_ITEMS,
  defaultRedFlags,
  getDefaultEmailTemplatePayload,
  getDefaultLandingPageTemplatePayload,
  getEmailTemplateMethodItems
} from '@/components/PhishingScenarios/utils'

describe('PhishingScenarios utils', () => {
  it('exposes scenario method and difficulty constants', () => {
    expect(SCENARIO_METHOD_TYPES.CLICK_ONLY).toBe('Click-Only')
    expect(SCENARIO_METHOD_TYPES.MFA).toBe('MFA')
    expect(SCENARIO_METHODS).toHaveLength(4)
    expect(SCENARIO_DIFFICULTIES).toEqual([
      { text: 'Easy', value: 'mT0CeYGgKsVb' },
      { text: 'Medium', value: 'Z5XeVlpw6Dps' },
      { text: 'Hard', value: 'c4LCGEB9MayB' }
    ])
  })

  it('builds email template payload with selected category value', () => {
    const payload = getDefaultEmailTemplatePayload('2')
    const firstFilterItem = payload.filter.FilterGroups[0].FilterItems[0]

    expect(payload.pageNumber).toBe(1)
    expect(payload.orderBy).toBe('createTime')
    expect(firstFilterItem.FieldName).toBe('CategoryResourceId')
    expect(firstFilterItem.Operator).toBe('Include')
    expect(firstFilterItem.value).toBe('DYC0gugxJMjT')
  })

  it('maps MFA category to click-only and data-submission filters', () => {
    const payload = getDefaultEmailTemplatePayload('4')
    const firstFilterItem = payload.filter.FilterGroups[0].FilterItems[0]

    expect(firstFilterItem.value).toBe('WNZt0sCVCWB3,DYC0gugxJMjT')
  })

  it('builds landing page payload with contains operator when method is empty', () => {
    const payload = getDefaultLandingPageTemplatePayload('')
    const methodFilter = payload.filter.FilterGroups[0].FilterItems[0]

    expect(methodFilter.FieldName).toBe('Method')
    expect(methodFilter.Operator).toBe('Contains')
    expect(methodFilter.value).toBe('')
  })

  it('builds landing page payload with exact operator when method exists', () => {
    const payload = getDefaultLandingPageTemplatePayload('MFA')
    const methodFilter = payload.filter.FilterGroups[0].FilterItems[0]

    expect(methodFilter.Operator).toBe('=')
    expect(methodFilter.value).toBe('MFA')
  })

  it('returns method items used for email templates', () => {
    const methodItems = getEmailTemplateMethodItems()

    expect(methodItems).toHaveLength(3)
    expect(methodItems.map((x) => x.name)).toEqual(['Click Only', 'Data Submission', 'Attachment'])
    expect(methodItems.find((x) => x.name === 'MFA')).toBeUndefined()
  })

  it('exposes email template action and difficulty constants', () => {
    expect(EMAIL_TEMPLATE_DETAIL_ACTION_TYPES).toEqual({
      ADD: 3,
      DELETE: 2,
      EDIT: 1,
      NO_CHANGE: 0
    })
    expect(EMAIL_TEMPLATE_DIFFICULTY_ITEMS).toHaveLength(3)
    expect(EMAIL_TEMPLATE_DIFFICULTY_ITEMS[2].name).toBe('Hard')
  })

  it('defines red flag defaults as disabled with empty tooltip', () => {
    expect(defaultRedFlags).toEqual({
      fromEmail: { isRedFlagged: false, tooltipMessage: '' },
      fromName: { isRedFlagged: false, tooltipMessage: '' },
      fromAddress: { isRedFlagged: false, tooltipMessage: '' },
      subject: { isRedFlagged: false, tooltipMessage: '' },
      attachmentFileName: { isRedFlagged: false, tooltipMessage: '' }
    })
  })
})
