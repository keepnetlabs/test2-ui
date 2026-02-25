import TrainingLibraryNewLearningPathContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathContent.vue'

describe('TrainingLibraryNewLearningPathContent.vue', () => {
  it('isDisabled returns false for System company', () => {
    const result = TrainingLibraryNewLearningPathContent.methods.isDisabled.call(
      {
        getCompanyName: 'System',
        availableForRequests: [],
        getCompanyResourceId: 'cid'
      },
      { availableFor: [] }
    )
    expect(result).toBe(false)
  })

  it('isDisabled returns true when training does not match availability', () => {
    const result = TrainingLibraryNewLearningPathContent.methods.isDisabled.call(
      {
        getCompanyName: 'Acme',
        availableForRequests: ['GroupA'],
        getCompanyResourceId: 'cid'
      },
      { availableFor: ['GroupB'] }
    )
    expect(result).toBe(true)
  })

  it('onSelectTraining and onRemoveTraining call mapped actions', () => {
    const selectLearningPathTraining = jest.fn()
    const removeTrainingFromLearningPath = jest.fn()
    const training = { trainingId: 't1' }
    TrainingLibraryNewLearningPathContent.methods.onSelectTraining.call(
      { selectLearningPathTraining },
      training,
      2
    )
    TrainingLibraryNewLearningPathContent.methods.onRemoveTraining.call(
      { removeTrainingFromLearningPath },
      training,
      2
    )
    expect(selectLearningPathTraining).toHaveBeenCalledWith({ training, index: 2 })
    expect(removeTrainingFromLearningPath).toHaveBeenCalledWith({ training, index: 2 })
  })

  it('onClickPreview commits survey preview for survey type', () => {
    const commit = jest.fn()
    const training = { type: 'Survey', trainingId: 's1' }
    TrainingLibraryNewLearningPathContent.methods.onClickPreview.call(
      { $store: { commit } },
      training
    )
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
      status: true,
      selectedRow: training,
      onlyPreview: true
    })
  })
})
