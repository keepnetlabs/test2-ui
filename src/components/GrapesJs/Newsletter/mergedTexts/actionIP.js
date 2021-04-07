import mergedTextsActionIP from '../blocks/mergedTextsBlocks/actionIP'

const actionIP = {
  label: 'Action IP',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'IP address of device that activation / deactivation occured'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsActionIP
  }
}

export default actionIP
