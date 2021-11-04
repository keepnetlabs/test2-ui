import mergedTextsInvitedByCompanyName from '../blocks/mergedTextsBlocks/invitedByCompanyName'

const invitedByCompanyName = {
  label: 'Invited By Company Name',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Company name of the user who sent the invitation'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsInvitedByCompanyName
  }
}

export default invitedByCompanyName
