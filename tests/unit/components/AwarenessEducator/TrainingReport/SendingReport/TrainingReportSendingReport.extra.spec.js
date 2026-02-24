jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    resendCertificateToUserList: jest.fn(),
    resendTrainingSendingReportList: jest.fn()
  }
}))

import TrainingReportSendingReport from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReport.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportSendingReport.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data sets default tab by Microsoft Teams flag', () => {
    const teamsData = TrainingReportSendingReport.data.call({ isMicrosoftTeams: true })
    const regularData = TrainingReportSendingReport.data.call({ isMicrosoftTeams: false })
    expect(teamsData.tab).toBe('teams-notifications')
    expect(regularData.tab).toBe('enrollment')
  })

  it('computed title/body/type branches return expected variants', () => {
    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: true,
        isCertification: false,
        trainingSummary: {}
      })
    ).toContain('Survey')

    expect(
      TrainingReportSendingReport.computed.getBodyTrainingType.call({
        isSurvey: false,
        isCertification: true,
        trainingSummary: {}
      })
    ).toBe('certificate')

    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: false,
        isCertification: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
    ).toContain('Poster')

    expect(
      TrainingReportSendingReport.computed.getBodyTrainingType.call({
        isSurvey: false,
        isCertification: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe('infographic')

    expect(
      TrainingReportSendingReport.computed.isTypeTraining.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
    ).toBe(true)
    expect(
      TrainingReportSendingReport.computed.isTypePoster.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
    ).toBe(true)
    expect(
      TrainingReportSendingReport.computed.getFirstCardSubtitle.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toContain('Infographic')
    expect(TrainingReportSendingReport.computed.isCertification.call({ tab: 'certificate' })).toBe(
      true
    )
  })

  it('computed title/body/default subtitle branches include certification and training defaults', () => {
    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: false,
        isCertification: true,
        trainingSummary: {}
      })
    ).toContain('Certificate')
    expect(
      TrainingReportSendingReport.computed.getBodyTrainingType.call({
        isSurvey: false,
        isCertification: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
    ).toBe('training')
    expect(
      TrainingReportSendingReport.computed.getFirstCardSubtitle.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
    ).toContain('Poster')
    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: false,
        isCertification: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
    ).toContain('Training')
    expect(
      TrainingReportSendingReport.computed.getBodyTrainingType.call({
        isSurvey: true,
        isCertification: false,
        trainingSummary: {}
      })
    ).toBe('survey')
    expect(TrainingReportSendingReport.computed.isCertification.call({ tab: 'enrollment' })).toBe(
      false
    )
    expect(
      TrainingReportSendingReport.computed.isTypeTraining.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe(false)
    expect(
      TrainingReportSendingReport.computed.isTypePoster.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
    ).toBe(false)
  })

  it('toggleIsShowResendDialog toggles visibility and clears selectedRow when closing', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 1 } }
    TrainingReportSendingReport.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 1 })

    TrainingReportSendingReport.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('handleOnResend builds payload for array and single item inputs', () => {
    const toggleIsShowResendDialog = jest.fn()
    const ctx = { toggleIsShowResendDialog }

    TrainingReportSendingReport.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u-1' }, { targetUserResourceId: 'u-2' }],
      ['u-3'],
      true,
      { FilterGroups: [] }
    )
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u-1', 'u-2'],
      excludedItems: ['u-3'],
      selectAll: true,
      filter: { FilterGroups: [] }
    })

    TrainingReportSendingReport.methods.handleOnResend.call(
      ctx,
      { targetUserResourceId: 'single-u' },
      null,
      false,
      null
    )
    expect(ctx.resendPayload.selectedItems).toEqual(['single-u'])
    expect(ctx.resendPayload.excludedItems).toEqual([])
    expect(ctx.resendPayload.selectAll).toBe(false)
    expect(toggleIsShowResendDialog).toHaveBeenCalledTimes(2)
  })

  it('handleOnResend coerces selectAll to boolean and default excluded list', () => {
    const ctx = { toggleIsShowResendDialog: jest.fn() }
    TrainingReportSendingReport.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u-10' }],
      undefined,
      'yes',
      { FilterGroups: [{ FilterItems: [] }] }
    )
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u-10'],
      excludedItems: [],
      selectAll: true,
      filter: { FilterGroups: [{ FilterItems: [] }] }
    })
  })

  it('resendItem certification branch maps payload and refreshes certificate table', async () => {
    AwarenessEducatorService.resendCertificateToUserList.mockResolvedValueOnce({})
    const resetSelectableParams = jest.fn()
    const callForData = jest.fn()
    const toggleIsShowResendDialog = jest.fn()
    const ctx = {
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      isCertification: true,
      id: 'enrollment-1',
      resendPayload: { selectedItems: ['u1', 'u2'] },
      $refs: { refCertificateTable: { $refs: { refTable: { resetSelectableParams } }, callForData } },
      toggleIsShowResendDialog
    }

    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendCertificateToUserList).toHaveBeenCalledWith([
      { targetUserResourceId: 'u1', enrollmentId: 'enrollment-1' },
      { targetUserResourceId: 'u2', enrollmentId: 'enrollment-1' }
    ])
    expect(resetSelectableParams).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(toggleIsShowResendDialog).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('resendItem enrollment branch refreshes both enrollment and reminder tables', async () => {
    AwarenessEducatorService.resendTrainingSendingReportList.mockResolvedValueOnce({})
    const enrollmentReset = jest.fn()
    const enrollmentCall = jest.fn()
    const reminderReset = jest.fn()
    const reminderCall = jest.fn()
    const toggleIsShowResendDialog = jest.fn()
    const ctx = {
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      isCertification: false,
      tab: 'enrollment',
      id: 'tr-1',
      resendPayload: { selectedItems: ['u1'], excludedItems: [], selectAll: false, filter: {} },
      $refs: {
        refEnrollmentTable: { $refs: { refTable: { resetSelectableParams: enrollmentReset } }, callForData: enrollmentCall },
        refReminderTable: { $refs: { refTable: { resetSelectableParams: reminderReset } }, callForData: reminderCall }
      },
      toggleIsShowResendDialog
    }

    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendTrainingSendingReportList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'tr-1'
    )
    expect(enrollmentReset).toHaveBeenCalled()
    expect(reminderReset).toHaveBeenCalled()
    expect(enrollmentCall).toHaveBeenCalled()
    expect(reminderCall).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('resendItem teams-notifications branch refreshes teams table only', async () => {
    AwarenessEducatorService.resendTrainingSendingReportList.mockResolvedValueOnce({})
    const teamsReset = jest.fn()
    const teamsCall = jest.fn()
    const ctx = {
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      isCertification: false,
      tab: 'teams-notifications',
      id: 'tr-teams',
      resendPayload: { selectedItems: ['u1'], excludedItems: [], selectAll: false, filter: {} },
      $refs: {
        refTeamsTable: { $refs: { refTable: { resetSelectableParams: teamsReset } }, callForData: teamsCall }
      },
      toggleIsShowResendDialog: jest.fn()
    }

    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendTrainingSendingReportList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'tr-teams'
    )
    expect(teamsReset).toHaveBeenCalled()
    expect(teamsCall).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('resendItem certification branch works safely when refs are missing', async () => {
    AwarenessEducatorService.resendCertificateToUserList.mockResolvedValueOnce({})
    const ctx = {
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      isCertification: true,
      id: 'enrollment-no-ref',
      resendPayload: { selectedItems: ['u1'] },
      $refs: {},
      toggleIsShowResendDialog: jest.fn()
    }

    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendCertificateToUserList).toHaveBeenCalledWith([
      { targetUserResourceId: 'u1', enrollmentId: 'enrollment-no-ref' }
    ])
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('resendItem non-enrollment/teams branch still finalizes without table refresh', async () => {
    AwarenessEducatorService.resendTrainingSendingReportList.mockResolvedValueOnce({})
    const ctx = {
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      isCertification: false,
      tab: 'reminder',
      id: 'tr-rem',
      resendPayload: { selectedItems: ['u1'], excludedItems: [], selectAll: false, filter: {} },
      $refs: {},
      toggleIsShowResendDialog: jest.fn()
    }

    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendTrainingSendingReportList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'tr-rem'
    )
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('toggleIsShowResendDialog keeps selectedRow when opening and clears when closing', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 'x' } }
    TrainingReportSendingReport.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 'x' })
    TrainingReportSendingReport.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const ctx = { resendItemCount: 0 }
    TrainingReportSendingReport.methods.handleSelectionChange.call(ctx, 9)
    expect(ctx.resendItemCount).toBe(9)
  })
})
