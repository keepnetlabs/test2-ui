import { shallowMount } from '@vue/test-utils'
import PreviewHeader from '@/components/ThreatSharing/PreviewHeader.vue'

describe('PreviewHeader.vue', () => {
  const defaultUploadRespond = {
    subject: 'Test Subject',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    sentTime: '2024-01-15 10:00'
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(PreviewHeader, {
      propsData: {
        uploadRespond: { ...defaultUploadRespond },
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays subject when present', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test Subject')
  })

  it('displays from when present', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('sender@example.com')
  })

  it('displays to when present', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('recipient@example.com')
  })

  it('displays sentTime', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('2024-01-15 10:00')
  })

  it('hides subject when empty', () => {
    const wrapper = createWrapper({
      uploadRespond: { ...defaultUploadRespond, subject: '' }
    })
    expect(wrapper.text()).not.toContain('Subject:')
  })

  it('hides from when empty', () => {
    const wrapper = createWrapper({
      uploadRespond: { ...defaultUploadRespond, from: '' }
    })
    expect(wrapper.text()).not.toContain('From:')
  })
})
