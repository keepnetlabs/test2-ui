import { shallowMount, createLocalVue } from '@vue/test-utils'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES, TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const localVue = createLocalVue()

describe('EnrollmentsSubTabs.vue - Extra Branch Coverage', () => {
  const createWrapper = (getters = {}) => {
    return shallowMount(EnrollmentsSubTabs, {
      localVue,
      mocks: {
        $store: {
          getters: {
            'trainingLibrary/getTrainingPreviewDialog': {},
            ...getters
          },
          dispatch: jest.fn()
        },
        $router: { push: jest.fn() }
      },
      stubs: {
        TrainingLibraryCommonComponents: true,
        EditEnrollmentsModal: true,
        SendEnrollmentDialog: true,
        DeleteEnrollmentDialog: true,
        TrashDeletePermanentlyDialog: true,
        StopEnrollmentDialog: true,
        StopReminderDialog: true,
        StopAutoEnrollDialog: true,
        ElTabs: true,
        ElTabPane: true,
        EnrollmentsAllTypesTable: true
      }
    })
  }

  describe('getEditEnrollmentsModalTitle Branching', () => {
    it('returns Infographic title', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Infographic Enrollment')
    })

    it('returns default Training title for other types', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { type: 'Other' } })
      expect(wrapper.vm.getEditEnrollmentsModalTitle).toBe('Edit Training Enrollment')
    })
  })

  describe('handleRouteToReport Branching', () => {
    const testCases = [
      { type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC, expected: 2 },
      { type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER, expected: 3 },
      { type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH, expected: 4 },
      { type: TRAINING_LIBRARY_TYPES.LEARNING_PATH, expected: 4 }
    ]

    testCases.forEach(({ type, expected }) => {
      it(`sets trainingType ${expected} for ${type}`, () => {
        const wrapper = createWrapper()
        wrapper.vm.handleRouteToReport({ enrollmentId: '1', type })
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
          expect.objectContaining({ query: { trainingType: expected } })
        )
      })
    })
  })

  describe('Dialog Toggles', () => {
    it('toggleShowPermanentlyDeleteDialog resets selectedRow when closing', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isShowDeletePermanentlyDialog: true, selectedRow: { id: 1 } })
      wrapper.vm.toggleShowPermanentlyDeleteDialog()
      expect(wrapper.vm.selectedRow).toBe(null)
    })

    it('toggleShowEditEnrollmentModal toggles visibility', () => {
      const wrapper = createWrapper()
      wrapper.vm.toggleShowEditEnrollmentModal()
      expect(wrapper.vm.isShowEditEnrollmentModal).toBe(true)
    })
  })

  describe('handleDeleteRowClick', () => {
    it('sets row and shows dialog', () => {
      const wrapper = createWrapper()
      const row = { id: 5 }
      wrapper.vm.handleDeleteRowClick(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDeleteEnrollmentsDialog).toBe(true)
    })
  })
})
