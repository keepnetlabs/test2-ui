import TrainingReportSummaryResendDialog from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryResendDialog.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingReportSummaryResendDialog.vue (extra)', () => {
  const { computed, methods } = TrainingReportSummaryResendDialog

  it('computes type text and only-opened label by training type', () => {
    expect(computed.getTypeText.call({ isSurvey: true, trainingType: '' })).toBe('survey')
    expect(
      computed.getTypeText.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER })
    ).toBe('poster')
    expect(
      computed.getTypeText.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC })
    ).toBe('infographic')
    expect(
      computed.getTypeText.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH })
    ).toBe('learning path')
    expect(computed.getTypeText.call({ isSurvey: false, trainingType: 'x' })).toBe('training')

    expect(
      computed.getOnlyOpenedLabel.call({ trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER })
    ).toBe('poster')
    expect(
      computed.getOnlyOpenedLabel.call({ trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC })
    ).toBe('infographic')
    expect(computed.getOnlyOpenedLabel.call({ trainingType: 'x' })).toBe('email')

    expect(
      computed.isTrainingTypeTraining.call({ trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING })
    ).toBe(true)
  })

  it('computes action button disabled state and emits close/confirm', () => {
    expect(computed.getActionButtonDisabled.call({ isActionButtonDisabled: true, types: [1] })).toBe(
      true
    )
    expect(computed.getActionButtonDisabled.call({ isActionButtonDisabled: false, types: [] })).toBe(
      true
    )
    expect(
      computed.getActionButtonDisabled.call({ isActionButtonDisabled: false, types: [1, 2] })
    ).toBe(false)

    const emit = jest.fn()
    methods.closeModal.call({ $emit: emit })
    methods.handleConfirm.call({ $emit: emit, types: [2, 7] })

    expect(emit).toHaveBeenCalledWith('on-close')
    expect(emit).toHaveBeenCalledWith('on-confirm', [2, 7])
  })
})
