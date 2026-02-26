import QuishingService from '@/api/quishing'
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
      return LookupLocalStorage.getSingle(21).then((languageOptions) => {
        const options =
          languageOptions?.map((lang) => ({
            text: lang.isoFriendlyName || lang.name,
            value: lang.resourceId
          })) || []
        return Promise.all([
          QuishingService.getScenarioDataDetails(),
          getScenarioDataDetails()
        ]).then(([quishingResponse, phishingResponse]) => {
          const data = quishingResponse?.data?.data || {
            methodTypes: [],
            difficultyTypes: []
          }
          const preferredRaw =
            phishingResponse?.data?.data?.preferredLanguageTypes || []
          const preferredLanguageTypes = preferredRaw
            .map((lang) => ({
              ...lang,
              text: options.find((opt) => opt.value === lang.value)?.text || lang.text || ''
            }))
            .filter((item) => item.text)
          this.scenarioDetailsLookup = {
            ...data,
            preferredLanguageTypes
          }
          return quishingResponse
        })
      })
    }
  }
}
