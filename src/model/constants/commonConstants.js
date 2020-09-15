export const COMMON_CONSTANTS = {
  DISABLELOADER: -1,
  ENABLELOADER: 1,
  ERRORSNACKBARCOLOR: 'red',
  SUCCESSSNACKBARCOLOR: 'green',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
  OUTLOOK: 'Outlook',
  DIAGNOSTIC: 'DiagnosticTool'
}

export const LABEL_STORE = {
  CREATEDATE: 'Date Created',
  FIRSTNAME: 'First Name',
  LASTNAME: 'Last Name',
  EMAIL: 'E-Mail',
  HOSTNAME: 'Device Name',
  LASTSEEN: 'Last Seen',
  ADDINVERSION: 'Version',
  STATUS: 'Status',
  DEPARTMENT: 'Department',
  PRIORITY: 'Priority',
  PROGRESS: 'Progress',
  SUBJECT: 'Subject',
  ATTACHMENTCOUNT: 'Attachment',
  REPORTEDBY: 'Reported By',
  RESULT: 'Result',
  INCIDENT: 'Incident',
  DETECTED: 'Detected',
  SOURCE: 'Source',
  ANALYSISSOURCE: 'Analysis Source',
  EXPIREDATE: 'Expiry Date',
  USERSTATUS: 'User Status',
  FROM: 'From',
  TO: 'To',
  SCANTYPE: 'Service',
  DURATION: 'Duration',
  DESCRIPTION: 'Description',
  COMPANY: 'Company',
  DELIVERY: 'Delivery',
  COMPANYNAME: 'Company Name',
  APIKEY: 'API Key',
  DATECREATED: 'Date Created',
  RESULTTAG: 'Tags',
  SERVICE: 'Service',
  ISSENDFILEHASH: 'Hash Scan',
  ISSENDFILE: 'File Scan',
  DETAILS: 'Details',
  ANALYSISENGINE: 'Service',
  CREATEDBY: 'Created By',
  NO_INTEGRATIONS: 'No integrations',
  NO_RULES_CONFIGURED: 'No rules configured',
  NO_TARGET_GROUPS_DEFINED: 'No target groups defined',
  NO_TARGET_USER_ADDED: 'No target users added',
  NO_IP_ADDRESS_DEFINED: 'You do not have any IP Addresses, yet',
  NO_NOTIFICATION_TEMPLATE_DEFINED: 'You do not have any notification template, yet',
  INDUSTRYNAME: 'Industry',
  LICENSETYPENAME: 'License Type',
  NUMBEROFUSERS: 'User Limit',
  LICENSEENDDATE: 'Renewal Date',
  IPADDRESS: 'Ip Address',
  TYPE: 'Type',
  URL: 'URL',
  USERS: 'Users',
  SMTPADDRESS: 'SMTP Address',
  AVAILABLEFOR: 'Available For',
  PROVIDER: 'Provider',
  ACCOUNTSID: 'Account SID',
  ROLE: 'Role',
  PHONE: 'Phone'
}

export const PROPERTY_STORE = {
  NAME: 'name',
  PRIORITY: 'priority',
  CREATEDATE: 'createDate',
  FIRSTNAME: 'firstName',
  LASTNAME: 'lastName',
  EMAIL: 'email',
  DEPARTMENT: 'department',
  TITLE: 'title',
  DESCRIPTION: 'description',
  STATUS: 'status',
  INTEGRATIONNAME: 'integrationName',
  COMPANY: 'company',
  SUBJECT: 'subject',
  ATTACHMENTCOUNT: 'attachmentCount',
  REPORTEDBY: 'reportedBy',
  RESULT: 'result',
  HOSTNAME: 'hostName',
  LASTSEEN: 'lastSeen',
  ADDINVERSION: 'addInVersion',
  DELIVERY: 'delivery',
  COMPANYNAME: 'companyName',
  APIKEY: 'apiKey',
  DATECREATED: 'dateCreated',
  RESULTTAG: 'resultTag',
  SOURCE: 'source',
  SERVICE: 'service',
  ISSENDFILEHASH: 'isSendFileHash',
  ISSENDFILE: 'isSendFile',
  IPADDRESS: 'ipAddress',
  DETAILS: 'details',
  ANALYSISENGINE: 'analysisEngine',
  RESOURCEID: 'resourceId',
  ANALYSISSOURCE: 'source',
  CREATEDBY: 'createdBy',
  INDUSTRYNAME: 'industryName',
  LICENSETYPENAME: 'licenseTypeName',
  NUMBEROFUSERS: 'numberOfUsers',
  LICENSEENDDATE: 'licenseEndDate',
  TYPE: 'type',
  URL: 'url',
  USERS: 'users',
  SMTPADDRESS: 'smtpAddress',
  AVAILABLEFOR: 'avaiableFor',
  PROVIDER: 'provider',
  ACCOUNTSID: 'accountSID',
  ROLE: 'role',
  PHONE: 'phone'
}

export function getStoreValue(key, type) {
  key = key.trim().toUpperCase()
  let value = LABEL_STORE[key]
  switch (type) {
    case COMMON_CONSTANTS.UPPERCASE:
      value = value.toUpperCase()
      break
    case COMMON_CONSTANTS.LOWERCASE:
      value = value.toLowerCase()
      break
    default:
      break
  }
  return value
}

export function vuetifySkeletonTypes() {
  return {
    actions: 'button@2',
    article: 'heading, paragraph',
    avatar: 'avatar',
    button: 'button',
    card: 'image, card-heading',
    'card-avatar': 'image, list-item-avatar',
    'card-heading': 'heading',
    chip: 'chip',
    'date-picker':
      'list-item, card-heading, divider, date-picker-options, date-picker-days, actions',
    'date-picker-options': 'text, avatar@2',
    'date-picker-days': 'avatar@28',
    heading: 'heading',
    image: 'image',
    'list-item': 'text',
    'list-item-avatar': 'avatar, text',
    'list-item-two-line': 'sentences',
    'list-item-avatar-two-line': 'avatar, sentences',
    'list-item-three-line': 'paragraph',
    'list-item-avatar-three-line': 'avatar, paragraph',
    paragraph: 'text@3',
    sentences: 'text@2',
    table: 'table-heading, table-thead, table-tbody, table-tfoot',
    'table-heading': 'heading, text',
    'table-thead': 'heading@6',
    'table-tbody': 'table-row-divider@6',
    'table-row-divider': 'table-row, divider',
    'table-row': 'table-cell@6',
    'table-cell': 'text',
    'table-tfoot': 'text@2, avatar@2',
    text: 'text'
  }
}
