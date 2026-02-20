jest.mock('@vue/test-utils', () => ({
  mount: jest.fn(() => 'mounted-wrapper')
}))

jest.mock('../utils', () => ({
  customVuetify: 'mock-vuetify'
}))

import { mount } from '@vue/test-utils'
import ShowMore from './ShowMore'

describe('tests/unit/Objects/ShowMore helper class', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates wrapper via mount with provided localVue/propsData/vuetify', () => {
    const localVue = { name: 'local-vue' }
    const propsData = { data: [{ subject: 'a' }] }

    const instance = new ShowMore(localVue, propsData)

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        localVue,
        propsData,
        vuetify: 'mock-vuetify'
      })
    )
    expect(instance.wrapper).toBe('mounted-wrapper')
  })

  it('getWrapper returns the wrapper reference', () => {
    const instance = new ShowMore({}, {})
    expect(instance.getWrapper()).toBe('mounted-wrapper')
  })
})
