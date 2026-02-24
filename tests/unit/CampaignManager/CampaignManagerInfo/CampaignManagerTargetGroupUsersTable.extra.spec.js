jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn().mockResolvedValue({
    data: {
      data: [
        {
          status: 'Active',
          count: 5,
          hasPhoneNumber: [
            { status: 'Yes', count: 3 },
            { status: 'No', count: 2 }
          ],
          domainAllowList: [{ status: 'Unverified', count: 1 }],
          hasPreferredLanguage: [],
          hasCompanyPreferredLanguage: [],
          hasRandomLanguage: []
        },
        { status: 'Passive', count: 2 }
      ]
    }
  }),
  getTargetGroupCountDetailExt: jest.fn().mockResolvedValue({ data: { data: [] } }),
  searchTargetGroupUsers: jest.fn().mockResolvedValue({ data: { data: { results: [] } } })
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: { getSingle: jest.fn().mockResolvedValue([]) }
}))

import CampaignManagerTargetGroupUsersTable from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroupUsersTable.vue'

describe('CampaignManagerTargetGroupUsersTable.vue (extra branch coverage)', () => {
  describe('getActiveAndInactiveUserCountText', () => {
    it('returns vishing text when isVishing and activeUsersWithPhoneNumberCount', () => {
      const ctx = {
        isVishing: true,
        activeUsersWithPhoneNumberCount: 3,
        activeUserCount: 0,
        inactiveUserCount: 2
      }
      expect(
        CampaignManagerTargetGroupUsersTable.computed.getActiveAndInactiveUserCountText.call(ctx)
      ).toContain('3 active')
    })

    it('returns active text when not vishing and activeUserCount', () => {
      const ctx = {
        isVishing: false,
        activeUsersWithPhoneNumberCount: 0,
        activeUserCount: 5,
        inactiveUserCount: 2
      }
      expect(
        CampaignManagerTargetGroupUsersTable.computed.getActiveAndInactiveUserCountText.call(ctx)
      ).toContain('5 active')
    })

    it('returns inactive only when no active', () => {
      const ctx = {
        isVishing: false,
        activeUserCount: 0,
        inactiveUserCount: 2
      }
      expect(
        CampaignManagerTargetGroupUsersTable.computed.getActiveAndInactiveUserCountText.call(ctx)
      ).toBe('2 inactive')
    })
  })

  describe('canRenderAlertbox', () => {
    it('returns false when isAwareness', () => {
      expect(
        CampaignManagerTargetGroupUsersTable.computed.canRenderAlertbox.call({
          isAwareness: true,
          usersFromUnverifiedDomainsCount: 5,
          isVishing: false
        })
      ).toBe(false)
    })

    it('returns true when usersFromUnverifiedDomainsCount > 0 and not vishing', () => {
      expect(
        CampaignManagerTargetGroupUsersTable.computed.canRenderAlertbox.call({
          isAwareness: false,
          usersFromUnverifiedDomainsCount: 2,
          isVishing: false
        })
      ).toBe(true)
    })
  })

  describe('canRenderPhoneNumberAlertBox', () => {
    it('returns false when isAwareness', () => {
      expect(
        CampaignManagerTargetGroupUsersTable.computed.canRenderPhoneNumberAlertBox.call({
          isAwareness: true,
          activeUsersWithoutPhoneNumberCount: 2,
          isMFAScenarioSelected: true
        })
      ).toBe(false)
    })

    it('returns true when activeUsersWithoutPhoneNumberCount and isMFAScenarioSelected', () => {
      expect(
        CampaignManagerTargetGroupUsersTable.computed.canRenderPhoneNumberAlertBox.call({
          isAwareness: false,
          activeUsersWithoutPhoneNumberCount: 2,
          isMFAScenarioSelected: true
        })
      ).toBe(true)
    })
  })

  describe('canRenderNoPhoneNumberAlertBox', () => {
    it('returns true when activeUsersWithPhoneNumberCount is 0 and isMFAScenarioSelected', () => {
      expect(
        CampaignManagerTargetGroupUsersTable.computed.canRenderNoPhoneNumberAlertBox.call({
          activeUsersWithPhoneNumberCount: 0,
          isMFAScenarioSelected: true
        })
      ).toBe(true)
    })
  })

  describe('canRenderSmartGroupAlertBox', () => {
    it('returns true when isLearningPath and isSmartGroup', () => {
      expect(
        CampaignManagerTargetGroupUsersTable.computed.canRenderSmartGroupAlertBox.call({
          isLearningPath: true,
          isSmartGroup: true
        })
      ).toBe(true)
    })
  })

  describe('getPreferredLanguageAlertBoxClass', () => {
    it('adds success class when getNonPreferredLanguageUsers is 0', () => {
      const ctx = {
        getNonPreferredLanguageUsers: 0
      }
      const result =
        CampaignManagerTargetGroupUsersTable.computed.getPreferredLanguageAlertBoxClass.call(ctx)
      expect(result).toContain('preferred-language-alert-box--success')
    })

    it('adds default class when getNonPreferredLanguageUsers > 0', () => {
      const ctx = {
        getNonPreferredLanguageUsers: 5
      }
      const result =
        CampaignManagerTargetGroupUsersTable.computed.getPreferredLanguageAlertBoxClass.call(ctx)
      expect(result).toContain('preferred-language-alert-box')
    })
  })

  describe('getUnverifiedDomainsText', () => {
    it('uses "is" for singular count', () => {
      const ctx = {
        usersFromUnverifiedDomainsCount: 1,
        isSmishing: false
      }
      const result =
        CampaignManagerTargetGroupUsersTable.computed.getUnverifiedDomainsText.call(ctx)
      expect(result).toContain('There is')
      expect(result).toContain('emails')
    })

    it('uses "are" for plural count', () => {
      const ctx = {
        usersFromUnverifiedDomainsCount: 2,
        isSmishing: false
      }
      const result =
        CampaignManagerTargetGroupUsersTable.computed.getUnverifiedDomainsText.call(ctx)
      expect(result).toContain('There are')
    })

    it('uses sms when isSmishing', () => {
      const ctx = {
        usersFromUnverifiedDomainsCount: 1,
        isSmishing: true
      }
      const result =
        CampaignManagerTargetGroupUsersTable.computed.getUnverifiedDomainsText.call(ctx)
      expect(result).toContain('sms')
    })
  })
})
