import { shallowMount } from '@vue/test-utils'
import DisableMicrosoftTeamsModal from '@/components/Company Settings/MicrosoftTeamsSettings/DisableMicrosoftTeamsModal.vue'
import TeamsIntegrationModal from '@/components/Company Settings/MicrosoftTeamsSettings/TeamsIntegrationModal.vue'

describe('Microsoft Teams modals', () => {
  it('DisableMicrosoftTeamsModal emits close and confirm', () => {
    const wrapper = shallowMount(DisableMicrosoftTeamsModal, {
      propsData: {
        status: true,
        isActionButtonDisabled: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('TeamsIntegrationModal emits expected actions', () => {
    const wrapper = shallowMount(TeamsIntegrationModal, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        isStep2: false
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleCancel()
    wrapper.vm.handleCopyLink()
    wrapper.vm.handleEnableNow()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
    expect(wrapper.emitted('on-copy-link')).toBeTruthy()
    expect(wrapper.emitted('on-enable')).toBeTruthy()
  })

  it('TeamsIntegrationModal subtitle changes by step', async () => {
    const wrapper = shallowMount(TeamsIntegrationModal, {
      propsData: {
        status: true,
        isStep2: false
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      }
    })

    expect(wrapper.findComponent({ name: 'AppDialog' }).attributes('subtitle')).toBe(
      'Connect to Teams (Access 1)'
    )

    await wrapper.setProps({ isStep2: true })
    expect(wrapper.findComponent({ name: 'AppDialog' }).attributes('subtitle')).toBe(
      'Enable Training Notifications (Access 2)'
    )
  })
})
