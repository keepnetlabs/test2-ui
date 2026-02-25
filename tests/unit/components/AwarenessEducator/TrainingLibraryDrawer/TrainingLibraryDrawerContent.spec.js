jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn()
}))

import TrainingLibraryDrawerContent from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerContent.vue'

describe('TrainingLibraryDrawerContent.vue', () => {
  it('handleCategoryReady stores selected category', () => {
    const ctx = { category: '' }
    TrainingLibraryDrawerContent.methods.handleCategoryReady.call(ctx, 'Security')
    expect(ctx.category).toBe('Security')
  })
})
