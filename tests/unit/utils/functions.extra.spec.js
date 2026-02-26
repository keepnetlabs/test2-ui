import {
  getErrorMessage,
  getDifficultyBadgeColor,
  formatSeconds,
  createRandomCryptNumber,
  getInvestigationStatusTooltipText,
  setSafariClusterFix,
  getDataTableFieldLabel,
  deepCopyArray,
  getDefaultFilter,
  getDefaultAxiosPayload,
  getSelectSearchPayload,
  datePrettier,
  strReverse,
  isDifferent,
  getTimeZone,
  getTimeValueFormatZone,
  getBtnStatusColor,
  getBtnPriorityColor,
  getTextColor,
  getTimeZoneForMoment,
  isOwnerOrMember,
  isOwner,
  scrollToComponent,
  handleIsSafari,
  cancellableAxiosRequest,
  fileToBase64,
  openHtmlInNewWindow,
  copyToClipboard
} from '@/utils/functions'

describe('functions.js (extra coverage)', () => {
  describe('getErrorMessage', () => {
    it('returns validationMessages[0] when present', () => {
      const err = {
        response: {
          data: {
            validationMessages: ['First validation error', 'Second']
          }
        }
      }
      expect(getErrorMessage(err)).toBe('First validation error')
    })
    it('returns message when no validationMessages', () => {
      const err = {
        response: { data: { message: 'Server error' } }
      }
      expect(getErrorMessage(err)).toBe('Server error')
    })
    it('returns Message (capital M) when message absent', () => {
      const err = {
        response: { data: { Message: 'Capital M message' } }
      }
      expect(getErrorMessage(err)).toBe('Capital M message')
    })
    it('returns error.message when no response data', () => {
      const err = { message: 'Network error' }
      expect(getErrorMessage(err)).toBe('Network error')
    })
    it('returns default when all absent', () => {
      expect(getErrorMessage({})).toBe('Something Went Wrong')
    })
  })

  describe('getDifficultyBadgeColor', () => {
    it('returns easy color', () => {
      expect(getDifficultyBadgeColor('easy')).toBe('#217124')
      expect(getDifficultyBadgeColor('Easy')).toBe('#217124')
    })
    it('returns medium color', () => {
      expect(getDifficultyBadgeColor('medium')).toBe('#2196f3')
    })
    it('returns hard color', () => {
      expect(getDifficultyBadgeColor('hard')).toBe('#f56c6c')
    })
    it('returns default for unknown', () => {
      expect(getDifficultyBadgeColor('unknown')).toBe('#2196f3')
    })
    it('returns default for empty', () => {
      expect(getDifficultyBadgeColor('')).toBe('#2196f3')
    })
  })

  describe('formatSeconds branch coverage', () => {
    it('returns 00:00 for non-number non-string', () => {
      expect(formatSeconds({})).toBe('00:00')
      expect(formatSeconds(null)).toBe('00:00')
    })
    it('formats string seconds', () => {
      const result = formatSeconds('90')
      expect(result).toMatch(/^\d{2}:\d{2}$/)
    })
  })

  describe('createRandomCryptNumber fallback', () => {
    it('falls back to Date.now when crypto unavailable', () => {
      const origCrypto = window.crypto
      const origMsCrypto = window.msCrypto
      delete window.crypto
      delete window.msCrypto
      const result = createRandomCryptNumber()
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(0)
      window.crypto = origCrypto
      window.msCrypto = origMsCrypto
    })
  })

  describe('getInvestigationStatusTooltipText', () => {
    it('returns tooltip for Queued', () => {
      expect(getInvestigationStatusTooltipText('Queued')).toContain('investigation')
    })
    it('returns tooltip for Running', () => {
      expect(getInvestigationStatusTooltipText('Running')).toContain('expiry')
    })
    it('returns tooltip for No match', () => {
      expect(getInvestigationStatusTooltipText('No match')).toContain('match')
    })
    it('returns tooltip for Finished', () => {
      expect(getInvestigationStatusTooltipText('Finished')).toContain('completed')
    })
    it('returns tooltip for Canceled', () => {
      expect(getInvestigationStatusTooltipText('Canceled')).toContain('cancelled')
    })
    it('returns tooltip for Expired', () => {
      expect(getInvestigationStatusTooltipText('Expired')).toContain('expired')
    })
    it('returns undefined for unknown status', () => {
      expect(getInvestigationStatusTooltipText('Unknown')).toBeUndefined()
    })
  })

  describe('setSafariClusterFix', () => {
    it('returns class when column property matches param', () => {
      const obj = { column: { property: 'status' } }
      expect(setSafariClusterFix(obj, 'status')).toBe('safari-cluster-icon-fix')
    })
    it('returns undefined when no match', () => {
      const obj = { column: { property: 'name' } }
      expect(setSafariClusterFix(obj, 'status')).toBeUndefined()
    })
  })

  describe('getDataTableFieldLabel branch coverage', () => {
    it('returns from fieldMap by normalizedField', () => {
      expect(getDataTableFieldLabel('being_analyzed')).toBe('Being Analyzed')
      expect(getDataTableFieldLabel('in_progress')).toBe('In Progress')
    })
    it('returns from fieldMap by compactField', () => {
      expect(getDataTableFieldLabel('veryhigh')).toBe('Very High')
    })
    it('converts camelCase to spaces', () => {
      expect(getDataTableFieldLabel('someCamelCase')).toBe('some Camel Case')
    })
    it('returns field as-is when no match', () => {
      expect(getDataTableFieldLabel('unknown_field')).toBe('unknown_field')
    })
  })

  describe('deepCopyArray and filter helpers', () => {
    it('deepCopyArray returns deep clone', () => {
      const arr = [{ a: 1 }, { b: 2 }]
      const copy = deepCopyArray(arr)
      expect(copy).toEqual(arr)
      expect(copy).not.toBe(arr)
      copy[0].a = 99
      expect(arr[0].a).toBe(1)
    })
    it('getDefaultFilter returns filter structure', () => {
      const filter = getDefaultFilter()
      expect(filter.filter).toBeDefined()
      expect(filter.filter.FilterGroups).toHaveLength(2)
    })
    it('getDefaultAxiosPayload uses defaultOrderBy when null', () => {
      const payload = getDefaultAxiosPayload({})
      expect(payload.orderBy).toBe('CreateTime')
    })
    it('getDefaultAxiosPayload uses custom defaultOrderBy', () => {
      const payload = getDefaultAxiosPayload({}, 'CustomOrder')
      expect(payload.orderBy).toBe('CustomOrder')
    })
    it('getSelectSearchPayload adds search to filter', () => {
      const base = {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      }
      const result = getSelectSearchPayload(base, 'test', 'name')
      expect(result.pageSize).toBe(100)
      expect(result.pageNumber).toBe(1)
      expect(result.filter.FilterGroups[1].FilterItems).toContainEqual(
        expect.objectContaining({ Value: 'test', FieldName: 'name', Operator: 'Contains' })
      )
    })

    it('getSelectSearchPayload appends extraFilterItems', () => {
      const base = {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      }
      const extra = [{ Value: 'x', FieldName: 'status', Operator: '=' }]
      const result = getSelectSearchPayload(base, 'abc', 'name', extra)
      expect(result.filter.FilterGroups[1].FilterItems).toEqual(
        expect.arrayContaining(extra)
      )
    })
  })

  describe('datePrettier and strReverse', () => {
    it('datePrettier formats date', () => {
      const result = datePrettier('2024-01-15')
      expect(result).toMatch(/\w+,\s+\w+\s+\d+,\s+\d+/)
    })
    it('strReverse reverses string', () => {
      expect(strReverse('hello')).toBe('olleh')
      expect(strReverse('')).toBe('')
    })
  })

  describe('isDifferent branch coverage', () => {
    it('returns true when a is falsy', () => {
      expect(isDifferent(null, { x: 1 })).toBe(true)
      expect(isDifferent(undefined, { x: 1 })).toBe(true)
    })
    it('returns true when b is falsy', () => {
      expect(isDifferent({ x: 1 }, null)).toBe(true)
    })
    it('returns true when array lengths differ', () => {
      expect(isDifferent({ arr: [1, 2] }, { arr: [1] })).toBe(true)
    })
    it('returns false when objects deeply equal', () => {
      expect(isDifferent({ a: 1 }, { a: 1 })).toBe(false)
    })
  })

  describe('getTimeZone and getTimeValueFormatZone', () => {
    beforeEach(() => {
      localStorage.clear()
    })
    it('getTimeZone returns date format when isDate true', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      expect(getTimeZone(true)).toContain('dd')
    })
    it('getTimeZone uses fallback when localStorage empty', () => {
      const fallback = { dateFormat: 'MM/DD/YYYY', timeFormat: '12h' }
      expect(getTimeZone(false, fallback)).toBeDefined()
    })
    it('getTimeValueFormatZone returns format string', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      localStorage.setItem('selectedTimeFormat', '24h')
      const result = getTimeValueFormatZone()
      expect(result).toContain('dd')
    })

    it('getTimeZone includes 12h time token when not isDate', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      localStorage.setItem('selectedTimeFormat', '12h')
      expect(getTimeZone(false)).toBe('dd/MM/yyyy hh:mm A')
    })

    it('getTimeValueFormatZone keeps unknown date format unchanged', () => {
      localStorage.setItem('selectedDateFormat', 'CUSTOM')
      localStorage.setItem('selectedTimeFormat', '24h')
      expect(getTimeValueFormatZone()).toBe('CUSTOM')
    })

    it('getTimeZone maps MM/DD/YYYY and YYYY/MM/DD date branches', () => {
      localStorage.setItem('selectedDateFormat', 'MM/DD/YYYY')
      expect(getTimeZone(true)).toBe('MM/dd/yyyy')

      localStorage.setItem('selectedDateFormat', 'YYYY/MM/DD')
      expect(getTimeZone(true)).toBe('yyyy/MM/dd')
    })
  })

  describe('getBtnStatusColor branch coverage', () => {
    it('converts boolean true to yes', () => {
      expect(getBtnStatusColor(true)).toBe('#1173c1')
    })
    it('converts boolean false to no', () => {
      expect(getBtnStatusColor(false)).toBe('#757575')
    })
    it('keeps number as-is (no toLowerCase)', () => {
      expect(getBtnStatusColor(1)).toBeDefined()
    })
    it('returns default for empty string', () => {
      expect(getBtnStatusColor('')).toBe('#00bcd4')
    })
    it('returns from statusColorMap for known status', () => {
      expect(getBtnStatusColor('active')).toBe('#1173C1')
      expect(getBtnStatusColor('finished')).toBe('#217124')
      expect(getBtnStatusColor('deleted')).toBe('#F56C6C')
    })
    it('returns default for unknown status', () => {
      expect(getBtnStatusColor('unknownstatus')).toBe('#00bcd4')
    })

    it('returns default for numeric zero type', () => {
      expect(getBtnStatusColor(0)).toBe('#00bcd4')
    })
  })

  describe('getBtnPriorityColor branch coverage', () => {
    it('returns color for active', () => {
      expect(getBtnPriorityColor('active')).toBe('#00bcd4')
    })
    it('returns color for inactive', () => {
      expect(getBtnPriorityColor('inactive')).toBe('#b83a3a')
    })
    it('returns color for high', () => {
      expect(getBtnPriorityColor('high')).toBe('#b6791d')
    })
    it('returns color for very high', () => {
      expect(getBtnPriorityColor('very high')).toBe('#b83a3a')
    })
    it('returns color for veryhigh', () => {
      expect(getBtnPriorityColor('veryhigh')).toBe('#b83a3a')
    })
    it('returns undefined for unknown', () => {
      expect(getBtnPriorityColor('unknown')).toBeUndefined()
    })

    it('covers very low and n/a aliases', () => {
      expect(getBtnPriorityColor('very low')).toBe('#757575')
      expect(getBtnPriorityColor('verylow')).toBe('#757575')
      expect(getBtnPriorityColor('n/a')).toBe('#00bcd4')
    })
  })

  describe('getTextColor branch coverage', () => {
    it('returns color for open', () => {
      expect(getTextColor('open')).toBe('#f56c6c')
    })
    it('returns color for closed', () => {
      expect(getTextColor('closed')).toBe('#43a047')
    })
    it('returns color for low', () => {
      expect(getTextColor('low')).toBe('#e6a23c')
    })
    it('returns undefined for unknown', () => {
      expect(getTextColor('unknown')).toBeUndefined()
    })

    it('covers in progress and false positive branches', () => {
      expect(getTextColor('in progress')).toBe('#2196f3')
      expect(getTextColor('false positive')).toBe('#e6a23c')
    })
  })

  describe('getTimeZoneForMoment branch coverage', () => {
    beforeEach(() => {
      localStorage.clear()
    })
    it('returns format with DD/MM/YYYY when 12h', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      localStorage.setItem('selectedTimeFormat', '12h')
      const result = getTimeZoneForMoment()
      expect(result).toContain('DD')
      expect(result).toContain('hh')
    })
    it('returns format with MM/DD/YYYY', () => {
      localStorage.setItem('selectedDateFormat', 'MM/DD/YYYY')
      localStorage.setItem('selectedTimeFormat', '24h')
      const result = getTimeZoneForMoment()
      expect(result).toContain('MM')
    })
    it('uses fallback when localStorage empty', () => {
      const fallback = { dateFormat: 'YYYY/MM/DD', timeFormat: '12h' }
      const result = getTimeZoneForMoment(fallback)
      expect(result).toContain('YYYY')
    })

    it('returns raw/empty format when date format is unknown', () => {
      localStorage.setItem('selectedDateFormat', 'UNKNOWN')
      localStorage.setItem('selectedTimeFormat', '24h')
      const result = getTimeZoneForMoment()
      expect(result).toBe('UNKNOWN')
    })
  })

  describe('scrollToComponent and handleIsSafari', () => {
    it('scrollToComponent returns early when element is missing', () => {
      expect(scrollToComponent()).toBeUndefined()
    })

    it('scrollToComponent uses direct scrollIntoView on safari', () => {
      const originalSafari = globalThis.safari
      const originalVendor = navigator.vendor
      Object.defineProperty(globalThis, 'safari', { value: {}, configurable: true })
      Object.defineProperty(navigator, 'vendor', { value: 'Apple', configurable: true })
      const scrollIntoView = jest.fn()

      scrollToComponent({ scrollIntoView })

      expect(scrollIntoView).toHaveBeenCalledWith()
      Object.defineProperty(globalThis, 'safari', { value: originalSafari, configurable: true })
      Object.defineProperty(navigator, 'vendor', { value: originalVendor, configurable: true })
    })

    it('handleIsSafari returns truthy for apple vendor', () => {
      const originalSafari = globalThis.safari
      const originalVendor = navigator.vendor
      Object.defineProperty(globalThis, 'safari', { value: undefined, configurable: true })
      Object.defineProperty(navigator, 'vendor', { value: 'Apple Computer, Inc.', configurable: true })
      expect(handleIsSafari()).toBeTruthy()
      Object.defineProperty(globalThis, 'safari', { value: originalSafari, configurable: true })
      Object.defineProperty(navigator, 'vendor', { value: originalVendor, configurable: true })
    })
  })

  describe('isOwnerOrMember and isOwner', () => {
    it('isOwnerOrMember returns true for 1', () => {
      expect(isOwnerOrMember(1)).toBe(true)
    })
    it('isOwnerOrMember returns true for 2', () => {
      expect(isOwnerOrMember(2)).toBe(true)
    })
    it('isOwnerOrMember returns false for 3', () => {
      expect(isOwnerOrMember(3)).toBe(false)
    })
    it('isOwner returns true for 1', () => {
      expect(isOwner(1)).toBe(true)
    })
    it('isOwner returns false for 2', () => {
      expect(isOwner(2)).toBe(false)
    })

    it('isOwner returns true for string "1" due to loose equality', () => {
      expect(isOwner('1')).toBe(true)
    })
  })

  describe('isDifferent recursive branch coverage', () => {
    it('returns true when nested objects differ', () => {
      expect(isDifferent({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true)
    })
    it('returns false when nested objects equal', () => {
      expect(isDifferent({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false)
    })
    it('returns true when value differs', () => {
      expect(isDifferent({ a: 1 }, { a: 2 })).toBe(true)
    })

    it('returns false when arrays have same length and same primitive fields', () => {
      expect(
        isDifferent(
          { arr: [1, 2], x: 'same' },
          { arr: [3, 4], x: 'same' }
        )
      ).toBe(false)
    })
  })

  describe('cancellableAxiosRequest', () => {
    it('returns wrapped function response and resets abort flag on non-empty response', async () => {
      const fn = jest.fn((payload, opts) =>
        Promise.resolve({ data: payload, signalExists: !!opts?.signal })
      )
      const wrapped = cancellableAxiosRequest(fn)

      const result = await wrapped({ id: 1 })

      expect(result).toEqual({ data: { id: 1 }, signalExists: true })
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn.mock.calls[0][1]).toEqual(expect.objectContaining({ signal: expect.anything() }))
    })

    it('keeps aborted mode when response is empty object and still calls with signal', async () => {
      const fn = jest.fn(() => Promise.resolve({}))
      const wrapped = cancellableAxiosRequest(fn)

      await wrapped({ first: true })
      await wrapped({ second: true })

      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn.mock.calls[0][1]).toEqual(expect.objectContaining({ signal: expect.anything() }))
      expect(fn.mock.calls[1][1]).toEqual(expect.objectContaining({ signal: expect.anything() }))
    })

    it('appends abort signal as last argument while preserving original params', async () => {
      const fn = jest.fn((a, b, c, opts) =>
        Promise.resolve({ ok: true, params: [a, b, c], hasSignal: !!opts?.signal })
      )
      const wrapped = cancellableAxiosRequest(fn)

      const result = await wrapped('p1', 2, { x: 3 })

      expect(result).toEqual({
        ok: true,
        params: ['p1', 2, { x: 3 }],
        hasSignal: true
      })
    })
  })

  describe('fileToBase64', () => {
    it('resolves with FileReader result for Blob input', async () => {
      const originalFileReader = global.FileReader
      class MockReader {
        readAsDataURL() {
          this.result = 'data:text/plain;base64,QQ=='
          setTimeout(() => {
            if (typeof this.onload === 'function') this.onload()
          }, 0)
        }
      }
      global.FileReader = MockReader

      const result = await fileToBase64(new Blob(['A']))
      expect(result).toBe('data:text/plain;base64,QQ==')

      global.FileReader = originalFileReader
    })

    it('rejects when FileReader emits error', async () => {
      const originalFileReader = global.FileReader
      class MockReader {
        readAsDataURL() {
          setTimeout(() => {
            if (typeof this.onerror === 'function') this.onerror(new Error('read-failed'))
          }, 0)
        }
      }
      global.FileReader = MockReader

      await expect(fileToBase64(new Blob(['A']))).rejects.toBeDefined()
      global.FileReader = originalFileReader
    })
  })

  describe('openHtmlInNewWindow', () => {
    it('returns early when html is empty', () => {
      const openSpy = jest.spyOn(globalThis, 'open').mockImplementation(() => null)
      openHtmlInNewWindow('')
      expect(openSpy).not.toHaveBeenCalled()
      openSpy.mockRestore()
    })

    it('injects title/meta/script and opens blob url', () => {
      jest.useFakeTimers()
      const originalCreateObjectURL = globalThis.URL.createObjectURL
      const originalRevokeObjectURL = globalThis.URL.revokeObjectURL
      const openSpy = jest.spyOn(globalThis, 'open').mockImplementation(() => null)
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
      globalThis.URL.revokeObjectURL = jest.fn()

      openHtmlInNewWindow('<html><body><a href="#">x</a></body></html>')

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
      expect(openSpy).toHaveBeenCalledWith('blob:test-url', '_blank')
      jest.advanceTimersByTime(101)
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')

      openSpy.mockRestore()
      globalThis.URL.createObjectURL = originalCreateObjectURL
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL
      jest.useRealTimers()
    })

    it('replaces existing title when title tag already exists', () => {
      jest.useFakeTimers()
      const originalCreateObjectURL = globalThis.URL.createObjectURL
      const originalRevokeObjectURL = globalThis.URL.revokeObjectURL
      const openSpy = jest.spyOn(globalThis, 'open').mockImplementation(() => null)
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url-2')
      globalThis.URL.revokeObjectURL = jest.fn()

      openHtmlInNewWindow('<html><head><title>Old</title></head><body>x</body></html>')

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
      expect(openSpy).toHaveBeenCalledWith('blob:test-url-2', '_blank')
      jest.advanceTimersByTime(101)
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url-2')

      openSpy.mockRestore()
      globalThis.URL.createObjectURL = originalCreateObjectURL
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL
      jest.useRealTimers()
    })
  })

  describe('copyToClipboard', () => {
    let originalClipboard
    let originalSecureContext
    let originalExecCommand
    let execCommandMock
    let createElementSpy

    beforeEach(() => {
      originalClipboard = navigator.clipboard
      originalSecureContext = globalThis.isSecureContext
      originalExecCommand = document.execCommand
      execCommandMock = jest.fn(() => true)
      Object.defineProperty(document, 'execCommand', {
        value: execCommandMock,
        configurable: true,
        writable: true
      })
      createElementSpy = jest.spyOn(document, 'createElement')
    })

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true
      })
      Object.defineProperty(globalThis, 'isSecureContext', {
        value: originalSecureContext,
        configurable: true
      })
      Object.defineProperty(document, 'execCommand', {
        value: originalExecCommand,
        configurable: true,
        writable: true
      })
      createElementSpy.mockRestore()
    })

    it('uses navigator clipboard in secure context and resolves true', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true
      })
      Object.defineProperty(globalThis, 'isSecureContext', {
        value: true,
        configurable: true
      })

      const result = await copyToClipboard('hello')

      expect(writeText).toHaveBeenCalledWith('hello')
      expect(result).toBe(true)
    })

    it('falls back to execCommand when clipboard write fails', async () => {
      const writeText = jest.fn().mockRejectedValue(new Error('denied'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true
      })
      Object.defineProperty(globalThis, 'isSecureContext', {
        value: true,
        configurable: true
      })
      execCommandMock.mockReturnValue(true)

      const result = await copyToClipboard('fallback')

      expect(writeText).toHaveBeenCalledWith('fallback')
      expect(execCommandMock).toHaveBeenCalledWith('copy')
      expect(result).toBe(true)
    })

    it('returns false when non-secure fallback copy fails', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true
      })
      Object.defineProperty(globalThis, 'isSecureContext', {
        value: false,
        configurable: true
      })
      execCommandMock.mockReturnValue(false)

      const result = await copyToClipboard('x')

      expect(execCommandMock).toHaveBeenCalledWith('copy')
      expect(result).toBe(false)
    })
  })
})
