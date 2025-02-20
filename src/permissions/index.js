const ENUMS = {
  DNS: {
    ROOT_URL: 'phishing-simulator/dns-services'
  },
  QUISHING_DNS: {
    ROOT_URL: 'quishing-simulator/dns-services'
  },
  DOMAIN: {
    ROOT_URL: 'phishing-simulator/domain-records'
  },
  QUISHING_DOMAIN: {
    ROOT_URL: 'quishing-simulator/domain-records'
  },
  SCIM: {
    ROOT_URL: 'scim'
  },
  SIEM_INTEGRATION: {
    ROOT_URL: 'companies/siem-settings'
  },
  DIRECT_EMAIL_CREATION: {
    ROOT_URL: 'companies/direct-email-settings'
  },
  METHODS: {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  }
}
export default {
  DASHBOARD_PERMISSIONS: {
    WIDGETS: {
      url: `dashboard/widgets`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    WIDGET_POST: {
      url: `dashboard/widgets`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMMUNITY_POST_TOP_POSTS: {
      url: `community-posts/top-posts`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    COMMUNITY_POSTS: {
      url: 'community-posts/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NOTIFIED_EMAIL: {
      url: `notified-emails/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUMMARY: {
      url: `dashboard/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    REPORTED_EMAIL_TRENDS: {
      url: 'dashboard/reported-email-trends',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    IR_SUMMARY: {
      url: 'ir/dashboard/summary',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    IR_TOP_RULES: {
      url: 'ir/dashboard/top-rules',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    IR_RUNNING_INVESTIGATIONS: {
      url: 'ir/dashboard/running-investigations',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    REPORTERS: {
      url: 'dashboard/reporters',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  THREAT_SHARING_LEFT_MENU_PERMISSIONS: {
    ALL_COMMUNITIES: {
      url: `communities/search/all`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MY_COMMUNITIES: {
      url: `communities/search/my`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMMUNITY_POSTS: {
      url: `community-posts/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  THREAT_SHARING_PERMISSIONS: {
    MY_INVITATIONS: {
      url: `communities/my-invitations`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE_COMMUNITY: {
      url: 'communities',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_COMMUNITYT: {
      url: 'communities/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    LEAVE_COMMUNITYT: {
      url: 'communities/{resourceId}/leave',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_COMMUNITY: {
      url: 'communities/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    POST_INCIDENT: {
      url: 'community-posts',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    INVITE_TO_COMMUNITY: {
      url: 'communities/{resourceId}/invite',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MY_LAST_POSTS: {
      url: 'community-posts/my-last-posts',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    TOP_POSTS: {
      url: 'community-posts/top-posts',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SUGGESTED_COMMUNITIES: {
      url: 'communities/suggested',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    GET_POST: {
      url: 'community-posts/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SHARE_POST: {
      url: 'community-posts/{resourceId}/share',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_POST: {
      url: 'community-posts/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    CREATE_COMMENT: {
      url: 'community-posts/{communityPostResourceId}/comments',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_COMMENT: {
      url: 'community-posts/comments/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE_COMMENT: {
      url: 'community-posts/comments/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET_INCIDENTS: {
      url: 'community-posts/search/{communityResourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET_MEMBERS: {
      url: 'communities/{resourceId}/member',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS: {
    EMAIL_TEMPLATE: {
      url: `phishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_SCENARIO: {
      url: `phishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DNS: {
      url: `phishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `phishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  PHISHING_SCENARIO_LEFT_MENU_PERMISSIONS: {
    EMAIL_TEMPLATE: {
      url: `phishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_SCENARIO: {
      url: `phishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    LANDING_PAGE: {
      url: 'phishing-simulator/landing-page-template',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  PHISHING_SCENARIO_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `phishing-simulator/phishing-scenario/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `phishing-simulator/phishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `phishing-simulator/phishing-scenario`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `phishing-simulator/phishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `phishing-simulator/phishing-scenario/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  EMAIL_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/email-templates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `phishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `phishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `phishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `phishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `phishing-simulator/email-templates/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  LANDING_PAGE_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: 'phishing-simulator/landing-page-template/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `phishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `phishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `phishing-simulator/landing-page-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `phishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `phishing-simulator/landing-page-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS: {
    CAMPAIGN_MANAGER: {
      url: `phishing-simulator/phishing-campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SETTINGS_LEFT_MENU_PERMISSIONS: {
    DNS: {
      url: `phishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `phishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_SIMULATOR_LEFT_MENU_PERMISSIONS: {
    EMAIL_TEMPLATE: {
      url: `quishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_SCENARIO: {
      url: `quishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DNS: {
      url: `quishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `quishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_SCENARIO_LEFT_MENU_PERMISSIONS: {
    EMAIL_TEMPLATE: {
      url: `quishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_SCENARIO: {
      url: `quishing-simulator/quishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    LANDING_PAGE: {
      url: 'quishing-simulator/landing-page-template',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_SCENARIO_PERMISSIONS: {
    SEARCH: {
      url: `quishing-simulator/quishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `quishing-simulator/quishing-scenario/preview/{templateType}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `quishing-simulator/quishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `quishing-simulator/quishing-scenario`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `quishing-simulator/quishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `quishing-simulator/quishing-scenario/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_EMAIL_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `quishing-simulator/quishing-templates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `quishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `quishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `quishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `quishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `quishing-simulator/quishing-templates/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_LANDING_PAGE_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: 'quishing-simulator/landing-page-template/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `quishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `quishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `quishing-simulator/landing-page-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `quishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `quishing-simulator/landing-page-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS: {
    CAMPAIGN_MANAGER: {
      url: `quishing-simulator/quishing-campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_SETTINGS_LEFT_MENU_PERMISSIONS: {
    DNS: {
      url: `quishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `quishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_CAMPAIGN_MANAGER_PARENT: {
    SEARCH: {
      url: 'quishing-simulator/quishing-campaign/search',
      hasPermission: false,
      method: 'POST'
    },
    PREVIEW: {
      url: 'quishing-simulator/quishing-campaign/preview/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    DELETE: {
      url: 'quishing-simulator/quishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'quishing-simulator/quishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'quishing-simulator/quishing-campaign',
      hasPermission: false,
      method: 'POST'
    },
    EXPORT: {
      url: 'quishing-simulator/quishing-campaign/search/export',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'quishing-simulator/quishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    }
  },
  QUISHING_DNS_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.QUISHING_DNS.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.QUISHING_DNS.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.QUISHING_DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.QUISHING_DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.QUISHING_DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.QUISHING_DNS.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_DOMAIN_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    FORM_DETAILS: {
      url: `${ENUMS.QUISHING_DOMAIN.ROOT_URL}/form-details`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  QUISHING_EXCLUDE_IP_ADDRESS_PERMISSIONS: {
    GET: {
      url: `quishing-simulator/excluded-ip-list`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    POST: {
      url: `quishing-simulator/excluded-ip`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_SIMULATOR_LEFT_MENU_PERMISSIONS: {
    SMISHING_SCENARIOS: {
      url: `smishing-simulator/smishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CAMPAIGN_MANAGER: {
      url: `smishing-simulator/smishing-campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DNS: {
      url: `smishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `smishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_SCENARIOS_LEFT_MENU_PERMISSIONS: {
    SCENARIOS: {
      url: `smishing-simulator/smishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    TEXT_TEMPLATES: {
      url: `smishing-simulator/text-templates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: 'smishing-simulator/landing-page-template/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS: {
    CAMPAIGN_MANAGER: {
      url: 'smishing-simulator/smishing-campaign/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_SCENARIOS_PERMISSIONS: {
    SEARCH: {
      url: `smishing-simulator/smishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `smishing-simulator/smishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `smishing-simulator/smishing-scenario`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `smishing-simulator/smishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `smishing-simulator/smishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    PREVIEW: {
      url: `smishing-simulator/smishing-scenario/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `smishing-simulator/smishing-scenario/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_TEXT_MESSAGE_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `smishing-simulator/text-templates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `smishing-simulator/text-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `smishing-simulator/text-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `smishing-simulator/text-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `smishing-simulator/text-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `smishing-simulator/text-templates/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_LANDING_PAGE_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: 'smishing-simulator/landing-page-template/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `smishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `smishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `smishing-simulator/landing-page-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `smishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `smishing-simulator/landing-page-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_CAMPAIGN_MANAGER_PERMISSIONS: {
    SEARCH: {
      url: 'smishing-simulator/smishing-campaign/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `smishing-simulator/smishing-campaign/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `smishing-simulator/smishing-campaign/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `smishing-simulator/smishing-campaign`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `smishing-simulator/smishing-campaign/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `smishing-simulator/smishing-campaign/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_CAMPAIGN_JOB_PERMISSIONS: {
    SEARCH: {
      url: 'smishing-simulator/smishing-campaign-job-report/{resourceId}/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    START: {
      url: 'smishing-simulator/smishing-campaign-job/start/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    LAUNCH: {
      url: 'smishing-simulator/smishing-campaign-job/start/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    STOP: {
      url: 'smishing-simulator/smishing-campaign-job/stop/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.PATCH
    },
    DELETE: {
      url: `smishing-simulator/smishing-campaign-job/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    RESEND: {
      url: 'smishing-simulator/smishing-campaign-job/resend/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    RESEND_LIST: {
      url: 'smishing-simulator/smishing-campaign-job/resend/list/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EXPORT: {
      url: `smishing-simulator/smishing-campaign-job-report/{resourceId}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_REPORT_PERMISSIONS: {
    SUMMARY: {
      url: 'smishing-simulator/smishing-campaign-job-report/summary/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SEARCH_TYPE: {
      url:
        'smishing-simulator/smishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    TYPE_EXPORT: {
      url:
        'smishing-simulator/smishing-campaign-job-report/{searchType}/search/export/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CLICKED_DETAILS: {
      url: 'smishing-simulator/smishing-campaign-job-report/search-sms-clicked/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUBMITTED_DATA_DETAILS: {
      url: 'smishing-simulator/smishing-campaign-job-report/search-sms-submitted/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUBMITTED_MFA_DETAILS: {
      url: 'smishing-simulator/smishing-campaign-job-report/search-mfa-submitted/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOWNLOAD_REPORT: {
      url: 'smishing-simulator/smishing-campaign-job-report/export/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  SMISHING_SETTINGS_LEFT_MENU_PERMISSIONS: {
    DOMAIN: {
      url: `smishing-simulator/domian-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DNS: {
      url: `smishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_DNS_PERMISSIONS: {
    SEARCH: {
      url: `smishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `smishing-simulator/dns-services`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `smishing-simulator/dns-services/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `smishing-simulator/dns-services/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `smishing-simulator/dns-services/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `smishing-simulator/dns-services/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SMISHING_DOMAIN_PERMISSIONS: {
    SEARCH: {
      url: `smishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `smishing-simulator/domain-records`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `smishing-simulator/domain-records/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `smishing-simulator/domain-records/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `smishing-simulator/domain-records/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `smishing-simulator/domain-records/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    FORM_DETAILS: {
      url: `smishing-simulator/domain-records/form-details`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  SMISHING_EXCLUDED_IP_PERMISSIONS: {
    GET: {
      url: `smishing-simulator/excluded-ip-list`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    POST: {
      url: `smishing-simulator/excluded-ip`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  VISHING_LEFT_MENU_PERMISSIONS: {
    VISHING_TEMPLATES: {
      url: `vishing-template/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    VISHING_CAMPAIGN_MANAGER: {
      url: `vishing-campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  VISHING_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `vishing-template/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `vishing-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `vishing-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `vishing-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `vishing-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    PREVIEW: {
      url: `vishing-template/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `vishing-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  VISHING_CAMPAIGN_MANAGER_PERMISSIONS: {
    SEARCH: {
      url: `vishing-campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `vishing-campaign/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `vishing-campaign`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `vishing-campaign/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `vishing-campaign/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    STOP: {
      url: `vishing-campaign/stop/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    PREVIEW: {
      url: `vishing-campaign/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    LAUNCH: {
      url: `vishing-campaign/launch/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    EXPORT: {
      url: `vishing-campaign/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  VISHING_REPORTS_PERMISSIONS: {
    SUMMARY: {
      url: `vishing-report/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    USERS: {
      url: `vishing-report/{resourceId}/users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    ANSWERED: {
      url: `vishing-report/{resourceId}/answered/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DIALLED_NUMBER: {
      url: `vishing-report/{resourceId}/dialed-number/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NO_RESPONSE: {
      url: `vishing-report/{resourceId}/no-response/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    RESEND: {
      url: `vishing-report/resend/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  AWARENESS_EDUCATOR_LIST_GROUP_PERMISSIONS: {
    TRAININGS: {
      url: `trainings/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    ENROLLMENTS: {
      url: `enrollments/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CERTIFICATES: {
      url: `certificates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  AWARENESS_EDUCATOR_PERMISSIONS: {
    SEND_TRAINING: {
      url: `enrollments`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE_TRAINING: {
      url: `trainings/draft`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_TRAINING: {
      url: `trainings/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE_TRAINING: {
      url: `trainings/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT_TRAINING: {
      url: `trainings/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_ENROLLMENT: {
      url: `enrollments/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE_ENROLLMENT: {
      url: `enrollments/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT_ENROLLMENT: {
      url: `enrollments/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_CERTIFICATE: {
      url: `certificates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE_CERTIFICATE: {
      url: `certificates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    CREATE_CERTIFICATE: {
      url: `certificates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EXPORT_CERTIFICATE: {
      url: `certificates/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  TRAINING_REPORTS_PERMISSIONS: {
    SEARCH_REPORTS: {
      url: `training-reports/{enrollmentId}/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  INCIDENT_RESPONDER_LIST_GROUP_PERMISSIONS: {
    NOTIFIED_EMAIL: {
      url: `notified-emails/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUMMARY: {
      url: `is/dashboard/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH_LOG: {
      url: `is/dashboard/search-log`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH_STATS: {
      url: `is/dashboard/search-stats`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NOTIFY_RESULT: {
      url: `notify/result`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    INVESTIGATIONS: {
      url: `investigations/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    INTEGRATIONS: {
      url: `analysis-engines/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PLAYBOOKS: {
      url: `playbooks/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MAIL_CONFIGURATIONS: {
      url: `mail-configurations/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  INCIDENT_RESPONDER_LEFT_MENU_PERMISSIONS: {
    NOTIFIED_EMAIL: {
      url: `notified-emails/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  INCIDENT_RESPONDER_OTHER_PERMISSIONS: {
    RE_ANALYZE: {
      url: `notified-emails/{resourceId}/reanalyze`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    GET_ROI_SETTINGS: {
      url: 'companies/roi-settings',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    POST_ROI_SETTINGS: {
      url: 'companies/roi-settings',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  INVESTIGATION_PERMISSIONS: {
    GET: {
      url: `investigations/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    STOP: {
      url: `investigations/{resourceId}/cancel`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    SEARCH: {
      url: `investigations/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    POST: {
      url: `investigations`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    RE_ANALYZE: {
      url: `notified-emails/{resourceId}/reanalyze`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  INTEGRATION_PERMISSIONS: {
    SEARCH: {
      url: `analysis-engines/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `analysis-engines/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DISABLE: {
      url: `analysis-engines/{resourceId}/disable`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    EXPORT: {
      url: `analysis-engines/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    POST: {
      url: `analysis-engines`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `analysis-engines/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  ADVANCED_SETTINGS_PERMISSIONS: {
    SEARCH: {
      url: `analysis-engines/analysis-exclusions`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    UPDATE: {
      url: `analysis-engines/analysis-exclusions`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    }
  },
  PHISHING_REPORTER_LEFT_MENU_PERMISSIONS: {
    SEARCH: {
      url: `phishing-reporter/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `phishing-reporter`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  PHISHING_REPORTER_PERMISSIONS: {
    SEARCH: {
      url: `phishing-reporter/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUMMARY: {
      url: `phishing-reporter/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    GET: {
      url: `phishing-reporter`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SAVE: {
      url: `phishing-reporter`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_USER: {
      url: `phishing-reporter-users/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  REPORTS_LEFT_MENU_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/phishing-campaign-job-report/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    ADVANCED_REPORTS_SEARCH: {
      url: `pbi/reports/{companyResourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXECUTIVE_REPORTS_SEARCH: {
      url: 'executive-report/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SCHEDULED_REPORTS_SEARCH: {
      url: 'report-scheduling/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  ADVANCED_REPORTS_PERMISSIONS: {
    SEARCH: {
      url: `pbi/reports/{companyResourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  EXECUTIVE_REPORTS_PERMISSIONS: {
    SEARCH: {
      url: 'executive-report/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SCHEDULED_REPORTS_PERMISSIONS: {
    SEARCH: {
      url: 'report-scheduling/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CAMPAIGN_REPORTS_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/phishing-campaign-job-report/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `phishing-simulator/phishing-campaign-job-report/summary/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    DELETE: {
      url: `phishing-simulator/phishing-campaign-job/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    OPENED: {
      url: `phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_DETAILS: {
      url: `phishing-simulator/phishing-campaign-job-report/search-email-opened/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CLICKED: {
      url: `phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CLICKED_DETAILS: {
      url: `phishing-simulator/phishing-campaign-job-report/search-email-clicked/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_ATTACHMENT: {
      url: `phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_ATTACHMENT_DETAILS: {
      url: `phishing-simulator/phishing-campaign-job-report/search-email-opened-attachment/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUBMITTED_DATA: {
      url: `phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUBMITTED_DATA_DETAILS: {
      url: `phishing-simulator/phishing-campaign-job-report/search-email-submitted/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NO_RESPONSE: {
      url: `phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_REPORTER: {
      url: `phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_REPORTER_DETAILS: {
      url: `phishing-simulator/phishing-campaign-job-report/search-email-reported/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SENDING_REPORT: {
      url: `phishing-simulator/phishing-campaign-job-report/summary/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SENDING_REPORT_DETAILS: {
      url: `phishing-simulator/phishing-campaign-job-report/summary/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    RESEND: {
      url: `phishing-simulator/phishing-campaign-job-report/resend/list/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  QUISHING_CAMPAIGN_REPORTS_PERMISSIONS: {
    SEARCH: {
      url: `quishing-simulator/quishing-campaign-job-report/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `quishing-simulator/quishing-campaign-job-report/summary/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    DELETE: {
      url: `quishing-simulator/quishing-campaign-job/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    OPENED: {
      url: `quishing-simulator/quishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_DETAILS: {
      url: `quishing-simulator/quishing-campaign-job-report/search-email-opened/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CLICKED: {
      url: `quishing-simulator/quishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CLICKED_DETAILS: {
      url: `quishing-simulator/quishing-campaign-job-report/search-email-clicked/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_ATTACHMENT: {
      url: `quishing-simulator/quishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_ATTACHMENT_DETAILS: {
      url: `quishing-simulator/quishing-campaign-job-report/search-email-opened-attachment/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUBMITTED_DATA: {
      url: `quishing-simulator/quishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUBMITTED_DATA_DETAILS: {
      url: `quishing-simulator/quishing-campaign-job-report/search-email-submitted/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NO_RESPONSE: {
      url: `quishing-simulator/quishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_REPORTER: {
      url: `quishing-simulator/quishing-campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_REPORTER_DETAILS: {
      url: `quishing-simulator/quishing-campaign-job-report/search-email-reported/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SENDING_REPORT: {
      url: `quishing-simulator/quishing-campaign-job-report/summary/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SENDING_REPORT_DETAILS: {
      url: `quishing-simulator/quishing-campaign-job-report/summary/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    RESEND: {
      url: `quishing-simulator/quishing-campaign-job-report/resend/list/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  COMPANY_LEFT_MENU_PERMISSIONS: {
    TARGET_USERS: {
      url: `target-users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    TARGET_GROUPS: {
      url: `target-groups/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMPANY_GROUPS: {
      url: `company-groups/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMPANY: {
      url: `companies/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SMTP_SETTINGS: {
      url: `companies/smtp-settings/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    ACCOUNT_PRIVACY: {
      url: `companies/privacy`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    ROLES: {
      url: `roles/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SYSTEM_USERS: {
      url: `system-users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    AUDIT_LOGS: {
      url: `audit-logs`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    JOB_LOGS: {
      url: 'jobs',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  TARGET_USERS_PERMISSIONS: {
    SEARCH: {
      url: `target-users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `target-users`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `target-users/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `target-users/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  TARGET_GROUPS_PERMISSIONS: {
    SEARCH: {
      url: `target-groups/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `target-groups`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `target-groups/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `target-groups/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    DELETE_USERS: {
      url: `target-groups/{resourceId}/users`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  COMPANIES_PERMISSIONS: {
    SEARCH: {
      url: `companies/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `companies`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `companies/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `companies/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  COMPANY_GROUPS_PERMISSIONS: {
    SEARCH: {
      url: `company-groups/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `company-groups`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT: {
      url: `company-groups/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `company-groups/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
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
  MAIL_CONFIGURATION_PERMISSIONS: {
    O365_POST: {
      url: 'mail-configurations/o365',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    O365_UPDATE: {
      url: 'mail-configurations/o365/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    SEARCH: {
      url: 'mail-configurations/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    O365_DELETE: {
      url: 'mail-configurations/o365/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  CAMPAIGN_MANAGER_PARENT: {
    SEARCH: {
      url: 'phishing-simulator/phishing-campaign/search',
      hasPermission: false,
      method: 'POST'
    },
    PREVIEW: {
      url: 'phishing-simulator/phishing-campaign/preview/{resourceId}',
      hasPermission: false,
      method: 'GET'
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
  },
  EXCLUDE_IP_ADDRESS_PERMISSIONS: {
    GET: {
      url: `phishing-simulator/excluded-ip-list`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    POST: {
      url: `phishing-simulator/excluded-ip`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
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
  NOTIFICATION_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `companies/email-templates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `companies/email-templates/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `companies/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `companies/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `companies/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `companies/email-templates/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MAKE_DEFAULT: {
      url: `companies/email-templates/make-default/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    }
  },
  REST_API_PERMISSIONS: {
    SEARCH: {
      url: `companies/clients/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `companies/clients/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `companies/clients/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `companies/clients`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `companies/clients/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `companies/clients/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
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
  SAML_INTEGRATION_PERMISSIONS: {
    CREATE: {
      url: `companies/saml-settings`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `companies/saml-settings/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `companies/saml-settings/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `companies/saml-settings/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `companies/saml-settings/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `companies/saml-settings/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  GOOGLE_USER_PROVISION_PERMISSIONS: {
    GET: {
      url: `google-user-provisioning`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  SCIM_SETTINGS_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.SCIM.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.SCIM.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.SCIM.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    REVOKE: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}/revoke`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    FIELDS: {
      url: `${ENUMS.SCIM.ROOT_URL}/fields`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  SIEM_INTEGRATION_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  DIRECT_EMAIL_CREATION_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.DIRECT_EMAIL_CREATION.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.DIRECT_EMAIL_CREATION.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.DIRECT_EMAIL_CREATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.DIRECT_EMAIL_CREATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.DIRECT_EMAIL_CREATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.DIRECT_EMAIL_CREATION.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SYSTEM_USERS_PERMISSIONS: {
    SEARCH: {
      url: `system-users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `system-users`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `system-users/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `system-users/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `system-users/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  ROLES_PERMISSIONS: {
    SEARCH: {
      url: `roles/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `roles`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `roles/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `roles/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `roles/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  LDAP_PERMISSIONS: {
    DETAIL: {
      url: `ldap-setting/detail`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SCHEDULE_SEARCH: {
      url: `ldap-schedule/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SCHEDULE_DELETE: {
      url: `ldap-schedule/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    SCHEDULE_UPDATE: {
      url: `ldap-schedule/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },

    SETTING_SEARCH: {
      url: `Ldap-setting/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SETTING_CREATE: {
      url: `ldap-setting`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SETTING_UPDATE: {
      url: `ldap-setting/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    SETTING_DELETE: {
      url: `ldap-setting/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    MAPPING_SEARCH: {
      url: `ldap-setting/mapping`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE_CONFIG: {
      url: `ldap-config`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    LDAP_FIELDS: {
      url: `ldap-fields`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    FIELD_MAPPING_USERS: {
      url: `active-directory/users`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  ETS_QUICK_SCAN_PERMISSIONS: {
    SEARCH: {
      url: `quick-scan/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `quick-scan`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `quick-scan/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    DELETE: {
      url: `quick-scan/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `quick-scan/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  ETS_ATTACK_VECTOR_PERMISSIONS: {
    SEARCH: {
      url: `plugin/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `plugin`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `plugin/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `plugin/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `plugin/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    ENABLE: {
      url: `plugin/active`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DISABLE: {
      url: `plugin/passive`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    }
  },
  ETS_QUICK_SCAN_REPORT_PERMISSIONS: {
    STATS: {
      url: `quick-scan-report/stats/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    COUNT_AND_SCORE: {
      url: `quick-scan-report/counts-and-score/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SEARCH: {
      url: `quick-scan-item/{resourceId}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EXPORT: {
      url: `quick-scan-item/{resourceId}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  THREAT_INTELLIGENCE_PERMISSIONS: {
    SEARCH: {
      url: `leak/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EXPORT: {
      url: `leak/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  ALLOW_LIST_PERMISSIONS: {
    SEARCH: {
      url: `allow-list/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE: {
      url: `allow-list`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CREATE_TXT: {
      url: `allow-list/txt-record`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    VERIFY: {
      url: `allow-list/verify/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `allow-list`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `allow-list/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_SIMULATOR_LEFT_MENU_PERMISSIONS: {
    SCENARIOS: {
      url: `callback-simulator/scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CAMPAIGN_MANAGER: {
      url: `callback-simulator/campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SETTINGS: {
      url: `callback-simulator/settings/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_SCENARIOS_LEFT_MENU_PERMISSIONS: {
    SCENARIOS: {
      url: `callback-simulator/scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EMAIL_TEMPLATES: {
      url: `callback-simulator/email-template/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    CALLBACK_TEMPLATES: {
      url: 'callback-simulator/callback-template/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS: {
    SEARCH: {
      url: `callback-simulator/campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_SETTINGS_LEFT_MENU_PERMISSIONS: {
    SEARCH: {
      url: `callback-simulator/settings/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_SCENARIOS_PERMISSIONS: {
    SEARCH: {
      url: `callback-simulator/scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `callback-simulator/scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `callback-simulator/scenario`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `callback-simulator/scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `callback-simulator/scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `callback-simulator/scenario/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_EMAIL_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `callback-simulator/email-template/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `callback-simulator/email-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `callback-simulator/email-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `callback-simulator/email-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `callback-simulator/email-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `callback-simulator/email-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `callback-simulator/callback-template/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `callback-simulator/callback-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE: {
      url: `callback-simulator/callback-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `callback-simulator/callback-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `callback-simulator/callback-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `callback-simulator/callback-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_CAMPAIGN_MANAGER_PARENT: {
    SEARCH: {
      url: 'callback-simulator/campaign/search',
      hasPermission: false,
      method: 'POST'
    },
    PREVIEW: {
      url: 'callback-simulator/campaign/preview/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    DELETE: {
      url: 'callback-simulator/campaign/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'callback-simulator/campaign/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'callback-simulator/campaign',
      hasPermission: false,
      method: 'POST'
    },
    EXPORT: {
      url: 'callback-simulator/campaign/search/export',
      hasPermission: false,
      method: 'POST'
    }
  },
  CALLBACK_CAMPAIGN_JOB_PERMISSIONS: {
    SEARCH: {
      url: 'callback-simulator/campaign-job-report/search/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    START: {
      url: 'callback-simulator/campaign-job/start/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    LAUNCH: {
      url: 'callback-simulator/campaign-job/start',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    STOP: {
      url: 'callback-simulator/campaign-job/stop/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.PATCH
    },
    DELETE: {
      url: `callback-simulator/campaign-job/{resourceId}/{instanceGroup}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    RESEND: {
      url: 'callback-simulator/campaign-job/resend/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    RESEND_LIST: {
      url: 'callback-simulator/campaign-job/resend/users/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EXPORT: {
      url: `callback-simulator/campaign-job-report/export/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CALLBACK_REPORT_PERMISSIONS: {
    SUMMARY: {
      url: 'callback-simulator/campaign-job-report/summary/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SEARCH_TYPE: {
      url:
        'callback-simulator/campaign-job-report/{searchType}/search/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    TYPE_EXPORT: {
      url:
        'callback-simulator/campaign-job-report/{searchType}/search/export/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    OPENED_DETAILS: {
      url: 'callback-simulator/campaign-job-report/search-email-opened/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    REPORTED_DETAILS: {
      url: 'callback-simulator/campaign-job-report/search-email-reported/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOWNLOAD_REPORT: {
      url: 'callback-simulator/campaign-job-report/export/{resourceId}/{instanceGroup}',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  CALLBACK_SETTINGS_PERMISSIONS: {
    SEARCH: {
      url: 'callback-simulator/settings/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EXPORT: {
      url: 'callback-simulator/settings/search/export',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MAP_NUMBERS: {
      url: 'callback-simulator/settings/map-numbers',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_NUMBER: {
      url: 'callback-simulator/settings/delete-number',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXCHANGE: {
      url:
        'callback-simulator/settings/exchange-number/{oldProviderNumberId}/{newProviderNumberId}',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  GAMIFICATION_REPORT_PERMISSIONS: {
    SEARCH: {
      url: `leaderboard/get-all`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    TOP_PERFORMERS: {
      url: `leaderboard/get-top-performers`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  }
}
