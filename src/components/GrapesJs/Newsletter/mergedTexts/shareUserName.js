import mergedTextsShareUserName from '../blocks/mergedTextsBlocks/shareUserName'

const shareUserName = {
  label: 'Share User Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Post owner's name"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsShareUserName
  }
}

export default shareUserName
