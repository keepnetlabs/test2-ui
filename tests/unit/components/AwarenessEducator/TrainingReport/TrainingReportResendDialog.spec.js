import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog.vue'

describe('TrainingReportResendDialog.vue', () => {
  it('has correct component name', () => {
    expect(TrainingReportResendDialog.name).toBe('TrainingReportResendDialog')
  })

  it('getResendText uses resendItemCount when present', () => {
    const text = TrainingReportResendDialog.computed.getResendText.call({
      resendItemCount: 2,
      bodyTrainingType: 'training',
      payload: null,
      isSurvey: false
    })
    expect(text).toContain('2 users')
  })

  it('getResendText uses payload selected item count', () => {
    const text = TrainingReportResendDialog.computed.getResendText.call({
      resendItemCount: 0,
      bodyTrainingType: 'training',
      payload: { selectedItems: ['u1'] },
      isSurvey: false
    })
    expect(text).toContain('1 user')
  })

  it('getResendText falls back to survey/training wording', () => {
    const surveyText = TrainingReportResendDialog.computed.getResendText.call({
      resendItemCount: 0,
      bodyTrainingType: 'training',
      payload: { selectedItems: [] },
      isSurvey: true
    })
    expect(surveyText).toContain('re-send this survey')
  })

  it('handleClose and handleConfirm emit events', () => {
    const $emit = jest.fn()
    TrainingReportResendDialog.methods.handleClose.call({ $emit })
    TrainingReportResendDialog.methods.handleConfirm.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
    expect($emit).toHaveBeenCalledWith('on-confirm')
  })
})
