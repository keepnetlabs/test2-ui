export function getStatusBadgeProps(status) {
  const trimmedStatus = status?.replace(/\s/, '')
  if (trimmedStatus === 'SubmittedMFACode') {
    return {
      color: '#B83A3A',
      text: 'Submitted MFA Code'
    }
  }

  if (trimmedStatus === 'NotResponded') {
    return {
      color: '#217124',
      text: 'Not Responded'
    }
  }

  if (trimmedStatus === 'Clicked') {
    return {
      color: '#B83A3A',
      text: 'Clicked'
    }
  }

  if (trimmedStatus === 'InQueue') {
    return {
      color: '#1173C1',
      text: 'In Queue'
    }
  }

  if (trimmedStatus === 'SendingError' || trimmedStatus === 'Error') {
    return {
      color: '#F56C6C',
      text: 'Sending Error',
      outline: false
    }
  }

  if (trimmedStatus === 'Cancelled') {
    return {
      color: '#B6791D',
      text: 'Cancelled',
      outline: false
    }
  }

  if (trimmedStatus === 'Inactive') {
    return {
      color: '#757575',
      text: 'Inactive'
    }
  }
}
