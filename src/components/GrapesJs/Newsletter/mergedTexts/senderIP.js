import mergedTextsSenderIP from '../blocks/mergedTextsBlocks/senderIP'

const senderIP = {
  label: 'Sender IP',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSenderIP
  }
}

export default senderIP
