import { shallowMount } from '@vue/test-utils'
import DeleteAttackVector from '@/components/EmailThreatSmulator/DeleteAttackVector.vue'

jest.mock('@/api/emailThreatSimlator', () => ({
  deleteAttackVectorItem: jest.fn(() => Promise.resolve())
}))

import { deleteAttackVectorItem } from '@/api/emailThreatSimlator'

describe('DeleteAttackVector.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteAttackVector, {
      propsData: {
        status: true,
        selectedItem: { pluginResourceId: 'p1', pluginName: 'Test Vector' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('closeModal emits handleCloseModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('handleDelete calls deleteAttackVectorItem with pluginResourceId', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleDelete()
    expect(deleteAttackVectorItem).toHaveBeenCalledWith('p1')
  })

  it('handleDelete emits handleSuccessDeleteAction on success', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('handleSuccessDeleteAction')).toBeTruthy()
  })
})
