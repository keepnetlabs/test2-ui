import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const getInactiveDialogs = () => ({
  getTrainingPreviewDialog: { status: false },
  getPosterPreviewDialog: { status: false },
  getInfographicPreviewDialog: { status: false },
  getScreensaverPreviewDialog: { status: false },
  getSurveyPreviewDialog: { status: false },
  getLearningPathPreviewDialog: { status: false }
})

describe('TrainingLibraryCommonComponents.vue (extra)', () => {
  it.each([
    [
      'poster',
      'getPosterPreviewDialog',
      TRAINING_LIBRARY_TYPES.POSTER,
      { status: true, selectedRow: { id: 1 }, onlyPreview: true }
    ],
    [
      'infographic',
      'getInfographicPreviewDialog',
      TRAINING_LIBRARY_TYPES.INFOGRAPHIC,
      { status: true, selectedRow: { id: 2 } }
    ],
    [
      'screensaver',
      'getScreensaverPreviewDialog',
      TRAINING_LIBRARY_TYPES.SCREENSAVER,
      { status: true, selectedRow: { id: 3 } }
    ],
    [
      'survey',
      'getSurveyPreviewDialog',
      TRAINING_LIBRARY_TYPES.SURVEY,
      { status: true, selectedRow: { id: 4 } }
    ],
    [
      'learningPath',
      'getLearningPathPreviewDialog',
      TRAINING_LIBRARY_TYPES.LEARNING_PATH,
      { status: true, selectedRow: { id: 5 } }
    ]
  ])('currentDrawer resolves %s preview dialogs', (dialogType, key, expectedType, dialog) => {
    const ctx = {
      ...getInactiveDialogs(),
      [key]: dialog
    }

    const result = TrainingLibraryCommonComponents.computed.currentDrawer.call(ctx)

    expect(result.dialogType).toBe(dialogType)
    expect(result.type).toBe(expectedType)
    expect(result.selectedRow).toEqual(dialog.selectedRow)
  })

  it.each([
    [
      'training',
      'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG',
      {
        status: false,
        selectedRow: null,
        showSendButton: true,
        type: TRAINING_LIBRARY_TYPES.TRAINING
      }
    ],
    ['poster', 'trainingLibrary/SET_POSTER_PREVIEW_DIALOG', { status: false, selectedRow: null }],
    [
      'infographic',
      'trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG',
      { status: false, selectedRow: null }
    ],
    [
      'screensaver',
      'trainingLibrary/SET_SCREENSAVER_PREVIEW_DIALOG',
      { status: false, selectedRow: null }
    ],
    ['survey', 'trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', { status: false, selectedRow: null }],
    [
      'learningPath',
      'trainingLibrary/SET_LEARNING_PATH_PREVIEW_DIALOG',
      { status: false, selectedRow: null }
    ]
  ])('handleDrawerClose closes %s preview dialogs', (dialogType, mutation, payload) => {
    const commit = jest.fn()
    const ctx = {
      currentDrawer: { dialogType },
      $store: { commit }
    }

    TrainingLibraryCommonComponents.methods.handleDrawerClose.call(ctx, false)

    expect(commit).toHaveBeenCalledWith(mutation, payload)
  })

  it('handleDeleteSuccess and handleDuplicateSuccess refetch the list', () => {
    const dispatch = jest.fn()
    const ctx = { $store: { dispatch } }

    TrainingLibraryCommonComponents.methods.handleDeleteSuccess.call(ctx)
    TrainingLibraryCommonComponents.methods.handleDuplicateSuccess.call(ctx)

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/callForTrainingLibrary')
  })

  it('handleLightboxClose resets the lightbox state', () => {
    const commit = jest.fn()

    TrainingLibraryCommonComponents.methods.handleLightboxClose.call(
      { $store: { commit } },
      false
    )

    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_LIGHTBOX', {
      status: false,
      previewData: null,
      isLoading: false,
      type: null
    })
  })

  it('nested drawer close handlers reset nested drawer states', () => {
    const commit = jest.fn()
    const ctx = { $store: { commit } }

    TrainingLibraryCommonComponents.methods.handleNestedDrawerClose.call(ctx, false)
    TrainingLibraryCommonComponents.methods.handleDeepNestedDrawerClose.call(ctx, false)

    expect(commit).toHaveBeenNthCalledWith(1, 'trainingLibrary/SET_NESTED_DRAWER', {
      status: false,
      selectedRow: null,
      type: null
    })
    expect(commit).toHaveBeenNthCalledWith(2, 'trainingLibrary/SET_DEEP_NESTED_DRAWER', {
      status: false,
      selectedRow: null,
      type: null
    })
  })

  it('handleCloseParentDrawer can skip body scroll and close both nested and parent drawers', () => {
    const commit = jest.fn()
    const mainDrawer = { skipBodyScrollOnClose: false }
    const ctx = {
      currentDrawer: { dialogType: 'training' },
      $refs: { mainDrawer },
      $store: { commit }
    }

    TrainingLibraryCommonComponents.methods.handleCloseParentDrawer.call(ctx, {
      skipBodyScroll: true
    })

    expect(mainDrawer.skipBodyScrollOnClose).toBe(true)
    expect(commit).toHaveBeenNthCalledWith(1, 'trainingLibrary/SET_NESTED_DRAWER', {
      status: false,
      selectedRow: null,
      type: null
    })
    expect(commit).toHaveBeenNthCalledWith(2, 'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
      status: false,
      selectedRow: null,
      showSendButton: true,
      type: TRAINING_LIBRARY_TYPES.TRAINING
    })
  })

  it('handleCloseAllDrawers closes deep nested, nested, and survey parent drawers', () => {
    const commit = jest.fn()
    const nestedDrawer = { skipBodyScrollOnClose: false }
    const mainDrawer = { skipBodyScrollOnClose: false }
    const ctx = {
      currentDrawer: { dialogType: 'survey' },
      $refs: { nestedDrawer, mainDrawer },
      $store: { commit }
    }

    TrainingLibraryCommonComponents.methods.handleCloseAllDrawers.call(ctx, {
      skipBodyScroll: true
    })

    expect(nestedDrawer.skipBodyScrollOnClose).toBe(true)
    expect(mainDrawer.skipBodyScrollOnClose).toBe(true)
    expect(commit).toHaveBeenNthCalledWith(1, 'trainingLibrary/SET_DEEP_NESTED_DRAWER', {
      status: false,
      selectedRow: null,
      type: null
    })
    expect(commit).toHaveBeenNthCalledWith(2, 'trainingLibrary/SET_NESTED_DRAWER', {
      status: false,
      selectedRow: null,
      type: null
    })
    expect(commit).toHaveBeenNthCalledWith(3, 'trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
      status: false,
      selectedRow: null
    })
  })
})
