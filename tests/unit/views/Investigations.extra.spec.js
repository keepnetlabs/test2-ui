jest.mock('@/api/incidentResponder', () => ({
  exportInvestigationList: jest.fn(() => Promise.resolve({ data: 'file' }))
}))

import Investigations from '@/views/Investigations.vue'
import { exportInvestigationList } from '@/api/incidentResponder'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Investigations.vue (extra)', () => {
  const { methods } = Investigations

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('beforeRouteEnter redirects with isLoadState when coming from details', () => {
    const next = jest.fn()
    Investigations.beforeRouteEnter(
      { name: 'Investigations', params: {} },
      { name: 'Investigation Details' },
      next
    )
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ params: expect.objectContaining({ isLoadState: true }) })
    )
  })

  it('created redirects to incident responder when SEARCH permission is missing', () => {
    const push = jest.fn()
    const ctx = {
      PERMISSIONS: { SEARCH: { hasPermission: false } },
      $router: { push },
      $route: { query: {} },
      isShowNewInvestigationModal: false
    }

    Investigations.created.call(ctx)

    expect(push).toHaveBeenCalledWith('/incident-responder')
  })

  it('created opens popup when query openPopup exists', () => {
    const ctx = {
      PERMISSIONS: { SEARCH: { hasPermission: true } },
      $router: { push: jest.fn() },
      $route: { query: { openPopup: '1' } },
      isShowNewInvestigationModal: false
    }

    Investigations.created.call(ctx)
    expect(ctx.isShowNewInvestigationModal).toBe(true)
  })

  it('hasNoMatchingPlaybooks returns true only for empty matching list', () => {
    expect(methods.hasNoMatchingPlaybooks.call({}, { row: { matchingPlaybooks: [] } })).toBe(true)
    expect(
      methods.hasNoMatchingPlaybooks.call({}, { row: { matchingPlaybooks: [{ resourceId: '1' }] } })
    ).toBe(false)
  })

  it('togglePlaybookModal and togglePlaybookModalWithSelected update state', () => {
    const ctx = { showPlaybookModal: false, selectedPlaybookId: null }
    methods.togglePlaybookModalWithSelected.call(ctx, 'p1')
    expect(ctx.selectedPlaybookId).toBe('p1')
    expect(ctx.showPlaybookModal).toBe(true)

    methods.togglePlaybookModal.call(ctx)
    expect(ctx.selectedPlaybookId).toBeNull()
    expect(ctx.showPlaybookModal).toBe(false)
  })

  it('callForData updates loading and server-side props when store returns data', async () => {
    const ctx = {
      loading: false,
      axiosPayload: {},
      tableData: { data: [] },
      serverSideProps: {},
      setDynamicScanStatusWidth: jest.fn(),
      $refs: { investigationTable: { $forceUpdate: jest.fn() } },
      $store: {
        dispatch: jest.fn(() =>
          Promise.resolve({
            data: {
              data: { totalNumberOfRecords: 3, totalNumberOfPages: 2, pageNumber: 1 }
            }
          })
        )
      }
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.loading).toBe(false)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(3)
    expect(ctx.setDynamicScanStatusWidth).toHaveBeenCalledTimes(1)
    expect(ctx.$refs.investigationTable.$forceUpdate).toHaveBeenCalledTimes(1)
  })

  it('exportInvestigationList maps XLS to Excel and triggers downloads', async () => {
    const click = jest.fn()
    const link = { href: '', download: '', click }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:mock')

    const ctx = {
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: { FilterGroups: [] } }
    }
    methods.exportInvestigationList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 25
    })
    await flushPromises()

    expect(exportInvestigationList).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(exportInvestigationList).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })
})
