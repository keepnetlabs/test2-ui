import { PRIVACY_DURATIONS, accessPeriodItems } from '@/components/Company Settings/AccountPrivacy/utils'

describe('CompanySettings AccountPrivacy utils', () => {
  it('exports privacy duration enum', () => {
    expect(PRIVACY_DURATIONS).toEqual({
      DENY: 0,
      ACCESS_CONTINUOUSLY: 1,
      TWO_HOURS: 2,
      EIGHT_HOUR: 3,
      ONE_DAY: 4,
      SEVEN_DAYS: 5
    })
  })

  it('exports access period items', () => {
    expect(accessPeriodItems).toHaveLength(6)
    expect(accessPeriodItems.some((i) => i.value === PRIVACY_DURATIONS.DENY)).toBe(true)
    expect(accessPeriodItems.some((i) => i.value === PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY)).toBe(
      true
    )
  })
})
