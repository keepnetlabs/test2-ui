import mergedTextsCurrentDate from '../blocks/mergedTextsBlocks/currentDate'

const currentDate = {
  label: 'Current Date',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsCurrentDate
  }
}

export default currentDate
