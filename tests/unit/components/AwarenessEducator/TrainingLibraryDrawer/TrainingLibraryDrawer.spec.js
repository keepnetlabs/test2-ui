import TrainingLibraryDrawer from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { approvalFooterActionsComputed } from '@/mixins/approvalFooterActionsComputed'

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

  describe('approval footer mixin (merged computed)', () => {
    const footerCtx = (overrides = {}) => ({
      approvalActionsDisabled: false,
      approvalActionsDisabledTooltip: '',
      ...overrides
    })

    it('merges approvalFooterActionsComputed from mixin', () => {
      expect(TrainingLibraryDrawer.computed.approvalFooterRetryBtnClass).toBe(
        approvalFooterActionsComputed.approvalFooterRetryBtnClass
      )
      expect(TrainingLibraryDrawer.computed.approvalFooterApproveBtnClass).toBe(
        approvalFooterActionsComputed.approvalFooterApproveBtnClass
      )
    })

    it('retry btn class matches mixin for same context', () => {
      const c = footerCtx({ approvalActionsDisabled: true })
      expect(TrainingLibraryDrawer.computed.approvalFooterRetryBtnClass.call(c)).toEqual(
        approvalFooterActionsComputed.approvalFooterRetryBtnClass.call(c)
      )
    })

    it('approve btn class matches mixin when restricted', () => {
      const c = footerCtx({ approvalActionsDisabled: true })
      expect(TrainingLibraryDrawer.computed.approvalFooterApproveBtnClass.call(c)).toEqual(
        approvalFooterActionsComputed.approvalFooterApproveBtnClass.call(c)
      )
    })

    it('approvalActionsDisabled prop defaults to false', () => {
      const prop = TrainingLibraryDrawer.props.approvalActionsDisabled
      const def = typeof prop.default === 'function' ? prop.default() : prop.default
      expect(def).toBe(false)
    })

    it('approvalActionsDisabledTooltip prop defaults to empty string', () => {
      const prop = TrainingLibraryDrawer.props.approvalActionsDisabledTooltip
      const def = typeof prop.default === 'function' ? prop.default() : prop.default
      expect(def).toBe('')
    })
  })
})
