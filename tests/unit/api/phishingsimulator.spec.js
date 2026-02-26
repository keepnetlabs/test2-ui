// Mock testRequest before any imports
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
import * as phishingApi from '@/api/phishingsimulator'

describe('phishingsimulator API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('convertContentToFile', () => {
    it('should return File object as is', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const result = phishingApi.convertContentToFile(file)
      expect(result).toBe(file)
    })

    it('should convert base64 string content to File', () => {
      const base64Content = btoa('test content')
      const attachment = {
        name: 'test.txt',
        content: base64Content,
        contentType: 'text/plain'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result).toBeInstanceOf(File)
      expect(result.name).toBe('test.txt')
    })

    it('should handle data URL format content', () => {
      const base64Content = btoa('test content')
      const attachment = {
        name: 'test.pdf',
        content: `data:application/pdf;base64,${base64Content}`,
        contentType: 'application/pdf'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result).toBeInstanceOf(File)
    })

    it('should use fileName when name is not provided', () => {
      const base64Content = btoa('test')
      const attachment = {
        fileName: 'document.docx',
        content: base64Content,
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result.name).toBe('document.docx')
    })

    it('should use default filename when none provided', () => {
      const base64Content = btoa('test')
      const attachment = {
        content: base64Content,
        contentType: 'text/plain'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result.name).toBe('attachment')
    })

    it('should handle Blob content', () => {
      const blob = new Blob(['content'], { type: 'text/plain' })
      const attachment = {
        name: 'test.txt',
        content: blob,
        contentType: 'text/plain'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result).toBeInstanceOf(File)
    })

    it('should use fileType property for MIME type', () => {
      const base64Content = btoa('test')
      const attachment = {
        name: 'image.png',
        content: base64Content,
        fileType: 'image/png'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result.type).toBe('image/png')
    })

    it('should use type property for MIME type', () => {
      const base64Content = btoa('test')
      const attachment = {
        name: 'doc.pdf',
        content: base64Content,
        type: 'application/pdf'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result.type).toBe('application/pdf')
    })

    it('should default to application/octet-stream', () => {
      const base64Content = btoa('test')
      const attachment = {
        name: 'file',
        content: base64Content
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result.type).toBe('application/octet-stream')
    })

    it('should return original attachment if no content', () => {
      const attachment = { name: 'test' }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result).toEqual(attachment)
    })

    it('should handle non-string non-Blob content with fallback', () => {
      const attachment = {
        name: 'data.bin',
        content: new Uint8Array([1, 2, 3]),
        contentType: 'application/octet-stream'
      }
      const result = phishingApi.convertContentToFile(attachment)
      expect(result).toBeInstanceOf(File)
      expect(result.name).toBe('data.bin')
    })

    it('should fallback when base64 decode fails', () => {
      const originalAtob = global.atob
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      global.atob = jest.fn(() => {
        throw new Error('decode failed')
      })

      const attachment = {
        name: 'fallback.txt',
        content: '!!!invalid-base64!!!',
        contentType: 'text/plain'
      }
      const result = phishingApi.convertContentToFile(attachment)

      expect(result).toBeInstanceOf(File)
      expect(result.name).toBe('fallback.txt')
      expect(consoleErrorSpy).toHaveBeenCalled()
      global.atob = originalAtob
      consoleErrorSpy.mockRestore()
    })
  })

  describe('email template operations', () => {
    it('should call createPhishingEmailTemplate with formData', async () => {
      const payload = {
        name: 'Test Template',
        description: 'Test',
        categoryResourceId: 'cat-1',
        tags: ['tag1'],
        difficultyResourceId: 'diff-1',
        availableForRequests: [{ type: 'Type1', resourceId: 'res-1' }],
        languages: [{
          fromAddress: 'test@example.com',
          fromName: 'Test',
          subject: 'Test Subject',
          template: '<html>Test</html>',
          languageTypeResourceId: 'lang-1'
        }],
        isDuplicated: false,
        isAttachmentBasedTemplate: false
      }
      await phishingApi.createPhishingEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/email-templates',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should create attachment based template and set file fields', async () => {
      const payload = {
        name: 'Attachment Template',
        description: 'Attachment',
        categoryResourceId: 'cat-1',
        tags: [],
        difficultyResourceId: 'diff-1',
        availableForRequests: [],
        languages: [
          {
            fromAddress: 'test@example.com',
            fromName: 'Test',
            subject: 'Attachment Subject',
            template: '<html>Attachment</html>',
            languageTypeResourceId: 'lang-1'
          }
        ],
        isAttachmentBasedTemplate: true,
        isAddedNewPhishingFile: true,
        isPhishingFileModified: true,
        phishingFileName: 'sample.pdf',
        attachmentFiles: [
          {
            fileName: 'sample.pdf',
            content: btoa('pdf-content'),
            contentType: 'application/pdf'
          }
        ]
      }

      await phishingApi.createPhishingEmailTemplate(payload)
      const formData = testRequest.post.mock.calls[0][1]

      expect(formData.get('phishingFileType')).toBe('pdf')
      expect(formData.get('isPhishingFileModified')).toBe('true')
      expect(formData.get('phishingFileName')).toBe('sample.pdf')
    })

    it('should call updatePhishingEmailTemplate with id and formData', async () => {
      const payload = {
        name: 'Updated Template',
        description: 'Updated',
        categoryResourceId: 'cat-1',
        tags: [],
        difficultyResourceId: 'diff-1',
        availableForRequests: [],
        languages: [{
          fromAddress: 'test@example.com',
          fromName: 'Test',
          subject: 'Subject',
          template: '<html></html>',
          languageTypeResourceId: 'lang-1'
        }],
        isAttachmentBasedTemplate: false
      }
      const id = 'template-123'
      await phishingApi.updatePhishingEmailTemplate(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/email-templates/${id}`,
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should append detailActionType in edit mode when provided', async () => {
      const payload = {
        name: 'Updated Template',
        description: 'Updated',
        categoryResourceId: 'cat-1',
        tags: [],
        difficultyResourceId: 'diff-1',
        availableForRequests: [],
        languages: [
          {
            fromAddress: 'test@example.com',
            fromName: 'Test',
            subject: 'Subject',
            template: '<html></html>',
            languageTypeResourceId: 'lang-1',
            detailActionType: 2
          }
        ],
        isAttachmentBasedTemplate: false
      }

      await phishingApi.updatePhishingEmailTemplate(payload, 'template-abc')
      const formData = testRequest.put.mock.calls[0][1]
      expect(formData.get('detailActionType')).toBe('2')
    })

    it('should call getEmailTemplatesList', async () => {
      const payload = { page: 1 }
      await phishingApi.getEmailTemplatesList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/email-templates/search',
        payload
      )
    })

    it('should call exportEmailTemplates with blob response', async () => {
      const payload = { filters: {} }
      await phishingApi.exportEmailTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/email-templates/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getEmailTemplatePreviewContent', async () => {
      const id = 'template-123'
      await phishingApi.getEmailTemplatePreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/email-templates/${id}`
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const id = 'template-123'
      await phishingApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/email-templates/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteEmailTemplates', async () => {
      const payload = { ids: ['template-1', 'template-2'] }
      await phishingApi.bulkDeleteEmailTemplates(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/email-templates/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call getMergedTextForPhishing', async () => {
      await phishingApi.getMergedTextForPhishing()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should call getCampaignManagerEmailTemplatePreviewContent', async () => {
      const id = 'template-123'
      const campaignId = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.getCampaignManagerEmailTemplatePreviewContent(id, campaignId, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/phishing-campaign-job-report/summary/${campaignId}/${instanceGroup}/email-templates/${id}`
      )
    })
  })

  describe('campaign operations', () => {
    it('should call searchCampaignManager with empty default payload', async () => {
      await phishingApi.searchCampaignManager()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/search',
        {}
      )
    })

    it('should call searchCampaignManager with payload', async () => {
      const payload = { page: 1, filters: {} }
      await phishingApi.searchCampaignManager(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/search',
        payload
      )
    })

    it('should call searchUnscheduledCampaigns', async () => {
      const payload = { page: 1 }
      await phishingApi.searchUnscheduledCampaigns(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/phishing-campaign/search/unscheduled',
        payload
      )
    })

    it('should call exportCampaignManager with blob response', async () => {
      const payload = { filters: {} }
      await phishingApi.exportCampaignManager(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/phishing-campaign/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call deleteCampaignManager', async () => {
      const id = 'campaign-123'
      await phishingApi.deleteCampaignManager(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/phishing-campaign/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteCampaignManager with default resourceId', async () => {
      await phishingApi.deleteCampaignManager()
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/phishing-campaign/',
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createCampaignManager with payload', async () => {
      const payload = { name: 'New Campaign' }
      await phishingApi.createCampaignManager(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCampaignManager', async () => {
      const payload = { name: 'Updated Campaign' }
      const id = 'campaign-123'
      await phishingApi.updateCampaignManager(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCampaignManager', async () => {
      const id = 'campaign-123'
      await phishingApi.getCampaignManager(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/phishing-campaign/${id}`
      )
    })

    it('should call getCampaignManager with default resourceId', async () => {
      await phishingApi.getCampaignManager()
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/phishing-campaign/'
      )
    })

    it('should call getCampaignManagerFormDetails', async () => {
      await phishingApi.getCampaignManagerFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/form-details'
      )
    })

    it('should call getCampaignManagerPreview', async () => {
      const id = 'campaign-123'
      await phishingApi.getCampaignManagerPreview(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign/preview/${id}`
      )
    })

    it('should call getCampaignManagerPreview with default resourceId', async () => {
      await phishingApi.getCampaignManagerPreview()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/preview/'
      )
    })

    it('should call getDefaultCompanySmtpSetting', async () => {
      await phishingApi.getDefaultCompanySmtpSetting()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/root-company-shared-smtp-resource-id'
      )
    })

    it('should call getDefaultEmailDeliverySetting', async () => {
      await phishingApi.getDefaultEmailDeliverySetting()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/default-email-delivery-setting'
      )
    })
  })

  describe('scenario operations', () => {
    it('should call getPhishingScenarioLandingPageAndEmailTemplate', async () => {
      const id = 'resource-123'
      await phishingApi.getPhishingScenarioLandingPageAndEmailTemplate(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-scenario/preview/${id}`
      )
    })

    it('should call getPhishingScenarioLandingPageAndEmailTemplate with default resourceId', async () => {
      await phishingApi.getPhishingScenarioLandingPageAndEmailTemplate()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-scenario/preview/'
      )
    })

    it('should call getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId', async () => {
      const id = 'scenario-123'
      await phishingApi.getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-scenario/preview/${id}`
      )
    })

    it('should call getCampaignScenarioStatistics', async () => {
      await phishingApi.getCampaignScenarioStatistics()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-scenario/scenario-statistics'
      )
    })

    it('should call searchScenarioInfo', async () => {
      const payload = { category: 'phishing' }
      await phishingApi.searchScenarioInfo(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-scenario/search/category-info',
        payload
      )
    })

    it('should call getPhishingScenariosPhoneNumber', async () => {
      await phishingApi.getPhishingScenariosPhoneNumber()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-scenario/mfa-phone-number'
      )
    })

    it('should call getPhishingScenarioRoles', async () => {
      await phishingApi.getPhishingScenarioRoles()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/lookups/phishing-scenario-roles'
      )
    })
  })

  describe('campaign job operations', () => {
    it('should call searchCampaignPhishingJob', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await phishingApi.searchCampaignPhishingJob(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/${id}/search`,
        payload
      )
    })

    it('should call stopPhishingCampaignJob', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.stopPhishingCampaignJob(id, instanceGroup)
      expect(testRequest.patch).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job/stop/${id}/${instanceGroup}`,
        null,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopPhishingCampaignJob with default params', async () => {
      await phishingApi.stopPhishingCampaignJob()
      expect(testRequest.patch).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job/stop//',
        null,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchPhishingCampaign', async () => {
      const id = 'campaign-123'
      const payload = { status: 'running' }
      await phishingApi.launchPhishingCampaign(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job/start/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchPhishingCampaign with default params', async () => {
      await phishingApi.launchPhishingCampaign()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job/start/',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchPhishingCampaignInstanceGroup', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.launchPhishingCampaignInstanceGroup(id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job/start/${id}/${instanceGroup}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchPhishingCampaignInstanceGroup with default params', async () => {
      await phishingApi.launchPhishingCampaignInstanceGroup()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job/start//',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deletePhishingCampaignJob', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.deletePhishingCampaignJob(id, instanceGroup)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job/${id}/${instanceGroup}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deletePhishingCampaignJob with default params', async () => {
      await phishingApi.deletePhishingCampaignJob()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job//',
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCampaignManagerJobFormDetails', async () => {
      await phishingApi.getCampaignManagerJobFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job/form-details'
      )
    })

    it('should call getCampaignJobSummary', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.getCampaignJobSummary(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/summary/${id}/${instanceGroup}`
      )
    })

    it('should call getCampaignJobSummary with default id and instanceGroup', async () => {
      await phishingApi.getCampaignJobSummary()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/summary//'
      )
    })

    it('should call getCampaignJobSummaryForTraining', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.getCampaignJobSummaryForTraining(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/summary/training/${id}/${instanceGroup}`
      )
    })

    it('should call getCampaignJobSummaryForTraining with default params', async () => {
      await phishingApi.getCampaignJobSummaryForTraining()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/summary/training//'
      )
    })

    it('should call getCampaignJobSummaryTargetGroups', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.getCampaignJobSummaryTargetGroups(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/summary/target-groups/${id}/${instanceGroup}`
      )
    })

    it('should call getCampaignJobSummaryTargetGroups with default params', async () => {
      await phishingApi.getCampaignJobSummaryTargetGroups()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/summary/target-groups//'
      )
    })

    it('should call getCampaignJobEmailActivity', async () => {
      const id = 'campaign-123'
      await phishingApi.getCampaignJobEmailActivity(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job/email-activity/${id}`
      )
    })

    it('should call exportPhishingCampaignJob', async () => {
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportPhishingCampaignJob(id, instanceGroup)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/export/${id}/${instanceGroup}`,
        { responseType: 'blob' }
      )
    })

    it('should call exportPhishingCampaignJob with default params', async () => {
      await phishingApi.exportPhishingCampaignJob()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/export//',
        { responseType: 'blob' }
      )
    })

    it('should call resendPhishingCampaignToUsers with default params', async () => {
      await phishingApi.resendPhishingCampaignToUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job/resend//',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendPhishingCampaignToUserList with default params', async () => {
      await phishingApi.resendPhishingCampaignToUserList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job/resend/list//',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('campaign report operations', () => {
    it('should call searchCampaignJobUserEmailClicked', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserEmailClicked(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/clicked/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailClicked with default params', async () => {
      await phishingApi.searchCampaignJobUserEmailClicked()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/clicked/search//',
        {}
      )
    })

    it('should call searchCampaignJobUserEmailOpened', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserEmailOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/opened/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailOpened with default params', async () => {
      await phishingApi.searchCampaignJobUserEmailOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/opened/search//',
        {}
      )
    })

    it('should call searchCampaignJobUserAttachmentOpened', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserAttachmentOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/attachmentopened/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserAttachmentOpened with default params', async () => {
      await phishingApi.searchCampaignJobUserAttachmentOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/attachmentopened/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserAttachmentOpened with default params', async () => {
      await phishingApi.exportCampaignJobUserAttachmentOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/attachmentopened/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailClicked', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportCampaignJobUserEmailClicked(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/clicked/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailClicked with default params', async () => {
      await phishingApi.exportCampaignJobUserEmailClicked()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/clicked/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailOpened', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportCampaignJobUserEmailOpened(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/opened/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailOpened with default params', async () => {
      await phishingApi.exportCampaignJobUserEmailOpened()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/opened/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserNoResponse with default params', async () => {
      await phishingApi.searchCampaignJobUserNoResponse()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/noresponse/search//',
        {}
      )
    })

    it('should call searchCampaignJobUserNoResponse', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserNoResponse(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/noresponse/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call exportCampaignJobUserNoResponse', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportCampaignJobUserNoResponse(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/noresponse/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserNoResponse with default params', async () => {
      await phishingApi.exportCampaignJobUserNoResponse()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/noresponse/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserEmailSubmitted', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserEmailSubmitted(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/submitteddata/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmitted with default params', async () => {
      await phishingApi.searchCampaignJobUserEmailSubmitted()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/submitteddata/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserEmailSubmitted', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportCampaignJobUserEmailSubmitted(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/submitteddata/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserEmailSubmitted with default params', async () => {
      await phishingApi.exportCampaignJobUserEmailSubmitted()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/submitteddata/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserReplied', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserReplied(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/replied/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserReplied with default params', async () => {
      await phishingApi.searchCampaignJobUserReplied()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/replied/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserReplied with default params', async () => {
      await phishingApi.exportCampaignJobUserReplied()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/replied/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserRepliedDetails with default params', async () => {
      await phishingApi.searchCampaignJobUserRepliedDetails()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/search-email-replied/',
        {}
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedMfa with default params', async () => {
      await phishingApi.searchCampaignJobUserEmailSubmittedMfa()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/mfa/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserEmailSubmittedMfa with default params', async () => {
      await phishingApi.exportCampaignJobUserEmailSubmittedMfa()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/mfa/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserSendingReport', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserSendingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/all/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserSendingReport with default params', async () => {
      await phishingApi.searchCampaignJobUserSendingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/all/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserSendingReport', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportCampaignJobUserSendingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/all/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserSendingReport with default params', async () => {
      await phishingApi.exportCampaignJobUserSendingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/all/search/export//',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call searchCampaignJobUserPhishingReport', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserPhishingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/reported/search/${id}/${instanceGroup}`,
        payload
      )
    })

    it('should call searchCampaignJobUserPhishingReport with default params', async () => {
      await phishingApi.searchCampaignJobUserPhishingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/reported/search//',
        {}
      )
    })

    it('should call exportCampaignJobUserPhishingReport', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.exportCampaignJobUserPhishingReport(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/reported/search/export/${id}/${instanceGroup}`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCampaignJobUserPhishingReport with default params', async () => {
      await phishingApi.exportCampaignJobUserPhishingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/reported/search/export//',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('AI generation operations', () => {
    it('should call generateAIEmailTemplate', async () => {
      const payload = { prompt: 'Generate phishing email' }
      await phishingApi.generateAIEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/email-templates/generate',
        payload
      )
    })

    it('should call generateAILandingPageTemplate', async () => {
      const payload = { prompt: 'Generate landing page' }
      await phishingApi.generateAILandingPageTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/landing-page-template/generate',
        payload
      )
    })

    it('should call getAIEmailTemplateLimit', async () => {
      await phishingApi.getAIEmailTemplateLimit()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/email-templates/ai-limit'
      )
    })

    it('should call getAILandingPageTemplateLimit', async () => {
      await phishingApi.getAILandingPageTemplateLimit()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/landing-page-template/ai-limit'
      )
    })

    it('should call generateEmailTemplateTranslation', async () => {
      const payload = { templateId: 'template-123', language: 'es' }
      await phishingApi.generateEmailTemplateTranslation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/email-templates/translate',
        payload
      )
    })

    it('should call getGeneratedAIEmailTemplate', async () => {
      await phishingApi.getGeneratedAIEmailTemplate()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-simulator/email-templates')
    })

    it('should call getAIGenerationOptions', async () => {
      await phishingApi.getAIGenerationOptions()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/email-templates/ai-generation-options'
      )
    })

    it('should call getGeneratedAILandingPageTemplate', async () => {
      await phishingApi.getGeneratedAILandingPageTemplate()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-simulator/landing-page-template')
    })

    it('should call getEmailTemplateTranslation', async () => {
      const payload = { templateId: 'template-123', language: 'es' }
      await phishingApi.getEmailTemplateTranslation(payload)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/translated-email-templates',
        payload
      )
    })
  })

  describe('configuration operations', () => {
    it('should call calculateSendingInfo', async () => {
      const payload = { sendingMethod: 'immediate' }
      await phishingApi.calculateSendingInfo(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/calculate-sending-info',
        payload
      )
    })

    it('should call getCalculatedScheduleInfo', async () => {
      const payload = { schedule: 'weekly' }
      await phishingApi.getCalculatedScheduleInfo(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/calculate-schedule-info',
        payload
      )
    })

    it('should call getExcludedIPAddresses', async () => {
      await phishingApi.getExcludedIPAddresses()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/excluded-ip-list'
      )
    })

    it('should call postExcludedIPAddresses', async () => {
      const payload = { ip: '192.168.1.1' }
      await phishingApi.postExcludedIPAddresses(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/excluded-ip',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call postExcludedIPAddresses with default payload', async () => {
      await phishingApi.postExcludedIPAddresses()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/excluded-ip',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getEmailDeliveries', async () => {
      await phishingApi.getEmailDeliveries()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/email-delivery-setting-list'
      )
    })

    it('should call updateSandboxActivity', async () => {
      const payload = { activityType: 'clicked' }
      const id = 'resource-123'
      await phishingApi.updateSandboxActivity(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/activity/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteCampaignReports', async () => {
      const payload = { ids: ['campaign-1', 'campaign-2'] }
      await phishingApi.bulkDeleteCampaignReports(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/bulk-delete',
        { data: payload, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportCampaignManagerItem', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await phishingApi.exportCampaignManagerItem(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/${id}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getCampaignTargetGroups without query when params are empty', async () => {
      await phishingApi.getCampaignTargetGroups('campaign-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-1/target-groups'
      )
    })

    it('should call getCampaignTargetGroups with campaignType and instanceGroup', async () => {
      await phishingApi.getCampaignTargetGroups('campaign-2', {
        campaignType: 3,
        instanceGroup: 'group-a'
      })
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-2/target-groups?campaignType=3&instanceGroup=group-a'
      )
    })

    it('should call getCampaignTargetGroups with campaignType only', async () => {
      await phishingApi.getCampaignTargetGroups('campaign-3', { campaignType: 1 })
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-3/target-groups?campaignType=1'
      )
    })

    it('should call getCampaignTargetGroups with instanceGroup only', async () => {
      await phishingApi.getCampaignTargetGroups('campaign-4', { instanceGroup: 'main' })
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-4/target-groups?instanceGroup=main'
      )
    })

    it('should call getMergedTextForPhishing with default payload', async () => {
      await phishingApi.getMergedTextForPhishing()
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/email-templates/merge-tags',
        expect.objectContaining({
          reportAllPages: false,
          pageNumber: 1,
          pageSize: 10,
          orderBy: 'Name',
          ascending: true
        })
      )
    })

    it('should call callForCampaignReports', async () => {
      const payload = { pageNumber: 2, pageSize: 25 }
      await phishingApi.callForCampaignReports(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/search',
        payload
      )
    })

    it('should call exportCampaignReports with blob response', async () => {
      const payload = { filter: { keyword: 'campaign' } }
      await phishingApi.exportCampaignReports(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should omit query parameters when campaignType and instanceGroup are null', async () => {
      await phishingApi.getCampaignTargetGroups('campaign-nullable', {
        campaignType: null,
        instanceGroup: null
      })
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-nullable/target-groups'
      )
    })
  })

  describe('campaign report detail operations', () => {
    it('should call searchCampaignJobUserEmailClickedDetails', async () => {
      const payload = { page: 1 }
      const id = 'campaign-321'
      await phishingApi.searchCampaignJobUserEmailClickedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/search-email-clicked/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailOpenedDetails', async () => {
      const payload = { page: 2 }
      const id = 'campaign-654'
      await phishingApi.searchCampaignJobUserEmailOpenedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/search-email-opened/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailReportedDetails', async () => {
      const payload = { page: 3 }
      const id = 'campaign-987'
      await phishingApi.searchCampaignJobUserEmailReportedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/search-email-reported/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserAttachmentOpenedDetaiils', async () => {
      const payload = { page: 4 }
      const id = 'campaign-777'
      await phishingApi.searchCampaignJobUserAttachmentOpenedDetaiils(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/search-email-opened-attachment/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedDetails', async () => {
      const payload = { page: 5 }
      const id = 'campaign-888'
      await phishingApi.searchCampaignJobUserEmailSubmittedDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/search-email-submitted/${id}`,
        payload
      )
    })

    it('should call searchCampaignJobUserEmailSubmittedDetailsMfa', async () => {
      const payload = { page: 6 }
      const id = 'campaign-999'
      await phishingApi.searchCampaignJobUserEmailSubmittedDetailsMfa(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/search-mfa-submitted/${id}`,
        payload
      )
    })
  })

  describe('red flag operations', () => {
    it('should call checkRedFlags', async () => {
      const payload = { text: 'urgent action required' }
      await phishingApi.checkRedFlags(payload)
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('method=flag'),
        payload,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })

    it('should call translateRedFlagsTexts', async () => {
      const payload = { texts: ['urgent', 'verify'] }
      await phishingApi.translateRedFlagsTexts(payload)
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('method=translate'),
        payload,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })
  })

  describe('red flag worker url selection', () => {
    it('should use prod worker url when origin is not test or localhost', async () => {
      const originalLocation = window.location
      delete window.location
      window.location = { origin: 'https://app.keepnet.com' }

      jest.resetModules()
      const axiosLocal = require('axios')
      const phishingApiLocal = require('@/api/phishingsimulator')

      const payload = { text: 'check' }
      await phishingApiLocal.checkRedFlags(payload)
      expect(axiosLocal.post).toHaveBeenCalledWith(
        expect.stringContaining('https://r-flg.keepnetlabs.com?method=flag'),
        payload,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )

      window.location = originalLocation
    })

    it('should use test worker url for localhost origin', async () => {
      const originalLocation = window.location
      delete window.location
      window.location = { origin: 'http://localhost:8080' }

      jest.resetModules()
      const axiosLocal = require('axios')
      const phishingApiLocal = require('@/api/phishingsimulator')

      const payload = { text: 'check-localhost' }
      await phishingApiLocal.checkRedFlags(payload)
      expect(axiosLocal.post).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://red-flag-test.keepnet-labs-ltd-business-profile4086.workers.dev?method=flag'
        ),
        payload,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )

      window.location = originalLocation
    })

    it('should use test worker url for test-ui origin', async () => {
      const originalLocation = window.location
      delete window.location
      window.location = { origin: 'https://test-ui.devkeepnet.com' }

      jest.resetModules()
      const axiosLocal = require('axios')
      const phishingApiLocal = require('@/api/phishingsimulator')

      const payload = { text: 'check-test-ui' }
      await phishingApiLocal.checkRedFlags(payload)
      expect(axiosLocal.post).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://red-flag-test.keepnet-labs-ltd-business-profile4086.workers.dev?method=flag'
        ),
        payload,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )

      window.location = originalLocation
    })
  })

  describe('HTTP method usage', () => {
    it('should use GET for read operations', async () => {
      await phishingApi.getEmailTemplatePreviewContent('id')
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create operations', async () => {
      await phishingApi.getEmailTemplatesList({})
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      const payload = {}
      await phishingApi.updateSandboxActivity('id', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await phishingApi.deleteEmailTemplate('id')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should use PATCH for status change operations', async () => {
      await phishingApi.stopPhishingCampaignJob('id', 'group')
      expect(testRequest.patch).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle empty payload defaults', async () => {
      await phishingApi.searchCampaignManager()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign/search',
        {}
      )
    })

    it('should handle special characters in ids', async () => {
      const specialId = 'campaign-123!@#$'
      await phishingApi.getCampaignManager(specialId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/phishing-campaign/${specialId}`
      )
    })

    it('should handle multiple parameter combinations', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      const instanceGroup = 'group-1'
      await phishingApi.searchCampaignJobUserEmailClicked(payload, id, instanceGroup)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/phishing-simulator/phishing-campaign-job-report/clicked/search/${id}/${instanceGroup}`,
        payload
      )
    })
  })

  describe('snackbar consistency', () => {
    it('should include snackbar in all mutation operations', async () => {
      await phishingApi.createCampaignManager({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should include snackbar in delete operations', async () => {
      await phishingApi.deleteEmailTemplate('id')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })
})
