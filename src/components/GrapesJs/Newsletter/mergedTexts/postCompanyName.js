import mergedTextsPostCompanyName from '../blocks/mergedTextsBlocks/postCompanyName'

const postCompanyName = {
  label: 'Post Company Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Company name of the user who created the post'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsPostCompanyName
  }
}

export default postCompanyName
