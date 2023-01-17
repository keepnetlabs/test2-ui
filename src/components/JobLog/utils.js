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

  if (status === 'Failed') {
    return {
      color: '#B83A3A',
      text: 'Failed'
    }
  }
}
