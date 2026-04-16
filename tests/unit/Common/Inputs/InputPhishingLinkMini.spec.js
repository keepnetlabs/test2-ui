import InputPhishingLinkMini from '@/components/Common/Inputs/InputPhishingLinkMini.vue'
import { getDomainBlocklistStatus, getCleanDomainSuggestions } from '@/api/domainBlocklist'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'abc123')
}))

jest.mock('@/api/domainBlocklist', () => ({
  getDomainBlocklistStatus: jest.fn().mockResolvedValue({ data: {} }),
  getCleanDomainSuggestions: jest.fn().mockResolvedValue({ data: { suggestions: [] } })
}))

describe('InputPhishingLinkMini.vue', () => {
  const { methods, computed } = InputPhishingLinkMini

  const buildContext = (overrides = {}) => ({
    value: {
      urlSchemaTypeId: '2',
      subDomain: 'www',
      domainRecordId: 'domain-1',
      pathTypeId: 'path-1',
      extensionTypeId: 'ext-1',
      parameterTypeId: 'param-1'
    },
    urlSchemaTypes: [
      { text: 'http://', value: '1' },
      { text: 'https://', value: '2' }
    ],
    urlSchemaTypesModified: [],
    domainRecords: [
      {
        text: 'example.com',
        value: 'domain-1',
        extraDatas: [{ value: '2', text: 'Both' }, { value: true }]
      }
    ],
    pathTypes: [{ text: 'login', value: 'path-1' }],
    extensionTypes: [{ text: '.html', value: 'ext-1' }],
    parameterTypes: [{ text: 'id', value: 'param-1' }],
    isEdit: false,
    $nextTick: (cb) => cb(),
    $emit: jest.fn(),
    disabledLabel: '',
    checkSchemaTypes: jest.fn(),
    checkDomainBlocklist: jest.fn(),
    handleInputChange: methods.handleInputChange,
    ...overrides
  })

  it('returns urlSchemaTypesModified when it is not empty', () => {
    const ctx = buildContext({
      urlSchemaTypesModified: [{ text: 'custom', value: '9' }]
    })

    expect(computed.getUrlSchemaTypesModified.call(ctx)).toEqual([{ text: 'custom', value: '9' }])
  })

  it('falls back to urlSchemaTypes when modified list is empty', () => {
    const ctx = buildContext({
      urlSchemaTypesModified: [],
      urlSchemaTypes: [{ text: 'https://', value: '2' }]
    })
    expect(computed.getUrlSchemaTypesModified.call(ctx)).toEqual([{ text: 'https://', value: '2' }])
  })

  it('handleInputChange trims value and emits updated object', () => {
    const ctx = buildContext()
    ctx.changeDisabledLabel = jest.fn()

    methods.handleInputChange.call(ctx, '  demo  ', 'subDomain')

    expect(ctx.$emit).toHaveBeenCalledWith('input', expect.objectContaining({ subDomain: 'demo' }))
    expect(ctx.changeDisabledLabel).toHaveBeenCalled()
  })

  it('setDefaultValue emits defaults and checks schema for first domain', () => {
    const ctx = buildContext()
    ctx.getUrlSchemaTypesModified = computed.getUrlSchemaTypesModified.call(ctx)

    methods.setDefaultValue.call(ctx)

    expect(ctx.$emit).toHaveBeenCalledWith(
      'input',
      expect.objectContaining({
        urlSchemaTypeId: '1',
        subDomain: 'www',
        domainRecordId: 'domain-1'
      })
    )
    expect(ctx.$emit).toHaveBeenCalledWith('invisible-captcha', false)
    expect(ctx.$emit).toHaveBeenCalledWith('captcha-default-value', true)
    expect(ctx.checkSchemaTypes).toHaveBeenCalledWith('domain-1')
  })

  it('changeDisabledLabel composes simulation link with fallback values', () => {
    const ctx = buildContext({
      value: {
        urlSchemaTypeId: '2',
        subDomain: '',
        domainRecordId: '',
        pathTypeId: '',
        extensionTypeId: '',
        parameterTypeId: ''
      },
      getUrlSchemaTypesModified: [{ text: 'https://', value: '2' }]
    })

    methods.changeDisabledLabel.call(ctx)

    expect(ctx.disabledLabel).toBe('https://subDomain.noDomain/noPathnoExtension?undefined=abc123')
  })

  it('checkSchemaTypes in edit mode forces http protocol for http-only domains', () => {
    const ctx = buildContext({
      isEdit: true,
      value: {
        urlSchemaTypeId: '2',
        subDomain: 'www',
        domainRecordId: 'domain-http',
        pathTypeId: 'path-1',
        extensionTypeId: 'ext-1',
        parameterTypeId: 'param-1'
      },
      domainRecords: [
        {
          text: 'http-only.test',
          value: 'domain-http',
          extraDatas: [{ value: '1', text: 'HTTP' }, { value: true }]
        }
      ]
    })
    ctx.getUrlSchemaTypesModified = computed.getUrlSchemaTypesModified.call(ctx)
    ctx.handleInputChange = jest.fn()

    methods.checkSchemaTypes.call(ctx, 'domain-http')

    expect(ctx.handleInputChange).toHaveBeenCalledWith('1', 'urlSchemaTypeId')
    expect(ctx.urlSchemaTypesModified.find((item) => item.value === '2').disabled).toBe(true)
  })

  it('checkSchemaTypes in create mode sets protocol and captcha emits', () => {
    const ctx = buildContext({
      isEdit: false
    })
    ctx.getUrlSchemaTypesModified = computed.getUrlSchemaTypesModified.call(ctx)
    ctx.handleInputChange = jest.fn()

    methods.checkSchemaTypes.call(ctx, 'domain-1')

    expect(ctx.handleInputChange).toHaveBeenCalledWith('2', 'urlSchemaTypeId')
    expect(ctx.$emit).toHaveBeenCalledWith('invisible-captcha', false)
    expect(ctx.$emit).toHaveBeenCalledWith('captcha-default-value', true)
  })

  describe('Blocklist Domain Check', () => {
    it('checkDomainBlocklist calls API with domain text', () => {
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      expect(getDomainBlocklistStatus).toHaveBeenCalledWith('example.com')
    })

    it('checkDomainBlocklist sets warning for malicious domain', async () => {
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'Blocked by browsers' }
      })
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toEqual({
        status: 'malicious',
        reason: 'Blocked by browsers'
      })
    })

    it('checkDomainBlocklist does not set warning for clean domain', async () => {
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'clean', reason: null }
      })
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toBeNull()
    })

    it('checkDomainBlocklist resets state before checking', () => {
      const ctx = buildContext({
        blocklistWarning: { status: 'malicious', reason: 'old' },
        cleanSuggestions: [{ domain: 'old.com' }]
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      expect(ctx.cleanSuggestions).toEqual([])
    })

    it('checkDomainBlocklist exits early for unknown domainRecordId', () => {
      jest.clearAllMocks()
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: [],
        domainRecords: []
      })
      methods.checkDomainBlocklist.call(ctx, 'nonexistent-id')
      expect(getDomainBlocklistStatus).not.toHaveBeenCalled()
    })

    it('handleSwitchDomain calls suggestions API', () => {
      const ctx = buildContext({
        isSuggestionsLoading: false,
        cleanSuggestions: []
      })
      methods.handleSwitchDomain.call(ctx)
      expect(getCleanDomainSuggestions).toHaveBeenCalled()
      expect(ctx.isSuggestionsLoading).toBe(true)
    })

    it('handleSwitchDomain filters suggestions by domainRecords', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: {
          suggestions: [
            { domain: 'example.com' },
            { domain: 'unknown.com' }
          ]
        }
      })
      const ctx = buildContext({
        isSuggestionsLoading: false,
        cleanSuggestions: []
      })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toEqual([{ domain: 'example.com' }])
      expect(ctx.isSuggestionsLoading).toBe(false)
    })

    it('selectCleanDomain finds matching record and calls handleChangeDomainRecord', () => {
      const ctx = buildContext()
      ctx.handleChangeDomainRecord = jest.fn()
      methods.selectCleanDomain.call(ctx, 'example.com')
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('domain-1')
    })

    it('selectCleanDomain does nothing for unmatched domain', () => {
      const ctx = buildContext()
      ctx.handleChangeDomainRecord = jest.fn()
      methods.selectCleanDomain.call(ctx, 'nonexistent.com')
      expect(ctx.handleChangeDomainRecord).not.toHaveBeenCalled()
    })

    it('handleChangeDomainRecord triggers blocklist check', () => {
      const ctx = buildContext()
      ctx.checkDomainBlocklist = jest.fn()
      ctx.changeDisabledLabel = jest.fn()
      methods.handleChangeDomainRecord.call(ctx, 'domain-1')
      expect(ctx.checkDomainBlocklist).toHaveBeenCalledWith('domain-1')
    })

    it('checkDomainBlocklist sets warning for suspicious domain', async () => {
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'suspicious', reason: 'Flagged by 2 vendors' }
      })
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toEqual({
        status: 'suspicious',
        reason: 'Flagged by 2 vendors'
      })
    })

    it('checkDomainBlocklist handles API error silently', async () => {
      getDomainBlocklistStatus.mockRejectedValueOnce(new Error('Network'))
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toBeNull()
    })

    it('handleSwitchDomain handles API error silently', async () => {
      getCleanDomainSuggestions.mockRejectedValueOnce(new Error('Timeout'))
      const ctx = buildContext({
        isSuggestionsLoading: false,
        cleanSuggestions: []
      })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toEqual([])
      expect(ctx.isSuggestionsLoading).toBe(false)
    })

    it('handleSwitchDomain returns empty when no suggestions match domainRecords', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: { suggestions: [{ domain: 'no-match-1.com' }, { domain: 'no-match-2.com' }] }
      })
      const ctx = buildContext({
        isSuggestionsLoading: false,
        cleanSuggestions: []
      })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toEqual([])
    })

    it('handleSwitchDomain uses includes matching for partial domain names', async () => {
      getCleanDomainSuggestions.mockResolvedValueOnce({
        data: { suggestions: [{ domain: 'example.com' }] }
      })
      const ctx = buildContext({
        isSuggestionsLoading: false,
        cleanSuggestions: [],
        domainRecords: [
          { text: 'example.com', value: 'dom-1', extraDatas: [{ value: '2' }, { value: true }] }
        ]
      })
      methods.handleSwitchDomain.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.cleanSuggestions).toHaveLength(1)
    })

    it('selectCleanDomain triggers full domain change flow', () => {
      const ctx = buildContext()
      ctx.handleChangeDomainRecord = jest.fn()
      methods.selectCleanDomain.call(ctx, 'example.com')
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('domain-1')
    })

    it('checkDomainBlocklist does not set warning for pending status', async () => {
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'pending', reason: null }
      })
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toBeNull()
    })

    it('checkDomainBlocklist does not set warning for error status', async () => {
      getDomainBlocklistStatus.mockResolvedValueOnce({
        data: { status: 'error', reason: 'Check failed' }
      })
      const ctx = buildContext({
        blocklistWarning: null,
        cleanSuggestions: []
      })
      methods.checkDomainBlocklist.call(ctx, 'domain-1')
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blocklistWarning).toBeNull()
    })

    it('mounted calls checkDomainBlocklist in edit mode', () => {
      const ctx = buildContext({
        isEdit: true,
        blocklistWarning: null,
        cleanSuggestions: []
      })
      ctx.checkDomainBlocklist = jest.fn()
      ctx.checkSchemaTypes = jest.fn()
      ctx.setDefaultValue = jest.fn()
      InputPhishingLinkMini.mounted.call(ctx)
      expect(ctx.checkDomainBlocklist).toHaveBeenCalledWith('domain-1')
    })

    it('mounted does not call checkDomainBlocklist in create mode', () => {
      const ctx = buildContext({
        isEdit: false,
        blocklistWarning: null,
        cleanSuggestions: []
      })
      ctx.checkDomainBlocklist = jest.fn()
      ctx.setDefaultValue = jest.fn()
      InputPhishingLinkMini.mounted.call(ctx)
      expect(ctx.checkDomainBlocklist).not.toHaveBeenCalled()
    })
  })

  it('checkSchemaTypes enables all schemas for HTTPS-capable domains', () => {
    const ctx = buildContext({
      isEdit: false,
      domainRecords: [
        {
          text: 'https-capable.test',
          value: 'domain-https',
          extraDatas: [{ value: '2', text: 'HTTPS' }, { value: true }]
        }
      ]
    })
    ctx.getUrlSchemaTypesModified = computed.getUrlSchemaTypesModified.call(ctx)
    ctx.handleInputChange = jest.fn()

    methods.checkSchemaTypes.call(ctx, 'domain-https')

    expect(ctx.urlSchemaTypesModified.every((item) => item.disabled === false)).toBe(true)
    expect(ctx.handleInputChange).toHaveBeenCalledWith('2', 'urlSchemaTypeId')
  })
})
