import mergedTextsSubject from '../blocks/mergedTextsBlocks/subject'

const subject = {
  label: 'Subject',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Subject of email'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSubject
  }
}

export default subject
