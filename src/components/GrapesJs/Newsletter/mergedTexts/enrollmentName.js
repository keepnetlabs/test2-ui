import mergedTextsEnrollmentName from '../blocks/mergedTextsBlocks/enrollmentName'

const enrollmentName = {
  label: 'Enrollment Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Enrollment Name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsEnrollmentName
  }
}

export default enrollmentName
