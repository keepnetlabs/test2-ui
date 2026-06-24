// Barrel branches in PhishingScenarios/utils.js: default-payload category mapping,
// method-items barrel entry, and the barrel constant tables.
import {
  getDefaultEmailTemplatePayload,
  getEmailTemplateMethodItems,
  BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID,
  SCENARIO_METHOD_TYPE,
  SCENARIO_METHOD_TYPES,
  BARREL_DEFAULTS,
  BARREL_ORDER_TYPES,
  BARREL_URGENT_FLAG_TYPES,
  BARREL_DELAY_MINUTE_OPTIONS
} from '@/components/PhishingScenarios/utils'

const categoryFilterValue = (payload) =>
  payload.filter.FilterGroups[0].FilterItems.find((i) => i.FieldName === 'CategoryResourceId')?.value

describe('Barrel — getDefaultEmailTemplatePayload', () => {
  it('maps Double Barrel methodTypeId "6" to the Barrel category resourceId', () => {
    const payload = getDefaultEmailTemplatePayload(SCENARIO_METHOD_TYPE.DOUBLE_BARREL)
    expect(categoryFilterValue(payload)).toBe(BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID)
  })

  it('does not map non-barrel methodTypeIds to the Barrel category', () => {
    const payload = getDefaultEmailTemplatePayload('1')
    expect(categoryFilterValue(payload)).not.toBe(BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID)
  })

  it('does not crash for methodTypeId "6" (index-based lookup would be undefined)', () => {
    expect(() => getDefaultEmailTemplatePayload('6')).not.toThrow()
  })
})

describe('Barrel — getEmailTemplateMethodItems', () => {
  it('includes a Double Barrel category item matching the backend name', () => {
    const barrel = getEmailTemplateMethodItems().find(
      (m) => m.resourceId === BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID
    )
    expect(barrel).toBeTruthy()
    expect(barrel.name).toBe('Double Barrel')
    expect(barrel.code).toBe('6')
  })
})

describe('Barrel — constants', () => {
  it('DOUBLE_BARREL method type id is "6"', () => {
    expect(SCENARIO_METHOD_TYPE.DOUBLE_BARREL).toBe('6')
  })

  it('exposes Double Barrel labels', () => {
    expect(SCENARIO_METHOD_TYPES.DOUBLE_BARREL).toBe('Double Barrel')
  })

  it('BARREL_DEFAULTS has the documented defaults', () => {
    expect(BARREL_DEFAULTS).toEqual({
      delayMinutes: 60,
      orderType: 1,
      skipPayloadIfReported: true,
      responsiveDelivery: false,
      urgentFlagType: 2
    })
  })

  it('order types: 1=Lure First, 2=Payload First', () => {
    expect(BARREL_ORDER_TYPES).toEqual([
      { text: 'Lure First', value: 1 },
      { text: 'Payload First', value: 2 }
    ])
  })

  it('urgent flag types cover None/LureOnly/PayloadOnly/Both', () => {
    expect(BARREL_URGENT_FLAG_TYPES.map((x) => x.value)).toEqual([0, 1, 2, 3])
  })

  it('delay options are select-friendly minute values', () => {
    expect(BARREL_DELAY_MINUTE_OPTIONS.map((x) => x.value)).toEqual([5, 10, 15, 30, 60, 120, 240])
  })
})
