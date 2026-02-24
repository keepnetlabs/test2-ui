import { shallowMount } from '@vue/test-utils'
import PostIncidentPreviewPost from '@/components/ThreatSharing/PostIncident/PostIncidentPreviewPost.vue'

describe('PostIncidentPreviewPost.vue', () => {
  const defaultUploadRespond = {
    subject: 'Test Subject',
    Title: 'Test Title',
    from: 'sender@example.com',
    PostedUserFullName: 'John Doe',
    PostedUserCompanyName: 'Acme Corp',
    sentTime: '2024-01-15',
    Description: 'Test description',
    isFromFlagged: false,
    isSubjectFlagged: false,
    isToFlagged: false,
    isCcFlagged: false,
    isBccFlagged: false,
    urls: [],
    attachments: []
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(PostIncidentPreviewPost, {
      propsData: {
        uploadRespond: { ...defaultUploadRespond },
        currentCompany: 'Acme',
        currentCommunityName: 'Tech Community',
        isAnonym: false,
        ...propsData
      },
      stubs: {
        VClamp: true,
        PreviewHeaderForSinglePost: true,
        AttachmentsPreview: true
      }
    })

  beforeEach(() => {
    localStorage.setItem('userName', 'Test User')
    localStorage.setItem('companyName', 'Test Company')
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays post title when subject present', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test Title')
  })

  it('displays Post Title when subject absent', () => {
    const wrapper = createWrapper({
      uploadRespond: { ...defaultUploadRespond, subject: null, Title: null }
    })
    expect(wrapper.text()).toContain('Post Title')
  })

  it('findCategory returns Malicious for Ps0SSyl7rVNe', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.findCategory('Ps0SSyl7rVNe')).toBe('Malicious')
  })

  it('findCategory returns Non-Malicious for bEuAD1pdbRXF', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.findCategory('bEuAD1pdbRXF')).toBe('Non-Malicious')
  })

  it('findCategory returns Phishing for NGLCc9UCxJvw', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.findCategory('NGLCc9UCxJvw')).toBe('Phishing')
  })

  it('findCategory returns Spam for Gwt67E1ftYtr', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.findCategory('Gwt67E1ftYtr')).toBe('Spam')
  })

  it('findCategory returns empty for unknown id', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.findCategory('unknown')).toBe('')
  })

  it('getByValue returns PostedUserFullName when present', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getByValue()).toBe('John Doe')
  })

  it('getFromValue returns PostedUserCompanyName when present', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getFromValue()).toBe('Acme Corp')
  })

  it('maliciousCount sums flagged items', () => {
    const wrapper = createWrapper({
      uploadRespond: {
        ...defaultUploadRespond,
        isFromFlagged: true,
        isSubjectFlagged: true,
        urls: [{ isFlagged: true }],
        attachments: [{ isFlagged: true }]
      }
    })
    expect(wrapper.vm.maliciousCount).toBe(4)
  })
})
