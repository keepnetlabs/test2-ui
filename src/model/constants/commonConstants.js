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
  INDUSTRYNAME: 'Industry',
  LICENSETYPENAME: 'License Type',
  NUMBEROFUSERS: 'User Limit',
  LICENSEENDDATE: 'Renewal Date'
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
  DETAILS: 'details',
  ANALYSISENGINE: 'analysisEngine',
  RESOURCEID: 'resourceId',
  ANALYSISSOURCE: 'source',
  CREATEDBY: 'createdBy',
  INDUSTRYNAME: 'industryName',
  LICENSETYPENAME: 'licenseTypeName',
  NUMBEROFUSERS: 'numberOfUsers',
  LICENSEENDDATE: 'licenseEndDate'
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
