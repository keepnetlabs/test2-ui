import { createLocalVue, mount } from '@vue/test-utils'
import { customVuetify as vuetify } from '../utils'
import NewTrainingContentByLanguage from '@/components/AwarenessEducator/NewTraining/NewTrainingContentByLanguage.vue'
describe('Training Content', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify
    })
    //checking is rendered
    expect(wrapper.exists()).toBe(true)
    //checking title
    expect(wrapper.text().includes('Language')).toBeTruthy()
    //checking file upload text
    expect(wrapper.text().includes('Upload File')).toBeTruthy()
    //checking file upload component
    expect(wrapper.find('.k-file-uploads__wrapper').exists()).toBe(true)
    //checking is file upload vue component
    expect(wrapper.findComponent({ name: 'KFileUpload' }).exists()).toBe(true)
  })
  it('Checking default value', async () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: [{ name: 'Scorm', size: 1000002 }]
      }
    })
    //checking file name
    expect(wrapper.find('.k-file-uploads__item-details--filename').text().includes('Scorm')).toBe(
      true
    )
    //checking file size
    expect(
      wrapper.find('.k-file-uploads__item-details--filesize').text().includes('976.56 KB')
    ).toBe(true)
  })

  it('renders with empty file previews', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: []
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'KFileUpload' }).exists()).toBe(true)
  })

  it('displays multiple file previews', () => {
    const filePreviews = [
      { name: 'File1.scorm', size: 1000002 },
      { name: 'File2.scorm', size: 2000000 }
    ]
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: { filePreviews }
    })
    const fileItems = wrapper.findAll('.k-file-uploads__item')
    expect(fileItems.length).toBeGreaterThanOrEqual(filePreviews.length)
  })

  it('has correct file upload wrapper structure', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify
    })
    const uploadWrapper = wrapper.find('.k-file-uploads__wrapper')
    expect(uploadWrapper.exists()).toBe(true)
    expect(uploadWrapper.classes()).toContain('k-file-uploads__wrapper')
  })

  it('correctly formats large file sizes', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: [{ name: 'LargeFile.scorm', size: 10485760 }] // 10 MB
      }
    })
    const fileSizeText = wrapper.find('.k-file-uploads__item-details--filesize').text()
    expect(fileSizeText).toBeTruthy()
    expect(fileSizeText.includes('MB') || fileSizeText.includes('KB')).toBe(true)
  })
})
