jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    resendCertificateToUserList: jest.fn(() => Promise.resolve({})),
    resendTrainingSendingReportList: jest.fn(() => Promise.resolve({}))
  }
}))

import TrainingReportSendingReport from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReport.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingReportSendingReport.vue (more extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed branches cover certification/poster/infographic/default', () => {
    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: false,
        isCertification: true,
        trainingSummary: {}
      })
    ).toBe(labels.ResendTheCertificate)

    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: false,
        isCertification: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
    ).toBe(labels.ResendPoster)

    expect(
      TrainingReportSendingReport.computed.getResendDialogTitle.call({
        isSurvey: false,
        isCertification: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe(labels.ResendInfographic)

    expect(
      TrainingReportSendingReport.computed.getBodyTrainingType.call({
        isSurvey: false,
        isCertification: true,
        trainingSummary: {}
      })
    ).toBe(labels.Certificate.toLowerCase())

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
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
    ).toContain('Poster')
    expect(
      TrainingReportSendingReport.computed.getFirstCardSubtitle.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toContain('Infographic')
  })

  it('toggleIsShowResendDialog clears selectedRow when closing', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 1 } }
    TrainingReportSendingReport.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    TrainingReportSendingReport.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('resendItem certification branch uses certificate API and table refresh', async () => {
    const ctx = {
      id: 'enrollment-1',
      awardCertificateEnrollmentId: 'enroll-c1',
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      tab: 'certificate',
      resendPayload: { selectedItems: ['u1', 'u2'] },
      isCertification: true,
      toggleIsShowResendDialog: TrainingReportSendingReport.methods.toggleIsShowResendDialog,
      $refs: {
        refCertificateTable: {
          $refs: { refTable: { resetSelectableParams: jest.fn() } },
          callForData: jest.fn()
        }
      }
    }
    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendCertificateToUserList).toHaveBeenCalledWith([
      { targetUserResourceId: 'u1', enrollmentId: 'enrollment-1' },
      { targetUserResourceId: 'u2', enrollmentId: 'enrollment-1' }
    ])
    expect(ctx.$refs.refCertificateTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.$refs.refCertificateTable.callForData).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('resendItem non-cert enrollment branch resets enrollment/reminder tables', async () => {
    const ctx = {
      id: 'enrollment-2',
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      tab: 'enrollment',
      resendPayload: { selectedItems: ['u3'], filter: {} },
      isCertification: false,
      toggleIsShowResendDialog: TrainingReportSendingReport.methods.toggleIsShowResendDialog,
      $refs: {
        refEnrollmentTable: {
          $refs: { refTable: { resetSelectableParams: jest.fn() } },
          callForData: jest.fn()
        },
        refReminderTable: {
          $refs: { refTable: { resetSelectableParams: jest.fn() } },
          callForData: jest.fn()
        }
      }
    }
    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendTrainingSendingReportList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'enrollment-2'
    )
    expect(ctx.$refs.refEnrollmentTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.$refs.refReminderTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.$refs.refEnrollmentTable.callForData).toHaveBeenCalled()
    expect(ctx.$refs.refReminderTable.callForData).toHaveBeenCalled()
  })

  it('resendItem non-cert teams branch resets teams table only', async () => {
    const ctx = {
      id: 'enrollment-3',
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      tab: 'teams-notifications',
      resendPayload: { selectedItems: ['u4'], filter: {} },
      isCertification: false,
      toggleIsShowResendDialog: TrainingReportSendingReport.methods.toggleIsShowResendDialog,
      $refs: {
        refTeamsTable: {
          $refs: { refTable: { resetSelectableParams: jest.fn() } },
          callForData: jest.fn()
        }
      }
    }
    TrainingReportSendingReport.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.$refs.refTeamsTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.$refs.refTeamsTable.callForData).toHaveBeenCalled()
  })
})

