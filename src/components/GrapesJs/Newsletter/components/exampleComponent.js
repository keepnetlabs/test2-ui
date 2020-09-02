import exampleBlock from '../blocks/componentBlocks/exampleBlock'
const exampleComponent = {
  label: 'Custom Div 1',
  category: 'Custom Components',
  attributes: {
    title: 'Custom Div Title',
    class: 'gjs-fonts gjs-f-text gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'div',
    draggable: true,
    attributes: {
      title: 'Content Title',
      class: 'gjs-fonts gjs-f-text gjs-block gjs-one-bg gjs-four-color-h',
      icon: 'fa fa-text'
    },
    components: exampleBlock
  }
}

export default exampleComponent
