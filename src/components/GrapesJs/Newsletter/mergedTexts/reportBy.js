import mergedTextsReportBy from '../blocks/mergedTextsBlocks/reportBy'

const reportBy = {
  label: 'Report By',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsReportBy
  }
}

export default reportBy
