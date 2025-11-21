export function getTrainingReportProgressStatusBadgeProps(progress) {
  const progressMap = {
    'Not Completed': {
      color: '#B83A3A',
      text: 'Not Completed'
    },
    'In Progress': {
      color: '#B6791D',
      text: 'In Progress'
    },
    Completed: {
      color: '#217124',
      text: 'Completed'
    }
  }
  return progressMap[progress]
}
