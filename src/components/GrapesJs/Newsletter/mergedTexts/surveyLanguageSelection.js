import mergedTextsSurveyLanguageSelection from '../blocks/mergedTextsBlocks/surveyLanguageSelection'

const surveyLanguageSelection = {
  label: 'Survey Language Selection',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Survey Language Selection'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyLanguageSelection
  }
}

export default surveyLanguageSelection