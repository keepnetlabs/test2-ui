export function getBtnStatusColor(type) {
  switch (type && type.toLowerCase()) {
    case 'pending':
      return '#00bcd4'
    case 'clean':
      return '#00bcd4'
    case 'active':
      return '#00bcd4'
    case 'inactive':
      return '#f56c6c'
    case 'warning':
      return '#e6a23c'
    case 'malicious':
      return '#e6a23c'
    case 'nonmalicious':
      return '#00bcd4'
    case 'offline':
      return '#e6a23c'
    case 'expired':
      return '#e6a23c'
    case 'cancelled':
      return '#f56c6c'
    case 'phishing':
      return '#f56c6c'
    case 'idle':
      return '#f56c6c'
    case 'disabled':
      return '#f56c6c'
    case 'network error':
      return '#f56c6c'
    case 'quedued':
      return '#00bcd4'
    case 'none':
      return '#00bcd4'
    case 'running':
      return '#2196f3'
    case 'completed':
      return '#43a047'
    case 'finished':
      return '#43a047'
    case 'online':
      return '#43a047'
    case 'deactivated':
      return '#757575'
    case 'not installed':
      return '#757575'
    case 'user unavailable':
      return '#757575'
    case 'n/a':
      return '#00bcd4'
    case 'stopped':
      return '#f56c6c'
    default:
      return '#00bcd4'
  }
}

export function getBtnPriorityColor(type) {
  switch (type.toLowerCase()) {
    case 'active':
      return '#00bcd4'
    case 'inactive':
      return '#f56c6c'
    case 'low':
      return '#00bcd4'
    case 'very low':
      return '#757575'
    case 'medium':
      return '#2196f3'
    case 'high':
      return '#e6a23c'
    case 'very high':
      return '#f56c6c'
    case 'n/a':
      return '#00bcd4'
    default:
      break
  }
}
