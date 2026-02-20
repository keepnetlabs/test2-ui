import InputPhishingLinkMini from '@/components/Common/Inputs/InputPhishingLinkMini.vue'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'abc123')
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
