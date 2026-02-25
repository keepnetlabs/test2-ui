import TrainingLibraryNewLearningPathTraining from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathTraining.vue'

describe('TrainingLibraryNewLearningPathTraining.vue', () => {
  it('getTrainingName returns training name', () => {
    const training = { trainingName: 'Test Training' }
    expect(
      TrainingLibraryNewLearningPathTraining.computed.getTrainingName.call({ training })
    ).toBe('Test Training')
    expect(
      TrainingLibraryNewLearningPathTraining.computed.getTrainingName.call({
        training: { name: 'Alt Name' }
      })
    ).toBe('Alt Name')
  })

  it('getCategoryName returns category', () => {
    const training = { categoryName: 'Security' }
    expect(
      TrainingLibraryNewLearningPathTraining.computed.getCategoryName.call({ training })
    ).toBe('Security')
  })

  it('checkTrainingInfoTooltips sets truncation for long text', () => {
    const training = {
      trainingName: 'A'.repeat(25),
      categoryName: 'B'.repeat(20)
    }
    const ctx = {
      training,
      truncatedTrainingName: '',
      truncatedCategory: '',
      isRenderTitleTooltip: false,
      isRenderCategoryTooltip: false
    }
    Object.defineProperty(ctx, 'getTrainingName', {
      get: () => training.trainingName,
      configurable: true
    })
    Object.defineProperty(ctx, 'getCategoryName', {
      get: () => training.categoryName,
      configurable: true
    })
    TrainingLibraryNewLearningPathTraining.methods.checkTrainingInfoTooltips.call(ctx)
    expect(ctx.truncatedTrainingName).toBe('A'.repeat(20) + '...')
    expect(ctx.isRenderTitleTooltip).toBe(true)
    expect(ctx.truncatedCategory).toBe('B'.repeat(14) + '...')
    expect(ctx.isRenderCategoryTooltip).toBe(true)
  })

  it('onClickPreview emits preview', () => {
    const emit = jest.fn()
    TrainingLibraryNewLearningPathTraining.methods.onClickPreview.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('preview')
  })

  it('onSelectTraining emits select', () => {
    const emit = jest.fn()
    TrainingLibraryNewLearningPathTraining.methods.onSelectTraining.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('select')
  })

  it('onRemoveTraining emits remove', () => {
    const emit = jest.fn()
    TrainingLibraryNewLearningPathTraining.methods.onRemoveTraining.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('remove')
  })
})
