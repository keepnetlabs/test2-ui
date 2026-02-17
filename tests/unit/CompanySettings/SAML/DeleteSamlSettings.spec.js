import { shallowMount } from '@vue/test-utils'
import DeleteSamlSettings from '@/components/Company Settings/SAML/DeleteSamlSettings.vue'
import { deleteSamlSettings } from '@/api/samlSettings'

jest.mock('@/api/samlSettings', () => ({
  deleteSamlSettings: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DeleteSamlSettings.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteSamlSettings, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'saml-1', name: 'Main SAML' },
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

  it('computes subtitle and emits close', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getSubtitle).toBe('Main SAML')

    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('deletes selected SAML and emits on-delete + on-close', async () => {
    const wrapper = createWrapper()

    wrapper.vm.handleDelete()
    expect(wrapper.vm.saveDisable).toBe(true)

    await flushPromises()

    expect(deleteSamlSettings).toHaveBeenCalledWith('saml-1')
    expect(wrapper.emitted('on-delete')).toEqual([[{ resourceId: 'saml-1', name: 'Main SAML' }]])
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.vm.saveDisable).toBe(false)
  })
})
