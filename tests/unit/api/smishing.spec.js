jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  patch: jest.fn().mockResolvedValue({})
}))

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import axios from 'axios'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import smishingApi from '@/api/smishing'

describe('smishing API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('text message template operations', () => {
    it('should call searchTextMessageTemplates', async () => {
      const payload = { page: 1 }
      await smishingApi.searchTextMessageTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/smishing-simulator/text-templates/search', payload)
    })

    it('should call getTextMessageTemplate', async () => {
      const id = 'template-123'
      await smishingApi.getTextMessageTemplate(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/smishing-simulator/text-templates/${id}`)
    })

    it('should call createTextMessageTemplate', async () => {
      const payload = { name: 'SMS Template' }
      await smishingApi.createTextMessageTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/text-templates',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateTextMessageTemplate', async () => {
      const payload = { name: 'Updated SMS' }
      const id = 'template-123'
      await smishingApi.updateTextMessageTemplate(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/smishing-simulator/text-templates/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteTextMessageTemplate', async () => {
      const id = 'template-123'
      await smishingApi.deleteTextMessageTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/smishing-simulator/text-templates/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteTextMessageTemplates', async () => {
      const payload = { ids: ['template-1', 'template-2'] }
      await smishingApi.bulkDeleteTextMessageTemplates(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/smishing-simulator/text-templates/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportTextMessageTemplates', async () => {
      const payload = { filters: {} }
      await smishingApi.exportTextMessageTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/text-templates/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getSummaryTextMessageTemplate', async () => {
      const resourceId = 'campaign-123'
      const instanceGroup = 'group-1'
      const templateId = 'template-456'
      await smishingApi.getSummaryTextMessageTemplate(resourceId, instanceGroup, templateId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/text-templates/${templateId}`
      )
    })

    it('should call getSmishingLandingPageMergeTags', async () => {
      await smishingApi.getSmishingLandingPageMergeTags()
      expect(testRequest.get).toHaveBeenCalledWith('/smishing-simulator/text-templates/merge-tags')
    })
  })

  describe('landing page template operations', () => {
    it('should call searchLandingPageTemplates', async () => {
      const payload = { page: 1 }
      await smishingApi.searchLandingPageTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/landing-page-template/search',
        payload
      )
    })

    it('should call getLandingPageTemplate', async () => {
      const id = 'page-123'
      await smishingApi.getLandingPageTemplate(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/landing-page-template/${id}`
      )
    })

    it('should call createLandingPageTemplate', async () => {
      const payload = { name: 'Landing Page' }
      await smishingApi.createLandingPageTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/landing-page-template',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateLandingPageTemplate', async () => {
      const payload = { name: 'Updated Page' }
      const id = 'page-123'
      await smishingApi.updateLandingPageTemplate(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/smishing-simulator/landing-page-template/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteLandingPageTemplate', async () => {
      const id = 'page-123'
      await smishingApi.deleteLandingPageTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/smishing-simulator/landing-page-template/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteLandingPageTemplates', async () => {
      const payload = { ids: ['page-1', 'page-2'] }
      await smishingApi.bulkDeleteLandingPageTemplates(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/smishing-simulator/landing-page-template/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportLandingPageTemplates', async () => {
      const payload = { filters: {} }
      await smishingApi.exportLandingPageTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/landing-page-template/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getLandingPageTemplateFormDetails', async () => {
      await smishingApi.getLandingPageTemplateFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/smishing-simulator/landing-page-template/form-details'
      )
    })

    it('should call getSummaryLandingPageTemplate', async () => {
      const resourceId = 'campaign-123'
      const instanceGroup = 'group-1'
      const templateId = 'page-456'
      await smishingApi.getSummaryLandingPageTemplate(resourceId, instanceGroup, templateId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/landing-page-template/${templateId}`
      )
    })
  })

  describe('scenario operations', () => {
    it('should call searchSmishingScenarios', async () => {
      const payload = { page: 1 }
      await smishingApi.searchSmishingScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-scenario/search',
        payload
      )
    })

    it('should call getSmishingScenario', async () => {
      const id = 'scenario-123'
      await smishingApi.getSmishingScenario(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-scenario/${id}`
      )
    })

    it('should call createSmishingScenario', async () => {
      const payload = { name: 'Smishing Scenario' }
      await smishingApi.createSmishingScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-scenario',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSmishingScenario', async () => {
      const payload = { name: 'Updated Scenario' }
      const id = 'scenario-123'
      await smishingApi.updateSmishingScenario(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-scenario/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSmishingScenario', async () => {
      const id = 'scenario-123'
      await smishingApi.deleteSmishingScenario(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-scenario/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteSmishingScenarios', async () => {
      const payload = { ids: ['scenario-1', 'scenario-2'] }
      await smishingApi.bulkDeleteSmishingScenarios(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-scenario/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportSmishingScenarios', async () => {
      const payload = { filters: {} }
      await smishingApi.exportSmishingScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-scenario/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getSmishingScenarioFormDetails', async () => {
      await smishingApi.getSmishingScenarioFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-scenario/form-details'
      )
    })

    it('should call previewSmishingScenario', async () => {
      const id = 'scenario-123'
      await smishingApi.previewSmishingScenario(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-scenario/preview/${id}`
      )
    })

    it('should call previewSmishingScenarioUsedTemplates', async () => {
      const textId = 'text-123'
      const pageId = 'page-456'
      await smishingApi.previewSmishingScenarioUsedTemplates(textId, pageId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-scenario/preview/${textId}/${pageId}`
      )
    })
  })

  describe('campaign operations', () => {
    it('should call searchSmishingCampaigns', async () => {
      const payload = { page: 1 }
      await smishingApi.searchSmishingCampaigns(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-campaign/search',
        payload
      )
    })

    it('should call getSmishingCampaign', async () => {
      const id = 'campaign-123'
      await smishingApi.getSmishingCampaign(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign/${id}`
      )
    })

    it('should call createSmishingCampaign', async () => {
      const payload = { name: 'Smishing Campaign' }
      await smishingApi.createSmishingCampaign(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-campaign',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSmishingCampaign', async () => {
      const payload = { name: 'Updated Campaign' }
      const id = 'campaign-123'
      await smishingApi.updateSmishingCampaign(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSmishingCampaign', async () => {
      const id = 'campaign-123'
      await smishingApi.deleteSmishingCampaign(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportSmishingCampaigns', async () => {
      const payload = { filters: {} }
      await smishingApi.exportSmishingCampaigns(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-campaign/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getSmishingPhoneNumbers', async () => {
      await smishingApi.getSmishingPhoneNumbers()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-campaign/phone-number'
      )
    })

    it('should call previewSmishingCampaign', async () => {
      const id = 'campaign-123'
      await smishingApi.previewSmishingCampaign(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign/preview/${id}`
      )
    })
  })

  describe('campaign job operations', () => {
    it('should call getCampaignFormDetails', async () => {
      await smishingApi.getCampaignFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-campaign-job/form-details'
      )
    })

    it('should call searchSmishingCampaignJobReport', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await smishingApi.searchSmishingCampaignJobReport(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/${id}/search`,
        payload
      )
    })

    it('should call launchSmishingCampaign', async () => {
      const id = 'campaign-123'
      const payload = { status: 'launched' }
      await smishingApi.launchSmishingCampaign(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job/start/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call startSmishingCampaign', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.startSmishingCampaign(id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job/start/${id}/${instanceGroup}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopSmishingCampaign', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.stopSmishingCampaign(id, instanceGroup)
      expect(testRequest.patch).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job/stop/${id}/${instanceGroup}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSmishingCampaignItem', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.deleteSmishingCampaignItem(id, instanceGroup)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job/${id}/${instanceGroup}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportSmishingCampaignItems', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await smishingApi.exportSmishingCampaignItems(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/${id}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getCampaignJobSummary', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.getCampaignJobSummary(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/summary/${id}/${instanceGroup}`
      )
    })

    it('should call getCampaignJobSummaryTargetGroups', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.getCampaignJobSummaryTargetGroups(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/summary/target-groups/${id}/${instanceGroup}`
      )
    })

    it('should call searchCampaignJobType', async () => {
      const type = 'clicked'
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.searchCampaignJobType(type, payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/${type}/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobTypeDetails', async () => {
      const type = 'clicked'
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await smishingApi.searchCampaignJobTypeDetails(type, payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/${type}/${id}`,
        payload
      )
    })

    it('should call resendSmishingCampaignToUsers', async () => {
      const payload = { userIds: ['user-1'] }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.resendSmishingCampaignToUsers(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job/resend/${id}/${instanceGroup}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendSmishingCampaignToUserList', async () => {
      const payload = { userIds: ['user-1', 'user-2'] }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.resendSmishingCampaignToUserList(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job/resend/list/${id}/${instanceGroup}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('report exports and previews', () => {
    it('should call exportCampaignJobType', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.exportCampaignJobType('clicked', payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/clicked/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call downloadSmishingReport', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.downloadSmishingReport(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/export/${id}/${instanceGroup}`,
        { responseType: 'blob' }
      )
    })

    it('should call downloadSmishingReport2', async () => {
      const id = 'campaign-123'
      await smishingApi.downloadSmishingReport2(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/${id}/search/export`,
        { responseType: 'blob' }
      )
    })

    it('should call landing page template preview content', async () => {
      const id = 'page-123'
      const campaignId = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.getSmishingCampaignLandingPageTemplatePreviewContent(
        id,
        campaignId,
        instanceGroup
      )
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/summary/${campaignId}/${instanceGroup}/landing-page-template/${id}`
      )
    })

    it('should call text message template preview content', async () => {
      const id = 'template-123'
      const campaignId = 'campaign-123'
      const instanceGroup = 'group-1'
      await smishingApi.getSmishingCampaignTextMessageTemplatePreviewContent(
        id,
        campaignId,
        instanceGroup
      )
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/smishing-campaign-job-report/summary/${campaignId}/${instanceGroup}/text-templates/${id}`
      )
    })
  })

  describe('DNS and domain operations', () => {
    it('should call getDnsServiceList', async () => {
      const payload = { page: 1 }
      await smishingApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/dns-services/search',
        payload
      )
    })

    it('should call createDnsServiceList', async () => {
      const payload = { name: 'dns-1' }
      await smishingApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/dns-services',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testConnection', async () => {
      const payload = { host: 'example.com' }
      const id = 'dns-1'
      await smishingApi.testConnection(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `smishing-simulator/dns-services/${id}/test`,
        payload
      )
    })

    it('should call updateDnsServiceList', async () => {
      const payload = { name: 'dns-2' }
      const id = 'dns-1'
      await smishingApi.updateDnsServiceList(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `smishing-simulator/dns-services/${id}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDnsService', async () => {
      const id = 'dns-1'
      await smishingApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `smishing-simulator/dns-services/${id}`,
        { loading: true }
      )
    })

    it('should call deleteEmailTemplate for dns service', async () => {
      const id = 'dns-1'
      await smishingApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `smishing-simulator/dns-services/${id}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportDnsService', async () => {
      const payload = { filters: {} }
      await smishingApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/dns-services/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getDomainsList', async () => {
      const payload = { page: 1 }
      await smishingApi.getDomainsList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/domain-records/search',
        payload
      )
    })

    it('should call createDomain', async () => {
      const payload = { name: 'example.com' }
      await smishingApi.createDomain(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/domain-records',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateDomain', async () => {
      const payload = { name: 'example.org' }
      const id = 'domain-1'
      await smishingApi.updateDomain(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `smishing-simulator/domain-records/${id}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteDomainRecord', async () => {
      const id = 'domain-1'
      await smishingApi.deleteDomainRecord(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `smishing-simulator/domain-records/${id}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportDomains', async () => {
      const payload = { filters: {} }
      await smishingApi.exportDomains(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/domain-records/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getDomainData', async () => {
      await smishingApi.getDomainData()
      expect(testRequest.get).toHaveBeenCalledWith(
        'smishing-simulator/domain-records/form-details'
      )
    })

    it('should call getDomainEditData', async () => {
      const id = 'domain-1'
      await smishingApi.getDomainEditData(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `smishing-simulator/domain-records/${id}`,
        { loading: true }
      )
    })

    it('should call testDomainConnection', async () => {
      const payload = { host: 'example.com' }
      await smishingApi.testDomainConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'smishing-simulator/domain-records/test',
        payload
      )
    })
  })

  describe('excluded IPs and external moderation', () => {
    it('should call getExcludedIPAddresses', async () => {
      await smishingApi.getExcludedIPAddresses()
      expect(testRequest.get).toHaveBeenCalledWith('/smishing-simulator/excluded-ip-list')
    })

    it('should call postExcludedIPAddresses with payload', async () => {
      const payload = { ips: ['1.1.1.1'] }
      await smishingApi.postExcludedIPAddresses(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/excluded-ip',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call postExcludedIPAddresses with default empty payload when no arg', async () => {
      await smishingApi.postExcludedIPAddresses()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/excluded-ip',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call checkSmishingTextRisk via axios', async () => {
      const text = 'test message'
      await smishingApi.checkSmishingTextRisk(text)
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('txt-enhance'),
        { method: 'check', text },
        { timeout: 100000 }
      )
    })

    it('should call enhanceSmishingText via axios', async () => {
      const text = 'improve this'
      await smishingApi.enhanceSmishingText(text)
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('txt-enhance'),
        { method: 'enhance', text },
        { timeout: 100000 }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await smishingApi.getTextMessageTemplate('id')
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      await smishingApi.searchTextMessageTemplates({})
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      await smishingApi.updateTextMessageTemplate('id', {})
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await smishingApi.deleteTextMessageTemplate('id')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should use PATCH for status changes', async () => {
      await smishingApi.stopSmishingCampaign('id', 'group')
      expect(testRequest.patch).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      await smishingApi.createTextMessageTemplate({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await smishingApi.deleteTextMessageTemplate('id')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('export operations', () => {
    it('should use blob responseType for all exports', async () => {
      const payload = { filters: {} }
      const exportOps = [
        () => smishingApi.exportTextMessageTemplates(payload),
        () => smishingApi.exportLandingPageTemplates(payload),
        () => smishingApi.exportSmishingScenarios(payload),
        () => smishingApi.exportSmishingCampaigns(payload)
      ]
      for (const op of exportOps) {
        jest.clearAllMocks()
        await op()
        expect(testRequest.post).toHaveBeenCalledWith(
          expect.any(String),
          payload,
          expect.objectContaining({ responseType: 'blob' })
        )
      }
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in ids', async () => {
      const specialId = 'template-123!@#$'
      await smishingApi.getTextMessageTemplate(specialId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/smishing-simulator/text-templates/${specialId}`
      )
    })

    it('should construct complex URLs correctly', async () => {
      const resourceId = 'campaign-123'
      const instanceGroup = 'group-1'
      const templateId = 'text-456'
      await smishingApi.getSummaryTextMessageTemplate(resourceId, instanceGroup, templateId)
      const expectedUrl = `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/text-templates/${templateId}`
      expect(testRequest.get).toHaveBeenCalledWith(expectedUrl)
    })

    it('should handle search with complex payloads', async () => {
      const payload = { page: 1, filters: { status: 'active', type: 'sms' } }
      await smishingApi.searchSmishingCampaigns(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/smishing-simulator/smishing-campaign/search',
        payload
      )
    })
  })
})
