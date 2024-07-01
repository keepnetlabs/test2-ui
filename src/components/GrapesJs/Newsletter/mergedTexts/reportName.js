import mergedTextsReportName from '../blocks/mergedTextsBlocks/reportName'

const reportName = {
  label: 'Report Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Report name'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsReportName
  }
}

export default reportName
