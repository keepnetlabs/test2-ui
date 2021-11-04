import mergedTextsCommunityDesc from '../blocks/mergedTextsBlocks/communityDesc'

const communityDesc = {
  label: 'Community Desc',
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
    components: mergedTextsCommunityDesc
  }
}

export default communityDesc
