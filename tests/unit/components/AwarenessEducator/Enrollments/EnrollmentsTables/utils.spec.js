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

  it('keeps action order and icon mapping stable for dropdown behavior', () => {
    expect(trashRowActions.map((x) => x.action)).toEqual([
      'on-view-report',
      'on-restore',
      'on-delete'
    ])
    expect(trashRowActions.map((x) => x.icon)).toEqual([
      'mdi-text-box',
      '$refresh-left',
      'mdi-delete'
    ])
  })

  it('marks only view-report as not shown by default', () => {
    expect(trashRowActions[0].isNotShow).toBe(true)
    expect(trashRowActions[1].isNotShow).toBeUndefined()
    expect(trashRowActions[2].isNotShow).toBeUndefined()
  })
})
