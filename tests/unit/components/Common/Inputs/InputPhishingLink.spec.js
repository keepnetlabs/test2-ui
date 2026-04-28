jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => 'RND123')
}))

jest.mock('@/api/domainBlocklist', () => ({
  getDomainBlocklistStatus: jest.fn().mockResolvedValue({ data: {} })
}))

import InputPhishingLink from '@/components/Common/Inputs/InputPhishingLink.vue'
import { getDomainBlocklistStatus } from '@/api/domainBlocklist'

const { watch } = InputPhishingLink
const schemaHelpers = {
  getDomainRecord: InputPhishingLink.methods.getDomainRecord,
  getDomainSchemaInfo: InputPhishingLink.methods.getDomainSchemaInfo,
  getSchemaValueByProtocol: InputPhishingLink.methods.getSchemaValueByProtocol,
  isCreateMode: InputPhishingLink.methods.isCreateMode,
  getProtocolValueForDomain: InputPhishingLink.methods.getProtocolValueForDomain,
  isSchemaDisabled: InputPhishingLink.methods.isSchemaDisabled,
  syncProtocolWithDomain: InputPhishingLink.methods.syncProtocolWithDomain
}

describe('InputPhishingLink.vue', () => {
  it('has correct component name', () => {
    expect(InputPhishingLink.name).toBe('InputPhishingLink')
  })

  describe('schema helpers', () => {
    const schemaCtx = {
      getUrlSchemaTypesModified: [
        { text: 'http://', value: '1' },
        { text: 'https://', value: '2' }
      ],
      getSchemaValueByProtocol: InputPhishingLink.methods.getSchemaValueByProtocol
    }

    it('getDomainSchemaInfo derives protocol from schema text and treats only Both text as both support', () => {
      expect(
        InputPhishingLink.methods.getDomainSchemaInfo.call(schemaCtx, {
          extraDatas: [{ value: '3', text: 'HTTPS' }]
        })
      ).toEqual({ activeVal: '2', isBothSchema: false, isHttpsSchema: true })

      expect(
        InputPhishingLink.methods.getDomainSchemaInfo.call(schemaCtx, {
          extraDatas: [{ value: '2', text: 'both' }]
        })
      ).toEqual({ activeVal: '2', isBothSchema: true, isHttpsSchema: false })
    })

    it('isSchemaDisabled preserves old non-duplicate HTTPS-capable behavior', () => {
      const ctx = { isDuplicate: false, isEdit: false, isCreateMode: InputPhishingLink.methods.isCreateMode }
      expect(
        InputPhishingLink.methods.isSchemaDisabled.call(ctx, { value: '1' }, {
          activeVal: '2',
          isBothSchema: false,
          isHttpsSchema: true
        })
      ).toBe(false)
    })

    it('isSchemaDisabled keeps duplicate HTTPS schemas enabled like create mode', () => {
      const ctx = { isDuplicate: true, isEdit: true, isCreateMode: InputPhishingLink.methods.isCreateMode }
      expect(
        InputPhishingLink.methods.isSchemaDisabled.call(ctx, { value: '1' }, {
          activeVal: '2',
          isBothSchema: false,
          isHttpsSchema: true
        })
      ).toBe(false)
      expect(
        InputPhishingLink.methods.isSchemaDisabled.call(ctx, { value: '2' }, {
          activeVal: '2',
          isBothSchema: false,
          isHttpsSchema: true
        })
      ).toBe(false)
    })

    it('syncProtocolWithDomain does not force HTTPS outside duplicate mode', () => {
      const ctx = {
        isDuplicate: false,
        isEdit: true,
        value: { urlSchemaTypeId: '1' },
        handleInputChange: jest.fn(),
        isCreateMode: InputPhishingLink.methods.isCreateMode,
        getProtocolValueForDomain: InputPhishingLink.methods.getProtocolValueForDomain
      }

      InputPhishingLink.methods.syncProtocolWithDomain.call(ctx, {
        activeVal: '2',
        isBothSchema: false
      })

      expect(ctx.handleInputChange).not.toHaveBeenCalled()
    })
  })

  it('handleInputChange emits trimmed input payload', () => {
    const $emit = jest.fn()
    const ctx = {
      value: { subDomain: 'old' },
      $emit,
      changeDisabledLabel: jest.fn()
    }
    InputPhishingLink.methods.handleInputChange.call(ctx, '  new-sub  ', 'subDomain')
    expect($emit).toHaveBeenCalledWith('input', { subDomain: 'new-sub' })
    expect(ctx.changeDisabledLabel).toHaveBeenCalled()
  })

  it('changeDisabledLabel builds a full preview link text', () => {
    const ctx = {
      value: {
        urlSchemaTypeId: '2',
        subDomain: 'test',
        domainRecordId: 'd1',
        pathTypeId: 'p1',
        extensionTypeId: 'e1',
        parameterTypeId: 'q1'
      },
      getUrlSchemaTypesModified: [{ value: '2', text: 'https://' }],
      domainRecords: [{ value: 'd1', text: 'example.com' }],
      pathTypes: [{ value: 'p1', text: 'login' }],
      extensionTypes: [{ value: 'e1', text: '.html' }],
      parameterTypes: [{ value: 'q1', text: 'id' }],
      disabledLabel: ''
    }
    InputPhishingLink.methods.changeDisabledLabel.call(ctx)
    expect(ctx.disabledLabel).toContain('https://test.example.com/login.html?id=RND123')
  })

  it('setDefaultValue emits defaults and captcha flags', () => {
    const $emit = jest.fn()
    const ctx = {
      value: {},
      $emit,
      getUrlSchemaTypesModified: [{ value: '2' }],
      domainRecords: [{ value: 'd1', extraDatas: [{ value: '2', text: 'Both' }, { value: true }] }],
      pathTypes: [{ value: 'p1' }],
      extensionTypes: [{ value: 'e1' }],
      parameterTypes: [{ value: 'q1' }],
      checkSchemaTypes: jest.fn(),
      checkDomainBlocklist: jest.fn()
    }
    InputPhishingLink.methods.setDefaultValue.call(ctx)
    expect($emit).toHaveBeenCalledWith(
      'input',
      expect.objectContaining({
        urlSchemaTypeId: '2',
        domainRecordId: 'd1',
        pathTypeId: 'p1',
        extensionTypeId: 'e1',
        parameterTypeId: 'q1'
      })
    )
    expect($emit).toHaveBeenCalledWith('invisible-captcha', false)
    expect($emit).toHaveBeenCalledWith('captcha-default-value', true)
    expect(ctx.checkSchemaTypes).toHaveBeenCalledWith('d1')
  })

  it('checkSchemaTypes disables schema options and forces HTTP in edit mode for HTTP-only domains', () => {
    const urlSchemaTypesModified = [
      { value: '1', disabled: false },
      { value: '2', disabled: false }
    ]
    const ctx = {
      domainRecords: [{ value: 'd1', extraDatas: [{ value: '1', text: 'HTTP' }, { value: false }] }],
      urlSchemaTypesModified,
      getUrlSchemaTypesModified: urlSchemaTypesModified,
      isEdit: true,
      value: { urlSchemaTypeId: '2' },
      handleInputChange: jest.fn(),
      $emit: jest.fn(),
      $nextTick: (cb) => cb(),
      ...schemaHelpers
    }
    InputPhishingLink.methods.checkSchemaTypes.call(ctx, 'd1')
    expect(urlSchemaTypesModified[0].disabled).toBe(false)
    expect(urlSchemaTypesModified[1].disabled).toBe(true)
    expect(ctx.handleInputChange).toHaveBeenCalledWith('1', 'urlSchemaTypeId')
  })

  it('checkSchemaTypes selects HTTPS in duplicate mode for HTTPS-only domains', () => {
    const urlSchemaTypesModified = [
      { value: '1', disabled: false },
      { value: '2', disabled: false }
    ]
    const ctx = {
      domainRecords: [
        { value: 'd2', extraDatas: [{ value: '2', text: 'HTTPS' }, { value: true }] }
      ],
      urlSchemaTypesModified,
      getUrlSchemaTypesModified: urlSchemaTypesModified,
      isEdit: true,
      isDuplicate: true,
      value: { urlSchemaTypeId: '1' },
      handleInputChange: jest.fn(),
      $emit: jest.fn(),
      $nextTick: (cb) => cb(),
      ...schemaHelpers
    }
    InputPhishingLink.methods.checkSchemaTypes.call(ctx, 'd2')
    expect(urlSchemaTypesModified[0].disabled).toBe(false)
    expect(urlSchemaTypesModified[1].disabled).toBe(false)
    expect(ctx.handleInputChange).toHaveBeenCalledWith('2', 'urlSchemaTypeId')
  })

  it('checkSchemaTypes uses schema text when duplicate HTTPS-only id differs from protocol id', () => {
    const urlSchemaTypesModified = [
      { value: '1', text: 'http://', disabled: false },
      { value: '2', text: 'https://', disabled: false }
    ]
    const ctx = {
      domainRecords: [
        { value: 'd-https-3', extraDatas: [{ value: '3', text: 'HTTPS' }, { value: true }] }
      ],
      urlSchemaTypesModified,
      getUrlSchemaTypesModified: urlSchemaTypesModified,
      isEdit: true,
      isDuplicate: true,
      value: { urlSchemaTypeId: '1' },
      handleInputChange: jest.fn(),
      $emit: jest.fn(),
      $nextTick: (cb) => cb(),
      ...schemaHelpers
    }
    InputPhishingLink.methods.checkSchemaTypes.call(ctx, 'd-https-3')
    expect(ctx.handleInputChange).toHaveBeenCalledWith('2', 'urlSchemaTypeId')
    expect(urlSchemaTypesModified[0].disabled).toBe(false)
    expect(urlSchemaTypesModified[1].disabled).toBe(false)
  })

  it('checkSchemaTypes uses create default when duplicate domain supports both protocols', () => {
    const urlSchemaTypesModified = [
      { value: '1', disabled: false },
      { value: '2', disabled: false }
    ]
    const ctx = {
      domainRecords: [
        { value: 'd3', extraDatas: [{ value: '3', text: 'Both' }, { value: true }] }
      ],
      urlSchemaTypesModified,
      getUrlSchemaTypesModified: urlSchemaTypesModified,
      isEdit: true,
      isDuplicate: true,
      value: { urlSchemaTypeId: '1' },
      handleInputChange: jest.fn(),
      $emit: jest.fn(),
      $nextTick: (cb) => cb(),
      ...schemaHelpers
    }
    InputPhishingLink.methods.checkSchemaTypes.call(ctx, 'd3')
    expect(urlSchemaTypesModified.every((item) => item.disabled === false)).toBe(true)
    expect(ctx.handleInputChange).toHaveBeenCalledWith('2', 'urlSchemaTypeId')
  })

  describe('domainRecords watcher (late-loaded domain list)', () => {
    const records = [
      { text: 'late.example.com', value: 'late-1', extraDatas: [{ value: '2' }, { value: true }] }
    ]

    it('create mode: [] -> items calls setDefaultValue when domainRecordId is empty', () => {
      const setDefaultValue = jest.fn()
      const checkDomainBlocklist = jest.fn()
      const ctx = {
        isEdit: false,
        value: { domainRecordId: '' },
        setDefaultValue,
        checkDomainBlocklist
      }
      watch.domainRecords.call(ctx, records, [])
      expect(setDefaultValue).toHaveBeenCalledTimes(1)
      expect(checkDomainBlocklist).not.toHaveBeenCalled()
    })

    it('edit mode: [] -> items calls checkDomainBlocklist when domainRecordId is set', () => {
      const setDefaultValue = jest.fn()
      const checkDomainBlocklist = jest.fn()
      const ctx = {
        isEdit: true,
        value: { domainRecordId: 'd1' },
        setDefaultValue,
        checkDomainBlocklist
      }
      watch.domainRecords.call(ctx, records, [])
      expect(setDefaultValue).not.toHaveBeenCalled()
      expect(checkDomainBlocklist).toHaveBeenCalledWith('d1')
    })

    it('returns early when new list is empty', () => {
      const setDefaultValue = jest.fn()
      const ctx = { setDefaultValue, checkDomainBlocklist: jest.fn() }
      watch.domainRecords.call(ctx, [], [])
      expect(setDefaultValue).not.toHaveBeenCalled()
    })

    it('does nothing when list was already non-empty', () => {
      const setDefaultValue = jest.fn()
      const checkDomainBlocklist = jest.fn()
      const ctx = { setDefaultValue, checkDomainBlocklist }
      watch.domainRecords.call(ctx, records, records)
      expect(setDefaultValue).not.toHaveBeenCalled()
      expect(checkDomainBlocklist).not.toHaveBeenCalled()
    })
  })

  it('checkDomainBlocklist matches numeric id to string id via String coercion', async () => {
    jest.clearAllMocks()
    const ctx = {
      blocklistWarning: null,
      cleanSuggestions: [],
      domainRecords: [
        { text: 'coerce.test', value: 99, extraDatas: [{ value: '2' }, { value: true }] }
      ]
    }
    InputPhishingLink.methods.checkDomainBlocklist.call(ctx, '99')
    await new Promise((r) => setTimeout(r, 0))
    expect(getDomainBlocklistStatus).toHaveBeenCalledWith('coerce.test')
  })
})
