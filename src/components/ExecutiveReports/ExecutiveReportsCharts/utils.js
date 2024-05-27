import labels from '@/model/constants/labels'

export const CHART_COLORS = {
  'Open Attachment': {
    backgroundColor: '#801717',
    borderColor: '#801717',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Attachment Opened': {
    backgroundColor: '#801717',
    borderColor: '#801717',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Repeat Offenders': {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Company Phishing Risk Score': {
    backgroundColor: '#B83A3A',
    borderColor: '#B83A3A',
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0,
    fill: false,
    order: 1,
    pointHoverRadius: 3
  },
  'Industry Avg (Technology)': {
    backgroundColor: '#1173C1',
    borderColor: '#1173C1',
    fill: false,
    borderDash: [5, 5],
    borderWidth: 2,
    lineTension: 0,
    order: 2,
    pointHoverRadius: 3
  },
  'All Industry Avg': {
    backgroundColor: '#B6791D',
    borderColor: '#B6791D',
    fill: false,
    borderDash: [5, 5],
    borderWidth: 2,
    lineTension: 0,
    order: 3,
    pointHoverRadius: 3
  },
  'Simulated Users': {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'In Progress': {
    backgroundColor: '#E6A23C',
    borderColor: '#E6A23C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  Incomplete: {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Non-simulated Users': {
    backgroundColor: '#FBF280',
    borderColor: '#FBF280',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  Vished: {
    backgroundColor: '#801717',
    borderColor: '#801717',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Vished Users': {
    backgroundColor: '#801717',
    borderColor: '#801717',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'QR Code Phished Users': {
    backgroundColor: '#801717',
    borderColor: '#801717',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  Clicked: {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Submitted Data': {
    backgroundColor: '#FD4D4D',
    borderColor: '#FD4D4D',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  SubmittedMFACode: {
    backgroundColor: '#B83A3A',
    borderColor: '#B83A3A',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'MFA Submitted': {
    backgroundColor: '#B83A3A',
    borderColor: '#B83A3A',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Scanned QR Link Count': {
    backgroundColor: '#B83A3A',
    borderColor: '#B83A3A',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Not Responded Users': {
    backgroundColor: '#43A047',
    borderColor: '#43A047',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Total Target Users': {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Phished Users': {
    backgroundColor: '#801717',
    borderColor: '#801717',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Phish Reporters': {
    backgroundColor: '#43A047',
    borderColor: '#43A047',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  Answered: {
    backgroundColor: '#FFD102',
    borderColor: '#FFD102',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  Completed: {
    backgroundColor: '#43A047',
    borderColor: '#43A047',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Number of Trainings': {
    backgroundColor: '#43A047',
    borderColor: '#43A047',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  [labels.NoResponse]: {
    backgroundColor: '#67C23A',
    borderColor: '#67C23A',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  [labels.Clicked]: {
    backgroundColor: '#E6A23C',
    borderColor: '#E6A23C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  [labels.Opened]: {
    backgroundColor: '#FBF280',
    borderColor: '#FBF280',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  [labels.OpenedAttachment]: {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  [labels.Submitted]: {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  [labels.SubmittedMFACode]: {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Click Only Campaigns': {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Data Submission Campaigns': {
    backgroundColor: 'blue',
    borderColor: 'blue',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'MFA Campaigns': {
    backgroundColor: 'red',
    borderColor: 'red',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  },
  'Attachment Campaigns': {
    backgroundColor: 'yellow',
    borderColor: 'yellow',
    fill: false,
    pointRadius: 3,
    borderWidth: 2,
    lineTension: 0
  }
}
