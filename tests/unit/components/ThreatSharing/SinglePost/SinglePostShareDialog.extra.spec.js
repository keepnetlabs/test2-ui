jest.mock('@/api/threatSharing', () => ({
  shareAPost: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import SinglePostShareDialog from '@/components/ThreatSharing/SinglePost/SinglePostShareDialog.vue'
import { shareAPost } from '@/api/threatSharing'

describe('SinglePostShareDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SinglePostShareDialog, {
      propsData: {
        status: true,
        sharedIncitedId: 'post-1',
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn(() => Promise.resolve())
        }
      },
      stubs: { AppDialog: true, AppDialogFooter: true, KSelect: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('shareIncident calls shareAPost when form valid', async () => {
    const wrapper = createWrapper({ sharedIncitedId: 'p1' })
    wrapper.setData({ shareEmail: ['a@a.com'] })
    wrapper.vm.$refs = { shareModal: { validate: () => true } }
    wrapper.vm.shareIncident()
    await new Promise((r) => setTimeout(r, 0))

    expect(shareAPost).toHaveBeenCalledWith('p1', { emailArray: ['a@a.com'] })
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
