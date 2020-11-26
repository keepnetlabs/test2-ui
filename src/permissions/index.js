export default {
  PLAYBOOK_PERMISSIONS: {
    MATCHING_PLAYBOOKS_SEARCH: {
      url: 'notified-emails/matching-playbooks/{playbookResourceId}/search',
      hasPermission: false,
      method: 'POST'
    },
    MATCHING_PLAYBOOKS_EXPORT: {
      url: 'notified-emails/matching-playbooks/{playbookResourceId}/search/export',
      hasPermission: false,
      method: 'POST'
    },
    SEARCH: {
      url: 'playbooks/search',
      hasPermission: false,
      method: 'POST'
    },
    GET: {
      url: 'playbooks/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'playbooks',
      hasPermission: false,
      method: 'POST'
    },
    DELETE: {
      url: 'playbooks/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    UPDATE: {
      url: 'playbooks/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    },
    EXPORT: {
      url: 'playbooks/search/export',
      hasPermission: false,
      method: 'POST'
    }
  }
}
