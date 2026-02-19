import usersDashboardLabels, { getUsersDashboardLabel } from '@/model/constants/usersDashboardLabels'

describe('usersDashboardLabels', () => {
  it('returns static label for selected language', () => {
    const value = getUsersDashboardLabel('en-US', 'leaderboardTitle')
    expect(value).toBe(usersDashboardLabels['en-US'].leaderboardTitle)
  })

  it('falls back to en-GB when language is missing', () => {
    const value = getUsersDashboardLabel('xx-XX', 'leaderboardTitle')
    expect(value).toBe(usersDashboardLabels['en-GB'].leaderboardTitle)
  })

  it('returns the key when label does not exist', () => {
    const value = getUsersDashboardLabel('en-US', 'notExistingLabelKey')
    expect(value).toBe('notExistingLabelKey')
  })

  it('resolves function labels with args', () => {
    const name = 'Alice'
    const value = getUsersDashboardLabel('en-US', 'welcomeTitle', name)
    expect(value).toContain(name)
    expect(typeof value).toBe('string')
  })

  it('resolves function labels with multiple args', () => {
    const value = getUsersDashboardLabel(
      'en-US',
      'activityTimelineCampaignPoints',
      'Bob',
      10,
      'Campaign 1',
      'phishing campaign',
      'easy',
      88
    )

    expect(value).toContain('Bob')
    expect(value).toContain('Campaign 1')
    expect(value).toContain('88%')
  })
})
