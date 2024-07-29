import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

const searchTextMessageTemplates = (payload) => {
  return testRequest.post('/smishing-simulator/text-templates/search', payload)
}

const getTextMessageTemplate = (resourceId) => {
  return testRequest.get(`/smishing-simulator/text-templates/${resourceId}`)
}

const exportTextMessageTemplates = (payload) => {
  return testRequest.post(`/smishing-simulator/text-templates/search/export`, payload, {
    responseType: 'blob'
  })
}

function createTextMessageTemplate(payload) {
  return testRequest.post(`/smishing-simulator/text-templates`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function updateTextMessageTemplate(resourceId, payload) {
  return testRequest.put(`/smishing-simulator/text-templates/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function deleteTextMessageTemplate(resourceId) {
  return testRequest.delete(`/smishing-simulator/text-templates/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

function bulkDeleteTextMessageTemplates(payload) {
  return testRequest.delete(`/smishing-simulator/text-templates/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}

const getSummaryTextMessageTemplate = (resourceId, instanceGroup, templateResourceId) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/text-templates/${templateResourceId}`
  )
}

const getLandingPageTemplateFormDetails = () => {
  return testRequest.get('/smishing-simulator/landing-page-template/form-details')
}

const searchLandingPageTemplates = (payload) => {
  return testRequest.post('/smishing-simulator/landing-page-template/search', payload)
}

const getLandingPageTemplate = (resourceId) => {
  return testRequest.get(`/smishing-simulator/landing-page-template/${resourceId}`)
}

const exportLandingPageTemplates = (payload) => {
  return testRequest.post(`/smishing-simulator/landing-page-template/search/export`, payload, {
    responseType: 'blob'
  })
}

function deleteLandingPageTemplate(resourceId) {
  return testRequest.delete(`/smishing-simulator/landing-page-template/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

function bulkDeleteLandingPageTemplates(payload) {
  return testRequest.delete(`/smishing-simulator/landing-page-template/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}

function createLandingPageTemplate(payload) {
  return testRequest.post(`/smishing-simulator/landing-page-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function updateLandingPageTemplate(resourceId, payload) {
  return testRequest.put(`/smishing-simulator/landing-page-template/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getSummaryLandingPageTemplate = (resourceId, instanceGroup, templateResourceId) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/landing-page-template/${templateResourceId}`
  )
}

const getSmishingLandingPageMergeTags = () => {
  return testRequest.get(`/smishing-simulator/text-templates/merge-tags`)
}

const searchSmishingScenarios = (payload) => {
  return testRequest.post('/smishing-simulator/smishing-scenario/search', payload)
}

const exportSmishingScenarios = (payload) => {
  return testRequest.post(`/smishing-simulator/smishing-scenario/search/export`, payload, {
    responseType: 'blob'
  })
}

const getSmishingScenario = (resourceId) => {
  return testRequest.get(`/smishing-simulator/smishing-scenario/${resourceId}`)
}

function getSmishingScenarioFormDetails() {
  return testRequest.get(`/smishing-simulator/smishing-scenario/form-details`)
}

function createSmishingScenario(payload) {
  return testRequest.post(`/smishing-simulator/smishing-scenario`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function updateSmishingScenario(resourceId, payload) {
  return testRequest.put(`/smishing-simulator/smishing-scenario/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function deleteSmishingScenario(resourceId) {
  return testRequest.delete(`/smishing-simulator/smishing-scenario/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

function bulkDeleteSmishingScenarios(payload) {
  return testRequest.delete(`/smishing-simulator/smishing-scenario/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}

function previewSmishingScenario(resourceId) {
  return testRequest.get(`/smishing-simulator/smishing-scenario/preview/${resourceId}`)
}

function previewSmishingScenarioUsedTemplates(
  textTemplateResourceId,
  landingPageTemplateResourceId
) {
  return testRequest.get(
    `/smishing-simulator/smishing-scenario/preview/${textTemplateResourceId}/${landingPageTemplateResourceId}`
  )
}

const searchSmishingCampaigns = (payload) => {
  return testRequest.post('/smishing-simulator/smishing-campaign/search', payload)
}

const getSmishingCampaign = (resourceId) => {
  return testRequest.get(`/smishing-simulator/smishing-campaign/${resourceId}`)
}

const exportSmishingCampaigns = (payload) => {
  return testRequest.post(`/smishing-simulator/smishing-campaign/search/export`, payload, {
    responseType: 'blob'
  })
}

function createSmishingCampaign(payload) {
  return testRequest.post(`/smishing-simulator/smishing-campaign`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function updateSmishingCampaign(resourceId, payload) {
  return testRequest.put(`/smishing-simulator/smishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getSmishingPhoneNumbers = () => {
  return testRequest.get('/smishing-simulator/smishing-campaign/phone-number')
}

const previewSmishingCampaign = (resourceId) => {
  return testRequest.get(`/smishing-simulator/smishing-campaign/preview/${resourceId}`)
}

function deleteSmishingCampaign(resourceId) {
  return testRequest.delete(`/smishing-simulator/smishing-campaign/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

function getCampaignFormDetails() {
  return testRequest.get(`/smishing-simulator/smishing-campaign-job/form-details`)
}

const searchSmishingCampaignJobReport = (payload, resourceId) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job-report/${resourceId}/search`,
    payload
  )
}

const launchSmishingCampaign = (resourceId, payload) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job/start/${resourceId}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const startSmishingCampaign = (resourceId, instanceGroup) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job/start/${resourceId}/${instanceGroup}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const stopSmishingCampaign = (resourceId, instanceGroup) => {
  return testRequest.patch(
    `/smishing-simulator/smishing-campaign-job/stop/${resourceId}/${instanceGroup}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

function deleteSmishingCampaignItem(resourceId, instanceGroup) {
  return testRequest.delete(
    `/smishing-simulator/smishing-campaign-job/${resourceId}/${instanceGroup}`,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const exportSmishingCampaignItems = (payload, resourceId) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job-report/${resourceId}/search/export`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const getCampaignJobSummary = (resourceId, instanceGroup) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}`
  )
}

const getCampaignJobSummaryTargetGroups = (resourceId, instanceGroup) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/summary/target-groups/${resourceId}/${instanceGroup}`
  )
}

const searchCampaignJobType = (searchType, payload, resourceId, instanceGroup) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job-report/${searchType}/search/${resourceId}/${instanceGroup}`,
    payload
  )
}

const searchCampaignJobTypeDetails = (searchType, payload, resourceId) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job-report/${searchType}/${resourceId}`,
    payload
  )
}

const resendSmishingCampaignToUsers = (payload, resourceId, instanceGroup) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job/resend/${resourceId}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const resendSmishingCampaignToUserList = (payload, resourceId, instanceGroup) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job/resend/list/${resourceId}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const exportCampaignJobType = (searchType, payload, resourceId, instanceGroup) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job-report/${searchType}/search/export/${resourceId}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const downloadSmishingReport = (resourceId, instanceGroup) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/export/${resourceId}/${instanceGroup}`,
    {
      responseType: 'blob'
    }
  )
}

const downloadSmishingReport2 = (resourceId) => {
  return testRequest.post(
    `/smishing-simulator/smishing-campaign-job-report/${resourceId}/search/export`,
    {
      responseType: 'blob'
    }
  )
}

const getSmishingCampaignLandingPageTemplatePreviewContent = (id, resourceId, instanceGroup) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/landing-page-template/${id}`
  )
}

const getSmishingCampaignTextMessageTemplatePreviewContent = (id, resourceId, instanceGroup) => {
  return testRequest.get(
    `/smishing-simulator/smishing-campaign-job-report/summary/${resourceId}/${instanceGroup}/text-templates/${id}`
  )
}

function calculateSendingInfo(payload) {
  return testRequest.post(`/smishing-simulator/smishing-campaign/calculate-sending-info`, payload)
}

function calculateScheduleInfo(payload) {
  return testRequest.post(`/smishing-simulator/smishing-campaign/calculate-schedule-info`, payload)
}

function getDnsServiceList(payload) {
  return testRequest.post(`smishing-simulator/dns-services/search`, payload)
}

function createDnsServiceList(payload) {
  return testRequest.post(`smishing-simulator/dns-services`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function testConnection(payload, id) {
  return testRequest.post(`smishing-simulator/dns-services/${id}/test`, payload)
}

function updateDnsServiceList(payload, id) {
  return testRequest.put(`smishing-simulator/dns-services/${id}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

function getDnsService(id) {
  return testRequest.get(`smishing-simulator/dns-services/${id}`, { loading: true })
}

function deleteEmailTemplate(id) {
  return testRequest.delete(`smishing-simulator/dns-services/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

function exportDnsService(payload) {
  return testRequest.post(`smishing-simulator/dns-services/search/export`, payload, {
    responseType: 'blob'
  })
}

function getDomainsList(payload) {
  return testRequest.post(`smishing-simulator/domain-records/search`, payload)
}

function createDomain(payload) {
  return testRequest.post(`smishing-simulator/domain-records`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

function updateDomain(payload, id) {
  return testRequest.put(`smishing-simulator/domain-records/${id}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

function deleteDomainRecord(id) {
  return testRequest.delete(`smishing-simulator/domain-records/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

function exportDomains(payload) {
  return testRequest.post(`smishing-simulator/domain-records/search/export`, payload, {
    responseType: 'blob'
  })
}

function getDomainData() {
  return testRequest.get(`smishing-simulator/domain-records/form-details`)
}

function getDomainEditData(resId) {
  return testRequest.get(`smishing-simulator/domain-records/${resId}`, {
    loading: true
  })
}
function testDomainConnection(payload) {
  return testRequest.post(`smishing-simulator/domain-records/test`, payload)
}

function getExcludedIPAddresses() {
  return testRequest.get(`/smishing-simulator/excluded-ip-list`)
}

function postExcludedIPAddresses(payload = {}) {
  return testRequest.post(`/smishing-simulator/excluded-ip`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getCampaignManagerFormDetails() {
  return testRequest.get('/smishing-simulator/smishing-campaign/form-details')
}

export function getSmishingScenariosPhoneNumber() {
  return testRequest.get(`/smishing-simulator/smishing-scenario/mfa-phone-number`)
}

export default {
  searchTextMessageTemplates,
  getTextMessageTemplate,
  exportTextMessageTemplates,
  createTextMessageTemplate,
  updateTextMessageTemplate,
  deleteTextMessageTemplate,
  bulkDeleteTextMessageTemplates,
  getSummaryTextMessageTemplate,
  getLandingPageTemplateFormDetails,
  searchLandingPageTemplates,
  getLandingPageTemplate,
  exportLandingPageTemplates,
  deleteLandingPageTemplate,
  bulkDeleteLandingPageTemplates,
  createLandingPageTemplate,
  updateLandingPageTemplate,
  getSummaryLandingPageTemplate,
  getSmishingLandingPageMergeTags,
  searchSmishingScenarios,
  exportSmishingScenarios,
  getSmishingScenario,
  getSmishingScenarioFormDetails,
  createSmishingScenario,
  updateSmishingScenario,
  deleteSmishingScenario,
  bulkDeleteSmishingScenarios,
  previewSmishingScenario,
  previewSmishingScenarioUsedTemplates,
  searchSmishingCampaigns,
  getSmishingCampaign,
  exportSmishingCampaigns,
  createSmishingCampaign,
  updateSmishingCampaign,
  previewSmishingCampaign,
  deleteSmishingCampaign,
  getCampaignFormDetails,
  getSmishingPhoneNumbers,
  searchSmishingCampaignJobReport,
  exportSmishingCampaignItems,
  deleteSmishingCampaignItem,
  launchSmishingCampaign,
  startSmishingCampaign,
  stopSmishingCampaign,
  getCampaignJobSummary,
  getCampaignJobSummaryTargetGroups,
  searchCampaignJobType,
  searchCampaignJobTypeDetails,
  exportCampaignJobType,
  downloadSmishingReport,
  downloadSmishingReport2,
  resendSmishingCampaignToUsers,
  resendSmishingCampaignToUserList,
  getSmishingCampaignLandingPageTemplatePreviewContent,
  getSmishingCampaignTextMessageTemplatePreviewContent,
  calculateSendingInfo,
  calculateScheduleInfo,
  getDnsServiceList,
  createDnsServiceList,
  testConnection,
  updateDnsServiceList,
  getDnsService,
  deleteEmailTemplate,
  exportDnsService,
  getDomainsList,
  createDomain,
  updateDomain,
  deleteDomainRecord,
  exportDomains,
  getDomainData,
  getDomainEditData,
  testDomainConnection,
  getExcludedIPAddresses,
  postExcludedIPAddresses,
  getCampaignManagerFormDetails,
  getSmishingScenariosPhoneNumber
}
