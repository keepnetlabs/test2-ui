import { getScenarioDataDetails } from '@/api/scenarios'

export default {
  data() {
    return {
      scenarioDetailsLookup: null
    }
  },
  methods: {
    callForScenarioDetails() {
      return getScenarioDataDetails().then((response) => {
        this.scenarioDetailsLookup = response?.data?.data || {
          methodTypes: [],
          difficultyTypes: [],
          languageTypes: [],
          preferredLanguageTypes: [],
          companyLanguageTypeResourceId: ''
        }
        return response
      })
    }
  }
}
