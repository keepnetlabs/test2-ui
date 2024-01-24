export function getStatusBadgeProps(status) {
  const trimmedStatus = status?.replace(/\s/, '')
  if (trimmedStatus === 'NotResponded') {
    return {
      color: '#B6791D',
      text: 'Not Responded'
    }
  }

  if (trimmedStatus === 'OpenedEmail') {
    return {
      color: '#0198AC',
      text: 'Opened Email'
    }
  }

  if (trimmedStatus === 'ClickedLink') {
    return {
      color: '#1173C1',
      text: 'Clicked Link'
    }
  }

  if (trimmedStatus === 'InProgress') {
    return {
      color: '#1173C1',
      text: 'In Progress'
    }
  }

  if (trimmedStatus === 'Completed') {
    return {
      color: '#217124',
      text: 'Completed'
    }
  }
  if (trimmedStatus === 'Passed') {
    return {
      color: '#217124',
      text: 'Passed'
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
  if (trimmedStatus === 'Failed') {
    return {
      color: '#B83A3A',
      text: 'Failed',
      outline: true
    }
  }

  if (trimmedStatus === 'Excluded') {
    return {
      color: '#E0E0E0',
      text: 'Excluded',
      outline: false,
      textBlack: true
    }
  }
  if (trimmedStatus === 'Processing') {
    return {
      color: '#1173C1',
      text: 'Processing',
      outline: true
    }
  }
  if (trimmedStatus === 'NotDelivered') {
    return {
      color: '#757575',
      text: 'Not Delivered',
      outline: true
    }
  }
  if (trimmedStatus === 'NotCompleted')
    return {
      color: '#B83A3A',
      text: 'Not Completed'
    }
}
