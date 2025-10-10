import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  data() {
    return {
      scormTypes: [],
      categories: [],
      languages: [],
      tableLanguageFilter: [],
      targetAudiences: []
    }
  },
  created() {
    this.callForCategories()
    this.callForLanguages()
    this.callForTargetAudiences()
    this.callForScormTypes()
  },
  methods: {
    callForCategories() {
      AwarenessEducatorService.getCategories().then((response) => {
        this.categories =
          response?.data?.data?.map((category) => ({
            text: category.displayName || category.name,
            value: category.name
          })) || []
      })
    },
    callForScormTypes() {
      AwarenessEducatorService.getScormTypes().then((response) => {
        this.scormTypes =
          response?.data?.data?.map((type) => ({
            text: type.displayName,
            value: type.name
          })) || []
      })
    },
    callForLanguages() {
      AwarenessEducatorService.getLanguages().then((response) => {
        this.languages = response?.data?.data
        this.tableLanguageFilter =
          response?.data?.data?.map((language) => ({
            text: language.isoFriendlyName,
            value: language.code
          })) || []
      })
    },
    callForTargetAudiences() {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        this.targetAudiences =
          response?.data?.data?.map((targetAudience) => ({
            text: targetAudience.displayName,
            value: targetAudience.name
          })) || []
      })
    }
  }
}
