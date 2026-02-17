import { shallowMount } from '@vue/test-utils'
import DeleteDirectEmailCreationDialog from '@/components/Company Settings/DirectEmailCreation/DeleteDirectEmailCreationDialog.vue'
import DirectCreationService from '@/api/direct-creation'

jest.mock('@/api/direct-creation', () => ({
  __esModule: true,
  default: {
    deleteEmailCreation: jest.fn(() => Promise.resolve())
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DeleteDirectEmailCreationDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteDirectEmailCreationDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'dec-1', name: 'Microsoft Profile' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes subtitle from selected row', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getSubtitle).toBe('Microsoft Profile')
  })

  it('emits on-close with forceUpdate argument', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted('on-close')).toEqual([[false], [true]])
  })

  it('deletes config and closes with update', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await flushPromises()

    expect(DirectCreationService.deleteEmailCreation).toHaveBeenCalledWith('dec-1')
    expect(wrapper.emitted('on-close')).toContainEqual([true])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
