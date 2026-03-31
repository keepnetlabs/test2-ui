jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => 'RND123')
}))

jest.mock('@/api/domainBlacklist', () => ({
  getDomainBlacklistStatus: jest.fn().mockResolvedValue({ data: {} })
}))

import InputPhishingLink from '@/components/Common/Inputs/InputPhishingLink.vue'
import { getDomainBlacklistStatus } from '@/api/domainBlacklist'

const { watch } = InputPhishingLink

describe('InputPhishingLink.vue', () => {
  it('has correct component name', () => {
    expect(InputPhishingLink.name).toBe('InputPhishingLink')
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
      checkDomainBlacklist: jest.fn()
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
      $nextTick: (cb) => cb()
    }
    InputPhishingLink.methods.checkSchemaTypes.call(ctx, 'd1')
    expect(urlSchemaTypesModified[0].disabled).toBe(false)
    expect(urlSchemaTypesModified[1].disabled).toBe(true)
    expect(ctx.handleInputChange).toHaveBeenCalledWith('1', 'urlSchemaTypeId')
  })

  describe('domainRecords watcher (late-loaded domain list)', () => {
    const records = [
      { text: 'late.example.com', value: 'late-1', extraDatas: [{ value: '2' }, { value: true }] }
    ]

    it('create mode: [] -> items calls setDefaultValue when domainRecordId is empty', () => {
      const setDefaultValue = jest.fn()
      const checkDomainBlacklist = jest.fn()
      const ctx = {
        isEdit: false,
        value: { domainRecordId: '' },
        setDefaultValue,
        checkDomainBlacklist
      }
      watch.domainRecords.call(ctx, records, [])
      expect(setDefaultValue).toHaveBeenCalledTimes(1)
      expect(checkDomainBlacklist).not.toHaveBeenCalled()
    })

    it('edit mode: [] -> items calls checkDomainBlacklist when domainRecordId is set', () => {
      const setDefaultValue = jest.fn()
      const checkDomainBlacklist = jest.fn()
      const ctx = {
        isEdit: true,
        value: { domainRecordId: 'd1' },
        setDefaultValue,
        checkDomainBlacklist
      }
      watch.domainRecords.call(ctx, records, [])
      expect(setDefaultValue).not.toHaveBeenCalled()
      expect(checkDomainBlacklist).toHaveBeenCalledWith('d1')
    })

    it('returns early when new list is empty', () => {
      const setDefaultValue = jest.fn()
      const ctx = { setDefaultValue, checkDomainBlacklist: jest.fn() }
      watch.domainRecords.call(ctx, [], [])
      expect(setDefaultValue).not.toHaveBeenCalled()
    })

    it('does nothing when list was already non-empty', () => {
      const setDefaultValue = jest.fn()
      const checkDomainBlacklist = jest.fn()
      const ctx = { setDefaultValue, checkDomainBlacklist }
      watch.domainRecords.call(ctx, records, records)
      expect(setDefaultValue).not.toHaveBeenCalled()
      expect(checkDomainBlacklist).not.toHaveBeenCalled()
    })
  })

  it('checkDomainBlacklist matches numeric id to string id via String coercion', async () => {
    jest.clearAllMocks()
    const ctx = {
      blacklistWarning: null,
      cleanSuggestions: [],
      domainRecords: [
        { text: 'coerce.test', value: 99, extraDatas: [{ value: '2' }, { value: true }] }
      ]
    }
    InputPhishingLink.methods.checkDomainBlacklist.call(ctx, '99')
    await new Promise((r) => setTimeout(r, 0))
    expect(getDomainBlacklistStatus).toHaveBeenCalledWith('coerce.test')
  })
})
