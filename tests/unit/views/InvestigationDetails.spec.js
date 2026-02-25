import InvestigationDetails from '@/views/InvestigationDetails.vue'

describe('InvestigationDetails.vue', () => {
  it('exports a vue component options object', () => {
    expect(InvestigationDetails).toBeDefined()
    expect(InvestigationDetails.methods.onAddClose).toBeDefined()
  })

  it('onAddClose pushes to router when resp has resourceId', () => {
    const push = jest.fn()
    const refreshDatatable = jest.fn()
    const ctx = { $router: { push }, refreshDatatable, timeoutId: null }
    InvestigationDetails.methods.onAddClose.call(ctx, {
      data: { data: { resourceId: 'inv-1' } }
    })
    expect(push).toHaveBeenCalledWith(
      '/incident-responder/investigations/investigation-details/inv-1'
    )
    expect(refreshDatatable).toHaveBeenCalled()
    expect(ctx.isWantToAddNewInvestigation).toBe(false)
  })
})
