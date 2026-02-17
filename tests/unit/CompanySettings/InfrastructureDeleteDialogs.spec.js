import { shallowMount } from '@vue/test-utils'
import DeleteProxySettings from '@/components/Company Settings/ProxySettings/DeleteProxySettings.vue'
import DeleteCustomApi from '@/components/Company Settings/RestApi/DeleteCustomApi.vue'

describe('Company Settings infrastructure delete dialogs', () => {
  it('DeleteProxySettings computes subtitle and emits delete/close', () => {
    const wrapper = shallowMount(DeleteProxySettings, {
      propsData: {
        status: true,
        data: { name: 'Proxy A', resourceId: 'p-1' }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.getSubtitle).toBe('Proxy A')

    wrapper.vm.handleDelete()

    expect(wrapper.emitted('handleDelete')).toEqual([[{ name: 'Proxy A', resourceId: 'p-1' }]])
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })

  it('DeleteCustomApi computes title/subtitle and emits actions', () => {
    const wrapper = shallowMount(DeleteCustomApi, {
      propsData: {
        status: true,
        saveDisable: false,
        selectedRow: { clientName: 'Integration API', resourceId: 'api-22' }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.getTitle).toBe('Delete Rest API')
    expect(wrapper.vm.getSubtitle).toBe('Integration API')

    wrapper.vm.closeModal()
    wrapper.vm.handleDelete()

    expect(wrapper.emitted('closeDialog')).toBeTruthy()
    expect(wrapper.emitted('handleDelete')).toEqual([['api-22']])
  })
})
