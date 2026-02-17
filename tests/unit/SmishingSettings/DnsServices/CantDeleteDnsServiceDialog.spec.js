import { shallowMount } from '@vue/test-utils'
import CantDeleteDnsServiceDialog from '@/components/SmishingSettings/DnsServices/CantDeleteDnsServiceDialog.vue'

describe('SmishingSettings CantDeleteDnsServiceDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CantDeleteDnsServiceDialog, {
      propsData: {
        status: true,
        selectedRow: { dnsServiceProviderName: 'AWS Route53' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('computes subtitle from selected row', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getSubtitle).toBe('AWS Route53')
  })

  it('emits on-close with forceUpdate value', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted('on-close')).toEqual([[false], [true]])
  })
})
