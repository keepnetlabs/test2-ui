import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

/**
 * Shared mixin for Quishing/Phishing campaign report tables that need:
 *   - a `languageOptions` lookup (resourceId 21)
 *   - filterable items on the `preferredLanguage` and `emailTemplateLanguage` columns
 *   - a friendly name mapping for the `preferredLanguage` field on each row
 *
 * Components using this mixin must expose:
 *   - `tableOptions.columns` (array)
 *   - `$refs.refTable` (DataTable ref) – optional
 *
 * Behavior is intentionally identical to the inline pattern previously
 * duplicated across the report table components, so this mixin can be
 * adopted incrementally without observable side-effects.
 */
export default {
  data() {
    return {
      languageOptions: []
    }
  },
  methods: {
    callForLanguages() {
      return LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId
          })) || []
        this._setLanguageFilterableItems('preferredLanguage', this.languageOptions)
        this._setLanguageFilterableItems(
          'emailTemplateLanguage',
          this.languageOptions.map((option) => ({
            text: option.text,
            value: option.text
          }))
        )
        this?.$refs?.refTable?.reRenderFilters()
      })
    },
    _setLanguageFilterableItems(property, items) {
      const column = this.tableOptions?.columns?.find(
        (col) => col.property === property
      )
      if (column) {
        this.$set(column, 'filterableItems', items)
      }
    },
    /**
     * Map a row's raw `preferredLanguage` (a backend language code/name)
     * into the friendly text already loaded into `languageOptions`.
     * Falls back to the raw value when no match is found, matching the
     * previous inline implementation exactly.
     */
    mapPreferredLanguage(row) {
      if (!row) return row
      return {
        ...row,
        preferredLanguage:
          (this.languageOptions || []).find(
            (option) => option.languageTypeName === row.preferredLanguage
          )?.text || row.preferredLanguage
      }
    }
  }
}
