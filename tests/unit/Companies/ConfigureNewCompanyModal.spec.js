import { shallowMount } from '@vue/test-utils'
import ConfigureNewCompanyModal from '@/components/Companies/ConfigureNewCompanyModal.vue'
import { createSystemUser, getSystemUsersRole } from '@/api/systemUsers'
import { updateWhiteLabel } from '@/api/whitelabel'
import { scrollToComponent, getDefaultAxiosPayload } from '@/utils/functions'

jest.mock('@/api/systemUsers', () => ({
  createSystemUser: jest.fn(() => Promise.resolve()),
  getSystemUsersRole: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { name: 'Company Admin', resourceId: 'r-admin' },
          { name: 'Analyst', resourceId: 'r-analyst' }
        ]
      }
    })
  )
}))

jest.mock('@/api/whitelabel', () => ({
  updateWhiteLabel: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn((props = {}, orderBy = null) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: orderBy || 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
    ...props
  })),
  scrollToComponent: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ConfigureNewCompanyModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ConfigureNewCompanyModal, {
      propsData: {
        status: true,
        createdCompanyResourceId: 'company-1',
        ...propsData
      },
      stubs: {
        AppModal: true,
        ConfigureCompanyStepHeader: true,
        WhiteLabeling: true,
        CreateOrEditSystemUserForm: true,
        ConfigureNewCompanyNextSteps: true,
        VBtn: true,
        VStepper: true,
        VStepperHeader: true,
        VStepperStep: true,
        VDivider: true,
        VStepperItems: true,
        VStepperContent: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads roles on created and sets default role id', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getDefaultAxiosPayload).toHaveBeenCalledWith({ pageSize: 1000 }, 'RoleName')
    expect(getSystemUsersRole).toHaveBeenCalled()
    expect(wrapper.vm.roleItems).toEqual([
      { name: 'Company Admin', resourceId: 'r-admin' },
      { name: 'Analyst', resourceId: 'r-analyst' }
    ])
    expect(wrapper.vm.systemUserFormData.roleResourceIdList).toBe('r-admin')
  })

  it('changes step and emits close event', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeStep()
    expect(wrapper.vm.step).toBe(2)

    wrapper.vm.changeStep(-1)
    expect(wrapper.vm.step).toBe(1)

    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('on-close')).toEqual([[]])
  })

  it('maps status value to status name', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleChangeStatus(1)
    expect(wrapper.vm.systemUserFormData.statusName).toBe('Active')
  })

  it('creates system user and advances step', async () => {
    const wrapper = createWrapper({ createdCompanyResourceId: 'company-1' })
    const stepSpy = jest.spyOn(wrapper.vm, 'changeStep')
    wrapper.setData({ isSaveDisabled: true })

    await wrapper.vm.callForCreateSystemUser({ name: 'User A' })
    await flushPromises()

    expect(createSystemUser).toHaveBeenCalledWith({
      name: 'User A',
      CompanyResourceId: 'company-1'
    })
    expect(stepSpy).toHaveBeenCalled()
    expect(wrapper.vm.isSaveDisabled).toBe(false)
  })

  it('resets loading state when create system user request does not advance step', async () => {
    createSystemUser.mockImplementationOnce(() => ({
      then: () => ({
        finally: (cb) => cb()
      })
    }))
    const wrapper = createWrapper()
    const stepSpy = jest.spyOn(wrapper.vm, 'changeStep')
    wrapper.setData({ isSaveDisabled: true })

    wrapper.vm.callForCreateSystemUser({ name: 'User C' })
    await wrapper.vm.$nextTick()

    expect(stepSpy).not.toHaveBeenCalled()
    expect(wrapper.vm.isSaveDisabled).toBe(false)
  })

  it('saves white labeling and updates child state on success', async () => {
    const wrapper = createWrapper()
    const stepSpy = jest.spyOn(wrapper.vm, 'changeStep')
    const refWhiteLabeling = {
      configureCompanyWhitelabelingResourceId: 'wl-1',
      formValues: { mainDomainUrl: 'acme.com', acceptDnsRecordSettings: true },
      acceptedDnsRecordSettingsDomain: 'old.com',
      isWhiteLabelLoading: true,
      isShowDomainDialog: true
    }

    wrapper.vm.saveWhiteLabeling(refWhiteLabeling)
    await flushPromises()

    expect(updateWhiteLabel).toHaveBeenCalled()
    expect(stepSpy).toHaveBeenCalled()
    expect(refWhiteLabeling.formValues.acceptDnsRecordSettings).toBe(false)
    expect(refWhiteLabeling.acceptedDnsRecordSettingsDomain).toBe('')
    expect(refWhiteLabeling.isWhiteLabelLoading).toBe(false)
    expect(refWhiteLabeling.isShowDomainDialog).toBe(false)
  })

  it('handles white labeling 404 error branch', async () => {
    updateWhiteLabel.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { validationMessages: ['Title', 'Message'] }
      }
    })
    const wrapper = createWrapper()
    const refWhiteLabeling = {
      configureCompanyWhitelabelingResourceId: 'wl-1',
      formValues: { mainDomainUrl: 'acme.com', acceptDnsRecordSettings: true },
      acceptedDnsRecordSettingsDomain: '',
      toggleWhiteLabelingDomainDialog: jest.fn()
    }

    wrapper.vm.saveWhiteLabeling(refWhiteLabeling)
    await flushPromises()

    expect(refWhiteLabeling.whiteLabelingErrorTitle).toBe('Title')
    expect(refWhiteLabeling.whiteLabelingErrorMessage).toBe('Message')
    expect(refWhiteLabeling.acceptedDnsRecordSettingsDomain).toBe('acme.com')
    expect(refWhiteLabeling.toggleWhiteLabelingDomainDialog).toHaveBeenCalled()
  })

  it('handles step-1 save flow based on child form validation', () => {
    const wrapper = createWrapper()
    const saveSpy = jest.spyOn(wrapper.vm, 'saveWhiteLabeling').mockImplementation(() => {})
    wrapper.vm.$refs.refWhiteLabeling = {
      $refs: { refForm: { validate: jest.fn(() => true) } }
    }

    wrapper.vm.handleSaveAndContinue()
    expect(saveSpy).toHaveBeenCalled()
  })

  it('does not save white labeling when step-1 form is invalid', () => {
    const wrapper = createWrapper()
    const saveSpy = jest.spyOn(wrapper.vm, 'saveWhiteLabeling').mockImplementation(() => {})
    wrapper.vm.$refs.refWhiteLabeling = {
      $refs: { refForm: { validate: jest.fn(() => false) } }
    }

    wrapper.vm.handleSaveAndContinue()

    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('handles step-2 valid form flow and normalizes phone number', () => {
    const wrapper = createWrapper()
    const createSpy = jest.spyOn(wrapper.vm, 'callForCreateSystemUser').mockImplementation(() => {})
    wrapper.setData({
      step: 2,
      systemUserFormData: {
        phoneNumber: '+1 555 100 20',
        roleResourceIdList: 'r-admin'
      }
    })
    wrapper.vm.$refs.refForm = {
      validatePhoneNumber: jest.fn(() => true),
      validate: jest.fn(() => true)
    }

    wrapper.vm.handleSaveAndContinue()

    expect(wrapper.vm.isSaveDisabled).toBe(true)
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber: '+155510020',
        roleResourceIdList: ['r-admin']
      })
    )
  })

  it('handles step-2 invalid form flow and scrolls to first error', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ step: 2 })
    wrapper.vm.$forceUpdate = jest.fn()
    wrapper.vm.$refs.refForm = {
      validatePhoneNumber: jest.fn(() => false),
      validate: jest.fn(() => false),
      $el: { querySelector: jest.fn(() => '#err') }
    }

    wrapper.vm.handleSaveAndContinue()
    await wrapper.vm.$nextTick()

    expect(scrollToComponent).toHaveBeenCalledWith('#err')
  })

  it('closes overlay on step-3 save action', () => {
    const wrapper = createWrapper()
    const closeSpy = jest.spyOn(wrapper.vm, 'closeOverlay')
    wrapper.setData({ step: 3 })

    wrapper.vm.handleSaveAndContinue()

    expect(closeSpy).toHaveBeenCalled()
  })

  it('creates system user without injecting company id when createdCompanyResourceId is empty', async () => {
    const wrapper = createWrapper({ createdCompanyResourceId: '' })

    await wrapper.vm.callForCreateSystemUser({ name: 'User B' })
    await flushPromises()

    expect(createSystemUser).toHaveBeenCalledWith({ name: 'User B' })
  })

  it('handles non-404 white labeling errors without opening domain dialog', async () => {
    updateWhiteLabel.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { validationMessages: ['ErrTitle', 'ErrMessage'] }
      }
    })
    const wrapper = createWrapper()
    const refWhiteLabeling = {
      configureCompanyWhitelabelingResourceId: 'wl-1',
      formValues: { mainDomainUrl: 'acme.com', acceptDnsRecordSettings: true },
      acceptedDnsRecordSettingsDomain: '',
      toggleWhiteLabelingDomainDialog: jest.fn()
    }

    wrapper.vm.saveWhiteLabeling(refWhiteLabeling)
    await flushPromises()

    expect(refWhiteLabeling.toggleWhiteLabelingDomainDialog).not.toHaveBeenCalled()
    expect(refWhiteLabeling.whiteLabelingErrorTitle).toBeUndefined()
  })

  it('maps default role for CompanyAdmin variant from roles api', async () => {
    getSystemUsersRole.mockResolvedValueOnce({
      data: {
        data: [
          { name: 'CompanyAdmin', resourceId: 'r-company-admin' },
          { name: 'Analyst', resourceId: 'r-analyst' }
        ]
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.systemUserFormData.roleResourceIdList).toBe('r-company-admin')
  })

  it('throws on unknown status in handleChangeStatus to document expected input', () => {
    const wrapper = createWrapper()

    expect(() => wrapper.vm.handleChangeStatus(99)).toThrow()
  })
})
