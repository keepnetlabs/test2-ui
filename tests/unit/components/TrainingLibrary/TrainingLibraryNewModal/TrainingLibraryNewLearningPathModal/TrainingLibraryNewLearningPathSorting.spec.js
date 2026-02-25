import TrainingLibraryNewLearningPathSorting from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathSorting.vue'

describe('TrainingLibraryNewLearningPathSorting.vue', () => {
  it('handleSortBy closes parent menu and calls setSortBy', () => {
    const setSortBy = jest.fn()
    const ctx = { parentMenu: true, setSortBy }
    const item = { text: 'Name' }
    const sort = { text: 'Ascending' }
    TrainingLibraryNewLearningPathSorting.methods.handleSortBy.call(ctx, item, sort)
    expect(ctx.parentMenu).toBe(false)
    expect(setSortBy).toHaveBeenCalledWith({ item, sort })
  })
})
