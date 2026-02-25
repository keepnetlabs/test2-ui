jest.mock('@/api/quishing', () => ({
  getQuishingScenarios: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  deleteQuishingScenario: jest.fn(() => Promise.resolve()),
  bulkDeleteQuishingScenarios: jest.fn(() => Promise.resolve())
}))

import QuishingScenarios from '@/components/QuishingScenarios/QuishingScenarios.vue'

describe('QuishingScenarios.vue', () => {
  it('getSelectedScenarioId returns resourceId when selectedScenario', () => {
    const ctx = { selectedScenario: { resourceId: 's1' } }
    expect(QuishingScenarios.computed.getSelectedScenarioId.call(ctx)).toBe('s1')
  })

  it('getSelectedScenarioId returns empty when no selectedScenario', () => {
    const ctx = { selectedScenario: null }
    expect(QuishingScenarios.computed.getSelectedScenarioId.call(ctx)).toBe('')
  })

  it('handleMultipleDelete sets multiple delete state', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      multipleScenariosPayload: {},
      isShowDeleteDialog: false
    }
    QuishingScenarios.methods.handleMultipleDelete.call(ctx, {
      selections: [{ resourceId: 's1' }],
      excludedItems: [],
      selectAll: false,
      axiosPayload: { filter: {} },
      serverSideProps: { totalNumberOfRecords: 10 }
    })
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedScenariosCount).toBe(1)
    expect(ctx.multipleScenariosPayload.items).toEqual(['s1'])
    expect(ctx.isShowDeleteDialog).toBe(true)
  })
})
