import InputContentLanguage from '@/components/Common/Inputs/InputContentLanguage.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getContentLanguageItems: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InputContentLanguage.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isAllSelected returns true only when All exists in value', () => {
    expect(InputContentLanguage.computed.isAllSelected.call({ value: ['en', labels.All] })).toBe(true)
    expect(InputContentLanguage.computed.isAllSelected.call({ value: ['en', 'tr'] })).toBe(false)
  })

  it('watch isAllSelected emits all option values on true and empty array on false', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      contentLanguageItems: [
        { text: labels.AllLanguages, value: labels.All },
        { text: 'English', value: 'lang-en' },
        { text: 'Turkish', value: 'lang-tr' }
      ]
    }

    InputContentLanguage.watch.isAllSelected.call(ctx, true)
    expect(emit).toHaveBeenCalledWith('input', [labels.All, 'lang-en', 'lang-tr'])

    InputContentLanguage.watch.isAllSelected.call(ctx, false)
    expect(emit).toHaveBeenCalledWith('input', [])
  })

  it('watch trainingId calls API flow only when new value exists', () => {
    const ctx = { callForContentLanguageItems: jest.fn() }

    InputContentLanguage.watch.trainingId.handler.call(ctx, '')
    expect(ctx.callForContentLanguageItems).not.toHaveBeenCalled()

    InputContentLanguage.watch.trainingId.handler.call(ctx, 'training-1')
    expect(ctx.callForContentLanguageItems).toHaveBeenCalled()
  })

  it('callForContentLanguageItems returns early when trainingId is empty', async () => {
    const ctx = {
      trainingId: '',
      contentLanguageItems: [],
      languageOptions: [],
      isAddDefaultValue: true,
      setDefaultValue: jest.fn(),
      $emit: jest.fn()
    }

    InputContentLanguage.methods.callForContentLanguageItems.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getContentLanguageItems).not.toHaveBeenCalled()
    expect(ctx.contentLanguageItems).toEqual([])
  })

  it('callForContentLanguageItems maps API data, prepends All, emits completion and sets default value', async () => {
    AwarenessEducatorService.getContentLanguageItems.mockResolvedValueOnce({
      data: {
        data: [
          { code: 'en', name: 'English API Name', id: 'lang-en' },
          { code: 'tr', name: 'Turkce API Name', id: 'lang-tr' }
        ]
      }
    })

    const setDefaultValue = jest.fn()
    const emit = jest.fn()
    const ctx = {
      trainingId: 'training-123',
      contentLanguageItems: [],
      languageOptions: [{ code: 'en', isoFriendlyName: 'English Friendly' }],
      isAddDefaultValue: true,
      setDefaultValue,
      $emit: emit
    }

    InputContentLanguage.methods.callForContentLanguageItems.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getContentLanguageItems).toHaveBeenCalledWith('training-123')
    expect(ctx.contentLanguageItems).toEqual([
      { text: labels.AllLanguages, value: labels.All },
      { text: 'English Friendly', value: 'lang-en' },
      { text: 'Turkce API Name', value: 'lang-tr' }
    ])
    expect(emit).toHaveBeenCalledWith('on-api-call-finished')
    expect(setDefaultValue).toHaveBeenCalled()
  })

  it('setDefaultValue emits all current item values', () => {
    const emit = jest.fn()
    const ctx = {
      contentLanguageItems: [
        { text: labels.AllLanguages, value: labels.All },
        { text: 'English', value: 'lang-en' }
      ],
      $emit: emit
    }

    InputContentLanguage.methods.setDefaultValue.call(ctx)
    expect(emit).toHaveBeenCalledWith('input', [labels.All, 'lang-en'])
  })

  it('checkIsItemDisabled and getCheckboxCheckedValue handle All and normal items', () => {
    const ctxAll = {
      isAllSelected: true,
      value: []
    }
    expect(InputContentLanguage.methods.checkIsItemDisabled.call(ctxAll, { value: labels.All })).toBe(false)
    expect(InputContentLanguage.methods.checkIsItemDisabled.call(ctxAll, { value: 'lang-en' })).toBe(true)
    expect(InputContentLanguage.methods.getCheckboxCheckedValue.call(ctxAll, { value: 'lang-en' })).toBe(true)

    const ctxPartial = {
      isAllSelected: false,
      value: ['lang-en']
    }
    expect(InputContentLanguage.methods.getCheckboxCheckedValue.call(ctxPartial, { value: 'lang-en' })).toBe(true)
    expect(InputContentLanguage.methods.getCheckboxCheckedValue.call(ctxPartial, { value: 'lang-tr' })).toBe(false)
  })
})
