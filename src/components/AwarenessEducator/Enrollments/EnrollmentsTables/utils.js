import labels from '@/model/constants/labels'

export const trashRowActions = [
  {
    name: labels.ViewReport,
    icon: 'mdi-text-box',
    action: 'on-view-report',
    isNotShow: true
  },
  {
    name: labels.Restore,
    icon: '$refresh-left',
    action: 'on-restore'
  },
  {
    name: labels.DeletePermanently,
    icon: 'mdi-delete',
    action: 'on-delete'
  }
]
