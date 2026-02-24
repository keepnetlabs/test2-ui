import { shallowMount } from '@vue/test-utils'
import TrainingReportSendingReport from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReport.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingReportSendingReport.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingReportSendingReport, {
      propsData: {
        id: 'training-1',
        formDetails: {},
        isScormProxy: false,
        trainingSummary: {},
        isLearningPath: false,
        customFields: [],
        isSurvey: false,
        isMicrosoftTeams: false,
        ...propsData
      },
      stubs: {
        TrainingReportResendDialog: true,
        CampaignManagerReportHeader: true,
        TrainingReportEnrollmentEmailsTable: true,
        TrainingReportReminderEmailsTable: true,
        TrainingReportCertificateEmailsTable: true,
        TrainingReportMicrosoftTeamsTable: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('tab defaults to enrollment when not Microsoft Teams', () => {
    const wrapper = mountComponent({ isMicrosoftTeams: false })
    expect(wrapper.vm.tab).toBe('enrollment')
  })

  it('tab defaults to teams-notifications when isMicrosoftTeams', () => {
    const wrapper = mountComponent({ isMicrosoftTeams: true })
    expect(wrapper.vm.tab).toBe('teams-notifications')
  })

  it('getResendDialogTitle returns ResendSurvey when isSurvey', () => {
    const wrapper = mountComponent({ isSurvey: true })
    expect(wrapper.vm.getResendDialogTitle).toContain('Survey')
  })

  it('getResendDialogTitle returns ResendTraining when training', () => {
    const wrapper = mountComponent({
      isSurvey: false,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
    })
    expect(wrapper.vm.getResendDialogTitle).toContain('Training')
  })

  it('getBodyTrainingType returns survey when isSurvey', () => {
    const wrapper = mountComponent({ isSurvey: true })
    expect(wrapper.vm.getBodyTrainingType).toContain('survey')
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(5)
    expect(wrapper.vm.resendItemCount).toBe(5)
  })

  it('handleOnResend sets resendPayload and opens dialog for array items', () => {
    const wrapper = mountComponent()
    const items = [{ targetUserResourceId: 'u1' }, { targetUserResourceId: 'u2' }]

    wrapper.vm.handleOnResend(items, ['ex1'], true, { filter: 'x' })

    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['u1', 'u2'],
      excludedItems: ['ex1'],
      selectAll: true,
      filter: { filter: 'x' }
    })
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnResend sets resendPayload for single item', () => {
    const wrapper = mountComponent()
    const item = { targetUserResourceId: 'u1' }

    wrapper.vm.handleOnResend(item)

    expect(wrapper.vm.resendPayload.selectedItems).toEqual(['u1'])
  })

  it('toggleIsShowResendDialog toggles dialog', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.isShowResendDialog).toBe(false)
    wrapper.vm.toggleIsShowResendDialog()
    expect(wrapper.vm.isShowResendDialog).toBe(true)
    wrapper.vm.toggleIsShowResendDialog()
    expect(wrapper.vm.isShowResendDialog).toBe(false)
  })

  it('isCertification true when tab is certificate', () => {
    const wrapper = mountComponent()
    wrapper.vm.tab = 'certificate'
    expect(wrapper.vm.isCertification).toBe(true)
  })
})
