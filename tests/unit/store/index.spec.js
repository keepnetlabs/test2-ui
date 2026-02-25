import store from '@/store/index'

describe('store/index.js', () => {
  it('creates a Vuex store instance', () => {
    expect(store).toBeDefined()
    expect(store.state).toBeDefined()
  })

  it('has expected modules', () => {
    expect(store.state.common).toBeDefined()
    expect(store.state.login).toBeDefined()
    expect(store.state.auth).toBeDefined()
    expect(store.state.permissions).toBeDefined()
  })
})
