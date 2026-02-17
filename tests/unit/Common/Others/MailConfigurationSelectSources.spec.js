import { shallowMount } from '@vue/test-utils'
import MailConfigurationSelectSources from '@/components/Common/Others/MailConfigurationSelectSources.vue'
import { getInvestigationScanTypes } from '@/api/investigations'
import { getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'

jest.mock('@/api/investigations', () => ({
  getInvestigationScanTypes: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#999999'),
  getDataTableFieldLabel: jest.fn((value) => value)
}))

const flushPromises = () => new Promise(setImmediate)

describe('MailConfigurationSelectSources.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads options on create and normalizes outlook and status', async () => {
    getInvestigationScanTypes.mockResolvedValue({
      data: {
        data: [
          { mailConfigurationResourceId: '1', mailConfigurationName: 'Legacy', type: 'Outlook' },
          {
            mailConfigurationResourceId: '2',
            mailConfigurationName: 'SMTP',
            type: 'SMTP',
            statusName: 'Paused'
          }
        ]
      }
    })

    const wrapper = shallowMount(MailConfigurationSelectSources, {
      propsData: { value: [] },
      stubs: {
        KSelect: true,
        MailConfigurationSelectItem: true,
        'v-chip': true
      }
    })

    await flushPromises()

    expect(wrapper.vm.$options.name).toBe('MailConfigurationSelectSources')
    expect(getInvestigationScanTypes).toHaveBeenCalled()
    expect(wrapper.vm.options[0].mailConfigurationName).toBe('Outlook')
    expect(wrapper.vm.options[0].statusName).toBe('Running')
    expect(wrapper.vm.options[1].statusName).toBe('Paused')
  })

  it('checkIsItemDisabled and getBtnStatusColor return expected values', () => {
    const wrapper = shallowMount(MailConfigurationSelectSources, {
      propsData: { value: [] },
      stubs: {
        KSelect: true,
        MailConfigurationSelectItem: true,
        'v-chip': true
      }
    })

    wrapper.setData({
      selectedSources: [{ mailConfigurationResourceId: 'all' }]
    })

    expect(wrapper.vm.checkIsItemDisabled({ mailConfigurationResourceId: 'all' })).toBe(false)
    expect(
      wrapper.vm.checkIsItemDisabled({
        mailConfigurationResourceId: 'x',
        statusName: 'Stopped'
      })
    ).toBe(true)
    expect(
      wrapper.vm.checkIsItemDisabled({
        mailConfigurationResourceId: 'x',
        statusName: 'Running'
      })
    ).toBe(true)

    expect(wrapper.vm.getBtnStatusColor('Running')).toBe('#217124')
    expect(wrapper.vm.getBtnStatusColor('Paused')).toBe('#999999')
    expect(getBtnStatusColor).toHaveBeenCalledWith('Paused')
  })

  it('emits mapped payload on handleInputChange', () => {
    const wrapper = shallowMount(MailConfigurationSelectSources, {
      propsData: { value: [] },
      stubs: {
        KSelect: true,
        MailConfigurationSelectItem: true,
        'v-chip': true
      }
    })

    wrapper.vm.handleInputChange([
      { mailConfigurationResourceId: '1', type: 'SMTP', extra: 'x' },
      { mailConfigurationResourceId: '2', type: 'Graph', foo: 'bar' }
    ])

    expect(wrapper.emitted('input')).toEqual([
      [
        [
          { mailConfigurationResourceId: '1', type: 'SMTP' },
          { mailConfigurationResourceId: '2', type: 'Graph' }
        ]
      ]
    ])
  })

  it('watcher selects valid options when all is selected and clears when removed', async () => {
    const wrapper = shallowMount(MailConfigurationSelectSources, {
      propsData: { value: [] },
      methods: {
        callForOptions: jest.fn()
      },
      stubs: {
        KSelect: true,
        MailConfigurationSelectItem: true,
        'v-chip': true
      }
    })

    await wrapper.setData({
      options: [
        { mailConfigurationResourceId: 'all', statusName: 'Running' },
        { mailConfigurationResourceId: 'r-1', statusName: 'Running' },
        { mailConfigurationResourceId: 's-1', statusName: 'Stopped' }
      ],
      selectedSources: [{ mailConfigurationResourceId: 'all', statusName: 'Running' }]
    })

    await wrapper.vm.$nextTick()
    const emissions = wrapper.emitted('input')
    expect(emissions[0][0]).toEqual([
      { mailConfigurationResourceId: 'all', statusName: 'Running' },
      { mailConfigurationResourceId: 'r-1', statusName: 'Running' }
    ])

    await wrapper.setData({ selectedSources: [] })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('input')[1][0]).toEqual([])
  })

  it('shouldRenderTooltip and checkbox helper return expected values', async () => {
    const wrapper = shallowMount(MailConfigurationSelectSources, {
      propsData: {
        value: [{ mailConfigurationResourceId: 'x' }]
      },
      methods: {
        callForOptions: jest.fn()
      },
      stubs: {
        KSelect: true,
        MailConfigurationSelectItem: true,
        'v-chip': true
      }
    })

    expect(wrapper.vm.shouldRenderTooltip({ mailConfigurationResourceId: 'all' })).toBe(false)
    expect(
      wrapper.vm.shouldRenderTooltip({ mailConfigurationResourceId: 'x', statusName: 'Stopped' })
    ).toBe(true)
    expect(
      wrapper.vm.shouldRenderTooltip({ mailConfigurationResourceId: 'x', statusName: 'Running' })
    ).toBe(undefined)

    expect(wrapper.vm.getCheckboxCheckedValue({ mailConfigurationResourceId: 'x' })).toBe(true)

    await wrapper.setData({
      options: [
        { mailConfigurationResourceId: 'all', statusName: 'Running' },
        { mailConfigurationResourceId: 'r', statusName: 'Running' }
      ],
      selectedSources: [{ mailConfigurationResourceId: 'all' }]
    })
    expect(wrapper.vm.getCheckboxCheckedValue({ mailConfigurationResourceId: 'r', statusName: 'Running' })).toBe(
      true
    )
  })

  it('passes through getDataTableFieldLabel helper', () => {
    const wrapper = shallowMount(MailConfigurationSelectSources, {
      propsData: { value: [] },
      methods: {
        callForOptions: jest.fn()
      },
      stubs: {
        KSelect: true,
        MailConfigurationSelectItem: true,
        'v-chip': true
      }
    })

    wrapper.vm.getDataTableFieldLabel('statusName')
    expect(getDataTableFieldLabel).toHaveBeenCalledWith('statusName')
  })
})
