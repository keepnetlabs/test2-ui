jest.mock('@/api/awarenessEducator', () => ({
  getPhishedLandingPage: jest.fn().mockResolvedValue({
    data: {
      data: {
        informationMessage: '',
        redirectMessage: '',
        startButtonLabel: '',
        buttons: []
      }
    }
  })
}))

import PhishedLandingPage from '@/views/PhishedLandingPage.vue'

describe('PhishedLandingPage.vue', () => {
  it('has correct component name', () => {
    expect(PhishedLandingPage.name).toBe('PhishedLandingPage')
  })

  it('computed isMultiple returns true when buttons length > 1', () => {
    expect(
      PhishedLandingPage.computed.isMultiple.call({ buttons: [{}, {}] })
    ).toBe(true)
    expect(
      PhishedLandingPage.computed.isMultiple.call({ buttons: [{}] })
    ).toBe(false)
  })
})
