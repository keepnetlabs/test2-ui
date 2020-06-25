export const COMMON_CONSTANTS = {
  DISABLELOADER: -1,
  ENABLELOADER: 1,
  ERRORSNACKBARCOLOR: 'red',
  SUCCESSSNACKBARCOLOR: 'green',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase'
}

const LABEL_STORE = {
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
  ATTACHMENTCOUNT: 'File',
  REPORTEDBY: 'Reported By',
  RESULT: 'Result',
  INCIDENT: 'Incident',
  DETECTED: 'Detected',
  SOURCE: 'Source',
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
  DATECREATED: 'Date Created'
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
  DATECREATED: 'dateCreated'
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
