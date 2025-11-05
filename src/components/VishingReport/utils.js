export function getStatusBadgeProps(status) {
  if (status === 'Not Responded' || status === 'NotResponded') {
    return {
      color: '#757575',
      text: 'Not Responded'
    }
  }
  if (status === 'Not Delivered' || status === 'NotDelivered') {
    return {
      color: '#757575',
      text: 'Not Delivered'
    }
  }
  if (status === 'Busy') {
    return {
      color: '#757575',
      text: 'Busy'
    }
  }

  if (status === 'Answered') {
    return {
      color: '#B6791D',
      text: 'Answered'
    }
  }

  if (status === 'Vished') {
    return {
      color: '#B83A3A',
      text: 'Vished'
    }
  }

  if (status === 'In Queue' || status === 'InQueue') {
    return {
      color: '#1173C1',
      text: 'In Queue'
    }
  }

  if (status === 'Calling Error' || status === 'CallingError') {
    return {
      color: '#F56C6C',
      text: 'Calling Error',
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
}
