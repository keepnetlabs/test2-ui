import AttacksVectors from '@/components/EmailThreatSmulator/AttacksVectors.vue'
import {
  getAttackVectorById,
  getAttackVectorList,
  exportAttacksVector
} from '@/api/emailThreatSimlator'

jest.mock('@/api/emailThreatSimlator', () => ({
  getAttackVectorById: jest.fn(),
  getAttackVectorList: jest.fn(),
  exportAttacksVector: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AttacksVectors.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setStatusColor returns color styles by risk factor ranges', () => {
    expect(AttacksVectors.methods.setStatusColor.call({}, 5)).toContain('#0198AC')
    expect(AttacksVectors.methods.setStatusColor.call({}, 6)).toContain('#B6791D')
    expect(AttacksVectors.methods.setStatusColor.call({}, 8)).toContain('#B83A3A')
    expect(AttacksVectors.methods.setStatusColor.call({}, 3)).toContain('#1173C1')
  })

  it('handleActionDelete and handleActionStatus set selected row and modal flags', () => {
    const row = { pluginResourceId: 'p-1' }
    const ctxDelete = { selectedAttackVector: {}, showDeleteModal: false }
    AttacksVectors.methods.handleActionDelete.call(ctxDelete, row)
    expect(ctxDelete.selectedAttackVector).toEqual(row)
    expect(ctxDelete.showDeleteModal).toBe(true)

    const ctxStatus = { selectedAttackVector: {}, showStatusModal: false }
    AttacksVectors.methods.handleActionStatus.call(ctxStatus, row)
    expect(ctxStatus.selectedAttackVector).toEqual(row)
    expect(ctxStatus.showStatusModal).toBe(true)
  })

  it('changeNewAttackVectorModalStatus resets state and refreshes when restart is true', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      isEdit: true,
      attackVectorDetails: { a: 1 },
      selectedAttackVector: { pluginResourceId: 'p-1' },
      callForData
    }

    AttacksVectors.methods.changeNewAttackVectorModalStatus.call(ctx, false, true)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.attackVectorDetails).toEqual({})
    expect(ctx.selectedAttackVector).toEqual({})
    expect(callForData).toHaveBeenCalled()
  })

  it('callForData redirects to root when search permission is missing', () => {
    const push = jest.fn()
    const ctx = {
      isLoading: false,
      getEtsAttackVectorPermissionSearch: false,
      $router: { push }
    }

    AttacksVectors.methods.callForData.call(ctx)
    expect(push).toHaveBeenCalledWith('/')
  })

  it('callForData populates table data and server-side props on success', async () => {
    getAttackVectorList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            { pluginResourceId: '1', isActive: true },
            { pluginResourceId: '2', isActive: false }
          ]
        }
      }
    })
    const ctx = {
      isLoading: false,
      getEtsAttackVectorPermissionSearch: true,
      axiosPayload: { filter: {} },
      tableData: [],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      }
    }

    AttacksVectors.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([
      { pluginResourceId: '1', isActive: 'Active' },
      { pluginResourceId: '2', isActive: 'Passive' }
    ])
  })

  it('handleEditAttackVector loads details and opens modal', async () => {
    getAttackVectorById.mockResolvedValueOnce({ data: { data: { name: 'Attack' } } })
    const row = { pluginResourceId: 'plugin-1' }
    const ctx = {
      isEdit: false,
      modalStatus: false,
      attackVectorDetails: {},
      selectedAttackVector: null
    }

    AttacksVectors.methods.handleEditAttackVector.call(ctx, row)
    await flushPromises()

    expect(getAttackVectorById).toHaveBeenCalledWith('plugin-1')
    expect(ctx.isEdit).toBe(true)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.attackVectorDetails).toEqual({ name: 'Attack' })
    expect(ctx.selectedAttackVector).toEqual(row)
  })

  it('exportTableData triggers file download for Blob responses', async () => {
    const blob = new Blob(['a'], { type: 'text/plain' })
    exportAttacksVector.mockResolvedValueOnce({ data: blob })
    const click = jest.fn()
    const originalCreateObjectURL = window.URL.createObjectURL
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(v) {},
      set download(v) {}
    })
    window.URL.createObjectURL = jest.fn(() => 'blob:url')

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    AttacksVectors.methods.exportTableData.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportAttacksVector).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })
})
