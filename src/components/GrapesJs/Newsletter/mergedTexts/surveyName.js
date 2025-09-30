import mergedTextsSurveyName from '../blocks/mergedTextsBlocks/surveyName'

const surveyName = {
  label: 'Survey Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Survey Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyName
  }
}

export default surveyName
