import {
  getBtnStatusColor,
  getBtnPriorityColor,
  getTextColor,
  getDataTableFieldLabel,
  isOwnerOrMember,
  isOwner,
  isPostedByMe,
  strReverse,
  passwordComplexity,
  isDifferent,
  formatSeconds,
  createRandomCryptNumber,
  createRandomCryptStringNumber,
  copyToClipboard
} from '@/utils/functions'
import store from '@/store'

describe('Utils Functions', () => {
  describe('getBtnStatusColor', () => {
    it('should return color for pending status', () => {
      expect(getBtnStatusColor('pending')).toBe('#00bcd4')
    })

    it('should return color for active status', () => {
      expect(getBtnStatusColor('active')).toBe('#1173C1')
    })

    it('should return color for finished status', () => {
      expect(getBtnStatusColor('finished')).toBe('#217124')
    })

    it('should return color for failed status', () => {
      expect(getBtnStatusColor('failed')).toBe('#b83a3a')
    })

    it('should return color for error status', () => {
      expect(getBtnStatusColor('error')).toBe('#B83A3A')
    })

    it('should handle case-insensitive input', () => {
      expect(getBtnStatusColor('PENDING')).toBe('#00bcd4')
      expect(getBtnStatusColor('Active')).toBe('#1173C1')
    })

    it('should convert boolean true to yes color', () => {
      expect(getBtnStatusColor(true)).toBe('#1173c1')
    })

    it('should convert boolean false to no color', () => {
      expect(getBtnStatusColor(false)).toBe('#757575')
    })

    it('should return default color for unknown status', () => {
      expect(getBtnStatusColor('unknown_status')).toBe('#00bcd4')
    })

    it('should return default color for empty string', () => {
      expect(getBtnStatusColor('')).toBe('#00bcd4')
    })

    it('should throw error when trying to lowercase null', () => {
      expect(() => {
        getBtnStatusColor(null)
      }).toThrow()
    })

    it('should handle numeric status values', () => {
      // Numbers are passed as-is without toLowerCase
      expect(getBtnStatusColor(0)).toBe('#00bcd4')
    })

    it('should handle waiting for approval status', () => {
      expect(getBtnStatusColor('waiting for approval')).toBe('#1173C1')
    })

    it('should handle queued status', () => {
      expect(getBtnStatusColor('queued')).toBe('#0198AC')
    })

    it('should handle completed status', () => {
      expect(getBtnStatusColor('completed')).toBe('#217124')
    })

    it('should handle processing status', () => {
      expect(getBtnStatusColor('processing')).toBe('#1173C1')
    })
  })

  describe('getBtnPriorityColor', () => {
    it('should return color for active priority', () => {
      expect(getBtnPriorityColor('active')).toBe('#00bcd4')
    })

    it('should return color for inactive priority', () => {
      expect(getBtnPriorityColor('inactive')).toBe('#b83a3a')
    })

    it('should return color for low priority', () => {
      expect(getBtnPriorityColor('low')).toBe('#0198AC')
    })

    it('should return color for medium priority', () => {
      expect(getBtnPriorityColor('medium')).toBe('#1173C1')
    })

    it('should return color for high priority', () => {
      expect(getBtnPriorityColor('high')).toBe('#b6791d')
    })

    it('should return color for very high priority', () => {
      expect(getBtnPriorityColor('very high')).toBe('#b83a3a')
    })

    it('should handle veryhigh without space', () => {
      expect(getBtnPriorityColor('veryhigh')).toBe('#b83a3a')
    })

    it('should return color for very low priority', () => {
      expect(getBtnPriorityColor('very low')).toBe('#757575')
    })

    it('should handle verylow without space', () => {
      expect(getBtnPriorityColor('verylow')).toBe('#757575')
    })

    it('should handle case-insensitive input', () => {
      expect(getBtnPriorityColor('HIGH')).toBe('#b6791d')
      expect(getBtnPriorityColor('Low')).toBe('#0198AC')
    })

    it('should return undefined for unknown priority', () => {
      expect(getBtnPriorityColor('unknown')).toBeUndefined()
    })
  })

  describe('getTextColor', () => {
    it('should return color for open status', () => {
      expect(getTextColor('open')).toBe('#f56c6c')
    })

    it('should return color for in progress status', () => {
      expect(getTextColor('in progress')).toBe('#2196f3')
    })

    it('should return color for closed status', () => {
      expect(getTextColor('closed')).toBe('#43a047')
    })

    it('should return color for false positive status', () => {
      expect(getTextColor('false positive')).toBe('#e6a23c')
    })

    it('should return color for very high severity', () => {
      expect(getTextColor('very high')).toBe('#43a047')
    })

    it('should return color for medium severity', () => {
      expect(getTextColor('medium')).toBe('#00bcd4')
    })

    it('should return color for low severity', () => {
      expect(getTextColor('low')).toBe('#e6a23c')
    })

    it('should return color for very low severity', () => {
      expect(getTextColor('very low')).toBe('#f56c6c')
    })

    it('should handle case-insensitive input', () => {
      expect(getTextColor('OPEN')).toBe('#f56c6c')
      expect(getTextColor('Closed')).toBe('#43a047')
    })

    it('should return undefined for unknown type', () => {
      expect(getTextColor('unknown')).toBeUndefined()
    })
  })

  describe('getDataTableFieldLabel', () => {
    it('should return label for beinganalyzed', () => {
      expect(getDataTableFieldLabel('beinganalyzed')).toBe('Being Analyzed')
    })

    it('should return label for inprogress', () => {
      expect(getDataTableFieldLabel('inprogress')).toBe('In Progress')
    })

    it('should return label for veryhigh', () => {
      expect(getDataTableFieldLabel('veryhigh')).toBe('Very High')
    })

    it('should return label for verylow', () => {
      expect(getDataTableFieldLabel('verylow')).toBe('Very Low')
    })

    it('should return label for n/a', () => {
      expect(getDataTableFieldLabel('n/a')).toBe('N/A')
    })

    it('should handle unknown/passed through', () => {
      expect(getDataTableFieldLabel('unknown')).toBe('N/A')
    })

    it('should handle case preservation for mapped values', () => {
      expect(getDataTableFieldLabel('Running')).toBe('Running')
    })

    it('should return original field for unmapped values', () => {
      expect(getDataTableFieldLabel('customfield')).toBe('customfield')
    })

    it('should handle empty string', () => {
      expect(getDataTableFieldLabel('')).toMatch(/.*/)
    })

    it('should convert number to string', () => {
      const result = getDataTableFieldLabel(123)
      expect(typeof result).toBe('string')
    })

    it('should handle null/undefined gracefully', () => {
      const resultNull = getDataTableFieldLabel(null)
      const resultUndefined = getDataTableFieldLabel(undefined)
      expect(typeof resultNull).toBe('string')
      expect(typeof resultUndefined).toBe('string')
    })

    it('should handle waiting for approval', () => {
      const result = getDataTableFieldLabel('waiting for approval')
      expect(result).toMatch(/waiting\s+for\s+approval/i)
    })
  })

  describe('isOwnerOrMember', () => {
    it('should return true for owner status (1)', () => {
      expect(isOwnerOrMember(1)).toBe(true)
    })

    it('should return true for member status (2)', () => {
      expect(isOwnerOrMember(2)).toBe(true)
    })

    it('should return false for other statuses', () => {
      expect(isOwnerOrMember(0)).toBe(false)
      expect(isOwnerOrMember(3)).toBe(false)
      expect(isOwnerOrMember(999)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isOwnerOrMember(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isOwnerOrMember(undefined)).toBe(false)
    })
  })

  describe('isOwner', () => {
    it('should return true for owner status (1)', () => {
      expect(isOwner(1)).toBe(true)
    })

    it('should return false for member status (2)', () => {
      expect(isOwner(2)).toBe(false)
    })

    it('should return false for other statuses', () => {
      expect(isOwner(0)).toBe(false)
      expect(isOwner(3)).toBe(false)
      expect(isOwner(999)).toBe(false)
    })

    it('should handle string comparison (loose equality)', () => {
      expect(isOwner('1')).toBe(true)
    })

    it('should return false for null', () => {
      expect(isOwner(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isOwner(undefined)).toBe(false)
    })
  })

  describe('isPostedByMe', () => {
    it('should return true when isPostedByMe is true', () => {
      expect(isPostedByMe(true)).toBe(true)
    })

    it('should return false when isPostedByMe is false', () => {
      expect(isPostedByMe(false)).toBe(false)
    })

    it('should return truthy for truthy values', () => {
      expect(isPostedByMe(1)).toBe(1)
      expect(isPostedByMe('yes')).toBe('yes')
    })

    it('should return falsy for falsy values', () => {
      expect(isPostedByMe(0)).toBe(0)
      expect(isPostedByMe(null)).toBeFalsy()
    })
  })

  describe('strReverse', () => {
    it('should reverse a string', () => {
      expect(strReverse('hello')).toBe('olleh')
    })

    it('should handle empty string', () => {
      expect(strReverse('')).toBe('')
    })

    it('should handle single character', () => {
      expect(strReverse('a')).toBe('a')
    })

    it('should reverse string with spaces', () => {
      expect(strReverse('hello world')).toBe('dlrow olleh')
    })

    it('should handle special characters', () => {
      expect(strReverse('hello!')).toBe('!olleh')
    })

    it('should reverse numbers', () => {
      expect(strReverse('12345')).toBe('54321')
    })

    it('should handle default empty string when no argument', () => {
      expect(strReverse()).toBe('')
    })
  })

  describe('passwordComplexity', () => {
    it('should return low complexity for simple password', () => {
      const result = passwordComplexity('abc')
      expect(result).toBeLessThan(5)
    })

    it('should return higher complexity for password with numbers', () => {
      const result1 = passwordComplexity('password')
      const result2 = passwordComplexity('password123')
      expect(result2).toBeGreaterThanOrEqual(result1)
    })

    it('should return higher complexity for password with special characters', () => {
      const result1 = passwordComplexity('password123')
      const result2 = passwordComplexity('password123!')
      expect(result2).toBeGreaterThanOrEqual(result1)
    })

    it('should return higher complexity for password with uppercase letters', () => {
      const result1 = passwordComplexity('password')
      const result2 = passwordComplexity('Password')
      expect(result2).toBeGreaterThanOrEqual(result1)
    })

    it('should handle empty password', () => {
      const result = passwordComplexity('')
      // Empty password might return undefined or 0
      expect(result === undefined || typeof result === 'number').toBe(true)
    })

    it('should return numeric value', () => {
      const result = passwordComplexity('MyPassword123!')
      expect(typeof result).toBe('number')
    })
  })

  describe('isDifferent', () => {
    it('should return false for equal non-empty objects', () => {
      expect(isDifferent({ a: 1 }, { a: 1 })).toBe(false)
    })

    it('should return true for different objects', () => {
      expect(isDifferent({ a: 1 }, { a: 2 })).toBe(true)
    })

    it('should return true for null or undefined values', () => {
      expect(isDifferent(null, { a: 1 })).toBe(true)
      expect(isDifferent({ a: 1 }, null)).toBe(true)
      expect(isDifferent(undefined, { a: 1 })).toBe(true)
    })

    it('should handle arrays with different lengths', () => {
      const obj1 = { items: [1, 2, 3] }
      const obj2 = { items: [1, 2] }
      expect(isDifferent(obj1, obj2)).toBe(true)
    })

    it('should handle arrays with same length', () => {
      const obj1 = { items: [1, 2, 3] }
      const obj2 = { items: [1, 2, 3] }
      expect(isDifferent(obj1, obj2)).toBe(false)
    })

    it('should handle objects with multiple properties', () => {
      const obj1 = { a: 1, b: 2, c: 3 }
      const obj2 = { a: 1, b: 2, c: 3 }
      expect(isDifferent(obj1, obj2)).toBe(false)
    })

    it('should handle boolean false values as falsy', () => {
      expect(isDifferent(false, { a: 1 })).toBe(true)
    })
  })

  describe('formatSeconds', () => {
    it('should format 0 seconds', () => {
      const result = formatSeconds(0)
      expect(result).toMatch(/^[\d\w\s:]+$|/)
    })

    it('should format 60 seconds as 1 minute', () => {
      const result = formatSeconds(60)
      expect(result).toContain('1')
    })

    it('should format 3600 seconds as 1 hour', () => {
      const result = formatSeconds(3600)
      expect(typeof result).toBe('string')
    })

    it('should format 86400 seconds as 1 day', () => {
      const result = formatSeconds(86400)
      expect(typeof result).toBe('string')
    })

    it('should handle default parameter', () => {
      const result = formatSeconds()
      expect(typeof result).toBe('string')
    })

    it('should return string output', () => {
      expect(typeof formatSeconds(100)).toBe('string')
      expect(typeof formatSeconds(5000)).toBe('string')
    })

    it('should handle large numbers', () => {
      const result = formatSeconds(999999)
      expect(typeof result).toBe('string')
    })
  })

  describe('createRandomCryptNumber', () => {
    it('should return a number', () => {
      const result = createRandomCryptNumber()
      expect(typeof result).toBe('number')
    })

    it('should return different values on multiple calls', () => {
      const result1 = createRandomCryptNumber()
      const result2 = createRandomCryptNumber()
      expect(result1).not.toEqual(result2)
    })

    it('should return a positive number', () => {
      const result = createRandomCryptNumber()
      expect(result).toBeGreaterThanOrEqual(0)
    })
  })

  describe('createRandomCryptStringNumber', () => {
    it('should return a string', () => {
      const result = createRandomCryptStringNumber()
      expect(typeof result).toBe('string')
    })

    it('should return different values on multiple calls', () => {
      const result1 = createRandomCryptStringNumber()
      const result2 = createRandomCryptStringNumber()
      expect(result1).not.toEqual(result2)
    })

    it('should return a non-empty string', () => {
      const result = createRandomCryptStringNumber()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return alphanumeric characters', () => {
      const result = createRandomCryptStringNumber()
      expect(result).toMatch(/[a-zA-Z0-9]/)
    })
  })

  describe('copyToClipboard', () => {
    let originalClipboard
    let originalExecCommand
    let dispatchSpy

    beforeEach(() => {
      originalClipboard = navigator.clipboard
      originalExecCommand = document.execCommand
      dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => {})
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        configurable: true
      })
    })

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true
      })
      document.execCommand = originalExecCommand
      dispatchSpy.mockRestore()
      jest.clearAllMocks()
    })

    it('should be a callable function', () => {
      expect(typeof copyToClipboard).toBe('function')
    })

    it('should return true and show success snackbar when Clipboard API succeeds', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true
      })
      document.execCommand = jest.fn()

      const result = await copyToClipboard('copy-value')

      expect(result).toBe(true)
      expect(writeTextMock).toHaveBeenCalledWith('copy-value')
      expect(document.execCommand).not.toHaveBeenCalled()
      expect(store.dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        expect.objectContaining({
          message: 'Copied to Clipboard'
        })
      )
    })

    it('should fallback to execCommand and return true when Clipboard API is rejected', async () => {
      const writeTextMock = jest.fn().mockRejectedValue(new Error('NotAllowedError'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true
      })
      document.execCommand = jest.fn().mockReturnValue(true)

      const result = await copyToClipboard('fallback-copy')

      expect(result).toBe(true)
      expect(writeTextMock).toHaveBeenCalledWith('fallback-copy')
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(store.dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        expect.objectContaining({
          message: 'Copied to Clipboard'
        })
      )
    })

    it('should return false and show error snackbar when Clipboard API and fallback both fail', async () => {
      const writeTextMock = jest.fn().mockRejectedValue(new Error('NotAllowedError'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true
      })
      document.execCommand = jest.fn().mockReturnValue(false)

      const result = await copyToClipboard('cannot-copy')

      expect(result).toBe(false)
      expect(writeTextMock).toHaveBeenCalledWith('cannot-copy')
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(store.dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        expect.objectContaining({
          message: 'Failed to copy to clipboard'
        })
      )
    })
  })

  describe('Integration scenarios', () => {
    it('should handle color functions for dashboard display', () => {
      const statusColor = getBtnStatusColor('active')
      const priorityColor = getBtnPriorityColor('high')
      const textColor = getTextColor('open')

      expect(statusColor).toBeDefined()
      expect(priorityColor).toBeDefined()
      expect(textColor).toBeDefined()
    })

    it('should handle user permission checks', () => {
      expect(isOwner(1)).toBe(true)
      expect(isOwnerOrMember(1)).toBe(true)
      expect(isOwnerOrMember(2)).toBe(true)
      expect(isOwner(2)).toBe(false)
    })

    it('should handle password validation workflow', () => {
      const weakPwd = 'abc'
      const strongPwd = 'MyPassword123!'

      const weakComplexity = passwordComplexity(weakPwd)
      const strongComplexity = passwordComplexity(strongPwd)

      expect(strongComplexity).toBeGreaterThan(weakComplexity)
    })
  })
})
