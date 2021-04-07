import mergedTextsInvitedUserName from '../blocks/mergedTextsBlocks/invitedUserName'

const invitedUserName = {
  label: 'Invited User Name',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': "Recipient's first and last name"
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsInvitedUserName
  }
}

export default invitedUserName
