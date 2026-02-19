import TrainingReportTrainingMaterial from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingMaterial.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingReportTrainingMaterial.vue (extra)', () => {
  const { computed, methods } = TrainingReportTrainingMaterial

  it('covers title/icon/form/training-type computed branches', () => {
    expect(
      computed.getCardTitle.call({ isSurvey: true, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING, formData: { name: 'A' } })
    ).toBe('Survey: A')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER, formData: { name: 'B' } })
    ).toBe('Poster: B')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC, formData: { name: 'C' } })
    ).toBe('Infographic: C')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH, formData: { name: 'D' } })
    ).toBe('Learning Path: D')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH, formData: { name: 'E' } })
    ).toBe('Learning Path: E')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: 'other', formData: { name: 'F' } })
    ).toBe('Training: F')

    expect(computed.getCardIcon.call({})).toBe('mdi-book-education')
    expect(computed.isFormData.call({ formData: {} })).toBe(0)
    expect(computed.isFormData.call({ formData: { name: 'X' } })).toBe(1)
    expect(
      computed.isTrainingTypeTraining.call({ trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING })
    ).toBe(true)
  })

  it('covers all preview commit branches and badge helpers', () => {
    const commit = jest.fn()

    methods.handlePreviewClick.call({
      trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER,
      selectedRow: { id: 1 },
      isSurvey: false,
      $store: { commit }
    })
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 1 },
      onlyPreview: true
    })

    methods.handlePreviewClick.call({
      trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
      selectedRow: { id: 2 },
      isSurvey: false,
      $store: { commit }
    })
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 2 },
      onlyPreview: true
    })

    methods.handlePreviewClick.call({
      trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH,
      selectedRow: { id: 3 },
      isSurvey: false,
      $store: { commit }
    })
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_LEARNING_PATH_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 3 },
      onlyPreview: true
    })

    methods.handlePreviewClick.call({
      trainingType: 'other',
      selectedRow: { id: 4 },
      isSurvey: true,
      $store: { commit }
    })
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 4 },
      onlyPreview: true
    })

    methods.handlePreviewClick.call({
      trainingType: 'other',
      selectedRow: { id: 5 },
      isSurvey: false,
      $store: { commit }
    })
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 5 },
      showSendButton: true,
      type: TRAINING_LIBRARY_TYPES.TRAINING,
      onlyPreview: true
    })

    expect(methods.getBadgeColor('easy')).toBe('#217124')
    expect(methods.getBadgeColor('medium')).toBe('#2196f3')
    expect(methods.getBadgeColor('hard')).toBe('#f56c6c')
    expect(methods.getBadgeColor('x')).toBe('#2196f3')
    expect(methods.getBadgeText('Any')).toBe('Any')
  })

  it('calls resetAllModals on beforeDestroy', () => {
    const resetAllModals = jest.fn()
    TrainingReportTrainingMaterial.beforeDestroy.call({ resetAllModals })
    expect(resetAllModals).toHaveBeenCalledTimes(1)
  })
})
