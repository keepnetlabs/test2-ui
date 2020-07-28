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
      return '#757575'
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
    case 'completedwitherror':
      return '#6d6d6d'
    case 'itemnotfound':
      return '#fafafa'
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
    case 'verylow':
      return '#757575'
    case 'medium':
      return '#2196f3'
    case 'high':
      return '#e6a23c'
    case 'very high':
      return '#f56c6c'
    case 'veryhigh':
      return '#f56c6c'
    case 'n/a':
      return '#00bcd4'
    default:
      break
  }
}

export function getTextColor(type) {
  switch (type.toLowerCase()) {
    case 'open':
      return '#f56c6c'
    case 'in progress':
      return '#2196f3'
    case 'false positive':
      return '#e6a23c'
    case 'closed':
      return '#43a047'
    default:
      break
  }
}

export function getDataTableFieldLabel(field) {
  field = field.trim().toLowerCase()
  let upperCaseCount = 0
  for (let i = 0; i < field.length; i++) {
    if (upperCaseCount === 2) {
      return `${field.slice(0, i)} ${field.slice(i, field.length)}`
    }
    if (field.charAt(i) === field.charAt(i).toUpperCase()) {
      upperCaseCount++
    }
  }
  switch (field) {
    case 'beinganalyzed':
      return 'Being Analyzed'
    case 'inprogress':
      return 'In Progress'
    case 'falsepositive':
      return 'False Positive'
    case 'nonmalicious':
      return 'Non Malicious'
    case 'veryhigh':
      return 'Very High'
    case 'verylow':
      return 'Very Low'
    case 'completedwitherror':
      return 'Completed with error'
    case 'itemnotfound':
      return 'Item not found'
    case 'n/a':
      return 'N/A'
    default:
      return field.substring(0, 1).toUpperCase() + field.substring(1, field.length)
  }
}

export function isOwnerOrMember(membershipStatusId) {
  switch (membershipStatusId) {
    case 1:
      return true
    case 2:
      return true
    default:
      return false
  }
}

export function isOwner(membershipStatusId) {
  return membershipStatusId == 1
}

export function isPostedByMe(isPostedByMe) {
  return isPostedByMe
}
