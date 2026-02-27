import CampaignManagerPrintoutSummary from '@/components/CampaignManager/Summary/CampaignManagerPrintoutSummary.vue'

// API Mocks
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import AwarenessEducatorService from '@/api/awarenessEducator'
import QuishingService from '@/api/quishing'

jest.mock('@/api/phishingsimulator', () => ({
  getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId: jest.fn().mockResolvedValue({
    data: { data: {} }
  })
}))

jest.mock('@/api/quishing', () => ({
  getQuishingScenarioLandingPageAndEmailTemplate: jest.fn().mockResolvedValue({
    data: { data: {} }
  })
}))

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    getTraining: jest.fn(() =>
      Promise.resolve({
        data: { data: { id: 't1', name: 'Training' } }
      })
    )
  }
}))

describe('CampaignManagerPrintoutSummary.vue (extra branching)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('computed', () => {
    it('getMethodDetail calculates occurrences of method types', () => {
      const ctx = {
        phishingScenarios: [{ method: 'Click-Only' }, { method: 'Click-Only' }, { method: 'Attachment' }]
      }
      const result = CampaignManagerPrintoutSummary.computed.getMethodDetail.call(ctx)
      expect(result).toHaveLength(2)
      expect(result.find((r) => r.method === 'Click-Only').count).toBe(2)
      expect(result.find((r) => r.method === 'Attachment').count).toBe(1)
    })

    it('isAttachmentBasedScenario returns true if method is Attachment', () => {
      expect(
        CampaignManagerPrintoutSummary.computed.isAttachmentBasedScenario.call({
          emailTemplateParams: { method: 'Attachment' }
        })
      ).toBe(true)

      expect(
        CampaignManagerPrintoutSummary.computed.isAttachmentBasedScenario.call({
          emailTemplateParams: { method: 'Click-Only' }
        })
      ).toBe(false)
      
      expect(
        CampaignManagerPrintoutSummary.computed.isAttachmentBasedScenario.call({
          emailTemplateParams: null
        })
      ).toBe(false)
    })

    it('getTotalRandomlySelectedUserCount formats percentage accurately', () => {
      const result = CampaignManagerPrintoutSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {
          targetGroupResourceIds: ['123', '456'],
          sendRandomlyUsersCalculateTypeId: '1',
          sendRandomlyUsersCount: 20
        },
        getTotalActiveUsers: 50
      })
      // 50 * 20% = 10
      expect(result).toContain('Randomly selected %20 (10 users)')
    })

    it('getTotalRandomlySelectedUserCount formats percentage avoiding zeroes', () => {
      const result = CampaignManagerPrintoutSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {
          targetGroupResourceIds: ['1'],
          sendRandomlyUsersCalculateTypeId: '1',
          sendRandomlyUsersCount: 0
        },
        getTotalActiveUsers: 0
      })
      // Should avoid 0 target limit output: "1 users" fallback for math.round logic
      expect(result).toContain('Randomly selected %0 (1 users)')
    })

    it('getTotalRandomlySelectedUserCount formats absolute values accurately', () => {
      const result = CampaignManagerPrintoutSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {
          targetGroupResourceIds: ['1'],
          sendRandomlyUsersCalculateTypeId: '2',
          sendRandomlyUsersCount: 30
        },
        getTotalActiveUsers: 100
      })
      expect(result).toContain('Randomly selected 30 users from')
    })
    
    it('getTotalRandomlySelectedUserCount returns empty when targetGroups missing', () => {
      expect(
        CampaignManagerPrintoutSummary.computed.getTotalRandomlySelectedUserCount.call({
          formData: { }, getTotalActiveUsers: 0
        })
      ).toBe('')
    })

    it('getTotalTargetGroupsAndUsersCount formats target user texts accurately', () => {
       const result = CampaignManagerPrintoutSummary.computed.getTotalTargetGroupsAndUsersCount.call({
         formData: { targetGroupResourceIds: [1, 2] },
         getTotalActiveUsers: 15
       })
       expect(result).toContain('15 active user(s)')
       expect(result).toContain('from 2 group(s)')
    })

    it('getTotalUsers sums array userCounts', () => {
       const result = CampaignManagerPrintoutSummary.computed.getTotalUsers.call({
         formData: { selectedTargetGroups: [{ userCount: 5 }, { userCount: 15 }] }
       })
       expect(result).toBe(20)
    })
  })

  describe('watch', () => {
    it('formData watcher extracts scenarioId and triggers detail call', () => {
      const ctx = { callForScenarioDetail: jest.fn() }
      CampaignManagerPrintoutSummary.watch.formData.handler.call(ctx, {
        selectedPhishingScenarios: [{ resourceId: 'res-1' }]
      })
      expect(ctx.selectedScenarioResourceId).toBe('res-1')
      expect(ctx.callForScenarioDetail).toHaveBeenCalledWith({ name: 'res-1', index: 0 })
    })

    it('formData watcher does not crash when undefined', () => {
      const ctx = { callForScenarioDetail: jest.fn() }
      CampaignManagerPrintoutSummary.watch.formData.handler.call(ctx, {})
      expect(ctx.selectedScenarioResourceId).toBeUndefined()
    })
  })

  describe('methods - callForTrainingDetail & helpers', () => {
    it('callForTrainingDetail maps language properties', async () => {
      const ctx = {
        trainingLanguages: [{ id: 'en', name: 'English', code: 'EN' }],
        selectedTraining: { trainingLanguageIds: ['en'] }
      }
      CampaignManagerPrintoutSummary.methods.callForTrainingDetail.call(ctx, '1')
      await Promise.resolve() // flush api mock
      await Promise.resolve()
      
      expect(ctx.selectedTrainingLanguages[0].code).toBe('EN')
      expect(ctx.trainingParams.languages).toBe('EN')
    })

    it('toggleScheduleDialog flips visibility', () => {
      const ctx = {
        isShowScheduleDialog: false,
        toggleScheduleDialog: CampaignManagerPrintoutSummary.methods.toggleScheduleDialog
      }
      CampaignManagerPrintoutSummary.methods.handleSchedule.call(ctx)
      expect(ctx.isShowScheduleDialog).toBe(true)
    })
  })

  describe('methods - callForScenarioDetail api logic', () => {
    it('aborts gracefully if name resourceId is empty', () => {
      const ctx = { formData: { templateType: '' } }
      expect(CampaignManagerPrintoutSummary.methods.callForScenarioDetail.call(ctx, { name: '' })).toBeUndefined()
    })

    it('calls phishingsimulator api when type is phishing', async () => {
      getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId.mockResolvedValueOnce({
        data: { data: { emailTemplate: { template: 'html1', fromName: 'Alice' } } }
      })

      const ctx = {
        type: 'Phishing', // phishing SCENARIO_TYPES defaults
        formData: { templateType: 'test' },
        languageOptions: [],
        difficulties: [],
        methods: [],
        callForTrainingDetail: jest.fn()
      }
      CampaignManagerPrintoutSummary.methods.callForScenarioDetail.call(ctx, { name: 'scenario1' })
      expect(ctx.isScenarioDetailLoading).toBe(true)
      
      await Promise.resolve()
      
      expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).toHaveBeenCalled()
      expect(ctx.isScenarioDetailLoading).toBe(false)
      expect(ctx.emailTemplateParams.fromName).toBe('Alice')
    })
    
    it('calls quishing API and maps quishingTemplate payload directly', async () => {
      QuishingService.getQuishingScenarioLandingPageAndEmailTemplate.mockResolvedValueOnce({
         data: { data: { quishingTemplate: { phishingFileName: 'qr.doc' } } }
      })

      const ctx = {
         type: 'Quishing', // quishing
         formData: { templateType: 'individual' }, // QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT bypass
         languageOptions: [],
         difficulties: [],
         methods: [],
         callForTrainingDetail: jest.fn()
      }

      CampaignManagerPrintoutSummary.methods.callForScenarioDetail.call(ctx, { name: 'qr1' })
      await Promise.resolve()

      // The quishing api takes 2 params for individual printouts
      expect(QuishingService.getQuishingScenarioLandingPageAndEmailTemplate).toHaveBeenCalledWith('qr1', 'individual')
      expect(ctx.emailTemplateParams.phishingFileName).toBe('qr.doc')
    })
  })
})
