import labels from '@/model/constants/labels'

describe('model/constants/labels (extra coverage)', () => {
  describe('getMaxLengthMessage', () => {
    it('uses default val and length when not provided', () => {
      expect(labels.getMaxLengthMessage()).toBe(' cannot exceed 64 characters')
    })

    it('uses custom val and default length', () => {
      expect(labels.getMaxLengthMessage('Name')).toBe('Name cannot exceed 64 characters')
    })

    it('uses custom val and length', () => {
      expect(labels.getMaxLengthMessage('Email', 320)).toBe('Email cannot exceed 320 characters')
    })
  })

  describe('getMinLengthMessage', () => {
    it('uses default val and length when not provided', () => {
      expect(labels.getMinLengthMessage()).toBe(' must have at least 3 characters')
    })

    it('uses custom val and default length', () => {
      expect(labels.getMinLengthMessage('Password')).toBe('Password must have at least 3 characters')
    })

    it('uses custom val and length', () => {
      expect(labels.getMinLengthMessage('Code', 6)).toBe('Code must have at least 6 characters')
    })
  })

  describe('label constants', () => {
    it('has InvalidDomain', () => {
      expect(labels.InvalidDomain).toBe('Invalid domain')
    })

    it('has common UI labels', () => {
      expect(labels.Active).toBeDefined()
      expect(labels.Inactive).toBeDefined()
    })

    it('has FrequencyType label', () => {
      expect(labels.FrequencyType).toBe('Frequency Type:')
    })

    it('contains sending report related labels', () => {
      expect(labels.TrainingReport).toBe('Training Report')
      expect(labels.TrainingReports).toBe('Training Reports')
      expect(labels.ResendTheCertificate).toContain('Certificate')
      expect(labels.ResendSurvey).toContain('Survey')
      expect(labels.ResendTraining).toContain('Training')
      expect(labels.Certificate).toBe('Certificate')
      expect(labels.Survey).toBe('Survey')
      expect(labels.Training).toBe('Training')
    })

    it('contains campaign status labels', () => {
      expect(labels.Start).toBe('Start')
      expect(labels.Stop).toBe('Stop')
      expect(labels.Paused).toBe('Paused')
      expect(labels.Cancelled).toBe('Cancelled')
      expect(labels.Completed).toBe('Completed')
      expect(labels.Running).toBe('Running')
      expect(labels.Idle).toBe('Idle')
    })

    it('contains common action labels', () => {
      expect(labels.Save).toBe('SAVE')
      expect(labels.Delete).toBe('Delete')
      expect(labels.Edit).toBe('Edit')
      expect(labels.Preview).toBe('Preview')
      expect(labels.Details).toBe('Details')
      expect(labels.Back).toBe('BACK')
      expect(labels.Next).toBe('NEXT')
      expect(labels.Prev).toBe('PREV')
    })
  })

  it('max/min helper methods support numeric and empty values', () => {
    expect(labels.getMaxLengthMessage('Field', 0)).toBe('Field cannot exceed 0 characters')
    expect(labels.getMinLengthMessage('Field', 0)).toBe('Field must have at least 0 characters')
    expect(labels.getMaxLengthMessage('', 10)).toBe(' cannot exceed 10 characters')
    expect(labels.getMinLengthMessage('', 2)).toBe(' must have at least 2 characters')
  })

  it('max/min helper methods support null labels and decimal lengths', () => {
    expect(labels.getMaxLengthMessage(null, 2.5)).toBe('null cannot exceed 2.5 characters')
    expect(labels.getMinLengthMessage(null, 1.5)).toBe('null must have at least 1.5 characters')
  })

  it('contains both Inactive alias keys used in codebase', () => {
    expect(labels.Inactive).toBe('Inactive')
    expect(labels.InActive).toBe('Inactive')
  })

  it('contains static validation/error labels used by helpers', () => {
    expect(labels.InvalidEmailAddress).toBe('Invalid email address')
    expect(labels.InvalidURL).toBe('Invalid URL')
    expect(labels.CannotStartWithSpace).toBe('Cannot start with space')
    expect(labels.MustStartWithHttpOrHttps).toContain('http://')
  })

  it('contains download and preview labels used by training library cards', () => {
    expect(labels.DownloadPoster).toBe('Download Poster')
    expect(labels.DownloadInfographic).toBe('Download Infographic')
    expect(labels.DownloadScreensaver).toBe('Download Screensaver')
    expect(labels.PosterPreview).toBe('Poster Preview')
    expect(labels.InfographicPreview).toBe('Infographic Preview')
    expect(labels.ScreensaverPreview).toBe('Screensaver Preview')
  })
})
