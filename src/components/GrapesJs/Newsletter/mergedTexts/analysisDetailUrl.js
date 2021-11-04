import analysisDetailUrlMergeText from '../blocks/mergedTextsBlocks/analysisDetailUrl'

const analysisDetailUrl = {
  label: 'Analysis Url',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Analysis Detail Url'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: analysisDetailUrlMergeText
  }
}

export default analysisDetailUrl
