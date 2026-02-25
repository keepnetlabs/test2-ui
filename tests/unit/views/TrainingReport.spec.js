jest.mock('@/api/awarenessEducator', () => ({
  getTrainingSummary: jest.fn().mockResolvedValue({ data: { data: null } }),
  getEnrollmentFormDetails: jest.fn().mockResolvedValue({ data: { data: null } })
}))
jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

import TrainingReport from '@/views/TrainingReport.vue'
import labels from '@/model/constants/labels'

describe('TrainingReport.vue', () => {
  it('has correct component name', () => {
    expect(TrainingReport.name).toBe('TrainingReport')
  })

  it('computed id returns route params id', () => {
    const ctx = { $route: { params: { id: 'train-1' } } }
    expect(TrainingReport.computed.id.call(ctx)).toBe('train-1')
  })

  it('computed getTrainingName returns activePageRouterName', () => {
    const ctx = {
      $store: { state: { common: { activePageRouterName: 'Training X' } } }
    }
    expect(TrainingReport.computed.getTrainingName.call(ctx)).toBe('Training X')
  })

  it('default tab is Summary', () => {
    const data = TrainingReport.data()
    expect(data.tab).toBe(labels.Summary)
  })
})
