import axios from 'axios'

const BLACKLIST_API_BASE =
  'https://phishing-detection-worker.keepnet-labs-ltd-business-profile4086.workers.dev/api'

const blacklistClient = axios.create({
  baseURL: BLACKLIST_API_BASE,
  timeout: 15000
})

export function getAllDomainBlacklistStatuses() {
  return blacklistClient.get('/domains')
}

export function getDomainBlacklistStatus(domain) {
  return blacklistClient.get(`/domains/${domain}`)
}

export function getCleanDomainSuggestions() {
  return blacklistClient.get('/domains/suggestions/clean')
}
