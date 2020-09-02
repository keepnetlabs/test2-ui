import mergedTextsFrom from '../blocks/mergedTextsBlocks/from'

const mergedFrom = {
  label: 'From',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'fa fa-user gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsFrom
  }
}

export default mergedFrom
