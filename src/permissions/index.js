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
  },
  SMTP_SETTINGS_PERMISSIONS: {
    CREATE: {
      url: 'companies/smtp-settings',
      hasPermission: false,
      method: 'POST'
    },
    SEARCH: {
      url: 'companies/smtp-settings/search',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'companies/smtp-settings/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    },
    DELETE: {
      url: 'companies/smtp-settings/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'companies/smtp-settings/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    EXPORT: {
      url: 'companies/smtp-settings/search/export',
      hasPermission: false,
      method: 'POST'
    }
  },
  WHITE_LABEL_PERMISSIONS: {
    GET: {
      url: 'whitelabeling',
      hasPermission: false,
      method: 'GET'
    },
    UPDATE: {
      url: 'whitelabeling/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    },
    DELETE: {
      url: 'whitelabeling/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    }
  },
  PROXY_SETTINGS_PERMISSIONS: {
    SEARCH: {
      url: 'companies/proxy-settings/search',
      hasPermission: false,
      method: 'POST'
    },
    DELETE: {
      url: 'companies/proxy-settings/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'companies/proxy-settings/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'companies/proxy-settings',
      hasPermission: false,
      method: 'POST'
    },
    EXPORT: {
      url: 'companies/proxy-settings/search/export',
      hasPermission: false,
      method: 'POST'
    },
    TEST: {
      url: 'companies/proxy-settings/test',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'companies/proxy-settings/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    }
  }
}
