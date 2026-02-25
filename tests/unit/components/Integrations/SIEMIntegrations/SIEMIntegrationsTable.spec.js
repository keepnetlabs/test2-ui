jest.mock('@/api/siemIntegrations', () => ({
  searchSIEMIntegrations: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportSIEMIntegrations: jest.fn(() => Promise.resolve({ data: {} }))
}))

const createObjectURL = jest.fn(() => 'blob:mock')
beforeAll(() => {
  globalThis.URL.createObjectURL = createObjectURL
})

import SIEMIntegrationsTable from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsTable.vue'

describe('SIEMIntegrationsTable.vue', () => {
  it('toggleAddOrEditModal emits on-open-add-or-edit-modal', () => {
    const ctx = { $emit: jest.fn() }
    SIEMIntegrationsTable.methods.toggleAddOrEditModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-open-add-or-edit-modal')
  })

  it('handleEdit emits on-open-add-or-edit-modal with row', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 'i1' }
    SIEMIntegrationsTable.methods.handleEdit.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-open-add-or-edit-modal', row)
  })

  it('handleDeleteRowClick emits on-delete with row', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 'i1' }
    SIEMIntegrationsTable.methods.handleDeleteRowClick.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', row)
  })
})
