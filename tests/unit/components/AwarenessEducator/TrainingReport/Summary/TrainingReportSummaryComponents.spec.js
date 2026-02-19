import { shallowMount } from '@vue/test-utils'
import TrainingReportSummaryInfoCard from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryInfoCard.vue'
import TrainingReportSMSSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSMSSummary.vue'
import TrainingReportEnrollmentEmail from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportEnrollmentEmail.vue'
import TrainingReportTrainingDelivery from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingDelivery.vue'
import TrainingReportCertificate from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportCertificate.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import labels from '@/model/constants/labels'

describe('Training report summary components', () => {
  it('TrainingReportSummaryInfoCard renders props and toggles loading class', async () => {
    const wrapper = shallowMount(TrainingReportSummaryInfoCard, {
      propsData: {
        isLoading: true,
        title: 'Completed',
        userCount: 12,
        userPercent: '48',
        backgroundColor: '#000',
        iconSrc: '/icon.png'
      },
      stubs: {
        CardLoading: {
          name: 'CardLoading',
          props: ['loading'],
          template: '<div><slot name="skeleton-content" /></div>'
        }
      }
    })

    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('48%')
    expect(wrapper.classes()).toContain('training-report-summary-info-card--loading')

    await wrapper.setProps({ isLoading: false })
    expect(wrapper.classes()).not.toContain('training-report-summary-info-card--loading')
  })

  it('TrainingReportSMSSummary computes visible items and delivery value', () => {
    const items = {
      DeliveryStatus: { show: true, value: 'Sent' },
      Hidden: { show: false, value: 'X' }
    }
    const ctx = {
      items,
      helperData: { sentCount: 7 }
    }

    expect(TrainingReportSMSSummary.computed.getItems.call(ctx)).toEqual({ DeliveryStatus: 'Sent' })
    expect(TrainingReportSMSSummary.computed.getDeliveryValue.call(ctx)).toBe('7 sent')
    expect(TrainingReportSMSSummary.computed.getDeliveryValue.call({ helperData: null })).toBe('0 sent')
  })

  it('TrainingReportEnrollmentEmail returns training text by training type', () => {
    expect(
      TrainingReportEnrollmentEmail.computed.getEnrollmentTextByTrainingType.call({
        isSurvey: true,
        trainingType: ''
      })
    ).toBe(labels.Survey)

    expect(
      TrainingReportEnrollmentEmail.computed.getEnrollmentTextByTrainingType.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
    ).toBe('Poster')

    expect(
      TrainingReportEnrollmentEmail.computed.getEnrollmentTextByTrainingType.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
    ).toBe('Infographic')

    expect(
      TrainingReportEnrollmentEmail.computed.getEnrollmentTextByTrainingType.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
      })
    ).toBe('Training')

    expect(
      TrainingReportEnrollmentEmail.computed.getEnrollmentTextByTrainingType.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER
      })
    ).toBe('Screensaver')

    expect(
      TrainingReportEnrollmentEmail.computed.getEnrollmentTextByTrainingType.call({
        isSurvey: false,
        trainingType: 'unknown-type'
      })
    ).toBe('Learning Path')
  })

  it('TrainingReportTrainingDelivery computes title, items and delivery states', () => {
    const items = {
      DeliveryStatus: { show: true, value: 'ok' },
      Hidden: { show: false, value: 'x' }
    }

    expect(
      TrainingReportTrainingDelivery.computed.getCardTitle.call({
        isSurvey: true,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
      })
    ).toBe(labels.SurveyDelivery)

    expect(
      TrainingReportTrainingDelivery.computed.getCardTitle.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
    ).toBe(labels.PosterDelivery)

    expect(
      TrainingReportTrainingDelivery.computed.getCardTitle.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
    ).toBe(labels.InfographicDelivery)

    expect(
      TrainingReportTrainingDelivery.computed.getCardTitle.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(labels.LearningPathDelivery)

    expect(
      TrainingReportTrainingDelivery.computed.getCardTitle.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH
      })
    ).toBe(labels.LearningPathDelivery)

    expect(
      TrainingReportTrainingDelivery.computed.getCardTitle.call({
        isSurvey: false,
        trainingType: 'other'
      })
    ).toBe(labels.TrainingDelivery)

    expect(TrainingReportTrainingDelivery.computed.getItems.call({ items })).toEqual({
      DeliveryStatus: 'ok'
    })

    expect(
      TrainingReportTrainingDelivery.computed.isNotDelivered.call({
        helperData: { emailErrorUserCount: 2 }
      })
    ).toBe(true)

    expect(
      TrainingReportTrainingDelivery.computed.getDeliveryValue.call({
        helperData: { emailDeliveredUserCount: 3, totalTargetUserCount: 10 }
      })
    ).toBe('3 / 10 sent')

    expect(
      TrainingReportTrainingDelivery.computed.getNotDeliveredValue.call({
        helperData: { emailErrorUserCount: 2 }
      })
    ).toBe('2 not delivered')
  })

  it('TrainingReportCertificate computes language helpers and updates selected template', () => {
    const formData = {
      name: 'Cert',
      template: 'fallback-template',
      selectedLanguageResourceId: 'tr',
      languages: [
        {
          languageTypeName: 'Turkish',
          languageTypeResourceId: 'tr',
          template: 'template-tr'
        },
        {
          languageTypeName: 'English',
          languageTypeResourceId: 'en',
          template: 'template-en'
        }
      ]
    }

    const ctx = {
      formData,
      selectedTemplate: '',
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      })
    }

    expect(TrainingReportCertificate.computed.isFormData.call({ formData })).toBe(4)
    expect(TrainingReportCertificate.computed.templateLanguageLabel.call({ formData })).toBe(
      'Template Languages (2)'
    )
    expect(TrainingReportCertificate.computed.getLanguageItems.call({ formData })).toEqual([
      { text: 'Turkish', value: 'tr' },
      { text: 'English', value: 'en' }
    ])

    TrainingReportCertificate.methods.updateSelectedTemplate.call(ctx)
    expect(ctx.selectedTemplate).toBe('template-tr')

    TrainingReportCertificate.methods.handleLanguageChange.call(ctx, 'en')
    expect(ctx.formData.selectedLanguageResourceId).toBe('en')
    expect(ctx.formData.selectedLanguageName).toBe('English')
    expect(ctx.selectedTemplate).toBe('template-en')

    TrainingReportCertificate.methods.handleLanguageChange.call(ctx, 'missing')
    expect(ctx.selectedTemplate).toBe('template-en')
  })
})
