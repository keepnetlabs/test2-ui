import QuishingService from '@/api/quishing'
export default {
  data() {
    return {
      scenarioDetailsLookup: null
    }
  },
  methods: {
    callForScenarioDetails() {
      return QuishingService.getScenarioDataDetails().then((response) => {
        this.scenarioDetailsLookup = response?.data?.data || {
          methodTypes: [],
          difficultyTypes: []
        }
        return response
      })
    }
  }
}
