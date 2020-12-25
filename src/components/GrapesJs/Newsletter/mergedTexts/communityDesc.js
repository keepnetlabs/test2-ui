import mergedTextsCommunityDesc from '../blocks/mergedTextsBlocks/communityDesc'

const communityDesc = {
  label: 'Community Desc',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityDesc
  }
}

export default communityDesc
