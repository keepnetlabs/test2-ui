import companyLogoMergeText from '../blocks/mergedTextsBlocks/companyLogo'
const companyLogo = {
  label: 'Company Logo',
  category: 'Merge Tags',
  type: 'image',
  src: 'd',
  id: 'logo-url',
  attributes: {
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: false,
    src: '{COMPANYLOGO}',
    id: 'logo-url'
  },
  content: {
    draggable: true,
    type: 'image',
    components: companyLogoMergeText,
    id: 'logo-url',
    src: '{COMPANYLOGO}',
    attributes: {
      icon: 'fa fa-text',
      src: '{COMPANYLOGO}',
      isUrl: false,
      'data-title': 'Company Logo',
      id: 'logo-url'
    }
  }
}

export default companyLogo
