import mergedTextsShareCompanyName from '../blocks/mergedTextsBlocks/shareCompanyName'

const shareCompanyName = {
  label: 'Share Company Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Post owner's company"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsShareCompanyName
  }
}

export default shareCompanyName
