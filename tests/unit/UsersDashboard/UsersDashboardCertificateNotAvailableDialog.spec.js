import { shallowMount } from '@vue/test-utils'
import UsersDashboardCertificateNotAvailableDialog from '@/components/UsersDashboard/UsersDashboardCertificateNotAvailableDialog.vue'

describe('UsersDashboardCertificateNotAvailableDialog.vue', () => {
  const createWrapper = (propsData = {}, getterOverrides = {}) =>
    shallowMount(UsersDashboardCertificateNotAvailableDialog, {
      propsData: {
        status: true,
        trainingUrl: 'https://example.com/training',
        ...propsData
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': {
              yourCertificatesNotAvailableTitle: 'Certificate unavailable',
              yourCertificatesWarningCanRetakeNoCertificate: 'No certificate available.',
              yourLearningStartTraining: 'Start training',
              cancel: 'Cancel'
            },
            ...getterOverrides
          }
        }
      }
    })

  it('renders and computes dialog title from labels', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardCertificateNotAvailableDialog')
    expect(wrapper.vm.dialogTitle).toBe('Certificate unavailable')
  })

  it('falls back to default title when label is missing', () => {
    const wrapper = createWrapper({}, {
      'usersDashboard/getLabels': {}
    })
    expect(wrapper.vm.dialogTitle).toBe('Certificate Not Available')
  })

  it('emits on-close on handleClose and handleCancel', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleCancel()

    expect(wrapper.emitted('on-close')).toHaveLength(2)
  })

  it('opens training url and closes dialog on handleStartTraining', () => {
    const wrapper = createWrapper({ trainingUrl: 'https://example.com/x' })
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})

    wrapper.vm.handleStartTraining()

    expect(openSpy).toHaveBeenCalledWith('https://example.com/x', '_blank')
    expect(wrapper.emitted('on-close')).toBeTruthy()
    openSpy.mockRestore()
  })

  it('does not open window when trainingUrl is empty but still closes', () => {
    const wrapper = createWrapper({ trainingUrl: '' })
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})

    wrapper.vm.handleStartTraining()

    expect(openSpy).not.toHaveBeenCalled()
    expect(wrapper.emitted('on-close')).toBeTruthy()
    openSpy.mockRestore()
  })
})
