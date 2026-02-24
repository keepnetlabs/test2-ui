import {
  exportInvestigationList,
  getMatchingIncidents,
  searchNotifiedMail,
  updateNotifiedEmail,
  getRoiSettings,
  reAnalyzeEmail
} from '@/api/incidentResponder'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}))

describe('incidentResponder API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exportInvestigationList', () => {
    it('calls POST with blob', async () => {
      await exportInvestigationList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        'investigations/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
  })

  describe('getMatchingIncidents', () => {
    it('calls POST matching-playbooks', async () => {
      await getMatchingIncidents({ page: 1 }, 'playbook-1')
      expect(testRequest.post).toHaveBeenCalledWith(
        'notified-emails/matching-playbooks/playbook-1/search',
        { page: 1 }
      )
    })
  })

  describe('searchNotifiedMail', () => {
    it('calls POST notified-emails/search', async () => {
      await searchNotifiedMail({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('notified-emails/search', { page: 1 })
    })
  })

  describe('updateNotifiedEmail', () => {
    it('calls PUT with snackbar', async () => {
      await updateNotifiedEmail('id-1', { status: 'active' })
      expect(testRequest.put).toHaveBeenCalledWith(
        '/notified-emails/id-1',
        { status: 'active' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getRoiSettings', () => {
    it('calls GET roi-settings', async () => {
      await getRoiSettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/roi-settings')
    })
  })

  describe('reAnalyzeEmail', () => {
    it('calls GET reanalyze', async () => {
      await reAnalyzeEmail('res-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/notified-emails/res-1/reanalyze',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })
})
