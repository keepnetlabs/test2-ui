import mergedTextsCommunityUrl from '../blocks/mergedTextsBlocks/communityUrl'

const communityUrl = {
  label: 'Community URL',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true
  },
  content: {
    draggable: true,
    components: mergedTextsCommunityUrl
  }
}

export default communityUrl
