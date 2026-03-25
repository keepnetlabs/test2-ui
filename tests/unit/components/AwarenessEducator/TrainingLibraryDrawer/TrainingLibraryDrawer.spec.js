import TrainingLibraryDrawer from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingLibraryDrawer.vue', () => {
  it('getTitle returns type-based labels', () => {
    expect(
      TrainingLibraryDrawer.computed.getTitle.call({
        type: TRAINING_LIBRARY_TYPES.LEARNING_PATH,
        trainingData: {}
      })
    ).toBe(labels.LearningPathPreview)

    expect(
      TrainingLibraryDrawer.computed.getTitle.call({
        type: TRAINING_LIBRARY_TYPES.SURVEY,
        trainingData: {}
      })
    ).toBe(labels.SurveyPreview)

    expect(
      TrainingLibraryDrawer.computed.getTitle.call({
        type: TRAINING_LIBRARY_TYPES.TRAINING,
        trainingData: {}
      })
    ).toBe(labels.TrainingPreview)
  })

  it('handleDeleteSuccess emits delete-success and closes drawer', () => {
    const $emit = jest.fn()
    const closeDrawer = jest.fn()
    TrainingLibraryDrawer.methods.handleDeleteSuccess.call({ $emit, closeDrawer })
    expect($emit).toHaveBeenCalledWith('delete-success')
    expect(closeDrawer).toHaveBeenCalled()
  })

  it('handleDuplicateSuccess emits duplicate-success and closes drawer', () => {
    const $emit = jest.fn()
    const closeDrawer = jest.fn()
    TrainingLibraryDrawer.methods.handleDuplicateSuccess.call({ $emit, closeDrawer })
    expect($emit).toHaveBeenCalledWith('duplicate-success')
    expect(closeDrawer).toHaveBeenCalled()
  })

  it('reasoningText prop defaults to empty string', () => {
    const prop = TrainingLibraryDrawer.props.reasoningText
    expect(prop.type).toBe(String)
    const defaultVal = typeof prop.default === 'function' ? prop.default() : prop.default
    expect(defaultVal).toBe('')
  })

  it('reasoningText prop accepts a non-empty string value', () => {
    const prop = TrainingLibraryDrawer.props.reasoningText
    expect(prop.type).toBe(String)
    expect('AI recommends this training for targeted users.').toEqual(expect.any(String))
  })
})
