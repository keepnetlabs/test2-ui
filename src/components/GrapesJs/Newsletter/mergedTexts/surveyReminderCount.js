import mergedTextsSurveyReminderCount from '../blocks/mergedTextsBlocks/surveyReminderCount'

const surveyReminderCount = {
  label: 'Survey Reminder Count',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Survey Reminder Count'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyReminderCount
  }
}

export default surveyReminderCount
