import InputPhishingLinkMini from '@/components/Common/Inputs/InputPhishingLinkMini.vue'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'rnd999')
}))

jest.mock('@/api/domainBlacklist', () => ({
  getDomainBlacklistStatus: jest.fn().mockResolvedValue({ data: {} }),
  getCleanDomainSuggestions: jest.fn().mockResolvedValue({ data: { suggestions: [] } })
}))

describe('InputPhishingLinkMini.vue (extra)', () => {
  const { methods, computed, watch, mounted } = InputPhishingLinkMini

  const createCtx = (overrides = {}) => ({
    value: {
      urlSchemaTypeId: '2',
      subDomain: 'www',
      domainRecordId: 'd1',
      pathTypeId: 'p1',
      extensionTypeId: 'e1',
      parameterTypeId: 'pm1'
    },
    urlSchemaTypes: [
      { text: 'http://', value: '1' },
      { text: 'https://', value: '2' }
    ],
    urlSchemaTypesModified: [],
    domainRecords: [
      {
        text: 'example.com',
        value: 'd1',
        extraDatas: [{ value: '2', text: 'Both' }, { value: true }]
      }
    ],
    pathTypes: [{ text: 'login', value: 'p1' }],
    extensionTypes: [{ text: '.html', value: 'e1' }],
    parameterTypes: [{ text: 'id', value: 'pm1' }],
    subdomainRules: [],
    httpRules: ['http-rule'],
    httpsRules: ['https-rule'],
    isEdit: false,
    disabledLabel: '',
    $refs: {},
    $nextTick: (cb) => cb(),
    $emit: jest.fn(),
    changeDisabledLabel: jest.fn(),
    checkSchemaTypes: jest.fn(),
    checkDomainBlacklist: jest.fn(),
    handleInputChange: jest.fn(),
    getUrlSchemaTypesModified: computed.getUrlSchemaTypesModified.call({
      urlSchemaTypesModified: [],
      urlSchemaTypes: [
        { text: 'http://', value: '1' },
        { text: 'https://', value: '2' }
      ]
    }),
    ...overrides
  })

  it('mounted calls setDefaultValue in create mode and checkSchemaTypes in edit mode', () => {
    const createModeCtx = createCtx({
      isEdit: false,
      setDefaultValue: jest.fn(),
      checkSchemaTypes: jest.fn(),
      checkDomainBlacklist: jest.fn()
    })
    mounted.call(createModeCtx)
    expect(createModeCtx.setDefaultValue).toHaveBeenCalledTimes(1)
    expect(createModeCtx.checkSchemaTypes).not.toHaveBeenCalled()
    expect(createModeCtx.checkDomainBlacklist).not.toHaveBeenCalled()

    const editModeCtx = createCtx({
      isEdit: true,
      value: { domainRecordId: 'd1' },
      setDefaultValue: jest.fn(),
      checkSchemaTypes: jest.fn(),
      checkDomainBlacklist: jest.fn()
    })
    mounted.call(editModeCtx)
    expect(editModeCtx.setDefaultValue).not.toHaveBeenCalled()
    expect(editModeCtx.checkSchemaTypes).toHaveBeenCalledWith('d1', false)
    expect(editModeCtx.checkDomainBlacklist).toHaveBeenCalledWith('d1')
  })

  it('mounted in edit mode does not call schema check when domainRecordId is missing', () => {
    const editModeCtx = createCtx({
      isEdit: true,
      value: { domainRecordId: '' },
      setDefaultValue: jest.fn(),
      checkSchemaTypes: jest.fn(),
      checkDomainBlacklist: jest.fn()
    })

    mounted.call(editModeCtx)

    expect(editModeCtx.setDefaultValue).not.toHaveBeenCalled()
    expect(editModeCtx.checkSchemaTypes).not.toHaveBeenCalled()
    expect(editModeCtx.checkDomainBlacklist).not.toHaveBeenCalled()
  })

  it('handleChangeDomainRecord calls input change, schema check, relabel and blacklist check', () => {
    const ctx = createCtx({
      handleInputChange: jest.fn(),
      checkSchemaTypes: jest.fn(),
      changeDisabledLabel: jest.fn(),
      checkDomainBlacklist: jest.fn()
    })

    methods.handleChangeDomainRecord.call(ctx, 'd1')

    expect(ctx.handleInputChange).toHaveBeenCalledWith('d1', 'domainRecordId')
    expect(ctx.checkSchemaTypes).toHaveBeenCalledWith('d1', true)
    expect(ctx.changeDisabledLabel).toHaveBeenCalled()
    expect(ctx.checkDomainBlacklist).toHaveBeenCalledWith('d1')
  })

  it('value watcher triggers label refresh and ref validation', () => {
    const refValidate = jest.fn()
    const ctx = createCtx({
      changeDisabledLabel: jest.fn(),
      $refs: { refSubdomain: { validate: refValidate } }
    })

    watch.value.handler.call(ctx)

    expect(ctx.changeDisabledLabel).toHaveBeenCalled()
    expect(refValidate).toHaveBeenCalled()
  })

  it('value watcher works safely without refSubdomain', () => {
    const ctx = createCtx({
      changeDisabledLabel: jest.fn(),
      $refs: {}
    })

    expect(() => watch.value.handler.call(ctx)).not.toThrow()
    expect(ctx.changeDisabledLabel).toHaveBeenCalled()
  })

  it('disabledLabel watcher emits link-change', () => {
    const emit = jest.fn()
    watch.disabledLabel.call({ $emit: emit }, 'https://x')
    expect(emit).toHaveBeenCalledWith('link-change', 'https://x')
  })

  it('urlSchema watcher picks rule set and validates ref', () => {
    const validate = jest.fn()
    const ctx = createCtx({
      $refs: { refSubdomain: { validate } },
      httpRules: ['h1'],
      httpsRules: ['s1']
    })

    watch['value.urlSchemaTypeId'].handler.call(ctx, '1')
    expect(ctx.subdomainRules).toEqual(['h1'])
    expect(validate).toHaveBeenCalled()

    watch['value.urlSchemaTypeId'].handler.call(ctx, '2')
    expect(ctx.subdomainRules).toEqual(['s1'])
  })

  it('urlSchema watcher sets rules even when ref is missing', () => {
    const ctx = createCtx({
      $refs: {},
      httpRules: ['http-only'],
      httpsRules: ['https-only']
    })

    watch['value.urlSchemaTypeId'].handler.call(ctx, '1')
    expect(ctx.subdomainRules).toEqual(['http-only'])
    watch['value.urlSchemaTypeId'].handler.call(ctx, '999')
    expect(ctx.subdomainRules).toEqual(['https-only'])
  })

  it('field watchers call relabel and schema check when needed', () => {
    const changeDisabledLabel = jest.fn()
    const checkSchemaTypes = jest.fn()
    const ctx = { changeDisabledLabel, checkSchemaTypes }

    watch['value.domainRecordId'].call(ctx, 'd1')
    expect(changeDisabledLabel).toHaveBeenCalledTimes(1)
    expect(checkSchemaTypes).toHaveBeenCalledWith('d1')

    watch['value.parameterTypeId'].call(ctx)
    watch['value.subDomain'].call(ctx)
    watch['value.pathTypeId'].call(ctx)
    expect(changeDisabledLabel).toHaveBeenCalledTimes(4)
  })

  it('domainRecord watcher does not call schema check for falsy values', () => {
    const changeDisabledLabel = jest.fn()
    const checkSchemaTypes = jest.fn()
    const ctx = { changeDisabledLabel, checkSchemaTypes }

    watch['value.domainRecordId'].call(ctx, '')

    expect(changeDisabledLabel).toHaveBeenCalled()
    expect(checkSchemaTypes).not.toHaveBeenCalled()
  })

  it('handleInputChange falls back to empty string when value is missing', () => {
    const emit = jest.fn()
    const changeDisabledLabel = jest.fn()
    const ctx = createCtx({ $emit: emit, changeDisabledLabel })

    methods.handleInputChange.call(ctx, undefined, 'subDomain')

    expect(emit).toHaveBeenCalledWith(
      'input',
      expect.objectContaining({
        subDomain: ''
      })
    )
    expect(changeDisabledLabel).toHaveBeenCalled()
  })

  it('setDefaultValue uses empty defaults when lists are empty', () => {
    const ctx = createCtx({
      urlSchemaTypes: [],
      getUrlSchemaTypesModified: [],
      domainRecords: [],
      pathTypes: [],
      extensionTypes: [],
      parameterTypes: [],
      checkSchemaTypes: jest.fn()
    })

    methods.setDefaultValue.call(ctx)

    expect(ctx.$emit).toHaveBeenCalledWith(
      'input',
      expect.objectContaining({
        urlSchemaTypeId: '',
        domainRecordId: '',
        pathTypeId: '',
        extensionTypeId: '',
        parameterTypeId: ''
      })
    )
    expect(ctx.$emit).toHaveBeenCalledWith('invisible-captcha', true)
    expect(ctx.$emit).toHaveBeenCalledWith('captcha-default-value', undefined)
    expect(ctx.checkSchemaTypes).toHaveBeenCalledWith(undefined)
  })

  it('setDefaultValue prefers first item from modified schema list', () => {
    const ctx = createCtx({
      getUrlSchemaTypesModified: [{ text: 'custom://', value: '9' }],
      checkSchemaTypes: jest.fn()
    })

    methods.setDefaultValue.call(ctx)

    expect(ctx.$emit).toHaveBeenCalledWith(
      'input',
      expect.objectContaining({
        urlSchemaTypeId: '9'
      })
    )
    expect(ctx.checkSchemaTypes).toHaveBeenCalledWith('d1')
  })

  it('checkSchemaTypes keeps all schema options enabled when domain supports both', () => {
    const ctx = createCtx({
      isEdit: false,
      domainRecords: [
        {
          text: 'both.test',
          value: 'd-both',
          extraDatas: [{ value: '3', text: 'Both' }, { value: true }]
        }
      ]
    })
    ctx.handleInputChange = jest.fn()

    methods.checkSchemaTypes.call(ctx, 'd-both')

    expect(ctx.urlSchemaTypesModified.every((item) => item.disabled === false)).toBe(true)
    expect(ctx.handleInputChange).toHaveBeenCalledWith('2', 'urlSchemaTypeId')
  })

  it('checkSchemaTypes in edit mode emits false captcha when domain does not support captcha', () => {
    const ctx = createCtx({
      isEdit: true,
      value: { urlSchemaTypeId: '1', domainRecordId: 'd1' },
      domainRecords: [
        {
          text: 'nocaptcha.test',
          value: 'd1',
          extraDatas: [{ value: '1', text: 'HTTP' }, { value: false }]
        }
      ]
    })

    methods.checkSchemaTypes.call(ctx, 'd1', false)

    expect(ctx.$emit).toHaveBeenCalledWith('invisible-captcha', true)
    expect(ctx.$emit).toHaveBeenCalledWith('captcha-default-value', false)
  })

  it('checkSchemaTypes in edit mode does not emit captcha-default-value when captcha is enabled and domain not changed', () => {
    const emit = jest.fn()
    const ctx = createCtx({
      isEdit: true,
      $emit: emit,
      value: { urlSchemaTypeId: '1', domainRecordId: 'd1' },
      domainRecords: [
        {
          text: 'captcha-enabled.test',
          value: 'd1',
          extraDatas: [{ value: '1', text: 'HTTP' }, { value: true }]
        }
      ]
    })

    methods.checkSchemaTypes.call(ctx, 'd1', false)

    expect(emit).toHaveBeenCalledWith('invisible-captcha', false)
    expect(emit).not.toHaveBeenCalledWith('captcha-default-value', true)
  })

  it('checkSchemaTypes emits captcha default on domain change even in edit mode', () => {
    const ctx = createCtx({
      isEdit: true,
      value: { urlSchemaTypeId: '1', domainRecordId: 'd1' },
      domainRecords: [
        {
          text: 'withcaptcha.test',
          value: 'd1',
          extraDatas: [{ value: '1', text: 'HTTP' }, { value: true }]
        }
      ]
    })

    methods.checkSchemaTypes.call(ctx, 'd1', true)

    expect(ctx.$emit).toHaveBeenCalledWith('captcha-default-value', true)
  })

  it('checkSchemaTypes does not force schema in edit mode when already compatible', () => {
    const ctx = createCtx({
      isEdit: true,
      value: { urlSchemaTypeId: '1', domainRecordId: 'd-http' },
      domainRecords: [
        {
          text: 'http-only.test',
          value: 'd-http',
          extraDatas: [{ value: '1', text: 'HTTP' }, { value: true }]
        }
      ],
      handleInputChange: jest.fn()
    })

    methods.checkSchemaTypes.call(ctx, 'd-http')

    expect(ctx.handleInputChange).not.toHaveBeenCalled()
    expect(ctx.urlSchemaTypesModified.find((item) => item.value === '1').disabled).toBe(false)
    expect(ctx.urlSchemaTypesModified.find((item) => item.value === '2').disabled).toBe(true)
  })

  it('checkSchemaTypes in create mode uses fixed schema value for http-only domains', () => {
    const ctx = createCtx({
      isEdit: false,
      domainRecords: [
        {
          text: 'http-only.test',
          value: 'd-http',
          extraDatas: [{ value: '1', text: 'HTTP' }, { value: true }]
        }
      ],
      handleInputChange: jest.fn()
    })

    methods.checkSchemaTypes.call(ctx, 'd-http')

    expect(ctx.handleInputChange).toHaveBeenCalledWith('1', 'urlSchemaTypeId')
  })

  it('checkSchemaTypes handles unknown domain by emitting safe defaults', () => {
    const ctx = createCtx({
      isEdit: false,
      handleInputChange: jest.fn()
    })

    methods.checkSchemaTypes.call(ctx, 'unknown-domain')

    expect(ctx.urlSchemaTypesModified.every((item) => item.disabled === true)).toBe(true)
    expect(ctx.handleInputChange).toHaveBeenCalledWith(undefined, 'urlSchemaTypeId')
    expect(ctx.$emit).toHaveBeenCalledWith('invisible-captcha', true)
    expect(ctx.$emit).toHaveBeenCalledWith('captcha-default-value', undefined)
  })

  it('changeDisabledLabel builds full link from selected values', () => {
    const ctx = createCtx({
      value: {
        urlSchemaTypeId: '1',
        subDomain: 'portal',
        domainRecordId: 'd1',
        pathTypeId: 'p1',
        extensionTypeId: 'e1',
        parameterTypeId: 'pm1'
      },
      getUrlSchemaTypesModified: [{ text: 'http://', value: '1' }]
    })

    methods.changeDisabledLabel.call(ctx)

    expect(ctx.disabledLabel).toBe('http://portal.example.com/login.html?id=rnd999')
  })

  describe('Blacklist Domain Check (extra)', () => {
    const { getDomainBlacklistStatus, getCleanDomainSuggestions } = require('@/api/domainBlacklist')

    beforeEach(() => jest.clearAllMocks())

    it('checkDomainBlacklist resets blacklistWarning and cleanSuggestions before API call', () => {
      const ctx = createCtx({
        blacklistWarning: { status: 'malicious', reason: 'old' },
        cleanSuggestions: [{ domain: 'stale.com' }]
      })
      methods.checkDomainBlacklist.call(ctx, 'd1')
      expect(ctx.blacklistWarning).toBeNull()
      expect(ctx.cleanSuggestions).toEqual([])
    })

    it('checkDomainBlacklist resolves domain text from domainRecords', () => {
      const ctx = createCtx({
        blacklistWarning: null,
        cleanSuggestions: [],
        domainRecords: [
          { text: 'special-domain.co', value: 'sd1', extraDatas: [{ value: '2' }, { value: true }] }
        ]
      })
      methods.checkDomainBlacklist.call(ctx, 'sd1')
      expect(getDomainBlacklistStatus).toHaveBeenCalledWith('special-domain.co')
    })

    it('checkDomainBlacklist sets warning only for malicious or suspicious', async () => {
      const ignoredStatuses = ['clean', 'pending', 'error', 'partial']
      for (const status of ignoredStatuses) {
        getDomainBlacklistStatus.mockResolvedValueOnce({
          data: { status, reason: status === 'clean' ? null : 'Some reason' }
        })
        const ctx = createCtx({ blacklistWarning: null, cleanSuggestions: [] })
        methods.checkDomainBlacklist.call(ctx, 'd1')
        await new Promise((r) => setTimeout(r, 0))
        expect(ctx.blacklistWarning).toBeNull()
      }
    })

    it('handleSwitchDomain sets loading true then false on success', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: { suggestions: [] }
      })
      const ctx = createCtx({ isSuggestionsLoading: false, cleanSuggestions: [] })
      methods.handleSwitchDomain.call(ctx)
      expect(ctx.isSuggestionsLoading).toBe(true)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.isSuggestionsLoading).toBe(false)
    })

    it('handleSwitchDomain sets loading false on error', async () => {
      getCleanDomainSuggestions.mockRejectedValueOnce(new Error('fail'))
      const ctx = createCtx({ isSuggestionsLoading: false, cleanSuggestions: [] })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.isSuggestionsLoading).toBe(false)
      expect(ctx.cleanSuggestions).toEqual([])
    })

    it('handleSwitchDomain filters with includes matching', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: {
          suggestions: [
            { domain: 'example.com' },
            { domain: 'example.com.tr' },
            { domain: 'totally-different.net' }
          ]
        }
      })
      const ctx = createCtx({
        isSuggestionsLoading: false,
        cleanSuggestions: [],
        domainRecords: [
          { text: 'example.com', value: 'd1', extraDatas: [{ value: '2' }, { value: true }] }
        ]
      })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      // exact match + includes match for .com.tr
      expect(ctx.cleanSuggestions).toHaveLength(2)
      expect(ctx.cleanSuggestions.map((s) => s.domain)).toContain('example.com')
      expect(ctx.cleanSuggestions.map((s) => s.domain)).toContain('example.com.tr')
    })

    it('selectCleanDomain triggers handleChangeDomainRecord with matched value', () => {
      const ctx = createCtx({
        handleChangeDomainRecord: jest.fn()
      })
      methods.selectCleanDomain.call(ctx, 'example.com')
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('d1')
    })

    it('selectCleanDomain does nothing when domain is not in records', () => {
      const ctx = createCtx({
        handleChangeDomainRecord: jest.fn()
      })
      methods.selectCleanDomain.call(ctx, 'ghost-domain.xyz')
      expect(ctx.handleChangeDomainRecord).not.toHaveBeenCalled()
    })

    it('handleSwitchDomain handles empty suggestions array from API', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: { suggestions: [] }
      })
      const ctx = createCtx({ isSuggestionsLoading: false, cleanSuggestions: [] })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toEqual([])
    })

    it('handleSwitchDomain handles missing suggestions field', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: {}
      })
      const ctx = createCtx({ isSuggestionsLoading: false, cleanSuggestions: [] })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toEqual([])
    })

    it('multiple domain records: only matching suggestions are returned', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: {
          suggestions: [
            { domain: 'example.com' },
            { domain: 'second.com' },
            { domain: 'third.com' }
          ]
        }
      })
      const ctx = createCtx({
        isSuggestionsLoading: false,
        cleanSuggestions: [],
        domainRecords: [
          { text: 'example.com', value: 'd1', extraDatas: [{ value: '2' }, { value: true }] },
          { text: 'second.com', value: 'd2', extraDatas: [{ value: '2' }, { value: true }] }
        ]
      })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toHaveLength(2)
      expect(ctx.cleanSuggestions.map((s) => s.domain)).toEqual(['example.com', 'second.com'])
    })
  })

  it('handleInputChange converts non-string values to empty string', () => {
    const emit = jest.fn()
    const ctx = createCtx({ $emit: emit, changeDisabledLabel: jest.fn() })

    methods.handleInputChange.call(ctx, 123, 'subDomain')

    expect(emit).toHaveBeenCalledWith(
      'input',
      expect.objectContaining({
        subDomain: ''
      })
    )
  })
})
