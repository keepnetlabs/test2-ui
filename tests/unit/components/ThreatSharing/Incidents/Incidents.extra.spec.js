jest.mock('@/api/threatSharing', () => ({
  getCOmmunityIncidentList: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0 } } })
  ),
  getCommunityPost: jest.fn(() => Promise.resolve({ data: { data: { title: 'post' } } })),
  getIncidentList: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0 } } })
  ),
  listThreatCategories: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/components/ThreatSharing/Incidents/utils', () => ({
  getIncidentListPayload: jest.fn(() => ({ payload: true }))
}))

import Incidents from '@/components/ThreatSharing/Incidents/Incidents.vue'
import {
  getCOmmunityIncidentList,
  getCommunityPost,
  getIncidentList,
  listThreatCategories
} from '@/api/threatSharing'
import { getIncidentListPayload } from '@/components/ThreatSharing/Incidents/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Incidents.vue (branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('callForIncidentList calls search fetch only when load state is false', () => {
    const activeCtx = { isLoadState: false, getIncidentList: jest.fn() }
    const passiveCtx = { isLoadState: true, getIncidentList: jest.fn() }

    Incidents.methods.callForIncidentList.call(activeCtx)
    Incidents.methods.callForIncidentList.call(passiveCtx)

    expect(activeCtx.getIncidentList).toHaveBeenCalledWith('', '', true)
    expect(passiveCtx.getIncidentList).not.toHaveBeenCalled()
  })

  it('checkDatatableIsEmpty reflects active filters', () => {
    expect(
      Incidents.methods.checkDatatableIsEmpty.call({
        search: null,
        companyValue: null,
        threats: []
      })
    ).toBe(0)

    expect(
      !!Incidents.methods.checkDatatableIsEmpty.call({
        search: 'abc',
        companyValue: null,
        threats: []
      })
    ).toBe(true)
  })

  it('handleSizeChange and onChangePagination fetch only when allowed', () => {
    const ctx = {
      itemsPerPage: 5,
      isLoadState: false,
      getIncidentList: jest.fn()
    }

    Incidents.methods.handleSizeChange.call(ctx, 20)
    Incidents.methods.onChangePagination.call(ctx)

    expect(ctx.itemsPerPage).toBe(20)
    expect(ctx.getIncidentList).toHaveBeenCalledWith('', '', true)
    expect(ctx.getIncidentList).toHaveBeenCalledWith()
  })

  it('edit and modal helpers update state', () => {
    const ctx = {
      editItem: null,
      showPostIncident: false,
      $refs: { incidentModal: { onCancelClicked: jest.fn() } }
    }

    Incidents.methods.openEditPopupItemFunc.call(ctx, { id: 'post-1' })
    Incidents.methods.checkIfCanCloseIncidentModal.call(ctx)
    Incidents.methods.closeIncidentModal.call(ctx)

    expect(ctx.editItem).toEqual({ id: 'post-1' })
    expect(ctx.$refs.incidentModal.onCancelClicked).toHaveBeenCalled()
    expect(ctx.showPostIncident).toBe(false)
  })

  it('refreshDataFunc calls list refresh only when load state is false', () => {
    const readyCtx = { isLoadState: false, getIncidentList: jest.fn() }
    const blockedCtx = { isLoadState: true, getIncidentList: jest.fn() }

    Incidents.methods.refreshDataFunc.call(readyCtx)
    Incidents.methods.refreshDataFunc.call(blockedCtx)

    expect(readyCtx.getIncidentList).toHaveBeenCalled()
    expect(blockedCtx.getIncidentList).not.toHaveBeenCalled()
  })

  it('getThreats loads threat category list', async () => {
    const ctx = { threatsList: [] }

    Incidents.methods.getThreats.call(ctx)
    await flushPromises()

    expect(listThreatCategories).toHaveBeenCalled()
    expect(ctx.threatsList).toEqual([])
  })

  it('getIncidentList uses community incident API when memberId is provided', async () => {
    const ctx = {
      companyValue: null,
      page: 3,
      itemsPerPage: 10,
      search: 'mail',
      threats: ['th-1'],
      incidentLoading: false,
      incidentList: [{ id: 1 }],
      totalNumberOfRecords: null,
      totalNumberOfPages: null,
      isLoadState: false,
      isTableReload: false,
      $route: { params: { id: 'community-3' }, query: {}, name: 'Community' },
      $router: { currentRoute: { name: 'Community' } },
      $store: { dispatch: jest.fn() }
    }

    Incidents.methods.getIncidentList.call(ctx, 'member-1', '', true)
    await flushPromises()

    expect(getIncidentListPayload).toHaveBeenCalled()
    expect(getCOmmunityIncidentList).toHaveBeenCalledWith('community-3', { payload: true })
    expect(ctx.page).toBe(1)
    expect(ctx.incidentLoading).toBe(false)
  })

  it('getIncidentList uses global API branch when not in community route', async () => {
    getIncidentList.mockResolvedValueOnce({
      data: { data: { results: [{ id: 'x' }], totalNumberOfRecords: 1, totalNumberOfPages: 1 } }
    })

    const ctx = {
      companyValue: [],
      page: 2,
      itemsPerPage: 5,
      search: null,
      threats: [],
      incidentLoading: false,
      incidentList: [],
      totalNumberOfRecords: null,
      totalNumberOfPages: null,
      isLoadState: false,
      isTableReload: false,
      $route: { params: { id: 'community-4' }, query: {}, name: 'Threat Sharing' },
      $router: { currentRoute: { name: 'Threat Sharing' } },
      $store: { dispatch: jest.fn() }
    }

    Incidents.methods.getIncidentList.call(ctx, '', '', false)
    await flushPromises()

    expect(getIncidentList).toHaveBeenCalledWith({ payload: true })
    expect(ctx.incidentList).toEqual([{ id: 'x', isToggle: false }])
    expect(ctx.totalNumberOfRecords).toBe(1)
    expect(ctx.totalNumberOfPages).toBe(1)
    expect(ctx.incidentLoading).toBe(false)
  })

  it('getSharedPost handles forbidden response with redirect + snackbar', async () => {
    localStorage.setItem('communityName', 'Blue Team')
    getCommunityPost.mockRejectedValueOnce({ response: { status: 403 } })

    const push = jest.fn(() => Promise.resolve())
    const dispatch = jest.fn()
    const ctx = {
      incidentLoading: true,
      incidentList: [],
      $route: { query: { postId: 'post-9' }, params: { id: 'community-9' } },
      $router: { push },
      $store: { dispatch }
    }

    Incidents.methods.getSharedPost.call(ctx)
    await flushPromises()
    await new Promise((r) => setTimeout(r, 100))

    expect(push).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: expect.stringContaining('you need to join the Blue Team before viewing the post')
      })
    )
    expect(ctx.incidentLoading).toBe(false)
  })
})
