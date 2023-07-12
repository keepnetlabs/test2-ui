export const PRIVACY_DURATIONS = {
  DENY: 0,
  ACCESS_CONTINUOUSLY: 1,
  TWO_HOURS: 2,
  EIGHT_HOUR: 3,
  ONE_DAY: 4,
  SEVEN_DAYS: 5
}

export const accessPeriodItems = [
  { text: 'Deny access', value: 0 },
  { text: 'Allow access for 2 hours', value: 2 },
  { text: 'Allow access for 8 hours', value: 3 },
  { text: 'Allow access for 1 day', value: 4 },
  { text: 'Allow access for 7 days', value: 5 },
  { text: 'Allow access continuously', value: 1 }
]
