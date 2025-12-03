import mergedTextsUserLanguage from '../blocks/mergedTextsBlocks/userLanguage'

const userLanguage = {
  label: 'User Language',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "User's language"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsUserLanguage
  }
}

export default userLanguage
