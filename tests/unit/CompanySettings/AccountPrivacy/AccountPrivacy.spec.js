import { shallowMount } from '@vue/test-utils'
import AccountPrivacy from '@/components/Company Settings/AccountPrivacy/AccountPrivacy.vue'
import { getCompanyPrivacy } from '@/api/company'
import { PRIVACY_DURATIONS } from '@/components/Company Settings/AccountPrivacy/utils'

jest.mock('@/api/company', () => ({
  getCompanyPrivacy: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AccountPrivacy.vue', () => {
  const createWrapper = (selectedTimeZone = 'UTC', dispatchMock = jest.fn(() => Promise.resolve())) =>
    shallowMount(AccountPrivacy, {
      stubs: {
        CompanySettingsHeader: true,
        AccountPrivacyDialog: true,
        DatatableLoading: true,
        FormGroup: true,
        KSelect: true,
        VIcon: true,
        VBtn: true
      },
      mocks: {
        $store: {
          getters: {
            'common/getSelectedTimeZoneName': selectedTimeZone
          },
          dispatch: dispatchMock
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyResourceId', '1')
    localStorage.setItem('selectedCompanyRequestId', '1')
    getCompanyPrivacy.mockResolvedValue({
      data: {
        data: {
          privacyDurationId: PRIVACY_DURATIONS.DENY,
          privacyDurationStartTime: '2025-01-01 00:00',
          privacyDurationEndTime: '2025-01-01 02:00'
        }
      }
    })
  })

  it('loads privacy data on created and maps access text/icon', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getCompanyPrivacy).toHaveBeenCalled()
    expect(wrapper.vm.privacyDurationId).toBe(PRIVACY_DURATIONS.DENY)
    expect(wrapper.vm.confirmedPrivacyDurationId).toBe(PRIVACY_DURATIONS.DENY)
    expect(wrapper.vm.accessIcon).toBe('mdi-lock')
    expect(wrapper.vm.accessText).toContain('denied')
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('computes time allowed text and access button style', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.setData({ privacyDurationId: PRIVACY_DURATIONS.TWO_HOURS, isConfirmed: false })
    expect(wrapper.vm.getTimeAllowed).toBe('2 hours')
    expect(wrapper.vm.getAccessButtonStyle.color).toBe('#2196F3')

    await wrapper.setData({ privacyDurationId: PRIVACY_DURATIONS.SEVEN_DAYS, isConfirmed: true })
    expect(wrapper.vm.getTimeAllowed).toBe('7 days')
    expect(wrapper.vm.getAccessButtonStyle.color).toBe('#43A047')
  })

  it('changes confirmation state when privacy duration changes', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.setData({
      confirmedPrivacyDurationId: PRIVACY_DURATIONS.DENY,
      privacyDurationId: PRIVACY_DURATIONS.TWO_HOURS
    })
    wrapper.vm.handlePrivacyDurationChange()
    expect(wrapper.vm.isConfirmed).toBe(false)

    await wrapper.setData({ privacyDurationId: PRIVACY_DURATIONS.DENY })
    wrapper.vm.handlePrivacyDurationChange()
    expect(wrapper.vm.isConfirmed).toBe(true)
  })

  it('opens dialog only when not confirmed', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ isConfirmed: true, isShowAccountPrivacyDialog: false })
    wrapper.vm.handleAccessPeriod()
    expect(wrapper.vm.isShowAccountPrivacyDialog).toBe(false)

    await wrapper.setData({ isConfirmed: false })
    wrapper.vm.handleAccessPeriod()
    expect(wrapper.vm.isShowAccountPrivacyDialog).toBe(true)
  })

  it('shows return main account warning based on local storage values', () => {
    let wrapper = createWrapper()
    expect(wrapper.vm.isReturnMainAccountVisible).toBe(false)
    wrapper.destroy()
    localStorage.setItem('selectedCompanyRequestId', '2')
    wrapper = createWrapper()
    expect(wrapper.vm.isReturnMainAccountVisible).toBe(true)
  })

  it('created requests settings when selected timezone is missing', async () => {
    const dispatch = jest.fn(() => Promise.resolve())
    createWrapper('', dispatch)
    await flushPromises()
    expect(dispatch).toHaveBeenCalledWith('common/callForSettings')
  })

  it('setAccessTextAndIcon handles continuous access branch', () => {
    const ctx = {
      privacyDurationId: PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY,
      accessIcon: '',
      accessText: ''
    }
    AccountPrivacy.methods.setAccessTextAndIcon.call(ctx)

    expect(ctx.accessIcon).toBe('mdi-lock-open-outline')
    expect(ctx.accessText).toContain('continuous access')
  })

  it('toggleShowAccountPrivacyDialog toggles and refreshes when forceUpdate is true', () => {
    const callForData = jest.fn()
    const ctx = {
      isShowAccountPrivacyDialog: false,
      callForData
    }

    AccountPrivacy.methods.toggleShowAccountPrivacyDialog.call(ctx, true)
    expect(callForData).toHaveBeenCalled()
    expect(ctx.isShowAccountPrivacyDialog).toBe(true)

    AccountPrivacy.methods.toggleShowAccountPrivacyDialog.call(ctx, false)
    expect(ctx.isShowAccountPrivacyDialog).toBe(false)
  })

  it('callForData falls back to defaults when response is empty', async () => {
    getCompanyPrivacy.mockResolvedValueOnce({})
    const ctx = {
      setLoading: jest.fn(),
      privacyDurationId: 999,
      privacyDurationStartTime: 'x',
      privacyDurationEndTime: 'y',
      confirmedPrivacyDurationId: 999,
      isConfirmed: false,
      setAccessTextAndIcon: jest.fn()
    }

    AccountPrivacy.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.privacyDurationId).toBe(PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY)
    expect(ctx.privacyDurationStartTime).toBe('')
    expect(ctx.privacyDurationEndTime).toBe('')
    expect(ctx.confirmedPrivacyDurationId).toBe(PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY)
    expect(ctx.isConfirmed).toBe(true)
    expect(ctx.setAccessTextAndIcon).toHaveBeenCalled()
  })
})
