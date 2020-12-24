import mergedTextsShareCompanyName from '../blocks/mergedTextsBlocks/shareCompanyName'

const shareCompanyName = {
  label: 'Share Company Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsShareCompanyName
  }
}

export default shareCompanyName
