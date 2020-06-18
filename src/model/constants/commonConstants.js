export const COMMON_CONSTANTS = {
  DISABLELOADER: -1,
  ENABLELOADER: 1,
  ERRORSNACKBARCOLOR: 'red',
  SUCCESSSNACKBARCOLOR: 'green'
}

const STORE = {
  CREATEDATE: 'Create Date',
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
  DURATION: 'Duration'
}

export function getStoreValue(key) {
  key = key.trim().toUpperCase()
  return STORE[key]
}
