import exampleBlock from '../blocks/componentBlocks/exampleBlock'
const exampleComponent2 = {
  label: 'Custom Div 2',
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
      title: 'Content Title 2',
      class: 'gjs-fonts gjs-f-text gjs-block gjs-one-bg gjs-four-color-h',
      icon: 'fa fa-text'
    },
    components: exampleBlock
  }
}

export default exampleComponent2
