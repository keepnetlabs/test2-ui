jest.mock('awesome-phonenumber', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getRegionCode: () => 'US',
    g: { number: { international: '+1 555-123-4567' } }
  }))
}))

import TrainingLibrarySendTrainingSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSummary.vue'

describe('TrainingLibrarySendTrainingSummary.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendTrainingSummary.name).toBe('TrainingLibrarySendTrainingSummary')
  })

  it('getSettingItems returns formData settings', () => {
    const ctx = {
      formData: { settings: { Reminder: true } }
    }
    expect(TrainingLibrarySendTrainingSummary.computed.getSettingItems.call(ctx)).toEqual({
      Reminder: true
    })
  })

  it('isReminder returns getSettingItems Reminder', () => {
    const ctx = {
      getSettingItems: { Reminder: true }
    }
    expect(TrainingLibrarySendTrainingSummary.computed.isReminder.call(ctx)).toBe(true)
  })

  it('isProxy returns formData isProxy', () => {
    const ctx = {
      formData: { isProxy: true }
    }
    expect(TrainingLibrarySendTrainingSummary.computed.isProxy.call(ctx)).toBe(true)
  })

  it('getTotalTargetGroupsAndUsersCount returns formatted text', () => {
    const ctx = {
      formData: {
        selectedTargetGroups: [{ id: 1 }, { id: 2 }],
        userCountDetailResponse: {
          data: {
            data: [
              {
                status: 'Active',
                domainAllowList: [{ status: 'Verified', count: 5 }]
              }
            ]
          }
        }
      },
      getTotalActiveUsers: 5
    }
    const result = TrainingLibrarySendTrainingSummary.computed.getTotalTargetGroupsAndUsersCount.call(
      ctx
    )
    expect(result).toContain('5 active user(s)')
    expect(result).toContain('2 group(s)')
  })

  it('getEnrollmentLanguageItems maps languages', () => {
    const ctx = {
      formData: {
        enrollmentData: {
          languages: [
            { languageTypeName: 'English', languageTypeResourceId: 'en' }
          ]
        }
      }
    }
    const result = TrainingLibrarySendTrainingSummary.computed.getEnrollmentLanguageItems.call(ctx)
    expect(result).toEqual([{ text: 'English', value: 'en' }])
  })

  it('getCardTitle returns training name with prefix', () => {
    const title = TrainingLibrarySendTrainingSummary.computed.getCardTitle.call({
      formData: { trainingData: { name: 'Security Awareness' } }
    })
    expect(title).toBe('Training: Security Awareness')
  })

  it('getTargetGroupItems only includes active groups', () => {
    const items = TrainingLibrarySendTrainingSummary.computed.getTargetGroupItems.call({
      formData: {
        userCountDetailResponse: {
          data: {
            data: [{ status: 'Active' }, { status: 'Passive' }, { status: 'Active' }]
          }
        }
      }
    })
    expect(items).toHaveLength(2)
  })

  it('getUsersFromUnverifiedDomainsCount sums only active unverified counts', () => {
    const total =
      TrainingLibrarySendTrainingSummary.computed.getUsersFromUnverifiedDomainsCount.call({
        formData: {
          userCountDetailResponse: {
            data: {
              data: [
                {
                  status: 'Active',
                  domainAllowList: [{ status: 'Unverified', count: 3 }]
                },
                {
                  status: 'Passive',
                  domainAllowList: [{ status: 'Unverified', count: 20 }]
                },
                {
                  status: 'Active',
                  domainAllowList: [{ status: 'Unverified', count: 2 }]
                }
              ]
            }
          }
        }
      })

    expect(total).toBe(5)
  })

  it('getTotalActiveUsers sums only active verified counts', () => {
    const total = TrainingLibrarySendTrainingSummary.computed.getTotalActiveUsers.call({
      formData: {
        userCountDetailResponse: {
          data: {
            data: [
              { status: 'Active', domainAllowList: [{ status: 'Verified', count: 4 }] },
              { status: 'Passive', domainAllowList: [{ status: 'Verified', count: 40 }] },
              { status: 'Active', domainAllowList: [{ status: 'Verified', count: 6 }] }
            ]
          }
        }
      }
    })

    expect(total).toBe(10)
  })

  it('canRenderAlertbox is true only when unverified users exist and not vishing', () => {
    const canRender = TrainingLibrarySendTrainingSummary.computed.canRenderAlertbox.call({
      getUsersFromUnverifiedDomainsCount: 1,
      isVishing: false
    })
    const cannotRender = TrainingLibrarySendTrainingSummary.computed.canRenderAlertbox.call({
      getUsersFromUnverifiedDomainsCount: 0,
      isVishing: false
    })

    expect(canRender).toBe(true)
    expect(cannotRender).toBe(false)
  })

  it('template language labels adapt singular/plural counts', () => {
    const enrollmentOne =
      TrainingLibrarySendTrainingSummary.computed.enrollmentTemplateLanguageLabel.call({
        formData: { enrollmentData: { languages: [{}] } }
      })
    const reminderMany =
      TrainingLibrarySendTrainingSummary.computed.reminderTemplateLanguageLabel.call({
        formData: { reminderData: { languages: [{}, {}] } }
      })
    const certificateNone =
      TrainingLibrarySendTrainingSummary.computed.certificateTemplateLanguageLabel.call({
        formData: { certificateData: { languages: [] } }
      })

    expect(enrollmentOne).toBe('Template Language (1)')
    expect(reminderMany).toBe('Template Languages (2)')
    expect(certificateNone).toBe('Template Language (0)')
  })

  it('certificate/reminder/enrollment item getters return [] when language arrays missing', () => {
    const ctx = { formData: {} }
    expect(TrainingLibrarySendTrainingSummary.computed.getEnrollmentLanguageItems.call(ctx)).toEqual(
      []
    )
    expect(TrainingLibrarySendTrainingSummary.computed.getCertificateLanguageItems.call(ctx)).toEqual(
      []
    )
    expect(TrainingLibrarySendTrainingSummary.computed.getReminderLanguageItems.call(ctx)).toEqual(
      []
    )
  })

  it('phone number helpers format/country with fallbacks', () => {
    const createPhoneNumberObj = jest.fn(() => ({
      g: { number: { international: '+1 555-123-4567' } },
      getRegionCode: () => 'US'
    }))
    const ctx = { createPhoneNumberObj }

    const formatted = TrainingLibrarySendTrainingSummary.methods.getPhoneNumberFormatted.call(
      ctx,
      '+15551234567'
    )
    const country = TrainingLibrarySendTrainingSummary.methods.getPhoneNumberCountry.call(
      ctx,
      '+15551234567'
    )
    const emptyCountry = TrainingLibrarySendTrainingSummary.methods.getPhoneNumberCountry.call(
      ctx,
      ''
    )

    expect(formatted).toBe('+1 555-123-4567')
    expect(typeof country).toBe('string')
    expect(emptyCountry).toBe('')
  })

  it('language change handlers update selected language and template when match exists', () => {
    const ctx = {
      formData: {
        enrollmentData: {
          languages: [{ languageTypeResourceId: 'en', languageTypeName: 'English', template: 'T1' }]
        },
        certificateData: {
          languages: [{ languageTypeResourceId: 'tr', languageTypeName: 'Turkish', template: 'T2' }]
        },
        reminderData: {
          languages: [{ languageTypeResourceId: 'de', languageTypeName: 'German', template: 'T3' }]
        }
      }
    }

    TrainingLibrarySendTrainingSummary.methods.handleEnrollmentLanguageChange.call(ctx, 'en')
    TrainingLibrarySendTrainingSummary.methods.handleCertificateLanguageChange.call(ctx, 'tr')
    TrainingLibrarySendTrainingSummary.methods.handleReminderLanguageChange.call(ctx, 'de')

    expect(ctx.formData.enrollmentData.selectedLanguageName).toBe('English')
    expect(ctx.formData.enrollmentData.template).toBe('T1')
    expect(ctx.formData.certificateData.selectedLanguageName).toBe('Turkish')
    expect(ctx.formData.certificateData.template).toBe('T2')
    expect(ctx.formData.reminderData.selectedLanguageName).toBe('German')
    expect(ctx.formData.reminderData.template).toBe('T3')
  })

  it('language change handlers keep template/name unchanged when no language match', () => {
    const ctx = {
      formData: {
        enrollmentData: { languages: [], template: 'old1', selectedLanguageName: 'old1' },
        certificateData: { languages: [], template: 'old2', selectedLanguageName: 'old2' },
        reminderData: { languages: [], template: 'old3', selectedLanguageName: 'old3' }
      }
    }

    TrainingLibrarySendTrainingSummary.methods.handleEnrollmentLanguageChange.call(ctx, 'x')
    TrainingLibrarySendTrainingSummary.methods.handleCertificateLanguageChange.call(ctx, 'x')
    TrainingLibrarySendTrainingSummary.methods.handleReminderLanguageChange.call(ctx, 'x')

    expect(ctx.formData.enrollmentData.template).toBe('old1')
    expect(ctx.formData.certificateData.template).toBe('old2')
    expect(ctx.formData.reminderData.template).toBe('old3')
  })

  it('isShowTrainingEmail watcher opens preview dialog and resets flag', () => {
    const setTrainingPreviewDialog = jest.fn()
    const ctx = {
      selectedRow: { trainingId: 't1' },
      isShowTrainingEmail: true,
      setTrainingPreviewDialog
    }

    TrainingLibrarySendTrainingSummary.watch.isShowTrainingEmail.call(ctx, true)

    expect(setTrainingPreviewDialog).toHaveBeenCalledWith({
      status: true,
      selectedRow: { trainingId: 't1' },
      showSendButton: false,
      onlyPreview: true
    })
    expect(ctx.isShowTrainingEmail).toBe(false)
  })
})
