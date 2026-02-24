jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    deleteCertificate: jest.fn(() => Promise.resolve())
  }
}))

import { shallowMount } from '@vue/test-utils'
import DeleteCertificateDialog from '@/components/AwarenessEducator/Certificates/DeleteCertificateDialog.vue'
import { EMITS } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('DeleteCertificateDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteCertificateDialog, {
      propsData: {
        status: true,
        selectedRow: { id: 1 },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits ON_CLOSE with forceUpdate', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[true]])
  })

  it('handleDelete calls deleteCertificate and emits ON_CLOSE', async () => {
    const wrapper = createWrapper({ selectedRow: { id: 5 } })
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))

    expect(AwarenessEducatorService.deleteCertificate).toHaveBeenCalledWith(5)
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[true]])
  })
})
