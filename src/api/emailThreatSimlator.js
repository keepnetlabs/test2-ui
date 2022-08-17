import emailThreatSimlatorRequest from '@/utils/emailThreatSimulatorRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import uploadRequest from "@/utils/uploadRequest";
import testRequest from "@/utils/testRequest";

export function getQuickScanList(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/search`, payload)
}
export function deleteQuickScanItem(resourceId) {
  return emailThreatSimlatorRequest.delete(`/quick-scan/${resourceId}`)
}
export function getValidateContinuousScan(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/validate-continuous-scan`, payload)
}
export function getQuickScanCreate(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan`, payload)
}
export function getQuickScanById(resourceId) {
  return emailThreatSimlatorRequest.get(`/quick-scan/${resourceId}`)
}
export function getQuickScanCount() {
  return emailThreatSimlatorRequest.get(`/quick-scan/continuous-scan-count`)
}
export function exportQuickScan(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/search/export`, payload, {
    responseType: 'blob'
  })
}
export function getAttackVectorList(payload) {
  return emailThreatSimlatorRequest.post(`/plugin/search`, payload)
}
export function deleteAttackVectorItem(resourceId) {
  return emailThreatSimlatorRequest.delete(`/plugin/${resourceId}`)
}
export function getAttackVectorCreate(payload) {
  return emailThreatSimlatorRequest.post(`/plugin`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
}
export function getAttackVectorUpdate(payload, resourceId) {
  return emailThreatSimlatorRequest.put(`/plugin/${resourceId}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
}
export function getAttackVectorById(resourceId) {
  return emailThreatSimlatorRequest.get(`/plugin/${resourceId}`)
}
export function exportAttacksVector(payload) {
  return emailThreatSimlatorRequest.post(`/plugin/search/export`, payload, {
    responseType: 'blob'
  })
}
export function getQuickScanReportCountById(resourceId) {
  return emailThreatSimlatorRequest.get(`/quick-scan-report/counts-and-score/${resourceId}`)
}
export function getQuickScanReportStatsById(resourceId) {
  return emailThreatSimlatorRequest.get(`/quick-scan-report/stats/${resourceId}`)
}

export function getQuickScanReportList(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan-item/search`, payload)
}
export function exportQuickScanReportList(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan-item/search/export`, payload, {
    responseType: 'blob'
  })
}
