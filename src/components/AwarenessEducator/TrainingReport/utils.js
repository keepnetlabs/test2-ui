export function getStatusBadgeProps(status) {
  if (status === 'Not Responded') {
    return {
      color: '#B6791D',
      text: 'Not Responded'
    }
  }

  if (status === 'Opened Email') {
    return {
      color: '#0198AC',
      text: 'Opened Email'
    }
  }

  if (status === 'Clicked Link') {
    return {
      color: '#1173C1',
      text: 'Clicked Link'
    }
  }

  if (status === 'In Progress') {
    return {
      color: '#1173C1',
      text: 'In Progress'
    }
  }

  if (status === 'Completed') {
    return {
      color: '#217124',
      text: 'Completed'
    }
  }

  if (status === 'In Queue') {
    return {
      color: '#1173C1',
      text: 'In Queue'
    }
  }

  if (status === 'Sending Error') {
    return {
      color: '#F56C6C',
      text: 'Sending Error',
      outline: false
    }
  }

  if (status === 'Cancelled') {
    return {
      color: '#B6791D',
      text: 'Cancelled',
      outline: false
    }
  }

  if (status === 'Excluded') {
    return {
      color: '#E0E0E0',
      text: 'Excluded',
      outline: false,
      textBlack: true
    }
  }
}
