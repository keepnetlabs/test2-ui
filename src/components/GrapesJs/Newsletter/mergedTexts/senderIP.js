import mergedTextsSenderIP from '../blocks/mergedTextsBlocks/senderIP'

const senderIP = {
  label: 'Sender IP',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "IP address of email's sender"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSenderIP
  }
}

export default senderIP
