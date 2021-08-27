import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'

export const COMMON_CONSTANTS = {
  DISABLELOADER: -1,
  ENABLELOADER: 1,
  ERRORSNACKBARCOLOR: '#f56c6c',
  SUCCESSSNACKBARCOLOR: '#43a047',
  INFOSNACKBARCOLOR: '#2196f3',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
  OUTLOOK: 'Outlook',
  DIAGNOSTIC: 'DiagnosticTool',
  PRIORITY_ITEMS: [
    { text: labels.VeryLow, value: 'VeryLow' },
    labels.Low,
    labels.Medium,
    labels.High,
    { text: labels.VeryHigh, value: 'VeryHigh' }
  ],
  STATUS_ITEMS: [
    { text: labels.Active, value: 1 },
    { text: labels.InActive, value: 0 }
  ],
  DEFAULT_EMAIL_RULES: [
    (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
    (v) => Validations.email(v, labels.InvalidEmailAddress),
    (v) => Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
    (v) => {
      if (Validations.email(v)) {
        return Validations.controlEmailLength(v) || labels.InvalidEmailAddress
      }
      return false
    }
  ],
  DEFAULT_URL_RULES: [
    (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
    (v) => Validations.url(v, labels.InvalidURL),
    (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.URL, 2000))
  ],
  OPERATION_ITEMS: [
    { text: 'Create', value: 0 },
    { text: 'Update', value: 1 },
    { text: 'Delete', value: 2 },
    { text: 'CreateMany', value: 3 },
    { text: 'UpdateMany', value: 4 },
    { text: 'DeleteMany', value: 5 }
  ],
  FILTER_OPTIONS: ['Set as default filter', 'Restore default filter', 'Clear filters']
}

export const LABEL_STORE = {
  CREATEDATE: 'Date Created',
  CREATETIME: 'Date Created',
  FIRSTNAME: 'First Name',
  RELIABILITYPOINT: 'Reliability Point',
  LASTNAME: 'Last Name',
  EMAIL: 'E-Mail',
  HOSTNAME: 'Device',
  LASTSEEN: 'Last Seen',
  NAME: 'Name',
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
  NO_INTEGRATIONS: 'You do not have any integrations',
  NO_EMAIL_TEMPLATES: 'You do not have any templates',
  NO_RULES_CONFIGURED: 'You do not have any rules',
  NO_TARGET_GROUPS_DEFINED: 'You do not have any target groups',
  NO_TARGET_USER_ADDED: 'You do not have any users',
  NO_IP_ADDRESS_DEFINED: 'You do not have any IP Addresses',
  NO_NOTIFICATION_TEMPLATE_DEFINED: 'You do not have any notification templates',
  NO_AUDIT: 'You do not have any audit logs',
  INDUSTRYNAME: 'Industry',
  LICENSETYPENAME: 'License Type',
  NUMBEROFUSERS: 'User Limit',
  LICENSEENDDATE: 'Renewal Date',
  IPADDRESS: 'Ip Address',
  DIAGNOSTICTOOL: 'Diagnostic Tool',
  TYPE: 'Type',
  URL: 'URL',
  POSTTITLE: 'Post Title',
  USERS: 'Users',
  SMTPADDRESS: 'SMTP Address',
  AVAILABLEFOR: 'Available For',
  PROVIDER: 'Provider',
  ACCOUNTSID: 'Account SID',
  ROLE: 'Role',
  PHONENUMBER: 'Phone',
  STATUSNAME: 'Status',
  ADDINSTATUSNAME: 'Add-in Status',
  TYPENAME: 'Type',
  TITLE: 'Title',
  ROLENAME: 'Title',
  USERCOUNT: 'Users',
  JOBTITLE: 'Job Title',
  SERVERADDRESS: 'SMTP Address',
  USERNAME: 'User Name',
  NO_DATA: 'No Data',
  THREATS: 'Actual Threats',
  RELIABILITY: 'Reliability',
  RULENAME: 'Rule Name',
  UPLOADED_SUCCESSFULLY: 'Uploaded successfully',
  LOGID: 'Log ID',
  LOGDATE: 'Log Date',
  ENTITYID: 'Entity ID',
  ENTITYNAME: 'Entity Name',
  OPERATIOM: 'Operation',
  OLDVALUE: 'Old Value',
  NEWVALUE: 'New Value',
  IP: 'IP',
  USERAGENT: 'Browser User Agent',
  CHANGESET: 'Changed Set',
  INVESTIGATIONNAME: 'Investigation Name',
  TRIGGER: 'Trigger',
  FILEUPLOADED: 'File Uploaded',
  SENDERNAME: 'Sender Name',
  SENDERADDRESS: 'Sender Address',
  PERMISSIONS: 'You do not have any rules',
  ROLENAMEPERMISSION: 'Role Name',
  ROLEDESCRIPTION: 'Role Description'
}

export const PROPERTY_STORE = {
  TAGS: 'tags',
  ADDINSTATUSNAME: 'addInStatusName',
  ANALYSISENGINEPERMALINK: 'analysisEnginePermalink',
  CLIENTID: 'clientId',
  COMPANYID: 'companyId',
  DIRECTORYID: 'directoryId',
  APPLICATIONID: 'applicationId',
  APPLICATIONSECRET: 'applicationSecret',
  ANALYSISENGINETYPE: 'analysisEngineType',
  ANALYSISENGINENAME: 'analysisEngineName',
  NAME: 'name',
  REASON: 'reason',
  PRIORITY: 'priority',
  USERNAME: 'userName',
  CREATEDATE: 'createDate',
  FIRSTNAME: 'firstName',
  CATEGORYNAME: 'categoryName',
  SCANTIME: 'scanTime',
  TYPNAME: 'typeName',
  TEMPLATETYPE: 'templateType',
  LASTNAME: 'lastName',
  RELIABILITY: 'reliability',
  THREATS: 'threats',
  MATCHCOUNT: 'matchCount',
  RULENAME: 'ruleName',
  EMAIL: 'email',
  DEPARTMENT: 'department',
  TITLE: 'title',
  DESCRIPTION: 'description',
  STATUS: 'status',
  DIAGNOSTICTOOL: 'diagnosticToolStatus',
  REPORTEREMAIL: 'reporterEmail',
  INTEGRATIONNAME: 'integrationName',
  RELIABILITYPOINT: 'reliabilityPoint',
  COMPANY: 'company',
  SUBJECT: 'subject',
  POSTTITLE: 'postTitle',
  COMMUNITYNAME: 'communityName',
  ATTACHMENTCOUNT: 'attachmentCount',
  REPORTEDBY: 'reportedBy',
  RESULT: 'result',
  HOSTNAME: 'hostName',
  COMMENTCOUNT: 'commentCount',
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
  SMTPADDRESS: 'serverAddress',
  AVAILABLEFOR: 'avaiableFor',
  PROVIDER: 'provider',
  ACCOUNTSID: 'accountSID',
  ROLE: 'role',
  PHONENUMBER: 'phoneNumber',
  ROLES: 'roles',
  STATUSNAME: 'statusName',
  CREATETIME: 'createTime',
  ROLENAME: 'roleName',
  USERCOUNT: 'userCount',
  TYPENAME: 'typeName',
  JOBTITLE: 'jobTitle',
  CLIENTNAME: 'clientName',
  PLATFORM: 'platform',
  LOGID: 'logId',
  LOGDATE: 'logDate',
  ENTITYID: 'entityResourceId',
  ENTITYNAME: 'entityName',
  OPERATIOM: 'operation',
  OLDVALUE: 'oldValue',
  NEWVALUE: 'newValue',
  IP: 'ip',
  USERAGENT: 'userAgent',
  USERID: 'userId',
  FILEUPLOADED: 'fileUploaded',
  NONE_SELECTED: 'None Selected',
  SENDERNAME: 'senderName',
  SENDERADDRESS: 'from',
  ROLEDESCRIPTION: 'roleDescription',
  PROXYADDRESS: 'proxySettings',
  PROXYNAME: 'Proxy Name',
  ADDRESS: 'address',
  PORT: 'port',
  AuthenticationTypeId: 'authenticationTypeId',
  AuthenticationTypeName: 'authenticationTypeName',
  ISDEFAULT: 'isDefault',
  TEMPLATENAME: 'TemplateName',
  DIFFICULTY: 'difficultyName'
}

export const TABLE_SETTINGS_KEYS = {
  REPORTED_EMAIL: 'ReportedEmailTableSettings',
  CLUSTERED_REPORTED_EMAIL: 'ClusteredReportedEmailTableSettings',
  INVESTIGATIONS: 'InvestigationsTableSettings',
  INVESTIGATION_DETAILS_TARGET_USER: 'InvestigationDetailsTargetUserTableSettings',
  INVESTIGATION_DETAILS_LIST: 'InvestigationDetailsListTableSettings',
  INTEGRATION: 'IntegrationTableSettings',
  PLAYBOOK: 'PlaybookTableSettings',
  MAILCONFIGURATION: 'MailConfigurationTableSettings',
  PHISHINGREPORTER: 'PhishingReporterTableSettings',
  TARGET_USERS_PEOPLE: 'TargetUsersPeopleTableSettings',
  COMPANY_LIST: 'CompanyListTableSettings',
  COMPANY_GROUP_LIST: 'CompanyGroupListTableSettings',
  COMPANY_GROUP_DETAILS: 'CompanyGroupDetailsTableSettings',
  SMTP_SETTINGS: 'SmtpSettingsTableSettings',
  NOTIFICATION_TEMPLATE: 'NotificationTemplateTableSettings',
  REST_API: 'RestApiTableSettings',
  SYSTEM_USERS_PEOPLE: 'SystemUsersPeopleTableSettings',
  SYSTEM_USERS_ROLES: 'SystemUsersRolesSettings',
  AUDIT: 'AuditTableSettings',
  TARGET_USERS_GROUPS: 'TargetUsersGroupsTableSettings',
  TARGET_USERS_GROUP_USERS: 'TargetUsersGroupUsersSettings',
  SAML_SETTINGS: 'SamlSettingsTableSettings',
  PROXY_SETTINGS: 'ProxySettingsTableSettings',
  EMAILTEMPLATES: 'EmailTemplates',
  SANDBOX: 'Sandbox',
  SANDBOXSTATS: 'SandboxStats'
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

export const columnStandards = [
  { property: 'firstName', width: '140' },
  { property: 'lastName', width: '200' },
  { property: 'email', width: '260' },
  { property: 'department', width: '140' },
  { property: 'jobTitle', width: '140' },
  { property: 'companyName', width: '200' },
  { property: 'description', width: '340' },
  { property: 'subject', width: '200' },
  { property: 'url', width: '260' },
  { property: 'language', width: '140' },
  { property: 'createTime', width: '160' },
  { property: 'utcTime', width: '160' },
  { property: 'expireDate', width: '160' },
  { property: 'lastSeen', width: '160' },
  { property: 'licenseEndDate', width: '160' },
  { property: 'name', width: '260' }
]

export const GrapesS3Options = {
  accessKeyId: '<AWS Access key Id>',
  secretAccessKey: '<Aws secret access key>',
  sessionToken: '<AWS Sessions Token>',
  bucketName: '<AWS S3 Bucket Name>',
  prefix: '<Folder Name in s3 bucket.>'
}

export const COMMON_PROPS = {
  AVAILABLEFOR: {
    placeholder: labels.MakeAvailableForPlaceholder,
    valueFormat: 'object',
    clearOnSelect: true,
    disableBranchNodes: true,
    multiple: true,
    searchNexted: true,
    showCount: true
  }
}

export const COMMON_SNACKBAR = {
  show: true,
  color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
  icon: 'mdi-check-circle'
}

export const DEFAULT_SEARCH_CONTAINER_KEYS = {
  PHISHING_REPORTER: 'PhishingReporter',
  SMTP_SETTINGS: 'SmtpSettings',
  NOTIFICATION_TEMPLATE: 'NotificationTemplate',
  REST_API: 'RestApi',
  REPORTED_EMAIL: 'ReportedEmail',
  REPORTED_EMAIL_CLUSTERED: 'ReportedEmailClustered',
  INVESTIGATIONS: 'Investigations',
  TARGETUSERS: 'TargetUsers',
  TARGETUSERSGROUP: 'TargetUsersGroup',
  TARGETGROUPUSERSTABLE: 'TargetGroupUsersTable',
  SYSTEMUSERSPEOPLE: 'SystemUsersPeople',
  AUDIT: 'Audit',
  INTEGRATIONS: 'Integrations',
  PLAYBOOKRULES: 'PlaybookRules',
  MAILCONFIG: 'MailConfig',
  COMPANY_LIST: 'CompanyList',
  ADD_COMPANY_LIST: 'AddCompanyList',
  COMPANY_GROUP_LIST: 'CompanyGroupList',
  COMPANY_GROUP_DETAILS: 'CompanyGroupDetails',
  INVESTIGATIONSFOLDER: 'InvestigationsFolder',
  INVESTIGATIONSTARGETUSERS: 'InvestigationsTargetUsers',
  SAMLSETTINGS: 'SamlSettings',
  PROXY_SETTINGS: 'ProxySettings',
  EMAILTEMPLATES: 'EmailTemplates',
  SANDBOX: 'Sandbox',
  sandbox: 'Sandbox',
  SANDBOXSTATS: 'SandboxStats'
}

export const INTEGRATION_TYPES = {
  VMRAY: 'Vmray',
  FORTINET: 'FortiNet',
  VIRUSTOTAL: 'VirusTotal',
  IBMXFORCE: 'IBM X-Force',
  GOOGLESAFEBROWSER: 'Google Safe Browsing',
  SPAMHOUSE: 'SpamHouse',
  CUSTOMINTEGRATION: 'Custom Integration'
}
export const INTEGRATION_LABELS = {
  VMRAY: 'VMRay',
  FORTINET: 'FortiSandbox',
  VIRUSTOTAL: 'VirusTotal',
  IBMXFORCE: 'IBM X-Force',
  CUSTOMINTEGRATION: 'Custom Integration',
  SPAMHOUSE: 'SPAMHOUSE',
  GOOGLESAFEBROWSER: ' Google Safe Browser'
}

export const PHISHING_REPORTER_FILTERABLE_ITEMS = [
  'Online',
  'Offline',
  'Disabled',
  'NotInstalled',
  'Undetected'
]
