export function getStatusBadgeProps(status) {
  const statusMap = {
    NotResponded: { color: '#B6791D', text: 'Not Responded' },
    OpenedEmail: { color: '#0198AC', text: 'Opened Email' },
    ClickedLink: { color: '#1173C1', text: 'Clicked Link' },
    InProgress: { color: '#1173C1', text: 'In Progress' },
    Completed: { color: '#217124', text: 'Completed' },
    Passed: { color: '#217124', text: 'Passed' },
    Success: { color: '#217124', text: 'Success' },
    InQueue: { color: '#1173C1', text: 'In Queue' },
    SendingError: { color: '#F56C6C', text: 'Sending Error', outline: false },
    Error: { color: '#F56C6C', text: 'Sending Error', outline: false },
    Cancelled: { color: '#B6791D', text: 'Cancelled', outline: false },
    Failed: { color: '#B83A3A', text: 'Failed', outline: true },
    Excluded: {
      color: '#E0E0E0',
      text: 'Excluded',
      outline: false,
      textBlack: true
    },
    Processing: { color: '#1173C1', text: 'Processing', outline: true },
    NotDelivered: { color: '#757575', text: 'Not Delivered', outline: true },
    Incomplete: { color: '#757575', text: 'Incomplete', outline: true },
    NotCompleted: { color: '#B83A3A', text: 'Not Completed' }
  }
  const trimmedStatus = status?.replaceAll(/\s/g, '')
  return statusMap[trimmedStatus] || null
}
