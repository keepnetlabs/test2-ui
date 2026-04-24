import {
  TRAINING_LIBRARY_TYPES,
  TRAINING_LIBRARY_SEARCH_TYPES,
  TRAINING_LIBRARY_COLUMNS,
  distributionDelayTimeTypes,
  addTrainingItems,
  emptyTrainingDeleteDialogObj,
  isInavailable,
  getAutoEnrollText
} from '@/components/TrainingLibrary/utils'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibrary utils', () => {
  describe('TRAINING_LIBRARY_TYPES', () => {
    it('has expected type keys', () => {
      expect(TRAINING_LIBRARY_TYPES.LEARNING_PATH).toBe('Learning Path')
      expect(TRAINING_LIBRARY_TYPES.TRAINING).toBe('Training')
      expect(TRAINING_LIBRARY_TYPES.POSTER).toBe('Poster')
      expect(TRAINING_LIBRARY_TYPES.INFOGRAPHIC).toBe('Infographic')
      expect(TRAINING_LIBRARY_TYPES.SCREENSAVER).toBe('Screensaver')
      expect(TRAINING_LIBRARY_TYPES.SURVEY).toBe('Survey')
    })
  })

  describe('TRAINING_LIBRARY_SEARCH_TYPES', () => {
    it('has expected search type values', () => {
      expect(TRAINING_LIBRARY_SEARCH_TYPES.All).toBe(1)
      expect(TRAINING_LIBRARY_SEARCH_TYPES.MostPopular).toBe(2)
      expect(TRAINING_LIBRARY_SEARCH_TYPES.Favourites).toBe(3)
      expect(TRAINING_LIBRARY_SEARCH_TYPES.CreatedByMe).toBe(4)
    })
  })

  describe('distributionDelayTimeTypes', () => {
    it('has seconds, minutes, hours', () => {
      expect(distributionDelayTimeTypes).toHaveLength(3)
      expect(distributionDelayTimeTypes[0]).toEqual({ text: 'seconds', value: '1' })
      expect(distributionDelayTimeTypes[1]).toEqual({ text: 'minutes', value: '2' })
      expect(distributionDelayTimeTypes[2]).toEqual({ text: 'hours', value: '3' })
    })
  })

  describe('TRAINING_LIBRARY_COLUMNS.LEARNING_PATH_DURATION', () => {
    it('points to the totalDuration backend field while keeping the Duration label', () => {
      expect(TRAINING_LIBRARY_COLUMNS.LEARNING_PATH_DURATION.property).toBe(
        PROPERTY_STORE.TOTAL_DURATION
      )
      expect(TRAINING_LIBRARY_COLUMNS.LEARNING_PATH_DURATION.label).toBe(
        TRAINING_LIBRARY_COLUMNS.DURATION.label
      )
    })

    it('mirrors the legacy DURATION column shape except for the property key (drift guard)', () => {
      const { property: lpProp, ...lpRest } = TRAINING_LIBRARY_COLUMNS.LEARNING_PATH_DURATION
      const { property: legacyProp, ...legacyRest } = TRAINING_LIBRARY_COLUMNS.DURATION

      expect(lpProp).not.toBe(legacyProp)
      expect(lpRest).toEqual(legacyRest)
    })
  })

  describe('addTrainingItems', () => {
    it('has all training item types with ids', () => {
      expect(addTrainingItems).toHaveLength(6)
      expect(addTrainingItems.find((i) => i.text === 'Learning Path').id).toBe(
        'btn-add-training-library-learning-path'
      )
      expect(addTrainingItems.find((i) => i.text === 'Survey').id).toBe(
        'btn-add-training-library-survey'
      )
    })
  })

  describe('emptyTrainingDeleteDialogObj', () => {
    it('has default structure and onClose function', () => {
      expect(emptyTrainingDeleteDialogObj.status).toBe(false)
      expect(emptyTrainingDeleteDialogObj.title).toBe('')
      expect(emptyTrainingDeleteDialogObj.body).toBe('')
      expect(emptyTrainingDeleteDialogObj.selectedRow).toBeNull()
      expect(typeof emptyTrainingDeleteDialogObj.onClose).toBe('function')
    })
  })

  describe('isInavailable', () => {
    it('returns false when selectedCompanyName is System', () => {
      expect(
        isInavailable(['MyCompanyOnly'], { availableFor: ['MyCompanyOnly'] }, 'c1', 'System')
      ).toBe(false)
    })

    it('returns false when training availableFor includes AllCompanies', () => {
      expect(
        isInavailable(
          ['MyCompanyOnly'],
          { availableFor: ['AllCompanies'] },
          'c1',
          'My Company'
        )
      ).toBe(false)
    })

    it('returns false when MyCompanyOnly matches', () => {
      expect(
        isInavailable(
          ['MyCompanyOnly'],
          { availableFor: ['MyCompanyOnly'] },
          'c1',
          'My Company'
        )
      ).toBe(false)
    })

    it('returns false when every availableFor item is in training', () => {
      expect(
        isInavailable(
          ['c1', 'c2'],
          { availableFor: ['c1', 'c2'] },
          'c1',
          'My Company'
        )
      ).toBe(false)
    })

    it('returns true when not available', () => {
      expect(
        isInavailable(
          ['c1'],
          { availableFor: ['c3'] },
          'c1',
          'My Company'
        )
      ).toBe(true)
    })
  })

  describe('getAutoEnrollText', () => {
    it('returns text for autoEnrollType next', () => {
      expect(
        getAutoEnrollText('next', 'Monday', {}, 'weeks')
      ).toContain('on the next Monday')
    })

    it('returns text for autoEnrollType in', () => {
      expect(
        getAutoEnrollText('in', null, { periodCount: 2 }, 'weeks')
      ).toContain('in 2 weeks')
    })

    it('returns text for other autoEnrollType', () => {
      expect(getAutoEnrollText('manual', null, {}, null)).toContain('Automatically enroll new users manual')
    })
  })
})
