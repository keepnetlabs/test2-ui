import {
  getStoreValue,
  PROPERTY_STORE,
  COMMON_CONSTANTS,
  COMMON_SNACKBAR,
  LABEL_STORE,
  INTEGRATION_TYPES,
  INTEGRATION_LABELS,
  TABLE_SETTINGS_KEYS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  columnStandards,
  COMMON_PROPS
} from '@/model/constants/commonConstants'
import * as Validations from '@/utils/validations'

describe('commonConstants (extra coverage)', () => {
  describe('getStoreValue', () => {
    it('handles unknown key returning undefined', () => {
      const result = getStoreValue('unknownkey')
      expect(result).toBeUndefined()
    })
    it('handles key with extra whitespace', () => {
      expect(getStoreValue('  name  ')).toBe(LABEL_STORE.NAME)
    })
    it('returns value for various PROPERTY_STORE keys', () => {
      expect(getStoreValue(PROPERTY_STORE.FIRSTNAME)).toBeDefined()
      expect(getStoreValue(PROPERTY_STORE.LASTNAME)).toBeDefined()
      expect(getStoreValue(PROPERTY_STORE.STATUS)).toBeDefined()
    })
    it('returns uppercase when type is UPPERCASE', () => {
      expect(getStoreValue('name', COMMON_CONSTANTS.UPPERCASE)).toBe('NAME')
    })
    it('returns lowercase when type is LOWERCASE', () => {
      expect(getStoreValue('email', COMMON_CONSTANTS.LOWERCASE)).toBe('email')
    })
    it('returns original label when transform type is unknown', () => {
      expect(getStoreValue('email', 'UNKNOWN_TYPE')).toBe('Email')
    })
    it('resolves uppercase key names from PROPERTY_STORE values', () => {
      expect(getStoreValue(PROPERTY_STORE.ADDINSTATUSNAME)).toBe('Add-in Status')
    })

    it('throws when unknown key is requested with casing transform', () => {
      expect(() => getStoreValue('missing_key', COMMON_CONSTANTS.UPPERCASE)).toThrow()
      expect(() => getStoreValue('missing_key', COMMON_CONSTANTS.LOWERCASE)).toThrow()
    })

    it('throws when key is not a string', () => {
      expect(() => getStoreValue(undefined)).toThrow()
      expect(() => getStoreValue(null)).toThrow()
      expect(() => getStoreValue(10)).toThrow()
    })

    it('trims key before casing transform', () => {
      expect(getStoreValue('  email  ', COMMON_CONSTANTS.UPPERCASE)).toBe('EMAIL')
      expect(getStoreValue('  NAME  ', COMMON_CONSTANTS.LOWERCASE)).toBe('name')
    })
  })

  describe('COMMON_CONSTANTS', () => {
    it('COMMON_SNACKBAR uses success color and icon defaults', () => {
      expect(COMMON_SNACKBAR.show).toBe(true)
      expect(COMMON_SNACKBAR.color).toBe(COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR)
      expect(COMMON_SNACKBAR.icon).toBe('mdi-check-circle')
    })

    it('has expected color constants', () => {
      expect(COMMON_CONSTANTS.ERRORSNACKBARCOLOR).toBe('#f56c6c')
      expect(COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR).toBe('#43a047')
      expect(COMMON_CONSTANTS.INFOSNACKBARCOLOR).toBe('#2196f3')
    })
    it('has PRIORITY_ITEMS and STATUS_ITEMS', () => {
      expect(COMMON_CONSTANTS.PRIORITY_ITEMS.length).toBeGreaterThan(0)
      expect(COMMON_CONSTANTS.STATUS_ITEMS.length).toBe(2)
    })
    it('PRIORITY_ITEMS keeps very low/high object boundaries', () => {
      expect(COMMON_CONSTANTS.PRIORITY_ITEMS[0]).toEqual({ text: 'Very Low', value: 'VeryLow' })
      expect(COMMON_CONSTANTS.PRIORITY_ITEMS[COMMON_CONSTANTS.PRIORITY_ITEMS.length - 1]).toEqual({
        text: 'Very High',
        value: 'VeryHigh'
      })
    })
    it('STATUS_ITEMS maps active/inactive to 1/0', () => {
      expect(COMMON_CONSTANTS.STATUS_ITEMS).toEqual([
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 0 }
      ])
    })
    it('DEFAULT_EMAIL_RULES are functions', () => {
      COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })
    it('DEFAULT_URL_RULES are functions', () => {
      COMMON_CONSTANTS.DEFAULT_URL_RULES.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })
    it('DEFAULT_EMAIL_RULES execute expected branches', () => {
      const [startsWithSpaceRule, emailRule, maxLengthRule, controlLengthRule] =
        COMMON_CONSTANTS.DEFAULT_EMAIL_RULES

      expect(startsWithSpaceRule(' user@example.com')).toBeTruthy()
      expect(emailRule('invalid-email')).toBeTruthy()
      expect(maxLengthRule('a'.repeat(321))).toBeTruthy()

      expect(controlLengthRule('valid@example.com')).toBe(true)
      expect(controlLengthRule(`${'a'.repeat(65)}@example.com`)).toBeTruthy()

      const emailSpy = jest.spyOn(Validations, 'email').mockReturnValueOnce(false)
      expect(controlLengthRule('force-else-branch')).toBe(false)
      emailSpy.mockRestore()
    })

    it('DEFAULT_EMAIL_RULES returns InvalidEmailAddress when controlEmailLength fails', () => {
      const controlLengthRule = COMMON_CONSTANTS.DEFAULT_EMAIL_RULES[3]
      const emailSpy = jest.spyOn(Validations, 'email').mockReturnValue(true)
      const controlSpy = jest.spyOn(Validations, 'controlEmailLength').mockReturnValue(false)

      expect(controlLengthRule('valid@example.com')).toBe('Invalid email address')

      emailSpy.mockRestore()
      controlSpy.mockRestore()
    })
    it('DEFAULT_URL_RULES execute expected branches', () => {
      const [startsWithSpaceRule, urlRule, maxLengthRule, noWhitespaceRule] =
        COMMON_CONSTANTS.DEFAULT_URL_RULES

      expect(startsWithSpaceRule(' https://example.com')).toBeTruthy()
      expect(urlRule('notaurl')).toBeTruthy()
      expect(maxLengthRule('https://example.com/' + 'a'.repeat(6000))).toBeTruthy()
      expect(noWhitespaceRule('https://exa mple.com')).toBeTruthy()
    })
    it('DEFAULT_URL_RULES return true for valid values and empty optional value', () => {
      const [startsWithSpaceRule, urlRule, maxLengthRule, noWhitespaceRule] =
        COMMON_CONSTANTS.DEFAULT_URL_RULES

      expect(startsWithSpaceRule('https://example.com')).toBe(true)
      expect(urlRule('https://example.com')).toBe(true)
      expect(urlRule('')).toBe(true)
      expect(maxLengthRule('https://example.com')).toBe(true)
      expect(noWhitespaceRule('https://example.com/path')).toBe(true)
    })
    it('DEFAULT_EMAIL_RULES return true for valid simple email and empty optional value', () => {
      const [startsWithSpaceRule, emailRule, maxLengthRule, controlLengthRule] =
        COMMON_CONSTANTS.DEFAULT_EMAIL_RULES

      expect(startsWithSpaceRule('user@example.com')).toBe(true)
      expect(emailRule('user@example.com')).toBe(true)
      expect(emailRule('')).toBe(true)
      expect(maxLengthRule('user@example.com')).toBe(true)
      expect(controlLengthRule('')).toBe(true)
    })
    it('OPERATION_ITEMS has Create, Update, Delete', () => {
      const items = COMMON_CONSTANTS.OPERATION_ITEMS
      const values = items.map((o) => (typeof o === 'object' ? o.value : o))
      expect(values).toContain(0)
      expect(values).toContain(1)
      expect(values).toContain(2)
    })
    it('CAMPAIGN_MANAGER_STATUS_ITEMS keeps expected order and size', () => {
      expect(COMMON_CONSTANTS.CAMPAIGN_MANAGER_STATUS_ITEMS).toEqual([
        'Completed',
        'Running',
        'Idle',
        'Paused',
        'Cancelled'
      ])
    })
    it('FILTER_OPTIONS has exactly three known options', () => {
      expect(COMMON_CONSTANTS.FILTER_OPTIONS).toEqual([
        'Set as default filter',
        'Restore default filter',
        'Clear filters'
      ])
    })
  })

  describe('columnStandards', () => {
    it('has property and width for each column', () => {
      columnStandards.forEach((col) => {
        expect(col).toHaveProperty('property')
        expect(col).toHaveProperty('width')
      })
    })
    it('includes common columns', () => {
      const properties = columnStandards.map((c) => c.property)
      expect(properties).toContain('firstName')
      expect(properties).toContain('email')
    })
  })

  describe('INTEGRATION_TYPES', () => {
    it('has expected integration keys', () => {
      expect(INTEGRATION_TYPES.ANYRUN).toBe('AnyRun')
      expect(INTEGRATION_TYPES.VIRUSTOTAL).toBe('VirusTotal')
    })
    it('includes modern integration vendors', () => {
      expect(INTEGRATION_TYPES.OPSWAT).toBe('OPSWAT')
      expect(INTEGRATION_TYPES.GOOGLEWEBRISK).toBe('Google Web Risk')
      expect(INTEGRATION_TYPES.CyberXRay).toBe('Cyber X-Ray')
    })
    it('keeps label map variants including intentionally formatted values', () => {
      expect(INTEGRATION_LABELS.SPAMHOUSE).toBe('SPAMHOUSE')
      expect(INTEGRATION_LABELS.GOOGLESAFEBROWSER.trim()).toBe('Google Safe Browser')
    })
  })

  describe('COMMON_PROPS', () => {
    it('AVAILABLEFOR has expected structure', () => {
      expect(COMMON_PROPS.AVAILABLEFOR).toHaveProperty('placeholder')
      expect(COMMON_PROPS.AVAILABLEFOR).toHaveProperty('valueFormat')
    })
    it('AVAILABLEFOR keeps expected defaults for tree selector behavior', () => {
      expect(COMMON_PROPS.AVAILABLEFOR.multiple).toBe(true)
      expect(COMMON_PROPS.AVAILABLEFOR.searchNested).toBe(true)
      expect(COMMON_PROPS.AVAILABLEFOR.clearOnSelect).toBe(true)
    })
  })

  describe('training report settings keys', () => {
    it('TABLE_SETTINGS_KEYS and DEFAULT_SEARCH_CONTAINER_KEYS contain training report table keys', () => {
      expect(TABLE_SETTINGS_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE).toContain('TrainingReport')
      expect(TABLE_SETTINGS_KEYS.TRAINING_REPORT_ENROLLMENT_EMAILS_TABLE).toContain('Enrollment')
      expect(TABLE_SETTINGS_KEYS.TRAINING_REPORT_REMINDER_EMAILS_TABLE).toContain('Reminder')
      expect(TABLE_SETTINGS_KEYS.TRAINING_REPORT_CERTIFICATE_EMAILS_TABLE).toContain('Certificate')
      expect(TABLE_SETTINGS_KEYS.TRAINING_REPORT_MICROSOFT_TEAMS_TABLE).toContain(
        'MicrosoftTeams'
      )

      expect(DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE).toContain(
        'TrainingReport'
      )
      expect(DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_ENROLLMENT_EMAILS_TABLE).toContain(
        'Enrollment'
      )
      expect(DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_REMINDER_EMAILS_TABLE).toContain(
        'Reminder'
      )
      expect(DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_CERTIFICATE_EMAILS_TABLE).toContain(
        'Certificate'
      )
      expect(DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_MICROSOFT_TEAMS_TABLE).toContain(
        'MicrosoftTeams'
      )
    })
  })
})
