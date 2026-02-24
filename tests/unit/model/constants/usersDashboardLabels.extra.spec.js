import usersDashboardLabels, { getUsersDashboardLabel } from '@/model/constants/usersDashboardLabels'

describe('usersDashboardLabels (extra coverage)', () => {
  it('getUsersDashboardLabel returns string label when not function', () => {
    expect(getUsersDashboardLabel('en-GB', 'userMenuEmail')).toBe('Email:')
    expect(getUsersDashboardLabel('en-GB', 'cancel')).toBe('Cancel')
  })

  it('getUsersDashboardLabel returns key when label missing in language', () => {
    expect(getUsersDashboardLabel('en-GB', 'nonExistentKey')).toBe('nonExistentKey')
  })

  it('getUsersDashboardLabel calls function with single arg', () => {
    expect(getUsersDashboardLabel('en-GB', 'welcomeTitle', 'John')).toContain('John')
  })

  it('getUsersDashboardLabel calls function with date arg', () => {
    const result = getUsersDashboardLabel('en-GB', 'yourBadgesEarnedOn', '2024-01-15')
    expect(result).toBe('Earned on 2024-01-15')
  })

  it('getUsersDashboardLabel falls back to en-GB for unknown language', () => {
    const result = getUsersDashboardLabel('zz-ZZ', 'leaderboardTitle')
    expect(result).toBe(usersDashboardLabels['en-GB'].leaderboardTitle)
  })

  it('usersDashboardLabels has en-GB and en-US', () => {
    expect(usersDashboardLabels['en-GB']).toBeDefined()
    expect(usersDashboardLabels['en-US']).toBeDefined()
  })
})
