import { shallowMount } from '@vue/test-utils'
import Trash from '@/components/AwarenessEducator/Enrollments/Trash.vue'

describe('Trash.vue', () => {
  const createWrapper = () =>
    shallowMount(Trash, {
      stubs: {
        EnrollmentsSubTabs: true
      },
      mocks: {
        $store: {
          getters: {
            'trainingLibraryHelpers/getLanguages': [{ id: 1, name: 'English' }],
            'trainingLibraryHelpers/getCategories': [{ id: 2, name: 'Security' }],
            'trainingLibraryHelpers/getTargetAudiences': [{ id: 3, name: 'All Users' }]
          }
        }
      }
    })

  it('renders enrollments sub tabs in trash mode with helper props', () => {
    const wrapper = createWrapper()
    const subTabs = wrapper.findComponent({ name: 'EnrollmentsSubTabs' })
    expect(subTabs.exists()).toBe(true)
    expect(subTabs.props('isTrash')).toBe(true)
    expect(subTabs.props('languages')).toEqual([{ id: 1, name: 'English' }])
    expect(subTabs.props('categories')).toEqual([{ id: 2, name: 'Security' }])
    expect(subTabs.props('targetAudiences')).toEqual([{ id: 3, name: 'All Users' }])
  })

  it('toggles delete dialog and resets selected row when closing', async () => {
    const wrapper = createWrapper()
    const callForData = jest.fn()
    wrapper.vm.$refs.refTable = { callForData }
    wrapper.vm.selectedRow = { id: 'row-1' }

    wrapper.vm.toggleShowDeleteDialog(true)
    await wrapper.vm.$nextTick()
    expect(callForData).toHaveBeenCalled()
    expect(wrapper.vm.isShowDeleteDialog).toBe(true)

    wrapper.vm.toggleShowDeleteDialog()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBeNull()
  })
})
