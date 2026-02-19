import useAddTrainingLibraryContent from '@/hooks/useAddTrainingLibraryContent'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('useAddTrainingLibraryContent', () => {
  const invoke = (ctx, type) =>
    useAddTrainingLibraryContent.methods.handleAddTrainingLibraryContent.call(ctx, type)

  const createContext = () => ({
    setNewTrainingModal: jest.fn(),
    setNewLearningPathModal: jest.fn(),
    setNewPosterModal: jest.fn(),
    setNewInfographicModal: jest.fn(),
    setNewScreensaverModal: jest.fn(),
    setNewSurveyModal: jest.fn()
  })

  it('opens learning path modal for LEARNING_PATH', () => {
    const ctx = createContext()
    invoke(ctx, TRAINING_LIBRARY_TYPES.LEARNING_PATH)

    expect(ctx.setNewLearningPathModal).toHaveBeenCalledWith({
      status: true,
      isEdit: false,
      isDuplicate: false,
      selectedRow: null
    })
  })

  it('opens infographic modal for INFOGRAPHIC', () => {
    const ctx = createContext()
    invoke(ctx, TRAINING_LIBRARY_TYPES.INFOGRAPHIC)

    expect(ctx.setNewInfographicModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    })
  })

  it('opens training modal for TRAINING', () => {
    const ctx = createContext()
    invoke(ctx, TRAINING_LIBRARY_TYPES.TRAINING)

    expect(ctx.setNewTrainingModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    })
  })

  it('opens poster modal for POSTER', () => {
    const ctx = createContext()
    invoke(ctx, TRAINING_LIBRARY_TYPES.POSTER)

    expect(ctx.setNewPosterModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    })
  })

  it('opens screensaver modal for SCREENSAVER', () => {
    const ctx = createContext()
    invoke(ctx, TRAINING_LIBRARY_TYPES.SCREENSAVER)

    expect(ctx.setNewScreensaverModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    })
  })

  it('opens survey modal for SURVEY', () => {
    const ctx = createContext()
    invoke(ctx, TRAINING_LIBRARY_TYPES.SURVEY)

    expect(ctx.setNewSurveyModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    })
  })

  it('does nothing for unknown type', () => {
    const ctx = createContext()
    invoke(ctx, 'Unknown Type')

    expect(ctx.setNewTrainingModal).not.toHaveBeenCalled()
    expect(ctx.setNewLearningPathModal).not.toHaveBeenCalled()
    expect(ctx.setNewPosterModal).not.toHaveBeenCalled()
    expect(ctx.setNewInfographicModal).not.toHaveBeenCalled()
    expect(ctx.setNewScreensaverModal).not.toHaveBeenCalled()
    expect(ctx.setNewSurveyModal).not.toHaveBeenCalled()
  })
})
