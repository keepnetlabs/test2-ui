import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const COLUMNS = {
  FIRST_NAME: {
    property: PROPERTY_STORE.FIRSTNAME,
    align: 'left',
    label: labels.FirstName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  FIRST_NAME_PRINTOUT: {
    property: PROPERTY_STORE.FIRSTNAME,
    align: 'left',
    label: labels.FirstName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    overrideWidth: true,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_NAME: {
    property: PROPERTY_STORE.LASTNAME,
    align: 'left',
    label: labels.LastName,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_NAME_PRINTOUT: {
    property: PROPERTY_STORE.LASTNAME,
    align: 'left',
    label: labels.LastName,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    overrideWidth: true,
    isEditable: false,
    filterableType: 'text'
  },
  PHISHING_SCENARIO_NAME: {
    property: PROPERTY_STORE.QUISHING_SCENARIO_NAME,
    align: 'left',
    label: labels.ScenarioName,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  EMAIL: {
    property: PROPERTY_STORE.EMAIL,
    align: 'left',
    label: labels.Email,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  EMAIL_PRINTOUT: {
    property: PROPERTY_STORE.EMAIL,
    align: 'left',
    label: labels.Email,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    overrideWidth: true,
    isEditable: false,
    filterableType: 'text'
  },
  PHONENUMBER: {
    property: 'phoneNumber',
    align: 'left',
    label: 'Phone Number',
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  EMAIL_DELIVERY: {
    property: PROPERTY_STORE.EMAIL_DELIVERY,
    align: 'left',
    editable: false,
    label: labels.EmailDelivery,
    sortable: true,
    show: true,
    fixed: false,
    width: 200,
    type: 'text',
    filterableType: 'text'
  },
  EMAIL_SEND_DATE: {
    property: 'lastSendingTime',
    align: 'left',
    editable: false,
    label: 'Email Send Date',
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'date'
  },
  EMAIL_SEND_DATE_PRINTOUT: {
    property: 'lastSendingTime',
    align: 'left',
    editable: false,
    label: 'Email Send Date',
    sortable: true,
    fixed: false,
    show: true,
    type: 'text',
    overrideWidth: true,
    minWidth: 180,
    filterableType: 'date'
  },
  DATA: {
    property: 'submittedData',
    align: 'left',
    label: labels.Data,
    fixed: 'right',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  DEPARTMENT: {
    property: PROPERTY_STORE.DEPARTMENT,
    align: 'left',
    label: labels.Department,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  DEPARTMENT_PRINTOUT: {
    property: PROPERTY_STORE.DEPARTMENT,
    align: 'left',
    label: labels.Department,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    overrideWidth: true,
    isEditable: false,
    filterableType: 'text'
  },
  SCENARIO: {
    property: 'phishingScenarioName',
    align: 'left',
    label: labels.Scenario,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_OPENED: {
    property: 'lastOpenedTime',
    align: 'left',
    fixed: false,
    editable: false,
    label: labels.LastOpened,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  LAST_REPORTED: {
    property: 'lastReportedTime',
    align: 'left',
    fixed: false,
    editable: false,
    label: labels.LastReported,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  DATE_REPORTED: {
    property: 'reportedTime',
    align: 'left',
    fixed: false,
    editable: false,
    label: labels.DateReported,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  TIMES_OPENED: {
    property: 'openedCount',
    align: 'right',
    editable: false,
    label: labels.TimesOpened,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'number'
  },
  TIMES_OPENED_PRINTOUT: {
    property: 'openedCount',
    align: 'right',
    editable: false,
    label: labels.TimesOpened,
    sortable: true,
    show: true,
    type: 'text',
    minWidth: 180,
    fixed: 'right',
    overrideWidth: true,
    filterableType: 'number'
  },
  TIMES_REPORTED: {
    property: 'reportedCount',
    align: 'right',
    editable: false,
    label: labels.TimesReported,
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    overrideWidth: true,
    filterableType: 'number'
  },
  DATE_CLICKED: {
    property: 'clickedTime',
    align: 'left',
    label: labels.DateClicked,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  SUBMITTED_TIME: {
    property: 'submittedTime',
    align: 'left',
    label: labels.DateClicked,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  SUBMITTED_TIME_MFA: {
    property: 'submittedTime',
    align: 'left',
    label: labels.DateSubmittedMFACode,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 230,
    isEditable: false,
    filterableType: 'date'
  },
  DATE_OPENED: {
    property: 'openedTime',
    align: 'left',
    label: labels.DateOpened,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  USER_AGENT: {
    property: PROPERTY_STORE.USERAGENT,
    align: 'left',
    label: labels.UserAgent,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 230,
    isEditable: false,
    filterableType: 'text'
  },
  USER_AGENT_SLOT: {
    property: PROPERTY_STORE.USERAGENT,
    align: 'left',
    label: labels.UserAgent,
    fixed: false,
    sortable: true,
    show: true,
    type: 'slot',
    width: 230,
    isEditable: false,
    filterableType: 'text'
  },
  BROWSER: {
    property: 'browserName',
    align: 'left',
    label: labels.Browser,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  GEOLOCATION: {
    property: 'userGeolocation',
    align: 'left',
    label: labels.Geolocation,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 250,
    isEditable: false,
    filterableType: 'text'
  },
  IP: {
    property: 'userIpAddressList',
    align: 'left',
    label: labels.Ip,
    fixed: 'right',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  IP_SLOT: {
    property: 'userIpAddressList',
    align: 'left',
    label: labels.Ip,
    fixed: 'right',
    sortable: true,
    show: true,
    type: 'slot',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  IP_PHISHING_REPORTER: {
    property: 'userIpAddressList',
    align: 'left',
    label: labels.Ip,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  SUBMITTED_DATA_IP: {
    property: 'userIpAddressList',
    align: 'left',
    label: labels.Ip,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  SUBMITTED_DATA_IP_SLOT: {
    property: 'userIpAddressList',
    align: 'left',
    label: labels.Ip,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_CLICKED: {
    property: 'lastClickedTime',
    align: 'left',
    label: labels.LastClicked,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  LAST_SCANNED: {
    property: 'lastClickedTime',
    align: 'left',
    label: labels.LastScanned,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  TIMES_CLICKED: {
    property: 'clickedCount',
    align: 'right',
    editable: false,
    label: labels.TimesClicked,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'number'
  },
  TIMES_CLICKED_PRINTOUT: {
    property: 'clickedCount',
    align: 'right',
    editable: false,
    label: labels.TimesClicked,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    overrideWidth: true
  },
  TIMES_SCANNED: {
    property: 'clickedCount',
    align: 'right',
    editable: false,
    label: labels.TimesScanned,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'number'
  },
  PASSWORD_COMPLEXITY: {
    property: 'minPasswordComplexity',
    align: 'center',
    label: labels.PasswordComplexity,
    fixed: false,
    sortable: true,
    show: true,
    type: 'badge',
    width: 225,
    filterableType: 'select'
  },
  LAST_SUBMISSION: {
    property: 'lastSubmittedTime',
    align: 'left',
    label: labels.LastSubmission,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  LAST_SUBMISSION_CODE: {
    property: 'lastSendingTime',
    align: 'left',
    label: labels.LastSubmittedCode,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 220,
    isEditable: false,
    filterableType: 'date'
  },
  TIMES_SUBMISSION: {
    property: 'submittedCount',
    align: 'right',
    label: labels.TimesSubmission,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'number'
  },
  TIMES_SUBMISSION_PRINTOUT: {
    property: 'submittedCount',
    align: 'right',
    label: labels.TimesSubmission,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    overrideWidth: true,
    isEditable: false,
    filterableType: 'number'
  },
  TIMES_SUBMISSION_CODE: {
    property: 'mfaSubmittedCount',
    align: 'right',
    label: labels.TimesSubmittedCode,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 220,
    isEditable: false,
    filterableType: 'number'
  },
  LAST_SENDING_DATE: {
    property: PROPERTY_STORE.LAST_SENDING_DATE,
    align: 'left',
    label: labels.LastSendingDate,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  DATE_SENT: {
    property: 'lastSendingTime',
    align: 'left',
    label: labels.DATE_SENT,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  DELIVERY_STATUS: {
    property: 'status',
    align: 'center',
    label: labels.DELIVERY_STATUS,
    sortable: true,
    show: true,
    type: 'slot',
    width: 220,
    filterableType: 'select',
    props: {
      style: {
        maxWidth: '100px'
      }
    }
  },
  SMTP: {
    property: PROPERTY_STORE.SMTP,
    align: 'left',
    label: labels.Smtp,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  },
  SCENARIO_NAME: {
    property: 'phishingScenarioName',
    align: 'left',
    label: labels.ScenarioName,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  },
  TRAINING_NAME: {
    property: 'trainingName',
    align: 'left',
    label: labels.TrainingName,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  }
}

export function getStatusBadgeProps(status) {
  if (status === 'Not Delivered') {
    return {
      color: '#757575',
      text: 'Not Delivered'
    }
  }

  if (status === 'InQueue' || status === 'In Queue') {
    return {
      color: '#1173C1',
      text: 'In Queue'
    }
  }

  if (status === 'Error') {
    return {
      color: '#B83A3A',
      text: 'Error'
    }
  }

  if (status === 'Cancelled' || status === 'Canceled') {
    return {
      color: '#B6791D',
      text: 'Cancelled'
    }
  }

  if (status === 'Successful') {
    return {
      color: '#217124',
      text: 'Successful'
    }
  }

  if (status === 'Delivered') {
    return {
      color: '#217124',
      text: 'Delivered'
    }
  }

  if (status === 'Processing') {
    return {
      color: '#1173C1',
      text: 'Processing'
    }
  }
}

export const UNUSUAL_TYPES = {
  USER_AGENT: 0,
  IP: 1,
  HONEYPOT: 2
}
