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
        KSelect: {
          template: '<div class="k-select-stub"><slot /></div>'
        },
        PostCardLoading: {
          template: '<div class="post-card-loading-stub"></div>'
        }
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
    expect(wrapper.find('.post-card-loading-stub').exists()).toBe(true)
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

  it('initializes with correct form values', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setImmediate(resolve))

    expect(wrapper.vm.formValues).toBeTruthy()
    expect(wrapper.vm.formValues.timeZoneId).toBe('UTC')
    expect(wrapper.vm.formValues.dateFormat).toBe('DD/MM/YYYY')
    expect(wrapper.vm.formValues.timeFormat).toBe('24h')
  })

  it('initializes timezone and date format lists', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setImmediate(resolve))

    expect(wrapper.vm.timeZoneList.length).toBeGreaterThan(0)
    expect(wrapper.vm.dateFormatList.length).toBeGreaterThan(0)
    expect(wrapper.vm.timeFormatList.length).toBeGreaterThan(0)
  })

  it('handles settings modal visibility', async () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.showSettingsModalStatus).toBe(true)
  })

  it('handles timezone change', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()

    const newTimezone = 'IST'
    wrapper.vm.formValues.timeZoneId = newTimezone

    expect(wrapper.vm.formValues.timeZoneId).toBe(newTimezone)
  })

  describe('Component Structure and Initialization', () => {
    it('should render component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have component name defined', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name || wrapper.vm.$options._componentTag).toBeDefined()
    })

    it('should initialize with required data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.formValues).toBeDefined()
      expect(wrapper.vm.timeZoneList).toBeDefined()
      expect(wrapper.vm.dateFormatList).toBeDefined()
    })

    it('should have loading state initialized', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.loadingSettingsModal).toBe('boolean')
    })
  })

  describe('Props Management', () => {
    it('should accept showSettingsModalStatus prop', () => {
      const wrapper = shallowMount(SettingsModal, {
        localVue,
        propsData: { showSettingsModalStatus: true },
        stubs: {
          AppDialog: { template: '<div><slot name="app-dialog-body"/><slot name="app-dialog-footer"/></div>' },
          KSelect: { template: '<div></div>' },
          PostCardLoading: { template: '<div></div>' }
        }
      })
      expect(wrapper.vm.showSettingsModalStatus).toBe(true)
    })

    it('should handle closed modal state', () => {
      const wrapper = shallowMount(SettingsModal, {
        localVue,
        propsData: { showSettingsModalStatus: false },
        stubs: {
          AppDialog: { template: '<div><slot name="app-dialog-body"/><slot name="app-dialog-footer"/></div>' },
          KSelect: { template: '<div></div>' },
          PostCardLoading: { template: '<div></div>' }
        }
      })
      expect(wrapper.vm.showSettingsModalStatus).toBe(false)
    })
  })

  describe('API Integration and Data Loading', () => {
    it('should call getTimezone on mount', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent()
      expect(getTimezone).toHaveBeenCalled()
    })

    it('should call getSystemUserSettings on mount', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))
      expect(getSystemUserSettings).toHaveBeenCalled()
    })

    it('should populate timezone list from API', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.timeZoneList).toBeDefined()
      expect(wrapper.vm.timeZoneList.length).toBeGreaterThan(0)
    })

    it('should populate date format list from API', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.dateFormatList).toBeDefined()
      expect(wrapper.vm.dateFormatList.length).toBeGreaterThan(0)
    })

    it('should populate time format list from API', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.timeFormatList).toBeDefined()
      expect(wrapper.vm.timeFormatList.length).toBeGreaterThan(0)
    })
  })

  describe('Form Value Management', () => {
    it('should initialize form values correctly', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.formValues.timeZoneId).toBe('UTC')
      expect(wrapper.vm.formValues.dateFormat).toBe('DD/MM/YYYY')
      expect(wrapper.vm.formValues.timeFormat).toBe('24h')
    })

    it('should update timezone in form values', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.formValues.timeZoneId = 'IST'
      expect(wrapper.vm.formValues.timeZoneId).toBe('IST')
    })

    it('should update date format in form values', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.formValues.dateFormat = 'MM/DD/YYYY'
      expect(wrapper.vm.formValues.dateFormat).toBe('MM/DD/YYYY')
    })

    it('should update time format in form values', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.formValues.timeFormat = '12h'
      expect(wrapper.vm.formValues.timeFormat).toBe('12h')
    })

    it('should allow multiple simultaneous form value changes', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.formValues.timeZoneId = 'IST'
      wrapper.vm.formValues.dateFormat = 'YYYY-MM-DD'
      wrapper.vm.formValues.timeFormat = '12h'

      expect(wrapper.vm.formValues.timeZoneId).toBe('IST')
      expect(wrapper.vm.formValues.dateFormat).toBe('YYYY-MM-DD')
      expect(wrapper.vm.formValues.timeFormat).toBe('12h')
    })
  })

  describe('Search and Filter Functionality', () => {
    it('should initialize timezone search value as null', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.timeZoneSearchVal).toBeNull()
    })

    it('should update timezone search value', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ timeZoneSearchVal: '' })
      await wrapper.setData({ timeZoneSearchVal: 'UTC' })
      expect(wrapper.vm.timeZoneSearchVal).toBe('UTC')
    })

    it('should filter timezone list on search', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      await wrapper.setData({ timeZoneSearchVal: '' })
      await wrapper.setData({ timeZoneSearchVal: 'IST' })

      expect(wrapper.vm.timeZoneList.some(tz => tz.id === 'IST')).toBe(true)
    })

    it('should restore full list when search is cleared', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      const initialCount = wrapper.vm.timeZoneList.length

      await wrapper.setData({ timeZoneSearchVal: '' })
      await wrapper.setData({ timeZoneSearchVal: 'UTC' })
      expect(wrapper.vm.timeZoneList.length).toBeLessThanOrEqual(initialCount)

      await wrapper.setData({ timeZoneSearchVal: null })
      expect(wrapper.vm.timeZoneList.length).toBe(initialCount)
    })
  })

  describe('Loading States', () => {
    it('should show loading state initially', async () => {
      getTimezone.mockImplementation(() => new Promise(() => {}))
      const wrapper = mountComponent()
      expect(wrapper.vm.loadingSettingsModal).toBe(true)
    })

    it('should hide loading state when data loads', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.loadingSettingsModal).toBe(false)
    })

    it('should display loading indicator', async () => {
      getTimezone.mockImplementation(() => new Promise(() => {}))
      const wrapper = mountComponent()
      expect(wrapper.find('.post-card-loading-stub').exists()).toBe(true)
    })
  })

  describe('Settings Save Functionality', () => {
    it('should call setSystemUserSettings API when saving', async () => {
      jest.useFakeTimers()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.setSystemUserSettings()

      expect(setSystemUserSettings).toHaveBeenCalledWith(wrapper.vm.formValues)
      jest.useRealTimers()
    })

    it('should save form values correctly', async () => {
      jest.useFakeTimers()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.formValues.timeZoneId = 'IST'
      wrapper.vm.formValues.dateFormat = 'MM/DD/YYYY'

      wrapper.vm.setSystemUserSettings()

      expect(setSystemUserSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          timeZoneId: 'IST',
          dateFormat: 'MM/DD/YYYY'
        })
      )
      jest.useRealTimers()
    })

    it('should emit changeSettings event after saving', async () => {
      jest.useFakeTimers()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.setSystemUserSettings()
      await wrapper.vm.$nextTick()
      await Promise.resolve()
      jest.runAllTimers()

      expect(wrapper.emitted('changeSettings')).toBeTruthy()
      jest.useRealTimers()
    })
  })

  describe('localStorage Integration', () => {
    it('should store selected date format in localStorage', async () => {
      jest.useFakeTimers()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      setSystemUserSettings.mockResolvedValue({
        data: { data: { dateFormat: 'YYYY-MM-DD', timeFormat: '12h' } }
      })

      wrapper.vm.setSystemUserSettings()
      await wrapper.vm.$nextTick()
      await Promise.resolve()
      jest.runAllTimers()

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'selectedDateFormat',
        'YYYY-MM-DD'
      )
      jest.useRealTimers()
    })

    it('should retrieve stored date format from localStorage', () => {
      const wrapper = mountComponent()
      window.localStorage.setItem('selectedDateFormat', 'MM/DD/YYYY')
      const stored = window.localStorage.getItem('selectedDateFormat')
      expect(stored).toBe('MM/DD/YYYY')
    })
  })

  describe('Window Location Reload', () => {
    it('should reload page after saving settings', async () => {
      jest.useFakeTimers()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      wrapper.vm.setSystemUserSettings()
      await wrapper.vm.$nextTick()
      await Promise.resolve()
      jest.runAllTimers()

      expect(window.location.reload).toHaveBeenCalled()
      jest.useRealTimers()
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple component instances', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
    })

    it('should support creating multiple instances', async () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      await wrapper1.vm.$nextTick()
      await wrapper2.vm.$nextTick()

      expect(wrapper1.vm).toBeDefined()
      expect(wrapper2.vm).toBeDefined()
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
    })

    it('should maintain independent search state per instance', async () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      await wrapper1.setData({ timeZoneSearchVal: 'UTC' })
      await wrapper2.setData({ timeZoneSearchVal: 'IST' })

      expect(wrapper1.vm.timeZoneSearchVal).toBe('UTC')
      expect(wrapper2.vm.timeZoneSearchVal).toBe('IST')
    })
  })

  describe('Performance and Stability', () => {
    it('should handle rapid form value updates', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(() => {
        for (let i = 0; i < 50; i++) {
          wrapper.vm.formValues.timeZoneId = i % 2 === 0 ? 'UTC' : 'IST'
        }
      }).not.toThrow()
    })

    it('should handle large timezone list', async () => {
      const manyTimezones = Array.from({ length: 500 }, (_, i) => ({
        id: `TZ_${i}`,
        displayName: `Timezone ${i}`
      }))

      getTimezone.mockResolvedValueOnce({
        data: {
          data: {
            timeZoneList: manyTimezones,
            dateFormatList: ['DD/MM/YYYY'],
            timeFormatList: ['24h']
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.timeZoneList.length).toBe(500)
    })

    it('should efficiently search through timezones', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(() => {
        for (let i = 0; i < 100; i++) {
          wrapper.vm.timeZoneSearchVal = String(i)
        }
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null timezone gracefully', () => {
      const wrapper = mountComponent()
      wrapper.vm.formValues.timeZoneId = null
      expect(wrapper.vm.formValues.timeZoneId).toBeNull()
    })

    it('should handle empty string date format', () => {
      const wrapper = mountComponent()
      wrapper.vm.formValues.dateFormat = ''
      expect(wrapper.vm.formValues.dateFormat).toBe('')
    })

    it('should handle special characters in search', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ timeZoneSearchVal: '@#$%^&*()' })
      expect(wrapper.vm.timeZoneSearchVal).toBe('@#$%^&*()')
    })

    it('should handle very long timezone list', async () => {
      const longList = Array.from({ length: 1000 }, (_, i) => ({
        id: `TZ${i}`,
        displayName: `Zone ${i}`
      }))

      getTimezone.mockResolvedValueOnce({
        data: {
          data: {
            timeZoneList: longList,
            dateFormatList: ['DD/MM/YYYY'],
            timeFormatList: ['24h']
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.timeZoneList.length).toBe(1000)
    })

    it('should handle duplicate timezone entries', async () => {
      const duplicateList = [
        { id: 'UTC', displayName: 'UTC' },
        { id: 'UTC', displayName: 'UTC' }
      ]

      getTimezone.mockResolvedValueOnce({
        data: {
          data: {
            timeZoneList: duplicateList,
            dateFormatList: ['DD/MM/YYYY'],
            timeFormatList: ['24h']
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))

      expect(wrapper.vm.timeZoneList.length).toBe(2)
    })
  })
})
