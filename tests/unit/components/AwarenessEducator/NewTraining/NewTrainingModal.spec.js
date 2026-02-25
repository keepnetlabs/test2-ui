import NewTrainingModal from '@/components/AwarenessEducator/NewTraining/NewTrainingModal.vue'
import labels from '@/model/constants/labels'

describe('NewTrainingModal.vue', () => {
  it('data initializes with selected row resource id', () => {
    const data = NewTrainingModal.data.call({
      selectedRow: { resourceId: 'resource-1' }
    })
    expect(data.trainingId).toBe('resource-1')
    expect(data.step).toBe(1)
  })

  it('computed getTitle returns create/edit titles', () => {
    expect(NewTrainingModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditTrainingContent
    )
    expect(NewTrainingModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewTrainingContent
    )
  })
})
