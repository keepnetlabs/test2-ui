import CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.vue'

describe('CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.vue', () => {
  it('has expected component name from source', () => {
    expect(CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.name).toBe(
      'CampaignManagerPhishingScenariosPreviewDialog'
    )
  })

  it('isMultiple checks selected training languages excluding All', () => {
    expect(
      CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.computed.isMultiple.call({
        trainingLanguageIds: ['All', 'en', 'tr']
      })
    ).toBe(true)
    expect(
      CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.computed.isMultiple.call({
        trainingLanguageIds: ['All', 'en']
      })
    ).toBe(false)
  })

  it('getButtons filters language list by selected ids', () => {
    const buttons =
      CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.computed.getButtons.call({
        languages: [
          { id: 'en', nativeLanguageName: 'English', name: 'English' },
          { id: 'tr', nativeLanguageName: 'Turkish', name: 'Turkish' }
        ],
        trainingLanguageIds: ['tr']
      })
    expect(buttons).toEqual([{ text: 'Turkish', language: 'Turkish' }])
  })

  it('message getters use defaults when redirect page fields are empty', () => {
    const ctx = { trainingRedirectPage: {} }
    expect(
      CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.computed.getInformationMessage.call(
        ctx
      )
    ).toContain('failed the phishing simulation')
    expect(
      CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.computed.getRedirectMessage.call(
        ctx
      )
    ).toContain('Please start the training')
    expect(
      CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.computed.getStartButtonLabel.call(
        ctx
      )
    ).toBe('Start Training')
  })

  it('handleClose emits on-close false', () => {
    const $emit = jest.fn()
    CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.methods.handleClose.call({
      $emit
    })
    expect($emit).toHaveBeenCalledWith('on-close', false)
  })
})
