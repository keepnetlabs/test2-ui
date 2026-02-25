import SinglePost from '@/components/ThreatSharing/SinglePost/SinglePost.vue'

describe('SinglePost.vue', () => {
  it('canEdit returns true when isPostedByMe', () => {
    const post = { myMembershipStatusId: null, isPostedByMe: true }
    expect(SinglePost.methods.canEdit.call({}, post)).toBe(true)
  })

  it('canEdit returns false when not owner and not posted by me', () => {
    const post = { myMembershipStatusId: 2, isPostedByMe: false }
    expect(SinglePost.methods.canEdit.call({}, post)).toBe(false)
  })
})
