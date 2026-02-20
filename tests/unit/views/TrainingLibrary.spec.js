import TrainingLibrary from '@/views/TrainingLibrary.vue'

describe('TrainingLibrary.vue', () => {
  it('beforeRouteLeave resets modals and allows navigation', () => {
    const resetAllModals = jest.fn()
    const next = jest.fn()
    const ctx = { resetAllModals }

    TrainingLibrary.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(resetAllModals).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('created hook triggers initialization actions', () => {
    const ctx = {
      resetAllModals: jest.fn(),
      initDefaultTableSettings: jest.fn(),
      initDefaultTableFilters: jest.fn(),
      callForTrainingHelpers: jest.fn(),
      callForTrainingLibrary: jest.fn()
    }

    TrainingLibrary.created.call(ctx)

    expect(ctx.resetAllModals).toHaveBeenCalledTimes(1)
    expect(ctx.initDefaultTableSettings).toHaveBeenCalledTimes(1)
    expect(ctx.initDefaultTableFilters).toHaveBeenCalledTimes(1)
    expect(ctx.callForTrainingHelpers).toHaveBeenCalledTimes(1)
    expect(ctx.callForTrainingLibrary).toHaveBeenCalledTimes(1)
  })

  it('beforeDestroy resets store state', () => {
    const ctx = { resetState: jest.fn() }

    TrainingLibrary.beforeDestroy.call(ctx)
    expect(ctx.resetState).toHaveBeenCalledTimes(1)
  })
})
