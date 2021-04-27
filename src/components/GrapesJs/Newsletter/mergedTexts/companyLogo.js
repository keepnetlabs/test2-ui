import companyLogoMergeText from '../blocks/mergedTextsBlocks/companyLogo'

const companyLogo = {
  label: 'Company Logo',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: false,
    'data-title': 'Company Logo'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: companyLogoMergeText
  }
}

export default companyLogo
