import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportModalStep2 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep2.vue'

describe('TargetUserLDAPImportModalStep2.vue (render branches)', () => {
  const createWrapper = ({ propsData = {}, provide = {} } = {}) =>
    shallowMount(TargetUserLDAPImportModalStep2, {
      propsData: {
        selectedLDAPItems: [],
        step2Step: 0,
        step1Step: 0,
        isLoading: false,
        ...propsData
      },
      provide: {
        resourceId: 'ldap-1',
        isEdit: false,
        setSelectedUsers: jest.fn(),
        getServerSideSelectionParams: () => ({
          isSelectedAllEver: false,
          excludedResourceIdList: []
        }),
        ...provide
      },
      methods: {
        createLDAPMapping: jest.fn()
      },
      stubs: {
        KButtonRadioGroup: { name: 'KButtonRadioGroup', template: '<div class="radio-group-stub" />' },
        TargetUserLDAPImportLoader: {
          name: 'TargetUserLDAPImportLoader',
          template: '<div class="loader-stub" />'
        },
        TargetUserLdapImportManuallyStep: {
          name: 'TargetUserLdapImportManuallyStep',
          template: '<div class="manual-step-stub" />'
        },
        TargetUserLDAPImportSyncByQueryStep: {
          name: 'TargetUserLDAPImportSyncByQueryStep',
          template: '<div class="query-step-stub" />'
        }
      }
    })

  it('shows loader and hides step options while loading', () => {
    const wrapper = createWrapper({
      propsData: {
        isLoading: true
      }
    })

    expect(wrapper.find('.loader-stub').exists()).toBe(true)
    expect(wrapper.find('.radio-group-stub').exists()).toBe(false)
    expect(wrapper.find('.manual-step-stub').exists()).toBe(false)
    expect(wrapper.find('.query-step-stub').exists()).toBe(false)
  })

  it('renders manual step only for non-edit mode first option', async () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.manual-step-stub').exists()).toBe(true)
    expect(wrapper.find('.query-step-stub').exists()).toBe(false)

    await wrapper.setData({ selectedRadioGroupIndex: 1 })
    expect(wrapper.find('.manual-step-stub').exists()).toBe(false)
    expect(wrapper.find('.query-step-stub').exists()).toBe(true)
  })

  it('renders query step for edit mode first option', () => {
    const wrapper = createWrapper({
      provide: {
        isEdit: true
      }
    })

    expect(wrapper.find('.manual-step-stub').exists()).toBe(false)
    expect(wrapper.find('.query-step-stub').exists()).toBe(true)
  })
})
