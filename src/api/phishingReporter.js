import testRequest from '../utils/testRequest'

export function getPhishingReportSummary({startDate, endDate}) {
  return testRequest.get(`/phishing-reporter/summary?startDate=${startDate}&endDate=${endDate}`)
}

export function createPhishingReporter(payload) {
  return testRequest.post("/phishing-reporter", payload)
}

export function getPhishingReporter() {
  return testRequest.get("/phishing-reporter")
}

export function getPhishingReporterImg() {
  return testRequest.get("/phishing-reporter/img")
}

export function searchPhishingReporterUser(payload) {
  return testRequest.post("/phishing-reporter/search", payload)
}

export function exportPhishingReporterUserList(payload) {
  return testRequest.post("/phishing-reporter/search/export", payload, {
    responseType: 'blob'
  })

}
