export const mapLanguageCodeToText = (languageCode = '', languageOptions = []) => {
  if (!languageCode) return ''

  const mappedLanguage = languageOptions.find((lang) => lang.languageShortCode === languageCode)
  return mappedLanguage?.text || languageCode
}

export const collectScenarioLanguages = (scenarios = [], languageOptions = []) => {
  const languages = new Set()

  const addLanguage = (languageCode) => {
    const mappedLanguage = mapLanguageCodeToText(languageCode, languageOptions)
    if (mappedLanguage) languages.add(mappedLanguage)
  }

  scenarios.forEach((scenario = {}) => {
    if (Array.isArray(scenario.emailTemplateInfos) && scenario.emailTemplateInfos.length) {
      scenario.emailTemplateInfos.forEach((emailTemplateInfo = {}) => {
        addLanguage(emailTemplateInfo.languageShortCode)
      })
      return
    }

    const singleLanguageCode =
      scenario.emailTemplateInfo?.languageShortCode ||
      scenario.textTemplateInfo?.languageShortCode ||
      scenario.landingPageTemplateInfo?.languageShortCode ||
      scenario.quishingTemplateInfo?.languageShortCode ||
      scenario.scenarioInfo?.languageShortCode ||
      scenario.languageShortCode

    addLanguage(singleLanguageCode)
  })

  return Array.from(languages)
}
