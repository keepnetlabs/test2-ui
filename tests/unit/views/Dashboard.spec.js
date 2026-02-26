import DashBoard from '@/views/DashBoard.vue'

describe('DashBoard.vue', () => {
  it('registers Widgets component', () => {
    expect(DashBoard.components.Widgets).toBeDefined()
  })

  it('has permissions computed mapping', () => {
    expect(DashBoard.computed.permissions).toBeDefined()
  })
})
