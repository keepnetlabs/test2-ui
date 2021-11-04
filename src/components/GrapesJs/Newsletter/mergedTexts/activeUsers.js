import mergedTextsActiveUsers from '../blocks/mergedTextsBlocks/activeUsers'

const activeUsers = {
  label: 'Active Users',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    'data-title': 'Number of active users'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsActiveUsers
  }
}

export default activeUsers
