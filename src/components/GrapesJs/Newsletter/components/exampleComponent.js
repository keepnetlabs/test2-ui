import exampleBlock from '../blocks/componentBlocks/exampleBlock'
const exampleComponent = {
  label: 'Custom Div POC',
  category: 'Custom Components',
  attributes: {
    title: 'Custom Div Title',
    class: 'gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h'
  },
  content: {
    tagName: 'div',
    draggable: true,
    attributes: {
      title: 'Content Title',
      class: 'gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h'
    },
    components: exampleBlock
  }
}

export default exampleComponent
