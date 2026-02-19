import companyName from '@/components/GrapesJs/Newsletter/mergedTexts/companyName'
import userName from '@/components/GrapesJs/Newsletter/mergedTexts/userName'
import trainingName from '@/components/GrapesJs/Newsletter/mergedTexts/trainingName'
import surveyName from '@/components/GrapesJs/Newsletter/mergedTexts/surveyName'
import submitButton from '@/components/GrapesJs/Newsletter/components/submitButton'
import outlookButton from '@/components/GrapesJs/Newsletter/components/outlookButton'
import exampleComponent from '@/components/GrapesJs/Newsletter/components/exampleComponent'
import amazonTemplate from '@/components/GrapesJs/Newsletter/components/amazonTemplate'
import mergedTextsCompanyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/companyName'
import mergedTextsUserName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userName'
import mergedTextsTrainingName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingName'
import mergedTextsSurveyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyName'

describe('GrapesJs newsletter modules', () => {
  it('merged text modules have merge-tag shape', () => {
    const mergedModules = [companyName, userName, trainingName, surveyName]
    mergedModules.forEach((item) => {
      expect(item.category).toBe('Merge Tags')
      expect(item.content.tagName).toBe('span')
      expect(item.content.draggable).toBe(true)
    })
  })

  it('button/component modules expose expected structure', () => {
    expect(submitButton.id).toBe('phishing-email-submit-button')
    expect(submitButton.content.tagName).toBe('input')

    expect(outlookButton.id).toBe('outlook-button')
    expect(outlookButton.content).toContain('outlook-button-href-id')

    expect(exampleComponent.category).toBe('Custom Components')
    expect(amazonTemplate.category).toBe('Custom Components')
  })

  it('merged text block modules contain expected tokens', () => {
    expect(mergedTextsCompanyName[0].content).toBe('{COMPANYNAME}')
    expect(mergedTextsUserName[0].content).toBe('{USERNAME}')
    expect(mergedTextsTrainingName[0].content).toBe('{TRAININGNAME}')
    expect(mergedTextsSurveyName[0].content).toBe('{SURVEYNAME}')
  })
})
