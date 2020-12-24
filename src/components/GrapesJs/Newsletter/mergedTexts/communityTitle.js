import mergedTextsCommunityTitle from '../blocks/mergedTextsBlocks/communityTitle'

const communityTitle = {
  label: 'Community Title',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityTitle
  }
}

export default communityTitle
