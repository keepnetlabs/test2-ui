import {
  getStoreValue,
  PROPERTY_STORE,
  COMMON_CONSTANTS,
  LABEL_STORE,
  INTEGRATION_TYPES,
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
  })

  describe('COMMON_CONSTANTS', () => {
    it('has expected color constants', () => {
      expect(COMMON_CONSTANTS.ERRORSNACKBARCOLOR).toBe('#f56c6c')
      expect(COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR).toBe('#43a047')
      expect(COMMON_CONSTANTS.INFOSNACKBARCOLOR).toBe('#2196f3')
    })
    it('has PRIORITY_ITEMS and STATUS_ITEMS', () => {
      expect(COMMON_CONSTANTS.PRIORITY_ITEMS.length).toBeGreaterThan(0)
      expect(COMMON_CONSTANTS.STATUS_ITEMS.length).toBe(2)
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
    it('DEFAULT_URL_RULES execute expected branches', () => {
      const [startsWithSpaceRule, urlRule, maxLengthRule, noWhitespaceRule] =
        COMMON_CONSTANTS.DEFAULT_URL_RULES

      expect(startsWithSpaceRule(' https://example.com')).toBeTruthy()
      expect(urlRule('notaurl')).toBeTruthy()
      expect(maxLengthRule('https://example.com/' + 'a'.repeat(6000))).toBeTruthy()
      expect(noWhitespaceRule('https://exa mple.com')).toBeTruthy()
    })
    it('OPERATION_ITEMS has Create, Update, Delete', () => {
      const items = COMMON_CONSTANTS.OPERATION_ITEMS
      const values = items.map((o) => (typeof o === 'object' ? o.value : o))
      expect(values).toContain(0)
      expect(values).toContain(1)
      expect(values).toContain(2)
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
  })

  describe('COMMON_PROPS', () => {
    it('AVAILABLEFOR has expected structure', () => {
      expect(COMMON_PROPS.AVAILABLEFOR).toHaveProperty('placeholder')
      expect(COMMON_PROPS.AVAILABLEFOR).toHaveProperty('valueFormat')
    })
  })
})
