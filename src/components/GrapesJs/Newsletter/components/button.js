import buttonBlock from '../blocks/componentBlocks/buttonBlock'

const button = {
  label: 'General Button',
  category: 'Basic',
  id: 'general-button',
  attributes: {
    class: 'gjs-fonts gjs-f-button gjs-block gjs-one-bg gjs-four-color-h',
    style: 'order:-1',
    category: 'Basic'
  },
  content: {
    tagName: 'div',
    type: 'general-button',
    draggable: true,
    components: buttonBlock
  }
}

export default button
