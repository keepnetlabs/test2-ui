import { shallowMount } from '@vue/test-utils'
import PreviewHeaderForSinglePost from '@/components/ThreatSharing/PreviewHeaderForSinglePost.vue'

describe('PreviewHeaderForSinglePost.vue', () => {
  const defaultUploadRespond = {
    subject: 'Test Subject',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    sentTime: '2024-01-15 10:00',
    isSubjectHidden: false,
    isFromHidden: false,
    isToHidden: false,
    isSubjectFlagged: false,
    isFromFlagged: false,
    isToFlagged: false
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(PreviewHeaderForSinglePost, {
      propsData: {
        uploadRespond: { ...defaultUploadRespond },
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays subject when not hidden', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test Subject')
  })

  it('displays From: Hidden by Owner when isFromHidden', () => {
    const wrapper = createWrapper({
      uploadRespond: { ...defaultUploadRespond, isFromHidden: true }
    })
    expect(wrapper.text()).toContain('Hidden by Owner')
  })

  it('displays Subject: Hidden by Owner when isSubjectHidden', () => {
    const wrapper = createWrapper({
      uploadRespond: { ...defaultUploadRespond, isSubjectHidden: true }
    })
    expect(wrapper.text()).toContain('Hidden by Owner')
  })

  it('findDate uses headers when sentTime not present', () => {
    const wrapper = createWrapper({
      uploadRespond: {
        ...defaultUploadRespond,
        sentTime: null,
        headers: [{ key: 'Date', value: '2024-01-15' }]
      }
    })
    expect(wrapper.vm.findDate).toBe('2024-01-15')
  })

  it('findDate returns undefined when no headers', () => {
    const wrapper = createWrapper({
      uploadRespond: { ...defaultUploadRespond, sentTime: null, headers: [] }
    })
    expect(wrapper.vm.findDate).toBeUndefined()
  })
})
