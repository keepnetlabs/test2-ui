import mergedTextsCompanyName from '../blocks/mergedTextsBlocks/companyName'

const companyName = {
  label: 'Company Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCompanyName
  }
}

export default companyName
