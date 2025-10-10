import { getScenarioDataDetails } from '@/api/scenarios'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
export default {
  data() {
    return {
      scenarioDetailsLookup: null
    }
  },
  methods: {
    callForScenarioDetails() {
      LookupLocalStorage.getSingle(21).then((response) => {
        const languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            value: language.resourceId
          })) || []
        return getScenarioDataDetails().then((response) => {
          const data = response?.data?.data || {
            methodTypes: [],
            difficultyTypes: [],
            languageTypes: [],
            preferredLanguageTypes: [],
            companyLanguageTypeResourceId: ''
          }
          const languageTypes =
            data.languageTypes?.map((lang) => ({
              ...lang,
              text: languageOptions.find((option) => option.value === lang.value)?.text || lang.text
            })) || []
          const preferredLanguageTypes =
            data.preferredLanguageTypes?.map((lang) => ({
              ...lang,
              text: languageOptions.find((option) => option.value === lang.value)?.text || lang.text
            })) || []
          this.scenarioDetailsLookup = {
            ...data,
            languageTypes,
            preferredLanguageTypes
          }
          return response
        })
      })
    }
  }
}
