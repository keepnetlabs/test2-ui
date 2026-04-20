import useReportLanguageColumns from '@/hooks/useReportLanguageColumns'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const buildCtx = (columns = []) => ({
  tableOptions: { columns },
  languageOptions: [],
  $refs: { refTable: { reRenderFilters: jest.fn() } },
  $set: (obj, key, val) => {
    obj[key] = val
  },
  _setLanguageFilterableItems:
    useReportLanguageColumns.methods._setLanguageFilterableItems
})

describe('useReportLanguageColumns mixin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('data()', () => {
    it('exposes an empty languageOptions array by default', () => {
      expect(useReportLanguageColumns.data()).toEqual({ languageOptions: [] })
    })
  })

  describe('callForLanguages', () => {
    it('loads language options from lookup id 21', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en' },
        { isoFriendlyName: 'Türkçe', name: 'Turkish', resourceId: 'tr' }
      ])
      const ctx = buildCtx([])

      await useReportLanguageColumns.methods.callForLanguages.call(ctx)

      expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
      expect(ctx.languageOptions).toEqual([
        { text: 'English', languageTypeName: 'English', value: 'en' },
        { text: 'Türkçe', languageTypeName: 'Turkish', value: 'tr' }
      ])
    })

    it('patches preferredLanguage and emailTemplateLanguage filterable items', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en' }
      ])
      const ctx = buildCtx([
        { property: 'firstName' },
        { property: 'preferredLanguage' },
        { property: 'emailTemplateLanguage' }
      ])

      await useReportLanguageColumns.methods.callForLanguages.call(ctx)

      expect(ctx.tableOptions.columns[1].filterableItems).toEqual([
        { text: 'English', languageTypeName: 'English', value: 'en' }
      ])
      expect(ctx.tableOptions.columns[2].filterableItems).toEqual([
        { text: 'English', value: 'English' }
      ])
    })

    it('reRenders the table filters after patching', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en' }
      ])
      const ctx = buildCtx([{ property: 'preferredLanguage' }])

      await useReportLanguageColumns.methods.callForLanguages.call(ctx)

      expect(ctx.$refs.refTable.reRenderFilters).toHaveBeenCalled()
    })

    it('handles a null lookup response gracefully', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce(null)
      const ctx = buildCtx([{ property: 'preferredLanguage' }])

      await useReportLanguageColumns.methods.callForLanguages.call(ctx)

      expect(ctx.languageOptions).toEqual([])
      expect(ctx.tableOptions.columns[0].filterableItems).toEqual([])
    })

    it('does not throw when target columns are missing', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en' }
      ])
      const ctx = buildCtx([{ property: 'firstName' }])

      await expect(
        useReportLanguageColumns.methods.callForLanguages.call(ctx)
      ).resolves.not.toThrow()
      expect(ctx.tableOptions.columns[0].filterableItems).toBeUndefined()
    })

    it('is safe when refTable is missing', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en' }
      ])
      const ctx = {
        tableOptions: { columns: [{ property: 'preferredLanguage' }] },
        languageOptions: [],
        $refs: {},
        $set: (obj, key, val) => {
          obj[key] = val
        },
        _setLanguageFilterableItems:
          useReportLanguageColumns.methods._setLanguageFilterableItems
      }

      await expect(
        useReportLanguageColumns.methods.callForLanguages.call(ctx)
      ).resolves.not.toThrow()
      expect(ctx.languageOptions).toHaveLength(1)
    })

    it('is safe when $refs is missing entirely', async () => {
      LookupLocalStorage.getSingle.mockResolvedValueOnce([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en' }
      ])
      const ctx = {
        tableOptions: { columns: [{ property: 'preferredLanguage' }] },
        languageOptions: [],
        $set: (obj, key, val) => {
          obj[key] = val
        },
        _setLanguageFilterableItems:
          useReportLanguageColumns.methods._setLanguageFilterableItems
      }

      await expect(
        useReportLanguageColumns.methods.callForLanguages.call(ctx)
      ).resolves.not.toThrow()
    })
  })

  describe('_setLanguageFilterableItems', () => {
    it('sets filterableItems on the matching column', () => {
      const column = { property: 'preferredLanguage' }
      const ctx = {
        tableOptions: { columns: [{ property: 'firstName' }, column] },
        $set: (obj, key, val) => {
          obj[key] = val
        }
      }

      useReportLanguageColumns.methods._setLanguageFilterableItems.call(
        ctx,
        'preferredLanguage',
        [{ text: 'English', value: 'en' }]
      )

      expect(column.filterableItems).toEqual([{ text: 'English', value: 'en' }])
    })

    it('does nothing when the column is not present', () => {
      const setSpy = jest.fn()
      const ctx = {
        tableOptions: { columns: [{ property: 'firstName' }] },
        $set: setSpy
      }

      useReportLanguageColumns.methods._setLanguageFilterableItems.call(
        ctx,
        'preferredLanguage',
        [{ text: 'English', value: 'en' }]
      )

      expect(setSpy).not.toHaveBeenCalled()
    })

    it('is safe when tableOptions is undefined', () => {
      const setSpy = jest.fn()
      const ctx = { $set: setSpy }

      expect(() =>
        useReportLanguageColumns.methods._setLanguageFilterableItems.call(
          ctx,
          'preferredLanguage',
          []
        )
      ).not.toThrow()
      expect(setSpy).not.toHaveBeenCalled()
    })

    it('is safe when tableOptions.columns is undefined', () => {
      const setSpy = jest.fn()
      const ctx = { tableOptions: {}, $set: setSpy }

      expect(() =>
        useReportLanguageColumns.methods._setLanguageFilterableItems.call(
          ctx,
          'preferredLanguage',
          []
        )
      ).not.toThrow()
      expect(setSpy).not.toHaveBeenCalled()
    })
  })

  describe('mapPreferredLanguage', () => {
    const ctx = {
      languageOptions: [
        { text: 'English', languageTypeName: 'English', value: 'en' },
        { text: 'Türkçe', languageTypeName: 'Turkish', value: 'tr' }
      ]
    }

    it('replaces the raw preferredLanguage with the friendly text', () => {
      const result = useReportLanguageColumns.methods.mapPreferredLanguage.call(ctx, {
        firstName: 'Jane',
        preferredLanguage: 'Turkish'
      })

      expect(result).toEqual({
        firstName: 'Jane',
        preferredLanguage: 'Türkçe'
      })
    })

    it('falls back to the raw value when no match is found', () => {
      const result = useReportLanguageColumns.methods.mapPreferredLanguage.call(ctx, {
        firstName: 'Jane',
        preferredLanguage: 'Klingon'
      })

      expect(result.preferredLanguage).toBe('Klingon')
    })

    it('preserves all other row fields', () => {
      const row = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        preferredLanguage: 'English'
      }

      const result = useReportLanguageColumns.methods.mapPreferredLanguage.call(ctx, row)

      expect(result).toMatchObject({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        preferredLanguage: 'English'
      })
    })

    it('returns row unchanged when row is null', () => {
      expect(
        useReportLanguageColumns.methods.mapPreferredLanguage.call(ctx, null)
      ).toBeNull()
    })

    it('returns row unchanged when row is undefined', () => {
      expect(
        useReportLanguageColumns.methods.mapPreferredLanguage.call(ctx, undefined)
      ).toBeUndefined()
    })

    it('handles empty languageOptions safely', () => {
      const emptyCtx = { languageOptions: [] }
      const result = useReportLanguageColumns.methods.mapPreferredLanguage.call(emptyCtx, {
        preferredLanguage: 'English'
      })

      expect(result.preferredLanguage).toBe('English')
    })

    it('handles undefined languageOptions via the || [] fallback', () => {
      const undefinedCtx = {}
      const result = useReportLanguageColumns.methods.mapPreferredLanguage.call(undefinedCtx, {
        firstName: 'Jane',
        preferredLanguage: 'English'
      })

      expect(result).toEqual({ firstName: 'Jane', preferredLanguage: 'English' })
    })

    it('falls back to raw value when row.preferredLanguage is undefined', () => {
      const result = useReportLanguageColumns.methods.mapPreferredLanguage.call(ctx, {
        firstName: 'Jane'
      })

      expect(result).toEqual({ firstName: 'Jane', preferredLanguage: undefined })
    })
  })
})
