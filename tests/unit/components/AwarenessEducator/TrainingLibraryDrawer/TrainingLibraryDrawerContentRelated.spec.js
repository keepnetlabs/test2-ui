jest.mock('@/api/awarenessEducator', () => ({
  getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  searchTraining: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } }))
}))

import TrainingLibraryDrawerContentRelated from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerContentRelated.vue'

describe('TrainingLibraryDrawerContentRelated.vue', () => {
  it('getRelatedTitle returns related text for current type', () => {
    const title = TrainingLibraryDrawerContentRelated.computed.getRelatedTitle.call({ type: 'Poster' })
    expect(title).toBe('Related Poster')
  })

  it('getTrainingRolesText formats role list', () => {
    const single = TrainingLibraryDrawerContentRelated.methods.getTrainingRolesText({
      trainingRoles: [{ roleName: 'Admin' }]
    })
    expect(single).toBe('Admin')

    const multi = TrainingLibraryDrawerContentRelated.methods.getTrainingRolesText({
      trainingRoles: [{ roleName: 'Admin' }, { roleName: 'HR' }, { roleName: 'IT' }]
    })
    expect(multi).toBe('Admin +2')
  })

  it('formatLanguages returns fallback for empty language list', () => {
    const text = TrainingLibraryDrawerContentRelated.methods.formatLanguages.call(
      { getLanguageNames: () => [] },
      []
    )
    expect(text).toBe('No languages')
  })

  it('getCardImageBackground returns object only when cover exists', () => {
    expect(TrainingLibraryDrawerContentRelated.methods.getCardImageBackground({ coverImage: '' })).toEqual(
      {}
    )
    expect(
      TrainingLibraryDrawerContentRelated.methods.getCardImageBackground({
        coverImage: 'https://img'
      })
    ).toEqual({ backgroundImage: "url('https://img')" })
  })
})
