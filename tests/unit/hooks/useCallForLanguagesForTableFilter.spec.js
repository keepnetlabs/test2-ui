import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useCallForLanguagesForTableFilter hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads language options and updates language column filter items', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: 'en' }
    ])
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [{ property: PROPERTY_STORE.LANGUAGE }]
      },
      languageFilterOptions: [],
      $refs: {
        refTable: { reRenderFilters }
      },
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    useCallForLanguagesForTableFilter.methods.callForLanguages.call(ctx, 'refTable')
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageFilterOptions).toEqual([
      {
        text: 'English',
        languageName: 'English',
        value: 'en'
      }
    ])
    expect(ctx.tableOptions.columns[0].filterableItems).toEqual(ctx.languageFilterOptions)
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('does nothing when language column is not present', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'name' }]
      },
      $set: jest.fn(),
      $refs: {}
    }

    useCallForLanguagesForTableFilter.methods.callForLanguages.call(ctx, 'refTable')

    expect(LookupLocalStorage.getSingle).not.toHaveBeenCalled()
  })
})
