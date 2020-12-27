import mergedTextsOwner from '../blocks/mergedTextsBlocks/owner'

const owner = {
  label: 'Owner',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsOwner
  }
}

export default owner
