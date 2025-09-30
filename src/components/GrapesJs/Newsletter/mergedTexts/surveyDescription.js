import mergedTextsSurveyDescription from '../blocks/mergedTextsBlocks/surveyDescription'

const surveyDescription = {
  label: 'Survey Description',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Survey Description'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyDescription
  }
}

export default surveyDescription