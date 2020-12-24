import mergedTextsCommunityUser from '../blocks/mergedTextsBlocks/communityUser'

const communityUser = {
  label: 'Community User',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityUser
  }
}

export default communityUser
