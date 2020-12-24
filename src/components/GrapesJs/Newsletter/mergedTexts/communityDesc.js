import mergedTextsCommunityDesc from '../blocks/mergedTextsBlocks/communityDesc'

const communityDescription = {
  label: 'Community Description',
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

export default communityDescription
