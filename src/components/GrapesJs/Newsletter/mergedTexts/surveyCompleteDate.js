import mergedTextsSurveyCompleteDate from '../blocks/mergedTextsBlocks/surveyCompleteDate'

const surveyCompleteDate = {
  label: 'Survey Complete Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Survey Complete Date'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyCompleteDate
  }
}

export default surveyCompleteDate