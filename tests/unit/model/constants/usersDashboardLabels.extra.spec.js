import usersDashboardLabels, { getUsersDashboardLabel } from '@/model/constants/usersDashboardLabels'

function getArgsForSweepKey(key, variant = 'default') {
  if (key === 'welcomeTitle') return ['Alex']
  if (key === 'yourBadgesEarnedOn') return ['2026-02-24']
  if (key === 'activityTimelineEnrollmentEmailSentTo') {
    return variant === 'withoutCategory'
      ? ['Alex', 'Secure Training']
      : ['Alex', 'Secure Training', 'Awareness']
  }
  if (key === 'activityTimelineAwarenessPoints') {
    if (variant === 'noRule') return ['Alex', 15, 'Secure Training', 'Awareness', 88]
    if (variant === 'negative') return ['Alex', -8, 'Secure Training', 'Awareness', 42]
    if (variant === 'joinedAfter3Days') {
      return [
        'Alex',
        12,
        'Secure Training',
        'Awareness',
        55,
        { ruleName: 'Joined After 3 Days', rulePoint: -5 }
      ]
    }
    if (variant === 'joined1To3Days') {
      return [
        'Alex',
        12,
        'Secure Training',
        'Awareness',
        55,
        { ruleName: 'Joined 1Ã¢â‚¬â€œ3 Days', rulePoint: 3 }
      ]
    }
    return [
      'Alex',
      12,
      'Secure Training',
      'Awareness',
      55,
      { ruleName: 'Joined Within 24 Hours', rulePoint: 6 }
    ]
  }
  if (key === 'activityTimelineCampaignPoints') {
    return variant === 'negative'
      ? ['Alex', -4, 'Campaign X', 'callback campaign', 'medium', 40]
      : ['Alex', 9, 'Campaign X', 'phishing campaign', 'easy', 90]
  }
  if (key === 'activityTimelineAwarenessOpened') return ['Alex', 'Secure Training', 'Awareness']
  if (key === 'activityTimelineCampaignOpened') {
    return ['Alex', 'Campaign X', 'smishing campaign', 'hard']
  }
  if (key === 'activityTimelineCampaignSentTo') {
    return ['Campaign X', 'vishing campaign', 'medium', 'Alex']
  }
  if (key === 'activityTimelineEarnedPoints') return [10]
  if (key === 'activityTimelineLostPoints') return [5]
  if (key === 'phishingTestResultsEarnedPoints') return [variant === 'zero' ? 0 : 7]
  if (key === 'phishingTestResultsLostPoints') return [variant === 'zero' ? 0 : 3]
  if (key === 'phishingTestResultsAccuracyUp') {
    if (variant === 'negative') return [-6]
    if (variant === 'zero') return [0]
    return [11]
  }
  return []
}

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

  it('getUsersDashboardLabel fallback language still executes function labels with args', () => {
    const result = getUsersDashboardLabel('unknown-language', 'welcomeTitle', 'Fallback User')
    expect(result).toContain('Fallback User')
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

    it('keeps unknown campaign type after cleanup when no mapping exists', () => {
      const result = getUsersDashboardLabel(
        'tr-TR',
        'activityTimelineCampaignPoints',
        'User',
        11,
        'Campaign',
        'custom campaign',
        'orta',
        65
      )
      expect(result).toMatch(/custom/i)
    })

    it('maps smishing campaign type in campaign points text', () => {
      const result = getUsersDashboardLabel(
        'tr-TR',
        'activityTimelineCampaignPoints',
        'User',
        7,
        'Campaign',
        'smishing campaign',
        'zor',
        70
      )
      expect(result).toContain('smishing')
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

  describe('sweep migration coverage', () => {
    it('executes all function labels across all languages without throwing', () => {
      Object.entries(usersDashboardLabels).forEach(([language, langLabels]) => {
        Object.entries(langLabels).forEach(([key, value]) => {
          if (typeof value !== 'function') return

          const result = getUsersDashboardLabel(language, key, ...getArgsForSweepKey(key))
          expect(typeof result).toBe('string')
        })
      })
    })

    it('covers dynamic label branch variants across all languages', () => {
      Object.keys(usersDashboardLabels).forEach((language) => {
        expect(
          getUsersDashboardLabel(
            language,
            'activityTimelineEnrollmentEmailSentTo',
            ...getArgsForSweepKey('activityTimelineEnrollmentEmailSentTo', 'withoutCategory')
          )
        ).toEqual(expect.any(String))

        expect(
          getUsersDashboardLabel(
            language,
            'activityTimelineAwarenessPoints',
            ...getArgsForSweepKey('activityTimelineAwarenessPoints', 'noRule')
          )
        ).toEqual(expect.any(String))
        expect(
          getUsersDashboardLabel(
            language,
            'activityTimelineAwarenessPoints',
            ...getArgsForSweepKey('activityTimelineAwarenessPoints', 'negative')
          )
        ).toEqual(expect.any(String))
        expect(
          getUsersDashboardLabel(
            language,
            'activityTimelineAwarenessPoints',
            ...getArgsForSweepKey('activityTimelineAwarenessPoints', 'joinedAfter3Days')
          )
        ).toEqual(expect.any(String))
        expect(
          getUsersDashboardLabel(
            language,
            'activityTimelineAwarenessPoints',
            ...getArgsForSweepKey('activityTimelineAwarenessPoints', 'joined1To3Days')
          )
        ).toEqual(expect.any(String))

        expect(
          getUsersDashboardLabel(
            language,
            'activityTimelineCampaignPoints',
            ...getArgsForSweepKey('activityTimelineCampaignPoints', 'negative')
          )
        ).toEqual(expect.any(String))

        expect(
          getUsersDashboardLabel(
            language,
            'phishingTestResultsEarnedPoints',
            ...getArgsForSweepKey('phishingTestResultsEarnedPoints', 'zero')
          )
        ).toEqual(expect.any(String))
        expect(
          getUsersDashboardLabel(
            language,
            'phishingTestResultsLostPoints',
            ...getArgsForSweepKey('phishingTestResultsLostPoints', 'zero')
          )
        ).toEqual(expect.any(String))
        expect(
          getUsersDashboardLabel(
            language,
            'phishingTestResultsAccuracyUp',
            ...getArgsForSweepKey('phishingTestResultsAccuracyUp', 'negative')
          )
        ).toEqual(expect.any(String))
        expect(
          getUsersDashboardLabel(
            language,
            'phishingTestResultsAccuracyUp',
            ...getArgsForSweepKey('phishingTestResultsAccuracyUp', 'zero')
          )
        ).toEqual(expect.any(String))
      })
    })
  })
})
