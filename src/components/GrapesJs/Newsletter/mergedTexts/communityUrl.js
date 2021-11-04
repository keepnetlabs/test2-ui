import mergedTextsCommunityUrl from '../blocks/mergedTextsBlocks/communityUrl'

const communityUrl = {
  label: 'Community URL',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': "Link to community's page"
  },
  content: {
    draggable: true,
    components: mergedTextsCommunityUrl
  }
}

export default communityUrl
