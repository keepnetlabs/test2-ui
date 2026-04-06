import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerLanguageSupportDialog from '@/components/CampaignManager/CampaignManagerLanguageSupportDialog'

describe('CampaignManagerLanguageSupportDialog.vue (extra)', () => {
  const localVue = createLocalVue()

  const mountWithStore = () => {
    return shallowMount(CampaignManagerLanguageSupportDialog, {
      localVue,
      propsData: {
        status: true,
        targetGroupResourceIds: [],
        selectedTargetGroups: [{ companyName: 'Acme' }],
        userCountDetailResponse: { data: { data: [] } }
      },
      mocks: {
        $store: {
          getters: {
            'login/getCurrentCompany': {
              name: 'Acme',
              preferredLanguageTypeName: 'English'
            }
          }
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true
      }
    })
  }

  it('getMissingCompanyLanguages is empty string when randomLanguages stayed empty', () => {
    const wrapper = mountWithStore()
    expect(wrapper.vm.randomLanguages).toEqual([])
    expect(wrapper.vm.getMissingCompanyLanguages).toBe('')
  })

  it('isCompanyNamesDifferent is false when every group matches current company name', () => {
    const wrapper = mountWithStore()
    expect(wrapper.vm.getCompanyName).toBe('Acme')
    expect(wrapper.vm.isCompanyNamesDifferent).toBe(false)
  })

  it('isCompanyNamesDifferent is true when a target group company differs', () => {
    const wrapper = shallowMount(CampaignManagerLanguageSupportDialog, {
      localVue,
      propsData: {
        status: true,
        targetGroupResourceIds: [],
        selectedTargetGroups: [{ companyName: 'OtherCo' }],
        userCountDetailResponse: { data: { data: [] } }
      },
      mocks: {
        $store: {
          getters: {
            'login/getCurrentCompany': {
              name: 'Acme',
              preferredLanguageTypeName: 'English'
            }
          }
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true
      }
    })
    expect(wrapper.vm.isCompanyNamesDifferent).toBe(true)
  })

  describe('computed getMissingPreferredLanguages branches', () => {
    const getMiss = CampaignManagerLanguageSupportDialog.computed.getMissingPreferredLanguages

    it('returns the sole language without e.g. prefix', () => {
      expect(getMiss.call({ preferredLanguages: ['German'] })).toBe('German')
    })

    it('joins 2–3 languages with e.g. when more than one', () => {
      expect(getMiss.call({ preferredLanguages: ['DE', 'FR'] })).toBe('e.g., DE, FR')
      expect(getMiss.call({ preferredLanguages: ['a', 'b', 'c'] })).toBe('e.g., a, b, c')
    })

    it('truncates to three samples and appends count when more than three', () => {
      expect(getMiss.call({ preferredLanguages: ['a', 'b', 'c', 'd'] })).toBe(
        'e.g., a, b, c, and 1 more'
      )
      expect(getMiss.call({ preferredLanguages: ['a', 'b', 'c', 'd', 'e'] })).toBe(
        'e.g., a, b, c, and 2 more'
      )
    })
  })

  describe('computed company getters without store company', () => {
    it('getCompanyPreferredLanguage and getCompanyName are undefined', () => {
      const store = { getters: { 'login/getCurrentCompany': null } }
      expect(
        CampaignManagerLanguageSupportDialog.computed.getCompanyPreferredLanguage.call({
          $store: store
        })
      ).toBeUndefined()
      expect(
        CampaignManagerLanguageSupportDialog.computed.getCompanyName.call({ $store: store })
      ).toBeUndefined()
    })
  })

  describe('methods', () => {
    it('handleClose emits on-close and handleConfirm emits on-confirm', () => {
      const emit = jest.fn()
      CampaignManagerLanguageSupportDialog.methods.handleClose.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('on-close')
      CampaignManagerLanguageSupportDialog.methods.handleConfirm.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('on-confirm')
    })
  })
})
