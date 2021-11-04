import companyLogoMergeText from '../blocks/mergedTextsBlocks/companyLogo'
import store from '@/store'
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
    id: 'logo-url'
  },
  content: {
    draggable: true,
    type: 'image',
    components: companyLogoMergeText,
    id: 'logo-url',
    attributes: {
      icon: 'fa fa-text',
      isUrl: false,
      'data-title': 'Company Logo',
      id: 'logo-url'
    }
  }
}

export default companyLogo
