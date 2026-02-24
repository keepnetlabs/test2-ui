import usersDashboardLabels, { getUsersDashboardLabel } from '@/model/constants/usersDashboardLabels'

function getArgsForKey(key, variant = 'default') {
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
      return ['Alex', 12, 'Secure Training', 'Awareness', 55, { ruleName: 'Joined 1â€“3 Days', rulePoint: 3 }]
    }
    return ['Alex', 12, 'Secure Training', 'Awareness', 55, { ruleName: 'Joined Within 24 Hours', rulePoint: 6 }]
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

describe('usersDashboardLabels (sweep extra coverage)', () => {
  it('executes all function labels across all languages without throwing', () => {
    Object.entries(usersDashboardLabels).forEach(([language, langLabels]) => {
      Object.entries(langLabels).forEach(([key, value]) => {
        if (typeof value !== 'function') return

        const result = getUsersDashboardLabel(language, key, ...getArgsForKey(key))
        expect(typeof result).toBe('string')
      })
    })
  })

  it('covers key branch variants for dynamic label functions across all languages', () => {
    Object.keys(usersDashboardLabels).forEach((language) => {
      expect(
        getUsersDashboardLabel(
          language,
          'activityTimelineEnrollmentEmailSentTo',
          ...getArgsForKey('activityTimelineEnrollmentEmailSentTo', 'withoutCategory')
        )
      ).toEqual(expect.any(String))

      expect(
        getUsersDashboardLabel(
          language,
          'activityTimelineAwarenessPoints',
          ...getArgsForKey('activityTimelineAwarenessPoints', 'noRule')
        )
      ).toEqual(expect.any(String))
      expect(
        getUsersDashboardLabel(
          language,
          'activityTimelineAwarenessPoints',
          ...getArgsForKey('activityTimelineAwarenessPoints', 'negative')
        )
      ).toEqual(expect.any(String))
      expect(
        getUsersDashboardLabel(
          language,
          'activityTimelineAwarenessPoints',
          ...getArgsForKey('activityTimelineAwarenessPoints', 'joinedAfter3Days')
        )
      ).toEqual(expect.any(String))
      expect(
        getUsersDashboardLabel(
          language,
          'activityTimelineAwarenessPoints',
          ...getArgsForKey('activityTimelineAwarenessPoints', 'joined1To3Days')
        )
      ).toEqual(expect.any(String))

      expect(
        getUsersDashboardLabel(
          language,
          'activityTimelineCampaignPoints',
          ...getArgsForKey('activityTimelineCampaignPoints', 'negative')
        )
      ).toEqual(expect.any(String))

      expect(
        getUsersDashboardLabel(
          language,
          'phishingTestResultsEarnedPoints',
          ...getArgsForKey('phishingTestResultsEarnedPoints', 'zero')
        )
      ).toEqual(expect.any(String))
      expect(
        getUsersDashboardLabel(
          language,
          'phishingTestResultsLostPoints',
          ...getArgsForKey('phishingTestResultsLostPoints', 'zero')
        )
      ).toEqual(expect.any(String))
      expect(
        getUsersDashboardLabel(
          language,
          'phishingTestResultsAccuracyUp',
          ...getArgsForKey('phishingTestResultsAccuracyUp', 'negative')
        )
      ).toEqual(expect.any(String))
      expect(
        getUsersDashboardLabel(
          language,
          'phishingTestResultsAccuracyUp',
          ...getArgsForKey('phishingTestResultsAccuracyUp', 'zero')
        )
      ).toEqual(expect.any(String))
    })
  })
})
