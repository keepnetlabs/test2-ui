import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  data() {
    return {
      scormTypes: [],
      categories: [],
      languages: [{ code: 'AF', id: '1d39036b-00f6-4197-9efa-f49b0e0ef9bb', name: 'Afrikaans' }],
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
          response?.data?.data?.map((category) => ({ text: category.name, value: category.id })) ||
          []
      })
    },
    callForScormTypes() {
      AwarenessEducatorService.getScormTypes().then((response) => {
        this.scormTypes =
          response?.data?.data?.map((category) => ({
            text: category.name,
            value: category.name
          })) || []
      })
    },
    callForLanguages() {
      AwarenessEducatorService.getLanguages().then((response) => {
        this.languages = response?.data?.data

        this.tableLanguageFilter =
          response?.data?.data?.map((language) => ({
            text: language.name,
            value: language.code
          })) || []
      })
    },
    callForTargetAudiences() {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        this.targetAudiences =
          response?.data?.data?.map((targetAudience) => ({
            text: targetAudience.name,
            value: targetAudience.id
          })) || []
      })
    }
  }
}
