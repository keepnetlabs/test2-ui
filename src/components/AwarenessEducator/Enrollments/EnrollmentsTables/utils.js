import labels from '@/model/constants/labels'
import { getTrainingCategoryMeta } from '@/components/TrainingLibrary/utils'

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

export const enrichEnrollmentTableResults = (results = [], languages = []) => {
  return (results || []).map((item) => {
    return {
      ...item,
      ...getTrainingCategoryMeta(item),
      languageCodes: item.languages,
      languages: item.languages?.map((code) => {
        const language = (languages || []).find((lang) => lang.code === code)
        return language?.isoFriendlyName || code
      }),
      targetAudience: item.trainingRoles?.map((role) => role.roleName) || []
    }
  })
}
