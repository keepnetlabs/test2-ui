import TrainingLibrarySendSurveySummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySurveySendModal/TrainingLibrarySendSurveySummary.vue'

describe('TrainingLibrarySendSurveySummary.vue', () => {
  it('getCardTitle uses training name', () => {
    const title = TrainingLibrarySendSurveySummary.computed.getCardTitle.call({
      formData: { trainingData: { name: 'Awareness Survey' } }
    })
    expect(title).toBe('Survey: Awareness Survey')
  })

  it('getUsersFromUnverifiedDomainsCount sums active unverified users', () => {
    const count = TrainingLibrarySendSurveySummary.computed.getUsersFromUnverifiedDomainsCount.call(
      {
        formData: {
          userCountDetailResponse: {
            data: {
              data: [
                { status: 'Active', domainAllowList: [{ status: 'Unverified', count: 3 }] },
                { status: 'Inactive', domainAllowList: [{ status: 'Unverified', count: 10 }] },
                { status: 'Active', domainAllowList: [{ status: 'Unverified', count: 2 }] }
              ]
            }
          }
        }
      }
    )
    expect(count).toBe(5)
  })

  it('handleEnrollmentLanguageChange updates selected language data', () => {
    const formData = {
      enrollmentData: {
        selectedLanguageResourceId: '',
        selectedLanguageName: '',
        template: '',
        languages: [
          { languageTypeResourceId: 'en', languageTypeName: 'English', template: '<p>en</p>' }
        ]
      }
    }

    TrainingLibrarySendSurveySummary.methods.handleEnrollmentLanguageChange.call(
      { formData },
      'en'
    )

    expect(formData.enrollmentData.selectedLanguageName).toBe('English')
    expect(formData.enrollmentData.template).toBe('<p>en</p>')
  })
})
