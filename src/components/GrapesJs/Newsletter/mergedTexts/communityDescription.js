import mergedTextsCommunityDescription from '../blocks/mergedTextsBlocks/communityDescription'

const communityDescription = {
  label: 'Community Description',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Community's description"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityDescription
  }
}

export default communityDescription
