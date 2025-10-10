import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

export default {
  data() {
    return {
      languageFilterOptions: []
    }
  },
  methods: {
    callForLanguages(tableRef) {
      const languageColumnIndex = this.tableOptions.columns.findIndex(
        (column) => column.property === PROPERTY_STORE.LANGUAGE
      )
      if (languageColumnIndex !== -1) {
        LookupLocalStorage.getSingle(21).then((response) => {
          this.languageFilterOptions =
            response?.map((language) => ({
              text: language.isoFriendlyName,
              languageName: language.name,
              value: language.resourceId
            })) || []
          this.$set(this.tableOptions.columns, languageColumnIndex, {
            ...this.tableOptions.columns[languageColumnIndex],
            filterableItems: this.languageFilterOptions
          })
          this?.$refs[tableRef]?.reRenderFilters()
        })
      }
    }
  }
}
