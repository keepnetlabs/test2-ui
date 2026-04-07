import AwarenessEducatorService from '@/api/awarenessEducator'
import { getPhishingScenarioLandingPageAndEmailTemplate } from '@/api/phishingsimulator'
import QuishingService from '@/api/quishing'
import SmishingService from '@/api/smishing'

let languagesPromise = null

const getFallbackLanguage = (row = {}) => row.preferredLanguage || ''

const getLanguages = async () => {
  if (!languagesPromise) {
    languagesPromise = AwarenessEducatorService.getLanguages()
      .then((response) => response?.data?.data || [])
      .catch((error) => {
        languagesPromise = null
        throw error
      })
  }

  return languagesPromise
}

const getLanguageNameById = async (languageId) => {
  if (!languageId) return ''

  const languages = await getLanguages()
  const language = languages.find(
    (item) =>
      item.id === languageId ||
      item.value === languageId ||
      item.id?.toString() === languageId?.toString() ||
      item.value?.toString() === languageId?.toString()
  )

  return language?.isoFriendlyName || language?.name || ''
}

export const resolveAgenticRetryLanguage = async (row = {}) => {
  try {
    if (row.activityType === 4 && row.trainingResourceId) {
      const response = await AwarenessEducatorService.getTraining(row.trainingResourceId)
      const training = response?.data?.data || {}
      const languageId =
        training.languageId ||
        training.trainingContents?.[0]?.languageId ||
        training.languages?.[0]?.languageTypeResourceId

      return (
        training.languageTypeName ||
        training.languageName ||
        (await getLanguageNameById(languageId)) ||
        getFallbackLanguage(row)
      )
    }

    if (row.activityType === 1 && row.scenarioResourceId) {
      const response = await getPhishingScenarioLandingPageAndEmailTemplate(row.scenarioResourceId)
      const emailTemplate = response?.data?.data?.emailTemplate || {}

      return (
        emailTemplate.languageTypeName ||
        (await getLanguageNameById(emailTemplate.languageTypeResourceId)) ||
        getFallbackLanguage(row)
      )
    }

    if (row.activityType === 2 && row.scenarioResourceId) {
      const response = await QuishingService.getQuishingScenarioLandingPageAndEmailTemplate(
        row.scenarioResourceId
      )
      const data = response?.data?.data || {}
      const emailTemplate = data.emailTemplate || data.quishingTemplate || {}

      return (
        emailTemplate.languageTypeName ||
        (await getLanguageNameById(emailTemplate.languageTypeResourceId)) ||
        getFallbackLanguage(row)
      )
    }

    if (row.activityType === 3 && row.scenarioResourceId) {
      const response = await SmishingService.previewSmishingScenario(row.scenarioResourceId)
      const textTemplate = response?.data?.data?.textTemplate || {}

      return (
        textTemplate.languageTypeName ||
        (await getLanguageNameById(textTemplate.languageTypeResourceId || textTemplate.languageId)) ||
        getFallbackLanguage(row)
      )
    }
  } catch {
    return getFallbackLanguage(row)
  }

  return getFallbackLanguage(row)
}
