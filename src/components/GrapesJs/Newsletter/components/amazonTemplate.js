import amazonBlock from '../blocks/componentBlocks/amazonBlock'
const AmazonTemplate = {
  label: 'Amazon',
  category: 'Custom Components',
  attributes: {
    title: 'Amazon Template',
    class: 'gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h'
  },
  content: {
    tagName: 'div',
    draggable: true,
    attributes: {
      title: 'Amazon Template',
      class: 'gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h'
    },
    components: amazonBlock
  }
}

export default AmazonTemplate
