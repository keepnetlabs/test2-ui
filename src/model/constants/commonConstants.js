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
    'Create',
    'Update',
    'Delete',
    { text: 'CreateMany', value: 'CreateMany' },
    { text: 'UpdateMany', value: 'UpdateMany' },
    { text: 'DeleteMany', value: 'DeleteMany' }
  ]
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
  NO_INTEGRATIONS: 'No integrations',
  NO_RULES_CONFIGURED: 'No rules configured',
  NO_TARGET_GROUPS_DEFINED: 'No target groups defined',
  NO_TARGET_USER_ADDED: 'No target users added',
  NO_IP_ADDRESS_DEFINED: 'You do not have any IP Addresses, yet',
  NO_NOTIFICATION_TEMPLATE_DEFINED: 'You do not have any notification template, yet',
  NO_AUDIT: 'There is no audit log',
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
  CHANGESET: 'Changed Set'
}

export const PROPERTY_STORE = {
  ADDINSTATUSNAME: 'addInStatusName',
  CLIENTID: 'clientId',
  COMPANYID: 'companyId',
  DIRECTORYID: 'directoryId',
  APPLICATIONID: 'applicationId',
  APPLICATIONSECRET: 'applicationSecret',
  NAME: 'name',
  PRIORITY: 'priority',
  USERNAME: 'userName',
  CREATEDATE: 'createDate',
  FIRSTNAME: 'firstName',
  CATEGORYNAME: 'categoryName',
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
  USERID: 'userId'
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
