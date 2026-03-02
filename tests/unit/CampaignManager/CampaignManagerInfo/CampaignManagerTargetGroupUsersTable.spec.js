import CampaignManagerTargetGroupUsersTable from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroupUsersTable.vue'

// Mock dependencies safely
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn().mockResolvedValue([])
}))
jest.mock('@/api/targetUsers', () => ({
  searchTargetGroupUsers: jest.fn(),
  getTargetGroupCountDetail: jest.fn(),
  getTargetGroupCountDetailExt: jest.fn()
}))

describe('CampaignManagerTargetGroupUsersTable.vue', () => {
  let ctx

  beforeEach(() => {
    ctx = {
      isTargetGroupLoading: false,
      isLoading: false,
      sendUserPreferredLanguage: '0',
      totalUserCount: 0,
      isVishing: false,
      isSmishing: false,
      isAwareness: false,
      userCountDetailResponse: null,
      activeUsersWithoutPhoneNumberCount: 0,
      activeUsersWithPhoneNumberCount: 0,
      languageOptions: [],
      tableOptions: { columns: [] },
      getColumns: jest.fn(() => []),
      callForData: jest.fn(),
      cancellableSearchTargetGroupUsers: jest.fn()
    }
    jest.clearAllMocks()
  })

  describe('computed', () => {
    it('getLoadingStatus returns true if either loading param is true', () => {
      ctx.isTargetGroupLoading = true
      expect(CampaignManagerTargetGroupUsersTable.computed.getLoadingStatus.call(ctx)).toBe(true)

      ctx.isTargetGroupLoading = false
      ctx.isLoading = true
      expect(CampaignManagerTargetGroupUsersTable.computed.getLoadingStatus.call(ctx)).toBe(true)
    })

    it('canRenderAlertboxLanguage returns correct condition', () => {
      ctx.sendUserPreferredLanguage = '1'
      ctx.totalUserCount = 5
      expect(CampaignManagerTargetGroupUsersTable.computed.canRenderAlertboxLanguage.call(ctx)).toBe(true)

      ctx.isVishing = true
      expect(CampaignManagerTargetGroupUsersTable.computed.canRenderAlertboxLanguage.call(ctx)).toBe(false)
    })

    it('canRenderPhoneNumberAwarenessAlertBox evaluates if users are missing phone numbers during awareness', () => {
      ctx.isAwareness = true
      ctx.activeUsersWithoutPhoneNumberCount = 2
      expect(CampaignManagerTargetGroupUsersTable.computed.canRenderPhoneNumberAwarenessAlertBox.call(ctx)).toBe(true)
    })

    describe('getUserFromPreferredLanguage / getNonPreferredLanguageUsers', () => {
      it('returns 0 if no detail response exists', () => {
        expect(CampaignManagerTargetGroupUsersTable.computed.getUserFromPreferredLanguage.call(ctx)).toBeUndefined()
        expect(CampaignManagerTargetGroupUsersTable.computed.getNonPreferredLanguageUsers.call(ctx)).toBeUndefined()
      })

      it('calculates counts from yes/no objects properly', () => {
        ctx.userCountDetailResponse = [
          {
            status: 'Active',
            hasPreferredLanguage: [
              { status: 'Yes', count: 5 },
              { status: 'No', count: 3 }
            ]
          }
        ]
        expect(CampaignManagerTargetGroupUsersTable.computed.getUserFromPreferredLanguage.call(ctx)).toBe(5)
        expect(CampaignManagerTargetGroupUsersTable.computed.getNonPreferredLanguageUsers.call(ctx)).toBe(3)
      })
    })

    describe('getPreferredLanguageText', () => {
      it('returns empty string if userCountDetailResponse is null', () => {
        expect(CampaignManagerTargetGroupUsersTable.computed.getPreferredLanguageText.call(ctx)).toBe('')
      })

      it('returns fallback empty language scenario when language counts are 0', () => {
        ctx.userCountDetailResponse = [
          { status: 'Active', hasPreferredLanguage: [{ status: 'Yes', hasPreferredLanguage: [] }] }
        ]
        Object.defineProperty(ctx, 'getNonPreferredLanguageUsers', { get: () => 3 })
        ctx.activeCompanyName = 'English'
        expect(CampaignManagerTargetGroupUsersTable.computed.getPreferredLanguageText.call(ctx)).toContain('No language match:')
      })

      it('returns fully matched scenario when fallback count is 0', () => {
        ctx.languageOptions = [{ languageTypeName: 'EN', text: 'English' }]
        ctx.randomLanguages = []
        ctx.userCountDetailResponse = [
          { status: 'Active', hasPreferredLanguage: [{ status: 'Yes', hasPreferredLanguage: [{ status: 'EN', count: 2 }] }] }
        ]
        Object.defineProperty(ctx, 'getNonPreferredLanguageUsers', { get: () => 0 })
        expect(CampaignManagerTargetGroupUsersTable.computed.getPreferredLanguageText.call(ctx)).toBe('All users matched: English (2).')
      })

      it('returns partial match scenario with fallbacks', () => {
        ctx.languageOptions = []
        ctx.userCountDetailResponse = [
          { status: 'Active', hasPreferredLanguage: [{ status: 'Yes', hasPreferredLanguage: [{ status: 'EN', count: 2 }] }] }
        ]
        Object.defineProperty(ctx, 'getNonPreferredLanguageUsers', { get: () => 1 })
        ctx.randomLanguages = ['Spanish']
        // plural formats fallback word properly
        expect(CampaignManagerTargetGroupUsersTable.computed.getPreferredLanguageText.call(ctx)).toContain('Matched users: EN (2); 1 user fallbacks to company language (Spanish).')
      })
    })

    it('getPhoneNumberWarningText correctly outputs singular/plural text', () => {
      ctx.activeUsersWithPhoneNumberCount = 1
      ctx.activeUsersWithoutPhoneNumberCount = 2
      expect(CampaignManagerTargetGroupUsersTable.computed.getPhoneNumberWarningText.call(ctx)).toContain('There is 1 active user with phone number and 2 active users without phone number')
      
      ctx.activeUsersWithPhoneNumberCount = 2
      ctx.activeUsersWithoutPhoneNumberCount = 1
      expect(CampaignManagerTargetGroupUsersTable.computed.getPhoneNumberWarningText.call(ctx)).toContain('There are 2 active users with phone numbers and 1 active user without phone number')
    })

    it('getAwarenessPhoneNumberWarningText correctly outputs singular/plural text', () => {
      ctx.activeUsersWithPhoneNumberCount = 2
      ctx.activeUsersWithoutPhoneNumberCount = 1
      expect(CampaignManagerTargetGroupUsersTable.computed.getAwarenessPhoneNumberWarningText.call(ctx)).toContain('There are 2 active users with phone numbers and 1 active users without phone numbers')
    })
  })

  describe('watchers', () => {
    it('isMFAScenarioSelected removes column if false, adds if true (bypassing smishing/vishing)', () => {
      ctx.tableOptions.columns = []
      // Should add
      CampaignManagerTargetGroupUsersTable.watch.isMFAScenarioSelected.handler.call(ctx, true)
      expect(ctx.tableOptions.columns.length).toBe(1)
      expect(ctx.tableOptions.columns[0].property).toBe('phoneNumber')

      // Should splice it out
      CampaignManagerTargetGroupUsersTable.watch.isMFAScenarioSelected.handler.call(ctx, false)
      expect(ctx.tableOptions.columns.length).toBe(0)

      // Handled graceful bypass if index not found
      CampaignManagerTargetGroupUsersTable.watch.isMFAScenarioSelected.handler.call(ctx, false)
      expect(ctx.tableOptions.columns.length).toBe(0)

      // Bypass
      ctx.isSmishing = true
      CampaignManagerTargetGroupUsersTable.watch.isMFAScenarioSelected.handler.call(ctx, true)
      expect(ctx.tableOptions.columns.length).toBe(0) // return early
    })

    it('resourceId watcher calls for data', () => {
      CampaignManagerTargetGroupUsersTable.watch.resourceId.call(ctx)
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('addPhoneNumberColumn watcher refreshes columns via getColumns', () => {
      CampaignManagerTargetGroupUsersTable.watch.addPhoneNumberColumn.call(ctx)
      expect(ctx.getColumns).toHaveBeenCalled()
    })

    it('addPrefferredLanguageColumn watcher refreshes columns via getColumns', () => {
      CampaignManagerTargetGroupUsersTable.watch.addPrefferredLanguageColumn.call(ctx)
      expect(ctx.getColumns).toHaveBeenCalled()
    })
  })

  describe('methods', () => {
    it('getColumns returns base columns plus conditional ones', () => {
      ctx.lastColumnName = 'phoneNumber'
      ctx.addPhoneNumberColumn = false
      ctx.addPrefferredLanguageColumn = false
      let columns = CampaignManagerTargetGroupUsersTable.methods.getColumns.call(ctx)
      expect(columns.length).toBe(3)
      expect(columns[2].label).toBe('Phone Number')

      ctx.lastColumnName = 'email'
      ctx.addPhoneNumberColumn = true
      ctx.addPrefferredLanguageColumn = true
      columns = CampaignManagerTargetGroupUsersTable.methods.getColumns.call(ctx)
      expect(columns.length).toBe(5)
      expect(columns[3].property).toBe('phoneNumber')
      expect(columns[4].property).toBe('preferredLanguage')
    })

    it('setLoading sets isLoading', () => {
      CampaignManagerTargetGroupUsersTable.methods.setLoading.call(ctx, true)
      expect(ctx.isLoading).toBe(true)
    })
  })
})
