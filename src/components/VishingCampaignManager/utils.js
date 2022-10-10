export function getStatusBadgeProps(status) {
  if (status === 'Completed') {
    return {
      color: '#217124',
      text: 'Completed'
    }
  }

  if (status === 'Running') {
    return {
      color: '#1173C1',
      text: 'Running'
    }
  }

  if (status === 'Idle') {
    return {
      color: '#0198AC',
      text: 'Idle'
    }
  }

  if (status === 'Scheduled') {
    return {
      color: '#757575',
      text: 'Scheduled'
    }
  }

  if (status === 'Cancelled') {
    return {
      color: '#B83A3A',
      text: 'Cancelled'
    }
  }

  if (status === 'Error') {
    return {
      color: '#F56C6C',
      text: 'Error',
      outline: false
    }
  }
}
