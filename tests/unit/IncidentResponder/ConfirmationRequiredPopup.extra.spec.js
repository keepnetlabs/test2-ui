import { shallowMount } from '@vue/test-utils'
import ConfirmationRequiredPopup from '@/components/IncidentResponder/ConfirmationRequiredPopup.vue'

describe('ConfirmationRequiredPopup.vue (extra branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ConfirmationRequiredPopup, {
      propsData,
      stubs: {
        AppDialog: {
          template:
            '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true
      }
    })

  it('renders notified confirmation message with email and user counts', () => {
    const wrapper = createWrapper({
      status: true,
      emailCount: 3,
      userCount: 12,
      isNotified: true
    })

    expect(wrapper.text()).toContain('The edit action will be applied to the selected 3 emails')
    expect(wrapper.text()).toContain('12 users will be notified about the update')
  })

  it('renders simpler confirmation message when notifications are not sent', () => {
    const wrapper = createWrapper({
      status: true,
      emailCount: 5,
      userCount: 99,
      isNotified: false
    })

    expect(wrapper.text()).toContain('The edit action will be applied to the selected 5 emails')
    expect(wrapper.text()).not.toContain('99 users will be notified about the update')
  })
})
