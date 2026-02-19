import InputPhishingLinkMini from '@/components/Common/Inputs/InputPhishingLinkMini.vue'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'rnd999')
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
      checkSchemaTypes: jest.fn()
    })
    mounted.call(createModeCtx)
    expect(createModeCtx.setDefaultValue).toHaveBeenCalledTimes(1)
    expect(createModeCtx.checkSchemaTypes).not.toHaveBeenCalled()

    const editModeCtx = createCtx({
      isEdit: true,
      value: { domainRecordId: 'd1' },
      setDefaultValue: jest.fn(),
      checkSchemaTypes: jest.fn()
    })
    mounted.call(editModeCtx)
    expect(editModeCtx.setDefaultValue).not.toHaveBeenCalled()
    expect(editModeCtx.checkSchemaTypes).toHaveBeenCalledWith('d1')
  })

  it('handleChangeDomainRecord calls input change, schema check and relabel', () => {
    const ctx = createCtx({
      handleInputChange: jest.fn(),
      checkSchemaTypes: jest.fn(),
      changeDisabledLabel: jest.fn()
    })

    methods.handleChangeDomainRecord.call(ctx, 'd1')

    expect(ctx.handleInputChange).toHaveBeenCalledWith('d1', 'domainRecordId')
    expect(ctx.checkSchemaTypes).toHaveBeenCalledWith('d1')
    expect(ctx.changeDisabledLabel).toHaveBeenCalled()
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
})
