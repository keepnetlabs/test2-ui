jest.mock('@/api/integrations', () => ({
  createIntegration: jest.fn(() => Promise.resolve()),
  getIntegrationDetails: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  testAnalysis: jest.fn(() => Promise.resolve({ data: { status: 'SUCCESS' } })),
  updateIntegration: jest.fn(() => Promise.resolve()),
  getAnalysisEngineFormOptions: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: jest.fn(() => false),
    scrollToComponent: jest.fn()
  }
})

import { shallowMount } from '@vue/test-utils'
import NewIntegration from '@/components/Integrations/NewIntegration.vue'
import { INTEGRATION_TYPES } from '@/model/constants/commonConstants'

describe('NewIntegration.vue render', () => {
  const mountComponent = () =>
    shallowMount(NewIntegration, {
      propsData: {
        showModal: true
      },
      methods: {
        getFormOptions: jest.fn()
      },
      stubs: {
        AppModal: { template: '<div><slot name="overlay-body"/><slot name="overlay-footer"/></div>' },
        AppDialog: { template: '<div><slot name="app-dialog-footer"/></div>' },
        AppModalBodyHeader: true,
        FormGroup: { template: '<div><slot/></div>' },
        KSelect: { template: '<div><slot/></div>' },
        InputEntityName: true,
        InputDescription: true,
        InputNumber: true,
        'v-form': { template: '<form><slot/></form>' },
        'v-overlay': { template: '<div><slot/></div>' },
        'v-card': { template: '<div><slot/></div>' },
        'v-list-item': { template: '<div><slot/></div>' },
        'v-list-item-content': { template: '<div><slot/></div>' },
        'v-list-item-title': { template: '<div><slot/></div>' },
        'v-list-item-subtitle': { template: '<div><slot/></div>' },
        'v-text-field': {
          props: ['id'],
          template: '<input :id="id" />'
        },
        'v-btn': { template: '<button><slot/></button>' },
        'v-icon': true
      },
      mocks: {
        $store: { dispatch: jest.fn() },
        $set: (obj, key, val) => {
          obj[key] = val
        }
      }
    })

  it('shows API Key section when integration is not custom', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({
      integrationTypes: [
        {
          resourceId: 'anyrun-id',
          name: INTEGRATION_TYPES.ANYRUN,
          isSendFile: true,
          isSendFileHash: true,
          isSendUrl: true,
          isSendIp: false,
          isHideUrlParameter: false
        }
      ]
    })
    await wrapper.setData({
      formValues: {
        ...wrapper.vm.formValues,
        analysisEngineTypeResourceId: 'anyrun-id',
        apiUrl: 'https://api.any.run/v1/analysis',
        apiKeys: [{ value: '', status: null, resourceId: null }]
      }
    })
    wrapper.vm.handleIntegrationTypeChange('anyrun-id')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isCustomIntegration).toBe(false)
    expect(wrapper.find('#integration-api-key-footer-add-api-key').exists()).toBe(true)
    expect(wrapper.find('#input--integration-api-key-0').exists()).toBe(true)
    expect(wrapper.find('#input--integration-client-id').exists()).toBe(false)
  })

  it('hides API Key section and shows client credentials when integration is custom', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({
      integrationTypes: [
        {
          resourceId: 'custom-id',
          name: INTEGRATION_TYPES.CUSTOMINTEGRATION,
          isSendFile: true,
          isSendFileHash: true,
          isSendUrl: true,
          isSendIp: false,
          isHideUrlParameter: false
        }
      ]
    })
    await wrapper.setData({
      formValues: {
        ...wrapper.vm.formValues,
        analysisEngineTypeResourceId: 'custom-id',
        apiUrl: window.location.origin,
        apiKey: '',
        password: ''
      }
    })
    wrapper.vm.handleIntegrationTypeChange('custom-id')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isCustomIntegration).toBe(true)
    expect(wrapper.find('#integration-api-key-footer-add-api-key').exists()).toBe(false)
    expect(wrapper.find('#input--integration-api-key-0').exists()).toBe(false)
    expect(wrapper.find('#input--integration-client-id').exists()).toBe(true)
    expect(wrapper.find('#input--integration-client-secret').exists()).toBe(true)
  })
})
