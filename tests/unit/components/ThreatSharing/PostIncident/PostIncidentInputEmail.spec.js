import { shallowMount } from '@vue/test-utils'
import PostIncidentInputEmail from '@/components/ThreatSharing/PostIncident/PostIncidentInputEmail.vue'
import { searchNotifiedMail } from '@/api/threatSharing'

jest.mock('@/api/threatSharing', () => ({
  searchNotifiedMail: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [
            {
              subject: 'Test Incident',
              createTime: '2024-01-01',
              result: 'Malicious',
              attachmentCount: 0
            }
          ]
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PostIncidentInputEmail.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(PostIncidentInputEmail, {
      propsData: {
        value: null,
        ...propsData
      },
      mocks: {
        $route: { params: { id: 'comm-1' } }
      },
      stubs: {
        KSelect: true,
        KSelectLoading: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('loads incidents on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(searchNotifiedMail).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 500000,
      orderBy: 'createTime',
      ascending: false,
      clusteredBy: ''
    })
    expect(wrapper.vm.listData).toHaveLength(1)
    expect(wrapper.vm.listData[0].subject).toBe('Test Incident')
    expect(wrapper.vm.isFindIncidentLoading).toBe(false)
  })

  it('model get returns value prop', () => {
    const wrapper = createWrapper({ value: { subject: 'Selected' } })
    expect(wrapper.vm.model).toEqual({ subject: 'Selected' })
  })

  it('model set emits input', () => {
    const wrapper = createWrapper()
    wrapper.vm.model = { subject: 'New' }
    expect(wrapper.emitted('input')[0]).toEqual([{ subject: 'New' }])
  })

  it('handleChange emits on-change', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleChange({ subject: 'Changed' })
    expect(wrapper.emitted('on-change')[0]).toEqual([{ subject: 'Changed' }])
  })

  it('querySelections returns true when no queryText', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.querySelections({ subject: 'x' }, '')).toBe(true)
  })

  it('querySelections filters by queryText', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.querySelections({ subject: 'Test Incident' }, 'test')).toBe(true)
    expect(wrapper.vm.querySelections({ subject: 'Other' }, 'test')).toBe(false)
  })

  it('handleFocus sets showLoader from isFindIncidentLoading', () => {
    const wrapper = createWrapper()
    wrapper.vm.isFindIncidentLoading = true
    wrapper.vm.handleFocus()
    expect(wrapper.vm.showLoader).toBe(true)
  })
})
