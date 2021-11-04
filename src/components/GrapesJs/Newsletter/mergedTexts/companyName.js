import mergedTextsCompanyName from '../blocks/mergedTextsBlocks/companyName'

const companyName = {
  label: 'Company Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Company name of the user who shared the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCompanyName
  }
}

export default companyName
