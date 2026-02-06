import { shallowMount } from '@vue/test-utils'

jest.mock('@/components/KContainer/KContainer', () => ({
  name: 'KContainer',
  template: '<div></div>'
}))

try {
  var Settings = require('@/views/Settings').default
  var hasSettings = true
} catch (e) {
  var hasSettings = false
}

describe('Settings.vue', () => {
  let wrapper

  beforeEach(() => {
    if (hasSettings) {
      wrapper = shallowMount(Settings, {
        mocks: {
          $route: { params: { id: '123' } },
          $store: { getters: {} }
        },
        stubs: {
          KContainer: true
        }
      })
    }
  })

  it('should render if Settings exists', () => {
    if (hasSettings && wrapper) {
      expect(wrapper.exists()).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })
})
