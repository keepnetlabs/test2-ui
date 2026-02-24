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

  describe('activityTimelineEnrollmentEmailSentTo', () => {
    it('includes category when provided', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineEnrollmentEmailSentTo',
        'Alice',
        'Enrollment A',
        'Category X'
      )
      expect(result).toContain('Alice')
      expect(result).toContain('Enrollment A')
      expect(result).toContain('Category X')
    })

    it('omits category when not provided', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineEnrollmentEmailSentTo',
        'Bob',
        'Enrollment B'
      )
      expect(result).toContain('Bob')
      expect(result).toContain('Enrollment B')
      expect(result).not.toContain('category')
    })
  })

  describe('phishingTestResultsEarnedPoints', () => {
    it('returns no points message when points is 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsEarnedPoints', 0)
      expect(result).toContain('No points earned')
    })

    it('returns earned message when points > 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsEarnedPoints', 15)
      expect(result).toContain('15')
      expect(result).toContain('earned')
    })
  })

  describe('phishingTestResultsLostPoints', () => {
    it('returns no points lost when points is 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsLostPoints', 0)
      expect(result).toContain('No points lost')
    })

    it('returns lost message when points > 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsLostPoints', 10)
      expect(result).toContain('10')
      expect(result).toContain('lost')
    })
  })

  describe('phishingTestResultsAccuracyUp', () => {
    it('returns down message when percentage < 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsAccuracyUp', -5)
      expect(result).toContain('down')
      expect(result).toContain('5')
    })

    it('returns up message when percentage > 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsAccuracyUp', 10)
      expect(result).toContain('up')
      expect(result).toContain('10')
    })

    it('returns unchanged when percentage is 0', () => {
      const result = getUsersDashboardLabel('en-GB', 'phishingTestResultsAccuracyUp', 0)
      expect(result).toContain('unchanged')
    })
  })

  describe('activityTimelineAwarenessPoints', () => {
    it('appends period when no pointRule', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineAwarenessPoints',
        'User',
        50,
        'Enrollment',
        'Category',
        80
      )
      expect(result).toContain('User')
      expect(result).toContain('50')
      expect(result).toContain('earned')
      expect(result).toContain('80%')
      expect(result).toMatch(/\.$/)
    })

    it('includes Joined After 3 Days rule text', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineAwarenessPoints',
        'User',
        50,
        'Enrollment',
        'Category',
        80,
        { ruleName: 'Joined After 3 Days', rulePoint: -5 }
      )
      expect(result).toContain('more than 3 days')
    })

    it('includes Joined 1–3 Days rule text', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineAwarenessPoints',
        'User',
        50,
        'Enrollment',
        'Category',
        80,
        { ruleName: 'Joined 1–3 Days', rulePoint: 10 }
      )
      expect(result).toContain('1–3 days')
    })

    it('includes within 24 hours rule text', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineAwarenessPoints',
        'User',
        50,
        'Enrollment',
        'Category',
        80,
        { ruleName: 'Joined Within 24 Hours', rulePoint: 15 }
      )
      expect(result).toContain('within 24 hours')
    })

    it('uses lost when points negative', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineAwarenessPoints',
        'User',
        -20,
        'Enrollment',
        'Category',
        60
      )
      expect(result).toContain('lost')
      expect(result).toContain('20')
    })
  })

  describe('activityTimelineCampaignPoints', () => {
    it('uses earned when points positive', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineCampaignPoints',
        'User',
        25,
        'Campaign',
        'phishing',
        'easy',
        90
      )
      expect(result).toContain('earned')
      expect(result).toContain('25')
    })

    it('uses lost when points negative', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineCampaignPoints',
        'User',
        -10,
        'Campaign',
        'phishing',
        'hard',
        50
      )
      expect(result).toContain('lost')
      expect(result).toContain('10')
    })
  })

  describe('activityTimelineAwarenessOpened', () => {
    it('returns formatted string', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineAwarenessOpened',
        'Alice',
        'Enrollment X',
        'Category Y'
      )
      expect(result).toContain('Alice')
      expect(result).toContain('Enrollment X')
      expect(result).toContain('Category Y')
    })
  })

  describe('activityTimelineCampaignOpened', () => {
    it('returns formatted string', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineCampaignOpened',
        'Bob',
        'Campaign A',
        'phishing campaign',
        'medium'
      )
      expect(result).toContain('Bob')
      expect(result).toContain('Campaign A')
      expect(result).toContain('medium')
    })
  })

  describe('activityTimelineCampaignSentTo', () => {
    it('returns formatted string', () => {
      const result = getUsersDashboardLabel(
        'en-GB',
        'activityTimelineCampaignSentTo',
        'Campaign B',
        'smishing campaign',
        'hard',
        'Charlie'
      )
      expect(result).toContain('Campaign B')
      expect(result).toContain('Charlie')
    })
  })

  describe('legacy labels', () => {
    it('activityTimelineEarnedPoints', () => {
      const result = getUsersDashboardLabel('en-GB', 'activityTimelineEarnedPoints', 100)
      expect(result).toContain('Earned')
      expect(result).toContain('100')
    })

    it('activityTimelineLostPoints', () => {
      const result = getUsersDashboardLabel('en-GB', 'activityTimelineLostPoints', 50)
      expect(result).toContain('Lost')
      expect(result).toContain('50')
    })
  })

  describe('tr-TR campaign type mapping', () => {
    it('returns Turkish for phishing campaign type', () => {
      const result = getUsersDashboardLabel(
        'tr-TR',
        'activityTimelineCampaignPoints',
        'User',
        10,
        'Kampanya',
        'phishing campaign',
        'kolay',
        85
      )
      expect(result).toContain('oltalama')
    })

    it('returns Turkish for callback campaign type', () => {
      const result = getUsersDashboardLabel(
        'tr-TR',
        'activityTimelineCampaignOpened',
        'User',
        'Campaign',
        'callback campaign',
        'orta'
      )
      expect(result).toContain('geri arama')
    })
  })

  describe('de-DE labels', () => {
    it('phishingTestResultsAccuracyUp branches', () => {
      expect(getUsersDashboardLabel('de-DE', 'phishingTestResultsAccuracyUp', -3)).toContain(
        'gesunken'
      )
      expect(getUsersDashboardLabel('de-DE', 'phishingTestResultsAccuracyUp', 5)).toContain(
        'gestiegen'
      )
      expect(getUsersDashboardLabel('de-DE', 'phishingTestResultsAccuracyUp', 0)).toContain(
        'unverändert'
      )
    })
  })

  describe('fr-FR labels', () => {
    it('phishingTestResultsAccuracyUp branches', () => {
      expect(getUsersDashboardLabel('fr-FR', 'phishingTestResultsAccuracyUp', -2)).toContain(
        'diminué'
      )
      expect(getUsersDashboardLabel('fr-FR', 'phishingTestResultsAccuracyUp', 8)).toContain(
        'augmenté'
      )
    })
  })

  describe('es-ES labels', () => {
    it('phishingTestResultsAccuracyUp branches', () => {
      expect(getUsersDashboardLabel('es-ES', 'phishingTestResultsAccuracyUp', -4)).toContain(
        'disminuyó'
      )
      expect(getUsersDashboardLabel('es-ES', 'phishingTestResultsAccuracyUp', 6)).toContain(
        'aumentó'
      )
    })
  })
})
