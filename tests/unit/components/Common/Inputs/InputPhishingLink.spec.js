jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => 'RND123')
}))

import InputPhishingLink from '@/components/Common/Inputs/InputPhishingLink.vue'

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
      checkSchemaTypes: jest.fn()
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
})
