jest.mock('@/api/awarenessEducator', () => ({
  getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getTraining: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getTrainingUrlForPreview: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  downloadPoster: jest.fn(() => Promise.resolve({ data: new Blob(['x']) })),
  duplicateTraining: jest.fn(() => Promise.resolve()),
  deleteTraining: jest.fn(() => Promise.resolve()),
  addToFavorite: jest.fn(() => Promise.resolve()),
  removeFromFavorite: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryDrawerContentSummary from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerContentSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingLibraryDrawerContentSummary.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getLanguagesTooltip returns comma list only for multiple values', () => {
    expect(
      TrainingLibraryDrawerContentSummary.methods.getLanguagesTooltip.call({
        availableLanguages: [{ text: 'English' }, { text: 'Turkish' }],
        trainingData: {}
      })
    ).toBe('English, Turkish')

    expect(
      TrainingLibraryDrawerContentSummary.methods.getLanguagesTooltip.call({
        availableLanguages: [],
        trainingData: { languages: ['EN', 'TR'] }
      })
    ).toBe('EN, TR')

    expect(
      TrainingLibraryDrawerContentSummary.methods.getLanguagesTooltip.call({
        availableLanguages: [{ text: 'English' }],
        trainingData: { languages: ['EN'] }
      })
    ).toBe('')
  })

  it('compliance and role text/tooltip helpers cover fallback paths', () => {
    expect(
      TrainingLibraryDrawerContentSummary.methods.getComplianceTooltip({
        complianceNames: ['ISO', 'GDPR', '']
      })
    ).toBe('ISO, GDPR')
    expect(
      TrainingLibraryDrawerContentSummary.methods.getComplianceTooltip({
        complianceNames: ['OnlyOne']
      })
    ).toBe('')

    expect(
      TrainingLibraryDrawerContentSummary.methods.getComplianceText({
        complianceNames: ['ISO', 'GDPR']
      })
    ).toBe('2 compliance')
    expect(
      TrainingLibraryDrawerContentSummary.methods.getComplianceText({
        complianceNames: ['ISO']
      })
    ).toBe('ISO')
    expect(
      TrainingLibraryDrawerContentSummary.methods.getComplianceText({
        compliance: 'Fallback Compliance'
      })
    ).toBe('Fallback Compliance')
    expect(TrainingLibraryDrawerContentSummary.methods.getComplianceText({})).toBe('No compliance')

    expect(
      TrainingLibraryDrawerContentSummary.methods.getTrainingRolesTooltip({
        trainingRoles: [{ roleName: 'Admin' }, { roleName: 'User' }]
      })
    ).toBe('Admin, User')
    expect(
      TrainingLibraryDrawerContentSummary.methods.getTrainingRolesText({
        trainingRoles: [{ roleName: 'Admin' }, { roleName: 'User' }]
      })
    ).toBe('2 roles')
    expect(
      TrainingLibraryDrawerContentSummary.methods.getTrainingRolesText({
        trainingRoles: [{ roleName: 'Admin' }]
      })
    ).toBe('Admin')
    expect(
      TrainingLibraryDrawerContentSummary.methods.getTrainingRolesText({
        targetAudienceName: 'All Users'
      })
    ).toBe('All Users')
  })

  it('getLearningPathDurationText returns empty for invalid or missing steps', () => {
    expect(
      TrainingLibraryDrawerContentSummary.methods.getLearningPathDurationText.call({
        trainingDetails: null,
        trainingData: {},
        parseDurationToMinutes: TrainingLibraryDrawerContentSummary.methods.parseDurationToMinutes
      })
    ).toBe('')

    expect(
      TrainingLibraryDrawerContentSummary.methods.getLearningPathDurationText.call({
        trainingDetails: { trainingGroups: [{ durationDisplayName: 'invalid' }] },
        trainingData: {},
        parseDurationToMinutes: TrainingLibraryDrawerContentSummary.methods.parseDurationToMinutes
      })
    ).toBe('')
  })

  it('processLearningPathSteps clears list for non-array values', () => {
    const ctx = {
      trainingDetails: null,
      trainingData: { trainingGroups: null },
      learningPathSteps: [{ title: 'Old' }]
    }

    TrainingLibraryDrawerContentSummary.methods.processLearningPathSteps.call(ctx)
    expect(ctx.learningPathSteps).toEqual([])
  })

  it('handleFavoriteToggle returns early when resource id is missing', async () => {
    const ctx = {
      trainingData: {},
      isFavorite: false
    }

    TrainingLibraryDrawerContentSummary.methods.handleFavoriteToggle.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.addToFavorite).not.toHaveBeenCalled()
    expect(AwarenessEducatorService.removeFromFavorite).not.toHaveBeenCalled()
  })

  it('handleDownloadByLanguage handles api reject without throwing', async () => {
    AwarenessEducatorService.downloadPoster.mockRejectedValueOnce(new Error('download fail'))
    const downloadBlob = jest.fn()
    const ctx = {
      trainingData: { trainingId: 't1', name: 'Training 1' },
      downloadBlob
    }

    TrainingLibraryDrawerContentSummary.methods.handleDownloadByLanguage.call(ctx, { value: 'l1' })
    await flushPromises()

    expect(downloadBlob).not.toHaveBeenCalled()
  })

  it('getSendButtonText and getPreviewButtonText cover remaining branches', () => {
    expect(
      TrainingLibraryDrawerContentSummary.computed.getSendButtonText.call({
        type: TRAINING_LIBRARY_TYPES.SURVEY
      })
    ).toBe('SEND SURVEY')
    expect(
      TrainingLibraryDrawerContentSummary.computed.getSendButtonText.call({
        type: TRAINING_LIBRARY_TYPES.SCREENSAVER
      })
    ).toBe('DOWNLOAD SCREENSAVER')

    expect(
      TrainingLibraryDrawerContentSummary.computed.getPreviewButtonText.call({
        type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC
      })
    ).toBe('PREVIEW INFOGRAPHIC')
    expect(
      TrainingLibraryDrawerContentSummary.computed.getPreviewButtonText.call({
        type: TRAINING_LIBRARY_TYPES.SURVEY
      })
    ).toBe('PREVIEW SURVEY')
  })

  it('handleEdit dispatches type-specific edit actions and emits edit-clicked', () => {
    const buildCtx = (type) => ({
      type,
      trainingData: { trainingId: 't1' },
      $store: { dispatch: jest.fn() },
      $emit: jest.fn()
    })

    const cases = [
      { type: TRAINING_LIBRARY_TYPES.TRAINING, action: 'trainingLibrary/setNewTrainingModal' },
      { type: TRAINING_LIBRARY_TYPES.LEARNING_PATH, action: 'trainingLibrary/setNewLearningPathModal' },
      { type: TRAINING_LIBRARY_TYPES.POSTER, action: 'trainingLibrary/setNewPosterModal' },
      { type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, action: 'trainingLibrary/setNewInfographicModal' },
      { type: TRAINING_LIBRARY_TYPES.SCREENSAVER, action: 'trainingLibrary/setNewScreensaverModal' },
      { type: TRAINING_LIBRARY_TYPES.SURVEY, action: 'trainingLibrary/setNewSurveyModal' }
    ]

    cases.forEach(({ type, action }) => {
      const ctx = buildCtx(type)
      TrainingLibraryDrawerContentSummary.methods.handleEdit.call(ctx)
      expect(ctx.$store.dispatch).toHaveBeenCalledWith(
        action,
        expect.objectContaining({
          status: true,
          selectedRow: { trainingId: 't1' },
          isEdit: true,
          isDuplicate: false
        })
      )
      expect(ctx.$emit).toHaveBeenCalledWith('edit-clicked')
    })
  })

  it('handleSend commits type-specific modals and emits send-clicked for non-screensaver', () => {
    const cases = [
      { type: TRAINING_LIBRARY_TYPES.LEARNING_PATH, commit: 'trainingLibrary/SET_LEARNING_PATH_SEND_MODAL' },
      { type: TRAINING_LIBRARY_TYPES.POSTER, commit: 'trainingLibrary/SET_POSTER_SEND_MODAL' },
      { type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, commit: 'trainingLibrary/SET_INFOGRAPHIC_SEND_MODAL' },
      { type: TRAINING_LIBRARY_TYPES.SURVEY, commit: 'trainingLibrary/SET_SURVEY_SEND_MODAL' }
    ]

    cases.forEach(({ type, commit }) => {
      const ctx = {
        type,
        trainingData: { trainingId: 'x1' },
        $store: { commit: jest.fn() },
        $emit: jest.fn()
      }
      TrainingLibraryDrawerContentSummary.methods.handleSend.call(ctx)
      expect(ctx.$store.commit).toHaveBeenCalledWith(
        commit,
        expect.objectContaining({ status: true, selectedRow: { trainingId: 'x1' } })
      )
      expect(ctx.$emit).toHaveBeenCalledWith('send-clicked')
    })
  })

  it('handleDuplicate returns early without id and emits duplicate-success on success', async () => {
    const noIdCtx = {
      trainingData: {},
      $emit: jest.fn()
    }
    TrainingLibraryDrawerContentSummary.methods.handleDuplicate.call(noIdCtx)
    expect(AwarenessEducatorService.duplicateTraining).not.toHaveBeenCalled()
    expect(noIdCtx.$emit).not.toHaveBeenCalled()

    const okCtx = {
      trainingData: { trainingId: 'dup-1' },
      $emit: jest.fn()
    }
    TrainingLibraryDrawerContentSummary.methods.handleDuplicate.call(okCtx)
    await flushPromises()
    expect(AwarenessEducatorService.duplicateTraining).toHaveBeenCalledWith('dup-1')
    expect(okCtx.$emit).toHaveBeenCalledWith('duplicate-success')
  })

  it('handleDelete commits dialog and onClose resets dialog then emits on force update', () => {
    const commit = jest.fn()
    const ctx = {
      trainingData: { trainingId: 'del-1' },
      type: TRAINING_LIBRARY_TYPES.TRAINING,
      $store: { commit },
      $emit: jest.fn()
    }

    TrainingLibraryDrawerContentSummary.methods.handleDelete.call(ctx)
    expect(commit).toHaveBeenCalledWith(
      'trainingLibrary/SET_DELETE_DIALOG',
      expect.objectContaining({
        status: true,
        selectedRow: { trainingId: 'del-1' },
        type: TRAINING_LIBRARY_TYPES.TRAINING
      })
    )

    const payload = commit.mock.calls[0][1]
    payload.onClose(false)
    expect(ctx.$emit).not.toHaveBeenCalledWith('delete-success')
    payload.onClose(true)
    expect(ctx.$emit).toHaveBeenCalledWith('delete-success')
  })

  it('downloadBlob creates click workflow and revokes object url', () => {
    const createObjectURL = jest.fn(() => 'blob:test-url')
    const revokeObjectURL = jest.fn()
    const click = jest.fn()
    const remove = jest.fn()
    const appendChild = jest.fn()
    const originalURL = window.URL
    const originalCreateElement = document.createElement
    const originalBody = document.body

    window.URL = { ...window.URL, createObjectURL, revokeObjectURL }
    document.createElement = jest.fn(() => ({ click, remove }))
    Object.defineProperty(document, 'body', { value: { appendChild }, configurable: true })

    TrainingLibraryDrawerContentSummary.methods.downloadBlob.call({}, Buffer.from('x'), 'a.txt')

    expect(createObjectURL).toHaveBeenCalled()
    expect(appendChild).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(remove).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-url')

    window.URL = originalURL
    document.createElement = originalCreateElement
    Object.defineProperty(document, 'body', { value: originalBody, configurable: true })
  })

  it('callForLanguages exits when language list is not array and still calls detail', async () => {
    const callForTrainingDetail = jest.fn()
    const ctx = {
      isLoadingLanguages: true,
      trainingData: { languageCodes: 'EN' },
      availableLanguages: [{ text: 'old' }],
      callForTrainingDetail
    }
    AwarenessEducatorService.getLanguages.mockResolvedValueOnce({ data: { data: [] } })

    TrainingLibraryDrawerContentSummary.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.availableLanguages).toEqual([])
    expect(ctx.isLoadingLanguages).toBe(false)
    expect(callForTrainingDetail).toHaveBeenCalled()
  })

  it('callForTrainingDetail exits without trainingId and clears loading', async () => {
    const ctx = {
      trainingData: {},
      isLoadingLanguages: true
    }
    TrainingLibraryDrawerContentSummary.methods.callForTrainingDetail.call(ctx)
    await flushPromises()
    expect(ctx.isLoadingLanguages).toBe(false)
    expect(AwarenessEducatorService.getTraining).not.toHaveBeenCalled()
  })
})
