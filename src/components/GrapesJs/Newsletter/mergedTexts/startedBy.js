import mergedTextsStartedBy from '../blocks/mergedTextsBlocks/startedBy'

const startedBy = {
  label: 'Started By',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'First and last name of the user who started investigation'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsStartedBy
  }
}

export default startedBy
