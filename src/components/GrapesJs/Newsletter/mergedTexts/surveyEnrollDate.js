import mergedTextsSurveyEnrollDate from '../blocks/mergedTextsBlocks/surveyEnrollDate'

const surveyEnrollDate = {
  label: 'Survey Enroll Date',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Survey Enroll Date'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyEnrollDate
  }
}

export default surveyEnrollDate