import { shallowMount } from '@vue/test-utils'
import ChangeStatusAttackVector from '@/components/EmailThreatSmulator/ChangeStatusAttackVector.vue'

jest.mock('@/api/emailThreatSimlator', () => ({
  disableAttackVector: jest.fn(() => Promise.resolve()),
  enableAttackVector: jest.fn(() => Promise.resolve())
}))

import { disableAttackVector, enableAttackVector } from '@/api/emailThreatSimlator'

describe('ChangeStatusAttackVector.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ChangeStatusAttackVector, {
      propsData: {
        status: true,
        selectedItem: { pluginResourceId: 'p1', status: 'Enabled' },
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

  it('handleStatus calls disableAttackVector when status is Enabled', async () => {
    const wrapper = createWrapper({ selectedItem: { pluginResourceId: 'p1', status: 'Enabled' } })
    wrapper.vm.handleStatus()
    await wrapper.vm.$nextTick()
    expect(disableAttackVector).toHaveBeenCalledWith({ resourceIds: ['p1'] })
  })

  it('handleStatus calls enableAttackVector when status is Disabled', async () => {
    const wrapper = createWrapper({ selectedItem: { pluginResourceId: 'p1', status: 'Disabled' } })
    wrapper.vm.handleStatus()
    await wrapper.vm.$nextTick()
    expect(enableAttackVector).toHaveBeenCalledWith({ resourceIds: ['p1'] })
  })

  it('handleStatus emits handleSuccessStatusAction on success', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleStatus()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('handleSuccessStatusAction')).toBeTruthy()
  })
})
