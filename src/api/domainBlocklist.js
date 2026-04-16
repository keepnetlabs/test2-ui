import axios from 'axios'

const BLOCKLIST_API_BASE =
  'https://phishing-detection-worker.keepnet-labs-ltd-business-profile4086.workers.dev/api'

const blocklistClient = axios.create({
  baseURL: BLOCKLIST_API_BASE,
  timeout: 15000
})

export function getAllDomainBlocklistStatuses() {
  return blocklistClient.get('/domains')
}

export function getDomainBlocklistStatus(domain) {
  return blocklistClient.get(`/domains/${domain}`)
}

export function getCleanDomainSuggestions() {
  return blocklistClient.get('/domains/suggestions/clean')
}
