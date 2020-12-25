import mergedTextsInvitedByCompanyName from '../blocks/mergedTextsBlocks/invitedByCompanyName'

const invitedByCompanyName = {
  label: 'Invited By Company Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsInvitedByCompanyName
  }
}

export default invitedByCompanyName
