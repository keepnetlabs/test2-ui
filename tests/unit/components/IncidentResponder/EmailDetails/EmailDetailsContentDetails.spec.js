import { shallowMount } from '@vue/test-utils'
import EmailDetailsContentDetails from '@/components/IncidentResponder/EmailDetails/EmailDetailsContentDetails.vue'

describe('EmailDetailsContentDetails.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(EmailDetailsContentDetails, {
      propsData: {
        mailDetails: {
          to: ['a@test.com', 'b@test.com'],
          cc: ['c@test.com'],
          bcc: ['d@test.com'],
          from: 'sender@test.com',
          analysisDate: '2024-01-01',
          status: 'Analyzed'
        },
        ...propsData
      },
      mocks: {
        $route: { params: { id: 'inc-1' } },
        $store: {
          getters: {
            'permissions/getIncidentResponderNotifiedEmailReAnalyze': true
          }
        }
      },
      stubs: { ReAnalyzeIncidentDialog: true, EmailDetailsSenderIpBlacklistCheck: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getMailDetailsTo joins to array', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getMailDetailsTo).toBe('a@test.com, b@test.com')
  })

  it('getMailDetailsTo returns empty when to missing', () => {
    const wrapper = mountComponent({ mailDetails: {} })
    expect(wrapper.vm.getMailDetailsTo).toBeFalsy()
  })

  it('getMailDetailsCc joins cc array', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getMailDetailsCc).toBe('c@test.com')
  })

  it('getMailDetailsBcc joins bcc array', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getMailDetailsBcc).toBe('d@test.com')
  })

  it('getResourceId returns route param id', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getResourceId).toBe('inc-1')
  })

  it('isReAnalyzeDisabled true when status BeingAnalyzed', () => {
    const wrapper = mountComponent({
      mailDetails: { status: 'BeingAnalyzed' }
    })
    expect(wrapper.vm.isReAnalyzeDisabled).toBe(true)
  })

  it('isReAnalyzeDisabled true when permission false', () => {
    const wrapper = shallowMount(EmailDetailsContentDetails, {
      propsData: { mailDetails: { status: 'Analyzed' } },
      mocks: {
        $route: { params: { id: 'inc-1' } },
        $store: { getters: { 'permissions/getIncidentResponderNotifiedEmailReAnalyze': false } }
      },
      stubs: { ReAnalyzeIncidentDialog: true, EmailDetailsSenderIpBlacklistCheck: true }
    })
    expect(wrapper.vm.isReAnalyzeDisabled).toBe(true)
  })

  it('toggleShowReAnalyzeDialog toggles dialog', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.showReAnalyzeIncidentDialog).toBe(false)
    wrapper.vm.toggleShowReAnalyzeDialog()
    expect(wrapper.vm.showReAnalyzeIncidentDialog).toBe(true)
    wrapper.vm.toggleShowReAnalyzeDialog()
    expect(wrapper.vm.showReAnalyzeIncidentDialog).toBe(false)
  })

  it('handleReAnalyze calls toggleShowReAnalyzeDialog', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleShowReAnalyzeDialog = jest.fn()
    wrapper.vm.handleReAnalyze()
    expect(wrapper.vm.toggleShowReAnalyzeDialog).toHaveBeenCalled()
  })
})
