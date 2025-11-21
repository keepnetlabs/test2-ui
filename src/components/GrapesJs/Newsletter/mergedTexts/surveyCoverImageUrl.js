import mergedTextsSurveyCoverImageUrl from '../blocks/mergedTextsBlocks/surveyCoverImageUrl'

const surveyCoverImageUrl = {
  label: 'Survey Cover Image URL',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Survey Cover Image URL'
  },
  content: {
    draggable: true,
    components: mergedTextsSurveyCoverImageUrl
  }
}

export default surveyCoverImageUrl
