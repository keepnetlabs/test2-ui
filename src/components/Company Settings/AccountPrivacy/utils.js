export const PRIVACY_DURATIONS = {
  DENY: 0,
  ACCESS_CONTINUOUSLY: 1,
  ONE_HOUR: 2,
  ONE_DAY: 3,
  THREE_DAYS: 4,
  SEVEN_DAYS: 5,
  THIRTY_DAYS: 6
}

export const accessPeriodItems = [
  { text: 'Deny allowing access', value: 0 },
  { text: 'Allow access for 1 hour', value: 2 },
  { text: 'Allow access for 1 day', value: 3 },
  { text: 'Allow access for 3 days', value: 4 },
  { text: 'Allow access for 7 days', value: 5 },
  { text: 'Allow access for 30 days', value: 6 },
  { text: 'Allow access continuously', value: 1 }
]
