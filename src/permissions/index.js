const ENUMS = {
  DNS: {
    ROOT_URL: 'phishing-simulator/dns-services'
  },
  DOMAIN: {
    ROOT_URL: 'phishing-simulator/domain-records'
  },
  METHODS: {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE'
  }
}
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
  },
  CAMPAIGN_MANAGER_PARENT: {
    SEARCH: {
      url: 'phishing-simulator/phishing-campaign/search',
      hasPermission: false,
      method: 'POST'
    },
    DELETE: {
      url: 'phishing-simulator/phishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'phishing-simulator/phishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'phishing-simulator/phishing-campaign',
      hasPermission: false,
      method: 'POST'
    },
    EXPORT: {
      url: 'phishing-simulator/phishing-campaign/search/export',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'phishing-simulator/phishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    }
  },
  DNS_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.DNS.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.DNS.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.DNS.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  DOMAIN_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.DOMAIN.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    FORM_DETAILS: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/form-details`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  }
}
