import {
  investigationList,
  getTargetUsers,
  saveNewInvestigation,
  cancelInvestigation,
  getStatsAndMenuDataFunction,
  getInvestigationDetailsDataFunction,
  irSummary,
  getInvestigationScanTypes
} from '@/api/investigations'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}))

describe('investigations API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('investigationList', () => {
    it('calls POST investigations/search', async () => {
      await investigationList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('investigations/search', { page: 1 })
    })
  })

  describe('getTargetUsers', () => {
    it('calls GET target-groups', async () => {
      await getTargetUsers()
      expect(testRequest.get).toHaveBeenCalledWith('target-groups')
    })
  })

  describe('saveNewInvestigation', () => {
    it('calls POST with snackbar', async () => {
      await saveNewInvestigation({ name: 'Inv1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'investigations',
        { name: 'Inv1' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('cancelInvestigation', () => {
    it('calls PUT cancel', async () => {
      await cancelInvestigation('inv-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        'investigations/inv-1/cancel',
        {},
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getStatsAndMenuDataFunction', () => {
    it('calls GET summary', async () => {
      await getStatsAndMenuDataFunction('inv-1')
      expect(testRequest.get).toHaveBeenCalledWith('investigations/inv-1/summary')
    })
  })

  describe('getInvestigationDetailsDataFunction', () => {
    it('calls GET investigation by id', async () => {
      await getInvestigationDetailsDataFunction('inv-1')
      expect(testRequest.get).toHaveBeenCalledWith('investigations/inv-1')
    })
  })

  describe('irSummary', () => {
    it('calls GET ir/dashboard/summary', async () => {
      await irSummary()
      expect(testRequest.get).toHaveBeenCalledWith('ir/dashboard/summary')
    })
  })

  describe('getInvestigationScanTypes', () => {
    it('calls GET scan-types', async () => {
      await getInvestigationScanTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/investigations/scan-types')
    })
  })
})
