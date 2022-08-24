import mergedTextsTrainingReminderCount from '../blocks/mergedTextsBlocks/trainingReminderCount'

const trainingReminderCount = {
  label: 'Training Reminder Count',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Training Reminder Count'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsTrainingReminderCount
  }
}

export default trainingReminderCount
