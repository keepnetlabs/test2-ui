import {
  appendTrainingCategoryFormData,
  buildTrainingCategoryPayload,
  getTrainingCategoryDisplayText,
  getTrainingCategoryValues
} from '@/components/TrainingLibrary/trainingCategoryUtils'

describe('trainingCategoryUtils', () => {
  it('getTrainingCategoryValues prefers multi category sources', () => {
    expect(
      getTrainingCategoryValues({
        category: 'RemoteWorkingSecurity',
        trainingCategories: [
          { categoryId: 1, code: 'RemoteWorkingSecurity' },
          { categoryId: 2, code: 'TravelSecurity' }
        ]
      }, [
        { id: 1, text: 'Remote Working Security', value: 'RemoteWorkingSecurity' },
        { id: 2, text: 'Travel Security', value: 'TravelSecurity' }
      ])
    ).toEqual([1, 2])
  })

  it('getTrainingCategoryValues maps legacy category code to lookup id', () => {
    expect(
      getTrainingCategoryValues(
        {
          category: 'TravelSecurity'
        },
        [
          { id: 1, text: 'Remote Working Security', value: 'RemoteWorkingSecurity' },
          { id: 2, text: 'Travel Security', value: 'TravelSecurity' }
        ]
      )
    ).toEqual([2])
  })

  it('getTrainingCategoryDisplayText resolves category names from lookup items', () => {
    expect(
      getTrainingCategoryDisplayText(
        [1, 2],
        [
          { id: 1, text: 'Remote Working Security', value: 'RemoteWorkingSecurity' },
          { id: 2, text: 'Travel Security', value: 'TravelSecurity' }
        ]
      )
    ).toBe('Remote Working Security, Travel Security')
  })

  it('buildTrainingCategoryPayload returns categoryIds array', () => {
    expect(buildTrainingCategoryPayload([1, 2])).toEqual({
      categoryIds: [1, 2]
    })
  })

  it('appendTrainingCategoryFormData supports prefixed and root payload keys', () => {
    const payload = {
      values: [],
      append(key, value) {
        this.values.push([key, value])
      }
    }

    appendTrainingCategoryFormData(payload, 'trainingDetail', [1, 2])
    appendTrainingCategoryFormData(payload, '', [1])

    expect(payload.values).toEqual([
      ['trainingDetail.CategoryIds[0]', 1],
      ['trainingDetail.CategoryIds[1]', 2],
      ['CategoryIds[0]', 1]
    ])
  })
})
