import mergedTextsOwner from '../blocks/mergedTextsBlocks/owner'

const owner = {
  label: 'Owner',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Recipient's first and last name"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsOwner
  }
}

export default owner
