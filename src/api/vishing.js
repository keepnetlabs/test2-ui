import vishingRequest from '../utils/vishingRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function exportVishingTemplates(payload = {}) {
  return vishingRequest.post(`/vishing-template/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingTemplate(resourceId = '') {
  return vishingRequest.get(`/vishing-template/${resourceId}`)
}

export function getVishingTemplates(payload = {}) {
  return vishingRequest.post('/vishing-template/search', payload)
}

export function deleteVishingTemplate(resourceId = '') {
  return vishingRequest.delete(`/vishing-template/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getVishingTemplatePreview(resourceId = '') {
  return vishingRequest.get(`/vishing-template/preview/${resourceId}`)
}

export function exportVishingCampaigns(payload = {}) {
  return vishingRequest.post('/vishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
}

export function getVishingTemplateLanguages() {
  return vishingRequest.get(`/vishing-template/language`)
}

export function updateVishingTemplate(resourceId = '', payload = {}) {
  return vishingRequest.put(`/vishing-template/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createVishingTemplate(payload = {}) {
  return vishingRequest.post(`/vishing-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getVishingCampaigns(payload = {}) {
  return vishingRequest.post('/vishing-campaign/search', payload)
}

export function deleteVishingCampaign(resourceId) {
  return vishingRequest.delete(`vishing-campaign/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateVishingCampaign(payload = {}, resourceId) {
  return vishingRequest.put(`/vishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createVishingCampaign(payload = {}) {
  return vishingRequest.post('/vishing-campaign', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function stopVishingCampaign(resourceId = '') {
  return vishingRequest.put(
    `/vishing-campaign/stop/${resourceId}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function getVishingCampaignPreview(resourceId = '') {
  return vishingRequest.get(`/vishing-campaign/preview/${resourceId}`)
}

export function launchVishingCampaign(resourceId = '') {
  return vishingRequest.put(
    `/vishing-campaign/launch/${resourceId}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function getVishingCampaign(resourceId) {
  return vishingRequest.get(`/vishing-campaign/${resourceId}`)
}

export function getVishingReportSummary(resourceId = '') {
  return vishingRequest.get(`/vishing-report/${resourceId}`)
}

export function getVishingReportUsers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/users/search`, payload)
}

export function getVishingReportAnswered(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getVishingReportDialedNumber(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getVishingReportNoResponse(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getPhoneNumbers() {
  return vishingRequest.get('/voice/phone-numbers')
}
