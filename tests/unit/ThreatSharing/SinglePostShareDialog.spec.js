jest.mock('@/api/threatSharing', () => ({
  shareAPost: jest.fn()
}))

import SinglePostShareDialog from '@/components/ThreatSharing/SinglePost/SinglePostShareDialog.vue'
import { shareAPost } from '@/api/threatSharing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SinglePostShareDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data initializes rules and button state', () => {
    const data = SinglePostShareDialog.data()
    expect(data.shareEmail).toEqual([])
    expect(data.shareButtonDisabled).toBe(false)
    expect(typeof data.shareEmailRules.limit).toBe('function')
    expect(typeof data.shareEmailRules.required).toBe('function')
    expect(typeof data.shareEmailRules.email).toBe('function')
    expect(data.shareEmailRules.limit(new Array(11))).toBe('You have reached to max limit')
    expect(data.shareEmailRules.required([])).toBe('Required')
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    SinglePostShareDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('shareIncident does nothing when form validation fails', () => {
    const ctx = {
      $refs: { shareModal: { validate: jest.fn(() => false) } },
      sharedIncitedId: 'incident-1',
      shareEmail: ['a@b.com'],
      shareButtonDisabled: false,
      $store: { dispatch: jest.fn() },
      handleClose: jest.fn()
    }

    SinglePostShareDialog.methods.shareIncident.call(ctx)

    expect(shareAPost).not.toHaveBeenCalled()
    expect(ctx.shareButtonDisabled).toBe(false)
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
    expect(ctx.handleClose).not.toHaveBeenCalled()
  })

  it('shareIncident sends payload, closes dialog and dispatches reload on success', async () => {
    shareAPost.mockResolvedValueOnce({})
    const ctx = {
      $refs: { shareModal: { validate: jest.fn(() => true) } },
      sharedIncitedId: 'incident-2',
      shareEmail: ['x@y.com', 'z@y.com'],
      shareButtonDisabled: false,
      $store: { dispatch: jest.fn() },
      handleClose: jest.fn()
    }

    SinglePostShareDialog.methods.shareIncident.call(ctx)
    await flushPromises()

    expect(shareAPost).toHaveBeenCalledWith('incident-2', {
      emailArray: ['x@y.com', 'z@y.com']
    })
    expect(ctx.handleClose).toHaveBeenCalledTimes(1)
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'rightColumn/changeReloadRightColumnData',
      true
    )
    expect(ctx.shareButtonDisabled).toBe(false)
  })

  it('shareIncident resets button state on api failure', async () => {
    shareAPost.mockImplementationOnce(() => ({
      then: () => ({
        finally: (cb) => cb()
      })
    }))
    const ctx = {
      $refs: { shareModal: { validate: jest.fn(() => true) } },
      sharedIncitedId: 'incident-3',
      shareEmail: ['x@y.com'],
      shareButtonDisabled: false,
      $store: { dispatch: jest.fn() },
      handleClose: jest.fn()
    }

    SinglePostShareDialog.methods.shareIncident.call(ctx)
    await flushPromises()

    expect(shareAPost).toHaveBeenCalledWith('incident-3', {
      emailArray: ['x@y.com']
    })
    expect(ctx.handleClose).not.toHaveBeenCalled()
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
    expect(ctx.shareButtonDisabled).toBe(false)
  })
})
