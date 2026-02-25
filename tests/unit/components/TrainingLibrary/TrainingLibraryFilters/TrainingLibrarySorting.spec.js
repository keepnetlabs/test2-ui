import TrainingLibrarySorting from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySorting.vue'

describe('TrainingLibrarySorting.vue', () => {
  it('handleSortBy closes parent menu and calls setSortBy', () => {
    const setSortBy = jest.fn()
    const ctx = { parentMenu: true, setSortBy }
    const item = { text: 'Name' }
    const sort = { text: 'Ascending' }
    TrainingLibrarySorting.methods.handleSortBy.call(ctx, item, sort)
    expect(ctx.parentMenu).toBe(false)
    expect(setSortBy).toHaveBeenCalledWith({ item, sort })
  })
})
