import labels from '@/model/constants/labels'
import { trashRowActions } from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/utils'

describe('AwarenessEducator EnrollmentsTables utils', () => {
  it('exports expected row actions', () => {
    expect(trashRowActions).toHaveLength(3)
    expect(trashRowActions[0]).toEqual({
      name: labels.ViewReport,
      icon: 'mdi-text-box',
      action: 'on-view-report',
      isNotShow: true
    })
    expect(trashRowActions[1].action).toBe('on-restore')
    expect(trashRowActions[2].action).toBe('on-delete')
  })
})
