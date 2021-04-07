import mergedTextsCommunityIndustry from '../blocks/mergedTextsBlocks/communityIndustry'

const communityIndustry = {
  label: 'Community Industry',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Community's industry category"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCommunityIndustry
  }
}

export default communityIndustry
