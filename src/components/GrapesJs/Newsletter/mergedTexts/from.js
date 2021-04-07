import mergedTextsFrom from '../blocks/mergedTextsBlocks/from'

const mergedFrom = {
  label: 'From',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Sender email address '
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFrom
  }
}

export default mergedFrom
