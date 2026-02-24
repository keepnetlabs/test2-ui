import { shallowMount } from '@vue/test-utils'
import RightColumnDeleteCommunityDialog from '@/components/ThreatSharing/RightColumn/RightColumnDeleteCommunityDialog.vue'

describe('RightColumnDeleteCommunityDialog.vue (branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(RightColumnDeleteCommunityDialog, {
      propsData: {
        status: true,
        communityDetails: { name: 'Test Community' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('subtitle and body handle communityDetails with empty object', () => {
    const wrapper = createWrapper({ communityDetails: {} })
    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.attributes('subtitle')).toBeUndefined()
    expect(dialog.attributes('body')).toContain('undefined')
  })

  it('body shows undefined when communityDetails.name is missing', () => {
    const wrapper = createWrapper({ communityDetails: { id: '1' } })
    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.attributes('body')).toContain('undefined')
  })
})
