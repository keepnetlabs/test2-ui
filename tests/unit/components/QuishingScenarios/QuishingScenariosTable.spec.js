jest.mock('@/api/quishing', () => ({
  searchScenarios: jest.fn(() =>
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
  )
}))

import QuishingScenariosTable from '@/components/QuishingScenarios/QuishingScenariosTable.vue'

describe('QuishingScenariosTable.vue', () => {
  it('handleFastLaunch emits on-fast-launch', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handleFastLaunch.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-fast-launch', row)
  })

  it('handleEmitScenarioModal emits on-edit-or-new', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handleEmitScenarioModal.call(ctx, row, false)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit-or-new', row, false)
  })

  it('handlePreview emits on-preview', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handlePreview.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-preview', row)
  })

  it('handleDelete emits on-delete', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handleDelete.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', row)
  })
})
