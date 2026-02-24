import { shallowMount } from '@vue/test-utils'
import Post from '@/components/ThreatSharing/RightColumn/Post.vue'

describe('Post.vue', () => {
  const defaultPost = {
    postTitle: 'My Post',
    title: 'My Post',
    communityName: 'Tech Community',
    likeCount: 5,
    commentCount: 3
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(Post, {
      propsData: {
        index: 0,
        post: { ...defaultPost },
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays post title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('My Post')
  })

  it('displays community name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Tech Community')
  })

  it('displays like and comment counts', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('3')
  })

  it('uses post.title when postTitle not present', () => {
    const wrapper = createWrapper({
      post: { ...defaultPost, postTitle: null, title: 'Fallback Title' }
    })
    expect(wrapper.text()).toContain('Fallback Title')
  })

  it('onClickPostDetails emits goToPostDetails', () => {
    const wrapper = createWrapper()
    wrapper.vm.onClickPostDetails()
    expect(wrapper.emitted('goToPostDetails')).toBeTruthy()
  })

  it('onClickCommunityDetails emits goToCommunityDetails', () => {
    const wrapper = createWrapper()
    wrapper.vm.onClickCommunityDetails()
    expect(wrapper.emitted('goToCommunityDetails')).toBeTruthy()
  })
})
