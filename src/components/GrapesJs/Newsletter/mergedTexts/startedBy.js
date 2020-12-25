import mergedTextsStartedBy from '../blocks/mergedTextsBlocks/startedBy'

const startedBy = {
  label: 'Started By',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsStartedBy
  }
}

export default startedBy
