import { createLocalVue, shallowMount } from '@vue/test-utils'
import SettingsModal from '@/components/SettingsModal.vue'
import { getSystemUserSettings, getTimezone, setSystemUserSettings } from '@/api/settings'
import { deepCopyArray } from '@/utils/functions'

jest.mock('@/api/settings', () => ({
  getSystemUserSettings: jest.fn(),
  getTimezone: jest.fn(),
  setSystemUserSettings: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  deepCopyArray: jest.fn(val => [...val]) // simpler copy
}))

jest.mock('@/model/constants/labels', () => ({
  Settings: 'Settings Title',
  Cancel: 'Cancel',
  Confirm: 'Confirm'
}))

// Mock window.location.reload
const reloadMock = jest.fn()
Object.defineProperty(window, 'location', {
  value: { reload: reloadMock }
})

const storageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => { store[key] = value }),
    clear: jest.fn(() => { store = {} })
  }
})()
Object.defineProperty(window, 'localStorage', { value: storageMock })

describe('SettingsModal.vue', () => {
  const localVue = createLocalVue()

  beforeEach(() => {
    jest.clearAllMocks()
    getTimezone.mockResolvedValue({
      data: {
        data: {
          timeZoneList: [{ id: 'UTC', displayName: 'UTC' }, { id: 'IST', displayName: 'IST' }],
          dateFormatList: ['DD/MM/YYYY'],
          timeFormatList: ['24h']
        }
      }
    })
    getSystemUserSettings.mockResolvedValue({
      data: {
        data: {
          timeZoneId: 'UTC',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h'
        }
      }
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mountComponent = () => {
    return shallowMount(SettingsModal, {
      localVue,
      propsData: {
        showSettingsModalStatus: true
      },
      stubs: {
        AppDialog: {
          template: '<div><slot name="app-dialog-body"/><slot name="app-dialog-footer"/></div>'
        },
        KSelect: true,
        PostCardLoading: true
      }
    })
  }

  it('renders correctly and loads data on creation', async () => {
    // ... same content
    const wrapper = mountComponent()
    expect(getTimezone).toHaveBeenCalled()
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setImmediate(resolve)) // use setImmediate or just loop
    
    expect(getSystemUserSettings).toHaveBeenCalled()
    expect(wrapper.vm.formValues.timeZoneId).toBe('UTC')
    expect(wrapper.vm.loadingSettingsModal).toBe(false)
  })

  it('displays loading state', async () => {
    // ... same
    getTimezone.mockImplementation(() => new Promise(() => {})) 
    const wrapper = mountComponent()
    expect(wrapper.vm.loadingSettingsModal).toBe(true)
    expect(wrapper.find('postcardloading-stub').exists()).toBe(true)
  })

  it('filters timezone list based on search', async () => {
    const wrapper = mountComponent()
    
    // Wait for API call to populate list
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.timeZoneList.length).toBe(2)
    
    // Initialize search to empty string first to satisfy watcher oldVal !== null condition ??
    // Component logic: if (newVal && newVal.length && oldVal !== null)
    // Changing from null to 'IST' -> oldVal is null. Filter skipped.
    
    await wrapper.setData({ timeZoneSearchVal: '' })
    
    // Set search
    await wrapper.setData({ timeZoneSearchVal: 'IST' })
    
    expect(wrapper.vm.timeZoneList.length).toBe(1)
    expect(wrapper.vm.timeZoneList[0].id).toBe('IST')

    // Clear search
    await wrapper.setData({ timeZoneSearchVal: null })
    expect(wrapper.vm.timeZoneList.length).toBe(2)
  })

  it('saves settings and reloads', async () => {
    jest.useFakeTimers()
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    
    setSystemUserSettings.mockResolvedValue({
      data: { data: { dateFormat: 'Y-M-D', timeFormat: '12h' } }
    })
    
    wrapper.vm.setSystemUserSettings()
    
    expect(setSystemUserSettings).toHaveBeenCalledWith(wrapper.vm.formValues)
    
    // Allow promise to resolve
    await wrapper.vm.$nextTick()
    await Promise.resolve() 
    await Promise.resolve() 
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedDateFormat', 'Y-M-D')
    
    jest.runAllTimers()
    expect(window.location.reload).toHaveBeenCalled()
    expect(wrapper.emitted('changeSettings')).toBeTruthy()
  })
})
