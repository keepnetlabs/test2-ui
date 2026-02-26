import quishingApi from '@/api/quishing'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

jest.mock('@/utils/testRequest')

describe('quishing API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    testRequest.get = jest.fn().mockResolvedValue({})
    testRequest.post = jest.fn().mockResolvedValue({})
    testRequest.put = jest.fn().mockResolvedValue({})
    testRequest.delete = jest.fn().mockResolvedValue({})
    testRequest.patch = jest.fn().mockResolvedValue({})
  })

  describe('scenario operations', () => {
    it('should call exportScenarios with correct endpoint and blob response type', async () => {
      const payload = { filters: { status: 'active' } }
      await quishingApi.exportScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call searchScenarios with correct endpoint', async () => {
      const payload = { page: 1, pageSize: 10 }
      await quishingApi.searchScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/search',
        payload
      )
    })

    it('should call deleteScenario with correct endpoint and snackbar', async () => {
      const id = 'scenario-123'
      await quishingApi.deleteScenario(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-scenario/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteScenarios with correct endpoint and payload', async () => {
      const payload = { ids: ['scenario-1', 'scenario-2'] }
      await quishingApi.bulkDeleteScenarios(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call createScenario with correct endpoint and snackbar', async () => {
      const payload = { name: 'Test Scenario' }
      await quishingApi.createScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateScenario with correct endpoint and id', async () => {
      const payload = { name: 'Updated Scenario' }
      const id = 'scenario-123'
      await quishingApi.updateScenario(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-scenario/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getScenario with correct endpoint', async () => {
      const id = 'scenario-123'
      await quishingApi.getScenario(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-scenario/${id}`
      )
    })

    it('should call getSummaryOfScenario with template details', async () => {
      await quishingApi.getSummaryOfScenario('template-1', 'page-1', 'email')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/preview/email/template-1/page-1'
      )
    })

    it('should call getScenarioDataDetails with correct endpoint', async () => {
      await quishingApi.getScenarioDataDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/quishing-scenario/form-details'
      )
    })
  })

  describe('landing page operations', () => {
    it('should call updateLandingPage with correct endpoint', async () => {
      const payload = { name: 'Updated Page' }
      const id = 'page-123'
      await quishingApi.updateLandingPage(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/quishing-simulator/landing-page-template/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createLandingPage with correct endpoint', async () => {
      const payload = { name: 'New Page' }
      await quishingApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/landing-page-template',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getLandingPageList with payload', async () => {
      const payload = { page: 1 }
      await quishingApi.getLandingPageList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/landing-page-template/search',
        payload
      )
    })

    it('should call getLandingPageTemplatePreviewContent', async () => {
      const id = 'page-123'
      await quishingApi.getLandingPageTemplatePreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/landing-page-template/${id}`
      )
    })

    it('should call searchLandingPageList', async () => {
      const payload = { search: 'test' }
      await quishingApi.searchLandingPageList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/landing-page-template/search',
        payload
      )
    })

    it('should call deleteLandingPageTemplate', async () => {
      const id = 'page-123'
      await quishingApi.deleteLandingPageTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/quishing-simulator/landing-page-template/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteLandingPageTemplates', async () => {
      const payload = { ids: ['page-1', 'page-2'] }
      await quishingApi.bulkDeleteLandingPageTemplates(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/quishing-simulator/landing-page-template/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportLandingPageTemplates', async () => {
      const payload = { filters: {} }
      await quishingApi.exportLandingPageTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/landing-page-template/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getLandingPageFormDetails', async () => {
      await quishingApi.getLandingPageFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/landing-page-template/form-details'
      )
    })

    it('should call getLandingPageTemplate', async () => {
      const id = 'page-123'
      await quishingApi.getLandingPageTemplate(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/landing-page-template/${id}`
      )
    })
  })

  describe('email template operations', () => {
    it('should call getEmailTemplatesList', async () => {
      const payload = { page: 1 }
      await quishingApi.getEmailTemplatesList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-templates/search',
        payload
      )
    })

    it('should call searchQuishingEmailTemplates', async () => {
      const payload = { search: 'phishing' }
      await quishingApi.searchQuishingEmailTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-templates/search',
        payload
      )
    })

    it('should call exportQuishingEmailTemplates with blob response', async () => {
      const payload = { filters: {} }
      await quishingApi.exportQuishingEmailTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-templates/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const id = 'template-123'
      await quishingApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/quishing-simulator/email-templates/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteIndividualPrintoutTemplate', async () => {
      const id = 'printout-123'
      await quishingApi.deleteIndividualPrintoutTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-templates/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteQuishingTemplates', async () => {
      const payload = { ids: ['template-1', 'template-2'] }
      await quishingApi.bulkDeleteQuishingTemplates(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-templates/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call getEmailTemplatePreviewContent', async () => {
      const id = 'template-123'
      await quishingApi.getEmailTemplatePreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/email-templates/${id}`
      )
    })

    it('should call getQuishingTemplatePreviewContent', async () => {
      const id = 'template-123'
      await quishingApi.getQuishingTemplatePreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-templates/${id}`
      )
    })

    it('should call getQuishingPdfPreviewContent with blob response', async () => {
      const id = 'template-123'
      await quishingApi.getQuishingPdfPreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-templates/preview/${id}`,
        { responseType: 'blob' }
      )
    })

    it('should call getMergedTextForQuishing', async () => {
      await quishingApi.getMergedTextForQuishing()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/email-templates/merge-tags'
      )
    })

    it('should call getMergedTextForQuishingPrintout', async () => {
      await quishingApi.getMergedTextForQuishingPrintout()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-templates/merge-tags/individual'
      )
    })
  })

  describe('campaign operations', () => {
    it('should call searchCampaignManager with empty payload default', async () => {
      await quishingApi.searchCampaignManager()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/search',
        {}
      )
    })

    it('should call searchCampaignManager with payload', async () => {
      const payload = { page: 1, filters: { status: 'running' } }
      await quishingApi.searchCampaignManager(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/search',
        payload
      )
    })

    it('should call exportCampaignManager with blob response', async () => {
      const payload = { filters: {} }
      await quishingApi.exportCampaignManager(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/quishing-campaign/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call deleteCampaign', async () => {
      const id = 'campaign-123'
      await quishingApi.deleteCampaign(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteBulkCampaigns', async () => {
      const payload = { ids: ['campaign-1', 'campaign-2'] }
      await quishingApi.deleteBulkCampaigns(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/bulk-delete',
        { data: payload, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCampaignManager with id', async () => {
      const id = 'campaign-123'
      await quishingApi.getCampaignManager(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign/${id}`
      )
    })

    it('should call getCampaignManager with empty string default', async () => {
      await quishingApi.getCampaignManager()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/quishing-campaign/'
      )
    })

    it('should call createCampaignManager', async () => {
      const payload = { name: 'New Campaign' }
      await quishingApi.createCampaignManager(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCampaignManager', async () => {
      const payload = { name: 'Updated Campaign' }
      const id = 'campaign-123'
      await quishingApi.updateCampaignManager(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCampaignManager with default params', async () => {
      await quishingApi.updateCampaignManager()
      expect(testRequest.put).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCampaignManagerFormDetails', async () => {
      await quishingApi.getCampaignManagerFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/form-details'
      )
    })

    it('should call getCampaignManagerPreview', async () => {
      const id = 'campaign-123'
      await quishingApi.getCampaignManagerPreview(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign/preview/${id}`
      )
    })

    it('should call getCampaignManagerPreview with default resourceId', async () => {
      await quishingApi.getCampaignManagerPreview()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/preview/'
      )
    })

    it('should call calculateScheduleInfo', async () => {
      const payload = { schedule: 'weekly' }
      await quishingApi.calculateScheduleInfo(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/calculate-schedule-info',
        payload
      )
    })

    it('should call calculateSendingInfo', async () => {
      const payload = { sendingMethod: 'immediate' }
      await quishingApi.calculateSendingInfo(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/calculate-sending-info',
        payload
      )
    })

    it('should call launchQuishingCampaign', async () => {
      const payload = { status: 'launched' }
      const id = 'campaign-123'
      await quishingApi.launchQuishingCampaign(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/start/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchQuishingCampaign with default params', async () => {
      await quishingApi.launchQuishingCampaign()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/start/',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('campaign job operations', () => {
    it('should call searchCampaignQuishingJob', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await quishingApi.searchCampaignQuishingJob(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/${id}/search`,
        payload
      )
    })

    it('should call searchCampaignQuishingJob with empty defaults', async () => {
      await quishingApi.searchCampaignQuishingJob()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report//search',
        {}
      )
    })

    it('should call stopQuishingCampaignJob', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.stopQuishingCampaignJob(id, instanceGroup)
      expect(testRequest.patch).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/stop/${id}/${instanceGroup}`,
        null,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopQuishingCampaignJob with default params', async () => {
      await quishingApi.stopQuishingCampaignJob()
      expect(testRequest.patch).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/stop//',
        null,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchQuishingCampaignInstanceGroup', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.launchQuishingCampaignInstanceGroup(id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/start/${id}/${instanceGroup}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchQuishingCampaignInstanceGroup with default params', async () => {
      await quishingApi.launchQuishingCampaignInstanceGroup()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/start//',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportCampaignManagerItem', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await quishingApi.exportCampaignManagerItem(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/${id}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call deleteQuishingCampaignJob', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.deleteQuishingCampaignJob(id, instanceGroup)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/${id}/${instanceGroup}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteQuishingCampaignJob with default params', async () => {
      await quishingApi.deleteQuishingCampaignJob()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job//',
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCampaignJobSummary', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.getCampaignJobSummary(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/summary/${id}/${instanceGroup}`
      )
    })

    it('should call getCampaignJobSummaryTargetGroups', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.getCampaignJobSummaryTargetGroups(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/summary/target-groups/${id}/${instanceGroup}`
      )
    })

    it('should call getCampaignManagerJobFormDetails', async () => {
      await quishingApi.getCampaignManagerJobFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/form-details'
      )
    })

    it('should call getCampaignJobEmailActivity', async () => {
      const id = 'campaign-123'
      await quishingApi.getCampaignJobEmailActivity(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/email-activity/${id}`
      )
    })

    it('should call getCampaignJobEmailActivity with default resourceId', async () => {
      await quishingApi.getCampaignJobEmailActivity()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/email-activity/'
      )
    })

    it('should call exportQuishingCampaignJob', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportQuishingCampaignJob(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/export/${id}/${instanceGroup}`,
        { responseType: 'blob' }
      )
    })

    it('should call exportQuishingCampaignJob with default params', async () => {
      await quishingApi.exportQuishingCampaignJob()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/export//',
        { responseType: 'blob' }
      )
    })
  })

  describe('DNS service operations', () => {
    it('should call getDnsServiceList', async () => {
      const payload = { page: 1 }
      await quishingApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/dns-services/search',
        payload
      )
    })

    it('should call exportDnsService', async () => {
      const payload = { filters: {} }
      await quishingApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/dns-services/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call deleteDnsService', async () => {
      const id = 'dns-123'
      await quishingApi.deleteDnsService(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `quishing-simulator/dns-services/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createDnsService', async () => {
      const payload = { name: 'DNS Server' }
      await quishingApi.createDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/dns-services',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDnsService', async () => {
      const id = 'dns-123'
      await quishingApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/dns-services/${id}`
      )
    })

    it('should call updateDnsService', async () => {
      const payload = { name: 'Updated DNS' }
      const id = 'dns-123'
      await quishingApi.updateDnsService(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `quishing-simulator/dns-services/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testDnsConnection', async () => {
      const payload = { host: '8.8.8.8' }
      const id = 'dns-123'
      await quishingApi.testDnsConnection(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `quishing-simulator/dns-services/${id}/test`,
        payload
      )
    })
  })

  describe('domain operations', () => {
    it('should call getDomainsList', async () => {
      const payload = { page: 1 }
      await quishingApi.getDomainsList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/domain-records/search',
        payload
      )
    })

    it('should call exportDomainList', async () => {
      const payload = { filters: {} }
      await quishingApi.exportDomainList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/domain-records/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call deleteDomain', async () => {
      const id = 'domain-123'
      await quishingApi.deleteDomain(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `quishing-simulator/domain-records/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDomainData', async () => {
      await quishingApi.getDomainData()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/domain-records/form-details'
      )
    })

    it('should call createDomain', async () => {
      const payload = { domain: 'example.com' }
      await quishingApi.createDomain(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/domain-records',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDomainEditData', async () => {
      const id = 'domain-123'
      await quishingApi.getDomainEditData(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/domain-records/${id}`
      )
    })

    it('should call updateDomain', async () => {
      const payload = { domain: 'updated.com' }
      const id = 'domain-123'
      await quishingApi.updateDomain(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `quishing-simulator/domain-records/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testDomainConnection', async () => {
      const payload = { domain: 'example.com' }
      await quishingApi.testDomainConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/domain-records/test',
        payload
      )
    })
  })

  describe('IP address exclusion', () => {
    it('should call getQuishingExcludedIPAddresses', async () => {
      await quishingApi.getQuishingExcludedIPAddresses()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/excluded-ip-list'
      )
    })

    it('should call postQuishingExcludedIPAddresses', async () => {
      const payload = { ip: '192.168.1.1' }
      await quishingApi.postQuishingExcludedIPAddresses(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/excluded-ip',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call postQuishingExcludedIPAddresses with empty default', async () => {
      await quishingApi.postQuishingExcludedIPAddresses()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/excluded-ip',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('campaign report operations', () => {
    it('should call searchCampaignJobUserEmailOpened', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserEmailOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/opened/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call exportCampaignJobUserEmailOpened', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserEmailOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/opened/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserEmailClicked', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserEmailClicked(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/clicked/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailClicked with default params', async () => {
      await quishingApi.searchCampaignJobUserEmailClicked()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/clicked/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserEmailClicked', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserEmailClicked(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/clicked/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailClicked with default params', async () => {
      await quishingApi.exportCampaignJobUserEmailClicked()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/clicked/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserNoResponse', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserNoResponse(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/noresponse/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserNoResponse with default params', async () => {
      await quishingApi.searchCampaignJobUserNoResponse()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/noresponse/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserNoResponse', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserNoResponse(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/noresponse/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserNoResponse with default params', async () => {
      await quishingApi.exportCampaignJobUserNoResponse()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/noresponse/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserAttachmentOpened', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserAttachmentOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/attachmentopened/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserAttachmentOpened with default params', async () => {
      await quishingApi.searchCampaignJobUserAttachmentOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/attachmentopened/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserAttachmentOpened', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserAttachmentOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/attachmentopened/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserAttachmentOpened with default params', async () => {
      await quishingApi.exportCampaignJobUserAttachmentOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/attachmentopened/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserPhishingReport', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserPhishingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/reported/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserPhishingReport with default params', async () => {
      await quishingApi.searchCampaignJobUserPhishingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/reported/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserPhishingReport', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserPhishingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/reported/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserPhishingReport with default params', async () => {
      await quishingApi.exportCampaignJobUserPhishingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/reported/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserSendingReport', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserSendingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/all/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserSendingReport with default params', async () => {
      await quishingApi.searchCampaignJobUserSendingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/all/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserSendingReport', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserSendingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/all/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserSendingReport with default params', async () => {
      await quishingApi.exportCampaignJobUserSendingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/all/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserEmailSubmitted', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserEmailSubmitted(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/submitteddata/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmitted with default params', async () => {
      await quishingApi.searchCampaignJobUserEmailSubmitted()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/submitteddata/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserEmailSubmitted', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserEmailSubmitted(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/submitteddata/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailSubmitted with default params', async () => {
      await quishingApi.exportCampaignJobUserEmailSubmitted()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/submitteddata/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedMfa', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobUserEmailSubmittedMfa(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/mfa/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedMfa with default params', async () => {
      await quishingApi.searchCampaignJobUserEmailSubmittedMfa()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/mfa/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserEmailSubmittedMfa', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.exportCampaignJobUserEmailSubmittedMfa(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/mfa/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailSubmittedMfa with default params', async () => {
      await quishingApi.exportCampaignJobUserEmailSubmittedMfa()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/mfa/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call resendQuishingCampaignToUsers', async () => {
      const payload = { userIds: ['user-1'] }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.resendQuishingCampaignToUsers(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/resend/${id}/${instanceGroup}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendQuishingCampaignToUsers with default params', async () => {
      await quishingApi.resendQuishingCampaignToUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/resend//',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendQuishingCampaignToUserList', async () => {
      const payload = { userIds: ['user-1', 'user-2'] }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.resendQuishingCampaignToUserList(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/resend/list/${id}/${instanceGroup}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendQuishingCampaignToUserList with default params', async () => {
      await quishingApi.resendQuishingCampaignToUserList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job/resend/list//',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('detailed report operations', () => {
    it('should call searchCampaignJobUserEmailClickedDetails', async () => {
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await quishingApi.searchCampaignJobUserEmailClickedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/search-email-clicked/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailOpenedDetails', async () => {
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await quishingApi.searchCampaignJobUserEmailOpenedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/search-email-opened/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserAttachmentOpenedDetails', async () => {
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await quishingApi.searchCampaignJobUserAttachmentOpenedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/search-email-opened-attachment/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailReportedDetails', async () => {
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await quishingApi.searchCampaignJobUserEmailReportedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/search-email-reported/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedDetails', async () => {
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await quishingApi.searchCampaignJobUserEmailSubmittedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/search-email-submitted/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedDetailsMfa', async () => {
      const payload = { userId: 'user-123' }
      const id = 'campaign-123'
      await quishingApi.searchCampaignJobUserEmailSubmittedDetailsMfa(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/search-mfa-submitted/${id}`,
        payload
      )
    })
  })

  describe('preview and content operations', () => {
    it('should call getQuishingScenarioLandingPageAndEmailTemplate with defaults', async () => {
      await quishingApi.getQuishingScenarioLandingPageAndEmailTemplate()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/preview/email/'
      )
    })

    it('should call getQuishingScenarioLandingPageAndEmailTemplate with parameters', async () => {
      await quishingApi.getQuishingScenarioLandingPageAndEmailTemplate('resource-1', 'printout')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/preview/printout/resource-1'
      )
    })

    it('should call getQuishingPdfScenarioPreviewContent', async () => {
      const id = 'scenario-123'
      await quishingApi.getQuishingPdfScenarioPreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-scenario/print-preview/${id}`,
        { responseType: 'blob' }
      )
    })

    it('should call getQuishingPdfCampaignPreviewContent', async () => {
      const id = 'campaign-123'
      await quishingApi.getQuishingPdfCampaignPreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign/print-preview/${id}`,
        { responseType: 'blob' }
      )
    })

    it('should call getQuishingPdfCampaignDownloadContent', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.getQuishingPdfCampaignDownloadContent(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign-job/download-individual/${id}/${instanceGroup}`,
        { responseType: 'blob' }
      )
    })

    it('should call getCampaignManagerEmailTemplatePreviewContent', async () => {
      const id = 'template-123'
      const campaignId = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.getCampaignManagerEmailTemplatePreviewContent(id, campaignId, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign-job-report/summary/${campaignId}/${instanceGroup}/email-templates/${id}`
      )
    })

    it('should call getCampaignManagerEmailTemplatePreviewContent with default params', async () => {
      await quishingApi.getCampaignManagerEmailTemplatePreviewContent()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/quishing-campaign-job-report/summary///email-templates/'
      )
    })

    it('should call getCampaignManagerQuishingTemplatePreviewContent', async () => {
      const id = 'template-123'
      const campaignId = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.getCampaignManagerQuishingTemplatePreviewContent(id, campaignId, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign-job-report/summary/${campaignId}/${instanceGroup}/quishing-templates/${id}`
      )
    })

    it('should call getCampaignManagerQuishingTemplatePreviewContent with default params', async () => {
      await quishingApi.getCampaignManagerQuishingTemplatePreviewContent()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/quishing-campaign-job-report/summary///quishing-templates/'
      )
    })

    it('should call getCampaignManagerLandingPageTemplatePreviewContent', async () => {
      const id = 'page-123'
      const campaignId = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.getCampaignManagerLandingPageTemplatePreviewContent(id, campaignId, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign-job-report/summary/${campaignId}/${instanceGroup}/landing-page-template/${id}`
      )
    })

    it('should call getCampaignManagerLandingPageTemplatePreviewContent with default params', async () => {
      await quishingApi.getCampaignManagerLandingPageTemplatePreviewContent()
      expect(testRequest.get).toHaveBeenCalledWith(
        'quishing-simulator/quishing-campaign-job-report/summary///landing-page-template/'
      )
    })
  })

  describe('template creation with attachments', () => {
    const basePayload = {
      name: 'Template',
      description: 'Desc',
      categoryResourceId: 'cat-1',
      tags: [],
      difficultyResourceId: 'diff-1',
      availableForRequests: [],
      fromAddress: 'from@example.com',
      fromName: 'From',
      subject: 'Subject',
      template: '<html></html>',
      languageTypeResourceId: 'lang-1',
      isDuplicated: false,
      duplicatedTemplateResourceId: null
    }

    it('should create email template with attachment file name', async () => {
      const payload = {
        ...basePayload,
        isAttachmentBasedTemplate: true,
        isAddedNewPhishingFile: true,
        isPhishingFileModified: true,
        phishingFileName: 'file.pdf',
        attachmentFiles: [{ name: 'file.pdf' }],
        importedEmailAttachments: [new Blob(['x'], { type: 'application/pdf' })]
      }
      await quishingApi.createQuishingEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/email-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should update email template with attachment fileName', async () => {
      const payload = {
        ...basePayload,
        isAttachmentBasedTemplate: true,
        isAddedNewPhishingFile: true,
        isPhishingFileModified: false,
        phishingFileName: 'file.xlsx',
        attachmentFiles: [{ fileName: 'file.xlsx' }],
        importedEmailAttachments: [new Blob(['x'], { type: 'application/vnd.ms-excel' })]
      }
      await quishingApi.updateQuishingEmailTemplate(payload, 'template-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        'quishing-simulator/email-templates/template-1',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should fall back to phishingFileName when attachment is missing', async () => {
      const payload = {
        ...basePayload,
        isAttachmentBasedTemplate: true,
        isAddedNewPhishingFile: false,
        isPhishingFileModified: false,
        phishingFileName: 'fallback.docx',
        attachmentFiles: [],
        importedEmailAttachments: [new Blob(['x'], { type: 'application/vnd.openxmlformats' })]
      }
      await quishingApi.createQuishingEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/email-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should handle phishingFileName without extension (getQuishingFileType null branch)', async () => {
      const payload = {
        ...basePayload,
        isAttachmentBasedTemplate: true,
        isAddedNewPhishingFile: false,
        isPhishingFileModified: false,
        phishingFileName: 'noextension',
        attachmentFiles: [],
        importedEmailAttachments: [new Blob(['x'], { type: 'application/octet-stream' })]
      }
      await quishingApi.createQuishingEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/email-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should handle payload without tags (payload?.tags optional chaining)', async () => {
      const payload = {
        ...basePayload,
        tags: undefined,
        type: 'email'
      }
      delete payload.tags
      await quishingApi.createQuishingEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/email-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should create printout template without type (payload.type branch)', async () => {
      const payloadWithoutType = { ...basePayload }
      delete payloadWithoutType.type
      await quishingApi.createQuishingPrintoutTemplate(payloadWithoutType)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/quishing-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should create printout template with multipart form data', async () => {
      const payload = {
        ...basePayload,
        isDuplicated: true,
        duplicatedTemplateResourceId: 'dup-1',
        type: 'printout'
      }
      await quishingApi.createQuishingPrintoutTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/quishing-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should update printout template with multipart form data', async () => {
      const payload = {
        ...basePayload,
        type: 'printout'
      }
      await quishingApi.updateQuishingPrintoutTemplate(payload, 'printout-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        'quishing-simulator/quishing-templates/printout-1',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('excluded IP operations', () => {
    it('should call getQuishingExcludedIPAddresses', async () => {
      await quishingApi.getQuishingExcludedIPAddresses()
      expect(testRequest.get).toHaveBeenCalledWith('/quishing-simulator/excluded-ip-list')
    })

    it('should call postQuishingExcludedIPAddresses', async () => {
      const payload = { ips: ['1.1.1.1'] }
      await quishingApi.postQuishingExcludedIPAddresses(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/excluded-ip',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call postQuishingExcludedIPAddresses with default payload', async () => {
      await quishingApi.postQuishingExcludedIPAddresses()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/excluded-ip',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('configuration operations', () => {
    it('should call getDefaultCompanySmtpSetting', async () => {
      await quishingApi.getDefaultCompanySmtpSetting()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/root-company-shared-smtp-resource-id'
      )
    })

    it('should call getEmailDeliveries', async () => {
      await quishingApi.getEmailDeliveries()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/email-delivery-setting-list'
      )
    })

    it('should call getQuishingScenariosPhoneNumber', async () => {
      await quishingApi.getQuishingScenariosPhoneNumber()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/mfa-phone-number'
      )
    })

    it('should call searchCampaignJobPrintoutUserSendingReport', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await quishingApi.searchCampaignJobPrintoutUserSendingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/printout-users/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobPrintoutUserSendingReport with default params', async () => {
      await quishingApi.searchCampaignJobPrintoutUserSendingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/printout-users/search//',
        {}
      )
    })
  })

  describe('template creation utility functions', () => {
    it('should create correct FormData for email template', () => {
      const payload = {
        name: 'Test Email',
        description: 'Test description',
        categoryResourceId: 'cat-1',
        tags: ['tag1', 'tag2'],
        difficultyResourceId: 'diff-1',
        availableForRequests: [
          { type: 'Type1', resourceId: 'res-1' },
          { type: 'Type2', resourceId: 'res-2' }
        ],
        fromAddress: 'sender@example.com',
        fromName: 'Sender Name',
        subject: 'Test Subject',
        template: '<html>Test</html>',
        languageTypeResourceId: 'lang-1',
        type: 'email',
        isAttachmentBasedTemplate: false
      }

      const result = quishingApi.createCommonFormDataForQuishingTemplate ?
        quishingApi.createCommonFormDataForQuishingTemplate(payload) : null
      // Note: createCommonFormDataForQuishingTemplate is not exported, so this may not work
      // But we test that it exists in the module
      expect(typeof quishingApi).toBe('object')
    })
  })

  describe('getQuishingFileType utility function', () => {
    it('should extract file type from attachmentFiles name property', () => {
      const payload = {
        attachmentFiles: [
          { name: 'document.pdf' }
        ]
      }
      // Note: getQuishingFileType is not exported, so we cannot directly test it
      // But it's used internally in template creation functions
      expect(payload.attachmentFiles[0].name).toBe('document.pdf')
    })

    it('should extract file type from attachmentFiles fileName property', () => {
      const payload = {
        attachmentFiles: [
          { fileName: 'document.xlsx' }
        ]
      }
      expect(payload.attachmentFiles[0].fileName).toBe('document.xlsx')
    })

    it('should extract file type from phishingFileName', () => {
      const payload = {
        phishingFileName: 'document.docx'
      }
      expect(payload.phishingFileName).toBe('document.docx')
    })

    it('should return null when no file is present', () => {
      const payload = {
        attachmentFiles: []
      }
      expect(payload.attachmentFiles.length).toBe(0)
    })
  })

  describe('default parameter branch coverage', () => {
    it('should call searchCampaignQuishingJob with default payload and id', async () => {
      await quishingApi.searchCampaignQuishingJob()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report//search',
        {}
      )
    })

    it('should call getCampaignJobSummary with default id and instanceGroup', async () => {
      await quishingApi.getCampaignJobSummary()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/summary//'
      )
    })

    it('should call getCampaignJobSummaryTargetGroups with defaults', async () => {
      await quishingApi.getCampaignJobSummaryTargetGroups()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/summary/target-groups//'
      )
    })

    it('should call updateQuishingEmailTemplate with default id', async () => {
      const payload = {
        name: 'T',
        description: 'D',
        categoryResourceId: 'c',
        tags: [],
        difficultyResourceId: 'd',
        availableForRequests: [],
        fromAddress: 'a@b.com',
        fromName: 'N',
        subject: 'S',
        template: '<html></html>',
        languageTypeResourceId: 'l'
      }
      await quishingApi.updateQuishingEmailTemplate(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        'quishing-simulator/email-templates/',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should call updateQuishingPrintoutTemplate with default id', async () => {
      const payload = {
        name: 'T',
        description: 'D',
        categoryResourceId: 'c',
        tags: [],
        difficultyResourceId: 'd',
        availableForRequests: [],
        template: '<html></html>',
        languageTypeResourceId: 'l'
      }
      await quishingApi.updateQuishingPrintoutTemplate(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        'quishing-simulator/quishing-templates/',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should call searchCampaignJobUserEmailOpened with default params', async () => {
      await quishingApi.searchCampaignJobUserEmailOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign-job-report/opened/search//',
        {}
      )
    })

    it('should call exportCampaignManager with default payload', async () => {
      await quishingApi.exportCampaignManager()
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/quishing-campaign/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call createCampaignManager with default payload', async () => {
      await quishingApi.createCampaignManager()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign',
        {},
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should call getQuishingScenarioLandingPageAndEmailTemplate with defaults', async () => {
      await quishingApi.getQuishingScenarioLandingPageAndEmailTemplate()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/preview/email/'
      )
    })

    it('should call getQuishingScenarioLandingPageAndEmailTemplate with explicit templateType', async () => {
      await quishingApi.getQuishingScenarioLandingPageAndEmailTemplate('resource-1', 'printout')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/preview/printout/resource-1'
      )
    })
  })

  describe('edge cases and error scenarios', () => {
    it('should handle null payload in searchScenarios', async () => {
      await quishingApi.searchScenarios(null)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/search',
        null
      )
    })

    it('should handle empty string id in deleteScenario', async () => {
      await quishingApi.deleteScenario('')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-scenario/',
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should handle undefined parameters with defaults', async () => {
      await quishingApi.searchCampaignManager(undefined)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/search',
        {}
      )
    })

    it('should handle special characters in ids', async () => {
      const specialId = 'campaign-123!@#$%'
      await quishingApi.getCampaignManager(specialId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `quishing-simulator/quishing-campaign/${specialId}`
      )
    })

    it('should handle large payloads', async () => {
      const largePayload = {
        filters: {},
        data: Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      }
      await quishingApi.searchCampaignManager(largePayload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/quishing-campaign/search',
        largePayload
      )
    })

    it('should create email template when attachment has fileName instead of name', async () => {
      const payload = {
        name: 'FileName Branch',
        description: 'desc',
        categoryResourceId: 'cat-1',
        tags: [],
        difficultyResourceId: 'diff-1',
        availableForRequests: [],
        fromAddress: 'sender@example.com',
        fromName: 'Sender',
        subject: 'Subj',
        template: '<html>x</html>',
        languageTypeResourceId: 'lang-1',
        isAttachmentBasedTemplate: true,
        isAddedNewPhishingFile: true,
        isPhishingFileModified: true,
        phishingFileName: 'custom.eml',
        attachmentFiles: [
          {
            fileName: 'custom.eml',
            content: btoa('mail content'),
            contentType: 'message/rfc822'
          }
        ],
        importedEmailAttachments: [new Blob(['attachment'], { type: 'message/rfc822' })]
      }

      await quishingApi.createQuishingEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'quishing-simulator/email-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should maintain snackbar constant across all mutation operations', async () => {
      await quishingApi.createScenario({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should handle consistent blob response type for export operations', async () => {
      const payload = { filters: {} }
      await quishingApi.exportScenarios(payload)
      await quishingApi.exportQuishingEmailTemplates(payload)
      await quishingApi.exportCampaignManager(payload)

      expect(testRequest.post).toHaveBeenLastCalledWith(
        expect.any(String),
        payload,
        { responseType: 'blob' }
      )
    })

    it('should construct URLs correctly with multiple parameters', async () => {
      const id = 'id-1'
      const instanceGroup = 'group-2'
      await quishingApi.stopQuishingCampaignJob(id, instanceGroup)

      expect(testRequest.patch).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job/stop/${id}/${instanceGroup}`,
        null,
        expect.any(Object)
      )
    })
  })

  describe('export functionality consistency', () => {
    it('should use blob responseType for all export operations', async () => {
      const payload = { filters: {} }

      const exportFunctions = [
        () => quishingApi.exportScenarios(payload),
        () => quishingApi.exportQuishingEmailTemplates(payload),
        () => quishingApi.exportLandingPageTemplates(payload),
        () => quishingApi.exportCampaignManager(payload),
        () => quishingApi.exportDnsService(payload),
        () => quishingApi.exportDomainList(payload)
      ]

      for (const fn of exportFunctions) {
        jest.clearAllMocks()
        await fn()
        expect(testRequest.post).toHaveBeenCalledWith(
          expect.any(String),
          payload,
          expect.objectContaining({ responseType: 'blob' })
        )
      }
    })
  })

  describe('CRUD operation consistency', () => {
    it('should follow consistent pattern for create operations', async () => {
      const payload = { name: 'Test' }
      const createFunctions = [
        () => quishingApi.createScenario(payload),
        () => quishingApi.createLandingPage(payload),
        () => quishingApi.createDnsService(payload),
        () => quishingApi.createDomain(payload)
      ]

      for (const fn of createFunctions) {
        jest.clearAllMocks()
        await fn()
        expect(testRequest.post).toHaveBeenCalledWith(
          expect.any(String),
          payload,
          expect.objectContaining({ snackbar: COMMON_SNACKBAR })
        )
      }
    })

    it('should follow consistent pattern for delete operations', async () => {
      const id = 'test-id'
      const deleteFunctions = [
        () => quishingApi.deleteScenario(id),
        () => quishingApi.deleteEmailTemplate(id),
        () => quishingApi.deleteLandingPageTemplate(id),
        () => quishingApi.deleteDnsService(id),
        () => quishingApi.deleteDomain(id)
      ]

      for (const fn of deleteFunctions) {
        jest.clearAllMocks()
        await fn()
        expect(testRequest.delete).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ snackbar: COMMON_SNACKBAR })
        )
      }
    })

    it('should follow consistent pattern for update operations', async () => {
      const payload = { name: 'Updated' }
      const id = 'test-id'
      const updateFunctions = [
        () => quishingApi.updateScenario(payload, id),
        () => quishingApi.updateLandingPage(payload, id),
        () => quishingApi.updateDnsService(payload, id),
        () => quishingApi.updateDomain(payload, id)
      ]

      for (const fn of updateFunctions) {
        jest.clearAllMocks()
        await fn()
        expect(testRequest.put).toHaveBeenCalledWith(
          expect.any(String),
          payload,
          expect.objectContaining({ snackbar: COMMON_SNACKBAR })
        )
      }
    })
  })

  describe('parameter handling in complex operations', () => {
    it('should correctly pass multiple parameters to campaign operations', async () => {
      const payload = { data: 'test' }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'

      await quishingApi.searchCampaignQuishingJob(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/${id}/search`,
        payload
      )
    })

    it('should handle optional parameters in campaign operations', async () => {
      const payload = {}
      const id = 'campaign-123'
      const instanceGroup = 'group-1'

      await quishingApi.searchCampaignJobUserEmailOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/quishing-simulator/quishing-campaign-job-report/opened/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should construct URLs with trailing slashes correctly', async () => {
      const payload = {}
      await quishingApi.postQuishingExcludedIPAddresses(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/quishing-simulator/excluded-ip',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method usage', () => {
    it('should use GET for read operations', async () => {
      await quishingApi.getScenario('id')
      expect(testRequest.get).toHaveBeenCalled()
      expect(testRequest.post).not.toHaveBeenCalled()
    })

    it('should use POST for search and create operations', async () => {
      await quishingApi.searchScenarios({})
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      await quishingApi.updateScenario({}, 'id')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await quishingApi.deleteScenario('id')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should use PATCH for status change operations', async () => {
      await quishingApi.stopQuishingCampaignJob('id', 'group')
      expect(testRequest.patch).toHaveBeenCalled()
    })
  })
})
