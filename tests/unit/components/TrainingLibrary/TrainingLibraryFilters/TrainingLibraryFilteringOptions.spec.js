import TrainingLibraryFilteringOptions from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilteringOptions.vue'

describe('TrainingLibraryFilteringOptions.vue', () => {
  it('handleListItemClick calls writeFiltersToLocalStorage for Set as Default', () => {
    const writeFiltersToLocalStorage = jest.fn()
    const ctx = { writeFiltersToLocalStorage, isParentMenuOpen: true }
    TrainingLibraryFilteringOptions.methods.handleListItemClick.call(ctx, 'Set as Default Filter')
    expect(writeFiltersToLocalStorage).toHaveBeenCalled()
    expect(ctx.isParentMenuOpen).toBe(false)
  })

  it('handleListItemClick calls restoreDefaultFilters for Restore Default', () => {
    const restoreDefaultFilters = jest.fn()
    const ctx = { restoreDefaultFilters, isParentMenuOpen: true }
    TrainingLibraryFilteringOptions.methods.handleListItemClick.call(ctx, 'Restore Default Filter')
    expect(restoreDefaultFilters).toHaveBeenCalled()
    expect(ctx.isParentMenuOpen).toBe(false)
  })
})
