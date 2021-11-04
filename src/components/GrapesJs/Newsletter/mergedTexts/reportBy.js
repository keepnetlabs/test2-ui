import mergedTextsReportBy from '../blocks/mergedTextsBlocks/reportBy'

const reportBy = {
  label: 'Report By',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'User who reported the email'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsReportBy
  }
}

export default reportBy
